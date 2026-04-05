import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const C = { wave: '#6366f1', coin: '#10b981', node: '#0ea5e9' };

function WaveViz() {
  const waves = ['Wave 1', 'Wave 2', 'Wave 3'];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Tusk 웨이브 구조: 3라운드 = 1 웨이브</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {waves.map((w, i) => (
          <motion.g key={w} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <ModuleBox x={10 + i * 140} y={10} w={120} h={38}
              label={w} sub="3 라운드" color={C.wave} />
          </motion.g>
        ))}
        {[0, 1].map(i => (
          <motion.line key={i} x1={130 + i * 140} y1={29} x2={150 + i * 140} y2={29}
            stroke={C.wave} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.15 }} />
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          <ActionBox x={130} y={60} w={160} h={30}
            label="Common Coin" sub="웨이브마다 리더 선택" color={C.coin} />
        </motion.g>
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 각 웨이브 끝에서 랜덤 코인으로 리더를 선택 → 리더의 vertex 기준으로 커밋
      </p>
    </div>
  );
}

export default function AsyncProtocol() {
  return (
    <section id="async-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비동기 프로토콜 구조</h2>
      <WaveViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">3라운드 웨이브</h3>
        <p className="leading-7">
          Tusk는 3라운드를 하나의 웨이브로 묶는다.<br />
          1라운드: 리더 vertex 제안. 2-3라운드: 투표 역할.<br />
          <strong>웨이브 끝에서 랜덤 코인이 리더를 공개</strong>하면, 2/3+ 참조가 있으면 커밋.
        </p>

        {/* ── Tusk 3-round wave 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3-Round Wave 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tusk Wave 구조:
//
// Wave w = rounds [3w, 3w+1, 3w+2]
//
// Round 3w: "proposal round"
//   - 모든 validator가 vertex propose
//   - each vertex는 2f+1 round (3w-1) cert 참조
//   - "potential anchor candidates"
//
// Round 3w+1: "vote round"
//   - validators가 round 3w vertices 참조
//   - 각 round 3w vertex에 대한 "vote"
//   - some vertices 2f+1+ votes, 다른 것 < 2f+1
//
// Round 3w+2: "commit round"
//   - common coin reveal (end of wave)
//   - coin_w = random(0, n-1)
//   - designated_leader_w = validators[coin_w]
//   - anchor check: leader's round 3w vertex

// Commit Decision:
// if anchor(w) exists in DAG:
//     if anchor(w) has 2f+1 votes in round 3w+1:
//         commit anchor(w) + causal history
//     else:
//         wave skipped
// else:
//     wave skipped (leader didn't propose)

// Common Coin Revelation:
// - threshold signature scheme
// - each validator contributes share (signed input)
// - in round 3w+2: 2f+1 shares combined
// - combined signature → random bit string
// - coin_w = hash(combined) mod n

// 왜 "reveal after round 2"?
// - coin 값 미리 알면 Byzantine이 biased 투표
// - round 3w에 propose 시 coin 모름
// - round 3w+1에 vote 시 coin 모름
// - round 3w+2에 coin reveal + 검증
// - Byzantine이 미리 조작 불가`}
        </pre>
        <p className="leading-7">
          3-round wave: <strong>propose → vote → coin reveal + commit</strong>.<br />
          coin은 wave 끝에 reveal (미리 알면 조작 가능).<br />
          Byzantine이 biased leader selection 불가.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">활성 보장 (Liveness)</h3>
        <p className="leading-7">
          코인이 정직한 리더를 선택할 확률 ≥ 2/3.<br />
          충분한 웨이브가 지나면 확률적으로 커밋이 보장.<br />
          <strong>비동기에서도 O(1) 기대 지연</strong>으로 합의 완료.
        </p>

        {/* ── Randomization 기반 Liveness ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Randomization 기반 Liveness</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Liveness 증명:
//
// Claim: Tusk commits with probability 1
//        Expected commit time = O(1) waves

// 증명 sketch:
//
// Lucky wave:
// - coin이 honest validator 선택 확률 = 2/3 (f<n/3)
// - honest leader는 valid vertex propose
// - 2f+1 honest가 vote
// - commit!
//
// Expected waves to commit:
// - P(lucky) = 2/3 per wave
// - geometric distribution
// - E[waves] = 1 / (2/3) = 1.5
// - expected rounds: 1.5 * 3 = 4.5
//
// Worst case:
// - probability 1/3 unlucky per wave
// - n consecutive unlucky: (1/3)^n
// - rapidly decreasing
// - 10 unlucky waves: (1/3)^10 ≈ 0.0017%

// FLP Impossibility 우회:
// - FLP: deterministic async consensus 불가
// - Tusk: randomized → probability 1 terminate
// - FLP 가정 외 (randomization)

// Async safety:
// - commit 조건: 2f+1 votes (strict)
// - Byzantine 2/3+ 불가능 (f<n/3)
// - → conflicting commit 불가
// - safety 언제나 보장

// async 장점:
// - no timing assumption
// - no timeout
// - works in worst networks
// - DDoS 저항 강함

// async 단점:
// - expected latency 높음 (3 waves vs 2)
// - throughput 감소
// - 복잡한 randomness infrastructure
//   (common coin, VRF, threshold sig)

// 결론:
// async-safe = 최악 조건 보장
// partial sync = 평균 조건 최적
// 현실 선택: 둘 결합 (Bullshark hybrid)`}
        </pre>
        <p className="leading-7">
          Liveness: <strong>P(honest leader) ≥ 2/3 per wave</strong>.<br />
          Expected 1.5 waves for commit (geometric).<br />
          FLP 우회: randomization으로 probability 1 terminate.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Common Coin 구현의 어려움</strong> — threshold signature 인프라.<br />
          각 wave마다 fresh random value 필요.<br />
          BLS threshold signature (Dfinity) 또는 VRF (Algorand) 사용.<br />
          복잡성 추가가 Tusk의 실무 채택 장벽.
        </p>
      </div>
    </section>
  );
}
