

$(document).ready(function() {
    document.getElementById('openimage').addEventListener('change', handleFileSelect, false);
});

handleFileSelect = function (evt) {

    var files = evt.target.files; // FileList object
    var file = files[0];
        
    for (var i = 0 ; i < files.length; ++i) {
        var fileReadAsDataUrl = new FileReader();
        fileReadAsDataUrl.onload = (function(progEvt) {

            var imageAsDataUrl = progEvt.target.result;
            
            var img = new Image();            
            img.src = progEvt.target.result;

            document.getElementById('imgdisp').src = img.src;
            
            addImageToImageDb(img);
        });
        fileReadAsDataUrl.readAsDataURL(files[i]);   
    }    
};

// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

var dburl =  'http://127.0.0.1:5984/rop_images_1/';


addAttachment = function(imgRes, img) {
   
   var urlstr = dburl + imgRes.id + "?rev=" + imgRes.rev + " --data-binary " + img.src;
   
   $.ajax({
        url : urlstr,
        type : 'PUT',
        data: "",
        success : function(json) { 
            console.log("add attachment succeeded" + JSON.stringify(json));
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
};

addImageToImageDb = function(img) {

    var dataStr = "{\"origin\":" + "\"configurator\"}";

    $.ajax({
        url : dburl+generateUUID(),
        type : 'PUT',
        data: dataStr,
        success : function(json) { 
            
            // since that worked, add the attachment 
            console.log ("put succeeded: " + JSON.stringify(json));
            var res = JSON.parse(json);
            
            addAttachment(res, img);
    
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
};

onCreateImageDb = function() {

    $.ajax({
        url : dburl,
        type : 'PUT',
        //data: dataStr,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
    
    // add design doc that loads basic views
    var des_json = 
       " {\"_id\":\"_design/basic_views\", " +
       "  \"views\": {" +
       "     \"all_docs\" :  {" +
       "            \"map\" : \"function(doc) {" +
       "               emit(null, doc);" +
       "            }\" "+
       "        }," +
       "        \"count_docs\" : {                                   " +
       "            \"map\" : \"function(doc) {                      " +
       "                emit(null, doc);                             " +
       "            }\",                                                " +
       "            \"reduce\" : \"_count(keys, vals, rereduce)\"    " +
       "        }                                                    " +
       "    }" +
       "}";
 
    var des_url = dburl + "_design/basic_views";
    $.ajax({
        url : des_url,
        type : 'PUT',
        data: des_json,
        success : function(json) { 
            console.log ("put succeeded: " + JSON.stringify(json)); 
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });
};

onLoadImages = function() {

    document.getElementById('openimage').click();
};

