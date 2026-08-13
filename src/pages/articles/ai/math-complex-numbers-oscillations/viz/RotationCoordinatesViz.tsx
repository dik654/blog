import VizFrame from "@/components/viz/VizFrame";

const coordinates = [
  ["실수 하나", "x", "직선 위의 위치"],
  ["두 실수", "(a, b)", "평면 위의 위치"],
  ["복소수", "a + bi", "크기와 회전을 계산하는 평면 좌표"],
];

export default function RotationCoordinatesViz() {
  return (
    <VizFrame
      eyebrow="Representation ladder"
      title="복소수는 2차원 좌표에 회전 곱셈을 더합니다"
      description="새로운 축을 하나 더 쓰는 데서 끝나지 않고, 곱셈으로 scale과 phase를 함께 합성할 수 있습니다."
    >
      <div className="grid gap-3 md:grid-cols-3">
        {coordinates.map(([label, notation, role], index) => (
          <div key={label} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{label}</span>
            </div>
            <p className="mt-6 break-words font-mono text-xl font-semibold text-foreground">{notation}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{role}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
