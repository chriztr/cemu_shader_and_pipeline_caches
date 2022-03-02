import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cemu_shader_and_pipeline_caches/',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

// Copy and zip shaders

import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

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

mkdir('public')
mkdir('public/dl')
mkdir('public/dl/shaderCache')
mkdir('public/dl/shaderCache/transferrable')

var zip = new JSZip();

fileArr = [...getAllFiles('shaders'), ...getAllFiles('pipelines')]
fileArr.map(function(f, index) {
  var filename = path.win32.basename(f)
  fs.readFile(f, (err, data) => {
    fs.writeFileSync(`public/dl/shaderCache/transferrable/${filename}`, data)
    /*zip.file(`shaderCache/transferrable/${filename}`, data, { binary: true })
    
    var folderArr = []
    zip.folder('shaderCache/transferrable').forEach(function (relativePath, file) { folderArr.push(relativePath) })
    if (folderArr.length == fileArr.length - 1) {
      var zipname = 'public/shaders.zip'
      zip.generateNodeStream({type:"nodebuffer", binary: true, compression: 'DEFLATE' })
      .pipe(fs.createWriteStream(zipname))
    }*/
  })
})