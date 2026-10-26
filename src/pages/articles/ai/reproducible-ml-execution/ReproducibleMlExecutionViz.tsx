import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "계약",
    title: "결과를 보기 전에 무엇을 같다고 볼지 정합니다",
    note: "파일은 bitwise, tensor는 numeric, 여러 seed는 statistical, 중요 사용자 구간은 behavioral gate로 검사한다고 먼저 선언합니다.",
  },
  {
    code: "입력",
    title: "승인한 v21의 입력과 실행 환경을 한 묶음으로 고정합니다",
    note: "데이터 snapshot, code SHA, 모델 bundle, container, 설정, 명령, 하드웨어·runtime profile을 재현 입력으로 기록합니다.",
  },
  {
    code: "난수",
    title: "root seed를 병렬 작업의 좌표별 난수 흐름으로 나눕니다",
    note: "rank·worker·epoch·용도를 포함한 좌표로 child seed를 만들어 서로 다른 worker가 같은 난수열을 복사하지 않게 합니다.",
  },
  {
    code: "빈 환경",
    title: "깨끗한 worker는 실행 전에 증명값부터 대조합니다",
    note: "container digest가 다르면 실행하지 않습니다. 승인 기록과 모두 맞는 환경만 입력을 내려받고 동일한 명령을 수행합니다.",
  },
  {
    code: "첫 차이",
    title: "최종 점수만 보지 않고 처음 달라진 단계를 보고합니다",
    note: "입력·환경·난수·중간 산출물·최종 tensor·지표·중요 구간 순서로 비교해 최초 차이와 복구 위치를 남깁니다.",
  },
] as const;

