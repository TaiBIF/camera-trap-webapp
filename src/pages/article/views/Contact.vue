<template>
  <div class="container">
    <h1 class="text-green">聯絡我們</h1>
    <p class="mb-0">
      對於Camera Trap 的使用有任何問題或回饋嗎？請描述您遇到的狀況，我們會盡快與您聯絡！
    </p>
    <form
      action=""
      class="form"
    >
      <div class="form-group form-group-inline">
        <label class="mr-2">您要回報的類型：</label>
        <div class="radio radio-inline mb-0">
          <input
            type="radio"
            name="reply_type"
            id="reply-type-1"
            v-model="form.type"
            value="1"
          >
          <label for="reply-type-1">問題回報</label>
        </div>
        <div class="radio radio-inline mb-0">
          <input
            type="radio"
            name="reply_type"
            id="reply-type-2"
            v-model="form.type"
            value="2"
          >
          <label for="reply-type-2">意見反饋</label>
        </div>
      </div>
      <div
        v-if="form.type==1"
        class="panel panel-default mb-3"
      >
        <div class="panel-heading">
          <h4>問題回報</h4>
        </div>
        <div class="panel-body">
          <div class="form-group row">
            <label class="col-2 text-right required">問題類型：</label>
            <div class="col-10">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-1"
                  value="1"
                  v-model="form.questType"
                >
                <label for="quest-type-1">系統操作</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-2"
                  value="2"
                  v-model="form.questType"
                >
                <label for="quest-type-2">帳號相關</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-3"
                  value="3"
                  v-model="form.questType"
                >
                <label for="quest-type-3">計畫管理</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-4"
                  value="4"
                  v-model="form.questType"
                >
                <label for="quest-type-4">檔案上傳</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-5"
                  value="5"
                  v-model="form.questType"
                >
                <label for="quest-type-5">資料編輯</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-6"
                  value="6"
                  v-model="form.questType"
                >
                <label for="quest-type-6">篩選及下載</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-7"
                  value="7"
                  v-model="form.questType"
                >
                <label for="quest-type-7">其他問題</label>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">問題描述：</label>
            <div class="col-10">
              <textarea
                v-model="form.decsription"
                cols="30"
                rows="5"
                class="form-control"
                placeholder="請詳述您的問題，我們將儘速與您聯繫"
              >
              </textarea>
            </div>
            <div class="col-10 offset-2 text-gray">
              <small>
                <p>建議您在問題回報中提供以下資訊，讓我們能更精確的為您提供幫助。</p>
                <ul>
                  <li>明確且詳細的問題說明</li>
                  <li>重現問題狀況的確切步驟</li>
                  <li>出現問題的螢幕截圖或影片連結 (建議)</li>
                  <li>您認為可能對找出和解決問題有幫助的所有其他資訊</li>
                </ul>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">您的電子郵件：</label>
            <div class="col-10">
              <input
                type="email"
                v-model="form.email"
                class="form-control"
                placeholder="請輸入您的電子郵件"
              >
              <div class="note">
                <small class="text-gray">
                  我們將透過電子郵件與您聯繫此問題的相關事宜，您的電子郵件不會被分享，或用於任何其他用途。
                </small>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">附件：</label>
            <div class="col-10">
              <label class="btn btn-upload">
                <input
                  type="file"
                  name="upload"
                  id="upload"
                >
                <span class="text">添加附加檔案</span>
              </label>
              <div class="note">
                <small class="text-gray">
                  附加螢幕截圖、資料、圖片或影片檔案<br />
                  (.csv, .tsv, .tab, .txt, .xls, .xlsx, .jpg, .png, .mp4, .avi, .mov, .mpg, .mpeg) ，檔案容量上限為 20 MB
                </small>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-10 offset-2">
              <vue-recaptcha sitekey="6LcILnYUAAAAAJLerKtPwnZGD3NICCfDKThGOW6j">
                <button>I am not ROBOT</button>
              </vue-recaptcha>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="form.type==1"
        class="action"
      >
        <button
          type="reset"
          class="btn btn-green-border"
        >取消</button>
        <button
          type="submit"
          class="btn btn-orange"
        >確認送出</button>
      </div>
      <div
        v-if="form.type==2"
        class="panel panel-default mb-3"
      >
        <div class="panel-heading">
          <h4>意見反饋</h4>
        </div>
        <div class="panel-body">
          <div class="form-group row">
            <label class="col-2 text-right required">意見類型：</label>
            <div class="col-10">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-1"
                  value="1"
                  v-model="form.comment_type"
                >
                <label for="comment-type-1">系統操作</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-2"
                  value="2"
                  v-model="form.comment_type"
                >
                <label for="comment-type-2">帳號相關</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-3"
                  value="3"
                  v-model="form.comment_type"
                >
                <label for="comment-type-3">計畫管理</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-4"
                  value="4"
                  v-model="form.comment_type"
                >
                <label for="comment-type-4">檔案上傳</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-5"
                  value="5"
                  v-model="form.comment_type"
                >
                <label for="comment-type-5">資料編輯</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-6"
                  value="6"
                  v-model="form.comment_type"
                >
                <label for="comment-type-6">篩選及下載</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="comment-type-7"
                  value="7"
                  v-model="form.comment_type"
                >
                <label for="comment-type-7">其他問題</label>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">問題描述：</label>
            <div class="col-10">
              <textarea
                v-model="form.decsription"
                cols="30"
                rows="5"
                class="form-control"
                placeholder="和我們分享您的使用經驗，有哪些方面比較順利？有哪些地方需要改進？"
              >
              </textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">您的電子郵件：</label>
            <div class="col-10">
              <input
                type="email"
                v-model="form.email"
                class="form-control"
                placeholder="請輸入您的電子郵件"
              >
              <div class="note">
                <small class="text-gray">
                  我們將透過電子郵件與您聯繫此問題的相關事宜，您的電子郵件不會被分享，或用於任何其他用途。
                </small>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">附件：</label>
            <div class="col-10">
              <label class="btn btn-upload">
                <input
                  type="file"
                  name="upload"
                  id="upload"
                >
                <span class="text">添加附加檔案</span>
              </label>
              <div class="note">
                <small class="text-gray">
                  附加螢幕截圖、資料、圖片或影片檔案<br />
                  (.csv, .tsv, .tab, .txt, .xls, .xlsx, .jpg, .png, .mp4, .avi, .mov, .mpg, .mpeg) ，檔案容量上限為 20 MB
                </small>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-10 offset-2">
              <vue-recaptcha sitekey="6LcILnYUAAAAAJLerKtPwnZGD3NICCfDKThGOW6j">
                <button>I am not ROBOT</button>
              </vue-recaptcha>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="form.type==2"
        class="action"
      >
        <button
          type="reset"
          class="btn btn-green-border"
        >取消</button>
        <button
          type="submit"
          class="btn btn-orange"
        >確認送出</button>
      </div>
      <div v-if="form.type==''">
        <router-link
          to="/faq"
          class="btn btn-green-border"
        >
          返回常見問題
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
  name: 'Contact',
  components: { VueRecaptcha },
  data() {
    return {
      form: {
        type: '',
        decsription: '',
        questType: [1],
      },
    };
  },
};
</script>
