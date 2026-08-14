import fs from "node:fs";
import { ARTICLE_LEARNING } from "../src/content/article-learning.ts";
import { KNOWLEDGE_CONCEPTS, KNOWLEDGE_EDGES } from "../src/content/knowledge-graph.ts";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const requireRegistration = process.argv.includes("--require-registration");
const evidenceHeavy = process.argv.includes("--evidence-heavy");
const allArticles = process.argv.includes("--all-articles");
const selectedRoutes = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const publicArticleCatalog = await loadPublicArticleCatalog();
const publicArticleByRoute = new Map(
  publicArticleCatalog.map((article) => [article.route, article]),
);

function routeFiles(route) {
  const catalogArticle = publicArticleByRoute.get(route);
  if (!catalogArticle) return [];
  return collectArticleSourceClosure(catalogArticle.sourcePath);
}

function evidenceHeavyRoutes() {
  const source = fs.readFileSync("src/content/article-evidence.ts", "utf8");
  const routes = [];
  for (const match of source.matchAll(/^  "([^"]+)": \[(.*?)(?=^  "[^"]+": \[|^};)/gms)) {
    const count = (match[2].match(/kind: "핵심 (?:논문|연구)"/g) ?? []).length;
    if (count >= 2) routes.push(match[1]);
  }
  return routes;
}

function allArticleRoutes() {
  return publicArticleCatalog.map((article) => article.route);
}

const routes = selectedRoutes.length
  ? selectedRoutes
  : allArticles
    ? allArticleRoutes()
  : evidenceHeavy
    ? evidenceHeavyRoutes()
    : Object.keys(ARTICLE_LEARNING);
const findings = [];
const articleRouteSet = new Set(allArticleRoutes());
const auditedPrerequisiteClosures = new Set();
const introducedOwners = new Map();
const conceptDegree = new Map(Object.keys(KNOWLEDGE_CONCEPTS).map((conceptId) => [conceptId, 0]));

for (const edge of KNOWLEDGE_EDGES) {
  if (conceptDegree.has(edge.from)) conceptDegree.set(edge.from, conceptDegree.get(edge.from) + 1);
  if (conceptDegree.has(edge.to)) conceptDegree.set(edge.to, conceptDegree.get(edge.to) + 1);
}

for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  for (const concept of contract.introducedHere) {
    const owners = introducedOwners.get(concept.id) ?? [];
    owners.push(route);
    introducedOwners.set(concept.id, owners);
  }
}

