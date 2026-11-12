import SceneShell from "./SceneShell";

/**
 * 본문 대응: #geth-defense 첫 두 문단 — geth v1.17.10 버킷 하나의 live 16자리·replacement 10자리와
 * public prefix 장부(table 전체 ≤10 → 이 버킷 ≤2, 두 번째 실패 시 첫 장부 되돌림),
 * 꽉 찬 버킷의 replacement 행, 재검증 탈락 뒤 무작위 승격.
 * 칸의 채움 수, prefix별 기존 개수, 승격된 후보는 모두 장면을 보이려는 가정입니다.
 */
const HONEST = "#059669";
const ATTACK = "#dc2626";
const NEW = "#4f46e5";
const PENDING = "#d97706";
const EMPTY = "#94a3b8";
const MUTED = "#64748b";

type Mark = "add" | "undo" | "reject" | null;

interface Ledger {
  prefix: string;
  table: number;
  tableMark: Mark;
  tableText: string;
  bucket: number;
  bucketMark: Mark;
  bucketText: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  live: readonly string[];
  replacement: readonly string[];
  highlightLive: number;
  highlightReplacement: number;
  removedLive: number;
  candidate: string;
  outcome: string;
  ledger: Ledger | null;
}

const BASE_LIVE = ["H", "H", "M·P", "H", "H", "H", "H", "H", "M·P", "H", "H", "H", "H", "", "", ""] as const;
const WITH_Q = [...BASE_LIVE.slice(0, 13), "H·Q", "", ""];
const FULL = [...BASE_LIVE.slice(0, 13), "H·Q", "H", "H"];
const PROMOTED = [...FULL.slice(0, 4), "M", ...FULL.slice(5)];

const SCENES: readonly Scene[] = [
  {
    label: "table 장부 먼저",
    summary: "prefix P · table 4 → 5 (≤10 통과)",
    note: "Mallory의 prefix P에서 새 후보가 옵니다. 버킷은 13/16이라 자리는 있습니다. 먼저 table 전체 장부에서 P의 수를 4에서 5로 올려 보고, 한도 10 안이므로 다음 검사로 넘어갑니다.",
    live: BASE_LIVE,
    replacement: [],
    highlightLive: -1,
    highlightReplacement: -1,
    removedLive: -1,
    candidate: "M·P",
    outcome: "1차 통과 · 버킷 검사로",
    ledger: { prefix: "P", table: 4, tableMark: "add", tableText: "4 → 5 / 10", bucket: 2, bucketMark: null, bucketText: "2 / 2" },
  },
  {
    label: "버킷 장부에서 거절",
    summary: "버킷 3 > 2 → 거절 · table 5 → 4",
    note: "이 버킷에는 이미 P가 2자리 있어 세 번째는 버킷 한도 2를 넘습니다. 후보는 거절되고, 앞에서 올린 table 장부의 1도 되돌려 4가 됩니다. 빈자리 3개는 그대로 남습니다.",
    live: BASE_LIVE,
    replacement: [],
    highlightLive: -1,
    highlightReplacement: -1,
    removedLive: -1,
    candidate: "M·P",
    outcome: "거절 (ip-limit)",
    ledger: { prefix: "P", table: 4, tableMark: "undo", tableText: "5 → 4 되돌림", bucket: 2, bucketMark: "reject", bucketText: "3번째 거절" },
  },
  {
    label: "다른 prefix 입장",
    summary: "prefix Q · live 13 → 14",
    note: "다른 prefix Q의 후보는 두 장부를 모두 통과해 빈자리에 들어갑니다. 들어왔다는 것과 살아 있음이 검증됐다는 것은 다르므로, 새 entry는 fast 재검증 목록에서 PING 대상이 됩니다.",
    live: WITH_Q,
    replacement: [],
    highlightLive: 13,
    highlightReplacement: -1,
    removedLive: -1,
    candidate: "H·Q",
    outcome: "live 입장 · fast 재검증 대기",
    ledger: { prefix: "Q", table: 0, tableMark: "add", tableText: "0 → 1 / 10", bucket: 0, bucketMark: "add", bucketText: "0 → 1 / 2" },
  },
  {
    label: "꽉 찬 버킷 → 대기실",
    summary: "live 16/16 그대로 · replacement 3 → 4",
    note: "버킷이 16자리를 다 채웠다고 가정합니다. 새 후보 M·R은 기존 live entry를 밀어내지 않고 replacement 행(최대 10)으로 갑니다. Replacement도 같은 prefix 장부에 함께 셉니다.",
    live: FULL,
    replacement: ["M", "M", "H", "M·R"],
    highlightLive: -1,
    highlightReplacement: 3,
    removedLive: -1,
    candidate: "M·R",
    outcome: "replacement 행에 대기",
    ledger: { prefix: "R", table: 1, tableMark: "add", tableText: "1 → 2 / 10", bucket: 0, bucketMark: "add", bucketText: "0 → 1 / 2" },
  },
  {
    label: "탈락 → 무작위 승격",
    summary: "탈락 1 → replacement 중 무작위 1개 승격",
    note: "다섯 번째 자리의 H가 재검증에서 탈락하면 replacement 중 하나를 무작위로 골라 그 자리에 올립니다. 이 장면에서는 M이 뽑혔다고 가정했습니다. 즉시 퇴출은 막지만, 대기실 자체가 Mallory 후보로 채워질 가능성까지 없애지는 않습니다.",
    live: PROMOTED,
    replacement: ["M", "H", "M·R"],
    highlightLive: 4,
    highlightReplacement: -1,
    removedLive: 4,
    candidate: "재검증 탈락",
    outcome: "H 탈락 → M 무작위 승격",
    ledger: null,
  },
];

