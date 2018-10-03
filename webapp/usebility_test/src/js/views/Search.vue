<template>
  <div class="page-search">
    <div class="container-fluid pt-3">
      <h4 class="text-green">資料搜尋</h4>
      <div class="card">
        <div class="card-body p-5">
          <form class="form">
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label for="project">
                    <span class="text-danger">*</span>專案名稱：
                  </label>
                  <div class="row">
                    <div class="col-12">
                      <v-select v-model="form.project" multiple :options="projectOption" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="project">
                    <span class="text-danger">*</span>資料開始時間：
                  </label>
                  <div class="row">
                    <div class="col-6 pr-0">
                      <date-picker lang="zh-TW" v-model="form.start_at.date" :first-day-of-week="1"></date-picker>
                    </div>
                    <div class="col-6">
                      <time-input v-model="form.start_at.time" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="project">
                    <span class="text-danger">*</span>資料結束時間：
                  </label>
                  <div class="row">
                    <div class="col-6 pr-0">
                      <date-picker lang="zh-TW" v-model="form.end_at.date" :first-day-of-week="1"></date-picker>
                    </div>
                    <div class="col-6">
                      <time-input v-model="form.start_at.time" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="form-group">
                  <label for="project">
                    物種：
                  </label>
                  <v-select v-model="form.species" multiple :options="speciesOption" />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="project">
                    資料狀態
                  </label>
                  <v-select v-model="form.state" multiple :options="stateOption" />
                </div>
              </div>
            </div>
            
            <a class="mt-5 mb-2" @click="advOpen=!advOpen">
              進階搜尋 
              <i class="icon" 
              :class="{
                'icon-chevron-up': advOpen,
                'icon-chevron-down': !advOpen
              }"></i>
            </a>
            <div class="row" v-if="advOpen">
              <div class="col-3">
                <div class="form-group">
                  <label for="">性別：</label>
                  <v-select v-model="form.gender" multiple :options="['公', '母']" />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="">性別：</label>
                  <v-select v-model="form.age" multiple :options="['成體', '亞成體', '幼體']" />
                </div>
              </div>
              <div class="col-5">
                <div class="form-group">
                  <label for="">角況：</label>
                  <v-select v-model="form.horn" multiple :options="['茸角', '茸角一尖', '茸角一岔二尖']" />
                </div>
              </div>
              <div class="col-5">
                <div class="form-group">
                  <label for="">每日活動時間：</label>
                  <div class="row">
                    <div class="col-5">
                      <time-input v-model="form.time.start" />
                    </div>
                    <div class="col-1">至</div>
                    <div class="col-5">
                      <time-input v-model="form.time.end" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 text-right">
                <button type="reset" class="btn btn-outline-secondary">
                  清空
                </button>
                <button type="submit" class="btn btn-warning px-5" @click.stop.prevent="doSearch()">
                  搜尋
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import vSelect from 'vue-select'
import DatePicker from 'vue2-datepicker'
import TimeInput from '../components/Form/TimeInput'

export default {
  name: "Search",
  components: {vSelect, DatePicker, TimeInput},
  data() {
    return {
      stateOption: ['具參考價值', '待專家檢定', '已標註完成'],
      projectOption: ['新竹狂犬病監測','林務局全島鼬獾監測', '關山野生動物重要棲息環境...', '利嘉野生動物重要棲息環境...', '國家生物多樣性監測與報告', '林務局全島鼬獾監測'],
      speciesOption: ['測試', '鼬獾', '鳥', '空拍', '山羌', '松鼠', '白鼻心', '獼猴', '食蟹獴', '野豬', '穿山甲'],
      advOpen: false,
      form: {
        project: [],
        start_at: {
          date: '',
          time: ''
        },
        end_at: {
          date: '',
          time: ''
        },
        species: [],
        state: [],
        gender: [],
        age: [],
        horn: [],
        time: {
          start: '',
          end: ''
        }
      }
    }
  },
  methods: {
    doSearch() {
      this.$router.push('/result')
    }
  },
  beforeMount () {

  },
  mounted() {

  }
}
</script>
