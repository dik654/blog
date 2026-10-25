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
      eyebrow="한 데이터의 주장 경로"
      title="열두 visit row가 배포 가능한 주장으로 바뀌는 네 단계"
      description="Row를 세기 전에 공유 원인을 찾고, 그 원인을 split 사이에서 격리합니다. 이어서 삭제 가능한 lineage와 평가 근거가 있는 slice만 남깁니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label="도메인 데이터 경계의 4단계 흐름"
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
  "열두 row 뒤의 환자 네 명을 찾습니다",
  "같은 환자를 한 split에 두고 시간을 나눕니다",
  "원본에서 checkpoint까지 삭제 경로를 잇습니다",
  "근거가 충분한 cell만 주장 범위에 둡니다",
] as const;

const TRACE_NOTES = [
  "12개 row는 환자 A·B·C·D의 방문 3회씩입니다. 독립 표본은 row 12개가 아니라 환자 4명입니다 [A].",
  "무작위 split은 같은 환자를 양쪽에 둘 수 있습니다. Group split은 A·B·C를 train에, D를 test에 둡니다.",
  "S-17 → d2 → shard 04 → run r8 → checkpoint v2를 이어 권리 변경과 삭제 범위를 찾습니다.",
  "12개 cell 중 독립 group 30개 이상인 9개만 근거로 둡니다. Coverage는 0.75이고 3개는 주장 밖입니다.",
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

export function DataGovernanceTraceViz() {
  return (
    <TraceScene id="data-governance-trace" labels={TRACE_LABELS} notes={TRACE_NOTES}>
      {(active) => (
        <div role="img" aria-label={TRACE_NOTES[active]}>
          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)_2.2rem_minmax(0,1fr)] sm:items-stretch sm:gap-1 sm:bg-transparent sm:p-0">
            <StageCard active={active === 0} number="01 · CAUSE" title="12 rows → 4 patients" detail="A·B·C·D × visit 3" />
            <StageArrow active={active >= 1} label="격리" />
            <StageCard active={active === 1} number="02 · SPLIT" title="ABC train · D test" detail="group-safe · time-safe" />
            <StageArrow active={active >= 2} label="lineage" />
            <StageCard active={active === 2} number="03 · RIGHTS" title="S-17 → ckpt-v2" detail="영향 범위와 삭제 경로" />
            <StageArrow active={active >= 3} label="근거" />
            <StageCard active={active === 3} number="04 · CLAIM" title="9 / 12 cells" detail="coverage 0.75 · 3개 제외" />
          </div>
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-y border-border px-3 py-3 text-xs leading-6">
            <strong>현재 결과</strong>
            <span className="break-keep text-muted-foreground">
              {[
                "독립 단위는 row 12개가 아니라 환자 4명입니다.",
                "환자 D의 세 visit만 test에 남겨 같은 환자 기억을 차단합니다.",
                "삭제 요청이 영향을 주는 shard·run·checkpoint를 역추적합니다.",
                "근거가 빈 세 cell은 성능 주장과 자동 배포에서 제외합니다.",
              ][active]}
            </span>
          </div>
        </div>
      )}
    </TraceScene>
  );
}

const PATIENTS = ["A", "B", "C", "D"] as const;

