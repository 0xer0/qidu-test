# 默契度测试 · 你们到底有多懂对方

一个「双人互猜」小游戏：你出 10 道题先答自己、再猜对方；把链接甩给朋友，TA 也答两轮，系统算出你们的默契度。

**线上地址：<https://0xer0.github.io/qidu-test/>**

- 单文件 `index.html`，66 KB（gzip 24 KB），零后端、零外部请求、零依赖 CDN
- 不用注册、不用登录、不写数据库：**两份答案被压缩进链接本身**
- 邀请链接 22 个字符的载荷，结果链接 58 个字符 → 二维码好扫、微信里好发
- 三套题库：好友局 / 情侣局 / 室友同事局
- 出分后有分数环、逐题对照、可保存的 Canvas 战绩图（含二维码）

---

## 玩法（为什么没有服务器也能算出两个人的分）

```
你   → 答 10 题（关于你自己）→ 再答 10 题（猜 TA 会选什么）
        ↓ 你的 20 个答案被打包成链接
朋友 → 打开链接 → 答 10 题（关于 TA 自己）→ 再答 10 题（猜你会选什么）
        ↓ TA 的答案 + 你的答案 → 本地算出默契度 → 生成「结果链接」
你   → 点开结果链接 → 看到同一个分数
```

默契度 = （你猜中 TA 的比例 + TA 猜中你的比例）÷ 2。旁边还会给一个「你们有多像」的相似度。

链接长这样：

```
https://0xer0.github.io/qidu-test/#p=AQIABumYv-axpOTk5OTkGg     ← 邀请
https://0xer0.github.io/qidu-test/#r=AgIABumYv-axpOTk5OTkBuWwj… ← 结果
```

`#` 后面的内容**永远不会发给服务器**（浏览器规范如此），所以答案实际上只存在于你们俩的手机里。编码是 `type|ver|题库|昵称|2bit/题 紧凑位打包|CRC8`，损坏的链接会被 CRC 拦下来提示重新出题。

---

## 本地跑

```bash
cd qidu-web
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765/index.html
```

也可以直接双击 `index.html`。注意用 `file://` 打开时生成的链接只有本机能用，要发给朋友必须先部署。

---

## 部署（都免费）

### 1. GitHub Pages —— 已经在跑

```bash
cd qidu-web
python3 build.py                      # 改完源码先重新打包
git add -A && git commit -m "update"
git push                              # 1 分钟后自动生效
```

### 2. Cloudflare Pages —— 国内朋友更容易打开

1. 打开 <https://dash.cloudflare.com/> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. 把 `index.html` 和 `og.png` 拖进去，点 Deploy
3. 得到 `https://xxx.pages.dev`，不用改任何配置

改完内容重新拖一次即可，也可以在 Pages 里连上这个 GitHub 仓库走自动构建（Build command 留空，输出目录填 `/`）。

### 3. Netlify Drop —— 最省事

把 `qidu-web` 文件夹拖到 <https://app.netlify.com/drop>，立刻得到 `https://xxx.netlify.app`。

### 用自己的服务器 / 对象存储

就一个静态文件，扔进 nginx 根目录、阿里云 OSS、腾讯云 COS 的静态网站托管都行。注意挂 HTTPS（微信内置浏览器对 http 页面会拦）。

### 国内访问怎么选

| 托管 | 上线速度 | 国内可达性 | 备注 |
| --- | --- | --- | --- |
| GitHub Pages | 立即 | 时好时坏 | 已部署好，适合先跑通 |
| Cloudflare Pages | 2 分钟 | 多数地区可直连，速度一般 | 个人最推荐 |
| Netlify | 1 分钟 | 一般可用 | 拖拽最省事 |
| 国内 OSS/COS + 备案域名 | 需要备案 | 最快 | 想长期给很多人玩再考虑，几十块/年 |

三家的域名在微信里点开都能正常用。想让群里发的链接显示卡片图，把 `index.html` 里的 `og:image` 改成你域名的绝对地址（例如 `https://xxx.pages.dev/og.png`）。

---

## 改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 题目、选项、emoji | `src/app.js` 顶部的 `DECKS`（每题 4 个选项，会自动适配） |
| 等级称号与评语 | `src/app.js` 的 `tierOf()` |
| 首页文案、按钮、配色 | `src/app.html`（`:root` 里是配色变量） |
| 战绩图排版 | `src/app.js` 的 `makePoster()` |

改完执行：

```bash
python3 build.py     # 把 src/ 拼成单文件 index.html
```

`build.py` 会检查内联内容里有没有 `</script` 这种会截断 HTML 的字符串。

---

## 目录

```
qidu-web/
├── index.html          ← 产物：唯一需要部署的文件（含 CSS/JS/二维码库）
├── og.png              ← 微信/推特分享卡图 1200×630
├── build.py            ← 把 src/ 拼成 index.html
├── src/
│   ├── app.html        ← 结构 + 全部样式
│   ├── app.js          ← 题库、编码、计分、视图、海报
│   └── qrcode.min.js   ← 二维码库（MIT，qrcode-generator 压缩版）
└── tests/
    └── e2e.py          ← Playwright 端到端：两个人各自 20 题 + 两端对分
```

## 测试

```bash
python3 -m http.server 8765 &      # 先起本地服务
python3 tests/e2e.py               # 截图输出到 tests/shots/
```

覆盖：出题人 20 题 → 分享页二维码 → 换浏览器当朋友答 20 题 → 结果页 → 海报下载 → 出题人打开结果链接复核分数一致 → 桌面端渲染 → 控制台零报错。

## 隐私

没有埋点、没有 cookie、没有第三方请求。唯一的本地存储是 `localStorage` 里的昵称和最近战绩，清掉浏览器数据即消失。

二维码库来自 [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)（MIT），已内联压缩，页面不加载任何外部资源。
