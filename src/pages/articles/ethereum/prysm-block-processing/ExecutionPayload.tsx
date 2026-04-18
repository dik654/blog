import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ExecutionPayload({ onCodeRef }: Props) {
  return (
    <section id="execution-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 페이로드 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validate-execution', codeRefs['validate-execution'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateExecutionOnBlock()</span>
        </div>

        {/* ── ExecutionPayload 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExecutionPayload — CL과 EL의 데이터 경계</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">ExecutionPayload 구조체 (The Merge 이후)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div><code className="text-indigo-300">parent_hash: Hash32</code> <span className="text-foreground/60">— EL block parent</span></div>
                <div><code className="text-indigo-300">fee_recipient: ExecutionAddress</code> <span className="text-foreground/60">— 수수료 수신 주소</span></div>
                <div><code className="text-indigo-300">state_root: Bytes32</code> <span className="text-foreground/60">— EL state root (post-execution)</span></div>
                <div><code className="text-indigo-300">prev_randao: Bytes32</code> <span className="text-foreground/60">— CL에서 제공한 RANDAO</span></div>
                <div><code className="text-indigo-300">block_number: uint64</code></div>
                <div><code className="text-indigo-300">gas_limit / gas_used: uint64</code></div>
                <div><code className="text-indigo-300">timestamp: uint64</code> <span className="text-foreground/60">— CL slot timestamp과 일치 필수</span></div>
              </div>
              <div className="space-y-1">
                <div><code className="text-indigo-300">base_fee_per_gas: uint256</code></div>
                <div><code className="text-indigo-300">block_hash: Hash32</code></div>
                <div><code className="text-indigo-300">transactions: List[Transaction, 1M]</code></div>
                <div><code className="text-indigo-300">withdrawals: List[Withdrawal, 16]</code> <span className="text-foreground/60">(Capella+)</span></div>
                <div><code className="text-indigo-300">blob_gas_used: uint64</code> <span className="text-foreground/60">(Deneb+)</span></div>
                <div><code className="text-indigo-300">excess_blob_gas: uint64</code> <span className="text-foreground/60">(Deneb+)</span></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">CL의 역할</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>payload 유효성 기본 검증 (timestamp, slot 일치)</div>
                <div>EL에 payload 전달 (<code>engine_newPayload</code> API)</div>
                <div>EL의 VALID/INVALID/SYNCING 응답 처리</div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">EL의 역할</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>EVM 실행</div>
                <div>state_root 재계산 및 검증</div>
                <div>모든 TX 검증 + 실행 결과 반환</div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ExecutionPayload</code>가 <strong>CL ↔ EL 데이터 경계</strong>.<br />
          CL 블록 내에 EL 블록 전체 포함 → 단일 블록 구조.<br />
          CL은 구조만 검증, 실제 실행은 EL에 위임.
        </p>

        {/* ── validateExecutionOnBlock ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">validateExecutionOnBlock — EL 호출 흐름</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>validateExecutionOnBlock(ctx, state, block)</code></p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', label: 'CL 내부 consistency check', detail: 'payload.Timestamp == slotToTimestamp(block.Slot) + PrevRandao == getRandaoMix(currentEpoch)' },
                { step: '2', label: 'EL parent check', detail: 'payload.ParentHash == state.LatestExecutionPayloadHeader.BlockHash' },
                { step: '3', label: 'Engine API 호출', detail: 'engineClient.NewPayload(ctx, payload, blob_versioned_hashes, parent_beacon_block_root)' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                    <p className="text-foreground/60"><code>{s.detail}</code></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { status: 'VALID', desc: 'payload 유효 → 진행', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { status: 'INVALID', desc: 'EL이 거부 → 에러', color: 'border-red-500/20 bg-red-500/5' },
              { status: 'SYNCING', desc: 'optimistic 수락', color: 'border-amber-500/20 bg-amber-500/5' },
              { status: 'ACCEPTED', desc: 'side chain 수락', color: 'border-sky-500/20 bg-sky-500/5' },
            ].map(s => (
              <div key={s.status} className={`rounded-lg border p-3 ${s.color}`}>
                <p className="text-xs font-bold">{s.status}</p>
                <p className="text-xs text-foreground/60">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Optimistic Sync</p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>EL이 SYNCING → CL은 블록을 "optimistically valid"로 표시</div>
              <div>EL sync 완료 후 재검증 → INVALID 판정 시 블록 무효화 + reorg</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>validateExecutionOnBlock</code>이 <strong>CL → EL 게이트웨이</strong>.<br />
          Engine API의 newPayload 호출 → VALID/INVALID/SYNCING 처리.<br />
          Optimistic sync로 EL 지연 시에도 CL 계속 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Optimistic Sync</strong> — EL이 SYNCING을 반환하면 CL은 블록을 낙관적으로 수락.<br />
          이후 EL 동기화 완료 시 재검증하여 최종 확정.<br />
          VALID/INVALID/SYNCING 3가지 응답 상태로 분기.
        </p>
      </div>
    </section>
  );
}
