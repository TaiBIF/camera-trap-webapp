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
        <privacy-policy></privacy-policy>
      </article>

      <div class="text-right text-gray">
        最後更新日期：{{ prose.updatedAt }}
      </div>
    </div>
  </div>
</template>

<script>
import PrivacyPolicy from '../../../prose/privacy-policy.md';
export default {
  name: 'prose',
  props: ['slug'],
  components: {
    'privacy-policy': PrivacyPolicy,
  },
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
      let self = this;
      self.loading = true;
      self.error = self.prose = null;
      self.loading = false;
      self.prose = {
        title: 'title',
        description: self.slug,
      };
    },
  },
};
</script>
