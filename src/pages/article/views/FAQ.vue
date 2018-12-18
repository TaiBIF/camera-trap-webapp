<template>
  <div class="container">
    <div class="row">
      <div class="col-2">
        <h1 class="text-green">常見問題</h1>
        <!-- 判斷 current tab -->
        <ul class="contact-list">
          <li
            :class="current==0 ? 'active' : ''"
            @click="current=0"
          >
            <a>系統操作</a>
          </li>
          <li
            :class="current==1 ? 'active' : ''"
            @click="current=1"
          >
            <a>帳號相關</a>
          </li>
          <li
            :class="current==2 ? 'active' : ''"
            @click="current=2"
          >
            <a>計畫管理</a>
          </li>
          <!--
          <li
            :class="current==3 ? 'active' : ''"
            @click="current=3"
          >
            <a>檔案上傳</a>
          </li>
          <li
            :class="current==4 ? 'active' : ''"
            @click="current=4"
          >
            <a>資料編輯</a>
          </li>
          <li
            :class="current==5 ? 'active' : ''"
            @click="current=5"
          >
            <a>篩選及下載</a>
          </li>
          -->
        </ul>
        <div class="action text-center">
          <div class="mb-2"><small class="text-gray">仍需要協助嗎？</small></div>
          <router-link
            to="/contact"
            class="btn btn-default"
          >
            聯絡我們
          </router-link>
        </div>
      </div>
      <div class="col-10">
        <div class="panel panel-default mt-3">
          <div class="panel-heading">
            <h4>{{ faqList[current].name }}</h4>
          </div>
          <div class="panel-body p-0">
            <div class="accordion">
              <!-- Render QA list -->
              <div
                class="accordion-item"
                v-for="(accord, idx) in faqList[current].list"
                :key="`accord-${idx}`"
                :class="collapse==idx ? 'is-open' : ''"
              >
                <!-- Toggle collapse -->
                <div
                  class="accordion-heading"
                  @click="collapse= collapse==idx ? null : idx"
                >
                  <div class="icon">
                    <i class="icon-chevron-down"></i>
                  </div>
                  <h5>{{accord.title}}</h5>
                </div>
                <div
                  class="accordion-body"
                  v-html="accord.content"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// FAQ 架構
const faq = [
  {
    name: '系統操作',
    list: [
      {
        title: '計畫管理員的權限？',
        content: '<p>相當於計畫主持人</p>',
      },
      /*
      {
        title: '如何更改權限？',
        content: '',
      },
      {
        title: '如何更改帳號設定？',
        content: '',
      },
      */
      {
        title: '為何無法順利登入？',
        content:
          '<p>可能原因：<br/> 瀏覽器不支援，請使用Google Chrome 或 Firefox。<br/> 瀏覽器版本未更新至最新版。</p>',
      },
    ],
  },
  {
    name: '帳號相關',
    list: [
      {
        title: '有那幾種登入方式？',
        content:
          '本平台僅能透過 ORCiD 帳號進行登入，若尚未註冊請先至 ORCiD 官網申請帳號。ORCiD 可使用 Google 或 FaceBook 認證。',
      },
    ],
  },
  {
    name: '計畫管理',
    list: [
      {
        title: '新增計畫需要填寫哪些基本資訊？',
        content:
          '下列為必填之選項，可於新增計畫前先行檢視：<br/> 計畫名稱<br/> 計畫簡稱 (限4字)<br/> 委辦單位<br/> 計畫編號<br/> 主持人<br/> 計畫執行時間<br/> 創用CC授權許可 (分別針對詮釋資料、鑑定資訊、影像資料作授權，了解創用 CC 授權內容)<br/>計畫資料公開日期',
      },
    ],
  },
  /*
  {
    name: '檔案上傳',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  {
    name: '資料編輯',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  {
    name: '篩選及下載',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  */
];

export default {
  name: 'FAQ',
  data() {
    return {
      current: 0,
      collapse: 0,
      faqList: faq,
    };
  },
  watch: {
    current: 'changeSection',
  },
  methods: {
    changeSection() {
      this.collapse = 0;
    },
  },
};
</script>
