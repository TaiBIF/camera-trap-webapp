<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :projectId="currentProjectId" />
      </div>
      <div class="col-10 pt-3">
        <!-- 編輯設定  -->
        <div class="panel mb-3">
          <div class="panel-heading">
            <h4>欄位設定</h4>
          </div>
          <div class="panel-body">
            <div class="column-editor">
              <div class="row column-header mx-0">
                <div class="col-3">欄位名稱</div>
                <div class="col-3">欄位形式</div>
                <div class="col-3">輸入格式</div>
                <div class="col-3"></div>
              </div>
              <div class="column-body">
                <draggable
                  :options="{ handle: '.drag-item' }"
                  v-model="defaultColumns"
                >
                  <transition-group>
                    <div
                      class="row column-item disabled"
                      v-for="(td) in defaultColumns"
                      :key="`tr-${td.key}`"
                    >
                      <div class="col-3">{{ td.label }}</div>
                      <div class="col-3">{{ td.type }}</div>
                      <div class="text-gray col-3">
                        <div
                          v-if="td.label === '物種'"
                          class="link text-green underline"
                          @click="speciesOpen=true"
                        >
                          <i class="fa fa-pencil-alt"></i> {{ td.description }}
                        </div>
                        <span v-else>{{ td.description }}</span>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
                <draggable
                  :options="{ handle: '.drag-item' }"
                  v-model="columns"
                >
                  <transition-group>
                    <div
                      class="row column-item"
                      v-for="(td, idx) in columns"
                      :key="`tr-${td.key}`"
                    >
                      <div class="col-3">{{ td.label }}</div>
                      <div class="col-3">{{ td.type }}</div>
                      <div class="text-gray col-3">
                        <div
                          v-if="td.label === '物種'"
                          class="link text-green underline"
                          @click="speciesOpen=true"
                        >
                          <i class="fa fa-pencil-alt"></i> {{ td.description }}
                        </div>
                        <span v-else>{{ td.description }}</span>
                      </div>
                      <div class="text-right col-3">
                        <a
                          @click="deleteItem(idx)"
                          class="d-inline-block align-middle ml-2"
                        >
                          <i class="icon-remove-sm"></i>
                        </a>
                        <a class="d-inline-block align-middle ml-2 drag-item">
                          <i class="icon-splitter"></i>
                        </a>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
              <div
                class="column-footer"
                v-if="showAddColumnsBtn"
              >
                <a
                  id="new-column"
                  class="btn btn-text text-left dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="fa fa-plus"></i> 新增欄位
                </a>
                <div
                  id="new-column-container"
                  aria-labelledby="new-column"
                  class="dropdown-menu dropdown-menu-right"
                >
                  <div
                    class="dropdown-item"
                    v-for="(td, idx) in unUseColumnsField"
                    :key="`item-${idx}`"
                    @click="addColumns(idx)"
                  >
                    <span>{{td.label}}</span>
                  </div>
                  <hr>
                  <div
                    class="dropdown-item"
                    @click="newColumnOpen=true"
                  >
                    申請新增欄位
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel mb-3">
          <div class="panel-heading">
            <h4>範本下載</h4>
          </div>
          <div class="panel-body">
            <p>
              為了統一計畫內的欄位規則，您可以提供範本給計畫成員，範本會根據「欄位設定」之項目自動產生相應的範本。
            </p>
            <p>
              您可以透過下載來預覽範本：
              <a
                class="btn btn-default"
                target="blank"
                :href="downloadCsvSrc"
              >
                <i class="fa fa-download"></i>
                下載範本
              </a>
            </p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <h4>相機異常檢測</h4>
          </div>
          <div class="panel-body">
            <p>
              設定「每日測試照片拍攝時間」可幫助您檢查相機是否出現異常狀況。
              若上傳的檔案無每日固定時間拍攝的影像，
              則會通知您此相機出現異常狀況，
              並且本設定對您未來計算相機的工作天數有所幫助。
            </p>
            <div class="row">
              <label class="col-3">每日測試照片拍攝時間：</label>
              <div class="col-9">
                <div class="radio radio-inline">
                  <input
                    type="radio"
                    id="camera-time-1"
                    v-model="dailyTestTime.status"
                    value="0"
                  >
                  <label for="camera-time-1">無設定</label>
                </div>
                <div class="radio radio-inline">
                  <input
                    type="radio"
                    id="camera-time-2"
                    v-model="dailyTestTime.status"
                    value="1"
                  >
                  <label for="camera-time-2">
                    已設定，時間為每日
                    <div class="select d-inline-block">
                      <select
                        class="form-control"
                        v-model="dailyTestTime.time"
                      >
                        <option
                          v-for="option in timeOptions"
                          :key="option.value"
                          :value="option.value"
                        >{{option.label}}</option>
                      </select>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="action">
          <router-link
            to="/project/1"
            class="btn btn-default"
          >
            返回
          </router-link>
          <button
            type="submit"
            @click.stop.prevent="doSubmit()"
            class="btn btn-orange"
          >
            儲存設定
          </button>
        </div>
      </div>
    </div>
    <close-window-dialog
      :open="closeWindowOpen"
      @close="closeWindowOpen=false"
    />
    <new-column-modal
      :open="newColumnOpen"
      :options="columnTypeOptions"
      @close='newColumnOpen=false'
      @submit="createNewColumn"
    />
    <delete-column-dialog
      :open="deleteColumnIndex!==null"
      :column="columns[deleteColumnIndex] && columns[deleteColumnIndex].label"
      @close="deleteColumnIndex=null"
      @submit="confirmDeleteColumn"
    />
    <dialog-u-i
      :open="showApplyNewColumnSuccessModal"
      title="新增欄位申請"
      content="新增欄位申請已送出，待所有計畫都知道將有此欄位新增且對於欄位意義一致，系統管理員將會通知您新增欄位已生效。"
      hideCancelBtn
      @submit="showApplyNewColumnSuccessModal=false"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import draggable from 'vuedraggable';
