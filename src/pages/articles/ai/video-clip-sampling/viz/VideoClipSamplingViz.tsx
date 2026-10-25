import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 5200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible"
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
        <div data-viz-live-only className="flex min-h-[22rem] flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">
            {labels[active]}
          </h4>
          <div className="mt-5 min-w-0">{children(active)}</div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
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
            <li
              key={label}
              className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function TenSecondScale() {
  return (
    <div className="grid grid-cols-11 text-center font-mono text-[9px] text-muted-foreground" aria-hidden="true">
      {Array.from({ length: 11 }, (_, second) => (
        <span key={second}>{second}</span>
      ))}
    </div>
  );
}

function IntervalRow({
  label,
  intervals,
  active,
}: {
  label: string;
  intervals: readonly { start: number; span: number; text: string }[];
  active: boolean;
}) {
  return (
    <div className="grid grid-cols-[3.8rem_minmax(0,1fr)] items-center gap-3">
      <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
      <div className="relative grid h-8 grid-cols-10 gap-px bg-border/60 p-px">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} className="bg-background" />
        ))}
        {intervals.map((interval) => (
          <span
            key={`${interval.start}-${interval.span}-${interval.text}`}
            style={{ gridColumn: `${interval.start + 1} / span ${interval.span}`, gridRow: 1 }}
            className={`z-10 flex min-w-0 items-center justify-center border px-1 font-mono text-[9px] font-bold transition-colors duration-200 ${
              active
                ? "border-primary/70 bg-primary/15 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            {interval.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClipCoverageOverviewViz() {
  const labels = [
    "10초 영상과 12장 예산",
    "세 clip의 실제 구간",
    "겹친 시간을 한 번만 계산",
    "선택과 판정을 receipt로 연결",
  ] as const;
  const notes = [
    "10초 영상을 4장짜리 clip 세 개로 읽습니다. Frame budget은 12장이지만 아직 어느 시간을 봤는지는 모릅니다.",
    "세 clip의 timestamp 구간은 [0,2], [1,3], [8,10]초입니다. 앞의 두 구간은 [1,2]에서 1초 겹칩니다.",
    "겹침을 병합하면 [0,3]과 [8,10]만 남습니다. 관측 시간은 3+2=5초이고 coverage는 5/10=0.5입니다.",
    "같은 평가를 다시 확인하려면 구간뿐 아니라 source·decode·crop·model·reducer revision과 결과 checksum을 하나의 receipt로 잇습니다.",
  ] as const;

  return (
    <Scene
      id="clip-coverage-overview"
      eyebrow="전체 경로"
      title="12장을 어디서 읽었는지부터 최종 score까지"
      description="한 영상에서 clip 구간을 고르고, 겹침을 합친 뒤, 같은 평가를 다시 확인할 기록으로 남깁니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-4" role="img" aria-label={notes[active]}>
          <div className={`border-y px-3 py-3 transition-colors ${active === 0 ? "border-primary/60" : "border-border"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold">원본 영상</span>
              <span className="font-mono text-xs text-primary">10 s · 12 frames</span>
            </div>
            <div className="mt-3 h-2 bg-muted">
              <span className="block h-full w-full bg-foreground/20" />
            </div>
            <TenSecondScale />
          </div>

          <div className="space-y-2">
            <IntervalRow label="clip A" intervals={[{ start: 0, span: 2, text: "0–2" }]} active={active === 1} />
            <IntervalRow label="clip B" intervals={[{ start: 1, span: 2, text: "1–3" }]} active={active === 1} />
            <IntervalRow label="clip C" intervals={[{ start: 8, span: 2, text: "8–10" }]} active={active === 1} />
          </div>

          <div className={`border-y px-3 py-3 transition-colors ${active === 2 ? "border-primary/60 bg-primary/5" : "border-border"}`}>
            <IntervalRow
              label="union"
              intervals={[
                { start: 0, span: 3, text: "0–3" },
                { start: 8, span: 2, text: "8–10" },
              ]}
              active={active === 2}
            />
            <p className="mt-3 text-right font-mono text-xs font-bold">
              (3 s + 2 s) ÷ 10 s = <span className="text-primary">0.5</span>
            </p>
          </div>

          <div className={`grid gap-2 border-y px-3 py-3 transition-colors sm:grid-cols-4 ${active === 3 ? "border-primary/60" : "border-border"}`}>
            {[
              ["receipt", "eval-017"],
              ["입력", "source + PTS"],
              ["실행", "decode + model"],
              ["확정", "reducer + score"],
            ].map(([name, value]) => (
              <div key={name} className="min-w-0">
                <span className="block text-[9px] font-bold text-muted-foreground">{name}</span>
                <strong className={`mt-1 block break-words font-mono text-[11px] ${active === 3 ? "text-primary" : "text-foreground"}`}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </Scene>
  );
}

const UNION_CODE = [
  ["// 시작 시각이 빠른 순서로 정렬합니다.", "intervals = sort_by_start(intervals)"],
  ["// 첫 구간을 현재 병합 구간으로 둡니다.", "current = intervals[0]"],
  ["// 다음 구간이 겹치면 끝 시각을 늘립니다.", "if next.start <= current.end:\n  current.end = max(current.end, next.end)"],
  ["// 떨어져 있으면 현재 구간을 확정하고 새로 시작합니다.", "else:\n  merged.append(current)\n  current = next"],
  ["// 마지막 구간을 더하고 합친 길이를 전체 길이로 나눕니다.", "merged.append(current)\ncoverage = sum(end - start) / duration"],
] as const;

const UNION_STATES = [
  { current: "—", merged: "[]", result: "정렬: [0,2] [1,3] [8,10]" },
  { current: "[0,2]", merged: "[]", result: "첫 구간에서 시작" },
  { current: "[0,3]", merged: "[]", result: "[1,3]이 겹쳐 end를 3으로 확장" },
  { current: "[8,10]", merged: "[[0,3]]", result: "5초 간격을 만나 [0,3] 확정" },
  { current: "완료", merged: "[[0,3],[8,10]]", result: "3초 + 2초 = 5초 · coverage 0.5" },
] as const;

export function IntervalUnionTraceViz() {
  const labels = ["정렬", "첫 구간", "겹침 병합", "간격에서 확정", "길이 합산"] as const;
  const notes = [
    "시작 시각 순서가 정해져야 현재 구간의 끝과 다음 구간의 시작만 비교할 수 있습니다.",
    "[0,2]를 아직 확정하지 않고 current로 잡습니다. 뒤 구간이 겹치면 더 길어질 수 있기 때문입니다.",
    "다음 시작 1은 현재 끝 2보다 작으므로 두 구간은 겹칩니다. Current end를 max(2,3)=3으로 바꿉니다.",
    "다음 시작 8은 현재 끝 3보다 큽니다. [0,3]을 merged에 넣고 [8,10]을 새 current로 둡니다.",
    "마지막 current까지 넣으면 두 구간의 길이는 3초와 2초입니다. 5초를 영상 10초로 나눠 coverage 0.5를 얻습니다.",
  ] as const;

  return (
    <Scene
      id="interval-union-trace"
      eyebrow="Interval union"
      title="세 구간을 두 구간으로 병합하는 실제 순서"
      description="왼쪽 의사코드의 활성 줄과 오른쪽 current·merged 상태를 함께 따라갑니다."
      labels={labels}
      notes={notes}
    >
      {(active) => {
        const state = UNION_STATES[active];
        return (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(15rem,0.82fr)] lg:items-stretch">
            <ol className="min-w-0 border-y border-border" aria-label="Interval union 의사코드">
              {UNION_CODE.map(([comment, code], index) => (
                <li
                  key={comment}
                  className={`border-b border-border px-3 py-2.5 last:border-b-0 ${
                    index === active
                      ? "bg-primary/10 text-foreground"
                      : index < active
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  <span className="block break-keep font-sans text-[10px] leading-5 text-muted-foreground">{comment}</span>
                  <code className="mt-1 block whitespace-pre-wrap font-mono text-[11px] leading-5">{code}</code>
                </li>
              ))}
            </ol>
            <div className="flex min-w-0 flex-col justify-center border-y border-border px-4 py-5">
              <span className="text-[10px] font-bold text-muted-foreground">현재 상태</span>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[10px] text-muted-foreground">current</dt>
                  <dd className="mt-1 break-all font-mono text-lg font-bold text-primary">{state.current}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-muted-foreground">merged</dt>
                  <dd className="mt-1 break-all font-mono text-sm font-bold">{state.merged}</dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-border pt-4 text-sm font-semibold leading-6">{state.result}</p>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

export function SegmentSamplingPolicyViz() {
  const labels = ["90 frames를 세 구간으로 나누기", "학습에서는 구간 안에서 무작위 선택", "평가에서는 중앙 frame 선택", "실제 선택값을 receipt에 기록"] as const;
  const notes = [
    "90 frames를 [0,30), [30,60), [60,90) 세 구간으로 나눕니다. Segment는 후보 범위를 정할 뿐 아직 frame을 고르지 않습니다.",
    "학습 예시는 각 구간에서 7, 42, 83을 골랐습니다. 다음 epoch에는 seed와 난수 상태에 따라 다른 frame이 선택될 수 있습니다.",
    "평가 예시는 각 구간의 중앙인 15, 45, 75를 고릅니다. TensorFlow Models 2.16.1 공식 API가 설명하는 evaluation 동작입니다.",
    "재현할 때는 sampler 이름만 남기지 않고 실제 frame index나 timestamp, training flag, seed와 구현 revision을 기록합니다.",
  ] as const;
  const train = [7, 42, 83];
  const evaluation = [15, 45, 75];

  return (
    <Scene
      id="segment-sampling-policy"
      eyebrow="Sampling policy"
      title="같은 세 segment에서 학습과 평가가 다른 frame을 고르는 이유"
      description="TSN 계열 sampling의 구간 분할은 유지하되, 학습은 다양성을 위해 무작위로 고르고 평가는 재현을 위해 중앙값을 고릅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-5" role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-3 gap-px bg-border p-px">
            {["0–29", "30–59", "60–89"].map((range, index) => (
              <div key={range} className={`min-w-0 bg-background px-3 py-5 text-center ${active === 0 ? "text-primary" : "text-foreground"}`}>
                <span className="block text-[9px] font-bold text-muted-foreground">segment {index + 1}</span>
                <strong className="mt-1 block font-mono text-sm">{range}</strong>
              </div>
            ))}
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-2">
            <div className={`bg-background px-4 py-4 ${active === 1 ? "text-primary" : "text-muted-foreground"}`}>
              <span className="text-[10px] font-bold">training · random</span>
              <strong className="mt-2 block font-mono text-lg">{train.join(" · ")}</strong>
            </div>
            <div className={`bg-background px-4 py-4 ${active >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <span className="text-[10px] font-bold">evaluation · center</span>
              <strong className="mt-2 block font-mono text-lg">{evaluation.join(" · ")}</strong>
            </div>
          </div>
          <div className={`border-y px-4 py-3 font-mono text-xs leading-6 ${active === 3 ? "border-primary/60 text-primary" : "border-border text-muted-foreground"}`}>
            receipt.temporal = &#123; mode: &quot;center&quot;, frames: [15, 45, 75], revision: &quot;tfm-2.16.1&quot; &#125;
          </div>
        </div>
      )}
    </Scene>
  );
}

export function ReplayReceiptTraceViz() {
  const labels = ["원본 식별", "시간 선택", "Tensor 확정", "Clip score 계산", "Video score 확정"] as const;
  const notes = [
    "Receipt eval-017은 source bytes의 hash와 10초 duration에서 시작합니다. 원본이 다르면 뒤 결과를 같은 평가로 비교하지 않습니다.",
    "세 interval과 frame PTS를 기록합니다. Sampler 이름이 같아도 실제 선택값이 다르면 입력 증거가 달라집니다.",
    "Decode revision·pixel format·resize·crop을 적용한 tensor checksum을 남깁니다. 이 값이 다르면 model 이전 단계부터 달라진 것입니다.",
    "고정한 model checksum에서 세 clip score 0.2, 0.8, 0.5가 나왔다고 가정합니다. Tensor는 같은데 score가 다르면 model·dtype·kernel 경계를 확인합니다.",
    "Mean reducer는 (0.2+0.8+0.5)/3=0.5를 기록합니다. Clip score는 같은데 최종값이 다르면 reducer·threshold revision이 달라진 것입니다.",
  ] as const;
  const stages = [
    ["Source", "bytes SHA", "SOURCE_HASH"],
    ["Temporal", "intervals + PTS", "0–2 · 1–3 · 8–10"],
    ["Tensor", "decode + crop SHA", "TENSOR_HASH"],
    ["Model", "revision + scores", "0.2 · 0.8 · 0.5"],
    ["Reducer", "mean + final score", "0.5"],
  ] as const;

  return (
    <Scene
      id="replay-receipt-trace"
      eyebrow="Replay receipt"
      title="입력이 달라진 지점과 판정이 달라진 지점을 분리하기"
      description="평가 ID eval-017을 source부터 video score까지 유지해, 두 replay가 처음 갈라지는 경계를 찾습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-5" role="img" aria-label={notes[active]}>
          <div className="grid gap-2 sm:grid-cols-5">
            {stages.map(([name, role, value], index) => (
              <div
                key={name}
                className={`relative min-w-0 border-y px-3 py-4 transition-colors ${
                  index === active
                    ? "border-primary/70 bg-primary/10"
                    : index < active
                      ? "border-foreground/35"
                      : "border-border text-muted-foreground"
                }`}
              >
                <span className="text-[9px] font-black text-primary">{index + 1}</span>
                <strong className="mt-1 block text-xs">{name}</strong>
                <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{role}</span>
                <code className="mt-3 block break-all font-mono text-[10px] font-bold leading-4">{value}</code>
                {index < stages.length - 1 ? (
                  <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-xs text-primary sm:block">→</span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="grid gap-3 border-y border-border px-4 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center">
            <div>
              <span className="block text-[9px] font-bold text-muted-foreground">평가 ID</span>
              <strong className="mt-1 block font-mono text-sm text-primary">eval-017</strong>
            </div>
            <p className="text-sm font-semibold leading-6">{notes[active]}</p>
          </div>
        </div>
      )}
    </Scene>
  );
}
