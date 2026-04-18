import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  pretrain: '#6366f1',
  finetune: '#10b981',
  domain: '#f59e0b',
  nlp: '#3b82f6',
  vision: '#ec4899',
  accent: '#8b5cf6',
};

export const STEPS: StepDef[] = [
  {
    label: '기존 방식: 처음부터 학습 (Training from Scratch)',
    body: '수백만 장 이미지와 수천 GPU 시간이 필요하다. 소규모 팀/데이터로는 비현실적.',
  },
  {
    label: 'Transfer Learning: 사전학습 지식 재활용',
    body: 'ImageNet 1400만 장으로 학습된 가중치를 가져와서 내 데이터(수천 장)로 미세조정. 학습 시간 10배 단축, 성능 우수.',
  },
  {
    label: 'CV: ImageNet → 내 도메인으로 전이',
    body: '하위 레이어(에지·텍스처)는 도메인 무관 → 그대로 재활용. 상위 레이어만 내 데이터에 맞게 조정.',
  },
  {
    label: 'NLP: BERT/GPT pretrained → 내 태스크로 전이',
    body: '대규모 코퍼스로 언어 구조를 학습한 모델 → 감성 분석, QA, 요약 등 downstream task에 fine-tuning.',
  },
  {
    label: '도메인 특화: 의료·유전체·위성도 전이학습 적용',
    body: 'BioBERT(의료), GenomicBERT(유전체), SatMAE(위성) — 일반 pretrained + 도메인 코퍼스 추가 학습.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
