<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :project_id="1" />
      </div>
      <div class="col-10 pt-3">
        <!-- 計畫基本資訊 -->
        <form
          class="form form-horizontal"
          @submit.stop.prevent="nextStep()"
        >
          <div class="panel">
            <div class="panel-heading">
              <h4>基本資訊</h4>
            </div>
            <div class="panel-body">
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫名稱：</label>
                <div class="col-5">
                  <input
                    type="text"
                    id="project-name"
                    v-model="form.name"
                    placeholder="請輸入計畫名稱"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫簡稱：</label>
                <div class="col-5">
                  <input
                    type="text"
                    id="project-name"
                    v-model="form.slot"
                    placeholder="請輸入計畫簡稱 (限4字)"
                    class="form-control"
                  >
                </div>
                <div class="col-5 pl-0">
                  <span
                    class="btn btn-text px-0"
                    v-tooltip.right="{ content: '專案簡稱為做日後系統顯示之用，您可以輸入任何有助你辨別專案的文字' }"
                  >
                    <i class="icon-info"></i>
                  </span>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >委辦單位：</label>
                <div class="col-5">
                  <input
                    type="text"
                    id="project-name"
                    v-model="form.agency"
                    placeholder="請輸入委辦單位"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫編號：</label>
                <div class="col-5">
                  <input
                    type="text"
                    id="project-name"
                    v-model="form.no"
                    placeholder="請輸入計畫編號"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫主持人：</label>
                <div class="col-5">
                  <input
                    type="text"
                    id="project-name"
                    v-model="form.principalInvestigator"
                    placeholder="請輸入計畫主持人"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2 required"
                >計畫時間：</label>
                <div class="col-5 input-group-inline">
                  <div class="input-group">
                    <date-picker
                      v-model="form.start_at"
                      :placeholder="'18/9/20'"
                      :format="'YY/M/DD'"
                      :first-day-of-week="1"
                    ></date-picker>
                    <div class="input-group-append">
                      <i class="icon-calendar"></i>
                    </div>
                  </div>
                  <div class="input-text">到</div>
                  <div class="input-group">
                    <date-picker
                      v-model="form.end_at"
                      :placeholder="'18/9/20'"
                      :format="'YY/M/DD'"
                      :first-day-of-week="1"
                    ></date-picker>
                    <div class="input-group-append">
                      <i class="icon-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="project-name"
                  class="col-2"
                >計畫地區：</label>
                <div class="col-5">
                  <div class="select">
                    <v-select v-model="form.area"></v-select>
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
                <div class="col-5">
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
                      您可以為專案添加封面，理想尺寸是 373 x 180 像素 (.jpg, .png) ，檔案上限為 2 MB。
                    </small>
                  </div>
                  <div
                    class="preview"
                    v-if="previewImg!==null"
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
              to="/project/1"
              class="btn btn-default"
            >返回</router-link>
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
import DatePicker from 'vue2-datepicker';
import EditNav from '../components/EditNav';
import CloseWindowDialog from '../components/CloseWindowDialog';

export default {
  name: 'EditInfo',
  mixins: [commonMixin],
  components: {
    EditNav,
    DatePicker,
    CloseWindowDialog,
  },
  data() {
    return {
      closeWindowOpen: false,
      form: {
        cover: '',
        name: '',
        slot: '',
        agency: '',
        owner: '',
        start_at: '',
        end_at: '',
        public_at: '',
        area: '',
        description: '',
        comment: '',
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
