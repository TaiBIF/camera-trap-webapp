<template>
  <div class="photo-wrapper" :style="{'width': (open ? galleryWidth : 0) + 'px'}">
    <div class="size-bar" 
    @mousedown="moveStart($event)" 
    ></div>
    <div class="status-bar">
      <div class="row">
        <div class="col-6">
          <div class="title">媒體檢視</div>
        </div>
        <div class="col-6 text-right">
          <a @click="$emit('toggle',false)"><i class="fa fa-remove"></i></a>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 text-right py-1">
          <div class="btn-group">
            <a data-toggle="tooltip" data-title="單張檢視" class="btn btn-sm btn-outline-success" :class="{'active': galleryType==0}">
              <i class="icon icon-gallery-single"></i>
            </a>
            <a class="btn btn-sm btn-outline-success" :class="{'active': galleryType==1}">
              <i class="icon icon-gallery-list"></i>
            </a>
          </div>
        </div>
        <div class="col-12">

          <div class="photo" :style="{ opacity: table_rows.length>0 ? 1: 0 }">
            <img :src="photo.src" @dblclick="$emit('trigger')">

            <div class="control text-center">
              <a class="btn btn-sm" @click="$emit('change', -1)">
                <i class="fa fa-caret-left"></i>
              </a>
              <span class="text-center">{{photo.name}}</span>
              <a class="btn btn-sm" @click="$emit('change', 1)">
                <i class="fa fa-caret-right"></i>
              </a>
            </div>
          </div>
          <div class="range_slider">
            <input type="range" min="1"
              v-if="continuous.total>0" 
              :max="continuous.total" 
              :value="continuous.current" 
              @change="$emit('rangeChange', $event.target.value)" />
            <div class="tip">
              {{continuous.current}}/{{ continuous.total }}
            </div>
          </div>
          <div class="form-group">
            <label for="">備註</label>
            <textarea name="" id="" cols="30" rows="5" class="form-control" placeholder="請輸入備註內容"></textarea>
          </div>
        </div>
      
      </div>
    </div>
  </div>  
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  props: ['open', 'continuous', 'photo'],
  data() {
    return {
      readyMove: false,
      currentWidth: 450,
      galleryWidth: 450,
      galleryType: 0,
    };
  },
  computed: {
    ...mapGetters([
      'table_rows', 'species', 'camara', 'currentRow', 'currentColumn'
    ])
  },
  methods: {
    ...mapActions([
      "setTableRows", "setTableRow", 'setSpecies', 'setCamara', 'setCurrentRow', 'setCurrentColumn'
    ]),
    moveStart($e) {
      this.readyMove = true;
      this.currentWidth = this.galleryWidth;
      document.body.className = 'no-select';
    }
  },
  mounted() {
    document.body.addEventListener('mousemove', (e) => {
      if(!this.readyMove) return;
      this.galleryWidth = window.innerWidth - e.pageX 

    })
    document.body.addEventListener('mouseup', (e) => {
      if(!this.readyMove) return;
      this.readyMove = false
      document.body.classList.remove("no-select");
      this.$emit('render');
    })
  }
}
</script>
