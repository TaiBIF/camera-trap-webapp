<template>
  <main class="page-project">
    <div class="container">
      <h1 class="heading">新增計畫</h1>
      <!-- Step 1 -->
      <div v-if="step==1">
        <form class="form form-horizontal">
          <div class="panel">
            <div class="panel-heading">
              <h4>計畫基本資訊</h4>
            </div>
            <div class="panel-body">
              <div class="form-group row">
                <label for="project-name" class="col-2 required">計畫名稱：</label>
                <div class="col-4">
                  <input type="text" id="project-name" v-model="form.name" placeholder="請輸入計畫名稱" class="form-control">
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2 required">計畫簡稱：</label>
                <div class="col-4">
                  <input type="text" id="project-name" v-model="form.slot" placeholder="請輸入計畫簡稱 (限4字)" class="form-control">
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2 required">委辦單位：</label>
                <div class="col-4">
                  <input type="text" id="project-name" v-model="form.agency" placeholder="請輸入委辦單位" class="form-control">
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2 required">計畫編號：</label>
                <div class="col-4">
                  <input type="text" id="project-name" v-model="form.no" placeholder="請輸入計畫編號" class="form-control">
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2 required">計畫主持人：</label>
                <div class="col-4">
                  <input type="text" id="project-name" v-model="form.owner" placeholder="請輸入計畫主持人" class="form-control">
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2 required">計畫時間：</label>
                <div class="col-4 input-group-inline">
                  <div class="input-group">
                    <date-picker v-model="form.start_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                    <div class="input-group-append">
                      <i class="icon icon-calendar"></i>
                    </div>
                  </div>
                  <div class="input-text">到</div>
                  <div class="input-group">
                    <date-picker v-model="form.end_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                    <div class="input-group-append">
                      <i class="icon icon-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2">計畫地區：</label>
                <div class="col-4">
                  <div class="select">
                    <v-select v-model="form.area"></v-select>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2">計畫摘要：</label>
                <div class="col-4">
                  <textarea v-model="form.description" class="form-control" placeholder="請簡單描述計畫目的"></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2">備註：</label>
                <div class="col-4">
                  <textarea v-model="form.comment" class="form-control" placeholder="您可以輸入任何補註資料"></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label for="project-name" class="col-2">計畫封面：</label>
                <div class="col-4">
                  <input type="hidden" v-model="form.cover">
                  <label class="btn btn-default btn-upload">
                    <input type="file" id="upload">
                    <span class="text">選擇檔案</span>
                  </label>
                  <div class="note">
                    <small class="text-gray">
                      您可以為專案添加封面，理想尺寸是 373 x 180 像素 (.jpg, .png) ，檔案上限為 2 MB。
                    </small>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="action">
            <router-link to="/overview" class="btn btn-default">取消</router-link>
            <button type="submit" @click.stop.prevent="nextStep()" class="btn btn-orange">下一步</button>
          </div>
        </form>
      </div>
      <!-- Step 2 -->
      <div v-if="step==2">
        <form class="form form-horizontal">
          <div class="panel">
            <div class="panel-heading">
              <h4>創用CC授權許可</h4>
            </div>
            <div class="panel-body">
              <p>
                授權計畫內的詮釋資料、鑑定資訊與影像資訊讓其他遵守授權條款的用戶不必向您詢問許可，即能合法使用其中資料。「Camera Trap 監測資料管理平台」使用您的創用 CC 授權內容，來與像是全球生物多樣性資訊機構（GBIF），一個專門編輯發佈全球生物多樣化訊息之國際政府間組織如此般的資料合作者共享內容。 了解<a href="http://creativecommons.tw/" target="_blank">創用 CC 授權內容</a>。
              </p>
              <div class="form-group">
                <label for="">詮釋資料：</label>
                <div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-0.png" height="40px" srcset="/assets/common/cc-0@2x.png">
                      <span class="text">無著作權 (CC0)</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-1.png" height="40px" srcset="/assets/common/cc-1@2x.png">
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-2.png" height="40px" srcset="/assets/common/cc-2@2x.png">
                      <span class="text">姓名標示-非商業性</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="">鑑定資訊：</label>
                <div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-1.png" height="40px" srcset="/assets/common/cc-1@2x.png">
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="">影像資料：</label>
                <div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-0.png" height="40px" srcset="/assets/common/cc-0@2x.png">
                      <span class="text">無著作權 (CC0)</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-1.png" height="40px" srcset="/assets/common/cc-1@2x.png">
                      <span class="text">姓名標示</span>
                    </label>
                  </div>
                  <div class="radio">
                    <input type="radio" name="" id="">
                    <label for="">
                      <img src="/assets/common/cc-2.png" height="40px" srcset="/assets/common/cc-2@2x.png">
                      <span class="text">姓名標示-非商業性</span>
                    </label>
                  </div>
                </div>
              </div>
              <hr>
              <div class="form-group row">
                <label for="" class="pl-3 required">公開日期：</label>
                <div class="d-inline-block pl-3">
                  <div class="input-group">
                    <date-picker v-model="form.public_at" :placeholder="'18/9/20'" :format="'YY/M/DD'" :first-day-of-week="1"></date-picker>
                    <div class="input-group-append">
                      <i class="icon icon-calendar"></i>
                    </div>
                  </div>
                </div>
                <div class="col-12 pt-2">
                  <small class="text-gray">
                    計畫內的詮釋資料將會直接公開，鑑定資訊、影像資料的公開日期之上限為計畫起始時間的5年後。
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="action">
            <router-link to="/overview" class="btn btn-default">取消</router-link>
            <button type="submit" @click.stop.prevent="doSubmit()" class="btn btn-orange">新增計畫</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  name: "CreateProject",
  components: {
    DatePicker
  },
  data() {
    return {
      step: 1,
      form: {
        cover: '',
        name: '',
        slot: '',
        agency: '',
        owner: '',
        start_at: '',
        end_at: '',
        public_at: '',
        area: '',
        description: '',
        comment: ''
      }
    }
  },
  methods: {
    doSubmit() {
      this.$router.push('/')
    },
    nextStep() {
      // 儲存現階段資料，或直接跳下一步一次送出
      this.step++;
    }
  }
}
</script>
