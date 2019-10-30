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

  let blogIndex = {
    posts : []
  };
  let filepaths = fs.readdirSync(filepath);
  for(let fname of filepaths) {
    bakePost(filepath+path.sep+fname, blogIndex);
  }

  fs.writeFileSync("blogindex.json", JSON.stringify(blogIndex,null,2));

} else {
  bakePost(filepath);
}

function bakePost(mdFilepath, blogIndex) {

  // Parse post mdFilepath and deduce it's date
  let lastSlashIndex = mdFilepath.lastIndexOf("/");
  let filename = mdFilepath.substring(lastSlashIndex+1);
  let regex = /^(\d+)-(\d+)-(\d+)-([a-zA-Z0-9\-]+)/;

  if(!regex.test(filename)) {
    console.log("Ignoring: "+filename);
    return;
  }

  // Open template files

  let mdInput = fs.readFileSync(mdFilepath).toString();

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
  let categories = [];
  let keywords = [];
  for(let line of mdInput.split(/\r?\n/)) {
    if(bodyStart) {
      mdBody += line+"\n";
    } else {
      if(line.trim().startsWith("categories:")) {
        categories = line.substring(line.indexOf(":")+1).split(",");
      } else if(line.trim().startsWith("keywords:")) {
        keywords = line.substring(line.indexOf(":")+1).split(",");
      } else if(line.trim().startsWith("===")) {
        bodyStart = true;
      } else if(line.trim().length > 0 && postTitle === null) {
        postTitle = line;
      }
    }
  }

  // Load templates
  let postHeadTemplate = fs.readFileSync("post-head-template.html").toString();
  let postBodyTemplate = fs.readFileSync("post-body-template.html").toString();

  // Generate html from markdown
  let converter = new showdown.Converter();

  let postHead = postHeadTemplate.replace(/\$TITLE\$/g,postTitle);
  postHead = postHead.replace('$DESCRIPTION$',mdBody.substr(0,150));
  postHead = postHead.replace('$KEYWORDS$',keywords.join(','));
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

  if(blogIndex != null) {
    blogIndex.posts.push({
      title : postTitle,
      path : outpath,
      month : month,
      year : parseInt(yearStr),
      day : parseInt(dayStr),
      keywords : keywords,
      categoies : categories
    });
  }
  fs.writeFileSync(outpath, postHead+"\n"+postBody);

  console.log("Output html: "+outpath);
}

