$(document).ready(function(){

    updateStatusInfo();
    var user = $("#username").val();
    displayStatus("mike","icl_1_4_rev4");
});


// TODO - remove duplication! I'm talking to YOU!

// labels can be either primary or danger
// just for controlling the color through bootstrap
setLabelDanger = function(isDanger, label) {

    if (isDanger) {
        label.removeClass("label-primary");
        label.addClass("label-danger");
    } else {
        label.removeClass("label-danger");
        label.addClass("label-primary");
    }
};

updateStatusInfo = function() {

    // update user
    var elem = document.getElementById("si_user");
    var user_elem = document.getElementById("username");
    var selUser = user_elem.options[ user_elem.selectedIndex ];
    elem.textContent = selUser.text;
    var label = $("#si_user_label");
    var isDanger = (selUser.value === "testuser");
    setLabelDanger(isDanger, label);

    // update database
    var elem = document.getElementById("si_db");
    var db_elem = document.getElementById("database");
    var seldb = db_elem.options[ db_elem.selectedIndex ];
    elem.textContent = seldb.text;
    var label = $("#si_db_label");
    var isDanger = (seldb.value === "localhost");
    setLabelDanger(isDanger, label);


};

OnSetDB = function(sel) {
    console.log ("Database changed to: " + sel.value);
    updateStatusInfo();
}

OnSetUser = function(sel) {

    console.log ("User changed to: " + sel.value);
    updateStatusInfo();
}


sortResults = function(resultArray) {

  // first build hash, one entry per image, counting #times shown
  var numTimesShown = {};
  for (var ires = 0 ; ires < resultArray.length; ++ires) {
    var res = resultArray[ires].value;

    if (!numTimesShown[res.image0])
    numTimesShown[res.image0] = 0;

    if (!numTimesShown[res.image1])
    numTimesShown[res.image1] = 0;

    numTimesShown[res.image0]++;
    numTimesShown[res.image1]++;
  }

  // next build hash, one entry per image, counting #times winner
  var numTimesWon = {};
  for (var ires = 0 ; ires < resultArray.length; ++ires) {
    var res = resultArray[ires].value;

    if (!numTimesWon[res.image0])
    numTimesWon[res.image0] = 0;

    if (!numTimesWon[res.image1])
    numTimesWon[res.image1] = 0;

    //if (res.winner === "0")
    if (res.winner === "1")
    numTimesWon[res.image0]++;

    if (res.winner === "-1")
    numTimesWon[res.image1]++;
  }

  var images = Object.keys(numTimesShown);
  console.log(images);
  var sortedImages = images.sort(winSort);
  console.log(sortedImages);

  function winSort(a, b) {
    var winRateA=numTimesWon[a]/numTimesShown[a];
    var winRateB=numTimesWon[b]/numTimesShown[b];

    if (winRateA===winRateB){
      console.log(a,b);
      var aRes = resultArray.filter(function(result){
        return result.value.image0 === a && result.value.image1===b; });
        var bRes = resultArray.filter(function(result){
          return result.value.image0 === b && result.value.image1===a; });
          console.log(aRes);
          console.log(bRes);

          var tieRes = resultArray.filter(function(result){
            return  ((result.value.image0 === a && result.value.image1===b) ||
                    (result.value.image0 === b && result.value.image1===a));
            });

            var aWins = 0;
            var bWins = 0;

            tieRes.forEach(function(res) {
              if (res.value.winner ===1) {
                if (result.value.image0 === a) {
                  aWins++;
                } else {
                  bWins++;
                }
              }
              if (res.value.winner === -1 ) {
                if (res.value.image0 === a) {
                  bWins++;
                } else {
                  aWins++;
                }

              }
            });

            return  (aWins < bWins) ? 1 : -1;
          }


          return (winRateA < winRateB) ? 1:-1;

          //  if (winRateA===winRateB)
          //  console.log(a)

        };

        //  return numTimesWon[a]/numTimesShown[a] < numTimesWon[b]/numTimesShown[b];

        return sortedImages;

      };

// add a bunch of images
displayResults=function(resArray){

  console.log(resArray);
  resArray.forEach(function(res){
    var img = new Image();
    var div = document.getElementById('image-container');

    img.onload = function() {
    //  div.appendChild(img);
    };

    img.src = res + "/image";
    img.className="thumbnail";

    img.onclick=onclickthumbnail;
//    img.onclick=(function(){
  //    return onclickthumbnail;
  //  })();
    div.appendChild(img);
  });
}

onclickthumbnail=function(){
  var elem=document.getElementById("full-size-image");
  elem.src=this.currentSrc;
}

displayStatus=function(user, taskId){

  //var hostname="http://localhost:5984/";
  var hostname="http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
  var imageDbName = "rop_images/";

  var resultsDbName = "rop_images/";

  var fullurl = hostname + imageDbName + '_design/basic_views/_view/taskresults';
  $.ajax({
    url : fullurl,
    type : 'GET',
    success : function(json) {
      //console.log(json);
      var results = jQuery.parseJSON( json );

      var userResults = results.rows.filter(function(result){
        return (result.value.user === user); });
        console.log("num records user " + userResults.length);


      var userSortedRes = sortResults(userResults);
      console.log(userSortedRes);

      displayResults(userSortedRes);

      var rc=document.getElementById("rowCt");
      rc.textContent=results.total_rows;
    },
    error: function (response) {
      console.log("get failed : " + JSON.stringify(response));
    }
  });
}
