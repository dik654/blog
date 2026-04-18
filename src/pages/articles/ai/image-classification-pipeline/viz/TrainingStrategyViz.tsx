import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  prog: '#3b82f6',
  tta: '#ef4444',
  pseudo: '#10b981',
  augment: '#f59e0b',
  accent: '#8b5cf6',
};

const STEPS: StepDef[] = [
  {
    label: 'Progressive Resizing — 저해상도에서 고해상도로',
    body: '1단계: 224×224로 30 epoch → 빠른 수렴, 대략적 특징 학습.\n2단계: 384×384로 15 epoch → 미세 디테일 학습, LR 1/5 감소.\n3단계: 512×512로 5 epoch → 최종 미세조정.\n작은 해상도에서 학습 → 큰 해상도 전이: 총 학습 시간 40% 절약.',
  },
  {
    label: 'Multi-Scale Training & 고급 증강',
    body: 'RandAugment: N개 변환 × M 강도 — AutoAugment의 탐색 비용 제거.\nCutMix: 이미지 일부를 다른 이미지로 교체, 라벨도 비율만큼 혼합.\nMixUp: 두 이미지를 λ:1-λ로 블렌딩 — 결정 경계 평활화.\n세 기법 조합 시 과적합 방지 + 일반화 성능 2~3% 향상.',
  },
  {
    label: 'TTA (Test Time Augmentation)',
    body: '테스트 이미지 하나에 N가지 증강 적용 → N개 예측 → 평균.\n기본: 원본 + 좌우반전 = 2× (거의 공짜로 0.3% 향상).\n강화: + 90°/180°/270° 회전 + 스케일 = 8× (0.5~1% 향상).\n주의: 회전 불변이 아닌 데이터(텍스트, 위성)에선 회전 TTA 제외.',
  },
  {
    label: 'Pseudo-Labeling — 테스트 데이터 활용',
    body: '1차 모델 학습 → 테스트 데이터에 예측 → 높은 신뢰도(>0.95) 샘플만 라벨 부여.\n2차 학습: 원본 train + pseudo-labeled test로 재학습.\n효과: 라벨 없는 데이터로 실질적 데이터 증강, 대회에서 0.5~1.5% 향상.\n위험: 낮은 threshold → 오류 전파(confirmation bias). 반드시 높은 threshold 사용.',
  },
];

