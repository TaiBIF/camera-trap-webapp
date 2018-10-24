<template>
  <div class="container">
    <ul class="breadcrumbs">
      <li><a href="index.html/">計畫總覽</a></li>
      <li><a href="index.html#/project/1">林務局全島鼬獾監測</a></li>
      <li><a>檔案上傳</a></li>
    </ul>

    <div class="col-10 offset-1 upload-container" :class='{"d-none": fileList.length}'>
      <div class="text-right">
        <a @click="modalOpen('trialModalOpen')" class="link text-green">檢閱詳細上傳說明</a>
      </div>
      <div id="dropzone" class="upload-area text-center">
        <img src="/assets/upload/upload-img.png" height="180" srcset="/assets/upload/upload-img@2x.png">
        <h1>將檔案拖曳於此並上傳</h1>
        <p>或 <label for="upload" class="text-green underline">點此瀏覽檔案</label></p>
        <input type="file" class="d-none" id="upload">
      </div>

      <div class="text-center mt-2">
        <small class="text-center">
          單一檔案上傳大小制於 <b>2G</b> 以內，一次上傳中，檔案大小總合須小於 <b>5G</b>
          <br/>您可以上傳的檔案形式：內含資料檔（.csv）及其對應影像之壓縮檔 (.zip)、影像資料壓縮檔 (.zip)、單一影像檔 及 單一資料檔（.csv）
        </small>
      </div>
    </div>

    <div class="col-12 px-0" :class='{"d-none": !fileList.length}'>
      <h1 class="text-green">檔案上傳</h1>
      <div class="row">
        <div class="col-9" :class="{'col-12': isUploading, 'pr-0':!isUploading} ">
          <div class="message is-alert" v-if="alertMsg!=='' && showAlert">
            <a class="float-right close" @click="showAlert=false">
              <i class="icon-remove-red"></i>
            </a>
            <div class="alert-box float-left">!</div>
            <div class="text">{{alertMsg}}</div>
          </div>
          <!-- 顯示上傳資訊 -->
          <div class="float-right text-right" v-if="isUploading">
            剩餘時間：40 分鐘<br/>
            <small class="text-gray">正在上傳檔案：5 %</small>
          </div>
          <!-- 顯示選取與刪除 -->
          <div class="float-right" v-else>
            <div class="checkbox checkbox-inline mb-0 mt-2">
              <input type="checkbox" name="select-all" id="select-all" value="1" :checked="selectedFile.length===fileList.length"
              @change="selectAll()">
              <label for="select-all">全選檔案</label>
            </div>
            <span v-if="selectedFile.length > 1">
              <span> | </span>
              <span class="btn btn-text text-gray">
                <span class="icon"><i class="icon-trash"></i></span>
                <span class="text" v-if="selectedFile.length===fileList.length">移除全部檔案</span>
                <span class="text" v-else>移除選取的檔案</span>
              </span>
            </span>
          </div>
          <label for="upload" class="btn btn-upload">
            <span class="icon"><i class="icon-add-green"></i></span>
            <span class="text">新增上傳檔案</span>
          </label>
        </div>
      </div>
      <div class="upload-list-container">
        <div class="row mx-0">
          <div class="col-9 px-0" :class="{'col-12': isUploading}">
            <table class="table" id="upload-list">
              <thead>
                <tr>
                  <th :width="!isUploading ? '40%':'25%'">檔案名稱</th>
                  <th>檔案大小</th>
                  <th>樣區</th>
                  <th width="25%">樣點</th>
                  <th width="25%" v-if="isUploading">上傳進度</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                :class="{'is-selected': selectedFile.indexOf(f_id)>-1}"
                v-for="(file, f_id) in fileList" :key="`file-${f_id}`"
                @click.stop.prevent="toggleSelect($event, f_id)">
                  <td>
                    <span class="icon" v-if="file.type==='jpg'"><i class="icon-photo"></i></span>
                    <span class="icon" v-if="file.type==='csv'"><i class="icon-csv"></i></span>
                    <span class="icon" v-if="file.type==='zip'"><i class="icon-zip"></i></span>
                    <span class="icon" v-if="file.type==='folder'"><i class="icon-folder"></i></span>
                    <span class="text">{{file.name}}</span>
                  </td>
                  <td>{{file.size}}</td>
                  <td>{{file.site}}-{{file.subsite}}</td>
                  <td>
                    <span class="action">
                      <a class="del icon"><i class="icon-trash"></i></a>
                    </span>
                    <span class="text">{{file.camera}}</span>
                  </td>
                  <td v-if="isUploading">
                    <!-- 上傳結束後行為 -->
                    <div class="float-right">
                      <a v-if="file.state===0 || file.state===1" class="link text-underline text-muted">取消</a>

                      <a v-if="file.state===-1" class="link text-danger text-underline">檢視錯誤</a>

                      <a v-if="file.state===2" @click="goCheck(file)" role="button" class="link text-green text-underline">查看</a>
                    </div>
                    <!-- 上傳進度 -->
                    <div :id="`upload-progress-${f_id}`" class="upload-progress" :class="{'d-none': file.state==2 || file.state==-1 }"></div>
                    <div v-if="file.state===-1">
                      <i class="icon icon-upload-fail"></i> 上傳失敗
                    </div>
                    <div v-if="file.state===2">
                      <i class="icon icon-upload-success"></i> 上傳完成
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-3" v-if="!isUploading">
            <p class="text-center" v-if="!selectedFile.length">
              請選擇並編輯上傳檔案
            </p>
            <form class="form" v-else>
              <p class="text-center">
                選擇並編輯上傳檔案 ({{selectedFile.length}} / {{fileList.length}})
              </p>
              <div class="form-group">
                <label class="required">樣區：</label>
                <v-select 
                :options="siteOpts" 
                v-model="form.site" 
                :on-change="updateSiteValue" 
                :placeholder="multiSite ? '多個樣區位置' : '請選擇檔案所屬樣區'" />
              </div>
              <div class="form-group">
                <label class="required">子樣區：</label>
                <v-select 
                :options="subSiteOpts" 
                v-model="form.subsite" 
                :on-change="updateSubsiteValue"  
                :placeholder="multiSite ? '多個子樣區位置' : '請選擇檔案所屬子樣區'" />
              </div>
              <div class="form-group">
                <label class="required">相機位置：</label>
                <v-select 
                :options="cameraOpts" 
                v-model="form.camera" 
                :on-change="updateCameraValue" 
                :placeholder="multiCamera ? '多個相機位置' : '請選擇檔案所屬相機位置'" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="action text-center">
        <p class="text-orange">請為每個檔案都編輯「樣區」和「相機位置」</p>
        <!-- 判斷是否有空白資料 -->
        <button @click.stop.prevent="startUpload()" class="btn btn-orange" :disabled="hasEmpty">
          <span class="icon"><i class="icon-upload"></i></span>
          <span class="text">開始上傳 <span v-if="!hasEmpty">({{fileList.length}})</span></span>
        </button>
      </div>
    </div>

    <trail-modal :open="trialModalOpen" @close="closeModal" />
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import TrailModal from '../components/TrialModal'
// import {awsMixins} from '../mixins/aws.js'
import {commonMixin} from '../../../mixins/common.js'
import ProgressBar from 'progressbar.js'

