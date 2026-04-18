import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  source: '#3b82f6',
  target: '#10b981',
  shift: '#ef4444',
  adapt: '#f59e0b',
  continued: '#8b5cf6',
  accent: '#06b6d4',
};

export const STEPS: StepDef[] = [
  {
    label: '도메인 시프트(Domain Shift)란?',
    body: '소스 도메인(ImageNet 자연 사진)과 타깃 도메인(의료 X-ray)의 데이터 분포 차이. 분포가 다르면 pretrained 피처가 잘 전이되지 않는다.',
  },
  {
    label: 'Continued Pretraining — 도메인 코퍼스로 추가 사전학습',
    body: '일반 pretrained → 도메인 데이터로 MLM/MAE 추가 학습 → 도메인 fine-tune. BioBERT: PubMed 18억 토큰, SciBERT: Semantic Scholar 논문.',
  },
  {
    label: 'Domain Adaptation 기법 3가지',
    body: 'MMD(Maximum Mean Discrepancy): 두 도메인 피처 분포 정렬. DANN: 도메인 판별기 + gradient reversal. Self-training: pseudo-label로 타깃 학습.',
  },
  {
    label: '실전 사례: 환경 변동 대응 (구조물 안전 대회)',
    body: 'Train: 고정 환경 센서 데이터 → Test: 온도·습도 변동 환경. 대응: 환경 변수를 피처로 추가 + Test 조건에 가까운 augmentation + 도메인 적응.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
