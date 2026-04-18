import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 단조 정렬 — 어순 일치 언어 쌍',
    body:
      '"I love you" → "나는 너를 사랑해" — 대각선 패턴.\n' +
      '"나는"→"I"(α=0.9), "너를"→"you"(α=0.9), "사랑해"→"love"(α=0.9).\n' +
      '어순이 유사한 언어 쌍에서 자연스럽게 학습되는 패턴.\n' +
      'phrase-based MT의 수작업 word alignment를 신경망이 자동 학습한 결과.',
  },
  {
    label: '② 순서 역전 — 어순 상이 언어 쌍',
    body:
      '"I sold it yesterday" → "어제 나는 그것을 팔았다" — 반대각선 요소.\n' +
      '"어제"→"yesterday"(α=0.9): 영어 맨 뒤 단어가 한국어 맨 앞으로 이동.\n' +
      'Attention이 어순 재배치를 자동 학습 — 기존 통계 MT에서는 별도 reordering 모델 필요.\n' +
      '이 유연성이 Seq2Seq+Attention의 핵심 장점 — 고정 정렬 가정 불필요.',
  },
  {
    label: '③ 다대일 · 일대다 — 비선형 정렬',
    body:
      '다대일: "New York"(2 토큰) → "뉴욕"(1 토큰) — α=[0.5, 0.5]로 두 소스 평균.\n' +
      '일대다: "beautiful" → "아름다운"(여러 BPE 토큰) — 여러 target이 같은 source 참조.\n' +
      '단어 경계가 언어마다 다른 문제를 soft alignment로 자연 해결.\n' +
      'hard alignment(1:1 매핑)와 달리 연속적 가중치 — gradient flow 보장.',
  },
  {
    label: '④ 해석 가능성의 한계',
    body:
      'Attention ≠ 정확한 설명 — "Attention is not Explanation"(Jain & Wallace 2019).\n' +
      '중요도 정확 측정: gradient 기반 attribution, Shapley value 등 별도 기법 필요.\n' +
      '그러나 디버깅에 유용: 번역 오류 시 attention 분포 확인 → 잘못된 정렬 포착 가능.\n' +
      'Transformer: 12 layers × 12 heads = 144개 attention matrix — BertViz로 분석.',
  },
];

export const MONO_C = '#6366f1';
export const REORDER_C = '#ef4444';
export const MULTI_C = '#10b981';
export const LIMIT_C = '#f59e0b';
