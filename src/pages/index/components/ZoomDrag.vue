<template>
  <div class="img-container">
    <img
      class="img"
      id="img-preview"
      :src="row.imageUrl"
      draggable="true"
      @dragstart="onDragStart($event)"
      @drag="onDrag($event)"
      @dragend="onDragEnd($event)"
    />
    <div class="control-buttons">
      <div class="btn-group">
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像局部放大'"
          @click="changeScale('increase')"
        >
          <i class="icon-plus"></i>
        </div>
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像局部縮小'"
          @click="changeScale('decrease')"
        >
          <i class="icon-minus"></i>
        </div>
      </div>
      <div class="btn-group">
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像整張放大'"
          @click="openLightBox()"
        >
          <i class="icon-expand"></i>
        </div>
      </div>
    </div>
    <light-box
      :open="lightBoxOpen"
      :index="index"
      :total='total'
      :row="row"
      @close="lightBoxOpen=false"
    />
  </div>
</template>

<script>
import LightBox from './LightBox';

export default {
  name: 'ZoomDrag',
  props: {
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
  components: { LightBox },
  watch: {
    row: 'updateImgWidth',
  },
  data() {
    return {
      isDrag: false,
      coordinate: { x: 0, y: 0 },
      lastCoordinate: { x: 0, y: 0 },
      currentCoordinate: { x: 0, y: 0 },
      originWidth: 0,
      currentWidth: 0,
      lightBoxOpen: false,
      scaleSize: 1,
    };
  },
  methods: {
    openLightBox() {
      // 打開 Lightbox
      this.lightBoxOpen = true;
    },
    onDragStart(e) {
      // 紀錄圖片起始拖拉位置
      this.isDrag = true;
      this.coordinate.x = e.clientX;
      this.coordinate.y = e.clientY;
    },
    onDrag(e) {
      // 圖片拖拉位置更新
      if (!this.isDrag || this.scaleSize === 1) return;

      const el = this.$el;
      const img = this.$el.querySelector('#img-preview');
      const x = e.clientX;
      const y = e.clientY;

      if (
        (x === 0 && y === 0) ||
        (x === this.coordinate.x && y === this.coordinate.y)
      ) {
        return;
      }

      const xLimit = (img.clientWidth - el.clientWidth) / 2;
      const yLimit = (img.clientHeight - el.clientHeight) / 2;
      let disX = this.lastCoordinate.x + x - this.coordinate.x;
      let disY = this.lastCoordinate.y + y - this.coordinate.y;

      disX = disX > xLimit ? xLimit : disX <= xLimit ? -xLimit : disX;
      disY = disY > yLimit ? yLimit : disY <= yLimit ? -yLimit : disY;

      this.currentCoordinate = {
        x: disX,
        y: disY,
      };

      img.style.transform = `translate(${this.currentCoordinate.x}px, ${
        this.currentCoordinate.y
      }px)`;
    },
    onDragEnd() {
      // 記錄最後拖拉座標
      this.lastCoordinate = {
        x: this.currentCoordinate.x,
        y: this.currentCoordinate.y,
      };

      this.isDrag = false;
    },
    changeScale(type) {
      // 取得目前圖片尺寸，以 +- 50% 比例縮放
      const img = this.$el.querySelector('#img-preview');
      const container = this.$el;

      this.originWidth = this.src !== '' ? container.clientWidth : 0;
      this.currentWidth = this.src !== '' ? container.clientWidth : 0;

      if (type === 'increase') {
        this.scaleSize = this.scaleSize + 0.5;
      }
      if (type === 'decrease') {
        this.scaleSize = this.scaleSize - 0.5 < 1 ? 1 : this.scaleSize - 0.5;
      }

      img.style.width = this.originWidth * this.scaleSize + 'px';
    },
    updateImgWidth() {
      // Sheet 切換列表時更新圖片和尺寸
      const container = this.$el;
      const img = this.$el.querySelector('#img-preview');

      this.scaleSize = 1;
      this.originWidth = this.src !== '' ? container.clientWidth : 0;
      this.currentWidth = this.src !== '' ? container.clientWidth : 0;

      img.style.width = this.currentWidth + 'px';
      img.style.transform = 'translate(0px, 0px)';
    },
  },
  mounted() {
    this.updateImgWidth();
  },
};
</script>
