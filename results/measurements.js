
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
      
      var resRows = results.rows;
      var taskResults = [];
      resRows.forEach(function(row) {taskResults.push(row.value);}); 
      
      // what's the icl for this task?
      var task2iclUrl = dbname + '_design/basic_views/_view/task2iclByTaskId?key=\"' + taskId + '\"';
      $.ajax({
        url : task2iclUrl,
        type : 'GET',
        success : function(json) {
           var results = jQuery.parseJSON( json );
           
           if (results.rows.length != 1) {
               // this is an assert(false)
               // each task should have one and only one icl.
               alert("task with zero or many icls - contact Jayashree");
           }

           var iclName = results.rows[0].value;
           // is there a icl_dup_list for that icl?
           var iclDupListUrl = dbname + '_design/basic_views/_view/icl_dup_lists?key=\"' + iclName + '\"';
           $.ajax({
            url : iclDupListUrl,
            type : 'GET',
            success : function(json) {
             var results = jQuery.parseJSON( json );
             if (results.rows.length == 0) {
               // icl does not have a dup list doc
               alert("icl, " + iclName + " is missing a dup list doc. Run \"ruby makeIclDupList " + iclName + "\"" );
             }
             // assert if more than one.
             
             // ok, whew, we have the data - 
             // taskResults for this task id is in a closure
             var duplist = results.rows[0].value.list;
             debugger;
            },
            error: function (response) {
              console.log("get failed : " + JSON.stringify(response));
            }
           });
        },
        error: function (response) {
          console.log("get failed : " + JSON.stringify(response));
        }
       });

      

    },
    error: function (response) {
      console.log("get failed : " + JSON.stringify(response));
    }
  });
}





