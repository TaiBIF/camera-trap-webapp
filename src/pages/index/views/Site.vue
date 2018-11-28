<template>
  <div class="maintain page-sheet p-0">
    <div class="search-container">
      <!-- Edit mode -->
      <div
        v-if="editMode"
        class="edit-container"
      >
        <div class="row">
          <div class="col-7">
            <span class="text-gray">{{this.$route.params.site_id}} - {{this.$route.params.subsite_id}}</span>
            <span class="divider"></span>
            <span class="text-gray">{{editViewCameraList.join(',')}}</span>
            <span class="divider"></span>
            <span class="text-gray">{{editViewTimeRange.start}} 到 {{editViewTimeRange.end}}</span>
            <span class="error-label">20</span>
          </div>
          <div class="col-5 text-right">
            <span class="text-gray">最後儲存時間：{{`todo`}} 分鐘前</span>
            <span class="divider"></span>
            <button
              @click.stop.prevent="changeMode('editMode', false)"
              class="btn btn-circle"
            ><i class="icon-save"></i></button>
            <span class="divider"></span>
            <button
              @click.stop.prevent="changeMode('editMode', false)"
              class="btn btn-basic btn-sm"
            >關閉編輯模式</button>
          </div>
        </div>
      </div>
      <!-- Overview mode -->
      <div
        v-else
        class="search-content"
      >
        <a
          class="btn btn-green-border btn-sm float-right"
          v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
          @click="exportCsv"
        >
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">{{this.$route.params.site_id}} - {{this.$route.params.subsite_id}}</h3>
        <hr class="my-0">
        <form
          action=""
          class="form form-horizontal"
        >
          <div class="form-group mb-0">
            <label>相機位置</label>
            <div class="d-inline-block">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  v-model="form.camera"
                  id="camera-all"
                  value="all"
                >
                <label for="camera-all">全部相機位置</label>
              </div>
              <div class="mb-2">
                <div
                  class="checkbox checkbox-inline"
                  :key="camera.fullCameraLocationMd5"
                  v-for="camera in cameraList"
                >
                  <input
                    type="checkbox"
                    v-model="form.camera"
                    :id="camera.fullCameraLocationMd5"
                    :value="camera.fullCameraLocationMd5"
                  >
                  <label :for="camera.fullCameraLocationMd5">
                    <span class="text">{{camera.cameraLocation}}</span>
                    <span
                      class="icon"
                      v-if="cameraLocked[camera.fullCameraLocationMd5] && cameraLocked[camera.fullCameraLocationMd5].locked"
                    >
                      <i
                        class="icon-lock align-middle"
                        v-tooltip.top="`${cameraLocked[camera.fullCameraLocationMd5].lockedBy} 正在編輯中`"
                      ></i>
                    </span>
                    <span class="error-label">1</span>
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
                  <date-picker
                    v-model="form.start_at"
                    :placeholder="'18/9/20'"
                    :format="'YYYY-MM--DD'"
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
                <span class="input-text">到</span>
                <div class="input-group">
                  <date-picker
                    v-model="form.end_at"
                    :placeholder="'18/9/20'"
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
                    format="HH:mm"
                  ></vue-timepicker>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              @click.stop.prevent="changeMode('editMode', true)"
              class="btn btn-sm btn-block btn-green"
              :disabled="!enableEditeMode"
            >
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
              <small class="text-gray">共 {{siteData.data.length}} 筆資料</small>
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
                v-tooltip.top="'影像檢視'"
                @click="changeMode('galleryShow', !galleryShow)"
                :class="{'active': galleryShow}"
              >
                <i class="icon-gallery"></i>
              </a>
              <div class="divider"></div>
              <a
                class="btn btn-icon"
                v-tooltip.top="'版本紀錄'"
                @click="changeMode('historyShow', !historyShow)"
                :class="{'active': historyShow}"
              >
                <i class="icon-time-machine"></i>
              </a>
            </div>
          </div>
          <div
            class="error-message"
            v-if="hasColumnError"
          >
            <a
              class="close"
              @click="hasColumnError=false"
            >
              <i class="fa fa-times"></i>
            </a>
            <span class="alert-box"></span>
            <span class="text">
              物種名稱不在預設中，請修正名稱，或<a class="link">回報管理員</a>
            </span>
          </div>
        </div>
        <div id="spreadsheet"></div>
        <!-- Pagination -->
        <div class="sheet-footer">
          <span class="text-gray">單頁顯示</span>
          <span class="select">
            <select
              name=""
              id=""
              class="form-control"
            >
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="1500">1500</option>
            </select>
          </span>
          <span class="text-gray">筆資料，您正在檢視：</span>
          <span>第 2001 - 3501 筆</span>
          <div class="float-right">
            <div class="input-group pager">
              <div class="input-group-prepend">
                <button>
                  <i class="fa fa-caret-left"></i>
                </button>
              </div>
              <input
                type="text"
                class="form-control"
                value="1/10"
              >
              <div class="input-group-append">
                <button>
                  <i class="fa fa-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="sidebar"
        :style="{'width': `${historyShow || galleryShow ? galleryWidth : 0}px`}"
      >
        <div
          class="photo-container"
          v-if="siteData.data[currentRow] && !siteData.data[currentRow].imageUrl==false && galleryShow"
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
            v-if="!siteData.data[currentRow].imageUrl || siteData.data[currentRow].imageUrl==''"
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
              :row="siteData.data[currentRow]"
              :index="currentRow"
              :total="siteData.data.length"
            />
            <div class="control">
              <span
                class="prev"
                v-tooltip.top="'上一張'"
                @click="currentRow>0 ? currentRow--: currentRow"
              >
                <i class="fa fa-caret-left"></i>
              </span>
              <span class="text">
                {{siteData.data[currentRow].fileName}} | {{siteData.data[currentRow].corrected_date_time}}
              </span>
              <span
                class="prev"
                v-tooltip.top="'下一張'"
                @click="currentRow>siteData.data[currentRow].length-1?currentRow: currentRow++"
              >
                <i class="fa fa-caret-right"></i>
              </span>
            </div>
            <div class="text-right my-2">
              <router-link
                :to="`/project/${$route.params.id}/site/${$route.params.subsite_id}/photo/1`"
                class="btn btn-sm btn-default"
              >
                進階標註
              </router-link>
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
                <tr
                  v-for="(history, i) in historyList"
                  :key="`history-${i}`"
                >
                  <td>{{history.updateAt}}</td>
                  <td class="text-gray">由 <b>{{history.updateBy}}</b> 編輯</td>
                  <td
                    class="text-gray"
                    v-if="i===0"
                  >目前版本</td>
                  <td
                    class="text-gray"
                    v-else
                  >
                    <a class="btn btn-basic btn-sm">還原成此版本</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="drag-bar"
          @mousedown="dragStart"
          v-tooltip.top="'拖曳拉大影像檢視範圍'"
        ></div>
      </div>
    </div>
    <idle-timeout-dialog
      :open="idleTimeoutOpen"
      @close="idleTimeoutOpen=false; editMode = false"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import Handsontable from 'handsontable';
