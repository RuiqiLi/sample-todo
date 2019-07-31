Page({
  data: {
    tab: 0,               // 0: 显示未完成任务列表，1: 显示已完成任务列表
    todoList: [],         // 任务列表
    /*
     * todoList = [{
     *   content: 'xxxx', // 任务内容
     *   done: false      // 是否已完成
     * }]
     */
    tab0Empty: true,      // 未完成任务列表是否为空
    tab1Empty: true       // 已完成任务列表是否为空
  },
  onShow() {
    // 进入或回退到本页面时都会刷新任务列表
    this.getTodoList()
  },
  getTodoList() {
    const app = getApp()            // 获取小程序实例
    app.globalData.lockData = true  // 用一个变量作为锁
    // 首先从云端获取数据
    wx.cloud.callFunction({
      name: 'downloadTodoList'
    }).then(res => {
      if (res.result) {
        // 同步到本地缓存中
        wx.setStorage({
          key: 'todoList',
          data: res.result,
          success: () => {
            this.setTodoList(res.result)
            // 同步成功后解锁
            app.globalData.lockData = false
          },
          fail: () => {
            // 若云同步保存时失败，显示数据，但不解锁
            const todoList = wx.getStorageSync('todoList') || [];
            this.setTodoList(todoList)
          }
        })
      }
    }).catch(err => {
      // 若云同步下载时失败，显示数据，但不解锁
      const todoList = wx.getStorageSync('todoList') || [];
      this.setTodoList(todoList)
    })
  },
  setTodoList(todoList) {
    // 判断未完成和已完成的任务列表是否为空
    const tab0Empty = todoList.filter(item => !item.done).length === 0
    const tab1Empty = todoList.filter(item => item.done).length === 0
    // 刷新任务列表数据
    this.setData({
      todoList,
      tab0Empty,
      tab1Empty
    })
  },
  // 切换 tab 时的回调函数
  onSelectTab(e) {
    const newTab = e.currentTarget.dataset.tab
    if (this.data.tab !== newTab) {
      this.setData({
        tab: newTab
      })
    }
  }
})