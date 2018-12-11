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
          <h4 class="modal-title">申請新增欄位</h4>
        </div>
        <div class="modal-body">
          <p>
            為了幫助後續的資料使用，Camera Trap 平台統一計畫內的欄位規則，讓所有用戶都能參照相同規則填入資訊。若預設欄位中沒有您需要的欄位項目，請您填入以下資訊並送出申請，本平台會盡快審核再通知您。
          </p>
          <form
            action=""
            class="form form-horizontal"
          >
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >欄位名稱：</label>
              <div class="col-8">
                <input
                  type="text"
                  v-model="form.label"
                  class="form-control"
                  placeholder="請填寫欄位名稱"
                >
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >欄位形式：</label>
              <div class="col-8">
                <v-select
                  v-model="form.type"
                  @input="changeType"
                  :options="options"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right required"
              >輸入格式：</label>
              <div
                class="col-8 input-group-inline"
                v-if="form.type === '輸入框'"
              >
                <input
                  v-if="form.type !== '下拉選單'"
                  type="text"
                  v-model="form.widget_date_format"
                  class="form-control"
                  placeholder="請填寫輸入格式"
                >
                <v-select
                  class="full-width-select"
                  v-else
                  v-model="form.widget_select_options"
                  :options="[]"
                  multiple
                  taggable
                  ref="select"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right"
              >備註：</label>
              <div class="col-9 input-group-inline">
                <textarea
                  v-model="form.description"
                  class="form-control"
                  placeholder="請輸入備註內容"
                ></textarea>
              </div>
              <div
                class="col-8 input-group-inline"
                v-if="form.type === '日期時間'"
              >
                <input
                  type="datetime"
                  v-model="form.description"
                  class="form-control"
                  disabled
                  placeholder="請填寫輸入格式"
                >
              </div>
              <div
                class="col-8 input-group-inline"
                v-if="form.type === '下拉選單'"
              >
                <v-select
                  style="width: 100%;"
                  name="description"
                  v-model="form.description"
                  taggable
                  multiple
                />
              </div>
              <div class="col-1 pl-0">
                <span
                  v-if="form.type === '輸入框' || form.type === '日期時間'"
                  class="btn btn-text px-0"
                  v-tooltip.right="{ content: '您可以規範此欄位的內容格式，以供後續使用者參考' }"
                >
                  <i class="icon-info"></i>
                </span>
                <span
                  v-if="form.type === '下拉選單'"
                  class="btn btn-text px-0"
                  v-tooltip.right="{ content: '請鍵入下拉選單選項，選項內容鍵入完畢後請按下enter鍵，繼續輸入下個選項' }"
                >
                  <i class="icon-info"></i>
                </span>
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right"
              >備註：</label>
              <div class="col-8 input-group-inline">
                <textarea
                  v-model="form.note"
                  cols="30"
                  rows="3"
                  class="form-control"
                  placeholder="請輸入備註內容"
                ></textarea>
              </div>
              <div class="col-1 pl-0">
                <span
                  class="btn btn-text px-0"
                  v-tooltip.right="{ content: '您可以簡易的向管理員說明此次新增的需求，或任何需要補充說明的內容，作為管理員審核參考' }"
                >
                  <i class="icon-info"></i>
                </span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer text-right">
          <div
            class="error-message inline float-left"
            v-if="error"
          >
            <span class="alert-box"></span>
            <span class="text">您尚未建立選單項目</span>
          </div>
          <a
            @click="$emit('close')"
            class="btn btn-default"
          >取消</a>
          <button
            @click="submit()"
            class="btn btn-orange"
            :disabled="isSelectOptionsMissing"
          >送出申請</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewColumnModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      error: false,
      form: {
        label: '',
        type: '輸入欄',
        widget_date_format: '',
        widget_select_options: [],
        description: '',
        note: '',
      },
      selectOptionsLength: 0,
    };
  },
  computed: {
    isSelectOptionsMissing() {
      return (
        this.form.type === '下拉選單' &&
        this.form.widget_select_options.length === 0
      );
    },
  },
  watch: {
    // re-focus to select after click enter
    'form.widget_select_options': function(newValue) {
      if (newValue.length > this.selectOptionsLength) {
        this.selectOptionsLength = newValue.length;
        this.$refs.select.$el.querySelector('input').focus();
      }
    },
  },
  methods: {
    updateDespValue() {
      // console.log(select);
      // debugger;
    },
    changeType() {
      switch (this.form.type) {
        case '日期時間':
          this.form.description = 'YY/MM/DD hh:mm';
          break;
        case '下拉選單':
          this.form.description = [];
          break;
        default:
          this.form.description = '';
          break;
      }
    },
    submit() {
      // submit form
      this.error = false;
      if (this.form.type === '下拉選單' && !this.form.description.length) {
        this.error = true;
      } else {
        this.$emit('submit', this.form);
      }
    },
  },
};
</script>
