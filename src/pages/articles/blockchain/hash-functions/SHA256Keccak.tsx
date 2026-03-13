import { CitationBlock } from '../../../../components/ui/citation';

export default function SHA256Keccak() {
  return (
    <section id="sha256-keccak" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SHA-256 & Keccak-256</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">SHA-256: Bitcoin의 표준 해시</h3>
        <p>
          SHA-256은 <strong>SHA-2 계열</strong>에 속하는 해시 함수로, NSA(미국 국가안보국)가
          설계하고 NIST가 2001년에 FIPS 180-2로 표준화했습니다. Bitcoin의 블록 해시,
          트랜잭션 ID, 머클 트리 등 핵심 구조에서 사용되며, 256-bit(32-byte) 출력을 생성합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`SHA-256 내부 구조: Merkle-Damgård Construction

입력 메시지 → 패딩 → 512-bit 블록으로 분할

┌──────────────────────────────────┐
│  초기 해시값 (H₀~H₇)             │  8개의 32-bit 워드
│  = 처음 8개 소수의 제곱근의 소수부  │  (고정 상수)
└──────────┬───────────────────────┘
           ↓
┌──────────────────────────────────┐
│  64-Round Compression Function    │
│                                   │
│  for round in 0..64:              │
│    W[t] = message schedule        │
│    T₁ = h + Σ₁(e) + Ch(e,f,g)   │
│         + K[t] + W[t]            │
│    T₂ = Σ₀(a) + Maj(a,b,c)      │
│    (a,b,...,h) 레지스터 갱신       │
│                                   │
│  논리 함수:                       │
│    Ch(x,y,z)  = (x ∧ y) ⊕ (¬x ∧ z)   │
│    Maj(x,y,z) = (x ∧ y) ⊕ (x ∧ z) ⊕ (y ∧ z) │
│    Σ₀(x) = ROTR²(x) ⊕ ROTR¹³(x) ⊕ ROTR²²(x) │
│    Σ₁(x) = ROTR⁶(x) ⊕ ROTR¹¹(x) ⊕ ROTR²⁵(x) │
└──────────┬───────────────────────┘
           ↓
  256-bit 해시 출력 (H₀‖H₁‖...‖H₇)`}</code></pre>

        <CitationBlock source="NIST FIPS 180-4: Secure Hash Standard (SHS)" citeKey={1} type="paper" href="https://csrc.nist.gov/publications/detail/fips/180/4/final">
          <p className="italic text-foreground/80">
            "This Standard specifies secure hash algorithms — SHA-1, SHA-224, SHA-256,
            SHA-384, SHA-512, SHA-512/224 and SHA-512/256 — for computing a condensed
            representation of electronic data (message)."
          </p>
          <p className="mt-2 text-xs">
            FIPS 180-4는 SHA-2 계열 해시 함수의 공식 명세로, Bitcoin을 비롯한 대부분의
            블록체인 프로토콜이 이 표준을 기반으로 합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Keccak-256: Ethereum의 표준 해시</h3>
        <p>
          Keccak-256은 <strong>SHA-3 계열</strong>의 해시 함수로, Guido Bertoni, Joan Daemen,
          Michael Peeters, Gilles Van Assche가 설계했습니다. 2012년 NIST SHA-3 경쟁에서
          최종 선정되었으며, SHA-2와는 완전히 다른 내부 구조인{' '}
          <strong>Sponge Construction</strong>을 사용합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Keccak Sponge Construction:

상태: 1600-bit (5×5×64 3차원 배열)
  = rate (r) + capacity (c)
  Keccak-256: r = 1088, c = 512

┌─────────────────────────────────────┐
│  Absorb Phase (흡수 단계)             │
│                                      │
│  입력을 r-bit 블록으로 분할            │
│  for each block P:                   │
│    state[0..r] ^= P                  │
│    state = f(state)  // 24-round     │
│                                      │
│  f = Keccak-f[1600] 순열 함수:        │
│    θ (theta) — 열 패리티 믹싱          │
│    ρ (rho)   — 비트 회전              │
│    π (pi)    — 레인 재배치             │
│    χ (chi)   — 비선형 변환             │
│    ι (iota)  — 라운드 상수 XOR         │
└──────────┬──────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Squeeze Phase (압축 단계)            │
│                                      │
│  output = state[0..r]의 처음 256-bit  │
│  (필요시 추가 순열 적용 후 더 추출)     │
└─────────────────────────────────────┘`}</code></pre>

        <p>
          Ethereum이 Keccak-256을 선택한 이유는 주목할 만합니다. Ethereum 설계 당시(2013-2014)
          Keccak은 이미 SHA-3 경쟁의 최종 후보로 선정되었으나, NIST가 공식 SHA-3 표준(FIPS 202)을
          발표한 것은 2015년이었습니다. NIST 표준화 과정에서 Keccak의 일부 파라미터가 변경되었기
          때문에, Ethereum의 keccak256은 NIST SHA-3-256과는 미세하게 다릅니다.
        </p>

        <CitationBlock source="Bertoni, Daemen, Peeters, Van Assche — The Keccak Sponge Function Family" citeKey={2} type="paper" href="https://keccak.team/files/Keccak-reference-3.0.pdf">
          <p className="italic text-foreground/80">
            "Sponge functions provide a natural way to generalize hash functions
            to functions with arbitrary-length output or to other functionalities
            such as a MAC or a stream cipher."
          </p>
          <p className="mt-2 text-xs">
            Keccak 팀의 공식 레퍼런스 문서로, Sponge Construction의 설계 철학과 보안 증명을
            상세히 기술합니다. SHA-2의 Merkle-Damgard 구조와 근본적으로 다른 접근 방식입니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin의 이중 해시: SHA-256(SHA-256(x))</h3>
        <p>
          Bitcoin은 대부분의 해싱에서 SHA-256을 두 번 적용하는 이중 해시를 사용합니다.
          이는 <strong>length extension attack</strong>을 방지하기 위한 설계입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Length Extension Attack 방지:

Merkle-Damgård 구조의 취약점:
  H(m)을 알면, m의 내용을 모르더라도
  H(m || padding || m') 을 계산할 수 있음

  공격 시나리오:
    H(secret || data) = known_hash
    → H(secret || data || padding || evil_data) 계산 가능

Bitcoin의 해결:
  hash256(x) = SHA-256(SHA-256(x))

  내부 해시의 출력이 외부 해시의 입력이 되므로
  내부 상태가 노출되지 않아 extension 불가

사용처:
  - 블록 해시: hash256(block_header)
  - 트랜잭션 ID: hash256(raw_transaction)
  - 머클 트리: hash256(left_hash || right_hash)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum의 keccak256 활용</h3>
        <p>
          Ethereum은 프로토콜 전반에 걸쳐 keccak256을 사용합니다.
          주소 생성, 상태 트라이 키, 스마트 컨트랙트 ABI 등 핵심 영역에서의 활용을 살펴봅니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`1. 주소 생성 (Address Derivation):
   public_key = ECDSA_secp256k1(private_key)  // 64 bytes
   hash = keccak256(public_key)                // 32 bytes
   address = hash[12..32]                       // 마지막 20 bytes
   → "0x" + hex(address)

2. 상태 트라이 키 (State Trie Key):
   // 계정 상태는 keccak256(address)를 키로 사용
   trie_key = keccak256(account_address)

   // 스토리지 슬롯도 keccak256으로 매핑
   storage_key = keccak256(slot_number)

   // 매핑 타입의 키:
   // mapping(address => uint) balances;
   // balances[addr]의 슬롯 = keccak256(addr . slot_of_balances)

3. ABI 함수 선택자 (Function Selector):
   // Solidity 함수 시그니처의 첫 4바이트
   selector = keccak256("transfer(address,uint256)")[0..4]
   // = 0xa9059cbb

   // 이벤트 토픽:
   topic0 = keccak256("Transfer(address,address,uint256)")
   // = 0xddf252ad...`}</code></pre>
      </div>
    </section>
  );
}
