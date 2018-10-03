<template>
  <div class="maintain">
    <div class="container">
      <div class="panel panel-project">
        <div class="panel-body">
          <div class="row">
            <div class="col-8">
              <div class="row">
                <div class="col-9">
                  <h1 class="heading mt-0">
                    國家生物多樣性監測與報告系統規劃-陸域
                  </h1>  
                </div>
                <div class="col-3 text-right">
                  <a class="float-right btn btn-green-border btn-sm">
                    <i class="fa fa-pencil-alt mr-2"></i>
                    <span class="text">計畫管理</span>
                  </a>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">委辦單位</div>
                <div class="col-sm-8 col-md-9">林務局</div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">計畫編號</div>
                <div class="col-sm-8 col-md-9">10156331</div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">計畫主持人</div>
                <div class="col-sm-8 col-md-9">黃智賢</div>
              </div>
              <div class="row">
                <div class="col-sm-4 col-md-3 text-gray">計畫時間</div>
                <div class="col-sm-8 col-md-9">2015/01/01 - 2020/12/31</div>
              </div>
            </div>
            <div class="col-4 text-center pt-5 divider">
              <a href="#" class="btn btn-orange">
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
                <div class="col-sm-5 col-md-4" v-if="mapMode=='camera'">
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
                <div class="col-4">
                  <l-map style="height: 325px" :zoom="mapInfo.zoom" :center="mapInfo.center" :options="mapInfo.options">
                    <l-control-zoom :position="'topleft'" />
                    <l-tile-layer :url="mapInfo.url" :attribution="mapInfo.attribution" />
                    <l-layer-group v-if="mapMode=='camera'" :className="'site-container'">
                      <l-marker v-for="(mark,idx) in mapInfo.marker" 
                      :key="`project-marker-${idx}`" 
                      :icon="mark.icon"
                      :title="mark.num"
                      :lat-lng="mark.marker"
                      :draggable="false">
                        <l-tooltip :content="mark.name"
                        :options="{permanent: true, direction: 'top'}"></l-tooltip>
                      </l-marker>
                    </l-layer-group>
                    
                    <l-layer-group v-if="mapMode=='project'">
                      <l-circle v-for="(mark,idx) in mapInfo.marker" 
                      :key="`project-circle-1${idx+1}`" 
                      :lat-lng="mark.marker"
                      :draggable="false"
                      :radius="10000"
                      :color="'green'"
                      :fillColor="'green'"
                      :fillOpacity="1"
                      :strokeColor="'green'"
                      @click="setCurrent({value: mark.id, label: mark.name})">
                        <l-tooltip :content="mark.name"
                        :options="{permanent: true, direction: 'center'}"></l-tooltip>
                      </l-circle>
                    </l-layer-group>

                  </l-map>
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-8">
                      <h3>{{ !currentSubSite ? currentSite.label : currentSubSite.label }}</h3>
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
                        <a class="btn btn-sm btn-default" v-if="mapMode=='camera'">
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
                        <a class="btn btn-sm btn-default" v-if="mapMode=='camera'">
                          相機異常回報 
                        </a>
                        <span @click="changeDuration(-1)"><i class="fa fa-3 fa-caret-left"></i></span>
                        <span class="mx-2">{{ currentDuration }}</span>
                        <span @click="changeDuration(+1)"><i class="fa fa-3 fa-caret-right"></i></span>
                      </div>
                    </div>
                    <site-chart :chart="progressData" :type="'identify'" :current="currentSite.value" @update="setCurrent" />
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
                    本計畫已辨識物種 <big>5</big> 種
                  </h3>
                  <small class="sub-heading text-center text-gray">最後更新時間：2018/08/16</small>
                  <hr>
                  <div class="row">
                    <div class="col-5">
                      <div class="speices-item" 
                      v-for="(sp, sid) in species" 
                      :key="`speices-item-${sid}`" 
                      v-if="sp.name!=='其他'">
                        <span class="circle" :style="{backgroundColor: chartColors[sid]}"></span>
                        <span class="text">{{sp.name}} {{ countPercentage(sid, species)}}%</span>
                      </div>
                    </div>
                    <div class="col-7">
                      <div class="speices-item" 
                      v-for="(sp, sid) in species" 
                      :key="`speices-item-${sid}`" 
                      v-if="sp.name=='其他'">
                        <span class="circle" :style="{backgroundColor: chartColors[sid]}"></span>
                        <span class="text">
                          {{sp.name}} {{ countPercentage(sid, species)}}%
                          <div class="text-gray">
                            <div class="sub-item">鼠 (非單一物種) 1%</div>
                            <div class="sub-item">白鼻心 1%</div>
                            <div class="sub-item">人 1%</div>
                            <div class="sub-item">藍腹鷴 1%</div>
                            <div class="sub-item">食蟹獴 1%</div>
                            <div class="sub-item">狗 0.8%</div>
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
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom, LTooltip, LCircle, LLayerGroup } from 'vue2-leaflet';
import VueHighcharts from 'vue2-highcharts';
import SiteChart from '../components/SiteChart';

const Icon = L.icon({
    iconUrl: '/assets/common/marker-icon@2x.png',
    iconSize: [60, 109],
    iconAnchor: [31, 77],
    popupAnchor: [-3, -76],
    shadowSize: [60, 109],
    shadowAnchor: [31, 77]
});

