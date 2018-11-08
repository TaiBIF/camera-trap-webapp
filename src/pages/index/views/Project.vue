<template>
  <div class="maintain" v-if="!!currentProject">
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
                <div class="col-3 text-right">
                  <router-link to="/info/1/edit" class="float-right btn btn-green-border btn-sm">
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
                <div class="col-sm-8 col-md-9">{{currentProject.projectId}}</div>
              </div>
              <div class="row mb-2" v-if="!!currentProject.principalInvestigator">
                <div class="col-sm-4 col-md-3 text-gray">計畫主持人</div>
                <div class="col-sm-8 col-md-9">{{currentProject.principalInvestigator}}</div>
              </div>
              <div class="row" v-if="!!currentProject.projectStartDate && !!currentProject.projectEndDate">
                <div class="col-sm-4 col-md-3 text-gray">計畫時間</div>
                <div class="col-sm-8 col-md-9">{{currentProject.projectStartDate}} - {{currentProject.projectEndDate}}</div>
              </div>
            </div>
            <div class="col-4 text-center pt-5 divider">
              <a href="upload.html#/" class="btn btn-orange">
                <i class="fa fa-upload mr-2"></i>
                <span class="text">檔案上傳</span>
              </a>
              <p class="text-gray">欄位格式請參考 <a class="link text-underline text-green">範本下載</a></p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel tab-panel">
        <div class="panel-header">
          <ul class="nav-tab">
            <li @click="currentTab=0" :class="{'active': currentTab==0}"><a>影像回收/辨識狀況</a></li>
            <li @click="currentTab=1" :class="{'active': currentTab==1}"><a>已辨視物種</a></li>
          </ul>
        </div>
        <div class="panel-body">
          <div class="tab-paen">
            <div class="tab-content" :class="{'active': currentTab==0}">
              <div class="row control-bar">
                <div class="col-sm-5 col-md-4">
                  <div class="form-group row mb-0">
                    <label class="col-5 text-right">
                      樣區：
                    </label>
                    <div class="col-7">
                      <v-select v-model="currentSite" :options="sites"></v-select>
                    </div>
                  </div>
                </div>
                <div class="col-sm-5 col-md-4" v-if="currentSite.child && currentSite.child.length > 0">
                  <div class="form-group row mb-0">
                    <label class="col-5 text-right">
                      子樣區：
                    </label>
                    <div class="col-7">
                      <v-select v-model="currentSubSite" :options="currentSite.child"></v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row map-container">
                <div class="col-5">
                  <l-map style="height: 395px" :zoom="mapInfo.zoom" :center="mapInfo.center" :options="mapInfo.options">
                    <l-control-zoom :position="'topleft'" />
                    <l-tile-layer :url="mapInfo.url" :attribution="mapInfo.attribution" />
                    <l-layer-group v-if="mapMode=='camera'" :className="'site-container'" layer-type="overlay" name="Layer Marker">
                      <!-- 相機樣點座標 -->
                      <l-marker v-for="(mark,idx) in mapInfo.marker"
                      :key="`project-marker-${idx}`"
                      :icon="mark.icon"
                      :title="mark.num"
                      :lat-lng="mark.marker"
                      :draggable="false"
                      @click="setCurrent(mark)">
                        <l-tooltip :content="mark.name"
                        :options="{permanent: true, direction: 'top'}"></l-tooltip>
                      </l-marker>
                    </l-layer-group>

                    <l-layer-group v-if="mapMode=='project'" layer-type="overlay" name="Layer Circle">
                      <!-- 樣站範圍，待實際資料取得後微調 -->
                      <l-circle v-for="(mark,idx) in mapInfo.marker"
                      :key="`project-circle-1${idx+1}`"
                      :lat-lng="mark.marker"
                      :draggable="false"
                      :radius=10000
                      :fillColor="'#2A7F60'"
                      :fillOpacity="1"
                      :color="'rgba(42,127,96,.43)'"
                      @click="setCurrent(mark)">
                        <l-tooltip :content="mark.name"
                        :options="{permanent: true, direction: 'center'}"></l-tooltip>
                      </l-circle>
                    </l-layer-group>

                    <l-layer-group v-if="showWoods" layer-type="overlay" name="Layer polyline">
                      <!-- 林班地座標 -->
                      <l-polygon
                      v-for="item in polygon"
                      :key="item.id"
                      :lat-lngs="item.points"
                      :fillColor="'rgba(255,140,35,.15)'"
                      :stroke="1"
                      :fillOpacity="1"
                      :color="'#FFAF00'" />
                    </l-layer-group>

                  </l-map>
                  <div class="checkbox float-right mt-3     mb-0">
                    <input type="checkbox" name="show-woods" id="show-woods" value="1" v-model="showWoods">
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
                        <a class="btn btn-border-gray"
                        @click="siteStatusTab=0"
                        :class="{'active': siteStatusTab==0}">影像回收狀況</a>
                        <a class="btn btn-border-gray"
                        @click="siteStatusTab=1"
                        :class="{'active': siteStatusTab==1}">影像辨識進度</a>
                      </div>
                    </div>
                  </div>
                  <div v-if="siteStatusTab==0">
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a @click="errorReportOpen=true" class="btn btn-sm btn-default" v-if="mapMode=='camera'">
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <site-chart :chart="progressData" v-if="mapMode=='project'" :current="currentSite.value" @update="setCurrent" />
                    <site-chart :chart="progressData" v-if="mapMode=='camera'" :current="currentSubSite.value" @update="setCurrent" />
                  </div>
                  <div v-if="siteStatusTab==1">
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a @click="errorReportOpen=true" class="btn btn-sm btn-default" v-if="mapMode=='camera'">
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <site-chart :chart="progressData" :type="'identify'" :current="currentSite.value" @update="setCurrent" />
                  </div>
                  <div class="camera-chart" v-if="currentCamera!==null">
                    <div class="close" @click="currentCamera=null"><i class="fa fa-times"></i></div>
                    <h1 class="display-heading">
                      {{currentCamera.name}}
                      <small class="text-gray">{{currentSite.label}}-{{currentSubSite.label}}</small>
                    </h1>
                    <div class="text-gray">
                      <div>架設日期：2018/08/17</div>
                      <div>經緯度：X(97)213520, Y(97)2561356</div>
                      <div>海拔：230m</div>
                      <div>植披：闊葉林</div>
                    </div>
                    <div class="row chart-control">
                      <div class="col-12 text-center text-gray">
                        <a @click="errorReportOpen=true" class="btn btn-sm btn-default" v-if="mapMode=='camera'">
                          相機異常回報
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <v-chart :options="barOption" ref="barCharts" />
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-content pt-4" :class="{'active': currentTab==1}">
              <div class="row">
                <div class="col-6 text-center">
                  <h5 class="mt-0">本計畫已辨識物種比例</h5>
                  <small class="sub-heading text-gray">(依據本計畫回收的照片張數計算)</small>
                  <v-chart :options="pieOption" ref="pieCharts" />
                </div>
                <div class="col-6">
                  <h3>
                    本計畫已辨識物種 <big>{{speciesGroup.species_group.length}}</big> 種
                  </h3>
                  <small class="sub-heading text-gray" v-if="speciesGroup.modified">最後更新時間：{{timeFormat(speciesGroup.modified)}}</small>
                  <hr>
                  <div class="row">
                    <div class="col-5">
                      <div class="speices-item"
                      v-for="(sp, sid) in species"
                      :key="`speices-item-${sid}`"
                      v-if="sid<=5">
                        <span class="circle" :style="{backgroundColor: chartColors[sid]}"></span>
                        <span class="text">{{sp.name}} {{ countPercentage(sid, species)}}%</span>
                      </div>
                    </div>
                    <div class="col-7">
                      <div class="speices-item">
                        <span class="circle" :style="{backgroundColor: chartColors[6]}"></span>
                        <span class="text">
                          其他
                          <div class="text-gray"
                          v-for="(sp, sid) in species"
                          :key="`speices-item-${sid}`"
                          v-if="sid>5">
                            <div class="sub-item">{{sp.name}} {{ countPercentage(sid, species)}}%</div>
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
    <report-modal :open="errorReportOpen" @close="errorReportOpen=false" @submit="submitReport" />
  </div>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom, LTooltip, LCircle, LLayerGroup, LPolygon } from 'vue2-leaflet'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import VueHighcharts from 'vue2-highcharts'
