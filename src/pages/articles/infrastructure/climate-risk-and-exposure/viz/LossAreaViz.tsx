import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case, #picture — 손실 = 자산 × 손상 비율을 직사각형 넓이로 본다. 모두 글의 가정값.
 * A 100×10%=10, B 300×20%=60(6배 = 자산 3배 × 비율 2배), 자산 절반 150×20%=30, 비율 절반 300×10%=30.
 */
const SCENES = [
  { label: "지역 A", summary: "100 × 10% = 10", asset: 100, rate: 10, ghost: false, note: "가로가 그곳의 자산, 세로가 그 홍수의 손상 비율이라면 칠해진 넓이가 직접 자산 손실입니다. A는 100의 10%인 10입니다." },
  { label: "같은 홍수, 지역 B", summary: "300 × 20% = 60", asset: 300, rate: 20, ghost: false, note: "홍수는 같은데 B의 칠해진 넓이는 A의 여섯 배입니다. 자산이 3배이고 비율이 2배라 3 × 2 = 6배가 됩니다. 이 넓이는 홍수가 이미 일어났을 때의 직접 자산 손실만 나타냅니다." },
  { label: "자산을 절반으로", summary: "150 × 20% = 30", asset: 150, rate: 20, ghost: true, note: "B의 자산을 절반으로 줄이면 가로가 줄어 넓이가 30이 됩니다. 점선은 원래의 60입니다." },
  { label: "손상 비율을 절반으로", summary: "300 × 10% = 30", asset: 300, rate: 10, ghost: true, note: "이번에는 세로만 줄였습니다. 모양은 다르지만 넓이는 앞 장면과 같은 30입니다. 서로 다른 조치가 같은 금액의 감소를 만들 수 있습니다." },
] as const;

const LEFT = 44;
const BASE = 150;
const X_SCALE = 290 / 300;
const Y_SCALE = 112 / 25;

export default function LossAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 보는 손실"
      title="가로와 세로 어느 쪽을 줄여도 넓이가 줄어듭니다"
      description="가로는 그곳의 자산, 세로는 손상 비율, 칠해진 넓이는 한 번의 홍수에서 난 직접 자산 손실입니다. 모두 설명용 값이고 단위는 같은 금액 단위입니다(가정)."
      ariaLabel="자산과 손상 비율의 곱을 넓이로 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const w = s.asset * X_SCALE;
        const h = s.rate * Y_SCALE;
        return (
          <svg viewBox="0 0 346 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            {[10, 20].map((r) => (
              <g key={r}>
                <line x1={LEFT} x2={LEFT + 300 * X_SCALE} y1={BASE - r * Y_SCALE} y2={BASE - r * Y_SCALE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
                <text x={LEFT - 6} y={BASE - r * Y_SCALE + 4} textAnchor="end" fontSize={11} fill="#64748b">{r}%</text>
              </g>
            ))}
            {s.ghost && <rect x={LEFT} y={BASE - 20 * Y_SCALE} width={300 * X_SCALE} height={20 * Y_SCALE} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />}
            <rect x={LEFT} y={BASE - h} width={w} height={h} fill="#2563eb" opacity={0.3} stroke="#2563eb" strokeWidth={1} />
            <text x={LEFT + w / 2} y={BASE - h / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">{(s.asset * s.rate) / 100}</text>
            {s.ghost && <text x={LEFT + 290} y={BASE - 20 * Y_SCALE - 5} textAnchor="end" fontSize={11} fill="#64748b">원래의 60</text>}
            <line x1={LEFT} x2={LEFT + 300 * X_SCALE} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={BASE} y2={BASE - 25 * Y_SCALE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 100, 150, 300].map((v) => (
              <text key={v} x={LEFT + v * X_SCALE} y={BASE + 15} textAnchor={v === 300 ? "end" : "middle"} fontSize={11} fill="#64748b">{v}</text>
            ))}
            <text x={LEFT + 145} y={BASE + 32} textAnchor="middle" fontSize={11} fill="#64748b">그곳의 자산</text>
            <text x={LEFT} y={14} textAnchor="middle" fontSize={11} fill="#64748b">손상 비율</text>
          </svg>
        );
      }}
    />
  );
}
