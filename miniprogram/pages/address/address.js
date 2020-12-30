Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 骨架屏bool
    loading: true,

    // 地址列表
    addressList: [],

    // 跳转编辑地址
    url: '../edit_address/edit_address'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取地址列表数据
    this.getAddressList()
  },

  /**
   * 地址列表数据
   */
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_address]
    wx.cloud.callFunction({
      name: 'get_address',
      success: res => {
        wx.hideLoading()
        res.result.data.map(v => v.detailAddress = `${v.area.join('')}${v.detail}`)
        this.setData({
          loading: false,
          addressList: res.result.data
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('get_address err ==> ', err)
      }
    })

  },

  /**
   * 跳转编辑地址页面或者新增地址
   */
  goPage(e) {
    let dataset = e.currentTarget.dataset
    if (dataset._id) {
      dataset.url += '?_id=' + dataset._id
    }
    wx.navigateTo({
      url: dataset.url
    })
  },

  /**
   * 选择地址
   */
  selectAddress(e) {
    let pages = getCurrentPages()
    let toPage = pages[pages.length - 2]
    if (toPage.route.includes('pages/pay/pay')) {
      wx.reLaunch({
        url: '../pay/pay?aid=' + e.currentTarget.dataset._id
      })
    }
  }

})
