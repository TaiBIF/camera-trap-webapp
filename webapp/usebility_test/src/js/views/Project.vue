<template>
  <div class="page-project py-2 px-4">
    <div class="container-fluid py-3">
      <div class="row mb-2">
        <div class="col-7">
          <div class="card project">
            <div class="card-body">
              <div class="row">
                <div class="col-7">
                  <h3 class="title">新竹狂犬病監測</h3>
                </div>
                <div class="col-5 text-right">
                  <button class="btn btn-outline-success float-right"><i class="icon icon-pencil"></i> 專案管理</button>
                </div>
              </div>
              
              <ul class="project-info">
                <li>
                  <span class="text-muted">狀態</span> 進行中
                </li>
                <li>
                  <span class="text-muted">位置</span> 台灣, TW
                </li>
                <li>
                  <span class="text-muted">時間</span> 2015/1/1 - 2020/12/31
                </li>
                <li>
                  <span class="text-muted">成員</span> 
                  CindyGu,James,Joan,Charles Chen, Mai, Chihje K…（<span class="text-muted"><i class="icon icon-user-gray"></i> 15</span>）
                  <a href="#" class="link">+ 加入新成員</a>
                </li>
                <li>
                  <span class="text-muted">範本</span> 
                  <a href="#" class="link">下載範本 <i class="icon icon-download-sm"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="card update">
            <div class="card-body">
              <h5>最近更新</h5>
              <div class="records">
                <div class="item">
                  2018/07/23 下午05:25  James 成功上傳了
                  <router-link to="/project/1/site/11" role="button" class="link d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</router-link>
                </div>
                <div class="item">
                  2018/07/23 下午05:25  CindyGu 成功上傳了
                  <router-link to="/project/1/site/11" role="button" class="link d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</router-link>
                </div>
                <div class="item">
                  2018/07/23 下午05:25  Nelson 上傳失敗
                  <a class="text-muted d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</a>
                </div>
                <div class="item">
                  2018/07/23 下午05:25  Carmen 成功上傳了
                  <router-link to="/project/1/site/11" role="button" class="link d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</router-link>
                </div>
                <div class="item">
                  2018/07/23 下午05:25  James 成功上傳了
                  <router-link to="/project/1/site/11" role="button" class="link d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</router-link>
                </div>
                <div class="item">
                  2018/07/23 下午05:25  James 成功上傳了
                  <router-link to="/project/1/site/11" role="button" class="link d-block">屏東處-潮州站 PT09A  2018/06/01-2018/07/31</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <!-- Map -->
          <div class="card map-card">
            <div class="card-header">
              <div class="row">
                <div class="col-4">
                  <h3>
                    <i class="icon icon-title-camara"></i> 21
                    <small class="float-right text-muted">相機樣站</small>
                  </h3>
                </div>
                <div class="col-4">
                  <h3>
                    <i class="icon icon-title-doc"></i> 321,012
                    <small class="float-right text-muted">監測資料</small>
                  </h3>
                </div>
                <div class="col-4">
                  <h3>
                    <i class="icon icon-title-species"></i> 18
                    <small class="float-right text-muted">已監測物種</small>
                  </h3>
                </div>
              </div>
            </div>
            <div class="card-body map-container">
              <h5 class="mb-2">樣站狀況總覽</h5>
              
              <l-map style="height: 325px" :zoom="mapInfo.zoom" :center="mapInfo.center" :options="mapInfo.options">
                <l-control-zoom :position="'topright'" />
                <l-tile-layer :url="mapInfo.url" :attribution="mapInfo.attribution" />
                <l-marker v-for="(mark,idx) in mapInfo.marker" 
                  :key="`l-circle-${idx}`" 
                  :lat-lng="mark.marker"
                  :title="mark.num"
                  :icon="mark.icon"
                  :draggable="false"
                  :class="`icon pin ${mark.color}`" 
                  @click="showSiteOverview($event, idx)">
                  <!-- <l-popup>
                    {{ mark.num}}
                  </l-popup> -->
                </l-marker>
              </l-map>

              <div class="site-container" 
              v-if="currentSite!==null && popupShow"
              :style="{'left': popupPosition.x+'px', 'top': popupPosition.y+'px'}">
                <div class="text-right">
                  <a @click="closePopup()">&times;</a>
                </div>
                <h3 class="title">
                  <router-link to="/project/1/site/11" class="badge badge-danger float-right" v-if="currentSite.error>0">
                    <i class="icon icon-warning"></i> {{ currentSite.error }} 筆異常資料
                  </router-link>
                  <small>{{ currentSite.bureau }}</small>
                  {{ currentSite.name }}
                </h3>
                <hr>
                <div class="section">
                  <label for="">照片資料回收總數</label>
                  <div>{{ currentSite.takeback }}</div>
                </div>
                <div class="section">
                  <label for="">最新資料時間</label>
                  <div>{{ currentSite.last_update }}</div>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-7">
                  <h6 class="mt-3 mb-3">監測資料數統計</h6>
                  <vue-highcharts :options="areaOptions" ref="lineCharts"></vue-highcharts>
                </div>
                <div class="col-5">
                  <h6 class="mt-3 mb-3">物種比例</h6>
                  <vue-highcharts :options="pieOption" ref="pieCharts"></vue-highcharts>
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
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
import { LMap, LTileLayer, LMarker, LPolyline, LLayerGroup, LTooltip, LPopup, LControlZoom, LControlAttribution, LControlScale, LControlLayers } from 'vue2-leaflet';
import Glyph from 'leaflet.icon.glyph';
import VueHighcharts from 'vue2-highcharts'

