import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import CryptoFlowViz from './viz/CryptoFlowViz';
import { CRYPTO_STACK_CODE, CRYPTO_STACK_ANNOTATIONS, SIGN_VERIFY_CODE, SIGN_VERIFY_ANNOTATIONS, SIG_COMPARE_TABLE } from './CryptographyData';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function Cryptography({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="cryptography" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 & 보안</h2>
      <div className="not-prose mb-8"><CryptoFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 세 가지 핵심 암호화 프리미티브(Cryptographic Primitive, 기본 암호 연산)를 사용합니다.
          <br />
          <strong>SHA-256</strong>(해시), <strong>Ed25519</strong>(기본 서명), <strong>ChaCha20-Poly1305</strong>(P2P 암호화)입니다.
          <br />
          Secp256k1(비트코인 호환)과 BLS12-381(집계 서명)도 지원합니다.
          <br />
          다양한 블록체인 생태계와의 호환성을 보장합니다.
        </p>
        <CitationBlock source="cometbft/crypto/ed25519" citeKey={10} type="code" href="https://github.com/cometbft/cometbft/tree/main/crypto/ed25519">
          <pre className="text-xs overflow-x-auto"><code>{`// Ed25519: 기본 서명 알고리즘
PubKeySize     = 32   // 공개키 32바이트
PrivateKeySize = 64   // 개인키 64바이트
SignatureSize  = 64   // 서명 64바이트
// 배치 검증 + 캐싱 검증기로 성능 최적화`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">Ed25519는 빠른 서명 생성/검증, 사이드 채널 공격 저항성, 결정론적 서명을 제공합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">암호화 스택 전체 구조</h3>
        <CodePanel title="해시 + 서명 + 머클 + P2P 보안" code={CRYPTO_STACK_CODE} annotations={CRYPTO_STACK_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">서명 검증 흐름</h3>
        <CodePanel title="생성 → 브로드캐스트 → 검증 → 배치" code={SIGN_VERIFY_CODE} annotations={SIGN_VERIFY_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">서명 알고리즘 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>알고리즘</th>
                <th className={`${CELL} text-left`}>키 크기</th>
                <th className={`${CELL} text-left`}>서명 크기</th>
                <th className={`${CELL} text-left`}>속도</th>
                <th className={`${CELL} text-left`}>용도</th>
              </tr>
            </thead>
            <tbody>
              {SIG_COMPARE_TABLE.map(r => (
                <tr key={r.algo}>
                  <td className={`${CELL} font-mono text-xs`}>{r.algo}</td>
                  <td className={CELL}>{r.keySize}</td>
                  <td className={CELL}>{r.sigSize}</td>
                  <td className={CELL}>{r.speed}</td>
                  <td className={CELL}>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
