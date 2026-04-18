import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Dropout 없이: 모든 뉴런이 함께 활성화',
    body: '풀 네트워크 — 모든 연결이 살아있음. 특정 뉴런 조합에 과하게 의존(co-adaptation) 위험.',
  },
  {
    label: 'Dropout 적용: 확률 p로 뉴런을 무작위 비활성화',
    body: '학습 매 반복마다 서로 다른 서브네트워크로 학습 — 앙상블 효과. p=0.5가 FC layer 기본값.',
  },
  {
    label: 'Inverted Dropout: 활성 뉴런 출력을 1/(1-p)로 스케일링',
    body: '학습 시 스케일 보정 → 추론 시 아무 처리 없이 전체 네트워크 그대로 사용. 추론 효율 핵심.',
  },
  {
    label: 'Spatial Dropout: CNN에서 채널 단위로 통째로 끄기',
    body: '이미지에서 인접 픽셀이 상관됨 → 개별 뉴런 드롭은 비효율. 채널 전체를 끄면 특징맵 의존도 감소.',
  },
];

export const COLORS = {
  active: '#3b82f6',
  dropped: '#ef4444',
  scaled: '#10b981',
  channel: '#8b5cf6',
};
