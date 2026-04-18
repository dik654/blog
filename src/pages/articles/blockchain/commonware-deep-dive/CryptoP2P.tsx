import CryptoP2PViz from './viz/CryptoP2PViz';

export default function CryptoP2P() {
  return (
    <section id="crypto-p2p" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 & P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>cryptography::bls12381</strong> — BLS12-381 타원 곡선 기반 암호화 프리미티브
          <br />
          DKG(분산 키 생성, 보드리스 공유 분배) → Threshold Signatures(임계 서명, O(1) 96 bytes)
          <br />
          Resharing으로 검증자 세트 변경 대응 — Epoch 기반 키 리셰어링
        </p>
        <p className="leading-7">
          3가지 서명 스킴 지원:
          <br />
          <strong>ed25519</strong> — 빠른 서명/검증, 배치 검증 지원. 일반 용도
          <br />
          <strong>bls12381</strong> — 서명 집계, 임계 서명. 합의·크로스체인 검증에 핵심
          <br />
          <strong>secp256r1</strong> — NIST P-256, HSM 호환. 엔터프라이즈 환경
        </p>
        <p className="leading-7">
          <strong>p2p::authenticated</strong> — ECIES 암호화 연결 + 서명 기반 피어 인증 + 멀티플렉싱(다중 채널)
          <br />
          Blocker 인터페이스로 악의적 피어 차단 · 동적 피어 관리 · 네트워크 파티션 복구
          <br />
          <strong>p2p::simulated</strong> — 결정론적 시뮬레이션을 위한 가상 네트워크
        </p>
      </div>
      <div className="not-prose mb-8"><CryptoP2PViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BLS12-381 Threshold Signatures</h3>
        <p className="text-sm text-muted-foreground mb-4">
          BLS (Boneh-Lynn-Shacham) — 3명의 암호학자 이름. Deterministic, short signatures(48 bytes), aggregation, threshold signing 지원
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-sm mb-3">Signature Aggregation</h4>
            <p className="text-sm text-muted-foreground mb-2">
              n개 서명을 단순 group addition으로 1개로 합산
            </p>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div><code className="text-xs">σ_agg = σ_1 + σ_2 + ... + σ_n</code></div>
              <div><code className="text-xs">verify_agg(σ_agg, pk_1+...+pk_n, msg) == true</code></div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-sm mb-3">Threshold Signature (t-of-n)</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><strong className="text-foreground">DKG</strong> — n parties generate shares, no single party knows full key</li>
              <li><strong className="text-foreground">Signing</strong> — each party creates partial sig, t parties combine → valid</li>
              <li><strong className="text-foreground">Verification</strong> — standard BLS verify, verifier doesn't know who signed</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Performance</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className="text-muted-foreground">Signature</div><div><strong>48 bytes</strong> (G1)</div>
              <div className="text-muted-foreground">Public key</div><div><strong>96 bytes</strong> (G2)</div>
              <div className="text-muted-foreground">Verification</div><div><strong>3 pairings</strong> (~2ms)</div>
              <div className="text-muted-foreground">Aggregation</div><div><code className="text-xs">O(n)</code> point additions</div>
              <div className="text-muted-foreground">DKG setup</div><div><code className="text-xs">O(n²)</code> interactive</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Use Cases</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Ethereum 2.0 validator signatures</li>
              <li>Randomness beacons (drand)</li>
              <li>Cross-chain bridges</li>
              <li>Consensus aggregation</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">P2P Authenticated Network</h3>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-3"><code className="text-xs">p2p::authenticated</code> module</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-sm mb-2"><code className="text-xs">AuthenticatedPeer</code> 구조체</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs">peer_id: PublicKey</code> — Ed25519 pubkey = identity</li>
                <li><code className="text-xs">secret_key: SecretKey</code></li>
                <li><code className="text-xs">session_key: Option&lt;SessionKey&gt;</code> — ECDH derived</li>
                <li><code className="text-xs">channels: HashMap&lt;ChannelId, ChannelState&gt;</code></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-2">Connection Handshake</h5>
              <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal list-inside">
                <li>TCP connect</li>
                <li>ECDH key exchange</li>
                <li>Identity verification — signed challenge</li>
                <li>Session key derivation — ChaCha20-Poly1305</li>
                <li>Channel setup — multiplexing</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Channel Design</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Logical streams over single TCP</li>
              <li>Per-channel flow control</li>
              <li>Ordered delivery per channel</li>
              <li>Independent backpressure</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Message Encryption</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>AEAD per message</li>
              <li>Nonce = sequence number — replay 방어</li>
              <li>16-byte auth tag</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Network Partitions</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Node가 peer 연결 끊기</li>
              <li>Reconnection with backoff</li>
              <li>Gossip rediscovery</li>
              <li>Eventual consistency</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Blocker</code> trait</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs">fn should_block(&self, peer: &PeerId) -&gt; bool</code></li>
                <li><code className="text-xs">fn on_misbehavior(&mut self, peer: &PeerId, kind: Misbehavior)</code></li>
              </ul>
            </div>
            <div>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Peer reputation tracking</li>
                <li>Automated banning / Rate limiting</li>
                <li>Allowlist / blocklist</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
