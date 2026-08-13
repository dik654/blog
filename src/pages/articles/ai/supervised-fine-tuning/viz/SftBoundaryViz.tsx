import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["01", "Pretrained policy", "Prefix에서 다음 token 분포를 냅니다."],
  ["02", "Demonstration", "Prompt와 원하는 response를 고정합니다."],
  ["03", "Masked NLL", "선택한 response target만 correction을 냅니다."],
  ["04", "SFT checkpoint", "행동 형식을 익힌 다음 단계의 출발점입니다."],
];

export default function SftBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Training boundary"
      title="SFT는 model 구조보다 data와 loss 경계를 바꿉니다"
      description="Pretrained policy에 demonstration을 보여 주고, response target의 likelihood만 높이는 계산 경로입니다."
      note="좋은 response를 모방하는 objective이지 사실성·안전성·선호 전체를 자동으로 보장하는 objective는 아닙니다."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([index, title, body]) => (
          <article key={title} className="min-w-0 border-l border-primary/45 pl-4">
            <p className="text-xs font-bold text-primary">{index}</p>
            <p className="mt-3 font-semibold text-foreground">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
