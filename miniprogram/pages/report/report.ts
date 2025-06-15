interface IOption {
value: string;
label: string;
}

interface IYearSummary {
totalIncome: string;
totalExpense: string;
avgProfitRate: number;
avgPerSquareMeter: number;
bestMonth: string;
maxProfitRate: number;
maxPerSquareMeter: number;
}

interface ITrendAnalysis {
type: 'success' | 'primary' | 'warning' | 'error';
tag: string;
content: string;
}

interface IQuarterData {
quarter: string;
income: string;
profitRate: number;
performance: 'excellent' | 'good' | 'warning';
performanceText: string;
}

interface ISuggestion {
icon: string;
title: string;
content: string;
}

Page({
data: {
reportYear: '2024',
reportType: 'summary',
selectedVenue: 'venue1',
yearOptions: [
{value: '2024', label: '2024年'},
{value: '2023', label: '2023年'},
{value: '2022', label: '2022年'}
] as IOption[],
typeOptions: [
{value: 'summary', label: '全场地汇总'},
{value: 'single', label: '单场地报告'},
{value: 'compare', label: '场地对比'}
] as IOption[],
venueOptions: [
{value: 'venue1', label: '金融中心A座'},
{value: 'venue2', label: '商业广场B区'},
{value: 'venue3', label: '办公大厦C栋'}
] as IOption[],
yearSummary: {
totalIncome: '3.2M',
totalExpense: '2.3M',
avgProfitRate: 28.1,
avgPerSquareMeter: 256,
bestMonth: '2024年3月',
maxProfitRate: 35.2,
maxPerSquareMeter: 298
} as IYearSummary,
trendAnalysis: [
{
type: 'success',
tag: '收入增长',
content: '年度总收入同比增长18%，主要得益于物业管理费和停车费收入的稳定增长。'
},
{
type: 'primary',
tag: '成本控制',
content: '人工成本占比控制在合理范围内，维护费用较去年有所下降。'
},
{
type: 'warning',
tag: '季节性波动',
content: '第四季度收入有所下降，建议加强淡季营销策略。'
}
] as ITrendAnalysis[],
quarterData: [
{
quarter: 'Q1',
income: '850K',
profitRate: 32.1,
performance: 'excellent',
performanceText: '优秀'
},
{
quarter: 'Q2',
income: '920K',
profitRate: 29.8,
performance: 'good',
performanceText: '良好'
},
{
quarter: 'Q3',
income: '780K',
profitRate: 26.5,
performance: 'good',
performanceText: '良好'
},
{
quarter: 'Q4',
income: '650K',
profitRate: 24.2,
performance: 'warning',
performanceText: '待改进'
}
] as IQuarterData[],
suggestions: [
{
icon: '💰',
title: '收入优化',
content: '建议在淡季推出增值服务，如会议室租赁、活动场地出租等，提高非主营收入。'
},
{
icon: '📈',
title: '成本控制',
content: '通过智能化设备减少人工成本，优化维护计划降低设备故障率。'
},
{
icon: '👥',
title: '服务提升',
content: '加强客户满意度调研，提升服务质量，为未来提价创造条件。'
}
] as ISuggestion[]
},

onLoad() {
this.generateReport();
},

onYearChange(e: any) {
this.setData({
reportYear: e.detail.value
});
this.generateReport();
},

onTypeChange(e: any) {
this.setData({
reportType: e.detail.value
});
this.generateReport();
},

onVenueChange(e: any) {
this.setData({
selectedVenue: e.detail.value
});
this.generateReport();
},

generateReport() {

console.log('生成报告:', {
year: this.data.reportYear,
type: this.data.reportType,
venue: this.data.selectedVenue
});
},

onExportPDF() {
wx.showLoading({
title: '生成PDF中...'
});

setTimeout(() => {
wx.hideLoading();
wx.showToast({
title: 'PDF导出成功',
icon: 'success'
});
}, 2000);
},

onShareReport() {
wx.showShareMenu({
withShareTicket: true,
menus: ['shareAppMessage', 'shareTimeline']
});

wx.showToast({
title: '准备分享',
icon: 'none'
});
}
});