
$(document).ready(function() {

    ImageCompare.Feeder.SetImagePair();
    
});

// global namespace pollution: todo - refactor 

OnImage0 = function() {
// hack(?) - todo, use proper credential validation
    // $.ajax({
        // url: 'http://127.0.0.1:5984/image_compare_results/0003',
        // type: 'PUT',
        // dataType: 'jsonp', 
        // data: '{"user":"anon", "img0":"img0id", "value":1}', 
        // success: function() { alert('PUT completed'); }
    // });
    
     $.ajax({
        url : 'http://127.0.0.1:5984/image_compare_results/0001',
        type : 'GET',
        dataType : "jsonp",
        success : function(json) { 
            alert ("get succeeded: " + JSON.stringify(json)); 
        },
        error: function (response) {
            alert("get failed : " + JSON.stringify(response));
        }
    });
  
    // var couchURL = 'http://127.0.0.1:5984/';
    // var dbname = "image_compare_results/";
    // var couchDocId = "004";
    
    // var url= couchURL + dbname + couchDocId;
    $.ajax({
        url : 'http://127.0.0.1:5984/image_compare_results/0002',
        type : 'PUT',
        //dataType : "jsonp",
        data: '{"user":"bob" }',
        success : function(json) { 
            alert ("put succeeded: " + JSON.stringify(json)); 
        },
        error: function (response) {
            alert("put failed : " + JSON.stringify(response));
        }
    });
    // $.ajax({
        // type: "PUT",
        // url: url,
        // dataType: 'jsonp', 
        // data: '{"user":"anon", "img0":"img0id", "value":1}',
        // success: function (response) {
            // alert("put succeeded : " + response);
        // },
        // error: function (response) {
            // alert("put failed : " + response);
        // }
    // });
    
};

OnImage1 = function() {

    alert("ho");
};

// private utility
