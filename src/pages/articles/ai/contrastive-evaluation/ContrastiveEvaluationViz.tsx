import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { CONTRASTIVE_EVALUATION_FIXTURE as FIXTURE } from "./calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({ id, eyebrow, title, description, labels, notes, children }: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 7600, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[23rem]">
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

const FLOW_STAGES = [
  { key: "receipt", label: "후보 고정", detail: "encoder·miner·index·filter", writer: "build pipeline" },
  { key: "audit", label: "Pair 감사", detail: "구간·표본·판정·불확실성", writer: "reviewer" },
  { key: "compare", label: "동일 조건 비교", detail: "split·seed·metric code", writer: "evaluation job" },
  { key: "decision", label: "출시 판단", detail: "release·revise·block", writer: "release owner" },
] as const;

export function ReleaseEvidenceFlowViz() {
  const labels = [
    "후보 산출물의 버전을 먼저 고정합니다",
    "위험 구간별 pair 판정을 별도 원장에 씁니다",
    "같은 split·seed에서 기존 모델과 짝지어 비교합니다",
    "두 근거를 합쳐 출시 대신 수정을 결정합니다",
  ] as const;
  const notes = [
    "평가 도중 encoder나 index가 바뀌면 뒤의 숫자를 재현할 수 없습니다. 후보 receipt가 이후 단계의 읽기 전용 입력입니다.",
    "Reviewer는 positive·negative·unknown 판정을 쓰지만 candidate snapshot은 고치지 않습니다. 데이터 수정은 다음 revision에서 합니다.",
    "Evaluation job은 같은 split·seed·metric 구현으로 encoder-v7과 encoder-v8의 차이를 기록합니다.",
    "이 가정에서는 downstream 평균 gain이 0이고 pair 위험도 남습니다. encoder-v7을 유지하고 pair policy를 수정합니다.",
  ] as const;

  return (
    <Scene
      id="contrastive-release-evidence-flow"
      eyebrow="Release evidence"
      title="후보 하나가 네 개의 버전 고정 산출물을 지나 결정이 됩니다"
      description="각 단계의 writer를 한 곳으로 제한하면 감사와 평가가 서로의 상태를 덮어쓰지 않습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
            {FLOW_STAGES.map((stage, index) => {
              const reached = index <= active;
              const current = index === active;
              return (
                <div
                  key={stage.key}
                  className={`min-w-0 bg-background px-2 py-3 transition-colors sm:min-h-40 sm:px-4 sm:py-4 ${current ? "bg-primary/[0.08]" : reached ? "bg-muted/25" : "opacity-45"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[9px] font-bold text-muted-foreground">{reached ? "기록됨" : "대기"}</span>
                  </div>
                  <strong className="mt-2 block break-keep text-xs leading-5 sm:mt-3 sm:text-sm sm:leading-6">{stage.label}</strong>
                  <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:text-[10px] sm:leading-5">{stage.detail}</span>
                  <span className="mt-2 block border-t border-border pt-2 text-[8px] leading-4 text-muted-foreground sm:mt-3 sm:text-[9px]">writer · {stage.writer}</span>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 grid gap-2 border-y px-3 py-3 text-xs sm:grid-cols-[1fr_auto_1fr] sm:items-center ${active === 3 ? "border-primary/70 bg-primary/[0.06]" : "border-border"}`}>
            <span><strong>현재 운영</strong> · {FIXTURE.baselineRevision}</span>
            <span className="hidden text-muted-foreground sm:block" aria-hidden="true">→</span>
            <span className="sm:text-right"><strong>판정</strong> · {active === 3 ? "REVISE · 기존 revision 유지" : "근거 수집 중"}</span>
          </div>
        </div>
      )}
    </Scene>
  );
}

function SampleDots({ hiddenPositives, visible }: { hiddenPositives: number; visible: boolean }) {
  return (
    <div className="mt-3 grid grid-cols-10 gap-1" aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span
          key={index}
          className={`aspect-square min-w-0 rounded-full border transition-colors ${
            !visible
              ? "border-border bg-background"
              : index < hiddenPositives
                ? "border-primary bg-primary"
                : "border-border bg-muted/45"
          }`}
        />
      ))}
    </div>
  );
}

