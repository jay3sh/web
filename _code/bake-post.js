const fs = require("fs");
const showdown = require("showdown");
const path = require("path");

const months = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];

if(process.argv.length < 3) {
  console.error("Missing input filepath");
  process.exit(0);
}

let filepath = process.argv[2];
if(!fs.existsSync(filepath)) {
  console.error("Invalid filepath "+filepath);
  process.exit(0);
}

if(fs.lstatSync(filepath).isDirectory()) {
  let filepaths = fs.readdirSync(filepath);
  for(let fname of filepaths) {
    bakePost(filepath+path.sep+fname);
  }
} else {
  bakePost(filepath);
}

function bakePost(mdFilepath) {


  // Open template files
  let postHeadTemplate = fs.readFileSync("post-head-template.html").toString();
  let postBodyTemplate = fs.readFileSync("post-body-template.html").toString();

  let mdInput = fs.readFileSync(mdFilepath).toString();

  // Parse post mdFilepath and deduce it's date
  let lastSlashIndex = mdFilepath.lastIndexOf("/");
  let filename = mdFilepath.substring(lastSlashIndex+1);
  let regex = /^(\d+)-(\d+)-(\d+)-([a-zA-Z0-9\-]+)/;

  if(!regex.test(filename)) {
    console.error("Filename has wrong format");
    process.exit(0);
  }

  let match = regex.exec(filename);
  let yearStr = match[1];
  let monthStr = match[2];
  let month = parseInt(monthStr);
  let dayStr = match[3];
  let dashedPostName = match[4];

  let dateString = months[month-1]+" "+parseInt(dayStr)+", "+yearStr;

  // Extract title of the post
  let postTitle = null;
  let mdBody = "";
  let bodyStart = false;
  for(let line of mdInput.split(/\r?\n/)) {
    if(bodyStart) {
      mdBody += line+"\n";
    } else {
      if(line.trim().length > 0 && postTitle === null) {
        postTitle = line;
      }
      if(line.trim() == "===") {
        bodyStart = true;
      }
    }
  }

  // Generate html from markdown
  let converter = new showdown.Converter();

  let postHead = postHeadTemplate.replace(/\$TITLE\$/g,postTitle);
  let htmlOutput = converter.makeHtml(mdBody);

  let postBody = postBodyTemplate.replace('$ARTICLE$',htmlOutput);
  postBody = postBody.replace('$POSTDATE$', dateString);
  postBody = postBody.replace(/\$TITLE\$/g,postTitle);

  // Create directory structure, if necessary
  let outpath = ""+yearStr;
  if(!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
  }
  outpath += path.sep+monthStr;
  if(!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
  }
  outpath += path.sep+dayStr;
  if(!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
  }
  outpath += path.sep+dashedPostName+".html";

  fs.writeFileSync(outpath, postHead+"\n"+postBody);

  console.log("Output html: "+outpath);
}

