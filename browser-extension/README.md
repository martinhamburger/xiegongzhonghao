# 公众号写作助手 Browser Extension

## 概述

这是一个专为微信公众号写作设计的浏览器插件，提供协作式写作、AI味检测、内容导入和预览等功能，帮助你高效撰写高质量的学习笔记类文章。

## 功能列表

### 1. 📝 协作式写作

四步写作流程，AI提问引导，用户主导内容：

- **步骤1：确定核心观点**
  - 明确文章最核心的观点
  - 确定写作动机和读者收获
  - AI通过提问帮助你厘清思路

- **步骤2：设计大纲**
  - 基于核心观点设计文章结构
  - 提供标准大纲模板
  - 支持自定义章节

- **步骤3：逐章撰写**
  - 按章节进行协作式写作
  - AI提问引导，你回答思考
  - 保持"定义 → 图解 → 个人思考"的节奏
  - 实时保存进度

- **步骤4：整体润色**
  - 检查逻辑连贯性
  - 应用去AI味技巧
  - 优化风格统一性

### 2. 🎨 去AI味检测与优化

智能检测AI写作特征，提供优化建议：

- **检测项目：**
  - 过度使用的衔接词（首先、其次、因此等）
  - 常见套话（随着时代的发展、在当今社会等）
  - 过于工整的句式结构
  - 过度总结

- **优化建议：**
  - 删除不必要的过渡词
  - 用具体例子代替抽象描述
  - 增加口语化表达
  - 打破句式平衡

- **自动优化：**
  - 一键删减过度使用的衔接词
  - 自动移除常见套话
  - 保留原文核心内容

### 3. 📥 内容导入

支持多种方式导入写作素材：

- **从当前网页导入：**
  - 智能提取网页主要内容
  - 自动清理格式
  - 识别文章结构

- **导入AI对话：**
  - 粘贴AI对话内容
  - 提取关键观点和定义
  - 整理成结构化笔记

- **导入选中内容：**
  - 右键选中文本快速导入
  - 支持跨页面导入
  - 自动追加到当前文章

### 4. 👀 预览与导出

多种方式预览和导出文章：

- **Markdown预览：**
  - 实时渲染文章内容
  - 支持完整Markdown语法
  - 章节结构清晰展示

- **一键复制：**
  - 复制Markdown格式
  - 直接粘贴到编辑器

- **markdownnice集成：**
  - 一键打开markdownnice编辑器
  - 自动复制内容到剪贴板
  - 支持微信公众号排版导出

- **导出文件：**
  - 导出为.md文件
  - 保留完整格式
  - 支持批量导出

## 安装方法

### Chrome/Edge 浏览器

1. 下载或克隆此仓库
2. 打开浏览器扩展管理页面：
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `browser-extension` 文件夹
6. 安装完成！

### Firefox 浏览器

1. 下载或克隆此仓库
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击"临时加载附加组件"
4. 选择 `browser-extension` 文件夹中的 `manifest.json`
5. 安装完成！

## 使用指南

### 快速开始

1. **点击扩展图标** 打开主界面
2. **选择功能模块：**
   - ✍️ 写作：开始新文章或继续编辑
   - 🎨 去AI味：检测和优化文本
   - 📥 导入：导入写作素材
   - 👀 预览：预览和导出文章

3. **开始写作：**
   - 点击"开始新文章"
   - 按照四步流程逐步完成
   - 随时保存和预览

### 快捷键

- `Alt + W` - 快速打开写作助手

### 右键菜单

- 选中文本后右键
- 选择"导入选中内容到写作助手"
- 内容将自动添加到当前文章

## 技术架构

### 文件结构

```
browser-extension/
├── manifest.json           # 扩展配置文件
├── popup/                  # 弹出窗口
│   ├── popup.html         # 主界面HTML
│   ├── popup.css          # 主界面样式
│   └── popup.js           # 主界面逻辑
├── content/               # 内容脚本
│   └── content.js         # 网页内容提取
├── background/            # 后台服务
│   └── background.js      # 后台逻辑和数据管理
├── styles/                # 样式文件
│   └── content.css        # 内容脚本样式
└── assets/                # 资源文件
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### 核心技术

- **Manifest V3** - 最新的Chrome扩展API
- **Chrome Storage API** - 本地数据存储
- **Content Scripts** - 网页内容交互
- **Background Service Worker** - 后台数据管理

## 开发指南

### 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/martinhamburger/xiegongzhonghao.git
cd xiegongzhonghao/browser-extension
```

2. 加载扩展（见安装方法）

3. 修改代码后，在扩展管理页面点击"重新加载"

### 调试

- **Popup调试：** 右键点击扩展图标 → 检查弹出内容
- **Background调试：** 扩展管理页面 → 查看视图：背景页
- **Content Script调试：** 打开网页 → F12开发者工具 → Console

## 数据存储

所有数据存储在浏览器本地，包括：

- 当前文章内容
- 历史文章列表
- 用户设置
- 自动保存记录

**隐私保护：** 所有数据仅存储在本地，不会上传到任何服务器。

## 原始文件说明

`original_files/` 目录包含了本扩展所基于的原始skill文件：

- `SKILL.md` - 完整的写作流程和功能说明
- `anti-ai-style.md` - 去AI味写作指南
- `writing_patterns.md` - 写作模式参考
- `outline_template.md` - 大纲模板

这些文件是扩展功能的理论基础，详细说明了写作方法论和最佳实践。

## 更新日志

### v1.0.0 (2026-02-15)

初始版本发布：

- ✅ 四步协作式写作流程
- ✅ AI味检测与优化
- ✅ 多种内容导入方式
- ✅ 文章预览与导出
- ✅ 自动保存功能
- ✅ 右键快捷导入
- ✅ markdownnice集成

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

- GitHub: [martinhamburger/xiegongzhonghao](https://github.com/martinhamburger/xiegongzhonghao)
- Issues: [提交问题](https://github.com/martinhamburger/xiegongzhonghao/issues)

---

**享受高效的写作体验！** 📝✨
