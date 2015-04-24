$(document).ready(function(){
  displayStatus();
});


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
    if (res.winner === "-1")
       numTimesWon[res.image0]++;

    if (res.winner === "1")
        numTimesWon[res.image1]++;
  }

  var images = Object.keys(numTimesShown);
  var sortedImages = images.sort(function(a, b) {
    return numTimesWon[a]/numTimesShown[a] < numTimesWon[b]/numTimesShown[b];
  });

  return sortedImages;

};

// add a bunch of images
displayResults=function(resArray){


  resArray.forEach(function(res){
    var img = new Image();
    var div = document.getElementById('image-container');

    img.onload = function() {
      div.appendChild(img);
    };

    img.src = res + "/image";
  });
}


displayStatus=function(){

  var hostname="http://localhost:5984/";
  var imageDbName = "rop_images/";
  var resultsDbName = "image_compare_results/";

  var fullurl = hostname + resultsDbName + '_design/basic_views/_view/taskresults';
  $.ajax({
    url : fullurl,
    type : 'GET',
    success : function(json) {
      console.log(json);
      var results = jQuery.parseJSON( json );

      var mikeResults = results.rows.filter(function(result){
        return result.value.user === 'paul'; });

      var mikeSortedRes = sortResults(mikeResults);

      displayResults(mikeSortedRes);

      var rc=document.getElementById("rowCt");
      rc.textContent=results.total_rows;
    },
    error: function (response) {
      console.log("get failed : " + JSON.stringify(response));
    }
  });
}
