# 公众号写作助手 (WeChat Article Writing Assistant)

一个专为微信公众号写作设计的浏览器插件，帮助你高效撰写高质量的学习笔记类文章。

## 📚 项目结构

```
xiegongzhonghao/
├── original_files/          # 原始skill文件
│   ├── SKILL.md            # 完整的写作流程说明
│   ├── anti-ai-style.md    # 去AI味写作指南
│   ├── writing_patterns.md # 写作模式参考
│   └── outline_template.md # 大纲模板
│
└── browser-extension/       # 浏览器插件
    ├── manifest.json       # 插件配置
    ├── popup/              # 主界面
    ├── content/            # 内容脚本
    ├── background/         # 后台服务
    ├── styles/             # 样式文件
    ├── assets/             # 图标资源
    └── README.md           # 插件详细文档
```

## ✨ 核心功能

### 1. 协作式写作 ✍️
- 四步写作流程：确定核心观点 → 设计大纲 → 逐章撰写 → 整体润色
- AI提问引导，用户主导内容
- 保持"定义 → 图解 → 个人思考"的写作节奏

### 2. 去AI味检测 🎨
- 智能检测AI写作特征
- 识别过度使用的衔接词和套话
- 一键自动优化文本
- 提供具体改进建议

### 3. 内容导入 📥
- 从当前网页导入内容
- 导入AI对话记录
- 快速导入选中文本
- 智能提取和清理格式

### 4. 预览与导出 👀
- 实时Markdown预览
- 一键复制到剪贴板
- markdownnice集成
- 导出为.md文件

## 🚀 快速开始

### 安装插件

1. **克隆仓库**
```bash
git clone https://github.com/martinhamburger/xiegongzhonghao.git
cd xiegongzhonghao
```

2. **加载到浏览器**

**Chrome/Edge:**
- 打开 `chrome://extensions/` 或 `edge://extensions/`
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择 `browser-extension` 文件夹

**Firefox:**
- 打开 `about:debugging#/runtime/this-firefox`
- 点击"临时加载附加组件"
- 选择 `browser-extension/manifest.json`

### 使用插件

1. **点击浏览器工具栏中的插件图标** 📝
2. **选择功能模块：**
   - ✍️ 写作
   - 🎨 去AI味
   - 📥 导入
   - 👀 预览

3. **开始写作！**

## 📖 使用场景

### 场景1：写学习笔记

```
1. 点击"开始新文章"
2. 回答AI的引导问题，确定核心观点
3. 设计文章大纲
4. 逐章完成内容
5. 应用去AI味优化
6. 导出到markdownnice，发布到公众号
```

### 场景2：整理AI对话

```
1. 复制与AI的对话内容
2. 点击"导入" → "导入AI对话"
3. 粘贴内容
4. AI帮你提取关键观点
5. 整理成结构化文章
```

### 场景3：网页内容摘录

```
1. 浏览到感兴趣的文章
2. 选中想要摘录的文本
3. 右键 → "导入选中内容到写作助手"
4. 内容自动添加到你的文章中
```

## 📝 写作方法论

本插件基于以下写作原则：

### 核心理念
- **协作式写作**：AI提问 + 用户思考
- **结构化表达**：定义 → 图解 → 思考
- **去AI味**：自然、有个性的表达

### 文章结构
```
## 00 引言
- 写作动机
- 本文目标

## 01-0N 核心内容
### X.1 定义/定理
### X.2 图解/直觉
### X.3 小结

## 总结与思考
- 本文总结
- 个人感悟
```

详细方法论请参考 `original_files/` 目录中的文档。

## 🛠️ 技术栈

- **Manifest V3** - Chrome Extension API
- **Vanilla JavaScript** - 无框架依赖
- **Chrome Storage API** - 本地数据存储
- **Content Scripts** - 网页内容交互

## 📂 原始文件说明

`original_files/` 目录保存了创建此插件的理论基础：

- **SKILL.md** - 完整的协作式写作流程
- **anti-ai-style.md** - 详细的去AI味指南
- **writing_patterns.md** - 各种写作模式参考
- **outline_template.md** - 文章大纲模板

这些文件包含了丰富的写作方法论和最佳实践。

## 🔒 隐私保护

- ✅ 所有数据仅存储在浏览器本地
- ✅ 不上传任何内容到服务器
- ✅ 不收集用户信息
- ✅ 完全离线可用

## 📋 更新日志

### v1.0.0 (2026-02-15)

初始版本：
- ✅ 完整的四步写作流程
- ✅ AI味检测与优化
- ✅ 多种内容导入方式
- ✅ 文章预览与导出
- ✅ 自动保存功能
- ✅ 右键菜单集成

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 开发指南

1. Fork此仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📮 联系方式

- GitHub: [@martinhamburger](https://github.com/martinhamburger)
- Issues: [提交问题](https://github.com/martinhamburger/xiegongzhonghao/issues)

## 🙏 致谢

感谢所有为公众号写作方法论做出贡献的朋友们！

---

**让写作更高效，让内容更有价值！** ✨📝
