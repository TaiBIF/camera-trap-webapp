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
              <div class="col-9">
                <input
                  type="text"
                  v-model="form.name"
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
              <div class="col-9">
                <v-select
                  v-model="form.type"
                  :options="['輸入框']"
                />
              </div>
            </div>
            <div class="form-group row">
              <label
                for=""
                class="col-3 px-0 text-right"
              >輸入格式：</label>
              <div class="col-4 input-group-inline">
                <input
                  type="text"
                  v-model="form.description"
                  class="form-control"
                  placeholder="請填寫輸入格式"
                >
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
  },
  data() {
    return {
      form: {
        name: '',
        type: '',
        description: '',
      },
    };
  },
  methods: {
    submit() {
      // submit form
      this.$emit('submit', this.form);
    },
  },
};
</script>
