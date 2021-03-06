<template>
  <li
    class="tree-menu-item"
    :class="{'is-open': CurrentToggle==idx}"
  >
    <div
      class="tree-menu-link"
      @click="toggleDropdown()"
      :class="{
      'is-active': $route.params.site_id == item.id
    }"
    >
      <!-- 有子項目顯示箭頭 -->
      <span class="icon">
        <i
          class="fa"
          v-if="isFolder"
          :class="CurrentToggle==idx ? 'fa-caret-down' : 'fa-caret-right'"
        ></i>
        <i
          v-else
          class="dot"
        ></i>
      </span>
      <span
        class="text"
        v-if="isFolder"
      >
        {{item.name}}
      </span>
      <!-- 處於編輯狀態顯示 lock -->
      <router-link
        class="text"
        v-else
        :to="link"
      >
        {{item.name}}
      </router-link>
      <div
        class="icon float-right"
        v-if="locked"
      >
        <i class="icon-lock-green"></i>
      </div>
      <div
        class="icon float-right"
        v-if="haveAbnormal"
      >
        <i class="has-error"></i>
      </div>
    </div>
    <!-- Print 出所有子項目 -->
    <ul
      class="tree-menu-child"
      v-if="isFolder"
    >
      <tree-item
        v-for="(child) in item.children"
        :site="item.id"
        :key="`menu-${item.id}-${child.id}`"
        :level="level + 1"
        :item="child"
      />
    </ul>
  </li>
</template>

<script>
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
import TreeItem from '../components/TreeItem';

const project = createNamespacedHelpers('project');
const cameraLocation = createNamespacedHelpers('cameraLocation');

export default {
  name: 'tree-item',
  components: { TreeItem },
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
    ...mapGetters(['CurrentToggle']),
    ...project.mapState(['currentProjectId']),
    ...cameraLocation.mapState(['cameraLocked']),
    ...project.mapGetters(['projectErrorSites']),
    link() {
      if (this.site) {
        return `/project/${this.currentProjectId}/site/${this.site}/${
          this.item.id
        }`;
      } else {
        return `/project/${this.currentProjectId}/site/${this.item.id}`;
      }
    },
    locked() {
      return this.cameraLocked
        .filter(
          camera =>
            camera.site === this.site && camera.subSite === this.item.name,
        )
        .map(v => v.locked)
        .some(v => v === true);
    },
    haveAbnormal() {
      const abnormalRecord = this.projectErrorSites.find(abnormalData => {
        if (this.site) {
          return (
            abnormalData.site === this.site &&
            abnormalData.subSite === this.item.name
          );
        }
        return abnormalData.site === this.item.name;
      });
      return abnormalRecord && abnormalRecord.errorCount > 0;
    },
  },
  data() {
    return {
      // 判斷是否有子項目
      isFolder:
        !this.item === false &&
        !this.item.children === false &&
        this.item.children.length > 0,
    };
  },
  methods: {
    ...mapActions(['setCurrentToggle']),
    toggleDropdown() {
      // 切換開闔狀態
      if (!this.isFolder) return;

      if (this.item.children.length) {
        this.setCurrentToggle(this.idx);
      }
    },
  },
};
</script>
