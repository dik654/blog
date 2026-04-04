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
          <pre className="text-xs overflow-x-auto"><code>{`type SecretConnection struct {
    conn       io.ReadWriteCloser
    recvBuffer []byte
    recvNonce  *[aeadNonceSize]byte
    sendNonce  *[aeadNonceSize]byte
    recvAead   cipher.AEAD  // ChaCha20-Poly1305
    sendAead   cipher.AEAD
}`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">SecretConnection은 AEAD 암호화로 모든 P2P 메시지를 보호합니다.</p>
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
      </div>
    </section>
  );
}
