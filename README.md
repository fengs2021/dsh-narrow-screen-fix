# dsh-narrow-screen-fix

> Unified narrow-screen (mobile) CSS adaptation for the DeepSeek Harness web GUI. One client-only plugin fixes the overflow/overlap issues that plague the UI on phones — question-card footers, the send button, the top tab bar, settings panels, model/permission selectors, SSH panel tabs. **No dsh sources are touched.**
>
> DSH Web GUI 窄屏（手机）适配**统一插件**（纯 client 覆盖样式，不改 dsh 源码）。一个插件解决手机端所有常见的溢出/重叠问题。

---

## English

### What it fixes

| Component (style tag) | Fix (all under `max-width: 768px`) |
|---|---|
| `ui-user-questions` QuestionComposer | question-card footer wraps; action row (skip + confirm) becomes full-width right-aligned |
| `ui-user-questions` PlanReviewPanel | same footer treatment for the plan-review buttons |
| `ui-conversation` InputBar | bottom row wraps; trailing (model select + meter + send) takes its own right-aligned row; send button inset via 36px right padding |
| `ui-conversation` ConversationRoot | top tab bar horizontally scrollable (hidden scrollbar), tabs never shrink; header/title row wraps, crumbs cap at 130px, header actions take their own row |
| `ui-settings-general` SettingsRoot | settings panel stacks vertically (full-width bottom sheet, 88vh, rounded top), side nav scrolls internally, content adapts |
| `ui-directory-picker-browse` DirectoryBrowser | directory columns relax their min-width |
| `ui-model-selection` ModelSelect | trigger caps at 140px so the input row fits; **dropdown menu is re-anchored to a bottom-sheet on phones** — `position:fixed; left:8px; right:8px; bottom:8px; max-height:65vh; transform:none`. The default CSS (`position:absolute; right:0`) hangs the menu off the trigger's right edge in the composer's right-aligned trailing row, extending ~240px to the LEFT — completely off-screen on a 360px phone. The bottom-sheet pattern (1) is fully visible, (2) is fully interactive, (3) requires no JS to work — UX mirrors native iOS ActionSheet. Pure-CSS keeps the menu a child of `_7KE1Ra_root` so the model's own `closeOutside` / `onBlur` handlers (which gate on `rootRef.contains(target)`) keep working — clicks inside the menu are correctly treated as "inside the menu", which is what enables the second-level pane (model list / effort level) to open. |
| `PermissionSelect` | trigger caps at 140px so the input row fits |
| `@linxin666/dsh-ssh` panel | SSH panel tab bar horizontally scrollable |
| `dsh-session-log-export` | Session log button shrinks (28px, tight padding) to sit inline with alias/copy buttons |
| `dsh-client-ui-agent-preset` | preset row description releases its 48px reservation so Chinese text wraps normally |

### Mechanism

- **Static CSS**: the plugin injects a dedicated `<style>` block with known-hash class names + `!important` — always lands, zero dependencies
- **Dynamic path**: it also locates each component's own injected `<style>` tag, extracts the *live* CSS-module class names (suffix regex), and appends the same rules — survives a dsh upgrade that re-hashes class names
- **Fallback**: if a component style tag never appears within 20s, the static rules already cover it
- **JS path (model menu)**: none — the bottom-sheet layout is fully CSS. Earlier versions included a JS helper that reparented the menu to `<body>`; that broke the model's own `closeOutside` (`if (!rootRef.current?.contains(event.target)) setOpen(false)`) and `onBlur` handlers — both gate on `rootRef.contains(target)`, so once the menu was detached from the root, clicks inside the menu were treated as outside-click and the menu closed immediately. The fix: pure CSS bottom-sheet, no JS reparenting.
- Pure browser-side: no host code, no routes, no file writes

### Install

```bash
dsh plugin --profile web add github:fengs2021/dsh-narrow-screen-fix
systemctl restart dsh-web   # or hot-mount via dev tools (no restart)
```

