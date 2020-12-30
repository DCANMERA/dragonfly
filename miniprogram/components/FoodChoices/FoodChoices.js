let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu: {},

    // 菜品当前数量
    currentProduct: {
      count: 1
    },

    // 选择的规格
    rules: '',

    // 是否授权
    isAuth: false
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    created() {

      // 获取用户授权信息
      wx.getSetting({
        success: res => {

          // isAuth: 是否授权
          app.globalData.isAuth = res.authSetting['scope.userInfo'];
          this.setData({
            isAuth: res.authSetting['scope.userInfo']
          })
        }
      })
    }

  },

  observers: {
    item(value) {
      this.setData({
        menu: value
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 关闭规格选择
     */
    close() {
      this.triggerEvent('close', { isShow: false })
    },

    /**
     * 改变数量
     */
    modifyCount(e) {
      let count = this.data.currentProduct.count + Number(e.currentTarget.dataset.count)
      this.data.currentProduct.count = count <= 0 ? 1 : count
      this.setData({
        currentProduct: this.data.currentProduct
      })
    },

    /**
     * 选择规格
     */
    selectRule(e) {
      let dataset = e.currentTarget.dataset

      // 点击的当前规格下标
      let index = dataset.index

      // 当选中的下标
      let currentIndex = dataset.currentIndex

      // rules数组元素的下表
      let rulesIndex = dataset.rulesIndex

      if (currentIndex == index) return

      // 修改菜品当前规格下标
      this.data.menu.rules[rulesIndex].currentIndex = index

      // 获取选择规格
      let rules = []
      this.properties.item.rules.map(v => {
        if (v.currentIndex > -1) {
          let rule = v.rule[v.currentIndex]
          rules.push(rule)
        }
      })
      this.setData({
        rules: rules.join('/'),
        menu: this.data.menu
      })
    },

    /**
     * 加入购物车
     */
    addShopcart() {

      // 判断是否选择规格
      let rules = this.data.menu.rules
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].currentIndex == -1) {

          // 提示用户选择规格
          wx.showToast({
            title: '请选择规格',
            icon: 'none',
            duration: 2000,
            mask: true
          })

          return
        }
      }

      // 执行加入购物车
      // 获取商品id, 选择的规格, 商品数量
      let _id = this.data.menu._id
      let rule = this.data.rules
      let count = this.data.currentProduct.count

      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      // 调用云函数[add_shopcart]
      wx.cloud.callFunction({
        name: 'add_shopcart',
        data: {
          pid: _id,
          rule,
          count,
          img: this.data.menu.img,
          name: this.data.menu.name,
          price: this.data.menu.price
        },

        success: result => {
          wx.hideLoading()
          if (result.result._id) {
            wx.showToast({
              title: '加入购物成功',
              icon: 'none',
              duration: 2000,
              mask: true
            })

            // 触发定义事件
            this.triggerEvent('addShopcart', {
              count: 1,
              _id: result.result._id,
              isShow: false
            })
            return
          }
          wx.showToast({
            title: '加入购物失败',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        },
        fail: err => {
          wx.hideLoading()
          console.log('addShopcart err ==> ', err)
        }
      })
    },
  }
})
