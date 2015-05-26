
// this file requires status.js 
// for getSelectedDbUrl


// for the icl associated with this task
// get all image ids 
// put a rect at each position where a comparison was requested
// maybe a darker color for repeats (overlapping opacity effect?)
// somehow mark the ones that were actually compared by this user

standardAjaxError = function(response) {
    console.log("get failed : " + JSON.stringify(response));
},

// since tasks are per user, really only need taskId
chartIclDistribution = function(user, taskId, sucFn) {

  var dbname = getSelectedDbUrl();

  // get the task results for this taskId
  var fullurl = dbname + '_design/basic_views/_view/taskresults?key=\"' + taskId + '\"';
  $.ajax({
    url : fullurl,
    type : 'GET',
    success : sucFn,
    error: standardAjaxError
  });
  
  var fullurl = dbname + '_design/basic_views/_view/task2iclByTaskId?key=\"' + taskId + '\"';
  $.ajax({
    url : fullurl,
    type : 'GET',
    success : function(json) {
        var results = jQuery.parseJSON( json );
        if (results.rows.length != 1) {
            alert("zero or multiple icls for this task. Contact Jayashree");
        }
        var iclName = results.rows[0].value;
        
        var fullurl = dbname + '_design/basic_views/_view/image_compare_lists?key=\"' + iclName + '\"';
        $.ajax({
            url : fullurl,
            type : 'GET',
            success : function (json) {
                var results = jQuery.parseJSON( json );
                if (results.rows.length != 1) {
                    alert("zero or multiple icls for this iclName. Contact Jayashree");
                }
                
                var cmpList = results.rows[0].value.list;
                var ci = setUpChart(".iclDistChart",  cmpList);
                
                var domain = ci.xscale.domain();
                var rangeOfDomain = domain[1] - domain[0];
                
                var squares = ci.chart.selectAll(".dots")
                  .data(cmpList)
                .enter().append("rect")
                  .attr("class", "dots")
                  .attr("x", function(d) { 
                      return ci.xscale(d[0]);
                      })
                  .attr("y", function(d) { 
                      return ci.yscale(d[1]);
                      })
                  .attr("width", 400/(rangeOfDomain+1)) // 400 should be width from setUpChart
                  .attr("height", 400/(rangeOfDomain+1))
                  .attr("fill", "steelblue")
                  .attr("opacity", .5);
            },
            error: standardAjaxError
        });
    },
    error: standardAjaxError

  });

}

chartTaskRes = function(jsonTaskRes) {
    //console.log(json);
    var results = jQuery.parseJSON( json );

    var resRows = results.rows;
    var taskResults = [];
    resRows.forEach(function(row) {taskResults.push(row.value);}); 

}

setUpChart = function(chartname, data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 500 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    
    var chart = d3.select(chartname)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var x = d3.scale.linear()
        .domain([d3.min(data, function(d) { return d[0]; }), d3.max(data, function(d) { return d[0]; })])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([d3.min(data, function(d) { return d[1]; }), d3.max(data, function(d) { return d[1]; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize([6]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);
    
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate(0, 30)")
      .attr("x", width)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("xlabel");

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("ylabel");

    return {chart:chart, xscale:x, yscale:y};
};
