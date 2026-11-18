import SceneShell from "./SceneShell";

/**
 * 본문 대응: #admission — SYNCING block 352가 optimistic 후보로 들어간 뒤, 나중에 EL이 INVALID를 반환하면
 * latestValidHash 기준으로 invalid suffix(block과 영향을 받은 후손)를 fork-choice와 state에서 제거.
 * 353·354와 다른 branch 353b, latestValidHash가 351을 가리킨다는 설정은 모두 설명용 가정입니다.
 */
const ACCENT = "#2563eb";
const BAD = "#dc2626";
const OK = "#16a34a";
const IDLE = "#94a3b8";
const TEXT = "#64748b";

type Status = "valid" | "optimistic" | "suspect" | "removed";

const NODES: readonly { id: string; x: number; y: number; parent: string | null }[] = [
  { id: "351", x: 40, y: 50, parent: null },
  { id: "352", x: 128, y: 50, parent: "351" },
  { id: "353", x: 216, y: 50, parent: "352" },
  { id: "354", x: 304, y: 50, parent: "353" },
  { id: "353b", x: 216, y: 128, parent: "351" },
];

const STATUS: readonly Record<string, Status>[] = [
  { "351": "valid", "352": "optimistic", "353": "optimistic", "354": "optimistic", "353b": "optimistic" },
  { "351": "valid", "352": "suspect", "353": "suspect", "354": "suspect", "353b": "optimistic" },
  { "351": "valid", "352": "removed", "353": "removed", "354": "removed", "353b": "optimistic" },
];

const SCENES = [
  { label: "Optimistic 후보", summary: "352 = SYNCING → optimistic", note: "Block 352는 consensus와 data availability를 통과했지만 Engine 응답이 SYNCING이라 optimistic 표시를 단 채 fork-choice에 들어갑니다. 그 위에 353·354가, 351에서 갈라진 353b가 이어졌다고 가정합니다(가정)." },
  { label: "INVALID 응답", summary: "latestValidHash → 351 (가정)", note: "나중에 EL이 352의 payload를 INVALID로 판정하며 latestValidHash로 351 쪽을 가리켰다고 가정합니다. Prysm은 이 지점 뒤의 invalid suffix, 곧 352와 그 후손을 찾습니다." },
  { label: "Suffix 제거", summary: "352·353·354 제거 · 353b 유지", note: "352와 영향을 받은 후손의 state·fork-choice entry를 제거합니다. 352의 후손이 아닌 353b는 이 판정과 무관하므로 optimistic 후보로 남습니다. VALID 응답이었다면 반대로 352의 optimistic 표시만 해제됩니다." },
] as const;

const COLOR: Record<Status, string> = { valid: OK, optimistic: ACCENT, suspect: BAD, removed: IDLE };
const CAPTION: Record<Status, string> = { valid: "VALID (가정)", optimistic: "optimistic", suspect: "invalid suffix", removed: "제거" };

export default function InvalidSuffixPruneViz() {
  return (
    <SceneShell
      eyebrow="INVALID 이후"
      title="INVALID 판정은 그 Block과 후손만 잘라 냅니다"
      description="칸 하나가 fork-choice에 들어간 block이고, 선은 parent 관계입니다. latestValidHash는 EL이 아직 유효하다고 보는 가장 최근 조상의 payload hash입니다. 353·354·353b는 설명용 가정입니다(가정)."
      ariaLabel="optimistic block 352가 INVALID 판정 뒤 후손과 함께 제거되고 다른 branch는 남는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const status = STATUS[active];
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {NODES.filter((node) => node.parent !== null).map((node) => {
              const parent = NODES.find((candidate) => candidate.id === node.parent);
              if (!parent) return null;
              const removed = status[node.id] === "removed";
              return (
                <line key={`e${node.id}`} x1={parent.x + 32} y1={parent.y} x2={node.x - 32} y2={node.y} stroke={removed ? IDLE : TEXT} strokeWidth={1} strokeDasharray={removed ? "3 3" : undefined} />
              );
            })}
            {NODES.map((node) => {
              const state = status[node.id];
              const color = COLOR[state];
              const removed = state === "removed";
              return (
                <g key={node.id} opacity={removed ? 0.55 : 1}>
                  <rect x={node.x - 32} y={node.y - 19} width={64} height={38} rx={6} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={removed ? "3 3" : undefined} />
                  <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>{node.id}</text>
                  <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize={10} fill={color}>{CAPTION[state]}</text>
                  {removed && <line x1={node.x - 24} y1={node.y + 14} x2={node.x + 24} y2={node.y - 14} stroke={IDLE} strokeWidth={1} />}
                </g>
              );
            })}
            {active >= 1 && (
              <g>
                <line x1={40} y1={90} x2={40} y2={71} stroke={OK} strokeWidth={1.25} />
                <text x={10} y={104} fontSize={11} fontWeight={700} fill={OK}>latestValidHash</text>
              </g>
            )}
            <text x={10} y={164} fontSize={11} fill={TEXT}>{active === 2 ? "353b는 352의 후손이 아니므로 그대로 남음" : "slot 번호 순서 → 오른쪽"}</text>
          </svg>
        );
      }}
    />
  );
}
