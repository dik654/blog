import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  faith: '#6366f1',     // Faithfulness
  ans: '#10b981',       // Answer relevance
  ctx: '#0ea5e9',       // Context relevance
  ragas: '#f59e0b',     // RAGAS
  auto: '#8b5cf6',      // 자동 평가
  muted: '#64748b',
};

export const METRICS = [
  { name: 'Faithfulness', range: '0~1', target: '>0.85', desc: '답변이 컨텍스트에 근거하는 비율' },
  { name: 'Answer Relevance', range: '0~1', target: '>0.80', desc: '답변이 질문에 관련된 정도' },
  { name: 'Context Recall', range: '0~1', target: '>0.75', desc: '정답 근거가 검색 결과에 포함된 비율' },
  { name: 'Context Precision', range: '0~1', target: '>0.70', desc: '검색 결과 중 관련 문서 비율' },
];

export const STEPS: StepDef[] = [
  {
    label: 'RAG 평가의 3축 — Faithfulness, Answer, Context',
    body: 'Faithfulness: 답변의 각 문장이 컨텍스트에 근거하는가? (환각 측정)\nAnswer Relevance: 답변이 질문에 적합한가? (관련성 측정)\nContext Relevance: 검색된 문서가 질문에 관련되는가? (검색 품질)\n3축이 모두 높아야 좋은 RAG — 하나라도 낮으면 병목 지점 파악 가능.\nFaithfulness 낮음 → 생성 문제. Context 낮음 → 검색 문제.',
  },
  {
    label: 'Faithfulness — 환각 측정',
    body: '답변을 개별 주장(claim)으로 분해 → 각 주장이 컨텍스트에서 추론 가능한지 판단.\nFaithfulness = (컨텍스트로 뒷받침되는 주장 수) / (전체 주장 수).\n예: 답변에 5개 주장, 그 중 4개가 문서에 근거 → 0.80.\n1.0이면 완벽 — 모든 주장이 검색 문서에 근거.\n제조: 0.85 미만이면 위험 — 근거 없는 정비 지침은 사고로 이어질 수 있음.',
  },
  {
    label: 'Answer Relevance & Context Metrics',
    body: 'Answer Relevance: 답변에서 질문을 역생성 → 원래 질문과의 유사도.\n높을수록 답변이 질문의 핵심을 잘 다룸. 장황하거나 빗나간 답변 감지.\nContext Recall: ground truth 답변의 각 문장이 검색 결과에 포함된 비율.\nContext Precision: 검색 결과 중 실제 관련 문서의 비율.\nRecall 낮음 → 청킹/임베딩 개선 필요. Precision 낮음 → 검색 임계값 조정.',
  },
  {
    label: 'RAGAS 프레임워크',
    body: 'RAGAS: RAG 자동 평가 프레임워크. pip install ragas.\n입력: questions, answers, contexts, ground_truths.\n자동으로 4개 메트릭 계산 — LLM 기반 판정 (GPT-4 또는 Claude 사용).\n평가 비용: 100개 샘플 기준 $2~5 (GPT-4 사용 시).\n대안: DeepEval, TruLens, Phoenix — 각각 장단점 존재.\nRAGAS 점수 해석: Faithfulness 0.85+, Answer 0.80+, Context 0.75+ 이면 양호.',
  },
  {
    label: '자동 평가 파이프라인 구축',
    body: '1. 평가 데이터셋 구축: 도메인 전문가가 50~100개 질문-정답 쌍 작성.\n2. 주기적 실행: CI/CD에 RAGAS 평가 통합 — PR마다 자동 점수 산출.\n3. 회귀 감지: 청킹/임베딩/프롬프트 변경 시 점수 하락 여부 자동 확인.\n4. A/B 테스트: 새 설정 vs 기존 설정 점수 비교.\n5. 대시보드: 시간별 메트릭 추이 시각화 — 점수 하락 즉시 알림.\n제조 현장: 매뉴얼 업데이트 시 평가 자동 재실행으로 품질 보장.',
  },
];
