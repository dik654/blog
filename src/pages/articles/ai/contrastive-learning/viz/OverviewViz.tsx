import VizFrame from "@/components/viz/VizFrame";

const rules = [
  ["Positive", "같은 의미를 보존", "허용할 변화", "너무 넓으면 필요한 정보가 사라짐"],
  ["Negative", "반드시 구분", "결정 경계", "false negative면 올바른 이웃을 밀어냄"],
  ["Unknown", "판정 보류", "loss에서 제외", "근거 없는 이분법을 피함"],
];

export default function OverviewViz() {
  return <VizFrame eyebrow="Pair contract" title="Embedding을 움직이기 전에 세 관계의 의미를 고정합니다" description="색과 입체 효과 대신 한 행씩 정의·학습 효과·실패 조건을 비교합니다.">
    <div className="overflow-x-auto">
      <div className="min-w-[680px] border-y border-border text-sm">
        <div className="grid grid-cols-[7rem_1fr_1fr_1.5fr] gap-5 border-b border-border py-3 text-xs font-semibold text-muted-foreground"><span>관계</span><span>의미</span><span>학습 신호</span><span>잘못 지정했을 때</span></div>
        {rules.map(([name,meaning,signal,risk]) => <div key={name} className="grid grid-cols-[7rem_1fr_1fr_1.5fr] gap-5 border-b border-border py-5 last:border-b-0"><strong>{name}</strong><span>{meaning}</span><span className="text-muted-foreground">{signal}</span><span className="text-muted-foreground">{risk}</span></div>)}
      </div>
    </div>
  </VizFrame>;
}
