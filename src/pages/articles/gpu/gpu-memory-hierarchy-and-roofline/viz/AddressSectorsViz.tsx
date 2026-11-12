import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 32개 작업이 각각 4바이트(유효 128B)를 요청할 때
 * 주소 배치에 따라 걸리는 32바이트 조각 수: 연속·정렬 4, 4B 어긋남 5, 간격 2는 8, 간격 8은 32.
 * 1024바이트 범위를 한 줄 256바이트(조각 8개)씩 네 줄로 그린다. 작은 칸 하나가 4바이트.
 */
const PIECE = 32;
const WORD = 4;
const LANES = 32;
const PIECES_PER_ROW = 8;
const ROWS = 4;
const SLOTS = PIECE / WORD;

const SCENES = [
  { label: "연속 · 정렬", stride: 1, offset: 0, summary: "조각 4개 · 128B 범위", note: "첫 주소가 128바이트 경계에 맞고 32개 작업이 4바이트씩 이어서 요청합니다. 요청이 32바이트 조각 4개에 꼭 들어가 걸린 범위 128바이트가 모두 유효합니다." },
  { label: "4바이트 어긋남", stride: 1, offset: 1, summary: "조각 5개 · 128/160 = 80%", note: "같은 연속 요청인데 시작이 4바이트 밀렸습니다. 마지막 요청이 다섯 번째 조각으로 넘어가 160바이트 범위에 걸리고, 그중 128바이트가 유효합니다." },
  { label: "간격 2", stride: 2, offset: 0, summary: "조각 8개 · 256B 범위", note: "각 작업이 원소 하나씩 건너뛰어 요청합니다. 유효량은 여전히 128바이트지만 요청이 256바이트 범위, 조각 8개에 퍼집니다." },
  { label: "간격 8", stride: 8, offset: 0, summary: "조각 32개 · 1024B 범위", note: "요청마다 32바이트씩 떨어져 조각 하나에 요청 하나만 들어갑니다. 1024바이트 범위, 조각 32개입니다. 이 배치는 최소 249개 원소가 있는 입력을 가정한 변형이며, 64개짜리 원본 배열 밖을 읽으라는 뜻은 아닙니다." },
] as const;

const W = 380;
const LEFT = 40;
const RIGHT = 6;
const TOP = 28;
const ROW_H = 28;
const ROW_GAP = 10;
const CELL_W = (W - LEFT - RIGHT) / PIECES_PER_ROW;
const SLOT_W = CELL_W / SLOTS;
const H = TOP + ROWS * ROW_H + (ROWS - 1) * ROW_GAP + 34;

const ACCENT = "#2563eb";
const HIT = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#64748b";

function requestedWords(stride: number, offset: number) {
  return new Set(Array.from({ length: LANES }, (_, lane) => offset + lane * stride));
}

export default function AddressSectorsViz() {
  return (
    <SceneShell
      eyebrow="같은 128바이트, 다른 주소 배치"
      title="요청이 흩어질수록 걸리는 32바이트 조각이 늘어납니다"
      description="한 줄은 256바이트이고 큰 칸 하나가 32바이트 조각, 그 안의 작은 칸 하나가 4바이트 원소입니다. 파란 칸은 32개 작업이 요청한 원소, 주황 테두리는 요청이 하나라도 걸린 조각입니다."
      note="여기서 센 것은 요청이 걸친 조각의 범위입니다. 아래 계층에서 실제로 읽는 양은 cache 재사용과 병합에 따라 달라지며 이 그림에서 계산하지 않았습니다."
      ariaLabel="32개 작업의 주소 배치에 따라 32바이트 조각 4, 5, 8, 32개에 걸리는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const words = requestedWords(scene.stride, scene.offset);
        const touched = new Set(Array.from(words, (word) => Math.floor(word / SLOTS)));
        const span = touched.size * PIECE;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={16} fontSize={12} fill={TEXT}>주소(바이트) · 한 줄 256바이트 = 조각 8개</text>
            {Array.from({ length: ROWS }, (_, row) => {
              const y = TOP + row * (ROW_H + ROW_GAP);
              return (
                <g key={row}>
                  <text x={LEFT - 6} y={y + ROW_H / 2 + 4} textAnchor="end" fontSize={11} fill={TEXT}>
                    {row * 256}–
                  </text>
                  {Array.from({ length: PIECES_PER_ROW }, (_, col) => {
                    const piece = row * PIECES_PER_ROW + col;
                    const x = LEFT + col * CELL_W;
                    const hit = touched.has(piece);
                    return (
                      <g key={col}>
                        {Array.from({ length: SLOTS }, (_, slot) => {
                          const word = piece * SLOTS + slot;
                          const on = words.has(word);
                          return (
                            <rect
                              key={slot}
                              x={x + slot * SLOT_W + 0.75}
                              y={y + 4}
                              width={SLOT_W - 1.5}
                              height={ROW_H - 8}
                              fill={on ? ACCENT : "#e2e8f0"}
                              opacity={on ? 0.85 : 0.5}
                            />
                          );
                        })}
                        <rect
                          x={x + 1}
                          y={y + 1}
                          width={CELL_W - 2}
                          height={ROW_H - 2}
                          rx={2}
                          fill="none"
                          stroke={hit ? HIT : LINE}
                          strokeWidth={hit ? 1.25 : 0.75}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
            <text x={LEFT} y={H - 10} fontSize={13} fontWeight={700} fill={HIT}>
              걸린 조각 {touched.size}개 · 범위 {span}B
            </text>
            <text x={W - RIGHT} y={H - 10} textAnchor="end" fontSize={13} fontWeight={700} fill={ACCENT}>
              유효 128B · {Math.round((128 / span) * 1000) / 10}%
            </text>
          </svg>
        );
      }}
    />
  );
}
