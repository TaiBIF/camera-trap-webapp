<template>
  <main class="page-project">
    <div
      class="container"
      v-bind:class="{'loading': loading}"
    >
      <div
        class="message"
        v-if="Message !== null"
      >
        <div class="container">
          {{ Message[0].title }}
        </div>
      </div>
      <h1 class="heading">計畫總覽</h1>
      <div v-if="!Projects.length && !loading">
        <div class="empty-content">
          <img
            src="/assets/common/empty-project.png"
            width="212px"
            srcset="/assets/common/empty-project@2x.png"
          >
          <h1 class="empty">您目前沒有任何計畫</h1>
          <router-link
            to="/project/create"
            class="btn btn-orange"
          >新增計畫</router-link>
        </div>
      </div>

      <div v-else>
        <!-- Controlbar -->
        <div class="row">
          <div class="col-8">
            <div class="dropdown">
              <a
                class="btn btn-link pl-0 dropdown-toggle"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                依 {{sortedBy}} 排序
              </a>
              <div
                class="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <a
                  class="dropdown-item"
                  @click="sortByField('earliestRecordTimestamp', -1); sortedBy = '資料起始時間'"
                  href="#"
                >依資料起始時間排序 (新→舊)</a>
                <a
                  class="dropdown-item"
                  @click="sortByField('modified', -1); sortedBy = '最後更新時間'"
                  href="#"
                >依最後更新時間排序 (新→舊) </a>
                <a
                  class="dropdown-item"
                  @click="sortByField('funder', 1); sortedBy = '委託單位'"
                  href="#"
                >依委託單位筆畫排序</a>
                <a
                  class="dropdown-item"
                  @click="sortByField('projectTitle', 1); sortedBy = '計畫名稱'"
                  href="#"
                >依計畫名稱筆畫排序</a>
              </div>
            </div>
          </div>
          <div class="col-4 text-right">
            <router-link
              to="/project/create"
              class="btn btn-orange"
            >新增計畫</router-link>
          </div>
        </div>
        <!-- Cards -->
        <div class="three cards">
          <router-link
            :to="`/project/${proj._id}`"
            class="card"
            v-for="(proj) in Projects"
            :key="`proj-${proj._id}`"
          >
            <div class="image">
              <img :src="proj.coverImage">
              <div
                class="badget"
                v-if="proj.members"
              >
                <i class="fa fa-user"></i>{{proj.members.length}}
              </div>
            </div>
            <div class="content">
              <h3 class="card-heading">{{proj.projectTitle}}</h3>
              <div class="row description">
                <div class="col-6">
                  <small class="text-gray label">資料起始年份</small>
                  <span class="text-green">{{proj.earliestRecordTimestamp ? new Date(proj.earliestRecordTimestamp * 1000).getFullYear() : 'NA'}}</span>
                </div>
                <div class="col-6">
                  <small class="text-gray label">委託單位</small>
                  <span class="text-green">{{proj.funder}}</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const project = createNamespacedHelpers('project');
const message = createNamespacedHelpers('message');

export default {
  name: 'Overview',
  computed: {
    ...project.mapGetters(['Projects']),
    ...message.mapGetters(['Message']),
  },
  data() {
    return {
      loading: true,
      sortedBy: '條件',
    };
  },
  watch: {
    Projects: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue && Array.isArray(newValue) && newValue.length > 0) {
          // case initializing
          this.loading = false;
        } else if (
          newValue &&
          Array.isArray(newValue) &&
          oldValue &&
          Array.isArray(oldValue)
        ) {
          // case value changing
          this.loading = false;
        }
      },
    },
  },
  methods: {
    ...project.mapMutations(['setCurrentProject']),
    ProjectInit() {
      this.loading = false;
    },
    sortByField(fieldName, dir) {
      this.Projects.sort((prjA, prjB) => {
        if (dir > 0) {
          return prjA[fieldName] > prjB[fieldName] ? 1 : -1;
        } else {
          return prjA[fieldName] < prjB[fieldName] ? 1 : -1;
        }
      });
    },
  },
  beforeMount() {
    this.setCurrentProject('');
  },
};
</script>
