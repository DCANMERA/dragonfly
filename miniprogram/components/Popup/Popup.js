Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowPopup: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    popupShow() {
      this.triggerEvent('show', { isShow: false })
    }
  }
})
