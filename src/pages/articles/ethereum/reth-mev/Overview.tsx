import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import MEVFlowViz from './viz/MEVFlowViz';
import type { CodeRef } from '@/components/code/types';
import { PBS_ROLES } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = PBS_ROLES.find(r => r.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MEV 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>MEV(Maximal Extractable Value)</strong>는 블록 내 트랜잭션 순서를 조작하여 얻을 수 있는 추가 수익이다.<br />
          차익거래, 청산, 샌드위치 공격 등이 대표적이다.<br />
          The Merge 이후 이더리움은 <strong>PBS(Proposer-Builder Separation)</strong>로 MEV 추출을 구조화했다.
        </p>
        <p className="leading-7">
          PBS의 핵심 아이디어 — 블록 제안(Proposer)과 블록 구성(Builder)을 분리한다.<br />
          Proposer는 가장 높은 입찰의 블록을 선택하기만 하고, MEV 추출은 전문 빌더에게 위임한다.<br />
          이를 통해 검증자의 중앙화 압력을 줄이고, MEV 수익을 투명하게 분배한다.
        </p>
        <p className="leading-7">
          PBS 생태계는 4개 역할로 구성된다.<br />
          아래 카드를 클릭하면 각 역할의 동기와 설계를 확인할 수 있다.
        </p>

        {/* ── MEV 종류 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV 종류 — 4가지 주요 전략</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">Arbitrage (차익거래)</p>
              <p className="text-sm text-foreground/80">DEX 간 가격 차이 → 낮은 곳에서 매수, 높은 곳에서 매도. 리스크 낮음. 전체 MEV ~50%.</p>
              <p className="text-xs text-foreground/50 mt-1">예: Uniswap 1800 / SushiSwap 1810 → 10 USDC 이익</p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">Liquidation (청산)</p>
              <p className="text-sm text-foreground/80">담보 대출 담보비율 부족 시 강제 청산. 청산자에게 ~5~10% 수수료. Aave, Compound, MakerDAO.</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-1">Sandwich Attack</p>
              <p className="text-sm text-foreground/80">victim swap TX 발견 → front-run(가격 상승) → back-run(차익 실현). victim이 slippage 만큼 손해.</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-1">Backrun / Long-tail</p>
              <p className="text-sm text-foreground/80">이벤트 직후 기회 포착. NFT 민팅 스나이핑, oracle 업데이트 활용 등.</p>
            </div>
          </div>
          <p className="text-sm text-foreground/60">MEV 규모: 연간 ~$500M~$1B / 하루 ~$1M~$3M / 혼잡 시기 급증.</p>
        </div>
        <p className="leading-7">
          MEV는 <strong>"block space의 숨은 가치"</strong> — TX 순서로 인해 생기는 추가 수익.<br />
          차익거래와 청산이 주요 수익원 — sandwich는 윤리적 논란 지속.<br />
          연간 수억 달러 규모 — 무시할 수 없는 이더리움 경제의 일부.
        </p>

        {/* ── PBS 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBS — 4개 역할 분리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-orange-500 mb-2">Searcher (MEV 봇)</p>
              <p className="text-sm text-foreground/80">mempool 모니터링 → MEV 기회 발견 → 번들(TX 묶음) 생성 → builder에 제출 + 수익 공유 제안.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">Builder (블록 빌더)</p>
              <p className="text-sm text-foreground/80">번들 수집 + 공개 mempool TX 포함 → 최적 TX 순서 계산(NP-hard) → relay에 입찰.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">Relay (중개자)</p>
              <p className="text-sm text-foreground/80">builder 입찰 수집 → validator에게 header만 전달(blind auction) → header 서명 후 full block 공개.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">Proposer (validator)</p>
              <p className="text-sm text-foreground/80">relay에서 최고 입찰 header 수신 → 서명 → full block 수신 → 네트워크 전파 → bid 금액 수령.</p>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/60">
            수익 흐름: user → searcher(gas fee) → builder(tip) → relay(수수료) → proposer(bid). Reth: 기본 self-build, MEV-Boost 활성화 시 builder 블록 사용, rbuilder로 builder 역할도 가능.
          </div>
        </div>
        <p className="leading-7">
          <strong>PBS의 4개 역할 분리</strong>가 MEV 시장의 표준 구조.<br />
          각 역할이 전문화 → 전체 시스템 효율성 향상.<br />
          Relay가 neutral intermediary 역할 → builder 검열 방지 + validator 신뢰.
        </p>

        {/* ── MEV-Boost vs self-build ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV-Boost vs Self-Build — Validator 선택</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Self-Build (EL 직접 생성)</p>
              <p className="text-sm text-foreground/80">FCU(attrs) → PayloadJob → getPayload(). 수익 ~0.05 ETH(평균).</p>
              <p className="text-xs text-green-500 mt-1">장점: 간단, 의존성 없음</p>
              <p className="text-xs text-red-400">단점: MEV 놓침</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">MEV-Boost (외부 builder)</p>
              <p className="text-sm text-foreground/80">getHeader → 최고 bid header 수신 → getPayload(signed_header) → full block. 수익 ~0.15 ETH(혼잡 시 10+).</p>
              <p className="text-xs text-green-500 mt-1">장점: MEV 수익 포함</p>
              <p className="text-xs text-red-400">단점: relay 신뢰 필요</p>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/60">
            MEV-Boost 채택률: 메인넷 validator ~90%. 유명 relay: Flashbots, BloXroute, Ultra Sound, Agnostic. CL이 MEV-Boost 통합 — EL(Reth)는 fallback self-build.
          </div>
        </div>
        <p className="leading-7">
          메인넷 <strong>validator 90%가 MEV-Boost 사용</strong>.<br />
          self-build는 solo staker나 탈중앙 지향 운영자의 선택.<br />
          CL이 MEV-Boost 통합 → EL(Reth)는 fallback으로 self-build 준비.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {PBS_ROLES.map(r => (
          <button key={r.id}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === r.id ? r.color : 'var(--color-border)',
              background: selected === r.id ? `${r.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: r.color }}>{r.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{r.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><MEVFlowViz /></div>
    </section>
  );
}
