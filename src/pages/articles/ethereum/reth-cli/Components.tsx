import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentsViz from './viz/ComponentsViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_DETAILS } from './ComponentsData';

export default function Components({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeComponents trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          노드의 4개 핵심 기능을 각각 독립된 trait으로 정의한다.<br />
          associated type으로 선언되므로, 하나를 교체해도 나머지에 영향을 주지 않는다.<br />
          이것이 Reth가 "교체 가능한 컴포넌트"를 실현하는 핵심 메커니즘이다.{' '}
          <CodeViewButton onClick={() => open('node-components')} />
        </p>
        <p className="leading-7">
          L2 커스터마이징 시 이 구조의 장점이 드러난다.<br />
          op-reth는 <code>Evm</code> trait만 <code>OpEvmConfig</code>로 교체하여 L1 deposit 트랜잭션과 L1Block 프리컴파일을 처리한다.<br />
          Pool, Consensus, Network는 메인넷 기본 impl을 그대로 쓴다.{' '}
          <CodeViewButton onClick={() => open('components-struct')} />
        </p>

        {/* ── ConfigureEvm trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ConfigureEvm trait — EVM 환경 구성</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2"><code>ConfigureEvm</code> trait — 3개 핵심 메서드</p>
            <div className="space-y-2">
              {[
                { method: 'fill_block_env(&self, block_env, header, after_merge)', desc: 'BlockEnv 설정 (block-level context)' },
                { method: 'fill_tx_env(&self, tx_env, tx, sender)', desc: 'TxEnv 설정 (tx-level context)' },
                { method: 'evm<DB: Database>(&self, db) -> Evm', desc: 'revm Evm 인스턴스 생성' },
              ].map(m => (
                <div key={m.method} className="rounded border border-border/40 px-3 py-2">
                  <code className="text-xs">{m.method}</code>
                  <p className="text-xs text-foreground/60 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1"><code>EthEvmConfig</code></p>
              <p className="text-xs text-foreground/70"><code>chain_spec: Arc&lt;ChainSpec&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">표준 이더리움 EVM 환경</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1"><code>OpEvmConfig</code></p>
              <p className="text-xs text-foreground/70"><code>chain_spec: Arc&lt;OpChainSpec&gt;</code>, <code>l1_block_info: Arc&lt;L1BlockInfo&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">
                OP 확장: deposit TX가 아닌 경우 <code>TxEnv::optimism</code>에 L1 fee 메타데이터 (<code>fee_overhead</code>, <code>fee_scalar</code>, <code>base_fee</code>) 주입
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ConfigureEvm</code> trait이 <strong>EVM 실행 환경을 추상화</strong>.<br />
          각 체인이 자체 <code>fill_tx_env</code> 구현 → EVM에 체인 특화 컨텍스트 주입.<br />
          OP는 L1 fee 정보를 <code>TxEnv::optimism</code>에 추가 → revm이 L1 비용 계산에 사용.
        </p>

        {/* ── Consensus trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Consensus trait — 블록 검증 규칙</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2"><code>Consensus</code> trait — 4단계 검증</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { method: 'validate_header', desc: '단일 헤더 검증 (부모 없이)' },
                { method: 'validate_header_against_parent', desc: '헤더 + 부모 비교' },
                { method: 'validate_block', desc: '블록 전체 (헤더 + 바디 정합)' },
                { method: 'validate_block_post_execution', desc: 'gas_used, receipts_root 등' },
              ].map(m => (
                <div key={m.method} className="rounded border border-border/40 px-3 py-2">
                  <code className="text-[11px] font-bold">{m.method}</code>
                  <p className="text-[11px] text-foreground/60 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1"><code>EthBeaconConsensus</code></p>
              <p className="text-xs text-foreground/50 mb-1">메인넷 PoS</p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>PoW 필드 검증 (<code>difficulty=0</code>)</li>
                <li><code>gas_limit</code> 변동 제한 (1/1024)</li>
                <li>base_fee 계산 검증 (EIP-1559)</li>
                <li><code>extra_data</code> 32 bytes 제한</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1"><code>OpConsensus</code></p>
              <p className="text-xs text-foreground/50 mb-1">Optimism (시퀀서)</p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>시퀀서 서명 검증</li>
                <li>deposit TX 우선 처리 확인</li>
                <li>L1 attributes TX 존재 확인</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1"><code>AutoSealConsensus</code></p>
              <p className="text-xs text-foreground/50 mb-1">테스트넷</p>
              <p className="text-xs text-foreground/70">자동 블록 생성</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>Consensus</code> trait이 <strong>체인별 검증 규칙 캡슐화</strong>.<br />
          메인넷은 PoS 규칙, OP는 시퀀서 기반 규칙, 테스트넷은 자동 생성.<br />
          같은 <code>validate_*</code> API로 모든 체인 검증 통합.
        </p>

        {/* ── Pool trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TransactionPool & Network — 나머지 컴포넌트</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2"><code>TransactionPool</code></p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li><code>type Transaction: PoolTransaction</code></li>
                <li><code>add_transaction(origin, tx) → TxHash</code></li>
                <li><code>best_transactions() → Iterator</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2"><code>NetworkHandle</code></p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li><code>peer_count() → usize</code></li>
                <li><code>connect_peer(addr)</code></li>
                <li><code>broadcast_transaction(tx)</code></li>
                <li><code>broadcast_block(block)</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">의존 관계</p>
            <div className="flex flex-col items-center gap-1 text-sm">
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted"><code>NodeTypes</code> — 체인 정의 (mainnet / OP)</span>
              <span className="text-foreground/40">↓</span>
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted"><code>NodeComponents</code> — Pool + Evm + Consensus + Network</span>
              <span className="text-foreground/40">↓</span>
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted"><code>NodeBuilder</code> — 조립 + 실행</span>
            </div>
            <p className="text-xs text-foreground/60 mt-3">
              각 trait 독립적: Pool 교체 시 Evm/Consensus/Network 영향 없음. 테스트 시 <code>MockNetwork</code>, <code>NoopPool</code> 사용 가능.
            </p>
          </div>
        </div>
        <p className="leading-7">
          4개 trait이 <strong>독립적으로 교체 가능</strong>.<br />
          특정 trait만 커스텀 구현 → 나머지 Reth 기본 재사용.<br />
          이 모듈성이 Reth의 "EL 클라이언트 라이브러리" 포지셔닝 지원.
        </p>
      </div>

      {/* Interactive trait detail cards */}
      <h3 className="text-lg font-semibold mb-3">4개 핵심 trait</h3>
      <div className="not-prose space-y-2 mb-6">
        {TRAIT_DETAILS.map(t => (
          <motion.div key={t.id}
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === t.id ? t.color : 'var(--color-border)',
              background: expanded === t.id ? `${t.color}08` : undefined,
            }}
            animate={{ opacity: expanded === t.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              <span className="font-mono font-bold text-sm">{t.assocType}</span>
              <span className="text-xs text-muted-foreground">: {t.bound}</span>
            </div>
            <AnimatePresence>
              {expanded === t.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{t.role}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">기본값:</span> {t.defaultImpl}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      커스텀 예시: {t.customExample}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <ComponentsViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
