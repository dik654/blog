import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";
const excerpt = `${source}에서 긴 오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다.`;

export const officialCometBFTCryptoCodeRefs: Record<string, CodeRef> = {
  "tx-merkle-proof": {
    path: "types/tx.go · Txs.Hash·Proof·TxProof.Validate @ 0880b4d3",
    lang: "go",
    highlight: [1, 41],
    desc: `${excerpt} Transaction bytes를 먼저 32-byte TxHash로 만들고, ordered TxHash 목록의 Merkle root와 inclusion proof를 검증합니다.`,
    code: `func (tx Tx) Hash() []byte {
    return tmhash.Sum(tx)
}

func (txs Txs) Hash() []byte {
    hl := txs.hashList()
    return merkle.HashFromByteSlices(hl)
}

func (txs Txs) Proof(i int) TxProof {
    hl := txs.hashList()
    root, proofs := merkle.ProofsFromByteSlices(hl)
    return TxProof{
        RootHash: root,
        Data:     txs[i],
        Proof:    *proofs[i],
    }
}

func (txs Txs) hashList() [][]byte {
    hl := make([][]byte, len(txs))
    for i := 0; i < len(txs); i++ {
        hl[i] = txs[i].Hash()
    }
    return hl
}

func (tp TxProof) Leaf() []byte {
    return tp.Data.Hash()
}

func (tp TxProof) Validate(dataHash []byte) error {
    if !bytes.Equal(dataHash, tp.RootHash) {
        return errors.New("proof matches different data hash")
    }
    if tp.Proof.Index < 0 || tp.Proof.Total <= 0 {
        return errors.New("invalid proof position")
    }
    if err := tp.Proof.Verify(tp.RootHash, tp.Leaf()); err != nil {
        return errors.New("proof is not internally consistent")
    }
    return nil
}`,
    annotations: [
      { lines: [1, 3], color: "sky", note: "CometBFT의 TxID는 raw transaction bytes의 SHA-256입니다." },
      { lines: [5, 8], color: "amber", note: "DataHash의 Merkle leaves는 raw transaction이 아니라 순서가 있는 TxHash 목록입니다." },
      { lines: [10, 19], color: "violet", note: "Proof에는 원본 transaction과 index·total·aunt hashes가 함께 들어갑니다." },
      { lines: [29, 41], color: "emerald", note: "먼저 expected DataHash와 proof root를 연결한 뒤 transaction bytes로 path를 다시 계산합니다." },
    ],
  },
  "merkle-domains": {
    path: "crypto/merkle/tree.go · hash.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 35],
    desc: `${excerpt} Ordered leaves를 split point로 나누고 leaf·inner input 앞에 서로 다른 byte를 붙입니다.`,
    code: `func HashFromByteSlices(items [][]byte) []byte {
    return hashFromByteSlices(sha256.New(), items)
}

func hashFromByteSlices(sha hash.Hash, items [][]byte) []byte {
    switch len(items) {
    case 0:
        return emptyHash()
    case 1:
        return leafHashOpt(sha, items[0])
    default:
        k := getSplitPoint(int64(len(items)))
        left := hashFromByteSlices(sha, items[:k])
        right := hashFromByteSlices(sha, items[k:])
        return innerHashOpt(sha, left, right)
    }
}

var (
    leafPrefix  = []byte{0}
    innerPrefix = []byte{1}
)

func leafHashOpt(s hash.Hash, leaf []byte) []byte {
    s.Reset()
    s.Write(leafPrefix)
    s.Write(leaf)
    return s.Sum(nil)
}

func innerHashOpt(s hash.Hash, left, right []byte) []byte {
    s.Reset()
    s.Write(innerPrefix)
    s.Write(left)
    s.Write(right)
    return s.Sum(nil)
}`,
    annotations: [
      { lines: [5, 16], color: "sky", note: "세 leaf라면 가장 큰 2의 거듭제곱인 2에서 [0,1]과 [2]로 나눕니다." },
      { lines: [18, 21], color: "amber", note: "0x00과 0x01은 같은 SHA-256 안에서 leaf와 inner node의 영역을 구분합니다." },
      { lines: [23, 28], color: "emerald", note: "Leaf는 0x00 || item을 해시합니다. 이 글의 item은 TxHash입니다." },
      { lines: [30, 36], color: "violet", note: "Inner node는 0x01 || left || right이므로 자식 순서도 root에 반영됩니다." },
    ],
  },
  "proof-verify": {
    path: "crypto/merkle/proof.go · Proof.Verify @ 0880b4d3",
    lang: "go",
    highlight: [1, 38],
    desc: `${excerpt} Leaf bytes와 aunt 순서로 root를 재계산하고 expected root와 비교합니다.`,
    code: `type Proof struct {
    Total    int64
    Index    int64
    LeafHash []byte
    Aunts    [][]byte
}

func (sp *Proof) Verify(rootHash []byte, leaf []byte) error {
    if rootHash == nil {
        return fmt.Errorf("invalid root hash: cannot be nil")
    }
    if sp.Total < 0 || sp.Index < 0 {
        return errors.New("invalid proof position")
    }
    hash := tmhash.New()
    leafHash := leafHashOpt(hash, leaf)
    if !bytes.Equal(sp.LeafHash, leafHash) {
        return fmt.Errorf("invalid leaf hash")
    }
    computedHash, err := sp.computeRootHash(hash)
    if err != nil {
        return fmt.Errorf("compute root hash: %w", err)
    }
    if !bytes.Equal(computedHash, rootHash) {
        return fmt.Errorf("invalid root hash")
    }
    return nil
}

func (sp *Proof) computeRootHash(hash hash.Hash) ([]byte, error) {
    return computeHashFromAunts(
        hash,
        sp.Index,
        sp.Total,
        sp.LeafHash,
        sp.Aunts,
    )
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "Total·Index는 tree shape와 각 aunt가 왼쪽인지 오른쪽인지 결정합니다." },
      { lines: [15, 19], color: "amber", note: "전달받은 leaf hash를 믿지 않고 입력 leaf bytes에서 다시 계산합니다." },
      { lines: [20, 27], color: "emerald", note: "Aunts로 복원한 root가 expected root와 같을 때만 proof가 성공합니다." },
      { lines: [30, 38], color: "violet", note: "Index·Total·Aunts 순서가 바뀌면 같은 hashes를 가지고도 다른 path가 됩니다." },
    ],
  },
  "vote-sign-bytes": {
    path: "types/canonical.go · types/vote.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 27],
    desc: `${excerpt} Vote의 합의 좌표와 chain domain을 canonical protobuf bytes로 만든 뒤 서명 입력으로 사용합니다.`,
    code: `func CanonicalizeVote(
    chainID string,
    vote *cmtproto.Vote,
) cmtproto.CanonicalVote {
    return cmtproto.CanonicalVote{
        Type:      vote.Type,
        Height:    vote.Height,
        Round:     int64(vote.Round),
        BlockID:   CanonicalizeBlockID(vote.BlockID),
        Timestamp: vote.Timestamp,
        ChainID:   chainID,
    }
}

func VoteSignBytes(
    chainID string,
    vote *cmtproto.Vote,
) []byte {
    pb := CanonicalizeVote(chainID, vote)
    bz, err := protoio.MarshalDelimited(&pb)
    if err != nil {
        panic(err)
    }
    return bz
}`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "서명 대상에는 type·height·round·BlockID·timestamp·chain ID가 들어갑니다." },
      { lines: [5, 12], color: "amber", note: "ValidatorAddress와 ValidatorIndex는 canonical vote에 넣지 않고 public key lookup에서 별도로 검사합니다." },
      { lines: [14, 25], color: "emerald", note: "Canonical protobuf를 length-delimited bytes로 고정해야 signer와 verifier가 같은 message를 봅니다." },
    ],
  },
  "vote-verify": {
    path: "types/vote.go · verifyAndReturnProto @ 0880b4d3",
    lang: "go",
    highlight: [1, 12],
    desc: `${excerpt} Public key에서 만든 20-byte address를 vote와 먼저 대조하고 같은 canonical bytes로 signature를 검증합니다.`,
    code: `func (vote *Vote) verifyAndReturnProto(
    chainID string,
    pubKey crypto.PubKey,
) (*cmtproto.Vote, error) {
    if !bytes.Equal(pubKey.Address(), vote.ValidatorAddress) {
        return nil, ErrVoteInvalidValidatorAddress
    }
    v := vote.ToProto()
    if !pubKey.VerifySignature(
        VoteSignBytes(chainID, v), vote.Signature,
    ) {
        return nil, ErrVoteInvalidSignature
    }
    return v, nil
}`,
    annotations: [
      { lines: [5, 7], color: "amber", note: "Address는 validator set에서 가져온 public key와 vote의 lookup identity를 연결합니다." },
      { lines: [8, 13], color: "emerald", note: "실제 승인은 32-byte public key로 canonical vote bytes와 64-byte signature를 검증해 확인합니다." },
    ],
  },
  "ed25519-contract": {
    path: "crypto/ed25519/ed25519.go · Address·VerifySignature @ 0880b4d3",
    lang: "go",
    highlight: [1, 25],
    desc: `${excerpt} 32-byte public key, 64-byte signature와 20-byte truncated address의 역할을 분리합니다.`,
    code: `const (
    PubKeySize     = 32
    PrivateKeySize = 64
    SignatureSize  = 64
)

// Address is the SHA256-20 of the raw pubkey bytes.
func (pubKey PubKey) Address() crypto.Address {
    if len(pubKey) != PubKeySize {
        panic("pubkey is incorrect size")
    }
    return crypto.Address(tmhash.SumTruncated(pubKey))
}

func (pubKey PubKey) VerifySignature(
    msg []byte,
    sig []byte,
) bool {
    if len(sig) != SignatureSize {
        return false
    }
    return cachingVerifier.VerifyWithOptions(
        ed25519.PublicKey(pubKey), msg, sig, verifyOptions,
    )
}`,
    annotations: [
      { lines: [1, 5], color: "sky", note: "Key와 signature의 고정 길이는 wire 입력을 검사하는 첫 경계입니다." },
      { lines: [7, 13], color: "amber", note: "Address는 SHA-256 앞 20 bytes인 compact identity이며 32-byte commitment가 아닙니다." },
      { lines: [15, 25], color: "emerald", note: "Signature 검증은 address가 아니라 원래 public key와 exact message bytes를 사용합니다." },
    ],
  },
  "header-datahash": {
    path: "types/block.go · Data.Hash·Header.Hash @ 0880b4d3",
    lang: "go",
    highlight: [1, 31],
    desc: `${excerpt} Transaction root를 Header.DataHash에 넣고, Header field 전체를 다시 Merkle root로 묶어 BlockID hash를 만듭니다.`,
    code: `func (data *Data) Hash() cmtbytes.HexBytes {
    if data == nil {
        return (Txs{}).Hash()
    }
    if data.hash == nil {
        data.hash = data.Txs.Hash()
    }
    return data.hash
}

func (h *Header) Hash() cmtbytes.HexBytes {
    if h == nil || len(h.ValidatorsHash) == 0 {
        return nil
    }
    return merkle.HashFromByteSlices([][]byte{
        cdcEncode(h.ChainID),
        cdcEncode(h.Height),
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
      { lines: [1, 9], color: "sky", note: "DataHash는 ordered transaction 목록의 root이며 애플리케이션 실행 결과인 AppHash와 다릅니다." },
      { lines: [11, 27], color: "violet", note: "DataHash를 포함한 Header fields의 commitment가 BlockID의 hash가 됩니다. 발췌에서 version·time·lastBlockID 줄은 생략했습니다." },
    ],
  },
  "tmhash-lengths": {
    path: "crypto/tmhash/hash.go · Sum·SumTruncated @ 0880b4d3",
    lang: "go",
    highlight: [1, 13],
    desc: `${excerpt} Full SHA-256 commitment와 compact address용 20-byte prefix를 별도 API로 제공합니다.`,
    code: `const Size = sha256.Size

func Sum(bz []byte) []byte {
    hash := sha256.Sum256(bz)
    return hash[:]
}

const TruncatedSize = 20

func SumTruncated(bz []byte) []byte {
    hash := sha256.Sum256(bz)
    return hash[:TruncatedSize]
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "Transaction·Merkle·Header commitment 경로는 32-byte SHA-256을 사용합니다." },
      { lines: [8, 13], color: "amber", note: "Validator address는 같은 digest의 앞 20 bytes만 사용하므로 용도와 충돌 예산이 다릅니다." },
    ],
  },
};
