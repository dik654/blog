import SceneShell from "./SceneShell";

/**
 * 본문 대응: #suffix — 저장한 글 8개: RAY 5, RAX 1, RBY 2(가정).
 * A 6/8=.75, B 2/8=.25, A의 Y .75×5/6=.625, A의 X .75×1/6=.125, B의 Y .25×2/2=.25.
 * 큰 순서로 넷: A .75 → Y .625 → B .25 → Y .25, 합 1.875. 부모 [-1,0,-1,2].
 */
const SCENES = [
  { label: "저장한 글 8개", summary: "R 뒤 A 6번 · B 2번", note: "저장한 글 8개를 한 줄씩 놓았습니다. 모두 R을 지나는 기록이고 RAY가 5개, RAX가 1개, RBY가 2개입니다." },
  { label: "글자별로 묶어 셉니다", summary: "A 뒤 Y 5 · X 1 · B 뒤 Y 2", note: "같은 앞부분을 한 갈래로 묶으면 부모 아래 자식이 몇 번 나왔는지 바로 보입니다." },
  { label: "경로를 따라 비중을 곱합니다", summary: ".75 × 5/6 = .625", note: "A의 비중은 6/8=.75이고, A 아래 Y는 다시 5/6을 곱해 .625입니다. A 아래 X는 .125, B 아래 Y는 .25입니다." },
  { label: "큰 비중부터 네 개를 꺼냅니다", summary: ".75 + .625 + .25 + .25 = 1.875", note: "후보 한도가 넷이면 A, 그 Y, B, 그 Y 순서로 꺼내고 .125인 X는 남습니다. 부모 번호 [-1,0,-1,2]는 각 후보의 위 후보 번호이고, −1은 일치한 R 바로 아래라는 뜻입니다." },
  { label: "점수는 수락 수가 아닙니다", summary: "한 줄 A·Y만 1.375", note: "두 자리 경로만 더하면 1.375, 여러 갈래를 더하면 1.875입니다. 둘 다 과거 기록의 빈도 점수이며, 현재 큰 모델이 실제로 받아들인 수와는 별도의 양입니다." },
] as const;

const RECORDS = ["RAY", "RAY", "RAY", "RAY", "RAY", "RAX", "RBY", "RBY"] as const;
const TREE = [
  { t: "A", x: 170, y: 84, px: 226, py: 26, count: 6, share: ".75", order: 1 },
  { t: "B", x: 294, y: 84, px: 226, py: 26, count: 2, share: ".25", order: 3 },
  { t: "Y", x: 200, y: 148, px: 170, py: 84, count: 5, share: ".625", order: 2 },
  { t: "X", x: 128, y: 148, px: 170, py: 84, count: 1, share: ".125", order: 0 },
  { t: "Y", x: 294, y: 148, px: 294, py: 84, count: 2, share: ".25", order: 4 },
] as const;
const BLUE = "#2563eb";
const IDLE = "#94a3b8";

export default function SuffixFrequencyViz() {
  return (
    <SceneShell
      eyebrow="빈도로 만든 후보"
      title="저장한 글 8개를 묶어 세면 후보 순서와 점수가 나옵니다"
      description="왼쪽은 저장한 글, 오른쪽은 같은 앞부분을 한 갈래로 묶은 모양입니다. 횟수와 비중은 모두 설명을 위한 가정입니다."
      ariaLabel="저장한 글 8개의 빈도를 갈래로 묶어 후보 점수를 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const pathOnly = active === 4;
        return (
          <svg viewBox="0 0 356 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {RECORDS.map((record, index) => (
              <g key={index}>
                <rect x={2} y={4 + index * 22} width={62} height={19} rx={3} fill={record[1] === "A" ? (record[2] === "Y" ? BLUE : "#64748b") : "#d97706"} fillOpacity={0.18} stroke={record[1] === "A" ? (record[2] === "Y" ? BLUE : "#64748b") : "#d97706"} strokeWidth={1} />
                <text x={33} y={18 + index * 22} textAnchor="middle" fontSize={12} fontWeight={700} letterSpacing={2} className="fill-foreground">{record}</text>
              </g>
            ))}
            {active >= 1 && TREE.map((node) => {
              const on = !pathOnly || node.order === 1 || node.order === 2;
              return <line key={`${node.x}-${node.y}`} x1={node.px} y1={node.py + 14} x2={node.x} y2={node.y - 14} stroke={on ? "#64748b" : "#cbd5e1"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />;
            })}
            <rect x={209} y={12} width={34} height={28} rx={6} className="fill-background" stroke="#64748b" strokeWidth={1} />
            <text x={226} y={31} textAnchor="middle" fontSize={15} fontWeight={700} className="fill-foreground">R</text>
            {active === 0 && <text x={226} y={96} textAnchor="middle" fontSize={13} className="fill-muted-foreground">아직 묶지 않았습니다</text>}
            {active >= 1 && TREE.map((node) => {
              const picked = active >= 3 && node.order > 0;
              const dim = (active >= 3 && node.order === 0) || (pathOnly && node.order > 2) || (pathOnly && node.order === 0);
              const stroke = dim ? "#cbd5e1" : picked ? BLUE : IDLE;
              const value = active === 1 ? `${node.count}번` : node.share;
              const nodeKey = `${node.x}-${node.y}`;
              const left = node.t === "X";
              return (
                <g key={nodeKey}>
                  <rect x={node.x - 17} y={node.y - 14} width={34} height={28} rx={6} fill={picked && !dim ? BLUE : "none"} fillOpacity={0.15} stroke={stroke} strokeWidth={1} strokeDasharray={dim ? "3 3" : undefined} />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={dim ? "#94a3b8" : undefined} className={dim ? undefined : "fill-foreground"}>{node.t}</text>
                  <text x={left ? node.x - 21 : node.x + 21} y={node.y + 5} textAnchor={left ? "end" : "start"} fontSize={13} fontWeight={700} fill={dim ? "#94a3b8" : BLUE}>{value}</text>
                  {active === 3 && node.order > 0 && <text x={node.y < 100 ? node.x - 21 : node.x} y={node.y < 100 ? node.y + 5 : node.y + 30} textAnchor={node.y < 100 ? "end" : "middle"} fontSize={12} fontWeight={700} className="fill-muted-foreground">{node.order}번째</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
