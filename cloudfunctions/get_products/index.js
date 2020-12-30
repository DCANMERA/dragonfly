// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
let db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('menu_list').where(_.or([{
    name: db.RegExp({
      regexp: '.*' + event.value,
      options: 'i',
    })
  }])).get()
}
