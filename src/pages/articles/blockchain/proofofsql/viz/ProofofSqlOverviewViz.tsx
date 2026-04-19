import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

// Proof of SQL 시스템 개요 — Overview.tsx 의 raw <pre> 블록을 시각화.
// 본문 충실: SxT 가 개발, 첫 sub-second SQL ZK 증명, 6 단계 아키텍처,
// Sumcheck + Dory 결합, 온체인 검증, 활용 사례.

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '문제 — 검증 가능한 SQL이 없다',
    body: '중앙화 DB는 운영자를 신뢰해야 하고, 온체인 DB는 가스 비용이 폭발한다.\nZK Rollup조차 SQL을 네이티브로 다루지 않아, "쿼리가 정직하게 실행됐다"는 증명 수단이 비어 있었다.',
  },
  {
    label: '해법 — Space and Time의 sub-second 증명',
    body: 'SQL은 오프체인에서 돌리고, 그 결과의 정확성만 ZK 증명으로 묶는다.\n온체인 검증은 데이터 크기와 무관하게 상수~로그 시간으로 끝난다.',
  },
  {
    label: '6 계층 아키텍처',
    body: 'Apache Calcite로 SQL을 파싱하고, 플래너가 증명 가능한 계획으로 변환한다.\nRust 증명기 → Dory 커밋먼트 → Blitzar GPU 가속 → Solidity 검증기로 이어진다.',
  },
  {
    label: '증명 모델 — 검증자가 아는 것 vs 증명되는 것',
    body: '검증자는 컬럼 커밋먼트와 쿼리·결과만 본다.\n증명자는 "결과가 커밋된 데이터로부터 정직하게 도출됐고, 행이 추가·은닉되지 않았다"를 보인다. 개별 행 값은 노출되지 않는다.',
  },
  {
    label: '핵심 수학 — SQL → 다항식 항등식 + Sumcheck + IPA',
    body: 'SELECT/WHERE/SUM/COUNT는 모두 다항식 마스크로 표현된다.\nSumcheck로 "합이 주장값과 같음"을, IPA로 "커밋된 벡터의 내적"을 검증한다. Dory는 트러스티드 셋업 없이 페어링 기반 O(√n) 커밋·O(log n) 검증을 제공한다.',
  },
  {
    label: '온체인 검증과 활용 사례',
    body: 'Solidity 검증기는 EIP-196/197 페어링 프리컴파일로 동작하며, 쿼리당 ~500K–1M 가스, 행 수와 무관.\nDeFi TWAP·총공급·KYC 컴플라이언스·게임 매치 결과·공급망 진위 같은 검증 가능 데이터 시나리오에서 활용된다.',
  },
];

// 6 계층 아키텍처 박스 좌표 (세로 스택, 우측은 보조 영역)
const LAYERS = [
  { label: 'SQL Interface', sub: 'Apache Calcite', color: '#6366f1' },
  { label: 'Query Planner', sub: 'Optimizer', color: '#0ea5e9' },
  { label: 'Proof Generator', sub: 'Rust prover', color: '#10b981' },
  { label: 'Dory Commit', sub: 'pairing IPA', color: '#f59e0b' },
  { label: 'Blitzar', sub: 'CUDA MSM', color: '#ef4444' },
  { label: 'Solidity Verifier', sub: 'on-chain', color: '#8b5cf6' },
];

// 어떤 단계에서 어떤 계층이 활성화되는지
const LAYER_VIS: number[][] = [
  [],
  [0, 1, 2, 5],
  [0, 1, 2, 3, 4, 5],
  [2, 3, 5],
  [2, 3, 4],
  [5],
];

// 활용 사례 칩 (마지막 단계에서만 노출)
const USE_CASES = [
  { label: 'DeFi TWAP', color: '#10b981' },
  { label: 'KYC 증명', color: '#f59e0b' },
  { label: '게임 결과', color: '#8b5cf6' },
  { label: '공급망', color: '#0ea5e9' },
];

