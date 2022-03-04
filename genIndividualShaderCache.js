const fs = require('fs')
const path = require('path')

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })
  return arrayOfFiles
}

function mkdir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p)
}

mkdir('individualShaderCache')

fileArr = [...getAllFiles('shaders'), ...getAllFiles('pipelines')]
.map(function(f, index) {
  fs.readFile(f, (err, data) => {
    var basename = path.win32.basename(f),
        titleID = basename.split('_')[0]

    mkdir(`individualShaderCache/${titleID}`)
    mkdir(`individualShaderCache/${titleID}/shaderCache`)
    mkdir(`individualShaderCache/${titleID}/shaderCache/transferable`)
    fs.writeFile(`individualShaderCache/${titleID}/shaderCache/transferable/${basename}`, data, (err) => { if (err) console.log(err) });
  })
})