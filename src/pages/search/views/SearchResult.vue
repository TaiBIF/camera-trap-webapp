<template>
  <div class="maintain page-sheet">
    <div class="search-container">
      <div class="col-12 pt-2">
        <div class="float-right">
          <a
            class="btn btn-green-border btn-sm"
            v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
          >
            <span class="icon"><i class="icon-download-green"></i></span>
            <span class="text">下載篩選結果</span>
          </a>
          <button
            class="btn btn-orange btn-sm ml-2"
            v-if="editMode"
          >計算</button>
        </div>
        <router-link to="/"><small class="text-gray">
            <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
          </small></router-link>
        <h3 class="text-green mb-2 mt-2">資料篩選結果</h3>
      </div>

      <form
        action=""
        class="form filter-form"
        v-if="editMode"
      >
        <div class="col-12">
          <h6 class="text-gray mt-3">資料來源</h6>
        </div>
        <div class="row mx-0">
          <div class="col-3">
            <div class="form-group">
              <label for="">計畫名稱：</label>
              <v-select
                v-model="form.name"
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
                    :options="[{label:'山羌', value:'山羌'},{label:'鼬獾', value:'鼬獾'},{label:'台灣獼猴', value:'台灣獼猴'},{label:'山羊', value:'山羊'},{label:'赤腹松鼠', value:'赤腹松鼠'},{label:'白鼻心', value:'白鼻心'}]"
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
                        v-model="form.start_at"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      ></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.start_time"
                        format=""
                      ></vue-timepicker>
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
                        v-model="form.end_at"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      ></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.end_time"
                        format=""
                      ></vue-timepicker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-5">
                <div class="form-group">
                  <label>起始日期：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.start_at"
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
              </div>
            </div>
          </div>
        </div>
      </form>

      <div
        v-else
        class="search-content"
      >

        <div class="row search-filters">
          <div class="col-4">
            <div class="item">
              <label>資料來源：</label>
              <div class="content">
                {{form.funder}}：<br />{{form.site}}-{{form.subSite}}-{{form.camera.toString()}}
                <!-- 林務局全島鼬獾監測 ：<br/>屏東處-旗山站-PT06A、PT07A  |  台東處-全部子樣區-全部相機位置  -->
              </div>
            </div>
            <div class="item">
              <label>物種：</label>
              <div class="content">
                {{form.species}}
                <!-- 山羌、獼猴、鼬獾、白鼻心、食蟹獴、山羊 -->
              </div>
            </div>
            <div class="item">
              <label>資料時間：</label>
              <div class="content">
                {{form.modified}}
                <!-- 2015/01/01 ~ 2018/09/08 -->
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="item short-label">
              <label>性別：</label>
              <div class="content">
                {{form.sex}}
                <!-- 公 -->
              </div>
            </div>
            <div class="item short-label">
              <label>年齡：</label>
              <div class="content">
                {{form.age}}
                <!-- 成體、亞成體 -->
              </div>
            </div>
            <div class="item short-label">
              <label>角況：</label>
              <div class="content">
                {{form.horn}}
                <!-- 茸角一尖、茸角二尖、茸角三尖、茸角四尖 -->
              </div>
            </div>
            <div class="item short-label">
              <label>備註：</label>
              <div class="content">
                {{form.note}}
                <!-- 覓食行為 -->
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="item long-label">
              <label>海拔：</label>
              <div class="content">
                {{form.elevation}}
                <!-- 1,001~1,500 公尺 -->
              </div>
            </div>
            <div class="item long-label">
              <label>植披：</label>
              <div class="content">
                {{form.vegetation}}
                <!-- 闊葉林 -->
              </div>
            </div>
            <div class="item long-label">
              <label>土地覆蓋類型：</label>
              <div class="content">
                {{form.land_cover}}
                <!-- 森林使用土地 -->
              </div>
            </div>
            <div class="item long-label">
              <label>拍攝時段：</label>
              <div class="content">
                {{form.time}}
                <!-- 18:00 ~ 05:00 -->
              </div>
            </div>
          </div>
          <div class="col-12">
            <button
              @click.stop.prevent="changeMode('editMode', true)"
              class="btn btn-sm btn-block btn-green"
            >
              <i class="fa fa-pencil-alt"></i> 進入編輯模式
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="sheet-container">
      <div class="sheet">
        <div class="sheet-header">
          <div class="row">
            <div class="col-8">
              <small class="text-gray">共 132,136 筆資料</small>
              <div class="divider"></div>
              <div
                class="dropdown"
                :class="{'d-none': !editMode}"
              >
                <div
                  class="btn-group btn-grayscale"
                  :class="{'active': isContinuous}"
                >
                  <button
                    class="btn btn-sm pr-0"
                    @click="renderContinuous()"
                  >
                    <span class="icon"><i class="icon-continous"></i></span>
                    <span class="text">連拍自動補齊</span>
                  </button>
                  <button
                    class="btn btn-sm btn-grayscale dropdown-toggle dropdown-toggle-split"
                    id="continousButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fa fa-caret-down"></i>
                  </button>
                  <div
                    class="dropdown-menu"
                    aria-labelledby="continousButton"
                  >
                    當相鄰照片間隔 <input
                      type="text"
                      v-model="continuousTime"
                      class="form-control form-control-inline"
                    /> 分鐘時，自動補齊物種名稱
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4 text-right">
              <div class="divider"></div>
              <a
                class="btn btn-icon"
                @click="changeMode('galleryShow', !galleryShow)"
                :class="{'active': galleryShow}"
              >
                <i class="icon-gallery"></i>
              </a>
              <div class="divider"></div>
              <a
                class="btn btn-icon"
                @click="changeMode('historyShow', !historyShow)"
                :class="{'active': historyShow}"
              >
                <i class="icon-time-machine"></i>
              </a>
            </div>
          </div>
        </div>
        <div id="spreadsheet"></div>
      </div>
      <div
        class="sidebar"
        :style="{'width': `${historyShow || galleryShow ? galleryWidth : 0}px`}"
      >
        <div
          class="photo-container"
          v-if="row_data.length && !row_data[currentRow].url==false && galleryShow"
        >
          <div class="gallery-header">
            <a
              @click="changeMode('galleryShow', false)"
              class="close mt-1 float-right"
            >
              <i class="icon-remove-sm"></i>
            </a>
            影像檢視
          </div>
          <div
            class="gallery-body"
            v-if="!row_data[currentRow].url || row_data[currentRow].url==''"
          >
            <div class="empty-result">
              <img
                src="/assets/common/empty-site.png"
                width="174"
                srcset="/assets/common/empty-site@2x.png"
              >
              <h5 class="text-gray">尚未上傳照片資料</h5>
              <a class="btn btn-orange">
                <span class="icon"><i class="icon-upload-white"></i></span>
                <span class="text">補上傳影像檔</span>
              </a>
            </div>
          </div>
          <div
            class="gallery-body"
            v-else
          >
            <zoom-drag
              :row="row_data[currentRow]"
              :index="currentRow"
              :total="row_data.length"
            />
            <div class="control">
              <span
                class="prev"
                @click="currentRow>0 ? currentRow--: currentRow"
              >
                <i class="fa fa-caret-left"></i>
              </span>
              <span class="text">
                {{row_data[currentRow].filename}} | {{row_data[currentRow].datetime}}
              </span>
              <span
                class="prev"
                @click="currentRow>row_data.length-1?currentRow: currentRow++"
              >
                <i class="fa fa-caret-right"></i>
              </span>
            </div>
            <div class="text-right my-2">
              <div class="btn btn-sm btn-default">進階標註</div>
            </div>
          </div>
        </div>
        <div
          class="version-container"
          v-if="historyShow"
        >
          <div class="version-header">
            <a
              @click="changeMode('historyShow', false)"
              class="close mt-1 float-right"
            >
              <i class="icon-remove-sm"></i>
            </a>
            版本紀錄
          </div>
          <div class="version-body">
            <table class="table version-list">
              <tbody>
                <tr>
                  <td>2018/09/05 17:37</td>
                  <td class="text-gray">由 <b>黃智賢</b> 編輯</td>
                  <td class="text-gray">目前版本</td>
                </tr>
                <tr>
                  <td>2018/09/05 17:37</td>
                  <td class="text-gray">由 <b>黃智賢</b> 編輯</td>
                  <td class="text-gray"><a class="btn btn-basic btn-sm">還原成此版本</a></td>
                </tr>
                <tr>
                  <td>2018/09/05 17:37</td>
                  <td class="text-gray">由 <b>黃智賢</b> 編輯</td>
                  <td class="text-gray"><a class="btn btn-basic btn-sm">還原成此版本</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="drag-bar"
          @mousedown="dragStart"
        ></div>
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
import ZoomDrag from '../../index/components/ZoomDrag';

