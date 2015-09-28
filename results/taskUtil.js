//type is currently "compare" or "classify"

var getTasksByType = function(type, username, successFn) {

  var dburl = "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/rop_images/";


  //  var dburl = getSelectedDbUrl();
  var taskViewUrl = dburl + "_design/basic_views/_view/";
  taskViewUrl=taskViewUrl+(type==="compare"?"compare_tasks":"classify_tasks");
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
