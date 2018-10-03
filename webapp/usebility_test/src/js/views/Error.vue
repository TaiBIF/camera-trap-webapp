<template>
  <div class="page-site" v-cloak>
    <!-- Search panel -->
    <section class="search-block" :class="{'is-collapse': !searchPanelShow}">
      <div class="collapse-info">
        <div class="control float-right">
          <a class="item"><i class="fa fa-2 fa-pencil"></i></a>
          <a class="item"><i class="fa fa-2 fa-download"></i></a>
          <span class="item btn btn-default" @click="toggleSearchPanel()">
            <i class="fa fa-2 fa-angle-down"></i>
          </span>
        </div>
        <div class="content">
          <h5 class="d-inline">屏東處 - 旗山站</h5>
          <span><span class="text-muted">時間</span>  2016/03/01 上午12:00 <span class="text-muted">到</span> 2018/07/01 上午12:00</span>
          <span><span class="text-muted">樣點</span>  PT01A、PT04A、PT09A</span>
        </div>
      </div>
      <form action="" class="form">
        <div class="header">
          <div class="control float-right">
            <a class="item" data-toggle="tooltip" data-position="bottom" data-title="編輯樣區及樣點"><i class="fa fa-2 fa-pencil"></i></a>
            <a class="item" data-toggle="tooltip" data-position="bottom" data-title="下載此範圍資料"><i class="fa fa-2 fa-download"></i></a>
            <span class="item" @click="toggleSearchPanel()">
              <a class="btn btn-rounded btn-default" data-toggle="tooltip" data-position="bottom" data-title="收合">
                <i class="fa fa-2 fa-angle-up"></i>
              </a>
            </span>
          </div>
          <h1>
            屏東處 — 
            <select name="site" id="site" class="form-control d-inline-block">
              <option value="">全部</option>
              <option value="">旗山站</option>
              <option value="">潮州站</option>
            </select>
          </h1>
          <hr>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="form-group row mb-3">
              <label for="" class="col-1 text-muted">時間</label>
              <div class="col-11">
                <date-picker lang="zh-TW" v-model="start_at" :first-day-of-week="1" class="d-inline-block"></date-picker>
                <time-input/>
                <span class="text mx-1">到</span>
                <date-picker lang="zh-TW" v-model="end_at" :first-day-of-week="1" class="d-inline-block"></date-picker>
                <time-input/>
              </div>
            </div>
            <div class="form-group row">
              <label for="" class="col-1 text-muted">樣站</label>
              <div class="col-11">
                <div class="checkbox" v-for="(ca,idx) in camara" :key="`camara-no-${ca}`">
                  <input type="checkbox" class="form-control" :id="`camara-${idx}`" :value="ca">
                  <label :for="`camara-${idx}`">
                    {{ ca }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
    <!-- Datagrid panel -->
    <section class="result-block">
      <div id='jqxWidget' class="table-container">
        <div class="status-bar">
          <div class="row">
            <div class="col-6">
              共 {{ table_rows.length }} 筆資料
            </div>
            <div class="col-6 text-right">
              <div class="divider"></div>
              <a class="btn btn-gallery-trigger" 
              :class="{'is-close': !photoGalleryOpen}" 
              @click="togglePhoto(!photoGalleryOpen)"></a>
            </div>
          </div>
        </div>
        <div id="grid"></div>
      </div>

      <div id='menu'>
        <ul>
          <li @click="copyRow()">複製這一列</li>
          <li @click="newRow()">插入新一列</li>
          <li @click="delRow()">刪除這一列</li>
        </ul>
      </div>
      <div id='status-menu'>
        <ul>
          <li @click="setStatus(1)">已標註完成</li>
          <li @click="setStatus(2)">有研究價值</li>
          <li @click="setStatus(3)">待專家檢定</li>
        </ul>
      </div>
      <div id='column-menu'>
        <ul>
          <li><input type="text" class="form-control" v-model="newColumn" /></li>
          <li><a class="btn btn-success btn-sm" @click="addNewColumn()">新增</a></li>
        </ul>
      </div>
      
      <gallery 
      :photo="photo"
      :open="photoGalleryOpen" 
      :continuous="continuous" 
      @render="reRenderGrid" 
      @change="changeRow" 
      @rangeChange="rangeRowUpdate" 
      @toggle="togglePhoto" 
      @trigger="lightBoxOpen=true;" />
      
    </section>

    <light-box 
    :open="lightBoxOpen" 
    :info="{photo: photo, total: table_rows.length, current: currentRow}" 
    @close="lightBoxOpen = false;" />

  </div>
</template>


<script>
import {mapGetters, mapActions} from 'vuex'
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import TimeInput from '../components/Form/TimeInput'
import LightBox from '../components/LightBox'
import Gallery from '../components/Gallery'

const rowData = [
  {
    add: undefined,
    age: "",
    camera: "16",
    continuous_start: 0,
    current_continuous: 1,
    date___time: "3/6/18 14: 01",
    file_name: "",
    id: "",
    is_continuous_start: true,
    notes: "",
    number_of_individuals: "",
    project: "卡大地布哺乳動物調查",
    sex: "",
    species_name: "測試",
    station: "嘎者嘎讓遺址",
    status: 1
  },
  {
    add: undefined,
    age: "",
    camera: "16",
    continuous_start: 0,
    current_continuous: 1,
    date___time: "3/6/18 14: 01",
    file_name: "03060001.JPG",
    id: "",
    is_continuous_start: true,
    notes: "",
    number_of_individuals: "",
    project: "卡大地布哺乳動物調查",
    sex: "",
    species_name: " ",
    station: "嘎者嘎讓遺址",
    status: 1
  },
  {
    add: undefined,
    age: "",
    camera: "16",
    continuous_start: 0,
    current_continuous: 1,
    date___time: "3/6/18 14: 01",
    file_name: "03060001.JPG",
    id: "",
    is_continuous_start: true,
    notes: "",
    number_of_individuals: "",
    project: "卡大地布哺乳動物調查",
    sex: "",
    species_name: "幼歡",
    station: "嘎者嘎讓遺址",
    status: 1
  },
  {
    add: undefined,
    age: "",
    camera: "16",
    continuous_start: 0,
    current_continuous: 1,
    date___time: "3/6/18 14: 01",
    file_name: "03060001.JPG",
    id: "",
    is_continuous_start: true,
    notes: "",
    number_of_individuals: "",
    project: "卡大地布哺乳動物調查",
    sex: "",
    species_name: "幼歡",
    station: "嘎者嘎讓遺址",
    status: 1
  },
  {
    add: undefined,
    age: "",
    camera: "16",
    continuous_start: 0,
    current_continuous: 1,
    date___time: "3/6/18 14: 01",
    file_name: "03060001.JPG",
    id: "",
    is_continuous_start: true,
    notes: "",
    number_of_individuals: "",
    project: "卡大地布哺乳動物調查",
    sex: "",
    species_name: "",
    station: "嘎者嘎讓遺址",
    status: 1
  }
];

export default {
  components: {
    DatePicker, TimeInput, LightBox, Gallery
  },
  data () {
    return {
      dir: 0,
      currentContinuous: 0,
      continuousStart: 0,
      continuousCount: 0,
      lightBoxOpen: false,
      photoGalleryOpen: true,
      searchPanelShow: true,
      is_update: false,
      updateRow: 0,
      updateColumn: '',
      isRange: false,
      start_at: new Date(),
      end_at: new Date(),
      continuous: {
        row: 0,
        current: 0,
        total: 0
      },
      newColumn: '',
      gridPosition: {
        left: 0,
        top: 0
      },
      tooltips: [''],
      page: {
        number: 0,
        size: 500
      },
      key: [],
      keyMap: {},
      selectNo: 1,
      photo: { name: '', src: ''},
      columns: [
        {
          text: '狀態', sortable: false, filterable: false, editable: false, pinned: true,
          groupable: false, draggable: false, resizable: false,
          datafield: 'status', columntype: 'number', width: 80,
          cellsrenderer: (row, column, value) => {
            let $row = this.table_rows[row],
                $html = '';
                
            if(!$row.is_valuable_1==false && $row.is_valuable_1==true)
              $html += '<span class="is_valuable_1"></span>';
            if(!$row.is_valuable_2==false && $row.is_valuable_2==true)
              $html += '<span class="is_valuable_2"></span>';
            if(!$row.is_valuable_3==false && $row.is_valuable_3==true)
              $html += '<span class="is_valuable_3"></span>';

            return "<div style='margin:4px;'>" + $html + (value + 1) + "</div>";
          }
        }
      ],
      source: {
        localdata: [],
        datatype: "array",
        updaterow (rowid, rowdata, commit) {
          commit(true);
        },
        datafields: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'table_rows', 'species', 'camara', 'currentRow', 'currentColumn'
    ])
  },
  methods: {
    ...mapActions([
      "setTableRows", "setTableRow", 'setSpecies', 'setCamara', 'setCurrentRow', 'setCurrentColumn'
    ]),
    toggleSearchPanel() {
      this.searchPanelShow =! this.searchPanelShow;
      this.reRenderGrid();
    },
    togglePhoto(toggle) {
      this.photoGalleryOpen = toggle;
      this.reRenderGrid();
    },
    reRenderGrid() {
      this.gridPosition = $('#grid').jqxGrid('scrollposition');
      
      setTimeout(() => {
        $('#grid').jqxGrid('destroy');
        $("#jqxWidget").append($('<div/>',{ id: "grid", class: 'loading'}));
        this.renderGrid();

        $("#grid").jqxGrid('scrolloffset', this.gridPosition.top, this.gridPosition.left);
      }, 300);
    },
    numberrenderer (row, column, value) {
      return '<div style="text-align: center; margin-top: 5px;">' + (1 + value) + '</div>';
    },
    rangeRowUpdate(value) {
      $("#grid").jqxGrid('unselectcell', this.currentRow, this.currentColumn);

      this.setCurrentRow(this.currentRow + (value - this.continuous.current));
      
      $("#grid").jqxGrid('selectcell', this.currentRow, this.currentColumn);
      
      this.setContinuous();
      this.toCurrentPage();
    },
    changeRow(num) {
      $("#grid").jqxGrid('unselectcell', this.currentRow, this.currentColumn);

      if( num>0 && this.currentRow+num<this.table_rows.length-1) 
        this.setCurrentRow(this.currentRow+1);
      
      if( num<0 && this.currentRow>0) 
        this.setCurrentRow(this.currentRow-1);

      $("#grid").jqxGrid('selectcell', this.currentRow, this.currentColumn);

      this.setContinuous();
      this.toCurrentPage();
    },
    copyRow () {
      let row = this.table_rows[this.currentRow],
          old_rows = this.table_rows;
      
      old_rows.splice(this.currentRow, 0, row);
      
      this.setTableRows(old_rows);
      this.toCurrentPage();
    },
    newRow () {
      let row = {},
          old_rows = this.table_rows;

      for(var i in this.columns) {
        row[i] = '';
      }
      
      old_rows.splice(this.currentRow, 0, row);
      
      this.setTableRows(old_rows);
      this.toCurrentPage();
    },
    delRow () {
      let old_rows = this.table_rows;
      old_rows.splice(this.currentRow, 1)
      this.setTableRows(new_rows);
      this.toCurrentPage();
    },
    setStatus(s) {
      let row = this.table_rows[this.currentRow];
      
      if(s==1) {
        if(row.is_valuable_1===undefined)
          row.is_valuable_1 = true;
        else
          row.is_valuable_1 = !row.is_valuable_1;
      }
      if(s==2) {
        if(row.is_valuable_2===undefined)
          row.is_valuable_2 = true;
        else
          row.is_valuable_2 = !row.is_valuable_2;
      }
      if(s==3) {
        if(row.is_valuable_3===undefined)
          row.is_valuable_3 = true;
        else
          row.is_valuable_3 = !row.is_valuable_3;
      }
      this.setTableRow(row, this.currentRow);
      this.reRenderGrid();
    }, 
    toCurrentPage() {
      $('#grid').jqxGrid('updatebounddata');
      $('#grid').jqxGrid('gotopage', this.page.number);
    },
    setContinuous () {
      let row = this.table_rows[this.currentRow];

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
          total: this.table_rows[row.continuous_start].continuous_count
        }
    },
    renderGrid () {
      // create Grid datafields and columns arrays.
      var datafields = [];
      var columns = [];
      var self = this;
      
      this.source.localdata = this.table_rows
      var dataAdapter = new $.jqx.dataAdapter(this.source);
      var contextMenu = $("#menu").jqxMenu({ width: 200, autoOpenPopup: false, mode: 'popup', theme: 'material-green' });
      var statusMenu = $("#status-menu").jqxMenu({ width: 200, autoOpenPopup: false, mode: 'popup', theme: 'material-green' });
      var columnMenu = $("#column-menu").jqxMenu({ width: 200, autoOpenPopup: false, mode: 'popup', theme: 'material-green', autoCloseOnClick: false });

      $("#grid").on('contextmenu', function () {
        return false;
      });

      // init
      $("#grid").jqxGrid({
        width: $("#grid").width(),
        source: dataAdapter,
        theme: 'material-theme',
        height: $('.result-block').height() - 40,
        altrows: true,
        editable: true,
        sortable: true,
        filterable: true,
        columnsresize: true,
        enabletooltips: false,
        pageable: true,
        pagesize: 500,
        pagesizeoptions: [500, 1000, 1500],
        selectionmode: 'multiplecellsadvanced',
        cellhover: (element, pageX, pageY) => {
          var idx = $(element).parent().children().index(element);
          // update tooltip.
          if(this.tooltips[idx]!="") {
            $("#grid").jqxTooltip({ 
              theme: 'dark',
              content: this.tooltips[idx] 
            });
            // open tooltip.
            $("#grid").jqxTooltip('open', pageX + 15, pageY + 15);
            
          }

          return;
        },
        columns: this.columns,
        rendered: () => {
          $("#grid").removeClass('loading');
        }
      });

      $("#grid").on("pagechanged", function (event) {
        var args = event.args;
        self.page.number = args.pagenum;
        self.page.size = args.pagesize;
      });
      
      $("#grid").on('cellselect', (event) => {

        setTimeout(() => {
          if( self.is_update ) {
            self.updateColumn = event.args.datafield;
            self.updateRow = event.args.rowindex;
            return;
          }

          $("#contenttablegrid").find('.jqx-grid-cell.with-select').removeClass('with-select');;
          $("#contenttablegrid").find(".jqx-grid-cell-selected").siblings('.jqx-grid-cell').addClass('with-select');
          
          self.setCurrentColumn(event.args.datafield);
          self.setCurrentRow(event.args.rowindex);

          self.setContinuous();
          self.renderPhoto();
        }, 100)
      });

      $("#grid").on('cellvaluechanged', (event) => {
        // console.log(columnDataField, cellValue);
        var args = event.args;
        var columnDataField = args.datafield;
        var rowIndex = args.rowindex;
        var cellValue = args.value;
        var oldValue = args.oldvalue;
        let dis = self.continuous.total - self.continuous.current;
        let row = self.table_rows[rowIndex];
        
        row.species_name = cellValue;
        self.setTableRow(row, rowIndex)
        
        if(columnDataField=="species_name" && self.continuous.total>0 && dis > 0) {
          self.is_update = true;
          for(var i = 1; i<=dis; i++) {
            let r = self.table_rows[rowIndex + i];
            r['species_name'] = cellValue
            self.setTableRow(r, rowIndex + i)
          }

          self.is_update = false;

          self.setCurrentColumn(self.updateColumn);
          self.setCurrentRow(self.updateRow);

          self.toCurrentPage();
          self.setContinuous();
          self.renderPhoto();
        }

      });

      $("#grid").jqxGrid('selectcell', this.currentRow, this.currentColumn);

      $("#grid").on('cellclick', function (event) {
        if (event.args.rightclick) {
          // console.log(event);

          $("#contenttablegrid").find(".jqx-grid-cell-selected").removeClass("jqx-grid-cell-selected");
          $("#grid").jqxGrid('selectcell', event.args.rowindex, event.args.datafield);
          
          var scrollTop = $("#contentgrid").scrollTop();
          var scrollLeft = $("#contentgrid").scrollLeft();

          if(event.args.datafield=='status') {
            statusMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
          } else {
            contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
          }
          self.setCurrentRow(event.args.rowindex);
          self.renderPhoto();

          return false;
        }

      });

      $("#grid").on('columnclick', (event) => {
        let name = event.args.datafield;

        if(name!=="add") return;
        
        let scrollTop = $("#contentgrid").scrollTop();
        let scrollLeft = $("#contentgrid").scrollLeft();
        self.newColumn = '';
        columnMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
      });

      this.renderPhoto()
    },
    addNewColumn() {
      $("#column-menu").jqxMenu('close');

      var rows = this.table_rows;
      var newField = (this.newColumn.replace(/[ |&]/g, '_')).toLowerCase()
      var col = this.columns.length - 1;
      var old_columns = this.columns;
      var new_col = {
        text: this.newColumn,
        datafield: newField,
        groupable: false, columntype: 'text', width: 80,
      };
      
      // console.log(rows, col, old_columns, new_col)
      
      old_columns.splice(col, 0, new_col);
      this.columns = old_columns

      rows.forEach((ref, i) => {
        ref[newField] = '';
      })

      this.setTableRows(rows);
      this.reRenderGrid();
    },
    renderPhoto() {
      let row = this.table_rows[this.currentRow];
      this.photo.src = `../photo/${row.file_name}`;
      this.photo.name = row.file_name;
    },
    cellclass(row, columnfield, value) {
      let result = '';
      let $row = this.table_rows[row];

      if(columnfield=='status') {
        alert('cellclass')
        if(!$row.is_valuable_1==false && $row.is_valuable_1==true)
          result += ' is_valuable_1 ';
        if(!$row.is_valuable_2==false && $row.is_valuable_2==true)
          result += ' is_valuable_2 ';
        if(!$row.is_valuable_3==false && $row.is_valuable_3==true)
          result += ' is_valuable_3 ';
      }

      if(columnfield=='date___time') {
        let current = this.table_rows[row].date___time;
        let prev = row > 0 ? this.table_rows[row-1]['date___time'] : null;
        let next = row + 1 < this.table_rows.length ? this.table_rows[row + 1]['date___time'] : null;
        let c_dt = new Date(current);
        let p_dt = !prev ? null : new Date(prev);
        let n_dt = !next ? null : new Date(next);
        let isContinue = false;
        let isStart = false;
        let isEnd = false;

        if(!n_dt==false && (n_dt - c_dt <= 60000 || !p_dt==false && c_dt - p_dt <= 60000) && (["測試", "空拍"].indexOf(this.table_rows[row]['species_name']) == -1)) {
          isContinue = true;
          $row.is_continuous = true;
          this.continuousCount++;
          result += " is-continuous ";
        }
        // detect is continuous start
        if(isContinue && !p_dt && n_dt - c_dt <= 60000 || c_dt - p_dt >= 60000) {
          isStart = true;
          this.continuousCount = 1;
          this.continuousStart = row;
          $row.is_continuous_start = true;
          result += " is-continuous-start ";
        }
        
        $row.current_continuous = this.continuousCount;
        $row.continuous_start = this.continuousStart;
        // detect is continuous end
        if(isContinue && !n_dt && c_dt - p_dt <= 60000 || n_dt - c_dt >= 60000) {
          isEnd = true;
          $row.is_continuous_end = true;
          
          this.table_rows[this.continuousStart].continuous_count = this.continuousCount;
          this.continuousCount = 0;
          result += " is-continuous-end ";
        }
      }
      if(columnfield=='species_name') {
        if(this.species.indexOf(value) == -1) {
          result += ' has-error';
        }
      }
      
      if(columnfield=='file_name' && value=="") {
        result += ' has-error';
      }
      
      return result;
    }
  },
  beforeMount() {
    let $this = this;

    axios.get('../csv/for-zip-upload.csv').then((response) => {
      var data = [];
      var rows = [];

      (response.data.split(/\r\n/g)).forEach((ref, idx) => {
        var row = ref.split(/,/g);
        // debugger;
        if(idx==0) {
          // Project, Station, Camera, File name, Date & Time, Species name, Number of individuals,Sex,Age,ID,Notes
          var df  = [], 
              col = [],
              currentContinuous = 0,
              continuousStart = 0,
              continuousCount = 0;

          row.forEach((r, r_id) => {
            var celltype = "text",
                df_type = "string",
                cellformat = '', 
                cellevt = null,
                cellrender = null;

            switch(r) {
              case "Project": 
                $this.tooltips[r_id+1] = "專案名稱";
                break;
              case "Station": 
                $this.tooltips[r_id+1] = "站點";
                break;
              case "Camera": 
                $this.tooltips[r_id+1] = "相機";
                break;
              case "File name": 
                $this.tooltips[r_id+1] = "照片名稱";
                break;
              case "Date & Time": 
                celltype = 'datetimeinput';
                cellformat = "yyyy-MM-dd HH:mm:ss";
                $this.tooltips[r_id+1] = "拍攝日期";
                
                break;
              case "Number of individuals": 
                df_type = "int",
                cellformat = "n"
                $this.tooltips[r_id+1] = "物種數量";
                break;
              case "Sex": 
                $this.tooltips[r_id+1] = "性別";
                break;
              case "Age": 
                df_type = "int",
                cellformat = "n"
                $this.tooltips[r_id+1] = "年齡";
                break;
              case "Species name": 
                $this.tooltips[r_id+1] = "物種名稱";
                celltype = 'combobox';
                
                break;
              default: 
                $this.tooltips[r_id+1] = "";
            }
            var text = (r.replace(/[ |&]/g, '_')).toLowerCase();
            
            df.push({
              name: text,
              type: df_type
            })

            col.push({
              text: r,
              width: 30 + text.length * 8,
              datafield: text,
              cellclassname: this.cellclass,
              columntype: celltype,
              cellsformat: cellformat,
              cellsrenderer: cellrender
            })
          })

          col.push({
            text: '+', sortable: false, filterable: false, editable: false,
            groupable: false, draggable: false, resizable: false,
            datafield: 'add', columntype: 'text', width: 80
          })

          $this.source.datafields = df;
          $this.columns = $this.columns.concat(col);

        } 
      });
      
      this.setTableRows(rowData);
      this.renderGrid()
    })
  },
  mounted () {
    // this.preload(0);
  }
}
</script>
