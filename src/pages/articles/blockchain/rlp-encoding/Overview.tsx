import RLPViz from './viz/RLPViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLP 개념</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>RLP (Recursive Length Prefix)</strong>는 Ethereum Execution Layer의 표준 직렬화 형식입니다.
          임의로 중첩된 바이트 배열(nested byte arrays)을 인코딩하기 위해 설계되었으며,
          Ethereum의 트랜잭션, 블록 헤더, 계정 상태 등 거의 모든 데이터 구조에 사용됩니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">설계 원칙: 단순성</h3>
        <p>
          RLP의 핵심 설계 철학은 <strong>극도의 단순성</strong>입니다. JSON, Protocol Buffers, MessagePack 같은
          범용 직렬화 형식과 달리, RLP는 오직 두 가지 데이터 타입만 처리합니다:
        </p>
        <ul>
          <li><strong>바이트 문자열 (string)</strong>: 임의 길이의 바이너리 데이터</li>
          <li><strong>리스트 (list)</strong>: 다른 RLP 항목들의 순서 있는 시퀀스</li>
        </ul>
        <p>
          정수, 불리언, 부동소수점 등의 타입은 RLP 레벨에서 구분하지 않습니다.
          상위 프로토콜(Ethereum 명세)이 바이트 문자열을 적절한 타입으로 해석합니다.
        </p>

        <RLPViz />

        <h3 className="text-lg font-semibold mt-6 mb-3">어디에 사용되는가?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">트랜잭션 인코딩</p>
            <p className="text-xs text-muted-foreground">
              트랜잭션의 모든 필드(nonce, gasPrice, to, value 등)를 RLP 리스트로 직렬화합니다.
              서명 전 해시 계산과 네트워크 전파에 사용됩니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">블록 헤더</p>
            <p className="text-xs text-muted-foreground">
              블록 헤더의 15개 이상의 필드를 RLP 리스트로 인코딩합니다.
              블록 해시는 RLP 인코딩된 헤더의 keccak256입니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">계정 상태</p>
            <p className="text-xs text-muted-foreground">
              State Trie에 저장되는 계정 데이터(nonce, balance, storageRoot, codeHash)는
              RLP로 인코딩됩니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">MPT 노드</p>
            <p className="text-xs text-muted-foreground">
              Merkle Patricia Trie의 모든 노드(Leaf, Extension, Branch)가
              RLP로 인코딩되어 데이터베이스에 저장됩니다.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">RLP vs 다른 직렬화 형식</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`비교:
┌──────────────┬─────────────┬───────────────┬──────────────┐
│              │ RLP         │ SSZ           │ Protobuf     │
├──────────────┼─────────────┼───────────────┼──────────────┤
│ 타입 시스템   │ 없음 (2가지) │ 풍부한 타입    │ 풍부한 타입   │
│ 스키마       │ 없음         │ 있음           │ 있음 (.proto) │
│ 고정 크기    │ 미지원       │ 지원           │ 미지원        │
│ Merkle화     │ 외부 처리    │ 내장           │ 미지원        │
│ 사용처       │ EL          │ CL            │ 범용          │
│ 구현 복잡도  │ 매우 낮음    │ 중간           │ 높음          │
└──────────────┴─────────────┴───────────────┴──────────────┘`}</code></pre>
      </div>
    </section>
  );
}
