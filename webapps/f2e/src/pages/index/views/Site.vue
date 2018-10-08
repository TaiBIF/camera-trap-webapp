<template>
  <div class="maintain page-sheet">
    <div class="search-container">
      <a class="btn btn-green-border btn-sm float-right">
        下載篩選結果
      </a>
      <h3>屏東處 - 旗山站</h3>
      <form action="" class="form form-horizontal">
        <div class="form-group mb-0">
          <label>相機位置</label>
          <div class="checkbox checkbox-inline">
            <input type="checkbox" v-model="form.camera" id="camera-all" value="all">
            <label for="camera-all">全部相機位置</label>
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
          <div class="btn btn-sm btn-block btn-green">
            <i class="fa fa-pencil-alt"></i> 進行編輯
          </div>
        </div>
      </form>
    </div>
    <div class="sheet-container">
      <div class="sheet">
        <div id="spreadsheet"></div>
      </div>
      <div class="photo" :style="{'width': `${galleryWidth}px`}">
        <div class="drag-bar" @mousedown="dragStart"></div>
        <div class="photo-container" v-if="row_data.length && !row_data[currentRow].url==false">
          <img :src="row_data[currentRow].url" class="img">
          <div class="control">
            <span class="prev">
              <i class="fa fa-caret-left"></i>
            </span>
            <span class="text">
              {{row_data[currentRow].filename}} | {{row_data[currentRow].datetime}}
            </span>
            <span class="prev">
              <i class="fa fa-caret-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import VueTimepicker from 'vue2-timepicker'
import Handsontable from 'handsontable'


