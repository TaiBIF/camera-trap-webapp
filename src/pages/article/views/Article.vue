<template>
  <div class="container">
    <h1 class="text-green">
      {{article.title}}
    </h1>
    <p class="text-gray">
      {{article.description}}
    </p>

    <article>
      {{article.content}}
    </article>

    <div class="text-right text-gray">
      最後更新日期：{{article.updated_at}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
      article: {
        title: 'Title',
        description: 'Description',
        content: 'Content',
        updated_at: '2018/08/14',
      },
    };
  },
};
</script>
