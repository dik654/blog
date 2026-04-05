import { codeRefs } from './codeRefs';
import TMHASHViz from './viz/TMHASHViz';
import type { CodeRef } from '@/components/code/types';

export default function Hash({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TMHASH & 해시 체인</h2>
      <div className="not-prose mb-8">
        <TMHASHViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── TMHASH ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">TMHASH — SHA256 truncated to 20 bytes</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/crypto/tmhash/hash.go
const (
    Size         = 32   // SHA256 full hash
    TruncatedSize = 20  // truncated hash (for address)
)

// 전체 SHA256:
func Sum(bz []byte) []byte {
    h := sha256.Sum256(bz)
    return h[:]
}

// Truncated SHA256 (주소용):
func SumTruncated(bz []byte) []byte {
    h := sha256.Sum256(bz)
    return h[:TruncatedSize]  // first 20 bytes
}

// 사용처:
// 1. Validator Address:
//    address = tmhash.SumTruncated(pubkey)
//    → 20 bytes (ETH 주소와 동일 크기)
//
// 2. Block Hash:
//    blockHash = sha256(header_fields...)
//    → 32 bytes full
//
// 3. Tx Hash:
//    txHash = sha256(tx_bytes)
//    → 32 bytes full
//
// 4. Peer ID (historical):
//    peer_id = first 20 bytes of pubkey hash

// 왜 SHA256 (keccak256 아님)?
// - Bitcoin 계보 (Tendermint 초기 설계)
// - Go 표준 라이브러리 지원
// - hardware acceleration (SHA extensions)
// - ABCI 앱과 공유 (Cosmos SDK)

// keccak256 vs SHA256:
// Keccak: Ethereum 표준, ASIC 덜 최적화
// SHA256: Bitcoin 표준, HW 가속 활발`}
        </pre>
        <p className="leading-7">
          TMHASH는 <strong>SHA256의 CometBFT 래퍼</strong>.<br />
          Full 32 bytes (block hash) + Truncated 20 bytes (address).<br />
          Bitcoin 계보 + Cosmos SDK와 공유.
        </p>

        {/* ── 해시 체인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Hash Chain — 불변성의 토대</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT 블록 연결:
//
// Block N          Block N+1         Block N+2
// Header {          Header {          Header {
//   ...               ...               ...
//   LastBlockID ───▶ LastBlockID ───▶ ...
//                    = hash(Block N)
// }                 }                 }
//
// LastBlockID 필드가 이전 블록 hash 포함
// → 체인 형성 (불변성 보장)

// Header 필드 중 LastBlockID:
type Header struct {
    ...
    LastBlockID BlockID  // hash(previous block header) + PartsHeader
    ...
}

type BlockID struct {
    Hash        []byte
    PartSetHeader PartSetHeader
}

// Hash propagation:
// Block N의 Header.Hash()를 계산
// → Block N+1.Header.LastBlockID.Hash에 저장
// → Block N+1.Header.Hash()는 이 LastBlockID 포함
// → 재귀적 체인 형성

// 변경 불가성:
// Block 1개 수정 → 그 hash 변경 → 이후 모든 블록의 LastBlockID 변경
// → 모든 블록 재서명 필요 → 2/3+ validator 담합 필수
// → 경제적 비용 (slashing) → 실질 불가

// 이더리움과 차이:
// - Ethereum: parent_hash 필드 (동일 역할)
// - CometBFT: LastBlockID (Hash + PartSetHeader)
//   * PartSetHeader: 블록 분할 전파용
//   * 블록 크기 MB 단위 → 청크 단위 gossip`}
        </pre>
        <p className="leading-7">
          <strong>Block Hash Chain</strong>이 불변성의 토대.<br />
          LastBlockID가 이전 블록 hash 포함 → 재귀적 연결.<br />
          역사적 블록 수정 = 2/3+ 담합 + slashing → 경제적 불가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 SHA256 전체가 아닌 20바이트</strong> — Tendermint 초기 설계에서 BTC의 RIPEMD160(SHA256(x)) 패턴을 참고.<br />
          ETH 주소 길이(20B)와 호환, 네트워크 대역폭 37% 절약. 충돌 저항성 2^80으로 충분.
        </p>
      </div>
    </section>
  );
}
