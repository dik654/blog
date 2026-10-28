import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = [
  "부모 상태",
  "설정 선택",
  "합계 검사",
  "가격 조건",
  "다음 excess",
  "기본료",
  "헤더 검산",
] as const;

const notes = [
  "부모 블록은 excess 2개분과 사용량 18개분을 남겼습니다. 실행 기본료는 1 Gwei로 고정해 현재 EIP-7918 경로를 추적합니다.",
  "부모의 값은 입력으로 읽지만 target·max·update fraction은 자식 블록 시각에 활성화된 BPO2 설정에서 고릅니다.",
  "2+18=20은 target 14보다 큽니다. 따라서 0으로 초기화하는 첫 분기를 지나 가격 조건을 확인합니다.",
  "부모의 nominal Blob 가격 131,072 wei보다 8,192×1 Gwei가 큽니다. EIP-7918의 reserve-price 경로가 선택됩니다.",
  "자식 excess는 2+floor(18×(21−14)/21)=8개분입니다. 옛 EIP-4844 식을 그대로 쓰면 6이므로 현재 규칙과 결과가 다릅니다.",
  "8×131,072 blob gas를 정수 fake-exponential에 넣으면 아직 1 wei/blob gas입니다. excess가 늘어도 정수 가격이 즉시 오르지는 않습니다.",
  "모든 노드는 부모 헤더와 자식 시각으로 excess 8을 다시 계산합니다. 제작자가 다른 값을 적으면 자식 헤더를 거절합니다.",
] as const;

