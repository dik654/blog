import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["고양이", 4, 3, 0],
  ["강아지", 3, 4, 0],
  ["행성", 0, 0, 5],
] as const;

export default function ContextMatrixViz() {
  return (
    <VizFrame eyebrow="가정 · 19개의 word–context 사건" title="행은 target, 열은 연구자가 세기로 정한 context입니다" description="같은 corpus라도 열을 주변 단어·방향·문법 관계·문서 중 무엇으로 잡느냐에 따라 다른 행렬이 됩니다." note="이 3×3 count는 모든 절에서 다시 사용하는 교육용 fixture입니다.">
      <div data-viz-canvas className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
        <div className="overflow-hidden border border-border">
          <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] gap-px bg-border text-center text-xs">
            <div className="bg-muted/70 p-3 font-bold">target</div>
            {["반려", "먹이", "공전"].map((label) => <div key={label} className="bg-muted/70 p-3 font-bold">{label}</div>)}
            {rows.flatMap(([name, ...values]) => [
              <div key={name} className="bg-muted/70 p-3 text-left font-bold">{name}</div>,
              ...values.map((value, index) => <div key={`${name}-${index}`} className={`bg-background p-3 font-mono text-sm ${value > 0 ? "text-primary" : "text-muted-foreground"}`}>{value}</div>),
            ])}
          </div>
        </div>
        <div className="border-l-2 border-primary/45 pl-4">
          <p className="text-[10px] font-bold text-muted-foreground">한 cell을 읽는 법</p>
          <p className="mt-2 text-sm font-bold">X(고양이, 반려)=4</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">관측 규칙을 통과한 19개 사건 중 고양이와 반려가 함께 나온 사건을 네 번 셌습니다. 원인이나 사전적 의미를 네 번 셌다는 뜻은 아닙니다.</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px text-[10px] sm:grid-cols-4">
        {[['주변 window','가까운 token'],['방향 분리','왼쪽·오른쪽'],['Dependency','문법 관계'],['문서','주제 동시 등장']].map(([name, result]) => <div key={name} className="bg-background px-3 py-2"><strong className="block">{name}</strong><span className="mt-1 block text-muted-foreground">{result}</span></div>)}
      </div>
    </VizFrame>
  );
}
