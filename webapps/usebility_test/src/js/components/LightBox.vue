<template>
  <div class="lightbox" :class="{'is-open': open}">
    <div class="lightbox-header" v-if="info!==null">
      <div class="row">
        <div class="col-6">
          {{info.photo.name}}
        </div>
        <div class="col-6 text-right">
          <span>( {{info.total}} 筆資料中的第 {{info.current + 1}} 筆  )</span>
          <a @click="$emit('close')" class="close ml-2">
            &times;
          </a>
        </div>
      </div>
    </div>
    <div class="lightbox-body">
      <img :src="info.photo.src">
    </div>
  </div>
</template>

<script>
export default {
  name: 'LightBox',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  updated() {
    if(this.open) {
      $('body').addClass('lightbox-open');
    } else {
      $('body').removeClass('lightbox-open');
    }
  }
}
</script>
