
$(document).ready(function() {

    ImageCompare.Feeder.SetImagePair();
    
});

// global namespace pollution: todo - refactor 
var ct=1089;


// winVal is a number representing how much A is greater than B
// In a situation where the user can pick one or the other or neither
// winVal will be -1, 0, or 1. This can support other values for UIs 
// where the user can say "A five times more than B"
createICResult = function(winVal, img0, img1) {
    // todo get uuid
    // $.ajax({
        // url : 'http://127.0.0.1:5984/image_compare_results/0001',
        // type : 'GET',
        // success : function(json) { 
            // console.log ("get succeeded: " + JSON.stringify(json)); 
        // },
        // error: function (response) {
            // console.log("get failed : " + JSON.stringify(response));
        // }
    // });
  
    // var couchURL = 'http://127.0.0.1:5984/';
    // var dbname = "image_compare_results/";
    // var couchDocId = "004";    
    // var url= couchURL + dbname + couchDocId;
    
    var currentTime = new Date();
    var timeStr = currentTime.toString();
    var imgDbStr = "http://127.0.0.1:5984/rop_images/";
    
    var dataStr = "{\"user\":\"anon\",";
    dataStr += "\"date\":\"" + timeStr + "\",";
    dataStr += "\"image0\":\"" + imgDbStr + img0.toString() + "\",";
    dataStr += "\"image1\":\"" + imgDbStr + img1.toString() + "\",";
    dataStr += "\"winner\":\"" +  winVal.toString();
    dataStr += "\"}";

    $.ajax({
        url : 'http://127.0.0.1:5984/image_compare_results/'+ct,
        type : 'PUT',
        //dataType : "jsonp",
        data: dataStr,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
            ct++;
            ImageCompare.Feeder.SetImagePair();
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
    
};

OnImage0 = function() {

    var img0 = ImageCompare.Feeder.Image0;
    var img1 = ImageCompare.Feeder.Image1;
    
    createICResult(1, img0, img1);
};

OnImage1 = function() {

    var img0 = ImageCompare.Feeder.Image0;
    var img1 = ImageCompare.Feeder.Image1;
    createICResult(-1, img0, img1);
};

// private utility
