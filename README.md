# 校园后勤管理系统

## 项目介绍

校园后勤管理系统是一个基于 Vue 3 + Vite + Element Plus + Tailwind CSS + ECharts 开发的现代化管理平台，用于高效管理校园后勤人员、设备维修、资产管理等工作。系统提供了直观的数据可视化界面，帮助管理人员实时掌握校园后勤工作状态，提高工作效率。

## 功能特点

- **人员管理**：管理后勤人员信息，包括后勤管理员、维修工程师、安保人员和临时工
- **维修工单**：记录和跟踪校园设施维修工单，包括申请、处理、完成等全流程管理
- **数据分析**：通过图表直观展示维修类型分布、人员工作量、满意度评价等数据
- **设备资产**：管理校园设备资产，记录设备价值、使用状态和维护记录
- **系统设置**：灵活配置系统参数，满足不同校园的个性化需求

## 技术栈

- **前端框架**：Vue 3 + Vue Router
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **CSS 框架**：Tailwind CSS
- **图表库**：ECharts
- **HTTP 客户端**：Axios
- **数据模拟**：Mock 数据服务

## 项目结构

```
├── public/             # 静态资源
├── src/
│   ├── assets/         # 项目资源文件
│   ├── components/     # 通用组件
│   │   └── charts/     # 图表组件
│   ├── layouts/        # 布局组件
│   ├── mocks/          # 模拟数据
│   ├── router/         # 路由配置
│   ├── services/       # API 服务
│   ├── styles/         # 全局样式
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .gitignore          # Git 忽略文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖
├── vite.config.js      # Vite 配置
└── README.md           # 项目说明
```

## 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

开发服务器将在 http://localhost:3000 启动

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm build
```

### 预览生产构建

```bash
# 使用 npm
npm run preview

# 或使用 pnpm
pnpm preview
```

## 性能优化

项目已进行以下性能优化：

### 前端构建优化

1. **代码分割 (Code Splitting)**
   - 将第三方库（Vue、Element Plus、ECharts）单独打包
   - 使用 `manualChunks` 配置分割大型依赖
   - 减少首屏加载时间，提高缓存效率

2. **路由懒加载 (Lazy Loading)**
   - 所有路由组件采用动态导入，按需加载
   - 使用 `import()` 语法实现组件延迟加载
   - 减少初始包体积，加快首屏渲染时间

3. **资源压缩 (Resource Compression)**
   - 使用 Terser 对 JavaScript 进行压缩和混淆
   - 启用 Gzip 压缩，显著减少文件传输大小
   - 移除生产环境中的 console 和 debugger 语句

4. **Tree Shaking**
   - 自动移除未使用的代码，减小最终打包体积
   - 使用 ESM 模块系统，支持更好的静态分析
   - Element Plus 组件按需导入，避免全量引入

5. **缓存优化 (Caching)**
   - 使用基于内容哈希的文件名，优化浏览器缓存
   - 分离不经常变化的依赖库代码，提高缓存命中率
   - 使用 `assetFileNames` 配置优化静态资源缓存

### 构建分析

项目集成了 `rollup-plugin-visualizer` 工具，可以生成可视化的构建分析报告：

```bash
# 运行构建分析
$ npm run analyze
# 或
$ pnpm analyze
```

这将生成一个 `stats.html` 文件，其中包含了所有打包模块的大小和依赖关系的可视化图表。

### 其他优化措施

1. **别名配置**：使用 `@` 别名简化导入路径
2. **CSS 代码分割**：启用 CSS 代码分割，按需加载样式
3. **块大小警告限制**：调整块大小警告限制为 1000KB

### 未来优化方向

1. **图片优化**：使用 WebP 格式或实现响应式图片加载
2. **组件预加载**：对关键路由使用 `<link rel="prefetch">` 预加载
3. **服务端渲染 (SSR)** 或 **静态站点生成 (SSG)**：如果需要更好的 SEO 和首屏性能
4. **Web Worker**：将复杂计算移至后台线程

## 浏览器兼容性

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

Engineering development
