<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :projectId="currentProjectId" />
      </div>
      <div class="col-10 pt-3">
        <!-- 相機位置管理 -->
        <div class="panel">
          <div class="panel-heading">
            <h4>相機位置管理</h4>
          </div>
          <div class="panel-body camera-editor">
            <div class="sidebar">
              <ul>
                <li
                  v-for="(site, s_id) in filterSites"
                  :key="`site-tree-${s_id}`"
                  :class="{'open': CurrentSite === s_id, 'active': CurrentSite === s_id && CurrentPoint === null, 'edit': s_id === currentEditSite}"
                >
                  <div
                    class="site-item"
                    @click="setCurrentSite(s_id)"
                    @dblclick="enableEditSite(s_id)"
                  >
                    <div class="icon">
                      <i
                        class="fa"
                        :class="CurrentSite !== s_id ? 'fa-caret-right' : 'fa-caret-down'"
                      ></i>
                    </div>
                    <div
                      class="text"
                      v-if="s_id==currentEditSite"
                    >
                      <input
                        type="text"
                        v-model="site.value"
                        @blur="editSite($event)"
                        @keydown="editSite($event)"
                      >
                    </div>
                    <div
                      class="text"
                      v-else
                    >{{site.value}}</div>
                  </div>
                  <site-menu
                    :items="site.child"
                    :index="s_id"
                    :defaultOpenLevel="1"
                    @update="updatePoint"
                  />
                </li>
                <li class="add">
                  <div
                    class="icon"
                    @click="addSite($event)"
                  ><i class="icon-add"></i></div>
                  <div class="text">
                    <input
                      type="text"
                      v-model='newSite'
                      @keydown="addSite($event)"
                      placeholder='新增樣區'
                    >
                  </div>
                </li>
              </ul>
            </div>
            <div class="maintain p-0">
              <div
                class="empty-result"
                v-if="!sites.length"
              >
                <img
                  src="/assets/common/empty-site.png"
                  width="174"
                  srcset="/assets/common/empty-site@2x.png"
                >
                <h5 class="text-gray">您還沒新增任何樣區</h5>
              </div>
              <div
                v-else
                class="sheet-view"
              >
                <div class="control p-2">
                  <div class="row">
                    <div class="col-12 text-right">
                      <div class="form-group-inline">
                        <label for="">座標大地基準：</label>
                        <v-select
                          :options="['WGS84', 'TWD97']"
                          class="d-inline-block"
                        />
                        <span class="icon-note">
                          <i class="icon-info"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="sheet-container">
                  <div id="sheet"></div>
                  <a
                    class="text-green btn btn-link"
                    @click="addData()"
                  >
                    <span class="icon"><i class="icon-add-green"></i></span>
                    <span class="text">新增相機位置</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action">
          <router-link
            to="/project/1"
            class="btn btn-default"
          >返回</router-link>
          <button
            type="submit"
            @click.stop.prevent="doSubmit()"
            class="btn btn-orange"
          >儲存設定</button>
        </div>
      </div>
    </div>
    <close-window-dialog
      :open="closeWindowOpen"
      @close="closeWindowOpen=false"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, createNamespacedHelpers } from 'vuex';
import { commonMixin } from '../../../mixins/common';
import CloseWindowDialog from '../components/CloseWindowDialog';
import SiteMenu from '../components/SiteMenu';
import EditNav from '../components/EditNav';
import Handsontable from 'handsontable';
import 'handsontable/languages/zh-TW';

const project = createNamespacedHelpers('project');

