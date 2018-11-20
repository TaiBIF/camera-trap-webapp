<template>
  <div id="app">
    <the-header />
    <main class="page-project">
      <aside v-if="asideElem.indexOf($route.name)==-1 && !!currentProject">
        <!-- Render Project structure -->
        <router-link
          to="/"
          class="aside-header"
        >
          <i class="fa fa-chevron-left"></i> 返回計畫總覽
        </router-link>
        <div class="aside-project">
          <router-link to="/project/1">
            {{ currentProject.projectTitle }}
          </router-link>
        </div>
        <tree-menu
          :items="cameraLocations"
          :defaultOpenLevel="1"
        />
      </aside>

      <router-view />

    </main>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import TreeMenu from './components/TreeMenu.vue';
import TheHeader from '../../components/Header/TheHeader.vue';

const project = createNamespacedHelpers('project');
const message = createNamespacedHelpers('message');

export default {
  name: 'App',
  components: {
    TreeMenu,
    TheHeader,
  },
  data() {
    return {
      // 側選單不顯示的 Router name
      asideElem: [
        'overview',
        'createProject',
        'editInfo',
        'editColumn',
        'editCamera',
        'editMember',
        'editLicense',
        'memberDescription',
        'photoTag',
      ],
    };
  },
  beforeMount() {
    this.fetchData();
    if (this.$validator.dictionary.hasLocale('zh_TW')) {
      this.$validator.localize('zh_TW');
    } else {
      import('vee-validate/dist/locale/zh_TW').then(locale => {
        this.$validator.localize('zh_TW', locale);
      });
    }
  },
  watch: {
    $route() {
      this.fetchData();
    },
  },
  computed: {
    ...project.mapGetters(['currentProject', 'cameraLocations']),
  },
  methods: {
    ...project.mapActions(['loadProject']),
    ...message.mapActions(['loadMessage']),
    fetchData() {
      this.loadProject();
      this.loadMessage();
    },
  },
};
</script>