const W = 360;
const H = 236;

function tone(value: string) {
  if (!value) return EMPTY;
  return value.startsWith("M") ? ATTACK : HONEST;
}

function Cell({ x, y, w, h, value, highlight, removed }: { x: number; y: number; w: number; h: number; value: string; highlight: boolean; removed: boolean }) {
  const color = tone(value);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={value ? color : "none"}
        fillOpacity={value ? 0.14 : 0}
        stroke={highlight ? NEW : color}
        strokeWidth={highlight ? 1.25 : 1}
        strokeDasharray={value ? undefined : "3 3"}
      />
      {value && (
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={color}>
          {value}
        </text>
      )}
      {removed && (
        <text x={x + w / 2} y={y - 3} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={NEW}>
          승격
        </text>
      )}
    </g>
  );
}

function LedgerRow({ y, label, limit, count, mark, text }: { y: number; label: string; limit: number; count: number; mark: Mark; text: string }) {
  const boxW = limit === 10 ? 11 : 22;
  const startX = 124;
  const markIndex = mark === "reject" ? limit : count;
  return (
    <g>
      <text x={12} y={y + 12} fontSize={12.5} fill="currentColor">
        {label}
      </text>
      {Array.from({ length: limit }, (_, index) => {
        const filled = index < count;
        const isMark = mark !== null && mark !== "reject" && index === markIndex;
        const stroke = isMark ? (mark === "undo" ? ATTACK : PENDING) : filled ? MUTED : EMPTY;
        return (
          <rect
            key={index}
            x={startX + index * (boxW + 3)}
            y={y + 2}
            width={boxW}
            height={13}
            rx={2}
            fill={filled ? MUTED : isMark && mark === "add" ? PENDING : "none"}
            fillOpacity={filled ? 0.55 : isMark ? 0.35 : 0}
            stroke={stroke}
            strokeWidth={1}
            strokeDasharray={filled ? undefined : "2 2"}
          />
        );
      })}
      {mark === "reject" && (
        <g>
          <rect x={startX + limit * (boxW + 3)} y={y + 2} width={boxW} height={13} rx={2} fill="none" stroke={ATTACK} strokeDasharray="2 2" />
          <text x={startX + limit * (boxW + 3) + boxW / 2} y={y + 13} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={ATTACK}>
            ×
          </text>
        </g>
      )}
      {mark === "undo" && (
        <text x={startX + markIndex * (boxW + 3) + boxW / 2} y={y + 13} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={ATTACK}>
          ×
        </text>
      )}
      <text x={W - 8} y={y + 12} textAnchor="end" fontSize={12} fontWeight={700} fill={mark === "undo" || mark === "reject" ? ATTACK : mark === "add" ? PENDING : MUTED}>
        {text}
      </text>
    </g>
  );
}

