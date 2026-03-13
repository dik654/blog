import { CitationBlock } from '../../../../components/ui/citation';

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구현과 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-lg font-semibold mt-6 mb-3">geth 구현</h3>
        <p>
          Go-Ethereum의 <code>rlp/</code> 패키지는 RLP 인코딩/디코딩의 참조 구현입니다.
          Go의 리플렉션을 활용하여 임의의 Go 구조체를 자동으로 RLP 변환합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// rlp/encode.go — 인코딩 핵심 로직
func Encode(w io.Writer, val interface{}) error

// 내부 동작:
// 1. val의 타입을 검사 (reflect)
// 2. 타입에 맞는 writer 함수 선택
// 3. 길이 계산 → 접두사 작성 → 데이터 작성

// 타입별 writer:
func writeString(val reflect.Value, w *encbuf)  // 바이트 슬라이스
func writeList(val reflect.Value, w *encbuf)     // 구조체/슬라이스 → 리스트
func writeUint(val reflect.Value, w *encbuf)     // uint → big-endian bytes

// rlp/decode.go — 디코딩 핵심 로직
func Decode(r io.Reader, val interface{}) error
func DecodeBytes(b []byte, val interface{}) error

// Stream API (점진적 디코딩):
type Stream struct { /* ... */ }
func (s *Stream) List() (uint64, error)   // 리스트 시작
func (s *Stream) Bytes() ([]byte, error)  // 바이트 문자열 읽기
func (s *Stream) Uint() (uint64, error)   // uint 읽기
func (s *Stream) ListEnd() error          // 리스트 종료 확인`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">트랜잭션 RLP 인코딩</h3>
        <p>
          Ethereum 레거시 트랜잭션(Type 0)은 9개 필드의 RLP 리스트로 인코딩됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 레거시 트랜잭션 구조
type LegacyTx struct {
    Nonce    uint64
    GasPrice *big.Int
    Gas      uint64
    To       *common.Address  // nil = 컨트랙트 생성
    Value    *big.Int
    Data     []byte
    V, R, S  *big.Int         // ECDSA 서명
}

// RLP 인코딩 (서명 전):
rlp_unsigned = RLP([nonce, gasPrice, gas, to, value, data, chainId, 0, 0])

// 서명 과정:
hash = keccak256(rlp_unsigned)
sig  = ECDSA_sign(privateKey, hash)
v, r, s = extract(sig)

// RLP 인코딩 (서명 후):
rlp_signed = RLP([nonce, gasPrice, gas, to, value, data, v, r, s])

// EIP-1559 트랜잭션 (Type 2):
// 0x02 || RLP([chainId, nonce, maxPriorityFeePerGas,
//              maxFeePerGas, gas, to, value, data,
//              accessList, v, r, s])`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">블록 헤더 RLP 인코딩</h3>
        <p>
          블록 헤더는 15개 이상의 필드를 가진 RLP 리스트입니다.
          블록 해시는 이 인코딩의 keccak256입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 블록 헤더 구조 (Post-Merge)
type Header struct {
    ParentHash  Hash       // 이전 블록 해시
    UncleHash   Hash       // 빈 리스트 해시 (PoS 이후)
    Coinbase    Address    // 블록 제안자 (fee recipient)
    Root        Hash       // stateRoot (State Trie 루트)
    TxHash      Hash       // transactionsRoot
    ReceiptHash Hash       // receiptsRoot
    Bloom       [256]byte  // 로그 블룸 필터
    Difficulty  *big.Int   // 0 (PoS 이후)
    Number      *big.Int   // 블록 번호
    GasLimit    uint64
    GasUsed     uint64
    Time        uint64     // 타임스탬프
    Extra       []byte     // 추가 데이터 (max 32 bytes)
    MixDigest   Hash       // prevRandao (PoS 이후)
    Nonce       [8]byte    // 0x0000000000000000 (PoS 이후)
    BaseFee     *big.Int   // EIP-1559
    // ... 추가 필드 (Shanghai, Cancun 등)
}

// 블록 해시 계산:
blockHash = keccak256(RLP(header))`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">서명 과정에서의 RLP</h3>
        <p>
          트랜잭션 서명은 RLP 인코딩과 밀접하게 연결됩니다.
          서명 전에 RLP 인코딩하고, 서명 후에 다시 RLP 인코딩합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`서명 프로세스:
