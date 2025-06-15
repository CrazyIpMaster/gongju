import { userManager } from '../../utils/user';

const app = getApp()

Page({
data: {
currentVenue: 0,
currentVenueLabel: '金融中心A座',
venues: [
{label: '金融中心A座', value: 'venue1'},
{label: '商业广场B区', value: 'venue2'},
{label: '办公大厦C栋', value: 'venue3'}
],
overview: {
totalIncome: 285600,
totalExpense: 198420,
profitRate: 30.5,
perSquareMeter: 23
}
},

onLoad() {
// 检查登录状态
this.checkLoginStatus();

this.setData({
currentVenue: 0,
currentVenueLabel: this.data.venues[0].label
})
},

onShow() {
// 每次显示页面时检查登录状态
this.checkLoginStatus();
},

checkLoginStatus() {
if (!userManager.isLoggedIn()) {
wx.showModal({
title: '需要登录',
content: '请先登录后使用坪效计算工具',
showCancel: false,
success: () => {
wx.navigateTo({
url: '/pages/login/login'
});
}
});
}
},

onVenueChange(e: any) {
const index = e.detail.value
this.setData({
currentVenue: index,
currentVenueLabel: this.data.venues[index].label
})
},

onManageVenue() {
wx.navigateTo({
url: '/pages/venue/venue'
})
},

onNavigateToInput() {
// 添加小延迟避免开发者工具路由错误
setTimeout(() => {
wx.navigateTo({
url: '/pages/input/input'
})
}, 50)
},

onNavigateToAnalysis() {
setTimeout(() => {
wx.navigateTo({
url: '/pages/analysis/analysis'
})
}, 50)
},

onNavigateToHistory() {
setTimeout(() => {
wx.navigateTo({
url: '/pages/history/history'
})
}, 50)
},

onNavigateToReport() {
setTimeout(() => {
wx.navigateTo({
url: '/pages/report/report'
})
}, 50)
}
})