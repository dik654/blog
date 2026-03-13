export default function StateManagement() {
  return (
    <section id="state-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 관리 (IAVL Tree & MultiStore)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이더리움이 <strong>Modified Merkle Patricia Trie(MPT)</strong>로 상태를 관리하듯,
          Cosmos SDK는 <strong>IAVL+ Tree</strong>(Immutable AVL Tree)를 사용합니다.
          각 모듈은 독립된 KVStore를 가지며, 이를 MultiStore가 통합 관리합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">상태 트리 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">이더리움 MPT</th>
                <th className="border border-border px-4 py-2 text-left">Cosmos IAVL+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">트리 구조</td>
                <td className="border border-border px-4 py-2">16-ary Patricia Trie</td>
                <td className="border border-border px-4 py-2">Self-balancing AVL Tree</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">해시 함수</td>
                <td className="border border-border px-4 py-2">Keccak-256</td>
                <td className="border border-border px-4 py-2">SHA-256</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">증명</td>
                <td className="border border-border px-4 py-2">Merkle-Patricia Proof</td>
                <td className="border border-border px-4 py-2">IAVL Existence/Absence Proof</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">버전 관리</td>
                <td className="border border-border px-4 py-2">상태 루트 히스토리</td>
                <td className="border border-border px-4 py-2">불변 버전 스냅샷</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">커밋 해시</td>
                <td className="border border-border px-4 py-2">stateRoot (블록 헤더)</td>
                <td className="border border-border px-4 py-2">app_hash (블록 헤더)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">MultiStore 구조</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움의 단일 State Trie vs Cosmos의 MultiStore

이더리움:
  stateRoot ─── 하나의 MPT
                 ├── account1 → {nonce, balance, storageRoot, codeHash}
                 ├── account2 → ...
                 └── ...

Cosmos SDK:
  app_hash ─── MultiStore (루트 해시 = 모든 서브스토어 해시의 Merkle)
                 ├── bank/store     ─── IAVL Tree (잔액 데이터)
                 ├── staking/store  ─── IAVL Tree (검증자 데이터)
                 ├── gov/store      ─── IAVL Tree (거버넌스 데이터)
                 ├── ibc/store      ─── IAVL Tree (IBC 상태)
                 └── ...

장점: 모듈별 독립적인 상태 증명(proof) 생성 가능
     → IBC에서 특정 모듈의 상태만 증명하면 됨`}</code>
        </pre>
      </div>
    </section>
  );
}
