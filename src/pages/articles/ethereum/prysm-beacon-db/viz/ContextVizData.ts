export const C = { db: '#8b5cf6', bucket: '#3b82f6', err: '#ef4444', ok: '#10b981', state: '#f59e0b' };

export const STEPS = [
  {
    label: 'CL의 데이터 저장 요구',
    body: '블록, 상태, 검증자 정보를 영구 저장하고 빠르게 조회해야 합의가 작동합니다.',
  },
  {
    label: '문제: 상태 크기 폭발',
    body: 'BeaconState는 수백 MB로 모든 슬롯 저장 시 하루 만에 수 TB에 달합니다.',
  },
  {
    label: '문제: 읽기 >> 쓰기 비대칭',
    body: '쓰기는 슬롯당 1회이지만 읽기는 포크 선택과 RPC에서 빈번하여 읽기 최적화가 필요합니다.',
  },
  {
    label: '해결: BoltDB + 에폭 경계 저장',
    body: 'B+Tree 기반 BoltDB에 에폭 경계(32슬롯)에만 상태를 저장하여 디스크를 1/32로 절감합니다.',
  },
  {
    label: '해결: 프루닝 + 아카이벌 전략',
    body: 'Finalized 이전 비-캐노니컬 데이터를 자동 삭제하며 --archive로 전체 보존도 가능합니다.',
  },
];
