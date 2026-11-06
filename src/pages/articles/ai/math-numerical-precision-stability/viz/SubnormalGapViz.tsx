import SceneShell from "./SceneShell";

/**
 * 본문 대응: #formats — FP16의 최소 양의 정규수 2⁻¹⁴ 아래에서는 간격 2⁻²⁴를 유지하며 0에 다가간다.
 * 정규 구간의 간격은 본문 식 2^(E−f), f=10입니다. 2⁻²⁴는 남고 2⁻²⁵는 짝수 쪽 0으로 저장됩니다(본문 실행 결과).
 * 상대 오차 100%는 2⁻²⁵이 0이 된 산술이고 0.0488%는 본문의 u=2⁻¹¹입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 196;

const SUP: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const pow2 = (n: number) => `2${String(n).split("").map((c) => SUP[c]).join("")}`;

const px = (e: number) => 50 + ((e + 20) / 11) * 276;
const py = (g: number) => 150 - (g + 25) * 26;

const normalPath = [-14, -13, -12, -11, -10].flatMap((e) => [`${px(e)},${py(e - 10)}`, `${px(e + 1)},${py(e - 10)}`]).join(" ");
const flatPath = `${px(-20)},${py(-24)} ${px(-14)},${py(-24)}`;

const SCENES = [
  { label: "정규 구간", summary: "구간마다 간격 절반", note: "크기가 절반인 구간으로 내려갈 때마다 간격도 절반입니다. 어느 구간이든 칸 수가 같기 때문입니다. 2⁻¹⁴부터 시작하는 구간의 간격이 2⁻²⁴입니다." },
  { label: "2⁻¹⁴ 아래", summary: "간격 2⁻²⁴ 유지", note: "2⁻¹⁴ 아래에서는 숨은 선행 1을 쓰지 않는 subnormal 표현이 같은 간격으로 0까지 이어집니다. 간격이 더 줄지 않습니다." },
  { label: "0 옆의 두 자리", summary: "2⁻²⁴ 남음 · 2⁻²⁵ → 0", note: "자리 번호로 0은 짝수, 2⁻²⁴은 홀수입니다. 2⁻²⁵은 두 자리의 가운데라 짝수 쪽 0으로 저장되고, 2⁻²⁴은 자리와 겹쳐 그대로 남습니다." },
  { label: "상대 오차의 차이", summary: "u 약 0.0488% · 여기 100%", note: "정규수에서는 상대 오차가 u 이하입니다. 2⁻²⁵은 0이 되어 상대 오차가 100%입니다. 그래서 이 구간에 정규수의 상한을 그대로 쓰지 않습니다." },
] as const;

export default function SubnormalGapViz() {
  return (
    <SceneShell
      eyebrow="FP16의 0 근처"
      title="간격이 줄다가 멈추면 작은 값의 상대 오차가 커집니다"
      description="가로는 값의 크기, 세로는 그 크기에서의 자리 간격입니다. 두 눈금 모두 한 칸이 두 배입니다."
      note="저장 형식의 정의입니다. 장치가 연산에서 이 값을 그대로 남기는지는 따로 확인합니다."
      ariaLabel="FP16의 크기별 자리 간격과 0 근처의 반올림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 && (
            <g>
              <line x1={44} x2={W - 8} y1={160} y2={160} stroke="#94a3b8" strokeWidth={1} />
              <line x1={44} x2={44} y1={14} y2={160} stroke="#94a3b8" strokeWidth={1} />
              {[-24, -22, -20].map((g) => <text key={g} x={38} y={py(g) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{pow2(g)}</text>)}
              {[-14, -9].map((e) => (
                <g key={e}>
                  <line x1={px(e)} x2={px(e)} y1={160} y2={165} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(e)} y={180} textAnchor="middle" fontSize={12} fill={GRAY}>{pow2(e)}</text>
                </g>
              ))}
              <text x={W - 10} y={150} textAnchor="end" fontSize={12} fill={GRAY}>값의 크기 →</text>
              <polyline points={normalPath} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={px(-12.2)} y={py(-20.6)} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>정규수</text>
              <line x1={px(-14)} x2={px(-14)} y1={py(-24)} y2={160} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              {active === 1 && (
                <g>
                  <polyline points={flatPath} fill="none" stroke={AMBER} strokeWidth={1.25} />
                  <text x={px(-17)} y={py(-24) - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>subnormal: 같은 간격</text>
                  <text x={px(-20) + 4} y={180} fontSize={12} fill={AMBER}>0 쪽 ←</text>
                </g>
              )}
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={30} x2={310} y1={112} y2={112} stroke="#94a3b8" strokeWidth={1} />
              {[{ x: 60, name: "0", no: "0번" }, { x: 190, name: "2⁻²⁴", no: "1번" }, { x: 320 - 0, name: "", no: "" }].slice(0, 2).map((slot) => (
                <g key={slot.no}>
                  <line x1={slot.x} x2={slot.x} y1={102} y2={122} stroke={BLUE} strokeWidth={1.25} />
                  <text x={slot.x} y={142} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{slot.name}</text>
                  <text x={slot.x} y={160} textAnchor="middle" fontSize={12} fill={GRAY}>{`${slot.no} 자리`}</text>
                </g>
              ))}
              <circle cx={125} cy={62} r={5} fill="var(--background)" stroke={RED} strokeWidth={1.25} />
              <text x={125} y={48} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>2⁻²⁵</text>
              <path d="M 121 66 L 64 104" fill="none" stroke={RED} strokeWidth={1.25} />
              <circle cx={190} cy={62} r={5} fill="var(--background)" stroke={BLUE} strokeWidth={1.25} />
              <text x={190} y={48} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>2⁻²⁴</text>
              <path d="M 190 67 V 102" fill="none" stroke={BLUE} strokeWidth={1.25} />
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={20} y={42} fontSize={12} fontWeight={700} fill={BLUE}>정규수의 한 번 반올림: 최대 u = 2⁻¹¹ (약 0.0488%)</text>
              <rect x={20} y={52} width={2} height={22} fill={BLUE} />
              <rect x={20} y={52} width={300} height={22} fill="none" stroke="#cbd5e1" strokeWidth={1} />
              <text x={20} y={112} fontSize={12} fontWeight={700} fill={RED}>2⁻²⁵을 저장: 0이 되어 100%</text>
              <rect x={20} y={122} width={300} height={22} fill={RED} fillOpacity={0.55} stroke={RED} strokeWidth={1} />
              <text x={20} y={166} fontSize={12} fill={GRAY}>막대 전체 폭 = 100% · 파란 선은 보이게 굵힘</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
