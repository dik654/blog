import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Content", "요청·응답", "정확성·coverage·style·refusal balance"],
  ["Format", "직렬화", "Role·chat template·special token"],
  ["Lineage", "생성 이력", "작성자·generator·filter·version"],
];

export default function SftDataViz() {
  return (
    <VizFrame
      eyebrow="Demonstration contract"
      title="문장만 같아도 format과 lineage가 다르면 같은 학습 example이 아닙니다"
      description="Data 품질을 content 한 축으로 줄이지 않고 실제 token sequence와 생성·선별 이력을 함께 고정합니다."
    >
      <div className="grid gap-3 md:grid-cols-3">
        {layers.map(([label, title, body]) => (
          <article key={label} className="min-w-0 border-t border-border/70 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{label}</p>
            <p className="mt-3 font-semibold text-foreground">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
