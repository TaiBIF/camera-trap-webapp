<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <a class="close" @click="$emit('close')"><i class="icon-remove-sm"></i></a>
          <img src="/assets/common/error-img.png" width="221" srcset="/assets/common/error-img@2x.png">

          <h1 class="text-green">資料尚未儲存</h1>
          <p class="text-gray">目前編輯資料尚未儲存，確定要關閉視窗嗎？</p>

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

