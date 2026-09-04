import PackingBoundaryViz from "./viz/PackingBoundaryViz";

export default function Packing() {
  return (
    <section id="packing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Packing은 padding을 줄이지만 example 사이 attention과 label shift를 새로 관리해야 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>짧은 demonstration 여러 개를 한 sequence에 이어 붙이면 padding token에 쓰던 compute를 줄일 수 있습니다. 그러나 separator 하나만 넣고 standard causal mask를 쓰면 뒤 example이 앞 example을 읽을 수 있습니다. 독립 example로 학습하려면 block-diagonal attention 또는 position reset 등 구현 계약이 필요합니다.</p>
        <p>
            EOS·BOS와 role separator도 loss에 넣을지 명시합니다. sequence 경계에서 label shift가 다음 example 첫 token을 이전
            example의 target으로 연결해 버리면 silent contamination이 생깁니다. token utilization만 보고 packing 효율을 판단하지 말고
            boundary test와 decoded sample audit로 검증합니다.
          </p>
      </div>
      <PackingBoundaryViz />
    </section>
  );
}
