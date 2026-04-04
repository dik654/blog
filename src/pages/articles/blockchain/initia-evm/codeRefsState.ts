import type { CodeRef } from '@/components/code/types';

export const stateRefs: Record<string, CodeRef> = {
  'mini-statedb': {
    path: 'minievm/x/evm/state/statedb.go',
    lang: 'go',
    project: 'minievm',
    highlight: [1, 36],
    desc: 'StateDB — go-ethereum vm.StateDB를 Cosmos KVStore로 구현.',
    code: `// x/evm/state/statedb.go — StateDB 구조체

var _ vm.StateDB = &StateDB{}  // go-ethereum 인터페이스 구현

type StateDB struct {
    ctx           Context
    initialCtx    Context          // 스냅샷 복원용 초기 컨텍스트
    logger        log.Logger
    accountKeeper evmtypes.AccountKeeper

    vmStore collections.Map[[]byte, []byte]  // 영구 저장소

    // 트랜잭션 실행 중 임시 메모리 스토어
    memStoreVMStore      collections.Map[[]byte, []byte]
    memStoreCreated      collections.KeySet[[]byte]       // CREATE된 계정
    memStoreSelfDestruct collections.KeySet[[]byte]       // SELFDESTRUCT 대상
    memStoreLogs         collections.Map[uint64, evmtypes.Log]
    memStoreLogSize      collections.Item[uint64]
    memStoreAccessList   collections.KeySet[[]byte]       // EIP-2929
    memStoreRefund       collections.Item[uint64]

    evm             *vm.EVM
    erc20ABI        *abi.ABI
    feeContractAddr common.Address  // 수수료 ERC20 컨트랙트

    snaps []*Snapshot  // 스냅샷 스택 (Revert용)
}

// GetBalance — ERC20 컨트랙트의 balanceOf() 호출
func (s *StateDB) GetBalance(addr common.Address) *uint256.Int {
    inputBz, _ := s.erc20ABI.Pack("balanceOf", addr)
    s.evm.IncreaseDepth()
    defer func() { s.evm.DecreaseDepth() }()
    retBz, _, _ := s.evm.StaticCall(
        evmtypes.NullAddress, s.feeContractAddr, inputBz, 100000)
    // ABI 디코딩 후 uint256 반환
}`,
    annotations: [
      { lines: [3, 3], color: 'sky' as const, note: 'go-ethereum의 vm.StateDB 인터페이스 구현' },
      { lines: [11, 11], color: 'emerald' as const, note: 'vmStore — IAVL 트리 기반 영구 저장소' },
      { lines: [14, 20], color: 'amber' as const, note: '임시 메모리 스토어 — TX 종료 후 폐기' },
      { lines: [30, 36], color: 'rose' as const, note: 'GetBalance — ERC20 balanceOf() 호출로 잔액 조회' },
    ],
  },
};
