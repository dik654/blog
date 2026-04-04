export const C = { header: '#6366f1', state: '#10b981', cursor: '#f59e0b', static: '#8b5cf6' };

export const STEPS = [
  {
    label: 'MDBX 테이블 레이아웃',
    body: 'B+tree 기반 각 테이블을 tables! 매크로로 Key/Value 타입 안전하게 선언합니다.',
  },
  {
    label: 'tables! 매크로 — Key/Value 타입으로 테이블 선언',
    body: '잘못된 타입을 넣으면 컴파일 에러로 Geth의 런타임 에러 문제를 방지합니다.',
  },
  {
    label: 'Cursor — B+tree seek → walk_range 순차 순회',
    body: 'seek_exact O(log n) 이동 후 walk_range()로 리프를 연속 읽어 일관된 성능을 제공합니다.',
  },
  {
    label: 'StaticFile 경계 — finalized 블록 이전은 flat file',
    body: 'finalized 이전 데이터를 flat file로 이동하여 DB 크기 감소와 조회 성능을 보장합니다.',
  },
];
