// This is an example of file scripting with js.
// To run:
// node scriptme.js

console.log("Yo! World!");

var fs = require("fs");
var dirContent = fs.readdirSync('..');

console.log(dirContent);
