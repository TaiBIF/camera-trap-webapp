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
        </div>
        <router-link to="/"><small class="text-gray">
            <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
          </small></router-link>
        <h3 class="text-green mb-2 mt-2">資料篩選結果</h3>
      </div>

      <div class="search-content">
        <div class="row search-filters">
          <div class="col-4">
            <div class="item">
              <label>資料來源：</label>
              <div class="content">
                <span
                  v-for="(data, index) in form.data"
                  :key="index"
                >
                  {{ data.project && data.project.label }}：<br />
                  {{ data.site && data.site.label }}{{ data.subSite && `-${data.subSite.label}` }}{{ data.camera && `-${data.camera.label}` }}
                </span>
              </div>
            </div>
            <div class="item">
              <label>物種：</label>
              <div class="content">
                {{ (form.species.map(spec => spec.label)).join('、') }}
              </div>
            </div>
            <div class="item">
              <label>資料時間：</label>
              <div class="content">
                {{ form.startAt | moment('YYYY/MM/DD') }} ~ {{ form.endAt | moment('YYYY/MM/DD') }}
              </div>
            </div>
          </div>
          <div class="col-4">
            <div
              v-for="dataField in dataFields"
              :key="dataField.key"
              class="item short-label"
            >
              <label>{{ dataField.label }}：</label>
              <div
                v-if="dataField.type==='select'"
                class="content"
              >
                {{ form.customFields[dataField.key] && form.customFields[dataField.key].value }}
                <!-- 公 -->
              </div>
              <div
                v-if="dataField.type==='text'"
                class="content"
              >
                {{ form.customFields[dataField.key] }}
              </div>
            </div>
          </div>
          <div class="col-4">
            <div
              class="item long-label"
              style="display: none;"
            >
              <label>海拔：</label>
              <div class="content">
                {{form.elevation}}
                <!-- 1,001~1,500 公尺 -->
              </div>
            </div>
            <div
              class="item long-label"
              style="display: none;"
            >
              <label>植披：</label>
              <div class="content">
                {{form.vegetation}}
                <!-- 闊葉林 -->
              </div>
            </div>
            <div
              class="item long-label"
              style="display: none;"
            >
              <label>土地覆蓋類型：</label>
              <div class="content">
                {{form.land_cover}}
                <!-- 森林使用土地 -->
              </div>
            </div>
            <div class="item long-label">
              <label>拍攝時段：</label>
              <div class="content">
                {{ form.cameraStart.HH }}:{{ form.cameraStart.mm }}
                ~
                {{ form.cameraEnd.HH }}:{{ form.cameraEnd.mm }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sheet-container">
      <div class="sheet">
        <div class="sheet-header">
          <div class="row">
            <div class="col-8">
              <small class="text-gray">共 {{siteData.data.length}} 筆資料</small>
              <div class="divider"></div>
              <div class="dropdown d-none">
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
              <option value=10>10</option>
              <option value=20>20</option>
              <option value=30>30</option>
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
            v-if="!hasImageOrVideo"
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
                :to="`/project/${siteData.data[currentRow].projectId}/site/${siteData.data[currentRow].site}/${siteData.data[currentRow].subSite}/photo/tag?image_id=${siteData.data[currentRow]._id}`"
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
                  </td>
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
import leftPad from 'left-pad';
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';
import Handsontable from 'handsontable';
import 'handsontable/languages/all';
import ZoomDrag from '../../index/components/ZoomDrag';
import store from '../../../stores';

const dataFieldAvailable = createNamespacedHelpers('dataFieldAvailable');
const project = createNamespacedHelpers('project');
const media = createNamespacedHelpers('media');
const annotationRevision = createNamespacedHelpers('annotationRevision');

export default {
  name: 'SearchResult',
  data() {
    return {
      form: {
        data: [
          {
            project: '',
            site: '',
            subSite: '',
            camera: '',
          },
        ],
        species: [],
        customFields: {},
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
        cameraStart: {
          HH: '10',
          mm: '05',
        },
        cameraEnd: {
          HH: '10',
          mm: '05',
        },
      },
      species: ['測試', '空拍', '山羌', '鼬獾', '台灣獼猴', '水鹿', '白鼻心'],
      pageSize: 10, //一頁顯示的筆數
      currentPage: 1, //目前在第幾頁
      today: moment(),
      idleTimeout: null,
      CameraModalOpen: false,
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
            let [row, prop, oldVal, newVal] = change;
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
                },
              });
            }

            return arr;
          }, []);

          this.updateAnnotation(payload);
        },
        afterSelectionEnd: r => {
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
    };
  },
  watch: {
    currentRow: 'recordUpdate',
    siteData: {
      handler: function() {
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
    ZoomDrag,
  },
  computed: {
    ...annotationRevision.mapState(['revision']),
    ...project.mapGetters(['Projects']),
    ...dataFieldAvailable.mapGetters(['dataFieldAvailable']),
    ...media.mapState(['siteData']),
    dataFields: function() {
      /*
      All data fields of projects.
      @returns {Array<{label: 'string', type: 'string', options: {Array<{label: 'string', value: 'string'}>|null}}>}
       */
      const dataFieldKeys = new Set();
      this.Projects.forEach(project => {
        (project.dataFieldEnabled || []).forEach(key => {
          dataFieldKeys.add(key);
        });
      });
      return Array.from(dataFieldKeys).map(key => {
        const dataField = this.findDataField(key);
        return {
          key: key,
          label: dataField.label,
          type: dataField.widget_type,
          options: (dataField.widget_select_options || []).map(option => {
            return {
              label: option,
              value: option,
            };
          }),
        };
      });
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
      return (
        siteData.data[currentRow] &&
        galleryShow &&
        (!siteData.data[currentRow].imageUrl == false ||
          !siteData.data[currentRow].youtubeUrl == false)
      );
    },
    // 檢查是否存在圖片連結
    hasImageOrVideo() {
      const { siteData, currentRow } = this;
      return (
        (siteData.data[currentRow].imageUrl &&
          siteData.data[currentRow].imageUrl !== '') ||
        (siteData.data[currentRow].youtubeUrl &&
          siteData.data[currentRow].youtubeUrl !== '')
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
        editor: false,
      }));
      this.dataFields.forEach(dataField => {
        columns.push({
          data: dataField.key,
          label: dataField.label,
          editor: false,
          editorMode: false,
        });
      });

      return {
        ...this.settings,
        ...this.siteData,
        ...{ columns },
        colHeaders: columns.map(column => column.label),
        data: this.siteData.data.slice(
          this.currentDataRange.begin,
          this.currentDataRange.end,
        ),
      };
    },
  },
  methods: {
    ...annotationRevision.mapActions(['getRevision']),
    getProject(projectId) {
      /*
      Get the project from this.Projects.
      @param projectId {string}
      @returns {Project|null}
       */
      for (let index = 0; index < this.Projects.length; index += 1) {
        const project = this.Projects[index];
        if (project._id === projectId) {
          return project;
        }
      }
      return null;
    },
    findDataField(key) {
      /*
      Find the data field from dataFieldAvailable.
      @param key {string}
      @returns {DataFieldAvailable|null}
       */
      for (let index = 0; index < this.dataFieldAvailable.length; index += 1) {
        if (this.dataFieldAvailable[index].key === key) {
          return this.dataFieldAvailable[index];
        }
      }
      return null;
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

      if (this.isRender) {
        this.sheet.updateSettings(this.sheetSetting);
      } else {
        this.sheet = new Handsontable(this.sheetContainer, this.sheetSetting);
      }

      this.isRender = true;
    },
    // 切頁時更新 sheet 顯示資料
    updateSheetData() {
      this.row_data = this.siteData.data.slice(
        this.currentDataRange.begin,
        this.currentDataRange.end,
      );
      if (this.isRender) {
        this.sheet.updateSettings(this.sheetSetting);
      }
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
      this.settings.height = sheetHeight - 80;
      this.$el
        .querySelector('.sheet-container')
        .querySelector('.sidebar').style.height =
        sheetHeight + 'px';
      // debugger
      if (this.isRender) this.sheet.updateSettings(this.sheetSetting);
    },
  },
  beforeRouteEnter(to, from, next) {
    const form = JSON.parse(to.query.form);
    const payload = {
      query: {
        $and: [
          {
            $or: form.data.map(data => {
              const result = {
                projectId: data.projectId,
              };
              data.site && (result.site = data.site);
              data.subSite && (result.subSite = data.subSite);
              data.camera && (result.cameraLocation = data.camera);
              return result;
            }),
          },
        ],
      },
    };
    if (form.species && form.species.length) {
      payload.query.$and.push({
        'tokens.species_shortcut': {
          $in: form.species,
        },
      });
    }
    let dateTimeCondition = {
      date_time_corrected_timestamp: {},
    };
    let hasDateTimeCondition = false;
    if (form.startAt) {
      hasDateTimeCondition = true;
      dateTimeCondition.date_time_corrected_timestamp.$gte =
        new Date(form.startAt) / 1000;
    }
    if (form.endAt) {
      hasDateTimeCondition = true;
      dateTimeCondition.date_time_corrected_timestamp.$lte =
        new Date(form.endAt) / 1000;
    }
    if (hasDateTimeCondition) payload.query.$and.push(dateTimeCondition);

    if (Object.keys(form.customFields).length) {
      payload.query.$and.push({
        $or: (() => {
          const result = [];
          for (let fieldKey in form.customFields || {}) {
            result.push({
              'tokens.data.key': fieldKey,
              'tokens.data.value': form.customFields[fieldKey],
            });
          }
          return result;
        })(),
      });
      if (form.cameraStart && form.cameraEnd) {
        if (+form.cameraEnd >= +form.cameraStart) {
          payload.query.$and.push({
            hour: {
              $gte: +form.cameraStart.HH,
              $lte: +form.cameraEnd.HH,
            },
          });
        } else {
          payload.query.$and.push({
            $or: [
              {
                hour: {
                  $gte: +form.cameraStart.HH,
                  $lte: 24,
                },
              },
              {
                hour: {
                  $gte: 0,
                  $lte: +form.cameraEnd.HH,
                },
              },
            ],
          });
        }
      }
    }
    Promise.all([
      store.dispatch('project/loadProject'),
      store.dispatch('dataFieldAvailable/loadDataFieldAvailable'),
      store.dispatch('media/getSiteData', payload),
    ])
      .then(() => {
        next();
      })
      .catch(error => {
        next(error);
      });
  },
  mounted() {
    this.sheetContainer = this.$el.querySelector('#spreadsheet');
    this.settingSheetHeight();
    this.getSheetData();

    const parseQuery = form => {
      return {
        data: form.data.map(data => {
          const project = this.getProject(data.projectId);
          return {
            project: project
              ? {
                  label: project.projectTitle,
                  value: project._id,
                }
              : '',
            site: data.site
              ? {
                  label: data.site,
                  value: data.site,
                }
              : '',
            subSite: data.subSite
              ? {
                  label: data.subSite,
                  value: data.subSite,
                }
              : '',
            camera: data.camera
              ? {
                  label: data.camera,
                  value: data.camera,
                }
              : '',
          };
        }),
        species: form.species.map(spec => {
          return {
            label: spec,
            value: spec,
          };
        }),
        startAt: form.startAt ? new Date(form.startAt) : '',
        endAt: form.endAt ? new Date(form.endAt) : '',
        startTime: (() => {
          if (!form.startAt) {
            return {
              HH: '10',
              mm: '05',
            };
          }
          const time = new Date(form.startAt);
          return {
            HH: leftPad(time.getHours(), 2, '0'),
            mm: leftPad(time.getMinutes(), 2, '0'),
          };
        })(),
        endTime: (() => {
          if (!form.endAt) {
            return {
              HH: '10',
              mm: '05',
            };
          }
          const time = new Date(form.endAt);
          return {
            HH: leftPad(time.getHours(), 2, '0'),
            mm: leftPad(time.getMinutes(), 2, '0'),
          };
        })(),
        customFields: (() => {
          const result = {};
          for (const customFieldKey in form.customFields) {
            const dataField = this.findDataField(customFieldKey);
            if (dataField.widget_type === 'select') {
              result[customFieldKey] = {
                label: form.customFields[customFieldKey],
                value: form.customFields[customFieldKey],
              };
            } else {
              result[customFieldKey] = form.customFields[customFieldKey];
            }
          }
          return result;
        })(),
        cameraStart: form.cameraStart
          ? form.cameraStart
          : {
              HH: '10',
              mm: '05',
            },
        cameraEnd: form.cameraEnd
          ? form.cameraEnd
          : {
              HH: '10',
              mm: '05',
            },
      };
    };
    this.form = parseQuery(JSON.parse(this.$router.history.current.query.form));
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
