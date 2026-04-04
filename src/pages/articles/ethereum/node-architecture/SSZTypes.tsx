import SSZTypeViz from './viz/SSZTypeViz';

export default function SSZTypes({ title }: { title?: string }) {
  return (
    <section id="ssz-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SSZ 타입 시스템 & 직렬화'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lighthouse는 Ethereum 2.0 사양의 모든 데이터 구조를 <strong>SSZ(Simple Serialize)</strong>로
          직렬화하고, <strong>Tree Hash</strong>를 통해 머클 트리 루트를 계산합니다.
          <code>consensus/types</code> 모듈이 <code>BeaconState</code>, <code>BeaconBlock</code>,
          <code>Attestation</code> 등 핵심 타입을 정의합니다.
        </p>
        <p>
          <code>#[superstruct]</code> 매크로로 포크별 변형(Base, Altair, ... Electra, Fulu)을 지원하며,
          <code>ssz_derive</code> 매크로가 Encode/Decode/TreeHash를 자동 구현합니다.<br />
          SSZ 컨테이너 타입으로 <code>BitList</code>, <code>BitVector</code>,
          <code>FixedVector</code>, <code>VariableList</code>를 사용합니다.
        </p>
      </div>
      <SSZTypeViz />
    </section>
  );
}
