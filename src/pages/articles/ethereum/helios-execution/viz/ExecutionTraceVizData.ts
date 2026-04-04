/** ExecutionTrace Viz -- 색상 상수 + step 정의 */

export const C = {
  call: '#6366f1',     // eth_call 흐름 (인디고)
  proof: '#10b981',    // lazy proof loading (에메랄드)
  gas: '#f59e0b',      // estimate_gas (앰버)
  compare: '#ec4899',  // Reth vs Helios (핑크)
  rpc: '#06b6d4',      // RPC 왕복 (시안)
  cache: '#8b5cf6',    // 캐시 (보라)
};

export const STEPS = [
  {
    label: 'eth_call 흐름 -- ProofDB 생성 → revm 빌드 → 로컬 실행',
    body: 'call()은 4단계로 구성된다. ProofDB::new()로 가상 DB를 만들고,\nEvm::builder()로 revm 인스턴스를 빌드한 뒤, transact()로 EVM을 실행한다.\n결과의 output()을 추출해 반환. EVM 코드 자체는 Reth와 동일하다.',
  },
  {
    label: 'Lazy Proof Loading -- EVM이 접근하는 주소만 증명 요청',
    body: 'ProofDB는 EVM의 basic_account(addr) 호출 시점에 get_proof를 요청한다.\n컨트랙트가 접근하지 않는 주소는 증명을 받지 않는다.\n한 번 받은 증명은 캐시에 저장 → 동일 주소 재접근 시 RPC 요청 없음.',
  },
  {
    label: 'estimate_gas -- eth_call + 10% 안전 마진',
    body: 'estimate_gas()는 call()과 동일한 경로로 EVM을 실행한 뒤,\ngas_used에 10%를 더한다. 블록 간 상태 변동(nonce, balance)으로\n예측과 실제 실행의 가스가 달라질 수 있기 때문.',
  },
  {
    label: '전체 비교 -- Reth ~1us vs Helios ~100ms',
    body: 'Reth: 로컬 MDBX에서 직접 읽기 → 마이크로초 단위 응답.\nHelios: 매 접근마다 RPC 왕복(~50ms) + Merkle 검증(~0.1ms).\nN개 주소 접근 시 Helios는 N번 RPC 왕복 → 느리지만 700GB 디스크 불필요.',
  },
];
