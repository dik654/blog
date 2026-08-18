import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  ConceptExplanationContract,
  LearningConceptStage,
} from "@/content/article-learning";
import { getKnowledgeConcept } from "@/content/knowledge-graph";

const REVEAL_LABELS = ["장면", "정의", "형태", "예시", "경계"] as const;

type ShapeKind = "input" | "process" | "decision" | "store" | "state";

interface VisualConcept {
  id: string;
  label: string;
  definition: string;
}

function shapeKind(concept: VisualConcept): ShapeKind {
  const source =
    `${concept.id} ${concept.label} ${concept.definition}`.toLowerCase();
  if (
    /receipt|artifact|record|cache|memory|database|store|storage|ledger|dataset|log|snapshot/.test(
      source,
    )
  ) {
    return "store";
  }
  if (
    /gate|validation|verify|verification|approval|policy|condition|threshold|release|admission|decision|판정|검증|선택/.test(
      source,
    )
  ) {
    return "decision";
  }
  if (
    /update|pass|training|transform|execution|encoding|decoding|aggregation|schedule|optimizer|backprop|process/.test(
      source,
    )
  ) {
    return "process";
  }
  if (
    /input|feature|target|token|message|request|vector|tensor|parameter|data/.test(
      source,
    )
  ) {
    return "input";
  }
  return "state";
}

function ConceptGlyph({
  concept,
  index,
  selected = false,
  large = false,
}: {
  concept: VisualConcept;
  index: number | string;
  selected?: boolean;
  large?: boolean;
}) {
  const kind = shapeKind(concept);
  const shapeClass = selected
    ? "fill-primary/10 stroke-primary"
    : "fill-background stroke-border";
  const textClass = selected ? "fill-primary" : "fill-muted-foreground";

  return (
    <svg
      data-concept-glyph={kind}
      viewBox="0 0 72 56"
      role="img"
      aria-label={`${concept.label} · ${kind}`}
      className={large ? "h-16 w-20 sm:h-20 sm:w-24" : "h-10 w-12 sm:h-14 sm:w-[4.5rem]"}
    >
      <title>{concept.label}</title>
      {kind === "input" ? (
        <polygon
          points="13,8 67,8 59,48 5,48"
          className={shapeClass}
          strokeWidth="1.25"
        />
      ) : null}
      {kind === "process" ? (
        <circle
          cx="36"
          cy="28"
          r="22"
          className={shapeClass}
          strokeWidth="1.25"
        />
      ) : null}
      {kind === "decision" ? (
        <polygon
          points="36,5 68,28 36,51 4,28"
          className={shapeClass}
          strokeWidth="1.25"
        />
      ) : null}
      {kind === "store" ? (
        <g className={shapeClass} strokeWidth="1.25">
          <path d="M10 15v26c0 5 12 9 26 9s26-4 26-9V15" />
          <ellipse cx="36" cy="15" rx="26" ry="9" />
          <path d="M10 29c0 5 12 9 26 9s26-4 26-9" fill="none" />
        </g>
      ) : null}
      {kind === "state" ? (
        <rect
          x="7"
          y="9"
          width="58"
          height="38"
          rx="9"
          className={shapeClass}
          strokeWidth="1.25"
        />
      ) : null}
      <text
        x="36"
        y="31"
        textAnchor="middle"
        className={`${textClass} font-mono text-[10px] font-black`}
      >
        {typeof index === "number" ? String(index).padStart(2, "0") : index}
      </text>
    </svg>
  );
}

