import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '제조 멀티 에이전트 — 3개 에이전트 협업',
    body: 'RAG Agent(매뉴얼 검색) + Analysis Agent(센서 데이터 분석) + Decision Agent(조치 판단). 현장 운영자의 질문을 3단계로 처리한다.',
  },
  {
    label: 'RAG Agent — 매뉴얼·이력 검색',
    body: 'VectorDB(FAISS/Chroma)에 장비 매뉴얼, 과거 고장 이력을 인덱싱. 질문이 들어오면 관련 문서 top-k를 검색해 컨텍스트로 전달.',
  },
  {
    label: 'Analysis Agent — 센서 데이터 패턴 분석',
    body: '진동, 온도, 전류 센서 시계열 데이터를 받아 이상 패턴을 탐지한다. pandas + scipy로 통계 분석, 임계값 초과 구간 식별.',
  },
  {
    label: 'Decision Agent — 조치 권고 생성',
    body: 'RAG 결과 + Analysis 결과를 종합해 "장비 정지 권고" / "예방 정비 스케줄" / "정상 운전 유지" 중 판단. 근거와 함께 보고서 출력.',
  },
  {
    label: '로컬 LLM 연동 — Ollama로 데이터 유출 방지',
    body: '제조 데이터는 기밀. Ollama(llama3, mistral)로 사내 서버에서 추론. API 비용 0원. GPU 서버 1대로 3개 에이전트를 교대 실행.',
  },
];

export const PIPELINE_FLOW = [
  { label: '운영자 질문', color: '#64748b' },
  { label: 'RAG Agent', color: '#6366f1' },
  { label: 'Analysis Agent', color: '#10b981' },
  { label: 'Decision Agent', color: '#f59e0b' },
  { label: '보고서 출력', color: '#64748b' },
];

export const SECURITY_ITEMS = [
  { label: '로컬 LLM', desc: 'Ollama — 데이터 외부 전송 없음', color: '#10b981' },
  { label: 'VectorDB', desc: '사내 서버 FAISS — 매뉴얼 보안', color: '#6366f1' },
  { label: '비용', desc: 'API 호출 0원 — GPU 서버 고정비만', color: '#f59e0b' },
];
