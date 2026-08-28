#!/usr/bin/env node
/**
 * 새 글의 뼈대와 registration module 을 만든다.
 *
 *   node scripts/scaffold-article.mjs --category ai --slug my-article \
 *     --subcategory ai-llm-serving --catalog src/content/ai/articlesVLLM.ts \
 *     --after vllm-serving --title "글 제목"
 *
 * 생성물
 *   src/pages/articles/<category>/<slug>.tsx             본문 뼈대 (섹션 5개 + Viz 1개)
 *   src/pages/articles/<category>/<slug>/viz/<Name>Viz.tsx  stable-stage 장면형 Viz 뼈대
 *   src/content/registrations/<slug>.ts                  등록 module (병합 전 TODO 포함)
 *
 * 이미 있는 파일은 덮어쓰지 않는다.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
function opt(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
}
const category = opt("category");
const slug = opt("slug");
const subcategory = opt("subcategory");
const catalog = opt("catalog");
const after = opt("after");
const title = opt("title", "TODO 제목");
if (!category || !slug || !subcategory || !catalog) {
  console.error("--category --slug --subcategory --catalog 는 필수입니다.");
  process.exit(1);
}

const pascal = slug
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("");
const route = `${category}/${slug}`;
const articleDir = path.join("src", "pages", "articles", category, slug);
const articleFile = path.join("src", "pages", "articles", category, `${slug}.tsx`);
const vizFile = path.join(articleDir, "viz", `${pascal}Viz.tsx`);
const registrationFile = path.join("src", "content", "registrations", `${slug}.ts`);

function writeIfMissing(file, content) {
  if (fs.existsSync(file)) {
    console.log(`skip (exists): ${file}`);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`created: ${file}`);
}

writeIfMissing(
  articleFile,
  `import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ${pascal}Viz from "./${slug}/viz/${pascal}Viz";

/**
 * ${title}
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * - 제목(h2)은 그 절의 결론 한 문장. 첫 문단은 결론을 다시 말한다(두괄식).
 * - 한 문단 = 한 생각, 260자 이하. 문단 사이는 비워 두고 목록은 본문 안에 쓰지 않는다.
 * - 처음 나오는 용어는 그 자리에서 풀어 쓴다. 수치 예를 최소 한 번 든다.
 */
export default function ${pascal}Article() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 결론형 제목: 이 글이 답하는 질문</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">TODO 한 문단 결론. 왜 이 개념이 필요한지, 어떤 문제에서 등장하는지.</p>
          <p>TODO 전체 구조 예고. 이어지는 절이 어떤 순서로 무엇을 보여 주는지.</p>
        </div>
        <${pascal}Viz />
        <ContentBoundary article="${slug}" />
      </section>

      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 핵심 mechanism 을 결론으로 말하는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO claim → 이유 → 작은 수치 예 → 한계 → 다음 질문.</p>
        </div>
        <ExplainedFormula
          question="TODO 이 식이 답하는 질문"
          idea="TODO 왜 이런 형태인지"
          formula={String.raw\`TODO\`}
          annotatedFormula={String.raw\`\\underbrace{TODO}_{\\text{역할}}\`}
          operations={[{ expression: String.raw\`TODO\`, annotation: ["식의 실제 기호를 써서", "무엇을 결합·누적·정규화하는지"] }]}
          terms={[{ symbol: "TODO", name: "이름", description: "역할" }]}
          assumptions={["성립 전제"]}
          interpretation="식에서 읽어야 할 결과와 읽으면 안 되는 과도한 결론"
        />
      </section>

      <section id="procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 절차가 있는 개념이면 pseudocode 로 닫는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO</p>
        </div>
        <AlgorithmBlock
          title="TODO 절차 이름"
          input={["TODO 입력"]}
          steps={[{ code: "TODO 단계", note: "왜 이 단계가 필요한지" }]}
          output="TODO 출력"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 한계·비교·선택 기준을 결론으로 말하는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO</p>
        </div>
        <TermBreakdown
          title="TODO 이미 설명한 것을 비교·참조용으로 정리"
          items={[{ term: "TODO", description: "설명", example: "예", boundary: "경계" }]}
        />
        <ProgressiveDetail title="TODO 독자가 열어서 답을 얻을 질문" preview="TODO 접힌 상태에서도 읽히는 결론 한 줄">
          <p>TODO 논문별 실험 조건·구현 차이처럼 첫 독해를 끊는 세부</p>
        </ProgressiveDetail>
      </section>

      <section id="paper-todo" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 근거 논문이 무엇을 보였고 무엇은 아닌지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO 논문이 해결한 문제 → 핵심 아이디어 → 전제 → 실험 범위 → 일반화하면 안 되는 결론.</p>
        </div>
        <CitationBlock source="TODO 저자 · 제목 (venue year)" citeKey={1} href="https://TODO">
          TODO 한 문단 요약과 경계
        </CitationBlock>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/${category}/TODO">TODO</Link>
        </p>
      </section>
    </div>
  );
}
`,
);

