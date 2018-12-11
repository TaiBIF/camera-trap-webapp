<template>
  <div>
    <iframe
      :src="youtubeEmbedLink"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'YoutubeEnbed',
  props: {
    row: {
      type: Object,
      default: null,
    },
  },
  computed: {
    youtubeEmbedLink() {
      const params = new URLSearchParams(this.row.youtubeUrl.split('?').pop());
      return `https://www.youtube.com/embed/${params.get('v')}`;
    },
  },
};
</script>
