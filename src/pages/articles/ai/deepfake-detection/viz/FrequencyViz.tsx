import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["raw", "texture · boundary", "generator spectrum"],
  ["JPEG", "blocking · lost detail", "quantized coefficients"],
  ["resize / blur", "soft boundary", "high-frequency attenuation"],
  ["social re-encode", "compound artifacts", "codec-source shortcut risk"],
];

export default function FrequencyViz() {
  return <VizFrame eyebrow="Corruption matrix" title="RGB와 frequency branch를 같은 유통 조건에서 비교합니다" description="단서의 세기를 임의의 높음·낮음으로 단정하지 않고 어떤 변화가 생기는지와 검사 대상을 기록합니다.">
    <div className="border-y border-border">
      <div className="hidden grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-border py-3 text-xs font-semibold text-muted-foreground sm:grid"><span>Condition</span><span>spatial path</span><span>frequency path</span></div>
      {rows.map(([condition, spatial, frequency]) => <div key={condition} className="grid gap-2 border-b border-border py-4 text-sm last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"><strong>{condition}</strong><span className="text-muted-foreground">{spatial}</span><span className="text-violet-800 dark:text-violet-200">{frequency}</span></div>)}
    </div>
    <p className="mt-6 border-l border-violet-500 pl-4 text-sm leading-6 text-muted-foreground">두 branch의 단독 점수와 joint error를 함께 보아 codec source만 분류하는 shortcut인지 확인합니다.</p>
  </VizFrame>;
}
