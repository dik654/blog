import SceneShell from "./SceneShell";

/**
 * 본문 대응: #qc-chain 마지막 문단 — B11이 QC10을, B12가 QC11을, B13이 QC12를 들고 바로 앞 부모에
 * 연결되면 B10 commit. B12가 B11을 건너뛰거나 B13이 형제 블록의 QC를 들고 오면 번호가 이어져도 three-chain이 아님.
 */
type Block = { id: string; x: number; y: number; faded?: boolean; note?: string };
type Link = { from: string; to: string; label: string; ok: boolean; parentOnly?: boolean };

const BW = 70;
const BH = 40;
const ROW = 58;
const LOW = 134;
const COL = [8, 100, 192, 284] as const;

const SCENES = [
  {
    label: "올바른 three-chain",
    summary: "B10 commit",
    note: "B11·B12·B13이 각각 바로 앞 블록의 QC(QC10·QC11·QC12)를 들고 있습니다. 세 연결이 모두 직접 부모를 가리키므로 가장 오래된 B10을 commit합니다.",
    blocks: [
      { id: "B10", x: COL[0], y: ROW },
      { id: "B11", x: COL[1], y: ROW },
      { id: "B12", x: COL[2], y: ROW },
      { id: "B13", x: COL[3], y: ROW },
    ],
    links: [
      { from: "B11", to: "B10", label: "QC10", ok: true },
      { from: "B12", to: "B11", label: "QC11", ok: true },
      { from: "B13", to: "B12", label: "QC12", ok: true },
    ],
    ok: true,
  },
  {
    label: "B11을 건너뜀",
    summary: "three-chain 아님",
    note: "B12가 들고 온 QC10이 B11을 건너뛰고 B10을 가리킵니다. 번호는 10·11·12·13으로 이어져도 QC가 바로 앞 블록을 차례로 인증하지 않아 B10을 commit하는 three-chain이 아닙니다.",
    blocks: [
      { id: "B10", x: COL[0], y: ROW },
      { id: "B11", x: COL[1], y: LOW, faded: true, note: "사슬 밖" },
      { id: "B12", x: COL[2], y: ROW },
      { id: "B13", x: COL[3], y: ROW },
    ],
    links: [
      { from: "B12", to: "B10", label: "QC10 · B11 건너뜀", ok: false },
      { from: "B13", to: "B12", label: "QC12", ok: true },
    ],
    ok: false,
  },
  {
    label: "형제 블록의 QC",
    summary: "three-chain 아님",
    note: "B12와 B12′는 같은 B11에서 갈라진 형제 블록입니다. B13이 부모 B12가 아니라 형제 B12′의 QC를 들고 오면 B13의 QC는 바로 앞 부모를 증명하지 못하므로 B10을 commit할 수 없습니다.",
    blocks: [
      { id: "B10", x: COL[0], y: ROW },
      { id: "B11", x: COL[1], y: ROW },
      { id: "B12", x: COL[2], y: ROW },
      { id: "B12′", x: COL[2], y: LOW, note: "형제 블록" },
      { id: "B13", x: COL[3], y: ROW },
    ],
    links: [
      { from: "B11", to: "B10", label: "QC10", ok: true },
      { from: "B12", to: "B11", label: "QC11", ok: true },
      { from: "B12′", to: "B11", label: "", ok: true },
      { from: "B13", to: "B12", label: "부모", ok: true, parentOnly: true },
      { from: "B13", to: "B12′", label: "QC12′", ok: false },
    ],
    ok: false,
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  note: string;
  blocks: readonly Block[];
  links: readonly Link[];
  ok: boolean;
}[];

function center(block: Block) {
  return { cx: block.x + BW / 2, cy: block.y + BH / 2 };
}

/** 자식 블록에서 QC가 인증하는 블록까지의 꺾은선 좌표와 라벨 위치입니다. */
function route(from: Block, to: Block): { points: readonly (readonly [number, number])[]; lx: number; ly: number } {
  if (from.y === to.y && from.x - to.x <= BW + 40) {
    const y = from.y + BH / 2;
    return { points: [[from.x, y], [to.x + BW, y]], lx: (from.x + to.x + BW) / 2, ly: from.y - 8 };
  }
  if (from.y === to.y) {
    const a = from.x + BW / 2;
    const b = to.x + BW / 2;
    return { points: [[a, from.y], [a, 26], [b, 26], [b, to.y]], lx: (a + b) / 2, ly: 18 };
  }
  const start: readonly [number, number] = [from.x, from.y + BH / 2];
  const finish: readonly [number, number] = [to.x + BW, to.y + BH / 2];
  return { points: [start, finish], lx: (start[0] + finish[0]) / 2 + 26, ly: (start[1] + finish[1]) / 2 + 4 };
}

function LinkLine({ from, to, link }: { from: Block; to: Block; link: Link }) {
  const color = link.parentOnly ? "#94a3b8" : link.ok ? "#2563eb" : "#dc2626";
  const { points, lx, ly } = route(from, to);
  const [tx, ty] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const len = Math.hypot(tx - px, ty - py);
  const ux = (tx - px) / len;
  const uy = (ty - py) / len;
  const bx = tx - ux * 8;
  const by = ty - uy * 8;
  const d = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="1.25" strokeDasharray={link.ok ? undefined : "5 3"} />
      <path d={`M${tx} ${ty} L${bx - uy * 4} ${by + ux * 4} L${bx + uy * 4} ${by - ux * 4} Z`} fill={color} />
      {link.label ? (
        <text x={lx} y={ly} textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>
          {link.label}
        </text>
      ) : null}
    </g>
  );
}

export default function ThreeChainLinkViz() {
  return (
    <SceneShell
      eyebrow="Chained HotStuff · commit 조건"
      title="번호가 이어져도 QC가 바로 앞 부모를 가리켜야 three-chain입니다"
      description="화살표는 블록이 들고 온 justify QC가 어느 블록을 인증하는지 나타냅니다. QC는 그 블록이 충분한 표를 받았다는 증거입니다. 파란 실선은 바로 앞 부모를 인증하는 QC, 빨간 점선은 그렇지 않은 QC, 회색 선은 QC 없이 부모만 가리키는 연결입니다."
      ariaLabel="올바른 three-chain과 B11을 건너뛴 경우, 형제 블록 QC를 들고 온 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks: readonly Block[] = scene.blocks;
        const byId = (id: string) => blocks.find((block) => block.id === id) as Block;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 362 196" role="img" aria-label={scene.note} className="mx-auto block h-auto w-full max-w-[34rem]">
              {(scene.links as readonly Link[]).map((link) => (
                <LinkLine key={`${link.from}-${link.to}`} from={byId(link.from)} to={byId(link.to)} link={link} />
              ))}
              {blocks.map((block) => {
                const { cx, cy } = center(block);
                const committed = scene.ok && block.id === "B10";
                return (
                  <g key={block.id} opacity={block.faded ? 0.45 : 1}>
                    <rect
                      x={block.x}
                      y={block.y}
                      width={BW}
                      height={BH}
                      rx="8"
                      fill={committed ? "#dcfce7" : "#f8fafc"}
                      stroke={committed ? "#16a34a" : "#94a3b8"}
                      strokeWidth="1"
                      strokeDasharray={block.faded ? "4 3" : undefined}
                    />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
                      {block.id}
                    </text>
                    {block.note ? (
                      <text x={cx} y={block.y + BH + 15} textAnchor="middle" fontSize="13" fill="#64748b">
                        {block.note}
                      </text>
                    ) : null}
                    {committed ? (
                      <text x={cx} y={block.y + BH + 15} textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d">
                        commit
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
