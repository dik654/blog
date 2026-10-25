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
      eyebrow="한 번의 학습 흐름"
      title="전문 문서가 선택된 체크포인트로 바뀌는 네 단계"
      description="전문 문서를 넣는 것만으로 끝나지 않습니다. 코퍼스 경계를 고정하고, 토큰을 섞고, 같은 목표로 학습한 뒤 일반 능력 회귀가 작은 체크포인트를 남깁니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label="Continued pretraining의 4단계 흐름"
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[24rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
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
  "코퍼스의 출처와 평가 경계를 먼저 고정합니다",
  "한 배치의 토큰을 전문 문서 8, 일반 문서 2로 섞습니다",
  "두 문서군에 같은 language-model loss를 계산합니다",
  "일반 능력 회귀가 예산 안인 체크포인트를 남깁니다",
] as const;

const TRACE_NOTES = [
  "전문 문서와 일반 replay 문서의 source·rights·중복 제거 revision·평가 중복 여부를 manifest에 기록합니다. 입력 경계가 고정되어야 학습 결과를 다시 설명할 수 있습니다.",
  "설명용 배치 10칸 가운데 8칸은 전문 문서, 2칸은 일반 replay입니다. 8:2는 실제 권장 비율이 아니라 혼합 계산을 보여 주는 가정 [A]입니다.",
  "전문 문서 평균 loss 2와 일반 replay 평균 loss 3에 각각 0.8과 0.2를 곱합니다. Optimizer가 줄이는 mixed loss는 2.2입니다.",
  "설명용 10k 체크포인트는 domain +4, general -0.5이고 30k는 +4.2, -5입니다. 허용 회귀가 1이면 10k만 통과합니다.",
] as const;

function StageArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div
      className={`hidden min-h-0 items-center justify-center text-center text-[10px] font-bold leading-4 sm:flex sm:flex-col ${
        active ? "text-primary" : "text-muted-foreground/35"
      }`}
    >
      <span className="hidden break-keep sm:block">{label}</span>
      <span aria-hidden className="text-base sm:-rotate-90">↓</span>
    </div>
  );
}

function TraceStage({
  active,
  eyebrow,
  title,
  detail,
}: {
  active: boolean;
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`min-w-0 border-y px-3 py-4 transition-colors sm:px-4 ${
        active ? "border-primary bg-primary/[0.07]" : "border-border bg-background"
      }`}
    >
      <span className="text-[9px] font-black text-primary">{eyebrow}</span>
      <strong className="mt-2 block break-keep text-xs leading-5 sm:text-sm sm:leading-6">{title}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-5 text-muted-foreground">{detail}</span>
    </div>
  );
}

export function ContinuedPretrainingTraceViz() {
  return (
    <TraceScene id="continued-pretraining-trace" labels={TRACE_LABELS} notes={TRACE_NOTES}>
      {(active) => (
        <div role="img" aria-label={TRACE_NOTES[active]}>
          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)] sm:items-stretch sm:gap-1 sm:bg-transparent sm:p-0">
            <TraceStage
              active={active === 0}
              eyebrow="01 · CORPUS"
              title="전문 문서 + 일반 replay"
              detail="source · rights · dedup · eval overlap"
            />
            <StageArrow active={active >= 1} label="샘플링" />
            <TraceStage
              active={active === 1}
              eyebrow="02 · BATCH"
              title="전문 8 · 일반 2"
              detail="10칸 중 8:2 · 가정 [A]"
            />
            <StageArrow active={active >= 2} label="token loss" />
            <TraceStage
              active={active === 2}
              eyebrow="03 · UPDATE"
              title="0.8×2 + 0.2×3"
              detail="mixed loss = 2.2"
            />
            <StageArrow active={active >= 3} label="평가" />
            <TraceStage
              active={active === 3}
              eyebrow="04 · CHECKPOINT"
              title="10k 선택"
              detail="domain +4 · general -0.5"
            />
          </div>
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-y border-border px-3 py-3 text-xs leading-6">
            <strong>현재 결과</strong>
            <span className="break-keep text-muted-foreground">
              {[
                "학습에 들어갈 문서와 빠져야 할 평가 파생물을 식별했습니다.",
                "전문 문서가 이번 배치 노출의 80%를 차지합니다.",
                "같은 token objective가 model weight를 한 번 업데이트합니다.",
                "회귀 예산 1 안에서 10k 체크포인트가 release 후보로 남습니다.",
              ][active]}
            </span>
          </div>
        </div>
      )}
    </TraceScene>
  );
}

