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
    </section>
  );
}
