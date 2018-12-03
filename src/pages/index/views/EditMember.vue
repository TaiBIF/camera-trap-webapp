<template>
  <div class="container page-project-edit">
    <div class="row">
      <div class="col-2">
        <h1 class="heading">計畫管理</h1>
        <edit-nav :projectId="currentProjectId" />
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
                  <label
                    for=""
                    class="col-2 text-right"
                  >加入成員</label>
                  <div class="col-4">
                    <input
                      type="text"
                      class="form-control is-invalid"
                      placeholder="請輸入成員ROCID名稱或電子郵件"
                    />
                    <div class="invalid-feedback">
                      <span class="alert-box">!</span>
                      <span class="text">電子郵件輸入不正確</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <v-select :options="roles" />
                    <router-link
                      to="/member/description"
                      class="d-block link text-green underline mt-1"
                    >
                      成員權限說明
                    </router-link>
                  </div>
                  <div class="col-2">
                    <button
                      @click.prevent="invitationOpen=true"
                      class="btn btn-orange"
                    >邀請</button>
                  </div>
                </div>
              </form>
            </div>
            <table class="table mt-2">
              <thead>
                <tr>
                  <th>計畫成員</th>
                  <th>電子郵件</th>
                  <th>權限設置</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(mem, i) in members"
                  :class="{'disabled': mem.role==0}"
                  :key="`member-${i}`"
                >
                  <td>{{mem.name}}</td>
                  <td class="text-gray">{{mem.email}}</td>
                  <td>
                    <v-select
                      :options="roles"
                      v-model="roles[mem.role]"
                    />
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

    <new-column-modal
      :open="newColumnOpen"
      @close='newColumnOpen=false'
      @submit="submitColumn"
    />

    <species-order-panel
      :open="speciesOpen"
      @close='speciesOpen=false'
    />

    <close-window-dialog
      :open="closeWindowOpen"
      @close="closeWindowOpen=false"
    />

    <invitation-dialog
      :open="invitationOpen"
      @close="invitationOpen=false"
    />

    <remove-member-dialog
      :open="removeMemberOpen"
      @close="removeMemberOpen=false"
      @submit="confirmRemove"
    />

  </div>
</template>

<script>
import { commonMixin } from '../../../mixins/common';
import NewColumnModal from '../components/NewColumn';
import SpeciesOrderPanel from '../components/SpeciesOrder';
import CloseWindowDialog from '../components/CloseWindowDialog';
import InvitationDialog from '../components/InvitationDialog';
import RemoveMemberDialog from '../components/RemoveMemberDialog';
import EditNav from '../components/EditNav';

export default {
  name: 'EditMember',
  mixins: [commonMixin],
  components: {
    EditNav,
    NewColumnModal,
    SpeciesOrderPanel,
    CloseWindowDialog,
    InvitationDialog,
    RemoveMemberDialog,
  },
  data() {
    return {
      currentItem: 3,
      step: 1,
      newColumnOpen: false,
      speciesOpen: false,
      closeWindowOpen: false,
      deleteItem: {
        index: 0,
        data: null,
      },
      removeMemberOpen: false,
      invitationOpen: false,
      roles: ['計畫管理員', '承辦人員', '巡山員'],
      sites: [],
      members: [
        {
          name: 'James Olson',
          email: 'madelyn_ziemann@hilpert.ca',
          role: 0,
        },
        {
          name: 'Calvin Barnes',
          email: 'cade_haag@gmail.com',
          role: 1,
        },
      ],
      form: {
        cover: '',
        name: '',
        slot: '',
        agency: '',
        owner: '',
        startAt: '',
        endAt: '',
        publicAt: '',
        area: '',
        description: '',
        comment: '',
      },
      licenseForm: {
        forData: '',
        forInfo: '',
        forImg: '',
      },
      currentMember: null,
    };
  },
  computed: {
    currentProjectId() {
      return this.$route.params.id;
    },
  },
  methods: {
    confirmRemove() {
      this.members.splice(this.currentMember, 1);
      this.removeMemberOpen = false;
    },
    removeMember(i) {
      this.removeMemberOpen = true;
      this.currentMember = i;
    },
    removeItem(i) {
      this.column.splice(i, 1);
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