function canonicalLocation(conceptId) {
  const concept = KNOWLEDGE_CONCEPTS[conceptId];
  if (!concept) return undefined;
  const match = concept.canonicalHref.match(/^\/([^/#]+\/[^/#]+)(?:#(.+))?$/);
  if (!match) return undefined;
  return { route: match[1], sectionId: match[2] };
}

// Knowledge graph invariants are global.  A selected article audit must not
// silently pass while another edit has introduced a duplicate owner, dangling
// edge, or isolated canonical concept elsewhere in the graph.
const edgeSignatures = new Set();
for (const edge of KNOWLEDGE_EDGES) {
  if (!KNOWLEDGE_CONCEPTS[edge.from]) {
    findings.push(["knowledge-graph", `relation edge의 출발 concept가 없습니다: ${edge.from}`]);
  }
  if (!KNOWLEDGE_CONCEPTS[edge.to]) {
    findings.push(["knowledge-graph", `relation edge의 도착 concept가 없습니다: ${edge.to}`]);
  }
  if (edge.from === edge.to) {
    findings.push(["knowledge-graph", `자기 자신을 가리키는 relation edge가 있습니다: ${edge.from}`]);
  }
  const signature = `${edge.from}|${edge.to}|${edge.relation}`;
  if (edgeSignatures.has(signature)) {
    findings.push(["knowledge-graph", `중복 relation edge가 있습니다: ${signature}`]);
  }
  edgeSignatures.add(signature);
  if (edge.reason.trim().length < 20) {
    findings.push(["knowledge-graph", `relation edge의 연결 이유가 충분하지 않습니다: ${signature}`]);
  }
}

for (const concept of Object.values(KNOWLEDGE_CONCEPTS)) {
  const owners = introducedOwners.get(concept.id) ?? [];
  if (owners.length !== 1) {
    findings.push([
      "knowledge-graph",
      `concept의 canonical owner는 정확히 하나여야 합니다: ${concept.id} → ${owners.join(", ") || "없음"}`,
    ]);
  }
  const location = canonicalLocation(concept.id);
  if (!location) {
    findings.push(["knowledge-graph", `concept의 canonical href를 해석할 수 없습니다: ${concept.id}`]);
  } else {
    if (!articleRouteSet.has(location.route)) {
      findings.push(["knowledge-graph", `concept의 canonical article이 없습니다: ${concept.id} → ${location.route}`]);
    }
    if (owners.length === 1 && owners[0] !== location.route) {
      findings.push([
        "knowledge-graph",
        `concept owner와 canonical article이 다릅니다: ${concept.id} → ${owners[0]} / ${location.route}`,
      ]);
    }
  }
  if ((conceptDegree.get(concept.id) ?? 0) === 0) {
    findings.push(["knowledge-graph", `relation edge가 없는 고립 concept입니다: ${concept.id}`]);
  }
}

function auditPrerequisiteClosure(originRoute, conceptId, chain = []) {
  const auditKey = `${originRoute}:${conceptId}`;
  if (auditedPrerequisiteClosures.has(auditKey)) return;
  const location = canonicalLocation(conceptId);
  if (!location) {
    findings.push([originRoute, `선수 concept의 canonical href를 해석할 수 없습니다: ${conceptId}`]);
    return;
  }
  if (!articleRouteSet.has(location.route)) {
    findings.push([originRoute, `선수 concept의 canonical article이 없습니다: ${conceptId} → ${location.route}`]);
    return;
  }
  const owner = ARTICLE_LEARNING[location.route];
  if (!owner) {
    findings.push([originRoute, `선수 concept의 canonical article에 learning contract가 없습니다: ${conceptId} → ${location.route}`]);
    return;
  }
  if (!owner.introducedHere.some((concept) => concept.id === conceptId)) {
    findings.push([originRoute, `canonical article이 선수 concept를 직접 설명한다고 선언하지 않았습니다: ${conceptId} → ${location.route}`]);
  }
  if (location.sectionId) {
    const ownerSource = routeFiles(location.route).map((file) => fs.readFileSync(file, "utf8")).join("\n");
    const ownerIds = new Set([...ownerSource.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
    if (!ownerIds.has(location.sectionId)) {
      findings.push([originRoute, `선수 concept의 canonical anchor가 없습니다: ${conceptId} → ${location.route}#${location.sectionId}`]);
    }
  }
  if (owner.entryLevel) return;
  if (chain.includes(location.route) || location.route === originRoute) {
    findings.push([originRoute, `선수 지식 경로가 entry-level 글에 닿기 전에 순환합니다: ${[...chain, location.route].join(" → ")}`]);
    return;
  }
  for (const prerequisite of owner.assumedKnowledge) {
    auditPrerequisiteClosure(originRoute, prerequisite.id, [...chain, location.route]);
  }
  auditedPrerequisiteClosures.add(auditKey);
}

for (const route of routes) {
  const contract = ARTICLE_LEARNING[route];
  if (!contract) {
    if (requireRegistration) findings.push([route, "learning contract가 등록되지 않았습니다."]);
    continue;
  }
  if (!contract.coreIdea.trim()) findings.push([route, "coreIdea가 비어 있습니다."]);
  if (!contract.entryLevel && contract.assumedKnowledge.length === 0) findings.push([route, "선수 개념이 비어 있습니다."]);
  if (contract.entryLevel && contract.assumedKnowledge.length > 0) findings.push([route, "entry-level 글은 외부 선수 지식을 가정할 수 없습니다."]);
  if (contract.introducedHere.length === 0) findings.push([route, "본문에서 설명할 용어가 비어 있습니다."]);
  const basicExercises = contract.exercises.filter((exercise) => exercise.level === "basic");
  const advancedExercises = contract.exercises.filter((exercise) => exercise.level === "advanced");
  if (basicExercises.length !== 6) {
    findings.push([
      route,
      `기초 연습문제는 정확히 6개여야 합니다: 현재 ${basicExercises.length}개`,
    ]);
  }
  if (advancedExercises.length !== 4) {
    findings.push([
      route,
      `심화 연습문제는 정확히 4개여야 합니다: 현재 ${advancedExercises.length}개`,
    ]);
  }
  if (contract.conceptStages.length === 0) findings.push([route, "개념 그래프 stage가 비어 있습니다."]);

  const refs = [...contract.assumedKnowledge, ...contract.introducedHere];
  const canonicalConcepts = Object.values(KNOWLEDGE_CONCEPTS).filter(
    (concept) => canonicalLocation(concept.id)?.route === route,
  );
  const introducedIds = new Set(contract.introducedHere.map((concept) => concept.id));
  for (const concept of canonicalConcepts) {
    if (!introducedIds.has(concept.id)) {
      findings.push([
        route,
        `canonical article이 자신의 concept를 introducedHere에서 설명하지 않습니다: ${concept.id}`,
      ]);
    }
  }
  const stagedConcepts = new Set(contract.conceptStages.flatMap((stage) => stage.concepts));
  for (const ref of refs) {
    if (!KNOWLEDGE_CONCEPTS[ref.id]) findings.push([route, `정의되지 않은 concept node입니다: ${ref.id}`]);
    if (!ref.role.trim()) findings.push([route, `concept의 현재 글 역할이 없습니다: ${ref.id}`]);
    if (
      contract.introducedHere.some((concept) => concept.id === ref.id) &&
      !stagedConcepts.has(ref.id)
    ) {
      findings.push([route, `선수 또는 새 concept가 개념 그래프 stage에서 빠졌습니다: ${ref.id}`]);
    }
  }
  for (const prerequisite of contract.assumedKnowledge) {
    auditPrerequisiteClosure(route, prerequisite.id);
  }
  for (const conceptId of stagedConcepts) {
    if (!KNOWLEDGE_CONCEPTS[conceptId]) findings.push([route, `stage가 정의되지 않은 concept를 참조합니다: ${conceptId}`]);
  }
  const graphConcepts = new Set(refs.map((ref) => ref.id).concat([...stagedConcepts]));
  const graphEdges = KNOWLEDGE_EDGES.filter((edge) => graphConcepts.has(edge.from) && graphConcepts.has(edge.to));
  if (graphConcepts.size > 1 && graphEdges.length === 0) findings.push([route, "참조한 concept node 사이의 relation edge가 없습니다."]);

  const source = routeFiles(route).map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const ids = new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));

  const explanations = contract.conceptExplanations ?? [];
  const explanationCounts = new Map();
  for (const explanation of explanations) {
    explanationCounts.set(explanation.id, (explanationCounts.get(explanation.id) ?? 0) + 1);
    if (!KNOWLEDGE_CONCEPTS[explanation.id]) {
      findings.push([route, `초심자 설명이 정의되지 않은 concept를 참조합니다: ${explanation.id}`]);
      continue;
    }
    if (!contract.introducedHere.some((concept) => concept.id === explanation.id)) {
      findings.push([route, `초심자 설명의 concept가 introducedHere에 없습니다: ${explanation.id}`]);
    }
    if (!ids.has(explanation.sectionId)) {
      findings.push([route, `초심자 설명 anchor가 없습니다: ${explanation.id} → #${explanation.sectionId}`]);
    }
    for (const [field, value] of Object.entries({
      intuition: explanation.intuition,
      workedExample: explanation.workedExample,
      boundary: explanation.boundary,
    })) {
      if (!value || value.trim().length < 20) {
        findings.push([route, `${explanation.id}의 ${field} 설명이 충분하지 않습니다.`]);
      }
    }
    if (KNOWLEDGE_CONCEPTS[explanation.id].kind === "theorem") {
      if (!explanation.proofIdea || explanation.proofIdea.trim().length < 20) {
        findings.push([route, `${explanation.id} 정리의 초심자용 proofIdea가 충분하지 않습니다.`]);
      }
      if (!explanation.counterexample || explanation.counterexample.trim().length < 20) {
        findings.push([route, `${explanation.id} 정리의 counterexample이 충분하지 않습니다.`]);
      }
    }
    const domain = KNOWLEDGE_CONCEPTS[explanation.id].domain;
    if (["physics", "chemistry", "biology", "earth-science"].includes(domain)) {
      const grounding = explanation.scientificGrounding;
      if (!grounding) {
        findings.push([route, `${explanation.id}의 기초과학 설명에 scientificGrounding이 없습니다.`]);
      } else {
        for (const [field, value] of Object.entries({
          observable: grounding.observable,
          unitsAndDimensions: grounding.unitsAndDimensions,
          modelAssumptions: grounding.modelAssumptions,
          measurementExample: grounding.measurementExample,
          invalidConditions: grounding.invalidConditions,
        })) {
          if (!value || value.trim().length < 20) {
            findings.push([route, `${explanation.id}의 기초과학 ${field} 설명이 충분하지 않습니다.`]);
          }
        }
        if (domain === "physics" && (!grounding.referenceFrame || grounding.referenceFrame.trim().length < 20)) {
          findings.push([route, `${explanation.id}의 물리 설명에 좌표계·기준계 조건이 충분하지 않습니다.`]);
        }
      }
    }
  }
  for (const concept of contract.introducedHere) {
    const owners = introducedOwners.get(concept.id) ?? [];
    if (owners.length !== 1) {
      findings.push([
        route,
        `새 concept의 canonical owner가 하나가 아닙니다: ${concept.id} → ${owners.join(", ")}`,
      ]);
    }
    const location = canonicalLocation(concept.id);
    if (!location) {
      findings.push([route, `새 concept의 canonical href를 해석할 수 없습니다: ${concept.id}`]);
    } else if (location.route !== route) {
      findings.push([
        route,
        `새 concept의 canonical article과 현재 owner가 다릅니다: ${concept.id} → ${location.route}`,
      ]);
    }
    const count = explanationCounts.get(concept.id) ?? 0;
    if (count === 0) findings.push([route, `새 concept의 초심자 설명이 없습니다: ${concept.id}`]);
    if (count > 1) findings.push([route, `새 concept의 초심자 설명이 중복됩니다: ${concept.id}`]);
    if ((conceptDegree.get(concept.id) ?? 0) === 0) {
      findings.push([route, `새 concept가 knowledge graph에서 고립되어 있습니다: ${concept.id}`]);
    }
  }

  for (const exercise of contract.exercises) {
    if (exercise.question.trim().length < 20) findings.push([route, `연습문제가 너무 짧습니다: ${exercise.question}`]);
    if (exercise.answerChecklist.length < 2) findings.push([route, `정답 체크리스트가 충분하지 않습니다: ${exercise.question}`]);
    if (exercise.requiredConcepts.length === 0) findings.push([route, `필수 concept가 없습니다: ${exercise.question}`]);
    for (const conceptId of exercise.requiredConcepts) {
      if (!KNOWLEDGE_CONCEPTS[conceptId]) findings.push([route, `문제가 정의되지 않은 concept를 요구합니다: ${conceptId}`]);
      if (!graphConcepts.has(conceptId)) findings.push([route, `문제의 필수 concept가 글의 concept stage에 없습니다: ${conceptId}`]);
    }
    if (!ids.has(exercise.sectionId)) findings.push([route, `연습문제 답변 anchor가 없습니다: #${exercise.sectionId}`]);
  }
  for (const paper of contract.papers ?? []) {
    if (!paper.sectionId && !paper.internalHref) {
      findings.push([route, `논문 내부 해설 경로가 없습니다: ${paper.title}`]);
    } else if (paper.sectionId && !ids.has(paper.sectionId)) {
      findings.push([route, `논문 해설 anchor가 없습니다: ${paper.title} → #${paper.sectionId}`]);
    } else if (paper.internalHref) {
      const match = paper.internalHref.match(/^\/([^/#]+\/[^/#]+)(?:#(.+))?$/);
      if (!match || !articleRouteSet.has(match[1])) {
        findings.push([route, `논문 canonical article이 없습니다: ${paper.title} → ${paper.internalHref}`]);
      } else if (match[2]) {
        const paperSource = routeFiles(match[1]).map((file) => fs.readFileSync(file, "utf8")).join("\n");
        const paperIds = new Set([...paperSource.matchAll(/\bid=["']([^"']+)["']/g)].map((item) => item[1]));
        if (!paperIds.has(match[2])) findings.push([route, `논문 canonical anchor가 없습니다: ${paper.title} → ${paper.internalHref}`]);
      }
    }
    for (const [field, value] of Object.entries({ problem: paper.problem, contribution: paper.contribution, assumptions: paper.assumptions, evidenceScope: paper.evidenceScope, notClaim: paper.notClaim })) {
      if (value.trim().length < 20) findings.push([route, `${paper.title}의 ${field} 설명이 충분하지 않습니다.`]);
    }
  }
}

if (findings.length === 0) {
  console.log(`Learning contract 검사 통과: ${routes.length}개 글`);
} else {
  for (const [route, finding] of findings) console.log(`${route}: ${finding}`);
  console.log(`\nLearning contract 미통과 ${findings.length}개`);
  if (strict) process.exitCode = 1;
}
