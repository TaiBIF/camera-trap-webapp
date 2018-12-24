<template>
  <div class="page-intro">
    <section class="banner">
      <div class="container">
        <div class="caption col-xs-12 col-sm-12 col-md-6">
          <h1 class="header">Camera Trap</h1>
          <p>簡單、效率、專業 - 紅外線相機資料管理平台</p>
          <a
            class="btn btn-orange btn-lg"
            @click="loginModalOpen = true"
          >開始使用</a>
        </div>
      </div>
    </section>
    <section class="important">
      <div class="container">
        <h1 class="text-green text-center">
          減少相機資料處理時間，提升工作效率
        </h1>
        <div class="row service-items">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-1.png"
                srcset="/assets/intro/service-1@2x.png"
              >
            </div>
            <div class="content">
              <h2 class="text-green">資料彙整</h2>
              <p class="description">資料雲端留存，統一管理</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-2.png"
                srcset="/assets/intro/service-2@2x.png"
              >
            </div>
            <div class="content">
              <h2 class="text-green">資料處理</h2>
              <p class="description">線上辨識物種、標註及分析</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-3.png"
                srcset="/assets/intro/service-3@2x.png"
              >
            </div>
            <div class="content">
              <h2 class="text-green">資料共享</h2>
              <p class="description">開放科學，資源共享共用</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="easy">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-5">
            <h2 class="text-green">
              <big>簡單</big><br />
              熟悉的工作介面
            </h2>
            <p class="desp">
              彈性的管理模組讓你可以自行建立計畫所需之樣區層級，並透過目錄結構管理，像使用電腦資料夾一樣，輕鬆歸納大量資料。Camera Trap將慣用的Excel工作介面，套用至平台中，延續原有使用習慣，減少學習時間，能更專注於研究工作！
            </p>

            <div class="img-items text-right">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/easy-item-1.png"
                    srcset="/assets/intro/easy-item-1@2x.png"
                    width="120"
                  >
                </div>
                <div class="content">
                  目錄式結構
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/easy-item-2.png"
                    srcset="/assets/intro/easy-item-2@2x.png"
                    width="120"
                  >
                </div>
                <div class="content">
                  Excel 工作介面
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="effect">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 offset-md-6 text-right">
            <h2 class="text-green">
              <big>效率</big><br />
              高效的管理系統
            </h2>
            <p class="desp pl-5">
              統計各樣區資料回收狀況，透過圖表呈現一目了然，讓管理者能迅速掌握資料進度。連拍補齊功能加速您的標註作業，當您辨識第一筆資料時，被標示為該次連拍的資料會同步填入相同內容。Camera Trap會自動檢核常見錯誤狀況，維持資料正確性，利於進一步的分析
            </p>

            <div class="img-items text-left">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-1.png"
                    srcset="/assets/intro/effect-item-1@2x.png"
                    width="120"
                  >
                </div>
                <div class="content">
                  掌握進度
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-2.png"
                    srcset="/assets/intro/effect-item-2@2x.png"
                    width="120"
                  >
                </div>
                <div class="content">
                  連拍補齊
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-3.png"
                    srcset="/assets/intro/effect-item-3@2x.png"
                    width="120"
                  >
                </div>
                <div class="content">
                  自動檢核
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="professional">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-5">
            <h2 class="text-green">
              <big>專業</big><br />
              標準化的資料處理
            </h2>
            <p class="desp">
              規範資料格式，讓所有資料能在Camera Trap上輕鬆整合，有效串接資料與共享。平台上提供資料篩選功能，能讓您在資料中依自行設定之條件篩選出所需資料，進一步做學術分析。另外，Camera Trap也提供簡易計算功能，您可以直接對平台上的資料進行「有效照片與目擊事件」及「初測延遲」等計算！
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="img-items text-right">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-1.png"
                    srcset="/assets/intro/pro-item-1@2x.png"
                  >
                </div>
                <div class="content">篩選提煉資料</div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-2.png"
                    srcset="/assets/intro/pro-item-2@2x.png"
                  >
                </div>
                <div class="content">線上計算</div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-3.png"
                    srcset="/assets/intro/pro-item-3@2x.png"
                  >
                </div>
                <div class="content">留存共享</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="demo text-center">
      <div class="container">
        <h1 class="text-green">
          Camera Trap
          <br />
          <small>簡易操作，高效管理，輕鬆串連</small>
        </h1>
        <div class="my-5">
          <img
            src="/assets/intro/demo-img.png"
            width="903"
            srcset="/assets/intro/demo-img@2x.png"
          >
        </div>

        <a
          class="btn btn-orange btn-lg"
          @click="loginModalOpen = true"
        >
          立即開始使用
        </a>
      </div>
      <login-modal
        :open="loginModalOpen"
        @close="loginModalOpen = false"
      />
    </section>
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-4 text-center pt-4">
            <img
              src="/assets/intro/footer-logo.png"
              class="logo"
              srcset="/assets/intro/footer-logo@2x.png"
            >
            <div class="mt-2">
              <small class="text-gray">
                Copyright © 2018 Forestry Bureau<br />
                行政院農業委員會林務局 版權所有
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="sitemap">
              <div class="item">
                <label class="text-gray">相關連結</label>
                <ul>
                  <li>
                    <a
                      href="//www.forest.gov.tw"
                      target="_blank"
                    >
                      林務局網站
                    </a>
                  </li>
                  <li>
                    <a
                      href="//tesri.tesri.gov.tw"
                      target="_blank"
                    >
                      特有生物研究保育中心
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://taibif.tw"
                      target="_blank"
                    >
                      台灣生物多樣性資訊入口網
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item">
                <label class="text-gray">幫助</label>
                <ul>
                  <li>
                    <a
                      href="/article.html#/faq"
                      target="_blank"
                    >
                      常見問題
                    </a>
                  </li>
                  <li>
                    <a
                      href="/article.html#/privacy-policy"
                      target="_blank"
                    >
                      隱私權聲明及使用條款
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item">
                <label class="text-gray">聯絡我們</label>
                <ul>
                  <li>
                    <a
                      href="mailto:TaiBIF@gmail.com"
                      target="_blank"
                    >
                      <i class="icon icon-mail-gray"></i> <span class="text">TaiBIF@gmail.com</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+886227899621"
                      target="_blank"
                    >
                      <i class="icon icon-phone-gray"></i>
                      <span class="text">02-27899621</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12">
            <hr>
            <small class="text-center d-block">
              <span class="text-gray">主辦機關：</span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-forest.png"
                  srcset="/assets/intro/logo-forest@2x.png"
                >
                <span class="text">
                  <small>行政院農委會</small>
                  林 務 局
                </span>
              </span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-tesri.png"
                  srcset="/assets/intro/logo-tesri@2x.png"
                >
                <span class="text">
                  <small>行政院農委會</small>
                  特有生物研究保育中心
                </span>
              </span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-taibif.png"
                  srcset="/assets/intro/logo-taibif@2x.png"
                >
                <span class="text">
                  台灣生物多樣性資訊入口網
                </span>
              </span>
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import LoginModal from '../../../components/Header/Login';
export default {
  components: { LoginModal },
  data() {
    return {
      loginModalOpen: false,
    };
  },
};
</script>
