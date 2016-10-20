



//
handleUrlFilter = function(urlSearchStr) {

    //alert(urlSearchStr);
    qs= new QueryString(urlSearchStr);
    var user = qs.value("username");
    if (user) {

        ImageCompare.username = user;

        $("#username").val(user);
        OnSetUser(user);
    }

    // if urlSearchStr is not empty, remove the dropdown (db and user options)
    if (urlSearchStr) {
        var elem;
        elem = document.getElementById("database");
        elem.style.display='none'; // or ... style.visibility="hidden"; vis takes the same space, but is not shown
        elem = document.getElementById("username");
        elem.style.display='none';

        // also remove the Status info about the db
        elem = document.getElementById("si_database");
        elem.style.display='none';
    }

}

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
