<script>
import shaderListObj from '../shaders.json'

var shaderList = []
for (var i in shaderListObj) {
  var o = shaderListObj[i]
  o.titleID = i
  if (!Array.isArray(o.author)) {
    o.author = [o.author]
  }
  o.author = o.author.join(', ')
  o.downloading = false
  shaderList.push(o)
}

export default {
  data() {
    return {
      shaderList: shaderList,
      showEUR: true,
      showUSA: true,
      showJPN: true,
      compressOutput: true
    }
  },
  methods: {
    downloadZip(titleID) {
      var zip = new JSZip()
      var zipFileName = "shaders.zip"
      var shaderList = this.shaderList

      function httpGet(url) {
        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open("GET", url, false); 
        xmlHttpReq.send(null);
        return xmlHttpReq.responseText;
      }

      const suffixArr = [
        '_vkpipeline',
        '_shaders'
      ]

      suffixArr.map(function(x, index) {
        var filename = `${titleID}${x}.bin`
        console.log(`${index}/${suffixArr.length} - ${filename}`)
        zip.file(`shaderCache/transferrable/${filename}`, httpGet(`/dl/shaderCache/transferrable/${filename}`), { binary: true })
      })

      var filename = titleID
      console.log(`Saving to "${filename}.zip"...`)

      var compression = this.compressOutput ? 'DEFLATE' : 'STORE'

      zip.generateAsync({ type:"blob", compression: compression })
      .then(function (blob) {
          saveAs(blob, `${filename}.zip`)
          shaderList.filter(x => x.titleID == titleID)[0].downloading = false
          console.log('Saved!')
      });
    }
  }
}
</script>

<template>
  <h1>Unofficial caches for cemu 1.25 and newer</h1>
  <p>
    A collection of shader and pipeline caches made by me and submitted by others<br>
    Make sure the title ID match with your own. Most of my games are european copies.<br>
    Submissions from other people might be different regions<br>
    Shaders should work for both regions (you need to rename the cache to match your ID), however the pipelines doesn't<br>
    <b>Make use of CTRL+F to easier search through the page</b><br>
  </p>

  
  <h3>How to install the caches</h3>
  <p>Extract the <code>.zip</code> file into your Cemu folder.</p>

  <h4 style="margin-bottom: .8em;">Regions</h4>

  <p>
    <input type="checkbox" v-model="showEUR" id="showEURCheckbox">
    <label for="showEURCheckbox" style="padding-right: .5em;">EUR</label>
    <input type="checkbox" v-model="showUSA" id="showUSACheckbox">
    <label for="showUSACheckbox" style="padding-right: .5em">USA</label>
    <input type="checkbox" v-model="showJPN" id="showJPNCheckbox">
    <label for="showJPNCheckbox">JPN</label>

    <a style="float: right;" href="https://github.com/chriztr/cemu_shader_and_pipeline_caches/releases/latest/download/shaders.tgz">Download all</a>
  </p>

  <div id="list" class="tableContainer">
    <table>
      <tr>
        <th>Name</th>
        <th>Title ID</th>
        <th>Region</th>
        <th>Download</th>
      </tr>
      <tr v-for="title in shaderList.filter(x => 
        (x.region == 'EUR') && showEUR ||
        (x.region == 'USA') && showUSA ||
        (x.region == 'JPN') && showJPN
      ).sort(function(a,b) {
        return (a.name < b.name) ? -1 : 1
      })" :key="title">
        <td class="tableMinWidth">{{title.name}}</td>
        <td class="centerText">{{title.titleID}}</td>
        <td class="centerText">{{title.region}}</td>
        <td class="centerText" v-on:click="shaderList.filter(x => x.titleID == title.titleID)[0].downloading = true; downloadZip(title.titleID)">
          <div class="chartDropdownWrapper">
            <div class="chartDropdown">
              <i :class="`fas fa-${title.downloading ? 'spinner' : 'download'}`" :id="`dl-${title.titleID}`"></i>
            </div>
            <div class="chartDropdownBox opaqueHover">
              <ul>
                <li v-if="title.comment">{{title.comment}}</li>
                <li v-if="title.author">Made by: {{title.author}}</li>
                <li v-if="title.shaderCount">Shaders: {{title.shaderCount}}</li>
                <li v-if="title.pipelineCount">Pipelines: {{title.pipelineCount}}</li>
              </ul>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <p>
    <input type="checkbox" v-model="compressOutput" id="compressOutputCheckbox">
    <label for="compressOutputCheckbox">Compress downloads</label>
  </p>

</template>

<style>
@import '@/assets/base.css';
</style>
