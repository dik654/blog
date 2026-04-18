import type { StepDef } from '@/components/ui/step-viz';

export const C = { q: '#6366f1', k: '#10b981', v: '#f59e0b', cross: '#ef4444', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Q, K, V: 정보 검색 비유',
    body: 'Query (Q): "무엇을 찾고 싶은가?" — 검색어 역할.\nKey (K): "어떤 내용을 가지고 있는가?" — 인덱스 역할.\nValue (V): "실제로 전달할 내용" — 데이터 역할.\nQ와 K의 내적 → 유사도. 높을수록 해당 V에 주목.\n예: "it" 토큰의 Q가 "cat" 토큰의 K와 높은 유사도\n→ "cat"의 V 정보를 많이 가져옴.',
  },
  {
    label: '같은 입력, 다른 투영',
    body: 'X → W_Q → Q (관점 1: 무엇을 찾을까).\nX → W_K → K (관점 2: 나는 무엇인가).\nX → W_V → V (관점 3: 내 정보는 무엇).\n같은 단어도 세 가지 "얼굴"을 가짐.\nW 행렬들이 학습 과정에서 각 역할에 맞게 최적화.\nd_k = d_v = d_model/h. 보통 h=8이면 d_k=64.',
  },
  {
    label: 'Self vs Cross Attention',
    body: 'Self-Attention: Q, K, V 모두 같은 시퀀스에서 파생.\n인코더 self-attention: 소스 문장 내부 관계 학습.\n디코더 masked self-attention: 타겟 내부 + 미래 차단.\nCross-Attention: Q는 디코더, K/V는 인코더 출력.\n디코더가 인코더 정보를 "조회"하는 구조.\n번역 예: 디코더가 소스 문장의 관련 단어 참조.',
  },
  {
    label: '차원 정리: 입력 → 출력',
    body: '입력 X: (n, d_model). 보통 d_model=512.\nW_Q, W_K: (d_model, d_k). W_V: (d_model, d_v).\nd_k = d_v = d_model/h = 512/8 = 64.\nQ, K: (n, d_k=64). V: (n, d_v=64).\nQ·K^T: (n, n). softmax: (n, n). ×V: (n, d_v).\n최종 Multi-Head 출력: (n, d_model) → 원래 차원 복원.',
  },
];
