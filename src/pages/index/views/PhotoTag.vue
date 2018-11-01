<template>
  <div class="container calibox">
    <router-link :to="`/project/${$route.params.id}/site/${$route.params.site_id}`" class="text-muted">
      <i class="fa fa-chevron-left"></i> 返回資料編輯
    </router-link>
    <div class="panel panel-default mt-2">
      <div class="panel-heading">
        <h4>進階標註</h4>
      </div>
      <div class="panel-body px-2">
        <div class="row">
          <div class="col-7" @mouseup='focusTokenBasic()'>
            <div class='css_table' 
            @mousedown='imgmd($event)' 
            @mouseup='imgmu($event)' 
            @mousemove='imgmm($event)'>
              <div class='css_tr'>
                <div class='css_td'>
                  <div class='ctrlZone'>
                    <!--
                    <input type='checkbox' v-model='auto_select_full_scope_on_create'/>
                    <span @click='auto_select_full_scope_on_create = !auto_select_full_scope_on_create'>
                      自動選擇全影像
                    </span>
                    <input id='auto-copy-all-tokens' type='checkbox' v-model='auto_copy_all_tokens'/>
                    <span @click='auto_copy_all_tokens = !auto_copy_all_tokens'>
                      追蹤物件
                    </span>
                    -->
                    <div class="row">
                      <div class="col-6">
                        <button id='full-scope' class="btn btn-default btn-sm"
                        v-if='tokenCreating' :disabled="edit_token"
                        @click='selectFullScope()'>
                          全選畫面
                        </button>
                        <button 
                        id='create-new-token-button' 
                        class="btn btn-default btn-sm" 
                        @click='createToken($event)' 
                        v-if="!tokenCreating">
                          建立標註範圍
                        </button>
                      </div>
                      <div class="col-6 text-right">
                        <button 
                        class='main cancel-editing-token-button btn btn-default btn-sm' @click='cancelEditingToken($event)' 
                        v-if='edit_token'>
                          取消選取
                        </button>
                        <button 
                        @click='updateToken()' 
                        id='main_save_xd' 
                        class="btn btn-orange btn-sm ml-2" 
                        v-if='!edit_token==false && tokenCreating'>
                          建立選取範圍
                        </button>
                      </div>
                    </div>
                    <!--
                    <div>
                      <button 
                      v-if='!edit_token==false && !tokenCreating'
                      @mousedown="uiCopyToken($event)">
                        copy token
                      </button>
                    </div>
                    <div>
                      <button data-nodrag 
                      v-if='!uiCopiedToken==false && !edit_token==false' 
                      @mousedown="uiPasteBBox($event)">
                        paste bbox
                      </button>
                      <button id='paste-as-new-token-button' data-nodrag 
                      v-if='!uiCopiedToken==false' 
                      @mousedown="uiPasteToken($event, true)">
                        paste as new
                      </button>
                    </div>
                    <div class="bookmarklet">
                      <a @click="AnnImg()">AnnImg</a>
                    </div>

                    <div id='msg' style='display:inline-block;'></div>
                    -->
                  </div>
                  <div v-if="ann.tokens" class="img-container">
                    <div 
                    v-if='!tokenCreating' 
                    v-for='(token, t_id) in ann.tokens' 
                    :key="`token-${t_id}`" class="bbox" 
                    :class="token.token_id ? token.token_id: ''"
                    :style="{
                      'left': token.bbox.x.min + 'px', 
                      'top': token.bbox.y.min + 'px',
                      'width': (token.bbox.x.max - token.bbox.x.min) + 'px', 
                      'height': (token.bbox.y.max - token.bbox.y.min) + 'px'
                    }"
                    @mouseenter='highlightTree(token.token_id, $event)' 
                    @mouseout='highlightTree(token.token_id, $event)' 
                    @click='setEditToken(token.token_id, $event)'>
                    </div>
                    <div class='outer left' v-if='tokenCreating||!edit_token==false'  aria-hidden="true"></div>
                    <div class='outer top' v-if='tokenCreating||!edit_token==false'  aria-hidden="true"></div>
                    <div class='outer bottom' v-if='tokenCreating||!edit_token==false'  aria-hidden="true"></div>
                    <div class='outer right' v-if='tokenCreating||!edit_token==false'  aria-hidden="true"></div>
                    <div id='edit-bbox' :class="{'show': !edit_token==false}" ></div>
                    <img id='target_image' :src='ann.url' imageonload='img2data()'/>
                      <!-- <br/> -->
                      <!-- <a :href='ann.carrier_url' target='_blank'>圖片來源</a>
                      <input v-model='ann.carrier_url'/>
                      <button @click='simpleSearch({carrier_url: ann.carrier_url})'>
                        載入所有同來源圖片
                      </button>
                      <button class='main_prev_image' @click='switchImage("prev", $event)'>
                        prev
                      </button>
                      <button class='main_next_image' @click='switchImage("next", $event)'>
                        next
                      </button> -->
                  </div>                  
                </div> <!-- end of div.css_td-->

              </div> <!-- end of div.css_tr-->
            </div> <!-- end of div.css_table-->
          </div>
          <div class="col-5 info-container">
            <div class='css_td gray-block tree-container'>
              <div>
                <div>
                  <!--div>
                    <button id='main_rebuild_tree_button' @click='rebuildTree()'>rebuild tree</button>
                    <button class='prev_image' @click='switchImage("prev", $event)'>prev</button>
                    <button class='next_image' @click='switchImage("next", $event)'>next</button>
                    <input class='annConsole' placeholder="here is the console" size='14'/>
                    <input type='checkbox' data-no-text v-model='hover_to_preview' value="true"/><span @click='hover_to_preview = !hover_to_preview'>滑鼠預覽</span>
                  </div-->
                </div>
                <div ui-tree="treeOptions" class='token-basic-tree'>
                  <ol ui-tree-nodes="" id="tree-root">
                    <token-renderer 
                    v-for="(toke,t) in tree.tokens" 
                    :uiCopiedToken="uiCopiedToken"
                    @highlightBox="highlightBox"
                    @uiDeleteToken="uiDeleteToken"
                    @uiCopyToken="uiCopyToken"
                    @uiPasteBBox="uiPasteBBox"
                    @updateUiCopiedToken="(v) => {uiCopiedToken=v}"
                    :edit_token="edit_token"
                    :isReadyToRelate="isReadyToRelate"
                    :classes="classes" 
                    :token="toke" 
                    :index="t" 
                    :key="`token-${t}`"/>
                  </ol>
                </div>
              </div>
            </div><!-- end of level2 css_td -->
            
            <div class='css_td gray-block table-container'>
              <div class="tab-header">
                <a :class="tableIndex==0 ? 'active' : ''" @click="tableIndex=0">進階標註</a>
                <a :class="tableIndex==1 ? 'active' : ''" @click="tableIndex=1">關聯標註</a>
                <a :class="tableIndex==2 ? 'active' : ''" @click="tableIndex=2">標註範圍資料</a>
              </div>
              <div v-if="tableIndex==0">
                <!-- start of edit token -->
                <form v-if='edit_token && !showSelectionBox==false'>
                  <canvas id="canvas" width="400" height="300" style="display: none;" class='ctrl_panel_drag_handle'></canvas>
                  <div md-dynamic-height="" md-border-bottom="">
                    <div label="Data">
                      <table v-if="!edit_token==false && edit_token.data.length">
                        <tr v-for='(data,di) in edit_token.data' :key="`data-${di}`">
                          <td>
                            <input name='data-label' :nrow='`data-${di}`'
                            :data-row="di"
                            class='user-input user-input-data data-label user-input-first-cell' placeholder="Label">
                          </td>
                          <td>
                            <input name='data-key' :nrow='`data-${di}`' 
                            :data-row="di"
                            class='`user-input user-input-data data-key`' v-model='edit_token.data[di].key' placeholder="Key">
                          </td>
                          <td>
                            <input 
                            autocomplete="off" 
                            name='data-value' 
                            class='user-input user-input-data data-value'
                            :nrow='`data-${di}`'
                            :data-row="di"  
                            placeholder="Value" 
                            v-model='edit_token.data[di].value' 
                            @change='autoValues(di)' 
                            @blur='cellBlurred($event)'>
                            <div :data-key="edit_token.data[di].key" v-if='showSelectionBox[edit_token.token_id + "_" + edit_token.data[di].key + "-di-" + di]'>
                              <span class='elm_searh' 
                              v-for="(v, elmId) in autoRes[edit_token.data[di].key]" 
                              :key="`elem-${elmId}`" 
                              @mouseenter='elmSearchME(elmId)' 
                              @mouseleave='elmSearchML(elmId)' 
                              :style='elmSearchStyleInd[elmId]||elmSearchStyle' 
                              @click='autoValueClicked(di, v)'>
                                <span 
                                :style='elmSearchStyleInd[elmId]||elmSearchStyle' v-html="v.matched">
                                </span>
                                <br/>
                              </span>
                            </div>
                            <div></div>
                          </td>
                          <td>
                            <input name='data-unit' 
                            class='user-input user-input-data data-unit' 
                            :nrow='`data-${di}`' 
                            placeholder="Unit" 
                            v-model='edit_token.data[di].unit' 
                            :class='{"last-data-cell": (di==edit_token.data.length-1)}' 
                            @focus='addDataEntry(di==edit_token.data.length-1)'></td>
                        </tr>
                      </table>
                      <div class="col-12 mt-2 mb-3">
                        <button class='btn btn-sm btn-default add-a-row-button add-data mr-2' 
                        @click='addDataEntry(true)'>
                          Add a row
                        </button>
                        <button class="btn btn-sm btn-default mr-2" @click='updateToken()'>Save</button>
                        <button class='btn btn-sm btn-default cancel-editing-token-button' @click='cancelEditingToken($event)' v-if='edit_token'>cancel editing token</button>
                      </div>
                    </div>
                  </div><!-- end of edit token -->
                </form>
              </div>
              <div v-if="tableIndex==1">
                <form v-if='edit_token && !showSelectionBox==false'>
                  <div label="Relations">
                    <table v-if="!edit_token==false && !edit_token.relations==false">
                      <!--tr>
                        <th>Context</th><th>Relation</th><th>Object</th>
                      </tr-->
                      <tr v-for='(rel,ri) in edit_token.relations' :key="`tr-itemn-${ri}`">
                        <td>
                          <input :nrow='`relation-${ri}`' name='relation-context' :class="`relation-row-${ri}`" class='user-input user-input-relation relation-context user-input-first-cell' v-model='edit_token.relations[ri].context' placeholder="Context">
                        </td>
                        <td>
                          <input name='relation-relation' :nrow='`relation-${ri}`' :class='`relation-row-${ri}`' class='user-input user-input-relation relation-relation' v-model='edit_token.relations[ri].relation' placeholder="Relation">
                        </td>
                        <td>
                          <input name='relation-object' :nrow='`relation-${ri}`' class='user-input user-input-relation relation-object' @keydown="ctrlPasteCopiedToken($event, ri)" v-model='edit_token.relations[ri].object' placeholder="Object" @focus="readyToRelate($event, ri);addRelEntry(ri==edit_token.relations.length-1);" @blur="cancelToRelate($event)" :class='{"last-relation-cell" : (di==edit_token.data.length-1)}'>
                        </td>
                        <td>
                          <div v-if="!!rel.object" @click="resolveUrlToken($event, rel.object)">resolve</div>
                        </td>
                        <td>
                          <button v-if="isReadyToRelate" @mousedown="tokenIDFromCopiedToken($event, ri)">Paste Copied Token</button>
                        </td>
                      </tr>
                    </table>
                    <div class="col-12 mt-2 mb-3">
                      <button class='btn btn-sm btn-default add-a-row-button add-relation mr-2' @click='addRelEntry(true)'>Add a row</button>
                      <button class="btn btn-sm btn-default mr-2" @click='updateToken()'>Save</button>
                      <button class='btn btn-sm btn-default cancel-editing-token-button' @click='cancelEditingToken($event)' v-if='edit_token'>cancel editing token</button><br/>
                    </div>
                  </div>
                </form>
              </div>
              <div v-if="tableIndex==2">
                <div class='css_table' v-if='edit_token'>
                  <div class="row">
                    <div class="col-4 text-right">Token ID：</div>
                    <div class="col-8"><input v-model='edit_token.token_id'></div>
                  </div>
                  <div class='row'>
                    <div class='col-4 text-right'>Description Lvl：</div>
                    <div class='col-8'><input v-model='edit_token.description_level'></div>
                  </div>
                  <div class='row'>
                    <div class='col-4 text-right'>Parent ID：</div>
                    <div class='col-8'><input v-model='edit_token.meta.parent_id'></div>
                  </div>
                  <div class='row'>
                    <div class='col-4 text-right'>Virtual Idv. ID：</div>
                    <div class='col-8'>
                      <input name='viid' v-model='edit_token.meta.virtual_individual_id' @keydown="ctrlPasteSth($event)">
                    </div>
                    <div class='col-8 offset-4 mt-1 mb-2'>
                      <button class="btn btn-sm btn-default mr-2" @click='edit_token.meta.virtual_individual_id = uuid();'>new</button>
                      <button class="btn btn-sm btn-default" @click='simpleSearch({viid: edit_token.meta.virtual_individual_id})'>look for me</button>
                    </div>
                  </div>
                  <div class='row'>
                    <div class='col-4 text-right'>Virtual Part ID：</div>
                    <div class='col-8'>
                      <input name='vpid' v-model='edit_token.meta.virtual_part_id' @keydown="ctrlPasteSth($event)">
                    </div>
                    <div class='col-8 offset-4 mt-1 mb-2'>
                      <button class="btn btn-sm btn-default" @click='edit_token.meta.virtual_part_id = uuid();'>new</button>
                    </div>
                  </div>
                </div>
                <div v-if="edit_token && !current_token==false">
                  <h3>{{current_token.description_level}}</h3>
                  <table>
                    <tr 
                    v-for='(data,di) in current_token.data' 
                    :key="`current_token-key-${di}`">
                      <td>{{data.label||data.key}}</td>
                    </tr>
                    <tr 
                    v-for='(data,di) in current_token.data' 
                    :key="`current_token-value-${di}`">
                      <td>{{data.value}} {{data.unit}}</td>
                    </tr>
                  </table>
                </div>
                <!--label>你不能只是亢亢就好ㄇ3r 森77</label-->
              </div>
            </div><!-- end of level2 css_td -->
          </div>
        </div>
      </div>
    </div>
    <div style='display:none;'>
      <label>DEBUG INFO</label>
      <textarea disabled style='width:100%; height: 400px;'></textarea>
      <iframe id='carrier_frame' style='display:none;'></iframe>
      <!--iframe id='carrier_frame' width="800" height="600"></iframe-->
    </div>
  </div>
