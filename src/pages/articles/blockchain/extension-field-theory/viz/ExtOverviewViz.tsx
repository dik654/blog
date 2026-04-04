import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import RealToComplexSvg from './ExtOverviewParts/RealToComplex';
import F7ToF49Svg from './ExtOverviewParts/F7ToF49';
import WhyExtensionSvg from './ExtOverviewParts/WhyExtension';
import PairingSummarySvg from './ExtOverviewParts/PairingSummary';

const STEPS = [
  { label: '실수 → 복소수: x² + 1 = 0의 근 i를 도입', body: 'ℝ에서 해 없는 방정식의 근 i를 추가 → ℂ = ℝ[i].' },
  { label: 'F₇ → F₄₉: u² + 1 = 0의 근 u를 도입', body: 'F₇에서 해 없는 근 u 추가 → F₄₉. 원소: a+bu. 복소수와 동일 구조.' },
  { label: '왜 확장체가 필요한가?', body: 'G2 좌표는 Fp², GT는 Fp¹² 위 — 확장체 연산 필수.' },
  { label: 'BN254 페어링 전체 구조', body: 'G1(Fp) × G2(Fp²) → GT(Fp¹²). 확장체 없이는 ZKP 불가.' },
];

export default function ExtOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full flex justify-center">
          {step === 0 && <RealToComplexSvg />}
          {step === 1 && <F7ToF49Svg />}
          {step === 2 && <WhyExtensionSvg />}
          {step === 3 && <PairingSummarySvg />}
        </motion.div>
      )}
    </StepViz>
  );
}
