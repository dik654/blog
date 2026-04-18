import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EngineDetailViz from './viz/EngineDetailViz';
import { ENGINE_STEPS, TRAIT_DESIGNS } from './EngineApiData';
import type { CodeRef } from '@/components/code/types';

export default function EngineApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('engine_forkchoiceUpdatedV3');
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 연동</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Engine API는 CL(비콘 노드)과 EL(실행 노드) 사이의 JSON-RPC 인터페이스다.<br />
          세 가지 핵심 메서드가 블록 생명주기를 관장한다.<br />
          <code>forkchoiceUpdated</code>가 canonical 체인을 갱신하고 빌드를 시작하며, <code>getPayload</code>가 결과를 수집하고, <code>newPayload</code>가 검증을 수행한다.
        </p>
        <p className="leading-7">
          Reth에서 <code>on_forkchoice_updated()</code>는 두 가지 일을 한다.<br />
          먼저 <code>head_block_hash</code>로 canonical 헤더를 찾아 체인을 갱신한다.<br />
          그 다음, <code>payload_attributes</code>가 있으면 PayloadBuilder에 새 작업을 전달한다.<br />
          <code>payload_id</code>를 발급하여 나중에 GetPayload로 결과를 조회할 수 있게 한다.
        </p>
        <p className="leading-7">
          <strong>trait 기반 교체:</strong> <code>PayloadBuilder</code>는 trait이다.<br />
          기본 구현은 tip 순 정렬이지만, Flashbots의 rbuilder가 이 trait을 구현하면 MEV 수익 최적화 블록을 생성할 수 있다.
        </p>

        {/* ── PayloadId 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PayloadId — 빌드 작업 식별</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">payload_id() 해시 입력</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">parent_hash</code></li>
              <li><code className="text-xs">timestamp</code> + <code className="text-xs">prev_randao</code> + <code className="text-xs">fee_recipient</code></li>
              <li><code className="text-xs">withdrawals</code> (각 index, validator_index, address, amount)</li>
              <li><code className="text-xs">parent_beacon_block_root</code> (Cancun)</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">SHA-256 → <strong>첫 8바이트</strong>만 PayloadId로 사용</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">특성</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>같은 attrs → 같은 payload_id (<strong>결정적</strong>)</li>
              <li>attrs 하나라도 변경 → 다른 payload_id</li>
              <li>CL 재요청 시 캐시 히트 가능</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2"><code className="text-xs">PayloadStore: HashMap&lt;PayloadId, PayloadJob&gt;</code></p>
          </div>
        </div>
        <p className="leading-7">
          <code>PayloadId</code>는 <strong>결정적 해시</strong> — 같은 attrs에 같은 ID.<br />
          CL이 같은 attrs로 재요청 시 EL이 기존 PayloadJob 재사용 가능.<br />
          attrs 변경 (예: fee_recipient 바꿈) → 새 PayloadId → 새 Job 생성.
        </p>

        {/* ── continuous building ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Continuous Building — 점진적 개선</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">run_payload_job() 루프</p>
            <div className="space-y-1 text-sm text-foreground/80 leading-relaxed">
              <p>매 <strong>500ms</strong>마다 반복:</p>
              <div className="flex flex-wrap gap-1 text-xs text-foreground/70 mt-1">
                <span className="rounded bg-muted/40 px-2 py-1">취소 확인</span>
                <span className="text-foreground/30">&rarr;</span>
                <span className="rounded bg-muted/40 px-2 py-1">best_transactions()</span>
                <span className="text-foreground/30">&rarr;</span>
                <span className="rounded bg-muted/40 px-2 py-1">build_block()</span>
                <span className="text-foreground/30">&rarr;</span>
                <span className="rounded bg-muted/40 px-2 py-1">fees 비교 → 교체</span>
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-2">GetPayload → <code className="text-xs">cancel.cancel()</code> → 루프 종료 → best 반환</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">개선 전략 4가지</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>TX 조합 변경 — 다른 sender 우선 시도</li>
              <li>Bundle 통합 — MEV 번들 추가</li>
              <li>gas 사용 극대화 — 더 많은 TX 포함</li>
              <li>priority 재평가 — base_fee 변동 반영</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Continuous building이 <strong>시간 내 최대 수익</strong>을 달성.<br />
          500ms마다 새 조합 시도 → 더 높은 수익 블록 발견 시 교체.<br />
          GetPayload 호출이 "그만 빌드" 시그널 — 취소 후 best_payload 반환.
        </p>

        {/* ── fee recipient ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">fee_recipient — 블록 수익 수취</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">1. Self-build (자체 빌드)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              CL이 validator에게 block 제안 권한 부여.<br />
              <code className="text-xs">fee_recipient</code> = validator 주소.<br />
              모든 priority_fee가 validator로 직접 전달.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">2. MEV-Boost (외부 빌더)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              relay가 builder(rbuilder, flashbots)에게서 bid 수집.<br />
              validator가 최고 bid block 선택.<br />
              builder → validator에게 bid 금액 지급.
            </p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">MEV-Boost 흐름</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
              <span className="rounded bg-muted/40 px-2 py-1">CL → EL: FCU (fallback 빌드)</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">validator → relay: getHeader()</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">relay → builders: getBestBlock()</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">relay → validator: 최고 header</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">validator → CL: signed block</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          validator는 <strong>self-build 또는 MEV-Boost</strong> 중 선택.<br />
          Self-build: EL이 빌드한 블록 사용 (간단, 수익 제한).<br />
          MEV-Boost: 외부 builder 블록 사용 (복잡, 수익 극대화).
        </p>
      </div>

      <div className="not-prose mb-6"><EngineDetailViz /></div>

      {/* Engine API 메서드 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">Engine API 핵심 메서드</h3>
      <div className="not-prose space-y-2 mb-6">
        {ENGINE_STEPS.map(s => {
          const isOpen = expanded === s.method;
          return (
            <div key={s.method} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : s.method)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm" style={{ color: s.color }}>{s.method}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.direction} / {s.payload}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{s.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 설계 Q&A */}
      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="space-y-2 mb-6">
        {TRAIT_DESIGNS.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('forkchoice-updated', codeRefs['forkchoice-updated'])} />
        <span className="text-[10px] text-muted-foreground self-center">on_forkchoice_updated()</span>
      </div>
    </section>
  );
}
