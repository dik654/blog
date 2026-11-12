import SceneShell from "./SceneShell";

/**
 * 본문 대응: #index-retrieval — 큰 DAG가 여러 CAR shard로 나뉘면 root CID만으로 block 위치를 모른다.
 * Sharded DAG index: root CID → shard digest, block digest → offset·length.
 * 본문 예 offset 1000, length 256 → half-open [1000, 1256). 읽은 bytes를 다시 hash해 CID(b)=c인지 본다.
 * HTTP 206이 와도 hash가 다르면 verify=false.
 * 그림용 가정: shard 3개, 확대 창 936~1320바이트를 32바이트 칸 12개로 나눔(1000=936+2×32, 1256=1000+8×32).
 */
const OFFSET = 1000;
const LENGTH = 256;
const CELL_BYTES = 32;
const WINDOW_START = OFFSET - 2 * CELL_BYTES;
const CELLS = 12;
const RANGE_FIRST = (OFFSET - WINDOW_START) / CELL_BYTES;
const RANGE_CELLS = LENGTH / CELL_BYTES;

const SCENES = [
  {
    label: "root CID만 있을 때",
    summary: "block c는 어느 shard에?",
    note: "DAG가 여러 shard로 나뉘면 root CID만으로는 block c가 어느 shard의 몇 번째 byte에 있는지 모릅니다.",
  },
  {
    label: "index가 위치를 가리킵니다",
    summary: "c → shard j · offset 1000 · length 256",
    note: "index가 block c에 shard j, offset o=1000, length ℓ=256을 붙여 줍니다.",
  },
  {
    label: "그 범위만 읽습니다",
    summary: `[${OFFSET}, ${OFFSET + LENGTH}) · ${LENGTH} bytes`,
    note: `${RANGE_CELLS}칸 × ${CELL_BYTES}바이트 = ${LENGTH}바이트. 1000은 넣고 1256은 빼는 반열린 구간이라 1000~1255를 읽습니다.`,
  },
  {
    label: "다시 hash해 대조합니다",
    summary: "CID(b) = c → verify",
    note: "읽은 bytes b의 CID를 다시 계산해 DAG link가 요구한 c와 같으면 올바른 block입니다.",
  },
  {
    label: "206 응답이어도 다르면",
    summary: "CID(b) ≠ c → false",
    note: "range 응답(206)이 와도 CID가 c와 다르면 false입니다. 응답과 올바른 block은 다른 사실입니다.",
  },
] as const;

const W = 360;
const H = 226;
const ACCENT = "#2563eb";
const DENY = "#dc2626";
const OK = "#16a34a";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const SHARDS = ["shard 1", "shard j", "shard 3"] as const;
const RULER_X = 18;
const CELL_W = 27;

