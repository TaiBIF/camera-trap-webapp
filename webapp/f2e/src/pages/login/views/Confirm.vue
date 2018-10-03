<template>
  <main class="page-login">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="panel mt-5">
            <div class="panel-body text-center pt-5">
              <img src="/assets/common/logo-lg.png" height="81" srcset="/assets/common/logo-lg@2x.png">
              <h5 class="mt-5">透過您的 ORCID 帳號登入</h5>
              <p class="text-gray">本系統將會取用您的電子郵件、姓名及ORCID ID</p>
            </div>
          </div>
          <div class="action text-center">
            <div class="btn btn-default">
              取消
            </div>
            <div class="btn btn-orange">
              確定
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Login"
}
</script>
