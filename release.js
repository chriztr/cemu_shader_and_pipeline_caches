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

mkdir('shaderCache')
mkdir('shaderCache/transferable')

fileArr = [...getAllFiles('shaders'), ...getAllFiles('pipelines')]
.map(function(f, index) {
  fs.readFile(f, (err, data) => fs.writeFileSync(`shaderCache/transferable/${path.win32.basename(f)}`, data))
})