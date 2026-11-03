package gpbft

// go-f3 v0.8.15 gpbft/gpbft.go의 실제 strong-quorum 판정입니다.
func divCeil(a, b int64) int64 {
	quo := a / b
	rem := a % b
	if rem != 0 {
		quo += 1
	}
	return quo
}

func IsStrongQuorum(part int64, whole int64) bool {
	return part >= divCeil(2*whole, 3)
}

// Round 0은 QUALITY에서 시작하고, strong quorum이나 timeout 뒤 PREPARE로 갑니다.
// CONVERGE는 이후 round에서 justification을 받아 진입하는 별도 경로입니다.
func (i *instance) Start() error {
	return i.beginQuality()
}

func (i *instance) tryQuality() error {
	foundQuorum := i.quality.HasStrongQuorumFor(i.proposal.Key())
	timeoutExpired := i.phaseTimeoutElapsed()
	if foundQuorum || timeoutExpired {
		i.proposal = i.quality.FindStrongQuorumValueForLongestPrefixOf(i.input)
		i.addCandidatePrefixes(i.proposal)
		i.value = i.proposal
		i.beginPrepare(nil)
	}
	return nil
}
