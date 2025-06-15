interface IVenue {
value: string;
label: string;
}

interface IIncome {
propertyManagement: number;
parking: number;
others: number;
}

interface IExpense {
labor: number;
maintenance: number;
others: number;
}

interface IResult {
grossProfit: number;
profitRate: number;
perSquareMeter: number;
}

Page({
data: {
currentVenue: {
value: 'venue1',
label: '金融中心A座'
} as IVenue,
currentMonth: '2024-01',
area: 12500,
income: {
propertyManagement: 180000,
parking: 45600,
others: 60000
} as IIncome,
expense: {
labor: 120000,
maintenance: 35420,
others: 0
} as IExpense,
result: {
grossProfit: 0,
profitRate: 0,
perSquareMeter: 0
} as IResult
},

onLoad() {
this.calculateResult();
},

onMonthChange(e: any) {
this.setData({
currentMonth: e.detail.value
});
},

onAreaChange(e: any) {
this.setData({
area: Number(e.detail.value)
});
this.calculateResult();
},

onIncomeChange(e: any) {
const type = e.currentTarget.dataset.type;
const value = Number(e.detail.value);
this.setData({
[`income.${type}`]: value
});
this.calculateResult();
},

onExpenseChange(e: any) {
const type = e.currentTarget.dataset.type;
const value = Number(e.detail.value);
this.setData({
[`expense.${type}`]: value
});
this.calculateResult();
},

calculateResult() {
const {income, expense, area} = this.data;

const totalIncome = income.propertyManagement + income.parking + income.others;

const totalExpense = expense.labor + expense.maintenance + expense.others;

const grossProfit = totalIncome - totalExpense;

const profitRate = totalIncome > 0 ? (grossProfit / totalIncome * 100) : 0;

const perSquareMeter = area > 0 ? grossProfit / area : 0;

this.setData({
result: {
grossProfit: Math.round(grossProfit),
profitRate: Number(profitRate.toFixed(1)),
perSquareMeter: Number(perSquareMeter.toFixed(2))
}
});
},

onSave() {

wx.showToast({
title: '保存成功',
icon: 'success'
});
}
});