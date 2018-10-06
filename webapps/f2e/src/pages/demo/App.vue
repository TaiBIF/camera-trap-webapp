<template>
  <div id="app">
    <header>
      <div class="container">
        <nav id="nav">
          <router-link to="/" exact>Home</router-link>
          <router-link to="/handsontable" exact>HandsonTable</router-link>
          <router-link to="/upload" exact>Upload</router-link>
        </nav>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "Demo",
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>