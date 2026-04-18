import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  threshold: '#f59e0b',
  soft: '#3b82f6',
  hard: '#10b981',
  rank: '#8b5cf6',
  fold: '#ef4444',
  accent: '#06b6d4',
};

const STEPS: StepDef[] = [
  {
    label: 'Threshold 최적화 — F1 Score 기준',
    body: '기본 threshold 0.5 → 최적 threshold 탐색.\nValidation set에서 0.3~0.7 구간을 0.01 단위 스캔.\nF1 = 2·Precision·Recall / (Precision+Recall) 최대화 지점 선택.\n불균형 데이터일수록 0.5에서 크게 벗어남 — 반드시 탐색 필요.',
  },
  {
    label: 'Soft Voting vs Hard Voting',
    body: 'Hard Voting: 각 모델의 예측 클래스 → 다수결. 단순하지만 정보 손실.\nSoft Voting: 각 모델의 확률 출력 → 평균 → argmax. 신뢰도 반영.\nSoft가 거의 항상 우수 — 불확실한 예측의 "강도"를 보존하기 때문.\n모델 3~5개가 최적, 7개 이상은 수확 체감.',
  },
  {
    label: '같은 데이터 다른 모델 + 같은 모델 다른 Fold',
    body: 'Cross-Model: EfficientNet + ConvNeXt + ViT → 서로 다른 귀납 편향 보완.\nCross-Fold: 5-Fold CV × 1개 모델 = 5개 예측 → 평균. 분산 감소.\n최강 조합: 3모델 × 5Fold = 15개 예측 앙상블.\n주의: 상관관계 높은 모델끼리 앙상블하면 효과 미미.',
  },
  {
    label: 'Rank Averaging — 스케일 불일치 해결',
    body: '문제: 모델마다 확률 스케일이 다름 (잘 calibrated 되지 않은 모델).\n해법: 확률 대신 순위(rank)를 평균.\n각 모델의 예측값을 0~1 rank로 변환 → rank 평균 → 최종 순서.\nPrecision@K, AUC 등 순위 기반 메트릭에서 특히 효과적.',
  },
];

