<template>
  <main class="page-upload">
    <div id="dropzone" style="width:500px;height:200px;background:lightgrey" >Drag folder here</div>
    <div id="file_list">
      <div v-for="(file, idx) in fileList" :key="`file-${idx}`">
        <strong @click="doUpload(idx)">[點我上傳]</strong> {{ file.fullPath }}
        <!-- <span style='cursor:pointer;' @click="files_to_upload[idx]["+j+"].s3mu_uploader.send(s3ErrorHandle)">點我上傳</span> -->
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions} from 'vuex'
import {awsMixins} from '../../../mixins/aws.js'


export default {
  naem: "Upload",
  data() {
    return {
      fileList: [],
      dropzone: null,
      albumBucketName: 'tagphoto',
      bucketRegion: 'ap-northeast-1'
    }
  },
  methods: {
    ...mapActions([
      'setFileReady'
    ]),
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
    this.$loadScript("https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js")
    .then(() => {
      AWS.config.update({region: this.bucketRegion});
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-1:83570204-11bb-4601-8094-2dc2ccfbc88a',
        Logins: {
          'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_JACElFd4C': localStorage.getItem('awsIdToken')
        }
      });

      AWS.config.credentials.get(function(err){
        if (err) return console.log("Error", err);
        // 成功透過 FB 登入 AWS Cognito，取得 identity id，不知道有沒有其他取得 identity id 的方法？			
        var identity_id = AWS.config.credentials.identityId;
        console.log("Cognito Identity Id", AWS.config.credentials.identityId);
      });
    })
    .catch(() => { });
    
  },
  mounted() {
    this.dropzone = this.$el.querySelector("#dropzone")
    this.dropzone.ondragenter = function (event) {event.preventDefault();}
    this.dropzone.ondragover = function (event) {event.preventDefault();}
    this.dropzone.ondrop = (evt) => {
      evt.preventDefault();
      const data = evt.dataTransfer.items;
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const entry = item.webkitGetAsEntry();
        if(entry.isDirectory) {
          this.traverseDirectory(entry).then(
            result => {
              result[0].forEach(entry => {
                entry.file(file => {
                  file.s3mu_uploader = new AWS.S3.ManagedUpload({
                    params: {Bucket: 'tagphoto', Key: "multi/" + file.name, Body: file},
                    leavePartsOnError: true // 
                  });

                  file.s3mu_uploader.on('httpUploadProgress', function(progress) {
                    console.log(progress);
                  });
                })
              });
              this.fileList = this.fileList.concat(result[0])
            }
          );
        } else {
          entry.file(file => {
            entry.s3mu_uploader = new AWS.S3.ManagedUpload({
              params: {Bucket: 'tagphoto', Key: "multi/" + file.name, Body: file},
              leavePartsOnError: true // 
            });

            entry.s3mu_uploader.on('httpUploadProgress', function(progress) {
              console.log(progress);
            });
          })
          
          this.fileList.push(entry)
        }
      }

      console.log(this.fileList)

      // this.makeUploadList()
    }
  }
}
</script>
