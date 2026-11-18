import SceneShell from "./SceneShell";

/**
 * 본문 대응: rectifier-activations #negative-slope — 음수 구간의 출력 a·y에서
 * 뒤 변화율 4가 두 갈래로 돌아간다. 입력 쪽은 4×a=0.04, a 쪽은 4×y=−8(원문 식 (3)).
 * 양수 입력 3은 a를 쓰지 않아 a 쪽 기여 0. a를 공유하면(가정) 합은 −8+0=−8.
 */
const FWD = "#2563eb";
const BACK = "#d97706";
const IDLE = "#94a3b8";
const INK = "#334155";

type Phase = "forward" | "toInput" | "toSlope" | "positive";

interface Scene {
  label: string;
  summary: string;
  note: string;
  phase: Phase;
}

const SCENES: readonly Scene[] = [
  {
    label: "앞으로: 음수 입력에 a를 곱함",
    summary: "0.01 × (−2) = −0.02",
    note: "음수 구간에서는 출력이 a×y입니다. a=0.01, y=−2를 넣으면 −0.02가 나갑니다(가정). 출력 하나에 y와 a 두 값이 함께 들어갔습니다.",
    phase: "forward",
  },
  {
    label: "입력 쪽으로 돌아가는 값",
    summary: "4 × 0.01 = 0.04",
    note: "뒤에서 변화율 4가 옵니다. 입력 y를 조금 바꾸면 출력은 a배만큼 움직이므로 4에 a를 곱한 0.04가 입력 쪽으로 갑니다. 7절에서 본 0.04와 같은 값이고, 입력 y(위 식의 z)를 만든 앞 계산을 고칠 때 씁니다.",
    phase: "toInput",
  },
  {
    label: "a 쪽으로 돌아가는 값",
    summary: "4 × (−2) = −8",
    note: "원문 식 (3)은 음수 구간에서 출력의 a에 대한 변화율이 y 자체라고 씁니다. 그래서 a 쪽에는 4에 y=−2를 곱한 −8이 갑니다. 같은 4에서 나왔어도 0.04는 z를, −8은 a를 고칠 때 쓰는 다른 값입니다.",
    phase: "toSlope",
  },
  {
    label: "양수 입력 3은 a를 쓰지 않음",
    summary: "a 쪽 기여 0 → 합 −8",
    note: "3은 양수 구간이라 그대로 나가고 입력 쪽으로 4가 돌아갑니다. 이 길에는 a가 없으므로 a 쪽 기여는 0입니다(가정). 두 칸이 a 하나를 공유한다면 기여를 더해 −8 + 0 = −8입니다.",
    phase: "positive",
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const p1x = x2 - size * Math.cos(angle - 0.45);
  const p1y = y2 - size * Math.sin(angle - 0.45);
  const p2x = x2 - size * Math.cos(angle + 0.45);
  const p2y = y2 - size * Math.sin(angle + 0.45);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.25" strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M ${x2} ${y2} L ${p1x} ${p1y} L ${p2x} ${p2y} Z`} fill={color} />
    </g>
  );
}

function Node({ x, y, title, value, color }: { x: number; y: number; title: string; value: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="96" height="38" rx="8" fill="none" stroke={color} strokeWidth="1" />
      <text x={x + 48} y={y + 15} textAnchor="middle" fontSize="11.5" fill={INK}>
        {title}
      </text>
      <text x={x + 48} y={y + 31} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>
        {value}
      </text>
    </g>
  );
}

export default function TwoGradientsViz() {
  return (
    <SceneShell
      eyebrow="두 갈래의 변화율"
      title="같은 뒤 변화율 4가 입력 쪽과 a 쪽으로 다르게 돌아갑니다"
      description="파란 화살표는 앞으로 가는 값, 주황 화살표는 뒤로 돌아가는 변화율(그 값을 조금 바꿀 때 결과가 바뀌는 비율)입니다. a는 음수 구간의 기울기이고, PReLU에서는 이 a도 학습합니다. y는 원문 식에서 쓰는 입력 이름으로, 위 식의 z와 같은 값입니다."
      ariaLabel="음수 입력 −2와 기울기 a=0.01에서 뒤 변화율 4가 입력 쪽 0.04, a 쪽 −8로 갈라지는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const { phase } = SCENES[active];
        const positive = phase === "positive";
        const back = phase !== "forward";
        const inputBack = phase === "toInput" || positive;
        const slopeBack = phase === "toSlope";
        return (
          <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-lg" role="img" aria-label={SCENES[active].summary}>
            <Node x={6} y={30} title="입력 y (= z)" value={positive ? "3" : "−2"} color={inputBack ? BACK : FWD} />
            <Node x={6} y={132} title="음수 기울기 a" value="0.01" color={positive ? IDLE : slopeBack ? BACK : FWD} />
            <circle cx="186" cy="100" r="20" fill="none" stroke={positive ? IDLE : FWD} strokeWidth="1" />
            <text x="186" y="105" textAnchor="middle" fontSize={positive ? "10" : "16"} fill={INK}>
              {positive ? "그대로" : "×"}
            </text>
            <Node x={258} y={81} title="출력" value={positive ? "3" : "−0.02"} color={FWD} />

            {/* 앞으로 가는 값 */}
            <Arrow x1={102} y1={56} x2={168} y2={90} color={FWD} />
            {positive ? (
              <line x1={102} y1={144} x2={168} y2={110} stroke={IDLE} strokeWidth="1" strokeDasharray="3 3" />
            ) : (
              <Arrow x1={102} y1={144} x2={168} y2={110} color={FWD} />
            )}
            <Arrow x1={206} y1={100} x2={256} y2={100} color={FWD} />

            {/* 뒤로 돌아가는 변화율 */}
            {back ? (
              <>
                <Arrow x1={300} y1={74} x2={300} y2={58} color={BACK} />
                <text x="300" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill={BACK}>
                  뒤 변화율 4
                </text>
              </>
            ) : null}
            {inputBack ? (
              <>
                <Arrow x1={160} y1={74} x2={106} y2={46} color={BACK} />
                <text x="112" y="22" fontSize="12" fontWeight="700" fill={BACK}>
                  {positive ? "입력 쪽: 4 × 1 = 4" : "입력 쪽: 4 × 0.01 = 0.04"}
                </text>
              </>
            ) : null}
            {slopeBack ? (
              <>
                <Arrow x1={160} y1={126} x2={106} y2={154} color={BACK} />
                <text x="112" y="190" fontSize="12" fontWeight="700" fill={BACK}>
                  a 쪽: 4 × (−2) = −8
                </text>
              </>
            ) : null}
            {positive ? (
              <text x="112" y="190" fontSize="12" fill={INK}>
                a 쪽 기여 0 (a를 쓰지 않음)
              </text>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
