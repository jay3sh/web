
window.onload = function() {
  var postlistElem = $('#postlist');
  console.log(postlist);
  jQuery.getJSON("blogindex.json",function(blogIndex){
    for(var post of blogIndex.posts) {
      var html = '<div><a href="'+post.path+'">'+post.title+'</a></div>';
      postlistElem.append(html);
    }
  });
}
