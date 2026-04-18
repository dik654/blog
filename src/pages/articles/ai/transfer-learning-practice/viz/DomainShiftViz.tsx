import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './DomainShiftVizData';

export default function DomainShiftViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Domain shift concept — two distributions */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Source distribution */}
              <text x={130} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.source}>
                소스 도메인 (ImageNet)
              </text>
              <ellipse cx={130} cy={80} rx={90} ry={45} fill={COLORS.source} fillOpacity={0.1}
                stroke={COLORS.source} strokeWidth={1.5} />
              <text x={130} y={75} textAnchor="middle" fontSize={8} fill={COLORS.source}>자연 사진</text>
              <text x={130} y={90} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                고양이·강아지·자동차
              </text>
              {/* Target distribution */}
              <text x={380} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.target}>
                타깃 도메인 (의료)
              </text>
              <ellipse cx={380} cy={80} rx={90} ry={45} fill={COLORS.target} fillOpacity={0.1}
                stroke={COLORS.target} strokeWidth={1.5} />
              <text x={380} y={75} textAnchor="middle" fontSize={8} fill={COLORS.target}>X-ray 이미지</text>
              <text x={380} y={90} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                폐·뼈·종양 패턴
              </text>
              {/* Gap arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={225} y1={80} x2={285} y2={80} stroke={COLORS.shift} strokeWidth={2}
                  markerEnd="url(#arrDS)" />
                <rect x={225} y={62} width={65} height={18} rx={4} fill={COLORS.shift} fillOpacity={0.12}
                  stroke={COLORS.shift} strokeWidth={0.6} />
                <text x={257} y={74} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.shift}>
                  Domain Gap
                </text>
              </motion.g>
              {/* Impact */}
              <rect x={80} y={145} width={360} height={55} rx={8}
                fill={COLORS.shift} fillOpacity={0.05} stroke={COLORS.shift} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={260} y={165} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.shift}>
                Gap이 클수록 전이 효과 감소
              </text>
              <text x={260} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                ImageNet → 자연 사진: Gap 작음 (전이 우수)
              </text>
              <text x={260} y={193} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                ImageNet → 의료 X-ray: Gap 큼 (피처 재학습 필요)
              </text>
            </motion.g>
          )}

          {/* Step 1: Continued Pretraining pipeline */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Stage 1: General pretrain */}
              <ModuleBox x={10} y={30} w={110} h={46} label="General Model" sub="BERT / ResNet" color={COLORS.source} />
              {/* Arrow */}
              <motion.line x1={125} y1={53} x2={155} y2={53}
                stroke={COLORS.continued} strokeWidth={2} markerEnd="url(#arrDS)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.2 }} />
              {/* Stage 2: Continued pretrain */}
              <ActionBox x={160} y={34} w={140} h={38} label="Continued Pretrain" sub="도메인 코퍼스 MLM/MAE" color={COLORS.continued} />
              {/* Arrow */}
              <motion.line x1={305} y1={53} x2={335} y2={53}
                stroke={COLORS.target} strokeWidth={2} markerEnd="url(#arrDS)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }} />
              {/* Stage 3: Fine-tune */}
              <ActionBox x={340} y={34} w={100} h={38} label="Fine-tune" sub="태스크 학습" color={COLORS.target} />
              {/* Arrow to result */}
              <motion.line x1={445} y1={53} x2={475} y2={53}
                stroke={COLORS.target} strokeWidth={1.5} markerEnd="url(#arrDS)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.6 }} />
              <text x={492} y={57} fontSize={9} fontWeight={700} fill={COLORS.target}>SOTA</text>
              {/* Examples */}
              {[
                { name: 'BioBERT', data: 'PubMed 18억 토큰', result: '의료 NER F1 +2.3%', color: COLORS.continued, y: 100 },
                { name: 'SciBERT', data: 'Semantic Scholar 논문', result: '과학 QA +3.1%', color: COLORS.accent, y: 140 },
                { name: 'ClinicalBERT', data: 'MIMIC-III 임상기록', result: '재입원 예측 AUC +5%', color: COLORS.adapt, y: 180 },
              ].map((ex, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.12 }}>
                  <rect x={30} y={ex.y} width={130} height={28} rx={5}
                    fill={`${ex.color}10`} stroke={ex.color} strokeWidth={0.8} />
                  <text x={95} y={ex.y + 12} textAnchor="middle" fontSize={8} fontWeight={600} fill={ex.color}>{ex.name}</text>
                  <text x={95} y={ex.y + 23} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{ex.data}</text>
                  <text x={260} y={ex.y + 17} fontSize={8} fill="var(--foreground)">{ex.result}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 2: Domain Adaptation techniques */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Domain Adaptation 3대 기법
              </text>
              {[
                {
                  name: 'MMD', full: 'Maximum Mean Discrepancy',
                  how: '소스·타깃 피처 분포의 평균 차이 최소화',
                  formula: 'L = L_task + λ · MMD(f_s, f_t)',
                  color: COLORS.source, x: 15, y: 40,
                },
                {
                  name: 'DANN', full: 'Domain-Adversarial NN',
                  how: '도메인 판별기 + Gradient Reversal Layer',
                  formula: '피처 추출기가 도메인 구분 못하게 학습',
                  color: COLORS.continued, x: 180, y: 40,
                },
                {
                  name: 'Self-training', full: 'Pseudo-Label',
                  how: '소스로 학습 → 타깃에 pseudo-label 부여 → 재학습',
                  formula: '반복할수록 타깃 적응도 증가',
                  color: COLORS.target, x: 345, y: 40,
                },
              ].map((tech, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={tech.x} y={tech.y} width={155} height={110} rx={8}
                    fill={`${tech.color}08`} stroke={tech.color} strokeWidth={1.5} />
                  <text x={tech.x + 77} y={tech.y + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={tech.color}>
                    {tech.name}
                  </text>
                  <text x={tech.x + 77} y={tech.y + 34} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                    {tech.full}
                  </text>
                  <line x1={tech.x + 10} y1={tech.y + 40} x2={tech.x + 145} y2={tech.y + 40}
                    stroke={tech.color} strokeOpacity={0.3} strokeWidth={0.6} />
                  <text x={tech.x + 77} y={tech.y + 58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                    {tech.how}
                  </text>
                  <rect x={tech.x + 8} y={tech.y + 72} width={139} height={28} rx={4}
                    fill="var(--muted)" fillOpacity={0.15} />
                  <text x={tech.x + 77} y={tech.y + 90} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                    {tech.formula}
                  </text>
                </motion.g>
              ))}
              {/* Comparison bar */}
              <rect x={15} y={170} width={490} height={38} rx={6}
                fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.6} />
              <text x={260} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
                MMD: 구현 단순 · DANN: 성능 우수 · Self-training: 레이블 없는 타깃에 적합
              </text>
              <text x={260} y={200} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                실전에서는 Continued Pretraining + MMD/Self-training 조합이 가장 흔함
              </text>
            </motion.g>
          )}

          {/* Step 3: Real-world case — structural safety with env shift */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Train env */}
              <ModuleBox x={20} y={20} w={130} h={46} label="Train 데이터" sub="고정 환경 (20C, 50%)" color={COLORS.source} />
              {/* Arrow with shift */}
              <motion.line x1={155} y1={43} x2={200} y2={43}
                stroke={COLORS.shift} strokeWidth={2} markerEnd="url(#arrDS)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.2 }} />
              <AlertBox x={205} y={19} w={130} h={48} label="환경 변동" sub="온도·습도 변화" color={COLORS.shift} />
              <motion.line x1={340} y1={43} x2={385} y2={43}
                stroke={COLORS.shift} strokeWidth={2} markerEnd="url(#arrDS)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <ModuleBox x={390} y={20} w={110} h={46} label="Test 데이터" sub="변동 환경" color={COLORS.target} />
              {/* Solutions */}
              <text x={260} y={90} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.adapt}>
                대응 전략 3가지
              </text>
              {[
                { label: '환경 변수 피처화', desc: '온도·습도를 입력 피처로 추가', color: COLORS.adapt, x: 20 },
                { label: '환경 Augmentation', desc: '노이즈·온도 시뮬레이션 추가', color: COLORS.continued, x: 195 },
                { label: 'Domain Adaptation', desc: 'MMD로 피처 분포 정렬', color: COLORS.target, x: 370 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.12 }}>
                  <rect x={s.x} y={105} width={155} height={48} rx={6}
                    fill={`${s.color}08`} stroke={s.color} strokeWidth={1} />
                  <text x={s.x + 77} y={122} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.color}>
                    {s.label}
                  </text>
                  <text x={s.x + 77} y={140} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                    {s.desc}
                  </text>
                </motion.g>
              ))}
              {/* Bottom insight */}
              <rect x={40} y={170} width={440} height={38} rx={6}
                fill={COLORS.adapt} fillOpacity={0.06} stroke={COLORS.adapt} strokeWidth={0.8} />
              <text x={260} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.adapt}>
                핵심: 도메인 차이를 "인식"하고 명시적으로 대응해야 한다
              </text>
              <text x={260} y={200} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                단순 fine-tuning만으로는 환경 변동에 취약 → 반드시 도메인 적응 기법 병행
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrDS" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
