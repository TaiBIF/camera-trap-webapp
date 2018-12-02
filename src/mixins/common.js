import { mapActions } from 'vuex';

export const commonMixin = {
  data() {
    return {
      previewImg: null,
      closeWindowOpen: false,
    };
  },
  methods: {
    ...mapActions(['setPageLock']),
    modalOpen(key) {
      this.setPageLock(true);
      this[key] = true;
    },
    modalClose(key) {
      this.setPageLock(false);
      this[key] = false;
    },
    removePreview() {
      this.previewImg = null;
    },
    previewPhoto(e) {
      let input = e.target;

      if (e.target.files && input.files[0]) {
        let reader = new FileReader();
        const file = input.files[0];

        reader.onload = e => {
          this.previewImg = {
            src: e.target.result,
            name: file.name,
            type: file.type,
            file: file,
            fileSizeMb: file.size / 1024 / 1024,
          };
        };

        reader.readAsDataURL(file);
      }
    },
    confirmLeave() {
      this.closeWindowOpen = true;
      return false;
    },
  },
  mounted() {
    // 關閉 或 跳頁時確認是否放棄編輯
    // this.confirmLeave()
  },
};
