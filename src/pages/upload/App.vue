<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-md">
        <a
        href="./index.html#/"
        role="button"
        class="navbar-brand">
          Camara Capture
        </a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav main-nav">
            <li class="nav-item">
              <a class="nav-link active" role="button" href="./index.html#/">
                專案總覽
                <span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="./search.html">
                篩選及下載
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="./history.html">
                上傳紀錄
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
                幫助
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a href="./article.html#/faq"
                class="dropdown-item">
                  常見問題
                </a>
                <a href="./article.html#/contact"
                class="dropdown-item">
                  聯絡我們
                </a>
                <a href="./article.html#/private-policy"
                class="dropdown-item">
                  隱私權政策
                </a>
              </div>
            </li>
            <li class="divider"></li>
          </ul>
          <div class="navbar-nav subnav">
            <div class="divider"></div>
            <div class="nav-item dropdown">
              <a
              class="nav-item nav-link dropdown-toggle"
              id="notification"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
                <i class="fa fa-bell"></i>
              </a>
              <div
              id="notification-container"
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="notification">
                <a class="dropdown-item notification-item">
                  <div class="meta text-gray date">
                    2018/07/23 17:25 你 上傳了
                  </div>
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
              <a
              class="nav-item nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
                黃智賢
              </a>
              <div class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="setting.html#/">設定</a>
                <a class="dropdown-item" href="#">登出</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="page-upload">
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['PageLock']),
  },
  data() {
    return {};
  },
  watch: {
    PageLock: 'setBodyLock',
    $router: 'routeChange',
  },
  methods: {
    ...mapActions(['setPageLock']),
    routeChange() {
      this.setPageLock(false);
    },
    setBodyLock() {
      if (this.PageLock) document.body.classList.add('page-lock');
      else document.body.classList.remove('page-lock');
    },
  },
};
</script>
