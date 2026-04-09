# 极简音乐播放器 (Minimalist Music Player)

一个基于 React 18 + Vite + Tailwind CSS 构建的现代、沉浸式音乐播放器。

## 🌟 项目简介

本项目是一个功能丰富的 Web 音乐播放器，旨在提供流畅的听歌体验。它支持本地音乐文件的元数据解析、歌词同步显示、播放列表管理以及个性化的 UI 交互。

## ✨ 主要功能

- **音乐库管理**：
  - 自动解析音乐文件的 ID3 标签（封面、艺术家、专辑）。
  - 支持一键定位当前播放歌曲（GPS 浮动图标）。
  - 歌曲搜索与过滤。
- **沉浸式歌词页**：
  - 支持 LRC 歌词解析与实时滚动高亮。
  - 紧凑型布局，美化的专辑封面展示。
  - 完整的播放控制（播放/暂停、切歌、播放模式、音量调节）。
  - 实时播放队列查看。
- **播放列表**：
  - “我喜欢的音乐”自动收集。
  - 支持创建和管理自定义播放列表。
- **播放记忆与历史**：
  - **播放记忆**：自动记录上次播放的歌曲、进度、音量及播放模式，下次打开自动恢复。
  - **播放历史**：记录最近播放的 50 首歌曲，支持快速回听。
- **交互体验**：
  - 响应式设计，适配桌面与移动端。
  - 优雅的动画效果（基于 Framer Motion）。
  - 实时音量百分比显示与拖拽调节。

## 🚀 快速开始

### 环境要求

- Node.js (建议版本 18.x 或更高)
- npm 或 yarn

### 运行步骤

1. **克隆项目**
   ```bash
   git clone <project-url>
   cd react-example
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   - **Web 端**: `npm run dev` (访问 `http://localhost:3000`)
   - **桌面端 (Electron)**: `npm run electron:dev` (启动桌面窗口)

## 📦 打包与部署

### 项目打包

运行以下命令进行生产环境打包：

```bash
npm run build
```

**注意**：根据项目配置，打包产物将输出到项目根目录的 **`docs`** 文件夹中。

### Web 端部署
由于打包输出目录设置为 `docs`，该项目非常适合部署到 **GitHub Pages**：
1. 将代码推送到 GitHub 仓库。
2. 进入仓库的 **Settings > Pages**。
3. 在 **Build and deployment > Branch** 下，选择你的主分支（如 `main` 或 `master`）。
4. 将文件夹路径设置为 **`/docs`**。
5. 保存后，GitHub 将自动部署该目录下的内容。

### 桌面端打包 (多平台)
运行以下命令进行跨平台桌面应用打包：
```bash
npm run electron:build
```
产物将生成在 **`dist_electron`** 文件夹中，支持：
- **macOS**: `.dmg`, `.zip`
- **Windows**: `.exe` (安装程序), `.zip`
- **Linux**: `.AppImage`, `.deb`

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **音频处理**: Howler.js
- **元数据解析**: music-metadata-browser
- **桌面框架**: Electron
- **图标**: Lucide React

## 📄 许可证

本项目采用 MIT 许可证。
