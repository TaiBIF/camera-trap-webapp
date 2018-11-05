<template>
  <div class="container">
    <h1 class="text-green">設定</h1>
    <div class="panel panel-default mb-3">
      <div class="panel-heading">
        <h4>帳號設定</h4>
      </div>
      <div class="panel-body">
        <form action="" class="form">
          <div class="form-group row">
            <label class="required col-2 text-right">
              帳號連結：
            </label>
            <div class="col-6">
              <a class="btn btn-orcid">
                <span class="icon"><i class="icon-orcid"></i></span>
                <span class="text">已連結至ORCID 帳號</span>
              </a>
              <small class="note d-block text-gray">
                本帳號已連結您的 ORCID 帳號，若要修改帳號資訊或密碼，請連結至 ORCID
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="required col-2 text-right">
              使用者名稱：
            </label>
            <div class="col-6">
              <v-select :options="[{label:'Cindy Gu', value: '1'}]" v-model="form.name" />
              <small class="note d-block text-gray">
                您對外公開的稱呼
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">
              電子郵件：
            </label>
            <div class="col-6">
              <v-select :options="[{label:'cindy@gmail.com', value: '1'}]" v-model="form.email" />
              <small class="note d-block text-gray">
                此電子郵件僅作通知及聯絡用途
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4>快速鍵設定</h4>
      </div>
      <div class="panel-body p-0">
        <div class="gray-block">
          <div class="row">
            <div class="col-10">
              鍵盤快速鍵能幫助您提高工作效率，您可以使用本平台預設快速鍵設定，或是自行創建屬於您習慣的快速鍵設定。<br/>
              * 提醒您：您可以設定任一英文字、數字作為輸入物種時的快速鍵，但不接受空白鍵和符號
            </div>
            <div class="col-2 text-right">
              <button class="btn btn-basic btn-sm mt-2">回復預設值</button>
            </div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>物種名稱</th>
              <th>鍵盤快速鍵</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="22%">
                <v-select :options="[{label:'空拍', value: '1'}]" />
              </td>
              <td width="22%">
                <v-select :options="[{label:'SP', value: '1'}]" />
              </td>
              <td class="text-right">
                <a class="close"><i class="icon-remove"></i></a>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="add">
                <a class="btn btn-block btn-text text-green text-left">
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增快速鍵</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="action">
      <button class="btn btn-green-border">
        取消
      </button>
      <button type="submit" class="btn btn-orange">
        儲存設定
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      form: {
        name: 'Cindy Gu',
        email: 'cindy@gmail.com'
      }
    }
  }
}
</script>
