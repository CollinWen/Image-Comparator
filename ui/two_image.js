
$(document).ready(function() {

    var user = $("#username").val();
    ImageCompare.TaskFeeder.SetImagePair(user);
    
});


// winVal is a number representing how much A is greater than B
// In a situation where the user can pick one or the other or neither
// winVal will be -1, 0, or 1. This can support other values for UIs 
// where the user can say "A five times more than B"
// todo - this should not be global
createICResult = function(winVal, img0, img1, user, comment, task, task_idx) {

    // todo - this configuration should be external to this function
    var db_config_elem = document.getElementById("database");
    var db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
    var hostname = db_config === "localhost" ?
        "http://localhost:5984/" : 
        "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
    var imageDbName = "rop_images/";
    var resultsDbName = "image_compare_results/";
    
    var currentTime = new Date();
    var timeStr = currentTime.toString();
    var imgDbStr = hostname + imageDbName;
    
    var dataStr = "{\"user\":\"" + user + "\",";
    dataStr += "\"date\":\"" + timeStr + "\",";
    dataStr += "\"image0\":\"" + imgDbStr + img0.toString() + "\",";
    dataStr += "\"image1\":\"" + imgDbStr + img1.toString() + "\",";
    dataStr += "\"winner\":\"" +  winVal.toString() + "\",";
    
    if (comment != ImageCompare.TaskFeeder.defaultComment) {
        dataStr += ",";
        dataStr += "\"comment\":\"" + comment + "\",";
    }
    
    dataStr += "\"task\":\"" +  task + "\",";
    dataStr += "\"task_idx\":\"" +  task_idx + "\"";
    
    dataStr += "}";

    $.ajax({
        url : hostname + resultsDbName + generateUUID(),
        type : 'PUT',
        //dataType : "jsonp",
        data: dataStr,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
    
};

// increments the task's current idx and posts it back to the database
// user is used to set the next image pair 
// todo - this should not be global
updateTask = function(task, user) {

    // todo - this configuration should be external to this function
    var db_config_elem = document.getElementById("database");
    var db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
    var hostname = db_config === "localhost" ?
        "http://localhost:5984/" : 
        "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
    var imageDbName = "rop_images/";    
            
    task.current_idx++;
    var json_data = JSON.stringify(task);
    
    $.ajax({
        url : hostname + imageDbName + task._id,
        type : 'PUT',
        data: json_data,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
            ImageCompare.TaskFeeder.SetImagePair(user);
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
};


OnSetUser = function(sel) {

    console.log ("User changed to: " + sel.value);
    ImageCompare.TaskFeeder.SetImagePair(sel.value);
}

saveResultSetImages = function (winnerId) {
    var img0 = ImageCompare.TaskFeeder.Image0;
    var img1 = ImageCompare.TaskFeeder.Image1;
    var task = ImageCompare.TaskFeeder.current_task; 
    var task_idx = ImageCompare.TaskFeeder.current_task_idx;
    var task = ImageCompare.TaskFeeder.current_task;
    
    var comment = $("#compare-comment").val();
    var user = $("#username").val();
    
    createICResult(1, img0, img1, user, comment, task, task_idx);
    updateTask(task, user);
    // update happens asynchronously, so this would be wrong:
    // ImageCompare.TaskFeeder.SetImagePair(user);
    // instead it has to happen inside the updateTask success
    // Todo: maybe better would be to pass it in.
}

OnImage0 = function() {

    saveResultSetImages(1);
};

OnImage1 = function() {

    saveResultSetImages(-1);
};

OnNotSure = function() {

    saveResultSetImages(0);
};

// private utility
