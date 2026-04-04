export const C0 = '#6366f1', C1 = '#10b981', C2 = '#f59e0b', CR = '#ef4444';

export const STEPS = [
  { label: 'Compaction이 필요한 이유', body: 'SSTable이 쌓이면 읽기 시 순회할 파일이 늘어남. 주기적으로 레벨 간 병합(merge sort)하여 파일 수를 줄임.' },
  { label: 'L0 → L1 Compaction', body: 'L0 파일(키 범위 겹침 가능)을 L1의 겹치는 범위 파일들과 함께 머지 소트. 결과를 새 L1 파일로 기록.' },
  { label: 'L1 → L2 Compaction', body: 'L1이 크기 한도(예: 10MB)를 초과하면, 선택된 L1 SSTable을 L2의 겹치는 파일들과 머지. L2 한도는 L1의 10배.' },
  { label: 'Write Amplification', body: '데이터가 레벨을 옮길 때마다 다시 쓰여짐. L0→L1→L2→...Lk까지 약 10~30배 write amplification 발생.' },
];

export const L0_FILES = [{ k: 'a-f', x: 60 }, { k: 'c-m', x: 140 }];
export const L1_BEFORE = [{ k: 'a-d', x: 300 }, { k: 'e-h', x: 370 }, { k: 'i-n', x: 440 }];
export const L1_AFTER = [{ k: 'a-d', x: 120 }, { k: 'e-h', x: 220 }, { k: 'i-n', x: 320 }];
export const L2_BEFORE = [{ k: 'j-l', x: 300 }, { k: 'm-o', x: 370 }, { k: 'p-r', x: 440 }];
export const L2_AFTER = [{ k: 'j-l', x: 100 }, { k: 'm-o', x: 220 }, { k: 'p-r', x: 340 }];

export const WA_LEVELS = [
  { lv: 'L0', w: 60, c: C0, sz: '~4MB' },
  { lv: 'L1', w: 110, c: C1, sz: '~10MB' },
  { lv: 'L2', w: 160, c: C2, sz: '~100MB' },
  { lv: 'L3', w: 210, c: '#8b5cf6', sz: '~1GB' },
];
