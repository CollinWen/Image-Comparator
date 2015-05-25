
// this file requires status.js 
// for getSelectedDbUrl


getInternalConsistencyMeasure = function(user, taskId) {

  var dbname = getSelectedDbUrl();

  // get the task results for this taskId
  var fullurl = dbname + '_design/basic_views/_view/taskresults?key=\"' + taskId + '\"';
  $.ajax({
    url : fullurl,
    type : 'GET',
    success : function(json) {
      //console.log(json);
      var results = jQuery.parseJSON( json );

      var sortedRes = sortResults(results.rows);
      //console.log(sortedRes);

    },
    error: function (response) {
      console.log("get failed : " + JSON.stringify(response));
    }
  });
}