function StatusCard({
  eyebrow,
  title,
  rows,
  active,
}: {
  eyebrow: string;
  title: string;
  rows: readonly [string, string][];
  active: boolean;
}) {
  return (
    <section
      className={`min-w-0 border p-3 transition-colors duration-300 ${
        active ? "border-primary bg-primary/5" : "border-border bg-background"
      }`}
    >
      <span className="text-[8px] font-black tracking-[0.12em] text-muted-foreground">
        {eyebrow}
      </span>
      <h4 className="mt-1 break-keep text-sm font-bold">{title}</h4>
      <dl className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4">
        {rows.map(([term, value]) => (
          <div
            key={term}
            className="grid grid-cols-[5.3rem_minmax(0,1fr)] gap-2 bg-background px-2 py-2"
          >
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="break-keep text-muted-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Step({
  number,
  title,
  detail,
  state,
}: {
  number: number;
  title: string;
  detail: string;
  state: "future" | "current" | "done";
}) {
  return (
    <div
      className={`min-w-0 border px-3 py-2.5 transition-colors duration-300 ${
        state === "current"
          ? "border-primary bg-primary/5"
          : state === "done"
            ? "border-primary/35 bg-background"
            : "border-border bg-background text-muted-foreground/60"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <strong className="break-keep text-xs">{title}</strong>
        <span className="font-mono text-[9px] font-black text-primary">
          {String(number + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-1.5 break-keep text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

export default function BlobFeeTraceViz() {
  const scenes = useAnimatedScenes(labels.length, 9000, { loop: false });
  const active = scenes.active;
  const status = (step: number) =>
    active === step ? "current" : active > step ? "done" : "future";

  const mobileScenes: readonly ReactNode[] = [
    <StatusCard
      key="parent"
      eyebrow="PARENT HEADER · BPO2 FIXTURE"
      title="부모 블록이 두 가격 입력을 남깁니다"
      active
      rows={[
        ["excess", "2 blobs = 262,144 blob gas"],
        ["used", "18 blobs = 2,359,296 blob gas"],
        ["exec base fee", "1 Gwei"],
      ]}
    />,
    <StatusCard
      key="config"
      eyebrow="CHILD TIMESTAMP → BPO2"
      title="자식 블록에 적용할 설정을 고릅니다"
      active
      rows={[
        ["target", "14 blobs"],
        ["max", "21 blobs"],
        ["fraction", "11,684,671"],
      ]}
    />,
    <StatusCard
      key="sum"
      eyebrow="FIRST BRANCH"
      title="합계가 target보다 작은지 먼저 봅니다"
      active
      rows={[
        ["E + U", "2 + 18 = 20"],
        ["target", "14"],
        ["결과", "20 ≥ 14 · 다음 조건으로"],
      ]}
    />,
    <StatusCard
      key="reserve"
      eyebrow="EIP-7918"
      title="실행 비용과 nominal Blob 가격을 비교합니다"
      active
      rows={[
        ["reserve", "8,192 × 1 Gwei"],
        ["blob price", "131,072 × 1 wei"],
        ["결과", "reserve가 큼 · 새 분기"],
      ]}
    />,
    <StatusCard
      key="excess"
      eyebrow="CHILD EXCESS"
      title="자식 헤더에는 8개분을 기록합니다"
      active
      rows={[
        ["증가분", "floor(18 × 7 / 21) = 6"],
        ["이전 excess", "2"],
        ["다음 excess", "2 + 6 = 8 blobs"],
      ]}
    />,
    <StatusCard
      key="fee"
      eyebrow="INTEGER FEE"
      title="증가한 excess로 자식 기본료를 계산합니다"
      active
      rows={[
        ["입력", "8 × 131,072 blob gas"],
        ["base fee", "1 wei / blob gas"],
        ["one blob", "131,072 wei"],
      ]}
    />,
    <StatusCard
      key="verify"
      eyebrow="CONSENSUS CHECK"
      title="다른 노드도 같은 8을 계산해야 합니다"
      active
      rows={[
        ["expected", "1,048,576 blob gas"],
        ["header", "child.excess_blob_gas"],
        ["불일치", "자식 헤더 거절"],
      ]}
    />,
  ];

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 지도 · Parent usage → Child price"
      title="부모 블록의 사용량이 자식 블록의 가격 상태가 됩니다"
      description="BPO2가 활성화된 자식 블록 하나를 따라가며 설정 선택, EIP-7918 분기, excess 갱신, 정수 기본료와 헤더 검증을 한 번에 연결합니다."
      note="2·18·14·21과 1 Gwei는 계산 경로를 고정한 설명용 fixture입니다. 실제 특정 블록의 수요나 가격을 측정한 값은 아닙니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-blob-fee-scene={active}
        tabIndex={0}
        role="group"
        aria-label="부모 블록의 Blob 사용량이 자식 블록의 excess와 기본료로 이어지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1" aria-label="Blob 가격 계산의 일곱 단계">
            {labels.map((label, index) => (
              <div key={label} className="min-w-0 text-center">
                <span
                  className={`block h-1 ${
                    index === active
                      ? "bg-primary"
                      : index < active
                        ? "bg-primary/35"
                        : "bg-border"
                  }`}
                />
                <span
                  className={`mt-1 block font-mono text-[8px] font-black ${
                    index === active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-72 items-center">
            <div className="w-full">{mobileScenes[active]}</div>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_2rem_minmax(0,1.15fr)_2rem_minmax(0,1fr)] items-stretch gap-3 border border-border bg-background p-3 sm:grid">
          <section className="grid gap-2" aria-label="부모 블록 입력">
            <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
              PARENT BLOCK
            </p>
            <Step number={0} title="Header state" detail="E=2 · U=18 · exec=1 Gwei" state={status(0)} />
            <div className="grid gap-px bg-border p-px text-[10px] leading-4">
              <div className="bg-background px-3 py-2">
                <strong className="text-primary">excess_blob_gas</strong>
                <span className="mt-1 block text-muted-foreground">262,144</span>
              </div>
              <div className="bg-background px-3 py-2">
                <strong className="text-primary">blob_gas_used</strong>
                <span className="mt-1 block text-muted-foreground">2,359,296</span>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center text-xl text-primary" aria-hidden>→</div>

          <section className="grid gap-2" aria-label="자식 블록 가격 계산">
            <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
              CHILD RULES
            </p>
            <Step number={1} title="BPO2 config" detail="target 14 · max 21 · fraction 11,684,671" state={status(1)} />
            <Step number={2} title="Threshold" detail="E+U=20 ≥ target 14" state={status(2)} />
            <Step number={3} title="EIP-7918" detail="reserve price > nominal Blob price" state={status(3)} />
            <Step number={4} title="Update excess" detail="2 + floor(18×7/21) = 8" state={status(4)} />
            <Step number={5} title="Integer fee" detail="fake_exp(1, 8×131,072, 11,684,671) = 1" state={status(5)} />
          </section>

          <div className="flex items-center justify-center text-xl text-primary" aria-hidden>→</div>

          <section className="grid gap-2" aria-label="자식 헤더 결과">
            <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
              CHILD HEADER
            </p>
            <Step number={6} title="Consensus check" detail="calculated excess = header excess" state={status(6)} />
            <div className={`border p-3 transition-colors ${active >= 4 ? "border-primary bg-primary/5" : "border-border"}`}>
              <span className="text-[9px] font-black text-primary">EXCESS</span>
              <strong className="mt-1 block text-lg">1,048,576 blob gas</strong>
              <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">8 blobs 상당 · 가격 상태</span>
            </div>
            <div className={`border p-3 transition-colors ${active >= 5 ? "border-primary bg-primary/5" : "border-border"}`}>
              <span className="text-[9px] font-black text-primary">BASE FEE</span>
              <strong className="mt-1 block text-lg">1 wei / blob gas</strong>
              <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">한 Blob은 131,072 wei</span>
            </div>
          </section>
        </div>

        <p
          data-scene-note
          className="mt-2 h-28 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-14 sm:pl-4 sm:text-sm sm:leading-6"
        >
          <strong className="mb-1 block font-mono text-[9px] text-primary">
            {String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}
          </strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["부모", "설정", "합계", "조건", "excess", "기본료", "검산"]}
          playLabel="Blob 가격 계산 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
