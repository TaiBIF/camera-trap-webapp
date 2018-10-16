<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :project_id="1" />
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
                v-for="(site, s_id) in sites" 
                :key="`site-tree-${s_id}`" 
                :class="{'open': CurrentSite==s_id, 'active': CurrentSite==s_id && CurrentPoint==null, 'edit': s_id==currentEdit}">
                  
                  <div class="site-item" @click="setCurrentSite(s_id)" @dblclick="editSite(s_id)">
                    <div class="icon">
                      <i class="fa" :class="CurrentSite!=s_id?'fa-caret-right': 'fa-caret-down'"></i>
                    </div>
                    <div class="text" v-if="s_id==currentEdit">
                      <input type="text" 
                      v-model="site.name" 
                      @blur="currentEdit=null" 
                      @keydown="updateSite($event)">
                    </div>
                    <div class="text" v-else>{{site.name}}</div>
                  </div>

                  <site-menu 
                  :items="site.children" 
                  :index="s_id" 
                  :defaultOpenLevel="1" 
                  @update="updatePoint" />

                </li>
                <li class="add">
                  <div class="icon" @click="addSite($event)"><i class="icon-add"></i></div>
                  <div class="text">
                    <input type="text" v-model='newSite' @keydown="addSite($event)" placeholder='新增樣區'>
                  </div>
                </li>
              </ul>
            </div>
            <div class="maintain p-0">
              <div class="empty-result" v-if="!sites.length">
                <img src="/assets/common/empty-site.png" width="174" srcset="/assets/common/empty-site@2x.png">
                <h5 class="text-gray">您還沒新增任何樣區</h5>
              </div>
              <div v-else class="sheet-view">
                <div class="control p-2">
                  <div class="row">
                    <div class="col-12 text-right">
                      <div class="form-group-inline">
                        <label for="">座標大地基準：</label>
                        <v-select :options="['WGS84', 'TWD97']" class="d-inline-block" />
                        <span class="icon-note">
                          <i class="icon-info"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="sheet-container">
                  <div id="sheet"></div>
                    <a class="text-green btn btn-link" @click="addData()">
                    <span class="icon"><i class="icon-add-green"></i></span> 
                    <span class="text">新增相機位置</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action">
          <router-link to="/project/1" class="btn btn-default">返回</router-link>
          <button type="submit" @click.stop.prevent="doSubmit()" class="btn btn-orange">儲存設定</button>
        </div>
        
      </div>
    </div>
    <close-window-dialog :open="closeWindowOpen" @close="closeWindowOpen=false" />
  </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {commonMixin} from '../../../mixins/common'
import SpeciesOrderPanel from '../components/SpeciesOrder'
import CloseWindowDialog from '../components/CloseWindowDialog'
import SiteMenu from '../components/SiteMenu'
import SiteItem from '../components/SiteItem'
import EditNav from '../components/EditNav'
import Handsontable from 'handsontable'

