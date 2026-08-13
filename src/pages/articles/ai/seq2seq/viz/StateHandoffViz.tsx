import VizFrame from "@/components/viz/VizFrame";

export default function StateHandoffViz() {
  return (
    <VizFrame
      eyebrow="Encoder handoff"
      title="초기 Seq2Seq는 source 전체를 decoder 초기 state라는 좁은 인터페이스로 넘겼습니다"
      description="Encoder 내부에는 시간별 state가 있지만 fixed-context model의 decoder는 마지막 요약만 전달받습니다."
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] md:items-center">
        <Lane title="Encoder" items={["embedding e(xₜ)", "recurrent update", "마지막 (hₛ, Cₛ)"]} />
        <div className="border-y border-primary/35 py-4 text-center md:border-x md:border-y-0 md:px-3 md:py-8">
          <p className="font-mono text-xs font-bold text-primary">q(X)</p>
          <p className="mt-2 text-[11px] leading-4 text-muted-foreground">fixed-size handoff</p>
        </div>
        <Lane title="Decoder" items={["초기 state 설정", "SOS 입력", "target token 생성"]} />
      </div>
      <p className="mt-5 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">
        Bottleneck은 q의 dimension이 작다는 말만 뜻하지 않습니다. Decoder가 source 위치별 정보를 다시 조회할 경로가 없다는 interface 제약입니다.
      </p>
    </VizFrame>
  );
}

function Lane({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-lg border border-border/70 bg-background p-4"><p className="text-sm font-bold text-foreground">{title}</p><ol className="mt-4 space-y-3">{items.map((item,index)=><li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 text-xs leading-5"><span className="font-mono text-muted-foreground">{index+1}</span><span>{item}</span></li>)}</ol></section>;
}
