import VizFrame from "@/components/viz/VizFrame";

export default function VisualRepresentationMap() {
  return (
    <VizFrame
      eyebrow="표현 계약 비교"
      title="같은 image를 줄여도 reconstruction latent와 semantic feature는 다른 정보를 보존합니다"
      description="어떤 loss로 압축했는지가 무엇을 남길지를 정합니다. 생성 decoder는 pixel 복원을 요구하고, semantic encoder는 의미가 같은 view를 가까이 두는 데 초점을 맞춥니다."
      note="Semantic feature가 항상 3D geometry나 action에 충분한 것은 아닙니다. 반대로 reconstruction latent가 pixel을 잘 복원해도 object identity나 affordance가 선형적으로 잘 분리된다는 보장은 없습니다."
      canvasClassName="max-h-[min(26rem,calc(100dvh-22rem))] overflow-y-auto"
    >
      <div data-viz-canvas className="grid min-w-0 gap-5 lg:grid-cols-[0.72fr_1fr_1fr] lg:items-stretch">
        <div className="flex min-h-36 items-center justify-center rounded-lg border border-border bg-background p-5 text-center">
          <div>
            <p className="text-xs font-black text-primary">공통 입력</p>
            <p className="mt-2 text-base font-bold">Image x</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">H × W × 3</p>
          </div>
        </div>
        <RepresentationLane
          title="Reconstruction latent"
          objective="x → E(x)=z → D(z)=x̂"
          keeps="색·윤곽·texture처럼 decoder가 pixel을 되살리는 데 필요한 정보"
          loses="compression ratio가 높을수록 미세 detail이 먼저 사라질 수 있음"
          consumer="diffusion/flow generator"
        />
        <RepresentationLane
          title="Semantic representation"
          objective="view/text relation → feature h"
          keeps="identity·category·semantic correspondence처럼 objective가 보상한 관계"
          loses="정확한 pixel phase·작은 texture·pose detail이 invariant로 지워질 수 있음"
          consumer="retrieval·recognition·predictive model"
        />
      </div>
    </VizFrame>
  );
}

function RepresentationLane({
  title,
  objective,
  keeps,
  loses,
  consumer,
}: {
  title: string;
  objective: string;
  keeps: string;
  loses: string;
  consumer: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <p className="mt-2 break-words font-mono text-xs leading-5 text-primary">{objective}</p>
      <dl className="mt-4 space-y-3 text-xs leading-5">
        <div className="border-l border-emerald-600/50 pl-3">
          <dt className="font-black text-foreground">주로 남기는 것</dt>
          <dd className="mt-1 text-muted-foreground">{keeps}</dd>
        </div>
        <div className="border-l border-amber-600/50 pl-3">
          <dt className="font-black text-foreground">잃을 수 있는 것</dt>
          <dd className="mt-1 text-muted-foreground">{loses}</dd>
        </div>
        <div className="border-l border-primary/45 pl-3">
          <dt className="font-black text-foreground">다음 consumer</dt>
          <dd className="mt-1 text-muted-foreground">{consumer}</dd>
        </div>
      </dl>
    </div>
  );
}
