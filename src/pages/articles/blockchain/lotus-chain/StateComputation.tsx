import StateViz from './viz/StateViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateComputation({ onCodeRef }: Props) {
  return (
    <section id="state-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 계산 — ApplyBlocks() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        StateManager.ApplyBlocks()가 FVM으로 메시지 실행 → state root 계산<br />
        CronTick이 사용자 메시지보다 선행 — 마이너 결함 처리가 메시지에 영향
      </p>
      <div className="not-prose mb-8">
        <StateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── ApplyBlocks Flow ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ApplyBlocks() 내부 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// StateManager.ApplyBlocks() 흐름:

func (sm *StateManager) ApplyBlocks(
    ctx context.Context,
    parentStateRoot cid.Cid,
    parentEpoch abi.ChainEpoch,
    bms []FilecoinBlockMessages,
    epoch abi.ChainEpoch,
    ...
) (cid.Cid, cid.Cid, error) {
    // 1. Initialize VM
    vmopt := &vm.VMOpts{
        StateBase: parentStateRoot,
        Epoch: epoch,
        Rand: randgetter,
        Bstore: sm.cs.StateBlockstore(),
        Syscalls: sm.Syscalls,
        CircSupplyCalc: sm.GetCirculatingSupply,
        ...
    }
    vmi, err := sm.newVM(ctx, vmopt)

    // 2. CronTick (system maintenance)
    //    - sector proving deadlines
    //    - fault detection
    //    - reward distribution
    cronMsg := makeCronTickMessage(epoch)
    _, err = vmi.ApplyImplicitMessage(ctx, cronMsg)

    // 3. Apply block messages
    receipts := []MessageReceipt{}
    for _, b := range bms {
        // 3a. BLS messages (aggregated)
        for _, m := range b.BlsMessages {
            ret, err := vmi.ApplyMessage(ctx, m)
            receipts = append(receipts, ret.Receipt)
        }
        // 3b. Secp messages
        for _, m := range b.SecpkMessages {
            ret, err := vmi.ApplyMessage(ctx, m)
            receipts = append(receipts, ret.Receipt)
        }
    }

    // 4. Implicit messages (per block)
    for _, b := range bms {
        _, err := vmi.ApplyImplicitMessage(ctx, b.BlockRewardsMsg())
        // reward message for miner
    }

    // 5. Flush state
    stateRoot, err := vmi.Flush(ctx)

    // 6. Store receipts
    receiptRoot, err := storeReceipts(ctx, sm.bs, receipts)

    return stateRoot, receiptRoot, nil
}

// CronTick precedence:
// - runs BEFORE user messages
// - deadline processing
// - faulty sectors → penalties
// - affects subsequent messages

// Block rewards:
// - per-block reward message
// - paid to miner
// - vesting schedule applied

// 순서:
// 1. CronTick (system)
// 2. BLS messages (aggregated)
// 3. Secp messages
// 4. Block rewards (per block)
// 5. Flush → state root`}
        </pre>
        <p className="leading-7">
          ApplyBlocks: <strong>CronTick → BLS msgs → Secp msgs → rewards → flush</strong>.<br />
          CronTick이 user messages 전 → sector penalties 우선.<br />
          final state root가 block.ParentStateRoot와 비교.
        </p>

        {/* ── FVM Execution ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FVM Execution 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FVM (Filecoin Virtual Machine) 실행:

// Message lifecycle:
// 1. Deserialize message
// 2. Validate (signature, nonce, gas)
// 3. Deduct gas limit from sender
// 4. Invoke target actor's method
// 5. Return receipt (exit code, return value, gas used)
// 6. Refund unused gas
// 7. Update actor states

// Actor invocation:
// actor.Invoke(method_num, params) → return_value
// - target actor loaded via HAMT
// - method dispatch table
// - params CBOR encoded
// - gas metering

// Built-in Actors:
// - System: manages actor IDs
// - Init: creates new actors
// - Account: user accounts
// - Cron: system scheduler
// - Reward: block rewards
// - StoragePower: active miners
// - StorageMarket: deals
// - StorageMinerActor: per-miner state
// - Multisig: multi-sig accounts
// - PaymentChannel: micropayments
// - VerifiedRegistry: FIL+
// - EAM (EVM): Ethereum compat
// - EVM: Solidity contracts
// - EthAccount: Ethereum accounts
// - Placeholder

// Gas model:
// - gas used per operation
// - compute + storage costs
// - gas price × gas used = fee
// - base fee (EIP-1559 similar)

// FEVM (2023+):
// - EVM on FVM
// - Solidity contracts
// - MetaMask compatible
// - Ethereum tooling works

// State migration:
// - network upgrades → state migration
// - actor versions updated
// - state format changes
// - incremental vs full

// Performance:
// - 100-1000 messages per tipset
// - ~100ms per tipset
// - gas limit: 10 Billion per block
// - parallel execution: planned

// 실제 코드:
// - lotus/chain/vm/
// - ref-fvm (Rust FVM)
// - FFI to Rust`}
        </pre>
        <p className="leading-7">
          FVM: <strong>deserialize → validate → gas → invoke → receipt</strong>.<br />
          15+ built-in actors (System, Reward, Miner, Market, ...).<br />
          FEVM (2023+): EVM on FVM, Solidity compat.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 CronTick이 user messages 전인가</strong> — deterministic state.<br />
          CronTick = sector deadlines, faults, penalties.<br />
          user messages가 먼저면 fault 처리 전 TX → inconsistent.<br />
          system messages → user messages 순서가 safety 보장.
        </p>
      </div>
    </section>
  );
}
