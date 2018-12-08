<template>
  <div class="container">
    <h1 class="text-green">
      {{prose.title}}
    </h1>
    <p class="text-gray">
      {{prose.description}}
    </p>

    <article>
      {{prose.content}}
    </article>

    <div class="text-right text-gray">
      最後更新日期：{{prose.updated_at}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
      prose: {
        title: 'Title',
        description: 'Description',
        content: 'Content',
        updated_at: '2018/08/14',
      },
    };
  },
};
</script>
