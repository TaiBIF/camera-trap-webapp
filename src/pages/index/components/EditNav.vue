<template>
  <nav class="list">
    <router-link
      role="button"
      class="item"
      :class="{'active': $route.name=='editInfo'}"
      :to="`/info/${projectId}/edit`"
    >
      <div class="icon"><i class="fa fa-pencil-alt"></i></div>
      <div class="text">基本資訊</div>
    </router-link>

    <router-link
      role="button"
      class="item"
      :class="{'active': $route.name=='editColumn'}"
      :to="`/column/${projectId}/edit`"
    >
      <div class="icon"><i class="fa fa-pencil-alt"></i></div>
      <div class="text">編輯設定</div>
    </router-link>

    <router-link
      role="button"
      class="item"
      :class="{'active': $route.name=='editCamera'}"
      :to="`/camera/${projectId}/edit`"
    >
      <div class="icon"><i class="fa fa-pencil-alt"></i></div>
      <div class="text">相機位置管理</div>
    </router-link>

    <router-link
      role="button"
      class="item"
      :class="{'active': $route.name=='editMember'}"
      :to="`/member/${projectId}/edit`"
    >
      <div class="icon"><i class="fa fa-pencil-alt"></i></div>
      <div class="text">計畫成員</div>
    </router-link>

    <router-link
      role="button"
      class="item"
      :class="{'active': $route.name=='editLicense'}"
      :to="`/license/${projectId}/edit`"
    >
      <div class="icon"><i class="fa fa-pencil-alt"></i></div>
      <div class="text">創用 CC 授權</div>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'Editnav',
  props: {
    projectId: {
      type: String,
      default: null,
    },
  },
};
</script>
