import M from '@/components/ui/math';

export default function EntropySource() {
  const sources = [
    { name: '하드웨어 (RDRAND/RDSEED)', desc: 'CPU 내장 열 잡음 기반 난수 명령어. Intel Ivy Bridge 이후 지원.', color: 'amber' },
    { name: '커널 이벤트', desc: '키보드·마우스 타이밍, 디스크 I/O 지터, 네트워크 인터럽트 간격 등.', color: 'indigo' },
    { name: '/dev/urandom (Linux)', desc: '커널 엔트로피 풀에서 ChaCha20 기반 CSPRNG으로 난수 생성. 블로킹 없이 항상 즉시 반환.', color: 'emerald' },
    { name: 'BCryptGenRandom (Windows)', desc: 'Windows CNG 프레임워크의 CSPRNG. AES-CTR-DRBG 기반.', color: 'emerald' },
  ];

  return (
    <section id="entropy-source" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">엔트로피 소스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          CSPRNG의 안전성은 시드의 엔트로피(무작위성)에 의존한다.
          <br />
          엔트로피가 부족하면 아무리 좋은 알고리즘이라도 출력이 예측 가능해진다.
          <br />
          2012년 연구에서 공유 호스팅 서버의 낮은 엔트로피로 수천 개의 RSA 키가 뚫린 사례가 있다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map(s => (
          <div key={s.name} className={`rounded-lg border border-${s.color}-500/20 bg-${s.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${s.color}-400`}>{s.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">엔트로피 측정과 수집</h3>

        {/* 엔트로피 개념 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-3">엔트로피 (Entropy) 정의</div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Shannon Entropy:</span>{' '}
              <M display>{'H(X) = -\\sum \\underbrace{p(x)}_{\\text{사건 확률}} \\cdot \\underbrace{\\log_2 p(x)}_{\\text{정보량 (bits)}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'H(X)'}</M>: 확률변수 <M>X</M>의 평균 불확실성. 모든 사건이 동일 확률이면 최대, 한 사건이 확실하면 0
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Min-Entropy (암호학 관점):</span>{' '}
              <M display>{'H_{\\min}(X) = -\\log_2(\\underbrace{\\max\\, p(x)}_{\\text{가장 높은 확률}})'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'H_{\\min}'}</M>: 최악의 경우 불확실성. 가장 예측하기 쉬운 사건의 확률만 고려 &mdash; CSPRNG 시드 품질 기준
              </p>
            </div>
            <p>
              <span className="font-medium text-foreground">Full entropy:</span>{' '}
              <M>{'H_{\\min}(X) = |X|'}</M> (모든 bit 독립)
            </p>
          </div>
        </div>

        {/* 엔트로피 소스 비교 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">엔트로피 소스 비교</h4>
        <div className="not-prose overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 font-semibold">소스</th>
                <th className="p-2 font-semibold">속도</th>
                <th className="p-2 font-semibold">품질</th>
                <th className="p-2 font-semibold">신뢰성</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-2">RDRAND</td><td className="p-2">매우빠름</td><td className="p-2">양호</td><td className="p-2">중간*</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">RDSEED</td><td className="p-2">빠름</td><td className="p-2">높음</td><td className="p-2">중간*</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Keyboard timing</td><td className="p-2">느림</td><td className="p-2">높음</td><td className="p-2">높음</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Disk I/O</td><td className="p-2">느림</td><td className="p-2">중간</td><td className="p-2">높음</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Network jitter</td><td className="p-2">중간</td><td className="p-2">중간</td><td className="p-2">높음</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Thermal noise HW</td><td className="p-2">중간</td><td className="p-2">매우높음</td><td className="p-2">매우높음</td></tr>
              <tr><td className="p-2">Quantum RNG</td><td className="p-2">느림</td><td className="p-2">완벽</td><td className="p-2">매우높음</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-1">* Intel backdoor 의혹 (추측)</p>
        </div>

        {/* 엔트로피 수집 단계 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">엔트로피 수집 단계</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 1</div>
            <div className="text-sm font-semibold mb-1">Raw Source 수집</div>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 2</div>
            <div className="text-sm font-semibold mb-1">Whitening</div>
            <p className="text-xs text-muted-foreground">von Neumann &mdash; Bias 제거</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 3</div>
            <div className="text-sm font-semibold mb-1">Conditioning</div>
            <p className="text-xs text-muted-foreground">SHA-256, BLAKE2 &mdash; Min-entropy 확보</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 4</div>
            <div className="text-sm font-semibold mb-1">DRBG 입력</div>
          </div>
        </div>

        {/* Linux Entropy Pool */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">Linux Entropy Pool</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><code>/dev/random</code>: entropy estimate 추적</li>
            <li>소스: Interrupts, I/O, typing, keyboard</li>
            <li>Debian/Ubuntu: <code>rngd</code> 서비스</li>
            <li>가상머신: <code>virtio-rng</code> driver</li>
          </ul>
        </div>

        {/* 진단 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">진단 도구</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><code>/proc/sys/kernel/random/entropy_avail</code> &mdash; Linux entropy pool 잔량 (256+ 유지 권장)</li>
            <li><code>rngtest</code>, <code>ent</code>, <code>Dieharder</code> &mdash; 품질 검증 도구</li>
          </ul>
        </div>

        {/* 공격 사례 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">공격 사례</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">2008 Debian OpenSSL</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Seed 공간 32,768로 축소</li>
              <li>수백만 RSA 키 compromised</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">2012 Heninger et al.</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>공유 호스팅 저엔트로피</li>
              <li>수천 키 동일 나머지</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">2013 PlayStation 3</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>ECDSA nonce 재사용</li>
              <li>Master signing key 복원</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
