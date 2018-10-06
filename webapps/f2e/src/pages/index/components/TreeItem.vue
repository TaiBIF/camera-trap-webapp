<template>
  <li class="tree-menu-item">

    <a class="tree-menu-link" 
    :href="`#/project/1/site/${item.id}`"
    :class="{
      'is-active': $route.params.site_id == item.id
    }">
      <i class="fa fa-caret-right"></i> {{item.name}}
    </a>

    <ul class="tree-menu-child" v-if="isFolder">
      <tree-item 
      v-for="child in item.children" 
      :key="`menu-${item.id}-${child.id}`" 
      :level="level+1" 
      :item="child"/>
      <tree-item :level="level+1" :add="true" ></tree-item>
    </ul>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TreeItem from '../components/TreeItem'

export default { 
  name: 'tree-item',
  components: { TreeItem },
  props: {
    item: Object,
    idx: Number,
    level: Number,
    add: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFolder: !this.item==false && !this.item.children==false && this.item.children.length > 0,
    }
  },
  beforeMount() {
    // debugger
  }
}
</script>
