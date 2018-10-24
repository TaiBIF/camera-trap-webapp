<template>
  <div class="maintain page-sheet p-0">
    <div class="search-container">
      <!-- Edit mode -->
      <div v-if="editMode" class="edit-container">
        <div class="row">
          <div class="col-7">
            <span class="text-gray">花蓮處 - 南華站</span>
            <span class="divider"></span>
            <span class="text-gray">PT01A、PT04A、PT09A</span>
            <span class="divider"></span>
            <span class="text-gray"> 16/03/01 上午12:00 到 18/07/01 上午12:00</span>
          </div>
          <div class="col-5 text-right">
            <span class="text-gray">最後儲存時間：1 分鐘前</span>
            <span class="divider"></span>
            <button @click.stop.prevent="changeMode('editMode', false)" class="btn btn-circle"><i class="icon-save"></i></button>
            <span class="divider"></span>
            <button @click.stop.prevent="changeMode('editMode', false)" class="btn btn-basic btn-sm">關閉編輯模式</button>
          </div>
        </div>
      </div>
      <!-- Overview mode -->
      <div v-else class="search-content">
        <a class="btn btn-green-border btn-sm float-right" v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'">
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">屏東處 - 旗山站</h3>
        <hr class="my-0">
        <form action="" class="form form-horizontal">
          <div class="form-group mb-0">
            <label>相機位置</label>
            <div class="d-inline-block">
              <div class="checkbox checkbox-inline">
                <input type="checkbox" v-model="form.camera" id="camera-all" value="all">
                <label for="camera-all">全部相機位置</label>
              </div>
              <div class="mb-2">
                <div class="checkbox checkbox-inline">
                  <input type="checkbox" v-model="form.camera" id="camera-1" value="1">
                  <label for="camera-1">
                    <span class="text">PT02A</span>
                    <span class="icon">
                      <i class="icon-lock align-middle" v-tooltip.top="'陳士齊 正在編輯中'"></i>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label>資料時間</label>
            <div class="d-inline-block">
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
                <span class="input-text">到</span>
                <div class="input-group">
                  <date-picker v-model="form.end_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-group ml-2">
                  <vue-timepicker v-model="form.end_time" format="HH:mm"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button @click.stop.prevent="changeMode('editMode', true)" class="btn btn-sm btn-block btn-green">
              <i class="fa fa-pencil-alt"></i> 進入編輯模式
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="sheet-container">
      <div class="sheet">
        <div class="sheet-header">
          <div class="row">
            <div class="col-8">
              <small class="text-gray">共 132,136 筆資料</small>
              <div class="divider"></div>
              <div class="dropdown" :class="{'d-none': !editMode}">
                <div class="btn-group btn-grayscale" :class="{'active': isContinuous}">
                  <button class="btn btn-sm pr-0" @click="renderContinuous()">
                    <span class="icon"><i class="icon-continous"></i></span>
                    <span class="text">連拍自動補齊</span>
                  </button>
                  <button class="btn btn-sm btn-grayscale dropdown-toggle dropdown-toggle-split" 
                  id="continousButton" 
                  data-toggle="dropdown" 
                  aria-haspopup="true" 
                  aria-expanded="false">
                    <i class="fa fa-caret-down"></i>
                  </button>
                  <div class="dropdown-menu" aria-labelledby="continousButton">
                    當相鄰照片間隔 <input type="text" v-model="continuousTime" class="form-control form-control-inline" /> 分鐘時，自動補齊物種名稱
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4 text-right">
              <div class="divider"></div>
              <a class="btn btn-icon" 
              @click="changeMode('galleryShow', !galleryShow)" 
              :class="{'active': galleryShow}">
                <i class="icon-gallery"></i>
              </a>
              <div class="divider"></div>
              <a class="btn btn-icon" 
              @click="changeMode('historyShow', !historyShow)"
              :class="{'active': historyShow}">
                <i class="icon-time-machine"></i>
              </a>
            </div>
          </div>
        </div>
        <div id="spreadsheet"></div>
        <!-- Pagination -->
        <div class="sheet-footer">
          <span class="text-gray">單頁顯示</span>
          <span class="select">
            <select name="" id="" class="form-control">
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="1500">1500</option>
            </select>
          </span>
          <span class="text-gray">筆資料，您正在檢視：</span>
          <span>第 2001-3501 筆</span>
          <div class="float-right">
            <div class="input-group pager">
              <div class="input-group-prepend">
                <button>
                  <i class="fa fa-caret-left"></i>
                </button>
              </div>
              <input type="text" class="form-control" value="1/10">
              <div class="input-group-append">
                <button>
                  <i class="fa fa-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar" :style="{'width': `${historyShow || galleryShow ? galleryWidth : 0}px`}">
        <div class="photo-container" v-if="row_data.length && !row_data[currentRow].url==false && galleryShow">
          <div class="gallery-header">
            <a @click="changeMode('galleryShow', false)" class="close mt-1 float-right">
              <i class="icon-remove-sm"></i>
            </a>
            影像檢視
          </div>
          <div class="gallery-body" v-if="!row_data[currentRow].url || row_data[currentRow].url==''">
            <div class="empty-result">
              <img src="/assets/common/empty-site.png" width="174" srcset="/assets/common/empty-site@2x.png">
              <h5 class="text-gray">尚未上傳照片資料</h5>
              <a class="btn btn-orange">
                <span class="icon"><i class="icon-upload-white"></i></span>
                <span class="text">補上傳影像檔</span>
              </a>
            </div>
          </div>
          <div class="gallery-body" v-else>
            <zoom-drag :row="row_data[currentRow]" :index="currentRow" :total="row_data.length" />
            <div class="control">
              <span class="prev" @click="currentRow>0 ? currentRow--: currentRow">
                <i class="fa fa-caret-left"></i>
              </span>
              <span class="text">
                {{row_data[currentRow].filename}} | {{row_data[currentRow].datetime}}
              </span>
              <span class="prev" @click="currentRow>row_data.length-1?currentRow: currentRow++">
                <i class="fa fa-caret-right"></i>
              </span>
            </div>
            <div class="text-right my-2">
              <div class="btn btn-sm btn-default">進階標註</div>
            </div>
          </div>
        </div>
        <div class="version-container" v-if="historyShow">
          <div class="version-header">
            <a @click="changeMode('historyShow', false)" class="close mt-1 float-right">
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
        <div class="drag-bar" @mousedown="dragStart"></div>
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
import ZoomDrag from '../components/ZoomDrag'

