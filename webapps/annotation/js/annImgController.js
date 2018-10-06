var app = angular.module('annImg', ['ui.tree', 'ngMaterial', 'ngFileUpload']);
app.controller('annImgController', ['$scope', '$sce', 'simpleQueryService', 'Upload', function ($scope, $sce, simpleQueryService, Upload) {

  window.annScope = $scope;

  $scope.found = {};
  $scope.showSelectionBox = {};
  $scope.autoRes = {};
  $scope.elmSearchStyle = {'background-color':'white', 'color':'black'};
  $scope.elmSearchStyleInd = {};

  $scope.elmSearchME = function (idx) {
    $scope.elmSearchStyleInd[idx] = {'background-color':'blue', 'color':'white'};
  }

  $scope.elmSearchML = function (idx) {
    $scope.elmSearchStyleInd[idx] = {'background-color':'white', 'color':'black'};
  }


  $scope.current_query_id = 0;

  $scope.color_names = [
    'navy', 'blue', 'aqua', 'teal', 'olive', 'green', 'lime', 'yellow',
    'orange', 'fuchsia', 'purple', 'maroon', 'gray', 'silver', 'black'
  ];

  $scope.image_list = [];
  $scope.hasMergedSessionImageList = !!localStorage.getItem('mergedList');

  $scope.max_retry = 5;
  $scope.retry = 0;

  $scope.image_url = null;

  $scope.hasSolidImageList = false;
  $scope.current_image_idx = 0;

  $scope.try_to_focus_me = null;

  $scope.group_terms = ['group'];

  $scope.auto_copy_all_tokens = false;

  if (!!localStorage.getItem('image2carrier')) {
    $scope.image2carrier = JSON.parse(localStorage.getItem('image2carrier'));
  }
  else {
    $scope.image2carrier = {};
  }

  var _initAnn = function() {
    window.tokenCreating = $scope.tokenCreating = false;
    $scope.current_token = null;
    $scope.edit_token = null;

    if (!$scope.auto_copy_all_tokens) {
      $scope.ann = {};
    }

    $scope.isReadyToRelate = false;
    $scope.tokenRelationIdx = null;

    $scope.classes = {};
    $scope.bbox = {};
    $scope.meta = {};
    $scope.tokens = {};
    $scope.boxStyle = {};

    $scope.tree = {tokens: []};
    $scope.uiCopiedToken = JSON.parse(localStorage.getItem('ui_copied_token'));
  }

  $(function(){
    $('#carrier_frame').on('load', function(){
      console.log('load the iframe')
      $target_image = $('#target_image')[0];
      if ($target_image.naturalHeight === 0 || !$target_image.complete) {
        if (!$scope.hasSolidImageList) {
          if ($scope.retry <= $scope.max_retry) {
            $scope.image_list = [];
            $scope.retry++;
            _getImageList();
          }
          else {
            $scope.hasSolidImageList = true;
            $scope.retry = 0;
          }
        }
        else {
          _selectImage($scope.current_image_idx);
        }
      }
      else if ($target_image.naturalHeight !== 0 && $target_image.complete) {
        $scope.hasSolidImageList = true;
      }
      $(this).blur();
    });
  });

  var _getImageList = function () {
    if (query.bookmarklet == 'true' && !$scope.hasSolidImageList && !!query.images_string) {
      $scope.image_list = $.unique(JSON.parse(query.images_string));
      $scope.carrier_url = query.carrier_url;
      $scope.mm_source = query.title;

      if ($scope.image_list.length > 0) {
        $scope.image_list.forEach(function(imgsrc) {
          $scope.image2carrier[imgsrc] = query.carrier_url;
        });

        $('#carrier_frame').attr('src', $scope.carrier_url);
        _selectImage(0);
      }
    }
    else {
      // display demo contents
      simpleQueryService.simpleQuery("image_list.json", {})
        .then(function (ret) {
          $scope.image_list = ret;
          _selectImage(0);
        })
    }
  }

  var _selectImage = function(idx) {
    $scope.image_url = $scope.image_list[idx];// + '&t=' + new Date().getTime();
    $scope.current_image_idx = idx;
    $scope.files = [];
    _initAnn();
    _getImageData();
  }


  var _leaveWOSave = function () {

    var action = '編輯';
    if ($scope.tokenCreating) {
      action = '建立';
    }

    if ($scope.edit_token_form.$dirty || ($scope.tokenCreating && !!$scope.edit_token)) {
      var leaveWOSave = confirm("文件" + action + "中，確定離開?");
      if (leaveWOSave) {
        $scope.edit_token_form.$setPristine();
      }
      return leaveWOSave;
    }
    return true;
  }

  $scope.switchImage = function (direction, e) {

    if (!_leaveWOSave()) {
      return;
    }

    var last_image_idx = $scope.current_image_idx;

    e.stopPropagation();
    
    switch (direction) {
      case "prev":
        if ($scope.current_image_idx > 0) {
          $scope.current_image_idx = $scope.current_image_idx - 1;
        }
        break;
      case "next":
      default:
        if ($scope.current_image_idx < $scope.image_list.length - 1) {
          $scope.current_image_idx = $scope.current_image_idx + 1;
        }
        break;
    }
    if (last_image_idx != $scope.current_image_idx) {
      _selectImage($scope.current_image_idx);
    }
  }

  var _getImageData = function(url) {

    if (!!url) {
      $scope.image_url = url;
    }

    if (!!$scope.image_url) {
      var query_id = $scope.current_query_id;
      $scope.current_query_id += 1;
      simpleQueryService.simpleQuery("mongo_load.php", {url: $scope.image_url, qid: query_id}, true)
        .then(function (ret) {
          console.log(ret);
          if (!ret.result || ret.result == 'null') {
            ret = [];
            var json_file = "annotation.empty.json";
            ret.forEach(function(e){
              if (e.image_url == $scope.image_url) json_file = e.json_file;
            })

            simpleQueryService.simpleQuery(json_file, {})
              .then(function (ret) {
                ret.url = $scope.image_url;
                ret.carrier_url = (!!$scope.image2carrier[$scope.image_url])?$scope.image2carrier[$scope.image_url]:""
                ret.source = $scope.mm_source;
                startAnnotation(ret);
              })
          }
          else {
            if (ret.query.qid === query_id) {
              startAnnotation(ret.result);
            }
          }
        })
    }
    else {
      // should not happen
      simpleQueryService.simpleQuery("annotation.empty.json", {})
        .then(function (ret) {
          startAnnotation(ret);
        })
    }

  }

  var startAnnotation = function (ret) {

    if (!$scope.auto_copy_all_tokens || ret.tokens.length > 0) {
      $scope.ann = {};
    }
    else {
      var old2New = {};
      $scope.ann.tokens.forEach(function(t){
        var tmp = new Token();
        tmp.create();
        var tmp_token_id = tmp.token_id;
        old2New[t.token_id] = tmp_token_id;
        tmp.cloneToken(t);
        tmp.token_id = tmp_token_id;
        ret.tokens.push(tmp);
      });

      ret.tokens.forEach(function(t){
        if (!!t.meta && !!t.meta.parent_id) {
          t.meta.parent_id = old2New[t.meta.parent_id];
        }
      });

    }
    var ann_json = ret;

    $scope.ann.url = ann_json.url;
    var tmp_carrier_url = ann_json.carrier_url;
    $scope.ann.carrier_url = tmp_carrier_url;
    $scope.carrier_url = tmp_carrier_url;

    if ($scope.hasSolidImageList && ($('#carrier_frame').attr('src') !== $scope.carrier_url)) {
      $('#carrier_frame').attr('src', $scope.carrier_url);
    }

    var tokens = [];

    for (var i = 0; i < ann_json.tokens.length; i++) {
      var token = new Token();
      token.cloneToken(ann_json.tokens[i]);
      if (!token.data) token.data = [];
      if (!token.relations) token.relations = [];

      if (!!token.meta) {
        if (!token.meta.original_virtual_individual_id) {
          token.meta.original_virtual_individual_id = token.meta.virtual_individual_id;
        }
        if (!token.original_virtual_part_id) {
          token.meta.original_virtual_part_id = token.meta.virtual_part_id;
        }
      }

      $scope.tokens[token.token_id] = token;

      if (!$scope.classes[token.token_id]) {
        $scope.classes[token.token_id] = {};
      }
      $scope.classes[token.token_id][token.token_id] = true;
      $scope.classes[token.token_id]['token-basic'] = true;

      if (!$.isEmptyObject(token.bbox)) {
        $scope.bbox[token.token_id] = token.bbox;
      }
      else {
        $scope.bbox[token.token_id] = $scope.bbox[token.meta.parent_id];
      }  

      token.tokens = [];

      var color_name = $scope.color_names[i % $scope.color_names.length];

      var box = $scope.bbox[token.token_id];

      boxStyle = $scope.styleMyBox(box, color_name);
      $scope.boxStyle[token.token_id] = boxStyle;
      tokens.push(token);
    }

    // 
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (!token.meta || !token.meta.parent_id) {
        $scope.tree.tokens.push(token);
      }
      else {
        if (!!$scope.tokens[token.meta.parent_id]) {
          $scope.tokens[token.meta.parent_id].tokens.push(token);
        }
        else {
          $scope.tree.tokens.push(token);
        }
      }
    }


    ann_json.tokens = tokens;

    ann_json.relations = undefined;

    $scope.ann = ann_json;
    //$scope.ann.url = 'example001.png';

    $scope.rebuildTree();

  }


  $scope.styleMyBox = function(box, color, border_width) {

    if (!border_width) {
      var border_width = 1;
    }

    if (!color) {
      var color = 'red';
    }

    var boxStyle = {
      position: 'absolute',
      border: 'solid ' + border_width + 'px ' + color,
      color: color
    };

    if (box.full_scope) {
      var $target_image = $('#target_image');
      var img_h = $target_image.height();
      var img_w = $target_image.width();
      boxStyle.left = 0 - border_width;
      boxStyle.top = 0 - border_width;
      boxStyle.width = img_w;
      boxStyle.height = img_h;
    }
    else {
      boxStyle.left = box.x.min - border_width;
      boxStyle.top = box.y.min - border_width;
      boxStyle.width = box.x.max - box.x.min;
      boxStyle.height = box.y.max - box.y.min;
    }
    return boxStyle;

  }

  var Token = function () {

    this.isGroup = function() {
      if (!this.description_level) return false;
      var isGroup = false;
      this.description_level.split('-').forEach(function(part) {
        if ($scope.group_terms.indexOf(part) > -1) {
          isGroup = true;
        }
      })
      return isGroup;
    }

    this.create = function() {
      this.token_id = Math.uuid().toLowerCase();

      this.description_level = 'individual';
      this.meta = {};
      this.meta.virtual_individual_id = Math.uuid().toLowerCase();
      this.meta.original_virtual_individual_id = this.meta.virtual_individual_id;
      this.meta.virtual_part_id = Math.uuid().toLowerCase();
      this.meta.original_virtual_part_id = this.meta.virtual_part_id;
      this.bbox = {};
      this.data = [];
      this.relations = [];
    }

    this.cloneToken = function(token) {
      this.token_id = _getUrlToken(token.token_id).token_id;
      this.description_level = token.description_level;
      this.cloneBBox(token.bbox);
      this.cloneMeta(token.meta);
      this.cloneData(token.data);
      this.cloneRel(token.relations);
    }

    this.cloneDataAndRelation = function(token) {
      this.cloneData(token.data);
      this.cloneRel(token.relations);
    }


    this.cloneBBox = function(bbox) {
      if (!bbox) {
        bbox = {};
      }
      this.bbox = $.extend(true, {}, bbox);
    }

    this.getBBox = function() {
      return $.extend(true, {}, this.bbox);
    }

    this.cloneMeta = function(meta) {
      if (!meta) {
        meta = {};
      }
      this.meta = $.extend(true, {}, meta);
    }

    this.cloneData = function(data) {
      if (!data) {
        data = [];
      }
      var cloned_data = [];
      data.forEach(function(d) {
        var cloned_d  = $.extend(true, {}, d);
        cloned_data.push(cloned_d);
      });
      this.data = cloned_data;
    }

    this.cloneRel = function (rel) {
      if (!rel) {
        rel = [];
      }
      var cloned_rel = [];
      rel.forEach(function(r) {
        var cloned_r  = $.extend(true, {}, r);
        cloned_r.object = _makeUrlToken(null, cloned_r.object);
        cloned_rel.push(cloned_r);
      });
      this.relations = cloned_rel;
    }

    this.removeEmptyDataEntry = function () {
      if (this.data.length == 0) return;
      this.data = this.data.filter(function(el) {
        if (!!el.key.toString().trim()) {
          return true;
        }
        else {
          return false;
        }
      })
    }

    this.removeEmptyRelEntry = function () {
      if (this.relations.length == 0) return;
      this.relations = this.relations.filter(function(el) {
        if (!!el.relation.toString().trim() && !!el.object.toString().trim()) {
          return true;
        }
        else {
          return false;
        }
      })
    }


    this.ensureGroup = function () {
      //this.meta.virtual_individual_id = null;
      //this.meta.virtual_part_id = null;
    }

  }


  var _getTokens = function (tokens) {
    var tmpTokens = [];
    tokens.forEach(function(t){
      var tmp = new Token();
      tmp.cloneToken(t);
      tmpTokens.push(tmp);
    });
    return tmpTokens;
  }

  var _pruneAnn = function (ann) {
    var tmpAnn = $.extend(true, {}, ann);
    delete(tmpAnn._id);
    tmpAnn.tokens = _getTokens(ann.tokens);
    tmpAnn.tokens.forEach(function(t){
      t.tokens = undefined;
    });
    return tmpAnn;
  }


  $scope.updateToken = function () {

    if ($.isEmptyObject($scope.edit_token)) {
      $scope.saveAnnotation();
      return;
    }

    $("#edit-bbox").click();
    $scope.edit_token.removeEmptyDataEntry();
    $scope.edit_token.removeEmptyRelEntry();

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
    }

    var et = $scope.edit_token;

    if (et.isGroup()) {
      et.ensureGroup();
    }

    var token_exists = false;
    var which_token = -1;
    $scope.ann.tokens.some(function(el, idx) {
      if (et.token_id == el.token_id) {
        which_token = idx;
        token_exists = true;
      }
      return token_exists;
    });

    et.cloneBBox(new_box);
    $scope.tokens[et.token_id] = et;
    $scope.bbox[et.token_id] = new_box;
    $scope.meta[et.token_id] = et.meta;
    $scope.boxStyle[et.token_id] = $scope.styleMyBox(new_box);

    if (!token_exists) {
      et.tokens = [];
      $scope.classes[et.token_id] = {};
      $scope.classes[et.token_id][et.token_id] = true;
      $scope.classes[et.token_id]['token-basic'] = true;
      $scope.ann.tokens.push(et);
      $scope.tree.tokens.push(et);
    }
    else if (which_token > -1) {
      $scope.ann.tokens[which_token].cloneToken(et);
    }

    window.tokenCreating = $scope.tokenCreating = false;

    // $scope.ann.relations[$scope.edit_token.token_id] = cloneRel($scope.edit_token.relations);

    // should be done in rebuildTree?
    // $scope.edit_token = null;

    $('button#create-new-token-button').attr('disabled', null);

    // should be done in rebuildTree?
    // $('.token-basic').removeClass("focus");
 
    $scope.saveAnnotation();

    /*
    var dataToSave = _pruneAnn($scope.ann);
    simpleQueryService.simpleQuery("mongo_save.php", dataToSave, true) // using post
      .then(function (ret) {
        console.log('Content saved');
        console.log(ret);
        $scope.edit_token_form.$setPristine();
        $scope.setEditToken(edit_token_id, null, true);
      });
    //*/
  }

  $scope.saveAnnotation = function (_callback) {

    var edit_token_id = null;
    if (!$.isEmptyObject($scope.edit_token)) {
      edit_token_id = $scope.edit_token.token_id;
    }
    $scope.rebuildTree();

    var args = arguments;
    var dataToSave = _pruneAnn($scope.ann);
    simpleQueryService.simpleQuery("mongo_save.php", dataToSave, true) // using post
      .then(function (ret) {
        console.log('Content saved');
        console.log(ret);

        $scope.edit_token_form.$setPristine();
        if (edit_token_id) {
          $scope.setEditToken(edit_token_id, null, true);
        }

        if (typeof _callback == 'function') {
          _callback(args);
        }

      });
  }


  $scope.highlightAllBox = function (e) {
    $('.bbox').show();
    if (!!$scope.edit_token) {
      $('#edit-bbox').click();
    }
  }

  $scope.highlightBox = function (tid, e) {
    //e.stopPropagation();
    if ($.isEmptyObject($scope.edit_token) || $scope.isReadyToRelate || $scope.hover_to_preview) {
      $scope.current_token = $scope.tokens[tid];
      draw($scope.current_token.token_id);
    }
    else if (!$.isEmptyObject($scope.edit_token)) {
      $scope.current_token = new Token();
      $scope.current_token.cloneToken($scope.edit_token);

      if (!$scope.tokenCreating) {
        draw($scope.current_token.token_id);
      }
    }


    $('.bbox').hide();
    $('.'+tid).show();
  }

  $scope.highlightTree = function (tid, e) {
    e.stopPropagation();
    $('.token-basic').removeClass('hover');
    $('.'+tid+'.token-basic').addClass('hover');
  }

  $scope.addDataEntry = function (add) {
    if (!add) return;
    var defaultFields = {
      'category-zhtw': {
        label: '類群',
        key:   'category-zhtw',
        value: '',
        unit:  ''
      },
      'name-vernacular-zhtw': {
        label: '物種中名',
        key:   'name-vernacular-zhtw',
        value: '',
        unit:  ''
      },
      'name-scientific': {
        label: '物種學名',
        key:   'name-scientific',
        value: '',
        unit:  ''
      },
      'color': {
        label: '顏色',
        key:   'color',
        value: '',
        unit:  ''
      },
      'date': {
        label: '拍照日期',
        key:   'date',
        value: '',
        unit:  ''
      },
      'locality': {
        label: '地點',
        key:   'locality',
        value: '',
        unit:  ''
      },
      'wgs84-y': {
        label: '緯度',
        key:   'wgs84-y',
        value: '',
        unit:  ''
      },
      'wgs84-x': {
        label: '經度',
        key:   'wgs84-x',
        value: '',
        unit:  ''
      }
    };

    $scope.edit_token.data.forEach(function(d) {
      if (!!defaultFields[d.key]) {
        delete(defaultFields[d.key]);
      }
    });

    for(key in defaultFields) {
      if (defaultFields.hasOwnProperty(key)) {
        $scope.edit_token.data.push({
          label: defaultFields[key].label,
          key: defaultFields[key].key,
          value: defaultFields[key].value,
          unit: defaultFields[key].unit
        });
      }
    }

    $scope.edit_token.data.push({
      label:'',
      key:'',
      value:'',
      unit:''
    });

  }

  $scope.addRelEntry = function (add) {
    if (add) {
      $scope.edit_token.relations.push({
        context: '',
        relation: '',
        object: ''
      });
    }
  }

  $scope.cancelEditingToken = function (e) {

    if (!!e) {
      e.stopPropagation();
    }
    else {
      return;
    }

    if (!_leaveWOSave()) {
      return;
    }
    window.tokenCreating = $scope.tokenCreating = false;
    $('.token-basic').removeClass('focus');
    $scope.edit_token = null;
    $('button#create-new-token-button').attr('disabled', null);
    $scope.highlightAllBox();
    $('#target_image').css('opacity', 1);
  }



  $scope.imgmd = function (e) {

    if (['INPUT'].indexOf(e.target.tagName) == -1) {

        if (e.target.tagName == 'IMG' && e.button == 2) {
          return;
          // allowed
        }
        else if (e.target.tagName != 'IMG') {
          // allowed
        }
        else {
          e.preventDefault();
        }
    }
    //console.log(e);
    $scope.init_edit_box = false;
    if ($scope.tokenCreating && e.target.tagName == 'IMG' && e.target.id == 'target_image') {
      $scope.init_edit_box = true;
      $('#target_image').css('opacity', 1);
      $scope.edit_bbox = {
        start_x: e.pageX,
        start_y: e.pageY
      }
    }
    else {
      $scope.edit_bbox = {};
    }
  }

  $scope.imgmm = function (e) {

    if ($scope.tokenCreating && !!$scope.edit_bbox && $scope.edit_bbox.start_x !== undefined && $scope.edit_bbox.start_y !== undefined && $scope.init_edit_box)  {

      var start_x = $scope.edit_bbox.start_x + $('#target_image').offset().left;
      var start_y = $scope.edit_bbox.start_y + $('#target_image').offset().top;
      var x = Math.min(e.pageX, start_x);
      var y = Math.min(e.pageY, start_y);
      var max_x = Math.max(e.pageX, start_x);
      var max_y = Math.max(e.pageY, start_y);
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
      }

      _lightbox(b);
    }
    else {
      $scope.edit_bbox = {};
    }

  }

  $scope.imgmu = function (e) {
    //console.log(e);
    if ($scope.tokenCreating && $scope.init_edit_box) {
      $scope.init_edit_box = false;
      var end_x = e.pageX;
      var end_y = e.pageY;

      var newToken = new Token();
      newToken.create();

      var new_bbox = {
        full_scope: false,
        original_point: "topleft",
        x: {
          min: Math.min($scope.edit_bbox.start_x, end_x),
          max: Math.max($scope.edit_bbox.start_x, end_x)
        },
        y: {
          min: Math.min($scope.edit_bbox.start_y, end_y),
          max: Math.max($scope.edit_bbox.start_y, end_y)
        }
      };
  
      newToken.cloneBBox(new_bbox);
      $scope.edit_token = newToken;
  
      $scope.styleEditBox(new_bbox);
 
      var b = caliBox('#edit-bbox');
      _lightbox(b);
  
      $scope.addDataEntry(true);
      $scope.addRelEntry(true);

    }
    else {
      $scope.edit_bbox = {};
    }


  }

  $scope.createToken = function(e) {

    if (!_leaveWOSave()) {
      return;
    }

    $scope.cancelToRelate();

    window.tokenCreating = $scope.tokenCreating = true;
    $('button#create-new-token-button').attr('disabled', 'disabled');

    $('.token-basic').removeClass("focus");
    $('.token-basic').removeClass("hover");

    var b = caliBox('#target_image');

    $('#target_image').css('opacity', 0.5);

    _lightbox(b);
    draw(null, b);

    if ($scope.auto_select_full_scope_on_create) {
      $scope.edit_token_form.$setDirty();
      $scope.edit_token = new Token();
      $scope.edit_token.create();
      $('#target_image').css('opacity', 1);
      $scope.styleEditBox({full_scope: true});
      $scope.addDataEntry(true);
      $scope.addRelEntry(true);
    }

  }


  $scope.treeOptions = {
    dropped: function(e) {
      var ffss = 5566;
    },
  };

  $scope.rebuildTree = function () {
    var danglingPart = [];
    var nonDanglingPart = [];
    window.simple_ids = [];
    var clear_edit_token = true;
    function _rebuild(token, parent_token, inherit_idv, z_index, lvl) {
      z_index++;
      var inherit_idv = inherit_idv;
      if (!!token.meta) {
        token.meta.parent_id = parent_token.token_id;
      }

      if (typeof token.isGroup == 'function' && token.isGroup()) {
        token.ensureGroup();
      }

      var revert_viid = true;
      if (!!parent_token) {
        if ((!parent_token.isGroup() && parent_token.meta.virtual_individual_id) || inherit_idv) {
          inherit_idv = true;
          token.meta.virtual_individual_id = parent_token.meta.virtual_individual_id;
          revert_viid = false;
        }
      }


      if (!!token.token_id && !$.isEmptyObject($scope.edit_token) && token.token_id === $scope.edit_token.token_id) {
        if ($scope.edit_token_form.viid.$dirty) {
          token.meta.original_virtual_individual_id = token.meta.virtual_individual_id;
        }
        if ($scope.edit_token_form.vpid.$dirty) {
          token.meta.original_virtual_part_id = token.meta.virtual_part_id;
        }
      }

      if (revert_viid && !!token.meta && !token.isGroup()) {
        token.meta.virtual_individual_id = token.meta.original_virtual_individual_id;
      }


      if (token.description_level == 'individual') {
        token.meta.virtual_part_id = token.meta.virtual_individual_id;
      }
      else {
        if (!!token.meta && !token.isGroup()) {
          token.meta.virtual_part_id = token.meta.original_virtual_part_id;
        }
      }

      if (token.description_level != 'individual' && typeof token.isGroup == 'function' && !token.isGroup()) {
        if (token.meta.virtual_individual_id == token.meta.virtual_part_id && token.meta.virtual_part_id == token.meta.original_virtual_part_id) {
          token.meta.original_virtual_part_id = Math.uuid().toLowerCase();
          token.meta.virtual_part_id = token.meta.original_virtual_part_id;
        }
      }

      if (!!token.token_id) {
        var parent_token = token;
        $scope.boxStyle[token.token_id]['z-index'] = z_index;

        window.simple_ids.push(lvl);

        var classesToRemove = ['modified', 'hover', 'focus'];
        for (var k in $scope.classes[token.token_id]) {
          if ($scope.classes[token.token_id].hasOwnProperty(k) && k.match(/tree-simple-id-/)) {
            classesToRemove.push(k);
          }
        }

        classesToRemove.forEach(function(k) {
          $scope.classes[token.token_id][k] = null;
        });

        $scope.classes[token.token_id]['tree-simple-id-' + lvl] = true;
        //5566
        if (token.token_id == $scope.try_to_focus_me) {
          window.focusedTokenSimpleID = lvl;
          $scope.classes[token.token_id]['focus'] = true;
          $scope.setEditToken(token.token_id, null, skip_e = true);
          $scope.try_to_focus_me = null;
          clear_edit_token = false;
        }

        token['tree_simple_id'] = lvl.replace(/_/g, '.');
      }
      else {
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
        var parent_token = new Token();
        parent_token.cloneToken(tpl_token);
      }

      if (token.tokens.length > 0) {
        token.tokens.forEach(function(t, i) {
          _rebuild(t, parent_token, inherit_idv, z_index, lvl + '_' + (i+1));
        });
      }

      if (!!token.token_id) {
        $scope.tokens[token.token_id].cloneToken(token);
        if (!!token.meta && !!token.meta.virtual_individual_id) {
          if (token.meta.virtual_individual_id === token.meta.virtual_part_id) {
            if (nonDanglingPart.indexOf(token.meta.virtual_individual_id) === -1) {
              nonDanglingPart.push(token.meta.virtual_individual_id);
            }
            var dpid = danglingPart.indexOf(token.meta.virtual_individual_id);
            if (dpid > -1) {
              danglingPart.splice(dpid, 1);
            }
          }
          else {
            if (nonDanglingPart.indexOf(token.meta.virtual_individual_id) === -1) {
              if (danglingPart.indexOf(token.meta.virtual_individual_id) === -1) {
                danglingPart.push(token.meta.virtual_individual_id);
              }
            }
          }
        }
      }

    }

    _rebuild($scope.tree, null, false, 0, '1');

    console.log(danglingPart);

    if (clear_edit_token) {
      if (!$.isEmptyObject($scope.edit_token)) {
        $scope.classes[$scope.edit_token.token_id]['modified'] = true;
      }
      $scope.edit_token = null;
    }
  }


  $scope.focusTokenBasic = function (e) {
    if (!$.isEmptyObject($scope.edit_token)) {
      var focused_token_id = $scope.edit_token.token_id;
      if (!$.isEmptyObject($scope.classes[focused_token_id])) {
        $scope.classes[focused_token_id]['focus'] = true;
      }
    }
  }

  $scope.setEditToken = function(tid, e, skip_e) {

    /*
    if (!$.isEmptyObject($scope.edit_token)) {
      if (tid == $scope.edit_token.token_id) {
        return;
      }
    }
    //*/

    if (!_leaveWOSave()) {
      return;
    }

    $scope.cancelToRelate();

    if ($scope.tokenCreating) return;

    window.orig_bbox = false;

    $scope.current_token = $scope.tokens[tid];

    if (!skip_e) {
      if (!window.showAnnCtrl) {
        //$("#tree_and_form_toggle").click();
      }
      if (e.target.className.split(' ').indexOf('bbox') > -1) {
        $e_target = $('.' + tid + '.token-basic')[0];
      }
      else if (e.target.className.split(' ').indexOf('token-basic') > -1) {
        $e_target = e.target;
      }
      else {
        $e_target = $(e.target).parents('.token-basic')[0];
      }

      $('.token-basic').removeClass("focus");
      $($e_target).addClass("focus");

      $e_target.classList.forEach(function(c){
        var m = c.match(/^tree-simple-id-(.+)$/);
        if (!!m && !!m[1]) {
          window.focusedTokenSimpleID = m[1];
        }
      });

    }

    if (!$.isEmptyObject($scope.edit_token)) {
      $scope.edit_token.removeEmptyDataEntry();
      $scope.edit_token.removeEmptyRelEntry();
    }
    else {
      $scope.edit_token = new Token();
    }

    $scope.edit_token.cloneToken($scope.current_token);

    $scope.styleEditBox($scope.bbox[$scope.edit_token.token_id]);
    // $scope.edit_token.relations = (!!$scope.ann.relations[$scope.edit_token.token_id] && $scope.ann.relations[$scope.edit_token.token_id].length > 0)?cloneRel($scope.ann.relations[$scope.edit_token.token_id]):[];

    $("#edit-bbox").click();

    draw($scope.edit_token.token_id);
    $scope.addDataEntry(true);
    $scope.addRelEntry(true);

    if ($('.token-basic.' + tid).length > 0 && window.showAnnCtrl) {
      $('.token-basic-tree').animate(
        {scrollTop: $('.token-basic.' + tid).offset().top - $('.token-basic.' + tid).parents('#tree-root').offset().top}, 200
      )
    }

  }

  $scope.styleEditBox = function(bbox) {
    var editBoxStyle = $scope.styleMyBox(bbox, 'red', 3);
    $("#edit-bbox")
      .css('height', editBoxStyle.height)
      .css('width', editBoxStyle.width)
      .css('left', editBoxStyle.left)
      .css('top', editBoxStyle.top)
      .css('border', editBoxStyle.border)
      .css('position', editBoxStyle.position);
  }


  $scope.toggle = function(scope) {
    scope.toggle();
  }

  $scope.formatJSON = function (obj) {
    if (!$.isEmptyObject(obj)) {
      return JSON.stringify(JSON.parse(angular.toJson(obj)), null, 4);
    }
  }

  $scope.uiCopyToken = function (e) {
    e.stopPropagation();
    if (!$.isEmptyObject($scope.edit_token)) {
      $scope.uiCopiedToken = new Token();
      $scope.uiCopiedToken.cloneToken($scope.edit_token);
      $scope.uiCopiedToken.token_id = $scope.ann.url + '#' + $scope.edit_token.token_id;
    }
    localStorage.setItem('ui_copied_token_id', $scope.ann.url + '#' + $scope.edit_token.token_id);
    localStorage.setItem('ui_copied_token', angular.toJson($scope.uiCopiedToken));
  }

  $scope.uiPasteBBox = function (e) {
    e.stopPropagation();

    $scope.uiCopiedToken = JSON.parse(localStorage.getItem('ui_copied_token'));

    if (!$.isEmptyObject($scope.edit_token) && !$.isEmptyObject($scope.uiCopiedToken) && !$.isEmptyObject($scope.uiCopiedToken.bbox)) {
      $scope.edit_token_form.$setDirty();
      $scope.edit_token.cloneBBox($scope.uiCopiedToken.bbox);
      $scope.styleEditBox($scope.edit_token.getBBox());
      var b = caliBox($scope.uiCopiedToken.token_id);
      _lightbox(b);
    }
  }

  $scope.uiPasteToken = function (e, asNew, dataOnly) {
    e.stopPropagation();
    var asNew = !!asNew;
    var dataOnly = !!dataOnly;

    $scope.uiCopiedToken = JSON.parse(localStorage.getItem('ui_copied_token'));

    if (!$.isEmptyObject($scope.uiCopiedToken)) {
      $scope.edit_token_form.$setDirty();
      if ($.isEmptyObject($scope.edit_token) || asNew) {
        $scope.createToken();
        $scope.edit_token = new Token();
        $scope.edit_token.create();
        $('#target_image').css('opacity', 1);
      }

      var edit_token_id = $scope.edit_token.token_id;

      if (dataOnly) {
        $scope.edit_token.cloneDataAndRelation($scope.uiCopiedToken);
      }
      else {
        $scope.edit_token.cloneToken($scope.uiCopiedToken);
      }

      $scope.edit_token.token_id = edit_token_id;
      $scope.styleEditBox($scope.edit_token.getBBox());
      var b = caliBox(null, null, $scope.edit_token.getBBox());
      _lightbox(b);
    }
  }

  $scope.uiDeleteToken = function (e, tid) {

    $scope.tokenDeleting = true;

    e.stopPropagation();
    console.log('deleting');
    if (!$.isEmptyObject($scope.edit_token) && $scope.edit_token.token_id == tid) {
      $scope.edit_token = null;
    }

    $scope.tokens[tid] = undefined;
    $scope.classes[tid] = undefined;
    $scope.bbox[tid] = undefined;
    $scope.meta[tid] = undefined;
    $scope.boxStyle[tid] = undefined;

    var token_exists = false;
    var which_token = -1;
    $scope.ann.tokens.some(function(el, idx) {
      if (tid == el.token_id) {
        which_token = idx;
        token_exists = true;
      }
      return token_exists;
    });

    $scope.ann.tokens.splice(which_token, 1);

    $scope.tree = {tokens: []};

    for (var i = 0; i < $scope.ann.tokens.length; i++) {
      var token = $scope.ann.tokens[i];
      token.tokens = [];
    }
    for (var i = 0; i < $scope.ann.tokens.length; i++) {
      var token = $scope.ann.tokens[i];
      if (!token.meta || !token.meta.parent_id) {
        $scope.tree.tokens.push(token);
      }
      else {
        if (!!$scope.tokens[token.meta.parent_id]) {
          $scope.tokens[token.meta.parent_id].tokens.push(token);
        }
        else {
          $scope.tree.tokens.push(token);
        }
      }
    }
    $scope.rebuildTree();
    $scope.edit_token_form.$setDirty();
    $scope.tokenDeleting = false;
    //$scope.saveAnnotation(function(){
    //});
  }


  $scope.selectFullScope = function () {

    if (!!$scope.tokenCreating && !$scope.edit_token) {

      $scope.edit_token_form.$setDirty();
      $scope.edit_token = new Token();
      $scope.edit_token.create();
      $('#target_image').css('opacity', 1);

      $scope.styleEditBox({full_scope: true});
    }
  }



  $scope.readyToRelate = function (e, ri) {
    $scope.isReadyToRelate = true;
    $scope.tokenRelationIdx = ri;
  }

  $scope.cancelToRelate = function (e) {
    $scope.isReadyToRelate = false;
    $scope.tokenRelationIdx = null;

    if (!$.isEmptyObject($scope.edit_token)) {
      $scope.current_token = $scope.tokens[$scope.edit_token.token_id];
      draw($scope.current_token.token_id);
    }
  }

  $scope.setRelationObject = function (e, token_id) {
    e.preventDefault();
    $scope.edit_token.relations[$scope.tokenRelationIdx].object = token_id;
  }

  $scope.consoleCmd = function (e) {
  }

  $scope.ctrlPasteSth = function (e) {
    if (!(e.ctrlKey && (e.key == 'v' || e.key == 'V'))) {
      return;
    }
    $scope.uiCopiedToken = JSON.parse(localStorage.getItem('ui_copied_token'));
    if (!$.isEmptyObject($scope.uiCopiedToken)) {
      $scope.edit_token_form.$setDirty();
      e.preventDefault();
      var name = e.target.name;
      switch (name) {
        case 'viid':
          $scope.edit_token_form.viid.$setDirty();
          $scope.edit_token.meta.virtual_individual_id = $scope.uiCopiedToken.meta.virtual_individual_id;
          break;
        case 'vpid':
          $scope.edit_token_form.vpid.$setDirty();
          $scope.edit_token.meta.virtual_part_id = $scope.uiCopiedToken.meta.virtual_part_id;
          break;
      }
    }
  }

  $scope.ctrlPasteCopiedToken = function (e, ri) {
    if (e.ctrlKey && (e.key == 'v' || e.key == 'V')) {
      e.preventDefault();
      $scope.edit_token_form.$setDirty();
      $scope.tokenIDFromCopiedToken(e, ri);
    }
  }


  $scope.tokenIDFromCopiedToken = function (e, ri) {
    e.preventDefault();
    var url_token_id = localStorage.getItem('ui_copied_token_id');
    var token_id_parts = url_token_id.split('#');

    var token_id = token_id_parts.pop();

    if (token_id_parts.join('') == $scope.ann.url) {
      $scope.edit_token.relations[ri].object = token_id;
    }
    else {
      $scope.edit_token.relations[ri].object = url_token_id;
    }
  }

  var _makeUrlToken = function (url, token_id) {

    if (!token_id) return "";

    var frags = [];

    var test = _getUrlToken(token_id);
    var token_id = test.token_id;

    if (!!url) {
      frags.push(url);
    }
    else if (!!test.url) {
      frags.push(test.url);
    }
    else {
      frags.push($scope.ann.url);
    }

    frags.push(token_id);
    return frags.join('#');

  }

  var _getUrlToken = $scope.getUrlToken = function (urlToken) {
    if (!urlToken) return "";
    var urlToken = urlToken;
    var frags = urlToken.split('#');
    if (frags.length >= 2) {
      var token_id = null;
      var which = -1;
      frags.some(function(f, i) {
        if (f.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
          token_id = f;
          which = i;
          return true;
        }
      });

      if (which > -1) {
        frags.splice(which, 1);
      }
      var url = frags.join('');
    }
    else {
      if (frags[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
        var token_id = frags[0];
        var url = $scope.ann.url;
      }
      else {
        var token_id = null;
        var url = frags[0];
      }
    }
    return {
      url: url,
      token_id: token_id
    }
  }

  $scope.displayRelObject = function (obj) {
    var obj = _getUrlToken(obj);
    if (obj.url == $scope.ann.url) {
      return obj.token_id;
    }
    return obj.url + '#' + obj.token_id;
  }



  $scope.resolveUrlToken = function (e, urlToken) {

    var ut = _getUrlToken(urlToken);
    var url = ut.url;
    var token_id = ut.token_id;

    $scope.try_to_focus_me = token_id;

    var idx = $scope.image_list.indexOf(url);
    if (idx > -1) {
      if (!!url) {
        alert('影像紀錄不存在, 無法解析!');
        console.log('No image url, current image url will be used.');
      }
    }
    else {
      idx = $scope.image_list.push(url) - 1;
    }
    _selectImage(idx);
  }

  $scope.img2data = function () {
    /*
    var cmv = document.getElementById('can_my_vas');
    var ctx = cmv.getContext('2d');
    var target_image = document.getElementById('target_image');

    cmv.width = target_image.width;
    cmv.height = target_image.height;

    ctx.drawImage(target_image, 0, 0);
    target_image.setAttribute('crossOrigin', 'anonymous');
    var dataURL = cmv.toDataURL();
    //*/
  }

  $scope.uuid = function () {
    return Math.uuid().toLowerCase();
  }

  $scope.simpleSearch = function (data, merge) {
    if (!data) {
      var data = {contains: $scope.toSearch};
    }
    else if (!data.contains) {
      data.contains = '';
    }

    var merge = merge;
    if (!merge) {
      var merge = false;
    }

    simpleQueryService.simpleQuery("mongo_simple_query.php", data, post=true)
      .then(function (ret) {
        if (ret.result.length > 0) {
          $scope.hasSolidImageList = true;
          if (!merge) {
            $scope.image_list = ret.result;
          }
          else {
            var merged = $.merge(ret.result, $scope.image_list).unique();
            $scope.image_list = merged;
          }
          _selectImage(0);
        }
      })
  }

  $scope.initSessionImageList = function () {
    localStorage.setItem('mergedList', angular.toJson($scope.image_list));
    $scope.hasMergedSessionImageList = true;
  }

  $scope.graphSessionImageList = function () {
    localStorage.setItem('listForGraph', angular.toJson($scope.image_list));
    window.open("http://twebi.net/imgAnn/cyto/", "_blank");
  }

  $scope.mergeSessionImageList = function () {
    var arr1 = $scope.image_list;
    var arr2 = JSON.parse(localStorage.getItem('mergedList'));
    //$scope.image_list = arrayUnique(arr1.concat(arr2));
    $scope.image_list = arrayUnique(arr2.concat(arr1));
    localStorage.setItem('mergedList', angular.toJson($scope.image_list));
    localStorage.setItem('image2carrier', angular.toJson($scope.image2carrier));
    _selectImage(arr2.length + $scope.current_image_idx);
  }



  // upload later on form submit or something similar
  $scope.submit = function() {
    // if ($scope.form.file.$valid && $scope.file) {
    if ($scope.files[0]) {
      $scope.upload($scope.files[0]);
    }
  };

  // upload on file select or drop
  $scope.upload = function (file) {
    Upload.upload({
      url: 'upload/url',
      data: {file: file, 'username': $scope.username}
    }).then(function (resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

  $scope.uploadFiles = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        //Upload.upload({..., data: {file: files[i]}, ...})...;
      }
      // or send them all together for HTML5 browsers:
      //Upload.upload({..., data: {file: files}, ...})...;
    }
  }

  $scope.autoValueClicked = function (di, v) {
    $scope.edit_token.data[di].value = v.vname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim();
    $scope.showSelectionBox[$scope.edit_token.token_id + "_" + $scope.edit_token.data[di].key + "-di-" + di] = false;

    var sciname_filled = false;
    $scope.edit_token.data.forEach(function(d) {
      if (d.key === 'name-scientific') {
        d.value = v.sciname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim();
        sciname_filled = true;
      }
    });
    if (sciname_filled === false) {
      $scope.edit_token.data.push({
        label: '物種學名',
        key:   'name-scientific',
        value: v.sciname.replace(/\(.+\)/g, '').replace(/ +/, ' ').trim(),
        unit:  ''
      });
    }
  }

  $scope.cellBlurred = function (e) {
    window.escapeTarget = e.target;
  }


  $scope.autoValues = function (di) {
    var txt = $scope.edit_token.data[di].value;
    var attrName = $scope.edit_token.data[di].key;

    if (attrName != 'name-vernacular-zhtw') {
      $scope.autoRes[attrName] = [];
      return;
    }

    $scope.showSelectionBox[$scope.edit_token.token_id + "_" + $scope.edit_token.data[di].key + "-di-" + di] = true;

    if (txt === '') {
      $scope.showSelectionBox[$scope.edit_token.token_id + "_" + $scope.edit_token.data[di].key + "-di-" + di] = false;
    }

    if ($.isEmptyObject($scope.autoRes[attrName])) {
      simpleQueryService.simpleQuery("splist.csv", {})
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
          $scope.autoRes[attrName] = res;
        })
    }
  }



  _getImageList();

}]);

app.factory('simpleQueryService', ['$http', function($http) {
  var simpleQuery = function (url, reqData, post) {
    if (!post) {
      return $http.get(url, reqData)
        .then (
          function (response) {
            return response.data;
          },
          function (httpError) {
            // translate the error
            throw httpError.status + " : " +
                  httpError.data;
          }
        );
    }
    else {
      return $http.post(url, reqData)
        .then (
          function (response) {
            return response.data;
          },
          function (httpError) {
            // translate the error
            throw httpError.status + " : " +
                  httpError.data;
          }
        );
    }
  }
  return {simpleQuery: simpleQuery}
}]);

app.directive('imageonload', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('load', function() {
        //call the function that was passed
        scope.$apply(attrs.imageonload);
      });
    }
  };
});

app.filter('displayRelObject', function() {
  return function(obj, scope) {
    var obj = scope.getUrlToken(obj);
    if (obj.url == scope.ann.url) {
      return obj.token_id;
    }

    if (!obj.token_id) {
      return "";
    }

    return obj.url + '#' + obj.token_id;
  };
});
