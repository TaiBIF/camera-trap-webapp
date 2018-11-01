<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-md">
        <a href="./index.html#/" role="button" class="navbar-brand">Camara Capture</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <div class="navbar-nav justify-content-md-end subnav">
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">幫助</a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a href="./article.html#/faq" class="dropdown-item">常見問題</a>
                  <a href="./article.html#/contact" class="dropdown-item">聯絡我們</a>
                  <a href="./article.html#/private-policy" class="dropdown-item">隱私權政策</a>
                </div>
            </div>
            <div class="divider"></div>
            <div class="nav-item ml-3">
              <a href="login.html" class="btn btn-orange">登入</a>
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
import {mapGetters, mapActions} from 'vuex'

export default {
  name: "App",
  computed: {
    ...mapGetters([
      'PageLock'
    ])
  },
  data() {
    return {
    }
  },
  watch: {
    'PageLock': 'setBodyLock',
    "$router": "routeChange"
  },
  methods: {
    ...mapActions([
      'setPageLock'
    ]),
    routeChange() {
      this.setPageLock(false)
    },
    setBodyLock() {
      if(this.PageLock) document.body.classList.add('page-lock')
      else document.body.classList.remove('page-lock')
    }
  }
}
</script>
