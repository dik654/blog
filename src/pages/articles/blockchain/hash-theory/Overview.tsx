import M from '@/components/ui/math';
import HashSecurityViz from './viz/HashSecurityViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">해시 안전성 정의</h2>
      <div className="not-prose mb-8"><HashSecurityViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">암호학적 해시 함수의 3대 속성</h3>

        {/* 정의 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">정의</div>
          <p className="text-sm text-muted-foreground">
            <M>{'H: \\{0,1\\}^* \\to \\{0,1\\}^n'}</M> &mdash; 임의 길이 입력 &rarr; 고정 길이 출력
          </p>
        </div>

        {/* 3대 속성 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">1. Preimage Resistance</div>
            <p className="text-xs text-muted-foreground mb-1">(일방향성)</p>
            <p className="text-sm text-muted-foreground">
              주어진 <M>h</M>에 대해 <M>{'H(x) = h'}</M>인 <M>x</M> 찾기 어려움.
              복잡도: <M>{'2^n'}</M> (brute force). SHA-256: <M>{'2^{256}'}</M> 시도 필요.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">2. Second Preimage Resistance</div>
            <p className="text-xs text-muted-foreground mb-1">(2차 원상)</p>
            <p className="text-sm text-muted-foreground">
              주어진 <M>{'x_1'}</M>에 대해 <M>{'H(x_1) = H(x_2)'}</M>인 <M>{'x_2 \\neq x_1'}</M> 찾기 어려움.
              복잡도: <M>{'2^n'}</M>.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">3. Collision Resistance</div>
            <p className="text-xs text-muted-foreground mb-1">(충돌 저항)</p>
            <p className="text-sm text-muted-foreground">
              <M>{'H(x_1) = H(x_2)'}</M>인 <M>{'x_1 \\neq x_2'}</M> 쌍 찾기 어려움.
              복잡도: <M>{'2^{n/2}'}</M> (생일 공격). 가장 강한 속성.
            </p>
          </div>
        </div>

        {/* 생일 공격 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">생일 공격 (Birthday Attack)</div>
          <p className="text-sm text-muted-foreground mb-1">
            <M>n</M>명 중 생일이 겹치는 사람이 있을 확률 &mdash; 23명이면 50% (일반 직관: 183명).
          </p>
          <p className="text-sm text-muted-foreground">
            해시 충돌: <M>{'2^{n/2}'}</M> 샘플에서 50% 확률로 충돌.
            SHA-256 (<M>n=256</M>): <M>{'2^{128}'}</M> samples / MD5 (<M>n=128</M>): <M>{'2^{64}'}</M> samples (이미 깨짐).
          </p>
        </div>

        {/* 해시 함수 역사 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">해시 함수 역사</h4>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 font-semibold">함수</th>
                <th className="p-2 font-semibold">출력</th>
                <th className="p-2 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-2">MD5 (1991)</td><td className="p-2">128-bit</td><td className="p-2 text-red-500">깨짐 (2004)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA-1 (1995)</td><td className="p-2">160-bit</td><td className="p-2 text-red-500">깨짐 (2017)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA-2 (2001)</td><td className="p-2">224/256/384/512-bit</td><td className="p-2 text-emerald-500">안전</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA-3 (2015)</td><td className="p-2">Keccak 기반</td><td className="p-2 text-emerald-500">안전</td></tr>
              <tr><td className="p-2">BLAKE2/3 (2012)</td><td className="p-2">가변</td><td className="p-2 text-emerald-500">안전, SHA-2보다 빠름</td></tr>
            </tbody>
          </table>
        </div>

        {/* 공격 방법 */}
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Length Extension</div>
            <p className="text-xs text-muted-foreground">SHA-2 취약</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Chosen-prefix</div>
            <p className="text-xs text-muted-foreground">MD5, SHA-1</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Rainbow Tables</div>
            <p className="text-xs text-muted-foreground">사전 계산 공격</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Quantum (Grover)</div>
            <p className="text-xs text-muted-foreground"><M>{'2^{n/2}'}</M> &rarr; 근본 변화 없음</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인의 해시 사용</h3>

        {/* 블록체인 해시 활용 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Block Identity</div>
            <p className="text-sm text-muted-foreground">블록 해시 = 블록 식별자. 이전 블록 해시 포함 &rarr; 체인 구조. 변조 즉시 탐지.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Proof of Work (Bitcoin)</div>
            <p className="text-sm text-muted-foreground">
              nonce를 찾아 <M>{'H(\\text{block}) < \\text{target}'}</M>. 일방향성 활용, 계산 비용 = 채굴 난이도.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Merkle Root</div>
            <p className="text-sm text-muted-foreground">
              거래들의 해시 트리 루트. SPV (Simple Payment Verification). <M>{'O(\\log n)'}</M> 증명.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Address Derivation</div>
            <p className="text-sm text-muted-foreground">
              Bitcoin: <code>RIPEMD-160(SHA-256(pubkey))</code><br />
              Ethereum: <code>keccak256(pubkey)[12:]</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Digital Signatures</div>
            <p className="text-sm text-muted-foreground">
              <code>sign(hash(message))</code> &mdash; 전체 메시지가 아닌 해시에 서명. 효율성 + 결정성.
            </p>
          </div>
        </div>

        {/* 블록체인별 해시 선택 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">주요 블록체인의 해시 선택</h4>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 font-semibold">블록체인</th>
                <th className="p-2 font-semibold">해시 함수</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-2">Bitcoin</td><td className="p-2">SHA-256 (double)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Ethereum</td><td className="p-2">Keccak-256 (SHA-3 변형)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Zcash</td><td className="p-2">BLAKE2b</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Solana</td><td className="p-2">SHA-256, Poseidon (ZK)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Filecoin</td><td className="p-2">SHA-256, Poseidon, BLAKE2b</td></tr>
              <tr><td className="p-2">Ethereum 2.0</td><td className="p-2">SHA-256</td></tr>
            </tbody>
          </table>
        </div>

        {/* ZK-friendly 트렌드 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">ZK-friendly 해시 트렌드 (2020~)</div>
          <p className="text-sm text-muted-foreground">
            Poseidon, Rescue, MiMC, Griffin &rarr; R1CS constraint 최소화
          </p>
        </div>
      </div>
    </section>
  );
}
