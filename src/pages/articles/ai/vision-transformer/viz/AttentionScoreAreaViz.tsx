import SceneShell from "./SceneShell";

/**
 * 본문 대응: #architecture — Swin window attention(N·M²)과 MAE visible-only encoder(v²)가 줄이는 score 수.
 * 예시는 이 글의 14×14 = 196 token 격자를 쓰고 window 한 변 M=7, MAE 가림 위치는 가정이다.
 * Global 196² = 38,416 · window 196/49 = 4개 × 49² = 9,604 = 196×49 · MAE ρ=.75 → 49개, 49² = 2,401 = 38,416/16.
 */
const N_SIDE = 14;
const N = N_SIDE * N_SIDE;
const M = 7;
const WINDOWS = N / (M * M);
const SHIFT = 3;
const VISIBLE = N / 4;

const GX = 16;
const GY = 34;
const GS = 140;
const CELL = GS / N_SIDE;
const MX = 204;
const MS = 140;

const ACCENT = "#2563eb";
const SECOND = "#059669";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const FOCUS = "#d97706";

const fmt = (value: number) => value.toLocaleString("en-US");

const VISIBLE_SET = new Set(Array.from({ length: N }, (_, i) => i).filter((i) => (i * 37 + 11) % N < VISIBLE));

const SCENES = [
  {
    label: "Global: 모든 token 쌍",
    summary: `196² = ${fmt(N * N)}`,
    note: "주황 token 하나가 196개 전부와 score를 계산합니다. 오른쪽 score 행렬은 가로·세로가 token 196개라, 칸이 다 차면 N²입니다.",
  },
  {
    label: "Window: 같은 칸 안끼리만",
    summary: `${WINDOWS} × 49² = ${fmt(WINDOWS * 49 * 49)}`,
    note: "Window 한 변을 M=7 token(가정)으로 두면 window 하나에 7×7 = 49개, 196 ÷ 49 = 4개입니다. Token을 window별로 정렬하면 score는 대각선 블록 4개, 196 × 49 = 9,604로 global의 1/4입니다. Projection·MLP는 뺀 값입니다.",
  },
  {
    label: "다음 block: 경계를 옮깁니다",
    summary: "이전 경계를 넘는 경로",
    note: "다음 block은 경계를 옮겨(3칸, 가정) 이전 경계 양쪽 token을 한 window에 넣습니다. 한 block만으로 모든 token이 직접 연결되지는 않고 여러 block을 거치며 정보가 퍼집니다.",
  },
  {
    label: "MAE: 보이는 patch만 encoder로",
    summary: `49² = ${fmt(VISIBLE * VISIBLE)} = 1/16`,
    note: "75%를 가리면 encoder에는 49개만 들어갑니다(가린 자리는 가정). Score는 49² = 2,401로 global의 (0.25)² = 1/16입니다. Decoder·MLP를 뺀 근사라 wall-time speedup과 같지 않습니다.",
  },
] as const;

function windowOf(r: number, s: number, shift: number) {
  return `${Math.floor((r + shift) / M)}-${Math.floor((s + shift) / M)}`;
}

