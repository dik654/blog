import SceneShell from "./SceneShell";

/**
 * 본문 대응: #structure — 큰 모델의 선택은 R·A·Y(가정). 한 줄 R·A·X는 마지막 자리에서 멈추고
 * 1+2+4=7자리 갈래는 R·A·Y 경로를 찾는다. 대신 3자리 → 7자리로 확인할 자리가 늘어난다.
 */
const SCENES = [
  { label: "한 줄 세 자리", summary: "R · A까지 · 3자리 계산", note: "한 줄 R·A·X만 준비했는데 큰 모델의 선택이 R·A·Y라면 마지막 자리에서 멈춥니다. 첫 후보 하나에 다음 계산을 모두 건 결과입니다." },
  { label: "두 갈래씩 펼치면", summary: "R · A · Y 경로 발견", note: "R 뒤에 A와 B를, 두 갈래 아래에 X와 Y를 준비하면 같은 검증 안에서 R·A·Y 경로를 찾을 수 있습니다." },
  { label: "대신 확인할 자리가 늘어납니다", summary: "1 + 2 + 4 = 7자리", note: "시작점 하나, 다음 후보 둘, 그다음 후보 넷을 놓으면 세 토큰을 얻으려고 일곱 자리를 계산하는 셈입니다. 이것이 갈래를 넓힌 대가입니다." },
] as const;

const NODE = { w: 34, h: 28 };
const CHAIN = [
  { t: "R", x: 54, y: 34 },
  { t: "A", x: 54, y: 90 },
  { t: "X", x: 54, y: 146 },
];
const TREE = [
  { t: "R", x: 238, y: 34, p: -1 },
  { t: "A", x: 182, y: 90, p: 0 },
  { t: "B", x: 294, y: 90, p: 0 },
  { t: "X", x: 156, y: 146, p: 1 },
  { t: "Y", x: 208, y: 146, p: 1 },
  { t: "X", x: 268, y: 146, p: 2 },
  { t: "Y", x: 320, y: 146, p: 2 },
] as const;
const PATH = new Set([0, 1, 4]);
const GREEN = "#16a34a";
const RED = "#dc2626";
const IDLE = "#94a3b8";

function Node({ t, x, y, color, solid }: { t: string; x: number; y: number; color: string; solid: boolean }) {
  return (
    <g>
      <rect x={x - NODE.w / 2} y={y - NODE.h / 2} width={NODE.w} height={NODE.h} rx={6} fill={solid ? color : "none"} fillOpacity={0.16} stroke={color} strokeWidth={1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={color === IDLE ? undefined : color} className={color === IDLE ? "fill-muted-foreground" : undefined}>{t}</text>
    </g>
  );
}

export default function ChainVsTreeViz() {
  return (
    <SceneShell
      eyebrow="한 줄과 여러 갈래"
      title="갈래를 넓히면 맞는 길을 찾기 쉬워지지만 계산할 자리가 늘어납니다"
      description="왼쪽은 한 줄 후보, 오른쪽은 갈래 후보입니다. 초록은 큰 모델이 고른 R·A·Y와 같은 칸, 빨강은 어긋난 칸입니다. 문장과 후보는 설명을 위한 가정입니다."
      ariaLabel="한 줄 후보와 일곱 자리 갈래 후보 비교"
      scenes={SCENES}
      render={(active) => {
        const chainOn = active === 0 || active === 2;
        const treeOn = active >= 1;
        return (
          <svg viewBox="0 0 356 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={54} y={14} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-muted-foreground">한 줄</text>
            <text x={238} y={14} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-muted-foreground">여러 갈래</text>
            {[0, 1].map((index) => (
              <line key={index} x1={54} x2={54} y1={CHAIN[index].y + 14} y2={CHAIN[index + 1].y - 14} stroke={chainOn && index === 0 ? GREEN : IDLE} strokeWidth={1} />
            ))}
            {CHAIN.map((node, index) => (
              <Node key={node.t} t={node.t} x={node.x} y={node.y} color={chainOn ? (index === 2 ? RED : GREEN) : IDLE} solid={chainOn && index < 2} />
            ))}
            {TREE.map((node, index) => {
              if (node.p < 0) return null;
              const parent = (TREE as readonly { x: number; y: number }[])[node.p];
              const on = treeOn && PATH.has(index) && PATH.has(node.p);
              return <line key={index} x1={parent.x} y1={parent.y + 14} x2={node.x} y2={node.y - 14} stroke={on ? GREEN : IDLE} strokeWidth={on ? 1.25 : 1} strokeDasharray={treeOn && !on ? "3 3" : undefined} />;
            })}
            {TREE.map((node, index) => (
              <Node key={index} t={node.t} x={node.x} y={node.y} color={treeOn && PATH.has(index) ? GREEN : IDLE} solid={treeOn && PATH.has(index)} />
            ))}
            <text x={54} y={188} textAnchor="middle" fontSize={13} fontWeight={active === 2 ? 700 : 400} className="fill-foreground">{active === 2 ? "계산 3자리" : active === 0 ? "X에서 멈춤" : ""}</text>
            <text x={238} y={188} textAnchor="middle" fontSize={13} fontWeight={active === 2 ? 700 : 400} className="fill-foreground">{active === 2 ? "계산 1 + 2 + 4 = 7자리" : active === 1 ? "R → A → Y 찾음" : ""}</text>
          </svg>
        );
      }}
    />
  );
}
