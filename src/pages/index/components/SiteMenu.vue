<template>
  <ul class="tree-menu">
    <site-item
      v-for="(item, idx) in items"
      :key="`menu-${idx}`"
      :item="item"
      :level="1"
      :idx="idx"
      :site="site"
      @update="renamePoint"
    />

    <li class="add">
      <label
        :for="inputId"
        class="icon"
        @click="addPoint($event)"
      >
        <i class="icon icon-add"></i>
      </label>
      <div class="text">
        <input
          :id="inputId"
          type="text"
          v-model="newPoint"
          @keydown="addPoint($event)"
          placeholder="新增子樣區"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import SiteItem from './SiteItem';

export default {
  name: 'SiteMenu',
  components: { SiteItem },
  props: {
    site: String,
    items: Array,
    index: Number,
    defaultOpenLevel: Number,
  },
  data() {
    return {
      points: this.items,
      newPoint: '',
    };
  },
  methods: {
    renamePoint(obj) {
      this.$emit('update', obj);
    },
    addPoint(evt) {
      if (
        (evt.type === 'click' ||
          (evt.type === 'keydown' && evt.keyCode === 13)) &&
        this.newPoint !== ''
      ) {
        this.$emit('add', this.index, this.newPoint);
        this.newPoint = '';
      }
    },
  },
  computed: {
    inputId() {
      return `addPoint_${this.index}`;
    },
  },
};
</script>
