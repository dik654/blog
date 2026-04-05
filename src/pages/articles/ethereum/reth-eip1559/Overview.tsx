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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct BaseFeeParams {
    /// elasticity: 블록이 얼마나 "신축적"인가
    /// 메인넷: 2 → gas_limit = 2 × gas_target
    /// gas_target이 블록의 "편안한 사용률", gas_limit은 상한
    pub elasticity_multiplier: u128,

    /// base fee 변동 속도 조절 (역수)
    /// 메인넷: 8 → 블록마다 최대 12.5% 변동
    /// 값이 클수록 변동 완만 → 안정성 vs 반응성 trade-off
    pub base_fee_change_denominator: u128,
}

// 메인넷 상수
impl BaseFeeParams {
    pub const fn ethereum() -> Self {
        Self {
            elasticity_multiplier: 2,
            base_fee_change_denominator: 8,
        }
    }
}

// 공식 이해:
// gas_target = gas_limit / elasticity       = gas_limit / 2
// max_delta_per_block = base_fee / denominator = base_fee / 8 (12.5%)

// 메인넷 현재 값:
// gas_limit = 30,000,000 (30M)
// gas_target = 15,000,000 (15M)
// max variation = base_fee × 0.125 per block`}
        </pre>
        <p className="leading-7">
          2개 파라미터로 전체 수수료 시장 동작 결정.<br />
          <code>elasticity=2</code>: 블록이 target의 2배까지 확장 가능 (혼잡 시 버퍼).<br />
          <code>denominator=8</code>: 12.5% per block 변동 제한 — 빠른 반응성과 안정성의 균형.
        </p>

        {/* ── burn 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">base_fee 소각 — 통화 정책 효과</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TX 실행 시 수수료 분배
// - gas_used × base_fee → 🔥 소각 (영원히 제거)
// - gas_used × priority_fee → 검증자에게 지급

// 예시: 복잡한 TX 실행
// gas_used = 200,000
// base_fee = 30 gwei
// priority_fee = 2 gwei
//
// 소각량: 200,000 × 30e9 = 6_000_000_000_000_000 wei = 0.006 ETH (🔥)
// 검증자 수입: 200,000 × 2e9 = 400_000_000_000_000 wei = 0.0004 ETH

// 소각이 ETH 공급에 미치는 영향:
// - PoS 전환 이후 신규 발행: ~0.5 ETH per block (~1M ETH/year)
// - EIP-1559 소각: 변동 (블록 수요에 따라)
// - 활발한 시기: 소각 > 발행 → ETH 공급 감소 (deflationary)
// - 한산한 시기: 소각 < 발행 → ETH 공급 증가 (inflationary)
//
// 2022년 The Merge 이후 통계:
// - ~950K ETH 발행
// - ~800K ETH 소각
// - 순 변동: +150K ETH/year (~0.1% 연간 인플레이션)`}
        </pre>
        <p className="leading-7">
          EIP-1559의 <strong>burn 메커니즘</strong>이 ETH에 디플레이션 압력을 부여.<br />
          블록 수요가 많을수록 더 많이 소각 → ETH 희소성 증가.<br />
          "ultrasound money" 내러티브의 기반 — 네트워크 사용이 곧 통화 공급 수축.
        </p>

        {/* ── 수수료 시장 동역학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">수수료 시장 피드백 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 수수료 시장의 자동 조절 메커니즘
//
// 상황 1: 혼잡기 (NFT 민팅, airdrop 클레임)
// ┌─────────────────────────────────────┐
// │ 사용자 요청 급증 (gas_used → gas_limit) │
// │         ↓                           │
// │ gas_used > gas_target (15M)         │
// │         ↓                           │
// │ 다음 블록 base_fee +12.5%            │
// │         ↓                           │
// │ 사용자 비용 부담 증가                  │
// │         ↓                           │
// │ 일부 사용자 요청 지연/취소             │
// │         ↓                           │
// │ gas_used 감소 → target 수렴           │
// └─────────────────────────────────────┘
//
// 상황 2: 한산기 (주말 UTC 새벽)
// ┌─────────────────────────────────────┐
// │ 사용자 요청 감소 (gas_used < target) │
// │         ↓                           │
// │ 다음 블록 base_fee -12.5%            │
// │         ↓                           │
// │ 사용 비용 하락 → 추가 수요 유도         │
// └─────────────────────────────────────┘
//
// 균형점: gas_used == gas_target (항상)
// 베이스피는 "현재 수요의 지표"

// 12.5% 변동 제한의 의미:
// 반응 속도: 10배 변동에 ~20 블록 (~4분) 필요
// → 급작스런 가격 폭등 완화`}
        </pre>
        <p className="leading-7">
          EIP-1559가 만든 <strong>수수료 시장의 자동 조절</strong>.<br />
          수요 증가 → 가격 상승 → 수요 감소 (elasticity)라는 경제 법칙을 온체인 구현.<br />
          12.5% 변동 제한이 안정성 보장 — 급작스런 가격 변동 방지.
        </p>

        {/* ── TX 타입별 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 타입별 effective_gas_price</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 사용자가 설정하는 3가지 값 (EIP-1559 TX)
// - max_fee_per_gas: 절대 지불 상한
// - max_priority_fee_per_gas: 검증자 팁 상한
// - base_fee_per_gas: 블록 base fee (프로토콜이 결정)

// effective_gas_price 계산:
fn effective_gas_price(tx: &Tx, base_fee: u64) -> u64 {
    match tx {
        Legacy | Eip2930 => tx.gas_price,  // 고정 gas price

        Eip1559 | Eip4844 => {
            // min(max_fee, base_fee + max_priority_fee)
            let priority_fee = tx.max_priority_fee_per_gas;
            let effective = base_fee + priority_fee;
            min(effective, tx.max_fee_per_gas)
        }
    }
}

// effective_gas_tip 계산:
fn effective_gas_tip(tx: &Tx, base_fee: u64) -> u64 {
    let effective_price = effective_gas_price(tx, base_fee);
    effective_price - base_fee  // 검증자에게 지급될 부분
}

// 예시:
// 사용자 설정: max_fee = 100 gwei, max_priority_fee = 3 gwei
// base_fee = 30 gwei (현재)
//
// effective_gas_price = min(100, 30 + 3) = 33 gwei
// effective_gas_tip = 33 - 30 = 3 gwei (검증자)
// burn = 30 gwei (소각)
//
// 총 지불: 33 gwei × gas_used
// 검증자 수입: 3 gwei × gas_used
// 소각량: 30 gwei × gas_used`}
        </pre>
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
