import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — counter는 두 번 읽어 빼고, gauge는 읽은 순간의 값을 그대로 쓴다.
 * 4절 서버의 10초 창. 폭주 구간 0~0.5 · 3.5~4.5 · 7.5~8.5초(가정) → 멈춘 시간 합 2.5초 = 2,500,000 µs.
 */
const BURSTS = [[0, 0.5], [3.5, 4.5], [7.5, 8.5]] as const;
const inBurst = (t: number) => BURSTS.some(([from, to]) => t >= from && t < to);

const X = (t: number) => 30 + t * 31;
const COUNTER_TOP = 34;
const COUNTER_BASE = 100;
const GAUGE_TOP = 150;
const GAUGE_BASE = 216;
const counterY = (seconds: number) => COUNTER_BASE - (seconds / 2.5) * (COUNTER_BASE - COUNTER_TOP);
const gaugeY = (value: number) => GAUGE_BASE - (value / 12) * (GAUGE_BASE - GAUGE_TOP);

const COUNTER_POINTS = [[0, 0], [0.5, 0.5], [3.5, 0.5], [4.5, 1.5], [7.5, 1.5], [8.5, 2.5], [10, 2.5]] as const;
const COUNTER_PATH = COUNTER_POINTS.map(([t, s], i) => `${i === 0 ? "M" : "L"}${X(t)},${counterY(s)}`).join(" ");

/** 폭주 밖의 1·2 오감은 0.5초 단위로 그린 가정입니다. */
const gaugeAt = (t: number) => (inBurst(t) ? 12 : 1 + (Math.floor(t * 2) % 2));
const HALF_STEPS = Array.from({ length: 20 }, (_, i) => i / 2);
const GAUGE_PATH = HALF_STEPS.map((t, i) => `${i === 0 ? "M" : "L"}${X(t)},${gaugeY(gaugeAt(t))} L${X(t + 0.5)},${gaugeY(gaugeAt(t))}`).join(" ");
const READS = [2, 4] as const;

const SCENES = [
  { label: "counter · 한 번 읽으면", summary: "부팅 뒤 누적값 X", note: "PSI total은 부팅 뒤 계속 늘어나는 counter입니다. 폭주 구간에서만 오르고 한가할 때는 평평합니다. /proc/stat의 cpu 줄도 counter이지만 이 곡선은 PSI total만 그렸습니다. 한 번 읽은 X에는 언제 쌓였는지가 없어 그 값만으로는 지금 상황을 알 수 없습니다." },
  { label: "counter · 두 번 읽어 빼면", summary: "2,500,000 ÷ 10,000,000 = 25%", note: "10초 뒤의 값은 X + 2,500,000 µs이고, 이 차이를 간격 10,000,000 µs로 나누면 25%입니다. 그사이 오른 만큼은 누적값에 이미 들어 있습니다. 그림은 첫 읽기가 폭주 중간에 걸려 이 10초 안에 폭주가 정확히 2.5초 든다고 가정했습니다." },
  { label: "gauge · 읽은 순간 그대로", summary: "2초에 1 · 4초에 12", note: "procs_running은 그 순간의 값이라 뺄셈 없이 그대로 읽고, 읽을 때마다 그 순간만 말해 줍니다. PSI의 avg 줄과 MemAvailable도 같은 gauge입니다." },
] as const;

export default function CounterGaugeViz() {
  return (
    <SceneShell
      eyebrow="두 종류의 파일 값"
      title="누적값은 두 번 읽어 빼고, 순간값은 읽은 그대로 씁니다"
      description="4절 서버의 같은 10초입니다. 위는 쌓이는 값(counter), 아래는 그 순간의 값(gauge)입니다. 폭주 구간의 위치와 1·2 사이의 오감은 그림을 위한 가정입니다."
      ariaLabel="PSI total 누적값을 두 번 읽어 빼는 계산과 procs_running 순간값을 읽는 방식 비교"
      scenes={SCENES}
      render={(active) => {
        const counterLit = active < 2;
        return (
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={counterLit ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
              <text x={6} y={12} fontSize={10.5} fontWeight={700} className="fill-foreground">counter · PSI total (cpu some)</text>
              <path d={COUNTER_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={X(0)} x2={X(10)} y1={COUNTER_BASE} y2={COUNTER_BASE} stroke="#94a3b8" strokeWidth={1} />
              <circle cx={X(0)} cy={COUNTER_BASE} r={3.5} fill="#2563eb" />
              <text x={X(0) - 3} y={COUNTER_BASE + 12} fontSize={10} fontWeight={700} fill="#2563eb">첫 읽기 X</text>
              {active === 1 && (
                <>
                  <circle cx={X(10)} cy={COUNTER_TOP} r={3.5} fill="#2563eb" />
                  <text x={X(10) - 4} y={COUNTER_TOP - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">둘째 읽기 X + 2,500,000 µs</text>
                  <line x1={X(10)} x2={X(10)} y1={COUNTER_TOP + 4} y2={COUNTER_BASE} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                </>
              )}
            </g>
            <g opacity={counterLit ? 0.3 : 1} className="transition-opacity duration-300 motion-reduce:transition-none">
              <text x={6} y={126} fontSize={10.5} fontWeight={700} className="fill-foreground">gauge · procs_running</text>
              <path d={GAUGE_PATH} fill="none" stroke="#64748b" strokeWidth={1} />
              <line x1={X(0)} x2={X(10)} y1={GAUGE_BASE} y2={GAUGE_BASE} stroke="#94a3b8" strokeWidth={1} />
              {active === 2 && READS.map((t) => (
                <g key={t}>
                  <circle cx={X(t)} cy={gaugeY(gaugeAt(t))} r={3.5} fill="#d97706" />
                  <text x={X(t)} y={gaugeY(gaugeAt(t)) - 7} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">{gaugeAt(t)}</text>
                </g>
              ))}
            </g>
            {[0, 2, 4, 6, 8, 10].map((t) => (
              <text key={t} x={X(t)} y={232} textAnchor="middle" fontSize={10} fill="#64748b">{t}초</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
