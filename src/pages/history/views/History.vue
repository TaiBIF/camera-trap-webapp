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
      <tbody
        v-for="(group, gid) in history"
        :key="`tgroup-${gid}`"
      >
        <tr>
          <td colspan="7">
            {{group.name}}
          </td>
        </tr>
        <tr
          v-for="(row, rid) in group.list"
          :key="`trow-${gid}-${rid}`"
        >
          <td>{{row.createdAt}}</td>
          <td>
            <span
              class="icon"
              v-if="row.type==='jpg'"
            >
              <i class="icon-photo"></i>
            </span>
            <span
              class="icon"
              v-if="row.type==='csv'"
            >
              <i class="icon-csv"></i>
            </span>
            <span
              class="icon"
              v-if="row.type==='zip'"
            >
              <i class="icon-zip"></i>
            </span>
            <span
              class="icon"
              v-if="row.type==='folder'"
            >
              <i class="icon-folder"></i>
            </span>
            <span class="text">{{row.fileName}}</span>
          </td>
          <td>{{row.project}}</td>
          <td>{{row.site}}-{{row.subsite}}</td>
          <td>{{row.camera}}</td>
          <td class="text-right">
            <div
              v-if="row.status=='SUCCESS'"
              class="float-left"
            >
              <span class="icon"><i class="icon-upload-success"></i></span>
              <span class="text">上傳成功</span>
            </div>
            <div
              v-if="row.status=='ERROR'"
              class="float-left"
            >
              <span class="icon"><i class="icon-upload-fail"></i></span>
              <span class="text">{{row.msg}}</span>
            </div>

            <a
              href="/upload.html"
              v-if="row.status=='ERROR'"
              class="link text-underline mr-2"
            >
              補上傳影像檔
            </a>
            <a
              v-if="row.status=='SUCCESS'"
              class="link text-underline"
            >
              查看
            </a>
            <a
              v-if="row.status=='ERROR'"
              class="text-danger text-underline"
            >
              檢視錯誤
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { commonMixin } from '../../../mixins/common.js';

const uploadSession = createNamespacedHelpers('uploadSession');

export default {
  name: 'History',
  mixins: [commonMixin],
  data() {
    return {};
  },
  mounted() {
    this.getUploadHistory();
  },
  computed: {
    ...uploadSession.mapGetters(['history']),
  },
  methods: {
    ...uploadSession.mapActions(['getUploadHistory']),
  },
};
</script>
