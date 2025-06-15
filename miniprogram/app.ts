import { userManager } from './utils/user';

App({
  globalData: {},
  onLaunch() {
    // 初始化用户管理器
    userManager.init();

    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.login({
      success: res => {
        // 登录成功处理
      }
    })
  }
})