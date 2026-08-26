import fs from "node:fs";
import { createHash } from "node:crypto";
import { ARTICLE_LEARNING } from "../src/content/article-learning.ts";
import {
  ARTICLE_TOPOLOGY_DECISIONS,
  ARTICLE_TOPOLOGY_FINGERPRINTS,
} from "../src/content/article-topology-decisions.ts";
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

function topologyFingerprint(article, contract, metrics) {
  const payload = JSON.stringify({
    title: article.title,
    introducedHere: contract?.introducedHere.map((concept) => concept.id) ?? [],
    conceptStages:
      contract?.conceptStages.map((stage) => ({
        label: stage.label,
        concepts: stage.concepts,
      })) ?? [],
    metrics,
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

const rows = catalog.map((article) => {
  const contract = ARTICLE_LEARNING[article.route];
  const metrics = sourceMetrics(article.sourcePath);
  const decision = ARTICLE_TOPOLOGY_DECISIONS[article.route];
  const fingerprint = topologyFingerprint(article, contract, metrics);
  const reviewedFingerprint = ARTICLE_TOPOLOGY_FINGERPRINTS[article.route];
  const targets = decision?.targetRoutes ?? [];
  const missingTargets = targets.filter(
    (target) => !catalog.some((candidate) => candidate.route === target),
  );
  const issues = [];
  const heuristic = recommendation(article, contract, metrics);

  if (heuristic.action !== "keep" && !decision) issues.push("unreviewed");
  if (decision && !reviewedFingerprint) issues.push("missing-fingerprint");
  if (decision && reviewedFingerprint && reviewedFingerprint !== fingerprint) {
    issues.push("stale-decision");
  }
  if (decision?.status === "planned") issues.push("planned-change");
  if (decision?.action === "keep" && !decision.sharedGate?.trim()) {
    issues.push("missing-shared-gate");
  }
  if (missingTargets.length) issues.push(`missing-target:${missingTargets.join(",")}`);

  return {
    route: article.route,
    title: article.title,
    introducedConcepts: contract?.introducedHere.length ?? 0,
    stages: contract?.conceptStages.length ?? 0,
    ...metrics,
    ...heuristic,
    fingerprint,
    decision: decision?.action ?? null,
    decisionStatus: decision?.status ?? null,
    issues,
  };
});

for (const route of Object.keys(ARTICLE_TOPOLOGY_DECISIONS)) {
  if (!catalog.some((article) => article.route === route)) {
    rows.push({
      route,
      title: "(catalog route 없음)",
      introducedConcepts: 0,
      stages: 0,
      files: 0,
      lines: 0,
      sections: 0,
      formulas: 0,
      visualizations: 0,
      action: "invalid-decision",
      reasons: ["decision route가 public catalog에 없음"],
      fingerprint: ARTICLE_TOPOLOGY_FINGERPRINTS[route] ?? null,
      decision: ARTICLE_TOPOLOGY_DECISIONS[route].action,
      decisionStatus: ARTICLE_TOPOLOGY_DECISIONS[route].status,
      issues: ["missing-route"],
    });
  }
}

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
  for (const row of rows.filter((candidate) => candidate.action !== "keep" || candidate.issues.length)) {
    console.log(
      `- [${row.action}] ${row.route} · decision=${row.decision ?? "none"}/${row.decisionStatus ?? "none"} · ${row.title} · ${[...row.reasons, ...row.issues].join(" / ")}`,
    );
  }
}

if (
  strict &&
  rows.some(
    (row) => row.action === "create-contract" || row.issues.length > 0,
  )
) {
  process.exitCode = 1;
}
