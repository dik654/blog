import { createServer } from "vite";
const server = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
const { categories } = await server.ssrLoadModule("/src/content/index.ts");
const nav = await server.ssrLoadModule("/src/content/subcategory-navigation.ts");
const want = process.argv.slice(2);
for (const category of categories) {
  if (!want.includes(category.slug)) continue;
  const flat = (subs) => subs.flatMap((s) => [s, ...(s.children ? flat(s.children) : [])]);
  for (const sub of nav.sortSubcategoriesForReading(category, flat(category.subcategories))) {
    const arts = nav.getDirectArticlesInSubcategory(category, sub);
    if (!arts.length) continue;
    console.log(`\n## ${category.slug} / ${sub.slug} (${sub.name})`);
    nav.sortArticlesForReading(category, arts).forEach((a, i) => {
      const p = nav.getArticleReadingPlacement(category, a);
      console.log(`${i + 1}. ${a.slug}  [${p.label}]`);
    });
  }
}
await server.close();
