import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — NSA 의 세 branch. 압축(block 32, stride 16), 선택(크기 64 block 16 개),
 * 최근 512 token window. 그림 sequence 길이 n=4,096 과 query 위치, 고른 block 위치는 모두 가정.
 * 압축 요약 수 = (길이 − 32)/16 + 1 → 4,096: 255 · 2,560: 159. 선택 16 × 64 = 1,024 token.
 */
const SEQ = 4096;
const BLOCK = 64;
const BLOCKS = SEQ / BLOCK;
const WINDOW = 512;
const PICK_A = [0, 2, 5, 9, 10, 14, 21, 22, 27, 30, 33, 38, 41, 47, 50, 53] as const;
const PICK_B = [0, 1, 4, 6, 8, 11, 13, 15, 17, 18, 20, 23, 25, 26, 29, 31] as const;
const summaries = (length: number) => (length - 32) / 16 + 1;

const SCENES = [
  { label: "① 압축 branch", summary: `block 32 · stride 16 → 요약 ${summaries(SEQ)}개`, query: SEQ, focus: 0, note: "길이 32 token 짜리 block 을 16 칸씩 밀며 겹치게 묶고, block 하나를 요약 하나로 줄입니다. Query 는 sequence 전체를 이 거친 요약으로 훑습니다." },
  { label: "② 선택 branch", summary: "64-token block 중 16개 = 1,024 token", query: SEQ, focus: 1, note: "압축 단계의 attention score 로 64-token block 마다 중요도를 매기고 상위 16 개 block 안의 token 을 봅니다. 어느 block 이 뽑히는지는 그림용 가정입니다." },
  { label: "③ Window branch", summary: `최근 ${WINDOW} token`, query: SEQ, focus: 2, note: "세 번째 branch 는 앞 절들의 sliding window 와 같은 모양으로, query 직전 512 token 을 그대로 봅니다." },
  { label: "④ 다른 query", summary: `query 위치 2,560(가정) · 요약 ${summaries(2560)}개`, query: 2560, focus: 1, note: "Query 가 바뀌면 선택 branch 가 고르는 block 도 다시 정해지고 window 도 query 를 따라 옮겨 갑니다. 고정 패턴과 달리 mask 모양이 query 마다 다릅니다." },
] as const;

const VW = 360;
const LEFT = 58;
const RIGHT = 344;
const xOf = (pos: number) => LEFT + (pos / SEQ) * (RIGHT - LEFT);
const ROW = [62, 104, 146] as const;
const ROW_H = 18;
const VH = 196;
const BRANCH = ["압축", "선택", "window"] as const;
const ZOOM_BLOCKS = [0, 1, 2, 3, 4, 5, 6] as const;
const ZOOM_X = 148;
const ZOOM_SCALE = 1.4;

export default function NsaBranchesViz() {
  return (
    <SceneShell
      eyebrow="Native Sparse Attention · 세 branch"
      title="NSA 는 같은 query 로 세 가지 다른 굵기의 범위를 함께 봅니다"
      description="가로축은 sequence 위치이고 오른쪽 ▼ 가 query 입니다. 그림의 sequence 는 4,096 token 으로 잡았습니다(가정). 회색 점선 영역은 query 뒤의 아직 오지 않은 위치입니다."
      ariaLabel="NSA 의 압축, 선택, window branch 가 sequence 의 어느 부분을 보는지와 query 마다 선택이 달라지는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const q = scene.query;
        const picks: readonly number[] = q === SEQ ? PICK_A : PICK_B;
        const dim = (branch: number) => (scene.focus === branch || active === 3 ? 1 : 0.35);
        return (
          <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <g opacity={active === 0 ? 1 : 0}>
              <text x={LEFT} y={14} fontSize={11} fill="#64748b">앞 128 token 확대</text>
              {ZOOM_BLOCKS.map((block) => {
                const start = block * 16;
                const lane = block % 2;
                return (
                  <g key={block}>
                    <rect x={ZOOM_X + start * ZOOM_SCALE} y={6 + lane * 12} width={32 * ZOOM_SCALE - 1} height={9} rx={2} fill="#7c3aed" fillOpacity={0.2} stroke="#7c3aed" strokeWidth={1} />
                  </g>
                );
              })}
              <text x={ZOOM_X} y={42} fontSize={10} fill="#6d28d9">32 token block 이 16 칸씩 겹쳐 이어짐</text>
            </g>
            <text x={xOf(q)} y={ROW[0] - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">▼</text>
            {ROW.map((y, branch) => (
              <g key={BRANCH[branch]} opacity={dim(branch)}>
                <text x={LEFT - 6} y={y + 13} textAnchor="end" fontSize={11} fontWeight={scene.focus === branch ? 700 : 400} fill="#334155">
                  {BRANCH[branch]}
                </text>
                <rect x={LEFT} y={y} width={RIGHT - LEFT} height={ROW_H} fill="none" stroke="#cbd5e1" strokeWidth={1} />
                {q < SEQ && <rect x={xOf(q)} y={y} width={RIGHT - xOf(q)} height={ROW_H} fill="#94a3b8" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
              </g>
            ))}
            <g opacity={dim(0)}>
              <rect x={LEFT} y={ROW[0]} width={xOf(q) - LEFT} height={ROW_H} fill="#7c3aed" fillOpacity={0.18} stroke="#7c3aed" strokeWidth={1} />
            </g>
            <g opacity={dim(1)}>
              {Array.from({ length: BLOCKS }, (_, block) => {
                const available = (block + 1) * BLOCK <= q;
                const picked = picks.includes(block);
                return (
                  <rect
                    key={block}
                    x={xOf(block * BLOCK) + 0.4}
                    y={ROW[1] + 1}
                    width={xOf(BLOCK) - LEFT - 0.8}
                    height={ROW_H - 2}
                    fill={picked ? "#2563eb" : "none"}
                    fillOpacity={picked ? 0.7 : 0}
                    stroke={available ? "#cbd5e1" : "none"}
                    strokeWidth={0.5}
                  />
                );
              })}
            </g>
            <g opacity={dim(2)}>
              <rect x={xOf(q - WINDOW)} y={ROW[2]} width={xOf(q) - xOf(q - WINDOW)} height={ROW_H} fill="#16a34a" fillOpacity={0.45} stroke="#16a34a" strokeWidth={1} />
            </g>
            <text x={LEFT} y={VH - 10} fontSize={11} fill="#64748b">위치 0</text>
            <text x={RIGHT} y={VH - 10} textAnchor="end" fontSize={11} fill="#64748b">4,096</text>
            <text x={(LEFT + RIGHT) / 2} y={VH - 10} textAnchor="middle" fontSize={11} fill="#64748b">선택 칸 1개 = 64 token</text>
          </svg>
        );
      }}
    />
  );
}
