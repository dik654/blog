import SSZTypeViz from './viz/SSZTypeViz';

export default function SSZTypes({ title }: { title?: string }) {
  return (
    <section id="ssz-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SSZ 타입 시스템 & 직렬화'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lighthouse는 Ethereum 2.0 사양의 모든 데이터 구조를 <strong>SSZ(Simple Serialize)</strong>로 직렬화합니다.
        </p>
        <p>
          SSZ의 핵심 가치는 <strong>Merkleization</strong> — 임의의 구조체에서 "필드 하나의 해시 증명"을 <em>logN</em> 시간에 뽑아낼 수 있다는 점입니다. 라이트 클라이언트가 BeaconState 전체를 받지 않고도 특정 validator나 balance를 안전하게 조회할 수 있는 이유가 이것입니다.
        </p>
        <p>
          <code>consensus/types</code> 모듈이 <code>BeaconState</code>, <code>BeaconBlock</code>, <code>Attestation</code> 등 핵심 타입을 정의하고, <code>ssz_derive</code> 매크로가 타입마다 <code>Encode</code> / <code>Decode</code> / <code>TreeHash</code>를 자동 구현합니다.
        </p>
        <p>
          <code>#[superstruct]</code> 매크로는 포크별 변형(Base → Altair → Bellatrix → Capella → Deneb → Electra → Fulu)을 <em>컴파일 타임에</em> 생성합니다. 매 포크마다 필드가 추가되는데(Altair: sync_committee, Bellatrix: execution_payload_header, Electra: committee_bits 등), 각 포크별 구조체를 손으로 복사하지 않고 enum 계열로 묶어 버전 체크와 상호 변환을 자동화합니다.
        </p>
        <p>
          SSZ 컨테이너 타입은 의미가 분명합니다:
        </p>
        <ul>
          <li><code>BitList&lt;N&gt;</code> — 가변 길이 비트 배열 (최대 N). 어테스테이션의 aggregation_bits에 사용.</li>
          <li><code>BitVector&lt;N&gt;</code> — 고정 길이 비트 배열.</li>
          <li><code>FixedVector&lt;T, N&gt;</code> — 고정 길이, 원소 수 N이 타입에 박힘 → 해시 깊이가 컴파일 타임에 결정.</li>
          <li><code>VariableList&lt;T, N&gt;</code> — 최대 N까지 가변 길이.</li>
        </ul>
        <p>
          고정/가변 구분이 중요한 이유는 <em>Merkle 트리 구조</em>가 달라지기 때문입니다. 가변 타입은 "실제 길이" mixin이 추가로 들어가 루트 계산이 달라집니다.
        </p>
        <p>
          같은 주제 더 깊이:{' '}
          <a href="/blog/blockchain/prysm-ssz" className="underline">Prysm SSZ 직렬화 & Merkleization</a> ·{' '}
          <a href="/blog/blockchain/helios-types" className="underline">Helios 타입 시스템</a>
        </p>
      </div>
      <SSZTypeViz />
    </section>
  );
}
