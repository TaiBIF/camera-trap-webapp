export const commonMixin = {
  data() {
    return {
      previewImg: null,
      closeWindowOpen: false
    }
  },
  methods: {
    removePreview() {
      this.previewImg = null
    },
    previewPhoto(e) {
      let input = e.target
      
      if(e.target.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = (e) => {
          this.previewImg = {
            src: e.target.result,
            name: input.files[0].name
          }
        }

        reader.readAsDataURL(input.files[0]);
      }
    },
    confirmLeave() {
      this.closeWindowOpen = true
      return false
    }
  },
  mounted() {
    // 關閉 或 跳頁時確認是否放棄編輯
    // this.confirmLeave()
  }
}