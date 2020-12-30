// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  // 根据地址_id删除用户地址
  return await db.collection('address').where({
    _id: event._id,
    userInfo: event.userInfo
  }).remove()
}