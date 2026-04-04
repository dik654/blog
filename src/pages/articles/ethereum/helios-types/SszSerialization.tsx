import SszViz from './viz/SszViz';

export default function SszSerialization() {
  return (
    <section id="ssz-serialization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        SSZ 직렬화 (이 타입들에 대해)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(EL): RLP(Recursive Length Prefix) 인코딩.
          가변 길이 접두사로 중첩 구조를 표현한다.
          파싱 시 길이 필드를 읽어야 다음 위치를 알 수 있다.<br />
          Helios(CL): SSZ(Simple Serialize).
          고정 크기 필드는 바로 연결, 가변 크기는 offset 방식.
        </p>
        <p className="leading-7">
          BeaconBlockHeader SSZ 레이아웃:
          slot(8B) + proposer_index(8B) + parent_root(32B) +
          state_root(32B) + body_root(32B) = 112B 고정.<br />
          파싱이 O(1) — 필드 위치가 컴파일 타임에 결정.
        </p>
        <p className="leading-7">
          hash_tree_root: SSZ 데이터를 32B 청크로 분할,
          바이너리 Merkle 트리로 재귀 해싱한다.
          #[derive(TreeHash)]가 자동 생성하여 수동 구현 불필요.
        </p>
      </div>
      <div className="not-prose"><SszViz /></div>
    </section>
  );
}
