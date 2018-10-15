<template>
  <div class="modal fade" :class="{'in': open}">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">編輯常見物種排序</h4>
        </div>
        <div class="modal-body p-0">
          <div class="container sortable-container">
            <div class="row sortable-header">
              <div class="col-2">排序</div>
              <div class="col-7">物種</div>
              <div class="col-3"></div>
            </div>
            <div class="sortable-body">
              <draggable :options="{handle: '.drag-item'}" @start="drag=true" @end="drag=false">
                <transition-group>

                  <div class="row sortable-item" v-for="(o, index) in order" :key="`species-${index}`">
                    <div class="col-2">{{ index+1 }}</div>
                    <div class="col-4">
                      <v-select :options="species" v-model="species[index]" taggable />
                    </div>
                    <div class="col-3">
                      <span v-if="species[index]!==undefined && species[index].note!==undefined" v-tooltip.right="species[index].note">
                        <i class="icon icon-info"></i>
                      </span>
                    </div>
                    <div class="col-3 text-right">
                      <a @click="removeItem(index)" class="d-inline-block align-middle ml-2"><i class="icon-remove-sm"></i></a>
                      <a class="d-inline-block align-middle ml-2 drag-item"><i class="icon-splitter"></i></a>
                    </div>
                  </div>
                
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <a @click="addSpecies()" class="btn btn-text text-green float-left ml-0"><i class="fa fa-plus"></i> 新增項目</a>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <button @click="submit()" class="btn btn-orange">確定</button>
        </div>
      </div>
    </div> 
  </div>  
</template>

<script>

import draggable from 'vuedraggable'


export default {
  name: "SpeciesOrderPanel",
  components: {
    draggable
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      order: [0,1,2,3,4,5,6],
      species: [{label: '空拍', value: '空拍', note: '相機觸發，但影像中無拍攝到生物'}, {label: '測試', value: '測試', note:'研究人員安置相機時觸發拍攝之影像，抑或研究人員設置自動拍攝以測試相機運作之影像'}, {label: '山羌', value: '山羌'}, {label: '水鹿', value: '水鹿'}, {label: '獼猴', value: '獼猴'}, {label: '鼬獾', value: '鼬獾'}, {label: '人', value: '人', note:'登山客、狩獵者等，非研究人員之人類'}]
    }
  },
  methods: {
    addSpecies() {
      this.order.push(0)
    },
    removeItem(i) {
      this.order.splice(i, 1)
    },
    submit() {
      // submit form
      this.$emit('submit', this.form)
    }
  }
}
</script>

