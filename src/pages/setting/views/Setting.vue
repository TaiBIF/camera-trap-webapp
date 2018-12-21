<template>
  <div class="container">
    <h1 class="text-green">設定</h1>
    <div class="panel panel-default mb-3">
      <div class="panel-heading">
        <h4>帳號設定</h4>
      </div>
      <div class="panel-body">
        <form
          action=""
          class="form"
        >
          <div class="form-group row">
            <label class="required col-2 text-right">
              帳號連結：
            </label>
            <div class="col-6">
              <a class="btn btn-orcid">
                <span class="icon"><i class="icon-orcid"></i></span>
                <span class="text">已連結至ORCID 帳號</span>
              </a>
              <small class="note d-block text-gray">
                本帳號已連結您的 ORCID 帳號，若要修改帳號資訊或密碼，請連結至 ORCID
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label
              class="required col-2 text-right"
              for="nameInput"
            >
              使用者名稱：
            </label>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                id="nameInput"
                v-model="name"
              />
              <small class="note d-block text-gray">
                您對外公開的稱呼
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-2 text-right"
              for="emailInput"
            >
              電子郵件：
            </label>
            <div class="col-6">
              <input
                type="email"
                class="form-control"
                id="emailInput"
                v-model="email"
              />
              <small class="note d-block text-gray">
                此電子郵件僅作通知及聯絡用途
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4>快速鍵設定</h4>
      </div>
      <div class="panel-body p-0">
        <div class="gray-block">
          <div class="row">
            <div class="col-10">
              鍵盤快速鍵能幫助您提高工作效率，您可以使用本平台預設快速鍵設定，或是自行創建屬於您習慣的快速鍵設定。<br />
              * 提醒您：您可以設定任一英文字、數字作為輸入物種時的快速鍵，但不接受空白鍵和符號
            </div>
            <div class="col-2 text-right">
              <button
                class="btn btn-basic btn-sm mt-2"
                @click="resetHotkey"
              >回復預設值</button>
            </div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>物種名稱</th>
              <th>鍵盤快速鍵</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(s, index) in speciesKeys"
              :key="`hotkey-${index}`"
            >
              <td width="22%">
                <v-select
                  v-model='s.key'
                  :options="options"
                />
              </td>
              <td width="22%">
                <input
                  type="text"
                  class="form-control"
                  v-model="s.value"
                  maxlength=2
                />
              </td>
              <td class="text-right">
                <a
                  class="close"
                  @click="removeHotkey(index)"
                ><i class="icon-remove"></i></a>
              </td>
            </tr>
            <tr v-if="options.length > 0">
              <td
                colspan="3"
                class="add"
              >
                <a
                  class="btn btn-block btn-text text-green text-left"
                  @click="addHotkey"
                >
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增快速鍵</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="action">
      <button
        class="btn btn-green-border"
        @click="handleCancel"
      >
        取消
      </button>
      <button
        type="submit"
        class="btn btn-orange"
        @click="handleSubmit"
      >
        儲存設定
      </button>
    </div>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import intToChar from '../../../util/intToChar.js';

const auth = createNamespacedHelpers('auth');
const project = createNamespacedHelpers('project');

export default {
  name: 'Setting',
  data() {
    return {
      name: '',
      email: '',
      speciesKeys: [],
    };
  },
  computed: {
    ...auth.mapGetters(['loginUser']),
    ...project.mapGetters(['allSpeciesList']),
    shouldUpdateProfile() {
      return (
        this.name &&
        (this.name !== this.loginUser.name ||
          this.email !== this.loginUser.email)
      );
    },
    options() {
      return this.allSpeciesList.filter(
        species => !this.speciesKeys.find(s => s.key === species),
      );
    },
  },
  watch: {
    loginUser: function() {
      const { name, email, speciesKeys } = this.loginUser;
      if (name) {
        this.name = name;
      }
      if (email) {
        this.email = email;
      }
      if (speciesKeys) {
        this.speciesKeys = Object.keys(speciesKeys).map(key => ({
          key,
          value: speciesKeys[key],
        }));
      }
    },
  },
  methods: {
    ...auth.mapActions([
      'loadProfile',
      'updateSpeciesKey',
      'updateProfile',
      'updateProfile',
    ]),
    ...project.mapActions(['loadProject']),
    resetHotkey() {
      // this.updateSpeciesKey(null);
      this.speciesKeys = this.allSpeciesList.map((species, index) => ({
        key: species,
        value: intToChar(index).toUpperCase(),
      }));
    },
    removeHotkey(index) {
      this.speciesKeys.splice(index, 1);
    },
    addHotkey() {
      this.speciesKeys.push({
        key: '',
        value: '',
      });
    },
    handleCancel() {
      // unable to use vue-router to another vue instance
      window.location.href = '/index.html';
    },
    handleSubmit() {
      const speciesKeys = this.speciesKeys.reduce((obj, species) => {
        if (species.key && species.value) {
          obj[species.key] = species.value;
        }
        return obj;
      }, {});
      this.updateProfile({
        speciesKeys,
        name: this.name,
        email: this.email,
      });
    },
  },
  mounted() {
    this.loadProject(); // for generate speciesKeys' option from all project's speciesList
    this.loadProfile();
  },
};
</script>
