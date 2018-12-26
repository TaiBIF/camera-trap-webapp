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
            <!--span class="error-label">20</span-->
          </div>
          <div class="col-5 text-right">
            <span class="text-gray">最後儲存時間：{{lastUpdated}} </span>
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
          :href="exportUrl"
          class="btn btn-green-border btn-sm float-right"
          v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
        >
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">{{this.$route.params.site_id}} - {{this.$route.params.subsite_id}} <small v-if="form.uploadSessionId">來自上傳紀錄：{{form.uploadSessionId}}</small></h3>
        <hr class="my-0">
        <form
          action=""
          class="form form-horizontal"
        >
          <div class="form-group mb-0">
            <input
              type="hidden"
              :value="form.uploadSessionId"
              id="upload-session-id"
            >
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
                  class="d-inline-block"
                  :key="camera.fullCameraLocationMd5"
                  v-for="(camera, c_id) in cameraList"
                >
                  <div
                    class="checkbox checkbox-inline"
                    v-if="c_id < 12"
                  >
                    <input
                      type="checkbox"
                      v-model="form.camera"
                      :id="camera.fullCameraLocationMd5"
                      :value="camera.fullCameraLocationMd5"
                      :disabled="form.camera.indexOf('all') > -1"
                    >
                    <label :for="camera.fullCameraLocationMd5">
                      <span class="text">{{camera.cameraLocation}}</span>
                      <span
                        class="icon"
                        v-if="cameraLocked[camera.fullCameraLocationMd5] && cameraLocked[camera.fullCameraLocationMd5].locked"
                      >
                        <i
                          class="icon-lock align-middle"
                          v-tooltip.top="`${cameraLocked[camera.fullCameraLocationMd5].lockedBy.name} 正在編輯中`"
                        ></i>
                      </span>
                      <span
                        class="error-label"
                        v-if="cameraLocationErrors[camera.fullCameraLocationMd5]"
                      >{{cameraLocationErrors[camera.fullCameraLocationMd5]}}</span>
                    </label>
                  </div>
                </div>
                <div
                  class="d-inline-block"
                  v-if="cameraList.length >= 12"
                >
                  <a
                    class="link text-gray"
                    role="button"
                    @click="CameraModalOpen = true"
                  >查看更多</a>
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
                    :placeholder="form.placeHolderStartAt"
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
                <span class="input-text">到</span>
                <div class="input-group">
                  <date-picker
                    v-model="form.end_at"
                    :placeholder="form.placeHolderEndAt"
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
                    <!--span class="text">連拍自動補齊</span-->
                    <span class="text">標記連拍</span>
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
                  <!--div
                    class="dropdown-menu"
                    aria-labelledby="continousButton"
                  >
                    當相鄰照片間隔 <input
                      type="text"
                      v-model="continuousTime"
                      class="form-control form-control-inline"
                    /> 分鐘時，自動補齊物種名稱
                  </div-->
                  <div
                    class="dropdown-menu"
                    aria-labelledby="continousButton"
                  >
                    當相鄰照片間隔小於等於 <input
                      type="text"
                      v-model="continuousTime"
                      class="form-control form-control-inline"
                    /> 分鐘時視為連拍
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
          <!--div
            class="error-message"
            v-if="hasColumnError && !editMode"
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
          </div-->
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
              v-model="pageSize"
            >
              <option value=50>50</option>
              <option value=100>500</option>
              <option value=500>500</option>
              <option value=1000>1000</option>
              <option value=1500>1500</option>
            </select>
          </span>
          <span class="text-gray">筆資料，您正在檢視：</span>
          <span>{{`第 ${currentDataRange.begin+1} - ${currentDataRange.end} 筆`}}</span>
          <div class="float-right">
            <div class="input-group pager">
              <div class="input-group-prepend">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                >
                  <i class="fa fa-caret-left"></i>
                </button>
              </div>
              <input
                disabled
                type="text"
                class="form-control"
                :value="`${currentPage}/${totalPage}`"
              >
              <div class="input-group-append">
                <button
                  @click="currentPage++"
                  :disabled="currentPage+1 > totalPage"
                >
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
          v-if="displayImageComponent"
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
            v-if="!hasImage && !hasVideo"
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
              v-if="siteData.data[currentRow].imageUrl"
              :row="siteData.data[currentRow]"
              :index="currentRow"
              :total="siteData.data.length"
            />
            <youtube-embed
              v-else
              :row="siteData.data[currentRow]"
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
                v-if="siteData.data[currentRow].type === 'StillImage'"
                :to="`/project/${$route.params.id}/site/${$route.params.site_id}/${$route.params.subsite_id}/photo/tag?image_id=${siteData.data[currentRow]._id}`"
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
                  v-for="(rev, i) in revision"
                  :key="`rev-${i}`"
                >
                  <td>{{rev.created}}</td>
                  <td class="text-gray">由 <b>{{rev.modifiedBy.name}}</b> 編輯</td>
                  <td
                    class="text-gray"
                    v-if="i===0"
                  >目前版本</td>
                  <td
                    class="text-gray"
                    v-else
                  >
                    <a
                      class="btn btn-basic btn-sm"
                      @click="restoreRev(i)"
                    >還原成此版本</a>
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
    <camera-modal
      :cameras="cameraList"
      :selected="form.camera"
      :open="CameraModalOpen"
      :cameraLocked="cameraLocked"
      @submit="setSelectedCamera"
      @close="CameraModalOpen=false"
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
import CameraModal from '../components/CameraModal';
import YoutubeEmbed from '../components/YoutubeEmbed';
import IdleTimeoutDialog from '../components/IdleTimeoutDialog';

