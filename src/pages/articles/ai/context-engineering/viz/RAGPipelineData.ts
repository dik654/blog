import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 문서 청킹 (Chunking)',
    body: '원본 문서를 의미 단위로 분할\n고정 크기(512토큰) vs 의미 기반(문단·섹션) — 겹침(overlap) 50~100토큰으로 문맥 유실 방지',
  },
  {
    label: '② 임베딩 (Embedding)',
    body: '각 청크를 벡터(고차원 숫자 배열)로 변환\ntext-embedding-3-small, voyage-3 등 — 의미가 유사한 텍스트는 벡터 공간에서 가까이 위치',
  },
  {
    label: '③ 벡터 저장소 (Vector Store)',
    body: '임베딩 벡터를 인덱싱해서 빠른 검색 가능하게 저장\nPinecone, Weaviate, pgvector 등 — ANN(근사 최근접 이웃) 알고리즘으로 밀리초 검색',
  },
  {
    label: '④ 질의 & 검색 (Retrieval)',
    body: '사용자 질문도 동일 모델로 임베딩 → 코사인 유사도로 top-k 청크 검색\n하이브리드 검색: 벡터(의미) + BM25(키워드) 결합으로 정확도 향상',
  },
  {
    label: '⑤ 리랭킹 & 주입 (Reranking)',
    body: 'Cross-encoder로 검색 결과 재정렬 — 벡터 검색만으로는 놓치는 미세 관련도 포착\n최종 top-k 청크를 시스템 프롬프트 또는 사용자 메시지에 삽입',
  },
];

export const PIPELINE_NODES = [
  { label: 'Docs', x: 10, color: '#6366f1' },
  { label: 'Chunks', x: 90, color: '#6366f1' },
  { label: 'Embed', x: 170, color: '#10b981' },
  { label: 'Store', x: 250, color: '#10b981' },
  { label: 'Retrieve', x: 330, color: '#f59e0b' },
];
