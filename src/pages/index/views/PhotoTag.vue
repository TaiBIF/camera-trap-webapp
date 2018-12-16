<template>
  <div class="container">
    <router-link
      :to="`/project/${$route.params.id}/site/${$route.params.site_id}/${$route.params.subsite_id}`"
      class="text-muted"
    >
      <i class="fa fa-chevron-left"></i> 返回資料編輯
    </router-link>
    <div>
      <iframe
        :src="`phototag/ann.html?image_id=${$route.query.image_id}`"
        style='border:0px;padding:0px;margin:0px;width:100%;height:850px;'
        id='photo_tag'
      ></iframe>
    </div>
  </div>
</template>
