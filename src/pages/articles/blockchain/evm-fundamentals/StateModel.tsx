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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Ethereum has 2 account types

// 1) Externally Owned Account (EOA)
// - Controlled by private key (secp256k1)
// - address = keccak256(pubkey)[12:]  (last 20 bytes)
// - Can initiate transactions
// - Cannot have code

// 2) Contract Account
// - Controlled by code
// - Created via CREATE/CREATE2 opcode
// - Responds to transactions (reactive only)
// - Has associated code + storage

// Account State (both types)
struct Account {
    uint64 nonce;           // Tx count (EOA) or CREATE count (contract)
    uint256 balance;        // ETH in wei
    bytes32 storageRoot;    // Merkle root of storage trie
    bytes32 codeHash;       // keccak256 of contract code
}

// EOA: storageRoot = empty trie root, codeHash = keccak256("")
// Contract: storageRoot = trie root, codeHash = hash of deployed bytecode

// Storage Trie (per contract)
// - Key: keccak256(slot_number)
// - Value: RLP(value)
// - 256-bit keys, 256-bit values
// - Sparse, lazy allocation

// 4337 Account Abstraction (future)
// - Blur EOA/Contract distinction
// - Contract가 tx 시작 가능 (bundler 통해)
// - Smart wallet features (social recovery, etc.)`}</pre>

      </div>
    </section>
  );
}
