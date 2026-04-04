// curio — pdp/pdp.go (Proof of Data Possession)
// 핫스토리지 데이터 존재 증명 — 봉인 없이 원본 데이터를 직접 검증

// PDPVerifier는 온체인에서 챌린지를 스케줄링하고 증명을 검증
type PDPVerifier struct {
    ProofSetID  uint64        // 증명 세트 ID
    Roots       []RootCID     // 등록된 데이터 루트 CID 목록
    NextChallenge abi.ChainEpoch // 다음 챌린지 에폭
}

// ScheduleChallenge는 랜덤 에폭에 챌린지를 예약
// DRAND 비콘의 랜덤값으로 챌린지 시점이 결정 — SP가 미리 준비 불가
func (v *PDPVerifier) ScheduleChallenge(epoch abi.ChainEpoch) error {
    // 1. DRAND 랜덤값으로 오프셋 결정
    randomness := v.getBeaconRandomness(epoch)
    offset := new(big.Int).Mod(randomness, big.NewInt(MaxChallengeWindow))
    v.NextChallenge = epoch + abi.ChainEpoch(offset.Int64())
    return nil
}

// GenerateProof는 SP가 챌린지에 대한 증명을 생성
// 원본 데이터의 랜덤 오프셋에서 160바이트를 읽고 SHA256 해시
func GenerateProof(
    challenge ChallengeRequest,
    dataStore DataStore,       // 원본 데이터 저장소 (봉인 안 된 상태)
) (*PDPProof, error) {
    // 2. 챌린지: 랜덤 오프셋에서 160바이트 읽기
    //    특수 하드웨어 불필요 — 일반 디스크 + CPU로 충분
    offset := challenge.RandomOffset
    data := make([]byte, 160)
    _, err := dataStore.ReadAt(data, int64(offset))
    if err != nil {
        return nil, err
    }

    // 3. SHA256 해시 계산 — Poseidon이나 ZK-friendly 해시 불필요
    hash := sha256.Sum256(data)

    // 4. 머클 경로 생성 — 해당 리프에서 루트까지의 siblings
    merkleProof := dataStore.GenerateMerkleProof(offset)

    return &PDPProof{
        Hash:        hash[:],
        MerkleProof: merkleProof,
        LeafData:    data,
    }, nil
}

// VerifyOnChain은 온체인에서 증명을 검증
// SHA256 해시와 머클 경로를 대조해서 데이터 존재를 확인
func (v *PDPVerifier) VerifyOnChain(proof *PDPProof) (bool, error) {
    // 5. 온체인 검증: SHA256(leaf) → 머클 루트 재계산 → 등록 루트와 대조
    computedHash := sha256.Sum256(proof.LeafData)
    root := ReconstructRoot(computedHash[:], proof.MerkleProof)
    return v.containsRoot(root), nil
}
