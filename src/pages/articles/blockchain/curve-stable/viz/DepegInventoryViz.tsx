import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #amplification-risk — A가 클수록 균형 부근 출력이 constant-sum에 가깝고,
 * 외부 가치가 0.8로 떨어져도 pool 비율이 1 근처에 머물면 약한 자산이 pool에 쌓인다.
 * 곡선은 본문 invariant 식(n=2, D=3,000,000)에 A를 넣어 푼 값이다(fee 무시).
 * fixture 표시값 A=2,000을 식에 넣으면 y=1,499,000.000167…로 표와 어긋나고, 식의 A=1,000이 본문 표의 SOLVED y 1,499,000.000333…을 재현한다. A=10은 비교용 가정이다.
 * A=0이면 식이 x·y=(D/2)², 즉 constant-product가 된다.
 */

const SHARES = Array.from({ length: 50 }, (_, index) => 50 + index);

// token0 비중 50%~99%에서 token0 1개의 한계 교환 비율(token1). 위 식을 정밀 소수로 풀어 반올림했다.
const PRICE_A1000 = [1.0, 1.0, 1.0, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9998, 0.9998, 0.9998, 0.9998, 0.9997, 0.9997, 0.9997, 0.9996, 0.9996, 0.9996, 0.9995, 0.9995, 0.9994, 0.9994, 0.9993, 0.9993, 0.9992, 0.9991, 0.999, 0.9989, 0.9988, 0.9987, 0.9985, 0.9984, 0.9982, 0.9979, 0.9977, 0.9973, 0.9969, 0.9964, 0.9958, 0.9949, 0.9939, 0.9924, 0.9904, 0.9875, 0.9831, 0.9758, 0.9627, 0.9356, 0.8663, 0.6211];
const PRICE_A10 = [1.0, 0.9981, 0.9962, 0.9943, 0.9923, 0.9903, 0.9883, 0.9863, 0.9841, 0.982, 0.9797, 0.9773, 0.9748, 0.9722, 0.9695, 0.9666, 0.9636, 0.9603, 0.9568, 0.9531, 0.9491, 0.9447, 0.94, 0.9349, 0.9293, 0.9232, 0.9164, 0.909, 0.9008, 0.8916, 0.8814, 0.8699, 0.857, 0.8424, 0.8258, 0.8069, 0.7853, 0.7605, 0.7318, 0.6987, 0.6603, 0.6158, 0.5644, 0.5053, 0.4381, 0.363, 0.2816, 0.1972, 0.1156, 0.0458];
const PRICE_A0 = SHARES.map((share) => (100 - share) / share);

const CURVES = [
  { key: "a1000", label: "fixture A=2,000 (본문 식에 넣는 A=1,000)", color: "#2563eb", dash: undefined, prices: PRICE_A1000, depegShare: 98.4 },
  { key: "a10", label: "A=10 (가정)", color: "#d97706", dash: "2 4", prices: PRICE_A10, depegShare: 85.3 },
  { key: "a0", label: "A=0 · constant-product", color: "#64748b", dash: "7 5", prices: PRICE_A0, depegShare: 55.6 },
] as const;

const INVENTORY = [
  { label: "peg 전 균형", token0: 1_500_000, token1: 1_500_000, flow: "fixture 시작 잔액" },
  { label: "A=0", token0: 1_677_051, token1: 1_341_641, flow: "token0 177,051 입금 · token1 158,359 인출" },
  { label: "A=10 (가정)", token0: 2_618_331, token1: 449_917, flow: "token0 1,118,331 입금 · token1 1,050,083 인출" },
  { label: "fixture A=2,000 (식의 A=1,000)", token0: 2_964_058, token1: 47_243, flow: "token0 1,464,058 입금 · token1 1,452,757 인출" },
] as const;

