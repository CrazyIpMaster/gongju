import { userManager, Company, CompanyApplication } from '../../utils/user';

interface ApplicationWithText extends CompanyApplication {
  applyTimeText: string;
}

Page({
  data: {
    companyInfo: null as Company | null,
    pendingApplications: [] as ApplicationWithText[],
    createTimeText: '',
    showAdminDialog: false,
    newAdminPhone: ''
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

    if (userInfo.role !== 'admin') {
      wx.showToast({
        title: '只有管理员可以访问',
        icon: 'none'
      });
      wx.navigateBack();
      return;
    }

    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    this.loadCompanyInfo();
    this.loadPendingApplications();
  },

  loadCompanyInfo() {
    const companyInfo = userManager.getCurrentCompany();
    if (companyInfo) {
      this.setData({
        companyInfo,
        createTimeText: this.formatTime(companyInfo.createTime)
      });
    }
  },

  loadPendingApplications() {
    const applications = userManager.getPendingApplications();
    const applicationsWithText = applications.map(app => ({
      ...app,
      applyTimeText: this.formatTime(app.applyTime)
    }));

    this.setData({
      pendingApplications: applicationsWithText
    });
  },

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  async handleApplication(e: any) {
    const { id, action } = e.currentTarget.dataset;
    const actionText = action === 'approve' ? '通过' : '拒绝';
    
    wx.showModal({
      title: '确认操作',
      content: `确定要${actionText}这个申请吗？`,
      success: async (res) => {
        if (res.confirm) {
          await this.processApplication(id, action);
        }
      }
    });
  },

  async processApplication(applicationId: string, action: 'approve' | 'reject') {
    wx.showLoading({
      title: '处理中...'
    });

    try {
      const result = await userManager.processApplication(applicationId, action);
      
      wx.hideLoading();
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });
        
        // 刷新数据
        this.loadData();
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('处理申请失败:', error);
      wx.showToast({
        title: '处理失败，请重试',
        icon: 'none'
      });
    }
  },

  viewMembers() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  viewApplicationHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  changeAdmin() {
    this.setData({
      showAdminDialog: true,
      newAdminPhone: ''
    });
  },

  onNewAdminPhoneChange(e: any) {
    this.setData({
      newAdminPhone: e.detail.value
    });
  },

  async confirmChangeAdmin() {
    const { newAdminPhone } = this.data;
    
    if (!newAdminPhone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '更换中...'
    });

    try {
      const result = await userManager.changeAdmin(newAdminPhone.trim());
      
      wx.hideLoading();
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });
        
        this.setData({
          showAdminDialog: false
        });
        
        // 延迟跳转，因为当前用户已不是管理员
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
      wx.hideLoading();
      console.error('更换管理员失败:', error);
      wx.showToast({
        title: '更换失败，请重试',
        icon: 'none'
      });
    }
  },

  cancelChangeAdmin() {
    this.setData({
      showAdminDialog: false,
      newAdminPhone: ''
    });
  }
}); 