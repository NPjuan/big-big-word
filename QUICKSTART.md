# 🚀 快速启动指南

## 立即开始使用

### 1️⃣ 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:5173`

### 2️⃣ 添加你的第一个单词

1. 在输入框中输入一个单词，例如：**serendipity**
2. 点击 "Add Word" 按钮或按 **Enter** 键
3. 单词会出现在下方的表格中！

### 3️⃣ 探索功能

- 🔍 **搜索单词**：使用表格右上角的搜索框
- 📊 **查看统计**：页面底部显示总单词数、掌握数和平均掌握度
- 🗑️ **删除单词**：点击表格中的删除图标
- ⌨️ **键盘快捷键**：
  - `Enter` - 提交单词
  - `Esc` - 清除输入

## 🎨 界面预览

### 主页面
- 顶部：单词输入表单
- 中间：单词数据表格（带搜索和排序）
- 底部：统计卡片（总数、掌握数、平均掌握度）

### 功能特性
✅ 实时输入验证  
✅ 重复单词检测  
✅ 本地存储持久化  
✅ 响应式设计  
✅ Material Design 3 风格  

## 📝 示例单词

试试添加这些单词：
- serendipity
- ephemeral
- eloquent
- resilience
- paradigm
- ubiquitous
- ambiguous
- meticulous

## 🐛 遇到问题？

### 端口被占用
```bash
# 使用不同端口
npm run dev -- --port 3000
```

### 清除缓存
```bash
# 清除 node_modules 和重新安装
rm -rf node_modules package-lock.json
npm install
```

### 清除浏览器数据
打开浏览器开发者工具 → Application → Local Storage → 删除 `big-big-words`

## 🎯 下一步

查看完整的功能规划：
- [实施计划](./openspec/changes/enhanced-word-learning-system/IMPLEMENTATION_PLAN.md)
- [技术规范](./openspec/changes/enhanced-word-learning-system/specs/TECHNICAL_SPEC.md)

---

**享受学习单词的乐趣！** 📚✨
