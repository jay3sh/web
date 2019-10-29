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
  let sorted = [];
  for(let i=12; i>0; i--){
    for(let j=31;j>0;j--){
      for(let post of postEntriesByYear[''+year]){
        if(post.month == i && post.day == j){
          sorted.push(post);
        }
      }
    }
  }
  for(let post of sorted) {
    postListHtml += '<div><a href="'+post.path+'">'+post.title+'</a>'+
      '&nbsp;<span class="badge badge-info">'+months[post.month-1]+' '+post.day+'</span>'+
      '</div>';

  }
}

let blogTemplate = fs.readFileSync("blog-template.html").toString();
let htmlOutput = blogTemplate.replace("$POST_LIST$",postListHtml);

fs.writeFileSync("blog.html",htmlOutput);
