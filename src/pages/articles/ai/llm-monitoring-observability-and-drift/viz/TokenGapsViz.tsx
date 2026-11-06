import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-latency-breakdown 식 — output 256 token, TTFT 0.4초, 전체 3.6초.
 * 생성 구간 3.6−0.4=3.2초, 간격 255개, ITL=3.2/255≈12.5ms, throughput=256/3.2=80 token/s.
 * 전체 시간으로 나누면 256/3.6≈71이라 첫 token 대기가 섞인다.
 */
const N = 256;
const TTFT = 0.4;
const TOTAL = 3.6;
const GEN = TOTAL - TTFT;
const ITL_MS = (GEN / (N - 1)) * 1000;
const RATE = N / GEN;
const WRONG = N / TOTAL;

const W = 340;
const H = 152;
const LEFT = 12;
const RIGHT = W - 12;
const AXIS = 84;
const tx = (seconds: number) => LEFT + (seconds / TOTAL) * (RIGHT - LEFT);
const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";

const SCENES = [
  { label: "첫 token까지", summary: `TTFT ${TTFT}초`, note: "요청이 도착하고 0.4초 뒤에 첫 token이 나옵니다. 전체 3.6초 가운데 이 앞부분은 아직 token을 쏟아 내는 구간이 아닙니다." },
  { label: "이후 간격은 N−1개", summary: `255칸 × ${ITL_MS.toFixed(1)}ms ≈ ${GEN.toFixed(1)}초`, note: "token이 256개면 그 사이 간격은 255개입니다. 첫 token 자리는 TTFT가 이미 잡았으므로 식에 N−1이 들어갑니다. 촘촘한 눈금 256개가 token이고, 12.5ms는 평균이라 눈금을 고르게 그렸습니다." },
  { label: "생성 구간으로 나눕니다", summary: `${N} ÷ ${GEN.toFixed(1)} = ${RATE} token/s`, note: `Throughput은 생성 구간 3.2초로 나눕니다. 전체 3.6초로 나누면 약 ${Math.round(WRONG)}이 되어 첫 token을 기다린 시간까지 섞입니다.` },
] as const;

const TICKS = Array.from({ length: N }, (_, i) => tx(TTFT) + (i / (N - 1)) * (tx(TOTAL) - tx(TTFT)));

export default function TokenGapsViz() {
  return (
    <SceneShell
      eyebrow="256 token의 시간표"
      title="첫 token 전 0.4초와 이후 3.2초를 갈라야 식이 읽힙니다"
      description="가로축은 요청 도착부터의 초입니다(길이 비례). ITL은 연속된 두 token 사이의 평균 간격이고, 숫자는 본문 아래 식의 예입니다."
      ariaLabel="TTFT 0.4초 뒤 256개 token이 3.2초에 걸쳐 나와 초당 80 token이 되는 시간축"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={RIGHT} y1={AXIS} y2={AXIS} stroke={MUTED} strokeWidth={1} />
          {active >= 1 && TICKS.map((x, i) => <line key={i} x1={x} x2={x} y1={AXIS - 24} y2={AXIS} stroke={ACCENT} strokeWidth={0.5} opacity={active === 2 ? 0.45 : 0.8} />)}
          <rect x={tx(0)} y={AXIS - 10} width={tx(TTFT) - tx(0)} height={10} fill={active === 0 ? "#d97706" : "#94a3b8"} opacity={0.8} />
          <line x1={tx(TTFT)} x2={tx(TTFT)} y1={AXIS - 30} y2={AXIS + 6} stroke="#d97706" strokeWidth={1.25} />
          <text x={tx(TTFT) + 4} y={AXIS - 34} fontSize={11.5} fontWeight={700} fill="#d97706">첫 token</text>
          {[0, TTFT, TOTAL].map((t) => (
            <text key={t} x={tx(t)} y={AXIS + 20} textAnchor={t === TOTAL ? "end" : t === 0 ? "start" : "middle"} fontSize={11.5} fill={INK}>{t}초</text>
          ))}
          {active === 1 && (
            <text x={tx(TOTAL)} y={AXIS - 34} textAnchor="end" fontSize={11.5} fill={ACCENT}>token 256개 · 간격 255개</text>
          )}
          {active === 1 && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1={tx(TTFT) + i * 28} x2={tx(TTFT) + i * 28} y1={AXIS + 30} y2={AXIS + 44} stroke={ACCENT} strokeWidth={1.25} />
              ))}
              <line x1={tx(TTFT)} x2={tx(TTFT) + 112} y1={AXIS + 44} y2={AXIS + 44} stroke={MUTED} strokeWidth={1} />
              <text x={tx(TTFT) + 122} y={AXIS + 42} fontSize={11.5} fill={INK}>앞쪽 확대: token 5개, 간격 4개</text>
              <text x={tx(TTFT)} y={AXIS + 60} fontSize={11.5} fill={INK}>간격 하나 ≈ {ITL_MS.toFixed(1)}ms</text>
            </>
          )}
          {active === 2 && (
            <>
              <path d={`M${tx(TTFT)} ${AXIS + 30} V${AXIS + 36} H${tx(TOTAL)} V${AXIS + 30}`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
              <text x={(tx(TTFT) + tx(TOTAL)) / 2} y={AXIS + 52} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>생성 구간 3.2초 · token 256개</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
