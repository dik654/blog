import { useLayoutEffect, useRef } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "학습",
    title: "학습 자료로 가중치를 바꾸고 학습 산출물 세 개를 남깁니다",
    note: "설명용 가정입니다. train-v12에서 C17·C24·C29의 학습 손실은 0.38·0.31·0.28이지만, 이 숫자만으로 출시 정책을 정하지 않습니다.",
  },
  {
    code: "측정",
    title: "검증 자료에서 네 정책 후보를 같은 조건으로 측정합니다",
    note: "policy-grid-v4는 P17=C17·0.62·단일 실행, P24-H=C24·0.71·단일 실행, P24-L=C24·0.60·단일 실행, P29=C29·0.58·3회 평균으로 미리 고정합니다. 비용은 각각 38·31·42·35입니다.",
  },
  {
    code: "선택",
    title: "필수 기준을 통과한 정책 중 비용이 가장 낮은 P17을 고릅니다",
    note: "P17은 recall 0.86·p95 92ms, P24-H는 0.74·91ms, P24-L은 0.81·91ms, P29는 0.83·121ms입니다. P17과 P24-L만 통과하고 비용 38인 P17을 고릅니다.",
  },
  {
    code: "고정",
    title: "선택 결과와 승인 규칙을 출시 결정 기록에 고정합니다",
    note: "release-27에는 policy-grid-v4, P17·C17 식별값, 행동 기준 0.62, 단일 실행, 자료 버전과 최소 표본을 기록합니다. 최종 승인은 비용 상한≤45, recall 하한≥0.80, p95 상한≤100ms로 미리 고정합니다.",
  },
  {
    code: "승인",
    title: "독립 최종 자료로 고정한 정책을 승인하거나 거절합니다",
    note: "outer-v3에서 P17의 비용은 41(95% 상한 42.2≤45), 최저 집단 recall은 0.82(95% 하한 0.809≥0.80), p95는 96ms(95% 상한 99≤100ms)입니다. 최소 표본이 부족하면 보류하고, 거절 뒤에는 outer-v3를 재사용하지 않습니다.",
  },
] as const;

const checkpoints = [
  { id: "C17", loss: ".38" },
  { id: "C24", loss: ".31" },
  { id: "C29", loss: ".28" },
] as const;

const policies = [
  { id: "P17", checkpoint: "C17", strategy: "1회", threshold: ".62", cost: "38", recall: ".86", latency: "92" },
  { id: "P24-H", checkpoint: "C24", strategy: "1회", threshold: ".71", cost: "31", recall: ".74", latency: "91" },
  { id: "P24-L", checkpoint: "C24", strategy: "1회", threshold: ".60", cost: "42", recall: ".81", latency: "91" },
  { id: "P29", checkpoint: "C29", strategy: "3회 평균", threshold: ".58", cost: "35", recall: ".83", latency: "121" },
] as const;

