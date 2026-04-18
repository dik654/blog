import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '문제: 학습 데이터가 부족하면 오버피팅 발생',
    body: '모델이 학습 데이터를 "외운다" — 새로운 데이터에서 성능 급락\n데이터 수집은 비싸고 느리다. 의료·위성·결함 탐지 등은 특히 심각',
  },
  {
    label: '해법: 기존 데이터를 변형하여 다양성 확보',
    body: '원본 이미지를 뒤집고, 회전하고, 색상을 바꾸면 — 모델이 "본질"을 학습\n라벨은 유지하면서 입력만 변형 → 공짜 데이터 확보',
  },
  {
    label: '효과: Train/Val 갭 축소 + 일반화 성능 향상',
    body: '증강 없이 Train 99% / Val 82% → 증강 후 Train 95% / Val 91%\n갭이 줄어들수록 실전(Test) 성능도 안정적',
  },
  {
    label: '도메인별 증강 전략이 다르다',
    body: '이미지: 기하학적 변환 + 색상 변환 + Mixup/CutMix\n테이블: SMOTE + 노이즈 주입 + 피처 셔플\n텍스트: 동의어 치환 + 역번역 + 문장 셔플',
  },
];

export const COLORS = {
  overfit: '#ef4444',
  augment: '#3b82f6',
  result: '#10b981',
  domain: '#8b5cf6',
};
