# 💼 工作性价比计算器

![React](https://img.shields.io/badge/React-18.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Powered by Kimi](https://img.shields.io/badge/AI-Moonshot%20Kimi-20b2aa)

**工作性价比计算器** 是一个基于 AI 的智能评估工具。默认使用 **Kimi (Moonshot AI)** 模型进行深度分析。

它不仅仅关注薪资，而是结合了用户的学历、工龄、通勤时长、工作压力、福利待遇以及团队氛围等多维度数据，计算出真实的“打工性价比”得分，并提供客观评价与“毒舌”吐槽。

---

## ✨ 核心功能

- **📊 多维雷达图**: 可视化展示薪资、时长、通勤、城市、发展五个维度的得分。
- **🎭 双重语态**: 提供“客观评价”和“毒舌锐评”两种分析模式。
- **🌗 深色模式**: 完美适配日间/夜间模式。
- **📸 结果分享**: 一键生成精美报告图片。

---

## 🛠️ 快速部署

### 1. 准备工作

你需要一个 **Moonshot (Kimi)** 的 API Key。
- 前往 [Moonshot AI 开放平台](https://platform.moonshot.cn/)
- 注册/登录并创建 API Key。
- 新用户通常有免费额度，足够个人使用。

### 2. 获取代码

```bash
git clone https://github.com/your-username/job-value-calculator.git
cd job-value-calculator
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量 (关键步骤)

在项目根目录创建一个 `.env` 文件（不要包含在 git 提交中），内容如下：

```env
# 必须配置：你的 Kimi API Key
API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 可选配置：如果你想用其他兼容 OpenAI 格式的 API (如 DeepSeek, GPT-4o 等)
# API_BASE_URL=https://api.moonshot.cn/v1
# API_MODEL=moonshot-v1-8k
```

> **注意**：Vite 在本地开发时会自动读取 `.env` 文件。

### 5. 启动项目

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可使用。

---

## 📦 生产环境构建

```bash
npm run build
```

构建生成的 `dist` 目录可部署到任何静态托管服务（如[Vercel](https://vercel.com/)

**在 Vercel 上部署:**
1. 导入项目。
2. 在 Settings -> Environment Variables 中添加：
   - Key: `API_KEY`
   - Value: `你的_sk_key`
3. 部署即可。

---

## 🧩 自定义 API (进阶)

本项目使用了标准的 OpenAI 接口格式，因此理论上支持所有兼容 OpenAI 协议的大模型（如 DeepSeek, Yi, Qwen 等）。

只需在 `.env` 中修改：

```env
API_KEY=你的API KEY
API_BASE_URL=API地址
API_MODEL=模型名称
```

---

## 📄 协议

MIT License. 

###本项目仅供娱乐与参考，请理性看待职业发展。


除了这一行之外，其他的均由Google Gemini 3 Preview完成
