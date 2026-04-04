export const C = { balance: '#6366f1', storage: '#f59e0b', deploy: '#10b981', destroy: '#ef4444' };

export const STEPS = [
  {
    label: 'BundleAccount 상태 변경 수집',
    body: 'revm 실행 후 계정별 info(잔액/nonce)와 storage(SSTORE 슬롯)를 수집합니다.',
  },
  {
    label: '잔액/nonce 변경',
    body: 'ETH 전송과 가스 소비로 계정 balance/nonce가 갱신되어 info에 기록됩니다.',
  },
  {
    label: '스토리지 & 컨트랙트 변경',
    body: 'SSTORE는 슬롯 변경을, CREATE는 바이트코드를 contracts HashMap에 기록합니다.',
  },
  {
    label: 'reverts: 블록별 되돌리기',
    body: '블록별 변경 이전 상태를 저장하여 reorg 시 역순 적용으로 unwind()를 지원합니다.',
  },
];
