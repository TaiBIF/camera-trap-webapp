<template>
  <ul class="tree-menu">
    <site-item
    v-for="(item, idx) in items"
    :key="`menu-${idx}`"
    :item="item"
    :level="1"
    :idx="idx" />

    <li class="add">
      <div class="icon" @click="addPoint($event)">
        <i class="icon icon-add"></i>
      </div>
      <div class="text">
        <input type="text" v-model="newPoint" @keydown="addPoint($event)" placeholder="新增子樣區" />
      </div>
    </li>
  </ul>
</template>

<script>
import SiteItem from './SiteItem'

export default {
  name: 'SiteMenu',
  components: { SiteItem },
  props: {
    items: Array,
    index: Number,
    defaultOpenLevel: Number
  },
  data () {
    return {
      points: this.items,
      newPoint: ''
    }
  },
  methods: {
    addPoint (evt) {
      if ((evt.type === 'click' || evt.type === 'keydown' && evt.keyCode === 13) && this.newPoint !== '') {
        this.points.push({
          name: this.newPoint,
          data: []
        })

        this.$emit('update', this.index, this.points)

        this.newPoint = ''
      }
    }
  }
}
</script>
