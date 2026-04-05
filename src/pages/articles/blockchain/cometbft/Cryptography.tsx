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

        {/* ── 서명 알고리즘 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator Key Type 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT는 validator별 다른 key type 허용 (theoretical)
// 실제로는 chain당 단일 type 채택

// 선택 기준:
// Ed25519 (기본):
//   + 검증 빠름 (~50μs)
//   + Batch verification 우수
//   + Go 표준 라이브러리 성숙
//   + side-channel 저항성
//   - 모바일/HW wallet 지원 약함

// Secp256k1:
//   + Bitcoin/Ethereum 생태계 호환
//   + HW wallet 광범위 지원 (Ledger, Trezor)
//   + ECDSA 표준
//   - 검증 상대적 느림
//   - Batch 불가 (RFC 표준 없음)

// BLS12-381 (BN254):
//   + 서명 집계 가능
//   + ZK proof 호환
//   + 다중 서명자 scenarios
//   - 검증 매우 느림 (~2ms)
//   - 구현 복잡
//   - Pairing 연산 비쌈

// 실제 사용 현황:
// - Cosmos Hub, Osmosis: Ed25519 (가장 일반적)
// - Binance Chain: Secp256k1 (BNB ecosystem)
// - dYdX: Ed25519 (성능 우선)
// - Sei: Ed25519

// Vote 서명:
// - Precommit 서명: validator key
// - Extension 서명: 동일 key (별도 signature)
// - LastCommit: 모든 Precommit aggregate

// 서명 throughput 요구사항:
// 100 validators × 2 phases × 4 message = 800 signatures per block
// Block time 3s → 267 sig/sec
// Ed25519 verification: ~50μs × 267 = 13ms (5% of block time)
// → 충분 여유`}
        </pre>
        <p className="leading-7">
          validator key 선택은 <strong>생태계 + 성능 trade-off</strong>.<br />
          Ed25519가 default — 빠른 검증 + batch 지원.<br />
          BLS는 aggregation 강점이지만 검증 비용 큼.
        </p>
      </div>
    </section>
  );
}
