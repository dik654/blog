import type { StepDef } from '@/components/ui/step-viz';

export const BUF_C = '#6366f1';
export const VEC_C = '#10b981';
export const AGENT_C = '#f59e0b';
export const MEM_C = '#ef4444';

export const PATTERN_STEPS: StepDef[] = [
  { label: '메모리 패턴 1-3: Buffer · Window · Summary', body: '① Buffer Memory (기본): 모든 turn 저장 — 완전 정보, 단순\n단점: 토큰 초과, 적합: < 10 turns\n\n② Window Memory: 최근 N turn만 유지 — 토큰 제어\n단점: 초기 정보 손실, 적합: chat bots\n\n③ Summary Memory: 오래된 대화를 LLM 요약 — 토큰 절약\n단점: 요약 품질 의존, 적합: 긴 대화' },
  { label: '메모리 패턴 4-6: Vector · KG · Hybrid', body: '④ Vector Memory: 과거 메시지를 embedding → 유사 검색\n확장성 좋으나 복잡, 적합: 장기 메모리\n\n⑤ Knowledge Graph Memory: Entity/Relation 추출 → Graph DB\n구조화 지식, 엔지니어링 비용 높음\n\n⑥ Hybrid (권장): Buffer(최근 5) + Summary(요약) + Vector(장기)\n각 장점 결합 — 실전 최적 조합' },
  { label: 'LangChain 메모리 + 2024 트렌드', body: 'LangChain 메모리 클래스:\nConversationBufferMemory | ConversationBufferWindowMemory\nConversationSummaryMemory | VectorStoreRetrieverMemory\n\nClaude/GPT: Custom instructions, Knowledge files, 200K+ context\n\n2024 트렌드: Extended memory (OpenAI assistants)\nPersistent user profiles | Cross-session learning | Episodic memory' },
];

export const AGENT_STEPS: StepDef[] = [
  { label: 'Agent Memory 4계층 구조', body: 'Working Memory (실시간): current conversation, active task, temp vars\nShort-term (session): recent interactions, current goals, TTL: hours-days\nLong-term (persistent): user prefs, past decisions, semantic memory\nProcedural: how to do X, learned skills, tool use patterns\n\n다층 검색: recent[-10] + long_term.search(k=5) + procedural.get_relevant' },
  { label: 'MemGPT + 생체 기반 모델', body: 'MemGPT (2023): OS-inspired memory management\nMain context (RAM) + External storage (disk) + Paging mechanism\n→ 컨텍스트 창 한계를 OS 가상 메모리처럼 극복\n\nLetta (MemGPT 후속): persistent agents\nMem0: hybrid memory framework\n\nHuman-like memory 모델 → 에이전트의 장기 기억과 학습 가능' },
];
