
var ImageCompare = (function (IC) {

    IC.Feeder = {};
    
    // consult results and image database to select two images to present to user
    IC.Feeder.SetImagePair = function() {
        
        // load two image from image db
        var img0 = document.getElementById("image0");

        img0.src = "../images/normal_retina.jpg";
         img0.style.width = "700px";
        img0.style.height = "400px";
        
        var img1 = document.getElementById("image1");

        img1.src = "../images/retina1.jpg";    
        img1.style.width = "700px";
        img1.style.height = "400px";        
    };
    
    return IC;
    
}(ImageCompare || {}));