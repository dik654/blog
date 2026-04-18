import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  fixed: '#6366f1',    // 고정 크기 청킹
  semantic: '#8b5cf6',  // 의미 단위 청킹
  overlap: '#f59e0b',   // 오버랩
  hier: '#10b981',      // 계층적 청킹
  optimal: '#0ea5e9',   // 최적 크기
  muted: '#64748b',
};

export const CHUNK_SIZES = [
  { size: 128, recall: 0.91, precision: 0.62, f1: 0.74 },
  { size: 256, recall: 0.87, precision: 0.71, f1: 0.78 },
  { size: 512, recall: 0.82, precision: 0.79, f1: 0.80 },
  { size: 1024, recall: 0.74, precision: 0.83, f1: 0.78 },
  { size: 2048, recall: 0.65, precision: 0.85, f1: 0.74 },
];

export const STEPS: StepDef[] = [
  {
    label: '고정 크기 청킹 (Fixed-size)',
    body: '가장 단순한 방식: 문서를 N 토큰 단위로 균등 분할.\n512 토큰이 일반적 — 대부분 임베딩 모델의 최대 입력 길이와 일치.\n장점: 구현 간단, 일관된 벡터 품질. 단점: 문장/문단 중간에서 잘림.\ntiktoken(OpenAI) 또는 SentencePiece로 토큰 수 계산.\n제조 매뉴얼처럼 구조화된 문서에는 비효율적 — 표/목록이 분리됨.',
  },
  {
    label: '의미 단위 청킹 (Semantic)',
    body: '문단, 섹션, 헤더 기준으로 의미가 완결되는 단위로 분할.\nMarkdown: ## 헤더 기준 분할. PDF: 페이지 + 단락 경계 감지.\nRecursive Splitter: \\n\\n → \\n → . → 공백 순으로 분할 시도.\n의미 단위 장점: 문맥 보존, 검색 정확도 향상.\n단점: 청크 크기 불균일 — 너무 짧거나(10토큰) 너무 긴(3000토큰) 청크 발생.',
  },
  {
    label: '오버랩 전략 — 경계 정보 손실 방지',
    body: '청크 간 겹침(overlap)을 두어 경계에서 잘린 문맥을 보존.\n일반적 설정: chunk_size=512, overlap=50~100 토큰 (10~20%).\n예: [1..512], [463..974], [925..1436] — 50토큰씩 겹침.\n오버랩 과다 시 저장 공간 증가 + 중복 검색 결과 발생.\n최적: 문장 경계에서 자른 뒤 앞뒤 1~2문장 오버랩.',
  },
  {
    label: '계층적 청킹 (Hierarchical)',
    body: '문서 → 섹션 → 문단의 3단계 계층으로 분할.\n각 레벨에 메타데이터 부착: {doc_id, section_title, page_num}.\n검색 시 문단 수준 매칭 → 필요하면 섹션 전체 컨텍스트 확장.\n제조 매뉴얼 예: 설비명(L1) → 정비 절차(L2) → 단계별 설명(L3).\nParent-child 구조로 "이 문단이 어떤 섹션에 속하는가" 추적 가능.',
  },
  {
    label: '최적 청크 크기 실험',
    body: '128토큰: recall 높지만(0.91) precision 낮음(0.62) — 너무 잘게 쪼개서 노이즈.\n512토큰: F1 최고(0.80) — recall(0.82)과 precision(0.79) 균형.\n2048토큰: precision 높지만(0.85) recall 급락(0.65) — 관련 없는 정보 혼입.\n도메인별 최적값 상이: 법률 문서 256~384, 기술 매뉴얼 512~768.\n평가 방법: 질문-정답 쌍으로 검색 성능 측정 후 F1 최대화 크기 선택.',
  },
];
