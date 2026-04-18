import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Mixup — 두 이미지를 픽셀 단위로 혼합',
    body: 'x̃ = λ·x₁ + (1-λ)·x₂, ỹ = λ·y₁ + (1-λ)·y₂\nλ ~ Beta(α, α), α=0.2~0.4가 일반적. α↑ → 혼합이 강해짐\n라벨도 혼합 — 고양이 0.7 + 개 0.3 → soft label로 과적합 방지',
  },
  {
    label: 'CutMix — 한 이미지의 패치를 다른 이미지에 붙여넣기',
    body: 'Mixup의 문제: 전체가 투명하게 겹쳐 비현실적 이미지 생성\nCutMix: 잘라낸 영역의 면적 비율로 라벨 혼합 — λ = 1 - (w·h)/(W·H)\n지역적 특징을 보존하면서 혼합 → 분류·탐지 모두에서 Mixup보다 효과적',
  },
  {
    label: 'CutOut — 영역을 검은색으로 마스킹',
    body: 'Random Erasing과 유사하지만 고정 크기 정사각형 사용\n모델이 특정 부분에 의존하지 않도록 강제 — 주의(attention) 분산 효과\nCutMix가 CutOut의 상위호환: 마스킹 대신 다른 이미지를 채움',
  },
  {
    label: 'Mosaic — 4장의 이미지를 하나로 합성',
    body: 'YOLOv4에서 도입. 4장을 2×2로 배치하고 랜덤 비율로 분할\n한 배치에서 4배의 컨텍스트를 학습 — 작은 객체 탐지에 특히 효과적\nBN(배치 정규화) 통계가 4장 정보를 반영하여 미니배치 크기 의존성 감소',
  },
];

export const COLORS = {
  imgA: '#3b82f6',
  imgB: '#ef4444',
  mixed: '#8b5cf6',
  cutArea: '#f59e0b',
  mosaic: '#10b981',
};
