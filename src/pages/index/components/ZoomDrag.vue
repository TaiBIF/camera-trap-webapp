<template>
  <div class="img-container">
    <img class="img" 
    id="img-preview" 
    :src="row.url" 
    draggable="true" 
    @dragstart="onDragStart($event)"
    @drag="onDrag($event)"
    @dragend="onDragEnd($event)" />
    <div class="control-buttons">
      <div class="btn-group">
        <div class="btn btn-sm btn-basic" 
        @click="changeScale('increase')">
          <i class="icon-plus"></i>
        </div>
        <div class="btn btn-sm btn-basic" 
        @click="changeScale('decrease')">
          <i class="icon-minus"></i>
        </div>
      </div>
      <div class="btn-group">
        <div class="btn btn-sm btn-basic" @click="openLightBox()">
          <i class="icon-expand"></i>
        </div>
      </div>
    </div>
    <light-box 
    :open="lightBoxOpen" 
    :index="index" 
    :total='total' 
    :row="row" 
    @close="lightBoxOpen=false" />
  </div>
</template>

<script>
import LightBox from './LightBox'

export default {
  name: 'ZoomDrag',
  props: {
    row: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
  },
  components: {LightBox},
  watch: {
    'row': "updateImgWidth"
  },
  data() {
    return {
      isDrag: false,
      coordinate: {x:0, y:0},
      lastCoordinate: {x:0, y:0},
      currentCoordinate: {x:0, y:0},
      originWidth: 0,
      currentWidth: 0,
      lightBoxOpen: false,
      scaleSize: 1
    }
  },
  methods: {
    openLightBox() {
      // 打開 Lightbox
      this.lightBoxOpen = true
    },
    onDragStart(e) {
      // 紀錄圖片起始拖拉位置
      this.isDrag = true;
      this.coordinate.x = e.clientX
      this.coordinate.y = e.clientY
    },
    onDrag(e) {
      // 圖片拖拉位置更新
      if(!this.isDrag || this.scaleSize==1) return;

      let el = this.$el,
          img = this.$el.querySelector('#img-preview'),
          x = e.clientX, y = e.clientY;
      
      if((x==0 && y==0) || (x==this.coordinate.x && y==this.coordinate.y)) return;

      let x_limit = (img.clientWidth - el.clientWidth) / 2,
          y_limit = (img.clientHeight - el.clientHeight) / 2,
          disX = this.lastCoordinate.x + x - this.coordinate.x,
          disY = this.lastCoordinate.y + y - this.coordinate.y;
      
      disX = disX > x_limit ? x_limit : (disX<-x_limit ? -x_limit : disX)
      disY = disY > y_limit ? y_limit : (disY<-y_limit ? -y_limit : disY)

      this.currentCoordinate = {
        x: disX,
        y: disY
      }
      
      img.style.transform = `translate(${this.currentCoordinate.x}px, ${this.currentCoordinate.y}px)`

    },
    onDragEnd() {
      // 記錄最後拖拉座標
      this.lastCoordinate = {
        x: this.currentCoordinate.x,
        y: this.currentCoordinate.y
      }

      this.isDrag = false;
    },
    changeScale(type) {
      // 取得目前圖片尺寸，以 +- 50% 比例縮放
      let img = this.$el.querySelector('#img-preview'),
          container = this.$el;
      this.originWidth = this.src!=='' ? container.clientWidth : 0;
      this.currentWidth = this.src!=='' ? container.clientWidth : 0;
      
      if(type=='increase') 
        this.scaleSize = this.scaleSize + 0.5;
      if(type=='decrease') 
        this.scaleSize = this.scaleSize - 0.5 < 1 ? 1 : this.scaleSize - 0.5;
      
      img.style.width = (this.originWidth * this.scaleSize) + 'px';
    },
    updateImgWidth() {
      // Sheet 切換列表時更新圖片和尺寸
      let img = this.$el.querySelector('#img-preview'),
          container = this.$el;

      this.scaleSize = 1
      this.originWidth = this.src!=='' ? container.clientWidth : 0;
      this.currentWidth = this.src!=='' ? container.clientWidth : 0;
      img.style.width = this.currentWidth + 'px'
      img.style.transform = `translate(0px, 0px)`
    }
  },
  mounted() {
    this.updateImgWidth()
  }
}
</script>
