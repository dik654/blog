import { ARTICLE_LEARNING } from "../src/content/article-learning.ts";
import {
  KNOWLEDGE_CONCEPTS,
  KNOWLEDGE_EDGES,
} from "../src/content/knowledge-graph.ts";

const strict = process.argv.includes("--strict");
const findings = [];
const warnings = [];
const owners = new Map();
const labels = new Map();
const names = new Map();
const degree = new Map(
  Object.keys(KNOWLEDGE_CONCEPTS).map((conceptId) => [conceptId, 0]),
);

function canonicalRoute(concept) {
  return concept.canonicalHref.match(/^\/([^/#]+\/[^/#]+)(?:#.+)?$/)?.[1];
}

for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  for (const concept of contract.introducedHere) {
    const routes = owners.get(concept.id) ?? [];
    routes.push(route);
    owners.set(concept.id, routes);
  }
}

const edgeSignatures = new Set();
for (const edge of KNOWLEDGE_EDGES) {
  const signature = `${edge.from}|${edge.to}|${edge.relation}`;
  if (!KNOWLEDGE_CONCEPTS[edge.from]) {
    findings.push(`출발 concept가 없는 edge: ${signature}`);
  }
  if (!KNOWLEDGE_CONCEPTS[edge.to]) {
    findings.push(`도착 concept가 없는 edge: ${signature}`);
  }
  if (edge.from === edge.to) findings.push(`Self edge: ${signature}`);
  if (edgeSignatures.has(signature)) findings.push(`중복 edge: ${signature}`);
  if (edge.reason.trim().length < 20) {
    findings.push(`연결 이유가 충분하지 않은 edge: ${signature}`);
  }
  edgeSignatures.add(signature);
  if (degree.has(edge.from)) degree.set(edge.from, degree.get(edge.from) + 1);
  if (degree.has(edge.to)) degree.set(edge.to, degree.get(edge.to) + 1);
}

for (const [key, concept] of Object.entries(KNOWLEDGE_CONCEPTS)) {
  if (key !== concept.id) {
    findings.push(`Concept key와 id 불일치: ${key} / ${concept.id}`);
  }
  if (concept.definition.trim().length < 20) {
    findings.push(`정의가 충분하지 않은 concept: ${concept.id}`);
  }
  const normalizedLabel = concept.label.trim().toLocaleLowerCase();
  const labelConcepts = labels.get(normalizedLabel) ?? [];
  labelConcepts.push(concept.id);
  labels.set(normalizedLabel, labelConcepts);
  for (const name of [concept.label, ...(concept.aliases ?? [])]) {
    const normalizedName = name.trim().toLocaleLowerCase();
    if (!normalizedName) {
      findings.push(`빈 alias를 가진 concept: ${concept.id}`);
      continue;
    }
    const nameConcepts = names.get(normalizedName) ?? [];
    nameConcepts.push({ id: concept.id, source: name === concept.label ? "label" : "alias" });
    names.set(normalizedName, nameConcepts);
  }
  const conceptOwners = owners.get(concept.id) ?? [];
  if (conceptOwners.length !== 1) {
    findings.push(
      `Canonical owner는 정확히 하나여야 함: ${concept.id} → ${conceptOwners.join(", ") || "없음"}`,
    );
  }
  const route = canonicalRoute(concept);
  if (!route) {
    findings.push(`Canonical href를 해석할 수 없음: ${concept.id} → ${concept.canonicalHref}`);
  } else if (!ARTICLE_LEARNING[route]) {
    findings.push(`Canonical article에 learning contract가 없음: ${concept.id} → ${route}`);
  } else if (conceptOwners.length === 1 && conceptOwners[0] !== route) {
    findings.push(
      `Canonical owner와 href route 불일치: ${concept.id} → ${conceptOwners[0]} / ${route}`,
    );
  }
  if ((degree.get(concept.id) ?? 0) === 0) {
    findings.push(`Relation edge가 없는 고립 concept: ${concept.id}`);
  }
}

for (const [label, conceptIds] of labels) {
  if (conceptIds.length > 1) {
    findings.push(`같은 label을 가진 concept를 정본 하나로 통합해야 함: ${label} → ${conceptIds.join(", ")}`);
  }
}

for (const [name, concepts] of names) {
  const conceptIds = [...new Set(concepts.map((concept) => concept.id))];
  if (conceptIds.length > 1) {
    findings.push(`같은 label/alias가 여러 정본을 가리킴: ${name} → ${conceptIds.join(", ")}`);
  }
  const aliases = concepts.filter((concept) => concept.source === "alias");
  if (aliases.length > 1 || (aliases.length === 1 && concepts.length > 1)) {
    findings.push(`중복 alias 또는 label 재사용: ${name} → ${concepts.map((concept) => `${concept.id}:${concept.source}`).join(", ")}`);
  }
}

for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  const stages = new Set(
    contract.conceptStages.flatMap((stage) => [...stage.concepts]),
  );
  const declared = [...contract.assumedKnowledge, ...contract.introducedHere];
  for (const concept of declared) {
    if (!KNOWLEDGE_CONCEPTS[concept.id]) {
      findings.push(`${route}: 선언했지만 정의되지 않은 concept: ${concept.id}`);
    }
    if (
      contract.introducedHere.some((introduced) => introduced.id === concept.id) &&
      !stages.has(concept.id)
    ) {
      warnings.push(`${route}: conceptStages에서 빠진 concept: ${concept.id}`);
    }
  }
  for (const stage of contract.conceptStages) {
    for (const conceptId of stage.concepts) {
      if (!KNOWLEDGE_CONCEPTS[conceptId]) {
        findings.push(`${route}: stage가 정의되지 않은 concept를 참조: ${conceptId}`);
      }
    }
  }
}

const exactExerciseContracts = Object.values(ARTICLE_LEARNING).filter(
  (contract) =>
    contract.exercises.filter((exercise) => exercise.level === "basic").length === 6 &&
    contract.exercises.filter((exercise) => exercise.level === "advanced").length === 4,
).length;

const summary = {
  concepts: Object.keys(KNOWLEDGE_CONCEPTS).length,
  relations: KNOWLEDGE_EDGES.length,
  registeredArticles: Object.keys(ARTICLE_LEARNING).length,
  exactExerciseContracts,
  stageCoverageWarnings: warnings.length,
  invariantFailures: findings.length,
};

console.log(`Knowledge graph 요약: ${JSON.stringify(summary)}`);
for (const warning of warnings) console.log(`WARN ${warning}`);
for (const finding of findings) console.log(`FAIL ${finding}`);

if (findings.length === 0 && warnings.length === 0) {
  console.log("Knowledge graph 검사 통과");
} else if (strict) {
  process.exitCode = 1;
}
