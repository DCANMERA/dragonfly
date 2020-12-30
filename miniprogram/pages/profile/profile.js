let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 列表数据
    navigatBarData: [
      {
        icon: 'icon-coordinates_fill',
        name: '我的地址',
        url: '../address/address'
      },
      {
        icon: 'icon-mail_fill',
        name: '意见反馈',
        url: '../feedback/feedback'
      }
    ],

    //用户是有授权
    isAuth: false,

    //用户信息
    userInfo: {
      avatarUrl: '',
      nickName: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isAuth: app.globalData.isAuth
    })

    // 必须是在用户已经授权的情况下调用
    if (this.data.isAuth) {
      wx.getUserInfo({
        success: res => {
          this.setData({
            userInfo: {
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            }
          })
        }
      })
    }
  },

  /**
   * 跳往指定页
   */
  goPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /**
   * 用户信息
   */
  getUserAuthInfo(res) {
    if (res.detail.userInfo) {
      app.globalData.isAuth = true;
      this.setData({
        isAuth: true,
        userInfo: {
          avatarUrl: res.detail.userInfo.avatarUrl,
          nickName: res.detail.userInfo.nickName
        }
      })
    }
  }

})
