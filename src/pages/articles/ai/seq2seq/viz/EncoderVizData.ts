import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '"Thank" → Word2Vec → LSTM', body: '첫 번째 단어가 임베딩 벡터 [0.8, 0.2]로 변환되어 LSTM에 입력. 초기 은닉 상태 h₀=[0,0]에서 시작.' },
  { label: '"you" → LSTM → h₂=[0.3, 0.7]', body: '두 번째 단어 입력. 이전 상태를 받아 새로운 은닉 상태 생성. h₂에는 "Thank you"의 누적 정보가 담긴다.' },
  { label: 'EOS → LSTM → 컨텍스트 벡터 [0.5, 0.6]', body: 'EOS 입력 → 최종 h₃=[0.5, 0.6] = 문장 전체의 의미가 압축된 벡터. 이것이 디코더의 초기 상태가 된다.' },
  { label: '2층 LSTM 확장', body: '레이어를 쌓으면 더 풍부한 컨텍스트 벡터 생성. 복잡한 문장도 더 잘 표현.' },
];

export const WORDS = ['Thank', 'you', 'EOS'];
/** Embedding vectors for each word */
export const EMB_VECS = [[0.8, 0.2], [0.1, 0.9], [0.0, 0.0]];
/** Hidden state outputs after each LSTM step */
export const H_VECS = [[0.6, 0.3], [0.3, 0.7], [0.5, 0.6]];

export const CELL_C = '#6366f1';
export const EMB_C = '#8b5cf6';
export const CTX_C = '#f59e0b';
