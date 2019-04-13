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
            width="221"
            srcset="/assets/common/invitation-img@2x.png"
          >
          <h1 class="text-green">儲存成功</h1>
          <a
            class="btn btn-green-border"
            @click="$emit('close')"
          >關閉</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
