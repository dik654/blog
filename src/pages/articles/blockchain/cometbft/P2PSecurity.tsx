import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import P2PSecurityViz from './viz/P2PSecurityViz';
import { HANDSHAKE_CODE, HANDSHAKE_ANNOTATIONS, DOS_CODE, DOS_ANNOTATIONS, SECURITY_TABLE } from './P2PSecurityData';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function P2PSecurity({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="p2p-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 보안</h2>
      <div className="not-prose mb-8"><P2PSecurityViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT P2P 연결은 <strong>STS(Station-to-Station, 상호 인증 키 교환) 프로토콜</strong>로 보호됩니다.
          <br />
          X25519 ECDH 키 교환 → Ed25519 인증 → ChaCha20-Poly1305 암호화의 3단계로 구성됩니다.
          <br />
          이더리움 devp2p의 RLPx 핸드셰이크와 유사한 구조입니다.
        </p>
        <CitationBlock source="cometbft/p2p/conn/secret_connection.go" citeKey={8} type="code" href="https://github.com/cometbft/cometbft/blob/main/p2p/conn/secret_connection.go">
          <div className="text-xs text-foreground/70 space-y-1">
            <p><code>SecretConnection</code> — AEAD 암호화로 모든 P2P 메시지 보호</p>
            <p><code>recvNonce</code>/<code>sendNonce</code> — 방향별 독립 nonce / <code>recvAead</code>/<code>sendAead</code> — ChaCha20-Poly1305 AEAD 인스턴스</p>
          </div>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">보안 핸드셰이크</h3>
        <CodePanel title="STS 프로토콜 4단계" code={HANDSHAKE_CODE} annotations={HANDSHAKE_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">DoS 방어</h3>
        <CodePanel title="Rate Limit + 피어 신뢰도 관리" code={DOS_CODE} annotations={DOS_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">보안 스택 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>계층</th>
                <th className={`${CELL} text-left`}>CometBFT</th>
                <th className={`${CELL} text-left`}>이더리움 devp2p</th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_TABLE.map(r => (
                <tr key={r.layer}>
                  <td className={`${CELL} font-medium`}>{r.layer}</td>
                  <td className={CELL}>{r.mechanism}</td>
                  <td className={CELL}>{r.compare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Peer Reputation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Peer Reputation — 악의 피어 차단</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2"><code>Switch</code> 구조체 — peer reputation 관리</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><code>peers *PeerSet</code> — 연결된 피어 목록 / <code>reconnectCh chan Peer</code> — 재연결 채널 / <code>reactors map[string]Reactor</code> — Reactor별 상태 tracking</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">피어 제재 조건</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1.</strong> Invalid message 전송 → immediate ban</p>
                <p><strong className="text-foreground">2.</strong> Consensus violation (잘못된 Vote/Block) → ban</p>
                <p><strong className="text-foreground">3.</strong> Rate limit 초과 → throttle, 반복 시 ban</p>
                <p><strong className="text-foreground">4.</strong> Timeout (no response 60s) → disconnect</p>
                <p><strong className="text-foreground">5.</strong> Wrong chain ID → disconnect</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>StopPeerForError</code> 호출 시나리오</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Decoding error</li>
                <li>Signature verification failure</li>
                <li>Duplicate/conflicting vote</li>
                <li>Evidence 생성 후 bad peer 판정</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">실행: <code>peer.CloseConn()</code> → <code>peers.Remove(peer.ID())</code> → <code>addrBook.MarkBad(peer.Address())</code></p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">AddrBook ban list</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><code>MarkBad</code> — 1시간 재연결 금지</p>
                <p><code>MarkGood</code> — reputation 회복</p>
                <p>영구 ban은 config로 설정 (신뢰 피어만 연결)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">공격 방어</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Sybil</strong> — max peer 제한 + AddrBook 다양성</p>
                <p><strong className="text-foreground">DoS</strong> — rate limit + auth 체크</p>
                <p><strong className="text-foreground">Eclipse</strong> — 다중 peer 유지 + outbound 우선</p>
                <p><strong className="text-foreground">MITM</strong> — SecretConnection (STS handshake)</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Peer reputation이 <strong>Switch에서 관리</strong>.<br />
          consensus violation/rate limit 초과 등 다양한 제재 조건.<br />
          AddrBook으로 bad peer 영구 차단 (1시간 재연결 금지).
        </p>
      </div>
    </section>
  );
}
