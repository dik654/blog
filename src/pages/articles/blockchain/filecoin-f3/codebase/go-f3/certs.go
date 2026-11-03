package certs

// go-f3 v0.8.15 certs/certs.go에서 검증 순서를 보존해 옮긴 학습용 발췌입니다.
func ValidateFinalityCertificates(
	verifier gpbft.Verifier,
	network gpbft.NetworkName,
	prevPowerTable gpbft.PowerEntries,
	nextInstance uint64,
	base *gpbft.TipSet,
	certificates ...*FinalityCertificate,
) (uint64, *gpbft.ECChain, gpbft.PowerEntries, error) {
	var chain *gpbft.ECChain
	var newPowerTable gpbft.PowerEntries

	for _, cert := range certificates {
		if cert.GPBFTInstance != nextInstance {
			return nextInstance, chain, prevPowerTable, fmt.Errorf("unexpected instance")
		}
		if err := cert.ECChain.Validate(); err != nil || cert.ECChain.IsZero() {
			return nextInstance, chain, prevPowerTable, fmt.Errorf("invalid EC chain")
		}
		if base != nil && !base.Equal(cert.ECChain.Base()) {
			return nextInstance, chain, prevPowerTable, fmt.Errorf("base mismatch")
		}
		if err := verifyFinalityCertificateSignature(verifier, prevPowerTable, network, cert); err != nil {
			return nextInstance, chain, prevPowerTable, err
		}

		var err error
		newPowerTable, err = ApplyPowerTableDiffs(prevPowerTable, cert.PowerTableDelta)
		if err != nil {
			return nextInstance, chain, prevPowerTable, err
		}
		powerTableCID, err := MakePowerTableCID(newPowerTable)
		if err != nil || cert.SupplementalData.PowerTable != powerTableCID {
			return nextInstance, chain, prevPowerTable, fmt.Errorf("power table CID mismatch")
		}

		nextInstance++
		chain = chain.Append(cert.ECChain.Suffix()...)
		prevPowerTable = newPowerTable
		base = cert.ECChain.Head()
	}
	return nextInstance, chain, newPowerTable, nil
}
