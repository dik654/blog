import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 나무의 형제 해시들을 함께 주면 검증자가 선택된 잎에서 루트를 재계산한다.
 * hypertree는 하위 루트를 다음 층 서명에 연결한다. 잎 8개와 두 층은 그림용 가정이다. 잎 8개면 형제는 층마다 1개씩 3개.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const W = 360;
const H = 206;
const BOX_W = 30;
const BOX_H = 20;

type State = "plain" | "leaf" | "sibling" | "path" | "root";
const COLORS: Record<State, string> = { plain: INK, leaf: GREEN, sibling: AMBER, path: BLUE, root: BLUE };

function Node({ x, y, label, state }: { x: number; y: number; label?: string; state: State }) {
  const color = COLORS[state];
  return (
    <g>
      <rect x={x - BOX_W / 2} y={y} width={BOX_W} height={BOX_H} rx={4} fill={color} fillOpacity={state === "plain" ? 0 : 0.18} stroke={color} strokeWidth={1} />
      {label && <text x={x} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">{label}</text>}
    </g>
  );
}

/** 잎 개수가 leaves인 나무를 그립니다. 선택 잎 chosen에서 위로 가는 경로와 형제를 계산합니다. */
function Tree({ x0, width, y0, gap, leaves, chosen, showSiblings, showPath, rootLabel }: { x0: number; width: number; y0: number; gap: number; leaves: number; chosen: number; showSiblings: boolean; showPath: boolean; rootLabel: string }) {
  const levels = Math.log2(leaves);
  const items: { x: number; y: number; state: State; label?: string; key: string }[] = [];
  const links: { x1: number; y1: number; x2: number; y2: number; key: string; hot: boolean }[] = [];
  for (let level = 0; level <= levels; level += 1) {
    const count = leaves / 2 ** level;
    const y = y0 + (levels - level) * gap;
    const onPath = chosen >> level;
    const sibling = onPath ^ 1;
    for (let i = 0; i < count; i += 1) {
      const x = x0 + ((i + 0.5) * width) / count;
      let state: State = "plain";
      if (level === levels) state = "root";
      else if (level === 0 && i === chosen) state = "leaf";
      else if (showSiblings && i === sibling) state = "sibling";
      else if (showPath && i === onPath) state = "path";
      let label: string | undefined;
      if (level === levels) label = rootLabel;
      else if (level === 0 && i === chosen) label = "잎";
      else if (showSiblings && i === sibling) label = "형";
      items.push({ x, y, state, label, key: `${level}-${i}` });
      if (level < levels) {
        const parent = i >> 1;
        const px = x0 + ((parent + 0.5) * width) / (count / 2);
        links.push({ x1: x, y1: y, x2: px, y2: y - gap + BOX_H, key: `${level}-${i}`, hot: showPath && i === onPath });
      }
    }
  }
  return (
    <>
      {links.map((link) => (
        <line key={link.key} x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke={link.hot ? BLUE : INK} strokeWidth={link.hot ? 1.25 : 1} strokeOpacity={link.hot ? 1 : 0.5} />
      ))}
      {items.map((item) => (
        <Node key={item.key} x={item.x} y={item.y} state={item.state} label={item.label} />
      ))}
    </>
  );
}

const SCENES = [
  { label: "둘씩 해시해 올라가는 나무", summary: "잎 8개 → 공개 루트 1개", note: "맨 아래 값이 잎이고, 이웃한 둘을 해시한 값이 위 칸이 되며, 꼭대기 한 값이 루트입니다. 잎 8개는 그림을 위한 가정입니다." },
  { label: "선택된 잎과 형제 해시를 줍니다", summary: "잎 8개면 형제 3개", note: "같은 부모를 공유하는 짝이 형제입니다. 경로의 칸마다 형제 하나가 필요하므로 이 나무에서는 세 개입니다. 초록이 선택된 잎, 주황 ‘형’ 칸이 함께 주는 형제 해시입니다." },
  { label: "검증자가 잎에서 루트를 재계산합니다", summary: "재계산한 루트 = 공개 루트?", note: "잎과 형제를 해시하며 파란 경로로 올라가면 나머지 칸을 몰라도 루트를 계산할 수 있습니다. 공개 루트와 같은지 비교합니다." },
  { label: "나무를 층으로 쌓습니다", summary: "하위 루트 → 다음 층 서명", note: "여러 층의 나무인 hypertree는 하위 루트를 다음 층 서명에 연결합니다. 그래서 아래 나무의 경로가 위 나무의 경로로 이어집니다. 두 층과 층마다 잎 4개는 그림을 위한 가정입니다." },
] as const;

export default function TreePathViz() {
  return (
    <SceneShell
      eyebrow="해시 나무"
      title="잎과 형제 해시로 루트까지 올라가고, 층을 쌓습니다"
      description="칸 하나가 해시값입니다. 나무 크기와 층 수는 실제 값이 아니라 경로 모양을 보이려는 가정입니다."
      ariaLabel="잎과 형제 해시로 루트를 재계산하고 하위 루트를 다음 층에 연결하는 해시 나무"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? (
            <Tree x0={4} width={352} y0={16} gap={52} leaves={8} chosen={2} showSiblings={active >= 1} showPath={active >= 2} rootLabel="루트" />
          ) : (
            <>
              <text x={4} y={14} fontSize={11} fontWeight={700} fill={INK}>위 층</text>
              <Tree x0={60} width={240} y0={6} gap={30} leaves={4} chosen={1} showSiblings={false} showPath rootLabel="공개" />
              <text x={4} y={124} fontSize={11} fontWeight={700} fill={INK}>아래 층</text>
              <Tree x0={60} width={240} y0={124} gap={30} leaves={4} chosen={2} showSiblings={false} showPath rootLabel="하위" />
              <line x1={180} x2={150} y1={124} y2={88} stroke={BLUE} strokeWidth={1.25} strokeDasharray="4 3" />
              <path d="M148 94 L150 87 L155 92" fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={356} y={108} textAnchor="end" fontSize={11} fontWeight={700} fill={BLUE}>다음 층 서명에 연결</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
