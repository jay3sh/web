const fs = require("fs");

let blogIndex = JSON.parse(fs.readFileSync("blogindex.json").toString());
let postListHtml = "";
for(var post of blogIndex.posts) {
  postListHtml += '<div><a href="'+post.path+'">'+post.title+'</a></div>';
}

let blogTemplate = fs.readFileSync("blog-template.html").toString();
let htmlOutput = blogTemplate.replace("$POST_LIST",postListHtml);

fs.writeFileSync("blog.html",htmlOutput);