const ErrorIcon = L.icon({
    iconUrl: '/assets/common/marker-icon-error@2x.png',
    iconSize: [60, 109],
    iconAnchor: [30, 77],
    popupAnchor: [-3, -76],
    shadowSize: [66, 109],
    shadowAnchor: [33, 77]
});

const ProjectMarkers = [
  {
    id: 11,
    name: '羅東處',
    project_id: 1,
    marker: L.latLng(24.604577,121.608599),
    progress: [2,1,-1,-1,-1,-1,-1,-1,-1,0,0,0]
  },
  {
    id: 12,
    name: '新竹處',
    project_id: 1,
    marker: L.latLng(24.753846,121.175827),
    progress: [2,2,1,1,1,2,2,0,0,0,0,0]
  },
  {
    id: 13,
    name: '東勢處',
    project_id: 1,
    marker: L.latLng(24.304081,120.873835),
    progress: [1,1,2,2,2,2,2,0,0,0,0,0]
  },
  {
    id: 14,
    name: '南投處',
    project_id: 1,
    marker: L.latLng(24.349130,121.164845),
    progress: [2,2,1,1,1,2,2,0,0,0,0,0]
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
    marker: L.latLng(47.403220, -1.129482), radius: 400, color: 'green',
    progress: [2,1,-1,-1,-1,-1,-1,-1,-1,0,0,0]
  },
  { 
    id: 11,
    name: 'PT08A',
    takeback: 5250,
    num: 20,
    last_update: '2017/05/23 15:22',
    error: 0,
    icon: Icon,
    marker: L.latLng(47.413220, -1.119482), radius: 400, color: 'red',
    progress: [2,1,-1,-1,-1,-1,-1,-1,-1,0,0,0]
  }
]
const PieChart = {
  name: "speices",
  size: '80%',
  innerSize: '50%',
  data: [
    { name: '山羌', y: 1365 },
    { name: '台灣獼猴', y: 1184 },
    { name: '鼬獾', y: 1085 },
    { name: '水鹿', y: 467 },
    { name: '臺灣黑熊', y: 705 },
    { name: '其他', y: 208 }
  ]
}

export default {
  name: 'Project',
  data() {
    return {
      today: new Date(),
      currentDuration: 2018,
      currentSite: {
        value: 0,
        label: '全部樣區'
      },
      mapMode: "project",
      currentSubSite: null,
      siteStatusTab: 0,
      progressData: ProjectMarkers,
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
      sites: [
        {
          value: 0,
          label: '全部樣區'
        },
        {
          value: 11,
          label: '羅東處',
          child: [
            {
              value: 111,
              label: 'A 站'
            },
            {
              value: 112,
              label: 'B 站'
            },
            {
              value: 113,
              label: 'C 站'
            },
            {
              value: 114,
              label: 'D 站'
            }
          ]
        },
        {
          value: 12,
          label: '新竹處'
        },
        {
          value: 13,
          label: '東勢處'
        },
        {
          value: 14,
          label: '南投處'
        }
      ],
      species: PieChart.data,
      chartColors: ['#5DB897', '#AACAEE', '#7E99E5', '#5569B5', '#CC76BA', '#FFC8EB', '#BDE9A5'],
      currentTab: 0,
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
          pointFormatter: function() {
            return `<span style="color:#FFF">${this.name}：${this.y} 筆辨識紀錄 (${(this.percentage).toFixed(1)}%)</span>`
          },
          style: {
            color: "#FFF"
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
    LMap,
    LTileLayer,
    LControlZoom,
    LMarker, LPopup,
    LCircle, 
    LTooltip,
    SiteChart,
    "v-chart": VueHighcharts,
    LLayerGroup
  },
  watch: {
    "currentSite": "setCamera"
  },
  methods: {
    setCamera(value) {
      if(!value.child==false && value.child.length) {
        this.currentSubSite = value.child[0];
        this.progressData = SiteMarkers
        this.mapMode = 'camera';
      } else {
        this.currentSubSite = null;
        this.progressData = ProjectMarkers
        this.mapMode = 'project';
      }
      
      this.renderMap();
    },
    setCurrent(val) {
      this.currentSite = this.sites.find((s) => { return s.value===val.value })
      console.log(this.currentSite)
      if(this.mapMode=='project') {
        ProjectMarkers.forEach(r => {
          if(r.id===val.value) {
            this.mapInfo.center = L.latLng(r.marker.lat, r.marker.lng)
          }
        })
      }
    },
    countPercentage(idx, array) {
      let total = 0,
          current = 0;

      array.forEach((r, i) => {
        total += r.y
        if(i == idx) current = r.y
      })

      return (100 * (current / total)).toFixed(1);
    },
    loadPieChart() {
      let pieCharts = this.$refs.pieCharts;
      pieCharts.addSeries(PieChart);
    },
    changeDuration(count) {
      if(this.currentDuration==this.today.getFullYear() && count>0) {
        return
      }
      this.currentDuration += count
      // get New Data
    },
    renderMap() {
      if(this.mapMode=='project') {
        this.mapInfo.zoom = 9
        this.mapInfo.marker = ProjectMarkers
        this.mapInfo.center = L.latLng(24.604577,121.608599)
      } else {
        this.mapInfo.zoom = 13
        this.mapInfo.marker = SiteMarkers
        this.mapInfo.center = L.latLng(47.403220, -1.129482)
      }
    }
  },
  mounted() {
    this.renderMap()
    
    this.loadPieChart()
  }
}
</script>