writeIfMissing(
  vizFile,
  `import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에는 한 mechanism 만. 각 장면은 원인 → 계산/상태 변화 → 결과 중 한 단계.
 * stage 높이는 모든 장면의 최대 필요 크기로 고정하고(h-[min(...)] 아래 참고),
 * control row 는 stage 아래 고정 row 에 둔다. gradient·glow·shadow·굵은 선 금지.
 */
const SCENES = ["TODO 장면 1", "TODO 장면 2", "TODO 장면 3", "TODO 장면 4"] as const;

const NOTES = [
  "TODO 장면 1 에서 독자가 읽어야 할 한 문장",
  "TODO 장면 2",
  "TODO 장면 3",
  "TODO 장면 4",
] as const;

export default function ${pascal}Viz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  return (
    <VizFrame
      eyebrow="TODO 개념 이름"
      title="TODO 그림이 보여 주는 결론 한 문장"
      description="TODO 각 장면이 무엇의 상태인지"
      note="TODO 이 그림이 단순화한 것"
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="${title}"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          {/* TODO 장면별 diagram. SVG 를 쓰면 viewBox 고정, <text> 는 짧은 label 만, strokeWidth 1~1.25 */}
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={\`flex min-h-16 items-center justify-center border px-2 text-center text-xs font-bold \${
                  index <= scenes.active ? "border-primary/55 bg-primary/5 text-foreground" : "border-border bg-muted/40 text-muted-foreground"
                }\`}
              >
                TODO {index + 1}
              </div>
            ))}
          </div>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
`,
);