export default function AdmissionLedgerViz() {
  return (
    <SceneShell
      eyebrow="geth v1.17.10 버킷 하나"
      title="새 후보는 두 장부를 차례로 통과하고, 꽉 찬 버킷에서는 대기실로 갑니다"
      description="위 16칸은 버킷의 live entry, 가운데 10칸은 replacement(대기실), 아래는 후보 prefix의 장부입니다. H는 정직한 노드, M은 Mallory 노드, ·P·Q·R은 public /24 prefix 이름입니다. 칸의 채움 수와 기존 장부 수는 가정입니다."
      note="LAN 주소는 이 quota 경로를 건너뛰고, 초기 table 구성 중의 unsolicited inbound는 이 그림 이전에 거절됩니다."
      ariaLabel="geth 버킷의 live 자리, replacement 행, prefix 장부가 후보 입장과 승격에 따라 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const liveCount = scene.live.filter(Boolean).length;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={12} y={14} fontSize={12.5} fontWeight={700} fill="currentColor">
              live entry
            </text>
            <text x={W - 8} y={14} textAnchor="end" fontSize={12.5} fontWeight={700} fill={MUTED}>
              {liveCount} / 16
            </text>
            {scene.live.map((value, index) => (
              <Cell
                key={`live-${index}`}
                x={14 + (index % 8) * 42}
                y={34 + Math.floor(index / 8) * 30}
                w={36}
                h={22}
                value={value}
                highlight={index === scene.highlightLive}
                removed={index === scene.removedLive}
              />
            ))}

            <text x={12} y={110} fontSize={12.5} fontWeight={700} fill="currentColor">
              replacement (대기실)
            </text>
            <text x={W - 8} y={110} textAnchor="end" fontSize={12.5} fontWeight={700} fill={MUTED}>
              {scene.replacement.length} / 10
            </text>
            {Array.from({ length: 10 }, (_, index) => (
              <Cell
                key={`rep-${index}`}
                x={14 + index * 33.6}
                y={118}
                w={29}
                h={20}
                value={scene.replacement[index] ?? ""}
                highlight={index === scene.highlightReplacement}
                removed={false}
              />
            ))}

            <line x1={12} x2={W - 8} y1={150} y2={150} stroke={EMPTY} strokeWidth={1} />
            {scene.ledger ? (
              <g>
                <text x={12} y={166} fontSize={12.5} fontWeight={700} fill="currentColor">
                  prefix {scene.ledger.prefix} 장부
                </text>
                <LedgerRow y={170} label="① table 전체 ≤10" limit={10} count={scene.ledger.table} mark={scene.ledger.tableMark} text={scene.ledger.tableText} />
                <LedgerRow y={190} label="② 이 버킷 ≤2" limit={2} count={scene.ledger.bucket} mark={scene.ledger.bucketMark} text={scene.ledger.bucketText} />
              </g>
            ) : (
              <text x={12} y={180} fontSize={12.5} fill={MUTED}>
                이 장면은 장부 대신 자리 이동만 봅니다
              </text>
            )}

            <text x={12} y={228} fontSize={12.5} fill={MUTED}>
              입력: <tspan fontWeight={700} fill={scene.candidate === "재검증 탈락" ? NEW : tone(scene.candidate)}>{scene.candidate}</tspan>
            </text>
            <text x={W - 8} y={228} textAnchor="end" fontSize={12.5} fontWeight={700} fill={NEW}>
              {scene.outcome}
            </text>
          </svg>
        );
      }}
    />
  );
}
