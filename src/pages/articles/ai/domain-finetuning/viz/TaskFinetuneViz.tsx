import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './TaskFinetuneVizData';

export default function TaskFinetuneViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Task-specific Head */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 인코더 블록 */}
              <ModuleBox x={40} y={60} w={140} h={50} label="Domain Encoder" sub="도메인 적응 완료 모델" color={COLORS.domain} />
              <motion.path d="M185,85 L225,85" stroke={COLORS.task} strokeWidth={2} fill="none" markerEnd="url(#arrTF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              {/* Task Head */}
              <ActionBox x={230} y={66} w={120} h={38} label="Task Head" sub="Linear + Softmax" color={COLORS.task} />
              <motion.path d="M355,85 L395,85" stroke={COLORS.task} strokeWidth={2} fill="none" markerEnd="url(#arrTF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.15 }} />
              <StatusBox x={400} y={58} w={100} h={54} label="예측 결과" sub="분류/회귀/NER" color={COLORS.task} progress={0.92} />

              {/* 이중 학습률 표시 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={40} y={130} width={140} height={30} rx={6} fill={COLORS.general} fillOpacity={0.06}
                  stroke={COLORS.general} strokeWidth={0.8} />
                <text x={110} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.general}>
                  LR = 1e-6 (freeze/낮음)
                </text>
                <rect x={230} y={130} width={120} height={30} rx={6} fill={COLORS.task} fillOpacity={0.06}
                  stroke={COLORS.task} strokeWidth={0.8} />
                <text x={290} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.task}>
                  LR = 1e-4 (높음)
                </text>
              </motion.g>

              <motion.text x={260} y={190} textAnchor="middle" fontSize={9} fill={COLORS.domain} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                인코더는 보존, 헤드만 빠르게 학습 → 이중 학습률 전략
              </motion.text>

              {/* 입력 화살표 */}
              <DataBox x={40} y={15} w={100} h={28} label="라벨 데이터" sub="도메인 태스크" color={COLORS.classify} />
              <motion.line x1={90} y1={45} x2={90} y2={58}
                stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4, delay: 0.1 }} />
            </motion.g>
          )}

          {/* Step 1: 태스크 유형별 접근 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                태스크 유형별 Head 구조
              </text>

              {/* 공통 인코더 */}
              <ModuleBox x={20} y={40} w={100} h={38} label="Encoder" sub="[CLS] + tokens" color={COLORS.domain} />

              {/* 분류 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <motion.line x1={125} y1={50} x2={165} y2={50}
                  stroke={COLORS.classify} strokeWidth={1.5} markerEnd="url(#arrTF)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4 }} />
                <rect x={170} y={32} width={150} height={40} rx={6} fill={COLORS.classify} fillOpacity={0.06}
                  stroke={COLORS.classify} strokeWidth={0.8} />
                <text x={245} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.classify}>분류 (Classification)</text>
                <text x={245} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[CLS] → Linear → Softmax</text>
                <DataBox x={340} y={36} w={80} h={28} label="양성/음성" sub="CE Loss" color={COLORS.classify} />
              </motion.g>

              {/* 회귀 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <motion.line x1={125} y1={59} x2={145} y2={105}
                  stroke={COLORS.accent} strokeWidth={1.5} markerEnd="url(#arrTF)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4, delay: 0.1 }} />
                <rect x={170} y={88} width={150} height={40} rx={6} fill={COLORS.accent} fillOpacity={0.06}
                  stroke={COLORS.accent} strokeWidth={0.8} />
                <text x={245} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.accent}>회귀 (Regression)</text>
                <text x={245} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[CLS] → Linear → 수치</text>
                <DataBox x={340} y={92} w={80} h={28} label="IC50 값" sub="MSE Loss" color={COLORS.accent} />
              </motion.g>

              {/* 시퀀스 라벨링 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <motion.line x1={125} y1={68} x2={145} y2={160}
                  stroke={COLORS.seq} strokeWidth={1.5} markerEnd="url(#arrTF)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4, delay: 0.2 }} />
                <rect x={170} y={144} width={150} height={40} rx={6} fill={COLORS.seq} fillOpacity={0.06}
                  stroke={COLORS.seq} strokeWidth={0.8} />
                <text x={245} y={160} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.seq}>시퀀스 라벨링 (NER)</text>
                <text x={245} y={174} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">각 토큰 → Linear → CRF</text>
                <DataBox x={340} y={148} w={90} h={28} label="B-Gene I-Gene" sub="CRF Loss" color={COLORS.seq} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 소량 라벨 데이터 전략 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                소량 라벨로 효과적 학습: 도메인 적응이 가져온 이점
              </text>

              {/* 도메인 미적응 vs 적응 비교 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <text x={160} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.alert}>도메인 미적응 모델</text>
                <text x={400} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.task}>도메인 적응 모델</text>
              </motion.g>

              {/* 라벨 수에 따른 성능 바 비교 */}
              {[
                { n: '100개', base: 55, adapted: 72 },
                { n: '500개', base: 68, adapted: 85 },
                { n: '1000개', base: 75, adapted: 91 },
                { n: '5000개', base: 82, adapted: 93 },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <text x={30} y={80 + i * 32} fontSize={9} fill="var(--foreground)" fontWeight={600}>{row.n}</text>
                  {/* 미적응 바 */}
                  <motion.rect x={90} y={70 + i * 32} width={0} height={10} rx={2}
                    fill={COLORS.alert} opacity={0.5}
                    animate={{ width: row.base * 2 }} transition={{ ...sp, duration: 0.6, delay: 0.2 + i * 0.1 }} />
                  <text x={95 + row.base * 2} y={80 + i * 32} fontSize={7.5} fill={COLORS.alert}>{row.base}%</text>
                  {/* 적응 바 */}
                  <motion.rect x={90} y={82 + i * 32} width={0} height={10} rx={2}
                    fill={COLORS.task} opacity={0.5}
                    animate={{ width: row.adapted * 2 }} transition={{ ...sp, duration: 0.6, delay: 0.3 + i * 0.1 }} />
                  <text x={95 + row.adapted * 2} y={92 + i * 32} fontSize={7.5} fill={COLORS.task}>{row.adapted}%</text>
                </motion.g>
              ))}

              {/* 핵심 메시지 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={80} y={195} width={360} height={22} rx={4} fill={COLORS.task} fillOpacity={0.06}
                  stroke={COLORS.task} strokeWidth={0.8} />
                <text x={260} y={210} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={COLORS.task}>
                  라벨 500개로 미적응 5000개 수준 달성 → 라벨링 비용 10배 절감
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Few-shot 연계 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                라벨이 극소량(8~50개)일 때: Few-shot 전략
              </text>

              {/* 3가지 전략 */}
              {[
                {
                  label: 'Prompt-tuning',
                  desc: 'MLM 재활용',
                  detail: '"이 문장은 [MASK] 감성"',
                  sub: '라벨 0개로도 가능',
                  color: COLORS.classify,
                  x: 20, y: 45,
                },
                {
                  label: 'In-context Learning',
                  desc: '예시 기반 추론',
                  detail: '예시 3개 → 추론',
                  sub: '학습 없이 즉시 적용',
                  color: COLORS.accent,
                  x: 190, y: 45,
                },
                {
                  label: 'SetFit',
                  desc: 'Contrastive + Head',
                  detail: '라벨 8개 → 90%+',
                  sub: '가장 효율적 Few-shot',
                  color: COLORS.task,
                  x: 360, y: 45,
                },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.15 }}>
                  <rect x={s.x} y={s.y} width={145} height={80} rx={8}
                    fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.8} />
                  <text x={s.x + 72} y={s.y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>
                    {s.label}
                  </text>
                  <text x={s.x + 72} y={s.y + 33} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">
                    {s.desc}
                  </text>
                  <text x={s.x + 72} y={s.y + 50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                    {s.detail}
                  </text>
                  <text x={s.x + 72} y={s.y + 65} textAnchor="middle" fontSize={8} fontWeight={600} fill={s.color}>
                    {s.sub}
                  </text>
                </motion.g>
              ))}

              {/* SetFit 파이프라인 상세 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={50} y={145} width={420} height={50} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={163} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.task}>
                  SetFit 파이프라인: 도메인 모델 + Contrastive 쌍 생성 → 분류 헤드 학습
                </text>
                <text x={260} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  라벨 8개 × 클래스 수 = 총 16~40개 예시 → Sentence Transformer fine-tune → Linear Head
                </text>
              </motion.g>
            </motion.g>
          )}

          <defs>
            <marker id="arrTF" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
