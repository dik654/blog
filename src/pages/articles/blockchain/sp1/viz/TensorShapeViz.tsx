import Sp1SceneShell from "./Sp1SceneShell";

/**
 * 본문 대응: #release-gate — proof tensor의 선언 shape 2×2(4칸)와 실제 storage 길이 3·4·5를 나란히 놓습니다.
 * 행 우선으로 펼친 순서는 그림을 위한 가정입니다. v6.10.0에서는 길이가 다르면
 * Deserialize/error 또는 view panic으로 거절합니다(본문 표·로컬 테스트).
 */
const DECLARED: readonly string[] = ["[0,0]", "[0,1]", "[1,0]", "[1,1]"];

const SCENES = [
  { label: "길이가 맞음", summary: "선언 4칸 = storage 4개", storage: 4, note: "선언한 2×2는 원소 4개를 뜻합니다. 실제 storage에도 4개가 있으면 칸마다 원소가 하나씩 대응합니다." },
  { label: "storage 3개", summary: "선언 4칸 > storage 3개 → 거절", storage: 3, note: "선언은 4칸인데 실제 원소는 3개라 한 칸에 대응할 원소가 없습니다. 패치된 v6.10.0은 이런 proof를 Deserialize 오류 또는 view panic으로 거절합니다." },
  { label: "storage 5개", summary: "선언 4칸 < storage 5개 → 거절", storage: 5, note: "원소가 하나 남습니다. 로컬 테스트에서는 JSON·bincode 모두에서 짧거나 긴 네 사례를 거절했습니다." },
] as const;

const SLOT_W = 56;
const STEP = 66;
const X0 = 16;
const TOP_Y = 34;
const BOT_Y = 112;
const CELL_H = 38;
const OK = "#0f766e";
const BAD = "#dc2626";
const LINE = "#94a3b8";
const TEXT = "#334155";
const MUTED = "#64748b";
const ACCENT = "#2563eb";

export default function TensorShapeViz() {
  return (
    <Sp1SceneShell
      eyebrow="tensor shape 검사"
      title="선언한 칸 수와 실제 원소 수가 다르면 패치된 verifier는 거절합니다"
      description="위 줄은 proof가 선언한 2×2 tensor를 펼친 4칸(행 우선 순서, 가정), 아래 줄은 실제 storage에 담긴 원소입니다. 공식 advisory에 따르면 v6.0.0–v6.8.0의 native Rust verifier가 신뢰하지 않는 prover에게서 Core·Compressed proof를 직접 받는 경로에서는 이 둘이 달라도 일부 검증 단계가 서로 다른 원소를 읽을 수 있었고, v6.8.1에서 수정됐습니다."
      ariaLabel="선언 shape 2x2와 storage 길이 3, 4, 5 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ok = scene.storage === 4;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={22} fontSize={12} fontWeight={700} fill={MUTED}>선언 shape 2×2 → 4칸</text>
            <text x={X0} y={BOT_Y + CELL_H + 18} fontSize={12} fontWeight={700} fill={MUTED}>{`실제 storage → ${scene.storage}개`}</text>
            {[0, 1, 2, 3, 4].map((slot) => {
              const x = X0 + slot * STEP;
              const declared = slot < 4;
              const stored = slot < scene.storage;
              const missing = declared && !stored;
              const extra = stored && !declared;
              return (
                <g key={slot}>
                  {declared && (
                    <g>
                      <rect x={x} y={TOP_Y} width={SLOT_W} height={CELL_H} rx={6} fill="#ffffff" stroke={missing ? BAD : ACCENT} strokeWidth={1} />
                      <text x={x + SLOT_W / 2} y={TOP_Y + 24} textAnchor="middle" fontSize={12} fill={TEXT}>{DECLARED[slot]}</text>
                    </g>
                  )}
                  {declared && stored && <line x1={x + SLOT_W / 2} x2={x + SLOT_W / 2} y1={TOP_Y + CELL_H} y2={BOT_Y} stroke={LINE} strokeWidth={1} />}
                  {stored ? (
                    <g>
                      <rect x={x} y={BOT_Y} width={SLOT_W} height={CELL_H} rx={6} fill={extra ? "#fef2f2" : "#eff6ff"} stroke={extra ? BAD : ACCENT} strokeWidth={1} />
                      <text x={x + SLOT_W / 2} y={BOT_Y + 24} textAnchor="middle" fontSize={12} fill={TEXT}>{`원소 ${slot}`}</text>
                    </g>
                  ) : (
                    missing && (
                      <g>
                        <rect x={x} y={BOT_Y} width={SLOT_W} height={CELL_H} rx={6} fill="none" stroke={BAD} strokeWidth={1} strokeDasharray="3 3" />
                        <text x={x + SLOT_W / 2} y={BOT_Y + 24} textAnchor="middle" fontSize={12} fill={BAD}>없음</text>
                      </g>
                    )
                  )}
                  {extra && <text x={x + SLOT_W / 2} y={BOT_Y + CELL_H + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={BAD}>남음</text>}
                </g>
              );
            })}
            <text x={180} y={190} textAnchor="middle" fontSize={12} fontWeight={700} fill={ok ? OK : BAD}>
              {ok ? "길이 일치 · 칸마다 원소 하나" : "v6.10.0: Deserialize 오류 또는 view panic으로 거절"}
            </text>
          </svg>
        );
      }}
    />
  );
}
