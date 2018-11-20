<template>
  <div id="app">
    <the-header :is-login="true" />
    <main class="page-article">
      <router-view />
    </main>
  </div>
</template>

<script>
import TheHeader from '../../components/Header/TheHeader.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
  },
};
</script>
