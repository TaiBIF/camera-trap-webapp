<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :project_id="1" />
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
                  @start="drag=true"
                  @end="drag=false"
                >
                  <transition-group>
                    <div
                      class="row column-item"
                      v-for="(td, idx) in column"
                      :key="`tr-${idx}`"
                      :class="{ 'disabled': td.default }"
                    >
                      <div class="col-3">{{ td.name }}</div>
                      <div class="col-3">{{ td.type }}</div>
                      <div class="text-gray col-3">
                        <div
                          v-if="td.name === '物種'"
                          class="link text-green underline"
                          @click="speciesOpen=true"
                        >
                          <i class="fa fa-pencil-alt"></i> {{ td.description }}
                        </div>
                        <span v-else>{{ td.description }}</span>
                      </div>
                      <div
                        class="text-right col-3"
                        v-if="!td.default"
                      >
                        <a
                          @click="removeItem(idx)"
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
              <div class="column-footer">
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
                    v-for="(td, idx) in column"
                    :key="`item-${idx}`"
                  >
                    <span v-if="!td.default">{{td.name}}</span>
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
              <a class="btn btn-default">
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
                    name="camera_time"
                    id="camera-time-1"
                    value="0"
                  >
                  <label for="camera-time-1">無設定</label>
                </div>
                <div class="radio radio-inline">
                  <input
                    type="radio"
                    name="camera_time"
                    id="camera-time-2"
                    value="1"
                  >
                  <label for="camera-time-2">
                    已設定，時間為每日
                    <div class="select d-inline-block">
                      <select
                        name=""
                        id=""
                        class="form-control"
                      >
                        <option value="">12:00</option>
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
            @click.stop.prevent="nextStep()"
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
      @close='newColumnOpen=false'
      @submit="submitColumn"
    />
    <invitation-dialog
      :open="invitationOpen"
      @close="invitationOpen=false"
    />
    <delete-column-dialog
      :open="deleteColumnOpen"
      :column="delColumn.data"
      @close="deleteColumnOpen=false"
      @submit="confirmDeleteColumn"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { commonMixin } from '../../../mixins/common';
import CloseWindowDialog from '../components/CloseWindowDialog';
import NewColumnModal from '../components/NewColumn';
import DeleteColumnDialog from '../components/DeleteColumnDialog';
import EditNav from '../components/EditNav';

const column = [
  {
    name: '樣區',
    type: '下拉選單',
    description: '樣區-子樣區',
    default: true,
  },
  {
    name: '相機位置',
    type: '下拉選單',
    description: '相機位置名稱',
    default: true,
  },
  {
    name: '檔名',
    type: '輸入框',
    description: '01234.jpg',
    default: true,
  },
  {
    name: '時間',
    type: '日期時間',
    description: 'YY/MM/DD hh:mm',
    default: true,
  },
  {
    name: '物種',
    type: '下拉選單',
    description: '編輯常見物種排序',
    default: true,
  },
  {
    name: '性別',
    type: '下拉選單',
    description: '公、母',
    default: false,
  },
  {
    name: '年齡',
    type: '下拉選單',
    description: '成體、亞成體、幼體',
    default: false,
  },
  {
    name: '備註',
    type: '下拉選單',
    description: '輸入框',
    default: false,
  },
];

export default {
  name: 'EditColumn',
  mixins: [commonMixin],
  components: {
    NewColumnModal,
    draggable,
    EditNav,
    DeleteColumnDialog,
    CloseWindowDialog,
  },
  data() {
    return {
      column,
      newColumnOpen: false,
      closeWindowOpen: false,
      deleteItem: {
        index: 0,
        data: null,
      },
      deleteColumnOpen: false,
    };
  },
  methods: {
    confirmDeleteColumn() {
      this.column.splice(this.deleteItem.index, 1);
      this.deleteColumnOpen = false;
    },
    removeItem(i) {
      this.deleteItem = {
        index: i,
        data: this.column[i],
      };
      this.deleteColumnOpen = true;
    },
    doSubmit() {
      this.$router.push('/');
    },
    submitColumn(form) {
      this.column.push({
        default: false,
        ...form,
      });
      this.newColumnOpen = false;
    },
  },
};
</script>
