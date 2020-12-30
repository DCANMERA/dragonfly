Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 搜索值
    searchValue: '',

    // 显示加购boool
    isShowPopup: false,

    // 搜索数据
    searchData: [],

    // 搜索历史
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHistory()
  },

  /**
   * 获取历史记录
   */
  getHistory() {
    wx.getStorage({
      key: 'history',
      success: res => {
        this.setData({
          history: res.data
        })
      }
    })
  },

  /**
   * 获取搜素数据
   */
  getSearchProduct(e) {
    e.detail.value = e.detail.value || e.currentTarget.dataset.value
    this.setData({
      searchValue: e.detail.value
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_products]
    wx.cloud.callFunction({
      name: 'get_products',
      data: {
        value: e.detail.value
      },
      success: res => {
        wx.hideLoading()
        if (this.data.history.indexOf(e.detail.value) == -1) {
          this.data.history.push(this.data.searchValue)
          wx.setStorage({
            key: "history",
            data: this.data.history
          })
        }
        this.setData({
          searchData: res.result.data,
          history: this.data.history
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('getSearchProduct err ==> ', err)
      }
    })
  },

  /**
   * 设置搜索值
   */
  setSearchValue(e) {
    this.setData({
      searchValue: e.currentTarget.dataset.value
    })
    this.getSearchProduct(e)
  },

  /**
   * 关闭 显示规格面板
   */
  toggleRules(e) {
    this.setData({
      menu: e.detail.data ? e.detail.data : [],
      isShowPopup: e.detail.isShow
    })
  },

  /**
   * 添加购物车成功后，累加数量
   */
  modifyShopcartCount(e) {
    wx.navigateBack()
  },

})