import SiteChart from '../components/SiteChart'
import ReportModal from '../components/ReportModal'

const project = createNamespacedHelpers('project')

// 設定未選擇/已選擇 Icon
const Icon = L.icon({
  iconUrl: '/assets/common/marker-icon@2x.png',
  iconSize: [60, 109],
  iconAnchor: [31, 77],
  popupAnchor: [-3, -76],
  shadowSize: [60, 109],
  shadowAnchor: [31, 77]
})

const IconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [33, 80],
  popupAnchor: [-3, -76],
  shadowSize: [66, 120],
  shadowAnchor: [31, 77]
})

const ErrorIcon = L.icon({
  iconUrl: '/assets/common/marker-icon-error@2x.png',
  iconSize: [60, 109],
  iconAnchor: [30, 77],
  popupAnchor: [-3, -76],
  shadowSize: [66, 109],
  shadowAnchor: [33, 77]
})

const ErrorIconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-error-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [30, 80],
  popupAnchor: [-3, -80],
  shadowSize: [66, 120],
  shadowAnchor: [33, 80]
})

const ProjectMarkers = [
  {
    id: 1,
    name: '羅東處',
    project_id: 1,
    marker: L.latLng(24.604577, 121.608599),
    // 每月進度，透過 API 取得月份狀態 0: 無資料，1:未完成，2:已完成， -1: 已取消
    progress: [2, 1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0]
  },
  {
    id: 2,
    name: '新竹處',
    project_id: 1,
    marker: L.latLng(24.753846, 121.175827),
    children: [],
    progress: [2, 2, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0]
  },
  {
    id: 3,
    name: '東勢處',
    project_id: 1,
    marker: L.latLng(24.304081, 120.873835),
    progress: [1, 1, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0]
  },
  {
    id: 4,
    name: '南投處',
    project_id: 1,
    marker: L.latLng(24.349130, 121.164845),
    progress: [2, 2, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0]
  }
]

