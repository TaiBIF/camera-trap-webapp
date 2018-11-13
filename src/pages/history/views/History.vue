<template>
  <div class="container">
    <h1 class="text-green">上傳紀錄</h1>
    <table class="table history">
      <thead>
        <tr>
          <th width="180px">上傳時間</th>
          <th>檔案名稱</th>
          <th width="120px">所屬計畫</th>
          <th>樣區</th>
          <th>相機位置</th>
          <th>上傳結果</th>
        </tr>
      </thead>
      <tbody v-for="(group, gid) in history" :key="`tgroup-${gid}`">
        <tr>
          <td colspan="7">
            {{group.name}}
          </td>
        </tr>
        <tr v-for="(row, rid) in group.list" :key="`trow-${gid}-${rid}`">
          <td>{{row.created_at}}</td>
          <td>
            <span class="icon" v-if="row.type==='jpg'"><i class="icon-photo"></i></span>
            <span class="icon" v-if="row.type==='csv'"><i class="icon-csv"></i></span>
            <span class="icon" v-if="row.type==='zip'"><i class="icon-zip"></i></span>
            <span class="icon" v-if="row.type==='folder'"><i class="icon-folder"></i></span>
            <span class="text">{{row.name}}</span>
          </td>
          <td>{{row.project}}</td>
          <td>{{row.site}}-{{row.subsite}}</td>
          <td>{{row.camera}}</td>
          <td class="text-right">
            <div v-if="row.status==2" class="float-left">
              <span class="icon"><i class="icon-upload-success"></i></span>
              <span class="text">上傳成功</span>
            </div>
            <div v-if="row.status==-1" class="float-left">
              <span class="icon"><i class="icon-upload-fail"></i></span>
              <span class="text">{{row.msg}}</span>
            </div>

            <a href="./upload.html" v-if="row.status==2" class="link text-underline mr-2">補上傳影像檔</a>
            <a v-if="row.status==2" class="link text-underline">查看</a>
            <a v-if="row.status==-1" class="text-danger text-underline">檢視錯誤</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { commonMixin } from '../../../mixins/common.js'

const history = [
  {
    name: '今天',
    list: [
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'jpg',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      },
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'csv',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      },
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'zip',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: -1,
        msg: '上傳失敗，格式錯誤'
      },
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'folder',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      }
    ]
  },
  {
    name: '昨天',
    list: [
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'folder',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      },
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'csv',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      }
    ]
  },
  {
    name: '7 天前',
    list: [
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'csv',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      },
      {
        created_at: '2017/07/08 17:23',
        project: '全島鼬獾',
        name: 'PT12A-151129-1051223',
        type: 'jpg',
        size: '240 KB',
        site: '屏東處',
        subsite: '潮州站',
        camera: 'PT01A',
        status: 2,
        msg: ''
      }
    ]
  }
]

export default {
  name: 'History',
  mixins: [commonMixin],
  data () {
    return {
      history: history
    }
  },
  methods: {
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>
