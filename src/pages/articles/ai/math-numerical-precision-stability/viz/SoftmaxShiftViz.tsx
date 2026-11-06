import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stability — [1000,1001,1002]에서 최댓값을 빼고 exp를 구한 뒤 합으로 나눈다.
 * 합 약 1.5032147, 비중 약 [0.0900306, 0.2447285, 0.6652410]은 본문의 값입니다.
 * FP32 한계 지수 약 88.7은 본문 표의 최대 유한값 (2−2⁻²³)2¹²⁷의 자연로그(산술)입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 178;
const ax = (value: number) => 18 + (value / 1100) * 304;
const SHARES = [0.0900306, 0.2447285, 0.665241] as const;
const EXPS = [0.1353353, 0.3678794, 1] as const;
const NAMES = ["e⁻²", "e⁻¹", "e⁰"] as const;
const TONES = [GRAY, AMBER, BLUE] as const;

function Shift({ top, amount }: { top: readonly string[]; amount: string }) {
  const xs = [90, 170, 250];
  return (
    <g>
      <text x={24} y={40} fontSize={12} fill={GRAY}>입력</text>
      <text x={24} y={134} fontSize={12} fill={GRAY}>뺀 뒤</text>
      <line x1={66} x2={W - 26} y1={52} y2={52} stroke="#94a3b8" strokeWidth={1} />
      <line x1={66} x2={W - 26} y1={146} y2={146} stroke="#94a3b8" strokeWidth={1} />
      {xs.map((x, index) => (
        <g key={x}>
          <circle cx={x} cy={52} r={5} fill={GRAY} />
          <text x={x} y={40} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>{top[index]}</text>
          <path d={`M ${x} 60 V 138 m -4 -7 l 4 7 l 4 -7`} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <circle cx={x} cy={146} r={5} fill={BLUE} />
          <text x={x} y={170} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{["−2", "−1", "0"][index]}</text>
        </g>
      ))}
      <text x={W - 28} y={100} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>{amount}</text>
    </g>
  );
}

const SCENES = [
  { label: "그대로 exp", summary: "exp(1000) 범위 초과", note: "exp(1000)은 FP32와 binary64 범위를 모두 넘습니다. 무한대를 돌려주는 연산에서는 inf/inf가 NaN으로 이어질 수 있고 Python의 math.exp(1000)은 OverflowError를 냈습니다." },
  { label: "최댓값 빼기", summary: "−1002 → [−2, −1, 0]", note: "모두에서 같은 m=1002를 뺍니다. 간격은 그대로이고 크기만 옮겨집니다. 분자와 분모의 공통인 exp(m)을 약분한 것과 같습니다." },
  { label: "작아진 exp", summary: "합 약 1.5032147", note: "지수가 2 이내로 줄어 범위 안입니다. 최댓값 자리는 exp(0)=1이므로 분모에 적어도 1이 남습니다." },
  { label: "합으로 나누기", summary: "약 0.090 · 0.245 · 0.665", note: "각 값을 합 약 1.5032147로 나누면 세 비중입니다. 띠 전체가 1이고 입력의 차이만으로 결정됩니다." },
  { label: "아주 작은 입력", summary: "최댓값 −1000 → 같은 답", note: "[−1002,−1001,−1000]도 최댓값 −1000을 빼면 같은 [−2,−1,0]이므로 분모가 모두 0이 되지 않습니다." },
] as const;

export default function SoftmaxShiftViz() {
  return (
    <SceneShell
      eyebrow="softmax의 세 단계"
      title="공통 크기를 먼저 빼면 거대한 exp를 만들지 않습니다"
      description="입력 [1000,1001,1002]의 비중을 구합니다. 빼기 → exp → 나누기 순서입니다."
      note="입력은 본문의 가정이며 유한하고 비어 있지 않아야 합니다. 작은 항의 소실까지 없애는 것은 아닙니다."
      ariaLabel="최댓값을 빼서 softmax를 계산하는 단계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <text x={18} y={30} fontSize={12} fill={GRAY}>exp에 넣는 값의 눈금</text>
              <rect x={ax(88.7)} y={52} width={W - 18 - ax(88.7)} height={48} fill={RED} fillOpacity={0.1} />
              <line x1={18} x2={W - 18} y1={100} y2={100} stroke="#94a3b8" strokeWidth={1} />
              <line x1={ax(88.7)} x2={ax(88.7)} y1={44} y2={108} stroke={RED} strokeWidth={1.25} />
              <text x={ax(88.7) + 6} y={48} fontSize={12} fontWeight={700} fill={RED}>FP32 한계 약 88.7</text>
              {[1000, 1001, 1002].map((value, index) => <circle key={value} cx={ax(value) + index * 7 - 7} cy={100} r={4} fill={RED} />)}
              <text x={ax(1000)} y={84} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>1000~1002</text>
              {[0, 500, 1000].map((tick) => <text key={tick} x={ax(tick)} y={122} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>)}
              <text x={W / 2} y={156} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>무한대를 돌려주는 연산: inf/inf → NaN 가능</text>
            </g>
          )}
          {active === 1 && <Shift top={["1000", "1001", "1002"]} amount="−1002" />}
          {active === 4 && <Shift top={["−1002", "−1001", "−1000"]} amount="−(−1000)" />}
          {active === 2 && (
            <g>
              {EXPS.map((value, index) => {
                const x = 56 + index * 92;
                const height = value * 120;
                return (
                  <g key={index}>
                    <rect x={x} y={150 - height} width={56} height={height} fill={TONES[index]} fillOpacity={0.3} stroke={TONES[index]} strokeWidth={1} />
                    <text x={x + 28} y={150 - height - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={TONES[index]}>{value === 1 ? "1" : value.toFixed(4)}</text>
                    <text x={x + 28} y={170} textAnchor="middle" fontSize={13} fill={GRAY}>{NAMES[index]}</text>
                  </g>
                );
              })}
              <line x1={40} x2={W - 30} y1={150} y2={150} stroke="#94a3b8" strokeWidth={1} />
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={W / 2} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>각 값 ÷ 약 1.5032147</text>
              {(() => {
                let cursor = 20;
                return SHARES.map((share, index) => {
                  const width = share * 300;
                  const x = cursor;
                  cursor += width;
                  return (
                    <g key={index}>
                      <rect x={x} y={78} width={width} height={46} fill={TONES[index]} fillOpacity={0.3} stroke={TONES[index]} strokeWidth={1} />
                      <text x={index === 0 ? x : x + width / 2} y={index === 0 ? 68 : 106} textAnchor={index === 0 ? "start" : "middle"} fontSize={13} fontWeight={700} fill={TONES[index]}>{share.toFixed(4)}</text>
                      <text x={x + width / 2} y={144} textAnchor="middle" fontSize={12} fill={GRAY}>{["1000", "1001", "1002"][index]}</text>
                    </g>
                  );
                });
              })()}
              <text x={W / 2} y={172} textAnchor="middle" fontSize={12} fill={GRAY}>띠 전체 = 1</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
