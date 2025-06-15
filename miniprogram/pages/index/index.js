Page({
  data: {
    currentVenue: 0,
    currentVenueLabel: '金融中心A座',
    venues: [
      { label: '金融中心A座', value: 'venue1' },
      { label: '商业广场B区', value: 'venue2' },
      { label: '办公大厦C栋', value: 'venue3' }
    ],
    overview: {
      totalIncome: 285600,
      totalExpense: 198420,
      profitRate: 30.5,
      perSquareMeter: 23
    }
  },

  onLoad() {
    // 设置默认选中的场地
    this.setData({
      currentVenue: 0,
      currentVenueLabel: this.data.venues[0].label
    });
  },

  onVenueChange(e) {
    const index = e.detail.value;
    this.setData({
      currentVenue: index,
      currentVenueLabel: this.data.venues[index].label
    });
    // TODO: 根据选中的场地更新数据
  },

  onManageVenue() {
    wx.navigateTo({
      url: '/pages/venue/venue'
    });
  },

  onNavigateToInput() {
    wx.navigateTo({
      url: '/pages/input/input'
    });
  },

  onNavigateToAnalysis() {
    wx.navigateTo({
      url: '/pages/analysis/analysis'
    });
  },

  onNavigateToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  onNavigateToReport() {
    wx.navigateTo({
      url: '/pages/report/report'
    });
  }
}); 