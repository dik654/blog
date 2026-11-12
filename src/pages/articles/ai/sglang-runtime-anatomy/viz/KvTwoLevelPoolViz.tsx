import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kv-pool — req_to_token(요청 행 × 위치 열, 칸 번호) → token_to_kv pool(칸 번호 = 모든 층 K·V 배열의 행).
 * 수치: 4,096+1행 pool, 32층(가정), max_running_requests 64·max_context_len 8,192(가정), D 입력 200·출력 300.
 * 표 크기 (64+1)×8,192×4 = 2,129,920byte, pool (4,096+1)×128KiB = 536,997,888byte → 약 0.4%.
 */
const SCENES = [
  {
    label: "표의 한 행이 칸 번호를 적습니다",
    summary: "D행 0~199열 → 칸 번호 200개",
    note: "D가 들어오면 빈 행 하나를 받고, allocator(빈 칸을 내주는 관리자)가 내준 200칸의 번호가 0~199열에 적힙니다. 칸이 한 token 단위라 번호가 이어질 필요는 없습니다. 0번 행은 CUDA graph가 넣는 가짜 요청의 자리입니다.",
  },
  {
    label: "칸 번호 하나가 모든 층의 같은 행을 가리킵니다",
    summary: "칸 1,730 → 32층 K·V의 1,730행",
    note: "pool은 층마다 K 배열과 V 배열을 하나씩 둡니다. 표에는 번호 하나만 적고, prefill은 그 번호가 가리키는 행에 32층(가정)의 K와 V를 씁니다.",
  },
  {
    label: "표의 행 길이는 미리 고정됩니다",
    summary: "D가 끝까지 써도 500 / 8,192열",
    note: "D는 500열만 쓰지만 행은 max_context_len만큼 차지합니다. 그래도 표 전체는 KV pool의 약 0.4%이고, 대신 표의 행 수와 길이가 동시 요청 수와 최대 문맥을 먼저 정합니다.",
  },
] as const;

const W = 320;
const H = 204;
const INK = "#334155";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const DUMMY = "#b45309";

const ROWS = ["0 가짜", "1 A", "2 B", "3 C", "4 D"] as const;
const COLS = ["0", "1", "2", "…", "199"] as const;
const D_SLOTS: readonly string[] = ["601", "602", "1,730", "…", "3,977"];
const TX = 44;
const TY = 34;
const CW = 30;
const RH = 21;
const D_ROW_Y = TY + (ROWS.length - 1) * RH;

const POOL_X = 244;
const POOL_TOP = 26;
const POOL_BOTTOM = 176;
const POOL_W = 30;
const poolY = (slot: number) => POOL_TOP + 5 + (slot / 4096) * (POOL_BOTTOM - POOL_TOP - 8);
const POINTED: readonly { slot: number; col: number }[] = [
  { slot: 601, col: 0 },
  { slot: 1730, col: 2 },
  { slot: 3977, col: 4 },
];

const ARRAYS: readonly [string, string][] = [
  ["0층", "K"],
  ["0층", "V"],
  ["1층", "K"],
  ["1층", "V"],
  ["…", ""],
  ["31층", "V"],
];
const ARRAY_X0 = 204;
const ARRAY_STEP = 19;
const ARRAY_W = 13;
const ARRAY_TOP = 40;
const ARRAY_BOTTOM = 178;
const SAME_ROW_Y = D_ROW_Y + RH / 2;
// 장면 1의 pool과 같은 축척: 1,730행은 4,097행 가운데 같은 높이 비율에 놓입니다.
const ARRAY_ROW_Y = ARRAY_TOP + 3 + (1730 / 4097) * (ARRAY_BOTTOM - ARRAY_TOP - 6);