export default {
  name: "EditProject",
  mixins: [commonMixin],
  components: {
    SpeciesOrderPanel, CloseWindowDialog, SiteMenu, SiteItem, EditNav
  },
  data() {
    return {
      newSite: '',
      currentSite: 0,
      oldName: '',
      sites: [],
      currentEdit: null,
      isRender: false,
      sheetContainer: null,
      settings: {
        data: [],
        columns: [
          {
            data: 'name',
            type: 'text'
          },
          {
            data: 'updated_at',
            type: 'date'
          },
          {
            data: 'lat',
            type: 'text'
          },
          {
            data: 'lng',
            type: 'text'
          },
          {
            data: 'altitude',
            type: 'text'
          },
          {
            data: 'vegetation',
            type: 'text'
          }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        language: 'zh-TW',
        colHeaders: [
          // 'URL',
          '相機位置名稱',
          '架設日期',
          '* 經度 (X)',
          '* 緯度 (Y)',
          '海拔 (公尺)',
          '植被'
        ],
        contextMenu: {
          callback: (key, selection) => {
            if(key=='clone') {
              let idx = selection[0].start.row
              let data = this.CurrentPoint==null 
                          ? this.sites[this.CurrentSite].data 
                          : this.sites[this.CurrentSite].children[this.CurrentPoint].data
              let row = data[idx]
              data = data.splice(idx, 0, window._.cloneDeep(row))
              // this.sheet.loadData(data)
              // this.sheet.updateSettings(this.settings)
            }

            this.sheet.render()
          },
          items: {
            "cut": {name: () => {return '<span class="icon"><i class="icon-cut"></i></span><span class="text">剪下</span>'} }, 
            "copy": {name: () => {return '<span class="icon"><i class="icon-copy"></i></span><span class="text">複製</span>'} }, 
            "paste": {name: () => {return '<span class="icon"><i class="icon-paste"></i></span><span class="text">貼上</span>'} }, 
            "divider1": {name: '---------' },
            "undo": {name: () => {return '<span class="icon"></i></span><span class="text">復原</span>'} }, 
            "redo": {name: () => {return '<span class="icon"></i></span><span class="text">重做</span>'} }, 
            "divider2": {name: '---------' },
            "clone": {name: () => {return '<span class="icon"></span><span class="text">複製並貼上一列</span>'} }, 
            "remove_row": {
              name: () => {return '<span class="icon"></span><span class="text">刪除相機位置</span>'},
              disabled() {
                let selected = this.getSelected()[0][0]
                let row = this.getDataAtRow(selected)
                let empty = true
                
                row.forEach((col) => { 
                  if(col!=null && col!='') empty = false 
                })
                return !empty
              }
            }, 
          }
        },
        dropdownMenu: true,
        manualRowMove: true,
        manualColumnMove: true
      }
    }
  },
  watch: {
    'CurrentPoint': {
      handler(val) {
        this.settings.data = this.sites[this.CurrentSite].children[val].data;
        this.renderSheet()
      },
      deep: true
    },
    'CurrentSite': {
      handler() {
        this.setCurrentPoint(0)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'CurrentSite', 'CurrentPoint'
    ])
  },
  methods: {
    ...mapActions([
      'setCurrentSite', 'setCurrentPoint'
    ]),
    renderSheet() {
      if(!this.isRender) {
        this.sheetContainer = this.$el.querySelector('#sheet');
        this.settings.data = this.sites[this.CurrentSite].data
        this.sheet = new Handsontable(this.sheetContainer, this.settings);
        this.isRender = true
      } else {
        this.sheet.updateSettings(this.settings)
      }
    },
    addData() {
      if(this.CurrentPoint==null) {
        this.sites[this.CurrentSite].data.push({
          name: '', updated_at: '', lat: '', lng: '', altitude: '', vegetation: ''
        })

        this.settings.data = this.sites[this.CurrentSite].data
      } else {
        this.sites[this.CurrentSite].children[this.CurrentPoint].data.push({
          name: '', updated_at: '', lat: '', lng: '', altitude: '', vegetation: ''
        })
        this.settings.data = this.sites[this.CurrentSite].children[this.CurrentPoint].data
      }

      this.renderSheet()
    },
    editSite(idx) {
      this.oldName = this.sites[idx].name

      if(!this.currentEdit)
        this.currentEdit = idx
      else
        this.currentEdit = null
    },
    updatePoint(i, obj) {
      this.sites[i].children = obj
    },
    updateSite(evt) {
      if(evt.type=="keydown") {
        if(evt.keyCode==27) {
          this.sites[this.currentEdit].name = this.oldName
          this.currentEdit = null
        }
        if(evt.keyCode==13)
          this.currentEdit = null
      } 
    },
    addSite(evt) {
      if((evt.type=="click" || evt.type=="keydown" && evt.keyCode==13) && this.newSite!=='') {
        this.sites.push({
          name: this.newSite,
          children: [],
          data: []
        })

        this.newSite = ''

        if(!this.isRender) {
          setTimeout(() => {
            this.renderSheet()
          }, 300)
        }

      }
    },
    doSubmit() {
      this.$router.push('/')
    }
  }
}
</script>