export default function PostprocessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 640 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
            후처리 & 앙상블
          </text>

          {/* Step 0: Threshold 최적화 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 0 ? 1 : 0 }}
            transition={sp}
          >
            {/* F1 커브 시뮬레이션 */}
            <text x={80} y={45} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">F1 Score vs Threshold</text>

            {/* 축 */}
            <line x1={40} y1={160} x2={300} y2={160} stroke="var(--border)" strokeWidth={1.2} />
            <line x1={40} y1={55} x2={40} y2={160} stroke="var(--border)" strokeWidth={1.2} />
            <text x={170} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Threshold</text>
            <text x={32} y={50} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">F1</text>

            {/* F1 커브 — 포물선 형태 */}
            <path
              d="M 50,150 Q 100,120 140,70 Q 170,50 200,65 Q 240,90 280,145"
              fill="none" stroke={COLORS.threshold} strokeWidth={2.5}
            />

            {/* 최적점 마커 */}
            <motion.circle
              cx={170} cy={52} r={6}
              fill={COLORS.threshold} fillOpacity={0.3}
              stroke={COLORS.threshold} strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...sp, delay: 0.3 }}
            />
            <line x1={170} y1={58} x2={170} y2={160} stroke={COLORS.threshold} strokeWidth={1} strokeDasharray="3 2" />
            <text x={170} y={190} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.threshold}>최적: 0.42</text>

            {/* 눈금 */}
            {[0.3, 0.4, 0.5, 0.6, 0.7].map((v, i) => (
              <text key={v} x={50 + i * 57} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{v}</text>
            ))}

            {/* 설명 박스 */}
            <rect x={320} y={50} width={150} height={80} rx={8} fill={COLORS.threshold} fillOpacity={0.06} stroke={COLORS.threshold} strokeWidth={1} />
            <text x={395} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.threshold}>Threshold 탐색</text>
            <text x={395} y={88} textAnchor="middle" fontSize={9} fill="var(--foreground)">0.3~0.7 구간</text>
            <text x={395} y={102} textAnchor="middle" fontSize={9} fill="var(--foreground)">0.01 단위 스캔</text>
            <text x={395} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Val F1 최대화</text>

            <AlertBox x={330} y={150} w={130} h={40} label="불균형 데이터" sub="0.5와 크게 다를 수 있음" color={COLORS.threshold} />
          </motion.g>

          {/* Step 1: Soft vs Hard Voting */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 1 : 0 }}
            transition={sp}
          >
            {/* 3개 모델 */}
            {['Model A', 'Model B', 'Model C'].map((m, i) => (
              <g key={m}>
                <ModuleBox x={20} y={40 + i * 55} w={80} h={42} label={m} color={i === 0 ? COLORS.soft : i === 1 ? COLORS.hard : COLORS.rank} />
              </g>
            ))}

            {/* Hard Voting */}
            <rect x={140} y={35} width={130} height={80} rx={8} fill={COLORS.hard} fillOpacity={0.06} stroke={COLORS.hard} strokeWidth={1.2} />
            <text x={205} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.hard}>Hard Voting</text>
            <text x={205} y={68} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">A:cat B:cat C:dog</text>
            <text x={205} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ 다수결: cat</text>
            <text x={205} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">확률 정보 손실</text>

            {/* Soft Voting */}
            <rect x={290} y={35} width={170} height={80} rx={8} fill={COLORS.soft} fillOpacity={0.06} stroke={COLORS.soft} strokeWidth={1.2} />
            <text x={375} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.soft}>Soft Voting</text>
            <text x={375} y={68} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">cat: 0.7, 0.6, 0.3</text>
            <text x={375} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">avg = 0.53 → cat</text>
            <text x={375} y={105} textAnchor="middle" fontSize={8} fill={COLORS.soft}>신뢰도 반영 → 더 정확</text>

            {/* 승리 표시 */}
            <motion.g
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...sp, delay: 0.4 }}
            >
              <rect x={340} y={120} width={80} height={24} rx={12} fill={COLORS.soft} fillOpacity={0.2} stroke={COLORS.soft} strokeWidth={1.5} />
              <text x={380} y={136} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.soft}>추천</text>
            </motion.g>

            <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              모델 3~5개가 최적 | 7개 이상은 수확 체감
            </text>

            {/* 연결선 */}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <line x1={105} y1={61 + i * 55} x2={140} y2={75} stroke="var(--border)" strokeWidth={0.8} />
                <line x1={105} y1={61 + i * 55} x2={290} y2={75} stroke="var(--border)" strokeWidth={0.8} />
              </g>
            ))}
          </motion.g>

          {/* Step 2: Cross-Model + Cross-Fold */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : 0 }}
            transition={sp}
          >
            <text x={120} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Cross-Model</text>
            <text x={370} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Cross-Fold (5-Fold)</text>

            {/* Cross-Model */}
            {[
              { label: 'EfficientNet', color: COLORS.soft },
              { label: 'ConvNeXt', color: COLORS.hard },
              { label: 'ViT', color: COLORS.rank },
            ].map((m, i) => (
              <motion.g key={m.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: i * 0.1 }}
              >
                <ActionBox x={30} y={52 + i * 36} w={100} h={30} label={m.label} color={m.color} />
              </motion.g>
            ))}
            <text x={120} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">서로 다른 귀납 편향</text>

            {/* 구분선 */}
            <line x1={240} y1={40} x2={240} y2={180} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />

            {/* Cross-Fold */}
            {[0, 1, 2, 3, 4].map((f) => (
              <motion.g key={f}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: f * 0.08 }}
              >
                <DataBox x={280} y={52 + f * 28} w={80} h={22} label={`Fold ${f + 1}`} color={COLORS.fold} />
                <text x={380} y={67 + f * 28} fontSize={8} fill="var(--muted-foreground)">val={20 * (f + 1) - 19}-{20 * (f + 1)}%</text>
              </motion.g>
            ))}
            <text x={370} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">5개 예측 평균 → 분산 감소</text>

            {/* 최강 조합 */}
            <DataBox x={160} y={188} w={160} h={26} label="3모델 × 5Fold = 15 앙상블" color={COLORS.accent} outlined />
          </motion.g>

          {/* Step 3: Rank Averaging */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0 }}
            transition={sp}
          >
            <text x={240} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Rank Averaging</text>

            {/* 모델별 확률 → 순위 변환 */}
            <rect x={20} y={55} width={200} height={100} rx={8} fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.8} />
            <text x={120} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">확률 출력 (raw)</text>

            {/* 테이블 */}
            {[
              { m: 'Model A', vals: [0.92, 0.45, 0.88] },
              { m: 'Model B', vals: [0.71, 0.33, 0.95] },
            ].map((row, i) => (
              <g key={row.m}>
                <text x={30} y={92 + i * 22} fontSize={9} fontWeight={600} fill="var(--foreground)">{row.m}</text>
                {row.vals.map((v, j) => (
                  <text key={j} x={120 + j * 35} y={92 + i * 22} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">{v}</text>
                ))}
              </g>
            ))}
            <text x={120} y={143} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">스케일 불일치 문제</text>

            {/* 화살표 */}
            <polygon points="228,100 240,95 240,105" fill={COLORS.rank} opacity={0.6} />
            <text x={234} y={88} fontSize={8} fontWeight={600} fill={COLORS.rank}>rank</text>

            {/* 순위 변환 결과 */}
            <rect x={250} y={55} width={210} height={100} rx={8} fill={COLORS.rank} fillOpacity={0.06} stroke={COLORS.rank} strokeWidth={1} />
            <text x={355} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.rank}>순위 (0~1)</text>

            {[
              { m: 'Model A', vals: ['1.0', '0.33', '0.67'] },
              { m: 'Model B', vals: ['0.67', '0.0', '1.0'] },
            ].map((row, i) => (
              <g key={row.m}>
                <text x={260} y={92 + i * 22} fontSize={9} fontWeight={600} fill="var(--foreground)">{row.m}</text>
                {row.vals.map((v, j) => (
                  <text key={j} x={350 + j * 35} y={92 + i * 22} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.rank}>{v}</text>
                ))}
              </g>
            ))}

            <text x={355} y={143} textAnchor="middle" fontSize={8} fill={COLORS.rank}>스케일 통일</text>

            {/* 평균 결과 */}
            <DataBox x={160} y={170} w={160} h={28} label="Rank 평균 → 최종 순서" color={COLORS.rank} outlined />
            <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              AUC·Precision@K 등 순위 메트릭에 특히 효과적
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
