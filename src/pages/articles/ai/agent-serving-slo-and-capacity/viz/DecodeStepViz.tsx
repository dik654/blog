import SceneShell from "./SceneShell";

/**
 * 본문 대응: small-case 절 — 한 걸음에 여러 요청의 다음 토큰을 함께 계산하면 합계는 늘고 몫은 줄어든다.
 * 걸음 길이는 표의 합계에서 거꾸로 구한 어림: C ÷ 합계. 1개 11.53ms, 8개 28.70ms, 64개 86.25ms.
 * 약 173ms 동안: 15걸음(173.0ms), 6걸음(172.2ms), 2걸음(172.5ms).
 */
const CASES = [
  { c: 1, agg: 86.7, steps: 15, cols: 1 },
  { c: 8, agg: 278.7, steps: 6, cols: 4 },
  { c: 64, agg: 742.0, steps: 2, cols: 8 },
] as const;

const SCENES = [
  { label: "동시 1개", summary: "한 걸음 약 11.5 ms", note: "걸음마다 토큰 하나를 내 요청이 모두 받습니다. 약 173 ms에 15걸음이니 합계도 내 몫도 15토큰입니다." },
  { label: "동시 8개", summary: "한 걸음 약 28.7 ms", note: "한 걸음에 8개 요청의 다음 토큰을 함께 계산합니다. 같은 시간에 서버 전체는 48토큰으로 늘지만 걸음이 길어져 내 요청은 6토큰만 받습니다." },
  { label: "동시 64개", summary: "한 걸음 약 86.3 ms", note: "한 걸음에 64토큰이 나오므로 서버 전체는 128토큰입니다. 내 요청은 같은 시간에 2토큰을 받습니다." },
] as const;

const W = 360;
const LEFT = 8;
const RAIL = W - 2 * LEFT;
const TOP = 22;
const BLOCK_H = 74;
const CELL = 7;
const WINDOW_MS = 173;

export default function DecodeStepViz() {
  return (
    <SceneShell
      eyebrow="왜 몫이 줄어드나"
      title="한 걸음에 함께 계산하면 서버 합계는 늘고 걸음은 길어집니다"
      description="큰 칸 하나가 한 걸음, 곧 답을 만드는 요청들의 다음 토큰을 한 번 계산하는 시간입니다. 작은 칸 하나가 토큰 하나이고 파란 칸이 내 요청의 토큰입니다. 걸음 길이는 앞서 본 측정표의 합계에서 거꾸로 구한 어림입니다."
      note="가정: 한 걸음에 요청마다 토큰 하나를 만든다고 두었습니다. 이 표는 다음 토큰을 미리 추측하는 설정을 켠 값이라 실제 걸음과 다를 수 있습니다."
      ariaLabel="동시 요청 1, 8, 64개에서 같은 약 173밀리초 동안 나오는 토큰 수"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const stepW = RAIL / (WINDOW_MS / ((item.c / item.agg) * 1000));
        const rows = Math.ceil(item.c / item.cols);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 122`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={LEFT} y={14} fontSize={11} fill="#64748b">시간 →</text>
              {Array.from({ length: item.steps }, (_, step) => {
                const x = LEFT + step * stepW;
                const gridW = item.cols * CELL + (item.cols - 1) * 2;
                const gridH = rows * CELL + (rows - 1) * 2;
                const ox = x + (stepW - gridW) / 2;
                const oy = TOP + (BLOCK_H - gridH) / 2;
                return (
                  <g key={step}>
                    <rect x={x + 1} y={TOP} width={stepW - 2} height={BLOCK_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
                    {Array.from({ length: item.c }, (_, token) => (
                      <rect
                        key={token}
                        x={ox + (token % item.cols) * (CELL + 2)}
                        y={oy + Math.floor(token / item.cols) * (CELL + 2)}
                        width={CELL}
                        height={CELL}
                        fill={token === 0 ? "#2563eb" : "#94a3b8"}
                        opacity={token === 0 ? 1 : 0.55}
                      />
                    ))}
                  </g>
                );
              })}
              <line x1={LEFT} x2={W - LEFT} y1={TOP + BLOCK_H + 8} y2={TOP + BLOCK_H + 8} stroke="#94a3b8" strokeWidth={1} />
              <text x={LEFT} y={TOP + BLOCK_H + 22} fontSize={11} fill="#64748b">0</text>
              <text x={W - LEFT} y={TOP + BLOCK_H + 22} textAnchor="end" fontSize={11} fill="#64748b">약 173 ms</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="border-l border-border pl-2 text-left">
                <p className="text-xs text-muted-foreground">걸음 수</p>
                <p className="font-mono text-sm font-bold">{item.steps}걸음</p>
              </div>
              <div className="border-l border-border pl-2 text-left">
                <p className="text-xs text-muted-foreground">서버 전체</p>
                <p className="font-mono text-sm font-bold">{item.steps * item.c}토큰</p>
              </div>
              <div className="border-l border-primary pl-2 text-left">
                <p className="text-xs text-muted-foreground">내 요청</p>
                <p className="font-mono text-sm font-bold text-primary">{item.steps}토큰</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
