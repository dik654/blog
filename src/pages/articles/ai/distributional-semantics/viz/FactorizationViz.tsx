import VizFrame from "@/components/viz/VizFrame";

export default function FactorizationViz() {
  return (
    <VizFrame eyebrow="같은 PPMI matrix의 SVD" title="세 singular direction 중 둘만 남기면 고양이와 강아지의 차이 축이 사라집니다" description="압축은 메모리만 줄이는 일이 아니라 어느 variation을 버릴지 정하는 일입니다." note="계산값은 위 3×3 symmetric PPMI fixture에서 얻었습니다. 표시 자릿수 때문에 반올림 오차가 있습니다.">
      <div data-viz-canvas className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-center">
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-muted-foreground">SINGULAR VALUE</p>
          <div className="mt-3 space-y-3">
            {[["공전 축",1.335,100,true],["공통 반려·먹이 축",.590,44,true],["고양이↔강아지 차이 축",.288,22,false]].map(([label,value,width,keep]) => <div key={String(label)}>
              <div className="flex justify-between gap-3 text-xs"><span>{label}</span><strong className={keep ? "text-primary" : "text-muted-foreground"}>{Number(value).toFixed(3)} {keep ? "유지" : "제거"}</strong></div>
              <div className="mt-1 h-2 bg-muted"><div className={`h-full ${keep ? "bg-primary/65" : "bg-foreground/20"}`} style={{width:`${width}%`}} /></div>
            </div>)}
          </div>
        </div>
        <span aria-hidden className="rotate-90 text-center text-2xl text-primary lg:rotate-0">→</span>
        <div className="border border-primary/45 bg-primary/[.04] p-4">
          <p className="text-[10px] font-bold text-primary">RANK 2 OUTPUT</p>
          <div className="mt-3 grid grid-cols-[4rem_1fr_1fr] gap-px bg-border p-px text-center font-mono text-xs">
            <span className="bg-background p-2" /><span className="bg-muted p-2">축 1</span><span className="bg-muted p-2">축 2</span>
            <span className="bg-muted p-2 text-left">고양이</span><span className="bg-background p-2">0</span><span className="bg-background p-2 text-primary">같음</span>
            <span className="bg-muted p-2 text-left">강아지</span><span className="bg-background p-2">0</span><span className="bg-background p-2 text-primary">같음</span>
            <span className="bg-muted p-2 text-left">행성</span><span className="bg-background p-2 text-primary">분리</span><span className="bg-background p-2">0</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">버린 squared Frobenius error는 0.288²≈0.083입니다. 작아 보이지만 고양이와 강아지를 가르던 바로 그 방향입니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
