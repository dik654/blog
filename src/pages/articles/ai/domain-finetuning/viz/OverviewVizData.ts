import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  general: '#6366f1',   // 범용 모델
  domain: '#f59e0b',    // 도메인 적응
  task: '#10b981',      // 태스크 학습
  alert: '#ef4444',     // 한계/문제
  accent: '#8b5cf6',    // 보조 강조
  bio: '#ec4899',       // 바이오/유전체
};

export const STEPS: StepDef[] = [
  {
    label: '범용 모델의 한계: 도메인 텍스트는 "외국어"',
    body: '유전체(ATCG 서열), 의료(MeSH 용어), 제조(공정 로그) — 일반 코퍼스(위키·뉴스)와 어휘 분포가 완전히 다르다.\nBERT/GPT의 토크나이저와 임베딩이 이 도메인을 제대로 표현하지 못함.',
  },
  {
    label: '도메인 적응의 3단계 파이프라인',
    body: '1단계: 범용 사전학습(General Pretrain) — 언어 구조 학습\n2단계: 도메인 추가학습(Continued Pretrain) — 도메인 어휘·문맥 습득\n3단계: 태스크 학습(Task Fine-tune) — 분류/추출/생성 등 목적 특화',
  },
  {
    label: '도메인별 어휘 분포 차이',
    body: '일반 코퍼스: "the", "is", "of" 상위 → 유전체: "ATCG", "SNV", "exon" 상위\n토크나이저가 도메인 어휘를 여러 subword로 분해 → 정보 손실.',
  },
  {
    label: '적응 없이 vs 적응 후 성능 비교',
    body: 'BERT → 의료 NER: F1 78% / BioBERT → 의료 NER: F1 87%\nBERT → DNA 분류: Acc 62% / DNABERT → DNA 분류: Acc 91%\n도메인 적응이 성능 격차의 핵심.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
