// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

// 引用查询指令
let _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  // 保存查询的promise
  let pm = []

  // 查询地址
  pm.push(db.collection('address').where({

    // 地址_id
    _id: event.aid,
    userInfo: event.userInfo
  }).get())

  // 查询购物车的数据
  pm.push(db.collection('shopcart').where({

    // 购物车的_id
    _id: _.in(event.sid),
    userInfo: event.userInfo
  }).get())

  // Promise.all(promise数组)当所有promise完成后再执行其他任务
  return await Promise.all(pm).then(async (result) => {

    // 购物车的_id
    let sids = []

    // 获取商品的pid
    let pids = []

    result[1].data.map(v => {
      pids.push(v.pid)
      sids.push(v._id)
    })

    // 订单数
    let count = event.count

    // 订单总金额
    let total = event.total

    // 订单备注
    let note = event.note

    // 外带还是堂食
    let way = event.way

    // 订单时间
    let date = new Date()

    // 生成订单编号
    let orderNo = 'NO' + date.getTime()

    // 订单状态 0 ==> 准备中, 1 ==> 配送中, 2 ==> 已完成
    let status = 0

    // 订单数据
    let orderData = {
      orderNo,
      date,
      count,
      total,
      note,
      way,
      status,
      address: result[0].data[0],
      products: result[1].data
    }

    // 写入订单信息
    return await db.collection('order').add({
      data: orderData
    }).then(async (value) => {

      // 根据购物车的_id删除购物车的数据
      if (value && value._id) {

        // 如果订单添加成功, 删除购物车数据
        return await db.collection('shopcart').where({
          _id: _.in(sids),
          userInfo: event.userInfo
        }).remove()
      }
    })
  }).catch(err => {
    console.log('add_order err ==> ', err);
  })

}
