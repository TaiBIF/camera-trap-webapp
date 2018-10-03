<template>
  <div class="page-upload pt-3" v-cloak>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h3 class="text-green">檔案上傳</h3>
        </div>
      </div>

      <div v-if="!files.length">
        <upload-info />
        <div class="row">
          <div class="col-12 text-center">
            <label class="btn btn-warning btn-upload">
              <input type="file" name="uploadfile" multiple="multiple" @change="fileReady($event)">
              <i class="icon icon-add-file"></i>
              選擇檔案
            </label>
          </div>
        </div>
      </div>

      <div class="pt-5" v-if="files.length">
        <div class="row">
          <div class="col-12">
            <div class="upload-controlbar">
              <div class="row">
                <div class="col-12" v-if="!isUploading">
                  <label class="btn btn-link btn-upload">
                    <input type="file" name="uploadfile" multiple="multiple" @change="fileReady($event)">
                    <span class="d-block"><i class="icon icon-add-green"></i> 新增檔案</span>
                  </label>
                  <div class="divider"></div>
                  <a class="btn btn-link" @click="removeFile()"><i class="icon icon-trash"></i> 刪除檔案</a>
                </div>
                <div class="col-12 text-right py-1" v-else-if="!uploadComplete">
                  <i class="icon icon-waiting"></i> 正在上傳：{{files.length-uploadIndex}} 個檔案，約 {{time}} 分鐘...
                </div>
                <div class="col-12 text-right py-1" v-else>
                  已成功上傳 {{files.length - 1}} 個檔案，0 個上傳失敗
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <form class="form">
                <div class="panel-body p-0 upload-wrapper">
                  <div class="table-container">
                    <table class="table">
                      <thead>
                        <tr>
                          <th width="40" v-if="!isUploading">
                            <div class="checkbox">
                              <input type="checkbox" id="file-list-all" value="1" @change="selectAll($event)">
                              <label for="file-list-all"></label>
                            </div>
                          </th>
                          <th>檔案名稱</th>
                          <th>所屬專案</th>
                          <th>樣區位置</th>
                          <th>樣點</th>
                          <th v-if="isUploading">檔案大小</th>
                          <th width="250" v-if="isUploading">上傳進度</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                        v-for="(file, idx) in files" :key="`file-tr-${idx}`" 
                        :class="{'is-selected': selectedItems.indexOf(idx)>-1}"
                        @click="toggleSelect(idx)">
                          <td v-if="!isUploading">
                            <div class="checkbox">
                              <input type="checkbox" :id="`file-list-${idx}`" value="1" @change="selectItem($event, idx)" :checked="selectedItems.indexOf(idx)>-1">
                              <label :for="`file-list-${idx}`"></label>
                            </div>
                          </td>
                          <td>
                            <i class="icon icon-csv" v-if="file.type=='text/csv'"></i>
                            <i class="icon icon-zip" v-if="file.type=='application/zip'"></i>
                            <i class="icon icon-photo" v-if="file.type=='image/jpeg' || file.type=='image/jpg' || file.type=='image/png'"></i>
                            {{file.name}}
                          </td>
                          <td>
                            {{file.project}}
                          </td>
                          <td>
                            {{file.site}} - {{file.subsite}}
                          </td>
                          <td>
                            {{file.camara}}
                          </td>
                          <td v-if="isUploading">{{ file.size | fileSize }}</td>
                          <td v-if="isUploading">
                            <div class="float-right">
                              <a v-if="file.state===0 || file.state===1" class="link text-muted">取消</a>
                              <a v-if="file.state===-1" class="link text-danger">檢視錯誤</a>
                              <a @click="goCheck(file)" v-if="file.state===2" role="button" class="link text-green">查看</a>
                            </div>
                            <span v-if="file.state===0">等待上傳</span>
                            <div :id="`upload-progress-${idx}`" class="upload-progress" :class="{'d-none': file.state!==1}"></div>
                            <div v-if="file.state===-1">
                              <i class="icon icon-upload-error"></i> 上傳失敗
                            </div>
                            <div v-if="file.state===2">
                              <i class="icon icon-upload-success"></i> 上傳完成
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="form-container" :class="{'d-none': isUploading}">
                    <h5 class="text-green">編輯上傳檔案（{{selectedItems.length}}）</h5>  
                    <p v-if="this.selectedItems.length>1">你已經選擇多筆資料</p>
                    <div class="form-group">
                      <label for="project">
                        <span class="text-danger">*</span> 
                        所屬專案
                      </label>
                      <select id="project" class="form-control" v-model="fileInfo.project" @change="updateFileData('project', $event.target.value)">
                        <option value=""></option>
                        <option value="新竹狂犬病監測">新竹狂犬病監測</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="site">
                        <span class="text-danger">*</span> 
                        樣區
                      </label>
                      <select id="site" class="form-control" v-model="fileInfo.site" @change="updateFileData('site', $event.target.value)">
                        <option value=""></option>
                        <option value="南庄田美村">南庄田美村</option>
                      </select>
                    </div>
                    <!-- <div class="form-group">
                      <label for="subsite">
                        <span class="text-danger">*</span> 
                        子樣區
                      </label>
                      <select id="subsite" class="form-control" v-model="fileInfo.subsite" @change="updateFileData('subsite', '潮州站')">
                        <option value=""></option>
                        <option value="1">南庄田美村</option>
                      </select>
                    </div> -->
                    <div class="form-group">
                      <label for="camara">
                        <span class="text-danger">*</span> 
                        樣點
                      </label>
                      <select id="camara" class="form-control" v-model="fileInfo.camara" @change="updateFileData('camara', $event.target.value)">
                        <option value=""></option>
                        <option value="HC20A">HC20A</option>
                        <option value="HC20B">HC20B</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="camara">
                        <span class="text-danger">*</span> 
                        回收事件 <i class="icon icon-info" data-toggle="tooltip" data-title="回收此筆資料記憶卡之日期"></i>
                      </label>
                      <date-picker lang="zh-TW" v-model="fileInfo.date" :first-day-of-week="1" @change="updateFileData('date', '2017-03-28')"></date-picker>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="row" :class="{'d-none': isUploading}">
          <div class="col-12 text-center py-3">
            <button class="btn btn-warning" :disabled="!readyUpload" @click="startUpload()">
              <i class="icon icon-add-file"></i>
              開始上傳 ({{files.length}})
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import DatePicker from 'vue2-datepicker'
import UploadInfo from '../components/UploadInfo';
import ProgressBar from 'progressbar.js';

