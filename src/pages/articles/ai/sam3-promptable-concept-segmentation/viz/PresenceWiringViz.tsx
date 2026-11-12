import SceneShell from "./SceneShell";

/**
 * 본문 대응: PresenceHead.tsx 마지막 두 문단 — 존재 토큰의 배선.
 * 질의 앞에 이어 붙임 → self-attention을 함께 받음 → cross-attention 마스크는 열어 둠(이미지 전체)
 * → 레이어마다 logit 하나를 뽑아 쌓고 깊이마다 같은 감독.
 * 질의 4개, 이미지 칸 4×8, 레이어 수는 그림을 위한 가정입니다.
 */
const SCENES = [
  {
    label: "질의 앞에 이어 붙임",
    summary: "[존재 | 질의 1 … 질의 N]",
    note: "존재 토큰은 크기 1짜리 임베딩 하나에서 시작합니다. 디코더 레이어마다 이 토큰을 질의들 맨 앞에 이어 붙여 한 줄로 만듭니다. 질의 수는 그림에서 넷으로 줄였습니다(가정).",
  },
  {
    label: "self-attention은 함께",
    summary: "같은 줄의 토큰끼리 참조",
    note: "self-attention은 같은 줄에 놓인 토큰들이 서로를 참조하는 계산입니다. 존재 토큰도 질의들과 함께 이 계산을 받습니다.",
  },
  {
    label: "cross-attention은 전체를",
    summary: "존재 토큰 자리는 마스크를 엶",
    note: "cross-attention은 토큰이 이미지 특징을 참조하는 계산이고, 마스크는 토큰마다 볼 수 있는 자리를 정합니다. 존재 토큰 자리는 마스크를 열어 두어 특정 영역에 묶이지 않고 이미지 전체를 봅니다.",
  },
  {
    label: "레이어마다 logit 하나",
    summary: "깊이마다 같은 감독",
    note: "레이어마다 존재 토큰에서 logit을 하나씩 뽑아 쌓고, 수치가 튀지 않도록 범위를 제한합니다. 깊이마다 같은 감독을 받으므로 마지막 레이어에만 의존하지 않는 구조입니다.",
  },
] as const;

const P = "#059669";
const Q = "#4f46e5";
const INK = "#475569";
const GRAY = "#94a3b8";

const TOKEN_Y = 34;
const TOKEN_H = 26;
const TOKENS = [
  { label: "존재", x: 40, w: 56, color: P },
  { label: "질의 1", x: 112, w: 52, color: Q },
  { label: "질의 2", x: 172, w: 52, color: Q },
  { label: "질의 3", x: 232, w: 52, color: Q },
  { label: "질의 4", x: 292, w: 52, color: Q },
] as const;

const GRID_X = 96;
const GRID_Y = 112;
const GRID_COLS = 8;
const GRID_ROWS = 4;
const G = 20;

const LAYERS = ["레이어 1", "레이어 2", "…", "마지막"] as const;

