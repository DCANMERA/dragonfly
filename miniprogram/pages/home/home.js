// 获取小程序实例
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 堂食与外带的索引
    selectIndex: app.globalData.status,

    // 菜单列表数据
    menuList: [],

    // 点击获取的菜品数据
    menu: [],

    // 点击滚动的相应菜品
    toView: '',

    // 激活侧栏菜单的下标
    activeAisdeMenu: 0,

    // 是否显示菜品规格选择
    isShowPopup: false,

    // 购物车数据
    shopcartData: [],

    // 购物车条数
    shopcartCount: 0,

    //购物车的_ids集合
    _ids: [],

    // 菜品总价格
    totle: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMenuList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getShopcartData()
  },

  /**
   * 获取菜品数据
   */
  getMenuList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_aisde_menu_list]
    wx.cloud.callFunction({
      name: 'get_aisde_menu_list',
      success: res => {
        res.result.data.sort((a, b) => a.pageNo - b.pageNo)

        // 调用云函数[get_menu_list]
        wx.cloud.callFunction({
          name: 'get_menu_list',
          success: result => {
            wx.hideLoading()
            res.result.data.map(item => {
              item.list = []
              result.result.data.map(value => {
                if (item.type == value.type) {
                  item.list.push(value)
                }
              })
            })
            this.setData({
              menuList: res.result.data
            })
          },
          fail: err => {
            wx.hideLoading();
            console.log('get_menu_list err ==> ', err);
          }
        })
      },
      fail: err => {
        wx.hideLoading();
        console.log('get_aisde_menu_list err ==> ', err);
      }
    })
  },

  /**
   * 获取购物车数据
   */
  getShopcartData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_shopcart]
    wx.cloud.callFunction({
      name: 'get_shopcart',
      success: res => {
        wx.hideLoading()
        let data = res.result.data
        if (Array.isArray(data)) {
          data.map(v => {
            this.data._ids.push(v._id)
          })
          this.setData({
            shopcartData: data,
            shopcartCount: data.length
          })

          // 计算菜品总价
          this.getMenuTotle()
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('getShopcartData err ==> ', err)
      }
    })
  },

  /**
   * 计算菜品总价
   */
  getMenuTotle() {
    this.setData({
      totle: this.data.shopcartData.reduce((p, n) => p + n.price * n.count, 0).toFixed(2)
    })
  },

  /**
   * 切换堂食与外带方式
   */
  toggleWay(e) {
    let dataset = e.currentTarget.dataset
    if (this.data.selectIndex == dataset.index) return
    this.setData({
      selectIndex: Number(dataset.index)
    })
    app.globalData.status = Number(dataset.index)
  },

  /**
   * 切换侧栏菜单
   */
  toggleAisdeMenuList(e) {
    let dataset = e.currentTarget.dataset
    if (dataset.index == this.data.activeAisdeMenu) return
    this.setData({
      activeAisdeMenu: dataset.index,
      toView: dataset.item.type
    })
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
    this.getShopcartData()
    this.data._ids.push(e.detail._id)
    this.setData({
      isShowPopup: e.detail.isShow,
      shopcartCount: ++this.data.shopcartCount,
      menu: []
    })
  },

  /**
   * 展示购物车条目菜品
   */
  showAllShopcartMenu() {
    this.setData({
      isShowPopup: true
    })
  },

  /**
   * 增加数量
   */
  increase(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.shopcartData[index]
    data.count += 1

    // 发起修改数量请求
    this.updateCount(data._id, data.count)

  },

  /**
   * 减少数量
   */
  decrease(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.shopcartData[index]
    data.count -= 1
    if (data.count == 0) {

      // 删除该商品
      this.removeShopcart(data._id, index)

    } else {

      // 发起修改数量请求
      this.updateCount(data._id, data.count)
    }
  },

  /**
   * 修改商品数量
   * @param {*} _id shopcart集合的记录_id
   * @param {*} count 菜品数量
   */
  updateCount(_id, count) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[update_shopcart]
    wx.cloud.callFunction({
      name: 'update_shopcart',
      data: {
        _id,
        data: {
          count
        }
      },
      success: result => {
        wx.hideLoading()
        this.setData({
          shopcartData: this.data.shopcartData
        })

        // 统计总价
        this.getMenuTotle()

      },
      fail: err => {
        wx.hideLoading()
        console.log('updateCount err ==> ', err)
      }
    })
  },

  /**
   * 删除购物车的记录
   * @param {String} _id shopcart集合的记录_id
   * @param {Number} index 要删除数据的下标
   * @param {Boolean} flag 是否要删除全部数据
   */
  removeShopcart(_id, index) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 判断_id的存在状态来确定是否删除全部
    let flag = _id ? false : true

    // 调用云函数[remove_shopcart]
    wx.cloud.callFunction({
      name: 'remove_shopcart',
      data: {
        _id,
        type: flag
      },
      success: result => {
        wx.hideLoading()
        flag ? this.data.shopcartData = [] : this.data.shopcartData.splice(index, 1)
        this.setData({
          shopcartData: this.data.shopcartData
        })

        if (this.data.shopcartData.length == 0) {
          this.setData({
            isShowPopup: false
          })
        }

        // 统计总价
        this.getMenuTotle()
      },
      fail: err => {
        wx.hideLoading()
        console.log('removeShopcart err ==> ', err)
      }
    })
  },

  /**
   * 删除购物车所有数据
   */
  removeAll() {
    this.removeShopcart()
  },

  /**
   * 跳往搜索页
   */
  toSearch() {

    // 隐藏自带键盘显示
    wx.hideKeyboard()
    wx.navigateTo({
      url: '../search/search'
    })
  },

  /**
   * 跳往结算
   */
  toPay() {
    wx.navigateTo({
      url: '../pay/pay?_ids=' + this.data._ids.join('-')
    })
  }

})
