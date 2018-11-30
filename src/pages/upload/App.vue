<template>
  <div id="app">
    <the-header :is-login="true" />
    <main class="page-upload">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

import TheHeader from '../../components/Header/TheHeader.vue';

const project = createNamespacedHelpers('project');

export default {
  name: 'App',
  components: {
    TheHeader,
  },
  computed: {
    ...mapGetters(['PageLock']),
    ...project.mapGetters(['currentProject']),
  },
  data() {
    return {};
  },
  watch: {
    PageLock: 'setBodyLock',
    $router: 'routeChange',
  },
  methods: {
    ...mapActions(['setPageLock']),
    ...project.mapMutations(['setCurrentProject']),
    ...project.mapActions(['loadProject']),
    routeChange() {
      this.setPageLock(false);
    },
    setBodyLock() {
      if (this.PageLock) document.body.classList.add('page-lock');
      else document.body.classList.remove('page-lock');
    },
  },
  mounted() {
    this.setCurrentProject(this.$route.params.projectId);
    this.loadProject();
  },
};
</script>
