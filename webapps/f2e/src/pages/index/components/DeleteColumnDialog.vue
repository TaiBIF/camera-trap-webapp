<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <a class="close" @click="$emit('close')"><i class="icon-remove-sm"></i></a>
          <img src="/assets/common/error-img.png" width="221" srcset="/assets/common/error-img@2x.png">
          <h1 class="text-green">您確定要刪除「角況」欄位嗎 ?</h1>
          <p class="text-gray">欄位刪除後，資料仍會存在，但將不會在「資料編輯」畫面中顯示（若您需加回自行新增之欄位，需再次向系統管理員提出申請）</p>

          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <a @click="$emit('submit')" class="btn btn-orange">確定刪除</a>
        </div>
      </div>
    </div>  
  </div>  
</template>

<script>

export default {
  name: "InvitationDialog",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  }
}
</script>

