import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scheduler-overhead — CPU 선택·준비 5ms, GPU 계산 20ms (가정).
 * 직렬: 주기 5+20=25ms, GPU 비율 20/25=80%. 완전 겹침(이상적 정상 상태): 주기 max(5,20)=20ms.
 * 식 해석의 t_gpu=8ms: 직렬 13ms·8/13≈61.5%, 겹침 max(5,8)=8ms.
 * 가로축 0–60ms, 1ms = 4.9 단위.
 */
const AXIS_MS = 60;
const X0 = 46;
const PX = 4.9;

type Span = readonly [number, number, number];

function serial(sched: number, gpu: number) {
  const period = sched + gpu;
  const count = Math.ceil(AXIS_MS / period);
  const cpu = Array.from({ length: count }, (_, k): Span => [k * period, k * period + sched, k + 1]);
  const gpuSpans = Array.from({ length: count }, (_, k): Span => [k * period + sched, (k + 1) * period, k + 1]);
  return { cpu, gpu: gpuSpans };
}

function overlapped(sched: number, gpu: number) {
  const period = Math.max(sched, gpu);
  const count = Math.ceil(AXIS_MS / period);
  const cpu = Array.from({ length: count + 1 }, (_, k): Span => [k * period, k * period + sched, k + 1]);
  const gpuSpans = Array.from({ length: count }, (_, k): Span => [sched + k * period, sched + k * period + gpu, k + 1]);
  return { cpu, gpu: gpuSpans };
}

const SCENES = [
  { label: "직렬 · 5 + 20", summary: "주기 25ms · GPU 80%", lanes: serial(5, 20), period: 25, start: 0, note: "선택이 끝나야 계산을 시작하므로 두 시간이 더해집니다. 25ms마다 GPU가 5ms 쉬어 20/25=80%만 일합니다. 칸 안 숫자는 몇 번째 실행인지입니다. (가정)" },
  { label: "겹침 · max(5, 20)", summary: "주기 20ms · 이상적", lanes: overlapped(5, 20), period: 20, start: 5, note: "다음 실행의 선택을 이번 GPU 계산과 겹치면 긴 쪽 20ms가 주기입니다. CPU 5ms는 사라지지 않고 GPU 뒤에 숨을 뿐입니다. 결과 의존성·전달·동기화 비용이 없는 이상적 정상 상태이며 측정값이 아닙니다." },
  { label: "직렬 · GPU 8ms", summary: "주기 13ms · GPU ≈61.5%", lanes: serial(5, 8), period: 13, start: 0, note: "GPU 계산이 8ms로 줄면 직렬 주기는 13ms이고 GPU가 일한 비율은 8/13≈61.5%로 떨어집니다. 같은 CPU 5ms가 주기에서 차지하는 몫이 커졌습니다." },
  { label: "겹침 · GPU 8ms", summary: "주기 max(5, 8) = 8ms", lanes: overlapped(5, 8), period: 8, start: 5, note: "겹치면 주기는 여전히 긴 쪽인 8ms입니다. CPU 칸 사이의 여유가 3ms로 줄었습니다. CPU 시간이 GPU 시간을 넘으면 겹친 주기도 CPU 시간이 정합니다." },
] as const;

const LANES = [
  { key: "cpu", name: "CPU 선택", y: 34, color: "#d97706" },
  { key: "gpu", name: "GPU 계산", y: 74, color: "#2563eb" },
] as const;

const x = (ms: number) => X0 + Math.min(ms, AXIS_MS) * PX;

export default function StepOverlapTimelineViz() {
  return (
    <SceneShell
      eyebrow="Scheduling overhead"
      title="직렬이면 두 시간이 더해지고, 겹치면 긴 쪽만 주기에 남습니다"
      description="가로축이 시간(ms)입니다. 위 줄은 CPU의 선택·준비, 아래 줄은 GPU 계산이며 칸 안 숫자는 실행 번호입니다. 5ms·20ms·8ms는 본문의 가정입니다."
      ariaLabel="CPU 선택과 GPU 계산을 직렬로 두거나 겹칠 때의 실행 주기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ticks = [0, 10, 20, 30, 40, 50, 60];
        return (
          <svg viewBox="0 0 360 140" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LANES.map((lane) => (
              <g key={lane.key}>
                <text x={2} y={lane.y + 14} fontSize={10.5} fontWeight={700} fill="#334155">{lane.name}</text>
                <rect x={X0} y={lane.y} width={AXIS_MS * PX} height={20} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                {scene.lanes[lane.key]
                  .filter(([from]) => from < AXIS_MS)
                  .map(([from, to, step]) => (
                    <g key={`${lane.key}-${step}`}>
                      <rect x={x(from)} y={lane.y} width={x(to) - x(from)} height={20} fill={lane.color} fillOpacity={0.22} stroke={lane.color} strokeWidth={1} />
                      {x(to) - x(from) >= 12 && (
                        <text x={(x(from) + x(to)) / 2} y={lane.y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={lane.color}>{step}</text>
                      )}
                    </g>
                  ))}
              </g>
            ))}
            <line x1={x(scene.start)} x2={x(scene.start + scene.period)} y1={106} y2={106} stroke="#0f172a" strokeWidth={1} />
            <line x1={x(scene.start)} x2={x(scene.start)} y1={101} y2={111} stroke="#0f172a" strokeWidth={1} />
            <line x1={x(scene.start + scene.period)} x2={x(scene.start + scene.period)} y1={101} y2={111} stroke="#0f172a" strokeWidth={1} />
            <text x={x(scene.start + scene.period) + 4} y={110} fontSize={10} fontWeight={700} fill="#0f172a">주기 {scene.period}ms</text>
            <line x1={X0} x2={x(AXIS_MS)} y1={120} y2={120} stroke="#94a3b8" strokeWidth={1} />
            {ticks.map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={120} y2={124} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(t)} y={134} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
