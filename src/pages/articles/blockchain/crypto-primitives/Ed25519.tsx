import EdDSAViz from './viz/EdDSAViz';
import CodePanel from '@/components/ui/code-panel';

export default function Ed25519() {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ed25519 / EdDSA</h2>
      <div className="not-prose mb-8"><EdDSAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Ed25519는 Twisted Edwards curve 위에서 동작하는 EdDSA(Edwards-curve Digital Signature Algorithm, 에드워즈 곡선 전자서명)입니다.
          <br />
          ECDSA와 달리 결정론적 nonce(임시 난수)를 사용합니다.
          <br />
          nonce 재사용 취약점이 없습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 파라미터</h3>
        <ul>
          <li><strong>B (Base Point)</strong> — 곡선의 고정된 생성자</li>
          <li><strong>L (Order)</strong> — B의 순환 차수: 2&#x00B2;&#x2075;&#x00B2; + 27742317777372353535851937790883648493</li>
          <li><strong>A (Public Key)</strong> — a * B, 여기서 a는 개인키에서 파생된 스칼라</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">서명 과정</h3>
        <CodePanel title="EdDSA 서명 (결정론적 nonce)" code={`// 키 생성
a = prune(SHA512(sk)[:32])   // 스칼라
A = a * B                    // 공개키

// 서명 (결정론적 nonce)
r = SHA512(SHA512(sk)[32:] || m)  // 메시지 의존 nonce
R = r * B                         // commitment point
H = SHA512(R || A || m)           // challenge
S = (r + H * a) mod L             // response

서명 = (R, S)`} defaultOpen annotations={[
          { lines: [1, 3], color: 'sky', note: '키 생성: SHA512 → 스칼라 → 점' },
          { lines: [5, 9], color: 'emerald', note: '결정론적 nonce로 서명 생성' },
          { lines: [11, 11], color: 'amber', note: '서명 = (점, 스칼라)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">검증</h3>
        <CodePanel title="EdDSA 검증" code={`// 검증 등식
S * B == R + H * A

// 전개:
// S * B = (r + H*a) * B = r*B + H*a*B = R + H*A  ✓`} defaultOpen annotations={[
          { lines: [1, 2], color: 'sky', note: '검증 등식' },
          { lines: [4, 5], color: 'emerald', note: '정당성 증명' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA와 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pr-4 pb-2 font-semibold">항목</th>
                <th className="text-left pr-4 pb-2 font-semibold">ECDSA</th>
                <th className="text-left pb-2 font-semibold">EdDSA (Ed25519)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4 py-1">Nonce</td>
                <td className="pr-4 py-1">랜덤 k (재사용 시 키 노출)</td>
                <td className="py-1">결정론적 (SHA512 기반)</td>
              </tr>
              <tr>
                <td className="pr-4 py-1">서명식</td>
                <td className="pr-4 py-1">s = k&#x207B;&#x00B9;(H(m) + r*priv)</td>
                <td className="py-1">S = r + H(R||A||m)*a</td>
              </tr>
              <tr>
                <td className="pr-4 py-1">역원 연산</td>
                <td className="pr-4 py-1">k&#x207B;&#x00B9; 필요</td>
                <td className="py-1">불필요 (side-channel 안전)</td>
              </tr>
              <tr>
                <td className="pr-4 py-1">곡선</td>
                <td className="pr-4 py-1">secp256k1 등</td>
                <td className="py-1">Twisted Edwards (Curve25519)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