export default function PresenceWiringViz() {
  return (
    <SceneShell
      eyebrow="존재 토큰의 배선"
      title="존재 토큰은 질의와 함께 섞이되 이미지는 전체를 봅니다"
      description="초록 칸이 존재 토큰, 보라 칸이 객체 질의입니다. 앞의 세 장면은 디코더 레이어 하나 안의 일이고, 마지막 장면은 레이어 전체를 이어 봅니다."
      note="질의 수, 이미지 칸 수, 레이어 수는 구조를 보이기 위한 가정이며 실제 설정값이 아닙니다."
      ariaLabel="존재 토큰이 질의 앞에 붙고, self-attention과 cross-attention을 받으며, 레이어마다 logit을 내는 과정"
      scenes={SCENES}
      render={(active) => {
        const presence = TOKENS[0];
        const pcx = presence.x + presence.w / 2;
        return (
          <svg
            viewBox="0 0 400 210"
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={40} y={22} fontSize={13} fill={INK}>디코더 레이어에 들어가는 토큰 한 줄</text>
            {TOKENS.map((token, i) => (
              <g key={token.label}>
                <rect
                  x={token.x}
                  y={TOKEN_Y}
                  width={token.w}
                  height={TOKEN_H}
                  rx={6}
                  fill={token.color}
                  fillOpacity={i === 0 && active === 0 ? 0.3 : 0.14}
                  stroke={token.color}
                  strokeWidth={i === 0 ? 1.25 : 1}
                />
                <text x={token.x + token.w / 2} y={TOKEN_Y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={token.color}>
                  {token.label}
                </text>
              </g>
            ))}
            <text x={352} y={TOKEN_Y + 17} fontSize={13} fill={INK}>…</text>

            {active === 0 && (
              <g>
                <line x1={104} x2={104} y1={TOKEN_Y - 4} y2={TOKEN_Y + TOKEN_H + 4} stroke={P} strokeWidth={1} strokeDasharray="3 2" />
                <text x={pcx} y={TOKEN_Y + TOKEN_H + 22} textAnchor="middle" fontSize={13} fill={P}>맨 앞에 붙임</text>
                <text x={228} y={TOKEN_Y + TOKEN_H + 22} textAnchor="middle" fontSize={13} fill={Q}>원래 질의 줄</text>
              </g>
            )}

            {active === 1 && (
              <g>
                {TOKENS.slice(1).map((token) => {
                  const cx = token.x + token.w / 2;
                  const mid = (pcx + cx) / 2;
                  const depth = 22 + (cx - pcx) * 0.12;
                  return (
                    <path
                      key={token.label}
                      d={`M ${pcx} ${TOKEN_Y + TOKEN_H} Q ${mid} ${TOKEN_Y + TOKEN_H + depth * 2} ${cx} ${TOKEN_Y + TOKEN_H}`}
                      fill="none"
                      stroke={P}
                      strokeWidth={1}
                    />
                  );
                })}
                <text x={200} y={164} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>
                  존재 토큰도 질의들과 같은 self-attention을 받음
                </text>
              </g>
            )}

            {active === 2 && (
              <g>
                <text x={GRID_X} y={GRID_Y - 8} fontSize={13} fill={INK}>이미지 특징 칸</text>
                {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
                  <rect
                    key={i}
                    x={GRID_X + (i % GRID_COLS) * G}
                    y={GRID_Y + Math.floor(i / GRID_COLS) * G}
                    width={G - 2}
                    height={G - 2}
                    rx={2}
                    fill={P}
                    fillOpacity={0.22}
                    stroke={P}
                    strokeWidth={1}
                  />
                ))}
                <line x1={pcx} x2={pcx} y1={TOKEN_Y + TOKEN_H} y2={GRID_Y + 2 * G} stroke={P} strokeWidth={1} />
                <line x1={pcx} x2={GRID_X - 2} y1={GRID_Y + 2 * G} y2={GRID_Y + 2 * G} stroke={P} strokeWidth={1} />
                <text x={GRID_X + GRID_COLS * G + 8} y={GRID_Y + 22} fontSize={13} fontWeight={700} fill={P}>존재 토큰:</text>
                <text x={GRID_X + GRID_COLS * G + 8} y={GRID_Y + 36} fontSize={13} fontWeight={700} fill={P}>모든 칸을 봄</text>
              </g>
            )}

            {active === 3 && (
              <g>
                {LAYERS.map((layer, i) => {
                  const x = 40 + i * 80;
                  return (
                    <g key={layer}>
                      <rect x={x} y={104} width={64} height={24} rx={6} fill="none" stroke={GRAY} strokeWidth={1} />
                      <text x={x + 32} y={120} textAnchor="middle" fontSize={13} fill={INK}>{layer}</text>
                      {layer !== "…" && (
                        <>
                          <line x1={x + 32} x2={x + 32} y1={128} y2={146} stroke={P} strokeWidth={1} />
                          <rect x={x + 8} y={146} width={48} height={20} rx={4} fill={P} fillOpacity={0.14} stroke={P} strokeWidth={1} />
                          <text x={x + 32} y={160} textAnchor="middle" fontSize={13} fontWeight={700} fill={P}>logit</text>
                          <text x={x + 32} y={182} textAnchor="middle" fontSize={13} fill={INK}>같은 감독</text>
                        </>
                      )}
                    </g>
                  );
                })}
                <line x1={pcx} x2={pcx} y1={TOKEN_Y + TOKEN_H} y2={104} stroke={P} strokeWidth={1} strokeDasharray="3 2" />
                <text x={200} y={202} textAnchor="middle" fontSize={13} fill={INK}>레이어마다 하나씩 쌓음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
