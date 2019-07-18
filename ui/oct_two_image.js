var position = $("#image").scrollTop();

function getNextImage(elementId, direction) {
  var src = $("#image").attr("src");

  var split = src.split("/");
  var imageName = split[split.length - 1];

  var path = src.substring(0,src.indexOf(imageName));
  split = imageName.split(".");
  var imageNum = parseInt(split[0], 10);

  console.log(imageNum)

function getNumImages(elementId) {

}

  //fs.existsSync(path + (imageNum - 1) + ".png")

  if(direction == "down") {
    console.log(path + (imageNum - 1) + ".png");
    return path + (imageNum - 1) + ".png";
  } else if (direction == "up") {
    console.log(path + (imageNum + 1) + ".png");
    return path + (imageNum + 1) + ".png";
  } else {
    return src;
  }
}

// $(window).bind('scroll', function() {
//   console.log("scrolled");
//
//   var scroll = $("#image").scrollTop();
//   var im = "";
//
//   if(scroll > position) { // scroll down
//     var im = getNextImage("image", "down");
//   } else { // scroll up
//     var im = getNextImage("image", "up");
//     $('#image').attr("src",im);
//   }
//   $("#image").attr("src",im);
// });

document.addEventListener("keypress", function(e) {
  var key = e.which || e.keyCode;

  console.log("key pressed")

  if(key === 115) { // scroll down

    console.log("scrolling down");

    var im = getNextImage("image", "down");
    $("#image").attr("src",im);
  } else if (key === 119) { // scroll up

    console.log("scrolling up");

    var im = getNextImage("image", "up");
    $('#image').attr("src",im);
  }
}, true);
