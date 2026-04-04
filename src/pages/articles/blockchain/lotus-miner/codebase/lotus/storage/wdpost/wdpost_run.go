package wdpost

// WinningPoSt — 에폭마다 추첨하여 당첨 시 블록 생성
// WindowPoSt와 달리 WinningPoSt는 블록 생산 자격 증명

import (
	"context"
	"github.com/filecoin-project/lotus/chain/types"
)

type WinPostScheduler struct {
	api       FullNodeAPI
	prover    Prover        // PoSt 증명 생성기
	minerAddr address.Address
}

// MineOne은 단일 에폭에서 블록 생성 시도
func (s *WinPostScheduler) MineOne(
	ctx context.Context, base *types.TipSet,
) (*types.BlockMsg, error) {
	// 1. 에폭 랜덤값에서 ElectionProof 생성
	eproof, err := s.computeElectionProof(ctx, base)
	if err != nil {
		return nil, err
	}
	// 2. WinCount 확인 — 0이면 이번 에폭 블록 생성 자격 없음
	if eproof.WinCount < 1 {
		return nil, nil // 추첨 탈락
	}
	// 3. PoSt 증명 생성 — 랜덤 섹터 챌린지에 응답
	postProof, err := s.prover.GenerateWinningPoSt(
		ctx, s.minerAddr, eproof.Challenges,
	)
	if err != nil {
		return nil, err
	}
	// 4. 블록 헤더 생성 + 메시지 선택 + 서명
	return s.createBlock(base, eproof, postProof)
}
