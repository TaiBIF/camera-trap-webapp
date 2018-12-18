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
        <prose-content></prose-content>
      </article>

      <div class="text-right text-gray">
        最後更新日期：{{ prose.date }}
      </div>
    </div>
  </div>
</template>

<script>
let proses = [
  {
    path: 'privacy-policy',
    title: 'Camera Trap 自動相機資料平台隱私政策',
    description: '',
    date: '2018-11-01',
  },
  {
    path: 'contribution-protocol',
    title: 'Camera Trap 自動相機資料平台貢獻協議',
    description: '',
    date: '2018-11-01',
  },
];
import ProseContent from '../../../prose/privacy-policy.md';

export default {
  name: 'prose',
  props: ['slug'],
  components: {
    'prose-content': ProseContent,
  },
  data() {
    return {
      loading: false,
      error: null,
      prose: null,
    };
  },
  mounted() {
    this.renderContent();
  },
  watch: {
    $route: 'renderContent',
  },
  methods: {
    renderContent: function() {
      let self = this;
      let index = proses.findIndex(prose => prose.path === self.slug);
      self.loading = true;
      self.error = self.prose = null;
      self.loading = false;
      self.prose = proses[index];
    },
  },
};
</script>
