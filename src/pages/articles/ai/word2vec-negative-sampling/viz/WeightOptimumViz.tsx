import LinePlot from "./LinePlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #count-prior — 관찰 1에 추첨 k. 라벨 1 비중 1/(k+1). L(s) = −lnσ(s) − k lnσ(−s)의 최소점 s* = −ln k.
 * k=5: −1.609, k=20: −2.996, 차이 −ln4 ≈ −1.386.
 */
const sigma = (s: number) => 1 / (1 + Math.exp(-s));
const loss = (k: number, s: number) => -Math.log(sigma(s)) - k * Math.log(sigma(-s));
const curve = (k: number) => Array.from({ length: 111 }, (_, i) => { const s = -5 + i * 0.07; return [s, loss(k, s)] as const; });
const K5 = curve(5);
const K20 = curve(20);
const S5 = -Math.log(5);
const S20 = -Math.log(20);
/** 위 칸의 파랑(관찰)·주황(추첨)과 겹치지 않게 곡선은 k별로 다른 색과 선 모양을 씁니다. */
const K5_COLOR = "#64748b";
const K20_COLOR = "#dc2626";
const X_TICKS = [-5, -4, -3, -2, -1, 0, 2].map((at) => ({ at, text: String(at) }));
const Y_TICKS = [0, 4, 8, 12].map((at) => ({ at, text: String(at) }));

const SCENES = [
  { label: "k = 5", summary: "비중 1/6 · s* ≈ −1.609", note: "추첨 다섯 건을 같은 무게로 넣으면 관찰의 비중은 1/6, 내적은 6회입니다. 점수를 자유롭게 움직인다면 바닥은 −ln5입니다.", k: 5 },
  { label: "k = 20", summary: "비중 1/21 · s* ≈ −2.996", note: "관찰의 비중은 1/21, 내적은 21회로 3.5배입니다. 실제 실행시간은 표 접근과 준비 비용도 포함해 이 비율만으로 정해지지 않습니다.", k: 20 },
  { label: "최소점의 이동", summary: "−ln20 + ln5 = −ln4 ≈ −1.386", note: "k를 바꾸면 최적 점수 자체가 옮겨 갑니다. 점수 하나를 독립적으로 움직인다는 가정의 결과이며, 공유된 벡터의 모든 점수가 이 값에 닿는다는 보장은 아닙니다.", k: 0 },
] as const;

export default function WeightOptimumViz() {
  return (
    <SceneShell
      eyebrow="뽑는 개수 k"
      title="추첨을 늘리면 관찰의 비중이 줄고 벌점의 바닥이 옮겨 갑니다"
      description="위 칸은 관찰 한 건(파랑)에 붙는 추첨(주황)입니다. 곡선(회색 k=5, 빨강 점선 k=20)은 점수 하나에 무게 1과 k가 걸린 모형이고 바닥이 최적 점수 s*입니다."
      ariaLabel="추첨 수 5와 20에서 관찰의 비중과 벌점 곡선의 최소점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = scene.k === 0 ? 20 : scene.k;
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex h-5 gap-[2px]" aria-hidden="true">
              <span className="min-w-0 rounded-[2px] bg-[#2563eb]" style={{ flex: "1 1 0" }} />
              {Array.from({ length: 20 }, (_, index) => (
                <span key={index} className="min-w-0 rounded-[2px]" style={{ flex: "1 1 0", backgroundColor: index < count ? "#d97706" : "transparent" }} />
              ))}
            </div>
            <LinePlot
              domain={[-5, 2]}
              range={[0, 14]}
              xTicks={X_TICKS}
              yTicks={Y_TICKS}
              xLabel="점수 s"
              yLabel="벌점 합"
              ariaLabel={`${scene.label}: ${scene.summary}`}
              height={190}
              series={[
                { points: K5, color: K5_COLOR, dim: scene.k === 20 },
                { points: K20, color: K20_COLOR, dash: "5 3", dim: scene.k === 5 },
              ]}
              guides={[
                ...(scene.k !== 20 ? [{ x: S5, color: K5_COLOR }] : []),
                ...(scene.k !== 5 ? [{ x: S20, color: K20_COLOR }] : []),
              ]}
              markers={[
                ...(scene.k !== 20 ? [{ x: S5, y: loss(5, S5), color: K5_COLOR, label: "k=5", dx: 6, dy: 16 }] : []),
                ...(scene.k !== 5 ? [{ x: S20, y: loss(20, S20), color: K20_COLOR, label: "k=20", dx: -6, dy: 16, anchor: "end" as const }] : []),
              ]}
            />
          </div>
        );
      }}
    />
  );
}
