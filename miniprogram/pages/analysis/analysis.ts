interface IVenue {
value: string;
label: string;
}

interface ITimeRange {
value: string;
label: string;
}

interface IAnalysisSuggestion {
type: 'success' | 'warning' | 'error';
tag: string;
content: string;
}

Page({
data: {
currentVenue: {
value: 'venue1',
label: '金融中心A座'
} as IVenue,
compareVenue: {
value: 'venue2',
label: '商业广场B区'
} as IVenue,
enableCompare: false,
timeRange: '6',
timeRanges: [
{value: '6', label: '最近6个月'},
{value: '12', label: '最近12个月'},
{value: '24', label: '最近24个月'}
] as ITimeRange[],
analysisSuggestions: [
{
type: 'success',
tag: '收入增长',
content: '物业管理费收入环比增长15%，建议继续保持服务质量，适当提高收费标准。'
},
{
type: 'warning',
tag: '成本控制',
content: '人工成本占比过高，建议优化人员配置，提高工作效率。'
},
{
type: 'error',
tag: '坪效预警',
content: '坪效值低于行业平均水平，建议加强招商力度，提高场地利用率。'
}
] as IAnalysisSuggestion[]
},

onLoad() {

},

onSelectVenue() {

wx.showToast({
title: '选择场地',
icon: 'none'
});
},

onSelectCompareVenue() {

wx.showToast({
title: '选择对比场地',
icon: 'none'
});
},

onCompareChange(e: any) {
this.setData({
enableCompare: e.detail.value
});

},

onTimeRangeChange(e: any) {
this.setData({
timeRange: e.detail.value
});

}
});