// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => await db.collection('menu_list').get()