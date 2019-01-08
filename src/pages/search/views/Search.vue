<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載 </h1>
    <div
      class="tab"
      v-bind:class="{loading: isCalcFormAggregating}"
    >
      <ul class="nav-tab">
        <li
          class="tab-item"
          :class="{'active': currentTab==0}"
        >
          <a
            role="button"
            @click="currentTab=0"
          >資料篩選</a>
        </li>
        <li
          class="tab-item"
          :class="{'active': currentTab==1}"
        >
          <a
            role="button"
            @click="currentTab=1"
          >資料計算</a>
        </li>
      </ul>
      <div class="tab-content">
        <div
          id="search"
          class="tab-pane"
          :class="{'active': currentTab==0}"
        >
          <!-- =tab1 -->
          <form
            action=""
            class="form"
            @submit.stop.prevent="submitSearch()"
          >
            <h5>資料來源</h5>
            <div
              class="gray-block"
              v-for="(data, did) in form.data"
              :key="`data-form-${did}`"
            >
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">計畫名稱：</label>
                      <v-select
                        :options="projectOptions"
                        :on-change="generateOnProjectSelectorChangeHandler(did)"
                        v-model="data.project"
                        :placeholder="'請選擇計畫名稱'"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">樣區：</label>
                      <v-select
                        :options="projectSiteOptions[did]"
                        v-model="data.site"
                        :on-change="generateOnProjectSiteSelectorChangeHandler(did)"
                        :placeholder="'請選擇樣區'"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">子樣區：</label>
                      <v-select
                        :options="projectSubSiteOptions[did]"
                        v-model="data.subSite"
                        :on-change="generateOnProjectSubSiteSelectorChangeHandler(did)"
                        :placeholder="'請選擇子樣區'"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">相機位置：</label>
                      <v-select
                        :options="projectCameraOptions[did]"
                        v-model="data.camera"
                        :placeholder="'請選擇相機位置'"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-action">
                <a
                  v-if="did>0"
                  @click="removeFormData(did)"
                ><span class="icon-remove"></span></a>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-right">
                <a
                  class="text-green btn pr-0"
                  @click="addFormData()"
                >
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增資料來源</span>
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label>物種：</label>
                  <v-select
                    :options="projectSpecOptions"
                    v-model="form.species"
                    multiple
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>資料起始時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.startAt"
                        :placeholder="'2001-01-01'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.startTime"
                        format=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <span class="align-self-center">
                到
              </span>
              <div class="col-4">
                <div class="form-group">
                  <label>資料結束時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.endAt"
                        :placeholder="'2018-12-31'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.endTime"
                        format=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr>
                <a
                  class="link"
                  @click="advSecOpen=!advSecOpen"
                >
                  <span class="text mr-2">進階篩選</span>
                  <span class="icon">
                    <i :class="advSecOpen ? 'icon-chevron-up':  'icon-chevron-down'"></i>
                  </span>
                </a>
              </div>
            </div>

            <div
              id="adv-block"
              v-if="advSecOpen"
            >
              <div class="row">
                <div
                  v-for="dataField in dataFields"
                  :key="dataField.key"
                  :class="{'col-2': dataField.type==='select', 'col-4': dataField.type==='text'}"
                >
                  <div
                    v-if="dataField.type==='select'"
                    class="form-group"
                  >
                    <label>{{ dataField.label }}：</label>
                    <v-select
                      v-model="form.customFields[dataField.key]"
                      :options="dataField.options"
                      :placeholder="`請選擇${dataField.label}`"
                    />
                  </div>
                  <div
                    v-if="dataField.type==='text'"
                    class="form-group"
                  >
                    <label>
                      <span class="text">{{ dataField.label }}：</span>
                      <span class="icon">
                        <i class="icon-info mt-1"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.customFields[dataField.key]"
                      :placeholder="`請選擇${dataField.label}`"
                    >
                  </div>
                </div>
              </div>
              <div
                class="row"
                style="display: none;"
              >
                <div class="col-3">
                  <div class="form-group">
                    <label>海拔：</label>
                    <v-select
                      :options="[{label:'公', value: 'male'},{label:'母', value: 'female'}]"
                      :placeholder="'請選擇海拔範圍'"
                    />
                  </div>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <label>植被：</label>
                    <v-select
                      :options="[
                      {label:'公', value: 'male'},
                      {label:'母', value: 'female'}
                    ]"
                      :placeholder="'請選擇植被'"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>土地覆蓋類型：</label>
                    <v-select
                      :options="[
                      {label:'公', value: 'male'},
                      {label:'母', value: 'female'}
                    ]"
                      :placeholder="'請選擇土地覆蓋類型'"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="form-group">
                    <label>拍攝時段：</label>
                    <div class="input-group-inline">
                      <div class="input-group">
                        <vue-timepicker v-model="form.cameraStart" />
                      </div>
                      <div class="text px-2">到</div>
                      <div class="input-group">
                        <vue-timepicker v-model="form.cameraEnd" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 text-right action">
              <button
                type="reset"
                class="btn btn-green-border"
              >清空選項</button>
              <button
                type="submit"
                class="btn btn-orange"
              >篩選</button>
            </div>
          </form>
        </div>
        <!-- =tab2 -->
        <div
          id="calculate"
          class="tab-pane"
          :class="{'active': currentTab==1}"
        >
          <form
            action=""
            class="form"
            @submit.stop.prevent="submitCalculate()"
          >
            <div class="green-block">
              <div class="row">
                <div class="col-6 offset-3">
                  <div class="form-group row mb-0">
                    <label class="col-3 text-right required">計算項目：</label>
                    <div class="col-9">
                      <v-select
                        v-model="calcForm.type"
                        :options="[
                          {label: '有效照片與目擊事件', value:'basic-calculation'},
                          {label: '初測延遲', value:'daily-first-captured'}
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <h5 class="mb-3">
              基本欄位
              <span class="text-gray">( 請選擇單一相機位置及物種進行計算 )</span>
            </h5>
            <div class="gray-block">
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label
                        for=""
                        class="required"
                      >計畫名稱：</label>
                      <v-select
                        v-model="calcForm.project"
                        :options="projectOptions"
                        :placeholder="'請選擇計畫名稱'"
                        :on-change="generateOnProjectSelectorChangeHandler()"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label
                        for=""
                        class="required"
                      >樣區：</label>
                      <v-select
                        :options="getProjectSiteOptions(calcForm.project.value)"
                        :on-change="generateOnProjectSiteSelectorChangeHandler()"
                        v-model="calcForm.site"
                        :placeholder="'請選擇樣區'"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label
                        for=""
                        class="required"
                      >子樣區：</label>
                      <v-select
                        :options="getProjectSubSiteOptions(calcForm.project.value, calcForm.site.value)"
                        :on-change="generateOnProjectSubSiteSelectorChangeHandler()"
                        v-model="calcForm.subSite"
                        :placeholder="'請選擇子樣區'"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label
                        for=""
                        class="required"
                      >相機位置：</label>
                      <v-select
                        v-model="calcForm.camera"
                        :options="getProjectCameraMd5Options(calcForm.project.value, calcForm.site.value, calcForm.subSite.value)"
                        multiple
                        :placeholder="'請選擇相機位置'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>物種：</label>
                  <v-select
                    :options="calcFormOptions.species"
                    v-model="calcForm.species"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>資料起始時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="calcForm.fromDate"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="calcForm.fromTime"
                        format=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <span class="align-self-center">
                到
              </span>
              <div class="col-4">
                <div class="form-group">
                  <label>資料結束時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="calcForm.toDate"
                        :placeholder="'2018-09-20'"
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="calcForm.toTime"
                        format=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr>

            <h5>計算條件</h5>

            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label class="required">有效時間判定間隔(分鐘)：</label>
                  <v-select
                    v-model="calcForm.effectiveTimeInterval"
                    :options="[2,5,10,30,60]"
                    :placeholder="'請選擇有效時間判定間隔'"
                  ></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <!-- <label class="required">目擊事件判斷間隔：</label>
                  <v-select
                    v-model="form.seeMin"
                    :options="[2,5,10,30,60]"
                    :placeholder="'請選擇目擊事件判斷間隔'"
                  ></v-select> -->
                </div>
              </div>
            </div>

            <div class="col-12 text-right action">
              <button
                type="reset"
                class="btn btn-green-border"
              >
                清空選項
              </button>
              <button
                type="submit"
                class="btn btn-orange"
              >
                計算
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import { commonMixin } from '../../../mixins/common.js';

