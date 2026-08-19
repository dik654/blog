// flashbots/mev-boost 저장소 · server/get_header.go (commit 203bb965,
// 2026년 8월 기준 이 글이 인용하는 SHA). 전체 592줄 중 이 글이 다루는
// processBid만 발췌했습니다. HTTP round-trip·relay 병렬 호출·SSZ/JSON
// decode·metrics는 생략했습니다.
// 본문 대응: Overview의 b*=argmax_{b∈V(t<t_d)} v(b) — proposer가 여러 relay
// bid 중 유효 집합 V에서 최댓값을 고르는 실제 구현.

package server

// processBid — 한 relay가 보낸 bid를 검증하고, 이미 알고 있던 최고 bid와
// 비교해 result(현재 최고 bid)를 갱신합니다. article의 유효 집합 V를 만드는
// 단계(pubkey·signature·parentHash·zero-value 검사)와, 그 집합 안에서
// argmax를 취하는 단계(value 비교)가 한 함수 안에 순서대로 나타납니다.
func (m *BoostService) processBid(
	log *logrus.Entry,
	relay types.RelayEntry,
	bid *builderSpec.VersionedSignedBuilderBid,
	respContentType string,
	parentHashHex string,
	result *bidResp,
	relays map[BlockHashHex][]types.RelayEntry,
	slot phase0.Slot,
) {
	bidInfo, err := parseBidInfo(bid)
	if err != nil {
		log.WithError(err).Warn("error parsing bid info")
		return
	}

	// article의 V — 빈 block hash는 유효 집합에서 제외
	if bidInfo.blockHash == nilHash {
		log.Warn("relay responded with empty block hash")
		return
	}

	// article의 "relay·builder identity 검증" — 응답 pubkey가 요청한
	// relay의 pubkey와 다르면 유효 집합에서 제외
	if relay.PublicKey.String() != bidInfo.pubkey.String() {
		log.Errorf("bid pubkey mismatch. expected: %s - got: %s", relay.PublicKey.String(), bidInfo.pubkey.String())
		return
	}

	// article의 "builder signature 검증"
	if !config.SkipRelaySignatureCheck {
		ok, err := checkRelaySignature(bid, m.builderSigningDomain, relay.PublicKey)
		if err != nil {
			log.WithError(err).Error("error verifying relay signature")
			return
		}
		if !ok {
			log.Error("failed to verify relay signature")
			return
		}
	}

	// article의 "parent hash 검증" — proposer가 보낸 요청의 parentHashHex와
	// 응답의 parentHash가 다르면 다른 head 위의 bid이므로 제외
	if bidInfo.parentHash.String() != parentHashHex {
		log.WithFields(logrus.Fields{
			"originalParentHash": parentHashHex,
			"responseParentHash": bidInfo.parentHash.String(),
		}).Error("proposer and relay parent hashes are not the same")
		return
	}

	// article의 v(b)>0 — 0-value bid는 유효 집합에서 제외
	isZeroValue := bidInfo.value.IsZero()
	isEmptyListTxRoot := bidInfo.txRoot.String() == "0x7ffe241ea60187fdb0187bfa22de35d1f9bed7ab061d9401fd47e34a54fbede1"
	if isZeroValue || isEmptyListTxRoot {
		log.Warn("ignoring bid with 0 value")
		return
	}

	// article에는 없는 실제 구현 디테일 — 운영자가 설정한 최소 bid 미만도
	// 유효 집합에서 제외(스팸·비정상 bid 필터링, article의 순수 V(t<t_d)
	// 정의보다 더 보수적인 실제 policy)
	if bidInfo.value.CmpBig(m.relayMinBid.BigInt()) == -1 {
		log.Debug("ignoring bid below min-bid value")
		return
	}

	relays[BlockHashHex(bidInfo.blockHash.String())] = append(relays[BlockHashHex(bidInfo.blockHash.String())], relay)

	// article의 b*=argmax v(b) — 지금까지의 최고 bid(result)와 이번 bid의
	// value를 비교해 더 크면 교체. 같으면 block hash를 tie-breaker로 사용
	if !result.response.IsEmpty() {
		valueDiff := bidInfo.value.Cmp(result.bidInfo.value)
		switch valueDiff {
		case -1:
			log.Debug("ignoring less profitable bid")
			return
		case 0:
			previousBidBlockHash := result.bidInfo.blockHash
			if bidInfo.blockHash.String() >= previousBidBlockHash.String() {
				log.Debug("equally profitable bid lost tiebreaker")
				return
			}
		}
	}

	// 유효 집합을 통과하고 argmax 갱신 조건도 만족한 bid만 최종 result가 됨
	result.response = *bid
	result.bidInfo = bidInfo
}