Then hard-refresh the page (Ctrl+Shift+R / incognito) and open it on a phone.

### Notes

- Replaces the earlier split plugins `dsh-question-footer-fix`, `dsh-composer-send-fix`, `dsh-nav-tabs-scroll-fix` — uninstall those if you had them
- Rules are additive and idempotent; duplicates are harmless

## 中文

### 修复矩阵（全部 @media (max-width:768px) 生效）

| 组件（style 标签标识） | 修复 |
|---|---|
| ui-user-questions `QuestionComposer` | 提问弹窗 footer 换行；操作栏整行右对齐（跳过+确认完整显示） |
| ui-user-questions `PlanReviewPanel` | 计划审查面板 footer 换行；按钮组右对齐 |
| ui-conversation `InputBar` | 输入条底行换行；trailing（模型选择+用量+发送）独占一行右对齐；发送按钮内移（右 padding 36px） |
| ui-conversation `ConversationRoot` | 顶部标签栏横向可滑动（隐藏滚动条）、tab 不收缩；标题行可换行、面包屑 130px 截断、按钮组独占一行 |
| ui-settings-general `SettingsRoot` | 设置面板纵向堆叠（底部弹层式：全宽、88vh、上圆角）、侧导航内滚、内容区自适应 |
| ui-directory-picker-browse `DirectoryBrowser` | 目录列 min-width 放宽 |
| ui-model-selection `ModelSelect` | 选择器收窄到 140px；**菜单改为底部弹层（bottom-sheet）风格**——`position:fixed; left:8px; right:8px; bottom:8px; max-height:65vh`。原 `position:absolute; right:0` 在 trigger 右下角会向左溢出屏幕。新方案永远可见、完全可交互、不依赖 JS（UX 类似 iOS ActionSheet）。纯 CSS 保持菜单作为 `_7KE1Ra_root` 的子节点，模型的 `closeOutside`/`onBlur`（基于 `rootRef.contains(target)`）继续正常判断菜单内点击——保证二级面板（模型列表 / 推理等级）能正确打开 |
| PermissionSelect | 选择器收窄到 140px，输入行放得下 |
| @linxin666/dsh-ssh 面板 | SSH 标签栏横向可滑动 |
| dsh-session-log-export | Session log 按钮缩小（28px 紧凑内边距），与别名/复制按钮同排 |
| dsh-client-ui-agent-preset | 预设行说明文字释放 48px 预留，中文正常断行 |

### 机制

- **静态 CSS**：注入独立 `<style>` 块（已知 hash 类名 + `!important`）——必然生效，零依赖
- **动态路径**：定位组件自身注入的 style 标签，**动态提取**当前 CSS-module 类名（后缀正则）追加同款规则——DSH 升级导致 hash 变化时自动适配
- **兜底**：组件 style 标签 20s 内未出现时，静态规则已覆盖
- **JS 路径（模型菜单）**：无。bottom-sheet 布局完全靠 CSS。早期版本包含一个 reparent 到 `<body>` 的 JS 助手——但模型组件自己的 `closeOutside`（`if (!rootRef.current?.contains(event.target)) setOpen(false)`）和 `onBlur` 处理器都基于 `rootRef.contains(target)` 做判断，reparent 后菜单脱离了 root，菜单内点击被误判为外部点击，立即关闭菜单导致二级面板无法打开。修复：纯 CSS bottom-sheet，不做 reparent。
- 纯浏览器侧：无 host 代码、无路由、无文件写入

### 安装

```bash
dsh plugin --profile web add github:fengs2021/dsh-narrow-screen-fix
systemctl restart dsh-web   # 或 dev 工具热装配（免重启）
```

安装后**硬刷新**（Ctrl+Shift+R / 无痕窗口），手机端打开查看效果。

### 说明

- 替代早期分散方案 `dsh-question-footer-fix`、`dsh-composer-send-fix`、`dsh-nav-tabs-scroll-fix`（装过的请卸载）
- 规则均为追加式、幂等，重复注入无害

## License

MIT