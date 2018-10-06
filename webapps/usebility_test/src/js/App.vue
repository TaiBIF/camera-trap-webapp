<template>
  <div class="maintain">
    <!-- Tree Menu Start -->
    <aside class="tree-container" :class="{'is-collapse': asideCollapse}" v-if="asideShow">
      <header>
        <a class="btn btn-default btn-rounded float-right" role="button" @click="asideCollapse=!asideCollapse"><i class="icon icon-collapse"></i></a>
        <a class="content link text-muted" role="button" href="./index.html#/project/1" v-if="$route.name=='uploadResult'">
          <i class="icon icon-back"></i>
          <span class="text">返回專案首頁</span>
        </a>
        <a class="content" role="button" @click="$router.back()" v-else>
          <i class="icon icon-back"></i>
          <span class="text" v-if="$route.name=='project'">返回專案總覽</span>
          <span class="text" v-if="$route.name=='site'">返回專案首頁</span>
          <span class="text" v-if="$route.name=='result' || $route.name=='resultSite'">返回搜尋條件</span>
        </a>
      </header>
      <tree-menu :items="Projects" :defaultOpenLevel="1" />
      <!-- <hr/> -->
      <!-- <a class="btn btn-link"><i class="fa fa-plus-circle"></i> 新增專案</a> -->
    </aside>
    <!-- Tree Menu End -->
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'
  import TreeMenu from './components/TreeMenu/TreeMenu'
  
  export default {
    components: {
      TreeMenu
    },
    data () {
      return {
        asideShow: false,
        asideCollapse: false
      }
    },
    computed: {
      ...mapGetters([
        'Projects'
      ])
    },
    methods: {
      ...mapActions([
        'getProject'
      ]),
      fetchData () {
        this.asideShow = (['project', 'site', 'error', 'result', 'resultSite', 'uploadResult'].indexOf(this.$route.name) > -1);
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    beforeMount() {
      this.asideShow = (['project', 'site', 'error', 'result', 'resultSite', 'uploadResult'].indexOf(this.$route.name) > -1);
      this.getProject()
    },
    mounted () {
    }
  };
</script>