export default function TrainingStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 640 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
            학습 전략
          </text>

          {/* Step 0: Progressive Resizing */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 0 ? 1 : 0 }}
            transition={sp}
          >
            {/* 3단계 해상도 박스 — 크기 증가 */}
            {[
              { x: 40, w: 60, h: 60, res: '224²', ep: '30 ep', lr: 'LR: 3e-4' },
              { x: 160, w: 80, h: 80, res: '384²', ep: '15 ep', lr: 'LR: 6e-5' },
              { x: 310, w: 100, h: 100, res: '512²', ep: '5 ep', lr: 'LR: 1e-5' },
            ].map((s, i) => (
              <g key={s.res}>
                <motion.rect
                  x={s.x} y={140 - s.h} width={s.w} height={s.h} rx={6}
                  fill={COLORS.prog} fillOpacity={0.08 + i * 0.06}
                  stroke={COLORS.prog} strokeWidth={1.5}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.15 }}
                />
                <text x={s.x + s.w / 2} y={140 - s.h / 2 - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.prog}>{s.res}</text>
                <text x={s.x + s.w / 2} y={140 - s.h / 2 + 10} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.ep}</text>
                <text x={s.x + s.w / 2} y={140 - s.h / 2 + 22} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{s.lr}</text>
              </g>
            ))}
            {/* 화살표 */}
            <polygon points="110,100 122,95 122,105" fill={COLORS.prog} opacity={0.6} />
            <polygon points="250,80 262,75 262,85" fill={COLORS.prog} opacity={0.6} />

            <DataBox x={170} y={158} w={140} h={28} label="총 학습시간 40% 절약" color={COLORS.prog} />
            <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              작은 이미지 → 빠른 수렴 → 큰 이미지 → 미세 디테일
            </text>
          </motion.g>

          {/* Step 1: Augmentation */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 1 : 0 }}
            transition={sp}
          >
            {[
              { x: 15, label: 'RandAugment', sub: 'N=2, M=9', detail: '자동 변환 조합' },
              { x: 170, label: 'CutMix', sub: '영역 교체', detail: '라벨 비율 혼합' },
              { x: 325, label: 'MixUp', sub: 'λ 블렌딩', detail: '결정경계 평활화' },
            ].map((a, i) => (
              <g key={a.label}>
                <motion.g
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}
                >
                  <ModuleBox x={a.x} y={40} w={140} h={52} label={a.label} sub={a.sub} color={COLORS.augment} />
                  <text x={a.x + 70} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{a.detail}</text>
                </motion.g>
              </g>
            ))}

            {/* CutMix 시각화 — 두 이미지 겹침 */}
            <rect x={190} y={120} width={40} height={40} rx={3} fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={0.8} />
            <rect x={210} y={130} width={20} height={20} rx={2} fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={0.8} />
            <text x={210} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이미지 A + B 영역</text>

            {/* MixUp 시각화 */}
            <rect x={345} y={120} width={40} height={40} rx={3} fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.8} />
            <rect x={345} y={120} width={40} height={40} rx={3} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.8} />
            <text x={365} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">λA + (1-λ)B</text>

            <DataBox x={90} y={185} w={140} h={26} label="과적합 방지 + 2~3%↑" color={COLORS.augment} />
          </motion.g>

          {/* Step 2: TTA */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : 0 }}
            transition={sp}
          >
            {/* 원본 이미지 */}
            <rect x={20} y={45} width={60} height={60} rx={6} fill={COLORS.tta} fillOpacity={0.1} stroke={COLORS.tta} strokeWidth={1.5} />
            <text x={50} y={80} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.tta}>원본</text>

            {/* 화살표 분기 */}
            <line x1={85} y1={60} x2={130} y2={45} stroke={COLORS.tta} strokeWidth={1} />
            <line x1={85} y1={75} x2={130} y2={75} stroke={COLORS.tta} strokeWidth={1} />
            <line x1={85} y1={90} x2={130} y2={105} stroke={COLORS.tta} strokeWidth={1} />
            <line x1={85} y1={100} x2={130} y2={135} stroke={COLORS.tta} strokeWidth={1} />

            {/* 증강 변형들 */}
            {['원본', '좌우반전', '90° 회전', '스케일 1.1×'].map((t, i) => (
              <motion.g key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: i * 0.1 }}
              >
                <ActionBox x={135} y={30 + i * 30} w={90} h={24} label={t} color={COLORS.tta} />
              </motion.g>
            ))}

            {/* 모델 추론 */}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <line x1={230} y1={42 + i * 30} x2={260} y2={42 + i * 30} stroke="var(--border)" strokeWidth={0.8} />
              </g>
            ))}

            <ModuleBox x={265} y={50} w={80} h={48} label="Model" sub="추론 ×4" color={COLORS.accent} />

            {/* 평균 */}
            <line x1={350} y1={75} x2={380} y2={75} stroke="var(--border)" strokeWidth={1} />
            <polygon points="378,75 388,70 388,80" fill={COLORS.accent} />

            <ActionBox x={395} y={56} w={70} h={36} label="평균" sub="Soft avg" color={COLORS.tta} />

            <DataBox x={180} y={170} w={120} h={28} label="+0.5~1.0% 향상" color={COLORS.tta} />
          </motion.g>

          {/* Step 3: Pseudo-Labeling */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0 }}
            transition={sp}
          >
            {/* 1차 학습 */}
            <ModuleBox x={15} y={40} w={90} h={44} label="1차 모델" sub="Train 학습" color={COLORS.pseudo} />

            <polygon points="110,62 122,57 122,67" fill={COLORS.pseudo} opacity={0.6} />

            {/* 테스트 예측 */}
            <ActionBox x={130} y={43} w={90} h={38} label="Test 예측" sub="신뢰도 평가" color={COLORS.pseudo} />

            <polygon points="225,62 237,57 237,67" fill={COLORS.pseudo} opacity={0.6} />

            {/* 필터 */}
            <rect x={245} y={40} width={80} height={44} rx={6} fill={COLORS.pseudo} fillOpacity={0.08} stroke={COLORS.pseudo} strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={285} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.pseudo}>P &gt; 0.95</text>
            <text x={285} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">높은 신뢰도만</text>

            <polygon points="330,62 342,57 342,67" fill={COLORS.pseudo} opacity={0.6} />

            {/* 합치기 */}
            <ModuleBox x={350} y={40} w={110} h={44} label="2차 학습" sub="Train + Pseudo" color={COLORS.accent} />

            {/* 하단 데이터 흐름 */}
            <DataBox x={40} y={110} w={100} h={26} label="Train: 10K" color={COLORS.pseudo} />
            <text x={165} y={127} fontSize={10} fontWeight={700} fill={COLORS.pseudo}>+</text>
            <DataBox x={185} y={110} w={100} h={26} label="Pseudo: ~3K" color={COLORS.accent} />
            <text x={310} y={127} fontSize={10} fontWeight={700} fill={COLORS.pseudo}>=</text>
            <DataBox x={330} y={110} w={100} h={26} label="합계: ~13K" color={COLORS.pseudo} outlined />

            <StatusBox x={140} y={155} w={200} h={48} label="데이터 30% 증가 효과" sub="+0.5~1.5% 향상 (높은 threshold 필수)" color={COLORS.pseudo} progress={0.7} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
