# 问题排查指南

## 🚨 已解决的问题

### 1. 开发者工具路由错误

#### 问题描述
```
routeDone with a webviewId 27 is not found
(env: Windows,mp,1.06.2503300; lib: 3.8.8)
```

#### 问题性质
- ⚠️ 这是**开发者工具的内部错误**，不是代码问题
- ⚠️ 通常不会影响小程序的实际功能
- ⚠️ 主要在开发调试阶段出现

#### 原因分析
1. **页面跳转过快** - 在页面还未完全加载时就进行了跳转
2. **开发者工具缓存问题** - 工具内部状态管理出现异常
3. **热重载冲突** - 代码修改时的热重载与页面状态冲突
4. **webview生命周期管理** - 开发者工具的webview管理出现问题

#### 解决方案

**方法1: 重启开发者工具（推荐）**
```bash
# 完全关闭微信开发者工具
# 重新打开项目
```

**方法2: 清理项目缓存**
```bash
# 在开发者工具中：
# 工具 -> 构建npm -> 清理构建文件
# 项目 -> 清理缓存 -> 清理全部
```

**方法3: 重新编译项目**
```bash
# 修改任意文件触发重新编译
# 或者重新保存主要文件
```

**方法4: 检查页面跳转逻辑**
```javascript
// 在页面跳转时添加延迟，避免过快跳转
onNavigateToInput() {
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/input/input'
    })
  }, 100)
}
```

#### 预防措施
1. **避免频繁页面跳转**
2. **等待页面完全加载后再跳转**
3. **定期重启开发者工具**
4. **保持开发者工具版本更新**

### 2. WXSS编译错误

#### 问题描述
```
[ WXSS 文件编译错误] 
./app.wxss(18:1): unexpected token `*`
```

#### 原因分析
- WXSS不支持CSS通配符选择器`*`
- 在字体禁用规则中使用了不兼容的语法

#### 解决方案
将通配符选择器改为具体的元素选择器：

```css
/* 修复前（错误） */
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

/* 修复后（正确） */
page, view, text, button, input, textarea {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}
```

### 3. 图标资源加载失败

#### 问题描述
```
Failed to load local image resource /miniprogram_npm/tdesign-miniprogram/image/assets/icons/input.png
Failed to load local image resource /miniprogram_npm/tdesign-miniprogram/image/assets/icons/analysis.png
Failed to load local image resource /miniprogram_npm/tdesign-miniprogram/image/assets/icons/history.png
Failed to load local image resource /miniprogram_npm/tdesign-miniprogram/image/assets/icons/report.png
```

#### 原因分析
- 代码中引用了TDesign组件库中不存在的图标路径
- 缺少`history.png`图标文件
- 图标路径使用了相对路径而非绝对路径

#### 解决方案
1. **创建缺失的图标文件**
   ```bash
   # 复制现有图标作为history图标
   copy "miniprogram\assets\icons\report.png" "miniprogram\assets\icons\history.png"
   ```

2. **修复图标路径**
   - 将`assets/icons/xxx.png`改为`/assets/icons/xxx.png`
   - 使用项目自己的图标资源而非TDesign的

3. **当前图标文件列表**
   ```
   miniprogram/assets/icons/
   ├── analysis.png        ✅ 存在
   ├── analysis-active.png ✅ 存在
   ├── input.png          ✅ 存在
   ├── input-active.png   ✅ 存在
   ├── history.png        ✅ 已创建
   ├── report.png         ✅ 存在
   ├── report-active.png  ✅ 存在
   ├── home.png           ✅ 存在
   └── home-active.png    ✅ 存在
   ```

### 4. 字体文件加载失败

#### 问题描述
```
Failed to load font https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff
net::ERR_CACHE_MISS
```

#### 原因分析
- TDesign组件库尝试从外部CDN加载图标字体
- 小程序环境限制外部资源访问
- 网络环境可能阻止外部字体加载

#### 解决方案
在`miniprogram/app.wxss`中添加字体禁用规则：

```css
/* 禁用 TDesign 字体加载，避免网络请求错误 */
@font-face {
  font-family: 't-icon';
  src: none !important;
}

/* 禁用所有可能的外部字体加载 */
.t-icon,
[class*="t-icon-"],
[class^="t-icon-"] {
  font-family: inherit !important;
}

/* 确保不加载任何外部字体资源 */
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}
```

## 🔧 预防措施

### 1. 图标管理最佳实践
- ✅ 使用项目自己的图标资源
- ✅ 统一图标命名规范
- ✅ 使用绝对路径引用图标
- ✅ 确保所有引用的图标文件都存在

### 2. 字体管理最佳实践
- ✅ 禁用外部字体加载
- ✅ 使用系统字体栈
- ✅ 避免依赖网络字体资源
- ✅ 在app.wxss中统一字体配置

### 3. TDesign组件使用建议
- ✅ 使用组件的功能，不依赖其图标字体
- ✅ 用自定义图标替代组件默认图标
- ✅ 在全局样式中覆盖组件样式
- ✅ 测试所有组件在离线环境下的表现

### 4. WXSS语法兼容性
- ✅ 避免使用通配符选择器`*`
- ✅ 使用具体的元素选择器
- ✅ 测试所有CSS规则的兼容性
- ✅ 遵循小程序WXSS规范

## 🚀 验证修复效果

### 检查清单
- [ ] WXSS编译无错误
- [ ] 所有图标正常显示
- [ ] 无图标加载错误
- [ ] 无字体加载错误
- [ ] 页面样式正常
- [ ] 功能点击正常

### 测试步骤
1. **重新编译项目**
   ```bash
   # 清理并重新构建
   npm run build
   ```

2. **在开发者工具中测试**
   - 打开首页，检查四个功能图标
   - 查看控制台，确认无错误信息
   - 测试各个功能点击是否正常

3. **在真机上测试**
   - 预览二维码扫码测试
   - 确认在网络环境较差时也能正常显示

## 📋 常见问题

### Q: 图标显示为空白或默认图标
**A:** 检查图标文件路径是否正确，确保使用绝对路径`/assets/icons/xxx.png`

### Q: 仍然有字体加载错误
**A:** 确认app.wxss中的字体禁用规则已生效，可能需要重新编译项目

### Q: WXSS编译错误
**A:** 检查是否使用了不兼容的CSS语法，如通配符选择器`*`，改用具体的元素选择器

### Q: TDesign组件样式异常
**A:** 检查是否有样式冲突，确保自定义样式优先级足够高

### Q: 新增图标后不显示
**A:** 确保图标文件存在于正确路径，并使用正确的文件名

## 🔄 回滚方案

如果修复后出现新问题，可以：

1. **恢复原始文件**
   ```bash
   npm run optimize:simple:restore
   ```

2. **检查Git历史**
   ```bash
   git log --oneline
   git checkout <commit-hash> -- <file-path>
   ```

3. **重新应用修复**
   - 按照本文档重新执行修复步骤
   - 逐步测试每个修改的效果

## 📈 优化建议

### 性能优化
- 压缩图标文件大小
- 使用WebP格式图标（如果支持）
- 合并小图标为雪碧图

### 维护性优化
- 建立图标资源管理规范
- 定期检查无用的图标文件
- 统一图标设计风格

### 兼容性优化
- 测试不同设备上的显示效果
- 确保在弱网环境下的表现
- 考虑深色模式适配 