import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import {
  NT_XENT_FIXTURE,
  SIMCLR_BATCH_FIXTURE,
  TEMPERATURE_RATIO_FIXTURE,
} from "./calculations";

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
  const controls = useAnimatedScenes(labels.length, 6200, {
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
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[22rem]">
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
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function ViewCell({ label, source, relation, active }: {
  label: string;
  source: string;
  relation: string;
  active: boolean;
}) {
  return (
    <div className={`min-w-0 border-y px-3 py-3 transition-colors ${active ? "border-primary/70 bg-primary/10" : "border-border bg-background"}`}>
      <div className="flex items-center justify-between gap-2">
        <strong className="font-mono text-sm">{label}</strong>
        <span className="text-[9px] font-bold text-primary">{relation}</span>
      </div>
      <span className="mt-1 block text-[10px] text-muted-foreground">source · {source}</span>
    </div>
  );
}

export function SimCLRBatchShapeViz() {
  const labels = [
    "원본 세 개를 고릅니다",
    "원본마다 view 두 개를 만듭니다",
    "A₁을 anchor로 고릅니다",
    "자기 자신을 뺀 다섯 후보를 만듭니다",
  ] as const;
  const notes = [
    "설명용 batch에는 원본 A·B·C가 있습니다. 원본 sample 수는 N=3입니다.",
    "각 원본에 augmentation을 독립적으로 두 번 적용해 A₁·A₂부터 C₁·C₂까지 2N=6개 encoder 입력을 만듭니다.",
    "A₁이 기준 view가 되면 같은 원본에서 나온 A₂가 positive입니다.",
    "A₁ 자신은 분모에서 제외합니다. 남은 다섯 후보 중 A₂ 하나가 positive이고 B₁·B₂·C₁·C₂ 네 개가 negative로 취급됩니다.",
  ] as const;

  return (
    <Scene id="simclr-batch-shape" eyebrow="Batch shape" title="원본 3개가 6개 view와 5개 후보로 펼쳐집니다" description="A₁ 한 개를 따라 source→view→anchor→candidate set을 확인합니다." labels={labels} notes={notes}>
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-3 gap-2">
            {["A", "B", "C"].map((source) => (
              <div key={source} className={`border-y px-3 py-3 transition-colors ${active === 0 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
                <span className="text-[9px] font-bold text-muted-foreground">SOURCE</span>
                <strong className="mt-1 block font-mono text-base">{source}</strong>
              </div>
            ))}
          </div>
          <div className="my-3 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            augmentation × 2
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["A₁", "A", "ANCHOR"],
              ["A₂", "A", "POSITIVE"],
              ["B₁", "B", "NEGATIVE"],
              ["B₂", "B", "NEGATIVE"],
              ["C₁", "C", "NEGATIVE"],
              ["C₂", "C", "NEGATIVE"],
            ].map(([label, source, relation]) => (
              <ViewCell
                key={label}
                label={label}
                source={source}
                relation={relation}
                active={active === 1 || (active === 2 && label === "A₁") || (active === 3 && label !== "A₁")}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center">
            <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">VIEWS</span><strong>{SIMCLR_BATCH_FIXTURE.viewCount}</strong></div>
            <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">CANDIDATES</span><strong>{SIMCLR_BATCH_FIXTURE.candidateCountPerAnchor}</strong></div>
            <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">NEGATIVES</span><strong>{SIMCLR_BATCH_FIXTURE.negativeCountPerAnchor}</strong></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function NTXentCalculationViz() {
  const labels = [
    "A₁과 후보의 cosine을 적습니다",
    "Temperature로 나눠 logit을 만듭니다",
    "지수 점수를 모두 더합니다",
    "Positive 확률과 loss를 계산합니다",
  ] as const;
  const notes = [
    "설명용 cosine은 A₂부터 C₂까지 0.8·0.4·0.1·−0.1·0.0입니다. 첫 후보 A₂가 positive입니다.",
    "τ=0.5로 나누면 logit은 1.6·0.8·0.2·−0.2·0.0이 됩니다.",
    "각 logit의 exp를 더한 partition Z는 반올림해 10.219입니다.",
    "Positive exp(1.6)을 Z로 나누면 p(A₂|A₁)=0.485이고 −log를 취한 loss는 0.724입니다.",
  ] as const;

  return (
    <Scene id="simclr-ntxent-calculation" eyebrow="NT-Xent calculation" title="다섯 후보의 점수가 positive 확률 0.485가 됩니다" description="같은 숫자로 cosine→logit→exp→probability→loss를 끝까지 계산합니다." labels={labels} notes={notes}>
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[11px] leading-5">
              <thead>
                <tr className="border-y border-border text-muted-foreground">
                  <th className="px-2 py-2">candidate</th>
                  <th className="px-2 py-2">relation</th>
                  <th className="px-2 py-2">cosine</th>
                  <th className="px-2 py-2">÷ τ=0.5</th>
                  <th className="px-2 py-2">exp(logit)</th>
                </tr>
              </thead>
              <tbody>
                {NT_XENT_FIXTURE.candidates.map((candidate, index) => (
                  <tr key={candidate} className={`border-b border-border ${index === 0 ? "bg-primary/10" : ""}`}>
                    <td className="px-2 py-2 font-mono font-bold">{candidate}</td>
                    <td className="px-2 py-2">{index === 0 ? "positive" : "negative"}</td>
                    <td className={`px-2 py-2 font-mono ${active === 0 ? "font-bold text-primary" : ""}`}>{NT_XENT_FIXTURE.similarity[index]}</td>
                    <td className={`px-2 py-2 font-mono ${active === 1 ? "font-bold text-primary" : ""}`}>{NT_XENT_FIXTURE.logits[index]}</td>
                    <td className={`px-2 py-2 font-mono ${active === 2 ? "font-bold text-primary" : ""}`}>{NT_XENT_FIXTURE.exponentialScores[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`mt-4 grid grid-cols-3 gap-px bg-border p-px ${active === 3 ? "ring-1 ring-primary/50" : ""}`}>
            <div className="min-w-0 bg-background px-2 py-3 sm:px-3"><span className="block break-keep text-[8px] text-muted-foreground sm:text-[9px]">PARTITION Z</span><strong className="mt-1 block font-mono">{NT_XENT_FIXTURE.partition}</strong></div>
            <div className="min-w-0 bg-background px-2 py-3 sm:px-3"><span className="block break-keep text-[8px] text-muted-foreground sm:text-[9px]">p(A₂|A₁)</span><strong className="mt-1 block font-mono">{NT_XENT_FIXTURE.positiveProbability}</strong></div>
            <div className="min-w-0 bg-background px-2 py-3 sm:px-3"><span className="block break-keep text-[8px] text-muted-foreground sm:text-[9px]">−log p</span><strong className="mt-1 block font-mono text-primary">{NT_XENT_FIXTURE.loss}</strong></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function TemperatureCollisionViz() {
  const labels = [
    "Similarity 차이 0.1을 고정합니다",
    "τ=1에서는 점수 비가 1.11입니다",
    "τ=0.1에서는 점수 비가 2.72입니다",
    "Hidden positive면 더 강한 오답이 됩니다",
  ] as const;
  const notes = [
    "두 후보의 cosine 차이가 0.1이라고 두고 temperature만 바꿉니다.",
    "exp(0.1/1)=1.11이므로 후보 간 상대 가중치 차이가 완만합니다.",
    "exp(0.1/0.1)=exp(1)=2.72로 차이가 커집니다.",
    "다른 source ID가 실제로 같은 상품이면 분모에 둔 후보는 false negative입니다. 작은 τ는 잘못된 밀어내기도 강화하므로 duplicate audit과 함께 고릅니다.",
  ] as const;

  return (
    <Scene id="simclr-temperature-collision" eyebrow="Temperature boundary" title="Temperature는 후보 관계가 틀렸을 때도 같은 힘을 키웁니다" description="같은 0.1 차이를 두 temperature와 hidden-positive 반례에 적용합니다." labels={labels} notes={notes}>
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <div className={`bg-background px-4 py-5 transition-colors ${active === 1 ? "bg-primary/10" : ""}`}>
              <span className="text-[9px] font-bold text-muted-foreground">τ = {TEMPERATURE_RATIO_FIXTURE.broadTemperature}</span>
              <strong className="mt-2 block font-mono text-xl">×{TEMPERATURE_RATIO_FIXTURE.broadRatio}</strong>
              <span className="mt-2 block text-xs text-muted-foreground">완만한 상대 가중치</span>
            </div>
            <div className="hidden items-center bg-background px-3 text-muted-foreground sm:flex">같은 Δ=0.1</div>
            <div className={`bg-background px-4 py-5 transition-colors ${active >= 2 ? "bg-primary/10" : ""}`}>
              <span className="text-[9px] font-bold text-muted-foreground">τ = {TEMPERATURE_RATIO_FIXTURE.sharpTemperature}</span>
              <strong className="mt-2 block font-mono text-xl">×{TEMPERATURE_RATIO_FIXTURE.sharpRatio}</strong>
              <span className="mt-2 block text-xs text-muted-foreground">날카로운 상대 가중치</span>
            </div>
          </div>
          <div className={`mt-4 border-y px-4 py-4 transition-colors ${active === 3 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
            <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_7rem] sm:items-center">
              <strong className="font-mono text-sm">B₁ · 다른 ID</strong>
              <span className="text-xs leading-5 text-muted-foreground">실제 SKU-42 중복 사진이라면 A₁의 hidden positive</span>
              <span className="text-left text-[10px] font-bold text-primary sm:text-right">분모에서 제외</span>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}
