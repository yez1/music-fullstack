# 网易云音乐 Web 项目讲解（Slide Spec）

> 适用：10 分钟 / 10 页左右的技术讲解。  
> 你可以先把 `netease-music-web-outline.txt` 粘贴到 PowerPoint/Keynote 生成初稿，然后按本表补充截图与讲稿。

| 页 | 标题 | 这一页要让人记住 | 内容要点（建议 ≤6 行） | 视觉/素材建议 | 讲解要点（30–60s） |
|---:|---|---|---|---|---|
| 1 | 网易云音乐 Web 项目讲解 | 一句话说明项目做了什么 | 目标：复刻“发现 → 点歌 → 播放 → 歌词同步”主链路<br/>技术：React+TS+Redux+Router+Axios | 放 1 张应用主界面截图（推荐页 + 底部播放器） | 先说范围：这是前端项目，核心体验是推荐浏览和播放闭环。 |
| 2 | 目录 / Agenda | 接下来怎么讲 | 目标与范围<br/>技术栈与结构<br/>路由组织<br/>请求+状态管理<br/>播放器+歌词<br/>总结与优化 | 简单目录列表即可 | 说明今天重点：架构与关键实现，不展开所有 UI 细节。 |
| 3 | 项目目标 & 核心功能 | “用户能做什么” | 页面：Discover(推荐/榜单/歌单/…)+Mine/Focus/Download<br/>推荐：Banner/热门/新碟/榜单<br/>播放：上一首/暂停/下一首/进度拖拽/播放模式<br/>歌词：同步提示 | 右侧放功能点 icon 或小截图拼图 | 用 30s 走一次用户路径：打开推荐页→点榜单歌曲→底栏播放→歌词同步。 |
| 4 | 技术栈 & 工程化 | 用了哪些关键库以及为什么 | React 19 + TS（类型约束）<br/>Router v7（懒加载）<br/>Redux Toolkit（共享状态）<br/>Axios 封装（统一请求）<br/>Antd + styled-components（UI&样式）<br/>CRA + CRACO（构建/扩展） | 放依赖 Logo（可选） | 强调：选型围绕“可维护 + 快速搭建 + 组件化”。 |
| 5 | 页面结构 & 路由 | “怎么从页面跳到页面” | 布局：Header + Main + Footer + PlayerBar<br/>路由：/discover 下多子路由<br/>lazy + Suspense：按需加载页面 | 画一个简单路由树（文本/图均可） | 指一下代码入口：`src/router/index.tsx` 和 `src/App.tsx`。 |
| 6 | 目录结构（怎么找代码） | 让听众知道代码在哪 | `src/views`：页面级模块<br/>`src/components`：通用组件<br/>`src/service`：请求封装<br/>`src/store`：Redux Store 与 hooks<br/>`src/utils`：工具（歌词/格式化） | 放一张目录树截图（IDE 左侧） | 强调边界：页面 → 业务组件 → store/service → utils。 |
| 7 | 请求层：HYRequest（Axios 封装） | 请求如何统一管理 | axios.create(baseURL/timeout)<br/>response 拦截器：返回 res.data<br/>业务接口：banner/personalized/album/playlist/song/lyric | 放数据流小图：UI → thunk → service → HYRequest → API | 解释好处：页面不关心 axios 细节，统一处理错误/鉴权。 |
| 8 | 状态管理：Redux Toolkit 数据流 | “数据从哪来，怎么到 UI” | store 组合 recommend/player<br/>createAsyncThunk 拉取数据<br/>reducer 写入 state<br/>useSelector 自动刷新 UI | 画数据流图（箭头） | 用推荐页举例：useEffect dispatch → banners 进 store → TopBanner 渲染。 |
| 9 | 播放器：AppPlayerBar | 播放控制如何实现 | 常驻底栏 + `<audio>`<br/>切歌：重置 → 请求 url → play<br/>进度：onTimeUpdate → Slider<br/>模式：顺序/随机/单曲 | 建议录屏 5–10 秒：点歌→播放→拖进度→切模式 | 重点讲“稳定播放体验”：切歌先清歌词/重置进度，失败回退本地音频。 |
| 10 | 歌词：解析与同步 + 总结 | “亮点：歌词同步” + 收尾 | parseLyric 解析 LRC + offset<br/>过滤元信息行、异常时间戳处理<br/>二分查找匹配当前行<br/>可优化：baseURL 读取 env、歌单面板、滚动歌词、完善类型 | 画一个“时间轴→歌词行”的示意图 | 以体验收尾：从功能到实现闭环；最后抛出可扩展点并进入 Q&A。 |

