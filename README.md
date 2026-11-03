# 萌兽渔港 · 联网版

带着动物船队钓鱼、经营港口、收藏观赏鱼，并拜访其他船长的水族馆。

- 游戏入口：https://yaozhiweiff.github.io/animal-harbor-online/
- GitHub：https://github.com/yaozhiweiff/animal-harbor-online
- 联网接口：独立的 Cloudflare Worker + D1，与旧作 Royal Gems 使用相同部署方式。

## 玩家账号

进入游戏后注册船长名称和密码。名称不可重复（全角字符统一转换，英文字母不区分大小写），名称为 2～16 位中英文、数字、下划线或短横线，密码为 8～128 位。账号用于恢复云端航程，不要求 GitHub 或 ChatGPT 账号。

界面显示当前渔获产值/秒及历史最高峰值。排行榜展示最高峰值的前十名；自己的水族馆开放后，可以从排行榜或水族馆入口拜访已开放水族馆的船长，也可以随机拜访。拜访界面展示对方的布景、展出鱼、最高重量和奖章，不会修改自己的鱼或进度。

水族馆入口在未解锁时也显示，点击可定位到解锁研究；解锁深潜浮漂后可免费研究开放。赤狐每次招募费用为原数值的10倍，前三次分别为24,000、36,000、54,000金币。

## 存档与网络

游戏模拟、产出、QTE、奖励与峰值计算全部在玩家设备执行。服务器不复算或验证游玩过程；排行榜采用客户端上报的历史峰值，并保留账号历史最大值。

本机约每 5 秒暂存航程，云端每 60 秒同步有变化的完整存档；打开排行榜、拜访、立即同步及退出登录时会主动保存。页面隐藏或关闭时尝试保存，异常断网时保留本机副本。浏览器支持时上传使用 gzip 压缩，不传输逐次点击或逐帧事件。换设备前建议点击账号中的“立即同步”。

多设备同时游玩时使用存档版本号阻止静默覆盖，出现冲突会暂停游戏，让玩家选择继续本机或云端航程。密码采用独立盐的 PBKDF2-SHA256 哈希；GitHub Pages 使用独立的浏览器会话凭据，不依赖第三方 Cookie，数据库只保存会话令牌哈希。同域部署继续使用 HttpOnly Cookie。拜访接口仅公开船长名称、峰值、同步时间和水族馆展示资料，不返回完整存档。

## 项目结构

- `public/game/`：完整游戏、数据与美术资源；`runtime-config.js` 启用账号登录。
- `lib/harbor-api.mjs`：账号、压缩云存档、排行榜及只读水族馆接口。
- `backend/worker.mjs`、`backend/wrangler.jsonc`、`backend/migrations/`：独立 Worker 和 D1 配置、数据库迁移。
- `scripts/prepare-pages.mjs`、`.github/workflows/pages.yml`：生成 Pages 资源并发布，前端不携带 Cloudflare 或 GitHub 的访问密钥。
- `app/`、`db/`、`drizzle/`、`.openai/hosting.json`：保留首次 Sites 部署的源码和标识。
- `tests/`：使用本机 SQLite 的接口回归测试，不连接公网数据库。

## 本地运行

需要 Node.js 24、npm 和 Git。

```sh
npm ci
npm test
npx wrangler d1 migrations apply DB --local --config backend/wrangler.jsonc
npx wrangler dev --config backend/wrangler.jsonc --compatibility-date 2026-10-26 --port 8773
# 另一个终端：
# HARBOR_API_URL=http://127.0.0.1:8773 node scripts/prepare-pages.mjs
# 使用任意静态HTTP服务在127.0.0.1:8772提供.pages-dist目录
```

本机兼容日期参数用于匹配项目固定的 workerd 版本；生产配置保留2026-11-03。使用终端打印的本机地址打开游戏。数据库和运行状态位于忽略的 `.wrangler/` 目录；本机测试账号不会随源码发布。公网前端由 GitHub Pages 托管，存档持久保存在独立 D1 中。

发布后端使用已有的本机 Wrangler 授权：`npx wrangler d1 migrations apply DB --remote --config backend/wrangler.jsonc`，再执行 `npx wrangler deploy --config backend/wrangler.jsonc`。部署命令前确认目标账号和数据库；本项目不会复用或修改 Royal Gems 的数据库。推送 main 后由 GitHub Actions 发布前端。

首次 Sites 入口仍保留。两个后端的数据独立；如已经在首次入口游玩，可以在旧入口导出航程，再到新入口登录并导入航程。离线旧存档同样可导入。

`scripts/sync-game.mjs` 用于当前开发工作区从相邻的 `../fishing-cats` 同步游戏资源；GitHub 仓库已包含完整的 `public/game`，独立克隆后可直接构建，无需运行同步脚本。修改独立后端数据库时向 `backend/migrations/` 追加迁移，不修改已经发布的迁移文件。

## 校验

首次发布已完成 85 项模拟及接口测试、20 项联网浏览器检查，并检查桌面和手机的登录、峰值排行、水族馆拜访及跨设备存档冲突。旧挖土版本与离线游戏保留在原开发目录中。
