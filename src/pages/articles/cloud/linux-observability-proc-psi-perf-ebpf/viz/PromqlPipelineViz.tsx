import SceneShell from "./SceneShell";

/**
 * 본문 대응: #node-exporter — 1 − avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) 를 안쪽부터 푼다.
 * CPU 4 × mode 8 = 32줄 → idle 4줄 → 합 2,400 tick = 24초 ÷ 10초 = 2.4 → ÷4 = 0.6 → 1 − 0.6 = 0.4.
 * 마지막 장면은 같은 서버를 1초 창과 1분 창으로 뺀 차이(4초 주기라 1분은 15주기, 평균 40%).
 */
const MODES = ["user", "nice", "system", "idle", "iowait", "irq", "softirq", "steal"] as const;
const CPU_LIST = [0, 1, 2, 3] as const;
const IDLE_COL = MODES.indexOf("idle");
const SERIES = MODES.length * CPU_LIST.length;
const IDLE_TOTAL_PER_SECOND = (2400 / 100) / 10;
const IDLE_AVG = IDLE_TOTAL_PER_SECOND / CPU_LIST.length;
const BUSY = 1 - IDLE_AVG;
const ONE_SECOND = [100, 20, 20, 20, 100, 20, 20, 20] as const;

const SCENES = [
  { label: "카운터 32줄", summary: `CPU 4 × mode ${MODES.length} = ${SERIES}줄`, note: "node_cpu_seconds_total은 CPU마다, mode마다 하나씩 있는 누적 초입니다. /proc/stat의 cpu 줄을 초 단위 counter로 내보낸 것이고, 한 줄 한 줄은 계속 늘어나기만 합니다." },
  { label: "{mode=\"idle\"} · 쉰 시간만", summary: "32줄 → 4줄", note: "PromQL의 중괄호는 라벨로 줄을 고릅니다. 쉬는 시간만 남기면 CPU마다 한 줄씩 네 줄입니다." },
  { label: "rate(…[1m]) · 뺄셈", summary: "네 줄 합 = 초당 2.4초", note: "rate()는 창 안에서 늘어난 양을 시간으로 나눠 '초당 몇 초 쉬었나'로 바꿉니다. 3절의 idle 2,400 tick은 24초이고 10초로 나누면 네 CPU 합이 2.4입니다. 줄별 값은 글에 없어 ?로 두었고, 같은 비율이 1분 내내 이어진다고 가정했습니다." },
  { label: "avg 뒤 1에서 뺍니다", summary: `2.4 ÷ 4 = ${IDLE_AVG} → 1 − ${IDLE_AVG} = ${BUSY.toFixed(1)}`, note: "평균을 내면 CPU 하나가 쉰 비율 0.6이고, 1에서 빼면 바쁜 비율 0.4입니다. 3절에서 손으로 뺀 40%와 같은 값입니다." },
  { label: "창이 다르면 숫자가 다릅니다", summary: "1초 창 100·20·20·20 / 1분 창 40", note: "mpstat 1은 1초 창이라 위상이 맞으면 폭주를 100%로 보여 주고, rate[1m]은 4초 주기 15번을 평균해 평평한 40%를 그립니다. 명령과 대시보드 숫자가 다른 흔한 이유 가운데 하나입니다." },
] as const;

const GX = 38;
const CW = 40;
const GY = 26;
const RH = 20;

function Step({ x, title, value, lit }: { x: number; title: string; value: string; lit: boolean }) {
  return (
    <g opacity={lit ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
      <rect x={x} y={134} width={104} height={52} rx={6} fill={lit ? "#2563eb" : "none"} fillOpacity={lit ? 0.1 : 0} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
      <text x={x + 52} y={154} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">{title}</text>
      <text x={x + 52} y={173} textAnchor="middle" fontSize={11} className="fill-foreground">{value}</text>
    </g>
  );
}

export default function PromqlPipelineViz() {
  return (
    <SceneShell
      eyebrow="PromQL을 안쪽부터"
      title="1 − avg(rate(…idle…))은 3절의 뺄셈을 안쪽부터 다시 합니다"
      description="칸 하나가 Prometheus에 저장된 카운터 한 줄입니다. 같은 4 vCPU 서버의 (가정) 값으로 계산합니다."
      ariaLabel="node_cpu_seconds_total 32줄에서 사용률 0.4까지의 PromQL 계산과 창 길이 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 4 ? (
            <>
              {MODES.map((mode, col) => (
                <text key={mode} x={GX + col * CW + (CW - 2) / 2} y={18} textAnchor="middle" fontSize={8.5} fontWeight={col === IDLE_COL && active > 0 ? 700 : 400} fill={col === IDLE_COL && active > 0 ? "#2563eb" : "#64748b"}>{mode}</text>
              ))}
              {CPU_LIST.map((cpu) => (
                <g key={cpu}>
                  <text x={32} y={GY + cpu * RH + 13} textAnchor="end" fontSize={9.5} fill="#64748b">CPU{cpu}</text>
                  {MODES.map((mode, col) => {
                    const idle = col === IDLE_COL;
                    const kept = active === 0 || idle;
                    return (
                      <g key={mode} opacity={kept ? 1 : 0.22}>
                        <rect x={GX + col * CW} y={GY + cpu * RH} width={CW - 2} height={RH - 3} rx={2} fill={idle && active > 0 ? "#2563eb" : "#94a3b8"} fillOpacity={idle && active > 0 ? 0.18 : 0.14} stroke={idle && active > 0 ? "#2563eb" : "#94a3b8"} strokeWidth={0.75} />
                        {idle && active >= 2 && <text x={GX + col * CW + (CW - 2) / 2} y={GY + cpu * RH + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">?</text>}
                      </g>
                    );
                  })}
                </g>
              ))}
              <Step x={6} title="rate 합" value="초당 2.4초" lit={active >= 2} />
              <Step x={128} title="avg" value={`2.4 ÷ 4 = ${IDLE_AVG}`} lit={active >= 3} />
              <Step x={250} title="1 −" value={`1 − ${IDLE_AVG} = ${BUSY.toFixed(1)}`} lit={active >= 3} />
              <text x={119} y={164} textAnchor="middle" fontSize={11} fill="#64748b">→</text>
              <text x={241} y={164} textAnchor="middle" fontSize={11} fill="#64748b">→</text>
            </>
          ) : (
            <>
              <text x={GX} y={14} fontSize={10.5} fontWeight={700} className="fill-foreground">막대: mpstat 1 (1초 창, %) · 점선: rate[1m] (1분 창)</text>
              {ONE_SECOND.map((value, second) => (
                <g key={second}>
                  <rect x={GX + second * 38 + 4} y={170 - value * 1.3} width={30} height={value * 1.3} rx={2} fill={value === 100 ? "#d97706" : "#2563eb"} />
                  <text x={GX + second * 38 + 19} y={170 - value * 1.3 - 4} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">{value}</text>
                  <text x={GX + second * 38 + 19} y={184} textAnchor="middle" fontSize={10} fill="#64748b">{second + 1}초</text>
                </g>
              ))}
              <line x1={GX} x2={GX + 8 * 38} y1={170} y2={170} stroke="#94a3b8" strokeWidth={1} />
              <line x1={GX} x2={GX + 8 * 38} y1={170 - 40 * 1.3} y2={170 - 40 * 1.3} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
              <text x={GX + 8 * 38} y={170 - 40 * 1.3 - 5} textAnchor="end" fontSize={10.5} fontWeight={700} className="fill-foreground">40</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
