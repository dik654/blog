import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retention 하한 문단 — 공식 문서(하한 35, 35보다 낮으면 내리지 않음)와
 * 고정 원문 C++(하한 30, 하한 이상이면 내림)를 같은 우선순위 축에 놓는다.
 * 기본 우선순위 35는 두 규칙 모두 내리고, 30~34는 두 규칙이 갈린다. 32는 그 구간의 설명용 예시.
 * Python 설정 설명(하한보다 커야)은 본문에 하한값이 없어 축에 놓지 않는다.
 */
const W = 480;
const L = 8;
const R = 472;
const x = (priority: number) => L + (priority / 100) * (R - L);

const RULES = [
  { name: "공식 문서", sub: "하한 35 · 35 미만은 안 내림", from: 35 },
  { name: "C++ 고정 원문", sub: "하한 30 · 30 이상이면 내림", from: 30 },
] as const;

const SCENES = [
  { label: "기본 우선순위 35", summary: "두 규칙 모두 호스트로", priority: 35, note: "35는 문서 규칙에서 하한과 같아 '35보다 낮다'에 걸리지 않고, C++ 규칙에서는 30 이상입니다. 그래서 기본 우선순위 block만 쓰면 차이가 드러나지 않습니다." },
  { label: "직접 준 우선순위 32", summary: "문서: 지움 · C++: 내림", priority: 32, note: "32는 설명용으로 고른 값입니다(가정). 문서 규칙으로는 35보다 낮아 내리지 않고 바로 지우는데, C++ 규칙으로는 30 이상이라 호스트로 내립니다. 30~34를 직접 준 block만 버전에 따라 결과가 달라질 수 있습니다." },
] as const;

export default function OffloadThresholdViz() {
  return (
    <SceneShell
      eyebrow="offload 하한"
      title="문서의 35와 코드의 30 사이에서 결과가 갈립니다"
      description="가로축은 block 우선순위 0~100입니다. 초록 구간이 호스트로 내리는 우선순위이고, 주황 세로선이 지금 보는 block의 우선순위입니다."
      note="host_cache_size(기본 0)를 정해 호스트 offload를 켠 경우의 판정이며, '내림'은 GPU에서 꺼낼 때 호스트로 내릴 수 있다는 뜻입니다. Python 설정 설명은 '하한보다 커야 한다'고 적지만 본문이 그 하한값을 적지 않아 축에 놓지 않았습니다."
      ariaLabel="공식 문서와 C++ 원문의 offload 하한 비교"
      scenes={SCENES}
      render={(active) => {
        const p = SCENES[active].priority;
        return (
          <div className="mx-auto min-w-0 max-w-[560px] space-y-3">
            {RULES.map((rule) => {
              const yes = p >= rule.from;
              return (
                <div key={rule.name} className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                    <span className="font-bold">{rule.name}</span>
                    <span className="text-muted-foreground">{rule.sub}</span>
                    <span className={`ml-auto font-mono font-bold ${yes ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                      {p} → {yes ? "내림" : "지움"}
                    </span>
                  </div>
                  <svg viewBox={`0 0 ${W} 40`} className="mt-1 h-auto w-full" aria-hidden>
                    <rect x={x(30)} y={0} width={x(35) - x(30)} height={40} fill="#dc2626" fillOpacity={0.1} />
                    <line x1={L} x2={R} y1={20} y2={20} stroke="#94a3b8" strokeWidth={1} />
                    <rect x={x(rule.from)} y={8} width={R - x(rule.from)} height={24} rx={3} fill="#059669" fillOpacity={0.6} />
                    <text x={x(68)} y={25} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">호스트로 내림</text>
                    <text x={x(14)} y={14} textAnchor="middle" fontSize={14} fill="#64748b">바로 지움</text>
                    <line x1={x(p)} x2={x(p)} y1={0} y2={40} stroke="#d97706" strokeWidth={1.25} />
                  </svg>
                </div>
              );
            })}
            <svg viewBox={`0 0 ${W} 44`} className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={x(30)} y={0} width={x(35) - x(30)} height={10} fill="#dc2626" fillOpacity={0.1} />
              <line x1={L} x2={R} y1={10} y2={10} stroke="#94a3b8" strokeWidth={1} />
              {[0, 30, 35, 100].map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={6} y2={14} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick) + (tick === 30 ? -3 : tick === 35 ? 3 : 0)} y={32} textAnchor={tick === 30 ? "end" : tick === 35 ? "start" : tick === 100 ? "end" : "start"} fontSize={15} fill="#64748b">{tick}</text>
                </g>
              ))}
              <text x={x(55)} y={32} textAnchor="middle" fontSize={14} fill="#b91c1c">연한 빨강 = 30~34</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
