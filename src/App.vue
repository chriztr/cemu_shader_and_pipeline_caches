<script>
import shaderListObj from '../shaders.json'

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp, url)
    }
  }
  xmlHttp.open("GET", url, true)
  xmlHttp.send(null)
}

var shaderList = []
for (var i in shaderListObj) {
  var o = shaderListObj[i]
  o.titleID = i

  if (!Array.isArray(o.author)) o.author = [o.author]
  o.author = o.author.join(', ')
  shaderList.push(o)
}

export default {
  data() {
    return {
      shaderList: shaderList,
      showEUR: true,
      showUSA: true,
      showJPN: true,
      sortBy: "name",
      direction: false,
      searchStr: ''
    }
  }
}
</script>

<template>
  <div class="main">
    <h1>Unofficial caches for cemu 1.25 and newer</h1>
    <p>
      A collection of shader and pipeline caches made by me and submitted by others.<br>
      Make sure the title ID match with your own. Most of my games are european copies.<br>
      Submissions from other people might be different regions.<br>
      Shaders should work for both regions (you need to rename the cache to match your ID), however the pipelines won't.<br>
	  <b>Want to contribute?</b> Contact me on discord (chriz#7310) or on reddit (<a href="https://www.reddit.com/user/chriztr">reddit.com/user/chriztr</a>)<br>
	  Make sure you have verified / good game files and no game changing mods!
    </p>
    
    <h3>How to install the caches</h3>
    <p>Extract the <code>.zip</code> file into your Cemu folder.</p>
    
    <hr>

    <p>
      <input 
        class="search"
        type='text'
        placeholder='Search'
        v-model='searchStr'
      />
      <span class="regionCheckbox">
        <label><b>Regions:</b></label>
        <input type="checkbox" v-model="showEUR" id="showEURCheckbox">
        <label for="showEURCheckbox">EUR</label>
        <input type="checkbox" v-model="showUSA" id="showUSACheckbox">
        <label for="showUSACheckbox">USA</label>
        <input type="checkbox" v-model="showJPN" id="showJPNCheckbox">
        <label for="showJPNCheckbox">JPN</label>
      </span>

      <span class="downloadAllBtn">
        <a href="https://github.com/chriztr/cemu_shader_and_pipeline_caches" style="margin-right: .5em" target="_blank"><i class="fab fa-github"></i></a>
        <a href="https://github.com/chriztr/cemu_shader_and_pipeline_caches/releases/latest/download/shaders.zip">Download all</a>
      </span>

    </p>

    <div id="list" class="tableContainer">
      <table>
        <tr>
          <th></th>
          <th>Name <i style="float: right; cursor: pointer;" v-on:click="(sortBy == 'name') ? direction = !direction : sortBy = 'name'" class="fas fa-sort"></i></th>
          <th>Title ID <i style="float: right; cursor: pointer;" v-on:click="(sortBy == 'titleID') ? direction = !direction : sortBy = 'titleID'" class="fas fa-sort"></i></th>
          <th>Region</th>
          <th>Download</th>
        </tr>
        <tr v-for="title in shaderList.filter(x => 
          (
            (x.region == 'EUR') && showEUR ||
            (x.region == 'USA') && showUSA ||
            (x.region == 'JPN') && showJPN
          ) && (
            !searchStr ||
            searchStr == '' ||
            x.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchStr.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
            x.titleID.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchStr.toLowerCase().replace(/[^a-z0-9]/g, ''))
          )
        ).sort(function(a,b) {
          var m = (direction) ? -1 : 1
          return (a[sortBy] < b[sortBy]) ? -1*m : 1*m
        })" :key="title">
          <td style="width: 2.4em; padding: 0;"><img :src="`icons/${title.titleID}.png`" onerror='this.src="icons/fallback.png"' style="width: 2.4em; vertical-align: middle;"></td>
          <td class="tableMinWidth">{{title.name}}</td>
          <td class="centerText">{{title.titleID}}</td>
          <td class="centerText">{{title.region}}</td>
          <td class="centerText">
            <div class="chartDropdownWrapper">
              <div class="chartDropdown">
                <a :href="`${title.titleID}.zip`"><i class="fas fa-download"></i></a>
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
  </div>

  <p></p>

  <footer>
    <p>Created by <a href="https://github.com/chriztr" target="_blank">chriztr</a> and <a href="https://github.com/emiyl" target="_blank">emiyl</a>.</p>
    <p>If you need further help, ask on the official Cemu <a href="https://discord.gg/5psYsup" target="_blank">Discord Server</a> for assistance.</p>
  </footer>
  
</template>

<style>
@import '@/assets/base.css';
</style>