import moment from 'moment';
const auth = createNamespacedHelpers('auth');

const dataFieldAvailable = createNamespacedHelpers('dataFieldAvailable');
const project = createNamespacedHelpers('project');

export default {
  name: 'Search',
  mixins: [commonMixin],
  components: { DatePicker, VueTimepicker },
  data() {
    return {
      currentTab: 0,
      advSecOpen: true,
      isCalcFormAggregating: false,
      calcForm: {
        type: { label: '有效照片與目擊事件', value: 'basic-calculation' },
        project: {
          value: '',
          label: '',
        },
        site: '',
        subSite: 'NULL',
        species: '',
        fromDate: '',
        fromTime: {
          HH: '00',
          mm: '00',
        },
        toDate: '',
        toTime: {
          HH: '00',
          mm: '00',
        },
        effectiveTimeInterval: 30,
        camera: [],
      },
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
          HH: '00',
          mm: '00',
        },
        endTime: {
          HH: '23',
          mm: '59',
        },
        cameraStart: {
          HH: '00',
          mm: '00',
        },
        cameraEnd: {
          HH: '23',
          mm: '59',
        },
      },
    };
  },
  computed: {
    ...project.mapGetters(['Projects']),
    ...dataFieldAvailable.mapGetters(['dataFieldAvailable']),
    ...auth.mapGetters(['authCredentials']),

    calcFormOptions() {
      const { project } = this.calcForm;
      const { speciesList } = project;

      return {
        species: speciesList,
      };
    },

    projectOptions: function() {
      /*
      All projects.
      @returns {Array<{label: 'string', value: 'string'}>}
      */

      return this.Projects.map(project => {
        return {
          ...project,
          label: project.projectTitle,
          value: project._id,
        };
      });
    },
    projectSiteOptions: function() {
      /*
      All sites of projects.
      The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
      @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
      */
      const result = [];
      this.form.data.forEach(data => {
        result.push(
          this.getProjectSiteOptions(data.project && data.project.value),
        );
      });
      return result;
    },
    projectSubSiteOptions: function() {
      /*
      All sub-sites of projects.
      The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
      @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
      */
      return this.form.data.map(data => {
        return this.getProjectSubSiteOptions(
          data.project && data.project.value,
          data.site && data.site.value,
        );
      });
    },
    projectCameraOptions: function() {
      /*
      All camera locations of projects.
      The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
      @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
      */
      return this.form.data.map(data => {
        return this.getProjectCameraOptions(
          data.project && data.project.value,
          data.site && data.site.value,
          data.subSite && data.subSite.value,
        );
      });
    },
    projectSpecOptions: function() {
      /*
      All species of all projects.
      @returns {Array<{label: 'string', value: 'string'}>}
      */
      const species = new Set();
      this.Projects.forEach(project => {
        (project.speciesList || []).forEach(spec => {
          species.add(spec);
        });
      });
      return Array.from(species).map(spec => {
        return {
          label: spec,
          value: spec,
        };
      });
    },
    dataFields: function() {
      /*
      All data fields of projects.
      @returns {Array<{label: 'string', type: 'string', options: {Array<{label: 'string', value: 'string'}>}}|null>}
       */
      const dataFieldKeys = new Set();
      this.Projects.forEach(project => {
        (project.dataFieldEnabled || []).forEach(key => {
          dataFieldKeys.add(key);
        });
      });
      const result = [];
      Array.from(dataFieldKeys).map(key => {
        const dataField = this.findDataField(key);
        if (!dataField) {
          return;
        }
        result.push({
          key: key,
          label: dataField.label,
          type: dataField.widget_type,
          options: (dataField.widget_select_options || []).map(option => {
            return {
              label: option,
              value: option,
            };
          }),
        });
      });
      return result;
    },
  },
  methods: {
    ...project.mapActions(['loadProject']),
    ...dataFieldAvailable.mapActions(['loadDataFieldAvailable']),
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
    getProjectSiteOptions(projectId) {
      /*
      Get sites of the project.
      @param projectId {string}
      @returns {Array<{label: 'string', value: 'string'}}>}
       */
      const project = this.getProject(projectId);
      if (project) {
        const sites = new Set();
        project.cameraLocations.forEach(cameraLocation => {
          sites.add(cameraLocation.site);
        });
        return Array.from(sites).map(site => {
          return {
            label: site,
            value: site,
          };
        });
      }
      return [];
    },
    getProjectSubSiteOptions(projectId, site) {
      /*
      Get sub-sites of the project.
      @param projectId {string}
      @param site {string}
      @returns {Array<{label: 'string', value: 'string'}}>}
       */
      for (let index = 0; index < this.Projects.length; index += 1) {
        const project = this.Projects[index];
        if (project._id === projectId) {
          const subSites = new Set();
          project.cameraLocations.forEach(cameraLocation => {
            if (cameraLocation.site === site) {
              subSites.add(cameraLocation.subSite);
            }
          });
          return Array.from(subSites).map(subSite => {
            return {
              label: subSite,
              value: subSite,
            };
          });
        }
      }
      return [];
    },
    getProjectCameraOptions(projectId, site, subSite) {
      /*
      Get camera locations of the project.
      @param projectId {string}
      @param site {string}
      @param subSite {string}
      @returns {Array<{label: 'string', value: 'string'}}>}
       */
      for (let index = 0; index < this.Projects.length; index += 1) {
        const project = this.Projects[index];
        if (project._id === projectId) {
          const locations = new Set();
          project.cameraLocations.forEach(cameraLocation => {
            if (
              cameraLocation.site === site &&
              cameraLocation.subSite === subSite
            ) {
              locations.add(cameraLocation.cameraLocation);
            }
          });
          return Array.from(locations).map(location => {
            return {
              label: location,
              value: location,
            };
          });
        }
      }
      return [];
    },
    getProjectCameraMd5Options(projectId, site, subSite) {
      /*
      Get camera locations of the project.
      @param projectId {string}
      @param site {string}
      @param subSite {string}
      @returns {Array<{label: 'string', value: 'string'}}>}
       */
      for (let index = 0; index < this.Projects.length; index += 1) {
        const project = this.Projects[index];
        if (project._id === projectId) {
          const locations = {};
          project.cameraLocations.forEach(cameraLocation => {
            if (
              cameraLocation.site === site &&
              cameraLocation.subSite === subSite
            ) {
              locations[cameraLocation.cameraLocation] =
                cameraLocation.fullCameraLocationMd5;
            }
          });
          return Object.keys(locations).map(location => {
            return {
              label: location,
              value: locations[location],
            };
          });
        }
      }
      return [];
    },
    generateOnProjectSelectorChangeHandler(dataIndex) {
      const _this = this;
      if (dataIndex === undefined)
        return function(value) {
          this.$emit('input', value);
          _this.calcForm.site = '';
          _this.calcForm.subSite = '';
          _this.calcForm.camera = '';
          _this.calcForm.fromDate = moment(
            _this.calcForm.project.earliestRecordTimestamp * 1000,
          ).format('YYYY-MM-DD');
          _this.calcForm.toDate = moment(
            _this.calcForm.project.latestRecordTimestamp * 1000,
          ).format('YYYY-MM-DD');
        };
      return function(value) {
        this.$emit('input', value);
        _this.form.data[dataIndex].site = '';
        _this.form.data[dataIndex].subSite = '';
        _this.form.data[dataIndex].camera = '';
        _this.form.startAt = moment(
          Math.min(
            ..._this.form.data.map(
              d => d.project.earliestRecordTimestamp * 1000,
            ),
          ),
        ).format('YYYY-MM-DD');
        _this.form.endAt = moment(
          Math.max(
            ..._this.form.data.map(d => d.project.latestRecordTimestamp * 1000),
          ),
        ).format('YYYY-MM-DD');
      };
    },
    generateOnProjectSiteSelectorChangeHandler(dataIndex) {
      const _this = this;
      if (dataIndex === undefined)
        return function(value) {
          this.$emit('input', value);
          _this.calcForm.subSite = '';
          _this.calcForm.camera = '';
        };
      return function(value) {
        this.$emit('input', value);
        _this.form.data[dataIndex].subSite = '';
        _this.form.data[dataIndex].camera = '';
      };
    },
    generateOnProjectSubSiteSelectorChangeHandler(dataIndex) {
      const _this = this;
      if (dataIndex === undefined)
        return function(value) {
          this.$emit('input', value);
          _this.calcForm.camera = '';
        };
      return function(value) {
        this.$emit('input', value);
        _this.form.data[dataIndex].camera = '';
      };
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
    submitSearch() {
      const form = {
        data: this.form.data.map(data => {
          return {
            projectId: data.project ? data.project.value : '',
            site: data.site ? data.site.value : '',
            subSite: data.subSite ? data.subSite.value : '',
            camera: data.camera ? data.camera.value : '',
          };
        }),
        species: this.form.species.map(spec => {
          return spec.value;
        }),
        startAt: (() => {
          if (!this.form.startAt) {
            return this.form.startAt;
          }
          const time = new Date(this.form.startAt);
          time.setHours(+this.form.startTime.HH);
          time.setMinutes(+this.form.startTime.mm);
          return time;
        })(),
        endAt: (() => {
          if (!this.form.endAt) {
            return this.form.endAt;
          }
          const time = new Date(this.form.endAt);
          time.setHours(+this.form.endTime.HH);
          time.setMinutes(+this.form.endTime.mm);
          return time;
        })(),
        customFields: (() => {
          const result = {};
          for (const customFieldKey in this.form.customFields) {
            const customField = this.form.customFields[customFieldKey];
            if (customField && typeof customField === 'object') {
              result[customFieldKey] = customField.value;
            } else {
              result[customFieldKey] = customField;
            }
          }
          return result;
        })(),
        cameraStart: this.form.cameraStart,
        cameraEnd: this.form.cameraEnd,
      };
      this.$router.push({
        path: '/search',
        query: {
          form: JSON.stringify(form),
        },
      });
    },
    async submitCalculate() {
      this.isCalcFormAggregating = true;
      this.calcForm.idTokenHash = Object.values(
        this.authCredentials.params.Logins,
      )[0];
      this.$store.commit('CALC_FORM', this.calcForm);
      const res = await this.$store.dispatch('calcFormAggregate');
      this.isCalcFormAggregating = false;
      if (res.ret) {
        this.$router.push('/calculate');
      } else {
        // somehow show no results
        alert('no data!!');
      }
    },
    removeFormData(idx) {
      this.form.data.splice(idx, 1);
    },
    addFormData() {
      this.form.data.push({
        project: '',
        site: '',
        subSite: '',
        camera: '',
      });
    },
  },
  beforeMount() {
    this.loadProject();
    this.loadDataFieldAvailable();
  },
};
</script>
