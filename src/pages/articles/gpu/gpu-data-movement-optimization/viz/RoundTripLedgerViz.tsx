import SceneShell from "./SceneShell";

/**
 * 본문 대응: #round-trip — 출력 C 32 MiB의 HBM 왕복 장부.
 * GEMM store 32 → bias load·store 64 → GELU load·store 64 = 160 MiB. Epilogue fusion은 store 한 번 32 MiB.
 * A·B 읽기는 공통이라 세지 않음.
 */
const SCENES = [
  { label: "GEMM kernel", summary: "쓰기 32 = 누적 32 MiB", note: "M = N = K = 4096이고 값 하나가 2 B인 bf16이면 출력 C는 4096 × 4096 × 2 B = 32 MiB입니다. 첫 kernel이 C를 HBM에 씁니다." },
  { label: "bias kernel", summary: "32 + 64 = 누적 96 MiB", note: "다음 kernel은 C를 다시 읽고(32), bias를 더한 뒤 다시 씁니다(32). Bias는 결과 값에 더하는 보정 값입니다." },
  { label: "GELU kernel", summary: "96 + 64 = 누적 160 MiB", note: "GELU도 읽고 쓰므로 64가 더해집니다. Kernel을 나눈 경계마다 왕복 한 번이 생깁니다. GELU는 활성화 함수의 하나입니다." },
  { label: "Epilogue로 합치면", summary: "store 한 번 = 32 MiB", note: "Epilogue는 계산 끝에 붙는 마무리 단계입니다. 곱셈 결과를 모으는 accumulator가 register에 있는 동안 bias와 GELU를 적용해 store는 한 번입니다. 3.35 TB/s 상한으로 약 50.1 µs가 약 10.0 µs로 줄지만 GELU 계산·launch·cache를 뺀 장부입니다." },
] as const;

const KERNELS = [
  { name: "GEMM", read: false },
  { name: "bias", read: true },
  { name: "GELU", read: true },
] as const;

const BOX_W = 92;
const BOX_Y = 92;
const BOX_H = 44;
const HBM_BOTTOM = 26;
const boxX = (index: number) => 16 + index * (BOX_W + 16);

function Flow({ x, up, label, on }: { x: number; up: boolean; label: string; on: boolean }) {
  const tip = up ? HBM_BOTTOM + 2 : BOX_Y - 2;
  const tail = up ? BOX_Y - 2 : HBM_BOTTOM + 2;
  const base = up ? tip + 7 : tip - 7;
  const color = on ? "#2563eb" : "#94a3b8";
  return (
    <g>
      <line x1={x} x2={x} y1={tail} y2={base} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x - 4},${base} ${x + 4},${base} ${x},${tip}`} fill={color} />
      <text x={x + 4} y={(tail + tip) / 2 + 4} fontSize={10} fontWeight={700} fill={on ? "#2563eb" : "#64748b"}>{label}</text>
    </g>
  );
}

export default function RoundTripLedgerViz() {
  return (
    <SceneShell
      eyebrow="출력 쪽 HBM 왕복"
      title="Kernel을 나눌 때마다 같은 32 MiB가 다시 오갑니다"
      description="위 띠가 HBM, 아래 상자가 kernel(GPU에 따로 내리는 프로그램)입니다. 화살표 하나가 C 32 MiB의 읽기 또는 쓰기입니다. A·B 읽기는 두 경우에 공통이라 세지 않았습니다."
      ariaLabel="세 kernel로 나눌 때와 epilogue로 합칠 때의 HBM traffic 비교"
      scenes={SCENES}
      render={(active) => {
        const fused = active === 3;
        const total = [32, 96, 160, 32][active] ?? 0;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 146" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={16} y={4} width={308} height={22} rx={3} fill="#94a3b8" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1} />
              <text x={170} y={19} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">HBM (global memory)</text>
              {fused ? (
                <g>
                  <rect x={16} y={BOX_Y} width={308} height={BOX_H} rx={3} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                  <text x={170} y={BOX_Y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">GEMM + bias + GELU · kernel 하나</text>
                  <text x={170} y={BOX_Y + 34} textAnchor="middle" fontSize={10} fill="#64748b">중간값은 accumulator register 안에서 넘어갑니다</text>
                  <Flow x={170} up label="쓰기 32" on />
                </g>
              ) : (
                KERNELS.map((kernel, index) => {
                  const ran = index <= active;
                  const now = index === active;
                  const x = boxX(index);
                  return (
                    <g key={kernel.name} opacity={ran ? 1 : 0.4}>
                      <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={3} fill={now ? "#2563eb" : "#94a3b8"} fillOpacity={now ? 0.12 : 0.08} stroke={now ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={ran ? undefined : "4 3"} />
                      <text x={x + BOX_W / 2} y={BOX_Y + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{kernel.name}</text>
                      {ran && kernel.read && <Flow x={x + 16} up={false} label="읽기 32" on={now} />}
                      {ran && <Flow x={x + (kernel.read ? 62 : 30)} up label="쓰기 32" on={now} />}
                    </g>
                  );
                })
              )}
            </svg>
            <div className="mt-3 grid grid-cols-[6.25rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">누적 traffic</span>
              <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(total / 160) * 100}%`, backgroundColor: fused ? "#16a34a" : "#2563eb" }} />
              </div>
              <span className="text-right font-mono font-bold">{total} MiB</span>
            </div>
          </div>
        );
      }}
    />
  );
}