export function GroupTimeSplitViz() {
  return (
    <VizFrame
      eyebrow="Group·time split"
      title="행을 무작위로 나누면 같은 환자가 정답 쪽에도 남습니다"
      description="파란 칸은 train, 붉은 칸은 test입니다. 같은 환자의 visit이 양쪽에 있으면 새 환자 일반화를 측정할 수 없습니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="12개 visit row를 무작위로 나눈 경우와 환자 A B C를 train, D를 test로 격리한 경우의 비교">
        <div className="border-y border-border">
          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b border-border px-2 py-3 text-[9px] font-black text-muted-foreground sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] sm:px-4 sm:text-[10px]">
            <span>환자</span><span>RANDOM ROW · LEAK</span><span>GROUP · 격리</span>
          </div>
          {PATIENTS.map((patient, patientIndex) => (
            <div key={patient} className="grid grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 border-b border-border px-2 py-3 last:border-b-0 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] sm:px-4">
              <strong className="font-mono text-xs">{patient}</strong>
              <div className="grid grid-cols-3 gap-1" aria-label={`환자 ${patient}의 random row split`}>
                {[0, 1, 2].map((visit) => {
                  const test = (patientIndex + visit) % 3 === 0;
                  return <span key={visit} title={`visit ${visit + 1} · ${test ? "test" : "train"}`} className={`flex min-h-8 items-center justify-center border font-mono text-[9px] font-bold ${test ? "border-destructive/45 bg-destructive/[0.06] text-destructive" : "border-primary/45 bg-primary/[0.07] text-primary"}`}>{test ? "E" : "T"}</span>;
                })}
              </div>
              <div className="grid grid-cols-3 gap-1" aria-label={`환자 ${patient}의 group split`}>
                {[0, 1, 2].map((visit) => {
                  const test = patient === "D";
                  return <span key={visit} title={`visit ${visit + 1} · ${test ? "test" : "train"}`} className={`flex min-h-8 items-center justify-center border font-mono text-[9px] font-bold ${test ? "border-destructive/45 bg-destructive/[0.06] text-destructive" : "border-primary/45 bg-primary/[0.07] text-primary"}`}>{test ? "E" : "T"}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold"><span className="text-primary">T · train</span><span className="text-destructive">E · evaluation</span><span className="text-muted-foreground">각 칸 · visit 1개</span></div>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-y border-border px-3 py-4 text-center text-xs">
          <div><span className="block text-[10px] text-muted-foreground">Group 교집합</span><strong className="font-mono">∅</strong></div>
          <span className="text-primary" aria-hidden>+</span>
          <div><span className="block text-[10px] text-muted-foreground">시간 방향</span><strong className="font-mono">max train &lt; min test</strong></div>
        </div>
      </div>
    </VizFrame>
  );
}

export function RightsLineageViz() {
  const nodes = [
    { no: "01", title: "Source S-17", detail: "consent · retention · collected_at" },
    { no: "02", title: "Derivative d2", detail: "de-identification revision" },
    { no: "03", title: "Shard 04", detail: "row IDs · checksum" },
    { no: "04", title: "Run r8", detail: "dataset manifest digest" },
    { no: "05", title: "Checkpoint v2", detail: "release · rollback · deletion impact" },
  ] as const;

  return (
    <VizFrame
      eyebrow="권리와 삭제 lineage"
      title="출처 URL 하나가 아니라 파생물과 모델까지 이어지는 경로를 남깁니다"
      description="권리 조건이 바뀌거나 삭제 요청이 들어오면 오른쪽 산출물에서 왼쪽 source까지 왕복할 수 있어야 합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="Source S-17에서 checkpoint v2까지 이어지는 권리와 삭제 경로">
        <div className="grid gap-px bg-border p-px sm:grid-cols-5">
          {nodes.map((node) => (
            <div key={node.no} className="grid min-w-0 grid-cols-[2.2rem_minmax(0,1fr)] gap-3 bg-background px-3 py-4 sm:block sm:px-4 sm:py-5">
              <span className="font-mono text-[9px] font-black text-primary">{node.no}</span>
              <div className="min-w-0 sm:mt-2">
                <strong className="block break-keep text-xs leading-5 sm:text-sm">{node.title}</strong>
                <span className="mt-1 block break-words text-[10px] leading-5 text-muted-foreground">{node.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px">
          <div className="bg-background px-4 py-4"><span className="text-[10px] font-bold text-muted-foreground">정방향 질문</span><strong className="mt-1 block break-keep text-sm">이 checkpoint는 어떤 source에서 왔습니까?</strong></div>
          <div className="bg-primary/[0.07] px-4 py-4"><span className="text-[10px] font-bold text-primary">역방향 질문</span><strong className="mt-1 block break-keep text-sm">S-17 삭제 시 어떤 artifact가 영향받습니까?</strong></div>
        </div>
      </div>
    </VizFrame>
  );
}

export function EvidenceCoverageViz() {
  const cells = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, count: index < 9 ? 30 + index : 11 + index, pass: index < 9 }));

  return (
    <VizFrame
      eyebrow="평가 근거 범위"
      title="열두 cell 중 독립 group이 충분한 아홉 cell만 주장 범위에 둡니다"
      description="설명용 최소 근거 수는 30입니다 [A]. Row 수가 아니라 cell마다 고유한 환자·family·lot 같은 group 수를 셉니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-5 sm:!p-7"
    >
      <div role="img" aria-label="필수 평가 cell 12개 가운데 독립 group 수 30 이상인 9개는 근거 있음, 나머지 3개는 주장 밖인 coverage 0.75 그림">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {cells.map((cell) => (
            <div key={cell.id} className={`flex min-h-16 flex-col items-center justify-center border text-center ${cell.pass ? "border-primary/50 bg-primary/[0.07]" : "border-destructive/45 bg-destructive/[0.05]"}`}>
              <span className="font-mono text-[9px] text-muted-foreground">CELL {String(cell.id).padStart(2, "0")}</span>
              <strong className={`mt-1 font-mono text-sm ${cell.pass ? "text-primary" : "text-destructive"}`}>n={cell.count}</strong>
              <span className="mt-1 text-[9px] font-bold">{cell.pass ? "근거 있음" : "주장 밖"}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px text-center">
          <div className="bg-background px-2 py-4"><span className="text-[10px] text-muted-foreground">Required</span><strong className="mt-1 block font-mono text-base">12</strong></div>
          <div className="bg-background px-2 py-4"><span className="text-[10px] text-muted-foreground">Evidence</span><strong className="mt-1 block font-mono text-base">9</strong></div>
          <div className="bg-primary/[0.07] px-2 py-4"><span className="text-[10px] font-bold text-primary">Coverage</span><strong className="mt-1 block font-mono text-base text-primary">9 / 12 = 0.75</strong></div>
        </div>
        <p className="mt-4 border-l border-primary/45 pl-3 text-xs leading-6 text-muted-foreground">Cell 10·11·12는 실패 점수가 아니라 근거 부족 상태입니다. 자동 배포 범위에서 빼거나 human review로 보내야 합니다.</p>
      </div>
    </VizFrame>
  );
}
