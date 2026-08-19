// flashbots/mev-boost 저장소 · server/get_payload.go (commit 203bb965,
// 2026년 8월 기준 이 글이 인용하는 SHA). 전체 745줄 중 이 글이 다루는
// "payload non-delivery" timeout race와 verifyPayload/verifyBlockHash만
// 발췌했습니다. Request decode·SSZ/JSON 변환·metrics·retry HTTP 호출은
// 생략했습니다.
// 본문 대응: Flashbots.tsx의 세 실패 모드(No bid / Invalid bid / Payload
// non-delivery) 중 "Payload non-delivery" — blinded block 서명 뒤 body를
// 받지 못하는 상황이 실제로 어떻게 timeout으로 구현되는지.

package server

// innerGetPayload(발췌) — signed blinded block을 모든 relay에 동시에
// 보내고, 가장 먼저 유효한 body를 돌려준 relay의 응답을 채택합니다.
// article이 설명한 "blinded block 서명 뒤 body를 받지 못한 별도 failure"는
// 여기서 resultCh가 timeout 안에 채워지지 않는 경우로 나타납니다.
func (m *BoostService) innerGetPayload( /* ... */ ) (payloadResult, bidResp) {
	resultCh := make(chan payloadResult, len(relays))
	var received atomic.Bool

	// article의 payload non-delivery — 어떤 relay도 제시간에 body를
	// 돌려주지 않으면, 이 goroutine이 timeout 뒤 빈 payloadResult{}를
	// resultCh에 넣어 위 for-select가 무한 대기하지 않게 만듭니다.
	go func() {
		time.Sleep(m.httpClientGetPayload.Timeout)
		resultCh <- payloadResult{}
	}()

	requestCtx, requestCtxCancel := context.WithTimeout(context.Background(), m.httpClientGetPayload.Timeout)
	defer requestCtxCancel()

	for _, relay := range relays {
		go func(relay types.RelayEntry, versionToUse GetPayloadVersion) {
			// ... HTTP 요청·재시도·SSZ/JSON 변환 (생략) ...

			response := new(builderApi.VersionedSubmitBlindedBlockResponse)
			// ... decode (생략) ...

			// article의 "선택 receipt에 도착 시각과 제외 이유를 남긴다"에
			// 대응 — decode된 body가 실제로 자신이 서명한 blinded header와
			// 일치하는지 여기서 검증
			if err := verifyPayload(log, request, response); err != nil {
				log.WithError(err).Warn("error verifying payload")
				return
			}

			// 여러 relay가 동시에 성공해도 가장 먼저 도착한 응답만 채택 —
			// 나머지는 redundancy 목적으로 계속 실행되지만 결과에 반영 안 됨
			if received.CompareAndSwap(false, true) {
				resultCh <- payloadResult{success: true, response: response}
			}
		}(relay, version)
	}

	// article의 "delivery reserve" — 모든 relay가 실패하거나 timeout이면
	// 빈 payloadResult{}가 반환되어 caller가 non-delivery를 판별합니다.
	return <-resultCh, originalBid
}

// verifyPayload — relay가 돌려준 body가 원래 signed blinded block과 같은
// block인지 확인합니다. article의 "선택 receipt" 항목 중 block hash·value
// encoding 검증에 대응합니다.
func verifyPayload(log *logrus.Entry, request *eth2Api.VersionedSignedBlindedBeaconBlock, response *builderApi.VersionedSubmitBlindedBlockResponse) error {
	if request.Version != response.Version {
		return errInvalidVersion
	}
	if getPayloadResponseIsEmpty(response) {
		return errEmptyPayload
	}
	if err := verifyBlockHash(log, request, response); err != nil {
		return err
	}
	if request.Version >= spec.DataVersionDeneb {
		if err := verifyBlobsBundle(log, request, response); err != nil {
			return err
		}
	}
	return nil
}

// verifyBlockHash — 서명한 blinded header의 block hash와 실제로 받은
// body의 block hash가 같은지 확인합니다. 다르면 다른 block을 받은
// 것이므로 non-delivery와 같은 방식으로 거절합니다.
func verifyBlockHash(log *logrus.Entry, request *eth2Api.VersionedSignedBlindedBeaconBlock, response *builderApi.VersionedSubmitBlindedBlockResponse) error {
	requestBlockHash, err := request.ExecutionBlockHash()
	if err != nil {
		return err
	}
	responseBlockHash, err := response.BlockHash()
	if err != nil {
		return err
	}
	if requestBlockHash != responseBlockHash {
		return errInvalidBlockhash
	}
	return nil
}
