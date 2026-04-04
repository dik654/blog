import type { CodeRef } from '@/components/code/types';

export const faultCodeRefs: Record<string, CodeRef> = {
  'claim-struct': {
    path: 'optimism/op-challenger/game/fault/types/types.go — Claim',
    lang: 'go',
    highlight: [1, 8],
    desc: 'Claim은 분쟁 게임의 핵심 데이터 구조.\nPosition으로 이진 트리 상 위치를 표현하고, Value에 상태 해시를 저장.\nCounteredBy가 설정되면 누군가 이 주장에 반박한 것.',
    code: `type Claim struct {
    ClaimData
    // CounteredBy: 반박자 주소 (mutable!)
    CounteredBy common.Address
    Claimant    common.Address
    Clock       Clock  // 체스 클럭: 남은 응답 시간
    ContractIndex       int  // 컨트랙트 내 위치
    ParentContractIndex int  // 부모 주장 위치
}

type ClaimData struct {
    Value    common.Hash  // 상태 해시 (output root)
    Bond     *big.Int     // 예치금
    Position              // 이진 트리 위치
}`,
  },
  'position': {
    path: 'optimism/op-challenger/game/fault/types/position.go — Position',
    lang: 'go',
    highlight: [1, 8],
    desc: 'Position은 이진 분할(bisection) 게임 트리의 좌표.\ndepth=0이 루트, Attack()은 왼쪽 자식, Defend()는 오른쪽 자식.\nTraceIndex()로 최대 깊이까지 오른쪽으로 확장한 실행 트레이스 인덱스를 계산.',
    code: `type Position struct {
    depth        Depth      // 트리 깊이
    indexAtDepth *big.Int   // 해당 깊이에서의 인덱스
}

// Attack: 왼쪽 자식으로 이동 (더 좁은 범위의 앞부분)
func (p Position) Attack() Position {
    return p.move(false)  // left child
}

// Defend: 부모의 오른쪽 형제의 왼쪽 자식
func (p Position) Defend() Position {
    return p.parent().move(true).move(false)
}

// TraceIndex: 이 위치가 가리키는 실행 트레이스의 인덱스
func (p Position) TraceIndex(maxDepth Depth) *big.Int {
    rd := maxDepth - p.depth
    rhs := new(big.Int).Sub(new(big.Int).Lsh(big.NewInt(1), uint(rd)), big.NewInt(1))
    return new(big.Int).Or(p.lshIndex(rd), rhs)
}`,
  },
  'game-state': {
    path: 'optimism/op-challenger/game/fault/types/game.go — Game interface',
    lang: 'go',
    highlight: [1, 8],
    desc: 'Game 인터페이스는 분쟁 게임의 전체 상태를 추상화.\nAgreeWithClaimLevel로 현재 주장이 아군인지 적군인지 판별.\n홀수 깊이 = 도전자 주장, 짝수 깊이 = 방어자 주장.',
    code: `type Game interface {
    Claims() []Claim
    GetParent(claim Claim) (Claim, error)
    DefendsParent(claim Claim) bool
    // 체스 클럭: 반박해야 하는 팀의 남은 시간
    ChessClock(now time.Time, claim Claim) time.Duration
    IsDuplicate(claim Claim) bool
    // 홀수 depth = 도전자, 짝수 depth = 방어자
    AgreeWithClaimLevel(claim Claim, agreeWithRootClaim bool) bool
    MaxDepth() Depth
}`,
  },
  'output-root': {
    path: 'optimism/op-node/rollup/output_root.go — ComputeL2OutputRoot()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'Output Root는 L2 상태의 요약 해시.\nStateRoot + MessagePasserStorageRoot + BlockHash를 합쳐 생성.\n왜 세 가지를 합치나? L2→L1 메시지 증명, 블록 유효성, 상태 전이를 한 번에 검증.',
    code: `func ComputeL2OutputRootV0(block eth.BlockInfo, storageRoot [32]byte) (eth.Bytes32, error) {
    stateRoot := block.Root()
    l2Output := eth.OutputV0{
        StateRoot:                eth.Bytes32(stateRoot),
        MessagePasserStorageRoot: storageRoot,
        BlockHash:                block.Hash(),
    }
    return eth.OutputRoot(&l2Output), nil
}`,
  },
};