const SiteMarkers = [
  {
    id: 11,
    name: 'PT07A',
    takeback: 2250,
    num: 106,
    last_update: '2017/05/23 15:22',
    error: 5,
    icon: ErrorIcon,
    marker: L.latLng(24.611081, 121.605761), color: 'green',
    progress: [2, 1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0]
  },
  {
    id: 12,
    name: 'PT08A',
    takeback: 5250,
    num: 20,
    last_update: '2017/05/23 15:22',
    error: 0,
    icon: Icon,
    marker: L.latLng(24.607959, 121.601986), color: 'red',
    progress: [2, 1, 0, 0, 2, -1, -1, -1, -1, 0, 0, 0]
  },
  {
    id: 13,
    name: 'PT09A',
    takeback: 2250,
    num: 106,
    last_update: '2017/05/23 15:22',
    error: 5,
    icon: ErrorIcon,
    marker: L.latLng(24.607023, 121.603960), color: 'green',
    progress: [2, 1, 2, -1, -1, -1, -1, -1, -1, 0, 0, 0]
  },
  {
    id: 14,
    name: 'PT10A',
    takeback: 5250,
    num: 20,
    last_update: '2017/05/23 15:22',
    error: 0,
    icon: Icon,
    marker: L.latLng(24.611939, 121.607220), color: 'red',
    progress: [2, 1, 1, 1, -1, -1, -1, -1, -1, 0, 0, 0]
  }
]

const BarChart = {
  name: '每月影像筆數',
  data: [
    { name: '1月', y: 1365, updated_at: '2018/01/26', error: 0 },
    { name: '2月', y: 1184, updated_at: '2018/02/26', error: 1 },
    { name: '3月', y: 1085, updated_at: '2018/05/26', error: 0 },
    { name: '4月', y: 467, updated_at: '2018/06/26', error: 1 },
    { name: '5月', y: 705, updated_at: '2018/07/26', error: 0 },
    { name: '6月', y: 208, updated_at: '2018/08/26', error: 3 },
    { name: '1月', y: 0, updated_at: '', error: 0 },
    { name: '8月', y: 0, updated_at: '', error: 0 },
    { name: '9月', y: 0, updated_at: '', error: 0 },
    { name: '10月', y: 0, updated_at: '', error: 0 },
    { name: '11月', y: 0, updated_at: '', error: 0 },
    { name: '12月', y: 0, updated_at: '', error: 0 }
  ]
}

