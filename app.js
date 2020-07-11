App({
  globalData: {}, // 用来保存全局数据
  onLaunch: function () {
    // 初始化云能力
    wx.cloud.init({
      env: 'test-633q8',  // 指定使用环境ID为test-633q8的云开发环境
      traceUser: true     // 记录用户对云资源的访问
    })
    // 将一些系统信息保存为全局数据，ColorUI 的自定义导航栏需要用到这些信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.StatusBar = res.statusBarHeight
        const custom = wx.getMenuButtonBoundingClientRect()
        console.log(custom)
        this.globalData.Custom = custom
        this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight
      }
    })
  }
})
