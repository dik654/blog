import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Actor 시스템</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin의 모든 온체인 엔티티는 <strong>Actor</strong>
          <br />
          이더리움 Account와 유사하지만, 코드CID와 상태CID를 추가로 보유
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('state-tree', codeRefs['state-tree'])} />
            <span className="text-[10px] text-muted-foreground self-center">statetree.go</span>
            <CodeViewButton onClick={() => onCodeRef('hamt-find', codeRefs['hamt-find'])} />
            <span className="text-[10px] text-muted-foreground self-center">hamt.go</span>
          </div>
        )}

        {/* ── Actor Model ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin Actor Model</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Actor 구조:

type Actor struct {
    Code: cid.Cid           // actor type (code)
    Head: cid.Cid           // state head (CID)
    CallSeqNum: uint64      // nonce
    Balance: abi.TokenAmount // FIL balance
}

// Compare with Ethereum:
// Ethereum Account:
// - nonce
// - balance
// - storage_root (Merkle Patricia Trie)
// - code_hash
//
// Filecoin Actor:
// - CallSeqNum (nonce)
// - Balance
// - Head (HAMT root)
// - Code (actor type CID)

// Actor types (15+ built-in):
// - SystemActor (0x00): system bootstrap
// - InitActor (0x01): actor creation
// - RewardActor (0x02): block rewards
// - CronActor (0x03): periodic tasks
// - StoragePowerActor (0x04): active miners
// - StorageMarketActor (0x05): deals
// - VerifiedRegistryActor (0x06): FIL+
// - StorageMinerActor (0x07): per-miner
// - MultisigActor (0x08): multi-sig
// - PaymentChannelActor (0x09): micropayments
// - AccountActor (0x0a): user accounts
// - EAM (EVM Actor Manager): EVM deploy
// - EVMActor: Solidity contracts
// - PlaceholderActor: pre-registered addrs
// - DataCapActor: FIL+ DataCap

// Actor interaction:
// message → target actor
// actor.Invoke(method_num, params) → return
// state transition per method

// Address types:
// - ID address (f0): numeric (most efficient)
// - BLS (f3): BLS public key
// - Secp256k1 (f1): ECDSA public key
// - Actor (f2): scripting
// - Delegated (f4): EVM address

// State transitions:
// - each actor has internal state (HAMT)
// - state transition = old_head → new_head
// - deterministic per message
// - recorded in receipts`}
        </pre>
        <p className="leading-7">
          Actor: <strong>Code + Head + CallSeqNum + Balance</strong>.<br />
          15+ built-in actors + EVM/EAM.<br />
          5 address types (ID, BLS, Secp, Actor, Delegated).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "CID 기반 state"인가</strong> — IPLD content addressing.<br />
          Ethereum: MPT with hashed storage slots.<br />
          Filecoin: HAMT with IPLD CIDs.<br />
          CID = content-addressed → IPFS/IPLD 호환 + structural sharing.
        </p>
      </div>
    </section>
  );
}
