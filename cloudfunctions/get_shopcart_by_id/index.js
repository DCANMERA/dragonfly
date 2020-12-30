// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database()
let _ = db.command

// 引入联表查询
let $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {

  // 根据 _id 集合查询, _id: ['a1', 'a2', 'a3'] 等同于 _id: _eq('a1').or(_eq('a2')).or(_eq('a2'))
  // 当不确定 _id 的数量时, 应使用 _id: []操作, 不应使用 _id: _eq(xx).or(...)操作
  return await db.collection('shopcart').where({
    _id: _.in(event._ids),
    userInfo: event.userInfo
  }).get().then(async (result) => {

    // 当商品pid = 商品集合的_id
    let pids = [];
    result.data.map(v => {
      pids.push(v.pid)
    })

    // 根据pids查询商品集合数据
    return await db.collection('menu_list').where({
      _id: _.in(pids)
    }).get().then(async (res) => {

      // 将购物车的数据和商品数据合并
      result.data.map(v => {

        // 根据商品pid查找商品数据
        for (let i = 0; i < res.data.length; i++) {
          if (v.pid == res.data[i]._id) {
            v.product = res.data[i]
            break
          }
        }
      })

      // 返回合并后的数据
      return await result
    })
  })

}
