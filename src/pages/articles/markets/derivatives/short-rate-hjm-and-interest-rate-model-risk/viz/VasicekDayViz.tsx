import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 순간 금리 3%, 중심 4%, 되돌림 속도 0.5, 연 흔들림 1% (가정).
 * 연 평균 이동 0.5 × (4% − 3%) = 0.5%p, 하루 0.5%p ÷ 252 = 0.198bp ≈ 0.2bp,
 * 하루 표준 흔들림 1% ÷ √252 = 6.30bp. 1bp = 0.01%p.
 */
const DAILY_DRIFT_BP = (0.5 * (4 - 3) * 100) / 252;
const DAILY_SD_BP = 100 / Math.sqrt(252);

const W = 360;
const H = 150;
const LEFT = 24;
const RIGHT = 24;
const AXIS_Y = 96;

const SCENES = [
  { label: "중심까지의 거리", summary: "4% − 3% = 1%p", zoom: false, step: 0, note: "오늘의 아주 짧은 금리는 3%이고 오래 머무는 중심은 4%입니다(가정). 둘 사이의 거리가 1%포인트입니다." },
  { label: "1년 평균 이동", summary: "0.5 × 1%p = 연 0.5%p", zoom: false, step: 1, note: "되돌아가는 속도 0.5를 거리 1%포인트에 곱하면, 평균만 볼 때 중심 쪽으로 연 0.5%포인트 움직이려 합니다. 화살표 길이는 아래 눈금으로 0.5%포인트이며, 방향과 속도를 뜻할 뿐 1년 뒤 도착점을 찍은 것이 아닙니다." },
  { label: "하루로 나누기", summary: `0.5%p ÷ 252 ≈ ${DAILY_DRIFT_BP.toFixed(1)}bp`, zoom: true, step: 2, note: "1년을 252영업일로 두면 하루 평균 이동은 약 0.002%포인트, 곧 0.2bp입니다. 아래 눈금은 3% 근처를 bp 단위로 크게 늘린 것입니다." },
  { label: "하루 흔들림", summary: `1% ÷ √252 ≈ ${DAILY_SD_BP.toFixed(1)}bp`, zoom: true, step: 3, note: "무작위 몫의 하루 표준편차는 1% ÷ √252 ≈ 6.3bp입니다. 같은 눈금에 놓으면 평균 이동 0.2bp는 흔들림 폭 안의 점 하나에 가깝습니다. 그래서 대부분의 하루 변화는 평균 복귀보다 무작위 움직임이 더 큽니다." },
] as const;

export default function VasicekDayViz() {
  return (
    <SceneShell
      eyebrow="하루 금리 변화"
      title="중심으로 끌리는 힘보다 하루 흔들림이 훨씬 큽니다"
      description="1bp(베이시스포인트)는 0.01%포인트입니다. 처음 두 장면은 % 눈금, 뒤 두 장면은 오늘 3% 근처를 bp 단위로 늘린 눈금입니다. 모든 숫자는 본문의 가정입니다."
      ariaLabel="중심 4퍼센트로 끌리는 하루 평균 이동 0.2bp와 하루 표준 흔들림 6.3bp 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        if (!scene.zoom) {
          const px = (rate: number) => LEFT + ((rate - 2.5) / 2) * (W - LEFT - RIGHT);
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={px(2.5)} x2={px(4.5)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[2.5, 3, 3.5, 4, 4.5].map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(tick)} y={AXIS_Y + 20} textAnchor="middle" fontSize={11} fill="#64748b">{tick}%</text>
                </g>
              ))}
              <circle cx={px(3)} cy={AXIS_Y} r={6} fill="#2563eb" />
              <text x={px(3)} y={AXIS_Y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">오늘 3%</text>
              <line x1={px(4)} x2={px(4)} y1={AXIS_Y - 30} y2={AXIS_Y + 6} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 3" />
              <text x={px(4)} y={AXIS_Y - 36} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">중심 4%</text>
              {scene.step === 0 ? (
                <g>
                  <line x1={px(3) + 8} x2={px(4) - 4} y1={AXIS_Y + 34} y2={AXIS_Y + 34} stroke="#64748b" strokeWidth={1} />
                  <text x={(px(3) + px(4)) / 2} y={AXIS_Y + 48} textAnchor="middle" fontSize={11} fill="#475569">거리 1%p</text>
                </g>
              ) : (
                <g>
                  {/* 화살표 길이 = 축 눈금으로 정확히 0.5%p (px(3) → px(3.5)) */}
                  <line x1={px(3)} x2={px(3.5) - 6} y1={AXIS_Y - 54} y2={AXIS_Y - 54} stroke="#2563eb" strokeWidth={1.25} />
                  <polygon points={`${px(3.5)},${AXIS_Y - 54} ${px(3.5) - 8},${AXIS_Y - 59} ${px(3.5) - 8},${AXIS_Y - 49}`} fill="#2563eb" />
                  <text x={px(3)} y={AXIS_Y - 64} fontSize={11} fontWeight={700} fill="#2563eb">중심 쪽으로 연 0.5%p</text>
                </g>
              )}
            </svg>
          );
        }
        const span = 15;
        const bx = (bp: number) => LEFT + ((bp + span) / (2 * span)) * (W - LEFT - RIGHT);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.step === 3 ? (
              <g>
                <rect x={bx(-DAILY_SD_BP)} y={AXIS_Y - 26} width={bx(DAILY_SD_BP) - bx(-DAILY_SD_BP)} height={20} rx={3} fill="#cbd5e1" opacity={0.6} stroke="#64748b" strokeWidth={1} />
                <text x={bx(-DAILY_SD_BP)} y={AXIS_Y - 34} textAnchor="middle" fontSize={13} fill="#475569">−6.3bp</text>
                <text x={bx(DAILY_SD_BP)} y={AXIS_Y - 34} textAnchor="middle" fontSize={13} fill="#475569">+6.3bp</text>
                <text x={bx(0)} y={AXIS_Y - 52} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">하루 표준 흔들림 폭</text>
              </g>
            ) : null}
            <line x1={bx(-span)} x2={bx(span)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[-15, -10, -5, 0, 5, 10, 15].map((tick) => (
              <g key={tick}>
                <line x1={bx(tick)} x2={bx(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                {tick % 10 === 0 ? (
                  <text x={bx(tick)} y={AXIS_Y + 22} textAnchor="middle" fontSize={13} fill="#64748b">{tick === 0 ? "3%" : `${tick > 0 ? "+" : "−"}${Math.abs(tick)}bp`}</text>
                ) : null}
              </g>
            ))}
            <rect x={bx(0)} y={AXIS_Y - 22} width={Math.max(bx(DAILY_DRIFT_BP) - bx(0), 2)} height={12} fill="#2563eb" />
            <text x={bx(0)} y={AXIS_Y + 46} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">평균 이동 +0.2bp (파란 칸)</text>
          </svg>
        );
      }}
    />
  );
}
