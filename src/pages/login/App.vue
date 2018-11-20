<template>
  <div id="app">
    <the-header />
    <router-view />
  </div>
</template>

<script>
import TheHeader from '../../components/Header/TheHeader.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
  },
  data() {
    return {};
  },
};
</script>
