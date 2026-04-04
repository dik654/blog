export const CN = '#10b981', CR = '#ef4444', CW = '#f59e0b', CB = '#6366f1';

export const STEPS = [
  { label: '정상 상태: 안정적인 읽기/쓰기 지연', body: 'Compaction이 여유 있게 진행되면 L0 파일 수가 적고 읽기/쓰기 지연이 일정함.' },
  { label: '문제 1: Compaction이 디스크 대역폭 점유', body: 'Compaction이 대량의 순차 I/O를 발생시켜 읽기/쓰기의 디스크 대역폭을 빼앗음. 지연 스파이크 발생.' },
  { label: '문제 2: L0 파일 누적 → 읽기 급락', body: 'L0→L1 compaction이 밀리면 L0 파일이 쌓임. L0은 키 범위가 겹쳐서 모든 파일을 검색해야 함.' },
  { label: '문제 3: Write Stall', body: 'L0 파일 수가 한도(기본 12개)를 초과하면 쓰기를 일시 중단. RocksDB: rate limiter, sub-compaction 병렬화로 완화.' },
  { label: '블록체인에서 치명적인 이유', body: '12초마다 블록을 실행해야 함. EVM 실행 중 상태 읽기가 핵심 병목 → compaction 스파이크 시 블록 처리 지연.' },
];

export const NORMAL_POINTS = '40,110 100,108 160,112 220,109 280,111 340,108 400,110 460,112';
export const SPIKE_POINTS = '40,150 80,148 120,152 180,150 210,100 230,60 250,45 270,80 290,145 340,148 380,150 410,70 430,50 450,90 470,148';
export const READ_BARS = [2, 4, 6, 8, 10];
export const BLOCKS = ['Block N', 'Block N+1', 'Block N+2'];
