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
                <a href="./article.html#/faq" class="dropdown-item">常見問題</a>
                <a href="./article.html#/contact" class="dropdown-item">聯絡我們</a>
                <a href="./article.html#/private-policy" class="dropdown-item">隱私權政策</a>
              </div>
            </li>
            <li class="divider"></li>
          </ul>
          <div class="navbar-nav subnav">
            <div class="divider"></div>
            <div class="nav-item dropdown">
              <a class="nav-item nav-link dropdown-toggle" id="notification" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-bell"></i></a>
              <div id="notification-container" class="dropdown-menu dropdown-menu-right" aria-labelledby="notification">
                <a class="dropdown-item notification-item">
                  <div class="meta text-gray date">2018/07/23 17:25 你 上傳了</div>
                  <h5 class="text-green">
                    <a href="#" class="link">
                      全島鼬獾 屏東處-潮州站 PT09A<br/>
                      2018/06/01-2018/07/31
                    </a>
                  </h5>
                  <div class="meta">
                    上傳失敗 <a class="text-green link">檢視錯誤</a>
                  </div>
                </a>
              </div>
            </div>
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
import TreeMenu from './components/TreeMenu.vue'

const project = {
  id: 1,
  name: '國家生物多樣性監測與報告系統規劃-陸域',
  slot: '多樣性',
  children: [
    {
      id: 11,
      name: '羅東處',
      project_id: 1,
      children: [
        {
          id: 101,
          name: 'OO站'
        },
        {
          id: 102,
          name: 'XX站'
        },
        {
          id: 103,
          name: '%%站'
        }
      ]
    },
    {
      id: 12,
      name: '新竹處',
      project_id: 1,
      children: [
        {
          id: 201,
          name: 'OO站'
        },
        {
          id: 202,
          name: 'XX站'
        },
        {
          id: 203,
          name: '%%站'
        }
      ]
    }, 
    {
      id: 13,
      name: '東勢處',
      project_id: 1,
      children: [
        {
          id: 301,
          name: 'OO站'
        },
        {
          id: 302,
          name: 'XX站'
        },
        {
          id: 303,
          name: '%%站'
        }
      ]
    }, 
    {
      id: 14,
      name: '南投處',
      project_id: 1,
      children: [
        {
          id: 401,
          name: 'OO站'
        },
        {
          id: 402,
          name: 'XX站'
        },
        {
          id: 403,
          name: '%%站'
        }
      ]
    }, 
    {
      id: 15,
      name: '嘉義處',
      project_id: 1,
      children: [
        {
          id: 501,
          name: 'OO站'
        },
        {
          id: 502,
          name: 'XX站'
        },
        {
          id: 503,
          name: '%%站'
        }
      ]
    }
  ]
}

export default {
  name: "App",
  components: {TreeMenu},
  data() {
    return {
      asideElem: ['overview','createProject', 'editInfo', 'editColumn', 'editCamera', 'editMember', 'editLicense'],
      project: project
    }
  },
  watch: {
    '$router': "fetchData"
  },
  methods: {
    fetchData() {
      let projectID = this.$router.params.id
    }
  }
}
</script>
