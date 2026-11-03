import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "입력 승인",
  "PC1 identity",
  "PC1 labels",
  "PC2 replica",
  "C1 문제",
  "C2 답안",
  "독립 검증",
] as const;

const SCENES = [
  {
    title:
      "먼저 원본 commitment와 이번 sector의 context를 한 작업으로 고정합니다",
    detail:
      "CommD가 piece 목록과 맞는지 확인하고 provider·sector·ticket·PoRep profile을 고정합니다. 이 중 하나라도 바뀌면 새 작업입니다.",
    input: "data D · pieces · profile",
    artifact: "seal job J0",
    storage: "unsealed sector",
    gate: "CommD and path checks",
  },
  {
    title: "PC1은 원본만 보지 않고 이번 replica의 고유한 identity를 만듭니다",
    detail:
      "ReplicaID는 provider·sector·ticket·CommD·porep_id를 흡수합니다. 같은 data라도 sector나 ticket이 다르면 예전 labels를 재사용할 수 없습니다.",
    input: "J0 context",
    artifact: "RID = H(context)",
    storage: "label stores 준비",
    gate: "exact context digest",
  },
  {
    title: "PC1 labels는 앞 layer와 graph parent를 따라 순서대로 이어집니다",
    detail:
      "한 parent label이 다르면 뒤의 dependent labels도 달라집니다. PC1 receipt는 label store의 이름·크기·digest와 완료 marker를 남깁니다.",
    input: "RID · graph parents",
    artifact: "J_PC1 · labels manifest",
    storage: "layered label cache",
    gate: "complete and durable PC1",
  },
  {
    title: "PC2는 labels로 data를 encode하고 두 tree root를 CommR로 묶습니다",
    detail:
      "TreeC의 CommC와 encoded replica TreeRLast의 CommRLast를 같은 PC1 generation에서 읽습니다. 다른 job의 root를 섞으면 CommR receipt를 승인하지 않습니다.",
    input: "J_PC1 · data D",
    artifact: "CommR · J_PC2",
    storage: "sealed replica + trees",
    gate: "same RID and generation",
  },
  {
    title: "C1은 proof를 만들기 전에 어떤 부분을 열어 보일지 정합니다",
    detail:
      "CommD·CommR·provider·sector·ticket·seed와 cache consistency를 확인하고 challenge와 circuit inputs를 만듭니다.",
    input: "J_PC2 · seed",
    artifact: "J_C1 · vanilla inputs",
    storage: "proof inputs",
    gate: "expected statement built",
  },
  {
    title: "C2는 C1의 문제에 대한 SNARK proof bytes를 만듭니다",
    detail:
      "C2 결과는 proof bytes만이 아닙니다. C1 digest, proof order, aggregation profile, parameter revision과 함께 한 receipt로 묶습니다.",
    input: "J_C1 · parameters",
    artifact: "π · J_C2",
    storage: "proof receipt",
    gate: "canonical proof envelope",
  },
  {
    title: "마지막으로 원래 CommD·CommR statement로 독립 검증합니다",
    detail:
      "Verification이 성공해야 cryptographic receipt가 끝납니다. 그 뒤의 chain submission·inclusion·confidence는 별도이며, deadline slack이 없으면 운영 완료로 승인하지 않습니다.",
    input: "π + expected statement",
    artifact: "verified seal receipt",
    storage: "release ledger",
    gate: "verify + remaining time",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} Gate는 ${scene.gate}입니다.`,
);

export function PoRepPipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="원본 sector D · 한 provider · 한 sector generation"
      title="PC1→PC2→C1→C2는 큰 함수의 네 조각이 아니라, 앞 단계 신원을 확인하고 넘기는 artifact chain입니다"
      description="같은 원본도 provider·sector·ticket이 달라지면 다른 replica가 되는 시점부터 독립 검증까지 따라갑니다."
      note="각 장면의 artifact는 예제 이름입니다. 정확한 field·serialization은 고정한 rust-fil-proofs source와 profile을 따릅니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="PoRep PC1 PC2 C1 C2 artifact 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[44rem] space-y-4 sm:min-h-[31rem] xl:min-h-[27rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>
            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  현재 단계 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  다음 단계가 확인할 gate
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.gate}
                </p>
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  파일 존재가 아니라 같은 job generation인지 확인합니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["입력", scene.input],
                ["artifact", scene.artifact],
                ["저장 상태", scene.storage],
                ["승인 조건", scene.gate],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="PoRep artifact chain 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
