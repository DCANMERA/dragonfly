Component({
  /**
   * 组件的属性列表, 一般用于父子组件传值的
   */
  properties: {
    menu: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 显示选择规格面板
     */
    showRulesLayout() {

      // 菜品已售罄,终止以下代码
      if (this.properties.menu.sellOut) return
      this.triggerEvent('show-rules', {
        isShow: true,
        data: this.properties.menu
      })
    }

  }
})
