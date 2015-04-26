
var ImageCompare = (function (IC) {

    IC.Feeder = {}; // this requires Feeder to only be defined here

    IC.Feeder.defaultComment = "<insert comment>";
    var  db_config_elem = document.getElementById("database");
    IC.Feeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
    IC.Feeder.hostname = IC.Feeder.db_config == "localhost" ?
        "http://localhost:5984/" :
        "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";
    IC.Feeder.imageDbName = "rop_images/";
    IC.Feeder.resultsDbName = "rop_images/";



    // consult results and image database to select two images to present to user
    IC.Feeder.SetImagePair = function() {

        $("#compare-comment").val(this.defaultComment);

        // update the dbconfig - guess this should be a function
        var  db_config_elem = document.getElementById("database");
        IC.Feeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
        IC.Feeder.hostname = IC.Feeder.db_config == "localhost" ?
            "http://localhost:5984/" :
            "http://ec2-54-152-40-100.compute-1.amazonaws.com:5984/";

        $.ajax({// count the documents
            url : IC.Feeder.hostname + IC.Feeder.imageDbName + '_design/basic_views/_view/count_image_docs',
            type : 'GET',
            success : function(json) { // find random doc image in documents
                //console.log ("get succeeded: " + JSON.stringify(json));
                var result = jQuery.parseJSON( json );
                var count = result.rows[0].value;

                if (count === undefined || count < 3)
                {
                    alert("Found " + count.toString() + " docs in database. Aborting.");
                    return;
                }

                //console.log ("doc count : " + count);

                var idx0 = Math.floor(Math.random() * count) +1; // the docs are indexed starting at 1
                var img0 = document.getElementById("image0");
                img0.src = IC.Feeder.hostname + IC.Feeder.imageDbName + idx0.toString() + "/image";
                //img0.style.width = "550px";
                //img0.style.height = "400px";

                var idx1 = Math.floor(Math.random() * count) +1;

				while (idx1==idx0) {
					idx1 = Math.floor(Math.random() * count) +1;
				}
                var img1 = document.getElementById("image1");
                img1.src = IC.Feeder.hostname + IC.Feeder.imageDbName + idx1.toString() + "/image";
                //img1.style.width = "550px";
                //img1.style.height = "400px";

                IC.Feeder.Image0 = idx0;
                IC.Feeder.Image1 = idx1;
            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });


    };

    return IC;

}(ImageCompare || {}));
