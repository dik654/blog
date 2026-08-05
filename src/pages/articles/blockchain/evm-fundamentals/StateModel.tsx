import StateModelViz from './viz/StateModelViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function StateModel({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 모델: 어카운트 & 트라이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움은 어카운트 기반(account-based) 상태 모델
          — UTXO와 달리 각 주소가 잔액과 스토리지를 직접 보유
          <br />
          전체 상태는 <a href="/blockchain/merkle-patricia-trie" className="text-indigo-400 hover:underline">Modified Merkle Patricia Trie(MPT)</a>로 구조화
        </p>
      </div>
      <div className="not-prose">
        <StateModelViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Account Types</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">EOA (Externally Owned Account)</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Private key(<code className="text-xs bg-background/50 px-1 py-0.5 rounded">secp256k1</code>)로 제어</li>
              <li>주소 = <code className="text-xs bg-background/50 px-1 py-0.5 rounded">keccak256(pubkey)[12:]</code> (마지막 20 bytes)</li>
              <li>트랜잭션 시작 가능</li>
              <li>코드 보유 불가</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Contract Account</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>코드로 제어</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">CREATE</code>/<code className="text-xs bg-background/50 px-1 py-0.5 rounded">CREATE2</code> opcode로 생성</li>
              <li>트랜잭션에 반응만 (reactive only)</li>
              <li>코드 + storage 보유</li>
            </ul>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">Account State (공통 필드)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">nonce</code> <span className="text-muted-foreground font-normal">(uint64)</span></p>
            <p className="text-sm text-muted-foreground">EOA: tx 카운트 / Contract: CREATE 카운트</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">balance</code> <span className="text-muted-foreground font-normal">(uint256)</span></p>
            <p className="text-sm text-muted-foreground">ETH 잔액 (wei 단위)</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">storageRoot</code> <span className="text-muted-foreground font-normal">(bytes32)</span></p>
            <p className="text-sm text-muted-foreground">Storage trie의 Merkle root</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">codeHash</code> <span className="text-muted-foreground font-normal">(bytes32)</span></p>
            <p className="text-sm text-muted-foreground">컨트랙트 코드의 keccak256 해시</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          EOA: <code className="text-xs bg-muted px-1 py-0.5 rounded">storageRoot</code> = empty trie root, <code className="text-xs bg-muted px-1 py-0.5 rounded">codeHash</code> = keccak256("") &mdash;
          Contract: <code className="text-xs bg-muted px-1 py-0.5 rounded">storageRoot</code> = trie root, <code className="text-xs bg-muted px-1 py-0.5 rounded">codeHash</code> = deployed bytecode hash
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Storage Trie (컨트랙트별)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Key</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">keccak256(slot_number)</code> &mdash; 256-bit</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Value</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">RLP(value)</code> &mdash; 256-bit</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">구조</p>
            <p className="text-sm text-muted-foreground">Sparse, lazy allocation</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">EIP-4337 Account Abstraction</h4>
        <p>
          EVM은 원래 <strong>EOA(외부 소유 계정)</strong>만 트랜잭션을 시작할 수 있고, 서명 로직은 secp256k1 ECDSA로 고정됩니다. EIP-4337은 이 제약을 <em>프로토콜 수정 없이</em> 풀어 컨트랙트 계정을 1급 발신자로 올립니다.
        </p>
        <p>
          핵심은 새 mempool 계층. 사용자는 일반 트랜잭션 대신 <code>UserOperation</code>(sender, callData, signature, paymaster 등 포함 구조)을 별도 mempool에 제출하고, <strong>Bundler</strong>가 여러 개를 모아 <code>EntryPoint</code> 컨트랙트의 <code>handleOps</code>를 호출하는 일반 트랜잭션으로 포장해 체인에 올립니다.
        </p>
        <p>
          검증은 스마트 컨트랙트가 직접 수행(<code>validateUserOp</code>) → 서명 방식을 자유롭게 선택:
        </p>
        <ul>
          <li><strong>Multisig / Social recovery</strong> — 친구들이 서명해 계정 복구</li>
          <li><strong>Session keys</strong> — 게임/dApp 전용 일회성 키, 유효 기간·범위 제한</li>
          <li><strong>Paymaster 가스 대납</strong> — 사용자가 ETH 없어도 USDC로 가스 결제</li>
          <li><strong>Batch execution</strong> — 여러 call을 원자적으로 묶음</li>
          <li><strong>Post-Quantum 서명</strong> — ECDSA 대신 Dilithium/Falcon 적용 가능</li>
        </ul>
        <p>
          Pectra(EIP-7702) 이후에는 기존 EOA도 임시로 contract code를 위임받아 AA 기능을 쓸 수 있어, EOA와 컨트랙트 계정의 경계가 사실상 사라집니다.
        </p>
        <p>
          더 깊이:{' '}
          <a href="/blog/blockchain/aa-fundamentals" className="underline">Account Abstraction 기초</a> ·{' '}
          <a href="/blog/blockchain/pq-account" className="underline">Post-Quantum Account Abstraction</a>
        </p>

      </div>
    </section>
  );
}
