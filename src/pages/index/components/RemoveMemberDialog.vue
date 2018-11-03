<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <a class="close" @click="$emit('close')"><i class="icon-remove-sm"></i></a>
          <img src="/assets/common/error-img.png" width="221" srcset="/assets/common/error-img@2x.png">
          <h1 class="text-green">您確定將 {{name}} 從計畫成員移除嗎 ? ?</h1>
          <p class="text-gray">移除後，該成員將無法瀏覽或編輯此計畫中的資料，若要回復權限，請再次邀請此成員</p>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <a @click="$emit('submit')" class="btn btn-orange">確定刪除</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InvitationDialog',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'User'
    }
  }
}
</script>

