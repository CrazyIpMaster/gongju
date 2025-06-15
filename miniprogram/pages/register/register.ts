import { userManager } from '../../utils/user';

Page({
  data: {
    phone: '',
    nickname: '',
    password: '',
    confirmPassword: '',
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

  onNicknameChange(e: any) {
    this.setData({
      nickname: e.detail.value
    });
  },

  onPasswordChange(e: any) {
    this.setData({
      password: e.detail.value
    });
  },

  onConfirmPasswordChange(e: any) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  async handleRegister() {
    const { phone, nickname, password, confirmPassword } = this.data;

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!nickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
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

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await userManager.register(phone.trim(), nickname.trim(), password.trim());
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });

        // 延迟跳转到登录页面
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      wx.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToLogin() {
    wx.navigateBack();
  }
}); 