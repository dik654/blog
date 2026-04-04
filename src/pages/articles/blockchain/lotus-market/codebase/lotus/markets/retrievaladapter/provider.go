package retrievaladapter

// RetrievalProvider — 리트리벌(데이터 검색) 마이너 측 처리
// 클라이언트 쿼리 → 가격 협상 → 데이터 전송 → 마이크로페이먼트

import (
	"context"
	"github.com/filecoin-project/go-fil-markets/retrievalmarket"
)

type Provider struct {
	pieceStore PieceStore  // 조각(Piece) → 섹터 매핑
	unsealer   Unsealer    // 섹터 언실(unseal) 엔진
}

// HandleQuery는 클라이언트의 데이터 존재 여부 쿼리에 응답
func (p *Provider) HandleQuery(
	ctx context.Context, q *retrievalmarket.Query,
) (*retrievalmarket.QueryResponse, error) {
	// PayloadCID로 조각 위치 조회
	piece, err := p.pieceStore.GetPieceInfoFromCid(q.PayloadCID)
	if err != nil {
		return &retrievalmarket.QueryResponse{
			Status: retrievalmarket.QueryResponseUnavailable,
		}, nil
	}
	// 가격 계산: 바이트당 가격 × 데이터 크기
	return &retrievalmarket.QueryResponse{
		Status:                     retrievalmarket.QueryResponseAvailable,
		Size:                       piece.Size,
		PricePerByte:               p.pricePerByte,
		UnsealPrice:                p.unsealPrice,
		PaymentInterval:            p.paymentInterval,
	}, nil
}
