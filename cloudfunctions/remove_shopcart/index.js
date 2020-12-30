// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database()

let _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    type,
    _id
  } = event

  try {
    if (type) {
      return await db.collection('shopcart').where({
        userInfo: _.exists(type)
      }).remove()
    } else {
      return await db.collection('shopcart').where({ _id }).remove()
    }

  } catch (err) {
  }


}
