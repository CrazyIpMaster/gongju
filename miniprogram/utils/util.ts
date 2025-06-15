const formatTime = (date: Date) => {
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hour = date.getHours()
const minute = date.getMinutes()
const second = date.getSeconds()

return (
[year, month, day].map(formatNumber).join('/') +
' ' +
[hour, minute, second].map(formatNumber).join(':')
)
}

const formatNumber = (n: number) => {
const s = n.toString()
return s[1] ? s : '0' + s
}

const safeNavigateTo = (url: string, delay: number = 50) => {
setTimeout(() => {
wx.navigateTo({
url: url,
fail: (err) => {
console.error('页面跳转失败:', err)
wx.showToast({
title: '页面跳转失败',
icon: 'none'
})
}
})
}, delay)
}

const safeRedirectTo = (url: string, delay: number = 50) => {
setTimeout(() => {
wx.redirectTo({
url: url,
fail: (err) => {
console.error('页面重定向失败:', err)
wx.showToast({
title: '页面跳转失败',
icon: 'none'
})
}
})
}, delay)
}

export {formatTime, safeNavigateTo, safeRedirectTo}