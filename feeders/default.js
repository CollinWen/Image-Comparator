
// This file adds shared utilities for ImageCompare objects

var ImageCompare = (function (IC) {

    IC.TaskFeeder = IC.TaskFeeder || {};

    IC.TaskFeeder.GetImageDbUrl = function () {

        var  db_config_elem = document.getElementById("database");
        IC.TaskFeeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
        IC.TaskFeeder.hostname = IC.TaskFeeder.db_config == "localhost" ?
            "http://localhost:5984/" :
            "http://ec2-34-201-70-163.compute-1.amazonaws.com:5984/";
        IC.TaskFeeder.imageDbName = "rop_images/";

        return IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName;
    };



    return IC;

}(ImageCompare || {}));
