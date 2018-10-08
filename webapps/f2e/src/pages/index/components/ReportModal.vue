<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">相機異常回報</h4>
      </div>
      <div class="modal-body">
        <form action="" class="form form-horizontal">
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">樣區：</label>
            <div class="col-9">
              <v-select v-model="form.site" :options="['屏東處']"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">子樣區：</label>
            <div class="col-9">
              <v-select v-model="form.sub_site" :options="['旗山站']"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">相機位置：</label>
            <div class="col-9">
              <v-select v-model="form.camera" :options="['PT97A']"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">異常資料時間：</label>
            <div class="col-4 input-group-inline">
              <div class="input-group">
                <date-picker v-model="form.start_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                <div class="input-group-append">
                  <i class="icon icon-calendar"></i>
                </div>
              </div>
              <div class="input-text">到</div>
              <div class="input-group">
                <date-picker v-model="form.end_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                <div class="input-group-append">
                  <i class="icon icon-calendar"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">異常狀況：</label>
            <div class="col-9">
              <v-select v-model="form.status" :options="['相機故障（空拍過多）']"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-3 px-0 text-right required">備註：</label>
            <div class="col-9">
              <textarea v-model="form.note" class="form-control"></textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer text-right">
        <a @click="$emit('close')" class="btn btn-default">取消</a>
        <button @click="$emit('submit', form)" class="btn btn-orange">回報異常資料</button>
      </div>
    </div>
  </div>  
</template>

<script>

import DatePicker from 'vue2-datepicker'


export default {
  name: "ReportModal",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DatePicker
  },
  data() {
    return {
      form: {
        start_at: '',
        end_at: '',
        site: '',
        sub_site: '',
        camera: '',
        note: ''
      }
    }
  }

}
</script>

