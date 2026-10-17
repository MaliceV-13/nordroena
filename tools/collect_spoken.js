// Lists every string the app can speak (vocab forms, speak-exercise targets, listen audioForms).
const vm = require("vm"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx.window);
for (const f of ["course","path","lesson1","lesson2","lesson3","futhark"]) vm.runInContext(fs.readFileSync(path.join(root, "data", f + ".js"), "utf8"), ctx.window);
const out = new Map();
(function walk(o, trail) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, trail + "[" + i + "]"));
  if (!o || typeof o !== "object") return;
  if (typeof o.audioForm === "string") out.set(o.audioForm, (out.get(o.audioForm) || []).concat("audioForm " + trail));
  if (typeof o.target === "string" && /speak/i.test(o.type || "")) out.set(o.target, (out.get(o.target) || []).concat("speak " + trail));
  if (typeof o.form === "string" && "clearSpeak" in o) out.set(o.form, (out.get(o.form) || []).concat("vocab " + trail));
  for (const k of Object.keys(o)) walk(o[k], trail + "." + k);
})(ctx.window.NORDRONA, "N");
console.log(JSON.stringify([...out.keys()], null, 0));
for (const [k, v] of out) console.error(k, "<-", v.length, v[0]);
