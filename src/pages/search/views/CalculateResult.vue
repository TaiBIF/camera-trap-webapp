<template>
  <div class="maintain page-sheet">
    <div class="search-container">
      <div class="col-12 pt-2">
        <div class="float-right">
          <a class="btn btn-green-border btn-sm" v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'">
            <span class="icon"><i class="icon-download-green"></i></span>
            <span class="text">下載篩選結果</span>
          </a>
          <button class="btn btn-orange btn-sm ml-2">計算</button>
        </div>
        <router-link to="/"><small class="text-gray"><i class="fa fa-chevron-left"></i> 返回資料篩選及計算</small></router-link>
        <h3 class="text-green mb-2 mt-2">資料計算結果</h3>
      </div>
      <form action="" class="form filter-form">
        <div class="col-12">
          <h6 class="text-gray mt-3">資料來源</h6>
        </div>
        <div class="row mx-0">
          <div class="col-3">
            <div class="form-group">
              <label for="">計畫名稱：</label>
              <v-select :placeholder="'請選擇計畫名稱'"></v-select>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label for="">樣區：</label>
                  <v-select :placeholder="'請選擇樣區'"></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="">子樣區：</label>
                  <v-select :placeholder="'請選擇子樣區'"></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="">相機位置：</label>
                  <v-select :placeholder="'請選擇相機位置'"></v-select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>物種：</label>
                  <v-select :options="[{label:'山羌', value:'山羌'},{label:'鼬獾', value:'鼬獾'},{label:'台灣獼猴', value:'台灣獼猴'},{label:'山羊', value:'山羊'},{label:'赤腹松鼠', value:'赤腹松鼠'},{label:'白鼻心', value:'白鼻心'}]" multiple />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <div class="form-group">
                  <label>資料起始時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker v-model="form.start_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker v-model="form.start_time" format=""></vue-timepicker>
                    </div>
                  </div>
                </div>
              </div>
              <span class="align-self-center px-2">
                到
              </span>
              <div class="col-5">
                <div class="form-group">
                  <label>資料結束時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker v-model="form.end_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker v-model="form.end_time" format=""></vue-timepicker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label>有效照片判定間隔：</label>
                  <v-select></v-select>
                </div>
                <div class="form-group">
                  <label>目擊事件判斷間隔：</label>
                  <v-select></v-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="sheet-container">
      <div class="sheet">
        <div id="spreadsheet"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import VueTimepicker from 'vue2-timepicker'
import Handsontable from 'handsontable'
import 'handsontable/languages/all'
import ZoomDrag from '../../index/components/ZoomDrag'

// debugger

export default {
  name: 'CalculateResult',
  data () {
    return {
      today: moment(),
      isRender: false,
      isContinuous: false,
      continuousTime: 1,
      form: {
        camera: [],
        start_at: '',
        end_at: '',
        start_time: {
          HH: '10',
          mm: '05'
        },
        end_time: {
          HH: '10',
          mm: '05'
        }
      },
      row_data: [],
      rowData: {},
      settings: {
        data: [],
        columns: [
          {
            data: 'item',
            type: 'text',
            editor: false
          },
          {
            data: 'result',
            type: 'text',
            width: 200,
            editor: false
          }
        ],
        language: 'zh-TW',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
          '項目',
          '計算結果'
        ],
        width: 'auto',
        manualRowMove: true,
        manualColumnMove: true,
        filters: true,
        contextMenu: false,
        dropdownMenu: true,
        afterSelectionEnd: (r) => {
          this.currentRow = r
        }
      },
      sheetContainer: null,
      sheet: null
    }
  },
  watch: {
    'currentRow': 'recordUpdate'
  },
  components: {
    DatePicker, VueTimepicker, ZoomDrag
  },
  methods: {
    dragStart () {
      this.isDrag = true
    },
    dragMove (e) {
      if (!this.isDrag) return
      this.galleryWidth = window.innerWidth - e.pageX
    },
    dragEnd () {
      this.isDrag = false
    },
    getSheetData () {
      this.row_data = [
        {
          item: '相機工作時數',
          result: '306 小時'
        },
        {
          item: '有效照片',
          result: '1,360 張'
        },
        {
          item: '目擊事件',
          result: '45 次'
        },
        {
          item: '平均偵測天數比例',
          result: '15 %'
        },
        {
          item: '有效照片除以相機工作時長',
          result: '306 小時'
        },
        {
          item: '目擊事件除以相機工作時長',
          result: '306 小時'
        }
      ]

      this.settings.data = this.row_data

      this.sheet = new Handsontable(this.sheetContainer, this.settings)
      this.isRender = true
    },
    settingSheetHeight () {
      const sheetHeight = window.innerHeight - (64 + this.$el.querySelector('.search-container').clientHeight)
      this.settings.height = sheetHeight
      // debugger
      if (this.isRender) {
        this.sheet.updateSettings(this.settings)
      }
    }
  },
  mounted () {
    this.sheetContainer = this.$el.querySelector('#spreadsheet')
    this.settingSheetHeight()
    this.getSheetData()

    window.onresize = () => this.settingSheetHeight()
  }
}
</script>
