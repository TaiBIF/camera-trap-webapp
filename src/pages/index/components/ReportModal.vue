<template>
  <div
    class="modal fade"
    :class="{'in': open}"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">相機異常回報</h4>
        </div>
        <div class="modal-body">
          <form
            action=""
            class="form form-horizontal"
          >
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >樣區：</label>
              <div class="col-9">
                <v-select
                  v-model="form.site"
                  :options="siteOptions"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >子樣區：</label>
              <div class="col-9">
                <v-select
                  v-model="form.subSite"
                  :options="subSiteOptions"
                  resetOnOptionsChange
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >相機位置：</label>
              <div class="col-9">
                <v-select
                  v-model="form.camera"
                  :options="cameraOptions"
                  resetOnOptionsChange
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >異常資料時間：</label>
              <div class="col-6 input-group-inline">
                <div class="input-group">
                  <date-picker
                    v-model="form.startAt"
                    :placeholder="'2018-09-20'"
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-text">到</div>
                <div class="input-group">
                  <date-picker
                    v-model="form.endAt"
                    :placeholder="'2018-09-20'"
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >異常狀況：</label>
              <div class="col-9">
                <v-select
                  v-model="form.status"
                  :options="abnormalType"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right"
              >備註：</label>
              <div class="col-9">
                <textarea
                  v-model="form.note"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer text-right">
          <a
            @click="$emit('close')"
            class="btn btn-default"
          >取消</a>
          <button
            @click="submit()"
            class="btn btn-orange"
            :disabled="isFormRequiredMissing"
          >回報異常資料</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DatePicker from 'vue2-datepicker';
import moment from 'moment';

const auth = createNamespacedHelpers('auth');

export default {
  name: 'ReportModal',
  props: {
    options: {
      type: Array,
    },
    defaultValue: {
      type: Object,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DatePicker,
  },
  data() {
    return {
      form: {
        startAt: '',
        endAt: '',
        site: '',
        subSite: '',
        camera: '',
        note: '',
        status: '',
      },
      abnormalType: [
        '相機故障（空拍過多',
        '相機故障 (沒有影像)',
        '相機失竊',
        '相機電量耗損過快',
        '其他',
      ],
    };
  },
  watch: {
    open: function() {
      Object.assign(this.form, this.defaultValue);
    },
  },
  computed: {
    ...auth.mapGetters(['loginUser']),
    siteOptions() {
      return this.options.map(v => v.id);
    },
    subSiteOptions() {
      return this.form.site
        ? this.options
            .find(v => v.id === this.form.site)
            .children.map(v => v.id)
        : [];
    },
    cameraOptions() {
      const tmp =
        this.form.site && this.form.subSite
          ? this.options
              .find(v => v.id === this.form.site)
              .children.find(v => v.id === this.form.subSite)
          : undefined;

      return tmp ? Object.keys(tmp.cameraList) : [];
    },
    cameraMD5() {
      const tmp =
        this.form.site && this.form.subSite
          ? this.options
              .find(v => v.id === this.form.site)
              .children.find(v => v.id === this.form.subSite)
          : undefined;

      return tmp ? tmp.cameraList : [];
    },
    isFormRequiredMissing() {
      if (
        !this.form.site ||
        !this.form.subSite ||
        !this.form.camera ||
        !this.form.startAt ||
        !this.form.endAt ||
        !this.form.status
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    submit() {
      console.log(moment(this.form.startAt).format('YYYY-MM-DD'));
      this.$emit('close');
      this.$emit('submit', {
        site: this.form.site,
        subSite: this.form.subSite,
        cameraLocation: this.form.camera,
        fullCameraLocationMd5: this.cameraMD5[this.form.camera],
        abnormalStartDate: moment(this.form.startAt).format('YYYY-MM-DD'),
        abnormalEndDate: moment(this.form.endAt).format('YYYY-MM-DD'),
        abnormalType: this.form.status,
        remarks: this.form.note,
        userId: this.loginUser.userId,
        userName: this.loginUser.name,
      });
    },
  },
};
</script>
