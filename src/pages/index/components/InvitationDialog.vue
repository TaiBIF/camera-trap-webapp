<template>
  <div
    class="modal fade"
    :class="{'in': open}"
  >
    <div
      class="modal-dialog dialog-ui"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-body">
          <a
            class="close"
            @click="$emit('close')"
          ><i class="icon-remove-sm"></i></a>
          <img
            src="/assets/common/invitation-img.png"
            width="196"
            srcset="/assets/common/invitation-img@2x.png"
          >
          <h1 class="text-green">已加入成員</h1>
          <p class="text-gray">已將成員加入此計畫！</p>
          <a
            @click="$emit('close')"
            class="btn btn-default"
          >返回計畫管理</a>
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
      default: false,
    },
  },
};
</script>