function FlowArrow({
  active = false,
  compact = false,
}: {
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.svg
      data-flow-arrow
      viewBox="0 0 48 14"
      aria-hidden="true"
      className={compact ? "h-3 w-5 shrink-0" : "h-4 w-10 shrink-0"}
    >
      <motion.path
        d="M2 7H40"
        fill="none"
        className="stroke-muted-foreground/55"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        animate={active ? { strokeDashoffset: [8, 0] } : undefined}
        transition={
          active ? { duration: 0.8, repeat: Infinity, ease: "linear" } : undefined
        }
      />
      <path
        d="m34 2 7 5-7 5"
        fill="none"
        className="stroke-primary/70"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function FlowShape({
  concept,
  index,
  caption,
  selected = false,
}: {
  concept: VisualConcept;
  index: number | string;
  caption: string;
  selected?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">
        {caption}
      </p>
      <ConceptGlyph concept={concept} index={index} selected={selected} large />
      <p
        className={`max-w-40 break-words text-xs font-bold leading-5 ${selected ? "text-primary" : "text-foreground/75"}`}
      >
        {concept.label}
      </p>
    </div>
  );
}

export default function ArticleLessonFlowViz({
  stages,
  explanations,
}: {
  stages: readonly LearningConceptStage[];
  explanations: readonly ConceptExplanationContract[];
}) {
  const conceptSteps = useMemo(() => {
    const seen = new Set<string>();
    return stages.flatMap((stage) =>
      stage.concepts.flatMap((id) => {
        if (seen.has(id)) return [];
        seen.add(id);
        return [
          {
            id,
            stage,
            concept: getKnowledgeConcept(id),
            explanation: explanations.find((candidate) => candidate.id === id),
          },
        ];
      }),
    );
  }, [explanations, stages]);

  const stageGroups = useMemo(
    () =>
      stages
        .map((stage, stageIndex) => ({
          stage,
          stageIndex,
          steps: conceptSteps
            .map((candidate, index) => ({ candidate, index }))
            .filter(({ candidate }) => candidate.stage === stage),
        }))
        .filter(({ steps }) => steps.length > 0),
    [conceptSteps, stages],
  );

  const [active, setActive] = useState(0);
  // 한눈에 보는 지도를 우선한다. 재생을 시작할 때만 5컷을 다시 펼친다.
  const [reveal, setReveal] = useState(4);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const safeActive = Math.min(active, Math.max(conceptSteps.length - 1, 0));
  const step = conceptSteps[safeActive];
  const previous = conceptSteps[safeActive - 1]?.concept;
  const next = conceptSteps[safeActive + 1]?.concept;

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const timer = window.setTimeout(() => {
      if (reveal < 4) {
        setReveal((current) => current + 1);
        return;
      }
      if (safeActive < conceptSteps.length - 1) {
        setActive((current) => current + 1);
        setReveal(0);
        return;
      }
      setPlaying(false);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [conceptSteps.length, playing, reduceMotion, reveal, safeActive]);

  const selectConcept = (index: number) => {
    setPlaying(false);
    setActive(index);
    setReveal(4);
  };

  const moveBackward = () => {
    setPlaying(false);
    if (reveal > 0) {
      setReveal((current) => current - 1);
      return;
    }
    if (safeActive > 0) {
      setActive((current) => current - 1);
      setReveal(4);
    }
  };

  const moveForward = () => {
    setPlaying(false);
    if (reveal < 4) {
      setReveal((current) => current + 1);
      return;
    }
    if (safeActive < conceptSteps.length - 1) {
      setActive((current) => current + 1);
      setReveal(4);
    }
  };

  const togglePlayback = () => {
    if (reduceMotion) return;
    if (playing) {
      setPlaying(false);
      return;
    }
    if (reveal === 4) {
      if (safeActive < conceptSteps.length - 1) {
        setActive((current) => current + 1);
      } else {
        setActive(0);
      }
      setReveal(0);
    }
    setPlaying(true);
  };

  const handleKeyboardNavigation = (
    event: ReactKeyboardEvent<HTMLElement>,
  ) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveForward();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBackward();
      return;
    }
    if (event.key === " " && event.target === event.currentTarget) {
      event.preventDefault();
      togglePlayback();
    }
  };

  if (!step) return null;

  return (
    <figure
      data-viz="lesson-flow-v4"
      data-viz-keyboard
      tabIndex={0}
      onKeyDown={handleKeyboardNavigation}
      aria-keyshortcuts="ArrowLeft ArrowRight Space"
      aria-describedby="lesson-flow-keyboard-help"
      className="not-prose border-y border-border/60 bg-background/65 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-primary/70"
      aria-label="전체 개념 지도와 선택 개념의 애니메이션 설명"
    >
      <figcaption className="flex flex-col gap-2 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold text-primary">CONCEPT FLOW MAP</p>
          <h3 className="mt-1 text-base font-bold text-foreground">
            전체 흐름을 먼저 보고, 한 노드씩 확대합니다
          </h3>
        </div>
        <p className="max-w-lg text-xs leading-5 text-muted-foreground">
          위 지도에는 이 글의 실제 개념명과 연결 순서가 항상 보입니다. 노드를
          고르면 아래 스토리보드가 장면·정의·형태·예시·경계를 함께 보여 줍니다.
        </p>
      </figcaption>

      <div data-viz-canvas className="min-w-0 px-4 py-5 sm:px-6 sm:py-6">
        <div
          data-lesson-overview-map
          className="overflow-hidden rounded-xl border border-border/65 bg-card"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/55 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                Always-visible map
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground/75">
                {stageGroups.length}개 단계 · {conceptSteps.length}개 개념
              </p>
            </div>
            <div
              data-shape-legend
              className="hidden flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[9px] text-muted-foreground sm:flex"
            >
              <span>▱ 입력</span>
              <span>○ 처리</span>
              <span>◇ 판정</span>
              <span>▰ 기록</span>
              <span>▢ 상태</span>
            </div>
          </div>

          <div role="tablist" aria-label="이 글의 전체 개념 지도">
            {stageGroups.map(({ stage, stageIndex, steps }, groupIndex) => (
              <section
                key={`${stage.label}-${stageIndex}`}
                data-lesson-stage
                className="relative grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 border-b border-border/55 px-3 py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-4 sm:py-4 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black text-primary">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs font-black leading-5 text-foreground">
                      {stage.label}
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                    {stage.relation}
                  </p>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {steps.map(({ candidate, index }, conceptIndex) => {
                    const selected = index === safeActive;
                    return (
                      <div
                        key={candidate.id}
                        className="flex min-w-0 items-center gap-2"
                      >
                        {conceptIndex > 0 ? (
                          <FlowArrow
                            compact
                            active={playing && index === safeActive}
                          />
                        ) : null}
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          aria-label={`${index + 1}. ${candidate.concept.label}`}
                          onClick={() => selectConcept(index)}
                          className={`relative flex w-[5.25rem] min-w-0 flex-col items-center rounded-lg px-1 py-1 text-center transition-colors sm:w-[7.25rem] sm:px-1.5 ${
                            selected
                              ? "bg-primary/[0.065] text-primary"
                              : "text-foreground hover:bg-muted/35"
                          }`}
                        >
                          {selected ? (
                            <motion.span
                              layoutId="lesson-active-node"
                              className="absolute -left-1 -top-1 size-2.5 rounded-full bg-primary"
                              animate={
                                reduceMotion
                                  ? undefined
                                  : {
                                      scale: [1, 1.45, 1],
                                      opacity: [1, 0.55, 1],
                                    }
                              }
                              transition={{ duration: 1.8, repeat: Infinity }}
                            />
                          ) : null}
                          <ConceptGlyph
                            concept={candidate.concept}
                            index={index + 1}
                            selected={selected}
                          />
                          <span className="-mt-1 block break-words text-[10px] font-bold leading-4">
                            {candidate.concept.label}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {groupIndex < stageGroups.length - 1 ? (
                  <div
                    data-stage-flow-arrow
                    className="col-span-full hidden justify-center pt-1 md:flex"
                    aria-hidden="true"
                  >
                    <span className="rotate-90">
                      <FlowArrow
                        compact
                        active={playing && step.stage === stage}
                      />
                    </span>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <details
          data-concept-detail
          className="group mt-4 rounded-xl border border-border/65 bg-muted/[0.1]"
        >
          <summary className="cursor-pointer list-none px-4 py-4 marker:hidden sm:px-5">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black text-primary">
                  FOCUS {String(safeActive + 1).padStart(2, "0")} · {step.stage.label}
                </p>
                <p className="mt-1 break-words text-sm font-black leading-6 text-foreground">
                  {step.concept.label}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {step.concept.definition}
                </p>
              </div>
              <span className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground group-open:text-primary">
                <span className="group-open:hidden">자세히 보기</span>
                <span className="hidden group-open:inline">접기</span>
              </span>
            </div>
          </summary>

        <motion.div
          key={step.id}
          data-concept-step={step.id}
          role="tabpanel"
          layout="size"
          className="min-w-0 overflow-hidden border-t border-border/65 bg-muted/[0.1]"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: "easeOut" }
          }
        >
          <div className="flex flex-col gap-3 border-b border-border/55 bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black text-primary">
                FOCUS {String(safeActive + 1).padStart(2, "0")} ·{" "}
                {step.stage.label}
              </p>
              <h4 className="mt-1 break-words text-lg font-black leading-7 text-foreground">
                {step.concept.label}
              </h4>
            </div>
            <div
              className="grid grid-cols-5 gap-1.5"
              aria-label="현재 개념의 설명 단계"
            >
              {REVEAL_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setReveal(index);
                  }}
                  className={`rounded-md border px-2 py-1.5 text-[10px] font-bold transition-colors ${
                    index <= reveal
                      ? "border-primary/40 bg-primary/[0.055] text-primary"
                      : "border-border/55 bg-background text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div data-concept-storyboard className="min-w-0 p-4 sm:p-5">
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
              <motion.section
                data-concept-intuition
                className="relative min-w-0 overflow-hidden rounded-xl border border-primary/30 bg-primary/[0.04] p-4 [overflow-wrap:anywhere] sm:p-5"
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  className="absolute right-3 top-3 flex gap-1"
                  aria-hidden="true"
                >
                  <span className="size-1.5 rounded-full bg-primary/65" />
                  <span className="size-1.5 rounded-full bg-primary/30" />
                  <span className="size-1.5 rounded-full bg-primary/15" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                  먼저 볼 장면
                </p>
                <p className="mt-3 text-sm font-semibold leading-7 text-foreground/85">
                  {step.explanation?.intuition ?? step.stage.relation}
                </p>
              </motion.section>

              <motion.div
                className="flex items-center justify-center"
                aria-hidden="true"
                animate={
                  playing && !reduceMotion
                    ? { x: [-3, 3, -3], opacity: [0.45, 1, 0.45] }
                    : undefined
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <span className="rotate-90 lg:rotate-0">
                  <FlowArrow active={playing} />
                </span>
              </motion.div>

              <AnimatePresence initial={false}>
                {reveal >= 1 ? (
                  <motion.section
                    key={`${step.id}-definition`}
                    data-concept-definition
                    className="min-w-0 rounded-xl border border-border/65 bg-background p-4 [overflow-wrap:anywhere] sm:p-5"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.28 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                      이 장면의 개념
                    </p>
                    <div className="mt-3 flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/[0.06] font-mono text-[10px] font-black text-primary">
                        {String(safeActive + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h5 className="break-words text-lg font-black leading-7 text-foreground">
                          {step.concept.label}
                        </h5>
                        <p className="mt-1.5 text-sm leading-7 text-foreground/75">
                          {step.concept.definition}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ) : (
                  <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-border/65 bg-background px-4 text-center text-xs leading-5 text-muted-foreground">
                    장면을 먼저 본 뒤 ‘정의’ 컷에서 이름을 연결합니다.
                  </div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
              {reveal >= 2 ? (
                <motion.div
                  key={`${step.id}-shape`}
                  data-concept-shape
                  className="mt-3 flex min-w-0 flex-col items-center gap-2 rounded-xl border border-border/60 bg-background p-4 sm:flex-row sm:justify-center"
                  aria-label={`${step.concept.label}의 전체 연결 위치`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <FlowShape
                    concept={
                      previous ?? {
                        id: "scene-input",
                        label: "출발 장면과 관찰",
                        definition:
                          "현재 개념을 필요하게 만든 입력 장면입니다.",
                      }
                    }
                    index={safeActive > 0 ? safeActive : "IN"}
                    caption="Before"
                  />
                  <span className="rotate-90 self-center sm:rotate-0">
                    <FlowArrow active={playing} />
                  </span>
                  <FlowShape
                    concept={step.concept}
                    index={safeActive + 1}
                    caption="Now"
                    selected
                  />
                  <span className="rotate-90 self-center sm:rotate-0">
                    <FlowArrow active={playing} />
                  </span>
                  <FlowShape
                    concept={
                      next ?? {
                        id: "composition-output",
                        label: "전체 메커니즘에서 조합",
                        definition: "각 개념을 이해한 뒤 연결한 결과입니다.",
                      }
                    }
                    index={next ? safeActive + 2 : "OUT"}
                    caption="Next"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {reveal >= 3 ? (
                  <motion.section
                    key={`${step.id}-example`}
                    data-concept-example
                    className="min-w-0 border-l border-primary/50 bg-background px-4 py-3 [overflow-wrap:anywhere]"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                      작은 예
                    </p>
                    <p className="mt-1.5 text-xs leading-6 text-foreground/75">
                      {step.explanation?.workedExample ??
                        "가장 작은 입력 하나가 이 개념을 지나 어떤 결과가 되는지 확인합니다."}
                    </p>
                  </motion.section>
                ) : null}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {reveal >= 4 ? (
                  <motion.section
                    key={`${step.id}-boundary`}
                    data-concept-boundary
                    className="min-w-0 border-l border-amber-600/50 bg-background px-4 py-3 [overflow-wrap:anywhere]"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                      적용 경계
                    </p>
                    <p className="mt-1.5 text-xs leading-6 text-foreground/75">
                      {step.explanation?.boundary ??
                        "이 개념 하나의 성공을 뒤 단계 전체의 성공으로 확대하지 않습니다."}
                    </p>
                  </motion.section>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-border/60 bg-background px-4 py-4 sm:px-5">
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary/70"
                animate={{
                  width: `${((safeActive * 5 + reveal + 1) / (conceptSteps.length * 5)) * 100}%`,
                }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                개념 {safeActive + 1}/{conceptSteps.length} · 컷 {reveal + 1}/5
              </p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={moveBackward}
                  disabled={safeActive === 0 && reveal === 0}
                  className="rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
                >
                  ← 이전 컷
                </button>
                <button
                  data-viz-play
                  type="button"
                  disabled={Boolean(reduceMotion)}
                  onClick={togglePlayback}
                  className="rounded-md border border-primary/35 bg-primary/[0.045] px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reduceMotion
                    ? "모션 줄이기 적용됨"
                    : playing
                      ? "일시정지"
                      : "흐름 재생"}
                </button>
                <button
                  type="button"
                  onClick={moveForward}
                  disabled={
                    safeActive === conceptSteps.length - 1 && reveal === 4
                  }
                  className="rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
                >
                  다음 컷 →
                </button>
              </div>
            </div>
            <p
              id="lesson-flow-keyboard-help"
              className="mt-3 text-center text-[10px] leading-5 text-muted-foreground sm:text-right"
            >
              키보드 · <kbd className="font-mono font-bold">←</kbd> 이전 컷 ·{" "}
              <kbd className="font-mono font-bold">→</kbd> 다음 컷 ·{" "}
              <kbd className="font-mono font-bold">Space</kbd> 재생/일시정지
            </p>
          </div>
        </motion.div>
        </details>
      </div>

      <p
        data-concept-composition
        className="border-t border-border/60 px-5 py-4 text-xs leading-5 text-muted-foreground sm:px-6"
      >
        위 지도에서 전체 위치를 먼저 확인하고, 낯선 노드만 확대해 읽습니다. 각
        개념을 설명할 수 있게 된 뒤 아래 본문에서 하나의 메커니즘으로
        조합합니다.
      </p>
    </figure>
  );
}
