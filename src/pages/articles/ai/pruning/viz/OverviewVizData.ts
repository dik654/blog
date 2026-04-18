import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '프루닝 원리: 중요하지 않은 가중치를 제거',
    body: '학습된 네트워크의 가중치 중 상당수는 최종 출력에 거의 영향을 주지 않는다.\n이런 "불필요한" 연결을 제거해도 정확도 손실이 거의 없다.',
  },
  {
    label: 'Lottery Ticket Hypothesis: 당첨 티켓 서브네트워크',
    body: 'Frankle & Carlin (2019): 랜덤 초기화된 Dense 네트워크 안에는,\n독립적으로 학습 가능한 Sparse 서브네트워크("당첨 티켓")가 존재한다.\n이 서브네트워크만 학습해도 원래 네트워크와 동일한 정확도 달성.',
  },
  {
    label: '프루닝 비율 vs 정확도: 임계점이 존재',
    body: '프루닝 비율 50~80%까지는 정확도 유지 → 90% 이상에서 급락.\n"비용 없는 점심"(free lunch) 구간이 넓은 것이 프루닝의 매력.',
  },
  {
    label: 'LLM 경량화에서의 역할: 양자화와 상호 보완',
    body: '양자화(Quantization): 비트 수 축소 → 메모리 절감.\n프루닝(Pruning): 연결 자체 제거 → 연산량 절감.\n두 기법을 결합하면 4~8배 경량화 가능.',
  },
];

export const COLORS = {
  keep: '#3b82f6',
  prune: '#ef4444',
  lottery: '#8b5cf6',
  acc: '#10b981',
  quant: '#f59e0b',
};
