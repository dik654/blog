import M from '@/components/ui/math';

export default function Applications() {
  const items = [
    {
      name: 'Schnorr / Sigma 프로토콜',
      desc: '커밋 r, 챌린지 e 모두 CSPRNG에서 생성. r이 예측 가능하면 비밀키 x가 노출된다.',
      color: 'indigo',
      href: '/crypto/zk-theory#sigma-protocol',
    },
    {
      name: 'TLS 핸드셰이크',
      desc: '세션키 협상 시 클라이언트/서버 랜덤 32바이트. 예측 가능하면 세션 탈취.',
      color: 'emerald',
    },
    {
      name: '지갑 개인키 생성',
      desc: 'BIP-39 니모닉, secp256k1 개인키 모두 CSPRNG 의존. 엔트로피 부족 시 자산 탈취.',
      color: 'amber',
    },
    {
      name: 'Nonce 생성',
      desc: 'ECDSA, EdDSA 서명의 nonce가 재사용 또는 예측되면 개인키 복원 가능 (Sony PS3 해킹 사례).',
      color: 'indigo',
    },
  ];

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학에서의 사용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          암호 프로토콜의 모든 비밀값은 CSPRNG에서 생성된다.
          <br />
          랜덤이 깨지면 알고리즘 자체의 수학적 안전성과 무관하게 시스템 전체가 무너진다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href ? <a href={p.href} className="hover:underline">{p.name} →</a> : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA Nonce 재사용 취약점</h3>

        {/* ECDSA 서명 과정 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-3">ECDSA 서명 과정</div>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li><M>{'k \\leftarrow \\text{random (nonce)}'}</M></li>
            <li><M>{'R = k \\cdot G'}</M>, <M>{'r = R_x \\bmod n'}</M></li>
            <li><M>{'s = k^{-1} \\cdot (\\text{hash}(m) + r \\cdot \\text{priv}) \\bmod n'}</M></li>
            <li>서명 = <M>{'(r, s)'}</M></li>
          </ol>
        </div>

        {/* Nonce 재사용 공격 */}
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Nonce 재사용 시 (같은 k로 2개 서명)</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>두 서명에서:</p>
            <M display>{'s_1 = \\underbrace{k^{-1}}_{\\text{nonce 역원}} (\\underbrace{h_1}_{\\text{메시지①해시}} + \\underbrace{r}_{\\text{서명 r값}} \\cdot \\underbrace{\\text{priv}}_{\\text{개인키}}) \\bmod n'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'s_1'}</M>: 첫 번째 서명의 <M>s</M>값. <M>k</M>: nonce (같은 값 재사용됨). <M>n</M>: 곡선 차수
            </p>
            <M display>{'s_2 = \\underbrace{k^{-1}}_{\\text{동일 nonce!}} (\\underbrace{h_2}_{\\text{메시지②해시}} + r \\cdot \\text{priv}) \\bmod n'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              같은 <M>k</M>를 사용하므로 <M>r</M>도 동일. 두 식의 차이에서 <M>k</M>를 역산할 수 있음
            </p>
            <p>두 식을 빼면:</p>
            <M display>{'k = \\frac{\\overbrace{h_1 - h_2}^{\\text{해시 차이 (공개)}}}{\\underbrace{s_1 - s_2}_{\\text{서명 차이 (공개)}}} \\bmod n'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'h_1, h_2'}</M>: 메시지 해시 (공개), <M>{'s_1, s_2'}</M>: 서명값 (공개). 모든 값이 공개이므로 <M>k</M> 즉시 복원
            </p>
            <p><M>k</M>를 알면 개인키 복원:</p>
            <M display>{'\\text{priv} = \\frac{\\overbrace{s_1 \\cdot k}^{\\text{복원된 k 대입}} - \\underbrace{h_1}_{\\text{메시지 해시}}}{\\underbrace{r}_{\\text{서명 r값}}} \\bmod n'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>k</M>가 복원되면 원래 서명 공식을 역산하여 개인키 <M>{'\\text{priv}'}</M> 추출 가능
            </p>
            <p className="font-semibold text-red-600 dark:text-red-400">&rarr; 완전한 개인키 복원</p>
          </div>
        </div>

        {/* 실제 사례 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">실제 사례</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Sony PS3 (2010)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>ECDSA firmware 서명</li>
              <li>모든 서명에 같은 <code>k</code> 사용</li>
              <li>Master signing key 복원</li>
              <li>Custom firmware 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Bitcoin Android Wallet (2013)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>SecureRandom</code> 버그</li>
              <li>Nonce 재사용</li>
              <li>여러 지갑 도난</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Blockchain 거래 분석</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>수백 BTC 계좌에서 반복 nonce 발견</li>
              <li>지속적 자금 도난</li>
            </ul>
          </div>
        </div>

        {/* Deterministic ECDSA */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Deterministic ECDSA (RFC 6979)</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'k = \\text{HMAC}(\\text{priv}, \\text{hash}(m))'}</M> &mdash; nonce를 메시지와 개인키로 결정론적 도출. RNG 불필요, 재사용 불가능.
          </p>
          <div className="text-sm font-semibold mb-1">현대 권장</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Ed25519 (deterministic by design)</li>
            <li>RFC 6979 ECDSA</li>
            <li>Schnorr signatures</li>
          </ul>
        </div>

        {/* 기타 랜덤 실패 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">기타 랜덤 실패 사례</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Debian OpenSSL (2008)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Valgrind warning 제거 &rarr; entropy 0</li>
              <li>PID만으로 키 생성</li>
              <li>수백만 SSH/SSL 키 교체</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Dual_EC_DRBG (2013)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>NSA가 P, Q 파라미터 선택</li>
              <li>출력 예측 가능 의혹</li>
              <li>RSA가 $10M에 사용 권고</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Infineon ROCA (2017)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>RSA 키 생성 취약</li>
              <li>Estonian IDs 이동 필요</li>
              <li>10억 키 영향</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