export function StratifiedPairAuditViz() {
  const labels = [
    "후보 1만 개를 similarity 위험 구간으로 나눕니다",
    "각 구간에서 20개씩 무작위로 검토합니다",
    "Hidden positive를 구간별 비율과 구간으로 기록합니다",
    "모집단 비중을 반영해 전체 추정치를 계산합니다",
  ] as const;
  const notes = [
    "높음 100개·중간 900개·낮음 9,000개라는 모집단 크기는 설명용 가정입니다. 위험 구간을 나눈 뒤 표본을 뽑습니다.",
    "구간별 비교 가능성을 위해 20개씩 보지만, 전체 모집단에서 각 구간이 차지하는 비중은 서로 다릅니다.",
    "관측값은 8/20·2/20·0/20입니다. 특히 0/20은 위험 0의 증명이 아니며 이 표본의 Wilson 95% 상한은 약 16.1%입니다.",
    "세 표본을 그대로 합친 16.7%가 아니라 모집단 비중을 적용한 1.3%가 이 설명용 설계의 전체 추정치입니다. 두 숫자는 답하는 질문이 다릅니다.",
  ] as const;

  return (
    <Scene
      id="contrastive-stratified-pair-audit"
      eyebrow="Stratified audit"
      title="같은 20개씩 본 결과를 전체 비율처럼 합치지 않습니다"
      description="모집단·표본·hidden positive·불확실성을 한 화면에서 함께 보존합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {FIXTURE.buckets.map((bucket) => (
              <div key={bucket.id} className="min-w-0 border-y border-border px-2 py-3 sm:px-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="block break-keep text-[10px] leading-4 sm:text-sm sm:leading-5">{bucket.label}</strong>
                    <span className="mt-1 block text-[8px] leading-4 text-muted-foreground sm:text-[10px]">모집단 {bucket.population.toLocaleString()}개</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-primary sm:text-xs">{active >= 2 ? `${Math.round(bucket.observedRate * 100)}%` : "—"}</span>
                </div>
                <SampleDots hiddenPositives={bucket.hiddenPositives} visible={active >= 1} />
                <div className="mt-3 grid gap-1 text-[8px] leading-4 sm:grid-cols-2 sm:gap-2 sm:text-[10px]">
                  <span className="text-muted-foreground">판정</span>
                  <strong className="text-right">{active >= 2 ? `${bucket.hiddenPositives}/20` : "대기"}</strong>
                  <span className="text-muted-foreground">Wilson 95%</span>
                  <strong className="text-right">{active >= 2 ? `${bucket.wilson95[0]}–${bucket.wilson95[1]}%` : "—"}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-px bg-border p-px text-center sm:grid-cols-2">
            <div className={`bg-background px-3 py-3 ${active >= 2 ? "opacity-100" : "opacity-40"}`}>
              <span className="text-[10px] text-muted-foreground">표본만 단순 합산</span>
              <strong className="mt-1 block font-mono text-sm">10 ÷ 60 = 16.7%</strong>
            </div>
            <div className={`bg-background px-3 py-3 transition-colors ${active >= 3 ? "bg-primary/[0.08]" : "opacity-40"}`}>
              <span className="text-[10px] text-muted-foreground">모집단 비중 반영</span>
              <strong className="mt-1 block font-mono text-sm">(40 + 90 + 0) ÷ 10,000 = 1.3%</strong>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function PairedDownstreamViz() {
  const labels = [
    "Baseline과 후보에 같은 split·seed를 배정합니다",
    "Seed마다 후보 점수에서 baseline 점수를 뺍니다",
    "다섯 차이를 모두 더하면 0이 됩니다",
    "평균 gain 0이므로 출시 근거가 생기지 않습니다",
  ] as const;
  const notes = [
    "데이터 split, seed, metric code를 같게 두어 모델 revision 외 차이를 줄입니다. 절대 점수보다 한 seed 안의 차이를 먼저 봅니다.",
    "설명용 paired gain은 +0.02·−0.01·0·+0.01·−0.02입니다. 양수와 음수가 seed마다 섞여 있습니다.",
    "차이 합은 0입니다. 평균도 0/5=0이며 seed 편차와 worst-domain slice는 별도로 남겨야 합니다.",
    "Loss가 줄었더라도 이 비교에서는 downstream 개선이 확인되지 않았습니다. 후보를 배포하지 않고 원인을 수정합니다.",
  ] as const;

  return (
    <Scene
      id="contrastive-paired-downstream"
      eyebrow="Paired comparison"
      title="같은 seed 안에서 뺀 다섯 차이를 합쳐 평균을 냅니다"
      description="조건이 짝지어져야 encoder revision의 효과를 다른 변동과 구분할 수 있습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="divide-y divide-border border-y border-border">
            {FIXTURE.seedGains.map((gain, index) => {
              const width = Math.abs(gain) * 1600;
              return (
                <div key={index} className="grid grid-cols-[3rem_minmax(0,1fr)_4rem] items-center gap-2 px-2 py-2.5 text-xs sm:grid-cols-[4rem_minmax(0,1fr)_5rem] sm:px-3">
                  <strong className="font-mono">seed {index + 1}</strong>
                  <div className="relative h-4 border-x border-border bg-muted/20">
                    <span className="absolute left-1/2 top-0 h-full w-px bg-foreground/40" />
                    {active >= 1 && gain !== 0 ? (
                      <span
                        className="absolute top-1/2 h-2 -translate-y-1/2 bg-primary/75"
                        style={gain > 0 ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
                      />
                    ) : null}
                    {active >= 1 && gain === 0 ? <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" /> : null}
                  </div>
                  <span className={`text-right font-mono ${active >= 1 ? "font-bold" : "text-muted-foreground"}`}>{active >= 1 ? `${gain > 0 ? "+" : ""}${gain.toFixed(2)}` : "—"}</span>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 border-y px-3 py-3 text-center text-xs transition-colors ${active === 3 ? "border-primary/70 bg-primary/[0.08]" : "border-border"}`}>
            {active < 2 ? <strong>Δₛ = metric(candidate, s) − metric(baseline, s)</strong> : null}
            {active === 2 ? <strong>+0.02 − 0.01 + 0 + 0.01 − 0.02 = 0</strong> : null}
            {active === 3 ? <strong>평균 Δ = 0 ÷ 5 = 0 · 결정: REVISE</strong> : null}
          </div>
        </div>
      )}
    </Scene>
  );
}

const FAILURES = [
  {
    title: "평가 중 index 교체",
    signal: "candidate receipt와 조회 결과의 revision 불일치",
    invalid: "현재 audit와 metric receipt",
    recovery: "결과 격리 → 한 revision으로 후보 재생성 → audit부터 재실행",
  },
  {
    title: "Unknown을 negative로 강제",
    signal: "근거 부족 판정이 negative 집계에 포함",
    invalid: "해당 rubric version의 pair rate",
    recovery: "unknown 분리 → 독립 재판정 → 합의율과 비율 재계산",
  },
  {
    title: "Split·seed 불일치",
    signal: "baseline과 candidate receipt의 평가 설정 차이",
    invalid: "paired gain 전체",
    recovery: "공통 manifest 고정 → 양쪽 job 재실행 → 새 receipt 비교",
  },
  {
    title: "Test를 수정에 재사용",
    signal: "최종 test 오류가 다음 pair 선택 규칙의 입력이 됨",
    invalid: "독립 test라는 해석",
    recovery: "해당 test를 validation으로 강등 → 새 holdout 확보 → 최종 보고 재설계",
  },
] as const;

export function EvaluationFailureViz() {
  const labels = FAILURES.map((failure) => failure.title);
  const notes = FAILURES.map((failure) => `${failure.signal}. ${failure.recovery}.`);

  return (
    <Scene
      id="contrastive-evaluation-failure"
      eyebrow="Failure and recovery"
      title="평가 계약이 깨지면 숫자를 보정하지 않고 근거를 폐기합니다"
      description="장애마다 무효가 되는 범위와 다시 시작할 지점을 구분합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => {
        const failure = FAILURES[active];
        return (
          <div role="img" aria-label={notes[active]} className="grid gap-px bg-border p-px sm:grid-cols-3">
            <div className="min-w-0 bg-background px-3 py-4 sm:px-4">
              <span className="text-[10px] font-black text-primary">발견</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{failure.signal}</strong>
            </div>
            <div className="min-w-0 bg-background px-3 py-4 sm:px-4">
              <span className="text-[10px] font-black text-primary">격리</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{failure.invalid}</strong>
              <span className="mt-1 block text-[10px] leading-5 text-muted-foreground">이 범위는 출시 근거로 사용하지 않음</span>
            </div>
            <div className="min-w-0 bg-primary/[0.07] px-3 py-4 sm:px-4">
              <span className="text-[10px] font-black text-primary">복구</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{failure.recovery}</strong>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}