export default {
  name: 'Site',
  data() {
    return {
      isRender: false,
      today: moment(),
      galleryWidth: 300,
      form: {
        camera: '',
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
      continuousCount: 0,
      continuousStart: false,
      continuous: {
        row: null,
        current: 0,
        total: 0
      },
      species: ["測試", "空拍", "山羌", "鼬獾", "台灣獼猴", "水鹿", "白鼻心"],
      settings: {
        data: [],
        columns: [
          {
            data: 'station',
            type: 'text'
          },
          {
            data: 'camera',
            type: 'text'
          },
          {
            data: 'filename',
            type: 'text'
          },
          {
            data: 'datetime',
            type: 'date',
            dateFormat: 'YYYY/MM/DD HH:mm:ss'
          },
          {
            data: 'species',
            type: 'autocomplete',
            source: ["測試", "山羌", "鼬獾", "台灣獼猴", "水鹿", "白鼻心"],
            renderer: this.continousRenderer
          }, 
          {
            data: 'sex',
            type: 'text'
          },
          {
            data: 'age',
            type: 'text'
          },
          {
            data: 'idvcount',
            type: 'numeric'
          },
          {
            data: 'category',
            type: 'text'
          },
          {
            data: 'sciName',
            type: 'text'
          },
          {
            data: 'behavior',
            type: 'text'
          },
          {
            data: 'note',
            type: 'text'
          },
          {
            data: 'add',
            type: 'text'
          }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
          // 'URL',
          'Station',
          'Camera',
          'FileName',
          'Datetime',
          'Species',
          'Sex',
          'Age',
          'IdvCount',
          'Category',
          'SciName',
          'Behavior',
          'Note',
          '+'
        ],
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: {
          callback: (key, selection) => {
            let idx = selection[0].start.row
            let row = this.row_data[idx]
            
            switch(key) {
              case 'setContinuous':
                this.settings.data[idx].is_continuous = true
                break;
              case 'stopContinuous':
                this.settings.data[idx].is_continuous = false
                break;
              case 'clone':
                this.row_data.splice(idx, 0, _.cloneDeep(row))
                this.row_data = this.setContinuous(this.row_data)
                this.settings.data = this.row_data

                break;
            }

            this.sheet.render()
          },
          items: {
            "setContinuous": {
              name: "恢復連拍",
              disabled: () => {
                let selected = this.sheet.getSelectedLast()
                return this.row_data[selected[0]].is_continuous
              }
            }, 
            "stopContinuous": {
              name: "取消連拍",
              disabled: () => {
                let selected = this.sheet.getSelectedLast()
                return !this.row_data[selected[0]].is_continuous
              }
            }, 
            "clone": {
              name: "複製並貼上一列"
            }, 
            'row_above': {
              name: "往上插入一列",
              disabled: function () {
                // Disable option when first row was clicked
                return this.getSelectedLast()[0] === 0; // `this` === hot3
              }
            }, 
            'row_below': {
              name: "往下插入一列"
            }, 
            'remove_row': {
              name: "刪除列"
            }
          }
        },
        filters: true,
        dropdownMenu: true,
        afterSelectionEnd: (r, c, r2, c2) => {
          this.currentRow = r
          console.log(this.row_data[r])
        }
      },
      sheetContainer: null,
      sheet: null,
      isDrag: false,
    }
  },
  components: {
    DatePicker, VueTimepicker
  },
  watch: {
    "currentSite": "setCamera"
  },
  methods: {
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
    continousRenderer(instance, TD, row, col, prop, value, cellProperties) {
      if(prop=="species" && !value==false && value!=="") {
        
        let clsName = ''
        let $row = this.row_data[row]
        
        if(this.species.indexOf(value)===-1 && value.indexOf('測試')===-1) {
          clsName += "htInvalid "
        }
        
        if($row.is_continuous) {
          clsName += "is-continuoust"
        }

        if($row.is_continuous_apart) {
          clsName += " is-continuous-apart"
        }

        if($row.is_continuous_start) {
          clsName += " is-continuous-start ";
        }

        if($row.is_continuous_end) {
          clsName += " is-continuous-end ";
        }

        TD.innerHTML = value
        TD.className = clsName
      }
    },
    setCurrentContinuous () {
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
    setContinuous(data) {
      let row_data = data
      row_data.forEach((r, i) => {
        let $row = r;
        let current = r.datetime
        let prev = i > 0 ? row_data[i - 1].datetime : null
        let next = i + 1 < row_data.length ? row_data[i + 1].datetime : null
        let c_dt = new Date(current);
        let p_dt = !prev ? null : new Date(prev)
        let n_dt = !next ? null : new Date(next)
        let isContinue = false
        let isStart = false
        let isEnd = false
        
        if($row.is_continuous_apart == undefined) {
          $row.is_continuous_apart = false
        }

        if(
          !n_dt==false && 
          (n_dt - c_dt <= 60000 || !p_dt==false && c_dt - p_dt <= 60000) && 
          (["測試", "空拍"].indexOf($row.species) == -1)
        ) {
          isContinue = true;
          $row.is_continuous = true;
          this.continuousCount++;
          // result += " is-continuous ";
        }

        // detect is continuous start
        if(isContinue && !p_dt && n_dt - c_dt <= 60000 || c_dt - p_dt >= 60000) {
          isStart = true;
          this.continuousCount = 1;
          this.continuousStart = i;
          $row.is_continuous_start = true;
          // $row += " is-continuous-start ";
        }
        
        $row.current_continuous = this.continuousCount;
        $row.continuous_start = this.continuousStart;
        // detect is continuous end
        if(isContinue && !n_dt && c_dt - p_dt <= 60000 || n_dt - c_dt >= 60000) {
          isEnd = true;
          $row.is_continuous_end = true;
          
          row_data[this.continuousStart].continuous_count = this.continuousCount;
          this.continuousCount = 0;
          // $row += " is-continuous-end ";
        }
      });

      return row_data
    },
    getSheetData () {
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
        
        this.sheet = new Handsontable(this.sheetContainer, this.settings);
        this.isRender = true
      })
    },
    settingSheetHeight() {
      this.settings.height = window.innerHeight - (64 + this.$el.querySelector('.search-container').clientHeight)

      if(this.isRender) 
        this.sheet.updateSettings(this.settings)
    }
  },
  mounted() {
    this.sheetContainer = this.$el.querySelector('#spreadsheet')
    this.settingSheetHeight()
    this.getSheetData()

    window.onresize = () => {this.settingSheetHeight()}

    document.body.addEventListener('mousemove', (e) => {this.dragMove(e)});
    document.body.addEventListener('mouseup', (e) => {this.dragEnd(e)});
  }
}
</script>
