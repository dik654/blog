import type { CodeRef } from '@/components/code/types';

export const roundRefs: Record<string, CodeRef> = {
  'enter-new-round': {
    path: 'consensus/state.go — enterNewRound()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'enterNewRound — 새 라운드 설정.\nProposerPriority 갱신 → 라운드 초기화 → enterPropose 호출.',
    code: `func (cs *State) enterNewRound(height int64, round int32) {
    if cs.Height != height || round < cs.Round {
        return
    }

    validators := cs.Validators
    if cs.Round < round {
        // 라운드 차이만큼 제안자 우선순위 증가
        validators = validators.Copy()
        validators.IncrementProposerPriority(
            cmtmath.SafeSubInt32(round, cs.Round))
    }

    cs.updateRoundStep(round, cstypes.RoundStepNewRound)
    cs.Validators = validators
    cs.Votes.SetRound(cmtmath.SafeAddInt32(round, 1))
    cs.TriggeredTimeoutPrecommit = false

    cs.enterPropose(height, round)
}`,
    annotations: [
      { lines: [2, 4], color: 'sky',
        note: '가드절: 이미 더 높은 라운드에 있으면 무시' },
      { lines: [7, 12], color: 'emerald',
        note: 'IncrementProposerPriority: 라운드 차이만큼 제안자 우선순위 회전' },
      { lines: [14, 17], color: 'amber',
        note: '라운드 상태 초기화: Step=NewRound, Votes 리셋' },
      { lines: [19, 19], color: 'violet',
        note: 'enterPropose 호출: 다음 단계로 즉시 전이' },
    ],
  },
  'enter-propose': {
    path: 'consensus/state.go — enterPropose()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'enterPropose — 제안자면 블록 생성, 비제안자면 타임아웃 대기.\n제안 완료 시 즉시 enterPrevote로 전이.',
    code: `func (cs *State) enterPropose(height int64, round int32) {
    // 타임아웃 스케줄: 제안이 안 오면 nil prevote
    cs.scheduleTimeout(cs.config.Propose(round),
        height, round, cstypes.RoundStepPropose)

    defer func() {
        cs.updateRoundStep(round, cstypes.RoundStepPropose)
        // 제안 완성 시 즉시 Prevote 진입
        if cs.isProposalComplete() {
            cs.enterPrevote(height, cs.Round)
        }
    }()

    address := cs.privValidatorPubKey.Address()

    if cs.isProposer(address) {
        // 제안자: 블록 생성 → 서명 → 브로드캐스트
        cs.decideProposal(height, round)
    }
    // 비제안자: 타임아웃 대기 (scheduleTimeout이 처리)
}`,
    annotations: [
      { lines: [2, 4], color: 'sky',
        note: 'timeoutPropose: config.Propose(round)로 라운드마다 증가' },
      { lines: [6, 12], color: 'emerald',
        note: 'defer: Step 갱신 후 isProposalComplete() → Prevote 자동 진입' },
      { lines: [16, 19], color: 'amber',
        note: '제안자 판별: isProposer → decideProposal()로 블록 생성·전파' },
    ],
  },
};