function ProcessRail({ active }: { active: number }) {
  return (
    <ol className="grid grid-cols-5 gap-px bg-border p-px" aria-label="재현 검증의 다섯 단계">
      {scenes.map((scene, index) => (
        <li
          key={scene.code}
          aria-current={index === active ? "step" : undefined}
          className={`relative min-w-0 overflow-hidden bg-background px-1 py-1.5 text-center sm:py-2 ${
            index === active
              ? "border-b-2 border-primary text-foreground"
              : index < active
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {index === active && (
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
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

function CaseHeader({ attempt }: { attempt: "plan" | "blocked" | "running" | "reported" }) {
  const state = {
    plan: "run-27 / v21 → 재현 계획 repro-31",
    blocked: "repro-31 · 실행 전 차단",
    running: "repro-31 · clean worker 실행",
    reported: "repro-31 · 비교 보고서",
  }[attempt];

  return (
    <div className="grid grid-cols-[5.4rem_minmax(0,1fr)] items-center gap-2 border-l-2 border-primary pl-3 text-xs sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="text-[9px] font-bold text-muted-foreground">지금 추적하는 실행</span>
      <strong className="break-all font-mono text-[10px] leading-5 sm:text-xs">{state}</strong>
    </div>
  );
}

function GateRow({
  label,
  target,
  scope,
}: {
  label: string;
  target: string;
  scope: string;
}) {
  return (
    <div className="grid grid-cols-[4.4rem_minmax(0,1fr)_5.1rem] items-center gap-2 border-b border-border py-1.5 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)_7rem] sm:py-2">
      <strong className="text-[10px] sm:text-xs">{label}</strong>
      <span className="min-w-0 break-keep text-[9px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{scope}</span>
      <span className="text-right font-mono text-[9px] font-bold text-primary sm:text-[10px]">{target}</span>
    </div>
  );
}

function SceneBody({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div>
        <CaseHeader attempt="plan" />
        <div className="mt-3 border-y border-border">
          <GateRow label="Bitwise" scope="모델 bundle·fixture" target="digest 일치" />
          <GateRow label="Numeric" scope="기준 tensor 100.00" target="오차 ≤ 0.11" />
          <GateRow label="Statistical" scope="사전 등록한 seed 집합" target="분포 범위" />
          <GateRow label="Behavioral" scope="중요 사용자 구간" target="정책 통과" />
        </div>
        <p className="mt-3 break-keep text-xs font-bold leading-5 text-primary">
          결과를 본 뒤 허용 오차를 넓히면 재현 검사가 아니라 사후 합리화가 됩니다.
        </p>
      </div>
    );
  }

  if (active === 1) {
    const inputs = [
      ["데이터", "snapshot:7c10…"],
      ["코드", "git:4f2a…"],
      ["모델", "v21 / 9b7e…"],
      ["Container", "sha256:d18c…"],
      ["설정", "sha256:53aa…"],
      ["명령", "train.py --spec v6"],
    ];
    return (
      <div>
        <CaseHeader attempt="plan" />
        <div className="mt-3 grid grid-cols-2 gap-x-3 text-[10px] sm:grid-cols-3 sm:text-xs">
          {inputs.map(([label, value]) => (
            <div key={label} className="min-w-0 border-b border-border py-2">
              <span className="block text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-0.5 block truncate font-mono text-[9px] sm:text-[10px]">{value}</strong>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-2 border-primary pl-3">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground">실행 환경 증명</span>
            <strong className="mt-1 block break-keep text-xs sm:text-sm">GPU·driver·CUDA·PyTorch·determinism 정책</strong>
          </div>
          <span className="border border-primary px-2 py-1 text-[10px] font-bold text-primary">봉인</span>
        </div>
      </div>
    );
  }

  if (active === 2) {
    const children = [
      ["rank 0 · worker 0", "8a13…"],
      ["rank 0 · worker 1", "24fe…"],
      ["rank 1 · worker 0", "c091…"],
      ["rank 1 · worker 1", "73bd…"],
    ];
    return (
      <div>
        <CaseHeader attempt="running" />
        <div className="mt-3 grid grid-cols-[minmax(0,.72fr)_1.4rem_minmax(0,1.28fr)] items-center gap-2">
          <div className="border-y border-primary/60 py-3 text-center">
            <span className="text-[9px] font-bold text-muted-foreground">Root seed</span>
            <strong className="mt-1 block font-mono text-sm">24017</strong>
          </div>
          <motion.span
            aria-hidden
            className="font-mono text-center text-primary"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            →
          </motion.span>
          <div className="grid grid-cols-2 gap-px bg-border p-px">
            {children.map(([coordinate, seed]) => (
              <div key={coordinate} className="min-w-0 bg-background p-2">
                <span className="block break-keep text-[8px] font-bold leading-3 text-muted-foreground sm:text-[9px]">{coordinate}</span>
                <strong className="mt-1 block font-mono text-[10px]">{seed}</strong>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
          <code>hash(root, train, run, rank, worker, epoch)</code> 좌표와 hash 버전을 manifest에 남깁니다.
        </p>
      </div>
    );
  }

  if (active === 3) {
    return (
      <div>
        <CaseHeader attempt="blocked" />
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center sm:gap-4">
          <div className="border-y border-border py-3">
            <span className="text-[9px] font-bold text-muted-foreground">승인 기록</span>
            <strong className="mt-1 block font-mono text-xs">container d18c…</strong>
          </div>
          <span className="font-mono text-destructive" aria-hidden>≠</span>
          <div className="border-y border-destructive/60 py-3">
            <span className="text-[9px] font-bold text-muted-foreground">첫 worker</span>
            <strong className="mt-1 block font-mono text-xs text-destructive">container 91ef…</strong>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-l-2 border-primary pl-3">
          <span className="self-start border border-destructive px-2 py-1 text-[9px] font-bold text-destructive">중지</span>
          <div>
            <strong className="block break-keep text-xs sm:text-sm">잘못된 환경에서는 학습을 시작하지 않습니다</strong>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              worker를 폐기하고 d18c… image로 새로 만든 뒤 입력 digest와 명령까지 다시 대조합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const checks = [
    ["입력", "일치", "snapshot·code·bundle"],
    ["환경", "일치", "container·runtime"],
    ["난수", "일치", "seed manifest"],
    ["중간 산출물", "첫 차이", "step 820 logits"],
    ["최종 결과", "미판정", "상위 단계 실패"],
  ];
  return (
    <div>
      <CaseHeader attempt="reported" />
      <div className="mt-2 border-y border-border text-[9px] sm:mt-3 sm:text-xs">
        {checks.map(([stage, result, detail]) => (
          <div key={stage} className="grid grid-cols-[5rem_3.2rem_minmax(0,1fr)] items-center gap-2 border-b border-border py-1.5 last:border-b-0 sm:grid-cols-[7rem_4.5rem_minmax(0,1fr)] sm:py-2">
            <strong>{stage}</strong>
            <span className={`font-bold ${result === "첫 차이" ? "text-destructive" : result === "일치" ? "text-primary" : "text-muted-foreground"}`}>{result}</span>
            <span className="min-w-0 truncate font-mono text-muted-foreground">{detail}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 break-keep text-xs font-bold leading-5 text-primary">
        입력을 다시 바꾸지 않고 step 820의 연산·library·병렬 reduction부터 조사합니다.
      </p>
    </div>
  );
}

function ReducedMotionSummary() {
  return (
    <div data-viz-live-only className="min-h-0">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">축소 모션 · 전체 순서</p>
      <ol className="mt-3 divide-y divide-border border-y border-border">
        {scenes.map((scene, index) => (
          <li key={scene.code} className="grid gap-1 py-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-4">
            <span className="font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")} · {scene.code}</span>
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

export default function ReproducibleMlExecutionViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, { autoPlay: false, loop: false });
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    liveRegionRef.current?.scrollTo({ top: 0 });
  }, [controls.active]);

  return (
    <VizFrame
      eyebrow="한 실행 다시 만들기"
      title="승인한 v21을 빈 환경에서 재현하는 다섯 단계"
      description="run-27이 만든 v21을 재현 실행 repro-31에서 다시 검증한다고 가정합니다. ID·digest·수치는 흐름을 설명하기 위한 예시이며 실제 측정값이 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="reproducible-ml-execution"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="scroll-mt-24 flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-4"
      >
        {controls.reducedMotion ? (
          <ReducedMotionSummary />
        ) : (
          <>
            <div ref={liveRegionRef} data-viz-live-only className="flex min-h-0 flex-1 flex-col">
              <ProcessRail active={controls.active} />
              <p className="mt-2 hidden text-[10px] font-black uppercase tracking-[.16em] text-primary sm:mt-3 sm:block">
                장면 · {String(controls.active + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 break-keep text-lg font-bold leading-7 sm:mt-2 sm:min-h-8">
                {scenes[controls.active].title}
              </h3>
              <div className="mt-2 flex min-h-0 flex-1 items-center border-t border-border pt-3 sm:mt-3 sm:min-h-56">
                <div className="w-full"><SceneBody active={controls.active} /></div>
              </div>
            </div>
            <AnimatedSceneControls
              {...controls}
              active={controls.active}
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
