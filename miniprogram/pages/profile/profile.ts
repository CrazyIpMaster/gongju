import { userManager, UserInfo, Company } from '../../utils/user';

Page({
  data: {
    userInfo: null as UserInfo | null,
    companyInfo: null as Company | null,
    roleText: ''
  },

  onLoad() {
    userManager.init();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = userManager.getCurrentUser();
    if (userInfo) {
      const companyInfo = userManager.getCurrentCompany();
      const roleText = this.getRoleText(userInfo.role);
      
      this.setData({
        userInfo,
        companyInfo,
        roleText
      });
    } else {
      this.setData({
        userInfo: null,
        companyInfo: null,
        roleText: ''
      });
    }
  },

  getRoleText(role: string): string {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'member':
        return '成员';
      case 'pending':
        return '待审核';
      default:
        return '未知';
    }
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  goToCreateCompany() {
    wx.navigateTo({
      url: '/pages/company/company'
    });
  },

  goToApplyCompany() {
    wx.navigateTo({
      url: '/pages/company-apply/company-apply'
    });
  },

  goToCompanyManage() {
    wx.navigateTo({
      url: '/pages/company-manage/company-manage'
    });
  },

  goToHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  },

  goToReport() {
    wx.switchTab({
      url: '/pages/report/report'
    });
  },

  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          userManager.logout();
          this.loadUserInfo();
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
}); 