interface IHistoryItem {
id: string;
date: string;
venueName: string;
status: 'excellent' | 'good' | 'warning';
statusText: string;
totalIncome: number;
totalExpense: number;
profitRate: number;
perSquareMeter: number;
change?: {
profitRate: number;
perSquareMeter: number;
};
}

interface IOption {
value: string;
label: string;
}

Page({
data: {
filterVenue: 'all',
filterTime: 'all',
sortBy: 'date_desc',
venueOptions: [
{value: 'all', label: '全部场地'},
{value: 'venue1', label: '金融中心A座'},
{value: 'venue2', label: '商业广场B区'},
{value: 'venue3', label: '办公大厦C栋'}
] as IOption[],
timeOptions: [
{value: 'all', label: '全部时间'},
{value: '2024', label: '2024年'},
{value: '2023', label: '2023年'},
{value: 'recent6', label: '最近6个月'},
{value: 'recent12', label: '最近12个月'}
] as IOption[],
sortOptions: [
{value: 'date_desc', label: '时间倒序'},
{value: 'date_asc', label: '时间正序'},
{value: 'profit_desc', label: '毛利率降序'},
{value: 'efficiency_desc', label: '坪效降序'}
] as IOption[],
historyList: [
{
id: '1',
date: '2024年1月',
venueName: '金融中心A座',
status: 'excellent',
statusText: '优秀',
totalIncome: 285600,
totalExpense: 198420,
profitRate: 30.5,
perSquareMeter: 23,
change: {
profitRate: 2.3,
perSquareMeter: 1.8
}
},
{
id: '2',
date: '2023年12月',
venueName: '金融中心A座',
status: 'good',
statusText: '良好',
totalIncome: 268900,
totalExpense: 194200,
profitRate: 27.7,
perSquareMeter: 21.2,
change: {
profitRate: -1.2,
perSquareMeter: -0.5
}
},
{
id: '3',
date: '2023年11月',
venueName: '商业广场B区',
status: 'warning',
statusText: '待改进',
totalIncome: 195600,
totalExpense: 156800,
profitRate: 19.8,
perSquareMeter: 15.6,
change: {
profitRate: -3.1,
perSquareMeter: -2.2
}
}
] as IHistoryItem[],
selectedItems: [] as string[]
},

onLoad() {
this.loadHistoryData();
},

loadHistoryData() {

console.log('加载历史数据');
},

onVenueFilterChange(e: any) {
this.setData({
filterVenue: e.detail.value
});
this.filterAndSortData();
},

onTimeFilterChange(e: any) {
this.setData({
filterTime: e.detail.value
});
this.filterAndSortData();
},

onSortChange(e: any) {
this.setData({
sortBy: e.detail.value
});
this.filterAndSortData();
},

filterAndSortData() {

console.log('筛选和排序数据');
},

onItemTap(e: any) {
const item = e.currentTarget.dataset.item as IHistoryItem;

wx.showToast({
title: '查看详情',
icon: 'none'
});
},

onCompareAnalysis() {
if (this.data.selectedItems.length < 2) {
wx.showToast({
title: '请选择至少2项进行对比',
icon: 'none'
});
return;
}

setTimeout(() => {
wx.navigateTo({
url: '/pages/compare/compare',
fail: (err) => {
console.error('页面跳转失败:', err);
wx.showToast({
title: '页面跳转失败',
icon: 'none'
});
}
});
}, 50);
}
});