</template>

<script>
import "../../../mixins/ann.js";
import { mapGetters } from "vuex";
import TokenRenderer from "../components/TokenRenderer";

const Token = function(obj) {
  this.obj = obj;
  this.token_id = Math.uuid().toLowerCase();
  this.description_level = "individual";
  this.meta = {};
  this.meta.virtual_individual_id = Math.uuid().toLowerCase();
  this.meta.original_virtual_individual_id = this.meta.virtual_individual_id;
  this.meta.virtual_part_id = Math.uuid().toLowerCase();
  this.meta.original_virtual_part_id = this.meta.virtual_part_id;
  this.bbox = {};
  this.data = [];
  this.relations = [];
}

Token.prototype = {
  isGroup() {
    if (!this.description_level) return false;
    var isGroup = false;
    this.description_level.split("-").forEach((part) => {
      if (this.obj.group_terms.indexOf(part) > -1) {
        isGroup = true;
      }
    });
    return isGroup;
  },

  create() {
    this.token_id = Math.uuid().toLowerCase();

    this.description_level = "individual";
    this.meta = {};
    this.meta.virtual_individual_id = Math.uuid().toLowerCase();
    this.meta.original_virtual_individual_id = this.meta.virtual_individual_id;
    this.meta.virtual_part_id = Math.uuid().toLowerCase();
    this.meta.original_virtual_part_id = this.meta.virtual_part_id;
    this.bbox = {};
    this.data = [];
    this.relations = [];
  },

  cloneToken(token) {
    this.token_id = this.obj._getUrlToken(token.token_id).token_id;
    this.description_level = token.description_level;
    this.cloneBBox(token.bbox);
    this.cloneMeta(token.meta);
    this.cloneData(token.data);
    this.cloneRel(token.relations);
  },

  cloneDataAndRelation(token) {
    this.cloneData(token.data);
    this.cloneRel(token.relations);
  },

  cloneBBox(bbox) {
    if (!bbox) {
      bbox = {};
    }
    this.bbox = window.$.extend(true, {}, bbox);
  },

  getBBox() {
    return window.$.extend(true, {}, this.bbox);
  },

  cloneMeta(meta) {
    if (!meta) {
      meta = {};
    }
    this.meta = window.$.extend(true, {}, meta);
  },

  cloneData(data) {
    if (!data) {
      data = [];
    }
    var cloned_data = [];
    data.forEach((d) => {
      var cloned_d = window.$.extend(true, {}, d);
      cloned_data.push(cloned_d);
    });
    this.data = cloned_data;
  },

  cloneRel(rel) {
    if (!rel) {
      rel = [];
    }
    var cloned_rel = [];
    rel.forEach((r) => {
      var cloned_r = window.$.extend(true, {}, r);
      cloned_r.object = this.obj._makeUrlToken(null, cloned_r.object);
      cloned_rel.push(cloned_r);
    });
    this.relations = cloned_rel;
  },

  removeEmptyDataEntry() {
    if (this.data.length == 0) return;
    this.data = this.data.filter((el) => {
      if (!el.key.toString().trim() == false) {
        return true;
      } else {
        return false;
      }
    });
  },

  removeEmptyRelEntry() {
    if (this.relations.length == 0) return;
    this.relations = this.relations.filter((el) => {
      if (!el.relation.toString().trim()==false && !el.object.toString().trim()==false) {
        return true;
      } else {
        return false;
      }
    });
  },

  ensureGroup() {
    //this.meta.virtual_individual_id = null;
    //this.meta.virtual_part_id = null;
  }
};

