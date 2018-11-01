window.$target_image = null;
window.x_max = 0;
window.y_max = 0;
window.ctx = null;

window.draw = function (token_id, b){

  window.$target_image = $('#target_image');
  // window.ctx.clearRect(0, 0, canvas.width, canvas.height);


  if (!!b) {
    var b = b;
  }
  else {
    if (!!token_id.match('#')) {
      var b = caliBox(token_id, false);
    }
    else {
      var b = caliBox('div.' + token_id + '.bbox', false);
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


  // ctx.drawImage($target_image[0], b.x, b.y, b.w, b.h, adj_left, adj_top, adj_w, adj_h);
  //canvas.width = b.w;
  //canvas.height = b.h;
  //alert(b.w + ',' + b.h);
}


window.caliBox = function(target, isBox, bbox) {

  var w = Math.ceil($(target).width());
  var h = Math.ceil($(target).height());
  var y = Math.round($(target).position().top);
  var x = Math.round($(target).position().left);

  if (!bbox==false) {
    var target = '#target_image';
    w = bbox.x.max - bbox.x.min;
    h = bbox.y.max - bbox.y.min;
  }
  else {
    var w = parseFloat($(target).css('width'));
    var h = parseFloat($(target).css('height'));
  }

  var y = parseFloat($(target).css('top'));
  var x = parseFloat($(target).css('left'));

  // topleft default?? 
  if (isNaN(x)) x = 0;
  if (isNaN(y)) y = 0;

  if (!bbox==false) {
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
  
  $('.outer.left').css('width', b.x).css('height', img_h).css('top', 0);
  $('.outer.top').css('width', b.w).css('height', b.y).css('left', b.x);
  $('.outer.bottom').css('width', b.w).css('height', img_h - b.max_y + 3).css('left', b.x);
  $('.outer.right').css('width', img_w - b.max_x).css('height', img_h);
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

