const cloud = require('wx-server-sdk')  // 引入云开发SDK
cloud.init()                // 初始化云能力
const db = cloud.database() // 获取数据库引用

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    // 读取数据
    const result = await db.collection('todos').doc(wxContext.OPENID).get()
    if (result && result.data && result.data.todoList) {
      // 如果获取到了数据，直接返回todoList列表
      return result.data.todoList
    } else {
      // 如果未同步过数据，默认返回空数组
      return []
    }
  } catch (e) {
    console.error(e)
  }
}