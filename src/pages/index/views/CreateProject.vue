<template>
  <div class="page-project">
    <div class="container">
      <h1 class="heading">新增計畫</h1>
      <!-- Step 1 -->
      <div v-if="step==1">
        <form class="form form-horizontal">
          <div class="panel">
            <div class="panel-heading">
              <h4>計畫基本資訊</h4>
            </div>
            <div class="panel-body">
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫名稱：</label>
                <div class="col-4">
                  <input
                    type="text"
                    placeholder="請輸入計畫名稱"
                    id="project-name"
                    name="project_name"
                    class="form-control"
                    v-validate="'required'"
                    v-model="form.name"
                    :class="{'is-invalid': errors.has('project_name')}"
                  >
                  <span
                    v-show="errors.has('project_name')"
                    class="invalid-feedback"
                  >
                    計畫名稱不能留空
                    <!-- {{ errors.first('project_name') }} -->
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-slot"
                  class="col-2 required"
                >計畫簡稱：</label>
                <div class="col-4">
                  <input
                    type="text"
                    id="project-slot"
                    name="project_slot"
                    placeholder="請輸入計畫簡稱 (限4字)"
                    class="form-control"
                    v-validate="'required'"
                    v-model="form.slot"
                    :class="{'is-invalid': errors.has('project_slot')}"
                  >
                  <span
                    v-show="errors.has('project_slot')"
                    class="invalid-feedback"
                  >
                    計畫簡稱不能留空
                  </span>
                </div>
                <div class="col-6 pl-0">
                  <span
                    class="btn btn-text px-0"
                    v-tooltip.right="{content: '計畫簡稱為做日後系統顯示之用，您可以輸入任何有助你辨別計畫的文字'}"
                  >
                    <i class="fa fa-info-circle text-green"></i>
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >委辦單位：</label>
                <div class="col-4">
                  <input
                    type="text"
                    id="project-agent"
                    name="project_agent"
                    v-model="form.agency"
                    placeholder="請輸入委辦單位"
                    class="form-control"
                    v-validate="'required'"
                    :class="{'is-invalid': errors.has('project_agent')}"
                  >
                  <span
                    v-show="errors.has('project_agent')"
                    class="invalid-feedback"
                  >
                    委辦單位不能留空
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫編號：</label>
                <div class="col-4">
                  <input
                    type="text"
                    id="project-id"
                    name="adminProjectId"
                    v-validate="'required'"
                    v-model="form.adminProjectId"
                    placeholder="請輸入計畫編號"
                    class="form-control"
                    :class="{'is-invalid': errors.has('adminProjectId')}"
                  >
                  <span
                    v-show="errors.has('adminProjectId')"
                    class="invalid-feedback"
                  >
                    計畫編號不能留空
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫主持人：</label>
                <div class="col-4">
                  <input
                    type="text"
                    id="principal-investigator"
                    name="principalInvestigator"
                    v-validate="'required'"
                    v-model="form.principalInvestigator"
                    placeholder="請輸入計畫主持人"
                    class="form-control"
                    :class="{'is-invalid': errors.has('principalInvestigator')}"
                  >
                  <span
                    v-show="errors.has('principalInvestigator')"
                    class="invalid-feedback"
                  >
                    計畫主持人不能留空
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫時間：</label>
                <div class="col-4">
                  <div
                    class="input-group-wrapper"
                    :class="{'is-invalid': errors.has('project_start') || errors.has('project_end')}"
                  >
                    <div
                      class="input-group"
                      :class="{'is-invalid': errors.has('project_start')}"
                    >
                      <date-picker
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                        v-model="form.startAt"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-text">到</div>
                    <div
                      class="input-group"
                      :class="{'is-invalid': errors.has('project_end')}"
                    >
                      <date-picker
                        :not-before="form.startAt"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        v-model="form.endAt"
                        :first-day-of-week="1"
                      ></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <input
                      type="hidden"
                      id="project_start"
                      name="project_start"
                      v-validate="'required'"
                      v-model="form.startAt"
                    >
                    <input
                      type="hidden"
                      id="project_end"
                      name="project_end"
                      v-validate="'required'"
                      v-model="form.endAt"
                    >
                  </div>
                  <span
                    v-show="errors.has('project_start') || errors.has('project_end')"
                    class="invalid-feedback"
                  >
                    計畫時間不能留空
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2"
                >計畫地區：</label>
                <div class="col-4">
                  <div class="select">
                    <v-select
                      v-model="form.area"
                      :options="options"
                      multiple
                    ></v-select>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2"
                >計畫摘要：</label>
                <div class="col-6">
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    placeholder="請簡單描述計畫目的"
                  ></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2"
                >備註：</label>
                <div class="col-6">
                  <textarea
                    v-model="form.comment"
                    class="form-control"
                    placeholder="您可以輸入任何補註資料"
                  ></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2"
                >計畫封面：</label>
                <div class="col-4">
                  <input
                    type="hidden"
                    v-model="form.cover"
                  >
                  <label class="btn btn-default btn-upload">
                    <input
                      type="file"
                      id="upload"
                      @change="previewPhoto($event)"
                    >
                    <span class="text">選擇檔案</span>
                  </label>
                  <div class="note">
                    <small class="text-gray">
                      您可以為計畫添加封面，理想尺寸是 373 x 180 像素 (.jpg, .png) ，檔案上限為 2 MB。
                    </small>
                  </div>
                  <div
                    class="preview"
                    v-if="isUploadTypeError"
                  >
                    請使用 jpg 或 png 檔
                  </div>
                  <div
                    class="preview"
                    v-else-if="isUploadSizeError"
                  >
                    檔案上限為 2 MB
                  </div>
                  <div
                    class="preview"
                    v-else-if="previewImg!==null"
                  >
                    <div class="image">
                      <img :src="previewImg.src">
                    </div>
                    <div class="content">
                      {{ previewImg.name }}
                    </div>
                    <div class="action">
                      <div
                        class="btn btn-text"
                        @click='removePreview()'
                      >
                        <i class="fa fa-times"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action">
            <router-link
              to="/"
              class="btn btn-default"
            >取消</router-link>
            <button
              type="submit"
              @click.stop.prevent="nextStep()"
              class="btn btn-orange"
            >
              下一步
            </button>
          </div>
        </form>
      </div>
      <!-- Step 2 -->
      <div v-if="step==2">
        <form class="form form-horizontal">
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
                      v-model="licenseForm.forData"
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
                      v-model="licenseForm.forData"
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
                      v-model="licenseForm.forInfo"
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
                      v-model="licenseForm.forImg"
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
                      v-model="licenseForm.forImg"
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
                      v-model="licenseForm.forImg"
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
                  <div
                    class="input-group"
                    :class="{'is-invalid': !form.publicAt}"
                  >
                    <date-picker
                      v-model="form.publicAt"
                      :placeholder="'18/9/20'"
                      :format="'YYYY-MM-DD'"
                      :first-day-of-week="1"
                    />
                    <div class="input-group-append">
                      <i class="icon icon-calendar"></i>
                    </div>
                  </div>
                  <span
                    v-show="!form.publicAt"
                    class="invalid-feedback"
                  >
                    公開日期不能留空
                  </span>
                </div>
                <div class="col-12 pt-2">
                  <small class="text-gray">
                    計畫內的詮釋資料將會直接公開，鑑定資訊、影像資料的<span :class="{'warning': isOverPublicLimit}">公開日期之上限為計畫起始時間的5年後。</span>
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="action">
            <router-link
              to="/"
              class="btn btn-default"
            >
              取消
            </router-link>
            <button
              type="submit"
              @click.stop.prevent="doSubmit()"
              class="btn btn-orange"
            >
              新增計畫
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DatePicker from 'vue2-datepicker';
import { commonMixin } from '../../../mixins/common';
import { cityOptions } from '../../../util/constants';

