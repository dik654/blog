import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 상태 증명이 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">풀 노드 vs 경량 클라이언트의 상태 접근</h3>
        <p>
          <strong>Reth (풀 노드)</strong>: 로컬에 700GB+ 상태 트라이를 저장한다.<br />
          eth_getBalance 요청이 오면 MDBX DB에서 직접 읽어서 즉시 반환한다.<br />
          아무도 신뢰할 필요 없다 — 자기 디스크에 데이터가 있으니까.
        </p>
        <p>
          <strong>Helios (경량 클라이언트)</strong>: 상태를 저장하지 않는다. 디스크가 0이다.<br />
          대신 RPC 프로바이더에게 데이터를 요청하면서 <strong>Merkle 증명</strong>도 함께 요구한다.<br />
          받은 증명을 state_root로 검증해서, 데이터가 진짜 블록체인에 속하는지 확인한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 핵심 원칙: "프로바이더를 신뢰하지 않으면서 프로바이더의 데이터를 사용한다"</strong><br />
          가능한 이유: Merkle-Patricia 증명이 데이터가 특정 state_root에 속함을 수학적으로 증명한다.<br />
          state_root는 BLS 검증된 finalized_header에서 온다 — 위조 불가.<br />
          즉 RPC가 거짓 데이터를 보내면 Merkle 검증에서 걸린다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EIP-1186: eth_getProof 표준</h3>
        <p>
          이 메커니즘의 기반이 되는 표준이 <strong>EIP-1186</strong>이다.<br />
          <code>{'eth_getProof(address, storageKeys, blockNumber)'}</code> 호출 시 응답에 3가지가 포함된다:
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">① accountProof</h4>
        <p>
          상태 트라이(state trie)에서 해당 계정까지의 Merkle 경로.<br />
          루트 노드에서 리프 노드까지의 모든 중간 노드가 배열로 포함된다.<br />
          이 노드들의 해시를 재계산하면 state_root와 일치해야 한다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">② storageProof</h4>
        <p>
          스토리지 트라이(storage trie)에서 해당 슬롯까지의 Merkle 경로.<br />
          각 스토리지 키에 대해 key, value, proof 세트를 포함한다.<br />
          검증 기준은 state_root가 아니라 <strong>계정의 storage_root</strong> — "트라이 안의 트라이" 구조.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">③ account 필드</h4>
        <ul>
          <li><code>balance</code> — ETH 잔액 (wei 단위, U256)</li>
          <li><code>nonce</code> — 트랜잭션 카운터</li>
          <li><code>codeHash</code> — 컨트랙트 코드의 keccak256 해시 (EOA면 빈 해시)</li>
          <li><code>storageHash</code> — 이 계정의 스토리지 트라이 루트. storageProof 검증의 앵커</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} eth_getProof 응답 하나로 할 수 있는 것</strong><br />
          1. 계정 존재 증명 — accountProof로 state_root에 속하는지 확인<br />
          2. 잔액·논스·코드해시 검증 — 리프 노드 RLP 디코딩<br />
          3. 스토리지 슬롯 값 검증 — storageProof로 이중 트라이 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Reth와 비교</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">Reth (풀 노드)</th>
                <th className="text-left px-3 py-2 border-b border-border text-indigo-600">Helios (경량)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">상태 저장</td><td className="px-3 py-1.5 border-b border-border/30">로컬 MDBX DB 700GB+</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">없음 (디스크 0)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">접근 방식</td><td className="px-3 py-1.5 border-b border-border/30">DB B-tree 탐색 (~0.1ms)</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">RPC + Merkle 증명 검증 (~0.5ms + 네트워크)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">구현</td><td className="px-3 py-1.5 border-b border-border/30">StateProvider trait → MDBX</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">ProofDB → revm Database trait</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">신뢰 모델</td><td className="px-3 py-1.5 border-b border-border/30">자체 검증 (신뢰 불필요)</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">state_root + Merkle 증명 (수학적)</td></tr>
              <tr><td className="px-3 py-1.5">결과</td><td className="px-3 py-1.5">동일한 값</td><td className="px-3 py-1.5 text-indigo-600">동일한 값 (증명이 보장)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} ProofDB — EVM의 가상 DB</strong><br />
          Helios는 revm(Rust EVM)의 Database trait을 구현한 ProofDB를 사용한다.<br />
          EVM이 상태(잔액, 코드, 스토리지)에 접근할 때마다 ProofDB가
          RPC에 증명을 요청하고 검증 후 값을 반환한다.<br />
          EVM 코드는 Reth와 동일 — DB 레이어만 교체.
        </p>
      </div>

      {/* Viz 인라인 */}
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
    </section>
  );
}
