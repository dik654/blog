// beacon-chain/operations/attestations/pool.go (Prysm v5)

// Pool — 미포함 어테스테이션을 보관하는 풀.
// 블록 제안자가 블록에 포함할 어테스테이션을 선택할 때 사용한다.
type Pool struct {
	lock             sync.RWMutex
	aggregated       []*ethpb.Attestation
	unaggregated     []*ethpb.Attestation
	forkchoiceAtts   []*ethpb.Attestation
}

// SaveAggregatedAttestation — 집계된 어테스테이션을 풀에 저장한다.
// 동일 데이터(소스·타겟·헤드)를 가진 어테스테이션들의 BLS 서명을 합친 것.
func (p *Pool) SaveAggregatedAttestation(att *ethpb.Attestation) error {
	p.lock.Lock()
	defer p.lock.Unlock()
	if !helpers.IsAggregated(att) {
		return errors.New("attestation is not aggregated")
	}
	p.aggregated = append(p.aggregated, att)
	return nil
}

// AggregatedAttestations — 블록 제안 시 풀에서 집계된 어테스테이션을 반환한다.
// 최대 128개까지 포함할 수 있다 (MAX_ATTESTATIONS).
func (p *Pool) AggregatedAttestations() []*ethpb.Attestation {
	p.lock.RLock()
	defer p.lock.RUnlock()
	return append([]*ethpb.Attestation{}, p.aggregated...)
}
