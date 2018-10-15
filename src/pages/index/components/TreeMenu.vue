<template>
  <ul class="tree-menu">
    <tree-item 
      v-for="(item, idx) in items" 
      :key="`menu-${item.id}`" 
      :item="item" 
      :level="1" 
      :idx="idx" />
  </ul>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import TreeItem from './TreeItem'

export default {
  name: 'tree-menu',
  props: {
    items: Array, 
    defaultOpenLevel: Number
  },
  computed: {
    ...mapGetters([
      'currentProject'
    ])
  },
  components: { TreeItem },
  methods: {
    ...mapActions([
      'setCurrentProject'
    ])
  }
}
</script>