const files = [
  {
    name: "PT12A-151129-1051223",
    type: 'folder',
    size: '240 KB',
    site: '屏東處',
    subsite: '潮州站',
    camera: 'PT01A',
    state: 0
  },
  {
    name: "PT12A-151129-1051223.csv",
    type: 'csv',
    size: '240 KB',
    site: '屏東處',
    subsite: '潮州站',
    camera: 'PT02A',
    state: 0
  },
  {
    name: "PT12A-151129-1051223.jpg",
    type: 'jpg',
    size: '240 KB',
    site: '屏東處',
    subsite: '潮州站',
    camera: 'PT03A',
    state: 0
  },
  {
    name: "PT12A-151129-1051223.zip",
    type: 'zip',
    size: '240 KB',
    site: '',
    camera: '',
    state: 0
  }
]

export default {
  name: "Upload",
  mixins: [commonMixin],
  data() {
    return {
      siteOpts: [{value: '新竹處', label:'新竹處'}],
      subSiteOpts: [{value: '關山站', label:'關山站'}],
      cameraOpts: [{value: 'PT01A', label:'PT01A'},{value: 'PT02A', label:'PT02A'},{value: 'PT03A', label:'PT03A'}],
      form: {
        site: 0,
        subsite: 0,
        camera: 0
      },
      // 紀錄選取的檔案
      isKeyDown: false,
      currentKey: 0,
      selectedFile: [],
      trialModalOpen: true,
      fileList: [],
      multiSite: false,
      multiSubSite: false,
      multiCamera: false,
      selecting: false,
      hasEmpty: true,
      showAlert: true,
      dropzone: null,
      albumBucketName: 'tagphoto',
      bucketRegion: 'ap-northeast-1',
      alertMsg: '全部上傳的檔案已超過上限 5GB，建議您可以分次上傳',
      isUploading: false,
      uploadIndex: 0,
      uploadComplete: false,
      progress: []
    }
  },
  components: {
    TrailModal
  },
  computed: {
    ...mapGetters([
      'FileReady'
    ])
  },
  methods: {
    ...mapActions([
      'setFileReady'
    ]),
    // 上傳前部署
    startUpload() {
      let tr = this.$el.querySelector('#upload-list').querySelector('tbody').querySelectorAll('tr')
      this.selectedFile = []

      // 取消選取
      tr.forEach(t => t.classList.remove('is-selected'))
      
      // 改變畫面狀態
      this.isUploading = true
      
      // 給予 200 毫秒時間差，讓 HTML 可以被偵測
      setTimeout(() => {
        this.fileList.forEach((file, index) => {
          let container = `#upload-progress-${index}`
          var bar = new ProgressBar.Circle(container, {
            strokeWidth: 5,
            easing: 'easeInOut',
            color: '#2A7F60',
            trailColor: '#D8D8D8',
            trailWidth: 5,
            svgStyle: null,
            text: {
              style: {
                left: '120%',
                width: '130px',
                top: '2px',
                color: '#8B8B8B',
                position: 'absolute'
              }
            },
            step: (state, bar) => {
              // 預設文字
              bar.setText('等待上傳');

              if(Math.round(bar.value() * 100)==100) {
                bar.setText('正在檢核資料...');
                // 上傳完成進行檢核
              } 
            }
          });

          this.progress.push(bar)
        })

        this.doUpload()
      }, 200)
    },
    doUpload() {
      let file = this.fileList[this.uploadIndex];
      let bar = this.progress[this.uploadIndex];

      setTimeout(() => {
        // 從等待改變為上傳狀態
        file.state==1
        bar.setText(Math.round(bar.value() * 100) + ' %');
        bar.animate(1.0, {
          duration: 1000,
          text: {
            style: {
              color: '#464646'
            }
          }
        }, () => {
          // 上傳完成
          if(this.uploadIndex<=this.fileList.length-1) {
            setTimeout(() => {
              file.state = this.uploadIndex===3 ? -1 : 2;
            }, 1000);

            this.uploadIndex++;
            this.doUpload();
          } else {
            this.uploadComplete = true;
          }
        });  // Number from 0.0 to 1.0
      }, 1000)
      
    },
    detectValue() {
      // 偵測是否有空值
      let empty = false
      
      this.fileList.forEach(f => {
        if(f.site=='' || f.subsite=='' || f.camera=='') empty = true
      })

      this.hasEmpty = empty
    },
    // 選取下拉後同步資料給選取的檔案
    updateSiteValue(item) {
      if(this.selecting) return

      this.selectedFile.forEach(sf => {
        this.fileList[sf].site = item.value
      })

      this.detectValue()
    },
    updateSubsiteValue(item) {
      if(this.selecting) return

      this.selectedFile.forEach(sf => {
        this.fileList[sf].subsite = item.value
      })

      this.detectValue()
    },
    updateCameraValue(item) {
      if(this.selecting) return

      this.selectedFile.forEach(sf => {
        this.fileList[sf].camera = item.value
      })

      this.detectValue()
    },
    selectAll() {
      // 避免切換選取時自動賦值
      this.selecting = true

      if(this.selectedFile.length!==this.fileList.length) {
        this.fileList.forEach((file, i) => {
          if(this.selectedFile.indexOf(i)==-1)
            this.selectedFile.push(i)
        })
      } else {
        let tr = this.$el.querySelector('#upload-list').querySelector('tbody').querySelectorAll('tr')
        this.selectedFile = []

        tr.forEach(t => t.classList.remove('is-selected'))

        this.form = {
          site: '',
          subsite: '',
          camera: ''
        }
      }

      // 給 vue 切換 html 狀態的時間差
      setTimeout(() => {
        this.selecting = false
      }, 300)
    },
    toggleSelect(evt, index) {
      if(this.isUploading) return
      this.selecting = true
      let tr = this.$el.querySelector('#upload-list').querySelector('tbody').querySelectorAll('tr'),
          indexOF = this.selectedFile.indexOf(index)
      
      // 多選
      if(this.isKeyDown && this.currentKey==16) {
        if(indexOF > -1) {
          this.selectedFile.splice(indexOF, 1)
          tr[index].classList.remove('is-selected')
        } else {
          this.selectedFile.push(index)
          tr[index].classList.add('is-selected')
        }

        let site = '', subsite = '', camera = '';
        
        this.selectedFile.forEach(f => {
          if(site=='') site = this.fileList[f].site
          else if(this.fileList[f].site!==site) this.multiSite = true
            
          if(subsite=='') subsite = this.fileList[f].subsite
          else if(this.fileList[f].subsite!==subsite) this.multiSubSite = true

          if(camera=='') camera = this.fileList[f].camera
          else if(this.fileList[f].camera!==camera) this.multiCamera = true
        })

        this.form = {
          site: this.multiSite ? '' : this.fileList[this.selectedFile[0]].site,
          subsite: this.multiSubsite ? '' : this.fileList[this.selectedFile[0]].subsite,
          camera: this.multiCamera ? '' : this.fileList[this.selectedFile[0]].camera
        } 

      } else {
        // 單選
        this.selectedFile = [index]
        this.form = {
          site: this.fileList[index].site,
          subsite: this.fileList[index].subsite,
          camera: this.fileList[index].camera
        }

        tr.forEach((row, i) => {
          if(i==index) row.classList.add('is-selected')
          else row.classList.remove('is-selected')
        })
      } 

      setTimeout(() => {
        this.selecting = false
      }, 300)
    },
    closeModal(name) {
      this.modalClose(name)
    },
    s3ErrorHandle (err, data) {
      console.log(err, data);
    },
    traverseDirectory(entry) {
      const reader = entry.createReader();
      
      return new Promise((resolve, reject) => {
        const iterationAttempts = [];
        function readEntries() {
          reader.readEntries((entries) => {
            if (!entries.length) {
              resolve(Promise.all(iterationAttempts));
            } else {
              iterationAttempts.push(Promise.all(entries.map((ientry) => {
                if (ientry.isFile) {
                  return ientry;
                }
                return this.traverseDirectory(ientry);
              })));
              
              readEntries();
            }
          }, error => reject(error));
        }
        readEntries();
      });
    }
  },
  beforeMount() {
    
  },
  mounted() {
    this.dropzone = this.$el.querySelector("#dropzone")
    this.dropzone.ondragenter = function (event) {event.preventDefault();}
    this.dropzone.ondragover = function (event) {event.preventDefault();}
    this.dropzone.ondrop = (evt) => {
      evt.preventDefault();
      this.fileList = files
    }

    this.$el.querySelector("#upload").onchange = () => {
      this.fileList = files
    }

    document.body.onkeydown = (e) => {
      this.isKeyDown = true
      this.currentKey = e.keyCode
    }
    document.body.onkeyup = () => {
      this.isKeyDown = false
      this.currentKey = 0
    }
  }
}
</script>