writeIfMissing(
  registrationFile,
  `/**
 * ${route} 등록 module — node scripts/merge-registrations.mjs ${registrationFile} 로 정본 파일에 병합한다.
 * 형식과 규칙은 docs/coverage-batch-playbook.md 참고. 병합은 멱등이므로 고친 뒤 다시 실행하면 된다.
 */
import type { KnowledgeConcept, KnowledgeEdge } from "../knowledge-graph";
import type { ArticleLearningContract } from "../article-learning";
import type { ArticleEvidenceItem } from "../article-evidence";
import type { EditorialBoundary } from "../editorial-ownership";
import type { Article } from "../types";

/** 새 canonical concept. id 는 kebab-case, label 은 업계 표준 영문(필요하면 ' · 한국어'), aliases 에 세션 목록의 원문 표기를 넣는다. */
export const CONCEPTS: Record<string, KnowledgeConcept> = {
  "todo-concept-id": {
    id: "todo-concept-id",
    kind: "concept",
    domain: "machine-learning",
    label: "TODO label",
    aliases: ["TODO 세션 목록 원문 표기"],
    definition: "TODO 한 문장 정의. 용어를 모르는 독자 기준, 무엇을 무엇으로 바꾸는지.",
    canonicalHref: "/${route}#mechanism",
  },
};

/** 새 concept 마다 최소 1개. 기존 node 와도 연결한다. reason 은 20자 이상. */
export const EDGES: KnowledgeEdge[] = [
  { from: "todo-existing-concept", to: "todo-concept-id", relation: "prerequisite", reason: "TODO 왜 이 관계인지" },
];

export const LEARNING: Record<string, ArticleLearningContract> = {
  "${route}": {
    entryNote: "TODO 독자가 무엇을 알고 들어오는지, 어디서 시작하는지",
    coreIdea: "TODO 글 전체를 한 문장으로",
    assumedKnowledge: [{ id: "todo-existing-concept", role: "TODO 이 글에서의 역할" }],
    introducedHere: [{ id: "todo-concept-id", role: "TODO 이 글에서 처음 설명하는 역할" }],
    conceptExplanations: [
      {
        id: "todo-concept-id",
        sectionId: "mechanism",
        intuition: "TODO 20자 이상 · 일상적 상황으로",
        workedExample: "TODO 20자 이상 · 작은 숫자를 넣은 예",
        boundary: "TODO 20자 이상 · 성립하지 않는 조건",
      },
    ],
    conceptStages: [
      { label: "00 문제", relation: "TODO", concepts: ["todo-concept-id"] },
    ],
    exercises: [
      { level: "basic", question: "TODO 20자 이상 질문 1", answerChecklist: ["핵심어 1", "핵심어 2"], requiredConcepts: ["todo-concept-id"], sectionId: "mechanism" },
      { level: "basic", question: "TODO 기초 2", answerChecklist: ["a", "b"], requiredConcepts: ["todo-concept-id"], sectionId: "mechanism" },
      { level: "basic", question: "TODO 기초 3", answerChecklist: ["a", "b"], requiredConcepts: ["todo-concept-id"], sectionId: "mechanism" },
      { level: "basic", question: "TODO 기초 4", answerChecklist: ["a", "b"], requiredConcepts: ["todo-concept-id"], sectionId: "procedure" },
      { level: "basic", question: "TODO 기초 5", answerChecklist: ["a", "b"], requiredConcepts: ["todo-concept-id"], sectionId: "boundary" },
      { level: "basic", question: "TODO 기초 6", answerChecklist: ["a", "b"], requiredConcepts: ["todo-concept-id"], sectionId: "boundary" },
      { level: "advanced", question: "TODO 심화 1", answerChecklist: ["a", "b", "c"], requiredConcepts: ["todo-concept-id"], sectionId: "boundary" },
      { level: "advanced", question: "TODO 심화 2", answerChecklist: ["a", "b", "c"], requiredConcepts: ["todo-concept-id"], sectionId: "boundary" },
      { level: "advanced", question: "TODO 심화 3", answerChecklist: ["a", "b", "c"], requiredConcepts: ["todo-concept-id"], sectionId: "procedure" },
      { level: "advanced", question: "TODO 심화 4", answerChecklist: ["a", "b", "c"], requiredConcepts: ["todo-concept-id"], sectionId: "mechanism" },
    ],
    papers: [
      {
        title: "TODO 논문 제목",
        href: "https://TODO",
        problem: "TODO 20자 이상",
        contribution: "TODO 20자 이상",
        assumptions: "TODO 20자 이상",
        evidenceScope: "TODO 20자 이상 · 저자 자기보고/독립 평가 · 기준일",
        notClaim: "TODO 20자 이상 · 일반화하면 안 되는 결론",
        sectionId: "paper-todo",
      },
    ],
  },
};

export const EVIDENCE: Record<string, readonly ArticleEvidenceItem[]> = {
  "${route}": [
    { kind: "핵심 논문", label: "TODO 논문 제목", href: "https://TODO", note: "TODO 무엇의 근거인지" },
  ],
};

export const OWNERSHIP: Record<string, EditorialBoundary> = {
  "${slug}": {
    title: "${title} 글이 소유하는 범위",
    owns: ["TODO 이 글이 정본으로 설명하는 것"],
    reuses: [{ label: "TODO 재사용하는 정본", href: "/${category}/TODO" }],
    evidence: [{ kind: "primary-source", rule: "TODO 어떤 주장을 어디까지만 하는지" }],
  },
};

export const CATALOG = {
  file: "${catalog}",
  ${after ? `after: "${after}",` : ""}
  entry: {
    slug: "${slug}",
    title: "${title}",
    subcategory: "${subcategory}",
    sections: [
      { id: "problem", title: "TODO" },
      { id: "mechanism", title: "TODO" },
      { id: "procedure", title: "TODO" },
      { id: "boundary", title: "TODO" },
      { id: "paper-todo", title: "TODO" },
    ],
    component: () => import("@/pages/articles/${category}/${slug}"),
  } satisfies Article,
};

/** 세션 개념 목록의 각 term 이 어떻게 처리됐는지. action: new | enrich | alias | existing | defer */
export const LEDGER = [
  { batch: "1560", term: "TODO 원문 term", action: "new", conceptId: "todo-concept-id", owner: "/${route}#mechanism", status: "done", reason: "TODO" },
];
`,
);

console.log(`\n다음 단계: 본문 작성 → node scripts/merge-registrations.mjs ${registrationFile} → scripts/check-article.sh ${route}`);
