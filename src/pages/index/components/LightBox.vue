<template>
  <div
    class="modal light-box fade"
    v-if="open"
    :class="{'in': open}"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <a
          @click="$emit('close')"
          class="close"
        >
          <i class="icon-remove-white"></i>
        </a>
        <img :src="row.imageUrl">
        <div class="caption">
          <small class="float-right">
            ( {{total}} 筆資料中的第 {{index}} 筆 )
          </small>
          <span class="text">
            {{row.filename}} | {{row.datetime}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LightBox',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
};
</script>
