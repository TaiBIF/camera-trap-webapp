$('.dropdown-toggle').dropdown();


function openUpload() {
  var item = [];
  if( !window.localStorage.getItem('TaiBifPages') ) {
    window.localStorage.setItem('TaiBifPages', '');
  } else {
    var pages = window.localStorage.getItem('TaiBifPages');
    item = JSON.parse(pages);
  }
  
  var index = item.length;

  item.push({
    name: 'pages-' + index,
    sizes: 0
  });

  window.localStorage.setItem('TaiBifPages', JSON.stringify(item));
  
  window.open('upload.html', 'taibif-pages-' + index);
}