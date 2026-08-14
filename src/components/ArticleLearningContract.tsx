import { Link } from "react-router-dom";
import {
  ARTICLE_LEARNING,
  getPaperReadingInternalHref,
  type ArticleLearningContract,
} from "@/content/article-learning";
import {
  getKnowledgeConcept,
  KNOWLEDGE_EDGES,
  type KnowledgeEdge,
} from "@/content/knowledge-graph";
import ArticleLessonFlowViz from "@/components/viz/ArticleLessonFlowViz";

const RELATION_LABEL: Record<KnowledgeEdge["relation"], string> = {
  prerequisite: "먼저 알아야 함",
  produces: "결과로 만듦",
  optimizes: "개선함",
  contrasts: "차이를 비교함",
  constrains: "가능한 범위를 제한함",
  evaluates: "효과를 평가함",
  extends: "더 구체적인 문제로 확장함",
};

function getStageEdges(contract: ArticleLearningContract, stageIndex: number) {
  const stages = getDisplayStages(contract);
  const current = new Set(stages[stageIndex].concepts);
  const seenThroughCurrent = new Set(
    stages.slice(0, stageIndex + 1).flatMap((stage) => [...stage.concepts]),
  );
  const allArticleConcepts = new Set(
    stages.flatMap((stage) => [...stage.concepts]),
  );
  const selected = KNOWLEDGE_EDGES.filter(
    (edge) =>
      (current.has(edge.from) || current.has(edge.to)) &&
      seenThroughCurrent.has(edge.from) &&
      seenThroughCurrent.has(edge.to),
  );
  const signatures = new Set(
    selected.map((edge) => `${edge.from}|${edge.to}|${edge.relation}`),
  );

  // 병렬로 시작하는 stage도 graph에서 고립돼 보이지 않도록, 현재까지의
  // 경로에 직접 닿지 않는 concept은 다음 stage 또는 외부 정본과의 실제
  // relation 하나를 함께 보여 줍니다.
  for (const conceptId of current) {
    if (
      selected.some((edge) => edge.from === conceptId || edge.to === conceptId)
    )
      continue;
    const candidates = KNOWLEDGE_EDGES.filter(
      (edge) => edge.from === conceptId || edge.to === conceptId,
    ).sort((left, right) => {
      const leftOther = left.from === conceptId ? left.to : left.from;
      const rightOther = right.from === conceptId ? right.to : right.from;
      const leftPriority = allArticleConcepts.has(leftOther) ? 0 : 1;
      const rightPriority = allArticleConcepts.has(rightOther) ? 0 : 1;
      return leftPriority - rightPriority;
    });
    const fallback = candidates[0];
    if (!fallback) continue;
    const signature = `${fallback.from}|${fallback.to}|${fallback.relation}`;
    if (!signatures.has(signature)) {
      selected.push(fallback);
      signatures.add(signature);
    }
  }

  return selected;
}

function getDisplayStages(contract: ArticleLearningContract) {
  const explicit = new Set(
    contract.conceptStages.flatMap((stage) => [...stage.concepts]),
  );
  const implicitPrerequisites = contract.assumedKnowledge
    .map((concept) => concept.id)
    .filter((conceptId) => !explicit.has(conceptId));

  if (implicitPrerequisites.length === 0) return contract.conceptStages;
  return [
    {
      label: "선수 개념",
      relation: "본문 흐름에 들어가기 전에 정본에서 확인",
      concepts: implicitPrerequisites,
    },
    ...contract.conceptStages,
  ];
}