export default {
  name: 'Project',
  data () {
    return {
      today: moment(),
      currentDuration: 2018, // 紀錄目前顯示的年份
      currentSite: {  // 紀錄目前顯示的樣站，格式需轉成 vue-select 的格式
        value: 0,
        label: '全部樣區'
      },
      currentSubSite: null,  // 紀錄目前顯示的子樣站
      currentCamera: null, // 紀錄目前顯示的相機
      errorReportOpen: false,
      pieChartRendering: false,
      mapMode: 'project',  // 目前顯示的圖表層級
      siteStatusTab: 0, // 資料格式
      progressData: ProjectMarkers, // 取得每月繳交資訊
      showWoods: false, // 是否顯示林班地
      polygon: [  // 林班地資料示意
        { id: 'p1',
          points: [
            { lat: 24.604577, lng: 121.608599 },
            { lat: 24.753846, lng: 121.175827 },
            { lat: 24.349130, lng: 121.164845 }
          ],
          visible: true }
      ],
      mapInfo: {
        zoom: 11,
        options: {
          zoomControl: false
        },
        center: L.latLng(25.039202, 121.819413),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: []
      },
      // 共用圖表顏色
      chartColors: ['#5DB897', '#AACAEE', '#7E99E5', '#5569B5', '#CC76BA', '#FFC8EB', '#BDE9A5'],
      currentTab: 0,
      // 長條圖設定
      barOption: {
        chart: {
          type: 'column',
          height: 230
        },
        colors: ['#8ACFCB'],
        title: {
          enable: false,
          text: ''
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          useHTML: true,
          pointFormatter: function () {
            // 顯示錯誤數
            return `
              <div>
                <span class="red label float-right ${this.error === 0 ? 'd-none' : 'd-inline-block'}">${this.error}筆異常</span>
                <h5 class="my-1">${this.y} <small>筆</small></h5>
              </div>
              <div class="text-gray">上傳時間：${this.updated_at}</div>
            `
          },
          style: {
            color: '#FFF'
          }
        },
        plotOptions: {
          column: {
            states: {
              hover: {
                color: '#09968F'
              }
            }
          }
        },
        xAxis: {
          categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '9月', '9月', '10月', '11月', '12月']
        },
        series: null
      },
      // 圓餅圖設定
      pieOption: {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 340
        },
        colors: ['#5DB897', '#AACAEE', '#7E99E5', '#5569B5', '#CC76BA', '#FFC8EB', '#BDE9A5'],
        title: {
          enable: false,
          text: ''
        },
        subtitle: {
          enable: false,
          text: ''
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(70,70,70,.8)',
          pointFormatter: function () {
            return `<span style="color:#FFF">${this.name}：${this.y} 筆辨識紀錄 (${(this.percentage).toFixed(1)}%)</span>`
          },
          style: {
            color: '#FFF'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            }
          }
        },
        series: null
      }
    }
  },
  components: {
    LMap, LTileLayer, LControlZoom, LMarker, LPopup, LPolygon, LCircle, LTooltip, LLayerGroup,
    SiteChart,
    'v-chart': VueHighcharts,
    ReportModal
  },
  watch: {
    currentProject: function (newValue) {
      setTimeout(() => {
        this.renderMap()
        this.getSpeciesGroup()
        this.fetchImageStatus()
      }, 100)
    },
    currentSite: function (newValue) {
      setTimeout(() => {
        this.setCamera(newValue)
        this.fetchImageStatus()
      }, 100)
    },
    currentDuration: function (newValue) {
      setTimeout(() => {
        this.setCamera(newValue)
        this.fetchImageStatus()
      }, 100)
    },
    'species': 'loadPieChart'
  },
  computed: {
    ...project.mapState(['speciesGroup']),
    ...project.mapGetters([
      'currentProject',
      'cameraLocations',
      'species',
      'sites'
    ])
  },
  methods: {
    ...project.mapMutations([
      'setCurrentProject'
    ]),
    ...project.mapActions([
      'getSpeciesGroup',
      'getLocationIdentifiedStatus',
      'getLocationRetrievedStatus',
      'getLocationCameraAbnormalStatus'
    ]),
    fetchImageStatus () {
      const payload = {
        year: this.currentDuration,
        site: this.currentSite.label
      }

      this.getLocationIdentifiedStatus(payload)
      this.getLocationRetrievedStatus(payload)
      this.getLocationCameraAbnormalStatus(payload)
    },
    timeFormat (time) {
      return moment(time * 1000).format('YYYY/MM/DD')
    },
    submitReport () {
      // send error data
    },
    setCamera (value) {
      // 判斷顯示層級，帶入樣站或相機
      if (this.mapMode === 'project') {
        if (!value.child === false && value.child.length) {
          this.currentCamera = null
          this.currentSubSite = value.child[0]
          this.progressData = SiteMarkers
          // 設定地圖要顯示的 Icon
          SiteMarkers[0].icon = SiteMarkers[0].error > 0 ? IconSelect : ErrorIconSelect
          this.mapInfo.center = window._.clone(SiteMarkers[0].marker)
          this.mapMode = 'camera'
        } else {
          this.currentCamera = null
          this.currentSubSite = null
          this.progressData = ProjectMarkers
          this.mapMode = 'project'
        }
        this.renderMap()
      }

      if (this.mapMode === 'camera') {
        if (!value.child) {
          const proj = ProjectMarkers.find(p => { return p.id === value.value })
          this.currentCamera = null
          this.currentSubSite = null
          this.progressData = ProjectMarkers
          this.mapMode = 'project'
          this.renderMap()
          setTimeout(() => {
            this.mapInfo.center = window._.clone(proj.marker)
          }, 100)
        }
      }
    },
    setCurrent (val) {
      // 判斷顯示層級，帶入樣站或相機
      if (this.mapMode === 'camera') {
        SiteMarkers.forEach(site => {
          site.icon = site.error ? ErrorIcon : Icon
        })

        this.currentCamera = val
        this.currentCamera.icon = val.error ? ErrorIconSelect : IconSelect
        this.mapInfo.center = window._.clone(this.currentCamera.marker)
        setTimeout(() => { this.loadBarChart() }, 200)
      }

      if (this.mapMode === 'project') {
        this.currentSite = this.sites.find((s) => { return s.value === val.id })
        setTimeout(() => {
          this.mapInfo.center = window._.clone(val.marker)
        }, 50)
      }
    },
    countPercentage (idx, array) {
      let total = 0
      let current = 0

      array.forEach((r, i) => {
        total += r.y
        if (i === idx) current = r.y
      })

      return (100 * (current / total)).toFixed(1)
    },
    // 更新圖表
    loadBarChart () {
      const barCharts = this.$refs.barCharts
      barCharts.removeSeries()
      barCharts.addSeries(BarChart)
    },
    loadPieChart (val, val2) {
      if (!val.length || this.pieChartRendering) return
      var data = []
      this.species.forEach((v, i) => {
        if (i > 5) {
          if (!data[6]) data[6] = { name: '其他', y: 0 }
          else data[6].y += v.y
        } else data.push(v)
      })
      const pieCharts = this.$refs.pieCharts
      const PieChartOpt = {
        type: 'pie',
        name: 'speices',
        size: '80%',
        innerSize: '50%',
        data: data
      }
      pieCharts.addSeries(PieChartOpt)
      this.pieChartRendering = true
    },
    // 切換顯示年份
    changeDuration (count) {
      if (this.currentDuration === this.today.year() && count > 0) {
        return
      }
      this.currentDuration += count
      // get New Data
    },
    // 根據層級切換地圖顯示大小
    renderMap () {
      if (this.mapMode === 'project') {
        this.mapInfo.zoom = 9
        this.mapInfo.marker = ProjectMarkers
        this.mapInfo.center = window._.clone(ProjectMarkers[0].marker)
      }
      if (this.mapMode === 'camera') {
        this.mapInfo.zoom = 15
        this.mapInfo.marker = SiteMarkers
        this.mapInfo.center = window._.clone(SiteMarkers[0].marker)
      }
    }
  },
  mounted () {
    this.setCurrentProject(this.$route.params.id)
  }
}
</script>
