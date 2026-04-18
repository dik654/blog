import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import BaseFeeViz from './viz/BaseFeeViz';
import { DESIGN_CHOICES, FEE_COMPONENTS } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EIP-1559 가스 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EIP-1559 이전, 이더리움의 수수료 시장은 first-price auction이었다.<br />
          사용자가 원하는 가격을 입찰하고, 마이너가 높은 입찰을 우선 선택했다.<br />
          적정가를 알 수 없어 과다 입찰이 빈번했고, 가격 예측이 불가능했다.
        </p>
        <p className="leading-7">
          EIP-1559는 <strong>base fee</strong>를 도입하여 이 문제를 해결했다.<br />
          프로토콜이 블록 가스 사용률에 따라 base fee를 자동 조정한다.<br />
          사용률이 50% 타깃을 초과하면 인상, 미달이면 인하한다.<br />
          base fee는 소각(burn)되어 ETH 공급을 줄인다.
        </p>
        <p className="leading-7">
          사용자는 <code>max_fee_per_gas</code>(지불 의사 상한)와 <code>max_priority_fee_per_gas</code>(팁)를 설정한다.<br />
          base fee는 소각되고, 팁만 검증자에게 지급된다.<br />
          Reth는 이 계산을 <code>u128</code> 정수 산술로 구현하여 Geth 대비 GC 부담을 제거했다.
        </p>

        {/* ── EIP-1559 파라미터 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BaseFeeParams — 2가지 핵심 파라미터</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">BaseFeeParams</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">elasticity_multiplier: <code className="text-foreground/80">u128</code></p>
              <p className="text-xs text-foreground/60 leading-relaxed">블록이 얼마나 "신축적"인가. 메인넷 값 <strong className="text-foreground/80">2</strong> — <code>gas_limit = 2 * gas_target</code>. gas_target이 블록의 "편안한 사용률", gas_limit은 상한</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">base_fee_change_denominator: <code className="text-foreground/80">u128</code></p>
              <p className="text-xs text-foreground/60 leading-relaxed">base fee 변동 속도 조절 (역수). 메인넷 값 <strong className="text-foreground/80">8</strong> — 블록마다 최대 12.5% 변동. 값이 클수록 변동 완만</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="font-mono text-xs text-amber-400 mb-1">ethereum() 메인넷 상수</p>
            <p className="text-xs text-foreground/60">elasticity = 2, denominator = 8</p>
          </div>
          <div className="space-y-1 text-xs text-foreground/50">
            <p><code>gas_target</code> = gas_limit / elasticity = gas_limit / 2</p>
            <p><code>max_delta_per_block</code> = base_fee / denominator = base_fee / 8 (12.5%)</p>
            <p>메인넷: gas_limit = 30M, gas_target = 15M, max variation = base_fee * 0.125 per block</p>
          </div>
        </div>
        <p className="leading-7">
          2개 파라미터로 전체 수수료 시장 동작 결정.<br />
          <code>elasticity=2</code>: 블록이 target의 2배까지 확장 가능 (혼잡 시 버퍼).<br />
          <code>denominator=8</code>: 12.5% per block 변동 제한 — 빠른 반응성과 안정성의 균형.
        </p>

        {/* ── burn 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">base_fee 소각 — 통화 정책 효과</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">TX 실행 시 수수료 분배</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">소각 (burn)</p>
              <p className="text-xs text-foreground/60"><code>gas_used * base_fee</code> — 영원히 제거</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">검증자 수입</p>
              <p className="text-xs text-foreground/60"><code>gas_used * priority_fee</code> — 검증자에게 지급</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">예시: 복잡한 TX (gas_used = 200,000)</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/60">
              <p>base_fee = 30 gwei, priority_fee = 2 gwei</p>
              <p>&nbsp;</p>
              <p>소각량: 200K * 30 gwei = <strong className="text-red-400">0.006 ETH</strong></p>
              <p>검증자: 200K * 2 gwei = <strong className="text-emerald-400">0.0004 ETH</strong></p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">ETH 공급 영향 (Merge 이후)</p>
            <div className="space-y-1 text-xs text-foreground/60">
              <p>PoS 신규 발행: ~0.5 ETH/block (~1M ETH/year)</p>
              <p>활발한 시기: 소각 &gt; 발행 — deflationary</p>
              <p>한산한 시기: 소각 &lt; 발행 — inflationary</p>
              <p className="text-foreground/50">통계: ~950K 발행, ~800K 소각, 순 +150K ETH/year (~0.1% 인플레이션)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          EIP-1559의 <strong>burn 메커니즘</strong>이 ETH에 디플레이션 압력을 부여.<br />
          블록 수요가 많을수록 더 많이 소각 → ETH 희소성 증가.<br />
          "ultrasound money" 내러티브의 기반 — 네트워크 사용이 곧 통화 공급 수축.
        </p>

        {/* ── 수수료 시장 동역학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">수수료 시장 피드백 루프</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-2">혼잡기 (NFT 민팅, airdrop)</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p>1. 사용자 요청 급증 (gas_used &#8594; gas_limit)</p>
                <p>2. gas_used &gt; gas_target (15M)</p>
                <p>3. 다음 블록 base_fee <strong className="text-red-400">+12.5%</strong></p>
                <p>4. 비용 부담 증가 &#8594; 일부 지연/취소</p>
                <p>5. gas_used 감소 &#8594; target 수렴</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-2">한산기 (주말 UTC 새벽)</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p>1. 사용자 요청 감소 (gas_used &lt; target)</p>
                <p>2. 다음 블록 base_fee <strong className="text-emerald-400">-12.5%</strong></p>
                <p>3. 사용 비용 하락 &#8594; 추가 수요 유도</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs text-foreground/50">균형점: <code>gas_used == gas_target</code> (항상). base_fee는 "현재 수요의 지표"</p>
            <p className="text-xs text-foreground/50 mt-1">12.5% 변동 제한: 10배 변동에 ~20 블록 (~4분) — 급작스런 가격 폭등 완화</p>
          </div>
        </div>
        <p className="leading-7">
          EIP-1559가 만든 <strong>수수료 시장의 자동 조절</strong>.<br />
          수요 증가 → 가격 상승 → 수요 감소 (elasticity)라는 경제 법칙을 온체인 구현.<br />
          12.5% 변동 제한이 안정성 보장 — 급작스런 가격 변동 방지.
        </p>

        {/* ── TX 타입별 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 타입별 effective_gas_price</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-2">사용자 설정 3가지 값 (EIP-1559 TX)</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-indigo-400">max_fee_per_gas</p>
              <p className="text-[11px] text-foreground/50">절대 지불 상한</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-amber-400">max_priority_fee_per_gas</p>
              <p className="text-[11px] text-foreground/50">검증자 팁 상한</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-emerald-400">base_fee_per_gas</p>
              <p className="text-[11px] text-foreground/50">프로토콜 결정</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-foreground/70 mb-1">Legacy | Eip2930</p>
              <p className="text-xs text-foreground/60">effective_price = <code>tx.gas_price</code> (고정)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-foreground/70 mb-1">Eip1559 | Eip4844</p>
              <p className="text-xs text-foreground/60">effective_price = <code>min(max_fee, base_fee + max_priority_fee)</code></p>
              <p className="text-xs text-foreground/50 mt-1">effective_tip = effective_price - base_fee</p>
            </div>
          </div>

          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">예시: max_fee=100, max_priority=3, base_fee=30 (gwei)</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/60">
              <p>effective_price = <strong className="text-foreground/80">33</strong></p>
              <p>effective_tip = <strong className="text-emerald-400">3</strong> (검증자)</p>
              <p>burn = <strong className="text-red-400">30</strong> (소각)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>effective_gas_price</code>가 실제 사용자가 지불하는 총 가격.<br />
          <code>max_fee</code>가 <strong>사용자의 절대 상한</strong> — 이 값 이하로만 지불.<br />
          <code>max_priority_fee</code>는 팁 상한 — 검증자가 TX 포함하는 인센티브.
        </p>
      </div>

      {/* 수수료 구성 요소 */}
      <h3 className="text-lg font-semibold mb-3">수수료 구성 요소</h3>
      <div className="not-prose grid grid-cols-3 gap-3 mb-6">
        {FEE_COMPONENTS.map(f => (
          <div key={f.label} className="rounded-lg border border-border p-3" style={{ borderLeftWidth: 3, borderLeftColor: f.color }}>
            <p className="font-mono font-bold text-sm" style={{ color: f.color }}>{f.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><BaseFeeViz /></div>
    </section>
  );
}