export default function ProofofSqlOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="psqlArr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* 좌측 — 문제 (Step 0 강조) */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.18 }} transition={sp}>
            <AlertBox x={12} y={20} w={120} h={40} label="중앙 DB" sub="운영자 신뢰 필요" color="#ef4444" />
            <AlertBox x={12} y={70} w={120} h={40} label="온체인 DB" sub="가스 폭발" color="#ef4444" />
            <AlertBox x={12} y={120} w={120} h={40} label="ZK Rollup" sub="SQL 미지원" color="#ef4444" />
          </motion.g>

          {/* 좌측 — 해법 (Step 1 강조) */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.12 }} transition={sp}>
            <ActionBox x={12} y={180} w={120} h={36} label="off-chain SQL" sub="Rust prover" color="#10b981" />
            <StatusBox x={12} y={222} w={120} h={42} label="on-chain verify" sub="O(log n) gas" color="#8b5cf6" progress={0.95} />
          </motion.g>

          {/* 중앙 — 6 계층 아키텍처 (Step 2~ 항상 보이지만 활성화 컬러 변동) */}
          {LAYERS.map((l, i) => {
            const active = step >= 2 && LAYER_VIS[step].includes(i);
            const dimmed = step < 2 ? 0.25 : active ? 1 : 0.22;
            const y = 18 + i * 40;
            return (
              <motion.g key={l.label} animate={{ opacity: dimmed }} transition={sp}>
                <ModuleBox x={170} y={y} w={170} h={32} label={l.label} sub={l.sub} color={l.color} />
                {/* 단계별 흐름 화살표 */}
                {i < LAYERS.length - 1 && (
                  <line x1={255} y1={y + 32} x2={255} y2={y + 40}
                    stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="2 2" />
                )}
              </motion.g>
            );
          })}

          {/* SxT 라벨 (좌상) — Step 1~ */}
          <motion.g animate={{ opacity: step >= 1 ? 0.85 : 0.15 }} transition={sp}>
            <DataBox x={355} y={6} w={155} h={22} label="Space and Time (SxT)" color="#8b5cf6" />
            <text x={432} y={36} textAnchor="middle" fontSize={8} fill="#8b5cf6">first sub-second SQL ZK</text>
          </motion.g>

          {/* 증명 모델 — Step 3 */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.1 }} transition={sp}>
            <DataBox x={355} y={48} w={75} h={26} label="Verifier" color="#0ea5e9" />
            <DataBox x={435} y={48} w={75} h={26} label="Prover" color="#f59e0b" />
            <text x={392} y={86} textAnchor="middle" fontSize={8} fill="#0ea5e9">스키마</text>
            <text x={392} y={97} textAnchor="middle" fontSize={8} fill="#0ea5e9">컬럼 커밋</text>
            <text x={392} y={108} textAnchor="middle" fontSize={8} fill="#0ea5e9">쿼리·결과</text>
            <text x={472} y={86} textAnchor="middle" fontSize={8} fill="#f59e0b">결과 정확성</text>
            <text x={472} y={97} textAnchor="middle" fontSize={8} fill="#f59e0b">행 무삽입</text>
            <text x={472} y={108} textAnchor="middle" fontSize={8} fill="#f59e0b">술어 적용</text>
            <text x={432} y={124} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">개별 행값 ✕</text>
          </motion.g>

          {/* 핵심 수학 — Step 4 */}
          <motion.g animate={{ opacity: step === 4 ? 1 : 0.1 }} transition={sp}>
            <ModuleBox x={355} y={138} w={155} h={32} label="Sumcheck" sub="∑ p(x) = claim" color="#10b981" />
            <ModuleBox x={355} y={172} w={155} h={32} label="Dory IPA" sub="⟨a, b⟩ = c" color="#f59e0b" />
            <text x={432} y={216} textAnchor="middle" fontSize={8.5} fill="#94a3b8">SELECT → mask poly</text>
            <text x={432} y={227} textAnchor="middle" fontSize={8.5} fill="#94a3b8">WHERE  → indicator</text>
            <text x={432} y={238} textAnchor="middle" fontSize={8.5} fill="#94a3b8">SUM    → ∑ f·w</text>
            <text x={432} y={249} textAnchor="middle" fontSize={8.5} fill="#94a3b8">COUNT  → ∑ w</text>
          </motion.g>

          {/* 온체인 검증 + 활용 사례 — Step 5 */}
          <motion.g animate={{ opacity: step === 5 ? 1 : 0.08 }} transition={sp}>
            <StatusBox x={355} y={48} w={155} h={42} label="Solidity Verifier" sub="EIP-196/197 · ~500K gas" color="#8b5cf6" progress={1} />
            {USE_CASES.map((u, i) => (
              <DataBox key={u.label} x={355 + (i % 2) * 80} y={102 + Math.floor(i / 2) * 30}
                w={75} h={24} label={u.label} color={u.color} outlined />
            ))}
            <text x={432} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
              10M rows: &lt; 1s
            </text>
            <text x={432} y={184} textAnchor="middle" fontSize={9} fill="#10b981">verify ~200ms</text>
          </motion.g>

          {/* 좌→중 흐름 화살표 (Step 1~) */}
          <motion.g animate={{ opacity: step >= 1 && step <= 2 ? 0.7 : 0.06 }} transition={sp}>
            <line x1={132} y1={195} x2={170} y2={195} stroke="#10b981"
              strokeWidth={1.4} markerEnd="url(#psqlArr)" />
            <line x1={132} y1={240} x2={170} y2={240} stroke="#8b5cf6"
              strokeWidth={1.4} markerEnd="url(#psqlArr)" />
          </motion.g>

          {/* 카운터 — 우하 작은 라벨 */}
          <text x={510} y={275} textAnchor="end" fontSize={7.5} fill="#94a3b8">
            Proof of SQL · SxT
          </text>
        </svg>
      )}
    </StepViz>
  );
}
