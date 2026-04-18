import CSPRNGFlowViz from './viz/CSPRNGFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CSPRNG란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          컴퓨터는 결정론적(deterministic) 기계이므로 "진짜 랜덤"을 만들 수 없다.
          <br />
          일반 난수생성기(PRNG)는 시드를 알면 출력을 예측할 수 있어 암호학에서는 치명적이다.
          <br />
          암호학적 난수생성기(CSPRNG)는 출력을 관찰해도 다음 값을 예측할 수 없도록
          설계된 특수한 PRNG로, 모든 암호 프로토콜의 안전성 기반이다.
        </p>
      </div>
      <div className="not-prose"><CSPRNGFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CSPRNG 안전성 요건</h3>

        {/* 4대 요건 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">1. Next-Bit Test (Yao, 1982)</div>
            <p className="text-sm text-muted-foreground">
              첫 <code>k</code> bits를 관찰해도 <code>k+1</code>번째 bit 예측 불가. 공격자 우위 = 1/2 + negligible.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">2. Forward Secrecy</div>
            <p className="text-sm text-muted-foreground">
              현재 상태를 알아도 과거 출력 복원 불가. State 전환 함수가 one-way.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">3. Backward Secrecy (Recovery)</div>
            <p className="text-sm text-muted-foreground">
              과거 상태가 compromised 되어도 reseeding 후 새 출력은 안전.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">4. Indistinguishability</div>
            <p className="text-sm text-muted-foreground">
              CSPRNG 출력과 진짜 random을 계산적으로 구분 불가.
            </p>
          </div>
        </div>

        {/* PRNG vs CSPRNG */}
        <h4 className="text-lg font-semibold mt-5 mb-3">PRNG vs CSPRNG</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">일반 PRNG (<code>rand()</code>)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>빠름 (Fast)</li>
              <li>예측 가능 &mdash; 시드 알면 복원</li>
              <li>용도: 시뮬레이션, 게임</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">CSPRNG</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>느림 (Slower)</li>
              <li>예측 불가 (Unpredictable)</li>
              <li>용도: 암호 키, nonce, 토큰</li>
            </ul>
          </div>
        </div>

        {/* 주요 알고리즘 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">주요 CSPRNG 알고리즘</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">ChaCha20-based</div>
            <p className="text-xs text-muted-foreground mb-1">Linux <code>/dev/urandom</code></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Stream cipher 기반, fast &amp; modern</li>
              <li>Reseeding 지원</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">AES-CTR-DRBG</div>
            <p className="text-xs text-muted-foreground mb-1">NIST SP 800-90A / Windows CNG</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>AES block cipher counter mode</li>
              <li>표준화됨</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Hash-DRBG</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>SHA-256/512 기반</li>
              <li>간단한 구조</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">HMAC-DRBG</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>HMAC 기반</li>
              <li>가장 보수적</li>
            </ul>
          </div>
        </div>

        {/* Dual_EC_DRBG 사건 */}
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Dual_EC_DRBG 사건</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>NIST 표준 (2006) &rarr; NSA backdoor 의혹 (2013) &rarr; 2014년 폐기</li>
            <li>알고리즘 선택의 중요성을 보여주는 대표 사례</li>
          </ul>
        </div>

        {/* /dev/random vs /dev/urandom */}
        <h4 className="text-lg font-semibold mt-5 mb-3">/dev/random vs /dev/urandom</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1"><code>/dev/random</code></div>
            <p className="text-sm text-muted-foreground">entropy 부족 시 blocking</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1"><code>/dev/urandom</code></div>
            <p className="text-sm text-muted-foreground">항상 available (ChaCha20 기반). 현대는 urandom 권장 &mdash; Linux 5.17+에서 통합됨.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
