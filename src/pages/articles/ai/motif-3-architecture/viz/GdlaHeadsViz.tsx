import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gdla — 80 query heads = signal 64 + noise 16, g = 4.
 * 두 query path가 같은 16 KV heads를 읽고, noise output을 Repeat₄로 signal shape에 맞춘 뒤
 * signal head마다 token별 λ(0–1)를 곱해 뺀다. 묶음 대응 순서와 λ 값은 설명용 가정입니다.
 */
const GROUPS = 16;
const G = 4;
const X0 = 30;
const COL_W = 20;
const CELL = 16;
const S_TOP = 26;
const ROW_H = 14;
const N_Y = S_TOP + G * ROW_H + 12;
const KV_Y = 150;
const W = 360;
const H = 214;
const LAMBDAS: readonly number[] = [0.2, 0.5, 0.8, 0.3];

const SCENES = [
  { label: "80개를 둘로 나눔", summary: "signal 64 + noise 16 = 80", note: "Query head 80개 가운데 64개가 signal, 16개가 noise입니다. 64 ÷ 16 = 4이므로 한 열이 signal 4개와 noise 1개로 된 묶음이고, 이 4가 g입니다." },
  { label: "같은 KV를 읽음", summary: "KV heads 16개를 두 경로가 공유", note: "Signal과 noise 두 query 경로가 같은 압축 latent에서 펼친 16개 KV head를 읽습니다. Noise 경로를 위한 KV cache를 따로 만들지 않습니다." },
  { label: "Repeat₄로 모양 맞춤", summary: "noise 16 → 4번 반복 → 64칸", note: "Noise output 하나를 같은 묶음의 signal head 4개에 대응시키면 16개가 64칸을 채워 signal output과 모양이 같아집니다. 그림의 묶음 대응 순서는 설명용입니다." },
  { label: "λ만큼 뺌", summary: "Dᵢ = Sᵢ − λᵢ × N", note: "한 묶음을 확대했습니다. 같은 noise output N을 빼되 signal head마다 현재 token에서 0과 1 사이의 λ를 따로 계산해 곱합니다. λ 값은 설명용 가정입니다." },
] as const;

export default function GdlaHeadsViz() {
  return (
    <SceneShell
      eyebrow="GDLA의 head 배치"
      title="noise head 16개를 네 번씩 써서 signal head 64개와 맞춥니다"
      description="파란 칸은 signal query head, 주황 칸은 noise query head입니다. 한 열이 signal 4개와 noise 1개로 된 묶음입니다."
      ariaLabel="signal head 64개, noise head 16개, 공유 KV head 16개와 Repeat 4, λ 차분"
      scenes={SCENES}
      render={(active) => {
        const focusGroup = active === 3 ? 0 : -1;
        const dim = (group: number) => (focusGroup >= 0 && group !== focusGroup ? 0.2 : 1);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={S_TOP + 2 * ROW_H} fontSize={11} fontWeight={700} fill="#2563eb">S</text>
            <text x={4} y={N_Y + 11} fontSize={11} fontWeight={700} fill="#b45309">N</text>
            <text x={X0} y={14} fontSize={11} fill="#64748b">signal 64 = 16묶음 × 4</text>
            <text x={W - 6} y={14} textAnchor="end" fontSize={11} fill="#64748b">noise 16</text>
            {Array.from({ length: GROUPS }, (_, group) => {
              const x = X0 + group * COL_W;
              return (
                <g key={group} opacity={dim(group)}>
                  {Array.from({ length: G }, (_, row) => (
                    <rect key={row} x={x} y={S_TOP + row * ROW_H} width={CELL} height={ROW_H - 3} rx={2} fill="#2563eb" opacity={0.75} />
                  ))}
                  <rect x={x} y={N_Y} width={CELL} height={ROW_H - 3} rx={2} fill="#d97706" opacity={0.8} />
                  {active === 2 &&
                    Array.from({ length: G }, (_, row) => (
                      <line key={row} x1={x + CELL / 2} x2={x + 2 + row * 4} y1={N_Y} y2={S_TOP + row * ROW_H + ROW_H - 3} stroke="#b45309" strokeWidth={1} opacity={0.8} />
                    ))}
                </g>
              );
            })}
            {active === 3 && <rect x={X0 - 3} y={S_TOP - 3} width={CELL + 6} height={N_Y + ROW_H - S_TOP + 3} rx={3} fill="none" stroke="#0f172a" strokeWidth={1} />}

            {active < 3 && (
              <g>
                {active === 1 && (
                  <g>
                    <line x1={110} x2={150} y1={N_Y + ROW_H} y2={KV_Y} stroke="#b45309" strokeWidth={1} />
                    <polyline points={`346,${S_TOP + 2 * ROW_H} 352,${S_TOP + 2 * ROW_H} 352,${KV_Y + 15} 346,${KV_Y + 15}`} fill="none" stroke="#2563eb" strokeWidth={1} />
                    <text x={96} y={N_Y + ROW_H + 26} textAnchor="end" fontSize={11} fill="#b45309">noise 경로</text>
                    <text x={346} y={N_Y + ROW_H + 26} textAnchor="end" fontSize={11} fill="#2563eb">signal 경로</text>
                  </g>
                )}
                <rect x={X0} y={KV_Y} width={GROUPS * COL_W - (COL_W - CELL)} height={30} rx={4} fill={active === 1 ? "#e2e8f0" : "none"} stroke="#64748b" strokeWidth={1} />
                <text x={W / 2} y={KV_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">KV heads 16개 · 압축 latent에서 한 번 펼침</text>
                <text x={W / 2} y={KV_Y + 48} textAnchor="middle" fontSize={11} fill="#64748b">
                  {active === 2 ? "선 4개 = noise 하나가 대응하는 signal 4개" : "두 경로 모두 이 K·V를 읽음"}
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                {LAMBDAS.map((lambda, index) => (
                  <text key={index} x={index % 2 === 0 ? 64 : 200} y={KV_Y - 4 + Math.floor(index / 2) * 24} fontSize={12} fill="#0f172a">
                    <tspan fill="#334155">D{index + 1} = </tspan>
                    <tspan fill="#2563eb" fontWeight={700}>S{index + 1}</tspan>
                    <tspan> − </tspan>
                    <tspan fontWeight={700}>{lambda.toFixed(1)}</tspan>
                    <tspan> × </tspan>
                    <tspan fill="#b45309" fontWeight={700}>N</tspan>
                  </text>
                ))}
                <text x={W / 2} y={KV_Y + 48} textAnchor="middle" fontSize={11} fill="#64748b">λ는 0~1 · signal head마다 token별로 계산(값은 가정)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
