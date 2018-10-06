<template>
  <main class="page-project">
    <div class="container">
      <div class="message" v-if="Message!==null">
        <div class="container">
          {{ Message.title }}
        </div>
      </div>
      <h1 class="heading">計畫總覽</h1>

      <div v-if="!Projects.length">
        <div class="empty-content">
          <img src="/assets/common/empty-project.png" width="212px" srcset="/assets/common/empty-project@2x.png">
          <h1 class="empty">您目前沒有任何計畫</h1>
          <router-link to="/project/create" class="btn btn-orange">新增專案</router-link>
        </div>
      </div>
      
      <div v-else>
        <!-- Controlbar -->
        <div class="row">
          <div class="col-8">
            <div class="dropdown">
              <a class="btn btn-link pl-0 dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                依建立時間排序
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">依資料起始時間排序 (新→舊)</a>
                <a class="dropdown-item" href="#">依最後更新時間排序 (新→舊) </a>
                <a class="dropdown-item" href="#">依委託單位筆畫排序</a>
                <a class="dropdown-item" href="#">依專案名稱筆畫排序</a>
              </div>
            </div>
          </div>
          <div class="col-4 text-right">
            <router-link to="/project/create" class="btn btn-orange">新增專案</router-link>
          </div>
            
        </div>
        <!-- Cards -->
        <div class="three cards">
          <router-link to="/project/1" class="card" v-for="(proj, pid) in Projects" :key="`proj-${pid}`">
            <div class="image">
              <img src="https://via.placeholder.com/373x180">
              <div class="badget">
                <i class="fa fa-user"></i>{{proj.members}}
              </div>
            </div>
            <div class="content">
              <h3 class="card-heading">{{proj.name}}</h3>
              <div class="row description">
                <div class="col-6">
                  <small class="text-gray label">資料起始年份</small>
                  <span class="text-green">{{proj.start_at}}</span>
                </div>
                <div class="col-6">
                  <small class="text-gray label">委託單位</small>
                  <span class="text-green">{{proj.agency}}</span>
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
import {mapActions, mapGetters} from 'vuex'
import * as projApi from '../../../service/project'
import * as commonApi from '../../../service/common'

export default {
  name: 'Overview',
  computed: {
    ...mapGetters([
      'Projects', 'Message'
    ])
  },
  methods: {
    ...mapActions([
      'setProjects', 'setMessage'
    ]),
    loadProject() {
      projApi.getProjects().then(r => {
        this.setProjects(r)
        this.loadMessage()
      })
    },
    loadMessage() {
      projApi.getProjects().then(r => {
        this.setMessage(r)
      })
    }
  },
  beforeMount() {
    this.loadProject()
  }
}
</script>
