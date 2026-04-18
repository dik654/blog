import Math from '@/components/ui/math';

export default function Overview() {
  const useCases = [
    { name: 'CD / DVD', desc: '스크래치로 손상된 비트를 자동 복구한다', color: 'indigo' },
    { name: 'QR 코드', desc: '일부가 가려져도 원본 데이터를 복원한다', color: 'emerald' },
    { name: '심우주 통신', desc: 'Voyager, Mars Rover 등 NASA 탐사선이 수십억 km 너머로 데이터를 전송할 때 사용한다', color: 'amber' },
    { name: 'ZKP (STARK)', desc: '다항식 차수 바운드 검증에 Reed-Solomon 근접성 테스트(FRI)를 사용한다', color: 'indigo' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reed-Solomon이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">동기: 데이터 전송과 오류</h3>
        <p>
          통신 채널은 완벽하지 않다. 우주 방사선, 디스크 스크래치, 네트워크 잡음 — 전송 중 데이터가 깨질 수 있다.
          <br />
          단순히 데이터를 두 번 보내면 어디가 틀렸는지 알 수 없다.
          <br />
          세 번 보내면 다수결로 복구할 수 있지만, 대역폭을 3배 소모한다
        </p>
        <p>
          Reed-Solomon 부호는 <strong>수학적으로 최소한의 중복</strong>만 추가하여
          오류를 감지하고 복구하는 방법이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 아이디어</h3>
        <p>
          차수 <Math>{'d'}</Math>인 다항식은 <Math>{'d+1'}</Math>개의 점으로 유일하게 결정된다.
          <br />
          이것이{' '}
          <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>의 핵심이다
        </p>
        <p>
          메시지가 <Math>{'k'}</Math>개 심볼이면, 이를 차수 <Math>{'k-1'}</Math> 다항식의 계수로 삼는다.
          <br />
          이 다항식을 <Math>{'n > k'}</Math>개 점에서 평가하면 <Math>{'n'}</Math>개의 값(코드워드)을 얻는다.
          <br />
          <Math>{'n - k'}</Math>개의 추가 값이 중복(redundancy)이다 — 이것으로 오류를 감지하고 복구한다
        </p>
        <Math display>{'k \\text{개 메시지} \\xrightarrow{\\text{다항식 평가}} n \\text{개 코드워드} \\quad (n - k \\text{개 중복})'}</Math>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-3">어디에 쓰이는가?</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {useCases.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reed-Solomon 역사</h3>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { year: '1960', desc: 'Irving Reed & Gustave Solomon (MIT Lincoln Lab). "Polynomial codes over certain finite fields" 논문', color: 'indigo' },
          { year: '1969', desc: 'Berlekamp 알고리즘 — 실용적 디코딩이 가능해짐', color: 'emerald' },
          { year: '1975', desc: 'Welch-Berlekamp 알고리즘. O(n²) 시간 복잡도로 효율적 디코딩', color: 'amber' },
          { year: '1986', desc: 'Voyager 2 천왕성 근접비행. 32억 km 거리의 데이터를 RS 코딩으로 복원', color: 'indigo' },
          { year: '1990s', desc: 'CD/DVD 표준화. 모든 광학 매체에 CIRC(Cross-Interleaved RS) 적용', color: 'emerald' },
          { year: '2018', desc: 'STARK (Ben-Sasson et al.). RS 코드의 근접성 테스트(FRI) 기반 ZK 시스템', color: 'amber' },
        ].map(p => (
          <div key={p.year} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.year}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h3 className="text-xl font-semibold mt-6 mb-3">수학적 기반</h3>
        <p>
          RS 코드 <Math>{'\\text{RS}(n, k, d)'}</Math>:
          <Math>{'n'}</Math> = 코드워드 길이, <Math>{'k'}</Math> = 메시지 길이,
          <Math>{'d = n - k + 1'}</Math> = 최소 거리.
          <br />
          MDS(Maximum Distance Separable) 코드 — 주어진 중복도에서 최대 에러 감지/정정 능력을 달성한다
        </p>
        <Math display>{'t = \\left\\lfloor \\frac{n-k}{2} \\right\\rfloor \\text{ 개 에러 정정,} \\quad n-k \\text{ 개 소거(erasure) 정정}'}</Math>
        <p>
          체 선택: <Math>{'p > n'}</Math>인 <Math>{'\\mathbb{F}_p'}</Math>.
          일반적으로 <Math>{'\\mathbb{F}_{2^8}'}</Math>(바이트 단위) 또는
          <Math>{'\\mathbb{F}_p'}</Math> (<Math>{'p \\sim 2^{256}'}</Math>, ZK용)
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">디코딩 알고리즘 진화</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: 'Berlekamp-Massey', desc: 'O(n²). 고전적 LFSR 기반 디코딩', color: 'indigo' },
          { name: '유클리드 알고리즘', desc: 'O(n²). 다항식 GCD 기반 접근', color: 'emerald' },
          { name: 'Guruswami-Sudan', desc: 'O(n⁴). 리스트 디코딩 — t 바운드를 초과하는 에러 처리', color: 'amber' },
          { name: 'Koetter-Vardy', desc: '소프트 디코딩. 신뢰도 정보 활용', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">응용별 설정</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">CD 오디오</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            RS(32,28) + RS(28,24). Cross-interleaved. 4000+ bit 버스트 에러 처리
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">QR 코드</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            블록당 다중 RS 코드. 에러 정정 수준: L(7%), M(15%), Q(25%), H(30%)
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-semibold text-sm text-amber-400">Voyager</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            RS(255,223). 합성곱 코드와 연접. 16개 심볼 에러 복구 가능
          </p>
        </div>
      </div>
    </section>
  );
}
