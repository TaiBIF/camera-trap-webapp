<template>
  <div class="container">
    <div v-if="loading">
      <p>Loading</p>
    </div>
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-if="prose">
      <h1 class="text-green">
        {{ prose.title }}
      </h1>
      <p class="text-gray">
        {{ prose.description }}
      </p>

      <article>
        {{ prose.content }}
      </article>

      <div class="text-right text-gray">
        最後更新日期：{{ prose.updatedAt }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'prose',
  props: ['slug'],
  data() {
    return {
      loading: false,
      error: null,
      prose: null,
    };
  },
  created() {
    this.renderContent();
  },
  watch: {
    $route: 'renderContent',
  },
  methods: {
    renderContent: function() {
      // const fs = require('fs');
      // const markdownIt = require('markdown-it');

      let self = this;
      self.loading = true;
      self.error = self.prose = null;
      fetch('/public/prose/privacy-policy.md')
        .then(res => {
          return res.text();
        })
        .then(data => {
          self.loading = false;
          self.prose.content = data;
          self.prose.title = 'title';
          self.prose.description = self.slug;
        })
        .catch(err => {
          self.error = err.toString();
        });
    },
  },
};
</script>