export default {
  name: "photoTag",
  components: { TokenRenderer },
  computed: {
    ...mapGetters(["ImageInfo"])
  },
  data() {
    return {
      tableIndex: 0,
      ann: {},
      found: {},
      current_token: null,
      showSelectionBox: {},
      edit_token_form: {},
      classes: {},
      autoRes: {},
      hover_to_preview: false,
      edit_token: null,
      uiCopiedToken: null,
      auto_select_full_scope_on_create: false,
      tokenCreating: false,
      elmSearchStyle: { "background-color": "white", color: "black" },
      elmSearchStyleInd: null,
      current_query_id: 0,
      color_names: [
        "navy",
        "blue",
        "aqua",
        "teal",
        "olive",
        "green",
        "lime",
        "yellow",
        "orange",
        "fuchsia",
        "purple",
        "maroon",
        "gray",
        "silver",
        "black"
      ],
      image_list: [],
      hasMergedSessionImageList: !!window.localStorage.getItem("mergedList"),
      max_retry: 5,
      retry: 0,
      auto_copy_all_tokens: false,
      image_url: [],
      hasSolidImageList: false,
      current_image_idx: 0,
      try_to_focus_me: null,
      group_terms: ["group"],
      tree: { tokens: [] },
      treeOptions: {
        dropped: function() {
          // var ffss = 5566;
        }
      },
      token_id: null,
      description_level: "individual",
      meta: {},
      bbox: {},
      data: [],
      relations: []
    };
  },
  methods: {
    AnnImg() {
      var images = [];
      var imgs = document.getElementsByTagName('img');
      if (imgs.length > 0) {
        for (var i=0; i < imgs.length; i++) {
          var img = imgs[i];
          if (img.width >= 250 && img.height >= 250) {
            images.push(img.src);
          }
        }
      }

      var iframeWins = document.getElementsByTagName('iframe');
      for (var j=0; j < iframeWins.length; j++) {
        var frm = iframeWins[j];
        try {
          var frm_imgs = frm.contentWindow.document.getElementsByTagName('img');
          if (frm_imgs.length > 0) {
            for (var k=0; k < frm_imgs.length; k++) {
              var frm_img = frm_imgs[k];
              if (frm_img.width >= 300 && frm_img.height >= 300) {
                images.push(frm_img.src);
              }
            }
          }
        }
        catch (err) {
          console.log(err.message);
        }
      }

      var rulesForCssText = function (styleContent) {
          var doc = document.implementation.createHTMLDocument(''),
              styleElement = document.createElement('style');

        styleElement.textContent = styleContent;
          /* the style will only be parsed once it is added to a document */
          doc.body.appendChild(styleElement);

          return styleElement.sheet.cssRules;
      };

      var flickr_bgimg_divs = document.getElementsByClassName('photo-list-photo-view');
      for (var d=0; d < flickr_bgimg_divs.length; d++) {
        var csstxt = 'div { ' + flickr_bgimg_divs[d].getAttribute('style') + '}';
        var css = rulesForCssText(csstxt);
        var bgImgMatch = css[0].style.backgroundImage.match(/^url\(&quot;(.+)&quot;\)$/);
        if (!bgImgMatch==false) {
          var bgImg = bgImgMatch[1].match(/^http/) ? bgImgMatch[1] : window.location.protocol + bgImgMatch[1];
          images.push(bgImg);
        }
      }

      var carrier_url = window.location.href;
      var images_string = JSON.stringify(images);
      var title = document.getElementsByTagName('title');
      if (title.length > 0) {
        title = encodeURIComponent(title[0].innerHTML);
      } else {
        title = 'TBD';
      }
      var ann_url = 'http://twebi.net/imgAnn/ann.html?bookmarklet=true&amp;images_string=' + encodeURIComponent(images_string) + '&amp;carrier_url=' + encodeURIComponent(carrier_url) + '&amp;title=' + title;

      window.open(ann_url, 'annImg');
    },
    uiCopyToken(e) {
      e.stopPropagation();
      if (!window.$.isEmptyObject(this.edit_token)) {
        this.uiCopiedToken = new Token(this);
        this.uiCopiedToken.cloneToken(this.edit_token);
        this.uiCopiedToken.token_id =
          this.ann.url + "#" + this.edit_token.token_id;
      }
      window.localStorage.setItem(
        "ui_copied_token_id",
        this.ann.url + "#" + this.edit_token.token_id
      );
      window.localStorage.setItem("ui_copied_token", this.uiCopiedToken);
    },
    uiPasteBBox(e) {
      e.stopPropagation();

      this.uiCopiedToken = JSON.parse(localStorage.getItem("ui_copied_token"));

      if (
        !window.$.isEmptyObject(this.edit_token) &&
        !window.$.isEmptyObject(this.uiCopiedToken) &&
        !window.$.isEmptyObject(this.uiCopiedToken.bbox)
      ) {
        // this.edit_token_form.$setDirty();
        this.edit_token.cloneBBox(this.uiCopiedToken.bbox);
        this.styleEditBox(this.edit_token.getBBox());
        var b = window.caliBox(this.uiCopiedToken.token_id);
        window._lightbox(b);
      }
    },
    uiPasteToken(e, asNew, dataOnly) {
      e.stopPropagation();
      asNew = !asNew == false;
      dataOnly = !dataOnly == false;

      this.uiCopiedToken = JSON.parse(
        window.localStorage.getItem("ui_copied_token")
      );

      if (!window.$.isEmptyObject(this.uiCopiedToken)) {
        // this.edit_token_form.$setDirty();
        if (window.$.isEmptyObject(this.edit_token) || asNew) {
          this.createToken();
          this.edit_token = new Token(this);
          this.edit_token.create();
          window.$("#target_image").css("opacity", 1);
        }

        var edit_token_id = this.edit_token.token_id;

        if (dataOnly) {
          this.edit_token.cloneDataAndRelation(this.uiCopiedToken);
        } else {
          this.edit_token.cloneToken(this.uiCopiedToken);
        }

        this.edit_token.token_id = edit_token_id;
        this.styleEditBox(this.edit_token.getBBox());
        var b = window.caliBox(null, null, this.edit_token.getBBox());
        window._lightbox(b);
      }
    },
    uiDeleteToken(e, tid) {
      this.tokenDeleting = true;

      e.stopPropagation();
      console.log("deleting");
      if (
        !window.$.isEmptyObject(this.edit_token) &&
        this.edit_token.token_id == tid
      ) {
        this.edit_token = null;
      }

      this.tokens[tid] = undefined;
      this.classes[tid] = undefined;
      this.bbox[tid] = undefined;
      this.meta[tid] = undefined;
      this.boxStyle[tid] = undefined;

      var token_exists = false;
      var which_token = -1;
      this.ann.tokens.some((el, idx) => {
        if (tid == el.token_id) {
          which_token = idx;
          token_exists = true;
        }
        return token_exists;
      });

      this.ann.tokens.splice(which_token, 1);
      var token = null;
      this.tree = { tokens: [] };

      for (let i = 0; i < this.ann.tokens.length; i++) {
        token = this.ann.tokens[i];
        token.tokens = [];
      }
      for (let i = 0; i < this.ann.tokens.length; i++) {
        token = this.ann.tokens[i];
        if (!token.meta || !token.meta.parent_id) {
          this.tree.tokens.push(token);
        } else {
          if (!this.tokens[token.meta.parent_id] == false) {
            this.tokens[token.meta.parent_id].tokens.push(token);
          } else {
            this.tree.tokens.push(token);
          }
        }
      }
      this.rebuildTree();
      // this.edit_token_form.$setDirty();
      this.tokenDeleting = false;
    },
    selectFullScope() {
      if (!this.tokenCreating == false && !this.edit_token) {
        // this.edit_token_form.$setDirty();
        this.edit_token = new Token(this);
        this.edit_token.create();
        window.$("#target_image").css("opacity", 1);

        this.styleEditBox({ full_scope: true });
      }
    },
    readyToRelate(ri) {
      this.isReadyToRelate = true;
      this.tokenRelationIdx = ri;
    },
    cancelToRelate() {
      this.isReadyToRelate = false;
      this.tokenRelationIdx = null;

      if (!window.$.isEmptyObject(this.edit_token)) {
        this.current_token = this.tokens[this.edit_token.token_id];
        window.draw(this.current_token.token_id);
      }
    },
    setRelationObject(e, token_id) {
      e.preventDefault();
      this.edit_token.relations[this.tokenRelationIdx].object = token_id;
    },
    formatJSON(obj) {
      console.log('formatJSON', obj)
      if (!window.$.isEmptyObject(obj)) {
        return JSON.stringify(JSON.parse(obj), null, 4);
      }
    },
    _leaveWOSave() {
      var action = this.tokenCreating ? "建立" : "編輯";
      if (
        (this.tokenCreating && !this.edit_token == false) 
        // ||
        // (!this.edit_token_form == false && this.edit_token_form.$dirty)
      ) {
        var leaveWOSave = confirm("文件" + action + "中，確定離開?");
        // if (leaveWOSave) this.edit_token_form.$setPristine();
        return leaveWOSave;
      }
      return true;
    },
    switchImage(direction, e) {
      if (!this._leaveWOSave()) {
        return;
      }

      var last_image_idx = this.current_image_idx;

      e.stopPropagation();

      switch (direction) {
        case "prev":
          if (this.current_image_idx > 0) {
            this.current_image_idx = this.current_image_idx - 1;
          }
          break;
        case "next":
        default:
          if (this.current_image_idx < this.image_list.length - 1) {
            this.current_image_idx = this.current_image_idx + 1;
          }
          break;
      }
      if (last_image_idx != this.current_image_idx) {
        this._selectImage(this.current_image_idx);
      }
    },
    _getTokens(tokens) {
      var tmpTokens = [];
      tokens.forEach(token => {
        var tmp = new Token(this);
        tmp.cloneToken(token);
        tmpTokens.push(tmp);
      });
      return tmpTokens;
    },
    updateToken() {
      if (window.$.isEmptyObject(this.edit_token)) {
        this.saveAnnotation();
        return;
      }

      window.$("#edit-bbox").click();
      this.edit_token.removeEmptyDataEntry();
      this.edit_token.removeEmptyRelEntry();

      var new_box = {
        full_scope: false,
        original_point: "topleft",
        x: {
          min: window.ann_token_bbox.x.min,
          max: window.ann_token_bbox.x.max
        },
        y: {
          min: window.ann_token_bbox.y.min,
          max: window.ann_token_bbox.y.max
        }
      };

      var et = this.edit_token;

      if (et.isGroup()) et.ensureGroup();

      var token_exists = false;
      var which_token = -1;
      this.ann.tokens.some(function(el, idx) {
        if (et.token_id == el.token_id) {
          which_token = idx;
          token_exists = true;
        }
        return token_exists;
      });

      et.cloneBBox(new_box);
      this.tokens[et.token_id] = et;
      this.bbox[et.token_id] = new_box;
      this.meta[et.token_id] = et.meta;
      this.boxStyle[et.token_id] = this.styleMyBox(new_box);

      if (!token_exists) {
        et.tokens = [];
        this.classes[et.token_id] = {};
        this.classes[et.token_id][et.token_id] = true;
        this.classes[et.token_id]["token-basic"] = true;
        this.ann.tokens.push(et);
        this.tree.tokens.push(et);
      } else if (which_token > -1) {
        this.ann.tokens[which_token].cloneToken(et);
      }

      window.tokenCreating = this.tokenCreating = false;

      // this.ann.relations[this.edit_token.token_id] = cloneRel(this.edit_token.relations);

      // should be done in rebuildTree?
      // this.edit_token = null;

      window.$("button#create-new-token-button").attr("disabled", null);

      // should be done in rebuildTree?
      // $('.token-basic').removeClass("focus");

      this.saveAnnotation();

      // var dataToSave = this._pruneAnn(this.ann);
      // this.$http.post("/annotation/mongo_save.php", dataToSave, true) // using post
      //   .then((ret) => {
      //     console.log('Content saved');
      //     console.log(ret);
      //     this.edit_token_form.$setPristine();
      //     this.setEditToken(edit_token_id, null, true);
      //   });
      //*/
    },
    _getImageList() {
      if (
        this.ImageInfo.bookmarklet &&
        !this.hasSolidImageList &&
        !this.ImageInfo.image_list == false
      ) {
        this.image_list = this.ImageInfo.image_list;
        this.carrier_url = this.ImageInfo.carrier_url;
        this.mm_source = this.ImageInfo.title;

        console.log(this.image_list);
        if (this.image_list.length > 0) {
          this.image_list.forEach(imgsrc => {
            this.image2carrier[imgsrc] = this.ImageInfo.carrier_url;
          });
          document
            .querySelector("#carrier_frame")
            .setAttribute("src", this.carrier_url);
          this._selectImage(0);
        }
      } else {
        // display demo contents
        this.$http.get("/annotation/image_list.json", {}).then(ret => {
          this.image_list = ret;
          this._selectImage(0);
        });
      }
    },
    _getUrlToken(urlToken) {
      if (!urlToken) return "";

      var frags = urlToken.split("#");
      if (frags.length >= 2) {
        var token_id = null;
        var url;
        var which = -1;
        frags.some(function(f, i) {
          if (
            f.match(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            )
          ) {
            token_id = f;
            which = i;
            return true;
          }
        });

        if (which > -1) {
          frags.splice(which, 1);
        }
        url = frags.join("");
      } else {
        if (
          frags[0].match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          )
        ) {
          token_id = frags[0];
          url = this.ann.url;
        } else {
          token_id = null;
          url = frags[0];
        }
      }
      return {
        url: url,
        token_id: token_id
      };
    },
    _makeUrlToken(url, token_id) {
      if (!token_id) return "";

      var frags = [];

      var test = this._getUrlToken(token_id);
      token_id = test.token_id;

      if (!url == false) {
        frags.push(url);
      } else if (!test.url == false) {
        frags.push(test.url);
      } else {
        frags.push(this.ann.url);
      }

      frags.push(token_id);
      return frags.join("#");
    },
    setEditToken(tid, e, skip_e) {
      if (!this._leaveWOSave()) return;

      this.cancelToRelate();
      var $e_target = null;

      if (this.tokenCreating) return;

      window.orig_bbox = false;

      this.current_token = this.tokens[tid];

      if (!skip_e) {
        if (!window.showAnnCtrl) {
          $("#tree_and_form_toggle").click();
        }
        if (window.$(e.target).hasClass("bbox") > -1) {
          $e_target = window.$("." + tid + ".token-basic")[0];
        } else if (window.$(e.target).hasClass("token-basic") > -1) {
          $e_target = e.target;
        } else {
          $e_target = window.$(e.target).parents(".token-basic")[0];
        }

        window.$(".token-basic").removeClass("focus");
        window.$($e_target).addClass("focus");

        $e_target.classList.forEach(function(c) {
          var m = c.match(/^tree-simple-id-(.+)$/);
          if (!!m && !!m[1]) {
            window.focusedTokenSimpleID = m[1];
          }
        });
      }

      if (!window.$.isEmptyObject(this.edit_token)) {
        this.edit_token.removeEmptyDataEntry();
        this.edit_token.removeEmptyRelEntry();
      } else {
        this.edit_token = new Token(this);
      }
      
      this.edit_token.cloneToken(this.current_token);
      this.styleEditBox(this.bbox[this.edit_token.token_id]);
      
      // this.edit_token.relations = (!!this.ann.relations[this.edit_token.token_id] && this.ann.relations[this.edit_token.token_id].length > 0)?cloneRel(this.ann.relations[this.edit_token.token_id]):[];


      window.draw(this.edit_token.token_id);
      this.addDataEntry(true);
      this.addRelEntry(true);

      this.tokenCreating = true;
      
      var $target_image = window.$('#target_image');
      var px = e.pageX - $target_image.offset().left;
      var py = e.pageY - $target_image.offset().top;
      var start_x = this.edit_bbox.start_x;
      var start_y = this.edit_bbox.start_y;
      var x = Math.min(px, start_x);
      var y = Math.min(py, start_y);
      var max_x = Math.max(px, start_x);
      var max_y = Math.max(py, start_y);
      var w = max_x - x;
      var h = max_y - y;


      var b = {
        x: x,
        y: y,
        min_x: x,
        min_y: y,
        max_x: max_x,
        max_y: max_y,
        w: w,
        h: h
      };
      
      window._lightbox(b)
      // if (window.$(".token-basic." + tid).length > 0 && window.showAnnCtrl) {
      //   window.$(".token-basic-tree").animate(
      //     {
      //       scrollTop:
      //         window.$(".token-basic." + tid).offset().top -
      //         window.$(".token-basic." + tid).parents("#tree-root").offset().top
      //     },
      //     200
      //   );
      // }

    },
    _getImageData(url) {
      if (!url == false) {
        this.image_url = url;
      }

      if (!this.image_url == false) {
        if (window.location.port == "8888") {
          let ret = {
            url: this.image_url,
            carrier_url:
              !this.image2carrier[this.image_url] == false
                ? this.image2carrier[this.image_url]
                : "",
            source: this.mm_source
          };
          this.startAnnotation(ret);
        } else {
          var query_id = this.current_query_id;
          this.current_query_id += 1;
          this.$http
            .post(
              "/annotation/mongo_load.php",
              { url: this.image_url, qid: query_id },
              true
            )
            .then(ret => {
              console.log(ret);
              if (!ret.result || ret.result == "null") {
                ret = [];
                var json_file = "/annotation/annotation.empty.json";
                ret.forEach(e => {
                  if (e.image_url == this.image_url) json_file = e.json_file;
                });

                this.$http.get(json_file, {}).then(ret => {
                  ret.url = this.image_url;
                  ret.carrier_url =
                    !this.image2carrier[this.image_url] == false
                      ? this.image2carrier[this.image_url]
                      : "";
                  ret.source = this.mm_source;
                  this.startAnnotation(ret);
                });
              } else {
                if (ret.query.qid === query_id) {
                  this.startAnnotation(ret.result);
                }
              }
            });
        }
      } else {
        // should not happen
        this.$http.get("/annotation/annotation.empty.json").then(ret => {
          this.startAnnotation(ret);
        });
      }
    },
    _pruneAnn(ann) {
      var tmpAnn = window.$.extend(true, {}, ann);
      delete tmpAnn._id;
      tmpAnn.tokens = this._getTokens(ann.tokens);
      tmpAnn.tokens.forEach(function(t) {
        t.tokens = undefined;
      });
      return tmpAnn;
    },
    styleMyBox(box) {
      
      var boxStyle = {};

      if (box.full_scope) {
        var $target_image = document.querySelector("#target_image");
        var img_h = $target_image.clientHeight;
        var img_w = $target_image.clientWidth;
        boxStyle.width = img_w;
        boxStyle.height = img_h;
      } else {
        boxStyle.left = box.x.min;
        boxStyle.top = box.y.min;
        boxStyle.width = box.x.max - box.x.min;
        boxStyle.height = box.y.max - box.y.min + 3;
      }

      return boxStyle;
    },
    styleEditBox(bbox) {
      var editBoxStyle = this.styleMyBox(bbox);
      window.$("#edit-bbox")
        .css("height", editBoxStyle.height)
        .css("width", editBoxStyle.width)
        .css("left", editBoxStyle.left)
        .css("top", editBoxStyle.top);
    },
    startAnnotation(ret) {
      if (!this.auto_copy_wall_tokens || ret.tokens.length > 0) {
        this.ann = {};
      } else {
        var old2New = {};
        this.ann.tokens.forEach(t => {
          var tmp = new Token(this);
          tmp.create();
          var tmp_token_id = tmp.token_id;
          old2New[t.token_id] = tmp_token_id;
          tmp.cloneToken(t);
          tmp.token_id = tmp_token_id;
          ret.tokens.push(tmp);
        });

        ret.tokens.forEach(t => {
          if (!!t.meta && !!t.meta.parent_id) {
            t.meta.parent_id = old2New[t.meta.parent_id];
          }
        });
      }

      console.log(ret)
      var ann_json = ret;

      this.ann.url = ann_json.url;
      var tmp_carrier_url = ann_json.carrier_url;
      this.ann.carrier_url = tmp_carrier_url;
      this.carrier_url = tmp_carrier_url;

      if (
        this.hasSolidImageList &&
        document.querySelector("#carrier_frame").src !== this.carrier_url
      ) {
        document
          .querySelector("#carrier_frame")
          .setAttribute("src", this.carrier_url);
      }

      var tokens = [];

      if(!ann_json.tokens==false) {
        for (var i = 0; i < ann_json.tokens.length; i++) {
          var token = new Token(this);
          token.cloneToken(ann_json.tokens[i]);
          if (!token.data) token.data = [];
          if (!token.relations) token.relations = [];

          if (!token.meta==false) {
            if (!token.meta.original_virtual_individual_id) {
              token.meta.original_virtual_individual_id = token.meta.virtual_individual_id;
            }
            if (!token.original_virtual_part_id) {
              token.meta.original_virtual_part_id = token.meta.virtual_part_id;
            }
          }

          this.tokens[token.token_id] = token;

          if (!this.classes[token.token_id]) {
            this.classes[token.token_id] = {};
          }
          this.classes[token.token_id][token.token_id] = true;
          this.classes[token.token_id]['token-basic'] = true;

          if (!window.$.isEmptyObject(token.bbox)) {
            this.bbox[token.token_id] = token.bbox;
          }
          else {
            this.bbox[token.token_id] = this.bbox[token.meta.parent_id];
          }

          token.tokens = [];

          var color_name = this.color_names[i % this.color_names.length];

          var box = this.bbox[token.token_id];

          var boxStyle = this.styleMyBox(box, color_name);
          this.boxStyle[token.token_id] = boxStyle;
          tokens.push(token);
        }
      }
      
      for (var j = 0; j < tokens.length; j++) {
        token = tokens[j];
        if (!token.meta || !token.meta.parent_id) {
          this.tree.tokens.push(token);
        }
        else {
          if (!this.tokens[token.meta.parent_id]==false) 
            this.tokens[token.meta.parent_id].tokens.push(token);
          else 
            this.tree.tokens.push(token);
        }
      }

      ann_json.tokens = tokens;
      ann_json.relations = undefined;

      this.ann = ann_json;
      //this.ann.url = 'example001.png';

      // this.rebuildTree();
    },
    saveAnnotation(_callback) {
      var edit_token_id = null;
      if (!window.$.isEmptyObject(this.edit_token)) {
        edit_token_id = this.edit_token.token_id;
      }
      this.rebuildTree();

      var args = arguments;
      var dataToSave = this._pruneAnn(this.ann);
      this.$http
        .post("/annotation/mongo_save.php", dataToSave, true) // using post
        .then(function(ret) {
          console.log("Content saved");
          console.log(ret);

          // this.edit_token_form.$setPristine();
          if (edit_token_id) {
            this.setEditToken(edit_token_id, null, true);
          }

          if (typeof _callback == "function") {
            window._callback(args);
          }
        });
    },
    _initAnn() {
      window.tokenCreating = this.tokenCreating = false;
      this.current_token = null;
      this.edit_token = null;

      if (!this.auto_copy_all_tokens) {
        this.ann = {};
      }

      this.isReadyToRelate = false;
      this.tokenRelationIdx = null;

      this.classes = {};
      this.bbox = {};
      this.meta = {};
      this.tokens = {};
      this.boxStyle = {};

      this.tree = { tokens: [] };
      this.uiCopiedToken = JSON.parse(
        window.localStorage.getItem("ui_copied_token")
      );
    },
    _selectImage(idx) {
      this.image_url = this.image_list[idx]; // + '&t=' + new Date().getTime();
      this.current_image_idx = idx;
      this.files = [];
      this._initAnn();
      this._getImageData();
    },
    highlightAllBox() {
      window.$(".bbox").show();
      if (!this.edit_token == false) {
        window.$("#edit-bbox").click();
      }
    },
    highlightBox(tid) {
      //e.stopPropagation();
      if (
        window.$.isEmptyObject(this.edit_token) ||
        this.isReadyToRelate ||
        this.hover_to_preview
      ) {
        this.current_token = this.tokens[tid];
        window.draw(this.current_token.token_id);
      } else if (!window.$.isEmptyObject(this.edit_token)) {
        this.current_token = new Token(this);
        this.current_token.cloneToken(this.edit_token);

        if (!this.tokenCreating) {
          window.draw(this.current_token.token_id);
        }
      }

      window.$(".bbox").hide();
      window.$("." + tid).show();
    },
    highlightTree(tid, e) {
      console.log(e)
      e.stopPropagation();
      if(e.type=='mouseout') {
        window.$("." + tid + ".token-basic").removeClass("hover");
      } else {
        window.$(".token-basic").removeClass("hover");
        window.$("." + tid + ".token-basic").addClass("hover");
      }
    },
    addDataEntry(add) {
      if (!add) return;
      var defaultFields = {
        "category-zhtw": {
          label: "類群",
          key: "category-zhtw",
          value: "",
          unit: ""
        },
        "name-vernacular-zhtw": {
          label: "物種中名",
          key: "name-vernacular-zhtw",
          value: "",
          unit: ""
        },
        "name-scientific": {
          label: "物種學名",
          key: "name-scientific",
          value: "",
          unit: ""
        },
        color: {
          label: "顏色",
          key: "color",
          value: "",
          unit: ""
        },
        date: {
          label: "拍照日期",
          key: "date",
          value: "",
          unit: ""
        },
        locality: {
          label: "地點",
          key: "locality",
          value: "",
          unit: ""
        },
        "wgs84-y": {
          label: "緯度",
          key: "wgs84-y",
          value: "",
          unit: ""
        },
        "wgs84-x": {
          label: "經度",
          key: "wgs84-x",
          value: "",
          unit: ""
        }
      };

      if (!this.edit_token == false && !this.edit_token.data == false) {
        this.edit_token.data.forEach(d => {
          if (!defaultFields[d.key] == false) {
            delete defaultFields[d.key];
          }
        });

        for (var key in defaultFields) {
          if (defaultFields.hasOwnProperty(key)) {
            this.edit_token.data.push({
              label: defaultFields[key].label,
              key: defaultFields[key].key,
              value: defaultFields[key].value,
              unit: defaultFields[key].unit
            });
          }
        }

        this.edit_token.data.push({
          label: "",
          key: "",
          value: "",
          unit: ""
        });
      }
    },
    addRelEntry(add) {
      if (add && this.edit_token) {
        this.edit_token.relations.push({
          context: "",
          relation: "",
          object: ""
        });
      }
    },
    cancelEditingToken(e) {
      if (!e == false) e.stopPropagation();
      else return;

      if (!this._leaveWOSave()) {
        return;
      }
      window.tokenCreating = this.tokenCreating = false;
      window.$(".token-basic").removeClass("focus");
      this.edit_token = null;
      window.$("button#create-new-token-button").attr("disabled", null);
      this.highlightAllBox();
      window.$("#target_image").css("opacity", 1);
    },
    imgmd(e) {
      if (["INPUT"].indexOf(e.target.tagName) == -1) {
        if (e.target.tagName == "IMG" && e.button == 2) return;
        // allowed
        else if (e.target.tagName != "IMG")
          console.log("e.target.tagName != 'IMG'");
        // allowed
        else e.preventDefault();
      }
      //console.log(e);
      this.init_edit_box = false;
      if (
        this.tokenCreating &&
        e.target.tagName == "IMG" &&
        e.target.id == "target_image"
      ) {
        console.log('init_edit_box', this.init_edit_box)
        
        this.init_edit_box = true;
        window.$("#target_image").css("opacity", 1);
        this.edit_bbox = {
          start_x: e.layerX,
          start_y: e.layerY
        };
      } else {
        this.edit_bbox = {};
      }
    },
    imgmm(e) {
      if (
        this.tokenCreating &&
        !this.edit_bbox==false &&
        this.edit_bbox.start_x !== undefined &&
        this.edit_bbox.start_y !== undefined &&
        this.init_edit_box
      ) {
        var $target_image = window.$('#target_image');
        var px = e.pageX - $target_image.offset().left;
        var py = e.pageY - $target_image.offset().top;
        var start_x = this.edit_bbox.start_x;
        var start_y = this.edit_bbox.start_y;
        var x = Math.min(px, start_x);
        var y = Math.min(py, start_y);
        var max_x = Math.max(px, start_x);
        var max_y = Math.max(py, start_y);
        var w = max_x - x;
        var h = max_y - y;


        var b = {
          x: x,
          y: y,
          min_x: x,
          min_y: y,
          max_x: max_x,
          max_y: max_y,
          w: w,
          h: h
        };
        
        window._lightbox(b);
      } else {
        this.edit_bbox = {};
      }
    },
    imgmu(e) {
      //console.log(e);
      if (this.tokenCreating && this.init_edit_box) {
        this.init_edit_box = false;
        var $target_image = window.$('#target_image');
        var end_x = e.pageX - $target_image.offset().left;
        var end_y = e.pageY - $target_image.offset().top;

        var newToken = new Token(this);
        newToken.create();

        var new_bbox = {
          full_scope: false,
          original_point: "topleft",
          x: {
            min: Math.min(this.edit_bbox.start_x, end_x),
            max: Math.max(this.edit_bbox.start_x, end_x)
          },
          y: {
            min: Math.min(this.edit_bbox.start_y, end_y),
            max: Math.max(this.edit_bbox.start_y, end_y)
          }
        };

        newToken.cloneBBox(new_bbox);

        this.edit_token = newToken;
        this.styleEditBox(new_bbox);

        var b = window.caliBox("#edit-bbox");
        window._lightbox(b);
        
        this.addDataEntry(true);
        this.addRelEntry(true);
      } else {
        this.edit_bbox = {};
      }
    },
    rebuildTree() {
      var danglingPart = [];
      var nonDanglingPart = [];
      window.simple_ids = [];
      var clear_edit_token = true;
      
      this._rebuild(this.tree, null, false, 0, "1", danglingPart, nonDanglingPart, clear_edit_token);

      console.log(danglingPart);

      if (clear_edit_token) {
        if (!window.$.isEmptyObject(this.edit_token)) {
          this.classes[this.edit_token.token_id]["modified"] = true;
        }
        this.edit_token = null;
      }
    },
    _rebuild(token, parent_token, inherit_idv, z_index, lvl, danglingPart, nonDanglingPart, clear_edit_token) {
      z_index++;

      if (!token.meta == false) {
        token.meta.parent_id = parent_token.token_id;
      }

      if (typeof token.isGroup == "function" && token.isGroup()) {
        token.ensureGroup();
      }

      var revert_viid = true;
      if (!parent_token == false) {
        if (
          (!parent_token.isGroup() &&
            parent_token.meta.virtual_individual_id) ||
          inherit_idv
        ) {
          inherit_idv = true;
          token.meta.virtual_individual_id =
            parent_token.meta.virtual_individual_id;
          revert_viid = false;
        }
      }

      if (
        !token.token_id == false &&
        !window.$.isEmptyObject(this.edit_token) &&
        token.token_id === this.edit_token.token_id
      ) {
          token.meta.original_virtual_individual_id =
            token.meta.virtual_individual_id;
        
          token.meta.original_virtual_part_id = token.meta.virtual_part_id;
      }

      if (revert_viid && !!token.meta && !token.isGroup()) {
        token.meta.virtual_individual_id =
          token.meta.original_virtual_individual_id;
      }

      if (token.description_level == "individual") {
        token.meta.virtual_part_id = token.meta.virtual_individual_id;
      } else {
        if (!!token.meta && !token.isGroup()) {
          token.meta.virtual_part_id = token.meta.original_virtual_part_id;
        }
      }

      if (
        token.description_level != "individual" &&
        typeof token.isGroup == "function" &&
        !token.isGroup()
      ) {
        if (
          token.meta.virtual_individual_id == token.meta.virtual_part_id &&
          token.meta.virtual_part_id == token.meta.original_virtual_part_id
        ) {
          token.meta.original_virtual_part_id = Math.uuid().toLowerCase();
          token.meta.virtual_part_id = token.meta.original_virtual_part_id;
        }
      }

      if (!token.token_id == false) {
        parent_token = token;
        this.boxStyle[token.token_id]["z-index"] = z_index;

        window.simple_ids.push(lvl);

        var classesToRemove = ["modified", "hover", "focus"];
        for (var k in this.classes[token.token_id]) {
          if (
            this.classes[token.token_id].hasOwnProperty(k) &&
            k.match(/tree-simple-id-/)
          ) {
            classesToRemove.push(k);
          }
        }

        classesToRemove.forEach(k => {
          this.classes[token.token_id][k] = null;
        });

        this.classes[token.token_id]["tree-simple-id-" + lvl] = true;
        //5566
        if (token.token_id == this.try_to_focus_me) {
          window.focusedTokenSimpleID = lvl;
          this.classes[token.token_id]["focus"] = true;
          let skip_e = true;
          this.setEditToken(token.token_id, null, skip_e);
          this.try_to_focus_me = null;
          clear_edit_token = false;
        }

        token["tree_simple_id"] = lvl.replace(/_/g, ".");
      } else {
        var tpl_token = {
          token_id: null,
          description_level: null,
          meta: {
            parent_id: null,
            virtual_individual_id: null,
            original_virtual_individual_id: null,
            virtual_part_id: null,
            original_virtual_part_id: null
          },
          bbox: {},
          data: [],
          relations: []
        };
        parent_token = new Token(this);
        parent_token.cloneToken(tpl_token);
      }

      if (token.tokens.length > 0) {
        token.tokens.forEach((t, i) => {
          this._rebuild(
            t,
            parent_token,
            inherit_idv,
            z_index,
            lvl + "_" + (i + 1), 
            danglingPart, 
            nonDanglingPart, 
            clear_edit_token
          );
        });
      }

      if (!token.token_id == false) {
        this.tokens[token.token_id].cloneToken(token);
        if (!!token.meta && !!token.meta.virtual_individual_id) {
          if (
            token.meta.virtual_individual_id === token.meta.virtual_part_id
          ) {
            if (
              nonDanglingPart.indexOf(token.meta.virtual_individual_id) === -1
            ) {
              nonDanglingPart.push(token.meta.virtual_individual_id);
            }
            var dpid = danglingPart.indexOf(token.meta.virtual_individual_id);
            if (dpid > -1) {
              danglingPart.splice(dpid, 1);
            }
          } else {
            if (
              nonDanglingPart.indexOf(token.meta.virtual_individual_id) === -1
            ) {
              if (
                danglingPart.indexOf(token.meta.virtual_individual_id) === -1
              ) {
                danglingPart.push(token.meta.virtual_individual_id);
              }
            }
          }
        }
      }
    },

    consoleCmd() {},
    ctrlPasteSth(e) {
      if (!(e.ctrlKey && (e.key == "v" || e.key == "V"))) {
        return;
      }
      window.uiCopiedToken = JSON.parse(
        window.localStorage.getItem("ui_copied_token")
      );
      if (!window.$.isEmptyObject(window.uiCopiedToken)) {
        window.edit_token_form.$setDirty();
        e.preventDefault();
        var name = e.target.name;
        switch (name) {
          case "viid":
            window.edit_token_form.viid.$setDirty();
            window.edit_token.meta.virtual_individual_id =
              window.uiCopiedToken.meta.virtual_individual_id;
            break;
          case "vpid":
            window.edit_token_form.vpid.$setDirty();
            window.edit_token.meta.virtual_part_id =
              window.uiCopiedToken.meta.virtual_part_id;
            break;
        }
      }
    },
    ctrlPasteCopiedToken(e, ri) {
      if (e.ctrlKey && (e.key == "v" || e.key == "V")) {
        e.preventDefault();
        this.edit_token_form.$setDirty();
        this.tokenIDFromCopiedToken(e, ri);
      }
    },
    tokenIDFromCopiedToken(e, ri) {
      e.preventDefault();
      var url_token_id = window.localStorage.getItem("ui_copied_token_id");
      var token_id_parts = url_token_id.split("#");

      var token_id = token_id_parts.pop();

      if (token_id_parts.join("") == this.ann.url) {
        this.edit_token.relations[ri].object = token_id;
      } else {
        this.edit_token.relations[ri].object = url_token_id;
      }
    },
    initSessionImageList() {
      window.localStorage.setItem("mergedList", this.image_list);
      this.hasMergedSessionImageList = true;
    },
    graphSessionImageList() {
      window.localStorage.setItem("listForGraph", this.image_list);
      window.open("http://twebi.net/imgAnn/cyto/", "_blank");
    },
    mergeSessionImageList() {
      var arr1 = this.image_list;
      var arr2 = JSON.parse(window.localStorage.getItem("mergedList"));
      //this.image_list = arrayUnique(arr1.concat(arr2));
      this.image_list = window.arrayUnique(arr2.concat(arr1));
      window.localStorage.setItem("mergedList", this.image_list);
      window.localStorage.setItem("image2carrier", this.image2carrier);
      this._selectImage(arr2.length + this.current_image_idx);
    },
    simpleSearch(data, merge) {
      if (!data) {
        data = { contains: this.toSearch };
      } else if (!data.contains) {
        data.contains = "";
      }

      if (!merge) merge = false;

      this.$http
        .post("/assets/annotation/mongo_simple_query.php", data)
        .then(function(ret) {
          if (ret.result.length > 0) {
            this.hasSolidImageList = true;
            if (!merge) {
              this.image_list = ret.result;
            } else {
              var merged = window.$.merge(ret.result, this.image_list).unique();
              this.image_list = merged;
            }
            this._selectImage(0);
          }
        });
    },
    createToken() {
      if (!this._leaveWOSave()) return;

      this.cancelToRelate();

      window.tokenCreating = this.tokenCreating = true;
      window.$("button#create-new-token-button").attr("disabled", "disabled");

      window.$(".token-basic").removeClass("focus");
      window.$(".token-basic").removeClass("hover");

      var b = window.caliBox("#target_image");

      window.$("#target_image").css("opacity", 0.5);

      window._lightbox(b);
      window.draw(null, b);

      if (this.auto_select_full_scope_on_create) {
        this.edit_token_form.$setDirty();
        this.edit_token = new Token(this);
        this.edit_token.create();
        window.$("#target_image").css("opacity", 1);
        this.styleEditBox({ full_scope: true });
        this.addDataEntry(true);
        this.addRelEntry(true);
      }
    },
    focusTokenBasic () {
      if (!window.$.isEmptyObject(this.edit_token)) {
        var focused_token_id = this.edit_token.token_id;
        if (!window.$.isEmptyObject(this.classes[focused_token_id])) {
          this.classes[focused_token_id]['focus'] = true;
        }
      }
    },
    autoValueClicked (di, v) {
      this.edit_token.data[di].value = v.vname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim();
      this.showSelectionBox[this.edit_token.token_id + "_" + this.edit_token.data[di].key + "-di-" + di] = false;

      var sciname_filled = false;
      this.edit_token.data.forEach(function(d) {
        if (d.key === 'name-scientific') {
          d.value = v.sciname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim();
          sciname_filled = true;
        }
      });
      if (sciname_filled === false) {
        this.edit_token.data.push({
          label: '物種學名',
          key:   'name-scientific',
          value: v.sciname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim(),
          unit:  ''
        });
      }
    },
    cellBlurred(e) {
      window.escapeTarget = e.target;
    },
    autoValues(di) {
      var txt = this.edit_token.data[di].value;
      var attrName = this.edit_token.data[di].key;

      if (attrName != 'name-vernacular-zhtw') {
        this.autoRes[attrName] = [];
        return;
      }

      this.showSelectionBox[this.edit_token.token_id + "_" + this.edit_token.data[di].key + "-di-" + di] = true;

      if (txt === '') {
        this.showSelectionBox[this.edit_token.token_id + "_" + this.edit_token.data[di].key + "-di-" + di] = false;
      }

      if (window.$.isEmptyObject(this.autoRes[attrName])) {
        this.$http.get("/annotation/splist.csv", {})
          .then(function (ret) {
            var res = [];
            var lines = ret.split('\n');
            lines.forEach(function(line){
              if (line.length > 3) {
                var cells = line.split('\t');
                // res.push({namecode: cells[0], sciname: cells[1].replace(/\(.+\)/, '').replace(/ +/, ' ').trim(), vname: cells[2].split('(')[0].trim()});
                res.push({namecode: cells[0], sciname: cells[1].replace(/\(.+\)/, '').replace(/ +/, ' ').trim(), vname: cells[2]});
              }
            });
            this.autoRes[attrName] = res;
          })
      }
    },
    resolveUrlToken(e, urlToken) {

      var ut = this._getUrlToken(urlToken);
      var url = ut.url;
      var token_id = ut.token_id;

      this.try_to_focus_me = token_id;

      var idx = this.image_list.indexOf(url);
      if (idx > -1) {
        if (!url==false) {
          alert('影像紀錄不存在, 無法解析!');
          console.log('No image url, current image url will be used.');
        }
      }
      else {
        idx = this.image_list.push(url) - 1;
      }
      this._selectImage(idx);
    }
  },
  mounted() {
    if (!window.localStorage.getItem("image2carrier") == false) {
      this.image2carrier = JSON.parse(
        window.localStorage.getItem("image2carrier")
      );
    } else {
      this.image2carrier = {};
    }

    this.token_id = Math.uuid().toLowerCase();
    this.description_level = "individual";
    this.meta = {};
    this.meta.virtual_individual_id = Math.uuid().toLowerCase();
    this.meta.original_virtual_individual_id = this.meta.virtual_individual_id;
    this.meta.virtual_part_id = Math.uuid().toLowerCase();
    this.meta.original_virtual_part_id = this.meta.virtual_part_id;
    this.bbox = {};
    this.data = [];
    this.relations = [];

    this.$el.querySelector("#carrier_frame").onload = () => {
      let $target_image = this.$el.querySelector("#target_image");
      console.log("onload frame");
      if (
        !$target_image ||
        ($target_image.naturalHeight === 0 || !$target_image.complete)
      ) {
        if (!this.hasSolidImageList) {
          if (this.retry <= this.max_retry) {
            this.image_list = [];
            this.retry++;
            this._getImageList();
          } else {
            this.hasSolidImageList = true;
            this.retry = 0;
          }
        } else {
          this._selectImage(this.current_image_idx);
        }
      } else if ($target_image.naturalHeight !== 0 && $target_image.complete) {
        this.hasSolidImageList = true;
      }

      this.$el.querySelector("#carrier_frame").blur();
      window.$("#edit-bbox").click();
    };

    window.canvas = document.getElementById("canvas");
    window.ctx = window.canvas.getContext("2d");

    window.$('#target_image').load(function(){
      if (this.naturalHeight !== 0 && this.complete) {
        window.draw('#target_image');
      }
    });

    var $this = this
    
    window.$(document).keydown(function(e) {
      var name, _nrow, nrow, type;
      if (e.target.tagName != 'INPUT' || e.target.getAttribute('data-no-text') !== null) {

        if (e.key == 'g') {
          if (!window.lastG) {
            window.lastG = Date.now();
            return;
          }
          var time_diff = Date.now() - window.lastG;
          window.lastG = Date.now();
          if (time_diff <= 300) {
            window.$('#auto-copy-all-tokens').click();
          }
        }
        else if (e.key == 'ArrowDown') {
          if (!window.tokenCreating) {
            e.preventDefault();
            window._focusOnTokenBasicBySimpleID(window._nextToken(window.focusedTokenSimpleID), true);
          }
        }
        else if (e.key == 'ArrowUp') {
          if (!window.tokenCreating) {
            e.preventDefault();
            window._focusOnTokenBasicBySimpleID(window._prevToken(window.focusedTokenSimpleID), true);
          }
        }
        else if (e.key == 'a' || e.key == 'A') {
          // $(".add-a-row-button").click();
        }
        else if (e.key == 'r' || e.key == 'R') {
          window.$("md-tab-item:not(.md-active)").click();
          window.$(".token-basic-tree").focus();
        }
        else if (e.key == 't' || e.key == 'T') {
          if (!(window.annScope.tokenCreating && !window.annScope.edit_token && !window.showAnnCtrl)) {
            window.$("#tree_and_form_toggle").click();
          }
          else {
            alert('Draw a box first!');
          }
        }
        else if (e.key == 'n' || e.key == 'N' || e.key == 'ArrowRight') {
          if (!window.tokenCreating) {
            e.preventDefault();
            window.$(".main_next_image").click();
          }
        }
        else if (e.key == 'p' || e.key == 'P' || e.key == 'ArrowLeft') {
          if (!window.tokenCreating) {
            e.preventDefault();
            window.$(".main_prev_image").click();
          }
        }
        else if (e.key == 'v' || e.key == 'V') {
          if (e.ctrlKey) {
            window.$('#paste-as-new-token-button').mousedown();
            window.$('#paste-as-new-token-button').mouseup();
          }
        }
        else if (e.key == 'c' || e.key == 'C') {
          if (e.ctrlKey) {
            window.$('.token-basic.focus').find('button.copy_token').mousedown();
            window.$('.token-basic.focus').find('button.copy_token').mouseup();
          }
          else {
            if (window.$.isEmptyObject(window.annScope.edit_token)) {
              if (window.showAnnCtrl === true && !window.annScope.auto_select_full_scope_on_create) {
                window.$("#tree_and_form_toggle").click();
              }
              window.$("#create-new-token-button").click();
            }
          }
        }
        else if (e.keyCode == 27) {
          if (window.$("#create-new-token-button").attr('disabled') == 'disabled' || window.$('.main.cancel-editing-token-button').css('display') !== 'none') {
            window.$(".main.cancel-editing-token-button").click();
          }
          else {
            if (window.showAnnCtrl === true) {
              window.$("#tree_and_form_toggle").click();
            }
          }
        }
        else if (e.keyCode == 105 || e.keyCode == 73 || e.key == 'i' || e.key == 'I') {
          if (!window.escapeTarget==false) {
            e.preventDefault();

            if ((window.$(window.escapeTarget).parents('md-tab-content').length > 0) && (window.$(window.escapeTarget).parents('.md-active').length > 0)) {
              window.$(window.escapeTarget).focus();
            }
            else {
              window.$('.md-active .user-input').first().focus();
            }
            //window.escapeTarget = null;
          }
          else {
            e.preventDefault();
            window.$('.md-active .user-input').first().focus();
          }
        }
        else if (e.keyCode == 111 || e.keyCode == 80 || e.key == 'o' || e.key == 'O') {
          e.preventDefault();
          window.$('.md-active .user-input-first-cell').last().focus();
        }
        else if (e.keyCode == 119 || e.keyCode == 87 || e.key == 'w' || e.key == 'W') {
          // e.preventDefault();
          window.$('.annConsole').focus();
        }
        else if (e.key >= '1' && e.key <= '9') {
          if (!window.showAnnCtrl==false) {
            window.$('.annConsole').focus();
          }
        }
        else if (e.key == ':' || e.key == '/') {
          if (e.key != '/') {
            e.preventDefault();
          }
          window.showAnnCtrl = false;
          window.$("#tree_and_form_toggle").click();
          window.$('.annConsole').focus();
        }
      } // in input tag
      else {
        if (e.key == 'ArrowDown') {
          name = window.$(e.target).attr('name');
          _nrow = window.$(e.target).attr('nrow');
          type = _nrow.split('-')[0];
          nrow = parseInt(_nrow.split('-')[1]) + 1;
          var nextRowCell =  window.$('.' + name + '[nrow=' + type + '-' + nrow + ']');
          if (nextRowCell.length > 0) {
            nextRowCell.focus();
          }
          else {
            window.window.$('button.add-'+type).click();
          }
        }
        else if (e.key == 'ArrowUp') {
          name = window.$(e.target).attr('name');
          _nrow = window.$(e.target).attr('nrow');
          type = _nrow.split('-')[0];
          nrow = parseInt(_nrow.split('-')[1]) - 1;
          var prevRowCell =  window.$('.' + name + '[nrow=' + type + '-' + nrow + ']');
          if (prevRowCell.length > 0) {
            prevRowCell.focus();
          }
        }
        else if (e.keyCode == 27) {
          window.escapeTarget = e.target;
          var di = window.$(window.escapeTarget).attr('nrow').split('-')[1];
          var cell_id = $this.edit_token.token_id + "_" + $this.edit_token.data[di].key + "-di-" + di;
          if ($this.showSelectionBox[cell_id]) {
            $this.showSelectionBox[cell_id] = false;
          }
          else {
            //$(e.target).blur();
            window.$('.token-basic-tree').focus();
          }
        }
        else if (e.keyCode == 13) {
          var cmd = window.$('.annConsole').val();
          if (cmd.match(/^([1-9]+\.)+[1-9]$/) !== null) {
            cmd = cmd.replace(/\./g, '_');
            window._focusOnTokenBasicBySimpleID(cmd, true);
          }
          else if (cmd == 'w' || cmd == 'W') {
            window.$('#main_save_xd').click();
          }
          else if (cmd == 'q' || cmd == 'Q') {
            window.$("#tree_and_form_toggle").click();
          }
          else if (cmd.toLowerCase() == 'wq') {
            window.$('#main_save_xd').click();
            window.$("#tree_and_form_toggle").click();
          }
          else if (cmd.toLowerCase().match(/\/(.+)/)) {
            var toSearch = cmd.toLowerCase().match(/\/(.+)/)[1].trim();
            window.annScope.toSearch = toSearch;
            window.$('#simple-search').click();
          }
          window.$('.annConsole').val('');
          window.$('.token-basic-tree').focus();
        }
      }
    });

    window.showAnnCtrl = false;
    window.$("#tree_and_form").draggable({handle:'.ctrl_panel_drag_handle'});
    window.$("#tree_and_form").dblclick(function(e){
      if (['TD', 'INPUT', 'CANVAS', 'BUTTON'].indexOf(e.target.tagName) == -1) {
        window.$("#tree_and_form_toggle").click();
      }
    });
    window.$("#tree_and_form_toggle").click(function(){
      if (window.showAnnCtrl) {
        window.$(this).parent().next().hide();
        window.$(this).parents('.ctrl_panel').css('width', 0);
        window.$(this).parents('.ctrl_panel').css('left', 'calc(100% - 100px)');
        window.$(this).parents('.ctrl_panel').css('top', 30);
        window.$(this).parents('.ctrl_panel').addClass('annCtrlPanelHide');
        window.$(this).parents('.ctrl_panel').removeClass('annCtrlPanelShow');
      }
      else {
        window.$(this).parent().next().show();
        window.$(this).parents('.ctrl_panel').css('width', 1400);
        window.$(this).parents('.ctrl_panel').css('left', 100);
        window.$(this).parents('.ctrl_panel').css('top', 50);
        window.$(this).parents('.ctrl_panel').addClass('annCtrlPanelShow');
        window.$(this).parents('.ctrl_panel').removeClass('annCtrlPanelHide');
        window.$('.token-basic-tree').focus();
      }
      window.showAnnCtrl = !window.showAnnCtrl;
    });

    window.$("#edit-bbox")
      .resizable({
        grid: 1,
        resize: function (e) {
          var b = window._showMsg(e.target);
          window._lightbox(b);
        }
      })
      .draggable({
        grid: [1, 1],
        drag: function (e) {
          var b = window._showMsg(e.target);
          window._lightbox(b);
        }
      })
      .dblclick(function(e){
        if (!window.orig_bbox) {
          window.orig_bbox = {};
          window.orig_bbox.w = parseFloat(window.$(e.target).css('width'));
          window.orig_bbox.h = parseFloat(window.$(e.target).css('height'));
          window.orig_bbox.y = parseFloat(window.$(e.target).css('top'));
          window.orig_bbox.x = parseFloat(window.$(e.target).css('left'));
          window.$(e.target)
            .css('height', window.$('#target_image').height())
            .css('width', window.$('#target_image').width());
        }
        else {
          window.$(e.target)
            .css('height', window.orig_bbox.h)
            .css('width', window.orig_bbox.w)
            .css('top', window.orig_bbox.y)
            .css('left', window.orig_bbox.x);
          window.orig_bbox = false;
        }

        var b = window._showMsg(this);
        window._lightbox(b);
      })
      .click(function(){
        var b = window._showMsg(this);
        window._lightbox(b);
      });

  
  }
};
</script>
