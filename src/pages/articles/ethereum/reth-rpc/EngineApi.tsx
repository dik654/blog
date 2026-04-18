import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EngineDetailViz from './viz/EngineDetailViz';
import { ENGINE_METHODS } from './EngineApiData';

export default function EngineApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const sel = ENGINE_METHODS.find(m => m.id === activeMethod);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API (CL 연동)</h2>
      <div className="not-prose mb-8"><EngineDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-engine-api', codeRefs['rpc-engine-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EngineApi 전체</span>
        </div>
        <p className="leading-7">
          The Merge 이후, EL과 CL은 Engine API라는 JSON-RPC 인터페이스로 통신한다.<br />
          이 API가 canonical chain(정식 체인)을 결정하는 유일한 경로다.<br />
          CL이 fork choice를 결정하면 EL에 통보하고, EL은 블록을 검증하거나 빌드한다.
        </p>
        <p className="leading-7">
          Engine API는 3개의 핵심 메서드로 구성된다.<br />
          아래 카드를 클릭하면 각 메서드의 역할과 데이터 흐름을 확인할 수 있다.
        </p>

        {/* ── Engine API 타임라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine API 호출 타임라인 — 12초 슬롯</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">12초 슬롯 타임라인</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">T=0s</span>
                <span className="text-foreground/80"><code>forkchoiceUpdatedV3(state, payload_attrs)</code> — head 결정 + 블록 생성 시작(validator)</span>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">T=4s</span>
                <span className="text-foreground/80"><code>getPayloadV3(payload_id)</code> — 완성된 블록 수신</span>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-foreground/20 pl-3">
                <span className="font-mono text-xs text-foreground/50 shrink-0">T=6s</span>
                <span className="text-foreground/70">attestation 전파 (CL 내부, EL 관여 안 함)</span>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">T=12s</span>
                <span className="text-foreground/80"><code>newPayloadV3(payload, blob_hashes)</code> → 블록 실행 & 검증 → FCU로 head 업데이트</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">getPayload</p><p className="text-xs text-green-500">~300ms (예산 500ms)</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">newPayload</p><p className="text-xs text-green-500">~500ms (예산 1~2s)</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">FCU</p><p className="text-xs text-green-500">~50ms</p></div>
          </div>
        </div>
        <p className="leading-7">
          12초 슬롯 안에 <strong>3번의 Engine API 호출</strong>이 일어남.<br />
          getPayload가 가장 시간 예산 빡빡 (~500ms) — 블록 생성 완료 필요.<br />
          Reth의 낮은 지연이 validator 안정성에 직접 기여.
        </p>

        {/* ── newPayload 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_newPayloadV3 — 블록 검증 흐름</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">new_payload_v3 — 블록 검증 흐름</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
              <span className="text-foreground/80"><code>try_payload_to_block(payload)</code> → <code>SealedBlock</code> 변환. 실패 시 <code>Invalid</code>.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">2</span>
              <span className="text-foreground/80">부모 블록 확인. 없으면 <code>Syncing</code> 반환 + 백그라운드 다운로드.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">3</span>
              <span className="text-foreground/80"><code>blockchain_tree.insert_block()</code> → <code>Valid</code>(canonical) / <code>Accepted</code>(side chain) / <code>Invalid</code>(거부).</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
            <div className="rounded border border-green-500/30 bg-green-500/5 p-1.5 text-green-500">Valid</div>
            <div className="rounded border border-red-500/30 bg-red-500/5 p-1.5 text-red-400">Invalid</div>
            <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-1.5 text-yellow-500">Syncing</div>
            <div className="rounded border border-blue-500/30 bg-blue-500/5 p-1.5 text-blue-500">Accepted</div>
          </div>
        </div>
        <p className="leading-7">
          <code>new_payload_v3</code>가 <strong>블록 게이트키퍼</strong>.<br />
          포맷 → 부모 확인 → 실행 검증 → 상태 반환 순서.<br />
          Invalid 반환 시 CL이 해당 블록 fork에서 배제.
        </p>

        {/* ── FCU 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_forkchoiceUpdatedV3 — head 업데이트</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">forkchoice_updated_v3 — head 업데이트</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
              <span className="text-foreground/80">head 블록 존재 확인. 없으면 <code>ForkchoiceUpdated::syncing()</code>.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">2</span>
              <span className="text-foreground/80"><code>make_canonical(head_block_hash)</code>로 canonical chain 업데이트.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">3</span>
              <span className="text-foreground/80"><code>finalized</code>/<code>safe</code> 블록 표시.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">4</span>
              <span className="text-foreground/80"><code>payload_attrs</code> 있으면 → validator → <code>payload_builder.new_job()</code>으로 블록 생성 시작.</span>
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2"><code>payload_attrs: Some</code> = 블록 제안자 / <code>None</code> = 일반 노드(head 업데이트만).</p>
        </div>
        <p className="leading-7">
          <code>forkchoiceUpdated</code>가 <strong>canonical chain 결정의 순간</strong>.<br />
          head/safe/finalized 3가지 지점 갱신 → BlockchainTree 상태 변경.<br />
          <code>payload_attrs</code> 유무로 validator 여부 판단 → 블록 생성 트리거.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {ENGINE_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setActiveMethod(activeMethod === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeMethod === m.id ? m.color : 'var(--color-border)',
              background: activeMethod === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.direction}</p>
            <p className="text-xs text-foreground/60 mt-1">{m.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Engine API가 canonical chain을 결정한다</strong> — FCU의 headBlockHash가 정식 head를 지정.
          new_payload의 검증 결과가 INVALID이면 해당 블록은 포크에서 제외된다.<br />
          EL은 CL의 지시 없이 자체적으로 canonical chain을 변경하지 않는다.
        </p>
      </div>
    </section>
  );
}
