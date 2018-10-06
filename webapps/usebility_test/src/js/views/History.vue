<template>
  <div class="page-history py-2">
    <div class="container-fluid">
      <h4 class="text-green">檔案上傳</h4>
      <div class="panel panel-default">
        <div class="panel-body">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th width="250">上傳時間</th>
                <th width="350">檔案名稱</th>
                <th width="*">所屬專案</th>
                <th width="150">樣區</th>
                <th width="100">樣點</th>
                <th width="320">上傳結果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, i) in history" :key="`history-group-${i}`">
                <td colspan="6">
                  <h5 class="text-green">{{ group.name }}</h5>
                  <table class="table table-striped table-borderless">
                    <tr v-for="(item, j) in group.data" :key="`history-item-${j}`">
                      <td width="250">{{item.updated_at}}</td>
                      <td width="350">
                        <i class="icon icon-csv" v-if="(item.name).search(/csv/)>-1"></i>
                        <i class="icon icon-zip" v-if="(item.name).search(/\.zip|\.7zip|\.tar/)>-1"></i>
                        <i class="icon icon-photo" v-if="(item.name).search(/\.jpg|\.jpeg|\.png/)>-1"></i>
                        {{item.name}}
                      </td>
                      <td width="*"><div class="text">{{item.project}}</div></td>
                      <td width="150">{{item.site}}</td>
                      <td width="100">{{item.camara}}</td>
                      <td width="320">
                        <div class="float-right">
                          
                          <a href="./upload.html" v-if="item.image_lack" class="link text-green mr-3">補上傳影像檔</a>
                          <a :href="item.link" v-if="item.status==1" class="link text-green">查看</a>
                          <a :href="item.link" v-if="item.status==-1" class="link text-danger">檢視錯誤</a>
                        </div>
                        <div v-if="item.status==1">
                          <i class="icon icon-upload-success"></i> 上傳成功
                        </div>
                        <div v-if="item.status==-1">
                          <i class="icon icon-upload-error"></i> 上傳失敗
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {
      history: [
        {
          name: '今天', 
          data: [
            {
              updated_at: '2017/03/28 15:24',
              name: 'HC20A.zip',
              project: '新竹狂犬病監測',
              site: '南庄田美村',
              camara: 'HC20A',
              status: 1,
              image_lack: false,
              link: './index.html?site=HC20A#/project/1/site/11'
            },
            {
              updated_at: '2017/03/28 15:24',
              name: 'HC20B.zip',
              project: '新竹狂犬病監測',
              site: '南庄田美村',
              camara: 'HC20B',
              status: 1,
              image_lack: false,
              link: './index.html?site=HC20B#/project/1/site/11'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: -1,
              link: './upload.html'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: true,
              link: './index.html#/project/1/site/1'
            }
          ]
        },
        {
          name: '昨天',
          data: [
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: false,
              link: './index.html?site=HC20A#/project/1/site/1'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: false,
              link: './index.html?site=HC20B#/project/1/site/1'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: -1,
              link: './upload.html'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: true,
              link: './index.html#/project/1/site/1'
            }
          ]
        },
        {
          name: '前 7 天',
          data: [
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: false,
              link: './index.html#/project/1/site/1'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: false,
              link: './index.html#/project/1/site/1'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: -1,
              link: './upload.html'
            },
            {
              updated_at: '2016/07/08 15:24',
              name: 'PT12A-151129-1051223.jpg',
              project: '關山野生動物重要棲息環境延平...',
              site: '屏東處-關山站',
              camara: 'PT01A',
              status: 1,
              image_lack: true,
              link: './index.html#/project/1/site/1'
            }
          ]
        }
      ]
    }
  }
}
</script>
