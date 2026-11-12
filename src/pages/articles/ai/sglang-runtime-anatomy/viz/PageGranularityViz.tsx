import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kv-pool 후반 — 칸 크기(page)가 남는 칸과 재사용 길이를 정한다.
 * 201칸 요청: block 16 → ceil(201/16)=13 block = 208칸, 빈 칸 7. page 1 → 201칸.
 * 앞 6 token이 같은 두 요청: page 1 → 6칸 공유, page 4 → 꽉 찬 page 1개 = 4칸 공유.
 */
const SCENES = [
  {
    label: "16칸 block으로 잡으면",
    summary: "201칸 → 13 block = 208칸, 7칸 빔",
    note: "vLLM은 요청의 논리 block을 16칸짜리 물리 block에 잇습니다. block 12개(192칸)로는 9칸이 모자라 13번째 block을 잡고, 그 block의 7칸은 비어 있습니다.",
  },
  {
    label: "page 1이면",
    summary: "201칸 → 201칸, 빈 칸 0",
    note: "SGLang의 기본 page는 1칸이라 201칸이 필요한 요청은 201칸만 씁니다. 대신 칸 번호 표는 요청마다 최대 길이만큼의 행을 미리 차지합니다.",
  },
  {
    label: "앞부분이 같은 두 요청",
    summary: "page 1: 6칸 공유 · page 4: 4칸 공유",
    note: "page 1이면 같은 앞 6칸을 모두 함께 씁니다. page 4이면 4칸짜리 page를 통째로 함께 쓰는데, 둘째 page는 7번째 token부터 달라 4칸만 함께 씁니다.",
  },
] as const;

const W = 320;
const H = 176;
const INK = "#334155";
const MUTED = "#94a3b8";
const USED = "#2563eb";
const EMPTY = "#dc2626";
const SHARED = "#16a34a";

const BLOCKS = 13;
const BLOCK_W = 23;
const BX = (W - BLOCKS * BLOCK_W) / 2;
const ZOOM_W = 18;

const CW = 30;
const TOKENS_X = 62;

function TokenRow({ y, label, tokens, page, sharedCount }: { y: number; label: string; tokens: readonly string[]; page: number; sharedCount: number }) {
  return (
    <g>
      <text x={TOKENS_X - 6} y={y + 15} textAnchor="end" fontSize={11} fontWeight={700} fill={INK}>
        {label}
      </text>
      {tokens.map((token, index) => (
        <g key={index}>
          <rect x={TOKENS_X + index * CW} y={y} width={CW} height={21} fill="none" stroke={index < sharedCount ? SHARED : MUTED} strokeWidth={index < sharedCount ? 1.25 : 1} />
          <text x={TOKENS_X + index * CW + CW / 2} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={index < sharedCount ? 700 : 400} fill={index < sharedCount ? SHARED : INK}>
            {token}
          </text>
        </g>
      ))}
      {Array.from({ length: tokens.length / page + 1 }, (_, p) => (
          <line key={p} x1={TOKENS_X + p * page * CW} x2={TOKENS_X + p * page * CW} y1={y - 4} y2={y + 25} stroke={INK} strokeWidth={1.25} />
      ))}
    </g>
  );
}

const REQ_1: readonly string[] = ["t1", "t2", "t3", "t4", "t5", "t6", "a7", "a8"];
const REQ_2: readonly string[] = ["t1", "t2", "t3", "t4", "t5", "t6", "b7", "b8"];

