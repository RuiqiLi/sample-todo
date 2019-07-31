Page({
  data: {
    editIndex: null,  // 编辑的任务的序号，null 表示新建任务
    content: '',      // 任务内容
    done: false       // 任务是否完成（仅编辑任务时有效）
  },
  onLoad(options) {
    // 传入 editIndex 参数表示编辑任务
    if (options.editIndex) {
      // 读取任务列表数据
      const todoList = wx.getStorageSync('todoList')
      // 根据 index 查找任务内容
      const todoItem = todoList[options.editIndex]
      // 记录到 data 中
      this.setData({
        editIndex: options.editIndex,
        content: todoItem.content,
        done: todoItem.done
      })
    }
  },
  // 修改任务内容时的回调函数
  onInputContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 修改任务完成状态时的回调函数
  onChangeDone(e) {
    this.setData({
      done: e.detail.value
    })
  },
  // 提交表单保存本次编辑
  onSave() {
    // 校验表单
    if (!this.data.content) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      })
      return
    }
    // 获取任务列表数据
    let todoList = wx.getStorageSync('todoList') || [];
    if (this.data.editIndex) {
      // 编辑任务时直接更新到原数据中
      todoList[this.data.editIndex].content = this.data.content
      todoList[this.data.editIndex].done = this.data.done
    } else {
      // 新建任务时在任务列表中新增一项
      todoList.push({
        content: this.data.content,
        done: false // 默认为未完成任务
      })
    }
    // 保存
    this.saveTodoList(todoList)
  },
  // 点击删除按钮的回调函数
  onClickDelete() {
    wx.showModal({
      title: '警告',
      content: '确认删除任务吗？（注意：本操作不可恢复）',
      success: res => {
        if (res.confirm) {
          // 获取任务列表数据
          let todoList = wx.getStorageSync('todoList') || [];
          // 删除数组中从第 editIndex 开始数的 1 个元素
          todoList.splice(this.data.editIndex, 1)
          this.saveTodoList(todoList)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  saveTodoList(todoList) {
    const app = getApp()  // 获取小程序实例
    if (app.globalData.lockData) {
      wx.showToast({
        icon: 'none',
        title: '未进行云同步，不能修改数据'
      })
      return
    }
    // 首先在云端保存
    wx.cloud.callFunction({
      name: 'uploadTodoList',
      data: {
        todoList
      }
    }).then(res => {
      // 云端保存成功后在本地缓存
      wx.setStorage({
        key: 'todoList',
        data: todoList,
        success() {
          // 保存成功后回退到上一页
          wx.navigateBack()
        },
        fail(err) {
          // 保存失败时提示用户
          console.error(err)
          wx.showToast({
            icon: 'none',
            title: '保存失败'
          })
        }
      })
    }).catch(err => {
      // 保存失败时提示用户
      console.error(err)
      wx.showToast({
        icon: 'none',
        title: '保存失败'
      })
    })
  }
})