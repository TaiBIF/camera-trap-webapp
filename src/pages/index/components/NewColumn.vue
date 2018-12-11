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
          <form class="form form-horizontal">
            <div class="form-group row">
              <label
                for="label"
                class="col-3 px-0 text-right required"
              >欄位名稱：</label>
              <div class="col-8">
                <input
                  id="label"
                  type="text"
                  v-model="form.label"
                  class="form-control"
                  placeholder="請填寫欄位名稱"
                >
              </div>
            </div>
            <div class="form-group row">
              <label
                for="columnType"
                class="col-3 px-0 text-right required"
              >欄位形式：</label>
              <div class="col-8">
                <v-select
                  id="columnType"
                  v-model="form.type"
                  @input="switchType"
                  :options="options"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for="format"
                class="col-3 px-0 text-right required"
              >輸入格式：</label>
              <div class="col-8 input-group-inline">
                <input
                  v-if="form.type === '輸入欄'"
                  id="format"
                  type="text"
                  v-model="form.widgetStringFormat"
                  class="form-control"
                  placeholder="請填寫輸入格式"
                >
                <input
                  v-if="form.type === '日期選擇'"
                  id="format"
                  type="datetime"
                  v-model="form.widget_date_format"
                  class="form-control"
                  placeholder="請填寫輸入格式"
                >
                <v-select
                  v-if="form.type === '下拉選單'"
                  id="format"
                  class="full-width-select hide-autocomplete"
                  v-model="form.widget_select_options"
                  :options="[]"
                  multiple
                  taggable
                  ref="select"
                />
              </div>
              <div class="col-1 pl-0">
                <span
                  v-if="form.type === '輸入欄' || form.type === '日期選擇'"
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
                for="description"
                class="col-3 px-0 text-right"
              >備註：</label>
              <div class="col-8 input-group-inline">
                <textarea
                  id="description"
                  v-model="form.description"
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
            v-if="isSelectOptionsMissing"
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
        widgetStringFormat: null,
        widget_date_format: null,
        widget_select_options: null,
        description: '',
      },
      selectOptionsLength: 0,
    };
  },
  computed: {
    isSelectOptionsMissing() {
      return (
        this.form.type === '下拉選單' &&
        (!this.form.widget_select_options ||
          this.form.widget_select_options.length === 0)
      );
    },
  },
  watch: {
    // re-focus to select after click enter
    'form.widget_select_options': function(newValue) {
      if (newValue && newValue.length > this.selectOptionsLength) {
        this.selectOptionsLength = newValue.length;
        this.$refs.select.$el.querySelector('input').focus();
      }
    },
  },
  methods: {
    switchType() {
      // reset input
      this.form.widgetStringFormat = null;
      this.form.widget_date_format = null;
      this.form.widget_select_options = null;

      if (this.form.type === '日期選擇') {
        this.form.widget_date_format = 'YY/MM/DD hh:mm';
      } else if (this.form.type === '下拉選單') {
        this.form.widget_select_options = [];
      }
    },
    submit() {
      this.$emit('submit', this.form);
    },
  },
};
</script>
