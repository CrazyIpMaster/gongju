 import { userManager, Company, CompanyApplication } from '../../utils/user';

interface CompanyWithText extends Company {
  createTimeText: string;
}

interface ApplicationWithText extends CompanyApplication {
  applyTimeText: string;
  statusText: string;
}

Page({
  data: {
    searchKeyword: '',
    companyList: [] as CompanyWithText[],
    myApplications: [] as ApplicationWithText[],
    allCompanies: [] as Company[]
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

    this.loadData();
  },

  loadData() {
    this.loadCompanies();
    this.loadMyApplications();
  },

  loadCompanies() {
    const companies = userManager.getAllCompanies();
    const companiesWithText = companies.map(company => ({
      ...company,
      createTimeText: this.formatTime(company.createTime)
    }));

    this.setData({
      allCompanies: companies,
      companyList: companiesWithText
    });
  },

  loadMyApplications() {
    const userInfo = userManager.getCurrentUser();
    if (!userInfo) return;

    const applications = userManager.getAllApplications();
    const myApplications = applications
      .filter(app => app.userId === userInfo.id)
      .map(app => ({
        ...app,
        applyTimeText: this.formatTime(app.applyTime),
        statusText: this.getStatusText(app.status)
      }))
      .sort((a, b) => b.applyTime - a.applyTime);

    this.setData({
      myApplications
    });
  },

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return '待审核';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知';
    }
  },

  onSearchChange(e: any) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  handleSearch() {
    const { searchKeyword, allCompanies } = this.data;
    
    let filteredCompanies = allCompanies;
    if (searchKeyword.trim()) {
      filteredCompanies = allCompanies.filter(company => 
        company.name.toLowerCase().includes(searchKeyword.trim().toLowerCase())
      );
    }

    const companiesWithText = filteredCompanies.map(company => ({
      ...company,
      createTimeText: this.formatTime(company.createTime)
    }));

    this.setData({
      companyList: companiesWithText
    });
  },

  async selectCompany(e: any) {
    const company = e.currentTarget.dataset.company;
    
    wx.showModal({
      title: '确认申请',
      content: `确定要申请加入"${company.name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          await this.applyToCompany(company.id);
        }
      }
    });
  },

  async applyToCompany(companyId: string) {
    wx.showLoading({
      title: '提交申请中...'
    });

    try {
      const result = await userManager.applyToCompany(companyId);
      
      wx.hideLoading();
      
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success'
        });
        
        // 刷新申请记录
        this.loadMyApplications();
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('申请失败:', error);
      wx.showToast({
        title: '申请失败，请重试',
        icon: 'none'
      });
    }
  }
}); 