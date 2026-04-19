import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import M from '@/components/ui/math';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

// SQL → 다항식 변환 상세 — QueryProof.tsx 의 raw <pre> 블록 시각화.
// 예시 쿼리: SELECT SUM(amount) FROM txs WHERE account = 42;
// Step 1) 컬럼 → Lagrange 다항식
// Step 2) WHERE → MLE 마스크
// Step 3) JOIN/GROUP BY → permutation/lookup 인자
// Step 4) Sumcheck k 라운드
// Step 5) MLE 평가 + Dory IPA opening

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '예시 쿼리 — SELECT SUM(amount) WHERE account = 42',
    body: '두 컬럼이 커밋되어 있다: account = [42, 17, 42, 99, 42], amount = [100, 50, 200, 75, 150].\n검증자는 컬럼 커밋·쿼리·주장 결과만 보고, 증명자는 "결과가 정직하다"를 보여야 한다.',
  },
  {
    label: '1단계 — 컬럼을 Lagrange 다항식으로 인코딩',
    body: '도메인 H = {0, 1, …, n−1} 위에서 account_poly(x) = Σᵢ account[i]·Lᵢ(x), amount_poly도 동일.\n행 데이터가 다항식의 평가점이 되어 산술 회로 친화적으로 바뀐다.',
  },
  {
    label: '2단계 — WHERE를 MLE 마스크로 환원',
    body: 'w[i] = (account[i] == 42) ? 1 : 0. 이 0/1 벡터가 다선형 확장(MLE)이 되어 w_poly(x).\n등호·부등호·범위·AND/OR/NOT은 모두 다항식 항등식으로 매핑된다 (예: x = y → (x−y)·something = 0).',
  },
  {
    label: '3단계 — GROUP BY와 JOIN은 permutation/lookup 인자',
    body: 'GROUP BY는 멀티셋 체크 + 룩업 게이트, INNER JOIN은 매칭 쌍의 permutation 증명.\n복잡한 SQL 연산이 단일 다항식 항등식 하나로 합쳐진다.',
  },
  {
    label: '4단계 — Sumcheck로 ∑ amount(i)·w(i) = result 검증',
    body: 'k = log n 라운드 동안 증명자는 단변량 gᵢ(X)를 보내고, 검증자는 gᵢ(0)+gᵢ(1) = 이전 주장을 확인한다.\n매 라운드 도전값 rᵢ = hash(transcript) (Fiat-Shamir, Poseidon/Keccak).',
  },
  {
    label: '5단계 — MLE 평가 + Dory IPA 오프닝',
    body: '마지막에 합성 다항식 p(r₀, …, r_{k−1}) 값이 필요. 이를 Dory의 inner-product argument로 열어 보인다.\n총 증명 크기 ~5–20 KB, 소운드네스 ~128-bit (Sumcheck negligible + DL 가정).',
  },
];

// 컬럼 데이터 (예시) — 활성화는 step >= 0
const ACCOUNT = [42, 17, 42, 99, 42];
const AMOUNT = [100, 50, 200, 75, 150];
const MASK = ACCOUNT.map((a) => (a === 42 ? 1 : 0));
const CELL_W = 38;
const CELL_H = 22;
const ROW_X = 80;

