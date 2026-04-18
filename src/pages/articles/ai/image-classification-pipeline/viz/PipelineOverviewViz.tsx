import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  data: '#3b82f6',
  backbone: '#8b5cf6',
  augment: '#10b981',
  train: '#f59e0b',
  tta: '#ef4444',
  ensemble: '#06b6d4',
};

const STEPS: StepDef[] = [
  {
    label: '1단계: 데이터 탐색 (EDA)',
    body: '클래스 분포, 이미지 해상도 통계, 라벨 노이즈 확인.\n불균형 비율 > 10:1이면 Oversampling/Weighted Loss 필수.',
  },
  {
    label: '2단계: 백본 선택',
    body: 'EfficientNet(데이터 적을 때), ConvNeXt(중간), ViT(데이터 풍부).\ntimm 라이브러리에서 pretrained 모델 로드 — ImageNet-1K/21K.',
  },
  {
    label: '3단계: 데이터 증강 & 학습',
    body: 'RandAugment, CutMix, MixUp — 과적합 방지.\nProgressive Resizing: 224→384→512 단계적 해상도 증가.',
  },
  {
    label: '4단계: TTA & 앙상블',
    body: 'Test Time Augmentation: flip/rotate 후 예측 평균.\n서로 다른 모델·fold를 soft voting으로 합산 — 단일 모델 대비 0.5~2% 향상.',
  },
  {
    label: '5단계: 후처리 & 제출',
    body: 'Threshold 최적화 (F1 기준), Rank Averaging.\n최종 CSV 생성 — 대회 리더보드 제출.',
  },
];

export default function PipelineOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full h-auto" style={{ maxWidth: 640 }}>
          {/* 파이프라인 흐름 화살표 배경 */}
          <line x1={30} y1={100} x2={450} y2={100} stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 3" />

          {/* 5개 스테이지 */}
          {[
            { x: 10, label: 'EDA', sub: '데이터 탐색', color: COLORS.data, idx: 0 },
            { x: 105, label: 'Backbone', sub: '모델 선택', color: COLORS.backbone, idx: 1 },
            { x: 200, label: 'Augment', sub: '데이터 증강', color: COLORS.augment, idx: 2 },
            { x: 295, label: 'TTA', sub: '테스트 증강', color: COLORS.tta, idx: 3 },
            { x: 390, label: 'Ensemble', sub: '앙상블', color: COLORS.ensemble, idx: 4 },
          ].map((s) => (
            <motion.g
              key={s.label}
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{
                opacity: step >= s.idx ? 1 : 0.3,
                scale: step === s.idx ? 1.08 : step >= s.idx ? 1 : 0.9,
              }}
              transition={sp}
            >
              <ModuleBox x={s.x} y={70} w={80} h={55} label={s.label} sub={s.sub} color={s.color} />
            </motion.g>
          ))}

          {/* 화살표 */}
          {[85, 180, 275, 370].map((x, i) => (
            <motion.g
              key={x}
              initial={{ opacity: 0 }}
              animate={{ opacity: step > i ? 1 : 0.15 }}
              transition={sp}
            >
              <polygon points={`${x + 5},100 ${x + 15},95 ${x + 15},105`} fill="var(--muted-foreground)" />
            </motion.g>
          ))}

          {/* 하단 메트릭 */}
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 10 }}
            transition={sp}
          >
            <DataBox x={130} y={150} w={100} h={30} label="단일 모델 92%" color={COLORS.tta} />
          </motion.g>
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 10 }}
            transition={sp}
          >
            <DataBox x={260} y={150} w={100} h={30} label="앙상블 94%" color={COLORS.ensemble} />
          </motion.g>

          {/* 상단 전체 타이틀 */}
          <text x={240} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
            이미지 분류 파이프라인 — 5단계
          </text>
          <text x={240} y={36} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            EDA → 백본 → 증강·학습 → TTA → 앙상블
          </text>
        </svg>
      )}
    </StepViz>
  );
}
