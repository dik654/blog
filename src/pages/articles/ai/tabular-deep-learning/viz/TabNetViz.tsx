import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS as C, MASK_STEP1, MASK_STEP2, FEATURE_NAMES } from './TabNetVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function MaskBar({ x, y, value, label, color, delay }: {
  x: number; y: number; value: number; label: string; color: string; delay: number;
}) {
  const barW = 50;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay }}>
      <text x={x - 4} y={y + 10} textAnchor="end" fontSize={8} fill="var(--foreground)">{label}</text>
      <rect x={x} y={y} width={barW} height={14} rx={3} fill="var(--border)" opacity={0.2} />
      <motion.rect x={x} y={y} height={14} rx={3} fill={color} opacity={0.7}
        initial={{ width: 0 }} animate={{ width: barW * value }}
        transition={{ ...sp, delay: delay + 0.1 }} />
      <text x={x + barW + 6} y={y + 11} fontSize={8} fontWeight={600} fill={color}>
        {value.toFixed(1)}
      </text>
    </motion.g>
  );
}

export default function TabNetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {/* 입력 피처 */}
              <DataBox x={10} y={100} w={70} h={36} label="입력 피처" sub="D개" color={C.feat} />
              {/* Step 블록들 */}
              {[1, 2, 3].map((s, i) => (
                <motion.g key={s} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={110 + i * 120} y={30} width={100} height={180} rx={10}
                    fill={C.attn + '08'} stroke={C.attn} strokeWidth={0.8} />
                  <text x={160 + i * 120} y={22} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={C.attn}>Step {s}</text>
                  {/* 마스크 */}
                  <ActionBox x={117 + i * 120} y={40} w={86} h={32}
                    label="Attention Mask" sub="sparsemax" color={C.mask} />
                  {/* 인코더 */}
                  <ModuleBox x={117 + i * 120} y={90} w={86} h={40}
                    label="Shared Encoder" sub="FC + BN + GLU" color={C.encoder} />
                  {/* split */}
                  <text x={160 + i * 120} y={150} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">split</text>
                  <DataBox x={117 + i * 120} y={160} w={86} h={28}
                    label="h[i]" sub="출력 기여분" color={C.output} />
                  {/* 연결선 */}
                  <line x1={80} y1={118} x2={110 + i * 120} y2={118}
                    stroke={C.feat} strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
                </motion.g>
              ))}
              {/* 최종 합산 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <text x={480} y={88} textAnchor="middle" fontSize={9}
                  fill={C.output} fontWeight={600}>Σ h[i]</text>
                <DataBox x={455} y={100} w={55} h={36}
                  label="예측" sub="회귀/분류" color={C.output} />
                {[0, 1, 2].map(i => (
                  <line key={i} x1={203 + i * 120} y1={188} x2={455} y2={118}
                    stroke={C.output} strokeWidth={0.8} opacity={0.3} />
                ))}
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              {/* 피처 마스크 시각화 — Step 1 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.mask}>Step 1 마스크: 어떤 피처에 집중할지 결정</text>
              {FEATURE_NAMES.map((name, i) => (
                <MaskBar key={name} x={130} y={35 + i * 22} value={MASK_STEP1[i]}
                  label={name} color={C.mask} delay={i * 0.06} />
              ))}
              {/* sparsemax 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <rect x={260} y={35} width={230} height={110} rx={8}
                  fill={C.attn + '08'} stroke={C.attn} strokeWidth={0.6} />
                <text x={375} y={55} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.attn}>sparsemax vs softmax</text>
                <text x={280} y={75} fontSize={9} fill="var(--foreground)">
                  softmax: 모든 값 {'>'} 0 (완전히 0이 불가)
                </text>
                <text x={280} y={93} fontSize={9} fill={C.mask} fontWeight={600}>
                  sparsemax: 일부 값 = 정확히 0
                </text>
                <text x={280} y={111} fontSize={9} fill="var(--muted-foreground)">
                  → 진정한 피처 선택(hard selection) 효과
                </text>
                <text x={280} y={129} fontSize={9} fill="var(--muted-foreground)">
                  → 해석 가능성: "이 예측에 나이와 잔고가 핵심"
                </text>
              </motion.g>
              {/* 선택된 피처 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={40} y={170} width={440} height={55} rx={8}
                  fill={C.output + '08'} stroke={C.output} strokeWidth={0.6} />
                <text x={260} y={190} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.output}>선택 결과: 나이(0.9) + 잔고(0.8) → 인코더 입력</text>
                <text x={260} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  직업(0.0), 지역(0.0)은 이 스텝에서 완전히 무시 — 노이즈 피처 자동 제거
                </text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              {/* Step 2 마스크 — 다른 피처 주목 */}
              <text x={140} y={18} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.mask} opacity={0.5}>Step 1 (이전)</text>
              <text x={380} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.mask}>Step 2 (현재)</text>
              {FEATURE_NAMES.map((name, i) => (
                <motion.g key={name}>
                  {/* Step 1 마스크 (흐릿) */}
                  <text x={56} y={42 + i * 22} textAnchor="end" fontSize={8}
                    fill="var(--muted-foreground)">{name}</text>
                  <rect x={60} y={32 + i * 22} width={50 * MASK_STEP1[i]} height={12} rx={3}
                    fill={C.mask} opacity={0.2} />
                  {/* Step 2 마스크 (선명) */}
                  <MaskBar x={300} y={32 + i * 22} value={MASK_STEP2[i]}
                    label={name} color={C.mask} delay={i * 0.06} />
                </motion.g>
              ))}
              {/* 화살표 + prior scales 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                <line x1={180} y1={90} x2={280} y2={90}
                  stroke={C.attn} strokeWidth={1.5} markerEnd="url(#arrowAttn)" />
                <defs>
                  <marker id="arrowAttn" viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.attn} />
                  </marker>
                </defs>
                <rect x={185} y={68} width={90} height={22} rx={4}
                  fill="var(--card)" stroke={C.attn} strokeWidth={0.6} />
                <text x={230} y={83} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={C.attn}>prior scales</text>
              </motion.g>
              {/* 인스턴스별 차이 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={40} y={178} width={440} height={55} rx={8}
                  fill={C.encoder + '08'} stroke={C.encoder} strokeWidth={0.6} />
                <text x={260} y={198} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.encoder}>인스턴스별 피처 선택 (Instance-wise)</text>
                <text x={260} y={218} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  고객 A → 나이+잔고 중시 / 고객 B → 소득+거래수 중시 — 같은 모델, 다른 경로
                </text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              {/* 사전학습 시각화 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.encoder}>자기지도 사전학습 (Pretext Task)</text>
              {/* 원본 입력 */}
              <ModuleBox x={30} y={40} w={100} h={40} label="원본 입력"
                sub="D개 피처" color={C.feat} />
              {/* 마스킹 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}>
                <line x1={130} y1={60} x2={170} y2={60}
                  stroke={C.mask} strokeWidth={1.5} markerEnd="url(#arrowMask)" />
                <defs>
                  <marker id="arrowMask" viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.mask} />
                  </marker>
                </defs>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ActionBox x={175} y={40} w={100} h={40}
                  label="랜덤 마스킹" sub="피처 30% 제거" color={C.mask} />
              </motion.g>
              {/* TabNet 인코더 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <line x1={275} y1={60} x2={310} y2={60}
                  stroke={C.encoder} strokeWidth={1.5} />
                <ModuleBox x={315} y={35} w={90} h={50}
                  label="TabNet" sub="Encoder" color={C.encoder} />
              </motion.g>
              {/* 디코더 → 복원 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <line x1={405} y1={60} x2={430} y2={60}
                  stroke={C.output} strokeWidth={1.5} markerEnd="url(#arrowOut)" />
                <defs>
                  <marker id="arrowOut" viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.output} />
                  </marker>
                </defs>
                <ActionBox x={435} y={40} w={70} h={40}
                  label="복원" sub="마스킹 피처" color={C.output} />
              </motion.g>
              {/* 파인튜닝 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.65 }}>
                <rect x={60} y={120} width={400} height={100} rx={10}
                  fill={C.output + '06'} stroke={C.output} strokeWidth={0.6}
                  strokeDasharray="6 3" />
                <text x={260} y={142} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.output}>파인튜닝 단계</text>
                <text x={260} y={162} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">
                  사전학습된 인코더 가중치를 초기값으로 사용
                </text>
                <text x={260} y={180} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">
                  레이블 데이터 10%만으로 scratch 학습 대비 92% 성능 도달
                </text>
                <text x={260} y={198} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  특히 의료·금융 등 레이블 희소한 도메인에서 효과적
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
