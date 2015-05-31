

dupInfoColumns = {
    user    :  0,
    icl     :  1,
    numRes  :  2,
    numDups :  3,
    numSame :  4,
    numDiff :  5
};


populateDuplicateTableInfo = function() {

    //var msg = Users.join(", ");
    // alert(msg);
    
    var tableBody = document.getElementById("dupInfoTableBody");
    tableBody.innerHTML = "";
    
    var users = Users;
    var tasks = [];
    getTasks(null, buildTable);
    
}

// populates users and tasks
buildTable = function(json) {

    var tableElem = document.getElementById("dupInfoTableBody");

    var result = jQuery.parseJSON( json );
    var taskRows = result.rows;
    var tasks = [];
    taskRows.forEach(function(tr) { tasks.push(tr.value); });
    
    tasks.forEach(function(task) {
        var newRow   = tableElem.insertRow(tableElem.rows.length);
        var userCell = newRow.insertCell(dupInfoColumns.user);
        var iclCell  = newRow.insertCell(dupInfoColumns.icl);
        
        var newText  = document.createTextNode(task.image_compare_list);
        iclCell.appendChild(newText);

        newText  = document.createTextNode(task.user);
        userCell.appendChild(newText);        
    
        // now get results for this task and calc #dups and #dups agree 
        getResults(task._id, addDupInfoToTableRow, newRow);
    });
    

}

// cell in closure variable called extra2
addDupInfoToTableRow = function(json, tableRow) {
    
    var result = jQuery.parseJSON( json );
    var resultRows = result.rows;
    var results = [];
    resultRows.forEach(function(row) { results.push(row.value); });
    
    var cell = tableRow.insertCell(dupInfoColumns.numRes);
    var newTxt  = document.createTextNode(results.length.toString());
    cell.appendChild(newTxt);

    // pour through results looking for duplicates
    var noDupList = [];
    var numDups = 0;
    var numSame = 0;
    var numDiff = 0; // == numDups - numSame
    
    results.forEach(function (res) {    
    
        var found = false;
        noDupList.forEach(function(nodup) {
            
            if ((nodup.image0 === res.image0 && nodup.image1 === res.image1) ||
                (nodup.image0 === res.image1 && nodup.image1 === res.image0)) {

                found = true;
                numDups++;                
                
                var resWinner = (res.winner === "1") ? res.image0 : res.image1;
                var nodupWinner = (nodup.winner === "1") ? nodup.image0 : nodup.image1;
                
                (resWinner === nodupWinner) ? numSame++ : numDiff++; 
            }
        });
        
        if (!found) {
            noDupList.push(res);
        }
    });
    
    cell = tableRow.insertCell(dupInfoColumns.numDups);
    newTxt  = document.createTextNode(numDups.toString());
    cell.appendChild(newTxt);
  
    cell = tableRow.insertCell(dupInfoColumns.numSame);
    newTxt  = document.createTextNode(numSame.toString());
    cell.appendChild(newTxt);  
    
    cell = tableRow.insertCell(dupInfoColumns.numDiff);
    newTxt  = document.createTextNode(numDiff.toString());
    cell.appendChild(newTxt); 
};




