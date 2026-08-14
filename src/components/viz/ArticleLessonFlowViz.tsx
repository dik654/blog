import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  ConceptExplanationContract,
  LearningConceptStage,
} from "@/content/article-learning";
import { getKnowledgeConcept } from "@/content/knowledge-graph";

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

  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(0);
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
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [conceptSteps.length, playing, reduceMotion, reveal, safeActive]);

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
      setReveal(0);
    }
  };

  if (!step) return null;

  return (
    <figure
      data-viz="lesson-flow-v3"
      className="not-prose border-y border-border/60 bg-background/65"
      aria-label="새 용어를 하나씩 이해하는 수업 흐름"
    >
      <figcaption className="flex flex-col gap-2 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold text-primary">
            ONE CONCEPT AT A TIME
          </p>
          <h3 className="mt-1 text-base font-bold text-foreground">
            용어 하나를 이해한 뒤에만 다음 용어로 넘어갑니다
          </h3>
        </div>
        <p className="max-w-md text-xs leading-5 text-muted-foreground">
          정의 → 필요한 이유 → 작은 형태 → 실패 경계를 먼저 보고, 모든
          구성요소를 확인한 뒤 본문에서 조합합니다.
        </p>
      </figcaption>

      <div
        data-viz-canvas
        className="grid min-w-0 gap-4 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[15rem_minmax(0,1fr)]"
      >
        <div className="space-y-2" role="tablist" aria-label="이 글의 새 용어">
          {conceptSteps.map((candidate, index) => {
            const selected = index === safeActive;
            return (
              <button
                key={candidate.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setPlaying(false);
                  setActive(index);
                  setReveal(0);
                }}
                className={`grid w-full min-w-0 grid-cols-[2rem_1fr_auto] items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  selected
                    ? "border-primary/55 bg-primary/[0.055]"
                    : "border-border/65 bg-background hover:border-primary/30"
                }`}
              >
                <span className="font-mono text-[11px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words text-xs font-bold leading-5 text-foreground">
                  장면 {String(index + 1).padStart(2, "0")} 보기
                </span>
                <span
                  className="text-[10px] text-muted-foreground"
                  aria-hidden="true"
                >
                  {selected ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={step.id}
          data-concept-step={step.id}
          role="tabpanel"
          className="min-w-0 rounded-xl border border-border/65 bg-muted/[0.12] p-4 sm:p-5"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <p className="font-mono text-[11px] font-black text-primary">
            SCENE {String(safeActive + 1).padStart(2, "0")}
          </p>

          <div
            className="mt-3 grid grid-cols-5 gap-1.5"
            aria-label="현재 용어의 설명 단계"
          >
            {["장면", "정의", "형태", "예시", "경계"].map((label, index) => (
              <div
                key={label}
                className={`rounded-md border px-1.5 py-2 text-center text-[10px] font-bold transition-colors ${
                  index <= reveal
                    ? "border-primary/40 bg-primary/[0.055] text-primary"
                    : "border-border/55 bg-background text-muted-foreground"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <motion.section
            data-concept-intuition
            className="mt-3 min-w-0 rounded-lg border border-primary/25 bg-primary/[0.035] p-4 [overflow-wrap:anywhere] sm:p-5"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[11px] font-bold text-primary">먼저 볼 장면</p>
            <p className="mt-1.5 text-sm leading-7 text-foreground/85">
              {step.explanation?.intuition ?? step.stage.relation}
            </p>
            {reveal === 0 ? (
              <p className="mt-3 border-t border-primary/15 pt-3 text-xs leading-5 text-muted-foreground">
                아직 용어 이름은 외우지 않습니다. 이 장면에서 무엇을 구분해야
                하는지 먼저 떠올린 뒤 다음 컷을 엽니다.
              </p>
            ) : null}
          </motion.section>

          <AnimatePresence initial={false}>
            {reveal >= 1 ? (
              <motion.section
                key={`${step.id}-definition`}
                data-concept-definition
                className="mt-4 min-w-0 rounded-lg border border-border/60 bg-background p-4 [overflow-wrap:anywhere] sm:p-5"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-[11px] font-bold text-muted-foreground">
                  이 장면에 붙이는 이름
                </p>
                <h4 className="mt-1 text-xl font-black leading-8 text-foreground">
                  {step.concept.label}
                </h4>
                <p className="mt-2 text-sm leading-7 text-foreground/80">
                  {step.concept.definition}
                </p>
              </motion.section>
            ) : null}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {reveal >= 2 ? (
              <motion.div
                key={`${step.id}-shape`}
                data-concept-shape
                className="mt-4 grid min-w-0 gap-2 rounded-lg border border-border/60 bg-background p-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch"
                aria-label={`${step.concept.label}의 앞뒤 관계`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <div className="rounded-md border border-border/55 bg-muted/10 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground">
                    이전 질문
                  </p>
                  <p className="mt-1 break-words text-xs font-semibold leading-5 text-foreground/75">
                    {previous ? "앞 장면에서 확인한 조건" : "출발 장면과 관찰"}
                  </p>
                </div>
                <span
                  className="self-center text-center text-muted-foreground"
                  aria-hidden="true"
                >
                  →
                </span>
                <div className="rounded-md border border-primary/35 bg-primary/[0.045] p-3">
                  <p className="text-[10px] font-bold text-primary">
                    지금 이해할 형태
                  </p>
                  <p className="mt-1 break-words text-xs font-black leading-5 text-foreground">
                    {step.concept.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    {step.stage.relation}
                  </p>
                </div>
                <span
                  className="self-center text-center text-muted-foreground"
                  aria-hidden="true"
                >
                  →
                </span>
                <div className="rounded-md border border-border/55 bg-muted/10 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground">
                    다음에 연결할 것
                  </p>
                  <p className="mt-1 break-words text-xs font-semibold leading-5 text-foreground/75">
                    {next
                      ? "다음 개념의 출발 장면"
                      : "전체 메커니즘에서의 조합"}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {reveal >= 3 ? (
                <motion.section
                  key={`${step.id}-example`}
                  data-concept-example
                  className="min-w-0 rounded-lg border border-border/60 bg-background p-4 [overflow-wrap:anywhere]"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-[11px] font-bold text-primary">
                    작은 예로 형태 확인
                  </p>
                  <p className="mt-1.5 text-xs leading-6 text-foreground/75">
                    {step.explanation?.workedExample ??
                      "현재 글의 가장 작은 입력 하나가 이 개념을 지나 어떤 결과가 되는지 확인합니다."}
                  </p>
                </motion.section>
              ) : null}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {reveal >= 4 ? (
                <motion.section
                  key={`${step.id}-boundary`}
                  data-concept-boundary
                  className="min-w-0 rounded-lg border border-amber-600/25 bg-amber-500/[0.035] p-4 [overflow-wrap:anywhere]"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    아직 섞지 말아야 할 경계
                  </p>
                  <p className="mt-1.5 text-xs leading-6 text-foreground/75">
                    {step.explanation?.boundary ??
                      "이 개념 하나의 성공을 뒤 단계 전체의 성공으로 확대하지 않습니다."}
                  </p>
                </motion.section>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
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
                용어 {safeActive + 1}/{conceptSteps.length} · 컷 {reveal + 1}/5
              </p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={moveBackward}
                  disabled={safeActive === 0 && reveal === 0}
                  className="rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  ← 이전 컷
                </button>
                <button
                  data-viz-play
                  type="button"
                  disabled={Boolean(reduceMotion)}
                  onClick={() => setPlaying((current) => !current)}
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
                  className="rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  다음 컷 →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <p
        data-concept-composition
        className="border-t border-border/60 px-5 py-4 text-xs leading-5 text-muted-foreground sm:px-6"
      >
        위 용어를 각각 설명할 수 있게 된 뒤에만 아래 본문에서 서로 연결합니다.
        하나라도 낯설면 조합 문장을 외우지 말고 해당 용어 단계로 돌아갑니다.
      </p>
    </figure>
  );
}
