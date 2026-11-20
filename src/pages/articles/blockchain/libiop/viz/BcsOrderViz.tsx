import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bcs — root → challenge → query → opening 순서가 proof 의미의 일부인 이유.
 * 1) root를 먼저 고정하면 질문은 root와 메시지에서 나온다.
 * 2) 표를 고치면 root가 바뀌고 뒤의 challenge·query 위치도 바뀐다.
 * 3) query 위치를 먼저 알면 그 칸만 정상인 표를 고른 뒤 root를 만들 수 있다.
 * 8칸 표와 질문 위치 두 칸은 설명용 가정이다(공식 test는 64칸에서 네 칸을 연다).
 */
const SCENES = [
  {
    label: "root를 먼저 고정",
    summary: "표 → root → challenge → query → opening",
    note: "Prover는 표 전체를 Merkle root 하나로 고정한 뒤, root와 메시지를 hashchain에 넣어 challenge를 꺼냅니다. 질문할 칸은 그 transcript에서 정해지므로, root가 정해진 뒤에는 질문받은 칸만 정상으로 다시 고를 수 없습니다.",
    order: ["표", "root", "challenge", "query", "opening"],
    cells: "fixed",
    picked: [1, 6],
  },
  {
    label: "표를 나중에 고치면",
    summary: "다른 표 → 다른 root → 다른 질문",
    note: "질문을 본 뒤 표를 바꾸면 root가 달라지고, root와 메시지가 달라지면 뒤의 challenge와 질문 위치도 달라집니다.",
    order: ["표′", "root′", "challenge′", "query′", "opening"],
    cells: "changed",
    picked: [3, 4],
  },
  {
    label: "순서를 뒤집으면",
    summary: "query → 표 → root (허용되면 안 됨)",
    note: "Prover가 query 위치를 먼저 안다면 그 칸 주변만 정상인 표를 고른 뒤 root를 만들 수 있습니다. 그래서 root → challenge → query → opening 순서가 proof 의미의 일부입니다.",
    order: ["query", "표", "root", "challenge", "opening"],
    cells: "forged",
    picked: [1, 6],
  },
] as const;

/** 표를 나중에 고치는 장면에서, 처음 질문(1·6번)을 본 뒤 고친 칸 (가정) */
const EDITED = new Set([1, 6]);

const W = 360;
const NODE_W = 60;
const GAP = (W - 20 - 5 * NODE_W) / 4;
const nx = (i: number) => 10 + i * (NODE_W + GAP);

export default function BcsOrderViz() {
  return (
    <SceneShell
      eyebrow="BCS의 메시지 순서"
      title="질문보다 root가 먼저 와야 열린 칸이 표 전체를 확률적으로 대표합니다"
      description="위 줄은 메시지가 정해지는 순서, 아래 칸은 prover가 만든 표입니다. 8칸 표와 질문 두 칸은 설명용 가정입니다. 강조한 칸이 질문받아 열리는 칸입니다."
      ariaLabel="root를 먼저 고정한 순서, 표를 고친 경우, 순서를 뒤집은 경우의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const order: readonly string[] = scene.order;
        const forged = scene.cells === "forged";
        const changed = scene.cells === "changed";
        const picked = new Set<number>(scene.picked);
        return (
          <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {order.map((name, i) => {
              const warn = forged && i === 0;
              return (
                <g key={i}>
                  <rect x={nx(i)} y={14} width={NODE_W} height={30} rx={6} fill="none" stroke={warn ? "#dc2626" : "#2563eb"} strokeWidth={1} />
                  <text x={nx(i) + NODE_W / 2} y={33} textAnchor="middle" fontSize={11} fontWeight={700} fill={warn ? "#dc2626" : "#2563eb"}>{name}</text>
                  {i < 4 && (
                    <path d={`M ${nx(i) + NODE_W + 2} 29 L ${nx(i + 1) - 3} 29 M ${nx(i + 1) - 7} 25 L ${nx(i + 1) - 3} 29 L ${nx(i + 1) - 7} 33`} fill="none" stroke="#64748b" strokeWidth={1} />
                  )}
                </g>
              );
            })}
            <text x={10} y={70} fontSize={11} fill="#64748b">
              {forged ? "질문 위치를 미리 알고 만든 표" : changed ? "1·6번 질문을 본 뒤 그 칸을 고친 표 (가정)" : "prover가 만든 표 (가정)"}
            </text>
            {Array.from({ length: 8 }, (_, i) => {
              const x = 10 + i * 43;
              const isPicked = picked.has(i);
              const bad = forged && !isPicked;
              const edited = changed && EDITED.has(i);
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={80}
                    width={38}
                    height={34}
                    rx={4}
                    fill={isPicked ? "#dbeafe" : "none"}
                    stroke={isPicked ? "#2563eb" : bad ? "#dc2626" : edited ? "#d97706" : "#94a3b8"}
                    strokeWidth={isPicked ? 1.25 : 1}
                    strokeDasharray={bad || edited ? "3 2" : undefined}
                  />
                  <text x={x + 19} y={101} textAnchor="middle" fontSize={11} fontWeight={700} fill={bad ? "#dc2626" : edited ? "#b45309" : "#334155"}>
                    {bad ? "?" : edited ? "고침" : "정상"}
                  </text>
                  <text x={x + 19} y={128} textAnchor="middle" fontSize={10} fill="#64748b">{i}</text>
                </g>
              );
            })}
            <text x={10} y={156} fontSize={11} fill={forged ? "#dc2626" : "#334155"}>
              {forged
                ? "1·6번만 정상, ? 칸은 정상이 아닐 수 있음"
                : changed
                  ? "고친 칸 1·6번 대신 root′의 새 질문 3·4번이 열림 (가정)"
                  : "root에서 나온 질문: 1·6번 (가정)"}
            </text>
          </svg>
        );
      }}
    />
  );
}
