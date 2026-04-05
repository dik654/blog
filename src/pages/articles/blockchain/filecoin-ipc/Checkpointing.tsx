import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Checkpointing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checkpointing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인팅 & 크로스 서브넷 메시지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitCheckpoint()</span>
        </div>
        <p>
          서브넷 상태 해시를 주기적으로 메인넷에 커밋 → 보안 앵커 역할.<br />
          체크포인트 = (서브넷ID, 에폭, 상태루트, 크로스메시지 머클루트)
        </p>
        <p>
          검증자 2/3 이상 서명이 있어야 체크포인트가 수락됨.<br />
          크로스 서브넷 메시지: 서브넷 간 FIL 이동이나 메시지 전달이 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 계층적 보안 모델</strong> — 서브넷이 서브넷을 생성할 수도 있음(재귀적).<br />
          최종 보안 앵커는 항상 Filecoin 메인넷. 계층 깊이에 상관없이 메인넷의 finality를 상속
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpointing &amp; Cross-Subnet Messages</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Checkpointing Protocol:

// Bottom-up Checkpoints:
// - child → parent submission
// - subnet state anchoring
// - periodic (e.g., every 100 epochs)
// - 2/3+ validator signatures

// Checkpoint structure:
// type BottomUpCheckpoint struct {
//     SubnetID: SubnetID
//     Epoch: ChainEpoch
//     StateRoot: cid.Cid
//     CrossMessagesRoot: cid.Cid
//     Proofs: MultiSignature
// }

// Top-down Messages:
// - parent → child
// - subnet receives parent messages
// - fund transfers
// - cross-chain calls

// Cross-Subnet Messaging:
// 1. Source subnet: create message
// 2. submit to parent (via checkpoint)
// 3. parent routes to destination
// 4. destination subnet executes
// 5. result can flow back

// Example: Fund transfer
// subnet_A → subnet_B (both children of mainnet):
// 1. user calls Release() in subnet_A
//    - FIL locked in subnet_A
// 2. checkpoint to mainnet
// 3. mainnet Gateway routes
// 4. subnet_B's Gateway receives
// 5. Release() in subnet_B
//    - FIL released to user
// Time: ~2 checkpoint periods

// Hierarchical Messages:
// - messages traverse tree
// - intermediate hops
// - bottom-up + top-down
// - path-based routing

// Validator Rotation:
// - subnet can update validators
// - via SubnetActor governance
// - parent chain enforces
// - slashing preserved

// Finality inheritance:
// - subnet: local finality (e.g., 1s with Tendermint)
// - parent checkpoint: inherits parent's finality
// - after checkpoint: final
// - mainnet 7.5h (EC) or 2-5min (F3)

// Security Model:
// - subnet security: 2/3+ of its validators honest
// - parent security: parent's consensus
// - composition: min(child, parent) security
// - final anchor: Filecoin mainnet

// 장점:
// - specialized chains
// - composable security
// - hierarchical scaling
// - flexible consensus
// - interoperability

// 단점:
// - checkpoint delay
// - validator coordination
// - complexity
// - cross-subnet latency`}
        </pre>
        <p className="leading-7">
          Checkpointing: <strong>subnet state → parent anchor + cross-messages</strong>.<br />
          bottom-up (commit) + top-down (command) messages.<br />
          hierarchical security: local + parent + mainnet anchor.
        </p>
      </div>
    </section>
  );
}
