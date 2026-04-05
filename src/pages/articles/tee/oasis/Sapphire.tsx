import SapphireFlowViz from './viz/SapphireFlowViz';
import SapphireCodeViz from './viz/SapphireCodeViz';

export default function Sapphire({ title }: { title?: string }) {
  return (
    <section id="sapphire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sapphire: 기밀 EVM'}</h2>
      <div className="not-prose mb-8"><SapphireFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sapphire 개요</h3>
        <p>
          <strong>Sapphire</strong>: EVM 호환 기밀 ParaTime — 2023년 메인넷 런칭<br />
          <strong>SGX 기반</strong>: 컴퓨트 노드가 엔클레이브 안에서 Geth 포크 실행<br />
          <strong>Ethereum 호환</strong>: Metamask, Hardhat, Foundry 그대로 사용<br />
          <strong>추가 API</strong>: 기밀 스토리지, ROFL(off-chain), 기밀 난수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기밀성 특성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: '상태 암호화', desc: '컨트랙트 스토리지가 SGX 내에서만 복호화. 외부는 암호문만 관측.' },
            { name: '트랜잭션 기밀성', desc: 'calldata를 클라이언트가 KM 공개키로 암호화. SGX 내에서만 복호화.' },
            { name: '기밀 난수', desc: 'SGX 내 CSPRNG으로 생성. 외부 예측 불가. (Chainlink VRF 불필요)' },
            { name: 'msg.sender 보호', desc: '기밀 컨텍스트에서 발신자 주소 숨김 옵션.' },
          ].map(f => (
            <div key={f.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-semibold text-sm text-emerald-400">{f.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{f.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Calldata 암호화 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 클라이언트 측 (Oasis SDK / ethers.js + wrapper)

// 1) Key Manager 공개키 획득
const kmPublicKey = await sapphire.getKeyManagerPublicKey();

// 2) Ephemeral key pair 생성 (X25519)
const clientKeyPair = nacl.box.keyPair();

// 3) ECDH로 shared secret 도출
const sharedSecret = nacl.box.before(kmPublicKey, clientKeyPair.secretKey);

// 4) Calldata 암호화 (Deoxys-II AEAD)
const nonce = randomBytes(15);
const encryptedCalldata = deoxysII.encrypt(
    sharedSecret, nonce, originalCalldata, /* associatedData */ []
);

// 5) 암호화 envelope 생성
const envelope = cbor.encode({
    version: 1,
    data: encryptedCalldata,
    nonce: nonce,
    pk: clientKeyPair.publicKey,
});

// 6) 일반 tx처럼 전송
tx.data = envelope;
await signer.sendTransaction(tx);`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Runtime 측 복호화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime-sdk/modules/evm/src/raw_tx.rs (Rust)

impl EvmModule {
    pub fn process_tx(ctx: &mut Context, tx: Transaction) -> Result<()> {
        // 1) calldata envelope 파싱
        let envelope: Envelope = cbor::from_slice(&tx.data)?;

        // 2) Ephemeral X25519 키로 shared secret 재구성
        let km_secret = ctx.key_manager().get_private_key()?;
        let shared = x25519_diffie_hellman(km_secret, envelope.pk);

        // 3) Deoxys-II 복호화
        let plaintext = deoxys_ii_decrypt(
            &shared, &envelope.nonce, &envelope.data
        )?;

        // 4) 평문 calldata로 EVM 실행
        let result = evm_execute(tx.to, plaintext, ctx)?;

        // 5) 반환값도 암호화 (같은 키로)
        let encrypted_result = deoxys_ii_encrypt(
            &shared, &new_nonce(), &result
        );

        Ok(encrypted_result)
    }
}

// 엔클레이브 외부에서는
// - tx.data = 암호문 (envelope)
// - receipt.returnData = 암호문
// - storage_slot value = 암호문 (슬롯 암호화 키로)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Solidity 측 API</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// @oasisprotocol/sapphire-contracts/contracts/

import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract ConfidentialAuction {
    mapping(address => uint256) private bids;    // 자동 암호화
    address private highestBidder;
    uint256 private highestBid;

    function bid() external payable {
        // msg.value, msg.sender는 SGX 내부에서만 평문
        bids[msg.sender] = msg.value;

        if (msg.value > highestBid) {
            highestBid = msg.value;
            highestBidder = msg.sender;
        }
    }

    function getMyBid() external view returns (uint256) {
        // 호출자만 자신의 값 조회
        return bids[msg.sender];
    }

    function getWinner() external view onlyOwner returns (address) {
        // 경매 종료 후 owner만 승자 확인
        return highestBidder;
    }

    // 기밀 난수 (CSPRNG from SGX)
    function randomPrize() external returns (uint256) {
        bytes memory seed = Sapphire.randomBytes(32, "");
        return uint256(bytes32(seed)) % 100;
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">기밀 컨트랙트 · 키 파생 · Ethereum 호환</h3>
      </div>
      <SapphireCodeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire vs ZK-based privacy</p>
          <p>
            <strong>Sapphire(TEE)</strong>:<br />
            ✓ EVM 바이트코드 그대로 실행 — 기존 Solidity 호환<br />
            ✓ 성능 네이티브 — ZK 증명 생성 오버헤드 없음<br />
            ✓ 임의 복잡도 로직 가능<br />
            ✗ TEE 신뢰 필요 (Intel vendor)<br />
            ✗ Side-channel 공격 가능성
          </p>
          <p className="mt-2">
            <strong>Aztec/Aleo(ZK)</strong>:<br />
            ✓ 수학적 보장 — 하드웨어 신뢰 불필요<br />
            ✓ 영구적 (post-quantum)<br />
            ✗ 새 언어·DSL 필요 (Noir, Leo)<br />
            ✗ 증명 생성 수초~수분
          </p>
          <p className="mt-2">
            <strong>실무 선택</strong>:<br />
            - Sapphire: 기존 DApp 마이그레이션, 복잡 로직, 낮은 지연<br />
            - ZK chain: 최고 보안성, 단순 로직, 증명 수락 가능한 UX
          </p>
        </div>

      </div>
    </section>
  );
}
