<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :project_id="1" />
      </div>
      <div class="col-10 pt-3">
        <!-- 計畫成員 -->
        <div class="panel">
          <div class="panel-heading">
            <h4>計畫成員</h4>
          </div>
          <div class="panel-body">
            <div class="invite-block">
              <form class="form-horizontal">
                <div class="form-group row mb-0">
                  <label for="" class="col-2 text-right">加入成員</label>
                  <div class="col-4">
                    <input type="text" class="form-control" placeholder="請輸入成員ROCID名稱或電子郵件" />
                  </div>
                  <div class="col-4">
                    <v-select :options="roles"/>
                    <a class="d-block link text-green underline mt-1">成員權限說明</a>
                  </div>
                  <div class="col-2">
                    <button @click.prevent="invitationOpen=true" class="btn btn-orange">邀請</button>
                  </div>
                </div>
              </form>
            </div>
            <table class="table mt-2">
              <thead>
                <tr>
                  <th>專案成員</th>
                  <th>電子郵件</th>
                  <th>權限設置</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(mem, i) in members" :class="{'disabled': mem.role==0}" :key="`member-${i}`">
                  <td>{{mem.name}}</td>
                  <td class="text-gray">{{mem.email}}</td>
                  <td>
                    <v-select :options="roles" v-model="roles[mem.role]" />
                  </td>
                  <td class="text-right">
                    <a @click="removeMember(i)">
                      <i class="icon icon-remove-sm"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="action">
          <router-link to="/project/1" class="btn btn-default">返回</router-link>
          <button type="submit" @click.stop.prevent="doSubmit()" class="btn btn-orange">儲存設定</button>
        </div>
        
      </div>
    </div>
    
    <new-column-modal :open="newColumnOpen" @close='newColumnOpen=false' @submit="submitColumn" />
    <species-order-panel :open="speciesOpen" @close='speciesOpen=false' />
    <close-window-dialog :open="closeWindowOpen" @close="closeWindowOpen=false" />
    <invitation-dialog :open="invitationOpen" @close="invitationOpen=false" />
    <delete-column-dialog :open="deleteColumnOpen" @close="deleteColumnOpen=false"  />
    <remove-member-dialog :open="removeMemberOpen" @close="removeMemberOpen=false" @submit="confirmRemove" />
  </div>

</template>

<script>
import {commonMixin} from '../../../mixins/common'
import DatePicker from 'vue2-datepicker'
import draggable from 'vuedraggable'
import NewColumnModal from '../components/NewColumn'
import SpeciesOrderPanel from '../components/SpeciesOrder'
import CloseWindowDialog from '../components/CloseWindowDialog'
import InvitationDialog from '../components/InvitationDialog'
import RemoveMemberDialog from '../components/RemoveMemberDialog'
import DeleteColumnDialog from '../components/DeleteColumnDialog'
import SiteMenu from '../components/SiteMenu'
import SiteItem from '../components/SiteItem'
import EditNav from '../components/EditNav'

const column = [
  {
    name: "樣區",
    type: "下拉選單",
    description: "樣區-子樣區",
    default: true
  }, {
    name: '相機位置',
    type: '下拉選單',
    description: "相機位置名稱",
    default: true
  }, {
    name: '檔名',
    type: '輸入框',
    description: '01234.jpg',
    default: true
  }, {
    name: '時間',
    type: '日期時間',
    description: 'YY/MM/DD hh:mm',
    default: true
  }, {
    name: '物種',
    type: '下拉選單',
    description: '編輯常見物種排序',
    default: true
  }, {
    name: '性別',
    type: '下拉選單',
    description: '公、母',
    default: false
  }, {
    name: '年齡',
    type: '下拉選單',
    description: '成體、亞成體、幼體',
    default: false
  }, {
    name: '備註',
    type: '下拉選單',
    description: '輸入框',
    default: false
  }
]

export default {
  name: "EditProject",
  mixins: [commonMixin],
  components: {
    EditNav,
    NewColumnModal, SpeciesOrderPanel, DatePicker, draggable, SiteMenu, SiteItem, CloseWindowDialog, InvitationDialog, DeleteColumnDialog, RemoveMemberDialog
  },
  data() {
    return {
      currentItem: 3,
      step: 1,
      column: column,
      newColumnOpen: false,
      speciesOpen: false,
      closeWindowOpen: false,
      deleteColumnOpen: false,
      removeMemberOpen: false,
      invitationOpen: false,
      roles: ['計畫管理員','承辦人員','巡山員'],
      sites: [],
      members: [
        {
          name: 'James Olson',
          email: 'madelyn_ziemann@hilpert.ca',
          role: 0
        }, {
          name: 'Calvin Barnes',
          email: 'cade_haag@gmail.com',
          role: 1
        }
      ],
      form: {
        cover: '',
        name: '',
        slot: '',
        agency: '',
        owner: '',
        start_at: '',
        end_at: '',
        public_at: '',
        area: '',
        description: '',
        comment: ''
      },
      licenseForm: {
        forData: '',
        forInfo: '',
        forImg: ''
      },
      currentMember: null
    }
  },
  methods: {
    confirmRemove() {
      this.members.splice(this.currentMember, 1)
      this.removeMemberOpen = false
    },
    removeMember(i) {
      this.removeMemberOpen = true
      this.currentMember = i
    },
    removeItem(i) {
      this.column.splice(i,1)
    },
    doSubmit() {
      this.$router.push('/')
    },
    submitColumn(form) {
      this.column.push({
        default: false,
        ...form
      })

      this.newColumnOpen = false
    }
  }
}
</script>
