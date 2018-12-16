<template>
  <div
    class="modal fade"
    :class="{'in': open}"
  >
    <div
      class="modal-dialog"
      role="document"
    >
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
              <!-- 拖拉排序架構 draggable > transition-group -->
              <draggable
                :options="{handle: '.drag-item'}"
                v-model="projectSpecies"
              >
                <transition-group>
                  <div
                    class="row sortable-item"
                    v-for="(s, index) in projectSpecies"
                    :key="`species-${index}`"
                  >
                    <div class="col-2">{{ index+1 }}</div>
                    <div class="col-4">
                      <input
                        class="form-control"
                        :value="s"
                        @focus="selectEditSpecies(index)"
                        @blur="editSpecies"
                      />
                    </div>
                    <div class="col-3">
                      <span
                        v-if="notes[s] !== undefined"
                        v-tooltip.right="notes[s]"
                      >
                        <i class="icon icon-info"></i>
                      </span>
                    </div>
                    <div class="col-3 text-right">
                      <a
                        class="d-inline-block align-middle ml-2"
                        @click="removeItem(index)"
                      >
                        <i class="icon-remove-sm"></i>
                      </a>
                      <a class="d-inline-block align-middle ml-2 drag-item">
                        <i class="icon-splitter"></i>
                      </a>
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <a
            @click="addSpecies()"
            class="btn btn-text text-green float-left ml-0"
          >
            <i class="fa fa-plus"></i> 新增項目
          </a>
          <a
            @click="$emit('close')"
            class="btn btn-default"
          >取消</a>
          <button
            @click="submit()"
            class="btn btn-orange"
          >確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'SpeciesOrderPanel',
  components: {
    draggable,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    species: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  data() {
    return {
      notes: {
        空拍: '相機觸發，但影像中無拍攝到生物',
        測試:
          '研究人員安置相機時觸發拍攝之影像，抑或研究人員設置自動拍攝以測試相機運作之影像',
        人: '登山客、狩獵者等，非研究人員之人類',
      },
      projectSpecies: this.species,
      editRow: null,
    };
  },
  methods: {
    selectEditSpecies(value) {
      this.editRow = value;
    },
    editSpecies(e) {
      if (!isNaN(this.editRow)) {
        this.projectSpecies[this.editRow] = e.target.value;
        this.editRow = null;
      }
    },
    addSpecies() {
      this.projectSpecies.push('');
    },
    removeItem(i) {
      this.projectSpecies.splice(i, 1);
    },
    submit() {
      this.$emit('submit', this.projectSpecies.filter(species => species));
    },
  },
};
</script>