export default function ShardRangeViz() {
  return (
    <SceneShell
      eyebrow="root CID → shard → byte range"
      title="index가 가리킨 칸만 읽고, 읽은 bytes를 다시 확인합니다"
      description="가로 띠 하나가 shard 하나(immutable CAR bytes)입니다. 아래 눈금은 shard j의 일부를 확대한 것이며 칸 하나는 32바이트입니다. shard 개수, 띠의 길이와 띠 위 위치는 그림용 가정입니다."
      ariaLabel="root CID에서 index를 거쳐 shard j의 1000부터 256바이트를 읽고 CID로 검증하는 과정"
      scenes={SCENES}
      render={(active) => {
        const indexed = active >= 1;
        const zoom = active >= 2;
        const fail = active === 4;
        const verdict = active >= 3;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {/* root CID */}
            <rect x={8} y={8} width={76} height={70} rx={6} fill={ACCENT} fillOpacity={0.06} stroke={ACCENT} strokeWidth={1.25} />
            <text x={46} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">root CID</text>
            <text x={46} y={56} textAnchor="middle" fontSize={10} fill={MUTED}>찾는 block c</text>

            {/* index entry (2장면부터) */}
            <g opacity={indexed ? 1 : 0.25}>
              <rect x={92} y={8} width={260} height={22} rx={5} fill="none" stroke={indexed ? ACCENT : LINE} strokeWidth={1} />
              <text x={100} y={23} fontSize={10} fill="currentColor">index: c → shard j · o=1000 · ℓ=256</text>
            </g>

            {/* shards: 길이는 알 수 없으므로 같은 길이로 그림 */}
            {SHARDS.map((name, index) => {
              const y = 38 + index * 14;
              const target = index === 1;
              return (
                <g key={name}>
                  <text x={96} y={y + 9} fontSize={10} fill={target && indexed ? ACCENT : MUTED}>{name}</text>
                  <rect x={146} y={y} width={206} height={10} rx={2} fill={target && indexed ? ACCENT : LINE} fillOpacity={target && indexed ? 0.18 : 0.15} stroke={target && indexed ? ACCENT : LINE} strokeWidth={1} />
                  {!indexed && <text x={350} y={y + 9} textAnchor="end" fontSize={10} fill={MUTED}>?</text>}
                </g>
              );
            })}
            {indexed && (
              <>
                <rect x={232} y={50} width={24} height={14} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <line x1={232} y1={64} x2={RULER_X} y2={104} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
                <line x1={256} y1={64} x2={RULER_X + CELLS * CELL_W} y2={104} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}

            {/* 확대 눈금 */}
            <g opacity={zoom ? 1 : 0.25}>
              {Array.from({ length: CELLS }, (_, cell) => {
                const inRange = cell >= RANGE_FIRST && cell < RANGE_FIRST + RANGE_CELLS;
                return (
                  <rect
                    key={cell}
                    x={RULER_X + cell * CELL_W}
                    y={106}
                    width={CELL_W - 2}
                    height={24}
                    rx={2}
                    fill={inRange && zoom ? (fail ? DENY : ACCENT) : LINE}
                    fillOpacity={inRange && zoom ? 0.22 : 0.12}
                    stroke={inRange && zoom ? (fail ? DENY : ACCENT) : LINE}
                    strokeWidth={1}
                  />
                );
              })}
              <line x1={RULER_X + RANGE_FIRST * CELL_W} y1={100} x2={RULER_X + RANGE_FIRST * CELL_W} y2={136} stroke="currentColor" strokeWidth={1.25} />
              <text x={RULER_X + RANGE_FIRST * CELL_W} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">1000 [</text>
              <line x1={RULER_X + (RANGE_FIRST + RANGE_CELLS) * CELL_W} y1={100} x2={RULER_X + (RANGE_FIRST + RANGE_CELLS) * CELL_W} y2={136} stroke="currentColor" strokeWidth={1} strokeDasharray="3 2" />
              <text x={RULER_X + (RANGE_FIRST + RANGE_CELLS) * CELL_W} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">) 1256</text>
              <text x={RULER_X} y={150} fontSize={10} fill={MUTED}>{WINDOW_START}</text>
              <text x={RULER_X + CELLS * CELL_W} y={150} textAnchor="end" fontSize={10} fill={MUTED}>{WINDOW_START + CELLS * CELL_BYTES}</text>
              <text x={180} y={166} textAnchor="middle" fontSize={10} fill={MUTED}>{`${RANGE_CELLS}칸 × ${CELL_BYTES}바이트 = ${LENGTH}바이트를 b로 읽음`}</text>
            </g>

            {/* 검증 */}
            <g opacity={verdict ? 1 : 0.25}>
              <rect x={8} y={178} width={344} height={40} rx={6} fill={verdict ? (fail ? DENY : OK) : "none"} fillOpacity={verdict ? 0.08 : 0} stroke={verdict ? (fail ? DENY : OK) : LINE} strokeWidth={1.25} />
              <text x={20} y={203} fontSize={11} fill="currentColor">{fail ? "HTTP 206 받음 · CID(b)" : "CID(b)"}</text>
              <text x={340} y={203} textAnchor="end" fontSize={13} fontWeight={700} fill={verdict ? (fail ? DENY : OK) : MUTED}>
                {fail ? "≠ c → verify false" : "= c → verify true"}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
