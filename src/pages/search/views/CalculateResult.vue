<template>
  <div class="maintain page-sheet">
    <div class="search-container">
      <div class="col-12 pt-2">
        <div class="float-right">
          <a
            class="btn btn-green-border btn-sm"
            v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
          >
            <div
              class="text"
              v-on:click="downloadCSV"
            >
              <span class="icon"><i class="icon-download-green"></i></span>下載計算結果
            </div>
          </a>
          <button class="btn btn-orange btn-sm ml-2">
            計算
          </button>
        </div>
        <router-link to="/">
          <small class="text-gray">
            <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
          </small>
        </router-link>
        <h3 class="text-green mb-2 mt-2">資料計算結果</h3>
      </div>
      <form
        action=""
        class="form filter-form"
      >
        <div class="col-12">
          <h6 class="text-gray mt-3">資料來源</h6>
        </div>
        <div class="row mx-0">
          <div class="col-3">
            <div class="form-group">
              <label for="">計畫名稱：</label>
              <v-select
                v-model="form.project"
                :placeholder="'請選擇計畫名稱'"
              ></v-select>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label for="">樣區：</label>
                  <v-select
                    v-model="form.site"
                    :placeholder="'請選擇樣區'"
                  ></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="">子樣區：</label>
                  <v-select
                    v-model="form.subSite"
                    :placeholder="'請選擇子樣區'"
                  ></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="">相機位置：</label>
                  <v-select
                    v-model="form.camera"
                    :placeholder="'請選擇相機位置'"
                  ></v-select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>物種：</label>
                  <v-select
                    :options="[
                    {label:'山羌', value:'山羌'},
                    {label:'鼬獾', value:'鼬獾'},
                    {label:'台灣獼猴', value:'台灣獼猴'},
                    {label:'山羊', value:'山羊'},
                    {label:'赤腹松鼠', value:'赤腹松鼠'},
                    {label:'白鼻心', value:'白鼻心'}
                  ]"
                    multiple
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <div class="form-group">
                  <label>資料起始時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.startAt"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.startTime"
                        format=""
                      />
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
                      <date-picker
                        v-model="form.endAt"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.endTime"
                        format=""
                      />
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
      <div v-if="$store.state.isCalcFormLoading">正在載入計算資料...</div>
      <div class="sheet">
        <div id="spreadsheet"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import Handsontable from 'handsontable';
import 'handsontable/languages/all';

// debugger

export default {
  name: 'CalculateResult',
  data() {
    return {
      today: moment(),
      isRender: false,
      isContinuous: false,
      continuousTime: 1,
      form: {
        project: '',
        site: '',
        subSite: '',
        camera: [],
        startAt: '',
        endAt: '',
        startTime: {
          HH: '10',
          mm: '05',
        },
        endTime: {
          HH: '10',
          mm: '05',
        },
      },
      rowData: [],
      settings: {
        data: [],
        columns: [
          // "NumberOfPhotos,NumberOfEvents,WorkingHours,WorkingDays,NopPerWorkingHour,NoePerWorkingHour,NopPerWorkingDay,NoePerWorkingDay"
          {
            data: 'NumberOfPhotos',
            type: 'text',
            editor: false,
          },
          {
            data: 'NumberOfEvents',
            type: 'text',
            editor: false,
          },
          {
            data: 'WorkingHours',
            type: 'text',
            editor: false,
          },
          {
            data: 'WorkingDays',
            type: 'text',
            editor: false,
          },
          {
            data: 'NopPerWorkingHour',
            type: 'text',
            editor: false,
          },
          {
            data: 'NoePerWorkingHour',
            type: 'text',
            editor: false,
          },
          {
            data: 'NopPerWorkingDay',
            type: 'text',
            editor: false,
          },
          {
            data: 'NoePerWorkingDay',
            type: 'text',
            editor: false,
          },
        ],
        language: 'zh-TW',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: ['項目', '計算結果'],
        width: 'auto',
        manualRowMove: true,
        manualColumnMove: true,
        filters: true,
        contextMenu: false,
        dropdownMenu: true,
        afterSelectionEnd: r => {
          this.currentRow = r;
        },
      },
      sheetContainer: null,
      sheet: null,
    };
  },
  watch: {
    currentRow: 'recordUpdate',
  },
  components: {
    DatePicker,
    VueTimepicker,
  },

  methods: {
    downloadCSV() {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(
        new Blob([this.$store.state.calcFormCSV], {
          type: 'text/csv',
        }),
      );
      const { calcForm } = this.$store.state;

      a.hidden = true;
      a.href = url;
      a.download = `${calcForm.project.projectTitle} from ${
        calcForm.fromDate
      } to ${calcForm.toDate} find ${calcForm.species} in ${calcForm.site}.csv`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
    },

    dragStart() {
      this.isDrag = true;
    },
    dragMove(e) {
      if (!this.isDrag) return;
      this.galleryWidth = window.innerWidth - e.pageX;
    },
    dragEnd() {
      this.isDrag = false;
    },
    getSheetData() {
      const csv = this.$store.state.calcFormCSV;
      const [head, ...rows] = csv.split`\n`;

      this.settings.colHeaders = head.split`,`;
      this.settings.columns = this.settings.colHeaders.map(head => ({
        data: head,
        type: 'text',
        editor: false,
      }));

      this.rowData = rows.filter(r => !!r).map(row =>
        row.split(',').reduce((o, value, i) => {
          return {
            ...o,
            [this.settings.colHeaders[i]]: value,
          };
        }, {}),
      );

      this.settings.data = this.rowData;

      this.sheet = new Handsontable(this.sheetContainer, this.settings);
      this.isRender = true;
    },
    settingSheetHeight() {
      const sheetHeight =
        window.innerHeight -
        (64 + this.$el.querySelector('.search-container').clientHeight);
      this.settings.height = sheetHeight;
      // debugger
      if (this.isRender) {
        this.sheet.updateSettings(this.settings);
      }
    },
  },

  async mounted() {
    this.sheetContainer = this.$el.querySelector('#spreadsheet');
    this.settingSheetHeight();

    window.onresize = () => this.settingSheetHeight();

    await this.$store.dispatch('calcForm');
    this.getSheetData();
  },
};
</script>
