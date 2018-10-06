<template>
  <li class="tree-menu-item">

    <a class="tree-menu-link is-search-block" role="button" v-if="($route.name=='result' || $route.name=='resultSite') && level==1">
      <i class="icon icon-search-green"></i>
      所有搜尋結果
    </a>
    <a class="tree-menu-link"
    :class="{'is-height': level==1}" 
    @click="setCurrentProject(item.id)" 
    v-if="level==1">
      <span class="total_name">{{item.name}}</span>
      <span class="slot_name">{{item.slot}}</span>
    </a>

    <a class="tree-menu-link" 
    v-else-if="!add && ($route.name=='project' || $route.name=='site')"
    :href="`#/project/1/site/${item.id}`"
    :class="{
      'is-active': $route.params.site_id == item.id
    }">
      {{item.name}}
    </a>

    <a class="tree-menu-link" 
    v-else-if="!add && ($route.name=='result' || $route.name=='resultSite')"
    :href="`#/result/${item.id}`"
    :class="{
      'is-active': (item.name=='南庄 30 林班' && $route.params.site_id==12) || (item.name=='南庄田美村' && $route.params.site_id==11)
    }">
      {{item.name}}
    </a>

    <a class="tree-menu-link" 
    v-else-if="!add && $route.name=='uploadResult'"
    :href="`#/result/${$route.params.type}`"
    :class="{
      'is-active': item.name=='南庄田美村'
    }">
      {{item.name}}
    </a>

    <a class="tree-menu-link add-item" 
    v-if="level>1 && add && $route.name!='resultSite' && $route.name!='result' && $route.name!='uploadResult'">
      <i class="fa fa-plus mr-1"></i><span class="text">新增樣區</span>
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
import TreeItem from '../TreeMenu/TreeItem'

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
      'currentProject'
    ])
  },
  data() {
    return {
      isFolder: !this.item==false && !this.item.children==false && this.item.children.length > 0,
    }
  },
  methods: {
    ...mapActions([
      'setCurrentProject'
    ])
  },
  beforeMount() {
    // debugger
  }
}
</script>
