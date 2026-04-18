import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Channel Pruning: CNN 필터 전체를 제거',
    body: 'Unstructured: 개별 가중치 0으로 → Structured: 필터/채널 통째로 제거.\n출력 텐서의 채널 수 자체가 줄어듦 → Dense 행렬곱 유지 → GPU 가속 가능.',
  },
  {
    label: 'L1-norm 기준: 필터 중요도 = Σ|w|',
    body: '각 필터의 L1-norm(가중치 절대값 합)을 계산.\nnorm이 작은 필터 = 출력 기여도 낮음 → 제거 대상.\nLi et al. (2017) "Pruning Filters for Efficient ConvNets".',
  },
  {
    label: 'Head Pruning: Transformer attention head 제거',
    body: 'Multi-Head Attention의 일부 head는 redundant.\nMichel et al. (2019): 16개 중 절반 제거해도 BLEU 0.5 이내 하락.\nhead importance = 해당 head 마스킹 시 loss 변화량.',
  },
  {
    label: 'Structured vs Unstructured: 실제 속도 비교',
    body: 'Unstructured 90% → 이론 10× 감소, 실측 1.2~1.5× (GPU 비효율).\nStructured 50% → 이론 2× 감소, 실측 1.8~2× (Dense 유지).\n결론: 실제 배포에는 Structured가 압도적으로 유리.',
  },
];

export const COLORS = {
  channel: '#3b82f6',
  pruned: '#ef4444',
  head: '#8b5cf6',
  kept: '#10b981',
  compare: '#f59e0b',
};
