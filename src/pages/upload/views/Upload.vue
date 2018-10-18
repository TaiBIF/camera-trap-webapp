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
        <div class="col-9 pr-0">
          <div class="float-right">
            <div class="checkbox checkbox-inline mb-0 mt-3">
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
          <div class="col-9 px-0">
            <table class="table" id="upload-list">
              <thead>
                <tr>
                  <th width="30%">檔案名稱</th>
                  <th>檔案大小</th>
                  <th>樣區</th>
                  <th width="30%">樣點</th>
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
                  <td>{{file.site}}</td>
                  <td>
                    <span class="action">
                      <a class="del icon"><i class="icon-trash"></i></a>
                    </span>
                    <span class="text">{{file.camera}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-3">
            <p class="text-center" v-if="!selectedFile.length">
              請選擇並編輯上傳檔案
            </p>
            <form class="form" v-else>
              <p class="text-center">
                選擇並編輯上傳檔案 ({{selectedFile.length}} / {{fileList.length}})
              </p>
              <div class="form-group">
                <label class="required">樣區：</label>
                <v-select :options="siteOpts" v-model="form.site" :placeholder="'請選擇檔案所屬樣區'" />
              </div>
              <div class="form-group">
                <label class="required">子樣區：</label>
                <v-select :options="subSiteOpts" v-model="form.subsite" :placeholder="'請選擇檔案所屬子樣區'" />
              </div>
              <div class="form-group">
                <label class="required">相機位置：</label>
                <v-select :options="cameraOpts" v-model="form.camera" :placeholder="'請選擇檔案所屬相機位置'" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="action text-center">
        <p class="text-orange">請為每個檔案都編輯「樣區」和「相機位置」</p>

        <div class="btn btn-orange" disabled>
          <span class="icon"><i class="icon-upload"></i></span>
          <span class="text">開始上傳</span>
        </div>
      </div>
    </div>

    <trail-modal :open="trialModalOpen" @close="closeModal" />
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import TrailModal from '../components/TrialModal'
import {awsMixins} from '../mixins/aws.js'
import {commonMixin} from '../../../mixins/common.js'

const files = [
  {
    name: "PT12A-151129-1051223",
    type: 'folder',
    size: '240 KB',
    site: '屏東處-潮州站',
    camera: 'PT01A'
  },
  {
    name: "PT12A-151129-1051223.csv",
    type: 'csv',
    size: '240 KB',
    site: '屏東處-潮州站',
    camera: 'PT01A'
  },
  {
    name: "PT12A-151129-1051223.jpg",
    type: 'jpg',
    size: '240 KB',
    site: '屏東處-潮州站',
    camera: 'PT01A'
  },
  {
    name: "PT12A-151129-1051223.zip",
    type: 'zip',
    size: '240 KB',
    site: '屏東處-潮州站',
    camera: 'PT01A'
  }
]

export default {
  name: "Upload",
  mixins: [commonMixin],
  data() {
    return {
      isKeyDown: false,
      currentKey: 0,
      siteOpts: [{value: 1, label:'新竹處'}],
      subSiteOpts: [{value: 1, label:'關山站'}],
      cameraOpts: [{value: 1, label:'PT10A'}],
      form: {
        site: 0,
        subsite: 0,
        camera: 0
      },
      selectedFile: [],
      trialModalOpen: false,
      fileList: files,
      dropzone: null,
      albumBucketName: 'tagphoto',
      bucketRegion: 'ap-northeast-1'
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
    selectAll() {
      this.fileList.forEach((file, i) => {
        if(this.selectedFile.indexOf(i)==-1)
          this.selectedFile.push(i)
      })
    },
    toggleSelect(evt, index) {
      let tr = this.$el.querySelector('#upload-list').querySelector('tbody').querySelectorAll('tr'),
          indexOF = this.selectedFile.indexOf(index)
      
      if(this.isKeyDown && this.currentKey==16) {
        if(indexOF > -1) {
          this.selectedFile.splice(indexOF, 1)
          tr[index].classList.remove('is-selected')
        } else {
          this.selectedFile.push(index)
          tr[index].classList.add('is-selected')
        }
      } else {
        this.selectedFile = [index]
        tr.forEach((row, i) => {
          if(i==index) row.classList.add('is-selected')
          else row.classList.remove('is-selected')
        })
      } 
    },
    closeModal(name) {
      this.modalClose(name)
    },
    doUpload (i) {
      this.fileList[i].s3mu_uploader.send(this.s3ErrorHandle)
      let ffss = 5566;
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
      this.fileList.push(123)
    }

    this.$el.querySelector("#upload").onchange = (evt) => {
      this.fileList.push(123)
    }

    document.body.onkeydown = (e) => {
      this.isKeyDown = true
      this.currentKey = e.keyCode
    }
    document.body.onkeyup = (e) => {
      this.isKeyDown = false
      this.currentKey = 0
    }
  }
}
</script>