const project = createNamespacedHelpers('project');

export default {
  name: 'CreateProject',
  mixins: [commonMixin],
  components: { DatePicker },
  data() {
    return {
      step: 1,
      options: cityOptions,
      form: {
        cover: '',
        name: '',
        slot: '',
        agency: '',
        principalInvestigator: '',
        adminProjectId: '',
        startAt: '',
        endAt: '',
        publicAt: '',
        area: '',
        description: '',
        comment: '',
      },
      licenseForm: {
        forData: 'CC0',
        forInfo: 'CC BY 4.0',
        forImg: 'CC0',
      },
      publicAtLimit: null,
      previewImg: null,
    };
  },
  methods: {
    ...project.mapActions(['createProject']),
    doSubmit() {
      if (!this.isOverPublicLimit && this.form.publicAt) {
        this.createProject({
          form: this.form,
          licenseForm: this.licenseForm,
          file: this.previewImg.file || null,
        }).then(() => this.$router.push('/'));
      }
    },
    nextStep() {
      if (this.isUploadTypeError || this.isUploadSizeError) {
        return false;
      }
      this.$validator.validateAll().then(result => {
        if (result) this.step += 1;
        else return false;
      });
    },
  },
  watch: {
    'form.startAt': function(newVal) {
      const startAt = new Date(newVal);
      this.form.publicAt = new Date(startAt.setYear(startAt.getFullYear() + 2));
      this.publicAtLimit = new Date(startAt.setYear(startAt.getFullYear() + 5));
    },
  },
  computed: {
    isOverPublicLimit: function() {
      return this.form.publicAt > this.publicAtLimit;
    },
    isUploadTypeError() {
      if (!this.previewImg) {
        return false;
      }
      if (
        this.previewImg.type === 'image/jpeg' ||
        this.previewImg.type === 'image/png'
      ) {
        return false;
      }
      return true;
    },
    isUploadSizeError() {
      if (!this.previewImg) {
        return false;
      }
      if (this.previewImg.fileSizeMb < 2) {
        return false;
      }
      return true;
    },
  },
};
</script>
