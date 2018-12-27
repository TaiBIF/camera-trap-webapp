<template>
  <div
    class="maintain"
    v-if="!!currentProject"
  >
    <div class="container">
      <div class="panel panel-project">
        <div class="panel-body">
          <div class="row">
            <div class="col-8">
              <div class="row">
                <div class="col-9">
                  <h1 class="heading mt-0">
                    {{currentProject.projectTitle}}
                  </h1>
                </div>
                <div
                  class="col-3 text-right"
                  v-if="showManageLink"
                >
                  <router-link
                    :to="`/info/${currentProject._id}/edit`"
                    class="float-right btn btn-green-border btn-sm"
                  >
                    <i class="fa fa-pencil-alt mr-2"></i>
                    <span class="text">計畫管理</span>
                  </router-link>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">委辦單位</div>
                <div class="col-sm-8 col-md-9">{{currentProject.funder}}</div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">計畫編號</div>
                <div class="col-sm-8 col-md-9">{{currentProject.adminProjectId}}</div>
              </div>
              <div
                class="row mb-2"
                v-if="!!currentProject.principalInvestigator"
              >
                <div class="col-sm-4 col-md-3 text-gray">計畫主持人</div>
                <div class="col-sm-8 col-md-9">{{currentProject.principalInvestigator}}</div>
              </div>
              <div
                class="row"
                v-if="!!currentProject.projectStartDate && !!currentProject.projectEndDate"
              >
                <div class="col-sm-4 col-md-3 text-gray">計畫時間</div>
                <div class="col-sm-8 col-md-9">{{currentProject.projectStartDate}} - {{currentProject.projectEndDate}}</div>
              </div>
            </div>
            <div class="col-4 text-center pt-5 divider">
              <a
                :href="`upload.html#/${this.$route.params.id}`"
                class="btn btn-orange"
              >
                <i class="fa fa-upload mr-2"></i>
                <span class="text">檔案上傳</span>
              </a>
              <p class="text-gray">欄位格式請參考 <a
                  class="link text-underline text-green"
                  @click="downloadExampleCsv"
                >範本下載</a></p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel tab-panel">
        <div class="panel-header">
          <ul class="nav-tab">
            <li
              @click="currentTab=0"
              :class="{'active': currentTab==0}"
            ><a>影像回收/辨識狀況</a></li>
            <li
              @click="currentTab=1"
              :class="{'active': currentTab==1}"
            ><a>已辨識物種</a></li>
          </ul>
        </div>
        <div class="panel-body">
          <div class="tab-paen">
            <div
              class="tab-content"
              :class="{'active': currentTab==0}"
            >
              <div class="row control-bar">
                <div class="col-sm-5 col-md-4">
                  <div class="form-group row mb-0">
                    <label class="col-5 text-right">
                      樣區：
                    </label>
                    <div class="col-7">
                      <v-select
                        v-model="currentSite"
                        :options="sites"
                      ></v-select>
                    </div>
                  </div>
                </div>
                <div
                  class="col-sm-5 col-md-4"
                  v-if="currentSite.child && currentSite.child.length > 0"
                >
                  <div class="form-group row mb-0">
                    <label class="col-5 text-right">
                      子樣區：
                    </label>
                    <div class="col-7">
                      <v-select
                        v-model="currentSubSite"
                        :options="currentSite.child"
                      ></v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row map-container">
                <div class="col-5">
                  <l-map
                    style="height: 395px"
                    :zoom="mapInfo.zoom"
                    :center="mapInfo.center"
                    :options="mapInfo.options"
                    @update:bounds="centerUpdated"
                    @update:zoom="zoomUpdated"
                  >
                    <l-tile-layer
                      :url="mapInfo.url"
                      :attribution="mapInfo.attribution"
                    />
                    <l-layer-group
                      v-if="mapMode=='camera'"
                      :className="'site-container'"
                      layer-type="overlay"
                      name="Layer Marker"
                    >
                      <!-- 相機樣點座標 -->
                      <l-marker
                        v-for="(mark,idx) in mapInfo.marker"
                        :key="`project-marker-${idx}`"
                        :icon="mark.icon"
                        :title="mark.num"
                        :lat-lng="mark.marker"
                        :draggable="false"
                        @click="setCurrent(mark, idx)"
                      >
                        <l-tooltip
                          :content="mark.name"
                          :options="{permanent: true, direction: 'top'}"
                        />
                      </l-marker>
                    </l-layer-group>

                    <l-layer-group
                      v-if="mapMode=='project'"
                      layer-type="overlay"
                      name="Layer Circle"
                    >
                      <!-- 樣站範圍，待實際資料取得後微調 -->
                      <l-circle
                        v-for="(mark,idx) in mapInfo.marker"
                        :key="`project-circle-1${idx+1}`"
                        :lat-lng="mark.marker"
                        :draggable="false"
                        :radius=10000
                        :fillColor="'#2A7F60'"
                        :fillOpacity="1"
                        :color="'rgba(42,127,96,.43)'"
                        @click="setCurrent(mark)"
                      >
                        <l-tooltip
                          :content="mark.name"
                          :options="{permanent: true, direction: 'center'}"
                        ></l-tooltip>
                      </l-circle>
                    </l-layer-group>

                    <l-layer-group
                      v-if="showWoods"
                      layer-type="overlay"
                      name="Layer polyline"
                    >
                      <!-- 林班地座標 -->
                      <l-polygon
                        v-for="item in forestBoundary"
                        :key="item.id"
                        :lat-lngs="item.points"
                        :fillColor="'rgba(255,140,35,.15)'"
                        :stroke="true"
                        :fillOpacity="1"
                        :color="'#FFAF00'"
                      />
                    </l-layer-group>

                  </l-map>
                  <div class="checkbox float-right mt-3     mb-0">
                    <input
                      type="checkbox"
                      name="show-woods"
                      id="show-woods"
                      value="1"
                      v-model="showWoods"
                    >
                    <label for="show-woods">在地圖顯示林班地範圍</label>
                  </div>
                </div>
                <div class="col-7">
                  <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-8">
                      <h1 class="display-heading mt-1">{{ !currentSubSite ? currentSite.label : currentSubSite.label }}</h1>
                      <small class="sub-heading text-gray">最後更新時間：2018/08/16</small>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-4 text-right">
                      <div class="btn-group">
                        <a
                          class="btn btn-border-gray"
                          @click="setSiteStatusTab(0)"
                          :class="{'active': siteStatusTab==0}"
                        >影像回收狀況</a>
                        <a
                          class="btn btn-border-gray"
                          @click="setSiteStatusTab(1)"
                          :class="{'active': siteStatusTab==1}"
                        >影像辨識進度</a>
                      </div>
                    </div>
                  </div>
                  <div v-if="siteStatusTab==0">
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a
                          @click="errorReportOpen=true"
                          class="btn btn-sm btn-default"
                          v-if="mapMode=='camera'"
                        >
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <site-chart
                      :chart="progressData"
                      :type="siteStatusTab"
                      :current="currentSite.value"
                      @update="setCurrent"
                    />
                  </div>
                  <div v-if="siteStatusTab==1">
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a
                          @click="errorReportOpen=true"
                          class="btn btn-sm btn-default"
                          v-if="mapMode=='camera'"
                        >
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <site-chart
                      :chart="progressData"
                      :type="siteStatusTab"
                      :current="currentSite.value"
                      @update="setCurrent"
                    />
                  </div>
                  <div
                    class="camera-chart"
                    v-if="currentCamera!==null"
                  >
                    <div
                      class="close"
                      @click="currentCamera=null"
                    ><i class="fa fa-times"></i></div>
                    <h1 class="display-heading">
                      {{currentCamera.cameraLocation}}
                      <small class="text-gray">{{currentCamera.site}}-{{currentCamera.subSite}}</small>
                    </h1>
                    <div class="text-gray">
                      <div>架設日期：{{ currentCamera.setupDate }}</div>
                      <div> WGS84 經緯度：{{ `${parseFloat(currentCamera.wgs84dec_x).toFixed(6)}` }}, {{ `${parseFloat(currentCamera.wgs84dec_y).toFixed(6)}` }}</div>
                      <div v-if="currentCamera.twd97tm2_x && currentCamera.twd97tm2_y"> TWD97TM2 座標：{{ `${currentCamera.twd97tm2_x || ''}` }}, {{ `${currentCamera.twd97tm2_x || ''}` }}</div>
                      <div>海拔：{{ currentCamera.elevation }}m</div>
                      <div>植披：{{ currentCamera.vegetation }}</div>
                      <div>土地利用型態：{{ currentCamera.land_cover }}</div>
                    </div>
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a
                          @click="errorReportOpen=true"
                          class="btn btn-sm btn-default"
                          v-if="mapMode=='camera'"
                        >
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <v-chart
                      :options="barOption"
                      ref="barCharts"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-content pt-4"
              :class="{'active': currentTab==1}"
            >
              <div class="row">
                <div class="col-6 text-center">
                  <h5 class="mt-0">本計畫已辨識物種比例</h5>
                  <small class="sub-heading text-gray">(依據本計畫回收的照片張數計算)</small>
                  <v-chart
                    :options="pieOption"
                    ref="pieCharts"
                  />
                </div>
                <div class="col-6">
                  <h3>
                    本計畫已辨識物種 <big>{{speciesGroup.species_group.length}}</big> 種
                  </h3>
                  <small
                    class="sub-heading text-gray"
                    v-if="speciesGroup.modified"
                  >最後更新時間：{{timeFormat(speciesGroup.modified)}}</small>
                  <hr>
                  <div class="row">
                    <div class="col-5">
                      <div
                        class="speices-item"
                        v-for="(sp, sid) in species.slice(0,6)"
                        :key="`speices-item-${sid}`"
                      >
                        <span
                          class="circle"
                          :style="{backgroundColor: chartColors[sid]}"
                        ></span>
                        <span class="text">{{sp.name}} {{ countPercentage(sid, species)}}%</span>
                      </div>
                    </div>
                    <div class="col-7">
                      <div class="speices-item">
                        <span
                          class="circle"
                          :style="{backgroundColor: chartColors[6]}"
                        ></span>
                        <span class="text">
                          其他
                          <div
                            class="text-gray"
                            v-for="(sp, sid) in species.slice(6, species.length)"
                            :key="`speices-item-${sid}`"
                          >
                            <div class="sub-item">{{sp.name}} {{ countPercentage(sid + 6, species)}}%</div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <report-modal
      :open="errorReportOpen"
      @close="errorReportOpen=false"
      @submit="submitReport"
      :options="reportOptions"
      :defaultValue="reportDefaultValue"
    />
  </div>
