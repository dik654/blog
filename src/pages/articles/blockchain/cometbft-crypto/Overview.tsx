import { codeRefs } from './codeRefs';
import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호 프리미티브 전체 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT는 Ed25519 서명, Merkle 증명, TMHASH 세 가지 암호 프리미티브로 동작한다.<br />
          각 함수의 코드를 step-by-step으로 추적한다.
        </p>

        {/* ── crypto 패키지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">crypto 패키지 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/crypto/ 패키지
crypto/
├── crypto.go          // PubKey, PrivKey interface
├── ed25519/           // Ed25519 구현
│   ├── ed25519.go     //   PubKey/PrivKey 구조체
│   └── ed25519_test.go
├── secp256k1/         // secp256k1 구현 (선택적)
├── sr25519/           // sr25519 구현 (선택적)
├── merkle/            // Merkle tree
│   ├── tree.go        //   HashFromByteSlices
│   ├── proof.go       //   Proof 생성/검증
│   └── simple_map.go  //   key-value merkle
├── tmhash/            // SHA256[:20] wrapper
│   └── hash.go
└── bn254/             // BN254 (선택적, ZK용)

// 사용처:
// - Ed25519: validator 서명, peer 인증
// - Merkle: Block.Header, Block.Data, Evidence
// - TMHASH: address 생성, block hash

// interface 기반 추상화:
type PubKey interface {
    Address() Address
    Bytes() []byte
    VerifySignature(msg []byte, sig []byte) bool
    Equals(PubKey) bool
    Type() string
}

type PrivKey interface {
    Bytes() []byte
    Sign(msg []byte) ([]byte, error)
    PubKey() PubKey
    Equals(PrivKey) bool
    Type() string
}

// → Ed25519/secp256k1/sr25519 등 다양한 scheme 지원
// validator마다 다른 키 타입 사용 가능 (Cosmos Hub는 Ed25519 기본)`}
        </pre>
        <p className="leading-7">
          CometBFT crypto는 <strong>3가지 주요 프리미티브</strong> + 추상화된 interface.<br />
          Ed25519(default), Merkle tree, TMHASH로 합의 구성.<br />
          PubKey/PrivKey interface로 다양한 scheme 지원.
        </p>
      </div>
    </section>
  );
}
