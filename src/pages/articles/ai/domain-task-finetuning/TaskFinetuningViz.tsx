import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type TraceSceneProps = {
  id: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function TraceScene({ id, labels, notes, children }: TraceSceneProps) {
  const controls = useAnimatedScenes(labels.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 번의 행동 학습"
      title="의료 문장 하나가 검증된 JSON 행동으로 바뀌는 네 단계"
      description="예시를 저장하는 것만으로 끝나지 않습니다. 입력과 정답 계약을 고정하고, 정답 token만 채점하며, 업데이트 범위를 정한 뒤 네 행동 gate를 모두 통과시킵니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label="Task fine-tuning의 4단계 흐름"
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only="true" className="flex min-h-0 flex-col justify-center sm:min-h-[24rem]">
          <p className="text-[11px] font-black text-primary">장면 {String(active + 1).padStart(2, "0")} / 04</p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">{labels[active]}</h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">{notes[active]}</p>
        </div>
        <AnimatedSceneControls
          labels={[...labels]}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

const TRACE_LABELS = [
  "입력 문장과 원하는 JSON을 한 demonstration으로 묶습니다",
  "Prompt는 읽고 assistant response token만 채점합니다",
  "학습 목표와 별개로 바꿀 parameter 범위를 정합니다",
  "형식·내용·거절·일반 능력을 모두 통과한 revision만 남깁니다",
] as const;

const TRACE_NOTES = [
  "설명용 입력은 ‘혈압 120/80, 흉통 부인’이고 target은 세 필드와 근거를 가진 JSON입니다. 데이터·수치·판정은 흐름을 설명하기 위한 가정 [A]입니다.",
  "Prompt token 세 칸의 mask는 0, response token 세 칸의 mask는 1입니다. Response NLL 0.2·0.4·0.8만 평균하면 loss는 약 0.467입니다.",
  "SFT는 어떤 target을 학습할지 정하고, full·LoRA·head-only는 그 loss가 어느 parameter를 바꿀지 정합니다. 둘은 같은 선택 축이 아닙니다.",
  "v1은 JSON 형식은 맞지만 사실성 0.84로 막힙니다. v2는 네 gate를 모두 통과합니다. 평가 계약이 없으면 성공이 아니라 판정 불가입니다.",
] as const;

function StageCard({ active, number, title, detail }: { active: boolean; number: string; title: string; detail: string }) {
  return (
    <div className={`min-w-0 border-y px-3 py-4 sm:px-4 ${active ? "border-primary bg-primary/[0.07]" : "border-border bg-background"}`}>
      <span className="font-mono text-[9px] font-black text-primary">{number}</span>
      <strong className="mt-2 block break-keep text-xs leading-5 sm:text-sm sm:leading-6">{title}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-5 text-muted-foreground">{detail}</span>
    </div>
  );
}

function StageArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`hidden items-center justify-center text-center text-[10px] font-bold leading-4 sm:flex sm:flex-col ${active ? "text-primary" : "text-muted-foreground/35"}`}>
      <span className="break-keep">{label}</span>
      <span aria-hidden className="text-base sm:-rotate-90">↓</span>
    </div>
  );
}

export function TaskFinetuningTraceViz() {
  return (
    <TraceScene id="task-finetuning-trace" labels={TRACE_LABELS} notes={TRACE_NOTES}>
      {(active) => (
        <div role="img" aria-label={TRACE_NOTES[active]}>
          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)] sm:items-stretch sm:gap-1 sm:bg-transparent sm:p-0">
            <StageCard active={active === 0} number="01 · EXAMPLE" title="문장 → JSON" detail="input · target · abstain" />
            <StageArrow active={active >= 1} label="template" />
            <StageCard active={active === 1} number="02 · LOSS" title="0 0 0 · 1 1 1" detail="response NLL 평균 0.467" />
            <StageArrow active={active >= 2} label="gradient" />
            <StageCard active={active === 2} number="03 · UPDATE" title="Full · LoRA · Head" detail="같은 objective · 다른 범위" />
            <StageArrow active={active >= 3} label="평가" />
            <StageCard active={active === 3} number="04 · RELEASE" title="v2 선택" detail="네 행동 gate 모두 통과" />
          </div>
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-y border-border px-3 py-3 text-xs leading-6">
            <strong>현재 결과</strong>
            <span className="break-keep text-muted-foreground">
              {[
                "어떤 입력에서 어떤 구조와 거절 행동을 원하는지 한 줄로 다시 만들 수 있습니다.",
                "Context는 그대로 읽히지만 gradient 계산에는 target response만 남습니다.",
                "학습 신호를 유지한 채 바꿀 weight의 범위만 비교할 수 있습니다.",
                "형식만 맞는 v1을 막고 내용까지 맞는 v2를 release 후보로 남깁니다.",
              ][active]}
            </span>
          </div>
        </div>
      )}
    </TraceScene>
  );
}

