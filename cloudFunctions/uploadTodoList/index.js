const cloud = require('wx-server-sdk')  // 引入云开发SDK
cloud.init()                // 初始化云能力
const db = cloud.database() // 获取数据库引用

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    // 直接以用户的openid作为任务清单在集合中的id，每次都覆盖更新已有的数据
    return await db.collection('todos').doc(wxContext.OPENID).set({
      data: {
        todoList: event.todoList
      }
    })
  } catch (e) {
    console.error(e)
  }
}