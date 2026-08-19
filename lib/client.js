/**
 * dsh-narrow-screen-fix browser half — unified mobile CSS adaptation.
 *
 * Replaces: dsh-question-footer-fix, dsh-composer-send-fix, dsh-nav-tabs-scroll-fix.
 *
 * Every fix follows the same pattern: locate the component's own injected
 * <style> tag (by `data-plugin-css` substring, or by class-name probe for
 * third-party bundles), extract the live CSS-module class names (suffix
 * regex), and append an override rule inside `@media (max-width:768px)`.
 * Class names are read from the tag's current text, so the patch survives a
 * dsh upgrade that re-hashes CSS-module names (known hashes are fallbacks).
 *
 * Fix matrix (all under 768px):
 *  - ui-user-questions QuestionComposer : footer wraps, actions row full-width right-aligned
 *  - ui-user-questions PlanReviewPanel  : same footer treatment
 *  - ui-conversation InputBar           : bottom row right padding 36px (send button inset)
 *  - ui-conversation ConversationRoot   : tab bar horizontally scrollable, tabs don't shrink, header padding tightened
 *  - ui-settings-general SettingsRoot   : panel stacks vertically (full-width bottom sheet), nav scrolls
 *  - ui-directory-picker-browse         : directory columns min-width relaxed
 *  - ui-model-selection ModelSelect     : trigger max-width 140px; **dropdown menu re-anchored to a bottom-sheet layout on phones** — `position:fixed; left:8px; right:8px; bottom:8px; max-height:65vh`. The default CSS (`position:absolute; right:0`) hangs the menu off the trigger's right edge in the composer's trailing row, extending ~240px to the LEFT — completely off-screen on a 360px phone. The bottom-sheet pattern is fully visible, fully interactive, requires no JS to work, and (critically) keeps the menu a DOM child of `_7KE1Ra_root` so the component's own `closeOutside` and `onBlur` handlers — which gate on `rootRef.current.contains(target)` — still correctly treat clicks and focus inside the menu as "inside the menu". Earlier v0.3.x reparented the menu to `<body>`; that broke those handlers and caused pane switches (root → model/effort) to immediately close the menu. Pure CSS bottom-sheet is the right answer.
 *  - @linxin666/dsh-ssh panel           : tab bar horizontally scrollable (class-probe located)
 */

