// 获取小程序实例
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 外带还是堂食
    way: app.globalData.status,

    // 骨架屏bool
    loading: true,

    // 地址信息
    addressInfo: {},

    // 地址id
    aid: '',

    // 商品数据
    productData: [],

    // 购物车的_id
    _ids: [],

    // 商品总数量, 总价
    proInfo: {
      count: 0,
      total: 0
    },

    // 备注
    note: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData._ids) {
      this.data._ids = app.globalData._ids.split('-')
    } else {
      this.data._ids = options._ids.split('-')
    }
    if (options.aid) {

      // 根据地址_id查询地址信息
      this.getDefaultAddress('_id', options.aid)
    } else {

      // 获取默认地址
      this.getDefaultAddress('isDefault', true)
    }

    this.setData({
      way: app.globalData.status
    })

    // 获取需要购买的商品
    this.getShopcartData()
  },

  onShow() {

    // 删除全局_ids
    delete app.globalData._ids
  },


  //跳转到地址列表页面
  goPage() {
    app.globalData._ids = this.data._ids.join('-')
    wx.navigateTo({
      url: '../address/address'
    })
  },

  /**
   * 获取默认地址
   * @param {*} key
   * @param {*} value
   */
  getDefaultAddress(key, value) {

    // 启动加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_address_by_key]
    wx.cloud.callFunction({
      name: 'get_address_by_key',
      data: {
        key,
        value
      },
      success: result => {
        wx.hideLoading()

        // 如果存在默认地址
        let data = result.result.data
        if (data.length > 0) {
          data[0].detailAddress = data[0].area.join('') + data[0].detail
        }

        this.setData({
          addressInfo: result.result.data[0]
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('getDefaultAddress err ==> ', err);
      }
    })
  },

  /**
   * 获取需要购买的商品
   */
  getShopcartData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_shopcart_by_id]
    wx.cloud.callFunction({
      name: 'get_shopcart_by_id',
      data: {
        _ids: this.data._ids
      },
      success: result => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        this.setData({
          productData: result.result.data,
        })
        this.sum()
      },
      fail: err => {
        wx.hideLoading()
        console.log('getShopcartData err ==> ', err);
      }
    })
  },

  /**
   * 获取备注值
   */
  getNoteValue(e) {
    this.setData({
      note: e.detail.value
    })
  },

  /**
   * 统计商品总数量、总价
   */
  sum() {
    this.data.proInfo.count = 0
    this.data.proInfo.total = 0

    // 统计商品数量, 总价
    this.data.productData.map(v => {
      this.data.proInfo.count += v.count;
      this.data.proInfo.total += v.count * v.product.price;
    })

    this.setData({
      proInfo: this.data.proInfo
    })
  },

  /**
   * 立即结算
   */
  pay() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 获取地址_id
    let aid = this.data.addressInfo._id

    // 获取购物车的id集合
    let sid = this.data._ids

    // 调用云函数[add_order]
    wx.cloud.callFunction({
      name: 'add_order',
      data: {
        aid,
        sid,
        way: app.globalData.status ? '打包' : Math.floor(Math.random() * 9 + 1),
        count: this.data.proInfo.count,
        total: this.data.proInfo.total,
        note: this.data.note
      },
      success: result => {
        wx.hideLoading()

        // 判断结果返回的stats.removed
        if (result.result.stats.removed > 0) {

          // 添加订单成功
          wx.switchTab({
            url: '../order/order'
          })
        } else {
          wx.showToast({
            title: '结算失败',
            mask: true,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('pay err ==> ', err)
      }
    })
  }

})
