// beacon-chain/state/state-native/beacon_state.go — Prysm v5

// BeaconState는 비콘 체인의 전체 상태를 보유하는 핵심 구조체.
// Copy-on-Write 패턴으로 불필요한 복사를 방지한다.
type BeaconState struct {
	// 제네시스 정보
	genesisTime           uint64
	genesisValidatorsRoot [32]byte
	// 슬롯 & 포크
	slot uint64
	fork *ethpb.Fork
	// 히스토리 루트
	latestBlockHeader     *ethpb.BeaconBlockHeader
	blockRoots            customtypes.BlockRoots
	stateRoots            customtypes.StateRoots
	historicalRoots       customtypes.HistoricalRoots
	// 검증자 & 잔액
	validators []*ethpb.Validator
	balances   []uint64
	// RANDAO & 슬래싱
	randaoMixes   customtypes.RandaoMixes
	slashings     []uint64
	// 어테스테이션
	previousEpochAttestations []*ethpb.PendingAttestation
	currentEpochAttestations  []*ethpb.PendingAttestation
	// 필드 트라이 (해시 캐싱)
	dirtyFields      map[types.FieldIndex]bool
	rebuildTrie      map[types.FieldIndex]bool
	stateFieldLeaves map[types.FieldIndex]*fieldtrie.FieldTrie
	// 동시 접근 제어
	lock  sync.RWMutex
	// 공유 참조 카운트 (Copy-on-Write)
	sharedFieldReferences map[types.FieldIndex]*stateutil.Reference
}

// NewBeaconState는 Genesis 또는 상태 복원 시 새 BeaconState를 생성한다.
func NewBeaconState(opts ...Option) (*BeaconState, error) {
	b := &BeaconState{
		dirtyFields:           make(map[types.FieldIndex]bool),
		rebuildTrie:           make(map[types.FieldIndex]bool),
		stateFieldLeaves:     make(map[types.FieldIndex]*fieldtrie.FieldTrie),
		sharedFieldReferences: make(map[types.FieldIndex]*stateutil.Reference),
	}
	for _, opt := range opts {
		if err := opt(b); err != nil {
			return nil, err
		}
	}
	b.initializeFieldTries()
	return b, nil
}
