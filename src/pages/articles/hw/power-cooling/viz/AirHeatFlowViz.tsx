import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cooling-path Q = ṁ·cp·ΔT — 2kW, cp = 1005 J/(kg·K), ΔT = 10K → 약 0.199 kg/s.
 * 1kg × 1005 × 10 = 10,050 J. 2,000 ÷ 10,050 ≈ 0.199. ΔT 5K는 설명용 가정: 2,000 ÷ 5,025 ≈ 0.398.
 */
type Scene = { label: string; summary: string; note: string; dt: number; share: number | null };

const CP = 1005;
const Q = 2000;
const SCENES: readonly Scene[] = [
  { label: "공기 1kg이 10K 데워지면", summary: "1 × 1005 × 10 = 10,050 J", dt: 10, share: null, note: "비열 1005 J/(kg·K)는 공기 1kg을 1K 올리는 데 드는 열입니다. 서버를 지나며 10K 데워지면 그 1kg은 10,050J을 싣고 나갑니다." },
  { label: "매초 2,000J을 내보내야 합니다", summary: "2,000 ÷ 10,050 ≈ 0.199 kg/s", dt: 10, share: Q / (CP * 10), note: "2kW는 1초에 2,000J입니다. 1kg이 10,050J을 실으므로 매초 그 약 5분의 1인 0.199kg만 지나가면 됩니다. 이 값을 fan CFM으로 바꾸려면 현장 공기 밀도가 더 필요합니다." },
  { label: "온도 상승을 5K만 허용하면", summary: "2,000 ÷ 5,025 ≈ 0.398 kg/s", dt: 5, share: Q / (CP * 5), note: "(가정) 허용 온도 상승을 절반인 5K로 줄이면 1kg이 싣는 열도 5,025J로 절반이 됩니다. 같은 2kW를 옮기려면 매초 흐르는 공기가 두 배인 약 0.398kg이어야 합니다." },
];

const W = 360;
const H = 120;
const BOX_X = 20;
const BOX_W = 320;
const BOX_Y = 30;
const BOX_H = 44;

export default function AirHeatFlowViz() {
  return (
    <SceneShell
      eyebrow="공기가 열을 싣는 양"
      title="공기 1kg이 실어 나르는 열로 2kW를 나누면 필요한 유량이 나옵니다"
      description="막대 전체가 공기 1kg입니다. 파란 부분은 2kW를 옮기려고 1초마다 서버를 지나야 하는 공기 양입니다. K는 온도차 단위로 1K는 1°C 차이와 같습니다. 2kW·비열 1005·온도 상승 10K는 본문의 예이고, 5K는 비교용 가정입니다(가정)."
      ariaLabel="공기 1킬로그램이 10K 데워질 때 싣는 열 10,050줄, 2킬로와트에 필요한 0.199kg/s, 5K일 때 0.398kg/s"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const perKg = CP * scene.dt;
        const fillW = scene.share === null ? BOX_W : BOX_W * scene.share;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={BOX_X} y={BOX_Y - 10} fontSize={11} fontWeight={700} fill="#334155">공기 1kg</text>
            <text x={BOX_X + BOX_W} y={BOX_Y - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">{`${scene.dt}K 상승 → ${perKg.toLocaleString("en-US")} J`}</text>
            <rect x={BOX_X} y={BOX_Y} width={BOX_W} height={BOX_H} rx={6} fill={scene.share === null ? "#fef3c7" : "#f8fafc"} stroke="#94a3b8" strokeWidth={1} />
            {scene.share !== null && (
              <>
                <rect x={BOX_X} y={BOX_Y} width={fillW} height={BOX_H} rx={6} fill="#2563eb" />
                <line x1={BOX_X + fillW} x2={BOX_X + fillW} y1={BOX_Y - 2} y2={BOX_Y + BOX_H + 10} stroke="#1d4ed8" strokeWidth={1} />
                <text x={BOX_X + fillW + 4} y={BOX_Y + BOX_H + 22} fontSize={11} fontWeight={700} fill="#1d4ed8">{`${scene.share.toFixed(3)} kg = 2,000 J`}</text>
                <text x={BOX_X + fillW + 8} y={BOX_Y + BOX_H / 2 + 4} fontSize={10} fill="#64748b">1초에 지나갈 몫</text>
              </>
            )}
            {scene.share === null && (
              <text x={BOX_X + BOX_W / 2} y={BOX_Y + BOX_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e">{`1kg × 1005 × ${scene.dt}K`}</text>
            )}
          </svg>
        );
      }}
    />
  );
}
