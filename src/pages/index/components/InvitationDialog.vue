<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <a class="close" @click="$emit('close')"><i class="icon-remove-sm"></i></a>
          <img src="/assets/common/invitation-img.png" width="196" srcset="/assets/common/invitation-img@2x.png">
          <h1 class="text-green">邀請已送出</h1>
          <p class="text-gray">已將成員邀請甕出！</p>
          <a @click="$emit('close')" class="btn btn-default">返回計畫管理</a>
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
    }
  }
}
</script>

