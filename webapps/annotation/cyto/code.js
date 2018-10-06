function simpleID (str) {
  return encodeURIComponent(str).replace(/%/g, '_');
}

function makeCyLayout () {
  var layout = $cy.makeLayout(
    {
      name:'cose-bilkent',
      padding: 30,
      animate:false,
      idealEdgeLength: 180,
      gravityCompound: 10,
      gravity: 10
    }
  );
//  var layout = $cy.makeLayout({name:'cose', padding: 30, animate:true});
  layout.run();
}

$(function(){ // on dom ready

window.counter = 0;
var image_urls = JSON.parse(localStorage.getItem('listForGraph'));

var token2part = {};
var token2idv = {};
var token2descLvl = {};
var doMeLater = [];
var action = "../mongo_load.php";

var all_tokens = [];

image_urls.forEach(function(url) {

  var url = url;
  var data = {url: url};

  var _callback = function(res) {
    //console.log(5566);
    if (!!res.result && !!res.result.tokens)
    res.result.tokens.forEach(function(t) {

      token2part[t.token_id] = t.meta.virtual_part_id;
      token2idv[t.token_id] = t.meta.virtual_individual_id;
      token2descLvl[t.token_id] = t.description_level;

      if (!!t.meta.virtual_individual_id && $cy.$('#'+t.meta.virtual_individual_id).length == 0) {
        $cy.add({group: 'nodes', classes: 'individual', data: {id: t.meta.virtual_individual_id}, position: {x:0, y:0}});
      }

      if (!!t.meta.virtual_part_id && $cy.$('#'+t.meta.virtual_part_id).length == 0) {
        $cy.add({group: 'nodes', classes: 'square', data: {label: t.description_level, desc_lvl: t.description_level, id: t.meta.virtual_part_id}, position: {x:0, y:0}});
      }

      if (!!t.meta.virtual_individual_id && $cy.$('#'+t.meta.virtual_individual_id).length > 0) {
        // find name-vernacular-zhtw
        var idv_label = '';
        var fallback = '';
        for (var di = 0; di < t.data.length; di++) {
          if (t.data[di].key == 'name-vernacular-zhtw' && !!t.data[di].value) {
            idv_label = t.data[di].value;
          }
          else if (t.data[di].key == 'category-zhtw' && !!t.data[di].value) {
            fallback = t.data[di].value;
          }
        }

        if (fallback === '') {
          for (var di = 0; di < t.data.length; di++) {
            if (t.data[di].key == 'name-scientific' && !!t.data[di].value) {
              fallback = t.data[di].value;
            }
          }
        }

        if (!idv_label) {
          idv_label = (!!fallback ? fallback : "");
        }

        if (!!idv_label) {

          var label_as_id = simpleID(idv_label); //encodeURIComponent(idv_label).replace(/%/g, '_');
          if ($cy.$('#'+label_as_id).length == 0) {
            $cy.add({group: 'nodes', classes: 'label', data: {label: idv_label, desc_lvl: t.description_level, id: label_as_id}, position: {x:0, y:0}});
          }

          if ($cy.$('#'+t.meta.virtual_individual_id).length > 0 && $cy.$('#'+label_as_id).length > 0) {
            if ($cy.$('#'+t.meta.virtual_individual_id+'_label_'+label_as_id).length == 0) {
              $cy.add({group: 'edges', data: {id: t.meta.virtual_individual_id+'_label_'+label_as_id, source: t.meta.virtual_individual_id, target: label_as_id, label: 'label'}});
            }
          }
        }
      }

      var token_parent = ((!!t.meta.virtual_part_id) ? t.meta.virtual_part_id : ((!!t.meta.virtual_individual_id) ? t.meta.virtual_individual_id : undefined));

      if ($cy.$('#'+t.token_id).length == 0) {
        $cy.add({group: 'nodes', data: {label: t.token_id.split('-')[1], id: t.token_id, parent: token_parent, url: url}, position: {x:0, y:0}});
        all_tokens.push(t);
        getsrc({token_id : t.token_id});
      }



      // make description level as node?
      /*
      var did = simpleID(t.description_level);
      if ($cy.$('#' + did).length == 0) {
        $cy.add({group: 'nodes', classes: "description_level", data: {label: t.description_level, id: did}, position: {x:0, y:0}});
      }

      if ($cy.$('#'+t.token_id).length > 0 && $cy.$('#'+did).length > 0) {
        var rel = 'desc_lvl'
        if ($cy.$('#'+t.token_id+'_'+rel+'_'+did).length == 0) {
          $cy.add({group: 'edges', data: {id: t.token_id+'_'+rel+'_'+did, source: t.token_id, target: did, label: rel}});
        }
      }
      //*/



      if (!t.meta.virtual_individual_id) {
        var idv_label = '';
        var fallback = '';
        for (var di = 0; di < t.data.length; di++) {
          if (t.data[di].key == 'name-vernacular-zhtw' && !!t.data[di].value) {
            idv_label = t.data[di].value;
          }
          else if (t.data[di].key == 'category-zhtw' && !!t.data[di].value) {
            fallback = t.data[di].value;
          }
        }
        if (!idv_label) {
          idv_label = fallback;
        }

        if (!!idv_label) {
          var label_as_id = simpleID(idv_label); //encodeURIComponent(idv_label).replace(/%/g, '_');
          if ($cy.$('#'+t.token_id).length > 0 && $cy.$('#'+label_as_id).length > 0) {
            if ($cy.$('#'+t.token_id+'_label_'+label_as_id).length == 0) {
              $cy.add({group: 'edges', data: {id: t.token_id+'_label_'+label_as_id, source: t.token_id, target: label_as_id, label: 'label'}});
            }
          }
        }
      }

    });

    if (!!res.result && !!res.result.tokens)
    res.result.tokens.forEach(function(t) {
      if (!!t.token_id && !!t.meta.parent_id) {
        if ($cy.$('#'+t.token_id).length > 0 && $cy.$('#'+t.meta.parent_id).length > 0) {
          var rel = 'lower_token';
          if ($cy.$('#'+t.token_id+'_'+rel+'_'+t.meta.parent_id).length == 0) {
            //$cy.add({group: 'edges', data: {id: t.token_id+'_'+rel+'_'+t.meta.parent_id, source: t.token_id, target: t.meta.parent_id, label: rel}});
          }
        }

      }

      if (!!t.meta.virtual_part_id && !!token2part[t.meta.parent_id]) {
        var vp_id = t.meta.virtual_part_id;
        var t2p_id = token2part[t.meta.parent_id];
        if (vp_id != t2p_id && $cy.$('#'+vp_id).length > 0 && $cy.$('#'+t2p_id).length > 0) {
          if ($cy.$('#'+vp_id+'_is_part_of_'+t2p_id).length == 0) {
            $cy.add({group: 'edges', data: {id: vp_id+'_is_part_of_'+t2p_id, source: vp_id, target: t2p_id, label: 'is_part_of'}});
          }
        }
      }

      if (!!t.meta.virtual_part_id && !!t.meta.virtual_individual_id && t.meta.virtual_part_id != t.meta.virtual_individual_id && $cy.$('#'+t.meta.virtual_part_id).length > 0 && $cy.$('#'+t.meta.virtual_individual_id).length > 0) {
        if ($cy.$('#'+t.meta.virtual_part_id+'_is_part_of_'+t.meta.virtual_individual_id).length == 0) {
          //$cy.add({group: 'edges', data: {id: t.meta.virtual_part_id+'_is_part_of_'+t.meta.virtual_individual_id, source: t.meta.virtual_part_id, target: t.meta.virtual_individual_id, label: 'is_part_of'}});
        }
      }

    });

    if (!!res.result && !!res.result.tokens)
    res.result.tokens.forEach(function(t) {
      if (!!t.relations)
      t.relations.forEach(function(r) {
        var rel_url = null;
        var rel_token_id = null;
        var frags = r.object.split('#');
        if (frags.length > 1) {
          rel_url = frags[0];
          rel_token_id = frags[1];
        }
        else {
          rel_token_id = frags[0];
        }

        if (!!rel_url && image_urls.indexOf(rel_url) == -1) {
          getshit({url: rel_url});
        }

      });
    });

    if (!!res.result && !!res.result.tokens)
    res.result.tokens.forEach(function(t) {
      if (!!t.relations)
      t.relations.forEach(function(r) {

        var rel_url = null;
        var rel_token_id = null;
        var frags = r.object.split('#');
        if (frags.length > 1) {
          rel_url = frags[0];
          rel_token_id = frags[1];
        }
        else {
          rel_token_id = frags[0];
        }

        if (!!t.token_id && !!rel_token_id) {
          if ($cy.$('#'+t.token_id).length > 0 && $cy.$('#'+rel_token_id).length > 0) {
            if ($cy.$('#'+t.token_id+'_'+r.relation+'_'+rel_token_id).length == 0) {
//              $cy.add({group: 'edges', classes: 'relation', data: {id: t.token_id+'_'+r.relation+'_'+rel_token_id, source: t.token_id, target: rel_token_id, label: r.relation}});
            }
          }
        }

        var needDoMeLater = true;
        var src = t.meta.virtual_part_id;
        var tgt = token2part[rel_token_id];
        if (!!src && !!tgt) {
          if ($cy.$('#'+src).length > 0 && $cy.$('#'+tgt).length > 0) {
            needDoMeLater = false;
            if ($cy.$('#'+src+'_'+r.relation+'_'+tgt).length == 0) {
              $cy.add({group: 'edges', classes: 'relation', data: {id: src+'_'+r.relation+'_'+tgt, source: src, target: tgt, label: r.relation}});
            }
          }
        }

        if (!!rel_token_id) {
          if (needDoMeLater) {
            doMeLater.push({
              source: t.token_id,
              target: rel_token_id,
              relation: r.relation
            });
          }
        }

      });
    });
    counter -= 1;
    if (counter == 0) {

      doMeLater.forEach(function(me) {
        var source = token2part[me.source];
        var target = token2part[me.target];
        var rel = me.relation;
        if (!!source && !!target) {
          if ($cy.$('#'+source).length > 0 && $cy.$('#'+target).length > 0) {
            if ($cy.$('#'+source+'_'+rel+'_'+target).length == 0) {
              $cy.add({group: 'edges', classes: 'relation', data: {id: source+'_'+rel+'_'+target, source: source, target: target, label: rel}});
            }
          }
        }
      });


      all_tokens.forEach(function(t) {

        var vp_id = t.meta.virtual_part_id;
        var t2p_id = token2part[t.meta.parent_id];
        if (!!vp_id && !! t2p_id && $cy.$('#'+vp_id+'_is_part_of_'+t2p_id).length == 0) {
          if (!!vp_id && !!t.meta.virtual_individual_id && vp_id != t.meta.virtual_individual_id && $cy.$('#'+vp_id).length > 0 && $cy.$('#'+t.meta.virtual_individual_id).length > 0) {
            if ($cy.$('#'+vp_id+'_is_part_of_'+t.meta.virtual_individual_id).length == 0) {
              $cy.add({group: 'edges', data: {id: vp_id+'_is_part_of_'+t.meta.virtual_individual_id, source: vp_id, target: t.meta.virtual_individual_id, label: 'is_part_of'}});
            }
          }
        }

        t.data.forEach(function(d) {
          if (!!d.key && !!d.value) {

            var sid = t.token_id;
            var did = simpleID(d.value);
            if (d.key == 'named-structure') {
              for(var tid in token2descLvl) {
                if (token2descLvl.hasOwnProperty(tid)) {
                  var descLvl = token2descLvl[tid];
                  if (descLvl == d.value) {
                    if (token2idv[tid] == t.meta.virtual_individual_id) {
                      sid = token2part[t.token_id];
                      did = token2part[tid];
                    }
                  }
                }
              }
            }

            if ($cy.$('#' + did).length == 0) {
              $cy.add({group: 'nodes', classes: "data-value", data: {label: d.value, id: did}, position: {x:0, y:0}});
            }
  
            if ($cy.$('#'+sid).length > 0 && $cy.$('#'+did).length > 0) {
              var rel = 'data_value'
              if ($cy.$('#'+sid+'_'+rel+'_'+did).length == 0) {
                $cy.add({group: 'edges', data: {id: sid+'_'+rel+'_'+did, source: sid, target: did, label: d.key}});
              }
            }
          }
        });
      });


      makeCyLayout();



    }
  }

  window.getshit = function (data) {
    counter += 1;
    $.ajax({
      type: "POST",
      url: action,
      data: JSON.stringify(data),
      success: _callback,
      dataType: 'json'
    });
  }



  getshit(data);
  
});

function getsrc (data) {
  $.ajax({
    type: "POST",
    url: "../mongo_simple_query.php",
    data: JSON.stringify(data),
    success: function (res) {
      counter += 1;
      var ffss = 5566;
      if (res.result.length > 0) {
        console.log('jack pot!');
        console.log(res.result);
        res.result.forEach(function(url){
          getshit({url: url});
        });
      }
      counter -= 1;
    },
    error: function (res) {
    },
    dataType: 'json'
  });
}




window.$cy = cytoscape({
  container: document.getElementById('cy'),
  selectionType: 'additive',
  boxSelectionEnabled: true,
  //autounselectify: true,
  
  style: [
    {
      selector: 'node',
      css: {
        'font-size': 8,
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center'
      }
    },
    {
      selector: 'node.label,node.data-value',
      css: {
        'shape':'triangle',
        'background-color': 'green',
        'color': 'white',
        'text-outline-color': 'green',
        'text-outline-width': 1
      }
    },
    {
      selector: 'node.data-value',
      css: {
        'display': 'none',
      }
    },
    {
      selector: 'node.square',
      css: {
        'shape': 'rectangle'
      }
    },
    {
      selector: '$node > node',
      css: {
        'padding-top': '10px',
        'padding-left': '10px',
        'padding-bottom': '10px',
        'padding-right': '10px',
        'text-valign': 'top',
        'text-halign': 'center',
        'background-color': '#bbb'
      }
    },
    {
      selector: 'node.individual',
      css: {
        'background-color':'blue'
      }
    },
    {
      selector: 'edge',
      css: {
        'label': 'data(label)',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.5,
        'font-size': 8,
      }
    },
    {
      selector: 'edge.relation',
      css: {
        'font-size': 18,
        'color': 'red',
        'width': 5,
        'opacity': 1,
        //'line-color': 'red',
      }
    },
    {
      selector: 'node:selected',
      css: {
        'background-color': 'orange',
      }
    },
    {
      selector: '$node:selected > node',
      css: {
        'background-color': 'yellow',
        'opacity': 0.7
      }
    },
    {
      selector: 'edge:selected',
      css: {
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black',
        'opacity':1,
      }
    }
  ],
  
  elements: {
    nodes: [
    ],
    edges: [
    ]
  },
  
  layout: {
    name: 'preset'
  }
});

$cy.on('tap', 'node', function(e) {
  e.stopPropagation();
  console.log (e.cyTarget.id());
  console.log (e.cyTarget.data('url'));
  var eles = e.cyTarget;

  eles.neighborhood().select();
  eles.neighborhood().children().select();
});



}); // on dom ready
