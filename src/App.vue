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
      showJPN: true
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
        zip.file(`shaderCache/transferrable/${filename}`, httpGet(`/dl/${filename}`), { binary: true, compression : "DEFLATE" })
      })

      var filename = titleID
      console.log(`Saving to ${filename}.zip`)

      zip.generateAsync({type: "base64"}).then(function(content) {
          var link = document.createElement('a');
          link.href = "data:application/zip;base64," + content;
          link.download = `${filename}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          shaderList.filter(x => x.titleID == titleID)[0].downloading = false
          console.log('Saved!')
      });
    }
  }
}
</script>

<template>
  <h1>Unofficial caches for cemu 1.25 and newer</h1>
  <div id="info">
    A collection of shader and pipeline caches made by me and submitted by others<br>
    Make sure the title ID match with your own. Most of my games are european copies.<br>
    Submissions from other people might be different regions<br>
    Shaders should work for both regions (you need to rename the cache to match your ID), however the pipelines doesn't<br>
    <b>Make use of CTRL+F to easier search through the page</b><br>
  </div>

  <div id="install">
    <h3>How to install the caches</h3>
    [soon there will be a simple .gif looping here]<br>
    Put both of the shader and pipeline *.bin-file into <mark>"cemu/shaderCache/transferable"</mark>
  </div>

  <h4 style="margin-bottom: .8em;">Regions</h4>

  <input type="checkbox" v-model="showEUR" id="showEURCheckbox">
  <label for="showEURCheckbox" style="padding-right: .5em;">EUR</label>
  <input type="checkbox" v-model="showUSA" id="showUSACheckbox">
  <label for="showUSACheckbox" style="padding-right: .5em">USA</label>
  <input type="checkbox" v-model="showJPN" id="showJPNCheckbox">
  <label for="showJPNCheckbox">JPN</label>

  <a style="float: right;" href="/shaders.zip">Download all</a>

  <p></p>

  <div id="list" class="tableContainer">
    <table>
      <tr>
        <th>Title ID</th>
        <th>Name</th>
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
        <td class="centerText" v-on:click="downloadZip(title.titleID); shaderList.filter(x => x.titleID == title.titleID)[0].downloading = true">
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

</template>

<style>
@import '@/assets/base.css';
</style>
