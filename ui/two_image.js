
$(document).ready(function() {

    updateStatusInfo();

    var user = $("#username").val();
    ImageCompare.TaskFeeder.SetImagePair(user);

});

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

    // update tasks
    getTasks(selUser.value, updateStatInfoTasks);

};

// called on getTasks success, input are the rows from the view
// todo: should not be global
updateStatInfoTasks = function(json) {
    var result = jQuery.parseJSON( json );
    var tasks = result.rows;

    var elem = document.getElementById("si_tasks");
    elem.textContent = "You have " + tasks.length + " unfinished tasks.";

    // this is to be updated - hide it if there are no pending tasks
    var curTaskElem = document.getElementById("si_curtask");

    if (tasks.length > 0) {
        curTaskElem.hidden = false;

        var firstTask = tasks[0].value;
        var icl_id = firstTask.image_compare_list;

        var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
        var fullurl = dburl + "_design/basic_views/_view/image_compare_lists?key=\"" + icl_id + "\"";

        $.ajax({
            url : fullurl,
            type : 'GET',
            success : function (json) {
                console.log("get succeeded : " + JSON.stringify(json));
                var result = jQuery.parseJSON( json );

                var curIdx = firstTask.current_idx + 1; // because humans usually don't use zero based indexing
                curTaskElem.textContent = "You are on comparison " + curIdx + " of " + result.rows[0].value.count;

            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });
    }
    else {
        curTaskElem.hidden = true;
    }
};


var getTasks = function(username, successFn) {

    var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
    var fullurl = dburl + "_design/basic_views/_view/incomplete_tasks?key=\"" + username + "\"";

    $.ajax({
        url : fullurl,
        type : 'GET',
        success : successFn,
        error: function (response) {
            console.log("get failed : " + JSON.stringify(response));
        }
    });
}

// THIS IS A DB PUT
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
    dataStr += "\"type\":\"" + "imageCompareResult" + "\",";
    dataStr += "\"date\":\"" + timeStr + "\",";
    dataStr += "\"image0\":\"" + imgDbStr + img0.toString() + "\",";
    dataStr += "\"image1\":\"" + imgDbStr + img1.toString() + "\",";
    dataStr += "\"winner\":\"" +  winVal.toString() + "\",";

    if (comment != ImageCompare.TaskFeeder.defaultComment) {
        dataStr += ",";
        dataStr += "\"comment\":\"" + comment + "\",";
    }

    dataStr += "\"task\":\"" +  task._id + "\",";
    dataStr += "\"task_idx\":\"" +  task_idx + "\"";

    dataStr += "}";

    var def = $.ajax({
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

    return def;
};

// THIS IS A DB PUT
// increments the task's current idx and posts it back to the database
// user is used to set the next image pair
// todo - this should not be global
updateTask = function(task, user) {

    // first get the length of the icl for the task, (to see if the task is now complete)
    var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
    var fullurl = dburl + "_design/basic_views/_view/icl_lengths?key=\"" + task.image_compare_list + "\"";
    var icl_count = -1;


    var defered = $.ajax({
        url : fullurl,
        type : 'GET',
        success : function(json) {

            var result = jQuery.parseJSON( json );
            icl_count = result.rows[0].value;

            // now that that worked, update the task
            var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
            var fullurl = dburl + task._id;

            task.current_idx++;
            if (task.current_idx >= icl_count) {
                task.completed = true;
            }

            $.ajax({
                url : fullurl,
                type : 'PUT',
                data: JSON.stringify(task),
                contentType: "application/json",
                success : function(json) {
                    console.log ("put succeeded: " + JSON.stringify(json));
                    ImageCompare.TaskFeeder.SetImagePair(user);
                    updateStatusInfo(); // really this is redundant, but I need to return a deferred for this ajax call - how?
                },
                error: function (response) {
                    console.log("put failed : " + JSON.stringify(response));
                }
            });
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });

    return defered;
};

OnSetDB = function(sel) {
    console.log ("Database changed to: " + sel.value);
    updateStatusInfo();
    ImageCompare.TaskFeeder.SetImagePair(sel.value);
}

OnSetUser = function(sel) {

    console.log ("User changed to: " + sel.value);
    updateStatusInfo();
    ImageCompare.TaskFeeder.SetImagePair(sel.value);
}

// really a private helper
saveResultSetImages = function (winnerId) {
    var img0 = ImageCompare.TaskFeeder.Image0;
    var img1 = ImageCompare.TaskFeeder.Image1;
    var task_idx = ImageCompare.TaskFeeder.current_task_idx;
    var task = ImageCompare.TaskFeeder.current_task;

    var comment = $("#compare-comment").val();
    var user = $("#username").val();

    // these two are like a transaction - how to ensure both or neither?

    // not sure why the result is being created with winval of 1
    //var d1 = createICResult(1, img0, img1, user, comment, task, task_idx);

    var d1 = createICResult(winnerId, img0, img1, user, comment, task, task_idx);
    var d2 = updateTask(task, user);
    // update happens asynchronously, so this would be wrong:
    // ImageCompare.TaskFeeder.SetImagePair(user);
    // instead it has to happen inside the updateTask success
    // Todo: maybe better would be to pass it in.

    // same here - this needs to happen after the previous two
    $.when(d1, d2).then(updateStatusInfo());
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
