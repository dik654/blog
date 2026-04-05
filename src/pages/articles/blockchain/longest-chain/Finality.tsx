import { motion } from 'framer-motion';

const C = { chain: '#6366f1', ok: '#10b981' };

function FinalityViz() {
  const data = [
    { confirms: 1, minutes: '10분', prob: '번복 가능' },
    { confirms: 3, minutes: '30분', prob: '거의 안전' },
    { confirms: 6, minutes: '60분', prob: '사실상 확정' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Bitcoin 확인 수와 안전성</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {data.map((d, i) => (
          <motion.g key={d.confirms} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <rect x={15 + i * 135} y={10} width={115} height={50} rx={8}
              fill="var(--card)" stroke={C.chain} strokeWidth={0.5} />
            <text x={72 + i * 135} y={30} textAnchor="middle"
              fontSize={12} fontWeight={700} fill={C.chain}>{d.confirms} confirm</text>
            <text x={72 + i * 135} y={43} textAnchor="middle"
              fontSize={10} fill="var(--muted-foreground)">{d.minutes}</text>
            <text x={72 + i * 135} y={55} textAnchor="middle"
              fontSize={10} fill={C.ok}>{d.prob}</text>
          </motion.g>
        ))}
        <motion.text x={210} y={82} textAnchor="middle" fontSize={11}
          fill={C.chain} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 기하급수적으로 안전성 증가 — 하지만 절대적 확정은 아님
        </motion.text>
      </svg>
    </div>
  );
}

export default function Finality() {
  return (
    <section id="finality" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확률적 최종성</h2>
      <FinalityViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Nakamoto 합의는 <strong>확률적 최종성</strong> — 시간이 지날수록 번복 확률이 기하급수 감소.<br />
          k confirmation 후 reorg 확률: (q/p)^k, q=공격자, p=정직.<br />
          Bitcoin은 k=6 (60분) 관례 — 99.9%+ 안전.
        </p>

        {/* ── 수학적 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Reorg 확률 수학 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Nakamoto whitepaper Section 11:
// Attack scenario 분석

// 변수:
// p = 정직 해시파워 비율
// q = 공격자 해시파워 비율
// z = 공격자가 따라잡아야 할 block 수 (confirmation)

// Gambler's Ruin 문제:
// 공격자가 z block 뒤에서 시작해서 정직 체인 따라잡을 확률
// P(따라잡음) = 1 if q >= p
//             = (q/p)^z if q < p

// q = 10% (작은 공격자):
// z=1: 20.45%
// z=2: 5.09%
// z=3: 1.31%
// z=4: 0.41%
// z=5: 0.13%
// z=6: 0.04%
// z=10: 0.0000012%

// q = 30% (대규모 공격):
// z=1: 41.77%
// z=3: 13.11%
// z=6: 4.16%
// z=10: 0.124%
// z=20: 0.000041%

// q = 45% (거의 한계):
// z=6: 57.94%
// z=20: 8.93%
// z=50: 0.0025%

// Bitcoin 실무 기준:
// - 1 conf: 일반 거래 (카페, 소액)
// - 3 conf: 중간 거래
// - 6 conf: 대형 거래 ($1M+)
// - 100 conf: exchange 예치 (Coinbase)

// Double-spend 공격 수익성:
// - 필요 비용 = 해시파워 * 시간
// - 예상 수익 = 이중지불 금액
// - 공격 지속 필요성 = exponential waiting
// - 대부분 경제적 비합리

// Selfish Mining (Eyal-Sirer 2014):
// - q < 0.5에서도 일정 조건에서 이득
// - 정직 miner가 고아 만들기
// - 25%+ 해시파워로 효율 극대화`}
        </pre>
        <p className="leading-7">
          reorg 확률 = <strong>(q/p)^z</strong> — q는 공격자, p는 정직, z는 confirmation.<br />
          z=6, q=10% → 0.04% — Bitcoin 기본값의 근거.<br />
          공격자 45%+: z=6도 58% 성공 — 51% 근접 시 매우 위험.
        </p>

        {/* ── 실제 reorg 사례 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 reorg 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bitcoin reorg 역사:
//
// 2010-08: block #74638 reorg
// - integer overflow 버그 exploit
// - 1,840억 BTC inflation TX
// - 수 시간 내 hard fork로 수정
//
// 2013-03: block #225430 reorg
// - v0.8 vs v0.7 호환성 문제
// - 24 block reorg
// - 수 시간 내 consensus 복원
//
// 2021-06: 7-block reorg (small)
// - 일상적 fork 해결
//
// Ethereum Classic (51% 공격):
// - 2019-01: 100+ block reorg
// - 5.6M USD double-spend
// - 해시파워 약함 (ETH에 비해)
//
// Bitcoin SV (51% 공격):
// - 2021-06: 51% 공격 의심
// - 대형 reorg 발생
// - Binance 등 exchange 일시 중단

// Exchange 정책 (confirmation 요구):
// Coinbase:
// - BTC: 3 conf
// - ETH: 35 conf
// - LTC: 12 conf
// - ETC: 80,000 conf (대폭 증가, 51% 공격 이후)
//
// Binance:
// - BTC: 2 conf
// - ETH: 12 conf
// - USDT: 20 conf

// Finality 시간:
// BTC (k=6): 60분
// ETH (pre-merge, k=12): 3분
// ETC (k=80000): 24시간+
// BCH (k=15): 2.5시간

// 교훈:
// - 해시파워 적은 체인은 conf 많이 필요
// - 51% 공격 이후 exchange는 안전 마진 증대
// - Finality는 결코 "절대적"이지 않음 (확률적)`}
        </pre>
        <p className="leading-7">
          실제 reorg는 <strong>해시파워 약한 체인</strong>에서 빈번.<br />
          ETC는 51% 공격 이후 Coinbase가 conf 80,000 요구 (24시간+).<br />
          exchange별 confirmation 기준이 실무적 "finality" 정의.
        </p>

        {/* ── Hybrid approach ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Hybrid: longest-chain + BFT finality</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 현대 블록체인의 하이브리드:

// Ethereum 2.0 (Casper FFG + LMD-GHOST):
//
// 두 레이어:
// 1. LMD-GHOST (fork choice)
//    - 매 slot (12s) block
//    - probabilistic finality
//    - liveness 우선
//
// 2. Casper FFG (BFT finality)
//    - epoch (32 slots = 6.4분)마다 finalize
//    - 2/3+ stake 투표로 finalize
//    - safety 우선
//
// 결과:
// - 평소: block 12초
// - Justified: 6.4분 (1 epoch)
// - Finalized: 12.8분 (2 epoch)
// - Finalized block은 revert 불가

// Filecoin F3 (GossiPBFT):
// - PoW tipset 생성 (EC: Expected Consensus)
// - F3가 BFT finality 추가
// - tipset별 fast finality (초 단위)
// - longest chain 대비 안전성 극대화

// Solana Tower BFT:
// - PoH (Proof of History)로 시간 순서
// - BFT voting (stake-weighted)
// - longest chain 아닌 PoH 기반 순서

// Avalanche:
// - Snowman (metastable)
// - sub-sampling voting
// - probabilistic finality
// - BFT 수준 안전성 달성

// 교훈:
// longest chain → liveness + open
// BFT → safety + finality
// 둘 결합 → 최선의 trade-off

// 단점:
// - validator 집중화 (BFT 특성)
// - 복잡도 증가
// - 다양한 공격 벡터

// 미래 방향:
// Single-slot finality (SSF):
// - Ethereum 2.0 로드맵
// - 매 slot finalize
// - validator 수 축소 필요
// - 합의 단축`}
        </pre>
        <p className="leading-7">
          Ethereum 2.0 = <strong>LMD-GHOST(liveness) + Casper FFG(safety)</strong>.<br />
          12초 block + 12.8분 finality — 두 세계의 장점 결합.<br />
          미래는 single-slot finality — 매 slot이 즉시 finalized.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 확률적 vs 결정론적 finality 선택</strong> — 블록체인 규모 trade-off.<br />
          확률적: 수백만 노드 가능, but 긴 대기.<br />
          결정론적: 수백 노드 한계, but 즉시 finalize.<br />
          Ethereum 2.0은 둘 결합 — 대규모 + 빠른 finality.
        </p>
      </div>
    </section>
  );
}
