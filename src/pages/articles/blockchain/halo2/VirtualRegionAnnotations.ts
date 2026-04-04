import type { Annotation } from '@/components/ui/code-panel';

export const managerAnnotations: Annotation[] = [
  { lines: [3, 3], color: 'sky', note: '여러 Context(스레드)를 하나의 가상 컬럼 그룹으로 관리' },
  { lines: [4, 4], color: 'emerald', note: 'Arc<Mutex<>>로 감싸 스레드 안전하게 공유' },
  { lines: [8, 8], color: 'amber', note: '가상→물리 매핑의 분할 지점 (keygen 시 자동 계산)' },
  { lines: [13, 13], color: 'violet', note: 'usable_rows 초과 시 새 물리 컬럼으로 분할' },
];

export const copyManagerAnnotations: Annotation[] = [
  { lines: [4, 4], color: 'sky', note: '두 advice 셀이 같은 값을 가져야 한다는 제약' },
  { lines: [6, 6], color: 'emerald', note: '상수 값을 fixed 컬럼에 할당 후 advice 셀과 연결' },
  { lines: [8, 8], color: 'amber', note: '가상 셀(ContextCell) → 물리 셀(Cell) 매핑 테이블' },
  { lines: [14, 14], color: 'violet', note: 'CopyConstraintManager는 모든 매니저가 셀을 할당한 후에 실행' },
];
