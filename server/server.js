// Load the necessary servers.
var sys = require( "sys" );
var http = require( "http" );
var https = require( "https" );


//The url we want is:
//'www.random.org/integers/?num=1&
// min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  host: 'localhost',
  port: 5984,
  path: ''
};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
};



 
// Create our HTTP server.
var server = http.createServer(
  function( request, response ){
 
    console.log(request);

    // make a request to print a random number
    http.request(options, callback).end();

 
    // Create a SUPER SIMPLE response.
    response.writeHead( 200, {"content-type": "text/plain"} );
    response.write( "Hello world from node.js serving from AWS!\n" );
    response.end();
  }
);
 
// Point the HTTP server to port 8080.
server.listen( 8080 );
 
// For logging....
console.log( "Server is running on 8080" );
