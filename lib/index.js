/**
 * dsh-narrow-screen-fix host half: no host-side logic.
 *
 * The fix lives in the browser half (lib/client.js): a rule matrix of
 * narrow-screen overrides appended to each component's own injected <style>
 * tag — question card / plan review footers, input bar send-button inset, top
 * tab bar scroll, settings panel stacking, directory browser columns, ssh
 * panel tab bar. No dsh source is touched.
 */

const name = "narrow-screen-fix";

const inject = [];

function apply() {
  console.log("[narrow-screen-fix] host loaded (unified mobile CSS patch, no host logic)");
}

export { apply, inject, name };