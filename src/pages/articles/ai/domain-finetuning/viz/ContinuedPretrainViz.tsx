import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './ContinuedPretrainVizData';

export default function ContinuedPretrainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: MLM/CLM 학습 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={20} w={120} h={46} label="Pretrained Model" sub="BERT / GPT 가중치" color={COLORS.general} />
              <motion.path d="M145,43 L185,43" stroke={COLORS.domain} strokeWidth={2} fill="none" markerEnd="url(#arrCP)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              <DataBox x={190} y={28} w={110} h={30} label="도메인 코퍼스" sub="논문·서열·로그" color={COLORS.domain} outlined />
              <motion.path d="M305,43 L345,43" stroke={COLORS.domain} strokeWidth={2} fill="none" markerEnd="url(#arrCP)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.15 }} />
              <ActionBox x={350} y={24} w={140} h={38} label="Continued Pretrain" sub="MLM or CLM" color={COLORS.domain} />

              {/* MLM vs CLM 비교 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                {/* MLM */}
                <rect x={40} y={90} width={200} height={60} rx={8} fill={COLORS.lr} fillOpacity={0.06}
                  stroke={COLORS.lr} strokeWidth={0.8} />
                <text x={140} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.lr}>MLM (양방향)</text>
                <text x={140} y={122} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">
                  "환자의 [MASK] 수치가 높다"
                </text>
                <text x={140} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  [MASK] → "혈당" 예측 학습
                </text>
                {/* CLM */}
                <rect x={280} y={90} width={200} height={60} rx={8} fill={COLORS.accent} fillOpacity={0.06}
                  stroke={COLORS.accent} strokeWidth={0.8} />
                <text x={380} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.accent}>CLM (자기회귀)</text>
                <text x={380} y={122} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">
                  "ATCGATC → ?" 다음 토큰
                </text>
                <text x={380} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  → "G" 예측 학습
                </text>
              </motion.g>

              <motion.text x={260} y={180} textAnchor="middle" fontSize={9} fill={COLORS.domain} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                기존 가중치를 초기값으로 사용 → 도메인 지식을 점진적 흡수
              </motion.text>
            </motion.g>
          )}

          {/* Step 1: 학습률 설정 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                학습률(LR)에 따른 도메인 적응 결과
              </text>
              {/* LR 스펙트럼 바 */}
              <rect x={60} y={40} width={400} height={22} rx={4} fill="var(--border)" opacity={0.15} />
              {/* 그라데이션: 빨강 → 초록 → 빨강 */}
              <motion.rect x={60} y={40} width={130} height={22} rx={4} fill={COLORS.alert} opacity={0.2}
                initial={{ width: 0 }} animate={{ width: 130 }} transition={{ ...sp, duration: 0.6 }} />
              <motion.rect x={190} y={40} width={140} height={22} rx={4} fill={COLORS.task} opacity={0.25}
                initial={{ width: 0 }} animate={{ width: 140 }} transition={{ ...sp, duration: 0.6, delay: 0.1 }} />
              <motion.rect x={330} y={40} width={130} height={22} rx={4} fill={COLORS.alert} opacity={0.2}
                initial={{ width: 0 }} animate={{ width: 130 }} transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
              <text x={125} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.alert}>너무 낮음</text>
              <text x={260} y={55} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.task}>최적 구간</text>
              <text x={395} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.alert}>너무 높음</text>

              {/* 세 가지 시나리오 */}
              {[
                { label: 'LR = 2e-7', desc: '적응 부족', sub: '수렴 극히 느림', color: COLORS.alert, x: 40 },
                { label: 'LR = 2e-6', desc: '최적 적응', sub: '지식 보존 + 적응', color: COLORS.task, x: 200 },
                { label: 'LR = 2e-4', desc: '지식 파괴', sub: 'catastrophic forgetting', color: COLORS.alert, x: 360 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.12 }}>
                  <rect x={s.x} y={80} width={140} height={55} rx={8}
                    fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.8} />
                  <text x={s.x + 70} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={s.x + 70} y={113} textAnchor="middle" fontSize={9} fill="var(--foreground)">{s.desc}</text>
                  <text x={s.x + 70} y={127} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{s.sub}</text>
                </motion.g>
              ))}

              {/* 권장 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={130} y={150} width={260} height={30} rx={6} fill={COLORS.task} fillOpacity={0.08}
                  stroke={COLORS.task} strokeWidth={1} />
                <text x={260} y={168} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.task}>
                  권장: pretrain LR의 1/10 수준 (warm-up + cosine decay)
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 카타스트로픽 망각 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.alert}>
                Catastrophic Forgetting: 도메인 학습이 일반 지식을 덮어쓰는 현상
              </text>
              {/* 뇌 그림 비유: 일반 지식이 사라지는 과정 */}
              <ModuleBox x={30} y={40} w={120} h={46} label="Pretrained 지식" sub="문법·상식·추론" color={COLORS.general} />
              <motion.path d="M155,63 L195,63" stroke={COLORS.alert} strokeWidth={2} fill="none" markerEnd="url(#arrCP)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              <ActionBox x={200} y={44} w={120} h={38} label="도메인 학습" sub="높은 LR로 학습" color={COLORS.alert} />
              <motion.path d="M325,63 L365,63" stroke={COLORS.alert} strokeWidth={2} fill="none" markerEnd="url(#arrCP)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.15 }} />
              <AlertBox x={370} y={40} w={120} h={46} label="일반 지식 손실" sub="문법·추론력 저하" color={COLORS.alert} />

              {/* 방지책 3가지 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={260} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.task}>방지 전략</text>
              </motion.g>
              {[
                { label: '낮은 LR', sub: 'pretrain의 1/10', color: COLORS.lr, x: 30 },
                { label: '데이터 혼합', sub: '일반 5~10% 섞기', color: COLORS.task, x: 200 },
                { label: 'EWC 정규화', sub: '중요 가중치 보호', color: COLORS.accent, x: 370 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.12 }}>
                  <rect x={s.x} y={125} width={130} height={44} rx={8}
                    fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.8} />
                  <text x={s.x + 65} y={144} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>{s.label}</text>
                  <text x={s.x + 65} y={159} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">{s.sub}</text>
                </motion.g>
              ))}
              <motion.text x={260} y={195} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                실무에서는 "데이터 혼합"이 가장 간단하고 효과적
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: 데이터량 vs 효과 곡선 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                도메인 데이터량 vs 성능 향상 (수확 체감)
              </text>
              {/* 축 */}
              <line x1={60} y1={180} x2={480} y2={180} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={60} y1={180} x2={60} y2={35} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={270} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">도메인 데이터량 (토큰 수)</text>
              <text x={30} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90, 30, 108)">성능</text>

              {/* X축 라벨 */}
              {[
                { label: '100K', x: 100 },
                { label: '1M', x: 180 },
                { label: '10M', x: 280 },
                { label: '100M', x: 380 },
                { label: '1B', x: 460 },
              ].map((tick, i) => (
                <g key={i}>
                  <line x1={tick.x} y1={180} x2={tick.x} y2={184} stroke="var(--muted-foreground)" strokeWidth={0.5} />
                  <text x={tick.x} y={195} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{tick.label}</text>
                </g>
              ))}

              {/* 수확 체감 곡선 */}
              <motion.path
                d="M60,170 Q100,165 140,140 Q180,110 240,80 Q320,55 400,48 Q440,45 480,44"
                stroke={COLORS.task} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }} />

              {/* 핵심 포인트 마킹 */}
              {[
                { x: 140, y: 140, label: '큰 점프', color: COLORS.task },
                { x: 280, y: 65, label: '개선 둔화', color: COLORS.domain },
                { x: 420, y: 47, label: '수확 체감', color: COLORS.alert },
              ].map((pt, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.2 }}>
                  <circle cx={pt.x} cy={pt.y} r={4} fill={pt.color} />
                  <rect x={pt.x - 30} y={pt.y - 20} width={60} height={14} rx={3} fill="var(--card)" />
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill={pt.color}>{pt.label}</text>
                </motion.g>
              ))}

              {/* 최적 구간 표시 */}
              <motion.rect x={130} y={35} width={170} height={150} rx={0}
                fill={COLORS.task} fillOpacity={0.04} stroke={COLORS.task} strokeWidth={0.8} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1 }} />
              <motion.text x={215} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.task}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.1 }}>
                비용 대비 최적 구간
              </motion.text>
            </motion.g>
          )}

          <defs>
            <marker id="arrCP" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
