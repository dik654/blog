import SceneShell from "./SceneShell";

/**
 * 본문 대응: #huffman — (가정) 빈도 [8,4,2,1,1]에서 작은 두 값을 합칩니다.
 * 1+1=2, 2+2=4, 4+4=8, 8+8=16. 주소: 문장 끝 1, red 01, cat 001, saw 0001, dog 0000. 길이 [1,2,3,4,4].
 */
const INK = "#64748b";
const AMBER = "#d97706";
const LEAF_Y = 176;
const LEAVES = [
  { word: "문장 끝", f: 8, x: 36, len: 1, code: "1" },
  { word: "red", f: 4, x: 108, len: 2, code: "01" },
  { word: "cat", f: 2, x: 180, len: 3, code: "001" },
  { word: "saw", f: 1, x: 252, len: 4, code: "0001" },
  { word: "dog", f: 1, x: 324, len: 4, code: "0000" },
];
/* 각 내부 노드: 값, 위치, 자식 좌표와 그 가지의 비트 */
const NODES = [
  { f: 2, x: 288, y: 132, kids: [[252, LEAF_Y, "1"], [324, LEAF_Y, "0"]] },
  { f: 4, x: 234, y: 96, kids: [[180, LEAF_Y, "1"], [288, 132, "0"]] },
  { f: 8, x: 171, y: 60, kids: [[108, LEAF_Y, "1"], [234, 96, "0"]] },
  { f: 16, x: 104, y: 24, kids: [[36, LEAF_Y, "1"], [171, 60, "0"]] },
] as const;

const SCENES = [
  { label: "출발", summary: "[8, 4, 2, 1, 1]", values: [8, 4, 2, 1, 1], merged: 0, note: "단어 하나가 빈도를 가진 잎 하나입니다. 이 빈도는 앞의 한 문장에서 센 횟수와 별개로 전체 자료에 부여한 가정입니다." },
  { label: "가장 작은 둘을 합칩니다", summary: "1 + 1 = 2", values: [8, 4, 2, 2], merged: 1, note: "saw와 dog를 자식으로 둔 부모를 만들고 그 빈도를 2로 둡니다. 자식은 사라지지 않고 부모 아래에 남습니다." },
  { label: "새 부모도 후보입니다", summary: "2 + 2 = 4", values: [8, 4, 4], merged: 2, note: "남은 값에서 가장 작은 둘은 cat의 2와 방금 만든 부모의 2입니다. 잎과 부모를 구별하지 않고 값만 봅니다." },
  { label: "한 번 더", summary: "4 + 4 = 8", values: [8, 8], merged: 3, note: "red의 4와 부모의 4를 합칩니다. 합칠 때마다 아래의 모든 단어는 뿌리에서 한 칸씩 멀어집니다." },
  { label: "뿌리", summary: "8 + 8 = 16", values: [16], merged: 4, note: "값이 하나 남으면 끝입니다. 16은 다섯 빈도의 합과 같습니다." },
  { label: "길이를 읽습니다", summary: "길이 [1, 2, 3, 4, 4]", values: [16], merged: 4, note: "뿌리에서 잎까지 지나는 갈림길 수가 길이입니다. 빈도가 가장 큰 문장 끝이 1, 가장 작은 saw와 dog가 4입니다. 같은 빈도의 순서가 바뀌면 주소는 달라질 수 있습니다." },
] as const;

export default function HuffmanMergeViz() {
  return (
    <SceneShell
      eyebrow="작은 둘부터"
      title="빈도 [8,4,2,1,1]을 둘씩 합치면 나무가 자랍니다"
      description="네모는 단어인 잎, 동그라미는 합쳐서 만든 부모이며 안의 수가 빈도입니다. 빈도는 가정입니다. 가지의 0과 1이 주소가 됩니다."
      ariaLabel="가장 작은 두 빈도를 반복해 합쳐 Huffman 나무를 만드는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
          <p className="mb-2 text-xs text-muted-foreground">남은 값 <b className="font-mono text-sm text-foreground">[{scene.values.join(", ")}]</b></p>
          <svg viewBox="0 0 360 252" className="mx-auto block h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {NODES.slice(0, scene.merged).map((node, i) => {
              const fresh = i === scene.merged - 1 && active < 5;
              const color = fresh ? AMBER : INK;
              return node.kids.map(([kx, ky, bit]) => (
                <line key={`${node.f}-${bit}`} x1={node.x} y1={node.y} x2={Number(kx)} y2={Number(ky)} stroke={color} strokeWidth={fresh ? 1.25 : 1} />
              ));
            })}
            {NODES.slice(0, scene.merged).map((node, i) => {
              const fresh = i === scene.merged - 1 && active < 5;
              const color = fresh ? AMBER : INK;
              return (
                <g key={node.f}>
                  {node.kids.map(([kx, ky, bit]) => {
                    const midX = node.x + (Number(kx) - node.x) * 0.55;
                    const midY = node.y + (Number(ky) - node.y) * 0.55;
                    return (
                      <g key={bit}>
                        <circle cx={midX} cy={midY} r={7} fill="#f8fafc" stroke={color} strokeWidth={1} />
                        <text x={midX} y={midY + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{bit}</text>
                      </g>
                    );
                  })}
                  <circle cx={node.x} cy={node.y} r={14} fill={color} />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{node.f}</text>
                </g>
              );
            })}
            {LEAVES.map((leaf) => (
              <g key={leaf.word}>
                <rect x={leaf.x - 31} y={LEAF_Y} width={62} height={38} rx={6} fill="#e2e8f0" stroke={INK} strokeWidth={1} />
                <text x={leaf.x} y={LEAF_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">{leaf.word}</text>
                <text x={leaf.x} y={LEAF_Y + 31} textAnchor="middle" fontSize={12} fill="#334155">{leaf.f}</text>
                {active === 5 && (
                  <text x={leaf.x} y={LEAF_Y + 56} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>{`길이 ${leaf.len}`}</text>
                )}
                {active === 5 && (
                  <text x={leaf.x} y={LEAF_Y + 72} textAnchor="middle" fontSize={12} fill={INK}>{`주소 ${leaf.code}`}</text>
                )}
              </g>
            ))}
          </svg>
          </div>
        );
      }}
    />
  );
}
