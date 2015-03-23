
$(document).ready(function() {

    ImageCompare.Feeder.SetImagePair();
    
});


// winVal is a number representing how much A is greater than B
// In a situation where the user can pick one or the other or neither
// winVal will be -1, 0, or 1. This can support other values for UIs 
// where the user can say "A five times more than B"
createICResult = function(winVal, img0, img1, comment) {

    // todo - this configuration should be external to this function
    var db_config_elem = document.getElementById("database");
    var db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
    var hostname = db_config === "localhost" ?
        "http:localhost:5984/" : 
        "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
    var imageDbName = "rop_images/";
    var resultsDbName = "image_compare_results/";
    
    var currentTime = new Date();
    var timeStr = currentTime.toString();
    var imgDbStr = hostname + imageDbName;
    
    var dataStr = "{\"user\":\"anon\",";
    dataStr += "\"date\":\"" + timeStr + "\",";
    dataStr += "\"image0\":\"" + imgDbStr + img0.toString() + "\",";
    dataStr += "\"image1\":\"" + imgDbStr + img1.toString() + "\",";
    dataStr += "\"winner\":\"" +  winVal.toString() + "\"";
    
    if (comment != ImageCompare.Feeder.defaultComment) {
        dataStr += ",";
        dataStr += "\"comment\":\"" + comment + "\"";
    }
    
    dataStr += "}";

    $.ajax({
        url : hostname + resultsDbName + generateUUID(),
        type : 'PUT',
        //dataType : "jsonp",
        data: dataStr,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
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
    
    var comment = $("#compare-comment").val();
    
    createICResult(1, img0, img1, comment);
};

OnImage1 = function() {

    var img0 = ImageCompare.Feeder.Image0;
    var img1 = ImageCompare.Feeder.Image1;
    
    var comment = $("#compare-comment").val();
    
    createICResult(-1, img0, img1, comment);
};

OnNotSure = function() {

    var img0 = ImageCompare.Feeder.Image0;
    var img1 = ImageCompare.Feeder.Image1;
    
    var comment = $("#compare-comment").val();
    
    createICResult(0, img0, img1, comment);
};

// private utility
