#!/usr/bin/env node
/**
 * 从 Velora / shadcn registry 拉取组件到 packages/velora。
 *
 * 用法：
 *   node scripts/velora.mjs add <name...>      拉取组件或区块
 *   node scripts/velora.mjs add <name> --force  覆盖已有文件
 *   node scripts/velora.mjs list [--all]       列出可拉取的条目
 *
 * 为什么不用 shadcn CLI：
 *   1. CLI 需要交互确认，非交互环境会挂住；
 *   2. CLI 写入 src/components/ui/button.tsx，与仓库自写的 Button.tsx 在 macOS
 *      大小写不敏感的文件系统上是同一个文件，会直接覆盖；
 *   3. CLI 会改写 globals.css，本仓库的样式入口由共享包统一管理。
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PKG = join(ROOT, "packages/velora");
const REGISTRY = "https://velora.colorlib.com/r";
const SHADCN = "https://ui.shadcn.com/r/styles/new-york";

/** block 依赖但 velora registry 不提供的 shadcn 基础件 */
const PRIMITIVES = new Set([
  "accordion",
  "avatar",
  "badge",
  "button",
  "dropdown-menu",
  "input",
  "label",
  "sheet",
  "tabs",
]);

const indexCache = new Map();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function veloraIndex() {
  if (!indexCache.has("v")) indexCache.set("v", await fetchJson(`${REGISTRY}/registry.json`));
  return indexCache.get("v");
}

async function resolveItem(name) {
  const index = await veloraIndex();
  const hit = index.items.find((item) => item.name === name);
  if (hit) {
    // 索引里的条目只有文件路径，没有 content；有 content 才可直接用
    const hasContent = (hit.files ?? []).every((file) => typeof file.content === "string");
    return hasContent ? { ...hit, source: "velora" } : { ...(await fetchJson(`${REGISTRY}/${name}.json`)), source: "velora" };
  }

  if (PRIMITIVES.has(name)) {
    const item = await fetchJson(`${SHADCN}/${name}.json`);
    return { ...item, source: "shadcn" };
  }

  throw new Error(`未找到 "${name}"，用 \`node scripts/velora.mjs list\` 查看可选项`);
}

/** registry:ui → src/velora | shadcn 基础件 → src/ui | block → src/blocks */
function targetOf(item, filePath) {
  const base = filePath.split("/").pop();
  if (item.type === "registry:block") return join(PKG, "src/blocks", base);
  if (item.source === "shadcn") return join(PKG, "src/ui", base);
  return join(PKG, "src/velora", base);
}

/** 把 registry 里的 @/ 别名改写成包内相对路径 */
function rewriteImports(code, targetPath) {
  return code
    .replace(/"@\/lib\/utils"/g, rel(targetPath, join(PKG, "src/lib/utils")))
    .replace(/"@\/components\/ui\/([\w-]+)"/g, (_, n) => rel(targetPath, join(PKG, "src/ui", n)))
    .replace(/"@\/components\/velora\/([\w-]+)"/g, (_, n) => rel(targetPath, join(PKG, "src/velora", n)))
    .replace(/"@\/components\/blocks\/([\w-]+)"/g, (_, n) => rel(targetPath, join(PKG, "src/blocks", n)));
}

