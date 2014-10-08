
var ImageCompare = (function (IC) {

    IC.Feeder = {};
    
    // consult results and image database to select two images to present to user
    IC.Feeder.SetImagePair = function() {
        
        // load two image from image db
        var img0 = document.getElementById("image0");

        img0.src = "http://127.0.0.1:5984/rop_images/3/retina1.jpg";
        img0.style.width = "700px";
        img0.style.height = "400px";
        
        var img1 = document.getElementById("image1");

        img1.src = "http://127.0.0.1:5984/rop_images/1/AMD-Retina.jpg"; 
        img1.style.width = "700px";
        img1.style.height = "400px";        
    };
    
    return IC;
    
}(ImageCompare || {}));