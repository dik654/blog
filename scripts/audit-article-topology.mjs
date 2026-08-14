import fs from "node:fs";
import { ARTICLE_LEARNING } from "../src/content/article-learning.ts";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const json = process.argv.includes("--json");
const catalog = await loadPublicArticleCatalog();

function sourceMetrics(sourcePath) {
  const files = collectArticleSourceClosure(sourcePath);
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  return {
    files: files.length,
    lines: source.split("\n").length,
    sections: (source.match(/<section\b/g) ?? []).length,
    formulas: (source.match(/<ExplainedFormula\b/g) ?? []).length,
    visualizations: (source.match(/<[^>]*(?:Viz|Diagram|Chart)\b/g) ?? []).length,
  };
}

function recommendation(article, contract, metrics) {
  if (!contract) return { action: "create-contract", reasons: ["learning contract 없음"] };
  const reasons = [];
  const independentTopics = contract.introducedHere.length;

  if (independentTopics >= 9) {
    reasons.push(`처음 소유하는 concept ${independentTopics}개`);
  }
  if (metrics.sections >= 8) {
    reasons.push(`실제 section ${metrics.sections}개`);
  }
  if (metrics.lines >= 1200 && independentTopics >= 6) {
    reasons.push(`실제 import closure ${metrics.lines}줄`);
  }
  if (contract.conceptStages.length >= 7) {
    reasons.push(`학습 stage ${contract.conceptStages.length}개`);
  }
  if (reasons.length) return { action: "split-review", reasons };

  if (independentTopics <= 3 && metrics.lines <= 260 && metrics.sections <= 3) {
    return {
      action: "merge-review",
      reasons: [`concept ${independentTopics}개·${metrics.lines}줄의 작은 closure`],
    };
  }

  const namedTopics = article.title.split(/[·/&]|\s+와\s+|\s+and\s+/i).length;
  if (namedTopics >= 5) {
    return {
      action: "rename-or-split-review",
      reasons: [`제목에 병렬 주제 ${namedTopics}개`],
    };
  }

  return { action: "keep", reasons: [] };
}

const rows = catalog.map((article) => {
  const contract = ARTICLE_LEARNING[article.route];
  const metrics = sourceMetrics(article.sourcePath);
  return {
    route: article.route,
    title: article.title,
    introducedConcepts: contract?.introducedHere.length ?? 0,
    stages: contract?.conceptStages.length ?? 0,
    ...metrics,
    ...recommendation(article, contract, metrics),
  };
});

const summary = Object.fromEntries(
  [...new Set(rows.map((row) => row.action))]
    .sort()
    .map((action) => [action, rows.filter((row) => row.action === action).length]),
);

if (json) {
  console.log(JSON.stringify({ publicArticles: catalog.length, summary, rows }, null, 2));
} else {
  console.log(
    `아티클 topology 감사: ${catalog.length} routes · ${JSON.stringify(summary)}`,
  );
  for (const row of rows.filter((candidate) => candidate.action !== "keep")) {
    console.log(
      `- [${row.action}] ${row.route} · ${row.title} · ${row.reasons.join(" / ")}`,
    );
  }
}

if (strict && rows.some((row) => row.action === "create-contract")) {
  process.exitCode = 1;
}