</template>

<script>
import L from 'leaflet';
import {
  LMap,
  LTileLayer,
  LMarker,
  LTooltip,
  LCircle,
  LLayerGroup,
  LPolygon,
} from 'vue2-leaflet';
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';
import VueHighcharts from 'vue2-highcharts';
import SiteChart from '../components/SiteChart';
import ReportModal from '../components/ReportModal';
import { isAllowManageProject } from '../../../util/roles.js';

const project = createNamespacedHelpers('project');
const auth = createNamespacedHelpers('auth');
const forestBoundary = createNamespacedHelpers('forestBoundary');
const exampleFiles = createNamespacedHelpers('exampleFiles');

// 設定未選擇/已選擇 Icon
// const Icon = L.icon({
//   iconUrl: '/assets/common/marker-icon@2x.png',
//   iconSize: [60, 109],
//   iconAnchor: [31, 77],
//   popupAnchor: [-3, -76],
//   shadowSize: [60, 109],
//   shadowAnchor: [31, 77],
// });

const IconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [33, 80],
  popupAnchor: [-3, -76],
  shadowSize: [66, 120],
  shadowAnchor: [31, 77],
});

// const ErrorIcon = L.icon({
//   iconUrl: '/assets/common/marker-icon-error@2x.png',
//   iconSize: [60, 109],
//   iconAnchor: [30, 77],
//   popupAnchor: [-3, -76],
//   shadowSize: [66, 109],
//   shadowAnchor: [33, 77],
// });

const ErrorIconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-error-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [30, 80],
  popupAnchor: [-3, -80],
  shadowSize: [66, 120],
  shadowAnchor: [33, 80],
});

export default {
  name: 'Project',
  data() {
    return {
      today: moment(),
      currentDuration: 2018, // 紀錄目前顯示的年份
      currentSite: {
        // 紀錄目前顯示的樣站，格式需轉成 vue-select 的格式
        value: 0,
        label: '全部樣區',
      },
      SiteMarkers: [],
      currentSubSite: null, // 紀錄目前顯示的子樣站
      currentCamera: null, // 紀錄目前顯示的相機
      errorReportOpen: false,
      pieChartRendering: false,
      mapMode: 'project', // 目前顯示的圖表層級
      // progressData: [], // 取得每月繳交資訊
      showWoods: false, // 是否顯示林班地
      // polygon: [
      //   // 林班地資料示意
      //   {
      //     id: 'p1',
      //     points: [
      //       { lat: 24.604577, lng: 121.608599 },
      //       { lat: 24.753846, lng: 121.175827 },
      //       { lat: 24.34913, lng: 121.164845 },
      //     ],
      //     visible: true,
      //   },
      // ],
      mapInfo: {
        zoom: 11,
        options: {
          zoomControl: true,
        },
        center: L.latLng(25.039202, 121.819413),
        url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: [],
      },
      // 共用圖表顏色
      chartColors: [
        '#5DB897',
        '#AACAEE',
        '#7E99E5',
        '#5569B5',
        '#CC76BA',
        '#FFC8EB',
        '#BDE9A5',
      ],
      currentTab: 0,
      // 長條圖設定
      barOption: {
        chart: {
          type: 'column',
          height: 230,
        },
        colors: ['#8ACFCB'],
        title: {
          enable: false,
          text: '',
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          useHTML: true,
          pointFormatter() {
            // 顯示錯誤數
            return `
              <div>
                <span class="red label float-right ${
                  this.hasError ? 'd-inline-block' : 'd-none'
                }">資料異常</span>
                <h5 class="my-1">${this.y} <small>筆</small></h5>
              </div>
              <div class="text-gray">上傳時間：${this.updated_at}</div>
            `;
          },
          style: {
            color: '#FFF',
          },
        },
        plotOptions: {
          column: {
            states: {
              hover: {
                color: '#09968F',
              },
            },
          },
        },
        xAxis: {
          categories: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '9月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
        },
        series: null,
      },
      // 圓餅圖設定
      pieOption: {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 340,
        },
        colors: [
          '#5DB897',
          '#AACAEE',
          '#7E99E5',
          '#5569B5',
          '#CC76BA',
          '#FFC8EB',
          '#BDE9A5',
        ],
        title: {
          enable: false,
          text: '',
        },
        subtitle: {
          enable: false,
          text: '',
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(70,70,70,.8)',
          pointFormatter() {
            return `<span style="color:#FFF">${this.name}：${
              this.y
            } 筆辨識紀錄 (${this.percentage.toFixed(1)}%)</span>`;
          },
          style: {
            color: '#FFF',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: null,
      },
      getForestBoundaryParam: {
        decimalLatitude: 0,
        decimalLongitude: 0,
      },
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LCircle,
    LTooltip,
    LLayerGroup,
    SiteChart,
    'v-chart': VueHighcharts,
    ReportModal,
  },
  watch: {
    currentProject() {
      setTimeout(() => {
        this.getSpeciesGroup();
        this.fetchImageStatus();
      }, 100);
    },
    currentSite(newValue) {
      setTimeout(() => {
        this.setCamera(newValue);
        this.fetchImageStatus();
      }, 100);
    },
    ProjectMarkers() {
      setTimeout(() => {
        if (!this.mapInfo.marker.length && this.mapMode === 'project') {
          this.fetchImageStatus();
        }
      }, 100);
    },
    SiteMarkers() {
      setTimeout(() => {
        if (!this.mapInfo.marker.length && this.mapMode === 'camera') {
          this.fetchImageStatus();
        }
      }, 100);
    },
    species: 'loadPieChart',
    locationCameraAbnormalStatus: 'renderMap',
    locationIdentifiedStatus: 'renderMap',
    locationRetrievedStatus: 'renderMap',
  },
  computed: {
    ...project.mapState([
      'speciesGroup',
      'siteStatusTab',
      'locationIdentifiedStatus',
      'locationRetrievedStatus',
      'locationCameraAbnormalStatus',
    ]),
    ...project.mapGetters([
      'currentProject',
      'cameraLocations',
      'species',
      'sites',
      'ProjectMarkers',
    ]),
    ...auth.mapGetters(['projectRoles']),
    ...forestBoundary.mapGetters(['forestBoundary']),
    reportOptions() {
      const tmp = JSON.parse(JSON.stringify(this.cameraLocations || []));

      // this.cameraLocations 只有 site 跟 subsite 資訊，並沒有相機資訊
      // 下面補上相機資訊以及相機 md5
      tmp.map(v => {
        v.children.map(c => {
          c.cameraList = this.currentProject
            ? this.currentProject.cameraLocations
                .filter(val => val.subSite === c.id)
                .reduce((obj, val) => {
                  obj[val.cameraLocation] = val.fullCameraLocationMd5;
                  return obj;
                }, {})
            : [];
        });
      });

      return tmp;
    },
    reportDefaultValue() {
      return {
        site: this.currentSite && this.currentSite.label,
        subSite: this.currentSubSite && this.currentSubSite.label,
        camera: this.currentCamera && this.currentCamera.cameraLocation,
      };
    },
    showManageLink() {
      const projectRole = this.projectRoles.find(
        projectRole => projectRole.projectId === this.currentProject.projectId,
      );
      if (!projectRole) {
        return false;
      }
      return isAllowManageProject(projectRole.role);
    },
    currentCameraAdnormalMonth() {
      if (!this.currentCamera || !this.currentCamera.cameraLocation) {
        return [];
      }
      const adnormalStatus = this.locationCameraAbnormalStatus.find(
        status => status.cameraLocation === this.currentCamera.cameraLocation,
      );
      if (!adnormalStatus || !adnormalStatus.month) {
        return [];
      }
      return adnormalStatus.month;
    },
    progressData() {
      if (this.mapMode === 'project') {
        return this.ProjectMarkers;
      }
      if (this.mapMode === 'camera') {
        return this.SiteMarkers;
      }
      return [];
    },
  },
  methods: {
    ...project.mapMutations(['setCurrentProject', 'setSiteStatusTab']),
    ...project.mapActions([
      'getSpeciesGroup',
      'getLocationIdentifiedStatus',
      'getLocationRetrievedStatus',
      'getLocationCameraAbnormalStatus',
      'updateAbnormalCamera',
    ]),
    ...forestBoundary.mapActions(['loadForestBoundary']),
    ...exampleFiles.mapActions(['downloadProjectExampleCsv']),
    downloadExampleCsv() {
      this.downloadProjectExampleCsv(this.currentProject._id);
    },
    fetchImageStatus() {
      this.mapInfo.marker = [];
      const payload = {
        year: this.currentDuration,
        ...{
          site:
            this.currentSite.label !== '全部樣區'
              ? this.currentSite.label
              : undefined,
          subSite: !this.currentSubSite ? undefined : this.currentSubSite.label,
        },
      };

      this.getLocationIdentifiedStatus(payload);
      this.getLocationRetrievedStatus(payload);
      this.getLocationCameraAbnormalStatus(payload);
    },
    timeFormat(time) {
      return moment(time * 1000).format('YYYY-MM-DD');
    },
    submitReport(val) {
      this.updateAbnormalCamera([
        {
          projectId: this.currentProject._id,
          projectTitle: this.currentProject.projectTitle,
          ...val,
        },
      ]);
    },
    setCamera(value) {
      // 判斷顯示層級，帶入樣站或相機
      if (this.mapMode === 'project') {
        if (!value.child === false && value.child.length) {
          this.currentCamera = null;
          this.currentSubSite = value.child[0];
        } else {
          this.currentCamera = null;
          this.currentSubSite = null;
        }
        this.mapMode = 'camera';
      } else if (this.mapMode === 'camera') {
        if (!value.child) {
          // const proj = this.ProjectMarkers.find(p => { return p.id === value.value })
          this.currentCamera = null;
          this.currentSubSite = null;
          this.mapMode = 'project';
        } else {
          this.currentCamera = null;
          this.currentSubSite = value.child[0];
        }
      }
    },
    setCurrent(value) {
      // 判斷顯示層級，帶入樣站或相機
      if (this.mapMode === 'camera') {
        this.currentCamera = value;
        this.currentCamera.icon = !value.error ? IconSelect : ErrorIconSelect;
        this.mapInfo.center = window._.clone(this.currentCamera.marker);
        setTimeout(() => {
          this.loadBarChart();
        }, 200);
      }

      if (this.mapMode === 'project') {
        this.currentSite = this.sites.find(item => {
          return item.value === value.site;
        });
      }
    },
    setSiteMarker() {
      const currentSiteLabel = this.currentSite.label;
      const currentSubSiteLabel = this.currentSubSite
        ? this.currentSubSite.label
        : 'NULL';
      this.SiteMarkers = this.currentProject.cameraLocations.reduce(
        (accumulator, currentValue) => {
          if (
            currentValue.site === currentSiteLabel &&
            currentValue.subSite === currentSubSiteLabel
          ) {
            const retrievedStatus = Array(12).fill(0);
            const cameraAbnormalStatus = Array(12).fill(0);
            const identifiedStatus = Array(12).fill(0);

            this.locationRetrievedStatus.forEach(status => {
              if (status.cameraLocation === currentValue.cameraLocation) {
                status.monthly_num.forEach(value => {
                  retrievedStatus[value.month - 1] += value.num;
                });
              }
            });
            this.locationCameraAbnormalStatus.forEach(status => {
              if (status.cameraLocation === currentValue.cameraLocation) {
                // AbnormalStatus have different response format, only record error month without error number
                status.month.forEach(month_num => {
                  cameraAbnormalStatus[month_num - 1] = 1; // 0: with error, 1: without error
                });
              }
            });
            this.locationIdentifiedStatus.forEach(status => {
              if (status.cameraLocation === currentValue.cameraLocation) {
                status.monthly_num.forEach(value => {
                  identifiedStatus[value.month - 1] += value.num;
                });
              }
            });

            accumulator.push({
              name: currentValue.cameraLocation,
              marker: L.latLng(
                currentValue.wgs84dec_y,
                currentValue.wgs84dec_x,
              ),
              ...currentValue,
              retrievedStatus,
              cameraAbnormalStatus,
              identifiedStatus,
            });
          }
          return accumulator;
        },
        [],
      );
    },
    countPercentage(idx, array) {
      let total = 0;
      let current = 0;

      array.forEach((r, i) => {
        total += r.y;
        if (i === idx) current = r.y;
      });

      return (100 * (current / total)).toFixed(1);
    },
    // 更新圖表
    loadBarChart() {
      const BarChartData = {
        name: '每月影像筆數',
        data: this.currentCamera.retrievedStatus.reduce((array, value, i) => {
          array.push({
            name: i + 1 + '月',
            y: value,
            hasError: this.currentCameraAdnormalMonth.includes(i + 1),
          });
          return array;
        }, []),
      };
      const barCharts = this.$refs.barCharts;
      barCharts.removeSeries();
      barCharts.addSeries(BarChartData);
    },
    loadPieChart(val) {
      const chartData = [];
      if (!val.length || this.pieChartRendering) return;
      this.species.forEach((v, i) => {
        if (i > 5) {
          if (!chartData[6]) chartData[6] = { name: '其他', y: 0 };
          else chartData[6].y += v.y;
        } else chartData.push(v);
      });
      const pieCharts = this.$refs.pieCharts;
      const PieChartOpt = {
        type: 'pie',
        name: 'speices',
        size: '80%',
        innerSize: '50%',
        data: chartData,
      };
      pieCharts.addSeries(PieChartOpt);
      this.pieChartRendering = true;
    },
    // 切換顯示年份
    changeDuration(count) {
      if (this.currentDuration === this.today.year() && count > 0) {
        return;
      }
      this.currentDuration += count;
      // get New Data
      this.fetchImageStatus();
    },
    // 根據層級切換地圖顯示大小
    renderMap() {
      // if (this.ProjectMarkers.length === 0) return
      if (this.mapMode === 'project') {
        this.mapInfo.zoom = 9;
        this.mapInfo.marker = this.ProjectMarkers;
      }

      if (this.mapMode === 'camera') {
        this.setSiteMarker();
        this.mapInfo.zoom = 15;
        this.mapInfo.marker = this.SiteMarkers.map(val =>
          // 設定地圖要顯示的 Icon
          ({
            ...val,
            icon: val.error > 0 ? ErrorIconSelect : IconSelect,
          }),
        );
      }
      if (this.mapInfo.marker.length) {
        this.mapInfo.center = window._.clone(this.mapInfo.marker[0].marker);
      }
    },
    // 取得林地範圍
    // 判斷是否重送 api
    shouldReloadForestBoundary() {
      if (!this.mapInfo || !this.mapInfo.center) {
        return false;
      }
      if (this.mapInfo.zoom < 9) {
        // console.log('zoom < 9');
        return false;
      }
      const { lat, lng } = this.mapInfo.center;
      const { decimalLatitude, decimalLongitude } = this.getForestBoundaryParam;
      if (
        Math.abs(lat - decimalLatitude) < 0.05 ||
        Math.abs(lng - decimalLongitude) < 0.05
      ) {
        // console.log(
        //   'move range below 0.05',
        //   lat - decimalLatitude,
        //   lng - decimalLongitude,
        // );
        return false;
      }
      this.getForestBoundaryParam = {
        decimalLatitude: lat,
        decimalLongitude: lng,
      };
      return true;
    },
    // call api
    loadForestBoundaryByMapCenter() {
      if (this.shouldReloadForestBoundary()) {
        const {
          decimalLatitude,
          decimalLongitude,
        } = this.getForestBoundaryParam;
        this.loadForestBoundary({
          decimalLatitude,
          decimalLongitude,
        });
      }
    },
    // 移動 map 時 call api
    centerUpdated() {
      this.loadForestBoundaryByMapCenter();
    },
    zoomUpdated(e) {
      this.mapInfo.zoom = e;
    },
  },
  mounted() {
    this.setCurrentProject(this.$route.params.id);
    this.loadForestBoundaryByMapCenter();
  },
};
</script>
