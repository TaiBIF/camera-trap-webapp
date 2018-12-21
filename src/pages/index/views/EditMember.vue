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
                      class="form-control"
                      v-model="newMember.orcId"
                      placeholder="請輸入成員 ORCiD"
                    />
                  </div>
                  <div class="col-4">
                    <v-select
                      :options="roles"
                      v-model="newMember.role"
                    />
                    <router-link
                      to="/member/description"
                      class="d-block link text-green underline mt-1"
                    >
                      成員權限說明
                    </router-link>
                  </div>
                  <div class="col-2">
                    <button
                      @click.prevent="submitInvitation()"
                      class="btn btn-orange"
                      :disabled="!newMember.orcId"
                    >邀請</button>
                  </div>
                </div>
              </form>
            </div>
            <table class="table mt-2">
              <thead>
                <tr>
                  <th>計畫成員</th>
                  <th>Orc ID</th>
                  <th>權限設置</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(member, i) in members"
                  :class="{'disabled': member.role.value==='ProjectManager'}"
                  :key="`member-${i}`"
                >
                  <td>{{member.name}}</td>
                  <td class="text-gray">{{member.orcId}}</td>
                  <td>
                    <v-select
                      :options="roles"
                      v-model="member.role"
                      disabled
                    />
                  </td>
                  <td class="text-right">
                    <a
                      @click="removeMember(member.orcId)"
                      v-if="member.role.value!=='ProjectManager'"
                    >
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
            :to="`/project/${$route.params.id}`"
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
    <invitation-dialog
      :open="invitationOpen"
      @close="invitationOpen=false"
    />
    <remove-member-dialog
      :open="removeMemberOpen"
      @close="cancelRemove"
      @submit="confirmRemove"
    />

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { commonMixin } from '../../../mixins/common';
import CloseWindowDialog from '../components/CloseWindowDialog';
import InvitationDialog from '../components/InvitationDialog';
import RemoveMemberDialog from '../components/RemoveMemberDialog';
import EditNav from '../components/EditNav';
import {
  addProjectMember,
  removeProjectMember,
} from '../../../service/modules/members.js';

const members = createNamespacedHelpers('members');

export default {
  name: 'EditMember',
  mixins: [commonMixin],
  components: {
    EditNav,
    CloseWindowDialog,
    InvitationDialog,
    RemoveMemberDialog,
  },
  data() {
    return {
      roles: [
        { value: 'ProjectManager', label: '計畫管理員' },
        { value: 'Researcher', label: '研究人員' },
        { value: 'ResearchAssistant', label: '研究助理' },
        { value: 'CaseOfficer', label: '林管處承辦人' },
      ],
      newMember: {
        orcId: '',
        role: { value: 'ProjectManager', label: '計畫管理員' },
      },
      members: [],
      removeMemberId: null,
      invitationOpen: false,
      removeMemberOpen: false,
      closeWindowOpen: false,
    };
  },
  watch: {
    projectMembers: function(newValue) {
      this.members = newValue.map(({ name, _id, role }) => {
        return {
          name,
          orcId: _id,
          role: this.roles.find(r => r.value === role) || {},
        };
      });
    },
  },
  computed: {
    ...members.mapGetters(['projectMembers']),
    currentProjectId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...members.mapActions(['loadProjectMembers']),
    submitInvitation() {
      addProjectMember({
        projectId: this.currentProjectId,
        orcId: this.newMember.orcId,
        role: this.newMember.role.value,
      }).then(({ ret }) => {
        const newMemer = {
          name: ret.name,
          orcId: ret._id,
          role:
            this.roles.find(r => r.value === this.newMember.role.value) || {},
        };
        let memberExists = false;
        this.members.some((member, memIndex, memArr) => {
          if (member.orcId === ret._id) {
            memArr[memIndex] = newMemer;
            memberExists = true;
          }
        });
        if (!memberExists) {
          this.members.push(newMemer);
        }
        this.invitationOpen = true;
      });
    },
    removeMember(orcId) {
      this.removeMemberOpen = true;
      this.removeMemberId = orcId;
    },
    cancelRemove() {
      this.removeMemberOpen = false;
      this.removeMemberId = null;
    },
    confirmRemove() {
      removeProjectMember({
        projectId: this.currentProjectId,
        orcId: this.removeMemberId,
      }).then(() => {
        this.members = this.members.filter(
          member => member.orcId !== this.removeMemberId,
        );
        this.removeMemberOpen = false;
        this.removeMemberId = null;
      });
    },
    doSubmit() {
      // TODO:
    },
  },
  mounted() {
    this.loadProjectMembers(this.currentProjectId);
  },
};
</script>
