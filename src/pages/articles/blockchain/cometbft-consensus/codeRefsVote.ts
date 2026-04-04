import type { CodeRef } from '@/components/code/types';

export const voteRefs: Record<string, CodeRef> = {
  'try-add-vote': {
    path: 'consensus/state.go — tryAddVote()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'tryAddVote — 투표를 추가하고 오류 처리.\n이중 투표 감지 시 EvidencePool에 신고.',
    code: `func (cs *State) tryAddVote(
    vote *types.Vote, peerID p2p.ID,
) (bool, error) {
    added, err := cs.addVote(vote, peerID)
    if err != nil {
        // 이중 투표(equivocation) 감지
        if voteErr, ok := err.(*types.ErrVoteConflictingVotes); ok {
            if cs.privValidatorPubKey == nil {
                return false, err
            }
            // EvidencePool에 이중 투표 증거 보고
            cs.evpool.ReportConflictingVotes(
                voteErr.VoteA, voteErr.VoteB)
            // 자기 자신의 이중 투표면 즉시 panic
            if bytes.Equal(vote.ValidatorAddress,
                cs.privValidatorPubKey.Address()) {
                panic("detected own equivocation")
            }
            return added, err
        }
        return added, ErrAddingVote
    }
    return added, nil
}`,
    annotations: [
      { lines: [4, 4], color: 'sky',
        note: 'addVote 호출: 실제 투표 집계 + 임계값 감지' },
      { lines: [7, 14], color: 'emerald',
        note: '이중 투표 감지: 같은 높이·라운드·타입에 다른 BlockID → 신고' },
      { lines: [15, 19], color: 'amber',
        note: '자체 이중 투표: 자신이 이중 서명했으면 panic → 노드 중단' },
    ],
  },
};
