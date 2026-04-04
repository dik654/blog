package gpbft

// GossiPBFT — GossipSub 기반 PBFT 변형 합의
// 전통적 PBFT와 달리 GossipSub으로 메시지를 전파하여 확장성 확보

import "context"

// Phase는 GossiPBFT의 투표 단계
type Phase int

const (
	QUALITY  Phase = iota // 0: 후보 tipset 품질 투표
	CONVERGE              // 1: 수렴 — 최다 득표 tipset 선택
	PREPARE               // 2: 준비 — 2/3+ 동의 확인
	COMMIT                // 3: 커밋 — 최종 확정
	DECIDE                // 4: 결정 — 인증서 발행
)

// Runner는 하나의 GossiPBFT 인스턴스
type Runner struct {
	phase       Phase
	participants []Participant // 스토리지 프로바이더 목록
	powerTable   PowerTable   // 주소별 스토리지 파워
}

// RunToCompletion은 5단계 투표를 순차 실행
// QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE
func (r *Runner) RunToCompletion(ctx context.Context) (*Certificate, error) {
	for r.phase <= DECIDE {
		votes := r.collectVotes(ctx, r.phase)
		// 2/3+ 스토리지 파워가 동일 값에 투표했는지 확인
		if !r.hasQuorum(votes) {
			return nil, ErrNoQuorum
		}
		r.phase++
	}
	// 모든 단계 통과 → 확정 인증서 생성
	return r.buildCertificate(), nil
}