const SCENES = [
  {
    label: "같은 1,000 입력",
    summary: "1,000 · 999.999667 · 999.334",
    note: "Constant-sum은 x+y가 일정한 직선이라 1,000을 넣으면 정확히 1,000을 줍니다. Constant-product는 x·y가 일정한 곡선입니다. 본문 fixture의 fee 전 출력 999.999667은 constant-sum과 0.000333 차이이고, 같은 1,500,000/1,500,000 잔액의 constant-product 출력 999.334와는 0.67 가까이 차이 납니다.",
  },
  {
    label: "균형에서 멀어질 때",
    summary: "비중 90%에서 0.994 · 0.660 · 0.111",
    note: "가로축은 pool 안 token0의 비중, 세로축은 그 상태에서 token0 1개가 받는 token1 비율입니다. Fixture 곡선은 token0 비중 90%에서도 0.994를 유지하다가 끝에서야 급하게 떨어집니다. A가 크다고 곱 항이 사라지지 않아 고갈 직전에는 비율이 다시 가파르게 내려갑니다.",
  },
  {
    label: "외부 가치 0.8",
    summary: "0.8에 닿는 비중 98.4% · 85.3% · 55.6%",
    note: "Token0의 외부 가치가 0.8로 떨어졌다고 둡니다(가정). 거래자는 pool이 0.8보다 많이 주는 동안 token0을 넣는다고 둡니다(가정, fee 무시). 비율이 0.8에 닿는 token0 비중은 fixture 곡선 98.4%, A=10 85.3%, constant-product 55.6%입니다.",
  },
  {
    label: "LP inventory",
    summary: "token1 1,500,000 → 47,243",
    note: "LP(pool에 자산을 맡긴 유동성 공급자)가 가진 pool 잔액이 약한 token0 쪽으로 기웁니다. 같은 가정에서 fixture 곡선은 token1 1,452,757개를 내보내고 token0을 2,964,058개 남깁니다. 곡선은 손실을 없애지 못하고 약해진 자산을 pool에 더 많이 남길 수 있습니다.",
  },
] as const;

const W = 400;
const H = 250;
const X0 = 40;
const X1 = 388;
const Y0 = 20;
const Y1 = 206;
const sx = (share: number) => X0 + ((share - 50) / 50) * (X1 - X0);
const sy = (price: number) => Y1 - price * (Y1 - Y0);

function OutputLine() {
  const lo = 999.2;
  const hi = 1000.05;
  const px = (value: number) => 24 + ((value - lo) / (hi - lo)) * 340;
  const marks = [
    { value: 1000, label: "constant-sum 1,000", color: "#0f766e", y: 22, dash: undefined },
    { value: 999.999667, label: "fixture 999.999667", color: "#2563eb", y: 132, dash: undefined },
    { value: 999.334, label: "constant-product 999.334", color: "#64748b", y: 46, dash: "7 5" },
  ];
  return (
    <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="token0 1,000 입력에 대한 세 곡선의 출력 위치">
      <line x1={24} x2={376} y1={90} y2={90} stroke="#94a3b8" strokeWidth={1} />
      {[999.2, 999.4, 999.6, 999.8, 1000].map((tick) => (
        <g key={tick}>
          <line x1={px(tick)} x2={px(tick)} y1={86} y2={94} stroke="#94a3b8" strokeWidth={1} />
          <text x={px(tick)} y={110} textAnchor="middle" fontSize={12} fill="#64748b">{tick.toFixed(1)}</text>
        </g>
      ))}
      {marks.map((mark) => (
        <g key={mark.label}>
          <line x1={px(mark.value)} x2={px(mark.value)} y1={mark.y < 90 ? mark.y + 6 : 92} y2={mark.y < 90 ? 90 : mark.y - 14} stroke={mark.color} strokeWidth={1.25} strokeDasharray={mark.dash} />
          <circle cx={px(mark.value)} cy={90} r={4.5} fill={mark.color} />
          <text x={mark.value > 999.9 ? px(mark.value) + 6 : px(mark.value) - 10} y={mark.y} textAnchor={mark.value > 999.9 ? "end" : "start"} fontSize={13} fontWeight={700} fill={mark.color}>{mark.label}</text>
        </g>
      ))}
      <text x={24} y={160} fontSize={12} fill="#64748b">token1 출력 (fee 전) · token0 1,000 입력</text>
    </svg>
  );
}

