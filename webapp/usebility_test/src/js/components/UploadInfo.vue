<template>
  <div class="row upload-info">
    <div class="col-4">
      <div class="num">1</div>
      <div class="content">
        請檢查您欲上傳的CSV檔，<span class="text-green">欄位格式</span> 及 <span class="text-green">欄位順序</span> 
        是否填寫正確且符合系統規定。詳細欄位規範請參考 <a href="#" class="link">範本。</a>
        <small class="text-muted d-block">(＊系統規範外的CSV欄位，上傳後仍會保留，請安心上傳)</small>

        <img src="../../img/upload-info-1.png" width="294">
      </div>
    </div>
    <div class="col-4">
      <div class="num">2</div>
      <div class="content">
        可上傳格式：
        <ol>
          <li>zip檔案，包含：媒體檔案(相片或影) 和 對應資料檔案(csv)</li>
          <li>單一媒體檔案(相片或影)</li>
          <li>單一資料檔案(csv)。</li>
        </ol>
        <img src="../../img/upload-info-2.png" width="287">
      </div>
    </div>
    <div class="col-4">
      <div class="num">3</div>
      <div class="content">
        單一檔案上傳大小限制於 2G 以內，總上傳限制於5G 以內。

        <img src="../../img/upload-info-3.png" width="215">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadInfo'

}
</script>

<style lang="scss">
  .upload-info {
    padding: 48px;
    
    > [class*="col-"]:not(:last-child) {
      box-shadow: 1px 0 0 0 #979797;
    }

    .num {
      float: left;
      display: block;
      width: 30px;
      height: 30px;
      color: #2A7F60;
      background: #F7E2B4;
      border: 3px solid #FFAF00;
      border-radius: 20px;
      text-align: center;
    } 

    .num + .content {
      display: block;
      margin-left: 40px;
    }
    img {
      display: block;
      margin: 20px auto;
    }
  }
</style>
