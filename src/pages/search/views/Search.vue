<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <div class="tab">
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
                      <label
                        for=""
                        class="required"
                      >計畫名稱：</label>
                      <v-select
                        :options="[{label: '林務局全島鼬獾監測', value:'1'}]"
                        v-model="data.project"
                        :placeholder="'請選擇計畫名稱'"
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
                        :options="[{label: '屏東處', value:'屏東處'}]"
                        v-model="data.site"
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
                        :options="[{label: '旗山站', value:'旗山站'}]"
                        v-model="data.subsite"
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
                        :options="[{label: 'PT10A', value:'PT10A'}]"
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
                    :options="[{label:'山羌', value:'山羌'},{label:'鼬獾', value:'鼬獾'},{label:'台灣獼猴', value:'台灣獼猴'},{label:'山羊', value:'山羊'},{label:'赤腹松鼠', value:'赤腹松鼠'},{label:'白鼻心', value:'白鼻心'}]"
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
                <div class="col-2">
                  <div class="form-group">
                    <label>性別：</label>
                    <v-select
                      :options="[
                      {label:'公', value: 'male'},
                      {label:'母', value: 'female'}
                    ]"
                      :placeholder="'請選擇性別'"
                    />
                  </div>
                </div>
                <div class="col-2">
                  <div class="form-group">
                    <label>年齡：</label>
                    <v-select
                      :options="[
                      {label:'幼仔', value: '1'},
                      {label:'成熟', value: '2'}
                    ]"
                      :placeholder="'請選擇年齡'"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>角況：</label>
                    <v-select
                      :options="[
                      {label:'幼仔', value: '1'},
                      {label:'成熟', value: '2'}
                    ]"
                      :placeholder="'請選擇角況'"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>
                      <span class="text">備註：</span>
                      <span class="icon">
                        <i class="icon-info mt-1"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請選擇被註內容"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
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
                        <vue-timepicker
                          v-model="form.cameraStart"
                          format=""
                        />
                      </div>
                      <div class="text px-2">到</div>
                      <div class="input-group">
                        <vue-timepicker
                          v-model="form.cameraEnd"
                          format=""
                        />
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
                      <v-select :options="[{value: 1, label:'有效照片與目擊事件'}]" />
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
            <div
              class="gray-block"
              v-for="(data, did) in form.data"
              :key="`data-form-${did}`"
            >
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label
                        for=""
                        class="required"
                      >計畫名稱：</label>
                      <v-select
                        :options="[{label: '林務局全島鼬獾監測', value:'1'}]"
                        :placeholder="'請選擇計畫名稱'"
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
                        :options="[{label: '屏東處', value:'屏東處'}]"
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
                        :options="[{label: '旗山站', value:'旗山站'}]"
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
                        :options="[{label: 'PT10A', value:'PT10A'}]"
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
                    :options="[
                      {label:'山羌', value:'山羌'},
                      {label:'鼬獾', value:'鼬獾'},
                      {label:'台灣獼猴', value:'台灣獼猴'},
                      {label:'山羊', value:'山羊'},
                      {label:'赤腹松鼠', value:'赤腹松鼠'},
                      {label:'白鼻心', value:'白鼻心'}
                    ]"
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
                        v-model="form.endTime"
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
                  <label class="required">有效時間判定間隔：</label>
                  <v-select :placeholder="'請選擇有效時間判定間隔'"></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label class="required">目擊事件判斷間隔：</label>
                  <v-select :placeholder="'請選擇目擊事件判斷間隔'"></v-select>
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
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import { commonMixin } from '../../../mixins/common.js';

export default {
  name: 'Search',
  mixins: [commonMixin],
  components: { DatePicker, VueTimepicker },
  data() {
    return {
      currentTab: 1,
      advSecOpen: true,
      form: {
        data: [
          {
            project: '',
            site: '',
            subsite: '',
            camera: '',
          },
        ],
        startAt: '',
        endAt: '',
        startTime: {
          HH: '10',
          mm: '05',
        },
        endTime: {
          HH: '10',
          mm: '05',
        },
        cameraStart: {
          HH: '10',
          mm: '05',
        },
        cameraEnd: {
          HH: '10',
          mm: '05',
        },
      },
    };
  },
  methods: {
    submitSearch() {
      this.$router.push('/search');
    },
    submitCalculate() {
      this.$router.push('/calculate');
    },
    removeFormData(idx) {
      this.form.data.splice(idx, 1);
    },
    addFormData() {
      this.form.data.push({
        project: '',
        site: '',
        subsite: '',
        camera: '',
      });
    },
  },
};
</script>
