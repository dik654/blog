import MemoryPatternViz from './viz/MemoryPatternViz';

export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대화 메모리 패턴</h2>
      <div className="not-prose mb-8"><MemoryPatternViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM은 기본적으로 무상태(stateless) — 매 요청마다 이전 대화를 컨텍스트에 직접 넣어줘야 "기억"처럼 작동<br />
          문제는 대화가 길어지면 토큰 한도를 초과한다는 것
        </p>
        <p>
          실전에서는 단일 전략보다 하이브리드 조합이 효과적<br />
          최근 턴은 전체 유지 + 오래된 대화는 요약 + 핵심 사실은 벡터 DB에서 검색
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 패턴 6가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 대화 메모리 패턴
//
// 1. Buffer Memory (기본)
//    모든 turn 저장
//    장점: 완전 정보, 단순
//    단점: 토큰 초과
//    적합: 짧은 대화 (< 10 turns)
//
// 2. Window Memory
//    최근 N turn만 유지
//    장점: 토큰 제어
//    단점: 초기 정보 손실
//    적합: chat bots
//
// 3. Summary Memory
//    오래된 대화를 LLM으로 요약
//    장점: 토큰 절약
//    단점: 요약 품질 의존
//    적합: 긴 대화
//
// 4. Vector Memory
//    과거 메시지를 embedding
//    현재 쿼리와 유사한 것만 검색
//    장점: 확장성
//    단점: 복잡성
//    적합: 장기 메모리
//
// 5. Knowledge Graph Memory
//    Entity/Relation 추출
//    Graph DB 저장
//    장점: 구조화 지식
//    단점: 엔지니어링 비용
//    적합: 복잡한 도메인
//
// 6. Hybrid (권장)
//    Buffer (최근 5 turns)
//    + Summary (요약본)
//    + Vector (장기)
//    → 각 장점 결합

// LangChain 메모리 클래스:
//   ConversationBufferMemory
//   ConversationBufferWindowMemory
//   ConversationSummaryMemory
//   ConversationSummaryBufferMemory
//   VectorStoreRetrieverMemory
//   EntityMemory

// Claude Projects/GPTs:
//   - Custom instructions (System)
//   - Knowledge files (RAG)
//   - Per-conversation memory
//   - Long context (200K+)

// 최신 (2024+):
//   - Extended memory (OpenAI assistants)
//   - Persistent user profiles
//   - Cross-session learning
//   - Episodic memory`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Agent 메모리 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Agent Memory 계층 구조
//
// Working Memory (실시간)
//   - Current conversation
//   - Active task state
//   - Temp variables
//   - Scratchpad
//
// Short-term Memory (session)
//   - Recent interactions
//   - Current goals
//   - Active context
//   - TTL: hours~days
//
// Long-term Memory (persistent)
//   - User preferences
//   - Past decisions
//   - Domain knowledge
//   - Semantic memory
//   - TTL: permanent
//
// Procedural Memory
//   - How to do X
//   - Learned skills
//   - Tool use patterns
//   - Prompt templates

// 구현 예시:
class AgentMemory:
    def __init__(self):
        self.working = {}           # dict
        self.short_term = deque()   # last 50 turns
        self.long_term = VectorDB()
        self.procedural = {}        # skill library

    def retrieve(self, query):
        # 다층 검색
        recent = list(self.short_term)[-10:]
        relevant = self.long_term.search(query, k=5)
        skills = self.procedural.get_relevant(query)
        return compose_context(recent, relevant, skills)

    def update(self, interaction):
        self.short_term.append(interaction)
        if should_persist(interaction):
            self.long_term.add(interaction)

// 생체 기반 메모리 모델:
//   MemGPT: OS-inspired (2023)
//   - Main context (RAM)
//   - External storage (disk)
//   - Paging mechanism
//
// Human-like memory:
//   Letta (Memgpt 후속): persistent agents
//   Mem0: hybrid memory framework`}
        </pre>
        <p className="leading-7">
          요약 1: 메모리 패턴은 <strong>Buffer·Window·Summary·Vector</strong> 등 6가지.<br />
          요약 2: 실전은 <strong>Hybrid (최근+요약+장기)</strong> 조합.<br />
          요약 3: 2024 트렌드는 <strong>Agent 메모리 계층화</strong> (working/short/long/procedural).
        </p>
      </div>
    </section>
  );
}