import 'handsontable/languages/all';
import ZoomDrag from '../components/ZoomDrag';
import IdleTimeoutDialog from '../components/IdleTimeoutDialog';
import downloadCSV from '../../../util/downloadCsv.js';

const project = createNamespacedHelpers('project');
const media = createNamespacedHelpers('media');
const cameraLocation = createNamespacedHelpers('cameraLocation');

const formDefault = {
  camera: [],
  start_at: moment('2017/1/1'),
  end_at: moment('2018/12/31'),
  start_time: {
    HH: '00',
    mm: '00',
  },
  end_time: {
    HH: '23',
    mm: '59',
  },
};

// debugger
export default {
  name: 'Site',
  data() {
    return {
      today: moment(),
      idleTimeout: null,
      idleTimeoutOpen: false,
      hasColumnError: false,
      editMode: false,
      galleryShow: true,
      historyShow: true,
      isRender: false,
      scaleSize: 1,
      galleryWidth: 450,
      isContinuous: false,
      continuousTime: 1,
      form: Object.assign({}, formDefault),
      selection: null,
      currentRow: 0,
      row_data: [],
      historyList: [
        {
          updateAt: '2018/09/05 17:37',
          updateBy: '黃智賢',
        },
        {
          updateAt: '2018/09/05 17:37',
          updateBy: '黃智賢',
        },
        {
          updateAt: '2018/09/05 17:37',
          updateBy: '黃智賢',
        },
      ],
      rowData: {},
      // 連拍紀錄
      continuousCount: 0,
      continuousStart: false,
      continuous: {
        row: null,
        current: 0,
        total: 0,
      },
      contextMenuSetting: {
        callback: (key, selection) => {
          const idx = selection[0].start.row;
          const row = this.row_data[idx];

          switch (key) {
            // 設定連拍
            case 'setContinuous':
              this.settings.data[idx].is_continuous = true;
              break;
            case 'stopContinuous':
              this.settings.data[idx].is_continuous = false;
              break;
            // 複製一列
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
              const selected = this.sheet.getSelectedLast();
              return this.row_data[selected[0]].is_continuous;
            },
          },
          stopContinuous: {
            name: () => {
              return '<span class="icon"><i class="icon-unlink"></i></span><span class="text">解除連拍連結</span>';
            },
            disabled: () => {
              const selected = this.sheet.getSelectedLast();
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
        language: 'zh-TW',
        stretchH: 'all',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        manualRowMove: true,
        manualColumnMove: true,
        filters: true,
        contextMenu: false,
        dropdownMenu: true,
        cells: (row, col) => {
          const cellProperties = {};
          if (col === 4 || col === 3) {
            cellProperties.renderer = 'continousRenderer';
          }
          return cellProperties;
        },
        afterChange: changes => {
          if (!changes) return;
          const payload = changes.reduce((arr, change) => {
            const [row, prop, oldVal, newVal] = change;
            const value = this.siteData.data[row];

            if (oldVal !== newVal) {
              if (!value.index.column[prop]) {
                //資料尚未存在需要更新 index
                const newColumnIndex = value.index.columnLength;
                this.addSiteDataLength({
                  row,
                  newColumnIndex,
                  prop,
                });
              }

              arr.push({
                _id: value._id,
                projectId: value.projectId,
                projectTitle: value.projectTitle,
                fullCameraLocationMd5: value.fullCameraLocationMd5,
                $set: {
                  [`tokens.${value.index.token}.data.${
                    value.index.column[prop]
                  }.key`]: prop,
                  [`tokens.${value.index.token}.data.${
                    value.index.column[prop]
                  }.label`]: this.siteData.columns.find(v => v.data === prop)
                    .label,
                  [`tokens.${value.index.token}.data.${
                    value.index.column[prop]
                  }.value`]: newVal,
                },
              });
            }

            return arr;
          }, []);

          this.updateAnnotation(payload);
        },
        afterSelectionEnd: r => {
          this.currentRow = r;
        },
      },
      sheetContainer: null,
      sheet: null,
      isDrag: false,
      fetchCameraLockTimer: null,
    };
  },
  watch: {
    currentRow: 'recordUpdate',
    $route() {
      // 清空篩選條件
      this.form = Object.assign({}, formDefault);
      this.fetchCameraLocked();
    },
    form: {
      handler: function(newValue) {
        const getTime = (day, time) => {
          return (
            moment(day)
              .hour(time.HH)
              .minute(time.mm)
              .format('X') - 0
          );
        };

        const payload = {
          query: {
            projectId: this.$route.params.id,
            site: this.$route.params.site_id,
            date_time_corrected_timestamp: {
              $gte: getTime(newValue.start_at, newValue.start_time),
              $lte: getTime(newValue.end_at, newValue.end_time),
            },
            fullCameraLocationMd5:
              newValue.camera.indexOf('all') !== -1
                ? undefined
                : { $in: newValue.camera },
          },
          limit: 100000,
          skip: 0,
        };

        if (
          payload.query.date_time_corrected_timestamp['$gte'] !==
            'Invalid date' &&
          payload.query.date_time_corrected_timestamp['$lte'] !== 'Invalid date'
        ) {
          this.getSiteData(payload);
        }
      },
      deep: true,
    },
    siteData: {
      handler: function() {
        this.getSheetData();
      },
      deep: true,
    },
  },
  components: {
    DatePicker,
    VueTimepicker,
    ZoomDrag,
    IdleTimeoutDialog,
  },
  computed: {
    ...project.mapGetters(['currentProject']),
    ...media.mapGetters(['species']),
    ...cameraLocation.mapGetters(['cameraLocked']),
    ...media.mapState(['siteData']),
    cameraList() {
      return this.currentProject
        ? this.currentProject.cameraLocations.filter(
            val => val.subSite === this.$route.params.subsite_id,
          )
        : [];
    },
    // 編輯視窗用相機列表
    editViewCameraList() {
      return this.form.camera.indexOf('all') !== -1
        ? this.cameraList.map(val => val.cameraLocation)
        : this.form.camera.map(
            val =>
              this.cameraList.find(v => v.fullCameraLocationMd5 === val)
                .cameraLocation,
          );
    },
    // 編輯視窗用資料時間
    editViewTimeRange() {
      const getTime = (day, time) => {
        return moment(day)
          .hour(time.HH)
          .minute(time.mm)
          .format('YYYY-MM-DD HH:mm:ss');
      };

      return {
        start: getTime(this.form.start_at, this.form.start_time),
        end: getTime(this.form.end_at, this.form.end_time),
      };
    },
    // 判斷是否可以進入編輯模式
    enableEditeMode() {
      return this.form.camera.indexOf('all') !== -1
        ? this.cameraList.every(
            val =>
              this.cameraLocked[val.fullCameraLocationMd5].locked === false,
          )
        : this.siteData.data.length > 1 &&
            this.form.camera.every(
              val => this.cameraLocked[val].locked === false,
            );
    },
    sheetSetting() {
      const columns = this.siteData.columns.map(column => ({
        ...column,
        editor: this.editMode ? column.editorMode : false,
      }));

      return {
        ...this.settings,
        ...this.siteData,
        ...{ columns },
      };
    },
  },
  methods: {
    ...project.mapMutations(['setCurrentProject']),
    ...media.mapMutations(['addSiteDataLength']),
    ...media.mapActions(['getSiteData', 'updateAnnotation']),
    ...cameraLocation.mapActions(['getCameraLocked', 'setCameraLocked']),
    exportCsv() {
      downloadCSV([this.siteData.colHeaders, ...this.sheet.getData()]);
    },
    fetchCameraLocked() {
      this.getCameraLocked({
        projectId: this.$route.params.id,
        site: this.$route.params.site_id,
        subSite: this.$route.params.subsite_id,
      });
    },
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
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      const $row = this.row_data[row];
      let clsName = '';
      let error = '';

      if (prop === 'species' && !value === false && value !== '') {
        if (!$row === false) TD.dataset.tooltip = $row.sciName;
        // 不在預設物種資料顯示錯誤
        if (
          this.species.indexOf(value) === -1 &&
          value.indexOf('測試') === -1
        ) {
          // 設定錯誤提示文字
          TD.dataset.tooltip = '物種不在預設中';
          this.hasColumnError = true;
          clsName += 'htInvalid ';
          error = '<span class="alert-box">!</span>';
        }
      }
      if (
        this.isContinuous &&
        prop === 'corrected_date_time' &&
        !value === false &&
        value !== ''
      ) {
        // 是否為連拍照片
        if ($row.is_continuous) {
          clsName += 'is-continuoust';

          // 是否與連拍分離
          if ($row.is_continuous_apart) {
            clsName += ' is-continuous-apart';
          }

          if ($row.is_continuous_start) {
            TD.dataset.tooltip = '連拍';
            clsName += ' is-continuous-start ';
          }

          if ($row.is_continuous_end) {
            clsName += ' is-continuous-end ';
          }
        }
      }
      TD.innerHTML = value + error;
      TD.className = clsName;
    },
    setCurrentContinuous() {
      // 取得目前資料的連拍資訊
      const row = this.row_data[this.currentRow];

      if (!row.is_continuous) {
        this.continuous = {
          row: null,
          current: 0,
          total: 0,
        };
      } else {
        this.continuous = {
          row: this.currentRow,
          current: row.current_continuous,
          total: this.row_data[row.continuous_start].continuous_count,
        };
      }
    },
    renderContinuous() {
      // 切換連拍狀態
      this.isContinuous = !this.isContinuous;
      this.setContinuous();
    },
    setContinuous(data) {
      const rowData = !data ? this.row_data : data;
      // 判斷連拍
      rowData.forEach((r, i) => {
        const $row = r;
        const current = r.corrected_date_time;
        const prev = i > 0 ? rowData[i - 1].corrected_date_time : null;
        const next =
          i + 1 < rowData.length ? rowData[i + 1].corrected_date_time : null;
        const cDt = new Date(current);
        const pDt = !prev ? null : new Date(prev);
        const nDt = !next ? null : new Date(next);
        const time = Number(this.continuousTime) * 60 * 1000;
        let isContinue = false;
        // const isStart = false
        // const isEnd = false

        if ($row.is_continuous_apart === undefined) {
          $row.is_continuous_apart = false;
        }

        // 排除測試、空拍
        if (
          !nDt === false &&
          (nDt - cDt <= time || (!pDt === false && cDt - pDt <= time)) &&
          ['測試', '空拍'].indexOf($row.species) === -1
        ) {
          isContinue = true;
          $row.is_continuous = true;
          this.continuousCount++;
        }

        // 是不是連拍第一張
        if ((isContinue && !pDt && nDt - cDt <= time) || cDt - pDt >= time) {
          // isStart = true
          this.continuousCount = 1;
          this.continuousStart = i;
          $row.is_continuous_start = true;
        }

        $row.current_continuous = this.continuousCount;
        $row.continuous_start = this.continuousStart;

        // 是不是連拍最後一張
        if ((isContinue && !nDt && cDt - pDt <= time) || nDt - cDt >= time) {
          // isEnd = true
          $row.is_continuous_end = true;

          rowData[this.continuousStart].continuous_count = this.continuousCount;
          this.continuousCount = 0;
        }
      });

      return rowData;
    },
    getSheetData() {
      // 產出 sheet 畫面
      this.row_data = this.siteData.data;
      Handsontable.renderers.registerRenderer(
        'continousRenderer',
        this.continousRenderer,
      );
      this.sheet = new Handsontable(this.sheetContainer, this.sheetSetting);

      this.isRender = true;
    },
    changeMode(key, val) {
      // 切換編輯狀態
      this[key] = val;

      if (key === 'editMode') {
        // 使用 api 鎖定相機位置
        const list =
          this.form.camera.indexOf('all') !== -1
            ? this.cameraList.map(val => val.fullCameraLocationMd5)
            : this.form.camera;

        this.setCameraLocked(
          list.map(v => ({
            fullCameraLocationMd5: v,
            projectId: this.$route.params.id,
            locked: val,
          })),
        );

        // 打開右鍵選單，打開欄位編輯模式
        this.settings.contextMenu = !val ? false : this.contextMenuSetting;
        // 更新 sheet
        this.sheet.updateSettings(this.sheetSetting);
      }

      setTimeout(() => {
        this.settingSheetHeight();
      }, 200);
    },
    settingSheetHeight() {
      // 根據模式切換更新 sheet 高度
      const sheetHeight =
        window.innerHeight -
        (64 + this.$el.querySelector('.search-container').clientHeight);
      this.settings.height = sheetHeight - 80;
      this.$el
        .querySelector('.sheet-container')
        .querySelector('.sidebar').style.height =
        sheetHeight + 'px';
      // debugger
      if (this.isRender) this.sheet.updateSettings(this.sheetSetting);
    },
  },
  mounted() {
    this.setCurrentProject(this.$route.params.id);
    this.fetchCameraLocked();

    // 綁定 sheet element、設定高度、取得資料
    this.sheetContainer = this.$el.querySelector('#spreadsheet');
    this.settingSheetHeight();

    window.onresize = () => {
      this.settingSheetHeight();
    };

    // 拖拉側欄照片區塊大小
    document.body.addEventListener('mousemove', e => {
      this.dragMove(e);
      if (this.editMode) {
        this.idleTimeoutOpen = false;
        clearTimeout(this.idleTimeout);
        this.idleTimeout = setTimeout(() => {
          this.idleTimeoutOpen = true;
          this.editMode = false;
        }, 18000000);
      }
    });

    document.body.addEventListener('mouseup', e => {
      this.dragEnd(e);
    });

    this.fetchCameraLockTimer = setInterval(
      () => this.fetchCameraLocked(),
      18000000,
    );
  },
  beforeDestroy() {
    clearInterval(this.fetchCameraLockTimer);
  },
};
</script>
