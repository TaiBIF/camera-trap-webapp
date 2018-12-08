<template>
  <div class="container">
    <h1 class="text-green">
      {{title}}
    </h1>
    <p class="text-gray">
      {{description}}
    </p>

    <article>{{body}}</article>

    <div class="text-right text-gray">
      最後更新日期：{{updated_at}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
      title: 'Title',
      description: 'Description',
      body: 'privacyPolicy',
      updated_at: '2018/08/14',
    };
  },
};
</script>
