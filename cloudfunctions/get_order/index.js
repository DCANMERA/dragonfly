// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  // orderBy: 排序 ==> orderBy(排序字段, 排序方式), 其中排序方式 升序排序为asc, 降序排序方式为 desc
  // skip: 偏移数据量
  // limit: 查询数据量上限量
  return await db.collection('order').where({
    address: {
      userInfo: event.userInfo
    }
  }).orderBy('date', 'desc').skip(event.offset).limit(event.count).get()
}