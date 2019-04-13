<template>
  <div
    class="modal trial-modal fade"
    :class="{'in': open}"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="error-maintain">
            <div class="image">
              <img
                src="/assets/upinfo/column-error.png"
                srcset="/assets/upinfo/column-error@2x.png"
              >
            </div>
            <h1 class="text-green text-center">儲存失敗</h1>
            <div class="content text-center px-3">
              <h5>錯誤訊息如下，如持續發生請聯繫管理人員。</h5>
              <p>{{error}}</p>
            </div>
          </div>
          <div class="action">
            <a
              @click="$emit('close')"
              class="btn btn-orange btn-block"
            >
              我知道了
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
