import type { StepDef } from '@/components/ui/step-viz';

export const INDEX_C = '#6366f1';
export const RETR_C = '#10b981';
export const CHUNK_C = '#f59e0b';
export const EVAL_C = '#ef4444';

export const PIPELINE_STEPS: StepDef[] = [
  { label: 'Indexing Phase — 한 번 실행', body: '1. Document Loading: PDF, HTML, DB, Slack, Notion → raw text\n2. Chunking: 512-1024 tokens, semantic/overlap/hierarchical\n3. Embedding: text-embedding-3-large, BGE → 1536-3072 dim\n4. Vector DB: Pinecone, Weaviate, Qdrant + metadata (source, date)' },
  { label: 'Retrieval Phase — query당 실행', body: '1. Query Processing: HyDE, rewriting, decomposition, embedding\n2. Vector Search (k=50-100): cosine similarity + BM25 hybrid\n3. Reranking (k=5-20): Cross-encoder (BGE-reranker), LLM-as-judge\n→ 정확도 10-30% 향상\n4. Context Assembly: format for LLM + citations + dedup' },
  { label: 'Generation Phase + 전체 흐름', body: 'User Query + Retrieved Chunks → LLM → Answer with citations\n\n핵심: Hybrid search (Vector + BM25) + Reranking이 품질 좌우\nVector만으로는 키워드 정확 매칭 놓침 → BM25로 보완\nReranking으로 top-k 재정렬 → 실제 관련도 기준 필터' },
];

export const CHUNK_STEPS: StepDef[] = [
  { label: 'Chunking 전략 5가지', body: '① Fixed-Size: text[0:512], overlap으로 경계 완화 — 간단, 빠름\n② Recursive Splitter: \\n\\n → \\n → ". " → " " — LangChain 표준\n③ Semantic: embedding similarity, 의미 변화 시점 분할 — 고품질, 비용 큼\n④ Document-Specific: 코드→함수, Markdown→헤더, Table→행 단위\n⑤ Hierarchical: parent(큰) + child(작은), 검색은 child, 반환은 parent' },
  { label: '실전 권장 + 측정 지표', body: '실전 권장:\nTechnical docs → 512-1024 tokens + header-aware\nLong PDFs → hierarchical + summary\nCode → AST-based 분할\nChat logs → turn-based\n\n측정 지표:\nRecall@k (관련 문서 비율) | MRR (Mean Reciprocal Rank)\nNDCG (Normalized DCG) | End-to-end answer quality' },
];
