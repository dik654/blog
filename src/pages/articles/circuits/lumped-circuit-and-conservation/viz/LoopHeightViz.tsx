import { CircuitSketch, type WirePart } from "./CircuitSketch";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loop — 기준점 → 전원 +12 → 첫 저항 −6 → 갈래 −6 → 기준점. 12 − 6 − 6 = 0 V.
 * 위 칸은 도는 경로, 아래 칸은 그 경로를 따라간 전압입니다.
 */
const TOP = 24;
const BOTTOM = 104;
const BASE = 258;
const STEP = 9.5;
const POINTS = [
  { x: 40, volt: 0 },
  { x: 130, volt: 12 },
  { x: 220, volt: 6 },
  { x: 310, volt: 0 },
];
const py = (volt: number) => BASE - volt * STEP;

const PATHS: readonly (readonly WirePart[])[] = [
  [],
  ["source"],
  ["source", "first"],
  ["source", "first", "left", "return"],
  ["source", "first", "right", "return"],
];
const DOT = [{ x: 40, y: BOTTOM }, { x: 40, y: TOP }, { x: 205, y: TOP }, { x: 40, y: BOTTOM }, { x: 40, y: BOTTOM }];
const CHANGE = ["+12", "−6", "−6"];

const SCENES = [
  { label: "기준점에서 출발", summary: "0 V", note: "아래 도선을 0 V로 택했습니다. 점 하나를 정해 놓고 전압이 어떻게 오르내리는지 따라갑니다." },
  { label: "전원을 지나면", summary: "0 + 12 = 12 V", note: "전원을 지나며 12 V 올라갑니다." },
  { label: "첫 저항을 지나면", summary: "12 − 6 = 6 V", note: "6 V 내려가 갈림길은 6 V입니다." },
  { label: "왼쪽 갈래를 지나면", summary: "6 − 6 = 0 V", note: "다시 6 V 내려가 출발한 기준점으로 돌아옵니다. 올라간 12와 내려간 6, 6의 합은 0입니다." },
  { label: "오른쪽으로 돌아도", summary: "+12 − 6 − 6 = 0 V", note: "오른쪽 갈래에도 같은 6 V가 걸리므로 그래프가 똑같습니다. 다른 답이 나오면 부호부터 확인합니다. 합이 0이 되지 않는 예외는 아래 글에서 봅니다." },
];

export default function LoopHeightViz() {
  return (
    <SceneShell
      eyebrow="한 바퀴 따라가기"
      title="전압을 높이처럼 읽으면 한 바퀴 뒤 제자리로 돌아옵니다"
      description="위는 지금 지나는 경로(주황)이고, 아래는 그 경로를 따라가며 적은 전압입니다. 숫자는 설명을 위한 가정입니다."
      ariaLabel="회로를 한 바퀴 돌며 0에서 12로 올랐다가 6, 0으로 내려오는 전압 그래프"
      scenes={SCENES}
      render={(active) => {
        const shown = POINTS.slice(0, Math.min(active, 3) + 1);
        const branch = active === 4 ? "오른쪽 저항" : "왼쪽 저항";
        const dot = DOT[active];
        const names = ["전원", "첫 저항", branch];
        return (
          <svg viewBox="0 0 360 296" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <CircuitSketch top={TOP} bottom={BOTTOM} highlight={PATHS[active]} />
            <text x={118} y={BOTTOM + 15} textAnchor="middle" fontSize={11} fill="#64748b">아래 도선 = 기준점 0 V</text>
            <circle cx={dot.x} cy={dot.y} r={5} fill="#d97706" stroke="#ffffff" strokeWidth={1} />
            {[0, 6, 12].map((volt) => (
              <g key={volt}>
                <line x1={32} x2={332} y1={py(volt)} y2={py(volt)} stroke="#94a3b8" strokeWidth={1} opacity={volt === 0 ? 1 : 0.3} />
                <text x={26} y={py(volt) + 4} textAnchor="end" fontSize={11} fill="#64748b">{volt}</text>
              </g>
            ))}
            <polyline points={shown.map((p) => `${p.x},${py(p.volt)}`).join(" ")} fill="none" stroke="#d97706" strokeWidth={1.25} />
            {shown.map((p, index) => (
              <circle key={index} cx={p.x} cy={py(p.volt)} r={3.5} fill="#d97706" />
            ))}
            {CHANGE.map((change, index) => {
              const from = POINTS[index];
              const to = POINTS[index + 1];
              const mid = (from.x + to.x) / 2;
              const reached = active > index;
              return (
                <g key={change + index} textAnchor="middle">
                  {reached && <text x={mid + (index === 0 ? -14 : 14)} y={(py(from.volt) + py(to.volt)) / 2 - 2} fontSize={13} fontWeight={700} fill="#b45309">{change}</text>}
                  <text x={mid} y={BASE + 18} fontSize={11} fontWeight={reached ? 700 : 400} fill={reached ? "currentColor" : "#64748b"}>{names[index]}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
