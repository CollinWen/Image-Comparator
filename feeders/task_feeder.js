
var ImageCompare = (function (IC) {

    IC.TaskFeeder = {}; // this requires TaskFeeder to only be defined here 
    
    IC.TaskFeeder.defaultComment = "<insert comment>";
    var  db_config_elem = document.getElementById("database");
    IC.TaskFeeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
    IC.TaskFeeder.hostname = IC.TaskFeeder.db_config == "localhost" ?
        "http://localhost:5984/" : 
        "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
    IC.TaskFeeder.imageDbName = "rop_images/";
    IC.TaskFeeder.resultsDbName = "image_compare_results/";
    
    // some of this is probably not needed
    IC.TaskFeeder.current_task = "";
    IC.TaskFeeder.current_task_idx = -1; 
    IC.TaskFeeder.current_icl = ""; // image_compare_list
    
    
    // consult results and image database to select two images to present to user
    IC.TaskFeeder.SetImagePair = function(username) {
        
        $("#compare-comment").val(this.defaultComment);
        
        // update the dbconfig - guess this should be a function
        var  db_config_elem = document.getElementById("database");
        IC.TaskFeeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
        IC.TaskFeeder.hostname = IC.TaskFeeder.db_config == "localhost" ?
            "http://localhost:5984/" : 
            "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
        
        $.ajax({  
            url : IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + '_design/basic_views/_view/tasks',
            type : 'GET',
            success : function(json) { 
                            
                var result = jQuery.parseJSON( json );
                var curUser = username;
                
                // of all pending tasks, are any assigned to this user?
                var newResRows = result.rows.filter(function(obj) {
                    return obj.value.user === username;
                });                
                
                if (newResRows.length < 1)
                    return; // hmmm - some sort of message that there are no pending tasks?

                var task = newResRows[0].value;                
                var curICL = task.image_compare_list;
                var curTaskIdx = task.current_idx;
                
                // now get the next pair of image ids
                $.ajax({
                    url : IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + '_design/basic_views/_view/image_compare_lists',
                    type : 'GET',
                    success: function (json) {
                        // okay, this seems wrong, we got all the tasks - way too much data over the wire
                        // filtering should happen on the server side - is this what reduce is for?
                        
                        var nextpair;
                        var result = jQuery.parseJSON( json );
                        var found = false;
                        for (var ires = 0 ; ires < result.rows.length && !found; ++ires) {
                        
                            var res = result.rows[ires];
                            if (res.id === curICL) {
                                found = true;                                
                                nextpair = res.value.list[curTaskIdx];
                            }
                        }
                        var idx0 = nextpair[0];
                        var img0 = document.getElementById("image0");
                        img0.src = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx0.toString() + "/image";
                        
                        var idx1 = nextpair[1];
                        var img1 = document.getElementById("image1");

                        img1.src = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx1.toString() + "/image"; 
                        
                        IC.TaskFeeder.Image0 = idx0;
                        IC.TaskFeeder.Image1 = idx1;
                        
                        // should this be done sooner, before the second ajax call?
                        IC.TaskFeeder.current_icl = curICL; 
                        IC.TaskFeeder.current_task_idx = curTaskIdx; 
                        IC.TaskFeeder.current_task = task;
                    },
                    error: function (response) {
                        console.log("get of tasks failed : " + JSON.stringify(response));
                    }
                });
                    
            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });
        
   
    };
    
    return IC;
    
}(ImageCompare || {}));