export default function QueryProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="qpArr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* 쿼리 박스 (항상 노출, 옅게) */}
          <DataBox x={10} y={8} w={500} h={26}
            label="SELECT SUM(amount) FROM txs WHERE account = 42"
            color="#8b5cf6" outlined />

          {/* === 컬럼 데이터 (Step 0~) === */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.1 }} transition={sp}>
            <text x={20} y={56} fontSize={10} fontWeight={600} fill="#0ea5e9">account</text>
            {ACCOUNT.map((v, i) => {
              const isMatch = v === 42;
              const highlight = step >= 2 && isMatch;
              return (
                <g key={`a${i}`}>
                  <rect x={ROW_X + i * CELL_W} y={42} width={CELL_W - 4} height={CELL_H} rx={4}
                    fill={highlight ? '#10b98122' : '#0ea5e912'}
                    stroke={highlight ? '#10b981' : '#0ea5e9'} strokeWidth={highlight ? 1.4 : 0.8} />
                  <text x={ROW_X + i * CELL_W + (CELL_W - 4) / 2} y={57}
                    textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={highlight ? '#10b981' : '#0ea5e9'}>{v}</text>
                </g>
              );
            })}
            <text x={20} y={86} fontSize={10} fontWeight={600} fill="#f59e0b">amount</text>
            {AMOUNT.map((v, i) => {
              const highlight = step >= 4 && ACCOUNT[i] === 42;
              return (
                <g key={`m${i}`}>
                  <rect x={ROW_X + i * CELL_W} y={72} width={CELL_W - 4} height={CELL_H} rx={4}
                    fill={highlight ? '#f59e0b22' : '#f59e0b12'}
                    stroke="#f59e0b" strokeWidth={highlight ? 1.4 : 0.8} />
                  <text x={ROW_X + i * CELL_W + (CELL_W - 4) / 2} y={87}
                    textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">{v}</text>
                </g>
              );
            })}
          </motion.g>

          {/* === Step 1 — Lagrange 인코딩 === */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.1 }} transition={sp}>
            <ActionBox x={20} y={114} w={235} h={32}
              label="account_poly(x) = Σᵢ acc[i]·Lᵢ(x)" color="#0ea5e9" />
            <ActionBox x={265} y={114} w={235} h={32}
              label="amount_poly(x) = Σᵢ amt[i]·Lᵢ(x)" color="#f59e0b" />
            <text x={260} y={158} textAnchor="middle" fontSize={9} fill="#94a3b8">
              도메인 H = {'{'}0, 1, …, n−1{'}'} · Lᵢ는 Lagrange 기저
            </text>
          </motion.g>

          {/* === Step 2 — WHERE → MLE 마스크 === */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.08 }} transition={sp}>
            <text x={20} y={130} fontSize={10} fontWeight={600} fill="#10b981">w[i]</text>
            {MASK.map((v, i) => (
              <g key={`w${i}`}>
                <rect x={ROW_X + i * CELL_W} y={116} width={CELL_W - 4} height={CELL_H} rx={4}
                  fill={v ? '#10b98122' : '#94a3b812'}
                  stroke={v ? '#10b981' : '#94a3b8'} strokeWidth={v ? 1.4 : 0.7} />
                <text x={ROW_X + i * CELL_W + (CELL_W - 4) / 2} y={131}
                  textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={v ? '#10b981' : '#94a3b8'}>{v}</text>
              </g>
            ))}
            <ActionBox x={20} y={150} w={480} h={28}
              label="x = y  →  (x−y)·s = 0    |    x AND y  →  x·y    |    NOT x  →  1 − x"
              color="#10b981" />
          </motion.g>

          {/* === Step 3 — JOIN / GROUP BY === */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.08 }} transition={sp}>
            <ModuleBox x={20} y={114} w={155} h={42}
              label="GROUP BY" sub="멀티셋 + 룩업" color="#6366f1" />
            <ModuleBox x={185} y={114} w={155} h={42}
              label="INNER JOIN" sub="permutation 인자" color="#0ea5e9" />
            <ModuleBox x={350} y={114} w={150} h={42}
              label="ORDER BY / LIMIT" sub="범위 게이트" color="#8b5cf6" />
            <text x={260} y={170} textAnchor="middle" fontSize={9} fill="#94a3b8">
              모두 단일 다항식 항등식으로 합쳐짐
            </text>
          </motion.g>

          {/* === Step 4 — Sumcheck k 라운드 === */}
          <motion.g animate={{ opacity: step === 4 ? 1 : 0.08 }} transition={sp}>
            <ModuleBox x={20} y={114} w={130} h={36}
              label="∑ amt(i)·w(i)" sub="claim = 450" color="#10b981" />
            {[0, 1, 2].map((r) => (
              <g key={`rd${r}`}>
                <DataBox x={170 + r * 100} y={118} w={90} h={28}
                  label={`Round ${r + 1}`} color="#f59e0b" outlined />
                <text x={215 + r * 100} y={156} textAnchor="middle" fontSize={8} fill="#f59e0b">
                  g{r}(0)+g{r}(1) = prev
                </text>
                {r < 2 && (
                  <line x1={260 + r * 100} y1={132} x2={270 + r * 100} y2={132}
                    stroke="#94a3b8" strokeWidth={1} markerEnd="url(#qpArr)" />
                )}
              </g>
            ))}
            <text x={260} y={172} textAnchor="middle" fontSize={9} fill="#94a3b8">
              k = log n 라운드 · rᵢ = hash(transcript) — Fiat-Shamir
            </text>
          </motion.g>

          {/* === Step 5 — MLE eval + Dory IPA === */}
          <motion.g animate={{ opacity: step === 5 ? 1 : 0.08 }} transition={sp}>
            <ActionBox x={20} y={114} w={155} h={36}
              label="p(r₀, …, r_{k−1})" sub="MLE 합성 평가" color="#8b5cf6" />
            <ActionBox x={185} y={114} w={155} h={36}
              label="Dory IPA opening" sub="⟨a, b⟩ = c" color="#f59e0b" />
            <StatusBox x={350} y={108} w={150} h={48}
              label="Proof ~5–20 KB" sub="~128-bit soundness" color="#10b981" progress={1} />
            <text x={260} y={172} textAnchor="middle" fontSize={9} fill="#94a3b8">
              컬럼 커밋(재사용) + 중간 커밋 + Sumcheck 트랜스크립트 + IPA opening
            </text>
          </motion.g>

          {/* === 결과 박스 (Step 0, 4~5 강조) === */}
          <motion.g animate={{ opacity: step === 0 || step >= 4 ? 1 : 0.18 }} transition={sp}>
            <StatusBox x={170} y={188} w={180} h={42}
              label="claimed result = 450" sub="100 + 200 + 150" color="#8b5cf6" progress={1} />
          </motion.g>

          {/* === Transcript / Fiat-Shamir 라벨 (Step 4~) === */}
          <motion.g animate={{ opacity: step >= 4 ? 0.85 : 0.1 }} transition={sp}>
            <DataBox x={20} y={194} w={140} h={28}
              label="transcript" sub="Poseidon/Keccak" color="#0ea5e9" />
            <DataBox x={360} y={194} w={140} h={28}
              label="challenge rᵢ" sub="hash(prev)" color="#f59e0b" />
          </motion.g>

          {/* === 보안 보장 === */}
          <motion.g animate={{ opacity: step === 5 ? 0.95 : 0.05 }} transition={sp}>
            <text x={260} y={246} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
              soundness · completeness · zero-knowledge (행값 비노출)
            </text>
          </motion.g>

          {/* === 하단 수식 라벨 (KaTeX 렌더는 div 외부에서) === */}
          <foreignObject x={20} y={250} width={480} height={26}>
            <div style={{ fontSize: 11, textAlign: 'center', color: '#64748b' }}>
              <M>{'\\sum_{i \\in H} \\text{amount}(i) \\cdot w(i) = \\text{result}'}</M>
            </div>
          </foreignObject>
        </svg>
      )}
    </StepViz>
  );
}
