import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuilderDetailViz from './viz/BuilderDetailViz';
import type { CodeRef } from '@/components/code/types';
import { BUILD_STEPS } from './BuilderApiData';

export default function BuilderApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = BUILD_STEPS.find(s => s.step === activeStep);

  return (
    <section id="builder-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Builder API 연동</h2>
      <div className="not-prose mb-8"><BuilderDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('mev-builder', codeRefs['mev-builder'])} />
          <span className="text-[10px] text-muted-foreground self-center">MevPayloadBuilder</span>
          <CodeViewButton onClick={() => onCodeRef('mev-build', codeRefs['mev-build'])} />
          <span className="text-[10px] text-muted-foreground self-center">build_payload 비교 로직</span>
        </div>
        <p className="leading-7">
          <strong>MevPayloadBuilder</strong>는 로컬 빌더와 외부 빌더를 래핑하는 구조체다.<br />
          inner(로컬 PayloadBuilder)와 relay_client(릴레이 통신 클라이언트) 두 필드를 가진다.
        </p>
        <p className="leading-7">
          핵심 설계 판단 — 로컬 블록을 먼저 완성한 뒤 외부 입찰과 비교한다.<br />
          이 "로컬 먼저" 패턴 덕분에, 외부 릴레이가 전부 다운되어도 노드는 정상적으로 블록을 제안할 수 있다.<br />
          네트워크 liveness를 절대 해치지 않는 안전한 설계다.
        </p>

        {/* ── rbuilder 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">rbuilder — Reth 기반 MEV 빌더</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// rbuilder: Flashbots가 만든 Rust MEV 빌더
// https://github.com/flashbots/rbuilder
//
// Reth를 라이브러리로 사용 → 블록 실행 엔진 재활용
// builder 전용 로직만 추가 구현

use reth::providers::StateProviderFactory;
use reth_primitives::{Block, Transaction};

pub struct Builder {
    // Reth provider
    state_provider: Arc<dyn StateProviderFactory>,

    // Builder 전용
    bundles: Arc<DashMap<BundleId, Bundle>>,
    block_assembler: BlockAssembler,
    bid_submitter: RelaySubmitter,
}

impl Builder {
    pub async fn build_block(
        &self,
        slot: u64,
        parent_hash: B256,
        attrs: PayloadAttributes,
    ) -> Result<BuiltBlock> {
        // 1. 모든 번들 수집
        let bundles = self.bundles.iter().collect::<Vec<_>>();

        // 2. Reth의 state provider로 초기 상태 로드
        let state = self.state_provider.state_at_block_hash(parent_hash)?;

        // 3. 번들 조합 최적화 (bin packing 변종)
        let best_combo = self.block_assembler.optimize(
            bundles,
            self.public_mempool_txs(),
            attrs.gas_limit,
        ).await?;

        // 4. Reth의 revm으로 실행 & 검증
        let block = execute_and_seal(best_combo, state, &attrs)?;

        // 5. block_value 계산 + relay에 bid 제출
        let value = calculate_builder_profit(&block);
        self.bid_submitter.submit(slot, &block, value).await?;

        Ok(block)
    }
}

// Reth 재사용 요소:
// - state provider
// - revm executor
// - MPT (state_root 계산)
// - RLP encoding
// - chain spec`}
        </pre>
        <p className="leading-7">
          rbuilder가 <strong>Reth의 첫 번째 대규모 downstream 프로젝트</strong>.<br />
          Reth를 라이브러리로 사용 → 블록 실행 엔진 재구현 불필요.<br />
          MEV builder 전용 로직(bundle 수집, 조합 최적화, bid 제출)만 추가.
        </p>

        {/* ── block assembler 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Assembler — NP-hard 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 번들 + 공개 TX 조합 문제
//
// 제약:
// - gas_limit 30M 초과 불가
// - 번들은 atomic (전부 or 전무)
// - TX 간 state 충돌 가능 (예: 같은 Uniswap pool 사용)
// - 번들 간 수익 의존성 (A 실행 시 B 수익 감소 등)
//
// 목표: total_value 최대화

// 완전 탐색: 2^N 조합 (N=번들 수)
// 1000개 번들 → 2^1000 = 불가능

// 근사 알고리즘:
// 1. Greedy: 수익/gas 비율 높은 순으로 선택
// 2. Simulated Annealing: 랜덤 perturbation + 수용 확률
// 3. Beam Search: top K 후보 유지
// 4. Parallel Execution Simulation

// rbuilder의 전략:
// - 여러 algorithm을 병렬 실행
// - 가장 높은 block_value 결과 선택
// - 매 50ms마다 새 결과 생성 (continuous building)

fn bin_packing_greedy(
    bundles: &[Bundle],
    txs: &[Transaction],
    gas_limit: u64,
) -> Block {
    // 1. 수익 기준 정렬
    let mut candidates = bundles.iter().chain(txs.iter())
        .collect::<Vec<_>>();
    candidates.sort_by_key(|c| -c.expected_value() as i64);

    let mut block = Block::new();
    for candidate in candidates {
        if block.gas_used + candidate.gas_limit() > gas_limit { continue; }
        if block.has_conflict(&candidate) { continue; }

        // 시뮬레이션 실행 → 수익 확인
        let simulated = simulate_in_context(&block, candidate);
        if simulated.is_profitable() {
            block.add(candidate);
        }
    }
    block
}`}
        </pre>
        <p className="leading-7">
          블록 조립은 <strong>제약 조건 하 최적화 문제</strong> — NP-hard.<br />
          완전 탐색 불가 → 근사 알고리즘 병렬 실행 후 best 결과 선택.<br />
          50ms마다 새 조합 시도 → slot 시간 내 최대 수익 탐색.
        </p>

        {/* ── Bid 제출 & 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bid 제출 & Validator 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Builder → Relay: bid 제출
POST /relay/v1/builder/blocks
Body: {
  "message": {
    "slot": 12345,
    "parent_hash": "0x...",
    "block_hash": "0x...",
    "builder_pubkey": "0x...",
    "proposer_pubkey": "0x...",
    "proposer_fee_recipient": "0x...",
    "gas_limit": 30000000,
    "gas_used": 29800000,
    "value": "150000000000000000",  // 0.15 ETH bid
  },
  "execution_payload": {  // full block
    "parent_hash": "0x...",
    "transactions": [ ... ],
    "withdrawals": [ ... ]
  },
  "signature": "0x..."  // builder 서명
}

// Builder의 수익 분배:
// - 사용자 priority_fee 수집: 0.20 ETH
// - bid 금액 (validator에게 지급): 0.15 ETH
// - Builder 순이익: 0.05 ETH (MEV + priority fee 일부)

// Relay의 검증:
// 1. 서명 확인 (builder_pubkey)
// 2. value >= min_bid (relay 정책)
// 3. gas_used <= gas_limit
// 4. execution_payload 유효성

// Validator의 선택:
// GET /relay/v1/builder/header (get best bid)
// → relay가 가장 높은 value bid 반환
// → validator가 서명 후 getPayload

// 시간 게임:
// - 빌더: 늦을수록 더 많은 번들 수집 가능 (수익 ↑)
// - 하지만 너무 늦으면 validator가 self-build 선택
// - 약 3~4초가 균형점`}
        </pre>
        <p className="leading-7">
          Builder는 <strong>bid 금액으로 validator 유혹</strong>.<br />
          builder의 수익 = total_mev - validator_bid → 더 많이 양보하면 validator에 더 많이 선택됨.<br />
          시간 게임: 늦게 제출 = 더 많은 MEV, 하지만 timeout 위험.
        </p>
      </div>

      {/* Build steps */}
      <h3 className="text-lg font-semibold mb-3">build_payload 흐름</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {BUILD_STEPS.map(s => (
          <button key={s.id}
            onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeStep === s.step ? s.color : 'var(--color-border)',
              background: activeStep === s.step ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>Step {s.step}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>타이밍 게임</strong> — 빌더는 슬롯 마감 직전까지 TX를 수집하여 MEV를 최대화하려 한다.<br />
          하지만 너무 늦으면 Proposer가 로컬 블록을 사용한다.<br />
          이 긴장 관계가 빌더 간 경쟁을 만들고, 결과적으로 Proposer에게 더 높은 수수료를 제공한다.
        </p>
      </div>
    </section>
  );
}
