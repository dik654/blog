import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './OverviewVizData';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Raw data → Model → Low score */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={30} y={60} w={100} h={36} label="원본 피처" sub="age, income..." color={COLORS.raw} />
              <line x1={135} y1={78} x2={195} y2={78} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowG)" />
              <ModuleBox x={200} y={55} w={110} h={46} label="XGBoost" sub="default params" color={COLORS.model} />
              <line x1={315} y1={78} x2={375} y2={78} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowG)" />
              <StatusBox x={380} y={53} w={110} h={50} label="AUC 0.72" sub="하위 50%" color={COLORS.score} progress={0.45} />
              <text x={260} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                원본 피처만으로는 패턴 포착 한계
              </text>
            </motion.g>
          )}

          {/* Step 1: Feature Engineering → Same model → High score */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={10} y={30} w={100} h={36} label="원본 피처" sub="age, income..." color={COLORS.raw} />
              <ActionBox x={10} y={85} w={100} h={38} label="피처 엔지니어링" sub="변환·인코딩·교차" color={COLORS.feat} />
              <line x1={115} y1={48} x2={150} y2={65} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={115} y1={104} x2={150} y2={87} stroke="var(--muted-foreground)" strokeWidth={1} />
              <DataBox x={155} y={58} w={100} h={36} label="파생 피처 42개" sub="ratio, agg, cross" color={COLORS.feat} outlined />
              <line x1={260} y1={76} x2={300} y2={76} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowG)" />
              <ModuleBox x={305} y={53} w={90} h={46} label="XGBoost" sub="같은 모델" color={COLORS.model} />
              <line x1={400} y1={76} x2={420} y2={76} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowG)" />
              <StatusBox x={425} y={51} w={85} h={50} label="AUC 0.91" sub="상위 10%" color={COLORS.feat} progress={0.91} />
              <text x={260} y={150} textAnchor="middle" fontSize={10} fill={COLORS.feat} fontWeight={600}>
                같은 모델인데 피처만 바꿔도 성능 급상승
              </text>
            </motion.g>
          )}

          {/* Step 2: 80/20 time allocation */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Bar chart: 80% FE, 20% model */}
              <rect x={60} y={50} width={320} height={32} rx={6} fill="var(--border)" opacity={0.2} />
              <motion.rect x={60} y={50} width={0} height={32} rx={6} fill={COLORS.feat} opacity={0.7}
                animate={{ width: 256 }} transition={{ ...sp, duration: 0.8 }} />
              <motion.rect x={316} y={50} width={0} height={32} rx={6} fill={COLORS.model} opacity={0.7}
                animate={{ width: 64 }} transition={{ ...sp, duration: 0.8, delay: 0.3 }} />
              <text x={188} y={71} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">80% 피처 엔지니어링</text>
              <text x={348} y={71} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ffffff">20%</text>
              <text x={348} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모델 튜닝</text>
              <text x={188} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">데이터 이해 + 피처 설계</text>
              <text x={260} y={145} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                Kaggle Grand Master들의 공통 전략
              </text>
            </motion.g>
          )}

          {/* Step 3: 6 strategies overview */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { label: '수치형 변환', sub: 'Scaling, Log', color: COLORS.raw, x: 30 },
                { label: '범주형 인코딩', sub: 'Target, Freq', color: COLORS.feat, x: 120 },
                { label: '인터랙션', sub: 'A×B, A/B', color: COLORS.model, x: 210 },
                { label: '집계 피처', sub: 'GroupBy', color: COLORS.score, x: 300 },
                { label: '피처 선택', sub: 'SHAP, Boruta', color: COLORS.accent, x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <ActionBox x={item.x} y={55} w={85} h={42} label={item.label} sub={item.sub} color={item.color} />
                </motion.g>
              ))}
              <text x={260} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                이 글에서 다루는 5가지 핵심 전략
              </text>
            </motion.g>
          )}

          {/* Arrow marker */}
          <defs>
            <marker id="arrowG" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
