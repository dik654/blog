import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 풀 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MessagePool — 블록 포함 전 대기하는 메시지 저장소
          <br />
          가스 가격 기반 정렬 → 마이너가 수익 높은 메시지 우선 선택
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('mpool-add', codeRefs['mpool-add'])} />
            <span className="text-[10px] text-muted-foreground self-center">messagepool.go — Add()</span>
            <CodeViewButton onClick={() => onCodeRef('mpool-estimate', codeRefs['mpool-estimate'])} />
            <span className="text-[10px] text-muted-foreground self-center">GasEstimate</span>
          </div>
        )}

        {/* ── MessagePool Architecture ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MessagePool 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MessagePool 구조 (chain/messagepool/messagepool.go):

type MessagePool struct {
    lk sync.Mutex
    closer chan struct{}
    repubTk *time.Ticker
    repubTrigger chan struct{}
    localAddrs map[address.Address]struct{}

    pending map[address.Address]*msgSet

    curTsLk sync.RWMutex
    curTs *types.TipSet

    cfgLk sync.RWMutex
    cfg *types.MpoolConfig

    api Provider
    minGasPrice types.BigInt

    currentSize int
    pruneTrigger chan struct{}
    pruneCooldown chan struct{}
    blsSigCache *lru.Cache
}

// msgSet per address:
type msgSet struct {
    msgs map[uint64]*types.SignedMessage  // nonce → msg
    nextNonce uint64
    requiredFunds *stdbig.Int
}

// Methods:
// - Add(msg): validate + add to pool
// - Remove(): when included in block
// - Select(): miner chooses for block
// - Prune(): cleanup expired/invalid

// Pool size limits:
// - MaxFeeCapped = 1024 messages per address
// - Total: 20000 messages
// - auto-prune when exceeded

// Message validation:
// 1. Signature check (BLS/Secp)
// 2. Nonce check (expected for sender)
// 3. Gas check (sufficient)
// 4. Balance check (can pay)
// 5. Size check (< MaxMessageBytes)
// 6. Price check (> minGasPrice)

// Gas price sorting:
// - priority: gas_premium (tip)
// - higher premium → higher priority
// - selected by miner for profit maximization

// Replacement policy:
// - same nonce re-submit 가능
// - 25% higher gas_premium required
// - prevents fee manipulation`}
        </pre>
        <p className="leading-7">
          MessagePool: <strong>per-address msgSet + nonce ordering</strong>.<br />
          gas_premium 기반 priority (miner profit).<br />
          20000 msg pool limit, auto-prune.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 per-address msgSet인가</strong> — nonce ordering.<br />
          address 당 nonce sequence 관리.<br />
          nonce gap 감지 + ordered execution.<br />
          miner가 올바른 순서로 TX 포함.
        </p>
      </div>
    </section>
  );
}
