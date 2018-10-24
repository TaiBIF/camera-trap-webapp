<template>
  <div class="container page-project-edit">
    <!-- 權限表格 -->
    <div class="row">
      <div class="col-12">
        <h1 class="heading">成員權限說明</h1>
        <p>
          此處詳列系統各成員層級權限，若有疑問 
          <a class="text-green text-underline">請聯繫系統管理員 </a>
        </p>
      </div>
      
     <div class="col-12 pb-5">
        <table class="table auth-table">
          <thead>
            <tr>
              <th></th>
              <th>系統管理員</th>
              <th>計畫管理員</th>
              <th>計畫研究員</th>
              <th>計畫執行者</th>
            </tr>
          </thead>
          <tbody>
            <tr class="sec-title">
              <td colspan="5">系統管理</td>
            </tr>
            <tr>
              <td>發佈系統公告</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>系統設定與維護</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>所有帳號管理</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>常見問題編輯上稿</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">資料匯入</td>
            </tr>
            <tr>
              <td>物種名錄建置</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>其他資料匯入</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">建立計畫</td>
            </tr>
            <tr>
              <td>新增計畫</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">計畫管理</td>
            </tr>
            <tr>
              <td>計畫基本設定</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>計畫成員管理</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>資料編輯設定</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>新欄位建立申請</td>
              <td></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>新欄位建立審核</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>編輯常見物種順序</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>每日測試照拍攝時間設定</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>相機位置管理</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>計畫創用CC授權</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>計畫公開日期設定</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">範本資料</td>
            </tr>
            <tr>
              <td>範本下載</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">資料上傳</td>
            </tr>
            <tr>
              <td>上傳檔案</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>覆蓋檔案</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">資料編輯 (Excel)</td>
            </tr>
            <tr>
              <td>編輯資料欄位</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>新增資料列</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>刪除資料列</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>新增資料項目</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>編輯連拍時間設定</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>還原之前版本資料</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>進階標注</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">資料篩選、計算</td>
            </tr>
            <tr>
              <td>資料篩選</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>制定篩選欄位項目</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>執行資料計算</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">資料匯出</td>
            </tr>
            <tr>
              <td>下載CSV</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>照片個別下載</td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr class="sec-title">
              <td colspan="5">其他</td>
            </tr>
            <tr>
              <td>相機異常回報</td>
              <td></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>快速鍵設定</td>
              <td></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>聯絡我們（問題回報）</td>
              <td></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>聯絡我們（意見回饋）</td>
              <td></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
              <td><i class="icon-check-lg"></i></td>
            </tr>
            <tr>
              <td>聯絡我們（問題審核回覆）</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>聯絡我們（意見審核回覆）</td>
              <td><i class="icon-check-lg"></i></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>

</template>

<script>
import {commonMixin} from '../../../mixins/common'

export default {
  name: "MemberDescription",
  mixins: [commonMixin],
}
</script>
