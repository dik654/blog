import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";

export const officialCometBFTTypesCodeRefs: Record<string, CodeRef> = {
  "block-header-struct": {
    path: "types/block.go · Block / Header @ 0880b4d3",
    lang: "go",
    highlight: [1, 35],
    desc: `${source} 원문의 두 구조체에서 연속된 필드만 옮긴 발췌입니다. Block은 네 부분을 묶고 Header는 현재 payload와 직전 실행 결과의 commitment를 함께 보존합니다.`,
    code: `type Block struct {
    mtx cmtsync.Mutex

    verifiedHash cmtbytes.HexBytes // Verified block hash (not included in the struct hash)
    Header       \`json:"header"\`
    Data         \`json:"data"\`
    Evidence     EvidenceData \`json:"evidence"\`
    LastCommit   *Commit      \`json:"last_commit"\`
}

type Header struct {
    // basic block info
    Version cmtversion.Consensus \`json:"version"\`
    ChainID string               \`json:"chain_id"\`
    Height  int64                \`json:"height"\`
    Time    time.Time            \`json:"time"\`

    // prev block info
    LastBlockID BlockID \`json:"last_block_id"\`

    // hashes of block data
    LastCommitHash cmtbytes.HexBytes \`json:"last_commit_hash"\`
    DataHash       cmtbytes.HexBytes \`json:"data_hash"\`

    // hashes from the app output from the prev block
    ValidatorsHash     cmtbytes.HexBytes \`json:"validators_hash"\`
    NextValidatorsHash cmtbytes.HexBytes \`json:"next_validators_hash"\`
    ConsensusHash      cmtbytes.HexBytes \`json:"consensus_hash"\`
    AppHash            cmtbytes.HexBytes \`json:"app_hash"\`
    LastResultsHash    cmtbytes.HexBytes \`json:"last_results_hash"\`

    // consensus info
    EvidenceHash    cmtbytes.HexBytes \`json:"evidence_hash"\`
    ProposerAddress Address           \`json:"proposer_address"\`
}`,
    annotations: [
      { lines: [1, 9], color: "sky", note: "Block은 Header·Data·Evidence·LastCommit을 한 단위로 묶습니다." },
      { lines: [20, 24], color: "amber", note: "현재 transaction과 이전 높이의 Commit을 서로 다른 hash로 가리킵니다." },
      { lines: [26, 31], color: "emerald", note: "AppHash와 LastResultsHash는 주석 그대로 이전 block의 application 결과입니다." },
    ],
  },
  "header-hash": {
    path: "types/block.go · Header.Hash @ 0880b4d3",
    lang: "go",
    highlight: [1, 35],
    desc: `${source} 원문의 Header.Hash입니다. Header에 나타난 필드 순서를 그대로 유지해 Merkle root를 계산합니다.`,
    code: `func (h *Header) Hash() cmtbytes.HexBytes {
    if h == nil || len(h.ValidatorsHash) == 0 {
        return nil
    }
    hbz, err := h.Version.Marshal()
    if err != nil {
        return nil
    }

    pbt, err := gogotypes.StdTimeMarshal(h.Time)
    if err != nil {
        return nil
    }

    pbbi := h.LastBlockID.ToProto()
    bzbi, err := pbbi.Marshal()
    if err != nil {
        return nil
    }
    return merkle.HashFromByteSlices([][]byte{
        hbz,
        cdcEncode(h.ChainID),
        cdcEncode(h.Height),
        pbt,
        bzbi,
        cdcEncode(h.LastCommitHash),
        cdcEncode(h.DataHash),
        cdcEncode(h.ValidatorsHash),
        cdcEncode(h.NextValidatorsHash),
        cdcEncode(h.ConsensusHash),
        cdcEncode(h.AppHash),
        cdcEncode(h.LastResultsHash),
        cdcEncode(h.EvidenceHash),
        cdcEncode(h.ProposerAddress),
    })
}`,
    annotations: [
      { lines: [2, 4], color: "rose", note: "ValidatorsHash가 없으면 유효한 Header identity를 만들지 않습니다." },
      { lines: [5, 18], color: "sky", note: "Version·Time·LastBlockID를 각 타입의 고정된 bytes로 바꿉니다." },
      { lines: [20, 34], color: "emerald", note: "Header 선언 순서를 보존한 field bytes의 Merkle root가 Block hash입니다." },
    ],
  },
  "data-hash": {
    path: "types/block.go · Data.Hash @ 0880b4d3",
    lang: "go",
    highlight: [1, 20],
    desc: `${source} 원문의 Data와 Hash입니다. Transaction의 의미를 실행하는 함수가 아니라 transaction ID들의 Merkle root를 계산하고 캐시합니다.`,
    code: `type Data struct {
    // Txs that will be applied by state @ block.Height+1.
    // NOTE: not all txs here are valid.  We're just agreeing on the order first.
    // This means that block.AppHash does not include these txs.
    Txs Txs \`json:"txs"\`

    // Volatile
    hash cmtbytes.HexBytes
}

// Hash returns the hash of the data
func (data *Data) Hash() cmtbytes.HexBytes {
    if data == nil {
        return (Txs{}).Hash()
    }
    if data.hash == nil {
        data.hash = data.Txs.Hash() // NOTE: leaves of merkle tree are TxIDs
    }
    return data.hash
}`,
    annotations: [
      { lines: [2, 5], color: "amber", note: "현재 Data의 transaction은 다음 application 실행 대상이며 이 Header의 AppHash에는 아직 반영되지 않습니다." },
      { lines: [12, 19], color: "emerald", note: "Transaction ID를 leaf로 한 Merkle root를 계산하고 volatile field에 캐시합니다." },
    ],
  },
  "make-partset": {
    path: "types/block.go · Block.MakePartSet @ 0880b4d3",
    lang: "go",
    highlight: [1, 16],
    desc: `${source} 원문의 MakePartSet입니다. 예전 축약본과 달리 v0.40.0은 ToProto 뒤 proto.Marshal을 호출합니다.`,
    code: `func (b *Block) MakePartSet(partSize uint32) (*PartSet, error) {
    if b == nil {
        return nil, errors.New("nil block")
    }
    b.mtx.Lock()
    defer b.mtx.Unlock()

    pbb, err := b.ToProto()
    if err != nil {
        return nil, err
    }
    bz, err := proto.Marshal(pbb)
    if err != nil {
        return nil, err
    }
    return NewPartSetFromData(bz, partSize), nil
}`,
    annotations: [
      { lines: [2, 6], color: "sky", note: "nil을 거부하고 Block의 동시 접근을 잠급니다." },
      { lines: [8, 15], color: "emerald", note: "Domain object를 Protobuf로 바꿔 직렬화한 뒤 gossip용 part와 proof를 만듭니다." },
    ],
  },
  "vote-sign-bytes": {
    path: "types/vote.go + types/canonical.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 31],
    desc: `${source} 원문의 Vote 필드, VoteSignBytes와 CanonicalizeVote를 이어 붙인 발췌입니다. Network object 전체를 그대로 서명하지 않는다는 점이 핵심입니다.`,
    code: `type Vote struct {
    Type               cmtproto.SignedMsgType \`json:"type"\`
    Height             int64                  \`json:"height"\`
    Round              int32                  \`json:"round"\`
    BlockID            BlockID                \`json:"block_id"\`
    Timestamp          time.Time              \`json:"timestamp"\`
    ValidatorAddress   Address                \`json:"validator_address"\`
    ValidatorIndex     int32                  \`json:"validator_index"\`
    Signature          []byte                 \`json:"signature"\`
    Extension          []byte                 \`json:"extension"\`
    ExtensionSignature []byte                 \`json:"extension_signature"\`
}

func VoteSignBytes(chainID string, vote *cmtproto.Vote) []byte {
    pb := CanonicalizeVote(chainID, vote)
    bz, err := protoio.MarshalDelimited(&pb)
    if err != nil {
        panic(err)
    }
    return bz
}

func CanonicalizeVote(chainID string, vote *cmtproto.Vote) cmtproto.CanonicalVote {
    return cmtproto.CanonicalVote{
        Type:      vote.Type,
        Height:    vote.Height,
        Round:     int64(vote.Round),
        BlockID:   CanonicalizeBlockID(vote.BlockID),
        Timestamp: vote.Timestamp,
        ChainID:   chainID,
    }
}`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "전송용 Vote에는 signer 식별자와 vote extension까지 있습니다." },
      { lines: [14, 21], color: "emerald", note: "실제 서명 bytes는 canonical object를 length-delimited Protobuf로 직렬화합니다." },
      { lines: [23, 31], color: "amber", note: "CanonicalVote는 chain·H/R/type·BlockID·time을 묶고 validator 식별자와 extension은 제외합니다." },
    ],
  },
  "verify-commit": {
    path: "types/validation.go · VerifyCommit @ 0880b4d3",
    lang: "go",
    highlight: [1, 25],
    desc: `${source} 원문의 VerifyCommit입니다. Absent를 건너뛰고 Commit flag만 power에 더하며, batch를 쓸 수 없으면 단일 서명 검증으로 돌아갑니다.`,
    code: `func VerifyCommit(chainID string, vals *ValidatorSet, blockID BlockID,
    height int64, commit *Commit,
) error {
    // run a basic validation of the arguments
    if err := verifyBasicValsAndCommit(vals, commit, height, blockID); err != nil {
        return err
    }

    // calculate voting power needed
    votingPowerNeeded := vals.TotalVotingPower() * 2 / 3

    // ignore all absent signatures
    ignore := func(c CommitSig) bool { return c.BlockIDFlag == BlockIDFlagAbsent }

    // only count the signatures that are for the block
    count := func(c CommitSig) bool { return c.BlockIDFlag == BlockIDFlagCommit }

    // attempt to batch verify
    if shouldBatchVerify(vals, commit) {
        return verifyCommitBatch(chainID, vals, commit,
            votingPowerNeeded, ignore, count, true, true, nil, nil)
    }

    return verifyCommitSingle(chainID, vals, commit, votingPowerNeeded,
        ignore, count, true, true, nil)
}`,
    annotations: [
      { lines: [4, 10], color: "sky", note: "Commit과 historical ValidatorSet의 모양·height·BlockID를 먼저 확인하고 필요한 power를 계산합니다." },
      { lines: [12, 16], color: "amber", note: "Absent는 검증 대상에서 빼고, 같은 block을 뜻하는 Commit flag만 문턱에 더합니다." },
      { lines: [18, 25], color: "emerald", note: "Batch와 single path 모두 같은 좌표·서명·power 규칙을 적용합니다." },
    ],
  },
  "validator-set": {
    path: "types/validator.go + types/validator_set.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 21],
    desc: `${source} 원문의 Validator와 ValidatorSet 발췌입니다. VotingPower와 ProposerPriority가 한 구조체에 있어도 검증과 scheduler라는 책임은 다릅니다.`,
    code: `type Validator struct {
    Address     Address       \`json:"address"\`
    PubKey      crypto.PubKey \`json:"pub_key"\`
    VotingPower int64         \`json:"voting_power"\`

    ProposerPriority int64 \`json:"proposer_priority"\`
}

type ValidatorSet struct {
    // NOTE: persisted via reflect, must be exported.
    Validators []*Validator \`json:"validators"\`
    Proposer   *Validator   \`json:"proposer"\`

    // cached (unexported)
    totalVotingPower int64
    // true if all validators have the same type of public key or if the set is empty.
    allKeysHaveSameType bool
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "공개키와 voting power는 서명과 Commit power 검증에 쓰입니다." },
      { lines: [6, 6], color: "amber", note: "ProposerPriority는 매 round 달라지는 local scheduling state입니다." },
      { lines: [9, 18], color: "emerald", note: "ValidatorSet은 height별 구성원·power와 현재 proposer 및 계산 캐시를 함께 관리합니다." },
    ],
  },
  "proposer-priority": {
    path: "types/validator_set.go · IncrementProposerPriority @ 0880b4d3",
    lang: "go",
    highlight: [1, 34],
    desc: `${source} 원문의 priority 갱신 경로입니다. 단순한 add/subtract 앞에 priority 범위 rescale과 평균 중심 이동이 있습니다.`,
    code: `func (vals *ValidatorSet) IncrementProposerPriority(times int32) {
    if vals.IsNilOrEmpty() {
        panic("empty validator set")
    }
    if times <= 0 {
        panic("Cannot call IncrementProposerPriority with non-positive times")
    }

    diffMax := PriorityWindowSizeFactor * vals.TotalVotingPower()
    vals.RescalePriorities(diffMax)
    vals.shiftByAvgProposerPriority()

    var proposer *Validator
    for i := int32(0); i < times; i++ {
        proposer = vals.incrementProposerPriority()
    }

    vals.Proposer = proposer
}

func (vals *ValidatorSet) incrementProposerPriority() *Validator {
    for _, val := range vals.Validators {
        newPrio := safeAddClip(val.ProposerPriority, val.VotingPower)
        val.ProposerPriority = newPrio
    }
    mostest := vals.getValWithMostPriority()
    mostest.ProposerPriority = safeSubClip(
        mostest.ProposerPriority,
        vals.TotalVotingPower(),
    )
    return mostest
}`,
    annotations: [
      { lines: [8, 11], color: "amber", note: "실제 구현은 priority 격차를 제한하고 평균을 0 근처로 옮긴 뒤 round 계산을 시작합니다." },
      { lines: [13, 18], color: "sky", note: "times만큼 deterministic scheduler step을 반복하고 최종 proposer를 저장합니다." },
      { lines: [21, 33], color: "emerald", note: "각 power를 더한 뒤 최대 priority를 고르고 선택자에게 total power를 뺍니다." },
    ],
  },
  "evidence-struct": {
    path: "types/evidence.go · DuplicateVoteEvidence @ 0880b4d3",
    lang: "go",
    highlight: [1, 10],
    desc: `${source} 원문의 DuplicateVoteEvidence 구조체입니다. 상충 vote 두 개뿐 아니라 당시 total·validator power와 block time도 함께 보존합니다.`,
    code: `type DuplicateVoteEvidence struct {
    VoteA *Vote \`json:"vote_a"\`
    VoteB *Vote \`json:"vote_b"\`

    // abci specific information
    TotalVotingPower int64
    ValidatorPower   int64
    Timestamp        time.Time
}`,
    annotations: [
      { lines: [1, 3], color: "rose", note: "같은 validator가 낸 상충 signed vote 두 개가 핵심 증거입니다." },
      { lines: [5, 8], color: "emerald", note: "당시 power와 time은 application 전달과 historical 검증에 필요합니다." },
    ],
  },
  "evidence-verify": {
    path: "evidence/verify.go · VerifyDuplicateVote @ 0880b4d3",
    lang: "go",
    highlight: [1, 49],
    desc: `${source} 원문의 VerifyDuplicateVote 핵심 검증 순서를 옮긴 발췌입니다. Pool은 이 함수 전에 committed 여부·age·block time·historical ValidatorSet도 확인합니다.`,
    code: `func VerifyDuplicateVote(e *types.DuplicateVoteEvidence, chainID string,
    valSet *types.ValidatorSet,
) error {
    _, val := valSet.GetByAddress(e.VoteA.ValidatorAddress)
    if val == nil {
        return fmt.Errorf("address was not a validator at height %d", e.Height())
    }
    pubKey := val.PubKey

    if e.VoteA.Height != e.VoteB.Height ||
        e.VoteA.Round != e.VoteB.Round ||
        e.VoteA.Type != e.VoteB.Type {
        return fmt.Errorf("h/r/s does not match")
    }

    if !bytes.Equal(e.VoteA.ValidatorAddress, e.VoteB.ValidatorAddress) {
        return fmt.Errorf("validator addresses do not match")
    }
    if e.VoteA.BlockID.Equals(e.VoteB.BlockID) {
        return fmt.Errorf("block IDs are the same - not a real duplicate vote")
    }

    if !bytes.Equal(pubKey.Address(), e.VoteA.ValidatorAddress) {
        return fmt.Errorf("address doesn't match pubkey")
    }
    if val.VotingPower != e.ValidatorPower {
        return fmt.Errorf("validator power does not match")
    }
    if valSet.TotalVotingPower() != e.TotalVotingPower {
        return fmt.Errorf("total voting power does not match")
    }

    va := e.VoteA.ToProto()
    vb := e.VoteB.ToProto()
    if !pubKey.VerifySignature(types.VoteSignBytes(chainID, va), e.VoteA.Signature) {
        return fmt.Errorf("verifying VoteA: %w", types.ErrVoteInvalidSignature)
    }
    if !pubKey.VerifySignature(types.VoteSignBytes(chainID, vb), e.VoteB.Signature) {
        return fmt.Errorf("verifying VoteB: %w", types.ErrVoteInvalidSignature)
    }
    return nil
}`,
    annotations: [
      { lines: [4, 8], color: "sky", note: "먼저 evidence 높이의 historical set에서 signer와 공개키를 찾습니다." },
      { lines: [10, 21], color: "rose", note: "H/R/type과 signer는 같고 BlockID는 달라야 실제 duplicate vote입니다." },
      { lines: [23, 31], color: "amber", note: "구조체 안의 power가 historical set과 같은지도 대조합니다." },
      { lines: [33, 41], color: "emerald", note: "같은 chainID로 두 canonical sign bytes를 다시 만들고 두 signature를 모두 검증합니다." },
    ],
  },
};
