import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 20MWh 저장, 한 시간에 5MW 방전, 그 시간의 부족 20MWh (가정).
 * 첫 시간 5 × 1 = 5MWh → 못 채운 15MWh, 저장 잔량 15. 다 비우는 데 20 ÷ 5 = 4시간.
 * 마지막 장면의 20 MW는 대조용 가정이다.
 */
const X0 = 40;
const HOUR = 50;
const BASE = 182;
const UNIT = 6.5;

const SCENES = [
  { rate: 5, hours: 0, left: 20, label: "양만 보면 충분해 보입니다", summary: "부족 20 MWh · 저장 20 MWh", note: "저장 설비가 20MWh를 담을 수 있고 가득 채워 두었으며, 부족도 20MWh입니다(가정). 점선 칸은 그 한 시간에 고르게 필요하다고 본 부족분입니다." },
  { rate: 5, hours: 1, left: 15, label: "방전 속도가 5 MW라면", summary: "5 MW × 1시간 = 5 MWh", note: "그 시간에 5MW만 낼 수 있으면 5MWh만 나옵니다. 15MWh는 저장 설비에 남아 있는데도 15MWh가 모자랍니다." },
  { rate: 5, hours: 4, left: 0, label: "다 내보내려면", summary: "20 ÷ 5 = 4시간", note: "에너지를 다 쓰는 데 4시간이 걸리지만, 부족한 때는 첫 한 시간입니다. 뒤의 세 시간 치는 이 부족을 채우지 못합니다." },
  { rate: 20, hours: 1, left: 0, label: "속도가 20 MW였다면", summary: "20 MW × 1시간 = 20 MWh", note: "대조를 위해 넣은 값입니다(가정). 같은 저장량이어도 속도가 맞으면 그 시간의 부족을 채웁니다. 그래서 저장량과 방전 속도를 함께 확인해야 합니다." },
];

export default function StorageRateViz() {
  return (
    <SceneShell
      eyebrow="저장량과 속도"
      title="20 MWh를 담았어도 5 MW로는 그 한 시간을 채우지 못합니다"
      description="왼쪽은 저장 설비가 내는 전력(면적이 에너지), 오른쪽은 저장 설비에 남은 양입니다. 숫자는 가정입니다."
      ariaLabel="부족한 한 시간에 5메가와트로 5메가와트시만 채우고 15가 남는 그림과 4시간 방전"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const top = BASE - 20 * UNIT;
        const short = active === 1;
        return (
          <svg viewBox="0 0 360 224" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={top - 8} fontSize={11} fontWeight={700} fill="#dc2626">부족한 한 시간</text>
            <rect x={X0} y={top} width={HOUR} height={20 * UNIT} fill="#dc2626" fillOpacity={0.07} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            {[0, 5, 20].map((tick) => (
              <text key={tick} x={X0 - 6} y={BASE - tick * UNIT + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            <text x={X0 - 6} y={top - 8} textAnchor="end" fontSize={10} fill="#64748b">MW</text>
            {scene.hours > 0 && Array.from({ length: scene.hours }, (_, hour) => (
              <rect key={hour} x={X0 + hour * HOUR} y={BASE - scene.rate * UNIT} width={HOUR} height={scene.rate * UNIT} fill="#2563eb" fillOpacity={hour === 0 ? 0.4 : 0.15} stroke="#2563eb" strokeWidth={1} />
            ))}
            {scene.hours > 0 && scene.rate === 5 && Array.from({ length: scene.hours }, (_, hour) => (
              <text key={hour} x={X0 + hour * HOUR + HOUR / 2} y={BASE - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">5</text>
            ))}
            {scene.rate === 20 && <text x={X0 + HOUR / 2} y={BASE - 60} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">20</text>}
            {short && <text x={X0 + HOUR / 2} y={BASE - 75} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">15 부족</text>}
            {active === 0 && <text x={X0 + HOUR / 2} y={BASE - 60} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">20</text>}
            {active === 2 && <text x={X0 + HOUR * 2.5} y={BASE - 46} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">부족한 때가 지난 뒤</text>}
            <line x1={X0} x2={X0 + 4 * HOUR} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3, 4].map((tick) => (
              <text key={tick} x={X0 + tick * HOUR} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            <text x={X0 + 2 * HOUR} y={BASE + 32} textAnchor="middle" fontSize={11} fill="#64748b">시간</text>
            <rect x={282} y={top} width={46} height={20 * UNIT} rx={4} fill="none" stroke="#64748b" strokeWidth={1} />
            <rect x={282} y={BASE - scene.left * UNIT} width={46} height={scene.left * UNIT} fill="#16a34a" fillOpacity={0.3} />
            <text x={305} y={top - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">저장 잔량</text>
            <text x={305} y={BASE + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">{scene.left} MWh</text>
          </svg>
        );
      }}
    />
  );
}
