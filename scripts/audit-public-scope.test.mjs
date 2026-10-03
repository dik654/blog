import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { collectArticleSourceClosure } from "./lib/public-article-catalog.mjs";

const scripts = import.meta.dirname;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-audit-scope-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (name, source) => {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, source);
    return file;
  };
  write("vite.config.mjs", `export default { resolve: { alias: { "@": ${JSON.stringify(path.join(root, "src"))} } } };`);
  write("src/content/index.ts", `export const categories = [{ slug: "test", articles: [{ slug: "live", title: "Live", component: () => import("@/pages/articles/test/live") }] }];`);
  write("src/content/domains.ts", `export const domainOf = () => "cs";`);
  const entry = write("src/pages/articles/test/live.tsx", `
    import "@/pages/articles/test/body";
    export { value } from "./reexported";
    import "@/components/viz/Shared";
    import type { Hidden } from "./types";
    import { type AlsoHidden } from "./named-types";
    import raw from "./raw.tsx?raw";
    // import "./commented";
    const quotation = 'import "./quoted"';
    const later = () => import("./lazy");
    export default function Article() { return <section id="overview">A real article.</section>; }
  `);
  write("src/pages/articles/test/body.tsx", `export const body = <p>Reachable explanation.</p>;`);
  write("src/pages/articles/test/reexported.ts", `export const value = 1;`);
  write("src/pages/articles/test/lazy.tsx", `import "./live"; export default function Lazy() { return <p>Lazy explanation.</p>; }`);
  write("src/components/viz/Shared.tsx", `export default function Shared() { return <svg><path strokeWidth="1.25" /></svg>; }`);
  const violation = `export default function Old() { return <section><Math display /><svg><linearGradient id="old" /></svg></section>; }`;
  for (const name of ["legacy", "types", "named-types", "raw", "commented", "quoted"]) write(`src/pages/articles/test/${name}.tsx`, violation);
  write("src/components/viz/Unused.tsx", violation);
  return { root, write, entry };
}
function run(root, script, args = []) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), "--strict", ...args], {
    cwd: root, encoding: "utf8", timeout: 30_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stderr);
  return result;
}

test("closure follows aliases, re-exports and lazy imports but excludes source assets, type imports and legacy siblings", (t) => {
  const f = fixture(t);
  const relative = (files) => files.map((file) => path.relative(f.root, file)).sort();
  const articles = collectArticleSourceClosure(f.entry, { root: f.root });
  assert.deepEqual(relative(articles), ["body.tsx", "lazy.tsx", "live.tsx", "reexported.ts"].map((name) => `src/pages/articles/test/${name}`).sort());
  const withViz = collectArticleSourceClosure(f.entry, { root: f.root, additionalSourceRoots: ["src/components/viz"] });
  assert.deepEqual(relative(withViz), [...relative(articles), "src/components/viz/Shared.tsx"].sort());
});

test("default article audit uses the public catalog and still fails an imported formula violation", (t) => {
  const f = fixture(t);
  const clean = run(f.root, "audit-article-contract.mjs", ["--json"]);
  assert.equal(clean.status, 0, clean.stderr + clean.stdout);
  assert.deepEqual(JSON.parse(clean.stdout).map((row) => row.group), ["test/live"]);
  const explicitAll = run(f.root, "audit-article-contract.mjs", ["--all-articles", "--json"]);
  assert.equal(explicitAll.status, 0, explicitAll.stderr);
  assert.deepEqual(JSON.parse(explicitAll.stdout), JSON.parse(clean.stdout));
  f.write("src/pages/articles/test/body.tsx", `export const body = <Math display>unexplained formula</Math>;`);
  const bad = run(f.root, "audit-article-contract.mjs", ["--json"]);
  assert.equal(bad.status, 1, bad.stderr + bad.stdout);
  assert.equal(JSON.parse(bad.stdout)[0].displayMath, 1);
  assert.equal(JSON.parse(bad.stdout)[0].group, "test/live");
});

test("default Viz audit excludes unused files and catches both lazy and shared reachable errors", (t) => {
  const f = fixture(t);
  const clean = run(f.root, "audit-viz-style.mjs");
  assert.equal(clean.status, 0, clean.stderr + clean.stdout);
  assert.doesNotMatch(clean.stdout, /ERROR/);
  f.write("src/pages/articles/test/lazy.tsx", `export default function Lazy() { return <svg><linearGradient id="live" /></svg>; }`);
  const lazy = run(f.root, "audit-viz-style.mjs");
  assert.equal(lazy.status, 1, lazy.stderr + lazy.stdout);
  assert.match(lazy.stdout, /lazy\.tsx:1\s+ERROR\s+gradient/);
  f.write("src/pages/articles/test/lazy.tsx", `export default function Lazy() { return <p>Safe.</p>; }`);
  f.write("src/components/viz/Shared.tsx", `export default function Shared() { return <svg><path strokeWidth="2" /></svg>; }`);
  const shared = run(f.root, "audit-viz-style.mjs", ["--all-articles"]);
  assert.equal(shared.status, 1, shared.stderr + shared.stdout);
  assert.match(shared.stdout, /Shared\.tsx:1\s+ERROR\s+thick SVG stroke/);
});

test("explicit file audits continue checking requested unpublished files", (t) => {
  const f = fixture(t);
  for (const script of ["audit-article-contract.mjs", "audit-viz-style.mjs"]) {
    const result = run(f.root, script, ["src/pages/articles/test/legacy.tsx"]);
    assert.equal(result.status, 1, result.stderr + result.stdout);
    assert.match(result.stdout, /legacy/);
  }
});