function ProcessStrip({ active }: { active: number }) {
  return (
    <ol className="grid grid-cols-5 gap-px bg-border p-px" aria-label="학습부터 독립 최종 승인까지의 전체 위치">
      {scenes.map((scene, index) => (
        <li
          key={scene.code}
          aria-current={index === active ? "step" : undefined}
          className={`min-w-0 bg-background px-1 py-1.5 text-center sm:py-2 ${
            index === active
              ? "border-b-2 border-primary text-foreground"
              : index < active
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          <span className="block font-mono text-[9px] font-black text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <strong className="mt-0.5 block break-keep text-[10px] leading-4 sm:text-xs">
            {scene.code}
          </strong>
        </li>
      ))}
    </ol>
  );
}

function CandidateTable({ mode }: { mode: "loss" | "selection" | "gate" }) {
  if (mode === "loss") {
    return (
      <div className="mt-2 border-y border-border text-xs sm:mt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_4rem] gap-2 border-b border-border py-1.5 text-[9px] font-bold text-muted-foreground sm:py-2">
          <span>학습 산출물</span>
          <span className="text-right">학습 손실</span>
        </div>
        {checkpoints.map((checkpoint) => (
          <div
            key={checkpoint.id}
            className="grid grid-cols-[minmax(0,1fr)_4rem] items-center gap-2 border-b border-border py-2 last:border-b-0"
          >
            <strong>{checkpoint.id}</strong>
            <span className="text-right font-mono">{checkpoint.loss}</span>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "selection") {
    return (
      <div className="mt-2 border-y border-border text-xs sm:mt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_2.3rem_2.5rem_2.7rem] gap-1 border-b border-border py-1.5 text-[8px] font-bold text-muted-foreground sm:grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem_3.2rem] sm:gap-2 sm:py-2 sm:text-[9px]">
          <span>정책 · 산출물</span>
          <span className="text-right">기준</span>
          <span className="text-right">비용</span>
          <span className="text-right leading-3"><span className="block">최저 집단</span><span className="block">recall</span></span>
          <span className="text-right">p95</span>
        </div>
        {policies.map((candidate) => (
          <div key={candidate.id} className="grid grid-cols-[minmax(0,1fr)_2.5rem_2.3rem_2.5rem_2.7rem] items-center gap-1 border-b border-border py-1.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem_3.2rem] sm:gap-2 sm:py-2">
            <strong className="min-w-0">
              <span className="block">{candidate.id}</span>
              <span className="block text-[9px] font-normal leading-4 text-muted-foreground">
                {candidate.checkpoint} · {candidate.strategy}
              </span>
            </strong>
            <span className="text-right font-mono">{candidate.threshold}</span>
            <span className="text-right font-mono">{candidate.cost}</span>
            <span className="text-right font-mono">{candidate.recall}</span>
            <span className="text-right font-mono">{candidate.latency}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
      <div className="mt-2 border-y border-border text-xs sm:mt-3">
      <div className="grid grid-cols-[minmax(0,1fr)_2.4rem_2.7rem_2.5rem_2.5rem] gap-1 border-b border-border py-1.5 text-[8px] font-bold text-muted-foreground sm:grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem_3.2rem] sm:gap-2 sm:py-2 sm:text-[9px]">
        <span>정책 · 학습 산출물</span>
        <span className="text-right">비용</span>
        <span className="text-right leading-3"><span className="block">최저 집단</span><span className="block">recall</span></span>
        <span className="text-right">p95</span>
        <span className="text-right">판정</span>
      </div>
      {policies.map((candidate) => {
        const passed = Number(candidate.recall) >= 0.8 && Number(candidate.latency) <= 100;
        return (
          <div
            key={candidate.id}
          className="grid grid-cols-[minmax(0,1fr)_2.4rem_2.7rem_2.5rem_2.5rem] items-center gap-1 border-b border-border py-1.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem_3.2rem] sm:gap-2 sm:py-2"
          >
            <strong className="min-w-0">
              <span className="block">{candidate.id}</span>
              <span className="block text-[9px] font-normal leading-4 text-muted-foreground">
                {candidate.checkpoint} · {candidate.strategy}
              </span>
            </strong>
            <span className="text-right font-mono">{candidate.cost}</span>
            <span className={`text-right font-mono ${Number(candidate.recall) < 0.8 ? "font-bold text-destructive" : ""}`}>
              {candidate.recall}
            </span>
            <span className={`text-right font-mono ${Number(candidate.latency) > 100 ? "font-bold text-destructive" : ""}`}>
              {candidate.latency}
            </span>
            <span className={`text-right text-[9px] font-bold sm:text-[10px] ${passed ? "text-primary" : "text-muted-foreground"}`}>
              {passed ? "통과" : "탈락"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SceneBody({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="border-l-2 border-primary pl-3">
            <span className="text-[9px] font-bold text-muted-foreground">입력</span>
            <strong className="mt-1 block">train-v12</strong>
          </div>
          <div className="border-l-2 border-border pl-3">
            <span className="text-[9px] font-bold text-muted-foreground">바꾸는 값</span>
            <strong className="mt-1 block">가중치 θ</strong>
          </div>
        </div>
        <CandidateTable mode="loss" />
        <p className="mt-3 break-keep text-xs font-bold leading-5 text-primary">
          손실 감소는 후보 생성의 기록이지 출시 승인표가 아닙니다.
        </p>
      </div>
    );
  }

  if (active === 1) {
    return (
      <div>
        <div className="flex items-center justify-between gap-3 border-l-2 border-primary pl-3 text-xs">
          <span><strong>validation-v7</strong> · policy-grid-v4</span>
          <span className="font-mono text-[10px] text-muted-foreground">비용 / 1,000건</span>
        </div>
        <CandidateTable mode="selection" />
      </div>
    );
  }

  if (active === 2) {
    return (
      <div>
        <div className="border-l-2 border-primary pl-3 text-xs">
          <span className="text-[9px] font-bold text-muted-foreground">선택 기준</span>
          <strong className="ml-2 break-keep">최저 집단 recall ≥ .80 · p95 ≤ 100ms</strong>
        </div>
        <CandidateTable mode="gate" />
        <div className="mt-2 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-1.5 border-y border-primary/45 py-1.5 text-center text-[10px] font-bold sm:mt-3 sm:gap-3 sm:py-2 sm:text-xs">
          <span>P17·P24-L 통과</span>
          <span aria-hidden className="h-px bg-border" />
          <span>비용 38 &lt; 42</span>
          <span aria-hidden className="h-px bg-border" />
          <strong className="text-primary">P17 선택</strong>
        </div>
      </div>
    );
  }

  if (active === 3) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:gap-y-2">
        {[
          ["출시 식별자", "release-27"],
          ["정책 · 산출물", "P17 · C17 · sha 3fd…"],
          ["행동 · 실행", "0.62 · 단일 실행"],
          ["후보 집합", "policy-grid-v4"],
          ["자료", "train-v12 · val-v7 · outer-v3"],
          ["검증 선택", "recall≥.80 · p95≤100ms"],
          ["최종 승인", "U비용≤45 · Lrecall≥.80 · Up95≤100"],
          ["표본 규칙", "전체=20만 · 집단 positive≥5천"],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-border pb-1.5 sm:pb-3">
            <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
            <strong className="mt-0.5 block break-keep text-[10px] leading-4 sm:mt-1 sm:text-xs sm:leading-5">{value}</strong>
          </div>
        ))}
        <div className="col-span-2 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-1.5 border-y border-primary/45 py-1.5 text-center text-[9px] font-bold sm:gap-3 sm:py-2 sm:text-xs">
          <span>P17 선택 완료</span>
          <span aria-hidden className="h-px bg-border" />
          <span>결정 기록 잠금</span>
          <span aria-hidden className="h-px bg-border" />
          <strong className="text-primary">outer-v3 접근 허용</strong>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          ["비용", "41", "95% 상한 42.2≤45"],
          ["최저 집단 recall", ".82", "95% 하한 .809≥.80"],
          ["p95", "96ms", "95% 상한 99≤100ms"],
        ].map(([label, value, boundary]) => (
          <div key={label} className="border-y border-border py-3">
            <span className="block text-[9px] font-bold text-muted-foreground">{label}</span>
            <strong className="mt-1 block font-mono text-sm">{value}</strong>
            <span className="mt-1 block break-keep font-mono text-[9px] text-muted-foreground">
              {boundary}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-2 border-primary pl-4 sm:mt-5">
        <div>
          <span className="text-[9px] font-bold text-muted-foreground">독립 최종 자료 outer-v3 · 고정 절차</span>
          <strong className="mt-1 block break-keep text-sm">release-27 승인</strong>
        </div>
        <span className="border border-primary px-3 py-2 text-[10px] font-bold text-primary">통과</span>
      </div>
      <div className="mt-3 border-y border-border py-2 sm:mt-5">
        <strong className="block break-keep text-[10px] leading-4 text-primary sm:text-xs sm:leading-5">
          표본 조건 충족 · 전체 20만 건 · 4만 건씩 5회 실행 · 집단별 positive 5천 건 이상
        </strong>
        <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
          못 채우면 보류합니다. 결과를 보고 값을 바꾸거나 거절 뒤 outer-v3를 다시 쓰지 않습니다.
        </p>
      </div>
    </div>
  );
}

function ReducedMotionSummary() {
  return (
    <div data-viz-live-only className="h-full min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
        축소 모션 · 전체 순서
      </p>
      <ol className="mt-3 divide-y divide-border border-y border-border">
        {scenes.map((scene, index) => (
          <li key={scene.code} className="grid gap-1 py-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-4">
            <span className="font-mono text-[10px] font-black text-primary">
              {String(index + 1).padStart(2, "0")} · {scene.code}
            </span>
            <div>
              <strong className="block break-keep text-sm leading-6">{scene.title}</strong>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{scene.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function MetricSelectionProtocolViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.active;
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    liveRegionRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return (
    <VizFrame
      eyebrow="출시 후보 한 건"
      title="학습한 후보가 출시 승인을 받기까지"
      description="release-27이 학습, 측정, 선택, 고정, 독립 최종 승인을 지나는 순서를 추적합니다. 자료 이름과 수치는 설명용 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="metric-selection-protocol"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="scroll-mt-24 flex h-full min-h-0 min-w-0 flex-col border-y border-border/70 bg-background px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        {controls.reducedMotion ? (
          <ReducedMotionSummary />
        ) : (
          <>
            <div
              ref={liveRegionRef}
              data-viz-live-only
              className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
            >
              <ProcessStrip active={active} />
              <p className="mt-2 hidden text-[10px] font-black uppercase tracking-[.16em] text-primary sm:mt-3 sm:block">
                장면 · {String(active + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 break-keep text-lg font-bold leading-7 sm:min-h-8">
                {scenes[active].title}
              </h3>
              <div className="mt-3 border-t border-border pt-3 sm:min-h-56">
                <SceneBody active={active} />
              </div>
            </div>

            <AnimatedSceneControls
              {...controls}
              active={active}
              labels={labels}
              controlLabels={scenes.map((scene) => scene.code)}
              className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-2 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-desktop-controls]>button:last-child]:w-16 lg:[&_[data-viz-mobile-controls]]:hidden"
            />
          </>
        )}
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
