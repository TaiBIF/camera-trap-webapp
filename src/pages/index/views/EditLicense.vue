<template>
  <div
    class="container page-project-edit"
    v-bind:class="{'loading': isUpdatingData}"
  >
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :projectId="currentProjectId" />
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
                      v-model="licenseForm.metadata"
                      value="CC0"
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
                      v-model="licenseForm.metadata"
                      value="CC BY 4.0"
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
                      v-model="licenseForm.metadata"
                      value="CC BY-NC"
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
                      v-model="licenseForm.data"
                      value="CC BY 4.0"
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
                      v-model="licenseForm.multimedia"
                      value="CC0"
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
                      v-model="licenseForm.multimedia"
                      value="CC BY 4.0"
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
                      v-model="licenseForm.multimedia"
                      value="CC BY-NC"
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
                      v-model="dataPublicDate"
                      :format="'YYYY-MM-DD'"
                      :first-day-of-week="1"
                    ></date-picker>
                    <div class="input-group-append">
                      <i class="icon-calendar"></i>
                    </div>
                  </div>
                </div>
                <div class="col-12 pt-2">
                  <small
                    class="text-danger"
                    v-if="isPublicDateError"
                  >{{isPublicDateError}}</small>
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
              :to="`/project/${$route.params.id}`"
              class="btn btn-default"
            >取消</router-link>
            <button
              type="submit"
              class="btn btn-orange"
              :disabled="!!isPublicDateError"
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
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';
import { commonMixin } from '../../../mixins/common';
import EditNav from '../components/EditNav';
import DatePicker from 'vue2-datepicker';
import CloseWindowDialog from '../components/CloseWindowDialog';
import { editProjectLicenseAndPublicDate } from '../../../service/api';

const project = createNamespacedHelpers('project');

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
      isUpdatingData: false,
      closeWindowOpen: false,
      licenseForm: {
        metadata: '',
        data: '',
        multimedia: '',
      },
      dataPublicDate: '',
    };
  },
  computed: {
    ...project.mapGetters(['getProjectLicense', 'currentProject']),
    currentProjectId() {
      return this.$route.params.id;
    },
    projectStartDate() {
      return this.currentProject.projectStartDate;
    },
    isPublicDateError() {
      if (!this.dataPublicDate) {
        return '公開日期為必填欄位';
      }
      const publicDateLimit = moment(this.projectStartDate).add(5, 'years');

      if (moment(this.dataPublicDate).isAfter(publicDateLimit)) {
        return `公開日期之上限為計畫起始時間(${this.projectStartDate})的5年後`;
      }
      return false;
    },
  },
  methods: {
    ...project.mapActions(['loadSingleProject']),
    async doSubmit() {
      this.isUpdatingData = true;
      await editProjectLicenseAndPublicDate({
        projectId: this.currentProjectId,
        license: this.licenseForm,
        dataPublicDate: this.dataPublicDate,
      });
      this.isUpdatingData = false;
    },
  },
  watch: {
    getProjectLicense(newValue) {
      this.licenseForm = newValue;
    },
    currentProject(newValue) {
      this.dataPublicDate = newValue.dataPublicDate;
    },
  },
  async mounted() {
    this.isUpdatingData = true;
    await this.loadSingleProject(this.currentProjectId);
    this.isUpdatingData = false;
  },
};
</script>
