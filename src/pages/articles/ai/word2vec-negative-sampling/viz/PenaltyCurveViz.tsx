import LinePlot from "./LinePlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sgns — 라벨 1 벌점 −lnσ(s), 라벨 0 벌점 −lnσ(−s).
 * s=1에서 약 0.313262와 1.313262. 합 0.313262 + 2×1.313262 ≈ 2.939785.
 */
const sigma = (s: number) => 1 / (1 + Math.exp(-s));
const curve = (fn: (s: number) => number) => Array.from({ length: 81 }, (_, i) => { const s = -4 + i * 0.1; return [s, fn(s)] as const; });
const POS = curve((s) => -Math.log(sigma(s)));
const NEG = curve((s) => -Math.log(sigma(-s)));
const A = -Math.log(sigma(1));
const C = -Math.log(sigma(-1));
const X_TICKS = [-4, -2, 0, 1, 2, 4].map((at) => ({ at, text: String(at) }));
const Y_TICKS = [0, 1, 2, 3, 4].map((at) => ({ at, text: String(at) }));

const SCENES = [
  { label: "관찰 cat", summary: "s=1 → 약 0.313262", note: "표시 1인 짝은 점수가 높을수록 벌점이 작습니다. 점수 1에서 벌점은 약 0.313262입니다." },
  { label: "추첨 red·dog", summary: "s=1 → 약 1.313262", note: "표시 0인 짝은 곡선이 좌우로 뒤집혀 점수가 낮을수록 벌점이 작습니다. 같은 점수 1인데 벌점은 약 1.313262로 더 큽니다." },
  { label: "세 벌점의 합", summary: "L ≈ 2.939785", note: "cat 한 건과 red·dog 두 건의 벌점을 더합니다. 추첨 결과를 red와 dog로 고정하고 아직 표를 고치지 않은 상태의 값입니다." },
] as const;

export default function PenaltyCurveViz() {
  return (
    <SceneShell
      eyebrow="같은 점수, 다른 벌점"
      title="표시에 따라 점수 1의 벌점이 달라집니다"
      description="가로는 점수 s, 세로는 벌점입니다. 파란 곡선이 관찰(표시 1), 주황 곡선이 추첨(표시 0)이며 σ는 6절의 sigmoid입니다."
      ariaLabel="표시 1과 표시 0의 벌점 곡선에서 점수 1의 벌점과 세 벌점의 합"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <LinePlot
            domain={[-4, 4]}
            range={[0, 4.4]}
            xTicks={X_TICKS}
            yTicks={Y_TICKS}
            xLabel="점수 s"
            yLabel="벌점"
            ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
            series={[
              { points: POS, color: "#2563eb", dim: active === 1 },
              { points: NEG, color: "#d97706", dim: active === 0 },
            ]}
            guides={[{ x: 1, color: "#94a3b8" }]}
            markers={[
              ...(active !== 1 ? [{ x: 1, y: A, color: "#2563eb", label: "cat 0.313", dx: 7, dy: -6 }] : []),
              ...(active !== 0 ? [{ x: 1, y: C, color: "#d97706", label: "red·dog 1.313", dx: 7, dy: -6 }] : []),
            ]}
          />
          <div className={`flex h-5 min-w-0 overflow-hidden rounded-sm border border-border text-[11px] font-bold text-white ${active === 2 ? "" : "invisible"}`} aria-hidden={active !== 2}>
            <span className="flex items-center justify-center" style={{ width: `${(A / (A + 2 * C)) * 100}%`, backgroundColor: "#2563eb" }}>cat</span>
            <span className="flex items-center justify-center border-l border-background" style={{ width: `${(C / (A + 2 * C)) * 100}%`, backgroundColor: "#d97706" }}>red</span>
            <span className="flex items-center justify-center border-l border-background" style={{ width: `${(C / (A + 2 * C)) * 100}%`, backgroundColor: "#d97706" }}>dog</span>
          </div>
        </div>
      )}
    />
  );
}
