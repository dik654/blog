export interface SnapPhase {
  id: string;
  label: string;
  role: string;
  details: string;
  color: string;
}

export const SNAP_PHASES: SnapPhase[] = [
  {
    id: 'account',
    label: 'Account Range',
    role: '계정 상태 다운로드',
    details: '해시 범위로 계정 목록을 요청한다. 각 응답에 Merkle proof가 포함되어 피어가 거짓 데이터를 보내면 즉시 감지. 범위를 나누어 여러 피어에서 병렬 다운로드.',
    color: '#6366f1',
  },
  {
    id: 'storage',
    label: 'Storage Range',
    role: '컨트랙트 스토리지 다운로드',
    details: '각 계정의 스토리지 슬롯을 범위별로 다운로드한다. 대형 컨트랙트(Uniswap, USDT 등)는 수백만 슬롯을 가지므로 이 단계가 가장 오래 걸린다.',
    color: '#0ea5e9',
  },
  {
    id: 'bytecode',
    label: 'Bytecode',
    role: '컨트랙트 코드 다운로드',
    details: '계정의 code_hash로 바이트코드를 요청한다. 동일 코드를 사용하는 프록시 컨트랙트가 많으므로 해시 기반 중복 제거가 효과적.',
    color: '#10b981',
  },
  {
    id: 'healing',
    label: 'Healing',
    role: 'Trie 노드 보정',
    details: '다운로드 중 상태가 변경되면 Merkle Trie의 일부 노드가 불일치한다. Healing 단계에서 변경된 부분만 다시 다운로드하여 최신 state root와 일치시킨다.',
    color: '#f59e0b',
  },
];
