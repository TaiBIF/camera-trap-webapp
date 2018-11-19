<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg">
        <a
          href="./index.html#/"
          role="button"
          class="navbar-brand"
        >Camara Capture</a>
        <button
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
          class="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <div class="navbar-nav justify-content-md-end subnav">
            <div class="nav-item nav-link">
              <a
                href=""
                class="btn btn-orange"
              >登入</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <router-view />
  </div>
</template>