const project = createNamespacedHelpers('project');
const media = createNamespacedHelpers('media');
const cameraLocation = createNamespacedHelpers('cameraLocation');
const annotationRevision = createNamespacedHelpers('annotationRevision');

const placeHolderStartAt = moment('2001/1/1').format('YYYY-MM-DD');
const placeHolderEndAt = moment('2018/12/31').format('YYYY-MM-DD');

const formDefault = {
  camera: [],
  placeHolderStartAt,
  placeHolderEndAt,
  start_at: moment(placeHolderStartAt),
  end_at: moment(placeHolderEndAt),
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
      pageSize: 50, //一頁顯示的筆數
      currentPage: 1, //目前在第幾頁
      today: moment(),
      idleTimeout: null,
      CameraModalOpen: false,
      idleTimeoutOpen: false,
      lastUpdated: '未儲存',
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
      rowData: {},
      immutable: [
        'fullSite',
        'cameraLocation',
        'fileName',
        'corrected_date_time',
      ],
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
            /*
            case 'setContinuous':
              this.settings.data[idx].is_continuous = true;
              break;
            case 'stopContinuous':
              this.settings.data[idx].is_continuous = false;
              break;
            // 複製一列
            //*/
            case 'clone':
              this.row_data.splice(idx, 0, window._.cloneDeep(row));
              this.row_data = this.setContinuous(this.row_data);
              this.settings.data = this.row_data;
              break;
          }

          this.sheet.render();
        },
        items: {
          /*
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
          //*/
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
          if (!changes || !this.editMode) return;
          const payload = changes.reduce((arr, change) => {
            let [row, prop, oldVal, newVal] = change;
            if (this.immutable.includes(prop)) return arr;
            row = row + this.currentDataRange.begin; //需計算真正資料的 row
            const value = this.siteData.data[row];
            if (oldVal !== newVal) {
              if (!value.index.column[prop] && value.index.column[prop] !== 0) {
                //資料尚未存在需要更新 index，排除 index 為 0 的情況
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
                  //special case: https://github.com/TaiBIF/camera-trap-webapp/issues/106
                  ...(prop === 'species'
                    ? {
                        [`tokens.${
                          value.index.token
                        }.species_shortcut`]: newVal,
                      }
                    : undefined),
                  token_error_flag: value.tokenErrorFlag,
                },
              });
            }

            return arr;
          }, []);
          this.lastUpdated = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss');
          this.updateAnnotation(payload);
        },
        afterSelectionEnd: r => {
          console.log(this.siteData.data[r].continuousPeriod);
          this.currentRow = this.pageSize * (this.currentPage - 1) + r;
          this.getRevision({
            _id: this.siteData.data[r]._id,
          });
        },
      },
      sheetContainer: null,
      sheet: null,
      isDrag: false,
      fetchCameraLockTimer: null,
      cameraLocationErrors: {},
    };
  },
  watch: {
    currentRow: 'recordUpdate',
    $route() {
      this.changeMode('editMode', false);
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

        let payload = {
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

        if (newValue.uploadSessionId) {
          payload.query.related_upload_sessions = newValue.uploadSessionId;
        }

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
        if (!this.editMode) {
          this.currentPage = 1; // 當資料更新則要切換到第一頁，不過編輯模式不能切換因為不會是被修改查詢條件觸發
        }
        this.getSheetData();
      },
      deep: true,
    },
    currentPage() {
      this.updateSheetData(); // 換頁更新 sheet 顯示的資料範圍
    },
    pageSize() {
      this.currentPage = 1; //切換顯示的筆數回到第一頁
      this.updateSheetData();
    },
  },
  components: {
    DatePicker,
    VueTimepicker,
    ZoomDrag,
    YoutubeEmbed,
    IdleTimeoutDialog,
    CameraModal,
  },
  computed: {
    ...annotationRevision.mapState(['revision']),
    ...project.mapGetters(['currentProject']),
    ...media.mapGetters(['species']),
    ...cameraLocation.mapGetters(['cameraLocked']),
    ...media.mapState(['siteData']),
    exportUrl() {
      return `${process.env.VUE_APP_API_URL}/project/${
        this.$route.params.id
      }/multimedia-annotations.csv?site=${encodeURIComponent(
        this.$route.params.site_id,
      )}&subSite=${encodeURIComponent(this.$route.params.subsite_id)}`;
    },
    //計算目前筆數範圍
    currentDataRange() {
      const { currentPage, pageSize, siteData } = this;
      return {
        begin: (currentPage - 1) * pageSize,
        end: Math.min(currentPage * pageSize, siteData.data.length),
      };
    },
    //計算最多總頁數
    totalPage() {
      return Math.ceil(this.siteData.data.length / this.pageSize);
    },
    // 判斷是否顯示影像區塊
    displayImageComponent() {
      const { siteData, currentRow, galleryShow } = this;
      return siteData.data[currentRow] && galleryShow;
    },
    // 檢查是否存在圖片連結
    hasImage() {
      const { siteData, currentRow } = this;
      return siteData.data[currentRow].hasImage;
    },
    hasVideo() {
      const { siteData, currentRow } = this;
      return (
        siteData.data[currentRow].youtubeUrl &&
        siteData.data[currentRow].youtubeUrl !== ''
      );
    },
    cameraList() {
      return this.currentProject
        ? this.currentProject.cameraLocations.filter(
            val =>
              val.subSite === this.$route.params.subsite_id &&
              val.site === this.$route.params.site_id,
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
              !this.cameraLocked[val.fullCameraLocationMd5] ||
              this.cameraLocked[val.fullCameraLocationMd5].locked === false ||
              this.cameraLocked[val.fullCameraLocationMd5].lockedBy.userId ===
                window.currentUser.userId,
          )
        : this.siteData.data.length >= 1 &&
            this.form.camera.every(
              val =>
                !this.cameraLocked[val] ||
                this.cameraLocked[val].locked === false ||
                this.cameraLocked[val].lockedBy.userId ===
                  window.currentUser.userId,
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
        data: this.siteData.data.slice(
          this.currentDataRange.begin,
          this.currentDataRange.end,
        ),
      };
    },
  },
  methods: {
    ...project.mapMutations(['setCurrentProject']),
    ...media.mapMutations(['addSiteDataLength']),
    ...media.mapActions(['getSiteData', 'updateAnnotation']),
    ...cameraLocation.mapActions(['getCameraLocked', 'setCameraLocked']),
    ...annotationRevision.mapActions(['getRevision', 'restoreRevision']),
    setSelectedCamera(camera) {
      //console.log(camera);
      this.form.camera = camera;
      this.CameraModalOpen = false;
    },
    // 切頁時更新 sheet 顯示資料
    updateSheetData() {
      this.hasColumnError = false;
      this.row_data = this.siteData.data.slice(
        this.currentDataRange.begin,
        this.currentDataRange.end,
      );
      if (this.isRender) {
        this.sheet.updateSettings(this.sheetSetting);
      }
    },
    async restoreRev(idx) {
      if (this.siteData.data[this.currentRow]) {
        //console.log(this.siteData.data[this.currentRow]);
        await this.restoreRevision({
          url_md5: this.revision[idx].url_md5,
          revision_tokens: this.revision[idx].tokens,
        });
        //console.log(this.revision[idx].tokens);
        this.revision[idx].tokens.forEach((t, tid) => {
          for (let dataKey in t.summary) {
            if (t.summary.hasOwnProperty(dataKey)) {
              // TODO: if current media has less tokens than tokens to be restored, insert new row(s)
              if (
                this.siteData.data[this.currentRow + tid]._id ==
                this.siteData.data[this.currentRow]._id
              ) {
                this.siteData.data[this.currentRow][dataKey] =
                  t.summary[dataKey];
              } else {
                // inser a row and re-render
              }
            }
          }
        });
      }
    },
    fetchCameraLocked() {
      this.getCameraLocked({
        projectId: this.$route.params.id,
        projectTitle: this.$route.params.projectTitle,
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
      this.settingSheetHeight();
    },
    continousRenderer(instance, TD, row, col, prop, value) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      const $row = this.row_data[row];
      let clsName = '';
      let error = '';

      if (prop === 'species' && !value === false && value !== '') {
        if (!$row === false) TD.dataset.tooltip = $row.sciName || $row.species;
        // 不在預設物種資料顯示錯誤
        if (
          this.species &&
          value &&
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
          clsName += `is-continuoust period-${$row.continuousPeriod}`;

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
      let continuousFlipper = true;
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
          ['測試', '空拍', '工作照'].indexOf($row.species) === -1
        ) {
          isContinue = true;
          $row.is_continuous = true;
          $row.continuousPeriod = continuousFlipper ? 'x' : 'y';
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

          continuousFlipper = !continuousFlipper;
        }
      });

      console.log(rowData);
      return rowData;
    },
    getSheetData() {
      // 產出 sheet 畫面
      this.hasColumnError = false;
      this.row_data = this.siteData.data;
      Handsontable.renderers.registerRenderer(
        'continousRenderer',
        this.continousRenderer,
      );

      if (this.isRender) {
        this.sheet.updateSettings(this.sheetSetting);
      } else {
        this.sheet = new Handsontable(this.sheetContainer, this.sheetSetting);
      }
      this.getCameraLocationErrors();
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
      }, 500);
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
    async getCameraLocationErrors() {
      this.cameraLocationErrors = {};
      const _this = this;
      console.log(this.siteData);
      this.siteData.data.forEach((token, idx) => {
        if (!_this.cameraLocationErrors[token.fullCameraLocationMd5]) {
          _this.cameraLocationErrors[token.fullCameraLocationMd5] = 0;
        }
        if (
          token.species_shortcut &&
          token.species_shortcut != '測試' &&
          (token.token_error_flag === true ||
            !_this.species.includes(token.species_shortcut))
        ) {
          _this.cameraLocationErrors[token.fullCameraLocationMd5]++;
          _this.siteData.data[idx].token_error_flag = true;
        }
      });
    },
  },
  mounted() {
    this.setCurrentProject(this.$route.params.id);
    this.fetchCameraLocked();

    // 從 query 判斷是否有 camera 資料做預設選取
    this.form.camera = this.$route.query.camera
      ? [this.$route.query.camera]
      : [];

    this.form.uploadSessionId = this.$route.query.upload_session_id
      ? this.$route.query.upload_session_id
      : '';

    const earliestDataDate = this.$route.query.earliestDataDate
      ? this.$route.query.earliestDataDate
      : `${formDefault.placeHolderStartAt} ${formDefault.start_time.HH}:${
          formDefault.start_time.mm
        }:00`;

    const latestDataDate = this.$route.query.latestDataDate
      ? this.$route.query.latestDataDate
      : `${formDefault.placeHolderEndAt} ${formDefault.end_time.HH}:${
          formDefault.end_time.mm
        }:00`;

    this.form.start_at = earliestDataDate.split(' ')[0];
    this.form.start_time = {
      HH: '00',
      mm: '00',
    };

    this.form.end_at = latestDataDate.split(' ')[0];
    this.form.end_time = {
      HH: '23',
      mm: '59',
    };
    ('');
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
      if (e.which === 1) this.dragEnd(e);
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
