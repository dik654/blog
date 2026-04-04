package f3

// F3 — Fast Finality for Filecoin
// EC(Expected Consensus)의 느린 확정성(~7.5시간)을 보완하는 확정성 레이어

import (
	"context"
	"github.com/filecoin-project/go-f3/gpbft"
	"github.com/filecoin-project/go-f3/manifest"
)

// F3 모듈 — EC 위에서 동작하는 확정성 레이어
// EC가 블록을 생산하면 F3가 GossiPBFT로 확정
type F3 struct {
	manifest  *manifest.Manifest  // 네트워크 파라미터
	host      Host                // libp2p GossipSub 호스트
	certStore *CertStore          // 확정 인증서 저장소
	gpbft     *gpbft.Runner       // GossiPBFT 합의 러너
}

// Run은 F3 메인 루프
// EC 체인의 새 tipset을 감시하고 확정 투표를 진행
func (f *F3) Run(ctx context.Context) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case notification := <-f.host.Notifications():
			// EC에서 새 tipset 도착 → GossiPBFT 인스턴스 시작
			instance := f.gpbft.Begin(notification.TipSet)
			// 2/3+ 스토리지 파워 합의 도달 시 인증서 발행
			cert, err := instance.RunToCompletion(ctx)
			if err != nil {
				return err
			}
			// 확정 인증서 저장 → 이후 이 tipset은 되돌릴 수 없음
			f.certStore.Put(cert)
		}
	}
}
