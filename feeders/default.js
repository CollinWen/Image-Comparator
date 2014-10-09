
var ImageCompare = (function (IC) {

    IC.Feeder = {}; // this requires Feeder to only be defined here 
    
    IC.Feeder.GetImageByIdx = function(idx) {
        $.ajax({
            url : 'http://127.0.0.1:5984/rop_images/_design/all_docs/_view/count_docs',
            type : 'GET',
            success : function(json) { 
                //console.log ("get succeeded: " + JSON.stringify(json)); 
                var result = jQuery.parseJSON( json );
                var count = result.rows[0].value;
                //console.log ("doc count : " + count);
                
                var idx0 = Math.floor(Math.random() * count);
                var idx1 = Math.floor(Math.random() * count);
                
            },
            error: function (response) {
                alert("get failed : " + JSON.stringify(response));
            }
        });
    };
    
    // consult results and image database to select two images to present to user
    IC.Feeder.SetImagePair = function() {
                
        $.ajax({// count the documents 
            url : 'http://127.0.0.1:5984/rop_images/_design/all_docs/_view/count_docs',
            type : 'GET',
            success : function(json) { // find random doc image in documents
                //console.log ("get succeeded: " + JSON.stringify(json)); 
                var result = jQuery.parseJSON( json );
                var count = result.rows[0].value;
                //console.log ("doc count : " + count);
                
                var idx0 = Math.floor(Math.random() * count) +1; // the docs are indexed starting at 1
                var img0 = document.getElementById("image0");
                img0.src = "http://127.0.0.1:5984/rop_images/" + idx0.toString() + "/image";
                img0.style.width = "550px";
                img0.style.height = "400px";
                
                var idx1 = Math.floor(Math.random() * count) +1;
                var img1 = document.getElementById("image1");
                img1.src = "http://127.0.0.1:5984/rop_images/" + idx1.toString() + "/image"; 
                img1.style.width = "550px";
                img1.style.height = "400px";
                
                IC.Feeder.Image0 = idx0;
                IC.Feeder.Image1 = idx1;
            },
            error: function (response) {
                alert("get failed : " + JSON.stringify(response));
            }
        });
        
   
    };
    
    return IC;
    
}(ImageCompare || {}));