function TokenGrid({ active }: { active: number }) {
  const fr = active === 2 ? 6 : 5;
  const fs = active === 2 ? 6 : 5;
  const shift = active === 2 ? M - SHIFT : 0;
  const focusWindow = windowOf(fr, fs, shift);
  const title = ["token 196개", "window 4개 (M=7, 가정)", "경계를 3칸 옮긴 window", "보이는 patch 49개"][active];
  return (
    <g>
      <text x={GX} y={24} fontSize={11} fontWeight={700} fill={TEXT}>{title}</text>
      {Array.from({ length: N }, (_, i) => {
        const r = Math.floor(i / N_SIDE);
        const s = i % N_SIDE;
        const isFocus = active !== 3 && r === fr && s === fs;
        const inFocusWindow = (active === 1 || active === 2) && windowOf(r, s, shift) === focusWindow;
        const [fill, opacity]: [string, number] =
          active === 0
            ? [ACCENT, 0.3]
            : inFocusWindow
              ? [ACCENT, 0.35]
              : active === 3 && VISIBLE_SET.has(i)
                ? [SECOND, 0.55]
                : [MUTED, 0.12];
        return (
          <rect
            key={i}
            x={GX + s * CELL}
            y={GY + r * CELL}
            width={CELL}
            height={CELL}
            fill={isFocus ? FOCUS : fill}
            fillOpacity={isFocus ? 0.9 : opacity}
            stroke="#cbd5e1"
            strokeWidth={0.5}
          />
        );
      })}
      {(active === 1 || active === 2) && (
        <g>
          {(active === 1 ? [M] : [SHIFT, SHIFT + M]).map((k) => (
            <g key={k}>
              <line x1={GX + k * CELL} x2={GX + k * CELL} y1={GY} y2={GY + GS} stroke={TEXT} strokeWidth={1.25} />
              <line x1={GX} x2={GX + GS} y1={GY + k * CELL} y2={GY + k * CELL} stroke={TEXT} strokeWidth={1.25} />
            </g>
          ))}
          {active === 2 && (
            <g>
              <line x1={GX + M * CELL} x2={GX + M * CELL} y1={GY} y2={GY + GS} stroke={FOCUS} strokeWidth={1} strokeDasharray="3 2" />
              <line x1={GX} x2={GX + GS} y1={GY + M * CELL} y2={GY + M * CELL} stroke={FOCUS} strokeWidth={1} strokeDasharray="3 2" />
            </g>
          )}
        </g>
      )}
      <rect x={GX} y={GY} width={GS} height={GS} fill="none" stroke={TEXT} strokeWidth={1} />
      <text x={GX} y={GY + GS + 16} fontSize={10} fill={active === 2 ? FOCUS : TEXT}>
        {active === 2 ? "점선 = 이전 block의 경계" : active === 3 ? "회색 = 가린 patch 147개" : "주황 = 기준 token"}
      </text>
    </g>
  );
}

function ScoreMatrix({ active }: { active: number }) {
  const block = MS / WINDOWS;
  const vis = MS / 4;
  return (
    <g>
      <text x={MX} y={24} fontSize={11} fontWeight={700} fill={TEXT}>score 행렬 196 × 196</text>
      <rect x={MX} y={GY} width={MS} height={MS} fill={MUTED} fillOpacity={0.08} stroke={TEXT} strokeWidth={1} />
      {active === 0 && <rect x={MX} y={GY} width={MS} height={MS} fill={ACCENT} fillOpacity={0.35} />}
      {active === 1 &&
        Array.from({ length: WINDOWS }, (_, k) => (
          <rect key={k} x={MX + k * block} y={GY + k * block} width={block} height={block} fill={ACCENT} fillOpacity={0.45} stroke={ACCENT} strokeWidth={1} />
        ))}
      {active === 2 && (
        <g>
          <text x={MX + MS / 2} y={GY + MS / 2 - 4} textAnchor="middle" fontSize={10} fill={TEXT}>
            한 block 안에서는
          </text>
          <text x={MX + MS / 2} y={GY + MS / 2 + 12} textAnchor="middle" fontSize={10} fill={TEXT}>
            여전히 window 안끼리만
          </text>
        </g>
      )}
      {active === 3 && <rect x={MX} y={GY} width={vis} height={vis} fill={SECOND} fillOpacity={0.55} stroke={SECOND} strokeWidth={1} />}
      <text x={MX} y={GY + MS + 16} fontSize={10} fontWeight={700} fill={active === 3 ? SECOND : ACCENT}>
        {active === 0 && `${fmt(N * N)}칸 전부`}
        {active === 1 && `블록 4개 = ${fmt(WINDOWS * 49 * 49)}칸 (1/4)`}
        {active === 3 && `49 × 49 = ${fmt(VISIBLE * VISIBLE)}칸 (1/16)`}
      </text>
    </g>
  );
}

export default function AttentionScoreAreaViz() {
  return (
    <SceneShell
      eyebrow="Score 수 세기"
      title="Window와 masking이 지우는 score 행렬의 면적"
      description="왼쪽은 이 글의 14×14 patch token 격자, 오른쪽은 token끼리 계산하는 attention score 행렬입니다. 칠해진 면적이 실제로 계산하는 score 수입니다."
      ariaLabel="Global attention, window attention, shifted window, MAE visible token의 score 수 비교"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox="0 0 360 200"
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <TokenGrid active={active} />
          <ScoreMatrix active={active} />
        </svg>
      )}
    />
  );
}
