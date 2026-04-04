import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '가변 길이 입력', body: '"Thank you" — 영어 2단어. 한국어 번역은 "고마워" 1단어. 길이가 다르다.' },
  { label: '인코더: 고정 벡터로 압축', body: 'LSTM 인코더가 입력 시퀀스를 순서대로 처리 → 마지막 은닉 상태 = 컨텍스트 벡터' },
  { label: '디코더: 가변 길이 출력 생성', body: '컨텍스트 벡터를 초기 상태로 받아 출력 시퀀스를 한 단어씩 생성' },
  { label: 'Seq2Seq 전체 흐름', body: '가변 입력 → 고정 벡터 → 가변 출력. 어순과 단어 수가 달라도 번역 가능.' },
];

export const ENC_WORDS = ['Thank', 'you', 'EOS'];
export const DEC_WORDS = ['고마워', 'EOS'];
export const ENC_C = '#6366f1';
export const DEC_C = '#10b981';
export const CTX_C = '#f59e0b';