export default function PageGranularityViz() {
  return (
    <SceneShell
      eyebrow="칸의 크기"
      title="칸을 잘게 나누면 남는 칸이 줄고 함께 쓰는 길이가 정확해집니다"
      description="칸 하나가 token 하나의 KV 자리입니다. 처음 두 장면은 201칸이 필요한 요청 하나, 마지막 장면은 앞 6 token이 같은 두 요청입니다."
      note="201칸과 앞 6 token은 본문 8절의 예입니다. 마지막 장면에서 각 요청이 8 token이고 뒤 두 token이 다르다는 것은 그림용 가정입니다."
      ariaLabel="16칸 block과 1칸 page에서 201칸 요청이 잡는 칸 수, 그리고 page 1과 page 4에서 함께 쓰는 앞부분 길이 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 && (
            <g>
              <text x={BX} y={16} fontSize={11} fontWeight={700} fill={INK}>
                {active === 0 ? "물리 block 13개 (block 하나 = 16칸)" : "칸 201개 (칸 하나 = 1 token)"}
              </text>
              {active === 0 ? (
                Array.from({ length: BLOCKS }, (_, b) => {
                  const last = b === BLOCKS - 1;
                  return (
                    <g key={b}>
                      <rect x={BX + b * BLOCK_W} y={26} width={BLOCK_W} height={28} fill={last ? "none" : USED} opacity={last ? 1 : 0.8} stroke={INK} strokeWidth={1} />
                      {last && <rect x={BX + b * BLOCK_W} y={26} width={(9 / 16) * BLOCK_W} height={28} fill={USED} opacity={0.8} />}
                    </g>
                  );
                })
              ) : (
                <rect x={BX} y={26} width={(201 / 208) * BLOCKS * BLOCK_W} height={28} fill={USED} opacity={0.8} stroke={INK} strokeWidth={1} />
              )}
              <text x={BX} y={72} fontSize={11} fill={INK}>
                {active === 0 ? "12 block × 16 = 192칸 + 13번째 block 9칸" : "필요한 201칸에서 끝납니다 · 빈 칸 0"}
              </text>

              {active === 0 && (
                <g>
                  <text x={BX} y={102} fontSize={11} fontWeight={700} fill={INK}>
                    13번째 block을 펼치면
                  </text>
                  {Array.from({ length: 16 }, (_, c) => (
                    <rect
                      key={c}
                      x={BX + c * ZOOM_W}
                      y={112}
                      width={ZOOM_W}
                      height={22}
                      fill={c < 9 ? USED : "none"}
                      opacity={c < 9 ? 0.8 : 1}
                      stroke={c < 9 ? INK : EMPTY}
                      strokeWidth={1}
                      strokeDasharray={c < 9 ? undefined : "2 2"}
                    />
                  ))}
                  <text x={BX + (9 * ZOOM_W) / 2} y={154} textAnchor="middle" fontSize={11} fill={INK}>
                    쓰는 칸 9
                  </text>
                  <text x={BX + 9 * ZOOM_W + (7 * ZOOM_W) / 2} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill={EMPTY}>
                    빈 칸 7 (208 − 201)
                  </text>
                </g>
              )}
            </g>
          )}

          {active === 2 && (
            <g>
              <text x={6} y={14} fontSize={11} fontWeight={700} fill={INK}>
                page 1
              </text>
              <text x={W - 6} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill={SHARED}>
                함께 쓰는 칸 6
              </text>
              <TokenRow y={22} label="요청 1" tokens={REQ_1} page={1} sharedCount={6} />
              <TokenRow y={46} label="요청 2" tokens={REQ_2} page={1} sharedCount={6} />
              <text x={6} y={94} fontSize={11} fontWeight={700} fill={INK}>
                page 4
              </text>
              <text x={W - 6} y={94} textAnchor="end" fontSize={11} fontWeight={700} fill={SHARED}>
                함께 쓰는 칸 4
              </text>
              <TokenRow y={104} label="요청 1" tokens={REQ_1} page={4} sharedCount={4} />
              <TokenRow y={128} label="요청 2" tokens={REQ_2} page={4} sharedCount={4} />
              <text x={TOKENS_X} y={170} fontSize={10} fill={MUTED}>
                굵은 세로선 = page 경계 · 초록 = 함께 쓰는 칸
              </text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
