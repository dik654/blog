package storageadapter

// StorageDealProvider — 스토리지 딜의 마이너(프로바이더) 측 처리
// 클라이언트 제안 수락 → 데이터 수신 → 봉인 → 온체인 활성화

import (
	"context"
	"github.com/filecoin-project/go-fil-markets/storagemarket"
)

type Provider struct {
	net       DealNetwork        // 딜 프로토콜 네트워크
	deals     *DealStore         // 딜 상태 저장소
	spn       StorageProviderNode // 온체인 인터랙션
}

// HandleDealProposal은 클라이언트의 딜 제안을 처리
func (p *Provider) HandleDealProposal(
	ctx context.Context, proposal *storagemarket.DealProposal,
) error {
	// 1. 제안 검증 — 가격, 기간, 콜래터럴 확인
	if err := p.validateProposal(proposal); err != nil {
		return err
	}
	// 2. 데이터 전송 — GraphSync/HTTP로 클라이언트에서 수신
	if err := p.transferData(ctx, proposal.DataRef); err != nil {
		return err
	}
	// 3. 섹터에 데이터 추가 — Sealing 파이프라인으로 전달
	sectorID, err := p.spn.AddPieceToSector(ctx, proposal)
	if err != nil {
		return err
	}
	// 4. PublishStorageDeals 메시지로 온체인 등록
	return p.spn.PublishDeal(ctx, proposal, sectorID)
}
