import SceneShell from "./SceneShell";

/**
 * 본문 대응: #work-and-cost — 요청 20개가 한 묶음을 함께 기다린다.
 * 기다림 감소 합 20×20 = 400 request-ms, GPU 작업 감소 20 GPU-ms.
 * 하루 200만 요청 ÷ 20 = 10만 묶음 → 2,000 GPU초. 20 ms × 200만 = 40,000 초(요청 기준).
 */
const REQUESTS = Array.from({ length: 20 }, (_, index) => index);
const W = 340;
const H = 176;
const LEFT = 58;
const RIGHT = 334;
const x = (ms: number) => LEFT + (ms / 100) * (RIGHT - LEFT);
const ROW = 5.4;
const GPU_Y = 124;

const SCENES = [
  { label: "한 번의 묶음 작업", summary: "요청 20개, 계산 1번", request: "−", gpu: "−", focus: "none", note: "(별도 가정) 요청 20개가 묶음 하나를 함께 처리합니다. 위 줄 하나가 요청 하나의 기다림이고, 아래 막대가 GPU 한 대의 독점 작업입니다. 처음에는 모두 100 ms입니다." },
  { label: "요청 쪽에서 세면", summary: "20 ms × 20개 = 400", request: "400 request-ms", gpu: "−", focus: "request", note: "묶음이 80 ms에 끝나면 요청마다 20 ms를 아낍니다. 20개의 기다림 감소를 합하면 400 request-ms입니다." },
  { label: "GPU 쪽에서 세면", summary: "20 ms × 1번 = 20", request: "400 request-ms", gpu: "20 GPU-ms", focus: "gpu", note: "GPU가 덜 일한 시간은 묶음당 20 GPU-ms입니다. 같은 20 ms를 요청마다 하나씩 배정해 더하면 작업 시간을 20배 크게 셉니다." },
  { label: "하루로 늘리면", summary: "40,000초 ≠ 2,000 GPU초", request: "40,000 초", gpu: "2,000 GPU초", focus: "both", note: "하루 200만 요청이 늘 20개씩 묶인다면 10만 묶음이고 10만×20 ms=2,000 GPU초입니다. 20 ms×200만=40,000초는 요청이 기다린 시간이라 단위의 뜻이 다릅니다." },
] as const;

export default function BatchShareViz() {
  return (
    <SceneShell
      eyebrow="기다림과 작업"
      title="같은 20 ms를 요청 쪽에서 세면 400, GPU 쪽에서 세면 20입니다"
      description="request-ms는 요청마다 아낀 시간의 합이고, GPU-ms는 GPU가 실제로 덜 일한 시간입니다. 막대 끝 80–100 ms 구간이 아낀 20 ms입니다."
      ariaLabel="요청 20개의 기다림과 GPU 한 대의 작업 시간 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const end = active === 0 ? 100 : 80;
        const requestHot = scene.focus === "request" || scene.focus === "both";
        const gpuHot = scene.focus === "gpu" || scene.focus === "both";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={0} y={60} fontSize={11} fontWeight={700} fill="currentColor">요청 20개</text>
              {REQUESTS.map((index) => (
                <g key={index}>
                  <rect x={LEFT} y={4 + index * ROW} width={x(end) - LEFT} height={3.6} fill="#94a3b8" />
                  {active > 0 && <rect x={x(80)} y={4 + index * ROW} width={x(100) - x(80)} height={3.6} fill={requestHot ? "#d97706" : "currentColor"} opacity={requestHot ? 1 : 0.12} />}
                </g>
              ))}
              <text x={0} y={GPU_Y + 13} fontSize={11} fontWeight={700} fill="currentColor">GPU 1대</text>
              <rect x={LEFT} y={GPU_Y} width={x(end) - LEFT} height={18} fill="#475569" />
              {active > 0 && <rect x={x(80)} y={GPU_Y} width={x(100) - x(80)} height={18} fill={gpuHot ? "#2563eb" : "currentColor"} opacity={gpuHot ? 1 : 0.12} />}
              {[0, 80, 100].map((tick) => (
                <text key={tick} x={x(tick)} y={GPU_Y + 34} textAnchor={tick === 100 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick === 100 ? "100 ms" : tick}</text>
              ))}
            </svg>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">요청 기다림 감소의 합</dt>
                <dd className="mt-0.5 font-bold text-[#b45309] dark:text-[#fcd34d]">{scene.request}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">GPU 작업 감소</dt>
                <dd className="mt-0.5 font-bold text-[#2563eb] dark:text-[#93c5fd]">{scene.gpu}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
