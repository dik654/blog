import { useMemo, useState } from "react";

type Mode = "dpo" | "cai" | "orpo" | "kto";

type Stage = {
  short: string;
  title: string;
  detail: string;
  shape: "document" | "pair" | "model" | "gate";
};

const FLOWS: Record<Mode, { eyebrow: string; question: string; stages: Stage[] }> = {
  dpo: {
    eyebrow: "DPO · fixed pair에서 direct policy update까지",
    question: "Reward model과 online rollout 없이 pair가 어떻게 policy loss가 될까요?",
    stages: [
      { short: "PAIR", title: "Chosen · rejected", detail: "같은 prompt에서 비교된 두 response", shape: "pair" },
      { short: "RATIO", title: "Policy / reference", detail: "각 response의 상대 log-ratio", shape: "model" },
      { short: "MARGIN", title: "Chosen − rejected", detail: "Reference 대비 선호 이동량의 차이", shape: "gate" },
      { short: "AUDIT", title: "Support 밖 검증", detail: "사실성·안전성·길이 shortcut 재평가", shape: "document" },
    ],
  },
  cai: {
    eyebrow: "Constitutional AI · 원칙에서 검증 가능한 feedback까지",
    question: "자연어 원칙은 어떻게 critique와 preference signal로 이어질까요?",
    stages: [
      { short: "RULE", title: "Constitution", detail: "허용·금지·충돌 우선순위를 기록", shape: "document" },
      { short: "LOOK", title: "Critique", detail: "초안이 위반한 원칙과 이유를 찾음", shape: "gate" },
      { short: "FIX", title: "Revision", detail: "지적한 위반을 고친 새 response", shape: "model" },
      { short: "CHECK", title: "AI + human audit", detail: "Judge 편향과 원칙 누락을 독립 검증", shape: "pair" },
    ],
  },
  orpo: {
    eyebrow: "ORPO · imitation과 preference separation을 한 stage에",
    question: "Chosen을 배우는 일과 rejected에서 멀어지는 일을 어떻게 함께 할까요?",
    stages: [
      { short: "PAIR", title: "Chosen · rejected", detail: "같은 prompt의 preference pair", shape: "pair" },
      { short: "IMITATE", title: "Chosen NLL", detail: "Chosen token likelihood를 높임", shape: "model" },
      { short: "SEPARATE", title: "Odds ratio", detail: "Chosen odds와 rejected odds를 벌림", shape: "gate" },
      { short: "VERIFY", title: "Single-stage audit", detail: "절감량과 quality regression을 함께 측정", shape: "document" },
    ],
  },
  kto: {
    eyebrow: "KTO · 짝 없는 feedback에서 비대칭 utility까지",
    question: "서로 짝지어지지 않은 좋아요·싫어요를 어떻게 학습할까요?",
    stages: [
      { short: "+ / −", title: "Binary label", detail: "Response별 desirable·undesirable 기록", shape: "document" },
      { short: "BASE", title: "KL reference point", detail: "Policy가 reference에서 이동한 기준점", shape: "model" },
      { short: "GAIN", title: "Asymmetric utility", detail: "좋은 답은 위로, 나쁜 답은 아래로 이동", shape: "gate" },
      { short: "BIAS", title: "Log audit", detail: "노출·무응답·class imbalance를 분리", shape: "pair" },
    ],
  },
};

function Shape({ stage, active }: { stage: Stage; active: boolean }) {
  const common = `relative grid h-20 w-20 place-items-center border text-center transition-colors motion-reduce:transition-none ${
    active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
  }`;

  if (stage.shape === "document") {
    return <div className={`${common} rounded-lg after:absolute after:right-2 after:top-2 after:h-3 after:w-3 after:border-b after:border-l after:border-current`}><span className="font-mono text-[11px] font-black">{stage.short}</span></div>;
  }
  if (stage.shape === "pair") {
    return (
      <div className="relative h-20 w-20" aria-hidden="true">
        <div className={`${common} absolute left-0 top-1 h-14 w-14 rounded-full`}><span className="font-mono text-[9px] font-black">A</span></div>
        <div className={`${common} absolute bottom-1 right-0 h-14 w-14 rounded-full`}><span className="font-mono text-[9px] font-black">B</span></div>
      </div>
    );
  }
  if (stage.shape === "gate") {
    return <div className={`${common} rotate-45 rounded-xl`}><span className="-rotate-45 font-mono text-[10px] font-black">{stage.short}</span></div>;
  }
  return <div className={`${common} rounded-full`}><span className="font-mono text-[10px] font-black">{stage.short}</span><span className="absolute inset-x-4 bottom-3 h-px bg-current" /></div>;
}

export default function AlignmentPipelineViz({ mode }: { mode: Mode }) {
  return <AlignmentPipeline key={mode} mode={mode} />;
}

function AlignmentPipeline({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const [active, setActive] = useState(0);
  const last = flow.stages.length - 1;
  const activeStage = flow.stages[active];
  const instructions = useMemo(() => "좌우 방향키 또는 Space로 다음 단계를 볼 수 있습니다.", []);

  function move(delta: number) {
    setActive((current) => (current + delta + flow.stages.length) % flow.stages.length);
  }

  return (
    <figure
      data-viz="alignment-method-pipeline"
      className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
      aria-label={`${flow.eyebrow}. ${instructions}`}
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-bold tracking-[0.16em] text-primary">{flow.eyebrow}</p>
        <p className="mt-2 text-sm font-semibold text-foreground">{flow.question}</p>
        <p className="mt-1 text-xs text-muted-foreground">{instructions}</p>
      </figcaption>

      <div data-viz-canvas className="relative p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start md:gap-3">
          {flow.stages.map((stage, index) => (
            <div className="contents" key={stage.title}>
              <button
                type="button"
                className={`group flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left transition-colors motion-reduce:transition-none md:flex-col md:border-transparent md:p-2 md:text-center ${
                  index === active ? "border-primary/50 bg-primary/5" : "border-border/70 bg-background/60 md:bg-transparent"
                }`}
                onClick={() => setActive(index)}
                aria-current={index === active ? "step" : undefined}
              >
                <Shape stage={stage} active={index <= active} />
                <span className="min-w-0">
                  <span className="block text-xs font-black text-primary/70">0{index + 1}</span>
                  <span className="mt-1 block text-sm font-bold text-foreground">{stage.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{stage.detail}</span>
                </span>
              </button>
              {index < last && (
                <div className="relative hidden h-20 w-8 items-center justify-center md:flex" aria-hidden="true">
                  <span className="h-px w-full bg-border" />
                  <span className={`absolute h-2.5 w-2.5 rounded-full border border-primary bg-background ${index < active ? "translate-x-3" : "-translate-x-3"} transition-transform duration-500 motion-reduce:transition-none`} />
                  <span className="absolute right-0 text-sm text-muted-foreground">›</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex gap-2" aria-label="단계 선택">
            {flow.stages.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full border transition-[width,background-color] motion-reduce:transition-none ${index === active ? "w-8 border-primary bg-primary" : "w-2.5 border-border bg-background"}`}
                aria-label={`${index + 1}단계 ${stage.title}`}
              />
            ))}
          </div>
          <p aria-live="polite" className="text-sm leading-6 text-foreground/80">
            <strong>{active + 1}. {activeStage.title}</strong> — {activeStage.detail}
          </p>
        </div>
      </div>
    </figure>
  );
}
