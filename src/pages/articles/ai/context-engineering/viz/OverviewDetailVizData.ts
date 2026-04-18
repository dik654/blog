import type { StepDef } from '@/components/ui/step-viz';

export const SYS_C = '#6366f1';
export const RAG_C = '#10b981';
export const HIST_C = '#f59e0b';
export const COST_C = '#ef4444';

export const COMPONENTS_STEPS: StepDef[] = [
  { label: '컨텍스트 7가지 구성요소', body: '① System Prompt (500-5K tokens) — 역할·제약·포맷, 매 요청 공통\n② User Query (50-1K) — 현재 질문\n③ Conversation History (0-무제한) — 이전 turns\n④ Retrieved Context/RAG (1K-50K) — 외부 지식베이스\n⑤ Tool Results (가변) — 외부 API 응답, 계산 결과\n⑥ Memory/Scratchpad (가변) — 에이전트 상태, 장기 기억\n⑦ Few-shot Examples (500-5K) — 태스크 예시' },
  { label: '토큰 예산과 비용 계산', body: '총 예산: GPT-4 128K | Claude 200K | Gemini 1M-2M | OSS 32K-128K\n\n실무 분배 예시:\nSystem 2K + RAG 10K + History 5K + Query 500 + Buffer 2K = ~20K\n\n비용: GPT-4o $5/M input, Claude Sonnet $3/M input\n20K context × 1M requests = $60-100/M requests' },
  { label: '7대 원칙', body: '① Relevance > Volume — 관련 1K > 무관 10K (Lost in the Middle 방지)\n② Hierarchy — System > Retrieved > History > Query\n③ Explicit Instructions — 모호함 제거, 구체적 지시\n④ Context Compaction — 대화 길어지면 요약\n⑤ Just-in-Time Retrieval — 필요할 때만 검색\n⑥ Structured Output — XML/JSON 파싱 가능\n⑦ Grounding — RAG 소스 인용, hallucination 방지' },
  { label: '측정 지표 + 2024 트렌드', body: '측정 지표:\nContext utilization (%) | Token cost/query | Response quality\nLatency (ttft, total) | Cache hit rate (KV cache)\n\n2024 트렌드:\n긴 문맥 (1M+ tokens) | Agentic workflows (multi-turn, tool use)\nContext caching (prompt caching) | Retrieval + Reranking + Compression' },
];
