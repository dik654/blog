import VizFrame from "@/components/viz/VizFrame";

const layers = [
  {
    name: "Channel · Gateway",
    kind: "Host boundary",
    owns: "inbound 인증 · binding · session state · reply route",
    excludes: "모델 token 생성과 tool loop를 소유하지 않습니다.",
  },
  {
    name: "Provider",
    kind: "Access layer",
    owns: "인증 · model catalog · transport와 request 정규화",
    excludes: "같은 provider 안에서도 model과 runtime은 별도로 선택됩니다.",
  },
  {
    name: "Model",
    kind: "Inference policy",
    owns: "다음 token · native tool request · 완성 응답 제안",
    excludes: "제안이 곧 권한 승인이나 실제 side effect는 아닙니다.",
  },
  {
    name: "Agent runtime · harness",
    kind: "Execution layer",
    owns: "준비된 prompt · model turn · tool-call loop · finished turn 반환",
    excludes: "Harness는 runtime 구현이며 channel이나 provider의 다른 이름이 아닙니다.",
  },
] as const;

export default function PiSDKLayerViz() {
  return (
    <VizFrame
      eyebrow="Agent runtime layers"
      title="Provider, model, runtime, channel은 서로 바꿔 부를 수 있는 한 묶음이 아닙니다"
      description="각 층이 소유하는 state와 결정을 분리하면 model 교체가 session routing을 바꾸거나 runtime 교체가 답장 채널을 가져가는 설계를 피할 수 있습니다."
    >
      <div className="divide-y divide-border/70">
        {layers.map(({ name, kind, owns, excludes }, index) => (
          <section
            key={name}
            className="grid min-w-0 gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[2.25rem_10rem_minmax(0,1fr)] sm:gap-6"
          >
            <span className="font-mono text-[11px] font-semibold text-primary">
              L{index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">{kind}</p>
              <h4 className="mt-1 text-sm font-bold leading-5 text-foreground">{name}</h4>
            </div>
            <dl className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                  Owns
                </dt>
                <dd className="mt-2 text-xs leading-5 text-foreground/85">{owns}</dd>
              </div>
              <div className="min-w-0 border-l border-border pl-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Boundary
                </dt>
                <dd className="mt-2 text-xs leading-5 text-muted-foreground">{excludes}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
