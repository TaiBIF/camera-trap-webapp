<template>
  <div
    class="modal fade camera-list-modal"
    :class="{'in': open}"
  >
    <div
      class="modal-dialog modal-lg"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">相機位置</h4>
        </div>
        <div
          class="modal-body"
          v-if="cameras.length"
        >
          <div class="row">
            <div
              class="col-3"
              :key="camera.fullCameraLocationMd5"
              v-for="(camera) in cameras"
            >
              <div class="checkbox">
                <input
                  type="checkbox"
                  v-model="form"
                  :id="`modal-${camera.fullCameraLocationMd5}`"
                  :value="camera.fullCameraLocationMd5"
                >
                <label :for="`modal-${camera.fullCameraLocationMd5}`">
                  <span class="text">{{camera.cameraLocation}}</span>
                  <span
                    class="icon"
                    v-if="cameraLocked[camera.fullCameraLocationMd5] && cameraLocked[camera.fullCameraLocationMd5].locked"
                  >
                    <i
                      class="icon-lock align-middle"
                      v-tooltip.top="`${cameraLocked[camera.fullCameraLocationMd5].lockedBy.name} 正在編輯中`"
                    ></i>
                  </span>
                  <span class="error-label">1</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <a
            class="btn btn-green-border"
            @click="$emit('close')"
          >取消</a>
          <a
            class="btn btn-orange"
            @click="$emit('submit', form)"
          >確定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CameraModal',
  props: {
    cameras: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      },
    },
    cameraLocked: {
      type: Object,
      default: () => {
        return null;
      },
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.selected,
    };
  },
  watch: {
    open: 'syncSelect',
  },
  methods: {
    syncSelect() {
      this.form = this.selected;
    },
  },
};
</script>