function getFollowupEdges(contract: ArticleLearningContract) {
  const introduced = new Set(
    contract.introducedHere.map((concept) => concept.id),
  );
  const declared = new Set(
    [...contract.assumedKnowledge, ...contract.introducedHere].map(
      (concept) => concept.id,
    ),
  );
  const articleOrder = new Map(
    Object.keys(ARTICLE_LEARNING).map((route, index) => [route, index]),
  );
  const currentRoute = contract.introducedHere
    .map((concept) => getKnowledgeConcept(concept.id).canonicalHref)
    .map((href) => href.match(/^\/([^/#]+\/[^/#]+)/)?.[1])
    .find(Boolean);
  const byArticle = new Map<string, KnowledgeEdge>();

  for (const edge of KNOWLEDGE_EDGES) {
    if (!introduced.has(edge.from) || declared.has(edge.to)) continue;
    const target = getKnowledgeConcept(edge.to);
    const targetRoute = target.canonicalHref.match(/^\/([^/#]+\/[^/#]+)/)?.[1];
    if (
      !targetRoute ||
      targetRoute === currentRoute ||
      !ARTICLE_LEARNING[targetRoute]
    ) {
      continue;
    }
    if (!byArticle.has(targetRoute)) byArticle.set(targetRoute, edge);
  }

  return [...byArticle.entries()]
    .sort(
      ([left], [right]) =>
        (articleOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
        (articleOrder.get(right) ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, 6)
    .map(([, edge]) => edge);
}

function TermCard({
  id,
  role,
}: ArticleLearningContract["introducedHere"][number]) {
  const concept = getKnowledgeConcept(id);
  const body = (
    <>
      <strong className="block text-sm leading-6 text-foreground">
        {concept.label}
      </strong>
      <span className="mt-2 block text-sm leading-7 text-muted-foreground">
        {concept.definition}
      </span>
      <span className="mt-2 block text-sm leading-7 text-foreground/75">
        이 글에서의 역할: {role}
      </span>
      <span className="mt-3 block text-xs font-bold text-primary">
        정본 설명 열기 →
      </span>
    </>
  );

  return (
    <Link
      to={concept.canonicalHref}
      data-term-card
      className="min-w-0 rounded-lg border border-border/70 bg-background/70 p-4 transition-colors hover:border-primary/50 hover:bg-primary/[0.025] sm:p-5"
    >
      {body}
    </Link>
  );
}

export function ArticleLessonPrimer({
  contract,
}: {
  contract: ArticleLearningContract;
}) {
  const stages = getDisplayStages(contract);

  return (
    <section
      data-lesson-primer
      className="not-prose mb-10 overflow-hidden rounded-xl border border-border/70 bg-card"
      aria-label="본문을 이해하기 위한 수업 순서"
    >
      <div className="border-b border-border/60 bg-muted/20 p-5 sm:p-6">
        <p className="text-xs font-bold text-primary">본문에 들어가기 전에</p>
        <h2 className="mt-2 text-xl font-black leading-8 text-foreground">
          전체 흐름을 본 뒤, 낯선 개념을 하나씩 확대합니다
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/80">
          위쪽 지도에서 이 글의 개념명과 연결 순서를 먼저 한눈에 봅니다. 노드를
          선택하면 아래 스토리보드가 익숙한 장면, 정의, 앞뒤 형태, 작은 예와
          실패 경계를 함께 보여 줍니다. 재생 버튼은 같은 구조를 5컷으로 다시
          펼쳐 설명합니다.
        </p>
      </div>

      <ArticleLessonFlowViz
        stages={stages}
        explanations={contract.conceptExplanations}
      />

      <p className="border-t border-border/60 px-5 py-4 text-xs leading-5 text-muted-foreground sm:px-6">
        이제 아래 본문을 처음부터 읽습니다. 용어 사전·개념 그래프·연습문제는
        설명을 끊지 않도록 본문 뒤의 복습 영역으로 옮겼습니다.
      </p>
    </section>
  );
}

export default function ArticleLearningContractView({
  contract,
}: {
  contract: ArticleLearningContract;
}) {
  const displayStages = getDisplayStages(contract);
  const followupEdges = getFollowupEdges(contract);

  return (
    <section
      data-learning-contract
      className="not-prose mb-10 mt-16 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card [overflow-wrap:anywhere]"
      aria-label="본문을 읽은 뒤의 복습과 연습"
    >
      <div className="border-b border-border/60 bg-muted/20 p-4 sm:p-5">
        <p className="text-xs font-bold text-primary">본문을 읽은 뒤</p>
        <h2 className="mt-2 text-xl font-black leading-8 text-foreground">
          용어를 다시 연결하고 직접 설명해 봅니다
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-foreground/75">
          아래 영역은 수업 본문을 대신하는 요약이 아닙니다. 방금 읽은 흐름을
          용어·관계·예시·문제로 되짚고, 막힌 지점만 본문으로 돌아가기 위한 복습
          도구입니다.
        </p>
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        <section>
          <h2 className="text-sm font-bold text-foreground">
            {contract.entryLevel
              ? "선수 지식 없이 여기서 시작합니다"
              : "이 글 전에 알면 좋은 최소 선수 개념"}
          </h2>
          {contract.entryLevel ? (
            <p className="mt-4 max-w-xl text-xs leading-5 text-muted-foreground">
              {contract.entryNote ??
                "전문 용어나 수식을 알고 있다고 가정하지 않고, 일상적인 예시에서 시작해 이 글 안에서 필요한 기호와 계산으로 연결합니다."}
            </p>
          ) : (
            <div className="mt-4 grid gap-4">
              {contract.assumedKnowledge.map((item) => (
                <TermCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-sm font-bold text-foreground">
            이 글 안에서 처음 설명하는 용어
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
            각 용어를 넓은 카드에서 문장으로 다시 읽습니다. 정의와 이 글에서의
            역할을 구분하고, 필요할 때만 정본 설명으로 이동합니다.
          </p>
          <div className="mt-4 grid gap-4">
            {contract.introducedHere.map((item) => (
              <TermCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>

      <section className="border-t border-border/60 px-4 py-5 sm:px-6">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">개념 그래프</h2>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
              왼쪽에서 오른쪽으로 읽으면 이 글의 학습 순서입니다. 각 개념은 정본
              설명으로 바로 이동하며, 다른 글에서 같은 정의를 반복하지 않습니다.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="rounded border border-border/70 px-2 py-1">
              단계
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded border border-border/70 px-2 py-1">
              관계
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded border border-border/70 px-2 py-1">
              정본 개념
            </span>
          </div>
        </div>
        <div className="mt-4 divide-y divide-border/70">
          {displayStages.map((stage, index) => (
            <div
              key={stage.label}
              className="min-w-0 py-5 first:pt-0 last:pb-0"
            >
              <div className="grid min-w-0 gap-3 sm:grid-cols-[3rem_7rem_1fr] sm:items-start sm:gap-5">
                <span className="font-mono text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {stage.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {stage.relation}
                  </p>
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                  {stage.concepts.map((conceptId) => {
                    const concept = getKnowledgeConcept(conceptId);
                    return (
                      <Link
                        key={conceptId}
                        to={concept.canonicalHref}
                        className="rounded-md border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {concept.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 min-w-0 border-l border-border/80 pl-3 sm:ml-[12rem] sm:pl-4">
                <p className="text-[11px] font-bold text-foreground/70">
                  관계선과 연결 이유
                </p>
                <div className="mt-2 space-y-2.5">
                  {getStageEdges(contract, index).map((edge) => {
                    const from = getKnowledgeConcept(edge.from);
                    const to = getKnowledgeConcept(edge.to);
                    return (
                      <div
                        key={`${edge.from}|${edge.to}|${edge.relation}`}
                        className="min-w-0 text-xs leading-5 text-muted-foreground"
                      >
                        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                          <Link
                            to={from.canonicalHref}
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            {from.label}
                          </Link>
                          <span
                            className="text-foreground/55"
                            aria-hidden="true"
                          >
                            →
                          </span>
                          <span className="font-semibold text-primary">
                            {RELATION_LABEL[edge.relation]}
                          </span>
                          <span
                            className="text-foreground/55"
                            aria-hidden="true"
                          >
                            →
                          </span>
                          <Link
                            to={to.canonicalHref}
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            {to.label}
                          </Link>
                        </div>
                        <p className="mt-0.5">{edge.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        {followupEdges.length > 0 && (
          <div className="mt-5 border-t border-border/70 pt-5">
            <h3 className="text-xs font-bold text-foreground">
              이 글 다음에 확장할 정본
            </h3>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
              현재 글에서 만든 개념을 실제 선수 지식으로 사용하는 다음 글입니다.
              연결 이유를 보고 필요한 경로만 선택할 수 있습니다.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {followupEdges.map((edge) => {
                const from = getKnowledgeConcept(edge.from);
                const to = getKnowledgeConcept(edge.to);
                return (
                  <Link
                    key={`${edge.from}|${edge.to}|${edge.relation}`}
                    to={to.canonicalHref}
                    className="min-w-0 border-l border-border/80 pl-3 transition-colors hover:border-primary/60"
                  >
                    <p className="text-xs font-bold text-foreground">
                      {to.label} →
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-primary">
                      출발 개념 · {from.label} / 관계 ·{" "}
                      {RELATION_LABEL[edge.relation]}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {edge.reason}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-border/60 px-4 py-5 sm:px-6">
        <h2 className="text-sm font-bold text-foreground">
          처음 보는 개념을 이해하는 순서
        </h2>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
          정의부터 외우지 않습니다. 익숙한 상황과 작은 수치 예시를 먼저 본 뒤,
          본문에서 표준 용어와 수식으로 연결합니다. 적용되지 않는 경우까지
          설명해야 이 글의 개념 설명이 완료됩니다.
        </p>
        <div className="mt-4 space-y-4">
          {contract.conceptExplanations.map((explanation) => {
            const concept = getKnowledgeConcept(explanation.id);
            return (
              <article
                key={explanation.id}
                className="min-w-0 rounded-lg border border-border/70 bg-muted/10 p-4"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                      {concept.kind === "theorem" ? "정리" : "새 개념"}
                    </p>
                    <h3 className="mt-1 break-words text-sm font-bold text-foreground">
                      {concept.label}
                    </h3>
                  </div>
                  <a
                    href={`#${explanation.sectionId}`}
                    className="shrink-0 text-xs font-bold text-foreground/70 hover:text-primary"
                  >
                    본문 ↓
                  </a>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {explanation.intuition}
                </p>
                <div className="mt-4 border-t border-border/60 pt-4 text-sm leading-7 text-muted-foreground">
                  <dl className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <dt className="font-bold text-foreground">숫자로 확인</dt>
                      <dd className="mt-0.5">{explanation.workedExample}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">적용 경계</dt>
                      <dd className="mt-0.5">{explanation.boundary}</dd>
                    </div>
                    {explanation.proofIdea && (
                      <div>
                        <dt className="font-bold text-foreground">
                          증명 아이디어
                        </dt>
                        <dd className="mt-0.5">{explanation.proofIdea}</dd>
                      </div>
                    )}
                    {explanation.counterexample && (
                      <div>
                        <dt className="font-bold text-foreground">
                          전제가 깨지는 예
                        </dt>
                        <dd className="mt-0.5">{explanation.counterexample}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/60 px-4 py-5 sm:px-6">
        <h2 className="text-sm font-bold text-foreground">
          이 글만으로 풀어야 하는 연습문제
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          문제와 정답 체크리스트를 먼저 만들고, 각 항목을 설명하는 본문
          section을 연결합니다. 기본과 심화 중 하나라도 비면 글은 완료되지
          않습니다.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {(["basic", "advanced"] as const).map((level) => (
            <section key={level}>
              <h3 className="text-xs font-bold text-primary">
                {level === "basic" ? "기초 문제" : "심화 문제"}
              </h3>
              <ol className="mt-3 space-y-5 text-xs leading-5 text-muted-foreground">
                {contract.exercises
                  .filter((exercise) => exercise.level === level)
                  .map((exercise, index) => (
                    <li
                      key={exercise.question}
                      className="border-l border-border/80 pl-3"
                    >
                      <a
                        href={`#${exercise.sectionId}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {index + 1}. {exercise.question} ↓
                      </a>
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold text-foreground/70">
                          정답 체크리스트
                        </summary>
                        <ul className="mt-2 space-y-1.5 pl-4">
                          {exercise.answerChecklist.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </section>

      {contract.papers && contract.papers.length > 0 && (
        <section className="border-t border-border/60 px-4 py-5 sm:px-6">
          <h2 className="text-sm font-bold text-foreground">
            근거 논문을 따라 읽는 내부 해설 경로
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contract.papers.map((paper) => (
              <div
                key={`${paper.sectionId}-${paper.href}`}
                className="min-w-0 border-t border-border/80 pt-3"
              >
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {paper.title} 원문 ↗
                </a>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {paper.contribution}
                </p>
                <details className="mt-2 text-xs leading-5 text-muted-foreground">
                  <summary className="cursor-pointer font-semibold text-foreground/75">
                    전제와 근거 범위
                  </summary>
                  <dl className="mt-2 space-y-2 border-l border-border/80 pl-3">
                    <div>
                      <dt className="font-bold text-foreground">문제</dt>
                      <dd>{paper.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">전제</dt>
                      <dd>{paper.assumptions}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">근거 범위</dt>
                      <dd>{paper.evidenceScope}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">
                        말하지 않는 것
                      </dt>
                      <dd>{paper.notClaim}</dd>
                    </div>
                  </dl>
                </details>
                <Link
                  to={getPaperReadingInternalHref(paper)}
                  className="mt-1.5 block text-xs font-bold text-foreground/75 hover:text-primary"
                >
                  내부 논문 해설로 이동 →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
