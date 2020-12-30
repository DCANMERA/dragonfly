import { utils } from '../../js/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 订单头部激活索引
    tabIndex: 0,

    // 订单数量偏移量
    offset: 0,

    // 每次查询订单数据量
    count: 5,

    // 订单数据
    orderData: [],

    // 是否存在数据加载
    isHas: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({

      // 订单数量偏移量
      offset: 0,

      // 订单数据
      orderData: [],

      // 是否存在数据加载
      isHas: true
    })

    // 获取订单数据
    this.getOrderData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (!this.data.isHas) return
    this.getOrderData()
  },

  /**
   * 获取订单数据
   */
  getOrderData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数[get_order]
    wx.cloud.callFunction({
      name: 'get_order',
      data: {
        offset: this.data.offset,
        count: this.data.count
      },
      success: result => {
        wx.hideLoading()
        result.result.data.map(v => {

          // 处理订单日期
          v.date = utils.formatDate(v.date, 'yyyy-MM-dd hh :mm :ss')

          // 处理地址
          v.address.detailAddress = v.address.area.join('') + v.address.detail
        })

        // 如果本次请求获取的订单数据不足条，下次无需请求
        if (result.result.data.length < 5) {
          this.setData({
            isHas: false
          })
        }
        this.data.orderData.push(...result.result.data)
        this.setData({
          orderData: this.data.orderData,
          offset: this.data.offset + this.data.count
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('getOrderData err ==> ', err)
      }
    })
  },

  /**
   * 切换头部导航
   */
  toggleTab(e) {
    let dataset = e.currentTarget.dataset
    if (this.data.tabIndex == dataset.index) return
    this.setData({
      tabIndex: dataset.index - 0
    })
  },

  /**
   * 跳往订单详情
   */
  toOrderDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  }

})
