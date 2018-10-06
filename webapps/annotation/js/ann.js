$(window).load(function() {

  $('#target_image').load(function(){
    if (this.naturalHeight !== 0 && this.complete) {
      draw('#target_image');
    }
  });

  window.canvas = document.getElementById("canvas");
  window.ctx = canvas.getContext("2d");

  window.draw = function (token_id, b){

    window.$target_image = $('#target_image');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (!!b) {
      var b = b;
    }
    else {
      if (!!token_id.match('#')) {
        var b = caliBox(token_id, isBox = false);
      }
      else {
        var b = caliBox('div.' + token_id + '.bbox', isBox = false);
      }
    }

    var adj_w = b.w;
    var adj_h = b.h;

    if (b.w > b.h) {
      var bigger = b.w;
      if (bigger > 400) {
        var ratio = bigger / 400;
        adj_w = 400;
        adj_h = b.h / ratio;
      }
    }
    else {
      var bigger = b.h;
      if (bigger > 300) {
        var ratio = bigger / 300;
        adj_w = b.w / ratio;
        adj_h = 300;
      }
    }

    var adj_top = (300 - adj_h) / 2;
    var adj_left = (400 - adj_w) / 2;


    ctx.drawImage($target_image[0], b.x, b.y, b.w, b.h, adj_left, adj_top, adj_w, adj_h);
    //canvas.width = b.w;
    //canvas.height = b.h;
    //alert(b.w + ',' + b.h);
  }


  window.caliBox = function(target, isBox, bbox) {

    //var w = Math.ceil($(target).width());
    //var h = Math.ceil($(target).height());
    //var y = Math.round($(target).position().top) + 3;
    //var x = Math.round($(target).position().left) + 3;

    if (!!bbox) {
      var target = '#target_image';
      w = bbox.x.max - bbox.x.min;
      h = bbox.y.max - bbox.y.min;
    }
    else {
      var w = parseFloat($(target).css('width'));
      var h = parseFloat($(target).css('height'));
    }

    if (isBox === false) {
      var y = parseFloat($(target).css('top'));
      var x = parseFloat($(target).css('left'));
    }
    else {
      var y = parseFloat($(target).css('top')) + 3;
      var x = parseFloat($(target).css('left')) + 3;
    }


    // topleft default?? 
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    if (!!bbox) {
      x = x + bbox.x.min;
      y = y + bbox.y.min;
    }

    if (x < 0) {
      w = w + x;
      x = 0;
    }
    if (y < 0) {
      h = h + y;
      y = 0;
    }

    $target_image = $('#target_image');
    var img_w = $target_image.width();
    var img_h = $target_image.height();

    w = (w + x > img_w) ? img_w - x : w;
    h = (h + y > img_h) ? img_h - y : h;

    w = (w > img_w) ? img_w : w;
    h = (h > img_h) ? img_h : h;

    w = (w < 0) ? 0 : w;
    h = (h < 0) ? 0 : h;


    x_max = Math.round(x + w);
    x = Math.round(x);
    y_max = Math.round(y + h);
    y = Math.round(y);

    w = Math.round(w);
    h = Math.round(h);

    window.ann_token_bbox = {};
    window.ann_token_bbox.x = {
      min: x,
      max: x_max
    }

    window.ann_token_bbox.y = {
      min: y,
      max: y_max
    }

    return {
      x: x,
      y: y,
      w: w,
      h: h,
      min_x: x,
      max_x: x_max,
      min_y: y,
      max_y: y_max
    }

  }

  function _showMsg(target) {
    var b = caliBox(target);
    var msg = "top: " + b.y + ", " + "left: " + b.x + ", " + "width: " + b.w + ", " + "height: " + b.h;
    $('#msg').text(msg);
    return b;
  }

  window._lightbox = function(b) {

    $target_image = $('#target_image');
    var img_w = $target_image.width();
    var img_h = $target_image.height();
    var bgcolor = 'rgba(30,30,30,0.6)'
    $('.outer.left').css('width', b.x).css('height', img_h).css('left', 0).css('top', 0).css('background', bgcolor);
    $('.outer.top').css('width', b.w).css('height', b.y).css('left', b.x).css('top', 0).css('background', bgcolor);
    $('.outer.bottom').css('width', b.w).css('height', img_h - b.max_y).css('left', b.x).css('top', b.h + b.y).css('background', bgcolor);
    $('.outer.right').css('width', img_w - b.max_x).css('height', img_h).css('left', b.max_x).css('top', 0).css('background', bgcolor);
    draw(null, b);
  }

  function _focusOnTokenBasicBySimpleID(simpleID, autoscroll) {
        window.focusedTokenSimpleID = simpleID;
        if ($('.tree-simple-id-' + simpleID).length > 0) {
          $('.tree-simple-id-' + simpleID).mouseover();
          $('.tree-simple-id-' + simpleID).mousedown();
          $('.tree-simple-id-' + simpleID).mouseup();
        }
        $('.annConsole').val('');
        $('.token-basic-tree').focus();

        if ($('.tree-simple-id-' + simpleID).length > 0 && !!autoscroll) {
          $('.token-basic-tree').animate(
            {scrollTop: $('.tree-simple-id-' + simpleID).offset().top - $('.tree-simple-id-' + simpleID).parents('#tree-root').offset().top}, 100
          )
        }
  }

  function _nextToken () {
    var current_id = window.focusedTokenSimpleID;
    if (!current_id) {
      current_id = window.focusedTokenSimpleID = '1_1';
      if (window.simple_ids.indexOf(window.focusedTokenSimpleID) == 0) {
        return window.simple_ids[0];
      }
    }

    var idx = window.simple_ids.indexOf(window.focusedTokenSimpleID);
    if (idx < window.simple_ids.length - 1) {
      idx++;
      return window.simple_ids[idx];
    }
    else if (idx == -1) {
      return null;
    }
    return window.simple_ids[idx];
  }

  function _prevToken (tree_simple_id) {
    var current_id = window.focusedTokenSimpleID;
    if (!current_id) {
      current_id = window.focusedTokenSimpleID = '1_1';
    }

    var idx = window.simple_ids.indexOf(window.focusedTokenSimpleID);
    if (idx > 0) {
      idx--;
      return window.simple_ids[idx];
    }
    else if (idx == -1) {
      return null;
    }
    return window.simple_ids[idx];
  }


  $(document).keydown(function(e) {
    
    if (e.target.tagName != 'INPUT' || e.target.getAttribute('data-no-text') !== null) {

      if (e.key == 'g') {
        if (!window.lastG) {
          window.lastG = Date.now();
          return;
        }
        var time_diff = Date.now() - window.lastG;
        window.lastG = Date.now();
        if (time_diff <= 300) {
          $('#auto-copy-all-tokens').click();
        }
      }
      else if (e.key == 'ArrowDown') {
        if (!window.tokenCreating) {
          e.preventDefault();
          _focusOnTokenBasicBySimpleID(_nextToken(window.focusedTokenSimpleID), true);
        }
      }
      else if (e.key == 'ArrowUp') {
        if (!window.tokenCreating) {
          e.preventDefault();
          _focusOnTokenBasicBySimpleID(_prevToken(window.focusedTokenSimpleID), true);
        }
      }
      else if (e.key == 'a' || e.key == 'A') {
        // $(".add-a-row-button").click();
      }
      else if (e.key == 'r' || e.key == 'R') {
        $("md-tab-item:not(.md-active)").click();
        $(".token-basic-tree").focus();
      }
      else if (e.key == 't' || e.key == 'T') {
        if (!(window.annScope.tokenCreating && !window.annScope.edit_token && !window.showAnnCtrl)) {
          $("#tree_and_form_toggle").click();
        }
        else {
          alert('Draw a box first!');
        }
      }
      else if (e.key == 'n' || e.key == 'N' || e.key == 'ArrowRight') {
        if (!window.tokenCreating) {
          e.preventDefault();
          $(".main_next_image").click();
        }
      }
      else if (e.key == 'p' || e.key == 'P' || e.key == 'ArrowLeft') {
        if (!window.tokenCreating) {
          e.preventDefault();
          $(".main_prev_image").click();
        }
      }
      else if (e.key == 'v' || e.key == 'V') {
        if (e.ctrlKey) {
          $('#paste-as-new-token-button').mousedown();
          $('#paste-as-new-token-button').mouseup();
        }
      }
      else if (e.key == 'c' || e.key == 'C') {
        if (e.ctrlKey) {
          $('.token-basic.focus').find('button.copy_token').mousedown();
          $('.token-basic.focus').find('button.copy_token').mouseup();
        }
        else {
          if ($.isEmptyObject(window.annScope.edit_token)) {
            if (window.showAnnCtrl === true && !window.annScope.auto_select_full_scope_on_create) {
              $("#tree_and_form_toggle").click();
            }
            $("#create-new-token-button").click();
          }
        }
      }
      else if (e.keyCode == 27) {
        if ($("#create-new-token-button").attr('disabled') == 'disabled' || $('.main.cancel-editing-token-button').css('display') !== 'none') {
          $(".main.cancel-editing-token-button").click();
        }
        else {
          if (window.showAnnCtrl === true) {
            $("#tree_and_form_toggle").click();
          }
        }
      }
      else if (e.keyCode == 105 || e.keyCode == 73 || e.key == 'i' || e.key == 'I') {
        if (!!window.escapeTarget) {
          e.preventDefault();

          if (($(window.escapeTarget).parents('md-tab-content').length > 0) && ($(window.escapeTarget).parents('.md-active').length > 0)) {
            $(window.escapeTarget).focus();
          }
          else {
            $('.md-active .user-input').first().focus();
          }
          //window.escapeTarget = null;
        }
        else {
          e.preventDefault();
          $('.md-active .user-input').first().focus();
        }
      }
      else if (e.keyCode == 111 || e.keyCode == 80 || e.key == 'o' || e.key == 'O') {
        e.preventDefault();
        $('.md-active .user-input-first-cell').last().focus();
      }
      else if (e.keyCode == 119 || e.keyCode == 87 || e.key == 'w' || e.key == 'W') {
        // e.preventDefault();
        $('.annConsole').focus();
      }
      else if (e.key >= '1' && e.key <= '9') {
        if (!!window.showAnnCtrl) {
          $('.annConsole').focus();
        }
      }
      else if (e.key == ':' || e.key == '/') {
        if (e.key != '/') {
          e.preventDefault();
        }
        window.showAnnCtrl = false;
        $("#tree_and_form_toggle").click();
        $('.annConsole').focus();
      }
    } // in input tag
    else {
      if (e.key == 'ArrowDown') {
        var name = $(e.target).attr('name');
        var _nrow = $(e.target).attr('nrow');
        var type = _nrow.split('-')[0];
        var nrow = parseInt(_nrow.split('-')[1]) + 1;
        var nextRowCell =  $('.' + name + '[nrow=' + type + '-' + nrow + ']');
        if (nextRowCell.length > 0) {
          nextRowCell.focus();
        }
        else {
          $('button.add-'+type).click();
        }
      }
      else if (e.key == 'ArrowUp') {
        var name = $(e.target).attr('name');
        var _nrow = $(e.target).attr('nrow');
        var type = _nrow.split('-')[0];
        var nrow = parseInt(_nrow.split('-')[1]) - 1;
        var prevRowCell =  $('.' + name + '[nrow=' + type + '-' + nrow + ']');
        if (prevRowCell.length > 0) {
          prevRowCell.focus();
        }
      }
      else if (e.keyCode == 27) {
        window.escapeTarget = e.target;
        var di = $(window.escapeTarget).attr('nrow').split('-')[1];
        var cell_id = annScope.edit_token.token_id + "_" + annScope.edit_token.data[di].key + "-di-" + di;
        if (annScope.showSelectionBox[cell_id]) {
          annScope.showSelectionBox[cell_id] = false;
          annScope.$apply();
        }
        else {
          //$(e.target).blur();
          $('.token-basic-tree').focus();
        }
      }
      else if (e.keyCode == 13) {
        var cmd = $('.annConsole').val();
        if (cmd.match(/^([1-9]+\.)+[1-9]$/) !== null) {
          cmd = cmd.replace(/\./g, '_');
          _focusOnTokenBasicBySimpleID(cmd, true);
        }
        else if (cmd == 'w' || cmd == 'W') {
          $('#main_save_xd').click();
        }
        else if (cmd == 'q' || cmd == 'Q') {
          $("#tree_and_form_toggle").click();
        }
        else if (cmd.toLowerCase() == 'wq') {
          $('#main_save_xd').click();
          $("#tree_and_form_toggle").click();
        }
        else if (cmd.toLowerCase().match(/\/(.+)/)) {
          var toSearch = cmd.toLowerCase().match(/\/(.+)/)[1].trim();
          window.annScope.toSearch = toSearch;
          $('#simple-search').click();
        }
        $('.annConsole').val('');
        $('.token-basic-tree').focus();
      }
    }
  });


  window.showAnnCtrl = false;
  $("#tree_and_form").draggable({handle:'.ctrl_panel_drag_handle'});
  $("#tree_and_form").dblclick(function(e){
    if (['TD', 'INPUT', 'CANVAS', 'BUTTON'].indexOf(e.target.tagName) == -1) {
      $("#tree_and_form_toggle").click();
    }
  });
  $("#tree_and_form_toggle").click(function(e){
    if (window.showAnnCtrl) {
      $(this).parent().next().hide();
      $(this).parents('.ctrl_panel').css('width', 0);
      $(this).parents('.ctrl_panel').css('left', 'calc(100% - 100px)');
      $(this).parents('.ctrl_panel').css('top', 30);
      $(this).parents('.ctrl_panel').addClass('annCtrlPanelHide');
      $(this).parents('.ctrl_panel').removeClass('annCtrlPanelShow');
    }
    else {
      $(this).parent().next().show();
      $(this).parents('.ctrl_panel').css('width', 1400);
      $(this).parents('.ctrl_panel').css('left', 100);
      $(this).parents('.ctrl_panel').css('top', 50);
      $(this).parents('.ctrl_panel').addClass('annCtrlPanelShow');
      $(this).parents('.ctrl_panel').removeClass('annCtrlPanelHide');
      $('.token-basic-tree').focus();
    }
    window.showAnnCtrl = !window.showAnnCtrl;
  });

  $("#edit-bbox")
    .resizable({
      grid: 1,
      resize: function (e, ui) {
        var b = _showMsg(e.target);
        _lightbox(b);
      }
    })
    .draggable({
      grid: [1, 1],
      drag: function (e, ui) {
        var b = _showMsg(e.target);
        _lightbox(b);
      }
    })
    .dblclick(function(e){

      if (!window.orig_bbox) {
        window.orig_bbox = {};
        window.orig_bbox.w = parseFloat($(e.target).css('width'));
        window.orig_bbox.h = parseFloat($(e.target).css('height'));
        window.orig_bbox.y = parseFloat($(e.target).css('top'));
        window.orig_bbox.x = parseFloat($(e.target).css('left'));
        $(e.target)
          .css('height', $('#target_image').height())
          .css('width', $('#target_image').width())
          .css('top', -3)
          .css('left', -3);
      }
      else {
        $(e.target)
          .css('height', window.orig_bbox.h)
          .css('width', window.orig_bbox.w)
          .css('top', window.orig_bbox.y)
          .css('left', window.orig_bbox.x);
        window.orig_bbox = false;
      }

      var b = _showMsg(this);
      _lightbox(b);
    })
    .click(function(e){
      var b = _showMsg(this);
      _lightbox(b);
    });

});
