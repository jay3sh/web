const fs = require("fs");

const months = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];
let blogIndex = JSON.parse(fs.readFileSync("blogindex.json").toString());

let postEntriesByYear = {};

for(var post of blogIndex.posts) {
  if(!postEntriesByYear[post.year]) {
    postEntriesByYear[post.year] = [];
  }
  postEntriesByYear[post.year].push(post);
}

let years = Object.keys(postEntriesByYear).map(x => parseInt(x));
years.sort((a,b)=>b-a);

let postListHtml = "";
for(let year of years) {
  postListHtml += '<div><h2>'+year+'</h2></div>';
  for(let post of postEntriesByYear[''+year]) {
    postListHtml += '<div><a href="'+post.path+'">'+post.title+'</a>'+
      //'<span class="caption">'+months[post.month-1]+' '+post.day+'</span>'+
      '</div>';

  }
}

let blogTemplate = fs.readFileSync("blog-template.html").toString();
let htmlOutput = blogTemplate.replace("$POST_LIST",postListHtml);

fs.writeFileSync("blog.html",htmlOutput);
