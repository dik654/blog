import MPTViz from './viz/MPTViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MPT 개념</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Merkle Patricia Trie (MPT)</strong>는 Ethereum의 핵심 자료구조로,
          Patricia Trie(Radix Trie)와 Merkle Tree의 장점을 결합한 인증 가능한 key-value 저장소입니다.
          Ethereum의 모든 상태(계정 잔액, 컨트랙트 스토리지, 트랜잭션, 영수증)는 이 구조를 통해 관리됩니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">왜 MPT인가?</h3>
        <ul>
          <li>
            <strong>Patricia Trie (Radix Trie)</strong>: 공유 접두사를 압축하여 공간 효율성을 높이고,
            <code>O(log n)</code> 시간의 lookup, insert, delete를 보장합니다.
          </li>
          <li>
            <strong>Merkle Tree</strong>: 각 노드의 해시가 부모에 포함되어 데이터 무결성을 암호학적으로
            검증할 수 있습니다. 루트 해시 하나만으로 전체 트리의 무결성을 확인합니다.
          </li>
          <li>
            <strong>결합 효과</strong>: 효율적인 key-value 조회와 암호학적 무결성 검증을 동시에 제공합니다.
            경량 클라이언트(light client)가 전체 상태를 다운로드하지 않고도 특정 데이터의 존재를 검증할 수 있습니다.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3">4가지 노드 타입</h3>
        <p>
          MPT는 4가지 노드 타입으로 구성됩니다: <strong>Blank Node</strong>(빈 트리),
          <strong> Leaf Node</strong>(최종 값 저장), <strong>Extension Node</strong>(공유 접두사 압축),
          <strong> Branch Node</strong>(16-way 분기). 이 구조를 통해 hexadecimal 키 공간을 효율적으로 탐색합니다.
        </p>

        <MPTViz />

        <h3 className="text-lg font-semibold mt-6 mb-3">핵심 특성</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">결정적(Deterministic)</p>
            <p className="text-xs text-muted-foreground">
              동일한 key-value 집합은 항상 동일한 트리 구조와 루트 해시를 생성합니다.
              노드 간 상태 동기화의 기반이 됩니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">암호학적 검증</p>
            <p className="text-xs text-muted-foreground">
              32-byte 루트 해시 하나로 전체 상태의 무결성을 검증합니다.
              Merkle proof를 통해 특정 키의 존재/부재를 증명할 수 있습니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">효율적 갱신</p>
            <p className="text-xs text-muted-foreground">
              값 변경 시 변경된 경로의 노드만 재해싱하면 됩니다.
              O(log n) 시간에 삽입, 삭제, 수정이 가능합니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">경로 압축</p>
            <p className="text-xs text-muted-foreground">
              Extension 노드를 통해 공통 접두사를 압축하여 트리 깊이를 최소화합니다.
              희소(sparse) 키 공간에서도 효율적입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
