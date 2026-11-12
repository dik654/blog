import SceneShell from "./SceneShell";

/**
 * 본문 대응: #connectors — LLaVA는 visual token을 text token과 이어 붙여 LLM 입력에 넣고,
 * Flamingo는 Perceiver Resampler로 64개로 줄인 뒤 frozen LLM 층 사이의 gated cross-attention이 읽으며,
 * BLIP-2는 Q-Former의 learnable query 32개와 projection을 거쳐 frozen LLM에 연결한다.
 * LLM 층을 세 개만 그린 것은 모양을 보이려는 가정이다.
 */
const LEFT_X = 12;
const LEFT_W = 140;
const STACK_X = 196;
const STACK_W = 150;
const LAYER_Y = [168, 112, 56] as const;
const layerY: readonly number[] = LAYER_Y;
const XATTN_Y = [140, 84] as const;
const xattnY: readonly number[] = XATTN_Y;
const LAYER_H = 22;
const XATTN_H = 18;
const INPUT_Y = 204;
const LEFT_Y = [52, 108, 164] as const;
const leftY: readonly number[] = LEFT_Y;
const ACCENT = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const LEFT_LABELS = [
  ["image", "encoder · 256×1024", "projector W · 256×5120"],
  ["visual feature (개수 미지정)", "Perceiver Resampler", "visual token 64개"],
  ["image encoder (고정)", "Q-Former · query 32개", "projection"],
] as const;

const SCENES = [
  {
    label: "LLaVA",
    summary: "입력 sequence에 이어 붙임",
    note: "visual token 256개를 질문의 text token과 같은 입력 sequence에 이어 붙입니다. LLM 층 사이에는 새 부품을 넣지 않으므로 LLM 구조를 크게 바꾸지 않습니다.",
  },
  {
    label: "Flamingo",
    summary: "층 사이에서 읽음",
    note: "Perceiver Resampler가 visual feature를 64개로 줄입니다. 입력 sequence에는 text만 들어가고, frozen LLM 층 사이에 끼운 gated cross-attention(이미지 쪽 정보를 얼마나 더할지 학습된 gate로 조절하는 attention)이 필요할 때 그 64개를 읽습니다.",
  },
  {
    label: "BLIP-2",
    summary: "query 32개가 병목",
    note: "Q-Former는 learnable query 32개로 frozen image encoder의 많은 feature 가운데 언어 모델에 넘길 정보를 뽑습니다. 그 출력이 projection을 거쳐 frozen LLM에 연결됩니다. 그림의 화살표는 연결 관계만 나타냅니다.",
  },
] as const;

function Box({ x, y, w, h, label, accent, dashed }: { x: number; y: number; w: number; h: number; label: string; accent?: boolean; dashed?: boolean }) {
  const color = accent ? ACCENT : MUTED;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={color} fillOpacity={accent ? 0.14 : 0.08} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function VisualInsertionPointViz() {
  return (
    <SceneShell
      eyebrow="visual 정보가 들어가는 자리"
      title="이어 붙이느냐, 층 사이에서 읽느냐가 다릅니다"
      description="왼쪽은 이미지 쪽 경로, 오른쪽은 아래에서 위로 쌓인 LLM 층입니다. 층을 세 개만 그린 것은 가정입니다."
      ariaLabel="LLaVA, Flamingo, BLIP-2에서 visual 정보가 LLM에 들어가는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const labels = (LEFT_LABELS as readonly (readonly string[])[])[active];
        const frozen = active > 0;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 왼쪽 이미지 경로 */}
            {labels.map((label, i) => (
              <g key={label}>
                <Box x={LEFT_X} y={leftY[i]} w={LEFT_W} h={24} label={label} accent={i > 0} />
                {i < 2 && <line x1={LEFT_X + LEFT_W / 2} x2={LEFT_X + LEFT_W / 2} y1={leftY[i] + 24} y2={leftY[i + 1]} stroke={LINE} strokeWidth={1} />}
              </g>
            ))}

            {/* 오른쪽 LLM 층 */}
            <text x={STACK_X + STACK_W / 2} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>답 token ↑</text>
            <line x1={STACK_X + STACK_W / 2} x2={STACK_X + STACK_W / 2} y1={26} y2={layerY[2]} stroke={LINE} strokeWidth={1} />
            {layerY.map((y, i) => (
              <g key={`layer-${i}`}>
                <Box x={STACK_X} y={y} w={STACK_W} h={LAYER_H} label={`LLM 층${frozen ? " · 고정" : ""}`} />
                {i < 2 && <line x1={STACK_X + 12} x2={STACK_X + 12} y1={y} y2={layerY[i + 1] + LAYER_H} stroke={LINE} strokeWidth={1} />}
              </g>
            ))}
            {active === 1 &&
              xattnY.map((y, i) => (
                <g key={`x-${i}`}>
                  <Box x={STACK_X} y={y} w={STACK_W} h={XATTN_H} label="gated cross-attn" accent />
                  <line x1={LEFT_X + LEFT_W} y1={leftY[2] + 12} x2={STACK_X} y2={y + XATTN_H / 2} stroke={ACCENT} strokeWidth={1} strokeDasharray="3 2" />
                </g>
              ))}

            {/* 입력 sequence */}
            <line x1={STACK_X + STACK_W / 2} x2={STACK_X + STACK_W / 2} y1={INPUT_Y} y2={layerY[0] + LAYER_H} stroke={LINE} strokeWidth={1} />
            {active === 0 ? (
              <>
                <rect x={STACK_X} y={INPUT_Y} width={92} height={22} rx={3} fill={ACCENT} fillOpacity={0.2} stroke={ACCENT} strokeWidth={1} />
                <text x={STACK_X + 46} y={INPUT_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>visual 256</text>
                <rect x={STACK_X + 96} y={INPUT_Y} width={STACK_W - 96} height={22} rx={3} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />
                <text x={STACK_X + 96 + (STACK_W - 96) / 2} y={INPUT_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>text</text>
                <path d={`M${LEFT_X + LEFT_W / 2} ${leftY[2] + 24} V${INPUT_Y + 11} H${STACK_X - 2}`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <path d={`M${STACK_X - 8} ${INPUT_Y + 6} l6 5 l-6 5`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
              </>
            ) : (
              <>
                <rect x={STACK_X} y={INPUT_Y} width={STACK_W} height={22} rx={3} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />
                <text x={STACK_X + STACK_W / 2} y={INPUT_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>{active === 1 ? "text token만" : "text token"}</text>
              </>
            )}
            {active === 2 && (
              <>
                <rect x={STACK_X - 6} y={layerY[2] - 6} width={STACK_W + 12} height={layerY[0] + LAYER_H - layerY[2] + 12} rx={6} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
                <path d={`M${LEFT_X + LEFT_W} ${leftY[2] + 12} H${STACK_X - 8}`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <path d={`M${STACK_X - 14} ${leftY[2] + 7} l6 5 l-6 5`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <text x={STACK_X - 12} y={leftY[2] - 4} textAnchor="end" fontSize={10.5} fill={ACCENT}>frozen LLM에 연결</text>
              </>
            )}
            <text x={LEFT_X} y={232} fontSize={10.5} fill={MUTED}>{active === 0 ? "층 사이 새 부품 없음" : active === 1 ? "점선: cross-attn이 64개를 읽음" : "많은 feature → 32개로 좁힘"}</text>
          </svg>
        );
      }}
    />
  );
}
