export const OVERVIEW_STEPS = [
  { label: '전체 아키텍처', body: 'SQL 쿼리를 입력받아 영지식 증명을 생성하고 온체인에서 검증합니다.' },
  { label: 'SQL 파싱', body: 'QueryExpr::try_new()로 SQL을 파싱하여 AST(추상 구문 트리)를 생성합니다.' },
  { label: '증명 계획 & 실행', body: 'AST를 ProofPlan으로 변환하고, 실행 엔진이 데이터를 처리합니다.' },
  { label: '증명 & 검증', body: 'Sumcheck + Commitment으로 영지식 증명을 생성하고 검증합니다.' },
];

export const ARCH_NODES = [
  { id: 'sql', label: 'SQL 쿼리', color: '#6366f1', x: 130, y: 5 },
  { id: 'parser', label: 'SQL 파서', color: '#0ea5e9', x: 130, y: 50 },
  { id: 'plan', label: '증명 계획기', color: '#10b981', x: 60, y: 100 },
  { id: 'engine', label: '실행 엔진', color: '#f59e0b', x: 200, y: 100 },
  { id: 'sumcheck', label: 'Sumcheck', color: '#ef4444', x: 40, y: 155 },
  { id: 'commit', label: 'Commitment', color: '#8b5cf6', x: 160, y: 155 },
  { id: 'db', label: 'DB 접근자', color: '#6b7280', x: 280, y: 155 },
];

export const ARCH_EDGES = [
  { from: 0, to: 1, label: '파싱' },
  { from: 1, to: 2, label: 'AST' },
  { from: 1, to: 3, label: 'AST' },
  { from: 2, to: 4, label: '다항식' },
  { from: 2, to: 5, label: '커밋' },
  { from: 3, to: 6, label: '데이터' },
];

export const ARCH_VN = [[0, 1, 2, 3, 4, 5, 6], [0, 1], [1, 2, 3, 6], [2, 4, 5]];
export const ARCH_VE = [[0, 1, 2, 3, 4, 5], [0], [1, 2, 5], [3, 4]];
