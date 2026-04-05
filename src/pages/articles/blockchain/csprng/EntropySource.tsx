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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 엔트로피 (Entropy) 개념
//
// Shannon Entropy:
//   H(X) = -Σ p(x) · log₂ p(x)  [bits]
//
// Min-Entropy (암호학 관점):
//   H_min(X) = -log₂(max p(x))
//   - 최악의 경우 불확실성
//   - CSPRNG 시드 품질 기준
//
// Full entropy:
//   H_min(X) = |X|  (모든 bit 독립)

// 엔트로피 소스 비교:
//
// ┌─────────────────┬──────────┬──────────┬────────┐
// │    소스         │ 속도     │ 품질     │ 신뢰성 │
// ├─────────────────┼──────────┼──────────┼────────┤
// │ RDRAND          │ 매우빠름 │ 양호     │ 중간*  │
// │ RDSEED          │ 빠름     │ 높음     │ 중간*  │
// │ Keyboard timing │ 느림     │ 높음     │ 높음   │
// │ Disk I/O        │ 느림     │ 중간     │ 높음   │
// │ Network jitter  │ 중간     │ 중간     │ 높음   │
// │ Thermal noise HW│ 중간     │ 매우높음 │ 매우높음│
// │ Quantum RNG     │ 느림     │ 완벽     │ 매우높음│
// └─────────────────┴──────────┴──────────┴────────┘
//
// * Intel backdoor 의혹 (추측)

// Linux Entropy Pool:
//   - /dev/random: entropy estimate 추적
//   - Interrupts, I/O, typing, keyboard
//   - Debian/Ubuntu: rngd 서비스
//   - 가상머신: virtio-rng driver

// 엔트로피 수집 단계:
//   1. Raw source 수집
//   2. Whitening (von Neumann)
//      - Bias 제거
//   3. Conditioning (hash)
//      - SHA-256, BLAKE2
//      - Min-entropy 확보
//   4. DRBG 입력

// 진단:
//   /proc/sys/kernel/random/entropy_avail
//   - Linux entropy pool 잔량
//   - 256+ 유지 권장
//
//   rngtest, ent, Dieharder
//   - 품질 검증 도구

// 공격 사례:
//   2008 Debian OpenSSL bug
//     - Seed 공간 32768로 축소
//     - 수백만 RSA 키 compromised
//   2012 Heninger et al.
//     - 공유 호스팅 저엔트로피
//     - 수천 키 동일 나머지
//   2013 PlayStation 3
//     - ECDSA nonce 재사용
//     - Master signing key 복원`}
        </pre>
      </div>
    </section>
  );
}
