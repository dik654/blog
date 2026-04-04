// ipc — subnet.go (InterPlanetary Consensus 서브넷)
// Filecoin L2 서브넷 관리: 생성, 검증자 참여, 체크포인팅

// SubnetConfig는 서브넷 생성 파라미터
type SubnetConfig struct {
    ParentID    SubnetID        // 부모 서브넷 (메인넷 또는 다른 서브넷)
    MinStake    abi.TokenAmount // 최소 스테이크 (FIL)
    Consensus   ConsensusType  // 합의 알고리즘 (Tendermint, Mir, ...)
    Permission  Permission     // 퍼미션 모드 (Permissioned, Collateral, ...)
    CheckPeriod uint64         // 체크포인트 주기 (에폭 단위)
}

// CreateSubnet은 메인넷에 새 서브넷을 등록
// 생성자가 MinStake 이상의 FIL을 스테이크해야 생성 가능
func (gw *Gateway) CreateSubnet(config SubnetConfig) (SubnetID, error) {
    // 1. 파라미터 검증 — 최소 스테이크, 합의 타입 등
    if config.MinStake.LessThan(MinRequiredStake) {
        return SubnetID{}, ErrInsufficientStake
    }

    // 2. 서브넷 Actor 배포 — FVM에 새 Actor 인스턴스 생성
    //    SubnetActor가 검증자 관리, 체크포인트 수집 등을 담당
    subnetID := gw.registerSubnet(config)

    return subnetID, nil
}

// JoinSubnet은 검증자가 서브넷에 참여
// FIL을 스테이크하고 검증자 세트에 등록
func (gw *Gateway) JoinSubnet(subnetID SubnetID, stake abi.TokenAmount) error {
    // 3. 스테이크 예치 — Gateway Actor가 FIL을 보관
    //    스테이크 양에 비례해 검증자 파워 결정
    gw.deposit(msg.Sender, stake)

    // 4. 검증자 세트 업데이트 — 다음 에폭부터 블록 생산 참여
    subnet := gw.getSubnet(subnetID)
    subnet.addValidator(msg.Sender, stake)

    return nil
}

// SubmitCheckpoint는 서브넷 상태 해시를 메인넷에 커밋
// 서브넷의 보안 앵커 역할 — 메인넷이 서브넷 상태를 검증 가능
func (gw *Gateway) SubmitCheckpoint(cp Checkpoint) error {
    // 5. 체크포인트 = (서브넷ID, 에폭, 상태루트, 크로스메시지 머클루트)
    //    검증자 2/3+ 서명으로 커밋 → 메인넷에서 finality 보장
    if !gw.verifyQuorumSignatures(cp) {
        return ErrInsufficientSignatures
    }

    // 6. 크로스 서브넷 메시지 실행 — 서브넷→메인넷 자산/메시지 이동
    gw.executeCrossMessages(cp.CrossMsgs)

    return nil
}
