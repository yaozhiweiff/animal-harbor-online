# 萌兽渔港 · 联网版

带着动物船队钓鱼、经营港口、收藏观赏鱼，并拜访其他船长的水族馆。

- 游戏入口：https://animal-harbor-yaozhiweiff.onemtkcdesigner.chatgpt.site
- GitHub：https://github.com/yaozhiweiff/animal-harbor-online

## 玩家账号

进入游戏后注册船长名称和密码。名称不可重复（全角字符统一转换，英文字母不区分大小写），名称为 2～16 位中英文、数字、下划线或短横线，密码为 8～128 位。账号用于恢复云端航程，不要求 GitHub 或 ChatGPT 账号。

界面显示当前渔获产值/秒及历史最高峰值。排行榜展示最高峰值的前十名；自己的水族馆开放后，可以从排行榜或水族馆入口拜访已开放水族馆的船长，也可以随机拜访。拜访界面展示对方的布景、展出鱼、最高重量和奖章，不会修改自己的鱼或进度。

## 存档与网络

游戏模拟、产出、QTE、奖励与峰值计算全部在玩家设备执行。服务器不复算或验证游玩过程；排行榜采用客户端上报的历史峰值，并保留账号历史最大值。

本机约每 5 秒暂存航程，云端每 60 秒同步有变化的完整存档；打开排行榜、拜访、立即同步及退出登录时会主动保存。页面隐藏或关闭时尝试保存，异常断网时保留本机副本。浏览器支持时上传使用 gzip 压缩，不传输逐次点击或逐帧事件。换设备前建议点击账号中的“立即同步”。

多设备同时游玩时使用存档版本号阻止静默覆盖，出现冲突会暂停游戏，让玩家选择继续本机或云端航程。密码采用独立盐的 PBKDF2-SHA256 哈希；登录会话使用 HttpOnly Cookie，数据库只保存会话令牌哈希。拜访接口仅公开船长名称、峰值、同步时间和水族馆展示资料，不返回完整存档。

## 项目结构

- `public/game/`：完整游戏、数据与美术资源；`runtime-config.js` 启用账号登录。
- `lib/harbor-api.mjs`：账号、压缩云存档、排行榜及只读水族馆接口。
- `app/api/harbor/[...path]/route.ts`：Cloudflare Worker API 路由。
- `db/schema.ts`、`drizzle/`：D1 数据库定义与版本化迁移。
- `.openai/hosting.json`：Sites 项目与 D1 绑定配置。
- `tests/`：使用本机 SQLite 的接口回归测试，不连接公网数据库。

## 本地运行

需要 Node.js 22.13 或更高版本、npm 和 Git。

```sh
npm ci
npm test
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_rich_titanium_man.sql
npm start
```

上面的首次迁移命令只对新建的本机数据库执行一次。使用终端打印的本机地址打开游戏。数据库和运行状态位于忽略的 `.wrangler/` 目录；本机测试账号不会随源码发布。构建与部署使用 Sites 管理的 Cloudflare Worker 和 D1，部署时应用 `drizzle/` 中的数据库迁移。公网存档持久保存在 D1 中。

`scripts/sync-game.mjs` 用于当前开发工作区从相邻的 `../fishing-cats` 同步游戏资源；GitHub 仓库已包含完整的 `public/game`，独立克隆后可直接构建，无需运行同步脚本。修改数据库后用 `npm run db:generate` 追加迁移，不修改已经发布的迁移文件。

## 校验

首次发布已完成 85 项模拟及接口测试、20 项联网浏览器检查，并检查桌面和手机的登录、峰值排行、水族馆拜访及跨设备存档冲突。旧挖土版本与离线游戏保留在原开发目录中。
