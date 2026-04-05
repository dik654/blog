import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import Keccak256Viz from './viz/Keccak256Viz';

export default function Keccak256Address({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Keccak256과 Address 생성</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 주소는 공개키에서 파생된다.<br />
          secp256k1 공개키(64바이트)를 Keccak256으로 해시하면 32바이트가 나오고, 그 하위 20바이트가 Address가 된다.
        </p>
        <p className="leading-7">
          컨트랙트 배포 시 주소 생성 방법은 두 가지다.<br />
          <strong>CREATE</strong>는 sender 주소와 nonce를 RLP 인코딩한 후 Keccak256 해시의 하위 20바이트를 사용한다.<br />
          nonce가 변할 때마다 주소도 변하므로 배포 전 주소를 예측하기 어렵다.
        </p>
        <p className="leading-7">
          <strong>CREATE2</strong>는 <code>0xff + sender + salt + init_code_hash</code>를 해시한다.<br />
          salt와 배포 코드만 알면 주소를 미리 계산할 수 있다.<br />
          이를 counterfactual deployment라 부르며, 상태 채널이나 지갑 팩토리에서 활용된다.
        </p>

        {/* ── Keccak256 vs SHA-3 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Keccak256 vs SHA3-256 — 이더리움의 특수성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 이더리움은 "표준" SHA3-256이 아니라 "원본" Keccak-256 사용
// 이유: 이더리움이 2015년 런칭했을 때, SHA-3 표준화 직전
// → NIST가 패딩 규칙을 바꾸기 직전의 Keccak을 채택

// 두 해시의 차이:
// SHA3-256:  SHA-3 Keccak[r=1088, c=512] + 패딩 0x06
// Keccak256: SHA-3 Keccak[r=1088, c=512] + 패딩 0x01

// 결과: 같은 입력에 완전히 다른 해시
keccak256("")  = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
sha3_256("")   = 0xa7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a

// Reth가 사용하는 tiny_keccak 크레이트:
// - pure Rust 구현, no_std 지원
// - ~2 cycles per byte (AVX2 시 더 빠름)
// - 하드웨어 가속 불가능 (SHA-2는 HW accel, Keccak은 소프트웨어 only)

// 이더리움에서 keccak256 호출 빈도:
// - EVM opcode SHA3: 매 실행마다
// - Address 생성: 계정 생성/CREATE/CREATE2
// - Merkle trie: 모든 trie 노드 해시
// - TX 해시: 모든 TX
// - 블록 실행 1회 = 수천~수만 keccak256 호출`}
        </pre>
        <p className="leading-7">
          이더리움이 Keccak256을 계속 쓰는 이유: <strong>하위 호환성</strong>.<br />
          2015년 런칭 이후 모든 블록이 Keccak256 기반이므로 변경 불가능.<br />
          Bitcoin의 SHA-256과 대조적 — Bitcoin은 HW 가속 가능, 이더리움은 소프트웨어 only.
        </p>

        {/* ── Address 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">공개키 → Address 파생</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// secp256k1 공개키 구조:
// [0x04, x_coord(32B), y_coord(32B)]  = 65바이트 uncompressed
// 또는 [0x02 or 0x03, x_coord(32B)]   = 33바이트 compressed

// Address 유도 (5단계):
fn public_key_to_address(pk: &PublicKey) -> Address {
    // 1. 공개키를 uncompressed 직렬화
    let uncompressed: [u8; 65] = pk.serialize_uncompressed();

    // 2. 첫 바이트(0x04 prefix) 제거 → 64바이트
    let pk_bytes: &[u8] = &uncompressed[1..];

    // 3. Keccak256 해시 → 32바이트
    let hash: B256 = keccak256(pk_bytes);

    // 4. 하위 20바이트 추출 (빅엔디안 기준 뒤쪽)
    let addr_bytes: [u8; 20] = hash.0[12..32].try_into().unwrap();

    // 5. Address 타입으로 래핑
    Address::from(addr_bytes)
}

// 왜 하위 20바이트인가?
// - SHA-3의 앞 12바이트 = "0으로 채워진 것과 같은" 고엔트로피 prefix
// - 주소 충돌 확률: 2^160 = ~10^48 → 실제로 0
// - 20바이트는 시각적 가독성과 보안의 타협점

// 공격: address collision
// - 2^80 번 시도하면 동일 주소 2개 발견 (birthday paradox)
// - 현재 하드웨어로 비현실적 (cost > 2^40 dollars)`}
        </pre>
        <p className="leading-7">
          <code>pk.serialize_uncompressed()[1..]</code> — 첫 0x04 prefix를 제거하는 것이 핵심.<br />
          이 prefix는 "uncompressed 형식"을 나타내는 메타데이터일 뿐, 실제 공개키 데이터는 64바이트 (x, y 좌표).<br />
          keccak256 결과의 <strong>하위 20바이트</strong>만 사용 — 충돌 저항성(2^80 시도)과 가독성의 타협.
        </p>

        {/* ── CREATE 주소 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE — sender + nonce RLP 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 컨트랙트 CREATE opcode 실행 시 주소 유도
pub fn create_address(sender: &Address, nonce: u64) -> Address {
    // 1. RLP([sender, nonce]) 인코딩
    let mut buf = Vec::new();
    let payload_len = sender.length() + nonce.length();
    Header { list: true, payload_length: payload_len }.encode(&mut buf);
    sender.encode(&mut buf);
    nonce.encode(&mut buf);

    // 2. Keccak256 해시
    let hash: B256 = keccak256(&buf);

    // 3. 하위 20바이트 추출
    Address::from_slice(&hash.0[12..32])
}

// 예시:
// EOA(0xAbC...)가 nonce=5에서 컨트랙트 배포
// RLP: [0xAbC..., 5]  ≈ [0xd4, 0x94, 0xAbC..., 0x05]
// keccak256(RLP) = 0x...(32B)
// contract_address = 하위 20B

// 특성:
// 1. 예측 가능 (sender + nonce만 알면)
// 2. 같은 sender가 여러 컨트랙트 배포 시 주소 순차 변화
// 3. 계정 nonce가 바뀌면 미래 컨트랙트 주소도 다름
// 4. EOA nonce는 트랜잭션 당 +1 → deterministic`}
        </pre>
        <p className="leading-7">
          CREATE의 주소는 <strong>sender의 미래 nonce</strong>에 묶여 있음.<br />
          같은 지갑에서 1,2,3번째 컨트랙트는 서로 다른 예측 가능한 주소.<br />
          하지만 지갑이 다른 TX를 먼저 보내면 nonce가 변해 주소도 변함 → 재배포 시 주소가 고정되지 않음.
        </p>

        {/* ── CREATE2 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE2 — counterfactual deployment</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-1014 (Constantinople fork, 2019-02)
pub fn create2_address(
    sender: &Address,
    salt: &B256,           // 사용자 제공 32바이트
    init_code_hash: &B256, // 배포 바이트코드의 keccak256
) -> Address {
    let mut bytes = [0u8; 85];  // 1 + 20 + 32 + 32
    bytes[0] = 0xff;                          // magic prefix
    bytes[1..21].copy_from_slice(sender.as_slice());
    bytes[21..53].copy_from_slice(salt.as_ref());
    bytes[53..85].copy_from_slice(init_code_hash.as_ref());

    let hash = keccak256(bytes);
    Address::from_slice(&hash.0[12..32])
}

// 주소 결정 요소:
// - sender: 배포자 (팩토리 컨트랙트 주소)
// - salt: 사용자 선택 (충돌 방지 + 주소 커스터마이즈)
// - init_code_hash: 배포될 바이트코드의 해시

// 사용 사례:
// 1. Smart Contract Wallets (Safe, Argent)
//    - 지갑 주소를 배포 전에 계산
//    - 주소로 자금 입금 → 나중에 지갑 배포
// 2. Uniswap V2/V3
//    - pair 컨트랙트 주소 공식 계산 가능
//    - 온체인 조회 없이 pair 주소 유도
// 3. Rollup sequencer
//    - L1 컨트랙트 주소를 L2에서 미리 계산
//    - cross-chain messaging의 기반

// vanity address:
// - salt를 변경하면서 brute-force → 예쁜 prefix 주소 찾기
// - 0x0000dead1234... 같은 주소 생성 가능`}
        </pre>
        <p className="leading-7">
          CREATE2의 혁신: <strong>주소를 예측 가능하게 만듦</strong>.<br />
          지갑 주소로 자금을 먼저 보내고, 필요할 때 지갑을 배포하는 "counterfactual" 패턴 가능.<br />
          Uniswap V2의 pair 주소 계산, Safe Wallet의 주소 유도가 모두 CREATE2 기반.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 해시 함수의 양면성</p>
          <p className="mt-2">
            Keccak256 하나의 함수가 이더리움 곳곳에서 사용:<br />
            - Address 유도 (pubkey → 20바이트)<br />
            - CREATE / CREATE2 주소<br />
            - TX 해시, 블록 해시<br />
            - Merkle trie 노드 해시<br />
            - EVM 스토리지 키 매핑<br />
            - EIP-712 구조화 서명
          </p>
          <p className="mt-2">
            해시 함수 하나에 모든 신뢰가 걸림:<br />
            - 만약 Keccak256에 취약점 발견 → 체인 전체 위험<br />
            - 그래서 "암호학적 해시의 충돌 저항성"이 블록체인 안전의 토대<br />
            - Keccak은 SHA-3 표준의 기반 → 수많은 암호학자가 분석 → 현재까지 안전
          </p>
          <p className="mt-2">
            Reth의 <code>keccak256()</code> 함수는 초당 수백만 번 호출 — tiny_keccak 크레이트의 최적화가 전체 성능에 직접 기여.
          </p>
        </div>
      </div>

      <div className="not-prose">
        <Keccak256Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
