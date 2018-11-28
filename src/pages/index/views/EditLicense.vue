<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :project_id="1" />
      </div>
      <div class="col-10 pt-3">
        <!-- 創用 CC 授權 -->
        <form
          class="form form-horizontal"
          @submit.stop.prevent="doSubmit()"
        >
          <div class="panel">
            <div class="panel-heading">
              <h4>創用CC授權許可</h4>
            </div>
            <div class="panel-body">
              <p>
                授權計畫內的詮釋資料、鑑定資訊與影像資訊讓其他遵守授權條款的用戶不必向您詢問許可，即能合法使用其中資料。「Camera Trap 監測資料管理平台」使用您的創用 CC 授權內容，來與像是全球生物多樣性資訊機構（GBIF），一個專門編輯發佈全球生物多樣化訊息之國際政府間組織如此般的資料合作者共享內容。 了解<a
                  href="http://creativecommons.tw/"
                  target="_blank"
                >創用 CC 授權內容</a>。
              </p>
              <div class="form-group">
                <label for="">詮釋資料：</label>
                <div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-data-1"
                      v-model="licenseForm.forData"
                      value="1"
                    >
                    <label for="for-data-1">
                      <img
                        src="/assets/common/cc-0.png"
                        height="40px"
                        srcset="/assets/common/cc-0@2x.png"
                      >
                      <span class="text">無著作權 (CC0)</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-data-2"
                      v-model="licenseForm.forData"
                      value="2"
                    >
                    <label for="for-data-2">
                      <img
                        src="/assets/common/cc-1.png"
                        height="40px"
                        srcset="/assets/common/cc-1@2x.png"
                      >
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-data-3"
                      v-model="licenseForm.forData"
                      value="3"
                    >
                    <label for="for-data-3">
                      <img
                        src="/assets/common/cc-2.png"
                        height="40px"
                        srcset="/assets/common/cc-2@2x.png"
                      >
                      <span class="text">姓名標示-非商業性</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="">鑑定資訊：</label>
                <div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-info-1"
                      v-model="licenseForm.forInfo"
                      value="1"
                    >
                    <label for="for-info-1">
                      <img
                        src="/assets/common/cc-1.png"
                        height="40px"
                        srcset="/assets/common/cc-1@2x.png"
                      >
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="">影像資料：</label>
                <div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-img-1"
                      v-model="licenseForm.forImg"
                      value="1"
                    >
                    <label for="for-img-1">
                      <img
                        src="/assets/common/cc-0.png"
                        height="40px"
                        srcset="/assets/common/cc-0@2x.png"
                      >
                      <span class="text">無著作權 (CC0)</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-img-2"
                      v-model="licenseForm.forImg"
                      value="2"
                    >
                    <label for="for-img-2">
                      <img
                        src="/assets/common/cc-1.png"
                        height="40px"
                        srcset="/assets/common/cc-1@2x.png"
                      >
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input
                      type="radio"
                      id="for-img-3"
                      v-model="licenseForm.forImg"
                      value="3"
                    >
                    <label for="for-img-3">
                      <img
                        src="/assets/common/cc-2.png"
                        height="40px"
                        srcset="/assets/common/cc-2@2x.png"
                      >
                      <span class="text">姓名標示-非商業性</span>
                    </label>
                  </div>
                </div>
              </div>
              <hr>
              <div class="form-group row">
                <label
                  for=""
                  class="pl-3 required"
                >公開日期：</label>
                <div class="d-inline-block pl-3">
                  <div class="input-group">
                    <date-picker
                      v-model="licenseForm.public_at"
                      :placeholder="'18/9/20'"
                      :format="'YYYY-MM-DD'"
                      :first-day-of-week="1"
                    ></date-picker>
                    <div class="input-group-append">
                      <i class="icon-calendar"></i>
                    </div>
                  </div>
                </div>
                <div class="col-12 pt-2">
                  <small class="text-gray">
                    計畫內的詮釋資料將會直接公開，鑑定資訊、影像資料的公開日期之上限為計畫起始時間的5年後。
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="action">
            <router-link
              to="/overview"
              class="btn btn-default"
            >取消</router-link>
            <button
              type="submit"
              class="btn btn-orange"
            >儲存設定</button>
          </div>
        </form>
      </div>
    </div>
    <close-window-dialog
      :open="closeWindowOpen"
      @close="closeWindowOpen=false"
    />
  </div>
</template>

<script>
import { commonMixin } from '../../../mixins/common';
import EditNav from '../components/EditNav';
import DatePicker from 'vue2-datepicker';
import CloseWindowDialog from '../components/CloseWindowDialog';

export default {
  name: 'EditLicense',
  mixins: [commonMixin],
  components: {
    EditNav,
    DatePicker,
    CloseWindowDialog,
  },
  data() {
    return {
      closeWindowOpen: false,
      licenseForm: {
        forData: '',
        forInfo: '',
        forImg: '',
        public_at: '',
      },
    };
  },
  methods: {
    doSubmit() {
      this.$router.push('/');
    },
  },
};
</script>
