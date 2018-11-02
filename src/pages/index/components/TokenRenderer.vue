<template>
<li>
  <div class="token-item"
  ui-tree-handle
  :class="classes[token.token_id]"
  @mouseover="$emit('highlightBox', token.token_id, $event)"
  @mousedown="$emit('setEditToken',token.token_id, $event)"
  @mouseleave="$emit('highlightAllBox',$event)"
  style="display:inline-block">
    <div class="name">Token {{token.tree_simple_id}}</div>
    <div class="action">
      <button
      data-nodrag
      @mousedown="$emit('uiCopyToken',$event)" class="copy_token">
        <i class="icon-copy-sm-white"></i>
      </button>
      <button class="remove"
      data-nodrag @mousedown="$emit('updateUiCopiedToken', undefined)">
        <i class="icon-remove-sm-white"></i>
      </button>
    </div>
    <!-- <div data-nodrag class='delete_link' style='position:absolute; left:365px; top:5px; width:30px; height:30px; text-align:center; line-height:30px; border:1px solid #dae2ea' @mousedown='$emit("uiDeleteToken", $event, token.token_id)'>x</div>
    <div>id: {{token.token_id}}</div>
    <div>{{token.description_level}}</div>
    <div class="show_on_parent_focused show_on_parent_hovered">
      <div>parent: {{token.meta.parent_id}}</div>
      <div>viid: {{token.meta.virtual_individual_id}}</div>
      <div>vpid: {{token.meta.virtual_part_id}}</div>
      <div>
        <button data-nodrag @mousedown="$emit('uiCopyToken',$event)" class="copy_token">copy token</button>
        <button data-nodrag @mousedown="$emit('updateUiCopiedToken', undefined)" v-if='!uiCopiedToken==false'>clear copied token</button>
      </div>
      <div>
        <button v-if="!uiCopiedToken==false" data-nodrag @mousedown="$emit('uiPasteBBox',$event)">paste bbox</button>
        <button v-if="!uiCopiedToken==false && !edit_token==false" data-nodrag @mousedown="$emit('uiPasteToken',$event)">paste token</button>
        <button v-if="!uiCopiedToken==false && !edit_token==false" data-nodrag @mousedown="$emit('uiPasteToken',$event, false, true)">paste data</button>
      </div>
    </div> -->
  </div>
  <div v-if='isReadyToRelate'>
    <button @mousedown='setRelationObject($event, token.token_id)'>》</button>
  </div>
  <ol ui-tree-nodes="" :class="{hidden: collapsed}" v-if="!token.tokens==false">
    <token-renderer
    @highlightBox="tid => {$emit('highlightBox', tid)}"
    @uiDeleteToken="(e, tid) => {$emit('uiDeleteToken', e, tid)}"
    @uiCopyToken="e => {$emit('uiCopyToken', e)}"
    @uiPasteBBox="e => {$emit('uiPasteBBox', e)}"
    @uiPasteToken="(e, asNew, dataOnly) => {$emit('uiPasteToken', e, asNew, dataOnly)}"
    @updateUiCopiedToken="(v) => {$emit('uiCopiedToken', v)}"
    :uiCopiedToken="uiCopiedToken"
    :edit_token="edit_token"
    :classes="classes"
    v-for="(toke,t) in token.tokens"
    :token="toke"
    :key="`token-${index}-${t}`" />
  </ol>
</li>
</template>

<script>
import TokenRenderer from '../components/TokenRenderer'

export default {
  name: 'TokenRenderer',
  components: { TokenRenderer },
  props: {
    index: {
      type: Number,
      default: 1
    },
    classes: {
      type: Object,
      default: null
    },
    uiCopiedToken: {
      type: Object,
      default: null
    },
    edit_token: {
      type: Object,
      default: null
    },
    token: {
      type: Object,
      default: null
    },
    isReadyToRelate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      collapsed: false
    }
  }
}
</script>

