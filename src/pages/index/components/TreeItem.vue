<template>
  <li class="tree-menu-item"
  :class="{'is-open': CurrentToggle==idx}">

    <div class="tree-menu-link"
    @click="toggleDropdown()"
    :class="{
      'is-active': $route.params.site_id == item.id
    }">

      <!-- 有子項目顯示箭頭 -->
      <span class="icon">
        <i class="fa" v-if="isFolder"
        :class="CurrentToggle==idx ? 'fa-caret-down' : 'fa-caret-right'"></i>
        <i v-else class="dot"></i>
      </span>
      <span class="text" v-if="isFolder">
        {{item.name}}
      </span>
      <!-- 處於編輯狀態顯示 lock -->
      <router-link class="text" v-else :to="`/project/1/site/${item.id}`">
        {{item.name}}
        <div class="icon float-right">
          <i class="icon-lock-green"></i>
        </div>
      </router-link>
    </div>
    <!-- Print 出所有子項目 -->
    <ul class="tree-menu-child" v-if="isFolder">
      <tree-item
      v-for="(child) in item.children"
      :key="`menu-${item.id}-${child.id}`"
      :level="level + 1"
      :item="child" />
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
  computed: {
    ...mapGetters([
      'CurrentToggle'
    ])
  },
  data () {
    return {
      // 判斷是否有子項目
      isFolder: !this.item === false && !this.item.children === false && this.item.children.length > 0
    }
  },
  methods: {
    ...mapActions([
      'setCurrentToggle'
    ]),
    toggleDropdown () {
      // 切換開闔狀態
      if (!this.isFolder) return

      if (this.item.children.length) {
        this.setCurrentToggle(this.idx)
      }
    }
  }
}
</script>