/** 生成从 fromFile 所在目录指向 toFileNoExt 的相对说明符 */
function rel(fromFile, toFileNoExt) {
  let r = relative(dirname(fromFile), toFileNoExt);
  if (!r.startsWith(".")) r = `./${r}`;
  return `"${r}"`;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** 收集需要写进 CSS 的 keyframes 与 animate 变量，去重后追加 */
async function mergeCss(items) {
  const cssPath = join(PKG, "styles/velora-additions.css");
  const themePath = join(PKG, "styles/theme.css");
  const themeContent = (await exists(themePath)) ? await readFile(themePath, "utf8") : "";
  let current = (await exists(cssPath)) ? await readFile(cssPath, "utf8") : "";
  // 已经写在 theme.css 里的不重复追加
  const known = current + themeContent;

  const keyframes = [];
  const themeVars = [];
  for (const item of items) {
    for (const [rawName, frames] of Object.entries(item.css ?? {})) {
      // registry 的 css 键自带 @keyframes 前缀，如 "@keyframes aurora-1"
      const name = rawName.startsWith("@keyframes ") ? rawName : `@keyframes ${rawName}`;
      if (known.includes(name) || keyframes.some((k) => k.name === name)) continue;
      keyframes.push({ name, frames });
    }
    for (const [key, value] of Object.entries(item.cssVars?.theme ?? {})) {
      const decl = `--${key}:`;
      if (known.includes(decl) || themeVars.some((v) => v.key === key)) continue;
      themeVars.push({ key, value });
    }
  }
  if (!keyframes.length && !themeVars.length) return [];

  let out = current.trimEnd();
  if (themeVars.length) {
    if (!out) out = "/* 由 scripts/velora.mjs 追加，请勿手改 */\n@theme inline {";
    else if (!out.includes("@theme inline")) out += "\n\n@theme inline {";
    for (const { key, value } of themeVars) out += `\n  --${key}: ${value};`;
    if (!out.includes("@theme inline }")) out += "\n}";
  }
  for (const { name, frames } of keyframes) {
    out += `\n\n${name} {`;
    for (const [step, decl] of Object.entries(frames)) {
      const body = Object.entries(decl)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(" ");
      out += `\n  ${step} { ${body} }`;
    }
    out += "\n}";
  }
  await writeFile(cssPath, `${out}\n`);

  return [...themeVars.map((v) => `--${v.key}`), ...keyframes.map((k) => k.name)];
}

async function add(names, force) {
  const written = [];
  const skipped = [];
  const deps = new Set();
  const merged = [];

  // 递归展开 registryDependencies 里的 velora 组件地址
  const queue = [...names];
  const seen = new Set();
  const payloads = [];

  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    seen.add(name);

    const item = await resolveItem(name);
    payloads.push(item);
    for (const dep of item.dependencies ?? []) deps.add(dep);
    for (const dep of item.registryDependencies ?? []) {
      if (dep === "utils") continue;
      const match = dep.match(/\/([\w-]+)\.json$/);
      if (match) queue.push(match[1]);
      else if (!dep.startsWith("http")) queue.push(dep);
    }
  }

  for (const item of payloads) {
    for (const file of item.files ?? []) {
      const target = targetOf(item, file.path);
      if (!force && (await exists(target))) {
        skipped.push(target.slice(ROOT.length + 1));
        continue;
      }
      const content = rewriteImports(file.content, target.replace(/\.tsx$/, ""));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
      written.push(target.slice(ROOT.length + 1));
    }
  }

  merged.push(...(await mergeCss(payloads)));

  const pkgJsonPath = join(PKG, "package.json");
  const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf8"));
  const known = new Set(Object.keys(pkgJson.dependencies));
  // registry 元数据里可能写着拆分包（如 @radix-ui/react-accordion），
  // 但实际组件源码统一 import "radix-ui"。检查真实 import 后再报缺失。
  const sources = await Promise.all(
    written.map((f) => readFile(join(ROOT, f), "utf8").catch(() => "")),
  );
  const imported = new Set();
  for (const code of sources) {
    for (const m of code.matchAll(/from\s+"([^".][^"]*)"/g)) {
      const spec = m[1];
      if (!spec) continue;
      if (spec === "react" || spec === "react-dom") continue;
      imported.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);
    }
  }
  const missing = [...imported].filter((d) => !known.has(d));

  console.log(`\n写入 ${written.length} 个文件：`);
  for (const f of written) console.log(`  ${f}`);
  if (skipped.length) {
    console.log(`\n已存在、未覆盖 ${skipped.length} 个（加 --force 强制覆盖）：`);
    for (const f of skipped) console.log(`  ${f}`);
  }
  if (merged.length) {
    console.log(`\nCSS 已追加到 packages/velora/styles/velora-additions.css：`);
    for (const m of merged) console.log(`  ${m}`);
  }
  if (missing.length) {
    console.log(`\n还需手动确认的 npm 依赖：${missing.join(", ")}`);
  }
  console.log("\n下一步：pnpm install && pnpm check");
}

async function list(all) {
  const index = await veloraIndex();
  for (const type of ["registry:ui", "registry:block"]) {
    const items = index.items.filter((i) => i.type === type);
    const label = type === "registry:ui" ? "组件" : "区块";
    console.log(`\n${label}（${items.length}）`);
    for (const item of items) {
      const installed = !all && (await exists(join(PKG, "src/velora", `${item.name}.tsx`)));
      const blocks = !all && (await exists(join(PKG, "src/blocks", `${item.name}.tsx`)));
      if (installed || blocks) continue;
      console.log(`  ${item.name.padEnd(28)} ${item.title}`);
    }
  }
  if (!all) console.log("\n（已安装的条目已省略，加 --all 查看全部）");
}

const [command, ...args] = process.argv.slice(2);
const force = args.includes("--force");
const targets = args.filter((a) => !a.startsWith("--"));
try {
  if (command === "add") {
    if (!targets.length) throw new Error("用法：node scripts/velora.mjs add <name...>");
    await add(targets, force);
  } else if (command === "list") {
    await list(args.includes("--all"));
  } else {
    console.log("用法：\n  node scripts/velora.mjs add <name...>\n  node scripts/velora.mjs list [--all]");
  }
} catch (error) {
  console.error(`\n✗ ${error.message}`);
  process.exitCode = 1;
}
