import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #throughput 현장 기록 — 같은 기록에서 P2P 경로를 켜고 끈 두 설정.
 * 동시 100요청: 끔 합계 900 → 요청당 9토큰/s(간격 약 111ms), 켬 합계 600 → 요청당 6토큰/s
 * 요청 1개: 끔 44토큰/s, 켬 65토큰/s. 어느 설정이 나은지가 측정 조건에 따라 뒤집힌다.
 */
const OFF = "#64748b";
const ON = "#2563eb";

const PANELS = [
  {
    title: "서버 합계 · 동시 100요청",
    max: 1000,
    unit: "토큰/s",
    rows: [
      { label: "P2P 끔", value: 900, approx: true, color: OFF, extra: "" },
      { label: "P2P 켬", value: 600, approx: true, color: ON, extra: "" },
    ],
  },
  {
    title: "한 요청이 받는 속도",
    max: 70,
    unit: "토큰/s",
    rows: [
      { label: "100개 중 하나 · P2P 끔", value: 9, approx: true, color: OFF, extra: "간격 약 111ms" },
      { label: "100개 중 하나 · P2P 켬", value: 6, approx: true, color: ON, extra: "" },
      { label: "혼자 · P2P 끔", value: 44, approx: false, color: OFF, extra: "" },
      { label: "혼자 · P2P 켬", value: 65, approx: false, color: ON, extra: "" },
    ],
  },
];

export default function P2pReversalViz() {
  return (
    <VizFrame
      eyebrow="설정이 뒤집히는 자리"
      title="동시 처리량에 좋은 설정과 한 사람의 속도에 좋은 설정이 다릅니다"
      description="본문의 커뮤니티 기록(40K 토큰 문맥)에서 GPU끼리 직접 주고받는 P2P 경로를 끄고 켠 두 설정을 나란히 놓았습니다. 동시 100요청의 요청당 값은 합계를 100으로 나눈 계산입니다."
      note="현장 경험 기록이며 이 글이 직접 잰 값이 아닙니다. 두 패널은 축의 최댓값이 다릅니다."
    >
      <div className="grid min-w-0 gap-6 sm:grid-cols-2" data-viz-canvas>
        {PANELS.map((panel) => (
          <div key={panel.title} className="min-w-0">
            <p className="text-sm font-bold">{panel.title}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              축 0–{panel.max} {panel.unit}
            </p>
            <div className="mt-3 space-y-3">
              {panel.rows.map((row) => (
                <div key={row.label} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                    <span>{row.label}</span>
                    <span className="font-mono font-bold">
                      {row.approx ? "약 " : ""}
                      {row.value}
                      {row.extra && <span className="font-normal text-muted-foreground"> · {row.extra}</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-3.5 w-full rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(row.value / panel.max) * 100}%`, backgroundColor: row.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:col-span-2">
          100요청을 함께 돌리면 P2P를 끈 쪽이 합계 약 900 대 600으로 많이 냅니다. 요청 하나만 돌리면 P2P를 켠 쪽이 65 대 44로 빠릅니다. 그래서 본문은 합계의 최댓값 대신 요청별 속도 약속을 지키는 동시성에서 잰 합계를 용량의 분모로 씁니다.
        </p>
      </div>
    </VizFrame>
  );
}
