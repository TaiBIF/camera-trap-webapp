<template>
  <li
    class="tree-menu-item"
    :class="{'edit': edit, 'active': idx===CurrentPoint}"
  >
    <div
      class="tree-menu-link"
      @click="setCurrent()"
      @dblclick="enableEditMode()"
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
          @blur="editPoint($event)"
          @keydown="editPoint($event)"
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
    site: String,
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
      oldName: null,
      isFolder:
        !this.item === false &&
        !this.item.children === false &&
        this.item.children.length > 0,
    };
  },
  methods: {
    ...mapActions(['setCurrentPoint']),
    enableEditMode() {
      this.oldName = this.item.value;
      this.edit = true;
    },
    editPoint(evt) {
      if (evt.type === 'keydown') {
        // ECS reset
        if (evt.keyCode === 27) {
          this.item.value = this.oldName;
          this.edit = null;
        }
        // Enter save change
        if (evt.keyCode === 13) {
          this.updatePoint(evt.target.value);
        }
      } else if (evt.type === 'blur' && this.edit) {
        // blur save change
        this.updatePoint(evt.target.value);
      }
    },
    updatePoint(value) {
      this.edit = false;
      this.$emit('update', {
        site: this.site,
        label: this.item.label,
        value,
      });
    },
    setCurrent() {
      this.setCurrentPoint(this.idx);
    },
  },
};
</script>