export function DemonstrationContractViz() {
  const fields = [
    { label: "INPUT", value: "혈압 120/80, 흉통 부인", detail: "source span을 보존" },
    { label: "TARGET", value: "세 필드 + evidence JSON", detail: "schema revision 고정" },
    { label: "ABSTAIN", value: "근거가 없으면 null + review", detail: "추측 대신 정지" },
    { label: "EVAL", value: "format · fact · abstention", detail: "같은 계약으로 채점" },
  ] as const;

  return (
    <VizFrame
      eyebrow="Demonstration 계약"
      title="한 예시 안에 입력·정답·거절·채점 규칙을 함께 둡니다"
      description="문장과 정답만 모으면 모호한 경우의 행동이 빠집니다. 학습 전부터 근거가 없을 때의 출력과 평가 규칙까지 같은 revision으로 고정합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="의료 정보 추출 demonstration의 입력, JSON target, abstention, evaluation 네 계약">
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
          {fields.map((field, index) => (
            <div key={field.label} className="min-w-0 bg-background px-3 py-4 sm:px-4 sm:py-5">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")} · {field.label}</span>
              <strong className="mt-2 block break-keep text-xs leading-5 sm:text-sm sm:leading-6">{field.value}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-5 text-muted-foreground">{field.detail}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">
          <strong className="text-foreground">재현 단위:</strong> dataset revision + chat template + schema revision + evaluation revision
        </div>
      </div>
    </VizFrame>
  );
}

export function ResponseMaskViz() {
  const tokens = [
    { token: "SYSTEM", mask: 0, loss: "—", kind: "prompt" },
    { token: "USER", mask: 0, loss: "—", kind: "prompt" },
    { token: "CONTEXT", mask: 0, loss: "—", kind: "prompt" },
    { token: "{ value", mask: 1, loss: "0.2", kind: "response" },
    { token: "120/80", mask: 1, loss: "0.4", kind: "response" },
    { token: "false }", mask: 1, loss: "0.8", kind: "response" },
  ] as const;

  return (
    <VizFrame
      eyebrow="Response-only loss"
      title="Mask가 0인 prompt도 읽지만 평균 loss에서는 빠집니다"
      description="여섯 칸은 실제 tokenizer 결과가 아니라 계산을 보여 주는 설명용 묶음 [A]입니다. 뒤의 세 response 묶음만 채점합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="Prompt mask는 0, response mask는 1입니다. Response NLL 평균은 0.467입니다.">
        <div className="grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-6">
          {tokens.map((item) => (
            <div key={item.token} className={`min-w-0 px-2 py-4 text-center ${item.kind === "response" ? "bg-primary/[0.07]" : "bg-background"}`}>
              <strong className="block break-words font-mono text-[10px] leading-4">{item.token}</strong>
              <span className="mt-2 block font-mono text-[10px] text-muted-foreground">mask {item.mask}</span>
              <span className="mt-1 block font-mono text-[10px]">NLL {item.loss}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3 sm:bg-transparent sm:p-0">
          <div className="bg-background px-2 py-4 text-center sm:border-y sm:border-border"><span className="text-[10px] font-bold text-muted-foreground">남은 NLL</span><strong className="mt-1 block font-mono text-xs sm:text-sm">0.2 + 0.4 + 0.8</strong></div>
          <span className="hidden text-primary sm:block" aria-hidden>→</span>
          <div className="bg-background px-2 py-4 text-center sm:border-y sm:border-border"><span className="text-[10px] font-bold text-muted-foreground">유효 token</span><strong className="mt-1 block font-mono text-xs sm:text-sm">mask 합 = 3</strong></div>
          <span className="hidden text-primary sm:block" aria-hidden>→</span>
          <div className="bg-primary/[0.07] px-2 py-4 text-center sm:border-y sm:border-primary"><span className="text-[10px] font-bold text-primary">평균 loss</span><strong className="mt-1 block font-mono text-xs text-primary sm:text-sm">1.4 / 3 ≈ 0.467</strong></div>
        </div>
      </div>
    </VizFrame>
  );
}

export function UpdateScopeViz() {
  const methods = [
    { name: "Full fine-tuning", blocks: [1, 1, 1, 1, 1, 1], result: "base weight 전체를 갱신" },
    { name: "LoRA · adapter", blocks: [0, 1, 0, 1, 0, 0], result: "선택한 module의 작은 update만 학습" },
    { name: "Head-only", blocks: [0, 0, 0, 0, 0, 1], result: "고정 representation 위의 task head만 학습" },
  ] as const;

  return (
    <VizFrame
      eyebrow="Parameter 범위"
      title="같은 SFT loss라도 gradient를 적용할 위치는 따로 고릅니다"
      description="강조된 칸은 개념적인 trainable 영역입니다. 칸 수를 실제 parameter 비율이나 성능 순위로 해석하지 않습니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="Full fine-tuning은 전체 weight, LoRA는 adapter, head-only는 task head만 갱신하는 비교">
        <div className="grid gap-px bg-border p-px sm:grid-cols-3">
          {methods.map((method) => (
            <div key={method.name} className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-3 bg-background px-3 py-4 sm:block sm:px-4 sm:py-5">
              <strong className="block break-keep text-sm leading-6">{method.name}</strong>
              <div className="min-w-0">
                <div className="grid grid-cols-6 gap-1 sm:mt-4" aria-hidden>
                  {method.blocks.map((trainable, index) => (
                    <span key={`${method.name}-${index}`} className={`h-8 border sm:h-10 ${trainable ? "border-primary bg-primary/[0.14]" : "border-border bg-muted/25"}`} />
                  ))}
                </div>
                <span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground sm:mt-3">{method.result}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">먼저 시작 checkpoint와 학습·평가 조건을 고정합니다. 결과는 peak memory, 처리량, artifact 크기로 나누어 기록합니다.</p>
      </div>
    </VizFrame>
  );
}

export function BehaviorReleaseViz() {
  const rows = [
    { metric: "Format", threshold: "≥ 0.99", v1: "1.00 · 통과", v2: "0.995 · 통과", v1Pass: true, v2Pass: true },
    { metric: "Factuality", threshold: "≥ 0.90", v1: "0.84 · 실패", v2: "0.93 · 통과", v1Pass: false, v2Pass: true },
    { metric: "Abstention", threshold: "≥ 0.90", v1: "0.95 · 통과", v2: "0.92 · 통과", v1Pass: true, v2Pass: true },
    { metric: "General Δ", threshold: "≥ -1.0", v1: "-0.2 · 통과", v2: "-0.4 · 통과", v1Pass: true, v2Pass: true },
  ] as const;

  return (
    <VizFrame
      eyebrow="행동 release gate"
      title="형식 점수가 높아도 사실성 gate가 실패하면 출시하지 않습니다"
      description="모든 값은 비보상 gate의 동작을 보여 주는 가정 [A]입니다. 평균 점수 하나가 실패한 행동을 상쇄하지 못하게 합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="v1은 factuality 0.84로 실패합니다. v2는 네 gate를 모두 통과합니다.">
        <div className="grid grid-cols-[1.15fr_.8fr_1fr_1fr] gap-px bg-border p-px text-[10px] leading-5 sm:text-xs">
          <strong className="bg-muted/25 px-2 py-3 sm:px-3">Gate</strong><strong className="bg-muted/25 px-2 py-3 sm:px-3">기준</strong><strong className="bg-muted/25 px-2 py-3 sm:px-3">v1</strong><strong className="bg-muted/25 px-2 py-3 sm:px-3">v2</strong>
          {rows.map((row) => (
            <div key={row.metric} className="contents">
              <strong className="break-words bg-background px-2 py-3 sm:px-3">{row.metric}</strong>
              <span className="break-words bg-background px-2 py-3 font-mono sm:px-3">{row.threshold}</span>
              <span className={`break-words bg-background px-2 py-3 sm:px-3 ${row.v1Pass ? "text-muted-foreground" : "font-bold text-destructive"}`}>{row.v1}</span>
              <span className={`break-words bg-background px-2 py-3 sm:px-3 ${row.v2Pass ? "font-bold text-primary" : "text-destructive"}`}>{row.v2}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px">
          <div className="bg-destructive/[0.05] px-4 py-4"><span className="text-[10px] font-bold text-destructive">v1 · RELEASE 0</span><strong className="mt-1 block break-keep text-sm">형식은 맞지만 내용이 틀려 중지</strong></div>
          <div className="bg-primary/[0.07] px-4 py-4"><span className="text-[10px] font-bold text-primary">v2 · RELEASE 1</span><strong className="mt-1 block break-keep text-sm">네 행동 gate를 모두 통과</strong></div>
        </div>
      </div>
    </VizFrame>
  );
}
