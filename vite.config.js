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
mkdir('public/dl/shaderCache/transferable')

fileArr = [...getAllFiles('shaders'), ...getAllFiles('pipelines')]
.map(function(f, index) {
  fs.readFile(f, (err, data) => fs.writeFileSync(`public/dl/shaderCache/transferable/${path.win32.basename(f)}`, data))
})