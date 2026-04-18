import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  system: '#6366f1',    // System prompt
  context: '#0ea5e9',   // 검색 컨텍스트
  gen: '#10b981',       // 생성
  cite: '#f59e0b',      // 인용
  window: '#ef4444',    // 컨텍스트 윈도우
  muted: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: '검색 결과를 프롬프트에 주입',
    body: '검색된 top-k 문서를 프롬프트의 context 섹션에 삽입.\n구조: [System] + [Context: 검색된 문서들] + [Question: 사용자 질문].\n각 문서에 출처 태그 부착: [출처1: 매뉴얼 p.42], [출처2: 보고서 2024-03].\n순서 배치: 가장 관련도 높은 문서를 마지막에 — Lost-in-the-middle 문제 방지.\nLLM은 프롬프트 시작과 끝을 더 잘 기억 — 핵심 문서를 양 끝에 배치.',
  },
  {
    label: 'System Prompt 설계',
    body: '역할 지정: "당신은 제조 설비 전문가입니다. 제공된 문서만으로 답변하세요."\n환각 방지: "문서에 없는 정보는 \'해당 정보를 찾을 수 없습니다\'로 답변."\n출처 명시: "각 문장에 [출처N] 태그를 반드시 포함."\n형식 지정: "답변은 1) 원인 분석 2) 조치 방법 3) 예방 대책 순서로 구성."\n언어: "모든 답변은 한국어로 작성. 전문 용어는 영문 병기."',
  },
  {
    label: 'Context Window 관리',
    body: 'GPT-4: 128K 토큰 / Claude: 200K / Llama3: 8K~128K.\n검색 문서 5개 x 512토큰 = 2,560토큰 — 전체 윈도우의 2~20%.\n토큰 예산 배분: System(200) + Context(3000) + Question(100) + Answer(1000).\n문서가 많을 때: 요약 후 삽입 또는 Map-Reduce (각 문서별 답변 → 종합).\nStuffing: 모든 문서 삽입 (소량). Map-Reduce: 대량 문서. Refine: 순차 정제.',
  },
  {
    label: 'Cited 응답 생성 — 출처 추적',
    body: '각 문장에 인용 태그 부착: "진동 임계값은 0.5mm입니다 [출처1]."\n검증 가능성: 사용자가 [출처1] 클릭 → 원본 문서 해당 위치로 이동.\n구현: 검색된 각 문서에 고유 ID 부여 → LLM 출력에서 ID 파싱.\n인용 없는 문장 = 환각 가능성 → 후처리에서 경고 표시.\n제조 현장: 답변의 출처가 공식 매뉴얼인지 반드시 확인 가능해야 함.',
  },
];
