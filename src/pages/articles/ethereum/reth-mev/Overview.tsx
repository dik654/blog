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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Arbitrage (차익거래)
// - DEX 간 가격 차이 발견 → 한 쪽에서 사서 다른 쪽에서 팜
// - 리스크 낮음, 수익 중간
// - 전체 MEV의 ~50%

// 예시:
// Uniswap: 1 ETH = 1800 USDC
// SushiSwap: 1 ETH = 1810 USDC
// → Uniswap에서 사서 SushiSwap에서 팔면 10 USDC 이익

// 2. Liquidation (청산)
// - 담보 대출의 담보비율 부족 → 강제 청산
// - 청산자에게 수수료 지급 (~5~10%)
// - Aave, Compound, MakerDAO에서 자주 발생

// 3. Sandwich Attack (샌드위치 공격)
// - victim의 swap TX 발견
// - front-run: victim 전에 같은 방향 swap → 가격 상승
// - back-run: victim 후에 반대 swap → 차익 실현
// - victim이 slippage 만큼 손해

// 4. Backrun / Long-tail MEV
// - 특정 이벤트 직후 기회 포착
// - NFT 민팅 첫 블록 스나이핑
// - oracle 업데이트 활용

// MEV 규모 (메인넷 추정):
// - 연간 ~$500M - $1B 추출
// - 하루 평균 ~$1M - $3M
// - 혼잡 시기 급증`}
        </pre>
        <p className="leading-7">
          MEV는 <strong>"block space의 숨은 가치"</strong> — TX 순서로 인해 생기는 추가 수익.<br />
          차익거래와 청산이 주요 수익원 — sandwich는 윤리적 논란 지속.<br />
          연간 수억 달러 규모 — 무시할 수 없는 이더리움 경제의 일부.
        </p>

        {/* ── PBS 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBS — 4개 역할 분리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 4개 역할:
//
// 1. Searcher (MEV 봇):
//    - mempool 모니터링
//    - MEV 기회 발견
//    - 번들(여러 TX 묶음) 생성
//    - builder에 번들 제출 + 수익 공유 제안
//
// 2. Builder (블록 빌더):
//    - 여러 searcher로부터 번들 수집
//    - 공개 mempool TX도 포함
//    - 최적 TX 순서 계산 (NP-hard 문제)
//    - 완성된 블록을 relay에 입찰
//
// 3. Relay (중개자):
//    - builder들의 입찰 수집
//    - validator에게 블록 header만 전달 (blind auction)
//    - validator가 header 서명 후 full block 공개
//    - trusted 역할: builder 검열 방지
//
// 4. Proposer (validator):
//    - relay로부터 최고 입찰 header 수신
//    - header 서명 후 전파 약속
//    - full block 수신 후 네트워크 전파
//    - bid 금액 수령

// 수익 흐름:
// user → searcher → builder → relay → proposer
//       (gas fee)  (tip)    (수수료)  (bid)

// Reth의 역할:
// - 기본은 self-build (EL이 직접 블록 만듦)
// - MEV-Boost 활성화 시 builder 블록 받아서 사용
// - Reth 자체를 builder 기반으로 사용 가능 (rbuilder)`}
        </pre>
        <p className="leading-7">
          <strong>PBS의 4개 역할 분리</strong>가 MEV 시장의 표준 구조.<br />
          각 역할이 전문화 → 전체 시스템 효율성 향상.<br />
          Relay가 neutral intermediary 역할 → builder 검열 방지 + validator 신뢰.
        </p>

        {/* ── MEV-Boost vs self-build ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV-Boost vs Self-Build — Validator 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator가 블록 제안 시 선택지

// 옵션 1: Self-Build (EL이 직접 만듦)
// validator → EL: FCU(attrs) → PayloadJob 시작
// validator → EL: getPayload() → EL의 블록 받음
// 수익: ~0.05 ETH (평균)
// 장점: 간단, 의존성 없음
// 단점: MEV 놓침

// 옵션 2: MEV-Boost (외부 builder 사용)
// validator → relay: getHeader(slot, parent_hash)
// relay → builder들: 최고 bid 수집
// relay → validator: 최고 bid header 반환
// validator → relay: getPayload(signed_header)
// relay → validator: full block 반환
// 수익: ~0.15 ETH (평균, 혼잡 시 10+ ETH)
// 장점: MEV 수익 포함, 자동화
// 단점: relay 신뢰 필요, 지연

// MEV-Boost 채택률:
// - 메인넷 validator ~90%가 MEV-Boost 사용
// - 나머지는 solo staker + self-build
// - Lido, Coinbase, Binance 등 대형 스테이커 거의 100%

// 유명 relay:
// - Flashbots Relay (가장 큰 점유율)
// - BloXroute
// - Eden Network
// - Ultra Sound Relay
// - Agnostic Relay

// Reth 통합:
// - reth 자체는 MEV-Boost 클라이언트 아님
// - CL(Lighthouse, Prysm, Teku 등)이 MEV-Boost 통합
// - validator가 MEV-Boost 활성화 시 CL이 relay와 통신`}
        </pre>
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
