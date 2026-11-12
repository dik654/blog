import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chunk-attention — C의 20위치를 4씩 나눌 때 조각마다 유효한 (계산 위치, 참고 위치) 쌍.
 * 조각 k(0부터)의 앞 문맥 ℓ=4k → 쌍 = c·ℓ + c(c+1)/2 = 16k + 10 → 10, 26, 42, 58, 74, 합 210 = 20·21/2.
 */
const N = 20;
const C = 4;
const CHUNKS = N / C;
const CELL = 11;
const GX = 66;
const GY = 34;
const pairsOf = (k: number) => C * C * k + (C * (C + 1)) / 2;
const TOTAL = Array.from({ length: CHUNKS }, (_, k) => pairsOf(k)).reduce<number>((sum, v) => sum + v, 0);

type Mode = "full" | "rectOnly";
interface Scene {
  label: string;
  summary: string;
  note: string;
  upto: number;
  mode: Mode;
}

const SCENES: readonly Scene[] = [
  {
    label: "첫 조각 · 앞 문맥 0",
    summary: "1+2+3+4 = 10쌍",
    upto: 1,
    mode: "full",
    note: "첫 네 위치는 각각 자기까지의 1·2·3·4위치를 참고합니다. 앞서 처리한 입력이 없어도 조각 안에 삼각형 모양의 쌍 10개가 생깁니다.",
  },
  {
    label: "두 번째 조각 · 앞 문맥 4",
    summary: "16 + 10 = 26쌍",
    upto: 2,
    mode: "full",
    note: "5~8위치는 앞 조각의 네 위치와 짝을 이루는 4×4=16쌍(주황 사각형)에 조각 안의 삼각형 10쌍을 더해 26쌍입니다. 같은 4위치인데 첫 조각보다 쌍이 많습니다.",
  },
  {
    label: "c×앞 문맥만 세면",
    summary: "첫 조각 4×0 = 0쌍?",
    upto: 2,
    mode: "rectOnly",
    note: "조각 안의 삼각형(점선)을 빼고 주황 사각형만 세면 첫 조각은 4×0=0이 되고 두 번째 조각도 16에 그칩니다. 본문이 말하는 잘못된 계산입니다.",
  },
  {
    label: "다섯 조각 전부",
    summary: `10+26+42+58+74 = ${TOTAL}쌍`,
    upto: CHUNKS,
    mode: "full",
    note: "조각마다 주황 사각형이 16쌍씩 커지고 삼각형 10쌍은 그대로입니다. 같은 c=4라도 뒤쪽 조각일수록 쌍이 많으므로 위치 수만 고정해서는 실행마다 같은 계산이 되지 않습니다.",
  },
];

export default function ChunkAttentionPairsViz() {
  return (
    <SceneShell
      eyebrow="Causal attention 쌍"
      title="같은 4위치 조각이라도 뒤쪽일수록 참고할 쌍이 늘어납니다"
      description="가로줄은 이번에 계산하는 C의 위치, 세로줄은 그 위치가 참고하는 위치입니다. 한 칸이 (계산 위치, 참고 위치) 쌍 하나이고, 각 위치는 자기와 그 앞만 참고하므로 대각선 아래만 칸이 있습니다. 파랑 삼각형은 같은 조각 안의 쌍, 주황 사각형은 앞 조각 기록과의 쌍입니다."
      note="17절의 C20을 4씩 나눈 작은 사례입니다. 세 번째 이후 조각의 쌍 수는 본문 식 c·ℓ + c(c+1)/2에 ℓ=8·12·16을 넣은 값입니다."
      ariaLabel="C의 20위치를 4씩 나눌 때 조각마다 늘어나는 attention 쌍"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 272" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={GX} y={GY - 10} fontSize={10.5} fill="#64748b">참고하는 위치 1 → 20</text>
            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: r + 1 }, (_, c) => {
                const k = Math.floor(r / C);
                const inScene = k < scene.upto;
                const isPrev = c < k * C;
                const x = GX + c * CELL;
                const y = GY + r * CELL;
                if (!inScene) {
                  return <rect key={`${r}-${c}`} x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={1.5} fill="#e2e8f0" opacity={0.6} />;
                }
                const current = k === scene.upto - 1 || scene.upto === CHUNKS || scene.mode === "rectOnly";
                if (isPrev) {
                  return <rect key={`${r}-${c}`} x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={1.5} fill="#d97706" opacity={current ? 0.9 : 0.4} />;
                }
                if (scene.mode === "rectOnly") {
                  return <rect key={`${r}-${c}`} x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={1.5} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />;
                }
                return <rect key={`${r}-${c}`} x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={1.5} fill="#2563eb" opacity={current ? 0.9 : 0.4} />;
              }),
            )}
            {Array.from({ length: CHUNKS }, (_, k) => {
              const yMid = GY + (k * C + C / 2) * CELL + 4;
              const shown = k < scene.upto;
              const count = scene.mode === "rectOnly" ? C * C * k : pairsOf(k);
              return (
                <g key={k}>
                  <line x1={GX - 6} x2={GX - 6} y1={GY + k * C * CELL + 1} y2={GY + (k + 1) * C * CELL - 1} stroke={shown ? "#334155" : "#cbd5e1"} strokeWidth={1} />
                  <text x={GX - 10} y={yMid} textAnchor="end" fontSize={10.5} fontWeight={shown ? 700 : 400} fill={shown ? "#334155" : "#94a3b8"}>
                    조각 {k + 1}
                  </text>
                  {shown && (
                    <text x={GX + N * CELL + 10} y={yMid} fontSize={11} fontWeight={700} fill={scene.mode === "rectOnly" ? "#d97706" : "#2563eb"}>
                      {count}쌍
                    </text>
                  )}
                  {shown && scene.mode === "rectOnly" && (
                    <text x={GX + N * CELL + 10} y={yMid + 14} fontSize={10} fill="#64748b">
                      실제 {pairsOf(k)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
