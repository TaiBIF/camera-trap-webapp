<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg">
        <a href="./index.html#/" role="button" class="navbar-brand">Camara Capture</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav main-nav">
            <li class="nav-item"><a class="nav-link active" role="button" href="./index.html#/">專案總覽 <span class="sr-only">(current)</span></a></li>
            <li class="nav-item"><a class="nav-link" role="button" href="./search.html">資料搜尋</a></li>
            <li class="nav-item"><a class="nav-link" role="button" href="#">範本下載</a></li>
            <li class="nav-item"><a class="nav-link" role="button" href="./history.html">上傳紀錄</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">幫助</a>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item">常見問題</a>
                <a class="dropdown-item">聯絡我們</a>
                <a class="dropdown-item">隱私權政策</a>
              </div>
            </li>
            <li class="divider"></li>
          </ul>
          <div class="navbar-nav subnav">
            <div class="divider"></div>
            <a class="nav-item nav-link" href="#"><i class="fa fa-bell"></i></a>
            <div class="divider"></div>
            <div class="nav-item dropdown">
              <a class="nav-item nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                黃智賢
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="page-project">
      <aside v-if="asideElem.indexOf($route.name)==-1">
        <router-link to="/" class="aside-header">
          <i class="fa fa-chevron-left"></i> 返回計畫總覽
        </router-link>
        <div class="aside-project">
          <router-link to="/project/1">
          {{ project.name }}
          </router-link>
        </div>
        <tree-menu :items="project.children" :defaultOpenLevel="1" />
      </aside>
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TreeMenu from './components/TreeMenu.vue'

const project = {
  id: 1,
  name: '國家生物多樣性監測與報告系統規劃-陸域',
  slot: '多樣性',
  children: [
    {
      id: 11,
      name: '羅東處',
      project_id: 1
    },
    {
      id: 12,
      name: '新竹處',
      project_id: 1
    }, 
    {
      id: 13,
      name: '東勢處',
      project_id: 1
    }, 
    {
      id: 14,
      name: '南投處',
      project_id: 1
    }, 
    {
      id: 15,
      name: '嘉義處',
      project_id: 1
    }
  ]
}

export default {
  name: "App",
  components: {TreeMenu},
  data() {
    return {
      asideElem: ['overview','createProject', 'editProject'],
      project: project
    }
  }
}
</script>
