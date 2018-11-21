<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <a
        href="/index.html#/"
        role="button"
        class="navbar-brand"
      >Camara Capture</a>
      <button
        v-if="!isLogin"
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        v-if="!isLogin"
        class="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <div class="navbar-nav justify-content-md-end subnav">
          <div class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >幫助</a>
            <div class="dropdown-menu dropdown-menu-right">
              <a
                href="/article.html#/faq"
                class="dropdown-item"
              >常見問題</a>
              <a
                href="/article.html#/contact"
                class="dropdown-item"
              >聯絡我們</a>
              <a
                href="/article.html#/private-policy"
                class="dropdown-item"
              >隱私權政策</a>
            </div>
          </div>
          <div class="divider"></div>
          <div class="nav-item ml-3">
            <a
              href="login.html"
              class="btn btn-orange"
            >登入</a>
          </div>
        </div>
      </div>
      <div
        class="collapse navbar-collapse"
        v-if="isLogin"
      >
        <ul class="navbar-nav main-nav">
          <li class="nav-item">
            <a
              class="nav-link active"
              role="button"
              href="/index.html#/"
            >專案總覽
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              role="button"
              href="/search.html"
            >篩選及下載</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              role="button"
              href="/history.html"
            >上傳紀錄</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >幫助</a>
            <div class="dropdown-menu dropdown-menu-right">
              <a
                href="/article.html#/faq"
                class="dropdown-item"
              >常見問題</a>
              <a
                href="/article.html#/contact"
                class="dropdown-item"
              >聯絡我們</a>
              <a
                href="/article.html#/private-policy"
                class="dropdown-item"
              >隱私權政策</a>
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
              aria-expanded="false"
            >
              <i class="fa fa-bell"></i>
            </a>
            <div
              id="notification-container"
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="notification"
            >
              <a
                class="dropdown-item notification-item"
                v-for="(msg, mid) in logMessage"
                :key="`log-msg-${mid}`"
              >
                <div class="meta text-gray date">
                  {{msg.updateAt}} 你 上傳了
                </div>
                <h5 class="text-green">
                  <a
                    href="#"
                    class="link"
                  >
                    {{msg.project_id}} {{msg.site}}-{{msg.subSite}} {{msg.camera}}<br /> {{msg.startAt}}-{{msg.endAt}}
                  </a>
                </h5>
                <div
                  class="meta"
                  v-if="msg.status==-1"
                >
                  上傳失敗
                  <a class="text-green link">檢視錯誤</a>
                </div>
                <div
                  class="meta"
                  v-else
                >
                  上傳成功
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
              aria-expanded="false"
            >
              {{loginUser.name}}
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <a
                class="dropdown-item"
                href="setting.html#/"
              >設定</a>
              <a
                class="dropdown-item"
                href="#"
              >登出</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
const logMessage = [
  {
    updateAt: '2018/07/23 17:25',
    project_id: '全島鼬獾',
    site: '屏東處',
    subSite: '潮州站',
    camera: 'PT09A',
    startAt: '2018/06/01',
    endAt: '2018/07/31',
    status: 1, // 1: success, -1: fail
  },
];

export default {
  name: 'TheHeader',
  data() {
    return {
      logMessage,
      loginUser: { name: '黃智賢' },
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
