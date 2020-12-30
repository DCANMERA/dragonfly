Page({

  /**
   * 页面的初始数据
   */
  data: {

    loading: true,

    //地址_id(编辑地址需要)
    _id: '',

    //地址信息
    addressInfo: {
      receiver: '',
      phone: '',
      area: '选择地区',
      detail: '',
      isDefault: false
    },

    //保存编辑地址数据副本, 以便对比用户是否编辑过地址信息
    copyAddressInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //截取参数
    let _id = options._id
    if (_id) {

      // 如果_id存在，则表明是编辑地址
      this.setData({
        _id
      })

      // 修改导航标题
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })

      // 编辑地址时，根据地址_id查询地址信息
      this.findAddressBy_id(_id)
    } else {
      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 1000)
    }
  },

  /**
   * 修改文本框的数据
   * @param {Object} e 事件对象
   */
  changeIptText(e) {
    let key = e.currentTarget.dataset.key
    this.data.addressInfo[key] = e.detail.value
    this.setData({
      addressInfo: this.data.addressInfo
    })
  },

  /**
   * 验证地址表单
   */
  verifyAddressForm() {

    // 验证表单是否填写
    let addressInfo = this.data.addressInfo;
    for (let key in addressInfo) {
      if (addressInfo[key] === '' || addressInfo[key] == '选择地区') {
        wx.showToast({
          title: '填写地址信息不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      }
    }

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(addressInfo.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false
    }

    return true
  },

  /**
   * 提交
   */
  commit() {

    // 如果地址表单验证不通过，则拦截
    if (!this.verifyAddressForm()) return

    // 如果是设置默认地址，先查询数据库是否存在默认地址，如果存在，则先将数据库的默认地址修改为非默认地址
    if (this.data.addressInfo.isDefault) {

      // 查询默认地址
      this.findAddress()
      return
    }

    // 新增地址
    this.addAddress()
  },

  /**
   * 新增地址
   */
  addAddress() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[add_address]
    wx.cloud.callFunction({
      name: 'add_address',
      data: this.data.addressInfo,
      success: result => {
        wx.hideLoading()
        if (result.result._id) {
          wx.navigateTo({
            url: '../address/address'
          })
        } else {
          wx.showToast({
            title: '添加地址失败',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('addAddress err ==> ', err)
      }
    })
  },

  /**
   * 查询地址
   */
  findAddress() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_address_by_key]
    wx.cloud.callFunction({
      name: 'get_address_by_key',
      data: {
        key: 'isDefault',
        value: true
      },
      success: result => {

        // 关闭加载提示
        wx.hideLoading()
        if (result.result.data.length > 0) {

          // 修改该地址为非默认地址 获取该地址_id
          let _id = result.result.data[0]._id

          // 更新地址 isDefault
          this.updateAddress(_id)
        } else {

          // 新增地址
          this.addAddress()
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('findAddress err ==> ', err)
      }
    })
  },

  /**
   * 更新地址 isDefault
   * @param {String} _id 地址id
   */
  updateAddress(_id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[update_address_byid]
    wx.cloud.callFunction({
      name: 'update_address_byid',

      data: {
        _id,

        // 更新的数据
        data: {
          isDefault: false
        }
      },
      success: result => {
        wx.hideLoading()
        if (result.result.stats.updated == 1) {

          // 新增数据
          this.addAddress()
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('updateAddress err ==> ', err)
      }
    })
  },

  /**
   * 编辑地址时，根据地址_id查询地址信息
   * @param {String} _id  地址id
   */
  findAddressBy_id(_id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[get_address_by_key]
    wx.cloud.callFunction({
      name: 'get_address_by_key',
      data: {
        key: '_id',
        value: _id
      },
      success: result => {
        wx.hideLoading()
        let addressInfo = this.data.addressInfo
        for (let key in addressInfo) {
          addressInfo[key] = result.result.data[0][key]

          // 保存地址副本
          this.data.copyAddressInfo[key] = result.result.data[0][key]
        }
        this.setData({
          loading: false,
          addressInfo
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('findAddressBy_id err ==> ', err)
      }
    })
  },

  /**
   * 删除地址
   */
  removeAddress() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[remove_address]
    wx.cloud.callFunction({
      name: 'remove_address',
      data: {
        _id: this.data._id
      },
      success: result => {
        wx.hideLoading()
        if (result.result.stats.removed == 1) {
          wx.navigateTo({
            url: '../address/address'
          })
        } else {
          wx.showToast({
            title: '删除地址失败',
            duration: 2000,
            mask: true,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('removeAddress err ==> ', err)
      }
    })
  },

  /**
   * 保存编辑地址
   */
  saveAddress() {

    // 判断用户是否编辑过地址
    let editAddressData = {};
    for (let key in this.data.addressInfo) {

      if (key == 'area') {
        let area = this.data.addressInfo[key].join('');
        let copyArea = this.data.copyAddressInfo[key].join('');
        if (area != copyArea) {
          editAddressData[key] = this.data.addressInfo[key];
        }
        continue;
      }
      if (this.data.addressInfo[key] != this.data.copyAddressInfo[key]) {
        editAddressData[key] = this.data.addressInfo[key];
      }
    }

    // 如果没有编辑过地址 判断editAddressData是否为空对象
    if (JSON.stringify(editAddressData) == '{}') return wx.navigateBack()

    // 判断地址表单是否填写正确
    if (!this.verifyAddressForm()) return

    // 发起编辑地址请求
    this.editAddress(editAddressData)

  },

  /**
   * 编辑地址
   * @param {Object} data 编辑地址数据
   */
  editAddress(data) {

    // 启动加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 调用云函数[edit_address]
    wx.cloud.callFunction({
      name: 'edit_address',
      data: {
        _id: this.data._id,
        data
      },
      success: result => {

        // 关闭加载提示
        wx.hideLoading()
        if (result.result.stats.updated == 1) {
          wx.navigateTo({
            url: '../address/address'
          })
        } else {
          wx.showToast({
            title: '修改地址失败',
            mask: true,
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: err => {

        // 关闭加载提示
        wx.hideLoading()
        console.log('editAddress err ==> ', err)
      }
    })
  }

})
