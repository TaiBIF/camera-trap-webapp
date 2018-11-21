<template>
  <div id="app">
    <the-header :is-login="true" />
    <main class="page-search">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TheHeader from '../../components/Header/TheHeader.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
  },
  computed: {
    ...mapGetters(['PageLock']),
  },
  watch: {
    PageLock: 'setBodyLock',
    $router: 'routeChange',
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['setPageLock']),
    routeChange() {
      this.setPageLock(false);
    },
    setBodyLock() {
      if (this.PageLock) document.body.classList.add('page-lock');
      else document.body.classList.remove('page-lock');
    },
  },
};
</script>
