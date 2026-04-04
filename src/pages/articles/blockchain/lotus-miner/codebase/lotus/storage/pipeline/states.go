package pipeline

// Sealing State Machine — 섹터의 전체 라이프사이클을 관리
// 상태 전이: Empty→Packing→PC1→PC2→WaitSeed→Commit→Proving→Expired

import (
	"context"
	"github.com/filecoin-project/go-statemachine"
)

// SectorState는 섹터의 현재 상태
type SectorState string

const (
	Empty      SectorState = ""
	Packing    SectorState = "Packing"     // 데이터 조각(Piece) 채우기
	PreCommit1 SectorState = "PreCommit1"  // SDR 인코딩 (CPU, 3-5시간)
	PreCommit2 SectorState = "PreCommit2"  // Merkle Tree 구축 (GPU)
	WaitSeed   SectorState = "WaitSeed"    // 랜덤 시드 대기 (150 에폭)
	Committing SectorState = "Committing"  // Groth16 증명 생성 (GPU)
	Proving    SectorState = "Proving"     // 활성 상태 — WindowPoSt 대상
	Expired    SectorState = "Expired"     // 만료 — 담보 회수 가능
)

// handlePreCommit1은 SDR 인코딩을 수행
// CPU 바운드: 단일 섹터에 3-5시간 소요
func (m *Sealing) handlePreCommit1(
	ctx statemachine.Context, sector SectorInfo,
) error {
	// seal/v1.SealPreCommitPhase1 호출
	out, err := m.sealer.SealPreCommit1(ctx.Context(),
		sector.SectorNumber, sector.TicketValue, sector.Pieces,
	)
	if err != nil {
		return ctx.Send(SectorSealPreCommit1Failed{err})
	}
	// PreCommit2로 전이
	return ctx.Send(SectorPreCommit1{
		PreCommit1Out: out,
	})
}
