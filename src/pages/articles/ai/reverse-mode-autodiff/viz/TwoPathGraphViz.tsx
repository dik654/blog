import SceneShell from "./SceneShell";

/**
 * 본문 대응: 1절 — 3×2=6, 6²=36, 36+6=42. 뒤에서: 1 → 제곱 길 2×6×1=12, 그대로 길 1 → 합 13 → 13×2=26.
 */
const W = 400;
const H = 196;
const FWD = "#2563eb";
const BWD = "#d97706";
const LINE = "#94a3b8";

const P = {
  three: { x: 34, y: 58 },
  two: { x: 34, y: 152 },
  mul: { x: 108, y: 105 },
  a: { x: 176, y: 105 },
  sq: { x: 250, y: 50 },
  add: { x: 318, y: 105 },
  out: { x: 374, y: 105 },
} as const;

const SCENES = [
  { label: "앞으로 값 만들기", summary: "3×2=6 → 6²=36 → 36+6=42", note: "곱셈이 6을 만들고, 그 6이 두 곳에 쓰입니다. 위쪽은 제곱해서 36, 아래쪽은 그대로 마지막 합에 들어갑니다. 결과는 42입니다." },
  { label: "마지막 값에서 출발", summary: "42 자신의 변화율 1", note: "돌아오는 계산은 마지막 값 42에서 시작합니다. 42를 42로 미분하면 1입니다. 합은 두 입력 모두에 이 1을 그대로 보냅니다." },
  { label: "두 길이 따로 돌아옴", summary: "제곱 길 12 · 그대로 길 1", note: "제곱은 6 근처에서 2×6=12배로 변하므로 1×12=12를 돌려줍니다. 그대로 더한 길은 1을 돌려줍니다. 둘 다 같은 중간값 6에 대한 기여입니다." },
  { label: "같은 6에서 합침", summary: "12 + 1 = 13", note: "한쪽만 받으면 6의 변화율이 틀립니다. 두 길의 기여를 모두 더한 13이 6을 조금 바꿨을 때 42가 바뀌는 비율입니다." },
  { label: "곱셈을 되짚음", summary: "13 × 2 = 26", note: "6은 3에 2를 곱해 만들었으므로 3을 조금 바꾸면 6은 2배로 변합니다. 그래서 처음 숫자 3에 대한 변화율은 13×2=26입니다." },
] as const;

function Node({ x, y, text, sub, on, op = false }: { x: number; y: number; text: string; sub?: string; on: boolean; op?: boolean }) {
  return (
    <g>
      {op ? (
        <circle cx={x} cy={y} r={18} fill="#ffffff" stroke={on ? FWD : LINE} strokeWidth={1} />
      ) : (
        <rect x={x - 22} y={y - 15} width={44} height={30} rx={8} fill="#ffffff" stroke={on ? FWD : LINE} strokeWidth={1} />
      )}
      <text x={x} y={y + 6} textAnchor="middle" fontSize={text.length > 1 && op ? 13 : 17} fontWeight={700} fill={on ? "#0f172a" : "#94a3b8"}>{text}</text>
      {sub && <text x={x} y={y - 22} textAnchor="middle" fontSize={11} fill="#64748b">{sub}</text>}
    </g>
  );
}

function Edge({ d, on, back }: { d: string; on: boolean; back: boolean }) {
  return <path d={d} fill="none" stroke={back ? BWD : on ? FWD : LINE} strokeWidth={back ? 1.25 : 1} strokeDasharray={back ? "5 3" : undefined} />;
}

function Tag({ x, y, text, show }: { x: number; y: number; text: string; show: boolean }) {
  if (!show) return null;
  const w = text.length * 9.4 + 14;
  return (
    <g>
      <rect x={x - w / 2} y={y - 13} width={w} height={24} rx={6} fill="#fff7ed" stroke={BWD} strokeWidth={1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#9a3412">{text}</text>
    </g>
  );
}

export default function TwoPathGraphViz() {
  return (
    <SceneShell
      eyebrow="계산 그림"
      title="같은 6이 두 길로 쓰였으니, 돌아오는 변화율도 두 길에서 모아 더합니다"
      description="파란 실선은 값을 만드는 방향, 주황 점선과 주황 꼬리표는 마지막 42에서 거꾸로 돌아오는 변화율입니다. 변화율은 앞 값을 아주 조금 바꿨을 때 42가 몇 배로 바뀌는지입니다."
      ariaLabel="3과 2를 곱한 6이 제곱 길과 그대로 더하는 길로 쓰인 계산 그래프와 역방향 변화율"
      scenes={SCENES}
      render={(active) => {
        const back = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Edge d={`M ${P.three.x + 22} ${P.three.y} L ${P.mul.x - 18} ${P.mul.y - 6}`} on back={active >= 4} />
            <Edge d={`M ${P.two.x + 22} ${P.two.y} L ${P.mul.x - 18} ${P.mul.y + 6}`} on back={false} />
            <Edge d={`M ${P.mul.x + 18} ${P.mul.y} L ${P.a.x - 22} ${P.a.y}`} on back={active >= 4} />
            <Edge d={`M ${P.a.x + 14} ${P.a.y - 15} L ${P.sq.x - 18} ${P.sq.y}`} on back={active >= 2} />
            <Edge d={`M ${P.sq.x + 18} ${P.sq.y} L ${P.add.x - 10} ${P.add.y - 12}`} on back={active >= 1} />
            <Edge d={`M ${P.a.x + 8} ${P.a.y + 15} Q ${P.a.x + 70} ${P.a.y + 80} ${P.add.x - 6} ${P.add.y + 14}`} on back={active >= 1} />
            <Edge d={`M ${P.add.x + 18} ${P.add.y} L ${P.out.x - 22} ${P.out.y}`} on back={active >= 1} />

            <Node {...P.three} text="3" on />
            <Node {...P.two} text="2" on />
            <Node {...P.mul} text="×" on op />
            <Node {...P.a} text="6" on />
            <Node {...P.sq} text="제곱" on op />
            <Node {...P.add} text="+" on op />
            <Node {...P.out} text="42" on />

            <text x={300} y={62} textAnchor="middle" fontSize={14} fill={FWD}>36</text>
            <text x={P.a.x + 66} y={P.a.y + 78} textAnchor="middle" fontSize={14} fill={FWD}>그대로 6</text>

            <Tag x={P.out.x - 6} y={P.out.y + 32} text="1" show={back} />
            <Tag x={198} y={48} text="12" show={active >= 2} />
            <Tag x={P.a.x + 70} y={P.a.y + 44} text="1" show={active >= 2} />
            <Tag x={P.a.x - 26} y={P.a.y + 40} text="12+1=13" show={active >= 3} />
            <Tag x={P.three.x + 18} y={P.three.y - 32} text="13×2=26" show={active >= 4} />
          </svg>
        );
      }}
    />
  );
}
