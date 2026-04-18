import SimpleStepViz from '@/components/viz/SimpleStepViz';
import { PIPELINE_STEPS, CHUNK_STEPS } from './RAGDetailVizData';

const pipelineVisuals = [
  { title: 'Indexing Phase', color: '#6366f1', rows: [
    { label: '1. Loading', value: 'PDF, HTML, DB, Slack → raw text' },
    { label: '2. Chunking', value: '512-1024 tokens, semantic/overlap' },
    { label: '3. Embedding', value: 'text-embedding-3-large → 1536-3072 dim' },
    { label: '4. Vector DB', value: 'Pinecone, Weaviate + metadata' },
  ]},
  { title: 'Retrieval Phase', color: '#10b981', rows: [
    { label: '1. Query Process', value: 'HyDE, rewriting, decomposition' },
    { label: '2. Vector Search', value: 'cosine + BM25 hybrid (k=50-100)' },
    { label: '3. Reranking', value: 'Cross-encoder → 정확도 +10-30%' },
    { label: '4. Assembly', value: 'format + citations + dedup' },
  ]},
  { title: '전체 흐름 + 핵심', color: '#f59e0b', rows: [
    { label: '흐름', value: 'Query + Chunks → LLM → Answer + citations' },
    { label: '핵심', value: 'Hybrid search + Reranking이 품질 좌우' },
    { label: 'Vector만', value: '키워드 정확 매칭 놓침 → BM25 보완' },
    { label: 'Reranking', value: 'top-k 재정렬 → 실제 관련도 필터' },
  ]},
];

const chunkVisuals = [
  { title: 'Chunking 전략 5가지', color: '#f59e0b', rows: [
    { label: '① Fixed-Size', value: 'text[0:512], overlap → 간단, 빠름' },
    { label: '② Recursive', value: '\\n\\n → \\n → ". " — LangChain 표준' },
    { label: '③ Semantic', value: 'embedding 유사도 기반 분할 — 고품질' },
    { label: '④ Doc-Specific', value: '코드→함수, MD→헤더, Table→행' },
    { label: '⑤ Hierarchical', value: 'parent+child, 검색:child 반환:parent' },
  ]},
  { title: '실전 권장 + 측정', color: '#ef4444', rows: [
    { label: 'Tech docs', value: '512-1024 tokens + header-aware' },
    { label: 'Long PDFs', value: 'hierarchical + summary' },
    { label: 'Code', value: 'AST-based 분할' },
    { label: 'Recall@k', value: '관련 문서 비율' },
    { label: 'NDCG', value: 'Normalized DCG (End-to-end)' },
  ]},
];

export function PipelineViz() {
  return <SimpleStepViz steps={PIPELINE_STEPS} visuals={pipelineVisuals} />;
}

export function ChunkViz() {
  return <SimpleStepViz steps={CHUNK_STEPS} visuals={chunkVisuals} />;
}
