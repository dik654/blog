import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pressure-case — (가정) 4 vCPU, 12스레드 배치가 4초마다 1초, 나머지 3초는 웹 앱 20%.
 * 사용률 (100+20+20+20)/4 = 40%, SOME min(8/4,1) → (100+0+0+0)/4 = 25%.
 */
const CPUS = 4;
const THREADS = 12;
const WAITING = THREADS - CPUS;
const USE = [100, 20, 20, 20];
const SOME = [Math.min(WAITING / CPUS, 1) * 100, 0, 0, 0];
const mean = (values: readonly number[]) => values.reduce<number>((sum, value) => sum + value, 0) / values.length;
const USE_AVG = mean(USE);
const SOME_AVG = mean(SOME);

const SCENES = [
  { label: "폭주하는 1초", summary: "12스레드 − CPU 4개 = 8개 대기", note: "run queue는 CPU를 받으려고 기다리는 줄입니다. 네 CPU가 모두 100% 바쁘고 8개가 줄에 섭니다. '8개가 모두 기다린다'는 단순화이며 실제 스케줄러는 스레드를 밀리초 단위로 번갈아 실행합니다." },
  { label: "사용률로 보면", summary: "(100 + 20 + 20 + 20) ÷ 4 = 40%", note: "폭주 1초는 100%, 웹 앱만 도는 3초는 20%입니다. 3절의 40%와 같은 값이고, 평균에는 1초의 폭주가 보이지 않습니다." },
  { label: "PSI some으로 보면", summary: "(100 + 0 + 0 + 0) ÷ 4 = 25%", note: "some은 어떤 작업이 자원을 못 받아 멈춘 시간의 비율입니다. 폭주 중에는 대기 8 ÷ min(12, 4) = 2이지만 상한이 1이라 100%로 봅니다. 나머지 3초는 아무도 기다리지 않아 0%입니다." },
  { label: "같은 4초의 두 숫자", summary: "바빴던 40% · 기다린 25%", note: "두 숫자는 모순이 아니라 같은 시간의 두 측면입니다. 1초의 대기가 4초마다 반복되므로 요청의 약 4분의 1이 느리고, 사용률 40%는 이 사실을 보여 주지 못합니다." },
] as const;

const BASE = 196;
const COL = 34;

function Chart({ x, title, values, avg, color, lit }: { x: number; title: string; values: readonly number[]; avg: number; color: (second: number) => string; lit: boolean }) {
  return (
    <g opacity={lit ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
      <text x={x} y={76} fontSize={11} fontWeight={700} className="fill-foreground">{title}</text>
      {values.map((value, second) => (
        <g key={second}>
          <rect x={x + second * COL + 3} y={BASE - value} width={COL - 6} height={value} rx={2} fill={color(second)} />
          <text x={x + second * COL + COL / 2} y={BASE - value - 4} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">{value}</text>
          <text x={x + second * COL + COL / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{second + 1}초</text>
        </g>
      ))}
      <line x1={x} x2={x + COL * 4} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <line x1={x} x2={x + COL * 4} y1={BASE - avg} y2={BASE - avg} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
      <text x={x + COL * 4} y={BASE - avg - 5} textAnchor="end" fontSize={10.5} fontWeight={700} className="fill-foreground">평균 {avg}%</text>
    </g>
  );
}

export default function BurstSecondsViz() {
  return (
    <SceneShell
      eyebrow="4초 한 주기"
      title="같은 4초를 사용률로 세면 40%, 기다림으로 세면 25%입니다"
      description="(가정) 4 vCPU 서버에서 12스레드 배치 작업이 4초마다 1초씩 돌고, 나머지 3초는 웹 앱이 CPU의 20%를 씁니다. 막대 숫자의 단위는 %입니다."
      ariaLabel="폭주 1초의 CPU와 대기 스레드, 4초 동안의 사용률과 PSI some 평균"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 216" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <g opacity={active === 0 || active === 2 ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
            <text x={10} y={12} fontSize={10.5} fontWeight={700} className="fill-foreground">CPU 4개 · 실행</text>
            <text x={130} y={12} fontSize={10.5} fontWeight={700} fill="#b45309">run queue · 대기 8</text>
            {Array.from({ length: CPUS }, (_, i) => (
              <rect key={i} x={10 + i * 26} y={20} width={22} height={22} rx={3} fill="#d97706" />
            ))}
            {Array.from({ length: WAITING }, (_, i) => (
              <rect key={i} x={130 + i * 26} y={20} width={22} height={22} rx={3} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
            ))}
          </g>
          <Chart x={10} title="사용률" values={USE} avg={USE_AVG} color={(second) => (second === 0 ? "#d97706" : "#2563eb")} lit={active === 1 || active === 3} />
          <Chart x={206} title="PSI some" values={SOME} avg={SOME_AVG} color={() => "#dc2626"} lit={active === 2 || active === 3} />
        </svg>
      )}
    />
  );
}
