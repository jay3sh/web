const fs = require("fs");

if(process.argv.length < 3) {
  console.error("Missing input filename");
  process.exit(0);
}

let filename = process.argv[2];
if(!fs.existsSync(filename)) {
  console.error("Invalid filename "+filename);
  process.exit(0);
}

// Open template files
let postHeadTemplate = fs.readFileSync("post-head-template.html");
let postBodyTemplate = fs.readFileSync("post-body-template.html");

let postInput = fs.readFileSync(filename);

// Parse post filename and deduce it's date
