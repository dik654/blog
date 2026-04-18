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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-blue-500/30 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-3">사용자 측 (지갑)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80 mb-1">1. Proof 생성</p>
                <p>Off-chain에서 Transact proof 생성</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">2. AES-256-GCM 암호화</p>
                <ul className="space-y-0.5">
                  <li><code>key = derive_key(broadcaster_pubkey, ephemeral_key)</code></li>
                  <li>payload: <code>to</code>, <code>data</code>, <code>gasLimit</code>, <code>maxFee</code></li>
                  <li><code>broadcasterFee</code>: 0.01 ETH (보상)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">3. Waku publish</p>
                <p>topic: <code>/railgun/1/broadcast/proto</code></p>
                <p>payload: <code>encryptedTx</code></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-3">Broadcaster 측</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2">1. Waku에서 수신</div>
              <div className="bg-muted/50 rounded p-2">2. 복호화 시도<br /><span className="text-xs"><code>try_decrypt()</code></span></div>
              <div className="bg-muted/50 rounded p-2">3. Off-chain proof 검증<br /><span className="text-xs">(gas 절약)</span></div>
              <div className="bg-muted/50 rounded p-2">4. 수수료 확인<br /><span className="text-xs"><code>fee &ge; min_fee</code></span></div>
              <div className="bg-muted/50 rounded p-2">5. 자기 EOA로 tx submit</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Fee는 shielded tx 내부에서 unshielded ERC-20으로 수령</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Waku Protocol 사용</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Waku = libp2p 기반 P2P messaging (Ethereum Foundation + Status)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2">Decentralized<br /><span className="text-xs">no central server</span></div>
              <div className="bg-muted/50 rounded p-2">Message store<br /><span className="text-xs">30일 보관</span></div>
              <div className="bg-muted/50 rounded p-2">E2E encryption</div>
              <div className="bg-muted/50 rounded p-2">Spam protection<br /><span className="text-xs">PoW or RLN</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">RAILGUN이 Waku를 선택한 이유</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Censorship-resistant (노드 분산)</li>
                <li>Privacy-first design (IP 숨김)</li>
                <li>Persistent storage (broadcaster 오프라인 대응)</li>
                <li>무료 (no API 비용)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">대안의 단점</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><strong>Centralized relay</strong>: privacy 위험</li>
                <li><strong>Direct mempool submit</strong>: msg.sender 노출</li>
                <li><strong>Tor only</strong>: latency 큼</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Anti-censorship & 생태계</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <ul className="space-y-0.5">
                <li>여러 Waku 노드에 publish &rarr; 다수 broadcaster 경쟁</li>
                <li>첫 submit한 broadcaster가 fee 획득</li>
              </ul>
              <ul className="space-y-0.5">
                <li>RAILGUN Wallet: built-in broadcaster selection</li>
                <li>공식 broadcaster + 커뮤니티 운영 &rarr; fee competition으로 가격 하락</li>
              </ul>
            </div>
          </div>
        </div>

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
