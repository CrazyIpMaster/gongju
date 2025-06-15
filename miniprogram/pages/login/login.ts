import { userManager } from '../../utils/user';

Page({
  data: {
    phone: '',
    password: '',
    loading: false
  },

  onLoad() {
    // 检查是否已登录
    if (userManager.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onPhoneChange(e: any) {
    this.setData({
      phone: e.detail.value
    });
  },

  onPasswordChange(e: any) {
    this.setData({
      password: e.detail.value
    });
  },

  async handleLogin() {
    const { phone, password } = this.data;

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await userManager.login(phone.trim(), password.trim());
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
}); 