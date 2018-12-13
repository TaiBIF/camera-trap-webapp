$(window).load(function() {
  $('#target_image').load(function() {
    if (this.naturalHeight !== 0 && this.complete) {
      draw('#target_image');
    }
  });

  window.canvas = document.getElementById('canvas');
  window.ctx = canvas.getContext('2d');

  window.draw = function(token_id, b) {
    var canvasWidth = 320;
    var canvasHeight = 240;

    window.$target_image = $('#target_image');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (b) {
      var b = b;
    } else {
      if (token_id.match('#')) {
        var b = caliBox(token_id, (isBox = false));
      } else {
        var b = caliBox('div.' + token_id + '.bbox', (isBox = false));
      }
    }

    var adj_w = b.w;
    var adj_h = b.h;

    if (b.w > b.h) {
      var bigger = b.w;
      if (bigger > canvasWidth) {
        var ratio = bigger / canvasWidth;
        adj_w = canvasWidth;
        adj_h = b.h / ratio;
      }
    } else {
      var bigger = b.h;
      if (bigger > canvasHeight) {
        var ratio = bigger / canvasHeight;
        adj_w = b.w / ratio;
        adj_h = canvasHeight;
      }
    }

    var adj_top = (canvasHeight - adj_h) / 2;
    var adj_left = (canvasWidth - adj_w) / 2;

    ctx.drawImage(
      $target_image[0],
      b.x * annScope.imgRatio,
      b.y * annScope.imgRatio,
      b.w * annScope.imgRatio,
      b.h * annScope.imgRatio,
      adj_left,
      adj_top,
      adj_w,
      adj_h,
    );
    //canvas.width = b.w;
    //canvas.height = b.h;
    //alert(b.w + ',' + b.h);
  };

  window.caliBox = function(target, isBox, bbox) {
    //var w = Math.ceil($(target).width());
    //var h = Math.ceil($(target).height());
    //var y = Math.round($(target).position().top) + 3;
    //var x = Math.round($(target).position().left) + 3;

    if (bbox) {
      var target = '#target_image';
      w = bbox.x.max - bbox.x.min;
      h = bbox.y.max - bbox.y.min;
    } else {
      var w = parseFloat($(target).css('width'));
      var h = parseFloat($(target).css('height'));
    }

    if (isBox === false) {
      var y = parseFloat($(target).css('top'));
      var x = parseFloat($(target).css('left'));
    } else {
      var y = parseFloat($(target).css('top')) + 3;
      var x = parseFloat($(target).css('left')) + 3;
    }

    // topleft default??
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    if (bbox) {
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

    w = w + x > img_w ? img_w - x : w;
    h = h + y > img_h ? img_h - y : h;

    w = w > img_w ? img_w : w;
    h = h > img_h ? img_h : h;

    w = w < 0 ? 0 : w;
    h = h < 0 ? 0 : h;

    x_max = Math.round(x + w);
    x = Math.round(x);
    y_max = Math.round(y + h);
    y = Math.round(y);

    w = Math.round(w);
    h = Math.round(h);

    window.ann_token_bbox = {};
    window.ann_token_bbox.x = {
      min: x,
      max: x_max,
    };

    window.ann_token_bbox.y = {
      min: y,
      max: y_max,
    };

    return {
      x: x,
      y: y,
      w: w,
      h: h,
      min_x: x,
      max_x: x_max,
      min_y: y,
      max_y: y_max,
    };
  };

  function _showMsg(target) {
    var b = caliBox(target);
    var msg =
      'top: ' +
      b.y +
      ', ' +
      'left: ' +
      b.x +
      ', ' +
      'width: ' +
      b.w +
      ', ' +
      'height: ' +
      b.h;
    $('#msg').text(msg);
    return b;
  }

  window._lightbox = function(b) {
    $target_image = $('#target_image');
    var img_w = $target_image.width();
    var img_h = $target_image.height();
    var bgcolor = 'rgba(30,30,30,0.6)';
    $('.outer.left')
      .css('width', b.x)
      .css('height', img_h)
      .css('left', 0)
      .css('top', 0)
      .css('background', bgcolor);
    $('.outer.top')
      .css('width', b.w)
      .css('height', b.y)
      .css('left', b.x)
      .css('top', 0)
      .css('background', bgcolor);
    $('.outer.bottom')
      .css('width', b.w)
      .css('height', img_h - b.max_y)
      .css('left', b.x)
      .css('top', b.h + b.y)
      .css('background', bgcolor);
    $('.outer.right')
      .css('width', img_w - b.max_x)
      .css('height', img_h)
      .css('left', b.max_x)
      .css('top', 0)
      .css('background', bgcolor);
    draw(null, b);
  };

  window.showAnnCtrl = true;

  /*
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
  //*/

  $('#edit-bbox')
    .resizable({
      grid: 1,
      resize: function(e, ui) {
        var b = _showMsg(e.target);
        _lightbox(b);
      },
    })
    .draggable({
      grid: [1, 1],
      drag: function(e, ui) {
        var b = _showMsg(e.target);
        _lightbox(b);
      },
    })
    .dblclick(function(e) {
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
      } else {
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
    .click(function(e) {
      var b = _showMsg(this);
      _lightbox(b);
    });
});
