<template>
  <div class="page-index pt-5">
    <div class="container">
      <div class="row mb-3">
        <div class="col-8">
          <div class="dropdown">
            <a class="btn btn-link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              依建立時間排序
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">依建立時間排序（新→舊）</a>
              <a class="dropdown-item" href="#">依更新時間排序（新→舊）</a>
              <a class="dropdown-item" href="#">依專案名筆畫稱排序</a>
            </div>
          </div>
        </div>
        <div class="col-4 text-right">
          <a class="btn btn-warning">新增專案</a>
        </div>
      </div>
      <div class="row">
        <div class="col-4" v-for="proj in allProjects" :key="`project-${proj.id}`">
          <router-link :to="`project/${proj.id}`" class="card">
            <img :src="'//picsum.photos/373/180'" class="card-img-top">
            <div class="card-body">
              <div class="badge member"><i class="icon icon-user"></i> {{ proj.members }}</div>
              <div class="badge error" v-if="proj.errors>0"><i class="icon icon-warning"></i> {{ proj.errors }}筆資料異常</div>
              <h5 class="card-title">{{proj.name}}</h5>
              <div class="row extra">
                <div class="col-4 text-center px-1">
                  <h6 class="text-green">{{proj.sites}}</h6>
                  <small class="text-muted">本月已更新資料</small>
                </div>
                <div class="col-4 text-center px-1">
                  <h6 class="text-green">{{proj.update_rows | currency}}</h6>
                  <small class="text-muted">近一週上傳筆數</small>
                </div>
                <div class="col-4 text-center px-1">
                  <h6 class="text-green">{{proj.updated_at}}</h6>
                  <small class="text-muted">最近上傳時間</small>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Index',
  filters: {
    currency: (value) =>{
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  },
  data() {
    return {
      archiveProjects: [
        {
          id: 1,
          name: '新竹狂犬病監測',
          errors: 5,
          sites: 8,
          members: 17,
          update_rows: 215012,
          updated_at: '2018/08/31'
        },
        {
          id: 2,
          name: '關山野生動物重要棲息環境...',
          errors: 5,
          sites: 5,
          members: 17,
          update_rows: 215012,
          updated_at: '2018/08/31'
        }
      ],
      allProjects: [
        {
          id: 1,
          name: '新竹狂犬病監測',
          errors: 5,
          sites: 11,
          members: 17,
          update_rows: 215012,
          updated_at: '2018/08/31'
        },
        {
          id: 2,
          name: '關山野生動物重要棲息環境...',
          errors: 5,
          members: 17,
          sites: 9,
          update_rows: 215012,
          updated_at: '2018/08/31'
        },
        {
          id: 3,
          name: '利嘉野生動物重要棲息環境...',
          errors: 5,
          members: 17,
          sites: 10,
          update_rows: 215012,
          updated_at: '2018/08/31'
        },
        {
          id: 4,
          name: '國家生物多樣性監測與報告',
          errors: 5,
          sites: 9,
          members: 17,
          update_rows: 215012,
          updated_at: '2018/08/31'
        },
        {
          id: 5,
          name: '林務局全島鼬獾監測',
          errors: 5,
          sites: 2,
          members: 17,
          update_rows: 215012,
          updated_at: '2018/08/31'
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'projects', 'currentProject', 'currentRow', 'currentColumn', 'camara', 'table_rows', 'species'
    ])
  },
  methods: {
    ...mapActions([
      'getProject'
    ]),
  },
  beforeMount() {
  }
}
</script>
