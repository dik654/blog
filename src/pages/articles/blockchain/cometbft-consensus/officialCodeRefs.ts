import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";

export const officialCometBFTConsensusCodeRefs: Record<string, CodeRef> = {
  "receive-routine": {
    path: "consensus/state.go · receiveRoutine @ 0880b4d3",
    lang: "go",
    highlight: [1, 46],
    desc: `${source} 원문의 select loop 발췌입니다. Peer·local signed message·timeout을 한 owner가 직렬로 처리하고, local signed message는 처리 전에 WAL에 동기 기록합니다.`,
    code: `func (cs *State) receiveRoutine(maxSteps int) {
    // ... panic handling and shutdown omitted above ...
    for {
        rs := cs.RoundState
        var mi msgInfo

        select {
        case <-cs.txNotifier.TxsAvailable():
            cs.handleTxsAvailable()

        case mi = <-cs.peerMsgQueue:
            if err := cs.wal.Write(mi); err != nil {
                cs.Logger.Error("failed writing to WAL", "err", err)
            }
            cs.handleMsg(mi)

        case mi = <-cs.internalMsgQueue:
            cs.writeInternalMsgToWAL(mi)
            if _, ok := mi.Msg.(*VoteMessage); ok {
                fail.Fail()
            }
            cs.handleMsg(mi)

        case ti := <-cs.timeoutTicker.Chan():
            if err := cs.wal.Write(ti); err != nil {
                cs.Logger.Error("failed writing to WAL", "err", err)
            }
            cs.handleTimeout(ti, rs)

        case <-cs.Quit():
            onExit(cs)
            return
        }
    }
}`,
    annotations: [
      { lines: [7, 9], color: "sky", note: "각 loop 시작 시 RoundState snapshot을 잡고 네 입력 채널 중 하나를 고릅니다." },
      { lines: [14, 18], color: "amber", note: "Peer message를 buffered WAL에 남긴 뒤 state handler로 보냅니다." },
      { lines: [20, 26], color: "emerald", note: "Local signed message는 writeInternalMsgToWAL에서 동기 기록한 뒤 적용합니다." },
      { lines: [28, 34], color: "rose", note: "Timeout도 WAL에 남기고 snapshot과 함께 relevance를 검사합니다." },
    ],
  },
  "handle-timeout": {
    path: "consensus/state.go · handleTimeout @ 0880b4d3",
    lang: "go",
    highlight: [1, 43],
    desc: `${source} 원문의 handleTimeout입니다. 오래된 H/R/S timer를 무시하고 step마다 다음 transition을 명시적으로 호출합니다.`,
    code: `func (cs *State) handleTimeout(ti timeoutInfo, rs cstypes.RoundState) {
    // timeouts must be for current height, round, step
    if ti.Height != rs.Height || ti.Round < rs.Round ||
        (ti.Round == rs.Round && ti.Step < rs.Step) {
        return
    }

    cs.mtx.Lock()
    defer cs.mtx.Unlock()

    switch ti.Step {
    case cstypes.RoundStepNewHeight:
        cs.enterNewRound(ti.Height, 0)
    case cstypes.RoundStepNewRound:
        cs.enterPropose(ti.Height, ti.Round)
    case cstypes.RoundStepPropose:
        if err := cs.eventBus.PublishEventTimeoutPropose(cs.RoundStateEvent()); err != nil {
            cs.Logger.Error("failed publishing timeout propose", "err", err)
        }
        cs.enterPrevote(ti.Height, ti.Round)
    case cstypes.RoundStepPrevoteWait:
        if err := cs.eventBus.PublishEventTimeoutWait(cs.RoundStateEvent()); err != nil {
            cs.Logger.Error("failed publishing timeout wait", "err", err)
        }
        cs.enterPrecommit(ti.Height, ti.Round)
    case cstypes.RoundStepPrecommitWait:
        if err := cs.eventBus.PublishEventTimeoutWait(cs.RoundStateEvent()); err != nil {
            cs.Logger.Error("failed publishing timeout wait", "err", err)
        }
        cs.emitPrecommitTimeoutMetrics(ti.Round)
        cs.enterPrecommit(ti.Height, ti.Round)
        cs.enterNewRound(ti.Height, ti.Round+1)
    default:
        panic(cmterrors.ErrInvalidField{Field: "timeout_step"})
    }
}`,
    annotations: [
      { lines: [2, 6], color: "rose", note: "Height가 다르거나 node가 이미 더 높은 round·step이면 timer를 버립니다." },
      { lines: [11, 24], color: "sky", note: "Propose timeout은 Prevote, PrevoteWait timeout은 Precommit으로 보냅니다." },
      { lines: [25, 34], color: "emerald", note: "PrecommitWait timeout은 현재 precommit 처리를 마친 뒤 round+1로 이동합니다." },
    ],
  },
  "enter-new-round": {
    path: "consensus/state.go · enterNewRound @ 0880b4d3",
    lang: "go",
    highlight: [1, 35],
    desc: `${source} 원문의 enterNewRound 핵심 구간입니다. Round를 올릴 때 proposer priority와 proposal state, 다음 round vote tracking을 함께 갱신합니다.`,
    code: `func (cs *State) enterNewRound(height int64, round int32) {
    if cs.Height != height || round < cs.Round ||
        (cs.Round == round && cs.Step != cstypes.RoundStepNewHeight) {
        return
    }

    validators := cs.Validators
    if cs.Round < round {
        validators = validators.Copy()
        validators.IncrementProposerPriority(
            cmtmath.SafeSubInt32(round, cs.Round),
        )
    }

    cs.updateRoundStep(round, cstypes.RoundStepNewRound)
    cs.Validators = validators
    propAddress := validators.GetProposer().PubKey.Address()
    if round != 0 {
        cs.Proposal = nil
        cs.ProposalBlock = nil
        cs.ProposalBlockParts = nil
    }

    cs.Votes.SetRound(cmtmath.SafeAddInt32(round, 1))
    cs.TriggeredTimeoutPrecommit = false

    if err := cs.eventBus.PublishEventNewRound(cs.NewRoundEvent()); err != nil {
        cs.Logger.Error("failed publishing new round", "err", err)
    }
}`,
    annotations: [
      { lines: [2, 5], color: "rose", note: "과거 round로 돌아가거나 현재 step과 맞지 않는 호출은 거부합니다." },
      { lines: [7, 13], color: "amber", note: "건너뛴 round 수만큼 proposer priority를 deterministic하게 전진시킵니다." },
      { lines: [15, 22], color: "sky", note: "새 round 좌표를 저장하고 round 0이 아니면 이전 proposal data를 비웁니다." },
      { lines: [24, 30], color: "emerald", note: "현재와 다음 round vote를 받을 준비를 하고 NewRound event를 발행합니다." },
    ],
  },
  "enter-prevote": {
    path: "consensus/state.go · defaultDoPrevote @ 0880b4d3",
    lang: "go",
    highlight: [1, 41],
    desc: `${source} 원문의 defaultDoPrevote입니다. Lock·proposal 존재·consensus validation·ProcessProposal 순서로 block 또는 nil을 선택합니다.`,
    code: `func (cs *State) defaultDoPrevote(height int64, round int32) {
    if cs.LockedBlock != nil {
        cs.signAddVote(cmtproto.PrevoteType,
            cs.LockedBlock.Hash(), cs.LockedBlockParts.Header(), nil)
        return
    }

    if cs.ProposalBlock == nil {
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    err := cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
    if err != nil {
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    isAppValid, err := cs.blockExec.ProcessProposal(cs.ProposalBlock, cs.state)
    if err != nil {
        panic(fmt.Sprintf(
            "state machine returned an error (%v) when calling ProcessProposal", err,
        ))
    }
    cs.metrics.MarkProposalProcessed(isAppValid)

    if !isAppValid {
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    cs.signAddVote(cmtproto.PrevoteType,
        cs.ProposalBlock.Hash(), cs.ProposalBlockParts.Header(), nil)
}`,
    annotations: [
      { lines: [2, 6], color: "amber", note: "이미 lock한 block이 있으면 새 proposal보다 lock을 우선합니다." },
      { lines: [8, 16], color: "rose", note: "Proposal이 없거나 consensus validation에 실패하면 nil에 서명합니다." },
      { lines: [19, 29], color: "sky", note: "Application이 proposal을 거부하거나 오류를 내는 경우를 분리합니다." },
      { lines: [32, 33], color: "emerald", note: "두 검증을 통과한 proposal의 hash와 part header에 prevote합니다." },
    ],
  },
  "enter-precommit": {
    path: "consensus/state.go · enterPrecommit @ 0880b4d3",
    lang: "go",
    highlight: [1, 49],
    desc: `${source} 원문의 enterPrecommit 핵심 분기입니다. +2/3 prevote의 BlockID가 nil인지, 기존 lock인지, 현재 proposal인지에 따라 unlock·relock·lock을 고릅니다.`,
    code: `func (cs *State) enterPrecommit(height int64, round int32) {
    // ... H/R/S guard and deferred step update omitted above ...
    blockID, ok := cs.Votes.Prevotes(round).TwoThirdsMajority()

    if !ok {
        cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
        return
    }

    polRound, _ := cs.Votes.POLInfo()
    if polRound < round {
        panic(fmt.Sprintf("this POLRound should be %v but got %v", round, polRound))
    }

    if len(blockID.Hash) == 0 {
        if cs.LockedBlock != nil {
            cs.LockedRound = -1
            cs.LockedBlock = nil
            cs.LockedBlockParts = nil
        }
        cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
        return
    }

    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.LockedRound = round
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader, cs.LockedBlock)
        return
    }

    if cs.ProposalBlock.HashesTo(blockID.Hash) {
        if err := cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock); err != nil {
            panic(fmt.Sprintf("precommit step; +2/3 prevoted for an invalid block: %v", err))
        }
        cs.LockedRound = round
        cs.LockedBlock = cs.ProposalBlock
        cs.LockedBlockParts = cs.ProposalBlockParts
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader, cs.ProposalBlock)
        return
    }

    cs.LockedRound = -1
    cs.LockedBlock = nil
    cs.LockedBlockParts = nil
    cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
}`,
    annotations: [
      { lines: [3, 8], color: "rose", note: "+2/3 majority가 없으면 block lock을 새로 만들지 않고 nil에 precommit합니다." },
      { lines: [15, 23], color: "amber", note: "+2/3 nil은 기존 lock을 해제하고 nil precommit을 남깁니다." },
      { lines: [25, 31], color: "sky", note: "같은 locked block의 POL이면 round만 갱신해 relock합니다." },
      { lines: [33, 43], color: "emerald", note: "현재 proposal의 POL이면 block을 다시 검증하고 LockedRound·Block·Parts를 함께 저장합니다." },
    ],
  },
  "enter-commit": {
    path: "consensus/state.go · enterCommit @ 0880b4d3",
    lang: "go",
    highlight: [1, 41],
    desc: `${source} 원문의 enterCommit입니다. +2/3 precommit BlockID를 확인하고 commit 좌표를 저장한 뒤, block을 가지고 있을 때만 finalize를 시도합니다.`,
    code: `func (cs *State) enterCommit(height int64, commitRound int32) {
    if cs.Height != height || cstypes.RoundStepCommit <= cs.Step {
        return
    }

    defer func() {
        cs.updateRoundStep(cs.Round, cstypes.RoundStepCommit)
        cs.CommitRound = commitRound
        cs.CommitTime = cmttime.Now()
        cs.newStep()
        cs.tryFinalizeCommit(height)
    }()

    blockID, ok := cs.Votes.Precommits(commitRound).TwoThirdsMajority()
    if !ok {
        panic("RunActionCommit() expects +2/3 precommits")
    }

    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.ProposalBlock = cs.LockedBlock
        cs.ProposalBlockParts = cs.LockedBlockParts
    }

    if !cs.ProposalBlock.HashesTo(blockID.Hash) {
        if !cs.ProposalBlockParts.HasHeader(blockID.PartSetHeader) {
            cs.ProposalBlock = nil
            cs.ProposalBlockParts = types.NewPartSetFromHeader(blockID.PartSetHeader)
            if err := cs.eventBus.PublishEventValidBlock(cs.RoundStateEvent()); err != nil {
                cs.Logger.Error("failed publishing valid block", "err", err)
            }
            cs.evsw.FireEvent(types.EventValidBlock, cs.RoundState)
        }
    }
}`,
    annotations: [
      { lines: [2, 4], color: "rose", note: "다른 height이거나 이미 Commit step이면 중복 진입하지 않습니다." },
      { lines: [6, 12], color: "emerald", note: "Commit 좌표와 시간을 저장한 뒤 tryFinalizeCommit에서 block 보유 여부를 다시 확인합니다." },
      { lines: [14, 17], color: "amber", note: "Commit transition 자체가 +2/3 precommit을 전제로 합니다." },
      { lines: [24, 34], color: "sky", note: "Commit certificate는 있지만 block bytes가 없으면 expected PartSet을 설정하고 먼저 block을 받습니다." },
    ],
  },
  "add-vote": {
    path: "consensus/state.go · addVote transition @ 0880b4d3",
    lang: "go",
    highlight: [1, 53],
    desc: `${source} 원문의 vote transition 분기 발췌입니다. VoteSet에 추가된 power가 +2/3-one인지 +2/3-any인지에 따라 round skip·precommit·commit을 다르게 호출합니다.`,
    code: `switch vote.Type {
case cmtproto.PrevoteType:
    prevotes := cs.Votes.Prevotes(vote.Round)

    if blockID, ok := prevotes.TwoThirdsMajority(); ok {
        if len(blockID.Hash) != 0 &&
            cs.ValidRound < vote.Round && vote.Round == cs.Round {
            if cs.ProposalBlock.HashesTo(blockID.Hash) {
                cs.ValidRound = vote.Round
                cs.ValidBlock = cs.ProposalBlock
                cs.ValidBlockParts = cs.ProposalBlockParts
            } else {
                cs.ProposalBlock = nil
            }
        }
    }

    switch {
    case cs.Round < vote.Round && prevotes.HasTwoThirdsAny():
        cs.enterNewRound(height, vote.Round)
    case cs.Round == vote.Round && cstypes.RoundStepPrevote <= cs.Step:
        blockID, ok := prevotes.TwoThirdsMajority()
        if ok && (cs.isProposalComplete() || len(blockID.Hash) == 0) {
            cs.enterPrecommit(height, vote.Round)
        } else if prevotes.HasTwoThirdsAny() {
            cs.enterPrevoteWait(height, vote.Round)
        }
    }

case cmtproto.PrecommitType:
    precommits := cs.Votes.Precommits(vote.Round)
    blockID, ok := precommits.TwoThirdsMajority()
    if ok {
        cs.enterNewRound(height, vote.Round)
        cs.enterPrecommit(height, vote.Round)

        if len(blockID.Hash) != 0 {
            cs.enterCommit(height, vote.Round)
            if cs.config.SkipTimeoutCommit && precommits.HasAll() {
                cs.enterNewRound(cs.Height, 0)
            }
        } else {
            cs.enterPrecommitWait(height, vote.Round)
        }
    } else if cs.Round <= vote.Round && precommits.HasTwoThirdsAny() {
        cs.enterNewRound(height, vote.Round)
        cs.enterPrecommitWait(height, vote.Round)
    }
}`,
    annotations: [
      { lines: [5, 14], color: "emerald", note: "Block 하나에 +2/3 prevote가 모이고 block bytes도 맞으면 ValidBlock과 ValidRound를 갱신합니다." },
      { lines: [17, 26], color: "sky", note: "Future round의 +2/3-any는 round skip을, current round의 majority는 precommit을 유발합니다." },
      { lines: [29, 44], color: "amber", note: "+2/3 precommit이 block을 가리키면 Commit, nil이면 PrecommitWait으로 이동합니다." },
      { lines: [45, 48], color: "rose", note: "Block 하나의 majority가 없어도 +2/3-any면 더 높은 round를 따라잡습니다." },
    ],
  },
  "try-add-vote": {
    path: "consensus/state.go · tryAddVote @ 0880b4d3",
    lang: "go",
    highlight: [1, 31],
    desc: `${source} 원문의 conflicting vote 처리입니다. 같은 validator의 상충 서명을 일반 오류처럼 버리지 않고 두 vote를 evidence pool에 보고합니다.`,
    code: `func (cs *State) tryAddVote(vote *types.Vote, peerID p2p.ID) (bool, error) {
    added, err := cs.addVote(vote, peerID)
    if err != nil {
        if voteErr, ok := err.(*types.ErrVoteConflictingVotes); ok {
            if cs.privValidatorPubKey == nil {
                return false, ErrPubKeyIsNotSet
            }

            if bytes.Equal(vote.ValidatorAddress,
                cs.privValidatorPubKey.Address()) {
                cs.Logger.Error("found conflicting vote from ourselves; did you unsafe_reset a validator?",
                    "height", vote.Height, "round", vote.Round, "type", vote.Type)
                return added, err
            }

            cs.evpool.ReportConflictingVotes(voteErr.VoteA, voteErr.VoteB)
            cs.Logger.Debug("found and sent conflicting votes to the evidence pool",
                "vote_a", voteErr.VoteA, "vote_b", voteErr.VoteB)
            return added, err
        } else if errors.Is(err, types.ErrVoteNonDeterministicSignature) {
            cs.Logger.Debug("vote has non-deterministic signature", "err", err)
        } else if errors.Is(err, types.ErrInvalidVoteExtension) {
            cs.Logger.Debug("vote has invalid extension")
        } else {
            return added, ErrAddingVote
        }
    }
    return added, nil
}`,
    annotations: [
      { lines: [2, 4], color: "sky", note: "먼저 VoteSet 추가를 시도한 뒤 충돌 오류의 구체적 타입을 분기합니다." },
      { lines: [5, 14], color: "rose", note: "자기 validator key의 이중 서명은 안전하지 않은 reset 가능성을 포함한 별도 심각 오류입니다." },
      { lines: [16, 19], color: "emerald", note: "다른 validator의 두 상충 vote는 evidence pool에 함께 전달합니다." },
      { lines: [21, 27], color: "amber", note: "비결정적 서명·extension 오류·일반 vote 오류는 서로 다른 진단 경로를 가집니다." },
    ],
  },
};
