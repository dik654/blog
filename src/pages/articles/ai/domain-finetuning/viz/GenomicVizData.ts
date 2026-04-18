import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  dna: '#10b981',      // DNA 서열 / 유전체
  model: '#6366f1',    // 모델
  snv: '#ef4444',      // SNV (단일 염기 변이)
  contrast: '#f59e0b', // contrastive learning
  accent: '#8b5cf6',   // 보조
  base: '#3b82f6',     // 염기
  comp: '#ec4899',     // 대회/응용
};

export const STEPS: StepDef[] = [
  {
    label: '유전체 언어모델(gLM): DNA 서열을 "텍스트"로 학습',
    body: 'DNA 서열(A, C, G, T)을 토큰 시퀀스로 취급하여 Transformer 학습.\nk-mer 토큰화: 연속 k개 염기를 하나의 토큰으로 묶음 (k=3~6)\nDNABERT: 6-mer 토큰 → MLM 사전학습 → 다운스트림 태스크 전이.',
  },
  {
    label: 'DNA 토큰화: k-mer와 BPE의 차이',
    body: 'k-mer: ATCGATCG → [ATC, TCG, CGA, GAT, ATC, TCG] (슬라이딩 윈도우)\nBPE: 빈도 기반 서브워드 병합 → 생물학적 의미 단위와 무관\nk-mer가 코돈(3-mer)·모티프(6-mer)와 자연스럽게 정렬됨.',
  },
  {
    label: 'DNABERT & Nucleotide Transformer: 구조 비교',
    body: 'DNABERT: BERT-base + 6-mer + MLM. 인간 게놈 참조 서열 학습.\nNucleotide Transformer: 최대 2.5B 파라미터. BPE 토큰화. 다종 게놈 3,200개 학습.\n규모 확대 시 프로모터 예측, 스플라이스 사이트 검출 등 성능 급증.',
  },
  {
    label: 'SNV 민감도 개선: Contrastive Fine-tuning',
    body: 'SNV(Single Nucleotide Variant): 단일 염기 변이가 질병을 유발.\nATC → ATG 변이 시 임베딩 변화가 미미 → contrastive loss로 변이 구분 강화.\n양성 쌍(같은 변이)·음성 쌍(다른 변이) 구성 → 임베딩 공간에서 분리.',
  },
  {
    label: '대회 적용 전략: 유전체 도메인 Fine-tuning 파이프라인',
    body: '1) 사전학습 gLM 선택 (DNABERT-2, NT 등)\n2) 도메인 데이터로 continued pretrain (1~3 에폭)\n3) contrastive fine-tuning (SNV 민감도)\n4) task head 학습 (분류/회귀)\n5) 앙상블: gLM + 전통 ML 결합',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
