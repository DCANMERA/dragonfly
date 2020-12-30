//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'dragonfly-1gkju3dh07f850e3',
        traceUser: true,
      })
    }

    this.globalData = {

      // 堂食与外带状态
      status: 0
    }

    // 获取用户授权信息
    wx.getSetting({
      success: res => {

        // isAuth: 是否授权
        this.globalData.isAuth = res.authSetting['scope.userInfo'];
      }
    })
  }
})
