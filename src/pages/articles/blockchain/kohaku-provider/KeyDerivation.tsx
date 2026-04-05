import type { CodeRef } from '@/components/code/types';
import KeyDerivationViz from './viz/KeyDerivationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KeyDerivation({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BIP-44 키 파생 & 로컬 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          니모닉(12/24단어) → PBKDF2(2048라운드) → 64바이트 시드.
          <br />
          키 스트레칭으로 브루트포스 공격을 억제한다.
        </p>
        <p className="leading-7">
          시드를 HMAC-SHA512에 넣으면 <strong>마스터 키</strong>와 <strong>체인 코드</strong>가 나온다.
          <br />
          BIP-44 경로 <code>m/44'/60'/0'/0/0</code>으로 이더리움 자식 키를 파생한다.
        </p>
        <p className="leading-7">
          모든 키 파생과 서명이 로컬에서 수행된다.
          <br />
          비밀키가 RPC 서버에 전송되지 않는다. 프라이버시의 기본 전제다.
        </p>
      </div>
      <div className="not-prose"><KeyDerivationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BIP-44 Derivation Path</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// BIP-44 표준 경로
// m / purpose' / coin_type' / account' / change / address_index

// m / 44' / 60' / 0' / 0 / 0
//     |     |    |    |   |
//     |     |    |    |   +-- address index (0, 1, 2, ...)
//     |     |    |    +------ change (0=external, 1=internal/change)
//     |     |    +----------- account (보통 0)
//     |     +---------------- coin_type (60 = Ethereum, SLIP-0044)
//     +---------------------- purpose (44 = BIP-44)
//
// ' = hardened derivation

// Coin types
// 0'   = Bitcoin
// 60'  = Ethereum
// 714' = BNB Chain
// 501' = Solana

// Derivation 과정
// 1) Mnemonic → Seed (BIP-39)
seed = PBKDF2(
    password: mnemonic,
    salt: "mnemonic" + passphrase,
    iterations: 2048,
    output_length: 64
)

// 2) Seed → Master key (BIP-32)
(master_priv, master_chain) = HMAC-SHA512(
    key: "Bitcoin seed",
    data: seed
)

// 3) Path 따라 child key 파생
// - Hardened: ki = HMAC(chain, 0x00||priv||index+0x80000000)
// - Normal: ki = HMAC(chain, pubkey||index)

// 4) Final derivation
// m/44'/60'/0'/0/0 → Ethereum address 0

// 장점
// - Deterministic (같은 mnemonic → 같은 key)
// - Hierarchical (account 구조 자연스러움)
// - Multi-chain 호환 (coin_type으로 분기)
// - 표준화됨 (모든 wallet 호환)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local Signing의 중요성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Local signing 원칙
// 비밀키는 절대 서버로 전송하지 않음

// 흐름
// 1) User가 UI에서 TX 준비
// 2) Client가 TX 구성 (unsigned)
// 3) Private key로 local에서 서명
// 4) Signed TX만 RPC로 전송

// 보안 모델
// - Server: signed raw TX만 받음
// - Server: private key 몰라도 broadcast 가능
// - User: key loss = self responsibility

// Trust boundary
// ┌─────────────────────┐
// │  Client (trusted)   │
// │  - Private key      │
// │  - Signing logic    │
// │  - Nonce mgmt       │
// └──────────┬──────────┘
//            │
//     signed_tx only
//            │
// ┌──────────▼──────────┐
// │  Server (untrusted) │
// │  - Broadcast        │
// │  - Mempool relay    │
// │  - Query responses  │
// └─────────────────────┘

// Key storage options
// 1) Browser localStorage (취약)
// 2) Encrypted localStorage (password)
// 3) Hardware wallet (Ledger, Trezor)
// 4) MPC custody (threshold signing)
// 5) Smart account + social recovery

// Best practice
// ✓ Hardware wallet for high-value
// ✓ Encrypted storage + strong password
// ✓ Seed backup (offline)
// ✗ 절대 seed를 온라인 전송하지 말 것`}</pre>

      </div>
    </section>
  );
}