const Icon = L.icon({
    iconUrl: '../img/common/marker-icon@2x.png',
    iconSize: [51, 83],
    iconAnchor: [26, 55],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

const ErrorIcon = L.icon({
    iconUrl: '../img/common/marker-icon-error@2x.png',
    iconSize: [51, 83],
    iconAnchor: [26, 55],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

const LineChart = {
  name: "row_data",
  data: [
    [Date.UTC(2015, 1, 1), 0],
    [Date.UTC(2015, 4,  6), 4856],
    [Date.UTC(2015, 7, 20), 4602],
    [Date.UTC(2015, 10, 25), 4120],
    [Date.UTC(2016, 1,  4), 5120],
    [Date.UTC(2016, 4, 17), 5001],
    [Date.UTC(2016, 7, 24), 5314],
    [Date.UTC(2016, 10,  4), 5620],
    [Date.UTC(2017, 1,  4), 5890],
    [Date.UTC(2017, 4, 17), 5920],
    [Date.UTC(2017, 7, 24), 6012],
    [Date.UTC(2017, 10,  4), 6240],
    [Date.UTC(2018, 1,  4), 6471],
    [Date.UTC(2018, 4, 17), 6600],
    [Date.UTC(2018, 7, 24), 7123]
  ]
}

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
  data () {
    return {
      popupShow: false,
      popupPosition: {x: 0, y: 0},
      map: null,
      mapInfo: {
        zoom: 13,
        options: {
          zoomControl: false
        },
        center: L.latLng(47.413220, -1.119482),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: [
          { 
            bureau: "新竹處",
            name: '南庄田美村',
            takeback: 2250,
            num: 106,
            last_update: '2017/05/23 15:22',
            error: 5,
            icon: ErrorIcon,
            marker: L.latLng(47.403220, -1.129482), radius: 400, color: 'green'
          },
          { 
            bureau: "新竹處",
            name: '南庄 30 林班',
            takeback: 5250,
            num: 20,
            last_update: '2017/05/23 15:22',
            error: 0,
            icon: Icon,
            marker: L.latLng(47.413220, -1.119482), radius: 400, color: 'red'
          }
        ]
      },
      currentSiteIdx: 0,
      currentSite: null,
      pieOption: {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 300
        },
        colors: ['#D7DF21', '#8CC73F', '#00A650', '#006838', '#00A69D', '#BCBEC0'],
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
          pointFormatter: function(){
            return `<span style="color:#FFF">${this.y}監測捕獲數</span>`
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
              enabled: true,
              colors: ['#D7DF21', '#8CC73F', '#00A650', '#006838', '#00A69D', '#BCBEC0'],
              formatter: function() {
                return `
                  <span style="color: ${this.color}; font-size: 13px;">${this.key}</span><br/>
                  <span style="color: ${this.color}; font-size: 13px;">${(this.percentage).toFixed(1)} %</span>
                `;
              },
              connectorColor: '#9B9B9B'
            }
          }
        },
        series: null
      },
      areaOptions: {
        chart: { 
          type: 'area',
          backgroundColor: 'transparent',
          height: 200
        },
        title: {
          enable: false,
          text: ''
        },
        subtitle: {
          enable: false,
          text: ''
        },
        xAxis: {
          title: {
            enable:false,
            text: '',
          },
          type: 'datetime',
          crosshair: {
            enable: true,
            dashStyle: 'Solid',
            color: '#2A7F60'
          },
          labels: {
            formatter: function() {
              let dt = new Date(this.value)
              return `${dt.getFullYear()}/${dt.getMonth()+1}/${dt.getDate()}`;
            }
          },
        },
        yAxis: {
          title: {
            enable:false,
            text: ' '
          },
          labels: {
            format: '{value}'
          },
          min: 0
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(70,70,70,.8)',
          pointFormatter: function(){
            let dt = new Date(this.x);
            return `<span style="color:#FFF">${dt.getFullYear()}/${dt.getMonth()+1}/${dt.getDate()}<br/><h5 style="font-size: 16px;">${this.y}<small style="font-size: 11px;">筆監測資料</small></h5></span>`
          },
          style: {
            color: "#FFF"
          }
        },
        plotOptions: {
          area: { 
            marker: {
              radius: 1,
              lineColor: '#2A7F60',
              lineWidth: 1,
              states: {
                hover: {
                  fillColor: '#FFF',
                  lineColor: '#8AC731',
                  lineWidth: 3
                }
              }
            }
          },
          series: {
            lineColor: '#2A7F60',
            fillColor: 'rgb(224, 237, 228, .37)'
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
    VueHighcharts
  },
  computed: {
    ...mapGetters(['Projects', 'currentProject'])
  },
  methods: {
    ...mapActions(['getProjects', 'setCurrentProject']),
    showSiteOverview(evt, idx) {
      let e = evt.originalEvent;
      
      this.popupPosition.x = e.layerX;
      this.popupPosition.y = e.layerY;
      this.currentSite = this.mapInfo.marker[idx];
      this.popupShow = (this.currentSiteIdx==idx) ? !this.popupShow : true;

      this.currentSiteIdx = idx
    },
    closePopup() {
      this.popupShow = false;
    },
    loadLineChart() {
      let lineCharts = this.$refs.lineCharts;
      lineCharts.addSeries(LineChart);
    },
    loadPieChart() {
      let pieCharts = this.$refs.pieCharts;
      pieCharts.addSeries(PieChart);
    }
  },
  mounted () {
    this.currentSite = this.mapInfo.marker[0]
    // this.$nextTick(() => {
    //   this.map = this.$refs.map.mapObject // work as expected
    // })
    this.loadLineChart()
    this.loadPieChart()
  }
}
</script>
