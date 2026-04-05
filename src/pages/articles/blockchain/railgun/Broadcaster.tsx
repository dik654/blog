import type { CodeRef } from '@/components/code/types';
import BroadcasterViz from './viz/BroadcasterViz';

export default function Broadcaster({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="broadcaster" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Broadcaster — Waku P2P</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ZK 증명으로 금액과 수신자를 숨겨도, 직접 TX를 제출하면 msg.sender가 노출된다.
          <br />
          RAILGUN은 <strong>Broadcaster(릴레이어)</strong>로 이 문제를 해결한다.
        </p>
        <p className="leading-7">
          사용자는 TX를 AES-256-GCM으로 암호화한 뒤, <strong>Waku</strong> P2P 네트워크에 발행한다.
          <br />
          Broadcaster가 이를 수신하고, 자신의 EOA로 온체인에 제출한다.
        </p>
        <p className="leading-7">
          결과: <code>msg.sender = Broadcaster</code>. 실제 사용자 주소는 온체인에 나타나지 않는다.
          <br />
          Broadcaster는 수수료(fee)로 보상받는다. 누구나 Broadcaster가 될 수 있다.
        </p>
      </div>
      <div className="not-prose"><BroadcasterViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Broadcaster 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 사용자 측 (지갑)
// 1) Transact proof 생성 (off-chain)
// 2) Broadcaster의 public key로 암호화
encryptedTx = AES_256_GCM(
    key: derive_key(broadcaster_pubkey, ephemeral_key),
    plaintext: {
        to: RAILGUN_CONTRACT,
        data: transactCalldata,
        gasLimit: ...,
        maxFee: ...,
        broadcasterFee: 0.01 ETH  // broadcaster 보상
    }
)

// 3) Waku network에 publish
waku_publish(
    topic: "/railgun/1/broadcast/proto",
    payload: encryptedTx
)

// Broadcaster 측
// 1) Waku에서 수신
for msg in waku_messages:
    decrypted = try_decrypt(msg, my_private_key)
    if not decrypted: continue

    // 2) Proof 검증 (off-chain, gas 절약)
    if not verify_proof_offchain(decrypted.proof):
        continue

    // 3) 수수료 확인
    if decrypted.broadcasterFee < my_min_fee:
        continue

    // 4) 자기 지갑으로 tx submit
    tx = sign(decrypted, my_private_key)
    await eth.sendTransaction(tx)

    // 5) Fee는 unshielded ERC-20으로 받음 (in shielded tx)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Waku Protocol 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Waku = libp2p 기반 P2P messaging
// Ethereum Foundation + Status 개발

// 특성
// - Decentralized (no central server)
// - Message store (30일 보관)
// - End-to-end encryption
// - Spam protection (proof-of-work 또는 RLN)

// RAILGUN이 Waku 선택한 이유
// ✓ Censorship-resistant (Waku 노드 분산)
// ✓ Privacy-first design (IP 숨김)
// ✓ Persistent storage (broadcaster 오프라인 대응)
// ✓ 무료 (no API 비용)

// 대안 vs 단점
// - Centralized relay service: privacy 위험
// - Direct mempool submit: msg.sender 노출
// - Tor only: latency 큼

// Anti-censorship
// - 여러 Waku 노드에 publish
// - 다수 broadcaster가 경쟁
// - 첫 submit한 broadcaster가 fee 획득

// 현재 생태계
// - RAILGUN Wallet: built-in broadcaster selection
// - 공식 broadcaster 몇 개 + 커뮤니티 운영
// - Fee competition → 가격 하락`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 완전 익명성의 조건</p>
          <p>
            <strong>필수 3요소</strong>:<br />
            1. ZK proof (transaction contents 숨김)<br />
            2. Broadcaster (msg.sender 숨김)<br />
            3. Gas from pool (ETH source 숨김)
          </p>
          <p className="mt-2">
            <strong>실패 시나리오</strong>:<br />
            ✗ Direct submit: msg.sender로 추적<br />
            ✗ Same broadcaster 반복 사용: pattern 분석<br />
            ✗ Funded by traceable address: graph analysis
          </p>
          <p className="mt-2">
            <strong>Best practice</strong>:<br />
            ✓ 다양한 broadcaster 순환<br />
            ✓ Time delay 추가<br />
            ✓ Amount randomization<br />
            ✓ Shield 자금원 다양화
          </p>
        </div>

      </div>
    </section>
  );
}
