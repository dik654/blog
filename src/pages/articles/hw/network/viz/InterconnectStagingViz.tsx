import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #one-buffer-trace — 1 GiB = 1.0737 GB.
 * Network 400 Gb/s = 50 GB/s → 1.0737 ÷ 50 ≈ 21.5 ms. PCIe 5.0 x16 raw 63.0 GB/s → 1.0737 ÷ 63.0 ≈ 17.0 ms.
 * Pipeline: 두 구간이 동시에 일해 가장 좁은 구간 ≈ 21.5 ms. Host staging(가정: 두 copy를 겹치지 않음): 17.0 + 21.5 = 38.5 ms.
 */
const GB = 1.0737;
const PCIE_MS = Math.round((GB / 63.0) * 10000) / 10;
const NET_MS = Math.round((GB / 50) * 10000) / 10;
const STAGED_MS = Math.round((PCIE_MS + NET_MS) * 10) / 10;
const PCIE_S = PCIE_MS.toFixed(1);
const NET_S = NET_MS.toFixed(1);
const STAGED_S = STAGED_MS.toFixed(1);
const X_MAX = 42;
const TICKS = [0, 10, 20, 30, 40] as const;
const CHUNKS = 8;

const SCENES = [
  {
    label: "Pipeline: 두 구간이 동시에 일합니다",
    summary: `전체 ≈ ${NET_S} ms`,
    note: `조각(칸 하나, 개수는 가정)으로 흘리면 PCIe 구간이 다음 조각을 보내는 동안 network 구간이 앞 조각을 보냅니다. 시간이 더해지지 않고 보통 가장 좁은 50 GB/s 구간이 속도를 정합니다. PCIe 구간은 혼자라면 ${PCIE_S} ms면 끝나지만 network가 받아 가는 속도에 맞춰 흘리므로 두 줄이 같은 ${NET_S} ms 동안 이어집니다.`,
  },
  {
    label: "Host staging: 첫 copy가 끝나야 둘째가 시작합니다",
    summary: `${PCIE_S} + ${NET_S} = ${STAGED_S} ms`,
    note: `(가정) GPU에서 host memory로 1 GiB 전체를 PCIe 상한 63.0 GB/s로 먼저 복사한 뒤에야 network 전송을 시작하면, ${PCIE_S} ms와 ${NET_S} ms가 따로 더해집니다.`,
  },
  {
    label: "두 숫자 모두 이상적 하한입니다",
    summary: `${NET_S} ms vs ${STAGED_S} ms`,
    note: "어느 쪽도 예측값이 아니라 그보다 빨라질 수 없는 raw 하한입니다. Header·queue·retry가 더해지면 실제 시간은 두 막대보다 깁니다.",
  },
] as const;

function Bar({ start, end, color, striped }: { start: number; end: number; color: string; striped: boolean }) {
  const pct = (t: number) => `${(t / X_MAX) * 100}%`;
  const span = end - start;
  return (
    <div className="absolute inset-y-1 rounded-sm" style={{ left: pct(start), width: pct(span), backgroundColor: color }}>
      {striped &&
        Array.from({ length: CHUNKS - 1 }, (_, i) => (
          <span key={i} className="absolute inset-y-0 border-l border-white/80" style={{ left: `${((i + 1) / CHUNKS) * 100}%` }} />
        ))}
    </div>
  );
}

export default function InterconnectStagingViz() {
  return (
    <SceneShell
      eyebrow="1 GiB 원격 전송의 시간축"
      title="구간이 동시에 일하면 가장 좁은 구간이, 차례로 일하면 합이 시간을 정합니다"
      description="두 줄은 같은 1 GiB가 지나는 PCIe 구간과 network 구간입니다. 막대 길이는 본문의 raw 상한(PCIe 63.0 GB/s, network 50 GB/s)으로 계산한 이상적 시간이며 실측이 아닙니다."
      ariaLabel="pipeline 전송은 약 21.5밀리초, host staging은 17.0과 21.5를 더한 38.5밀리초가 되는 시간축 비교"
      scenes={SCENES}
      render={(active) => {
        const pipeline = active === 0;
        const pct = (t: number) => `${(t / X_MAX) * 100}%`;
        const rows = pipeline
          ? [
              { label: "PCIe 구간", start: 0, end: NET_MS },
              { label: "Network 구간", start: 0, end: NET_MS },
            ]
          : [
              { label: "PCIe 구간", start: 0, end: PCIE_MS },
              { label: "Network 구간", start: PCIE_MS, end: STAGED_MS },
            ];
        const finish = pipeline ? NET_MS : STAGED_MS;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2">
              <div>
                <div className="mb-1 h-4" />
                {rows.map((row) => (
                  <div key={row.label} className="h-9 text-xs font-semibold leading-9">{row.label}</div>
                ))}
                <div className="h-6" />
              </div>
              <div className="min-w-0 pr-5">
                <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute -translate-x-1/2 font-mono" style={{ left: pct(t) }}>{t}</span>
                  ))}
                </div>
                <div className="relative">
                  {rows.map((row, i) => (
                    <div key={row.label} className="relative h-9">
                      <div className="absolute inset-y-1 left-0 right-0 rounded-sm bg-muted/40" />
                      <Bar start={row.start} end={row.end} color={i === 0 ? "#64748b" : "#2563eb"} striped={pipeline} />
                    </div>
                  ))}
                  <div className="absolute inset-y-0 border-l border-foreground" style={{ left: pct(finish) }} />
                  {active === 2 && <div className="absolute inset-y-0 border-l border-dashed border-[#2563eb]" style={{ left: pct(NET_MS) }} />}
                </div>
                <div className="relative h-6 text-[11px] font-bold">
                  <span className="absolute top-1 -translate-x-1/2 whitespace-nowrap font-mono" style={{ left: pct(finish) }}>
                    {finish.toFixed(1)} ms
                  </span>
                  {active === 2 && (
                    <span className="absolute top-1 -translate-x-1/2 whitespace-nowrap font-mono text-[#2563eb]" style={{ left: pct(NET_MS) }}>
                      {NET_S}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">가로축: ms · 세로선: 마지막 byte가 도착하는 이상적 시각{active === 2 ? " · 점선: pipeline의 하한" : ""}</p>
          </div>
        );
      }}
    />
  );
}
