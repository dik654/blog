import type { CodeRef } from '@/components/code/types';

export const addVoteRefs: Record<string, CodeRef> = {
  'add-vote': {
    path: 'consensus/state.go — addVote()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'addVote — 투표 집계 + +2/3 임계값 감지 시 상태 전이.\nPrevote +2/3 → enterPrecommit, Precommit +2/3 → enterCommit.',
    code: `func (cs *State) addVote(
    vote *types.Vote, peerID p2p.ID,
) (added bool, err error) {
    // VoteSet에 추가 (서명 검증 포함)
    added, err = cs.Votes.AddVote(vote, peerID)
    if !added || err != nil { return }

    switch vote.Type {
    case cmtproto.PrevoteType:
        prevotes := cs.Votes.Prevotes(vote.Round)
        // +2/3 any → timeoutPrevote 스케줄
        if prevotes.HasTwoThirdsAny() {
            cs.scheduleTimeout(cs.config.Prevote(vote.Round),
                height, vote.Round, cstypes.RoundStepPrevoteWait)
        }
        // +2/3 majority → enterPrecommit
        if blockID, ok := prevotes.TwoThirdsMajority(); ok {
            cs.enterPrecommit(height, vote.Round)
            // ValidBlock 갱신 (future round polka)
            if len(blockID.Hash) > 0 {
                cs.ValidRound = vote.Round
                cs.ValidBlock = cs.ProposalBlock
            }
        }

    case cmtproto.PrecommitType:
        precommits := cs.Votes.Precommits(vote.Round)
        // +2/3 any → timeoutPrecommit 스케줄
        if precommits.HasTwoThirdsAny() {
            cs.scheduleTimeout(cs.config.Precommit(vote.Round),
                height, vote.Round, cstypes.RoundStepPrecommitWait)
        }
        // +2/3 majority → enterCommit
        if blockID, ok := precommits.TwoThirdsMajority(); ok {
            if len(blockID.Hash) > 0 {
                cs.enterCommit(height, vote.Round)
            }
        }
    }
    return
}`,
    annotations: [
      { lines: [4, 6], color: 'sky',
        note: 'VoteSet.AddVote: 서명 검증 + 중복 제거 + 투표 저장' },
      { lines: [11, 15], color: 'emerald',
        note: 'HasTwoThirdsAny: +2/3 모였지만 합의 미달 → 타임아웃 스케줄' },
      { lines: [17, 23], color: 'amber',
        note: 'TwoThirdsMajority: Polka → enterPrecommit + ValidBlock 갱신' },
      { lines: [26, 38], color: 'violet',
        note: 'Precommit +2/3: 블록 해시 존재 시 enterCommit → 확정' },
    ],
  },
};
