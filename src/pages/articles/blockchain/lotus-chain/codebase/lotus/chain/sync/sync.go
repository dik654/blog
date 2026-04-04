package sync

// ChainSyncer — Lotus 체인 동기화 엔진
// 부트스트랩 → 헤더 동기화 → 메시지 수집 → 블록 검증 → 상태 계산

import (
	"context"
	"github.com/filecoin-project/lotus/chain/store"
	"github.com/filecoin-project/lotus/chain/stmgr"
	"github.com/filecoin-project/lotus/chain/types"
)

type Syncer struct {
	store    *store.ChainStore   // 체인 데이터 저장소
	sm       *stmgr.StateManager // 상태 계산 엔진
	self     peer.ID             // 자기 자신의 피어 ID
}

// IncomingBlocks는 GossipSub에서 도착한 블록을 수신
func (s *Syncer) IncomingBlocks(ctx context.Context) <-chan *types.BlockMsg {
	return s.incoming
}

// Sync는 전체 동기화 파이프라인
func (s *Syncer) Sync(ctx context.Context, maybeHead *types.TipSet) error {
	// 1단계: 헤더 체인 검증 — 부모 해시 연결 확인
	chain, err := s.collectHeaders(ctx, maybeHead, s.store.GetHeaviestTipSet())
	if err != nil {
		return err
	}
	// 2단계: 각 tipset의 메시지를 Bitswap으로 수집
	if err := s.collectMessages(ctx, chain); err != nil {
		return err
	}
	// 3단계: 블록 검증 — 서명, 타임스탬프, 부모, 메시지 루트
	for _, ts := range chain {
		if err := s.ValidateBlock(ctx, ts); err != nil {
			return err
		}
	}
	// 4단계: 상태 계산 — 각 메시지를 FVM에 전달
	return s.sm.ApplyBlocks(ctx, chain)
}
