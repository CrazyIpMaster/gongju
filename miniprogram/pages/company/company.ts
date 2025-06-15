import { userManager, UserInfo } from '../../utils/user';

Page({
  data: {
    companyName: '',
    description: '',
    userInfo: null as UserInfo | null,
    loading: false
  },

  onLoad() {
    const userInfo = userManager.getCurrentUser();
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }

    if (userInfo.companyId) {
      wx.showToast({
        title: '您已加入公司',
        icon: 'none'
      });
      wx.navigateBack();
      return;
    }

    this.setData({
      userInfo
    });
  },

  onCompanyNameChange(e: any) {
    this.setData({
      companyName: e.detail.value
    });
  },

  onDescriptionChange(e: any) {
    this.setData({
      description: e.detail.value
    });
  },

  async handleCreateCompany() {
    const { companyName, description } = this.data;

    if (!companyName.trim()) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await userManager.createCompany(companyName.trim(), description.trim());
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });

        // 延迟跳转回个人中心
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
      console.error('创建公司失败:', error);
      wx.showToast({
        title: '创建公司失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
}); 