export default {
  name: 'EditCamera',
  mixins: [commonMixin],
  components: {
    CloseWindowDialog,
    SiteMenu,
    EditNav,
  },
  data() {
    return {
      newSite: '',
      currentSite: 0,
      oldName: '',
      currentEditSite: null,
      sheetContainer: null,
      settings: {
        data: [],
        columns: [
          {
            data: 'cameraLocation',
            type: 'text',
          },
          // TODO: apply update time after API adjust
          // {
          //   data: 'updated_at',
          //   type: 'date',
          // },
          {
            data: 'original_x',
            type: 'text',
          },
          {
            data: 'original_y',
            type: 'text',
          },
          {
            data: 'elevation',
            type: 'text',
          },
          {
            data: 'vegetation',
            type: 'text',
          },
          {
            data: 'land_cover',
            type: 'text',
          },
        ],
        stretchH: 'all',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        language: 'zh-TW',
        colHeaders: [
          // 'URL',
          '*相機位置名稱',
          // '架設日期',
          '*經度 (X)',
          '*緯度 (Y)',
          '海拔 (公尺)',
          '植被',
          '土地覆蓋類型',
        ],
        contextMenu: {
          callback: (key, selection) => {
            if (key === 'clone') {
              const idx = selection[0].start.row;
              let data =
                this.CurrentPoint === null
                  ? this.sites[this.CurrentSite].data
                  : this.sites[this.CurrentSite].children[this.CurrentPoint]
                      .data;
              const row = data[idx];
              data = data.splice(idx, 0, window._.cloneDeep(row));
              // this.sheet.loadData(data)
              // this.sheet.updateSettings(this.settings)
            }

            this.sheet.render();
          },
          items: {
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
                return '<span class="icon"></i></span><span class="text">復原</span>';
              },
            },
            redo: {
              name: () => {
                return '<span class="icon"></i></span><span class="text">重做</span>';
              },
            },
            divider2: { name: '---------' },
            clone: {
              name: () => {
                return '<span class="icon"></span><span class="text">複製並貼上一列</span>';
              },
            },
            remove_row: {
              name: () => {
                return '<span class="icon"></span><span class="text">刪除相機位置</span>';
              },
              disabled() {
                const selected = this.getSelected()[0][0];
                const row = this.getDataAtRow(selected);
                let empty = true;

                row.forEach(col => {
                  if (col !== null && col !== '') empty = false;
                });
                return !empty;
              },
            },
          },
        },
        dropdownMenu: true,
        manualRowMove: true,
        manualColumnMove: true,
      },
    };
  },
  watch: {
    CurrentSite() {
      const currentSite = this.filterSites[this.CurrentSite];
      if (currentSite && currentSite.child && currentSite.child.length > 0) {
        this.setCurrentPoint(0);
      } else {
        this.setCurrentPoint(null);
      }
    },
    cameraData() {
      this.renderSheet();
    },
  },
  computed: {
    ...mapGetters(['CurrentSite', 'CurrentPoint']),
    ...project.mapGetters(['currentProject', 'sites']),
    currentProjectId() {
      return this.$route.params.id;
    },
    filterSites: function() {
      return this.sites.filter(site => site.label !== '全部樣區');
    },
    cameraData: function() {
      if (this.CurrentSite === null) {
        return [];
      }
      const currentSite = this.filterSites[this.CurrentSite];
      if (currentSite && currentSite.child && currentSite.child.length > 0) {
        const currentSubsiteLabel = currentSite.child[this.CurrentPoint].label;

        return this.currentProject.cameraLocations.filter(
          camera => camera.subSite === currentSubsiteLabel,
        );
      }
      return this.currentProject.cameraLocations.filter(
        camera => camera.site === currentSite.label,
      );
    },
  },
  methods: {
    ...mapActions(['setCurrentSite', 'setCurrentPoint']),
    ...project.mapActions(['loadSingleProject']),
    renderSheet() {
      this.settings.data = this.cameraData;
      if (!this.sheetContainer) {
        this.sheetContainer = this.$el.querySelector('#sheet');
        this.sheet = new Handsontable(this.sheetContainer, this.settings);
      } else {
        this.sheet.updateSettings(this.settings);
      }
    },
    addData() {
      if (this.CurrentPoint === null) {
        this.sites[this.CurrentSite].data.push({
          name: '',
          updated_at: '',
          lat: '',
          lng: '',
          altitude: '',
          vegetation: '',
        });

        this.settings.data = this.sites[this.CurrentSite].data;
      } else {
        this.sites[this.CurrentSite].children[this.CurrentPoint].data.push({
          name: '',
          updated_at: '',
          lat: '',
          lng: '',
          altitude: '',
          vegetation: '',
        });
        this.settings.data = this.sites[this.CurrentSite].children[
          this.CurrentPoint
        ].data;
      }

      this.renderSheet();
    },
    enableEditSite(idx) {
      this.oldName = this.filterSites[idx].value;
      this.currentEditSite = idx;
    },
    editSite(evt) {
      if (evt.type === 'keydown') {
        // ECS reset
        if (evt.keyCode === 27) {
          this.filterSites[this.currentEditSite].value = this.oldName;
          this.currentEditSite = null;
        }
        // Enter save change
        if (evt.keyCode === 13) {
          this.updateSite(evt.target.value);
        }
      } else if (evt.type === 'blur' && this.currentEditSite) {
        // blur save change
        this.updateSite(evt.target.value);
      }
    },
    updateSite(value) {
      // TODO: save change site to data, batch update when doSubmit
      console.log('updateSite', value, this.currentEditSite);
      this.currentEditSite = null;
    },
    addSite(evt) {
      if (
        (evt.type === 'click' ||
          (evt.type === 'keydown' && evt.keyCode === 13)) &&
        this.newSite !== ''
      ) {
        this.sites.push({
          name: this.newSite,
          children: [],
          data: [],
        });

        this.newSite = '';
        this.renderSheet();
      }
    },
    updatePoint(i, obj) {
      this.sites[i].children = obj;
    },
    doSubmit() {
      this.$router.push('/');
    },
  },
  mounted() {
    this.loadSingleProject(this.currentProjectId);
  },
};
</script>
