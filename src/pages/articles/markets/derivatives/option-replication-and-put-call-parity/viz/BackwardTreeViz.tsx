import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #mechanism — "기간이 여러 개면 각 갈림길에서 같은 계산을 뒤에서 앞으로 반복".
 * 두 기간 나무(가정): 매 기간 1사례처럼 ×1.2 또는 ×0.8, 금리 0, 행사가격 100.
 * 주가 100 → 120·80 → 144·96·64, 만기 콜 44·0·0.
 * 120 갈림길: 델타 44÷48, 빌림 (44÷48)×96 = 88, 값 (44÷48)×120 − 88 = 110 − 88 = 22.
 * 80 갈림길: 두 지급이 0이라 값 0.
 * 처음: 델타 22÷40 = 0.55, 빌림 0.55×80 = 44, 값 55 − 44 = 11.
 */
interface TreeNode {
  id: string;
  x: number;
  y: number;
  price: number;
  value: number;
  step: 0 | 1 | 2;
}

const NODES: readonly TreeNode[] = [
  { id: "r", x: 52, y: 112, price: 100, value: 11, step: 0 },
  { id: "u", x: 180, y: 62, price: 120, value: 22, step: 1 },
  { id: "d", x: 180, y: 162, price: 80, value: 0, step: 1 },
  { id: "uu", x: 304, y: 30, price: 144, value: 44, step: 2 },
  { id: "ud", x: 304, y: 112, price: 96, value: 0, step: 2 },
  { id: "dd", x: 304, y: 194, price: 64, value: 0, step: 2 },
];
const EDGES: readonly (readonly [string, string])[] = [
  ["r", "u"],
  ["r", "d"],
  ["u", "uu"],
  ["u", "ud"],
  ["d", "ud"],
  ["d", "dd"],
];
const byId = (id: string) => NODES.find((node) => node.id === id) ?? NODES[0];

/** 장면마다 콜 값을 보여 줄 가장 이른 시점. 3이면 아직 아무 값도 없음. */
const VALUE_FROM: readonly number[] = [3, 2, 1, 0];
const ACTIVE_STEP: readonly number[] = [-1, 2, 1, 0];

const SCENES: readonly ShellScene[] = [
  { label: "갈림길을 두 번 펼칩니다", summary: "100 → 120·80 → 144·96·64", note: "1절처럼 한 기간마다 주가가 1.2배 또는 0.8배가 된다고 두 번 이어 붙인 나무입니다(가정). 가운데 96은 오르고 내리거나, 내리고 오른 두 길이 만나는 자리입니다." },
  { label: "맨 끝: 만기 지급부터 적습니다", summary: "144 → 44 · 96 → 0 · 64 → 0", note: "행사가격 100인 콜은 만기 주가가 144면 44, 96과 64면 0입니다. 뒤에서 앞으로 풀므로 계산은 여기서 출발합니다." },
  { label: "한 칸 앞: 갈림길마다 2·3절 계산", summary: "120 → 22 · 80 → 0", note: "120 갈림길은 위 44, 아래 0인 한 기간 문제입니다. 주식 수량은 44÷(144−96)=44÷48, 빌릴 돈은 그 수량×96=88, 값은 그 수량×120−88=110−88=22입니다. 80 갈림길은 두 지급이 0이라 값도 0입니다." },
  { label: "처음까지: 같은 계산을 한 번 더", summary: "0.55×100 − 44 = 11", note: "이제 오늘 갈림길은 위 22, 아래 0을 맞추는 문제입니다. 주식 수량 22÷40=0.55, 빌릴 돈 0.55×80=44, 오늘 값 55−44=11입니다. 각 갈림길에서 두 값의 평균(가중치 0.5씩)을 내도 22·0·11로 같습니다." },
];

function Tree({ scene }: { scene: number }) {
  const valueFrom = VALUE_FROM[scene];
  const activeStep = ACTIVE_STEP[scene];
  return (
    <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      {EDGES.map(([from, to]) => {
        const a = byId(from);
        const b = byId(to);
        return <line key={`${from}-${to}`} x1={a.x + 26} y1={a.y} x2={b.x - 26} y2={b.y} stroke="#cbd5e1" strokeWidth={1} />;
      })}
      {NODES.map((node) => {
        const showValue = node.step >= valueFrom;
        const active = node.step === activeStep;
        return (
          <g key={node.id}>
            <rect x={node.x - 28} y={node.y - 18} width={56} height={36} rx={8} fill={active ? "#dbeafe" : "#f8fafc"} stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={active ? 1.25 : 1} />
            <text x={node.x} y={node.y - 3} textAnchor="middle" fontSize={12} fill="#475569">{`주가 ${node.price}`}</text>
            <text x={node.x} y={node.y + 11} textAnchor="middle" fontSize={12} fontWeight={700} fill={showValue ? "#1d4ed8" : "#cbd5e1"}>
              {showValue ? `콜 ${node.value}` : "콜 ?"}
            </text>
          </g>
        );
      })}
      {["오늘", "1기간 뒤", "만기"].map((label, step) => (
        <text key={label} x={[52, 180, 304][step]} y={228} textAnchor="middle" fontSize={11} fill={step === activeStep ? "#1d4ed8" : "#64748b"} fontWeight={step === activeStep ? 700 : 400}>
          {label}
        </text>
      ))}
      {scene >= 1 && (
        <text x={160} y={10} textAnchor="middle" fontSize={11} fill="#64748b">← 계산은 만기에서 오늘 쪽으로</text>
      )}
    </svg>
  );
}

export default function BackwardTreeViz() {
  return (
    <SceneShell
      eyebrow="여러 기간"
      title="만기에서 출발해 갈림길마다 같은 복제를 풉니다"
      description="두 기간짜리 나무는 설명용 가정입니다. 매 기간 1.2배 또는 0.8배, 금리 0, 행사가격 100으로 1절 사례를 한 번 더 이어 붙였습니다. 상자 위 줄은 주가, 아래 줄은 그 자리의 콜 값입니다."
      ariaLabel="두 기간 이항 나무에서 만기 지급부터 오늘 콜 값 11까지 뒤에서 앞으로 계산"
      scenes={SCENES}
      render={(index) => <Tree scene={index} />}
    />
  );
}
