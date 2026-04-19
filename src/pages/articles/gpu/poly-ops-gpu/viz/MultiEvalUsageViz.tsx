import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  kzg: '#0ea5e9',
  plonk: '#10b981',
  batch: '#a855f7',
  point: '#f59e0b',
};

const STEPS = [
  {
    label: '1. KZG Opening Proof',
    body: '증명자가 다항식 f(x)를 challenge point z에서 평가.\n→ f(z) 계산 (단일 점 Horner) → 몫 q(x) = (f(x) − f(z)) / (x − z) → [q(x)] MSM 커밋.',
  },
  {
    label: '2. PLONK Verifier Challenge',
    body: '라운드별 challenge alpha, beta, gamma, zeta에서 다항식 평가.\n→ 평가점 4~6개 → 스레드 4~6개로 병렬 Horner.',
  },
  {
    label: '3. Batch Opening — 여러 다항식, 같은 점',
    body: 'f1(z), f2(z), ..., fm(z)를 동시에 평가.\n각 다항식마다 Horner 1회, m개 인스턴스 병렬 → m이 클수록 GPU 활용도 상승.',
  },
];

export default function MultiEvalUsageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            PLONK / KZG 다점 평가 사용처
          </text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={40} w={180} h={36} label="f(x) (계수)" sub="commitment opening" color={C.kzg} outlined />
              <DataBox x={280} y={40} w={180} h={36} label="z (challenge)" sub="검증자 제공" color={C.point} outlined />

              <ActionBox x={20} y={94} w={440} h={32} label="f(z) 계산 — 단일 점 Horner" sub="O(n) 순차, 평가점 1개" color={C.kzg} />

              <ActionBox x={20} y={140} w={440} h={32} label="q(x) = (f(x) − f(z)) / (x − z)" sub="다항식 나눗셈" color={C.kzg} />

              <StatusBox x={20} y={184} w={440} h={36} label="[q(x)] MSM 커밋 → opening proof" sub="G1 점 1개" color={C.kzg} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={40} w={440} h={20} label="PLONK 라운드별 challenge 평가" color={C.plonk} />
              {['alpha', 'beta', 'gamma', 'zeta'].map((ch, i) => (
                <g key={ch}>
                  <DataBox x={20 + i * 110} y={70} w={100} h={26} label={ch} sub={`thread ${i}`} color={C.point} outlined />
                  <ActionBox x={20 + i * 110} y={104} w={100} h={32} label={`f(${ch})`} sub="Horner" color={C.plonk} />
                </g>
              ))}
              <StatusBox x={20} y={150} w={440} h={36} label="4~6 스레드 병렬 Horner — 작은 grid로 충분" sub="런치 오버헤드가 더 큼" color={C.plonk} progress={0.5} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={170} y={36} w={140} h={28} label="z (공통 점)" color={C.point} outlined />
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <DataBox x={20 + i * 90} y={84} w={80} h={26} label={`f${i + 1}(x)`} color={C.batch} outlined />
                  <motion.line
                    x1={60 + i * 90} y1={110} x2={60 + i * 90} y2={140}
                    stroke={C.batch} strokeWidth={1}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.06 }} />
                  <ActionBox x={20 + i * 90} y={142} w={80} h={28} label={`f${i + 1}(z)`} sub="Horner" color={C.batch} />
                </g>
              ))}
              <StatusBox x={20} y={186} w={440} h={32} label="m 다항식 병렬 — m 클수록 SM 채움" sub="Filecoin/Aztec batch opening" color={C.batch} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