window.__ModuleLoader__.load({
  id: "dsh-narrow-screen-fix",
  factory: (require) => {
    const MEDIA = "@media (max-width:768px)";

    /** Fallback known hashes, used only when extraction fails. */
    const FALLBACK = {
      questionFooter: "Mbwy4a_footer",
      questionActions: "Mbwy4a_footerActions",
      planFooter: "LVzXQa_footer",
      planActions: "LVzXQa_actions",
      inputRow: "uV2eYG_row",
      tabsRow: "wSkVaW_tabs",
      tabItem: "wSkVaW_tab",
      rootHeader: "wSkVaW_header",
      settingsPanel: "VOzbGW_panel",
      settingsNav: "VOzbGW_nav",
      settingsContent: "VOzbGW_content",
      settingsOverlay: "VOzbGW_overlay",
      dirColumn: "ZuhsRW_column",
      sshTabBar: "HIRDBW_tabBar",
      sshTab: "HIRDBW_tab",
      inputTrailing: "uV2eYG_trailing",
      titleRow: "wSkVaW_titleRow",
      crumb: "wSkVaW_crumb",
      headerActions: "wSkVaW_headerActions",
      headerUtilities: "wSkVaW_headerUtilities",
      settingsNavList: "VOzbGW_navList",
      settingsNavCell: "VOzbGW_navCell",
      modelTrigger: "_7KE1Ra_trigger",
      modelMenu: "_7KE1Ra_menu",
      modelRoot: "_7KE1Ra_root",
      permissionTrigger: "Sh0Q9G_trigger",
      sessionLogButton: "nL4_yW_sessionLogButton",
    };

    /**
     * One fix target: how to find the <style> tag, and which rules to append.
     * @typedef {{marks?: string[], probe?: string, rules: Array<{suffix: string, css: string, fb?: string}>}} FixTarget
     */
    const TARGETS = [
      {
        marks: ["QuestionComposer.module.css"],
        rules: [
          { suffix: "_footer", css: "flex-wrap:wrap;row-gap:8px", fb: FALLBACK.questionFooter },
          { suffix: "_footerActions", css: "flex-shrink:0;width:100%!important;justify-content:flex-end", fb: FALLBACK.questionActions },
        ],
      },
      {
        marks: ["PlanReviewPanel.module.css"],
        rules: [
          { suffix: "_footer", css: "flex-wrap:wrap;row-gap:8px", fb: FALLBACK.planFooter },
          { suffix: "_actions", css: "flex-shrink:0;width:100%!important;justify-content:flex-end", fb: FALLBACK.planActions },
        ],
      },
      {
        marks: ["InputBar.module.css"],
        rules: [
          { suffix: "_row", css: "flex-wrap:wrap!important;row-gap:6px!important;padding-right:36px!important", fb: FALLBACK.inputRow },
          { suffix: "_trailing", css: "width:100%!important;justify-content:flex-end!important", fb: FALLBACK.inputTrailing },
        ],
      },
      {
        marks: ["ConversationRoot.module.css"],
        rules: [
          { suffix: "_tabs", css: "overflow-x:auto!important;gap:18px!important;padding-right:16px!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important", fb: FALLBACK.tabsRow },
          { suffix: "_tab{", css: "flex:none!important", fb: FALLBACK.tabItem },
          { suffix: "_header", css: "padding:10px 10px 0 10px!important", fb: FALLBACK.rootHeader },
          { suffix: "_titleRow", css: "flex-wrap:wrap!important;row-gap:4px!important", fb: FALLBACK.titleRow },
          { suffix: "_crumb", css: "max-width:130px!important", fb: FALLBACK.crumb },
          { suffix: "_headerActions", css: "flex-basis:100%!important;justify-content:flex-end!important;flex-wrap:wrap!important;gap:4px!important;row-gap:2px!important", fb: FALLBACK.headerActions },
          { suffix: "_headerUtilities", css: "flex-wrap:wrap!important;margin-left:8px!important;gap:4px!important", fb: FALLBACK.headerUtilities },
        ],
      },
      {
        marks: ["SettingsRoot.module.css"],
        rules: [
          { suffix: "_panel", css: "flex-direction:column!important;width:100%!important;max-width:100%!important;left:0!important;right:0!important;height:88vh!important;max-height:88vh!important;border-radius:12px 12px 0 0!important", fb: FALLBACK.settingsPanel },
          { suffix: "_nav", css: "width:100%!important;height:auto!important;max-height:36vh!important;overflow-y:auto!important", fb: FALLBACK.settingsNav },
          { suffix: "_content", css: "width:100%!important;min-width:0!important;flex:1!important;min-height:0!important;overflow-y:auto!important", fb: FALLBACK.settingsContent },
          { suffix: "_overlay", css: "align-items:flex-end!important", fb: FALLBACK.settingsOverlay },
          { suffix: "_navList", css: "overflow-y:auto!important;min-height:0!important", fb: FALLBACK.settingsNavList },
          { suffix: "_navCell", css: "flex:none!important", fb: FALLBACK.settingsNavCell },
        ],
      },
      {
        marks: ["DirectoryBrowser.module.css"],
        rules: [
          { suffix: "_column", css: "min-width:0!important", fb: FALLBACK.dirColumn },
        ],
      },
      {
        marks: ["ModelSelect.module.css"],
        rules: [
          { suffix: "_trigger", css: "max-width:140px!important", fb: FALLBACK.modelTrigger },
          // 窄屏下：菜单默认是 position:absolute;right:0 (贴在 trigger 右边)
          // → 触发器在 composer 右下时,菜单左端会向左溢出屏幕很多,几乎看不见。
          // 改为 bottom-sheet 风格:position:fixed,左右贴 8px 屏幕边距,贴屏幕底部
          // 8px;这样菜单永远在屏幕内、永远可见、不依赖 JS。配合 .max-height:65vh,
          // 即使很多模型也能滚动展示。UX 上更接近原生 iOS ActionSheet,符合用户
          // 手机交互习惯。
          {
            suffix: "_menu",
            css:
              "position:fixed!important;left:8px!important;right:8px!important;" +
              "bottom:8px!important;top:auto!important;" +
              "width:auto!important;max-width:none!important;" +
              "max-height:65vh!important;transform:none!important",
            fb: FALLBACK.modelMenu,
          },
        ],
      },
      {
        marks: ["PermissionSelect.module.css"],
        rules: [
          { suffix: "_trigger", css: "max-width:140px!important", fb: FALLBACK.permissionTrigger },
        ],
      },
      {
        // @linxin666/dsh-ssh: located by class-name probe (its style tag has no data-plugin-css mark).
        probe: "HIRDBW_tabBar",
        rules: [
          { suffix: "_tabBar", css: "overflow-x:auto!important;scrollbar-width:none!important", fb: FALLBACK.sshTabBar },
          { suffix: "_tab", css: "flex:none!important", fb: FALLBACK.sshTab },
        ],
      },
      {
        // dsh-session-log-export: shrink the Session log header button on
        // narrow screens so it sits inline with the alias/copy buttons.
        marks: ["HeaderAction.module.css"],
        rules: [
          { suffix: "_sessionLogButton", css: "min-width:0!important;height:28px!important;padding:2px 10px!important;font-size:12px!important;line-height:18px!important", fb: FALLBACK.sessionLogButton },
        ],
      },
    ];

    /** Extract the live CSS-module class name for a suffix from tag text. */
    function clsName(cssText, suffix, fallback) {
      const m = cssText.match(new RegExp("\\.([A-Za-z0-9_-]*" + suffix + ")\\{"));
      return m ? m[1] : fallback;
    }

    /** Locate the <style> tag for one target. */
    function findTag(target) {
      const styles = document.querySelectorAll("style");
      for (const tag of styles) {
        if (target.marks && target.marks.length) {
          const d = tag.getAttribute("data-plugin-css") || "";
          if (target.marks.some((m) => d.indexOf(m) !== -1)) return tag;
        }
        if (target.probe) {
          if ((tag.textContent || "").indexOf(target.probe) !== -1) return tag;
        }
      }
      return null;
    }

    /**
     * Static CSS with the current known-hash class names, injected directly
     * into a dedicated <style> tag. This path does NOT depend on finding the
     * component's style tag or extracting class names — it always lands as
     * long as this client bundle executes. The dynamic path below (patchTarget
     * / injectFallback) is kept as an upgrade-immune enhancement: after a dsh
     * upgrade that re-hashes class names, the dynamic extraction picks up the
     * new hashes and appends them to the component's own style tag.
     */
    const STATIC_CSS =
      "@media (max-width:768px){" +
      // ui-user-questions 提问弹窗 + 计划审查
      ".Mbwy4a_footer{flex-wrap:wrap!important;row-gap:8px!important}" +
      ".Mbwy4a_footerActions{flex-shrink:0!important;width:100%!important;justify-content:flex-end!important}" +
      ".LVzXQa_footer{flex-wrap:wrap!important;row-gap:8px!important}" +
      ".LVzXQa_actions{flex-shrink:0!important;width:100%!important;justify-content:flex-end!important}" +
      // ui-conversation 输入条
      ".uV2eYG_row{flex-wrap:wrap!important;row-gap:6px!important;padding-right:36px!important}" +
      ".uV2eYG_trailing{width:100%!important;justify-content:flex-end!important}" +
      // ui-conversation 会话根：顶栏 + tabs
      ".wSkVaW_tabs{overflow-x:auto!important;gap:18px!important;padding-right:16px!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}" +
      ".wSkVaW_tab{flex:none!important}" +
      ".wSkVaW_header{padding:10px 10px 0 10px!important}" +
      ".wSkVaW_titleRow{flex-wrap:wrap!important;row-gap:4px!important}" +
      ".wSkVaW_crumb{max-width:130px!important}" +
      ".wSkVaW_headerActions{flex-basis:100%!important;justify-content:flex-end!important;flex-wrap:wrap!important;gap:4px!important;row-gap:2px!important}" +
      ".wSkVaW_headerUtilities{flex-wrap:wrap!important;margin-left:8px!important;gap:4px!important}" +
      // ui-settings-general 设置面板
      ".VOzbGW_panel{flex-direction:column!important;width:100%!important;max-width:100%!important;left:0!important;right:0!important;height:88vh!important;max-height:88vh!important;border-radius:12px 12px 0 0!important}" +
      ".VOzbGW_nav{width:100%!important;height:auto!important;max-height:36vh!important;overflow-y:auto!important}" +
      ".VOzbGW_content{width:100%!important;min-width:0!important;flex:1!important;min-height:0!important;overflow-y:auto!important}" +
      ".VOzbGW_overlay{align-items:flex-end!important}" +
      ".VOzbGW_navList{overflow-y:auto!important;min-height:0!important}" +
      ".VOzbGW_navCell{flex:none!important}" +
      // ui-directory-picker-browse
      ".ZuhsRW_column{min-width:0!important}" +
      // 模型/权限选择器
      "._7KE1Ra_trigger{max-width:140px!important}" +
      // 模型选择器菜单（窄屏）：原 position:absolute;right:0 会让菜单在 trigger 右下角时
      // 向左溢出屏幕很多,看不清。改为 bottom-sheet 风格 —— 左右贴 8px 屏幕边距,
      // 贴屏幕底部 8px;这样菜单永远在屏幕内、永远可见、不依赖 JS。UX 类似 iOS
      // ActionSheet,符合用户手机交互习惯。
      "._7KE1Ra_menu{position:fixed!important;left:8px!important;right:8px!important;bottom:8px!important;top:auto!important;width:auto!important;max-width:none!important;max-height:65vh!important;transform:none!important}" +
      ".Sh0Q9G_trigger{max-width:140px!important}" +
      // dsh-ssh 面板
      ".HIRDBW_tabBar{overflow-x:auto!important;scrollbar-width:none!important}" +
      ".HIRDBW_tab{flex:none!important}" +
      // dsh-session-log-export Session log 按钮
      ".nL4_yW_sessionLogButton{min-width:0!important;height:28px!important;padding:2px 10px!important;font-size:12px!important;line-height:18px!important}" +
      // dsh-client-ui-agent-preset 预设行说明文字（窄屏释放 48px 预留，避免逐字断行）
      "._5QVD0a_rowText{padding-right:8px!important}" +
      "}";

    function injectStatic() {
      if (typeof document === "undefined") return;
      const id = "dsh-narrow-screen-fix/static";
      if (document.querySelector('style[data-plugin-css="' + id + '"]')) return;
      const st = document.createElement("style");
      st.dataset.pluginCss = id;
      st.textContent = STATIC_CSS;
      (document.head || document.documentElement).appendChild(st);
      console.log("[narrow-screen-fix] static CSS injected");
    }

    /** Append all rules of one target to its tag. Returns true when done. */
    function patchTarget(target) {
      if (typeof document === "undefined") return false;
      const tag = findTag(target);
      if (!tag) return false;
      const css = tag.textContent || "";
      let added = "";
      for (const r of target.rules) {
        const cls = clsName(css, r.suffix, r.fb);
        added += "." + cls + "{" + r.css + "}";
      }
      const rule = MEDIA + "{" + added + "}";
      if (css.indexOf(rule) !== -1) {
        tag.dataset.narrowScreenFix = "dynamic";
        return true; // already injected
      }
      tag.textContent = css + rule;
      tag.dataset.narrowScreenFix = "dynamic";
      console.log("[narrow-screen-fix] injected:", target.marks ? target.marks.join(",") : target.probe);
      return true;
    }

    /**
     * Fallback: inject into a dedicated <style> tag using the known-hash
     * fallback class names. Used when the component's own style tag never
     * shows up (or the dynamic path fails) — guarantees the rules land for
     * the current dsh build even if tag discovery is broken.
     */
    function injectFallback(target) {
      if (typeof document === "undefined") return;
      const added = target.rules.map((r) => "." + r.fb + "{" + r.css + "}").join("");
      const rule = MEDIA + "{" + added + "}";
      let st = document.querySelector('style[data-plugin-css="dsh-narrow-screen-fix/fallback"]');
      if (!st) {
        st = document.createElement("style");
        st.dataset.pluginCss = "dsh-narrow-screen-fix/fallback";
        document.head.appendChild(st);
      }
      if (st.textContent.indexOf(rule) !== -1) return;
      st.textContent += rule;
      console.log("[narrow-screen-fix] fallback injected:", target.marks ? target.marks.join(",") : target.probe);
    }

    function apply() {
      if (typeof document === "undefined") return;
      const run = () => {
        injectStatic(); // 写死 CSS：立即生效，不依赖标签定位
        let pending = TARGETS.filter((t) => !patchTarget(t));
        if (pending.length === 0) return;
        // Component styles may be injected lazily; poll up to ~20s, then
        // force the fallback so the rules still land.
        let tries = 0;
        const timer = setInterval(() => {
          tries += 1;
          pending = TARGETS.filter((t) => !patchTarget(t));
          if (pending.length === 0) clearInterval(timer);
          if (tries >= 40) {
            clearInterval(timer);
            pending.forEach(injectFallback);
          }
        }, 500);
        setTimeout(() => {
          clearInterval(timer);
          TARGETS.filter((t) => !patchTarget(t)).forEach(injectFallback);
        }, 20000);
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
      } else {
        run();
      }
    }

    return { apply };
  },
});