function PriceChart({ showDepeg }: { showDepeg: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-lg" role="img" aria-label={showDepeg ? "세 곡선이 교환 비율 0.8에 닿는 token0 비중" : "token0 비중에 따른 세 곡선의 교환 비율"}>
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
        <g key={tick}>
          <line x1={X0} x2={X1} y1={sy(tick)} y2={sy(tick)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={X0 - 6} y={sy(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick.toFixed(1)}</text>
        </g>
      ))}
      {[50, 60, 70, 80, 90, 100].map((tick) => (
        <text key={tick} x={sx(tick)} y={Y1 + 16} textAnchor="middle" fontSize={12} fill="#64748b">{tick}%</text>
      ))}
      <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
      <line x1={X0} x2={X0} y1={Y0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
      <text x={(X0 + X1) / 2} y={H - 4} textAnchor="middle" fontSize={12} fill="#64748b">pool 안 token0 비중</text>
      {CURVES.map((curve) => (
        <polyline
          key={curve.key}
          points={curve.prices.map((price, index) => `${sx(SHARES[index]).toFixed(1)},${sy(price).toFixed(1)}`).join(" ")}
          fill="none"
          stroke={curve.color}
          strokeWidth={1.25}
          strokeDasharray={curve.dash}
        />
      ))}
      {showDepeg && (
        <g>
          <line x1={X0} x2={X1} y1={sy(0.8)} y2={sy(0.8)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
          <text x={sx(61)} y={sy(0.8) - 7} fontSize={12.5} fontWeight={700} fill="#dc2626">외부 가치 0.8 (가정)</text>
          {CURVES.map((curve) => (
            <g key={curve.key}>
              <circle cx={sx(curve.depegShare)} cy={sy(0.8)} r={4.5} fill="#ffffff" stroke={curve.color} strokeWidth={1.25} />
              <text x={sx(curve.depegShare)} y={sy(0.8) + 19} textAnchor={curve.depegShare > 95 ? "end" : "middle"} fontSize={13} fontWeight={700} fill={curve.color}>{curve.depegShare}%</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {CURVES.map((curve) => (
        <li key={curve.key} className="flex items-center gap-1.5">
          <svg width="26" height="8" aria-hidden="true">
            <line x1={0} x2={26} y1={4} y2={4} stroke={curve.color} strokeWidth={1.25} strokeDasharray={curve.dash} />
          </svg>
          <span>{curve.label}</span>
        </li>
      ))}
    </ul>
  );
}

function InventoryBars() {
  return (
    <div className="space-y-3">
      {INVENTORY.map((row) => {
        const share = (row.token0 / (row.token0 + row.token1)) * 100;
        return (
          <div key={row.label} className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
              <strong>{row.label}</strong>
              <span className="text-muted-foreground">{row.flow}</span>
            </div>
            <div className="mt-1 flex h-5 min-w-0 overflow-hidden rounded-sm border border-border">
              <div className="h-full" style={{ width: `${share}%`, backgroundColor: "#f59e0b" }} />
              <div className="h-full flex-1" style={{ backgroundColor: "#93c5fd" }} />
            </div>
            <div className="mt-0.5 flex justify-between font-mono text-[11px]">
              <span>token0 {row.token0.toLocaleString("en-US")} ({share.toFixed(1)}%)</span>
              <span>token1 {row.token1.toLocaleString("en-US")}</span>
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-muted-foreground">주황 = 외부 가치가 떨어진 token0 · 파랑 = token1</p>
    </div>
  );
}

export default function DepegInventoryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6000, { loop: false });
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="A와 peg 위험"
      title="A가 클수록 1:1 근처에 오래 머물고, peg가 깨지면 약한 자산이 더 깊게 쌓일 수 있습니다"
      description="본문 invariant 식(token 2개, D=3,000,000)을 A별로 풀어 같은 pool 상태를 비교합니다."
      note="곡선과 잔액은 fee를 빼고 본문 식을 정밀 소수로 푼 계산입니다. Fixture 표시값 A=2,000을 본문 식에 그대로 넣으면 SOLVED y가 1,499,000.000167…로 표와 어긋나고, A=1,000을 넣어야 표의 1,499,000.000333…이 나오므로 이 값을 fixture 곡선으로 씁니다. 외부 가치 0.8과 거래자 행동은 본문 예시를 따른 가정이며 실제 pool의 측정값이 아닙니다."
      documentFlow
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="A별 교환 비율과 peg 이탈 시 pool 잔액 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={[
            <OutputLine key="output" />,
            <div key="curve" className="space-y-2"><Legend /><PriceChart showDepeg={false} /></div>,
            <div key="depeg" className="space-y-2"><Legend /><PriceChart showDepeg /></div>,
            <InventoryBars key="inventory" />,
          ]}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
