const methods = [
  ["Mixup", "전체 tensor 보간", "같은 λ로 soft label 보간", "Sample 사이 linearity"],
  ["CutMix", "Rectangular region 교체", "실제 visible area로 label 혼합", "Regional evidence"],
  ["Mosaic", "여러 image를 canvas에 배치", "Object annotation 이동·clip", "Scale·context 다양화"],
];

export default function AdvancedViz() {
  return (
    <figure data-viz="mixed-sample-comparison" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">같은 예산으로 input·target·가정을 비교합니다</figcaption>
      <div className="grid gap-3 md:grid-cols-[.7fr_1.2fr_1.2fr_1fr]">
        <div className="hidden md:block" />
        {['Input 조작','Target 규칙','유도하는 bias'].map(label => <p key={label} className="hidden border-t border-border pt-3 text-xs font-bold text-muted-foreground md:block">{label}</p>)}
        {methods.map(([name, input, target, bias]) => (
          <div key={name} className="contents">
            <p className="border-t border-primary/45 pt-3 font-semibold text-primary">{name}</p>
            {[input,target,bias].map((value,index)=><p key={`${name}-${index}`} className="min-w-0 border-t border-border pt-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 font-semibold text-foreground md:hidden">{['Input','Target','Bias'][index]}:</span>{value}</p>)}
          </div>
        ))}
      </div>
    </figure>
  );
}
