<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <!-- <a class="close" @click="$emit('close')"><i class="icon-remove-sm"></i></a> -->

          <h1 class="text-green">閒置超時，自動返回檢視模式</h1>
          <p class="text-gray">資料已經幫您自動存檔，您可以重新進入編輯模式繼續作業。</p>

          <a @click="$emit('close')" class="btn btn-orange">確定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdleTimeoutDiaglog',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
