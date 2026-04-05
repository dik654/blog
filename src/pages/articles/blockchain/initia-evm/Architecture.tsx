import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ArchSteps from './ArchSteps';

const STEPS = [
  { label: 'Cosmos 상태와 EVM 상태 매핑 전체', body: 'MiniEVM은 Ethereum의 StateDB를 Cosmos KVStore로 대체.\n같은 상태 공간에서 IBC와 EVM이 공존.' },
  { label: '상태 저장소: MPT → IAVL Tree', body: 'Ethereum: Patricia Merkle Trie + LevelDB.\nMiniEVM: Cosmos KVStore + IAVL Tree. Merkle 증명 방식은 다르지만 동일한 상태 무결성 보장.' },
  { label: '계정: Account → x/auth + x/bank', body: 'EVM address(20byte) ↔ Cosmos address(bech32) 매핑.\nnonce → x/auth sequence number, balance → x/bank 잔액.' },
  { label: 'Storage: KVStore 직접 저장', body: 'key = address + slot, value = bytes32.\nEthereum의 storageRoot 트리 구조 대신 플랫 KV 매핑.' },
  { label: 'Code: KVStore에 저장', body: 'key = codeHash, value = bytecode.\n동일한 Solidity 바이트코드를 그대로 실행 가능.' },
];

const CODE_MAP = ['mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Architecture({ onCodeRef }: Props) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 매핑 & 실행 흐름</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        이더리움 EVM 상태를 Cosmos KVStore로 어댑팅하는 핵심 메커니즘.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ArchSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">statedb.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">상태 매핑 상세 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// State Mapping: Ethereum StateDB → Cosmos KVStore
//
// Ethereum state model:
//   Trie: Merkle Patricia Trie (MPT)
//   Root: 32-byte state root (in each block header)
//   Accounts: {nonce, balance, codeHash, storageRoot}
//   Storage: per-account MPT of (slot -> value)
//   Backend: LevelDB/PebbleDB key-value store
//
// Cosmos state model:
//   Trie: IAVL+ Tree (balanced binary tree with Merkle)
//   Root: app_hash (in each block)
//   Multistore: multiple named KVStores
//   Backend: goleveldb, rocksdb, tm-db

// Mapping choices:
//
//   Approach 1: Emulate MPT on top of KVStore
//     Use Cosmos KVStore as leaf storage
//     Reconstruct MPT on demand
//     Pro: can compute Ethereum state root
//     Con: expensive recomputation
//
//   Approach 2: Flat key-value mapping (MiniEVM choice)
//     Each storage slot → direct KVStore entry
//     Abandon Ethereum state root format
//     Pro: fast, simple
//     Con: state root differs from mainnet EVMs

// MiniEVM StateDB implementation:
//
//   type StateDB struct {
//       ctx        sdk.Context
//       kvStore    storetypes.KVStore
//       accounts   map[common.Address]*StateObject
//       snapshots  []*Snapshot
//       logs       []*ethtypes.Log
//       // ...
//   }
//
//   Implements go-ethereum's vm.StateDB interface:
//     - GetBalance, AddBalance, SubBalance
//     - GetNonce, SetNonce
//     - GetCode, SetCode
//     - GetCommittedState, GetState, SetState
//     - CreateAccount, HasSuicided
//     - Snapshot, RevertToSnapshot

// Storage key layout:
//
//   Storage entries:
//     key: "s" || address (20 bytes) || slot (32 bytes)
//     value: word (32 bytes)
//
//   Code entries:
//     key: "c" || codeHash (32 bytes)
//     value: bytecode (variable length)
//
//   Code hash (for account):
//     key: "h" || address (20 bytes)
//     value: codeHash (32 bytes)

// Balance handling:
//
//   MiniEVM delegates balance to x/bank:
//     GetBalance(addr):
//       return bank.GetBalance(addr, "uinit")
//
//     AddBalance(addr, amount):
//       bank.MintCoins(evmModule, amount)
//       bank.SendCoins(evmModule, addr, amount)
//
//   Consistency:
//     EVM value transfers update bank balances
//     IBC transfers update bank balances
//     Both visible through same Get/Set interface

// Nonce handling:
//
//   Delegates to x/auth:
//     GetNonce(addr):
//       acc := auth.GetAccount(addr)
//       return acc.GetSequence()
//
//     SetNonce(addr, nonce):
//       acc := auth.GetAccount(addr)
//       acc.SetSequence(nonce)
//       auth.SetAccount(acc)
//
//   Cosmos SDK sequence number becomes EVM nonce

// Snapshot mechanism:
//
//   EVM needs rollback on revert/failure
//   Cosmos KVStore supports cached context:
//
//     ctx, writeCache := ctx.CacheContext()
//     // ... make changes ...
//     if success:
//       writeCache()  // commit changes
//     else:
//       // discard (changes never happened)
//
//   MiniEVM uses nested CacheContext for snapshots
//   Each EVM Snapshot() creates new layer

// Deterministic state access:
//
//   EVM execution MUST be deterministic across validators
//   Key ordering matters for gas accounting
//
//   MiniEVM preserves iteration order via:
//     - Using KVStore's built-in ordering
//     - Lexicographic key sorting
//     - No map iteration (undefined order)

// Commit phase:
//
//   On successful EVM execution:
//     1. Apply all staged StateDB changes
//     2. Write to Cosmos KVStore
//     3. Emit Cosmos events for each EVM log
//     4. Update IAVL tree
//
//   Final state root:
//     Computed from IAVL, NOT from Ethereum MPT
//     Still verifiable via Cosmos light client

// Performance considerations:
//
//   IAVL has O(log n) read/write (similar to MPT)
//   Flat storage keys: single lookup per slot
//   Cached context: minimal overhead
//
//   Typical performance:
//     Simple EVM transfer: ~50K gas, ~1ms
//     Complex DeFi contract: ~500K gas, ~10ms
//     Comparable to geth`}
        </pre>
      </div>
    </section>
  );
}
