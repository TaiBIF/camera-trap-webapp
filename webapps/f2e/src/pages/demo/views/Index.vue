<template>
  <main>
    <div class="container">
      <article>
        <h1>
          Resources
        </h1>
        <h3>Handsontable</h3>
        <a href="https://handsontable.com/examples?manual-resize&manual-move&conditional-formatting&context-menu&filters&dropdown-menu&headers" target="_blank">
          https://handsontable.com/examples?manual-resize&manual-move&conditional-formatting&context-menu&filters&dropdown-menu&headers
        </a>

        <hr>

        <h3>Upload</h3>  
        <p>
          典型的資料上傳流程是從 html form file input 選取檔案 submit，從 progress event 追上傳進度，由server 端處理後續動作。但由於我們主要採用 serverless 架構並以 AWS S3 作為後端倉儲，上傳的流程會有點不同，因此我們也 survey 了一下做法，可能需要麻煩你在前端整合。(個別實作都不複雜，但可能有與 Vue.js 整合的需求)
        </p>
        <p>
          操作上主要依賴AWS JS SDK，其中的 AWS.S3.ManagedUpload 可以管理上傳進度與稍微陽春的前端檔案續傳，檔案會直接上S3。範例程式目前因三方登入測試的關係，只能在 localhost 執行，程式碼位於：<br/><a href="https://github.com/TaiBIF/camera-trap/tree/master/cognito-s3-control/examples/tagphoto">https://github.com/TaiBIF/camera-trap/tree/master/cognito-s3-control/examples/tagphoto</a>
        </p>
        <p>
          如果沒權限進入上述 github repo，則麻煩從google drive下載：<br/><a href="https://drive.google.com/file/d/1mrmXuidwkkd9g5FToo4P5M9f69YUwtGn/view?usp=sharing" target="_blank">https://drive.google.com/file/d/1mrmXuidwkkd9g5FToo4P5M9f69YUwtGn/view?usp=sharing</a>
        </p>
        <p>
          範例還包括拖拉整個資料夾上傳，免plugin的寫法(目前chrome限定)。
        </p>
        <p>
          範例程式安裝與使用流程麻煩參見 README.md。
        </p>
      </article>
    </div>
  </main>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  naem: "Index",
  computed: {
    ...mapGetters([
      'FileReady'
    ])
  },
  watch: {
    FileReady: (v) => {
      console.log(v)
    }
  },
  mounted() {
  }
}
</script>
