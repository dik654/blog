import VizFrame from "@/components/viz/VizFrame";

export default function VisualRepresentationMap() {
  return (
    <VizFrame
      eyebrow="표현 계약 비교"
      title="같은 이미지를 줄여도 복원 잠재값과 의미 특징은 다른 정보를 보존합니다"
      description="어떤 손실로 압축했는지가 무엇을 남길지 정합니다. 생성 디코더는 픽셀 복원을 요구하고, 의미 인코더는 뜻이 같은 보기를 가까이 두는 데 초점을 맞춥니다."
      note="의미 특징이 항상 3D 구조나 행동에 충분한 것은 아닙니다. 반대로 복원 잠재값이 픽셀을 잘 되살려도 물체 정체성과 행동 가능성이 선형적으로 잘 분리된다는 보장은 없습니다."
      canvasClassName="max-h-[min(26rem,calc(100svh-22rem))] overflow-y-auto"
    >
      <div data-viz-canvas className="grid min-w-0 gap-5 lg:grid-cols-[0.72fr_1fr_1fr] lg:items-stretch">
        <div className="flex min-h-36 items-center justify-center rounded-lg border border-border bg-background p-5 text-center">
          <div>
            <p className="text-xs font-black text-primary">공통 입력</p>
            <p className="mt-2 text-base font-bold">이미지 x</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">H × W × 3</p>
          </div>
        </div>
        <RepresentationLane
          title="복원 잠재표현"
          objective="x → E(x)=z → D(z)=x̂"
          keeps="색·윤곽·texture처럼 decoder가 pixel을 되살리는 데 필요한 정보"
          loses="compression ratio가 높을수록 미세 detail이 먼저 사라질 수 있음"
          consumer="확산·흐름 생성기"
        />
        <RepresentationLane
          title="의미 표현"
          objective="view/text relation → feature h"
          keeps="identity·category·semantic correspondence처럼 objective가 보상한 관계"
          loses="정확한 pixel phase·작은 texture·pose detail이 invariant로 지워질 수 있음"
          consumer="검색·인식·예측 모델"
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
          <dt className="font-black text-foreground">다음 사용처</dt>
          <dd className="mt-1 text-muted-foreground">{consumer}</dd>
        </div>
      </dl>
    </div>
  );
}