┌─────────────────────────────────────────────────────────┐
│ 1. 트랜잭션 필드 구성                                     │
│    tx = {nonce, gasPrice, gas, to, value, data}         │
│                                                         │
│ 2. 서명용 RLP 인코딩 (EIP-155)                            │
│    rlp_for_sign = RLP([...tx_fields, chainId, 0, 0])    │
│                                                         │
│ 3. 해시 계산                                             │
│    hash = keccak256(rlp_for_sign)                       │
│                                                         │
│ 4. ECDSA 서명                                            │
│    (v, r, s) = sign(privateKey, hash)                   │
│                                                         │
│ 5. 최종 RLP 인코딩                                       │
│    rlp_final = RLP([...tx_fields, v, r, s])             │
│                                                         │
│ 6. 트랜잭션 해시                                          │
│    txHash = keccak256(rlp_final)                        │
└─────────────────────────────────────────────────────────┘`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">RLP의 한계</h3>
        <p>
          RLP는 단순성이라는 장점이 있지만, 여러 한계도 존재합니다.
          이러한 한계는 Ethereum의 발전에 따라 점점 더 부각되고 있습니다.
        </p>

        <div className="not-prose space-y-3 mb-6">
          <div className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">고정 크기 타입 미지원</p>
            <p className="text-xs text-muted-foreground mt-1">
              uint256, address(20 bytes) 같은 고정 크기 타입을 가변 길이로 인코딩합니다.
              불필요한 길이 접두사가 추가되어 공간 낭비가 발생합니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">스키마 없음</p>
            <p className="text-xs text-muted-foreground mt-1">
              인코딩된 데이터만으로는 구조를 알 수 없습니다. 디코더가 예상 구조를 미리 알아야 하며,
              이는 버전 관리와 하위 호환성을 어렵게 만듭니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">Merkle화 미지원</p>
            <p className="text-xs text-muted-foreground mt-1">
              RLP 자체에는 Merkle proof 생성 기능이 없습니다. SSZ는 직렬화와 Merkle화를
              통합하여 효율적인 증명 생성을 지원합니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">부분 디코딩 비효율</p>
            <p className="text-xs text-muted-foreground mt-1">
              특정 필드만 읽으려 해도 앞의 모든 필드를 순차적으로 파싱해야 합니다.
              고정 크기 필드가 있는 SSZ는 오프셋 기반 임의 접근이 가능합니다.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">SSZ로의 전환 필요성</h3>
        <p>
          Ethereum의 Consensus Layer는 이미 <strong>SSZ (Simple Serialize)</strong>를 사용하고 있습니다.
          Execution Layer도 SSZ로 전환하려는 노력이 진행 중이며, <strong>EIP-6404</strong>는
          트랜잭션을 SSZ로 인코딩하는 것을 제안합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`SSZ 장점:
  ✓ 고정 크기 타입 네이티브 지원 (uint64, bytes32 등)
  ✓ 스키마 기반 — 구조 변경 시 명시적 버전 관리
  ✓ 내장 Merkle화 — hash_tree_root()로 Merkle proof 생성
  ✓ O(1) 필드 접근 — 오프셋 기반 임의 접근
  ✓ 스트리밍 디코딩 가능

전환 로드맵:
  Phase 0 (완료): CL에서 SSZ 사용 (BeaconState, BeaconBlock)
  EIP-6404: EL 트랜잭션 SSZ 변환 제안
  EIP-6466: EL 영수증(receipt) SSZ 변환 제안
  장기 목표: EL 전체를 SSZ로 통합`}</code></pre>

        <CitationBlock source="geth rlp package source" citeKey={3} type="code" href="https://github.com/ethereum/go-ethereum/tree/master/rlp">
          <p className="italic text-foreground/80">
            &quot;Package rlp implements the RLP serialization format. The purpose of RLP is to encode
            arbitrarily nested arrays of binary data, and RLP is the main encoding method used to
            serialize objects in Ethereum.&quot;
          </p>
          <p className="mt-2 text-xs">
            geth의 rlp 패키지는 encode.go(인코딩), decode.go(디코딩), raw.go(원시 바이트 처리)로 구성됩니다.
            Go의 reflect 패키지를 활용하여 구조체 태그 기반 자동 직렬화를 지원하며,
            encbuf를 통한 버퍼 관리로 메모리 할당을 최소화합니다.
          </p>
        </CitationBlock>

        <CitationBlock source="EIP-6404: SSZ Transactions" citeKey={4} type="paper" href="https://eips.ethereum.org/EIPS/eip-6404">
          <p className="italic text-foreground/80">
            &quot;This EIP defines a migration process for existing RLP encoded transactions to SSZ.
            It aims to unify the serialization format across the consensus and execution layers.&quot;
          </p>
          <p className="mt-2 text-xs">
            EIP-6404는 Execution Layer의 트랜잭션을 RLP에서 SSZ로 전환하는 것을 제안합니다.
            기존 RLP 트랜잭션과의 하위 호환성을 유지하면서 SSZ의 장점(Merkle화, 고정 크기 필드)을
            활용할 수 있는 전환 메커니즘을 정의합니다.
          </p>
        </CitationBlock>

      </div>
    </section>
  );
}
