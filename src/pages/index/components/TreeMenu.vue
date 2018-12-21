<template>
  <ul class="tree-menu">
    <!-- Print 出所有子項目 -->
    <tree-item
      v-for="(item, idx) in items"
      :key="`menu-${item.id}`"
      :item="item"
      :level="1"
      :idx="idx"
    />
  </ul>
</template>

<script>
import TreeItem from './TreeItem';

export default {
  name: 'tree-menu',
  props: {
    items: Array,
    defaultOpenLevel: Number,
  },
  components: { TreeItem },
};
</script>
