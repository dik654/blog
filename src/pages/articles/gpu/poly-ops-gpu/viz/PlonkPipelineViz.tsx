import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  ntt: '#0ea5e9',
  coset: '#10b981',
  div: '#f59e0b',
  msm: '#a855f7',
  warn: '#ef4444',
  muted: '#94a3b8',
};

const STEPS = [
  {
    label: '1. 게이트 다항식 f(x) — 계수 형태',
    body: 'PLONK 프로버는 게이트 제약을 다항식으로 인코딩한다.\n시작은 계수 형태 (coefficient form): f(x) = c0 + c1·x + ... + c_{n-1}·x^{n-1}.',
  },
  {
    label: '2. NTT — 평가 형태로 변환',
    body: 'NTT(f) → f(omega^i): 단위근에서의 평가값 n개.\n이 평가 형태에서 다항식 곱셈은 원소별 곱이 된다 (O(n)).',
  },
  {
    label: '3. 몫 다항식 t(x) — 게이트 제약 합산',
    body: 'permutation, gate, lookup 다항식을 합산해 quotient t(x)를 얻는다.\n아직 평가 형태이므로 NTT 결과 위에서 원소별로 처리된다.',
  },
  {
    label: '4. t(x) / Z(x) = h(x) — vanishing poly 나눗셈',
    body: 'Z(x) = x^n − 1은 단위근 omega^i에서 모두 0.\n따라서 평가 형태에서 직접 나누면 0/0 발생 → coset 평가가 필요하다.',
  },
  {
    label: '5. Coset NTT — t(g·omega^i) 계산',
    body: 'g (coset 생성원, BN254에서 g = 7)으로 평가점을 이동.\n계수에 g^i를 미리 곱한 뒤 표준 NTT를 다시 실행한다.',
  },
  {
    label: '6. Pointwise division — h(g·omega^i)',
    body: 'h(g·omega^i) = t(g·omega^i) / Z(g·omega^i).\nZ(g·omega^i) = g^n − 1 (상수) → 역원 1개로 n개 점 나눗셈.',
  },
  {
    label: '7. Coset INTT — h(x) 계수 복원',
    body: '표준 INTT 후 g^(-i)로 후처리 → coset 보정 제거.\n결과: h(x)의 계수 표현 — KZG 커밋 입력.',
  },
  {
    label: '8. KZG 커밋 — [h(x)]_1 = MSM',
    body: '계수 c_i와 SRS 점 [s^i]_1의 다중스칼라곱 → 곡선점 1개.\nMSM은 전체 증명 시간의 70~80%를 차지하는 병목.',
  },
];

const ROW_W = 460;
const ROW_H = 26;

export default function PlonkPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 제목 */}
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            PLONK 프로버 다항식 연산 파이프라인
          </text>

          {/* 8단계 행 */}
          {STEPS.map((s, i) => {
            const y = 28 + i * ROW_H;
            const isActive = i === step;
            const isPast = i < step;
            const color =
              i <= 1 ? C.ntt :
              i === 2 ? C.muted :
              i === 3 ? C.warn :
              i <= 6 ? C.coset :
              C.msm;
            return (
              <motion.g key={i} initial={{ opacity: 0.5 }}
                animate={{ opacity: isActive ? 1 : isPast ? 0.85 : 0.4 }}
                transition={{ duration: 0.25 }}>
                <rect x={10} y={y} width={ROW_W} height={ROW_H - 4} rx={5}
                  fill={isActive ? color + '14' : 'transparent'}
                  stroke={isActive ? color : color + '40'}
                  strokeWidth={isActive ? 1 : 0.5} />
                <circle cx={22} cy={y + 11} r={6} fill={isActive ? color : color + '30'} />
                <text x={22} y={y + 14} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill={isActive ? '#ffffff' : color}>{i + 1}</text>
                <text x={36} y={y + 14} fontSize={9} fontWeight={isActive ? 700 : 500}
                  fill={isActive ? color : 'var(--foreground)'}>
                  {labelOf(i)}
                </text>
                <text x={ROW_W} y={y + 14} textAnchor="end" fontSize={7.5}
                  fill="var(--muted-foreground)">{tagOf(i)}</text>
              </motion.g>
            );
          })}

          {/* 활성 단계 강조 박스 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} key={`hl-${step}`}>
            {step === 0 && <DataBox x={300} y={28} w={150} h={18} label="coefficient form" color={C.ntt} outlined />}
            {step === 1 && <ActionBox x={300} y={54} w={150} h={18} label="NTT (radix-2)" color={C.ntt} />}
            {step === 3 && <AlertBox x={300} y={106} w={150} h={18} label="0/0 위험" color={C.warn} />}
            {step === 4 && <DataBox x={300} y={132} w={150} h={18} label="g·omega^i" sub="coset" color={C.coset} outlined />}
            {step === 5 && <DataBox x={300} y={158} w={150} h={18} label="Z = g^n − 1 (상수)" color={C.coset} outlined />}
            {step === 7 && <StatusBox x={300} y={210} w={150} h={28} label="MSM (병목)" sub="70~80%" color={C.msm} progress={0.78} />}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}

function labelOf(i: number) {
  return [
    'f(x): 게이트 다항식',
    'NTT: f(x) → f(omega^i)',
    't(x): 몫 다항식 합산',
    't(x) / Z(x) = h(x)',
    'Coset NTT: t(g·omega^i)',
    'Pointwise division',
    'Coset INTT → h(x)',
    'KZG 커밋: [h(x)]_1',
  ][i];
}

function tagOf(i: number) {
  return [
    'coeff', 'eval', 'sum', 'div', 'eval (coset)', 'O(n)', 'coeff', 'MSM',
  ][i];
}
