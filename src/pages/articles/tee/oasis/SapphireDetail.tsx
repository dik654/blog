import SapphireDetailViz from './viz/SapphireDetailViz';
import PrecompileViz from './viz/PrecompileViz';

export default function SapphireDetail() {
  return (
    <section id="sapphire-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sapphire EVM 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>암호화 파이프라인</strong>: X25519 키 교환 → DeoxysII AEAD →
          SGX EVM 실행 → AES-256-GCM 상태 암호화<br />
          입력(calldata)부터 출력(returnData)까지 전 과정 암호화<br />
          노드 운영자, 관리자, 다른 vCPU 전부 평문 접근 불가<br />
          <strong>Precompile</strong>로 SGX 전용 암호 연산 노출
        </p>
      </div>

      <SapphireDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Storage Slot 암호화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime-sdk/modules/evm/src/storage.rs

// 각 storage slot 값을 슬롯별 독립 키로 암호화

fn encrypt_storage_slot(
    contract: Address,
    slot: U256,
    value: U256,
) -> Vec<u8> {
    // 1) 슬롯 키 파생 (HKDF)
    let slot_key = hkdf_expand(
        &runtime_master_key,
        &[&contract.as_bytes(), &slot.to_be_bytes()].concat(),
        32,
    );

    // 2) Nonce: 결정적 (컨트랙트+슬롯+라운드)
    let nonce = hash(&[contract, slot.into(), round.into()]).truncate(12);

    // 3) AES-256-GCM 암호화
    let ciphertext = aes_256_gcm_encrypt(&slot_key, &nonce, &value.to_be_bytes());

    ciphertext.to_vec()
}

fn decrypt_storage_slot(contract: Address, slot: U256, ciphertext: &[u8]) -> U256 {
    let slot_key = hkdf_expand(&runtime_master_key, ...);
    let nonce = hash(...).truncate(12);
    let plaintext = aes_256_gcm_decrypt(&slot_key, &nonce, ciphertext);
    U256::from_be_bytes(plaintext)
}

// 특성
// - 슬롯마다 독립 키 → rainbow table 공격 무력
// - GCM tag로 무결성 보장
// - 빈 슬롯은 저장 안 함 (공간 절약)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sapphire Precompiles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Address</th>
                <th className="border border-border px-3 py-2 text-left">Precompile</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...01</td>
                <td className="border border-border px-3 py-2"><code>randomBytes</code></td>
                <td className="border border-border px-3 py-2">CSPRNG 난수 (TEE 내부)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...02</td>
                <td className="border border-border px-3 py-2"><code>x25519Derive</code></td>
                <td className="border border-border px-3 py-2">ECDH 키 파생</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...03</td>
                <td className="border border-border px-3 py-2"><code>deoxysII_encrypt</code></td>
                <td className="border border-border px-3 py-2">AEAD 암호화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...04</td>
                <td className="border border-border px-3 py-2"><code>deoxysII_decrypt</code></td>
                <td className="border border-border px-3 py-2">AEAD 복호화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...05</td>
                <td className="border border-border px-3 py-2"><code>keypairGenerate</code></td>
                <td className="border border-border px-3 py-2">X25519/Ed25519 키쌍</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...06</td>
                <td className="border border-border px-3 py-2"><code>sign</code></td>
                <td className="border border-border px-3 py-2">ECDSA/EdDSA 서명</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...07</td>
                <td className="border border-border px-3 py-2"><code>verify</code></td>
                <td className="border border-border px-3 py-2">서명 검증</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...09</td>
                <td className="border border-border px-3 py-2"><code>subcall</code></td>
                <td className="border border-border px-3 py-2">Runtime call from EVM (ROFL)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ROFL — Runtime OFfchain Logic</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ROFL: 컨트랙트가 외부 서비스 호출 (TEE에서 보호된 off-chain)

// Solidity에서
contract OracleCaller {
    function fetchPrice(string calldata symbol) external {
        bytes memory query = abi.encode("price", symbol);
        bytes memory result = Sapphire.rofl().call(
            rofl_app_id,
            query
        );
        uint256 price = abi.decode(result, (uint256));
    }
}

// ROFL app 개발 (Rust SDK)
#[rofl_app]
async fn handle_price_query(symbol: String) -> u256 {
    // HTTP API 호출 (TEE 안에서)
    let resp = reqwest::get(&format!(
        "https://api.coingecko.com/v3/simple/price?ids={}", symbol
    )).await?;

    let price: f64 = resp.json().await?;
    (price * 1e8) as u256
}

// TEE 내 HTTP — Host는 요청/응답 관측 불가
// Oracle price가 TEE 안에서 직접 검증 → front-run 방어`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">암호화 프리컴파일</h3>
      </div>
      <PrecompileViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">view function 호출 — Sign+Read 모델</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Ethereum: eth_call은 서명 불필요 (익명)
// Sapphire: 기밀 view 호출은 서명 필요 (호출자 식별)

// 클라이언트 측
const provider = sapphire.wrap(baseProvider);
const signer = sapphire.wrap(baseSigner);

// 일반 view (public, 서명 불필요)
const publicInfo = await contract.getPublicInfo();

// 기밀 view (서명 필요 → msg.sender 인증)
const myBid = await contract.connect(signer).getMyBid();
// ← 내부적으로 SignedQueryEnvelope 생성
//    envelope에 signer 서명 포함

// Runtime 측
//   1) SignedQueryEnvelope 검증
//   2) msg.sender = signer's address 설정
//   3) view function 실행
//   4) 결과를 shared secret으로 암호화 반환

// 이점
// - 컨트랙트가 msg.sender 기반 권한 검증 가능
// - "내 데이터만 보기" 패턴 구현
// - Auth: 서명 = Authentication`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire의 실전 사용 사례</p>
          <p>
            <strong>활발한 카테고리</strong>:<br />
            - <strong>Confidential DeFi</strong>: MEV 보호, front-running 방어<br />
            - <strong>Private NFT</strong>: 소유자만 메타데이터 열람<br />
            - <strong>Sealed-bid Auctions</strong>: 입찰 종료 후만 공개<br />
            - <strong>Identity</strong>: 영지식 증명 대안 (TEE 기반)
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ SGX Quote 검증 실패 시 노드 오프라인<br />
            ✗ Public data와 혼용 시 leak 가능성 (storage 분리 필요)<br />
            ✗ TEE 취약점 발견 시 전체 노드 업그레이드 필요
          </p>
          <p className="mt-2">
            <strong>생태계 규모</strong>:<br />
            - TVL 수천만 ~ 억 달러 수준<br />
            - Ethereum 대비 훨씬 작지만 독자 포지션<br />
            - 기밀성 필수 유스케이스의 사실상 표준
          </p>
        </div>

      </div>
    </section>
  );
}
