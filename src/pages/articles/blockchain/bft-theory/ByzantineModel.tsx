import M from '@/components/ui/math';
import ByzantineModelViz from './viz/ByzantineModelViz';

export default function ByzantineModel() {
  return (
    <section id="byzantine-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장애 모델</h2>
      <div className="not-prose mb-6"><ByzantineModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          장애 모델은 <strong>노드가 어떻게 실패할 수 있는가</strong>를 규정한다.<br />
          약한 모델부터 강한 모델까지 단계별로 — 각 단계는 이전 모델을 포함한다.<br />
          BFT는 가장 강한 모델인 Byzantine fault를 다룬다.
        </p>

        {/* ── Crash vs Byzantine ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Crash Fault vs Byzantine Fault</h3>
        <div className="not-prose space-y-3 mb-4">
          <p className="text-xs text-muted-foreground">장애 모델 계층 (약 → 강): Fail-Stop ⊂ Crash ⊂ Omission ⊂ Byzantine</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">1. Fail-Stop (가장 약함)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>노드가 실패하면 <strong>명백히</strong> 정지</li>
                <li>다른 노드가 실패를 감지 가능</li>
                <li>실무에서 드묾 (감지 보장 어려움)</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">2. Crash Fault (CFT)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>정지하면 영원히 침묵, 감지 보장 안 됨 (timeout 추측)</li>
                <li>메시지 유실, 노드 다운, 네트워크 partition</li>
                <li>Paxos, Raft, Zookeeper</li>
                <li><M>{'f < n/2'}</M> 필요 (majority alive)</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">3. Omission Fault</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>일부 메시지만 유실 (선택적 전송/수신)</li>
                <li>Byzantine의 약한 부분집합</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">4. Timing Fault</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>메시지 전달 시간 위반</li>
                <li>동기 시스템에서만 의미 (항공 등 실시간)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">5. Byzantine Fault (가장 강함)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>임의의 행동</strong> 가능 — 거짓 메시지 조작, 모순 전달, 프로토콜 위반</li>
              <li><M>{'f < n/3'}</M> 필요 (partial sync, unauthenticated)</li>
              <li>Byzantine를 다루면 모든 약한 장애도 자동 처리</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Crash는 <strong>정지만 (단순)</strong>, Byzantine은 <strong>임의의 거짓 (복잡)</strong>.<br />
          Crash는 majority로 충분 (<M>{'f < n/2'}</M>), Byzantine은 2/3 이상 필요 (<M>{'f < n/3'}</M>).<br />
          블록체인은 항상 Byzantine 가정.
        </p>

        {/* ── 네트워크 타이밍 모델 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">네트워크 타이밍 모델: 동기/비동기/부분동기</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Synchronous (동기)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>지연 상한 <M>{String.raw`\Delta`}</M> 알려짐</li>
              <li>timeout = <M>{String.raw`\Delta + \varepsilon`}</M>으로 판별</li>
              <li>강한 가정 — 실제 인터넷에서 보장 어려움</li>
              <li>Dolev-Strong: <M>{'f < n'}</M>, <M>{'O(f)'}</M> round</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Asynchronous (비동기)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>시간 상한 없음</li>
              <li>가장 현실적, 가장 약함</li>
              <li>FLP 불가능성 (1985): deterministic consensus 불가</li>
              <li>우회: Randomization (Ben-Or, HoneyBadger)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Partial Sync (부분 동기)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>DLS 1988 — GST 존재</li>
              <li>GST 이전: async, GST 이후: <M>{String.raw`\text{delay} < \Delta`}</M></li>
              <li>Safety 항상, Liveness GST 이후</li>
              <li>PBFT, HotStuff, Tendermint의 모델</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border p-4 mb-4">
          <p className="font-semibold text-sm mb-2">실제 인터넷 매핑</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>평소: partial sync (<M>{String.raw`\Delta \approx`}</M> 100-500ms)</li>
            <li>DDoS/partition: asynchronous</li>
            <li>LAN: near-synchronous (<M>{String.raw`\Delta \approx`}</M> 1-10ms)</li>
          </ul>
        </div>
        <p className="leading-7">
          부분 동기 = <strong>GST 이전 비동기, 이후 동기</strong>.<br />
          Safety는 항상 보장, Liveness는 GST 이후에만.<br />
          실제 인터넷의 현실적 모델 — 평소엔 안정, 가끔 불안.
        </p>

        {/* ── 인증 유무 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Authenticated vs Unauthenticated</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Unauthenticated (서명 없음)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>다른 노드 흉내 가능, 위조·변조 감지 불가</li>
              <li>Lamport 원 논문 모델</li>
              <li><M>{'n \\geq 3f+1'}</M> 필수</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Authenticated (서명 있음)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>공개키 암호 서명 (Ed25519, ECDSA, BLS)</li>
              <li>동기: <M>{'n \\geq f+2'}</M> (Dolev-Strong)</li>
              <li>부분 동기: 여전히 <M>{'n \\geq 3f+1'}</M></li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">블록체인 실제</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>모든 메시지 서명 필수 (validator private key)</li>
              <li>서명 검증이 P2P 계층의 첫 단계</li>
              <li>slashing (이중서명 시 벌금)으로 Byzantine 억제</li>
            </ul>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">왜 서명 있어도 <M>{'n \\geq 3f+1'}</M>?</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>정족수 교차 (quorum intersection) 보장 필요</li>
              <li><M>{'Q = 2f+1'}</M>, <M>{'|Q_1 \\cap Q_2| \\geq f+1'}</M></li>
              <li>겹친 <M>{'f+1'}</M>명 중 정직 1명 이상 → 서로 다른 결정 불가</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          서명은 <strong>위조 방지 + 책임 추적</strong>.<br />
          서명 없으면 <M>{'n \\geq 3f+1'}</M>, 서명 있어도 partial sync에선 여전히 3f+1.<br />
          이유는 <strong>quorum intersection</strong> — 두 quorum이 반드시 겹쳐야 safety 보장.
        </p>

        {/* ── 실제 배포 예 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 배포 매핑</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Ethereum 2.0 (Beacon chain)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Byzantine + Partial sync, <M>{'f < n/3'}</M></li>
              <li>11,000+ validators → 3,600+까지 감내</li>
              <li>Attestation slashing으로 이중서명 억제</li>
              <li>Casper FFG (finality) + LMD-GHOST (fork choice)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Cosmos (CometBFT)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Byzantine + Partial sync, <M>{'f < n/3'}</M></li>
              <li>validators 100-200, instant finality</li>
              <li>Stake-weighted voting</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Sui (Mysticeti)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Byzantine + Partial sync + async fallback</li>
              <li>DAG + uncertified commit</li>
              <li>390ms e2e latency</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Bitcoin (Nakamoto)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Probabilistic (no instant finality)</li>
              <li>Honest majority (51%) — formal BFT 아님</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Hyperledger Fabric</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Orderer: Raft (CFT) or PBFT</li>
              <li>Endorsement: Byzantine</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">HotStuff (Diem/Aptos)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Byzantine + Partial sync, <M>{'f < n/3'}</M></li>
              <li><M>{'O(n)'}</M> chained voting, responsive</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          블록체인은 <strong>모두 Byzantine + Partial sync</strong> 모델.<br />
          Bitcoin은 probabilistic (formal BFT 아님), 나머지는 모두 <M>{'f < n/3'}</M> BFT.<br />
          stake-weighted 투표가 현대 PoS의 표준.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 partial sync가 "최선의 타협"인가</strong> — FLP 불가능성과 현실의 절충.<br />
          Asynchronous는 deterministic consensus 불가, synchronous는 실제 네트워크에 맞지 않음.<br />
          Partial sync는 safety 항상 보장하고 liveness는 네트워크 안정 시에만 — 현실적이면서 안전.
        </p>
      </div>
    </section>
  );
}