export default {
  name: 'Upload',
  components: {UploadInfo, DatePicker},
  filters: {
    fileSize(value) {
      if(value<1024) {
        return value + 'byte'
      } else {
        let kb = value/1024;
        if(kb<1024) {
          return kb.toFixed(1) + 'KB';
        } else { 
          let mb = kb/1024;
          if(mb<1024) 
            return mb.toFixed(1) + 'MB';
          else 
            return (mb/1024).toFixed(1) + 'G';
        }
      }
    }
  },
  data() {
    return {
      time: 0,
      uploadIndex: 0,
      uploadComplete: false,
      isUploading: false,
      readyUpload: false,
      selectedItems: [],
      uploadfile: '',
      fileInfo: {
        project: '',
        site: '',
        camara: '',
        date: '2017-03-28'
      },
      formData: new FormData(),
      files: []
    }
  },
  computed: {
    ...mapGetters([
      'getFiles'
    ])
  },
  methods: {
    ...mapActions([
      'setFileType', 'setFiles'
    ]),
    toggleSelect(i) {
      var index = this.selectedItems.indexOf(i);
      if(index>-1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(i);
      }

      if(this.selectedItems.length==0) {
        this.fileInfo = {
          project: '',
          site: '',
          camara: '',
          date: '2017-03-28'
        }
      } else if(this.selectedItems.length==1) {
        this.fileInfo = {
          project: this.files[this.selectedItems[0]].project,
          site: this.files[this.selectedItems[0]].site,
          camara: this.files[this.selectedItems[0]].camara,
          date: '2017-03-28'
        }
      } else {
        var diff = false,
            temp = {
              project: '',
              site: '',
              camara: ''
            };

        this.selectedItems.forEach(i => {
          var a = i, b = i+1>=this.selectedItems ? 0 : i+1;
          var data_1 = this.files[b],
              data_2 = this.files[b];
            
          diff = (data_1.project===data_2.project && data_1.site===data_2.site && data_1.camara!==data_2.camara) 
        });

        if(diff) {
          this.fileInfo = {
            project: this.files[this.selectedItems[0]].project,
            site: this.files[this.selectedItems[0]].site,
            camara: this.files[this.selectedItems[0]].camara,
            date: '2017-03-28'
          }
        } else {
          this.fileInfo = {
            project: '',
            site: '',
            camara: '',
            date: '2017-03-28'
          }
        }
      }
      
    },
    goCheck(file) {
      this.setFileType(file.type);
      this.setFiles(this.files);
      
      if(file.name=="HC20A.zip")
        window.open('./upload.html#/result/csv');
      if(file.name=="HC20B.zip")
        window.open('./upload.html#/result/zip');

    },
    doUpload() {
      let container = `#upload-progress-${this.uploadIndex}`,
          file = this.files[this.uploadIndex];
      
      file.state = 1;
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
            width: '100px',
            top: '2px',
            position: 'absolute'
          }
        },
        step: (state, bar) => {
          bar.setText(Math.round(bar.value() * 100) + ' %');
          if(Math.round(bar.value() * 100)==100) {
            bar.setText('正在檢核資料...');
          } 
        }
      });

      bar.animate(1.0, {
        duration: file.time,
      }, () => {
        setTimeout(() => {
          file.state = this.uploadIndex===3 ? -1 : 2;
        }, 5000);

        if(this.uploadIndex<this.files.length-1) {
          this.uploadIndex++;
          this.doUpload();
        } else {
          this.uploadComplete = true;
        }
      });  // Number from 0.0 to 1.0

      
    },
    removeFile() {
      this.selectedItems.forEach(r => {
        debugger;
        this.files.splice(r, 1)
      });
    },
    startUpload() {
      let total = 0
      for(var i in this.files) {
        total += this.files[i].time
      }
      this.time = (total / 60000).toFixed(0);
      this.isUploading = true;
      setTimeout(() => {
        this.doUpload();
      }, 300);
    },
    updateFileData(name, val) {
      if(val==='') return;

      this.selectedItems.forEach(r => {
        this.files[r][name] = val
      });

      let empty = true,
          totalIdx = 0,
          emptyIdx = 0;
      
      for(var i in this.fileInfo) {
        if(this.fileInfo[i]!=='') {
          emptyIdx++;
        }
        totalIdx++;
      }

      this.readyUpload = (totalIdx==emptyIdx)
    },
    selectAll(e) {
      if(!e.target.checked)
        this.selectedItems = [];
      else
        this.files.forEach((r, i) => {
          this.selectedItems.push(i);
        })
      
      // setTimeout(() => {
      //   $('[data-toggle="tooltip"]').tooltip();
      // }, 100);
    },
    selectItem(e, idx) {
      let num = this.selectedItems.indexOf(idx);
      if(this.selectedItems.indexOf(idx) > -1) {
        this.selectedItems.splice(num, 1);
      } else {
        this.selectedItems.push(idx);
      }
    },
    fileReady(evt) {
      let files = evt.target.files,
          idx = 0;
      // debugger;
      for(var i in evt.target.files) {
        let file = evt.target.files[i]

        if(!file.name==false && !file.size==false) {
          this.files.push({
            name: file.name,
            size: file.size,
            type: file.type,
            project: '',
            site: '',
            subsite: '',
            camara: '',
            date: '',
            loading: 0,
            state: 0,
            time: file.size > 10000 ? 10000 : file.size
          });

          this.formData.append(`upload_files[${idx}]`, file, file.name)
        }
        idx++
      }

    }
  },
  beforeMount() {
    if(this.getFiles.length) {
      this.files = this.getFiles;
    }
  },
  mounted() {
    
  }
}
</script>
