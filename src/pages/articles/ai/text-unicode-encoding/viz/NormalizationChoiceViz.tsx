import VizFrame from "@/components/viz/VizFrame";

const forms = [
  ["NFD", "canonical decomposition", "표현을 분해", "compatibility 차이 보존"],
  ["NFC", "canonical composition", "가능하면 다시 합성", "web text의 흔한 기본형"],
  ["NFKD", "compatibility decomposition", "폭·위첨자 등도 분해", "원문 차이 손실 가능"],
  ["NFKC", "compatibility composition", "호환 차이를 접고 합성", "검색에는 유용, 식별자는 주의"],
];

export default function NormalizationChoiceViz() {
  return (
    <VizFrame
      eyebrow="Preservation policy"
      title="C/D는 합성 방향, K는 compatibility 차이를 지울지 결정합니다"
      description="어느 form이 항상 더 깨끗한 것이 아니라 application이 보존해야 할 차이에 따라 고릅니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {forms.map(([name, operation, effect, boundary]) => (
          <article key={name} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-base font-bold">{name}</p>
              <p className="text-xs font-semibold text-primary">{operation}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-foreground/80">{effect}</p>
            <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">{boundary}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