// debugger

export default {
  name: 'SearchResult',
  data() {
    return {
      today: moment(),
      editMode: false,
      galleryShow: true,
      historyShow: true,
      isRender: false,
      scaleSize: 1,
      galleryWidth: 450,
      isContinuous: false,
      continuousTime: 1,
      form: {
        name: '',
        site: '',
        subSIte: '',
        camera: [],
        start_at: '',
        end_at: '',
        start_time: {
          HH: '10',
          mm: '05',
        },
        end_time: {
          HH: '10',
          mm: '05',
        },
        funder: '',
        species: [],
        modified: '',
        sex: '',
        age: '',
        horn: '',
        note: '',
        elevation: '',
        vegetation: '',
        land_cover: '',
        time: '',
      },
      selection: null,
      currentRow: 0,
      row_data: [],
      rowData: {},
      continuousCount: 0,
      continuousStart: false,
      continuous: {
        row: null,
        current: 0,
        total: 0,
      },
      species: ['測試', '空拍', '山羌', '鼬獾', '台灣獼猴', '水鹿', '白鼻心'],
      contextMenuSetting: {
        callback: (key, selection) => {
          let idx = selection[0].start.row;
          let row = this.row_data[idx];

          switch (key) {
            case 'setContinuous':
              this.settings.data[idx].is_continuous = true;
              break;
            case 'stopContinuous':
              this.settings.data[idx].is_continuous = false;
              break;
            case 'clone':
              this.row_data.splice(idx, 0, window._.cloneDeep(row));
              this.row_data = this.setContinuous(this.row_data);
              this.settings.data = this.row_data;
              break;
          }

          this.sheet.render();
        },
        items: {
          setContinuous: {
            name: () => {
              return '<span class="icon"><i class="icon-link"></i></span><span class="text">重新建立連拍連結</span>';
            },
            disabled: () => {
              let selected = this.sheet.getSelectedLast();
              return this.row_data[selected[0]].is_continuous;
            },
          },
          stopContinuous: {
            name: () => {
              return '<span class="icon"><i class="icon-unlink"></i></span><span class="text">解除連拍連結</span>';
            },
            disabled: () => {
              let selected = this.sheet.getSelectedLast();
              return !this.row_data[selected[0]].is_continuous;
            },
          },
          divider0: { name: '---------' },
          cut: {
            name: () => {
              return '<span class="icon"><i class="icon-cut"></i></span><span class="text">剪下</span>';
            },
          },
          copy: {
            name: () => {
              return '<span class="icon"><i class="icon-copy"></i></span><span class="text">複製</span>';
            },
          },
          paste: {
            name: () => {
              return '<span class="icon"><i class="icon-paste"></i></span><span class="text">貼上</span>';
            },
          },
          divider1: { name: '---------' },
          undo: {
            name: () => {
              return '<span class="icon"></span><span class="text">復原</span>';
            },
          },
          redo: {
            name: () => {
              return '<span class="icon"></span><span class="text">重做</span>';
            },
          },
          divider2: { name: '---------' },
          clone: {
            name: () => {
              return '<span class="icon"></span><span class="text">複製並貼上一列</span>';
            },
          },
        },
      },
      settings: {
        data: [],
        columns: [
          {
            data: 'station',
            type: 'text',
            editor: false,
          },
          {
            data: 'camera',
            type: 'text',
            editor: false,
          },
          {
            data: 'filename',
            type: 'text',
            editor: false,
          },
          {
            data: 'datetime',
            type: 'date',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            editor: false,
          },
          {
            data: 'species',
            type: 'autocomplete',
            source: ['測試', '山羌', '鼬獾', '台灣獼猴', '水鹿', '白鼻心'],
            renderer: this.continousRenderer,
            editor: false,
          },
          {
            data: 'sex',
            type: 'text',
            editor: false,
          },
          {
            data: 'age',
            type: 'text',
            editor: false,
          },
          {
            data: 'idvcount',
            type: 'numeric',
            editor: false,
          },
          {
            data: 'category',
            type: 'text',
            editor: false,
          },
          {
            data: 'sciName',
            type: 'text',
            editor: false,
          },
          {
            data: 'behavior',
            type: 'text',
            editor: false,
          },
          {
            data: 'note',
            type: 'text',
            editor: false,
          },
          {
            data: 'add',
            type: 'text',
            editor: false,
          },
        ],
        language: 'zh-TW',
        stretchH: 'all',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
          // 'URL',
          '樣區',
          '相機位置',
          '檔名',
          '時間',
          '物種',
          '性別',
          '年齡',
          '數量',
          '類別',
          '學名',
          '行為',
          '備註',
          '<i class="icon-add"></i>',
        ],
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
      isDrag: false,
    };
  },
  watch: {
    currentRow: 'recordUpdate',
  },
  components: {
    DatePicker,
    VueTimepicker,
    ZoomDrag,
  },
  methods: {
    recordUpdate() {},
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
    continousRenderer(instance, TD, row, col, prop, value) {
      if (prop == 'species' && !value == false && value !== '') {
        let clsName = '';
        let $row = this.row_data[row];
        let error = '';
        if (
          this.species.indexOf(value) === -1 &&
          value.indexOf('測試') === -1
        ) {
          clsName += 'htInvalid ';
          error = '<span class="alert-box">!</span>';
        }
        if (this.isContinuous) {
          // debugger
          if ($row.is_continuous) {
            clsName += 'is-continuoust';
          }

          if ($row.is_continuous_apart) {
            clsName += ' is-continuous-apart';
          }

          if ($row.is_continuous_start) {
            clsName += ' is-continuous-start ';
          }

          if ($row.is_continuous_end) {
            clsName += ' is-continuous-end ';
          }
        }

        TD.dataset.tooltip = '物種不在預設中';
        TD.innerHTML = value + error;
        TD.className = clsName;
      }
    },
    setCurrentContinuous() {
      let row = this.row_data[this.currentRow];

      if (!row.is_continuous)
        this.continuous = {
          row: null,
          current: 0,
          total: 0,
        };
      else
        this.continuous = {
          row: this.currentRow,
          current: row.current_continuous,
          total: this.row_data[row.continuous_start].continuous_count,
        };
    },
    renderContinuous() {
      this.isContinuous = !this.isContinuous;
      this.setContinuous();
    },
    setContinuous(data) {
      let row_data = !data ? this.row_data : data;
      row_data.forEach((r, i) => {
        let $row = r;
        let current = r.datetime;
        let prev = i > 0 ? row_data[i - 1].datetime : null;
        let next = i + 1 < row_data.length ? row_data[i + 1].datetime : null;
        let c_dt = new Date(current);
        let p_dt = !prev ? null : new Date(prev);
        let n_dt = !next ? null : new Date(next);
        let time = Number(this.continuousTime) * 60 * 1000;
        let isContinue = false;

        if ($row.is_continuous_apart == undefined) {
          $row.is_continuous_apart = false;
        }

        if (
          !n_dt == false &&
          (n_dt - c_dt <= time || (!p_dt == false && c_dt - p_dt <= time)) &&
          ['測試', '空拍'].indexOf($row.species) == -1
        ) {
          isContinue = true;
          $row.is_continuous = true;
          this.continuousCount++;
          // result += " is-continuous ";
        }

        // detect is continuous start
        if (
          (isContinue && !p_dt && n_dt - c_dt <= time) ||
          c_dt - p_dt >= time
        ) {
          this.continuousCount = 1;
          this.continuousStart = i;
          $row.is_continuous_start = true;
          // $row += " is-continuous-start ";
        }

        $row.current_continuous = this.continuousCount;
        $row.continuous_start = this.continuousStart;
        // detect is continuous end
        if (
          (isContinue && !n_dt && c_dt - p_dt <= time) ||
          n_dt - c_dt >= time
        ) {
          $row.is_continuous_end = true;

          row_data[
            this.continuousStart
          ].continuous_count = this.continuousCount;
          this.continuousCount = 0;
          // $row += " is-continuous-end ";
        }
      });

      return row_data;
    },
    getSheetData() {
      this.$http.get('/csv/HC21A.csv').then(response => {
        var data = [];

        response.data.split(/\r\n/g).forEach((ref, idx) => {
          var row = ref.split(/,/g);
          // debugger;
          if (idx == 0) {
            // Project, Station, Camera, File name, Date & Time, Species name, Number of individuals,Sex,Age,ID,Notes
            this.rowData = row;
          } else {
            let item = {};

            row.forEach((r, i) => {
              item[this.rowData[i].toLowerCase()] = r;
            });

            data.push(item);
          }
        });

        this.row_data = this.setContinuous(data);
        this.settings.data = this.row_data;

        this.sheet = new Handsontable(this.sheetContainer, this.settings);
        this.isRender = true;
      });
    },
    changeMode(key, val) {
      this[key] = val;

      if (key == 'editMode') {
        this.settings.contextMenu = !val ? false : this.contextMenuSetting;
        this.settings.columns.forEach(col => {
          col.editor = !val ? false : col.type;
        });
        this.sheet.updateSettings(this.settings);
      }

      setTimeout(() => {
        this.settingSheetHeight();
      }, 200);
    },
    settingSheetHeight() {
      let sheetHeight =
        window.innerHeight -
        (64 + this.$el.querySelector('.search-container').clientHeight);
      this.settings.height = sheetHeight - 40;
      this.$el
        .querySelector('.sheet-container')
        .querySelector('.sidebar').style.height =
        sheetHeight + 'px';
      // debugger
      if (this.isRender) this.sheet.updateSettings(this.settings);
    },
  },
  mounted() {
    this.sheetContainer = this.$el.querySelector('#spreadsheet');
    this.settingSheetHeight();
    this.getSheetData();

    window.onresize = () => {
      this.settingSheetHeight();
    };

    document.body.addEventListener('mousemove', e => {
      this.dragMove(e);
    });
    document.body.addEventListener('mouseup', e => {
      this.dragEnd(e);
    });
  },
};
</script>
