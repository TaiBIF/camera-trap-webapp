<template>
  <li
    class="tree-menu-item"
    :class="{'edit': edit, 'active': idx===CurrentPoint}"
  >
    <div
      class="tree-menu-link"
      @click="setCurrent()"
      @dblclick="edit=true"
    >
      <div class="icon">
        <i class="fa fa-circle"></i>
      </div>
      <div
        class="text"
        v-if="edit"
      >
        <input
          type="text"
          v-model="item.value"
          @blur="edit=false"
          @keydown="updatePoint($event)"
        >
      </div>
      <div
        class="text"
        v-else
      >{{item.value}}</div>
    </div>

    <ul
      class="tree-menu-child"
      v-if="isFolder"
    >
      <tree-item
        v-for="(child, c_id) in item.children"
        :key="`menu-${idx}-${c_id}`"
        :level="level+1"
        :item="child"
      />
      <tree-item
        :level="level+1"
        :add="true"
      ></tree-item>
    </ul>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SiteItem',
  props: {
    item: Object,
    idx: Number,
    level: Number,
    add: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['CurrentPoint']),
  },
  data() {
    return {
      edit: false,
      isFolder:
        !this.item === false &&
        !this.item.children === false &&
        this.item.children.length > 0,
    };
  },
  methods: {
    ...mapActions(['setCurrentPoint']),
    updatePoint(e) {
      if (e.type === 'keydown') {
        if (e.keyCode === 27) {
          this.sites[this.currentEdit].name = this.oldName;
          this.edit = false;
        }
        if (e.keyCode === 13) {
          this.edit = false;
        }
      }
    },
    setCurrent() {
      this.setCurrentPoint(this.idx);
    },
  },
};
</script>