// debugger

export default {
  name: 'Site',
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
        camera: [],
        start_at: '',
        end_at: '',
        start_time: {
          HH: "10",
          mm: "05"
        },
        end_time: {
          HH: "10",
          mm: "05"
        }
      },
      selection: null,
      currentRow: 0,
      row_data: [],
      rowData: {},
      // 連拍紀錄
      continuousCount: 0,
      continuousStart: false,
      continuous: {
        row: null,
        current: 0,
        total: 0
      },
      updateRow: {},
      // [API] 需要透過 API 帶入常用分類
      species: ["測試", "空拍", "山羌", "鼬獾", "台灣獼猴", "水鹿", "白鼻心"],
      contextMenuSetting: {
        callback: (key, selection) => {
          let idx = selection[0].start.row
          let row = this.row_data[idx]
          
          switch(key) {
            // 設定連拍
            case 'setContinuous':
              this.settings.data[idx].is_continuous = true
              break;
            case 'stopContinuous':
              this.settings.data[idx].is_continuous = false
              break;
            // 複製一列
            case 'clone':
              this.row_data.splice(idx, 0, window._.cloneDeep(row))
              this.row_data = this.setContinuous(this.row_data)
              this.settings.data = this.row_data
              break;
          }

          this.sheet.render()
        },
        items: {
          "setContinuous": {
            name: () => {return '<span class="icon"><i class="icon-link"></i></span><span class="text">重新建立連拍連結</span>'},
            disabled: () => {
              let selected = this.sheet.getSelectedLast()
              return this.row_data[selected[0]].is_continuous
            }
          }, 
          "stopContinuous": {
            name: () => {return '<span class="icon"><i class="icon-unlink"></i></span><span class="text">解除連拍連結</span>'},
            disabled: () => {
              let selected = this.sheet.getSelectedLast()
              return !this.row_data[selected[0]].is_continuous
            }
          }, 
          "divider0": {name: '---------' },
          "cut": {name: () => {return '<span class="icon"><i class="icon-cut"></i></span><span class="text">剪下</span>'} }, 
          "copy": {name: () => {return '<span class="icon"><i class="icon-copy"></i></span><span class="text">複製</span>'} }, 
          "paste": {name: () => {return '<span class="icon"><i class="icon-paste"></i></span><span class="text">貼上</span>'} }, 
          "divider1": {name: '---------' },
          "undo": {name: () => {return '<span class="icon"></span><span class="text">復原</span>'} }, 
          "redo": {name: () => {return '<span class="icon"></span><span class="text">重做</span>'} }, 
          "divider2": {name: '---------' },
          "clone": {name: () => {return '<span class="icon"></span><span class="text">複製並貼上一列</span>'} }
        }
      },
      settings: {
        data: [],
        columns: [
          {
            data: 'station',
            type: 'text',
            editor: false
          },
          {
            data: 'camera',
            type: 'text',
            editor: false
          },
          {
            data: 'filename',
            type: 'text',
            editor: false
          },
          {
            data: 'datetime',
            type: 'date',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            editor: false
          },
          {
            data: 'species',
            type: 'autocomplete',
            source: ["測試", "山羌", "鼬獾", "台灣獼猴", "水鹿", "白鼻心"],
            renderer: this.continousRenderer,
            editor: false
          }, 
          {
            data: 'sex',
            type: 'text',
            editor: false
          },
          {
            data: 'age',
            type: 'text',
            editor: false
          },
          {
            data: 'idvcount',
            type: 'numeric',
            editor: false
          },
          {
            data: 'category',
            type: 'text',
            editor: false
          },
          {
            data: 'sciName',
            type: 'text',
            editor: false
          },
          {
            data: 'behavior',
            type: 'text',
            editor: false
          },
          {
            data: 'note',
            type: 'text',
            editor: false
          },
          {
            data: 'add',
            type: 'text',
            editor: false
          }
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
          '<i class="icon-add"></i>'
        ],
        manualRowMove: true,
        manualColumnMove: true,
        filters: true,
        contextMenu: false,
        dropdownMenu: true,
        afterChange: (changes) => {
          if(!changes) return;
          // chagnes: [[index, column, old value, new value]]
          // updateRow 紀錄有更新的欄位
          changes.forEach(change => {
            let idx = change[0] 
            if(!this.updateRow[idx]) this.updateRow[idx] = {}
            this.updateRow[idx][change[1]] = change[3]
          })
        },
        afterSelectionEnd: (r) => {
          this.currentRow = r
        }
      },
      sheetContainer: null,
      sheet: null,
      isDrag: false,
    }
  },
  watch: {
    'currentRow': 'recordUpdate'
  },
  components: {
    DatePicker, VueTimepicker, ZoomDrag
  },
  methods: {
    recordUpdate() {
      
    },
    dragStart () {
      this.isDrag = true
    },
    dragMove (e) {
      if(!this.isDrag) return
      this.galleryWidth = window.innerWidth - e.pageX 
    },
    dragEnd () {
      this.isDrag = false
    },
    continousRenderer(instance, TD, row, col, prop, value) {
      if(prop=="species" && !value==false && value!=="") {
        
        let clsName = ''
        let $row = this.row_data[row]
        let error = ''

        // 不在預設物種資料顯示錯誤
        if(this.species.indexOf(value)===-1 && value.indexOf('測試')===-1) {
          clsName += "htInvalid "
          error = '<span class="alert-box">!</span>'
        }

        // 是否為連拍照片
        if(this.isContinuous) {
          if($row.is_continuous) {
            clsName += "is-continuoust"
          }

          // 是否與連拍分離
          if($row.is_continuous_apart) {
            clsName += " is-continuous-apart"
          }

          if($row.is_continuous_start) {
            clsName += " is-continuous-start ";
          }

          if($row.is_continuous_end) {
            clsName += " is-continuous-end ";
          }
        }

        // 設定錯誤提示文字
        TD.dataset.tooltip = "物種不在預設中"
        TD.innerHTML = value + error
        TD.className = clsName
      }
    },
    setCurrentContinuous () {
      // 取得目前資料的連拍資訊
      let row = this.row_data[this.currentRow];

      if(!row.is_continuous)  
        this.continuous = {
          row: null,
          current: 0,
          total: 0
        }
      else
        this.continuous = {
          row: this.currentRow,
          current: row.current_continuous,
          total: this.row_data[row.continuous_start].continuous_count
        }
    },
    renderContinuous() {
      // 切換連拍狀態
      this.isContinuous = !this.isContinuous
      this.setContinuous()
    },
    setContinuous(data) {
      let row_data = !data ? this.row_data : data
      // 判斷連拍
      row_data.forEach((r, i) => {
        let $row = r;
        let current = r.datetime
        let prev = i > 0 ? row_data[i - 1].datetime : null
        let next = i + 1 < row_data.length ? row_data[i + 1].datetime : null
        let c_dt = new Date(current);
        let p_dt = !prev ? null : new Date(prev)
        let n_dt = !next ? null : new Date(next)
        let time = Number(this.continuousTime) * 60 * 1000
        let isContinue = false
        let isStart = false
        let isEnd = false
        
        if($row.is_continuous_apart == undefined) {
          $row.is_continuous_apart = false
        }

        // 排除測試、空拍
        if(
          !n_dt==false && 
          (n_dt - c_dt <= time  || !p_dt==false && c_dt - p_dt <= time) && 
          (["測試", "空拍"].indexOf($row.species) == -1)
        ) {
          isContinue = true;
          $row.is_continuous = true;
          this.continuousCount++;
        }

        // 是不是連拍第一張
        if(isContinue && !p_dt && n_dt - c_dt <= time || c_dt - p_dt >= time) {
          isStart = true;
          this.continuousCount = 1;
          this.continuousStart = i;
          $row.is_continuous_start = true;
        }
        
        $row.current_continuous = this.continuousCount;
        $row.continuous_start = this.continuousStart;
        
        // 是不是連拍最後一張
        if(isContinue && !n_dt && c_dt - p_dt <= time || n_dt - c_dt >= time) {
          isEnd = true;
          $row.is_continuous_end = true;
          
          row_data[this.continuousStart].continuous_count = this.continuousCount;
          this.continuousCount = 0;
        }
      });

      return row_data
    },
    getSheetData () {
      // 取得 csv 資料，並轉成 json
      this.$http.get('/csv/HC21A.csv').then((response) => {
        var data = [];
        
        (response.data.split(/\r\n/g)).forEach((ref, idx) => {
          var row = ref.split(/,/g);
          // debugger;
          if(idx==0) {
            // Project, Station, Camera, File name, Date & Time, Species name, Number of individuals,Sex,Age,ID,Notes
            this.rowData = row
          } else {
            let item = {}

            row.forEach((r, i) => {
              item[this.rowData[i].toLowerCase()] = r
            })

            data.push(item)
          }
        });
        
        this.row_data = this.setContinuous(data)
        this.settings.data = this.row_data
        // 產出 sheet 畫面
        this.sheet = new Handsontable(this.sheetContainer, this.settings);
        this.isRender = true
      })
    },
    changeMode(key , val) {
      // 切換編輯狀態
      this[key] = val

      if(key=='editMode') {
        // 打開右鍵選單，打開欄位編輯模式
        this.settings.contextMenu = !val ? false: this.contextMenuSetting
        this.settings.columns.forEach((col) => {
          col.editor = !val ? false : col.type
        })
        // 更新 sheet 
        this.sheet.updateSettings(this.settings)
      }

      setTimeout(() => {
        this.settingSheetHeight()
      }, 200)
    },
    settingSheetHeight() {
      // 根據模式切換更新 sheet 高度
      let sheetHeight = window.innerHeight - (64 + this.$el.querySelector('.search-container').clientHeight)
      this.settings.height = sheetHeight - 80
      this.$el.querySelector('.sheet-container').querySelector('.sidebar').style.height = sheetHeight + 'px'
      // debugger
      if(this.isRender) 
        this.sheet.updateSettings(this.settings)
    }
  },
  mounted() {
      // 綁定 sheet element、設定高度、取得資料
    this.sheetContainer = this.$el.querySelector('#spreadsheet')
    this.settingSheetHeight()
    this.getSheetData()

    window.onresize = () => {this.settingSheetHeight()}

    // 拖拉側欄照片區塊大小
    document.body.addEventListener('mousemove', (e) => {this.dragMove(e)});
    document.body.addEventListener('mouseup', (e) => {this.dragEnd(e)});
  }
}
</script>