function Table({ highlightCol }: { highlightCol: number | null }) {
  return (
    <g>
      <text x={TX + (COLS.length * CW) / 2} y={TY - 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
        req_to_token 표
      </text>
      {COLS.map((col, c) => (
        <text key={col + c} x={TX + c * CW + CW / 2} y={TY - 4} textAnchor="middle" fontSize={10} fill={MUTED}>
          {col}
        </text>
      ))}
      {ROWS.map((row, r) => {
        const isD = r === ROWS.length - 1;
        const isDummy = r === 0;
        return (
          <g key={row}>
            <text x={TX - 4} y={TY + r * RH + 14} textAnchor="end" fontSize={10} fontWeight={isD ? 700 : 400} fill={isDummy ? DUMMY : isD ? ACCENT : INK}>
              {row}
            </text>
            {COLS.map((col, c) => (
              <g key={col + c}>
                <rect
                  x={TX + c * CW}
                  y={TY + r * RH}
                  width={CW}
                  height={RH}
                  fill="none"
                  stroke={isD && (highlightCol === null || highlightCol === c) ? ACCENT : MUTED}
                  strokeWidth={isD && highlightCol === c ? 1.25 : 1}
                  strokeDasharray={isDummy ? "2 2" : undefined}
                />
                {isD && (
                  <text x={TX + c * CW + CW / 2} y={TY + r * RH + 14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    {D_SLOTS[c]}
                  </text>
                )}
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function KvTwoLevelPoolViz() {
  return (
    <SceneShell
      eyebrow="token 단위 2단 KV pool"
      title="표는 칸 번호만 적고, 번호 하나가 모든 층의 같은 행을 가리킵니다"
      description="왼쪽은 요청 행 × 위치 열의 칸 번호 표(req_to_token), 오른쪽은 token 하나의 KV를 담는 칸 저장소(token_to_kv pool)입니다. 7절의 요청 D(입력 200, 실제 출력 300)를 그대로 씁니다."
      note="4,096칸 pool, 32층, KV head 8개·차원 128, 동시 요청 64·최대 문맥 8,192는 설명용 가정입니다. 칸 번호 601·602·1,730·3,977은 예시입니다."
      ariaLabel="요청 D의 칸 번호 표가 칸 저장소의 행과 모든 층의 K·V 배열을 가리키는 구조"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 && <Table highlightCol={active === 1 ? 2 : null} />}

          {active === 0 && (
            <g>
              <text x={POOL_X + POOL_W / 2} y={POOL_TOP - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
                token_to_kv pool
              </text>
              <rect x={POOL_X} y={POOL_TOP} width={POOL_W} height={POOL_BOTTOM - POOL_TOP} fill="none" stroke={MUTED} strokeWidth={1} />
              <text x={POOL_X + POOL_W / 2} y={POOL_BOTTOM + 13} textAnchor="middle" fontSize={10} fill={MUTED}>
                4,097행
              </text>
              <text x={POOL_X + POOL_W / 2} y={POOL_BOTTOM + 25} textAnchor="middle" fontSize={10} fill={MUTED}>
                (덧붙인 1행 포함)
              </text>
              {POINTED.map(({ slot, col }) => {
                const y = poolY(slot);
                const fromX = TX + col * CW + CW / 2;
                const fromY = D_ROW_Y + RH;
                return (
                  <g key={slot}>
                    <rect x={POOL_X} y={y - 2} width={POOL_W} height={4} fill={ACCENT} />
                    <path d={`M ${fromX} ${fromY} C ${fromX} ${fromY + 34}, ${POOL_X - 34} ${y}, ${POOL_X - 2} ${y}`} fill="none" stroke={ACCENT} strokeWidth={1} />
                    <text x={POOL_X + POOL_W + 4} y={y + 4} fontSize={10} fill={ACCENT}>
                      {D_SLOTS[col]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {active === 1 && (
            <g>
              {ARRAYS.map(([layer, kind], index) => {
                const x = ARRAY_X0 + index * ARRAY_STEP;
                const isGap = layer === "…";
                return (
                  <g key={layer + kind}>
                    <text x={x + ARRAY_W / 2} y={22} textAnchor="middle" fontSize={9.5} fill={INK}>
                      {layer}
                    </text>
                    <text x={x + ARRAY_W / 2} y={33} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={INK}>
                      {kind}
                    </text>
                    {isGap ? null : (
                      <>
                        <rect x={x} y={ARRAY_TOP} width={ARRAY_W} height={ARRAY_BOTTOM - ARRAY_TOP} fill="none" stroke={MUTED} strokeWidth={1} />
                        <rect x={x} y={ARRAY_ROW_Y - 3} width={ARRAY_W} height={6} fill={ACCENT} />
                      </>
                    )}
                  </g>
                );
              })}
              <path d={`M ${TX + 5 * CW} ${SAME_ROW_Y} H ${ARRAY_X0 - 5} V ${ARRAY_ROW_Y} H ${ARRAY_X0 - 1}`} fill="none" stroke={ACCENT} strokeWidth={1} />
              <line x1={ARRAY_X0} x2={ARRAY_X0 + 5 * ARRAY_STEP + ARRAY_W} y1={ARRAY_ROW_Y} y2={ARRAY_ROW_Y} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" />
              <text x={W - 4} y={196} textAnchor="end" fontSize={10} fill={INK}>
                모든 배열의 1,730행 = 같은 token
              </text>
              <text x={6} y={166} fontSize={10} fill={INK}>
                한 행 = KV head 8 × 차원 128 (가정)
              </text>
            </g>
          )}

          {active === 2 && (
            <g>
              <text x={10} y={18} fontSize={11} fontWeight={700} fill={INK}>
                D행 한 줄 = max_context_len 8,192열
              </text>
              <rect x={10} y={28} width={300} height={22} fill="none" stroke={MUTED} strokeWidth={1} />
              <rect x={10} y={28} width={(200 / 8192) * 300} height={22} fill={ACCENT} />
              <rect x={10 + (200 / 8192) * 300} y={28} width={(300 / 8192) * 300} height={22} fill={ACCENT} opacity={0.45} />
              <line x1={10 + (500 / 8192) * 300} x2={10 + (500 / 8192) * 300} y1={50} y2={68} stroke={ACCENT} strokeWidth={1} />
              <text x={10 + (500 / 8192) * 300 + 4} y={67} fontSize={10.5} fill={ACCENT}>
                입력 200 + 출력 300 = 500열 (6.1%)
              </text>
              <text x={310} y={86} textAnchor="end" fontSize={10.5} fill={MUTED}>
                나머지 7,692열은 비어 있음
              </text>

              <text x={10} y={116} fontSize={11} fontWeight={700} fill={INK}>
                바이트로 비교하면
              </text>
              <rect x={10} y={124} width={300} height={20} fill="none" stroke={MUTED} strokeWidth={1} />
              <text x={160} y={138} textAnchor="middle" fontSize={10.5} fill={INK}>
                KV pool 4,097행 × 128KiB ≈ 512.1MiB
              </text>
              <rect x={10} y={152} width={2} height={20} fill={ACCENT} />
              <text x={18} y={165} fontSize={10.5} fill={ACCENT}>
                칸 번호 표 65행 × 8,192열 × 4byte
              </text>
              <text x={18} y={181} fontSize={10.5} fill={ACCENT}>
                ≈ 2.03MiB (KV pool의 약 0.4%)
              </text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
