const fs = require("fs");

let BASE_DIR = "_input/posts";

let filenames = fs.readdirSync(BASE_DIR);
for(let filename of filenames){
  sanitizeFile(BASE_DIR+"/"+filename);
}


function sanitizeFile(filename) 
{
  let content = fs.readFileSync(filename);
  let output = "";

  let dashlines = 0;
  for(let line of content.toString().split(/\r?\n/)){
    if(dashlines >= 2) {
      output += line+"\n";
    }
    if(line == "---"){
      dashlines++;
    }
  }
  fs.writeFileSync(filename, output);
}
