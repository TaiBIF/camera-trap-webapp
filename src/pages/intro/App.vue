<template>
  <div id="app">
    <the-header />
    <main class="page-upload">
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
  data() {
    return {};
  },
  watch: {
    PageLock: 'setBodyLock',
    $router: 'routeChange',
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