import { commonMixin } from '../../../mixins/common';
import CloseWindowDialog from '../components/CloseWindowDialog';
import NewColumnModal from '../components/NewColumn';
import DeleteColumnDialog from '../components/DeleteColumnDialog';
import DialogUI from '../components/DialogUI';
import EditNav from '../components/EditNav';
import { isAllowAddColumns } from '../../../util/roles.js';

const project = createNamespacedHelpers('project');
const auth = createNamespacedHelpers('auth');

export default {
  name: 'EditColumn',
  mixins: [commonMixin],
  components: {
    NewColumnModal,
    draggable,
    EditNav,
    DeleteColumnDialog,
    CloseWindowDialog,
    DialogUI,
  },
  data() {
    return {
      columnTypeMapping: {
        text: '輸入欄',
        select: '下拉選單',
        datePicker: '日期選擇',
      },
      timeOptions: [
        { label: '00:00', value: '00:00:00' },
        { label: '01:00', value: '01:00:00' },
        { label: '02:00', value: '02:00:00' },
        { label: '03:00', value: '03:00:00' },
        { label: '04:00', value: '04:00:00' },
        { label: '05:00', value: '05:00:00' },
        { label: '06:00', value: '06:00:00' },
        { label: '07:00', value: '07:00:00' },
        { label: '08:00', value: '08:00:00' },
        { label: '09:00', value: '09:00:00' },
        { label: '10:00', value: '10:00:00' },
        { label: '11:00', value: '11:00:00' },
        { label: '12:00', value: '12:00:00' },
        { label: '13:00', value: '13:00:00' },
        { label: '14:00', value: '14:00:00' },
        { label: '15:00', value: '15:00:00' },
        { label: '16:00', value: '16:00:00' },
        { label: '17:00', value: '17:00:00' },
        { label: '18:00', value: '18:00:00' },
        { label: '19:00', value: '19:00:00' },
        { label: '20:00', value: '20:00:00' },
        { label: '21:00', value: '21:00:00' },
        { label: '22:00', value: '22:00:00' },
        { label: '23:00', value: '23:00:00' },
      ],
      defaultColumns: [
        {
          key: 'site',
          label: '樣區',
          type: '下拉選單',
          description: '樣區-子樣區',
          default: true,
        },
        {
          key: 'location',
          label: '相機位置',
          type: '下拉選單',
          description: '相機位置名稱',
          default: true,
        },
        {
          key: 'file',
          label: '檔名',
          type: '輸入框',
          description: '01234.jpg',
          default: true,
        },
        {
          key: 'time',
          label: '時間',
          type: '日期時間',
          description: 'YYYY-MM-DD hh:mm',
          default: true,
        },
        {
          key: 'species',
          label: '物種',
          type: '下拉選單',
          description: '編輯常見物種排序',
          default: true,
        },
      ],
      columns: [],
      deleteColumnIndex: null,
      newColumnOpen: false,
      dailyTestTime: {
        status: 0,
      },
      showApplyNewColumnSuccessModal: false,
      closeWindowOpen: false,
    };
  },
  watch: {
    projectDataFieldEnabled: function() {
      this.initAdditionalColumns();
    },
    allColumnsField: function() {
      this.initAdditionalColumns();
    },
    projectDailyTestTime: function(newVal) {
      if (newVal[0]) {
        this.dailyTestTime = {
          ...newVal[0],
          status: 1,
        };
      }
    },
  },
  computed: {
    ...auth.mapGetters(['projectRoles']),
    ...project.mapGetters([
      'projectDailyTestTime',
      'allColumnsField',
      'projectDataFieldEnabled',
    ]),
    currentProjectId() {
      return this.$route.params.id;
    },
    showAddColumnsBtn() {
      const projectRoles = this.projectRoles.find(
        projectRole => projectRole.projectId === this.currentProjectId,
      );
      if (!projectRoles) {
        return false;
      }
      return isAllowAddColumns(projectRoles.roles);
    },
    unUseColumnsField() {
      const currentFieldEnabled = this.columns.map(obj => obj.key);
      return this.allColumnsField.filter(
        field => !currentFieldEnabled.includes(field.key),
      );
    },
    columnTypeOptions() {
      return Object.values(this.columnTypeMapping);
    },
    downloadCsvSrc() {
      return `${process.env.VUE_APP_API_URL}/project/${
        this.currentProjectId
      }/example-multimedia-annotations.csv`;
    },
  },
  methods: {
    ...project.mapActions([
      'loadSingleProject',
      'loadColumnsField',
      'updateCameraLocations',
    ]),
    initAdditionalColumns() {
      if (this.columns.length === 0) {
        // columns must use data not computed for 2-way binding in draggable
        this.columns = this.projectDataFieldEnabled
          .map(key => this.allColumnsField.find(obj => obj.key === key) || {})
          .filter(obj => obj.key)
          .map(obj => ({
            ...obj,
            type: this.columnTypeMapping[obj.widget_type],
          }));
      }
    },
    deleteItem(i) {
      this.deleteColumnIndex = i;
    },
    confirmDeleteColumn() {
      this.columns.splice(this.deleteColumnIndex, 1);
      this.deleteColumnIndex = null;
    },
    addColumns(idx) {
      this.columns.push({
        ...this.unUseColumnsField[idx],
        type: this.columnTypeMapping[this.unUseColumnsField[idx].widget_type],
      });
    },
    createNewColumn(form) {
      const {
        label,
        widget_date_format,
        type,
        description,
        widget_select_options,
      } = form;
      const widget_type = Object.keys(this.columnTypeMapping).find(
        key => this.columnTypeMapping[key] === type,
      );
      const obj = {
        projectId: this.currentProjectId,
        label,
        description,
        widget_date_format,
        widget_type,
        fieldStatus: 'pending',
        widget_select_options: widget_select_options
          ? widget_select_options.map(label => ({
              key: '',
              label,
            }))
          : null,
      };
      // TODO: submit API
      console.log('xxx createNewColumn', obj);
      this.newColumnOpen = false;
      this.showApplyNewColumnSuccessModal = true;
    },
    doSubmit() {
      // save columns
      const dataFieldEnabled = this.columns
        .filter(field => !field.default)
        .map(field => field.key);

      // save dailyTimer
      const dailyTestTime = [];
      if (this.dailyTestTime.status && this.dailyTestTime.status !== '0') {
        dailyTestTime.push({
          since: this.dailyTestTime.since || Date.now() / 1000,
          time: this.dailyTestTime.time,
        });
      }

      this.updateCameraLocations([
        {
          _id: this.currentProjectId,
          projectId: this.currentProjectId,
          $set: { dataFieldEnabled },
        },
        {
          _id: this.currentProjectId,
          projectId: this.currentProjectId,
          $set: { dailyTestTime },
        },
      ]);
    },
  },
  mounted() {
    this.loadSingleProject(this.currentProjectId);
    this.loadColumnsField();
  },
};
</script>
