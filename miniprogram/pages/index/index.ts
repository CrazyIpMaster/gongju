// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

interface IVenue {
  value: string;
  label: string;
}

interface IOverview {
  totalIncome: number;
  totalExpense: number;
  profitRate: number;
  perSquareMeter: number;
}

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    currentVenue: '',
    currentVenueLabel: '',
    venues: [
      { value: 'venue1', label: '金融中心A座' },
      { value: 'venue2', label: '商业广场B区' },
      { value: 'venue3', label: '办公大厦C栋' }
    ] as IVenue[],
    overview: {
      totalIncome: 285600,
      totalExpense: 198420,
      profitRate: 30.5,
      perSquareMeter: 23
    } as IOverview
  },
  methods: {
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    onLoad() {
      // 设置默认选中的场地
      const defaultVenue = this.data.venues[0];
      this.setData({
        currentVenue: defaultVenue.value,
        currentVenueLabel: defaultVenue.label
      });
    },
    onVenueChange(e: any) {
      const selectedVenue = this.data.venues.find(venue => venue.value === e.detail.value);
      this.setData({
        currentVenue: e.detail.value,
        currentVenueLabel: selectedVenue ? selectedVenue.label : ''
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
  },
})
