


var getCompareTasks = function(username, successFn) {

  var dburl = "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/rop_images/";

//  var dburl = getSelectedDbUrl();
  var taskViewUrl = dburl + "_design/basic_views/_view/compare_tasks";
  var fullurl = taskViewUrl;
  if (username != null) {
    var keyStr = username ? "?key=\"" + username + "\"" : "";
    fullurl = taskViewUrl + keyStr;
  }


  $.ajax({
    url: fullurl,
    type: 'GET',
    success: successFn,
    error: function(response) {
      console.log("get failed : " + JSON.stringify(response));
    }
  });
}
