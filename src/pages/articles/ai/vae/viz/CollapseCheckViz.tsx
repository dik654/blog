import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training — checkpoint A (0.40, 0.30), B (0.001, 0.002)의 dimension별 KL,
 * z를 prior sample로 바꾸는 시험, 일부 dimension만 쓰는 경우.
 * C (0.70, 0.00)는 평균이 A와 같아지도록 고른 가정값이다. 복원 성능 변화는 글에 숫자가 없어 막대로 그리지 않는다.
 */
const SCENES = [
  { label: "checkpoint A", summary: "(0.40, 0.30) · 평균 0.35", note: "checkpoint는 학습 중 저장한 모델, dimension별 KL은 축마다 prior에서 벗어난 정도입니다. A는 두 축 모두 값이 있습니다." },
  { label: "checkpoint B", summary: "(0.001, 0.002) · 평균 0.0015", note: "B는 두 축 모두 거의 0입니다. 그래도 작은 rate로 충분한 task가 있어 이것만으로 collapse로 확정하지는 않습니다." },
  { label: "z를 바꿔 보는 시험", summary: "encoder의 z → prior sample", note: "B에서 z를 prior sample로 바꿔도 validation reconstruction이 거의 변하지 않는다면 collapse를 먼저 의심할 근거가 됩니다." },
  { label: "평균이 가리는 것", summary: "A와 같은 평균 · 다른 사용", note: "C는 평균이 A와 같지만 한 축만 씁니다. 일부 dimension만 쓰는 경우도 있어 dimension별 값과 교체 전후 변화를 함께 봅니다." },
] as const;

const CHECKPOINTS = [
  { name: "A", dims: [0.4, 0.3] },
  { name: "B", dims: [0.001, 0.002] },
  { name: "C (가정)", dims: [0.7, 0] },
] as const;
const SCALE = 0.8;

function DimBars({ name, dims }: { name: string; dims: readonly [number, number] }) {
  const mean = (dims[0] + dims[1]) / 2;
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold leading-5 sm:text-sm">checkpoint {name}</p>
      <div className="mt-1 space-y-1">
        {dims.map((value, index) => (
          <div key={index} className="grid grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">축 {index + 1}</span>
            <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
              <div className="h-full rounded-sm" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: "#2563eb" }} />
            </div>
            <span className="text-right font-mono">{value}</span>
          </div>
        ))}
        <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 border-t border-border pt-1 text-xs font-bold sm:text-sm">
          <span>평균</span>
          <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm" style={{ width: `${(mean / SCALE) * 100}%`, backgroundColor: "#64748b" }} />
          </div>
          <span className="text-right font-mono">{mean}</span>
        </div>
      </div>
    </div>
  );
}

function Lane({ source, tone, tag }: { source: string; tone: string; tag: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1 text-xs sm:gap-1.5 sm:text-sm">
      <span className="rounded-md border px-2 py-1 font-semibold" style={{ borderColor: tone }}>{source}</span>
      <span aria-hidden className="text-muted-foreground">→</span>
      <span className="rounded-md border border-border px-2 py-1">Decoder</span>
      <span aria-hidden className="text-muted-foreground">→</span>
      <span className="rounded-md border border-border px-2 py-1">{tag}</span>
    </div>
  );
}

function SwapTest() {
  return (
    <div className="min-w-0 space-y-3">
      <Lane source="Encoder의 z" tone="#2563eb" tag="복원 ①" />
      <Lane source="prior sample" tone="#d97706" tag="복원 ②" />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-[#d97706] px-3 py-2 text-xs leading-5 sm:text-sm">
          <strong className="block">①과 ②가 거의 같음</strong>
          decoder가 z의 내용을 거의 쓰지 않을 수 있어 collapse를 먼저 의심합니다.
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-xs leading-5 sm:text-sm">
          <strong className="block">①과 ②가 다름</strong>
          이 시험은 collapse를 의심할 근거가 되지 않습니다.
        </div>
      </div>
    </div>
  );
}

export default function CollapseCheckViz() {
  return (
    <SceneShell
      eyebrow="posterior collapse 진단"
      title="평균 KL 하나로는 latent를 쓰는지 알 수 없습니다"
      description="q(z|x)가 prior에 가까워져 z가 x의 정보를 거의 담지 않는 상태가 posterior collapse입니다. 축별 KL을 보고 z를 바꿔 봅니다."
      ariaLabel="두 checkpoint의 dimension별 KL과 z 교체 시험을 비교하는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <DimBars key="a" name={CHECKPOINTS[0].name} dims={CHECKPOINTS[0].dims} />,
            <DimBars key="b" name={CHECKPOINTS[1].name} dims={CHECKPOINTS[1].dims} />,
            <SwapTest key="swap" />,
            <div key="c" className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              <DimBars name={CHECKPOINTS[0].name} dims={CHECKPOINTS[0].dims} />
              <DimBars name={CHECKPOINTS[2].name} dims={CHECKPOINTS[2].dims} />
            </div>,
          ]}
        />
      )}
    />
  );
}