export function CorpusMixtureViz() {
  const cells = Array.from({ length: 10 }, (_, index) => index < 8 ? "domain" : "replay");

  return (
    <VizFrame
      eyebrow="토큰 혼합"
      title="열 칸을 세면 λ=0.8의 뜻이 보입니다"
      description="전문 문서와 일반 replay가 한 배치에서 차지하는 노출 비중을 먼저 보고, 같은 비율을 loss에 적용합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="열 토큰 묶음 중 전문 문서 토큰 여덟 칸과 일반 replay 토큰 두 칸을 섞어 mixed loss 2.2를 계산하는 그림">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10" aria-label="10칸 토큰 혼합">
          {cells.map((kind, index) => (
            <div
              key={`${kind}-${index}`}
              className={`flex min-h-14 items-center justify-center border text-center text-[10px] font-bold leading-4 sm:min-h-20 ${
                kind === "domain"
                  ? "border-primary/55 bg-primary/[0.08] text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span><span className="block font-mono text-[9px]">{index + 1}</span>{kind === "domain" ? "전문" : "일반"}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          <div className="bg-background px-4 py-4">
            <span className="text-[10px] font-bold text-muted-foreground">전문 문서 기여</span>
            <strong className="mt-1 block font-mono text-lg">0.8 × 2 = 1.6</strong>
          </div>
          <div className="hidden items-center bg-background px-2 text-primary sm:flex" aria-hidden>+</div>
          <div className="bg-background px-4 py-4">
            <span className="text-[10px] font-bold text-muted-foreground">일반 replay 기여</span>
            <strong className="mt-1 block font-mono text-lg">0.2 × 3 = 0.6</strong>
          </div>
          <div className="hidden items-center bg-background px-2 text-primary sm:flex" aria-hidden>=</div>
          <div className="bg-primary/[0.07] px-4 py-4">
            <span className="text-[10px] font-bold text-primary">Optimizer가 줄일 값</span>
            <strong className="mt-1 block font-mono text-lg text-primary">mixed loss = 2.2</strong>
          </div>
        </div>
        <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">
          왼쪽부터 열 칸을 세면 전문 문서가 8칸, 일반 replay가 2칸입니다. 이 비율은 입력 노출을 설명하며, 일반 능력 보존은 별도 평가로 확인해야 합니다.
        </p>
      </div>
    </VizFrame>
  );
}

export function PerplexityChoiceViz() {
  const tokens = ["특허", "청구항", "반도체", "소자"] as const;

  return (
    <VizFrame
      eyebrow="Perplexity 계산"
      title="관측한 네 token에 모두 0.25를 줬다면 PPL은 4입니다"
      description="같은 tokenizer와 채점 위치에서 관측 token의 확률을 log cost로 바꾸고 평균한 뒤 다시 지수로 되돌립니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="네 관측 token의 확률이 각각 0.25일 때 평균 NLL은 ln 4이고 perplexity는 4인 계산">
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
          {tokens.map((token, index) => (
            <div key={token} className="bg-background px-3 py-4 text-center sm:px-4 sm:py-5">
              <span className="font-mono text-[9px] font-black text-primary">TOKEN {index + 1}</span>
              <strong className="mt-2 block text-sm">{token}</strong>
              <span className="mt-2 block font-mono text-xs text-muted-foreground">p = 0.25</span>
              <span className="mt-1 block font-mono text-xs">-log p = ln 4</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3 sm:bg-transparent sm:p-0">
          <div className="min-w-0 bg-background px-2 py-4 text-center sm:border-y sm:border-border sm:px-3">
            <span className="text-[10px] font-bold text-muted-foreground">합계</span>
            <strong className="mt-1 block break-words font-mono text-xs sm:text-sm">4 × ln 4</strong>
          </div>
          <span className="hidden text-primary sm:block" aria-hidden>→</span>
          <div className="min-w-0 bg-background px-2 py-4 text-center sm:border-y sm:border-border sm:px-3">
            <span className="text-[10px] font-bold text-muted-foreground">token당 평균</span>
            <strong className="mt-1 block break-words font-mono text-xs sm:text-sm">4 ln 4 / 4<br />= ln 4</strong>
          </div>
          <span className="hidden text-primary sm:block" aria-hidden>→</span>
          <div className="min-w-0 bg-primary/[0.07] px-2 py-4 text-center sm:border-y sm:border-primary sm:px-3">
            <span className="text-[10px] font-bold text-primary">지수로 복원</span>
            <strong className="mt-1 block break-words font-mono text-xs text-primary sm:text-sm">exp(ln 4)<br />= 4</strong>
          </div>
        </div>
        <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">
          이 네 token은 계산을 보여 주기 위한 가정 [A]입니다. Tokenizer·context·stride·loss mask가 달라지면 같은 문장도 다른 단위로 채점되므로 PPL 숫자를 바로 비교할 수 없습니다.
        </p>
      </div>
    </VizFrame>
  );
}

export function CheckpointFrontierViz() {
  const checkpoints = [
    { step: "10k", gain: "+4.0", forgetting: "0.5", width: "10%", pass: true },
    { step: "30k", gain: "+4.2", forgetting: "5.0", width: "100%", pass: false },
  ] as const;

  return (
    <VizFrame
      eyebrow="Checkpoint 선택"
      title="마지막 checkpoint보다 회귀 예산 안의 checkpoint를 남깁니다"
      description="두 checkpoint의 domain gain은 비슷하지만 general forgetting은 열 배 차이 납니다. 허용 회귀 1을 먼저 적용합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="10k 체크포인트는 domain gain 4와 general forgetting 0.5로 통과하고 30k는 gain 4.2와 forgetting 5로 탈락하는 그림">
        <div className="hidden grid-cols-[5rem_7rem_minmax(0,1fr)_5rem] gap-4 border-y border-border px-4 py-3 text-[10px] font-black text-muted-foreground sm:grid">
          <span>Checkpoint</span><span>Domain gain</span><span>General forgetting · 예산 1</span><span>판정</span>
        </div>
        <div className="divide-y divide-border border-b border-border">
          {checkpoints.map((checkpoint) => (
            <div key={checkpoint.step} className="grid gap-3 px-3 py-5 sm:grid-cols-[5rem_7rem_minmax(0,1fr)_5rem] sm:items-center sm:px-4">
              <strong className="font-mono text-sm">{checkpoint.step}</strong>
              <div><span className="mr-2 text-[10px] font-bold text-muted-foreground sm:hidden">Domain gain</span><strong>{checkpoint.gain}</strong></div>
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-muted-foreground">회귀 {checkpoint.forgetting}</span>
                  <span className="font-mono">ε = 1</span>
                </div>
                <div className="relative h-3 bg-muted">
                  <div className="absolute inset-y-0 left-[20%] w-px bg-foreground/55" aria-hidden />
                  <div
                    className={`h-full ${checkpoint.pass ? "bg-primary" : "bg-destructive/70"}`}
                    style={{ width: checkpoint.width }}
                  />
                </div>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">세로선이 허용 회귀 1입니다.</p>
              </div>
              <span className={`w-fit border px-2 py-1 text-[10px] font-bold ${checkpoint.pass ? "border-primary/55 text-primary" : "border-destructive/55 text-destructive"}`}>
                {checkpoint.pass ? "선택" : "탈락"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">
          30k는 domain gain이 0.2 더 크지만 general forgetting이 허용 회귀 1을 넘습니다. 그래서 설명용 release 후보는 10k입니다.
        </p>
      </div>
    </VizFrame>
  );
}
