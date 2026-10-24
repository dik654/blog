import VizFrame from "@/components/viz/VizFrame";

export default function SimilarityBoundaryViz() {
  return (
    <VizFrame eyebrow="압축 전·후 geometry" title="같은 두 단어도 어느 좌표를 버렸는지에 따라 cosine이 달라집니다" description="Cosine은 사전적 의미가 아니라 선택한 representation 안의 방향을 비교합니다." note="고양이·강아지의 원 PPMI row와 rank-2 결과를 비교한 교육용 계산입니다.">
      <div data-viz-canvas className="grid gap-4 md:grid-cols-2">
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-muted-foreground">PPMI 3차원</p>
          <p className="mt-2 font-mono text-xs">고양이=(.439,.151,0)</p><p className="mt-1 font-mono text-xs">강아지=(.151,.439,0)</p>
          <p className="mt-4 font-mono text-2xl font-bold text-primary">cos ≈ .616</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">반려·먹이 비율이 달라 두 방향 사이에 각도가 남습니다.</p>
        </div>
        <div className="border border-primary/45 bg-primary/[.04] p-4">
          <p className="text-[10px] font-bold text-primary">Rank 2</p>
          <p className="mt-2 font-mono text-xs">차이 singular direction 제거</p><p className="mt-1 font-mono text-xs">두 row가 같은 방향에 투영</p>
          <p className="mt-4 font-mono text-2xl font-bold text-primary">cos = 1.000</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">더 가깝다는 값은 압축 정책의 결과이지 두 단어가 동의어라는 증거가 아닙니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
