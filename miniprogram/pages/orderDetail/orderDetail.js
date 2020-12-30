Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 订单详情数据
    details: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.item)
    data.total = (data.total - 0).toFixed(2)
    this.setData({
      details: data
    })
  }
})
