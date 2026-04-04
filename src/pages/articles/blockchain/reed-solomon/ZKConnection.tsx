import Math from '@/components/ui/math';

export default function ZKConnection() {
  const pipeline = [
    { step: '1. AIR Trace 생성', desc: '실행 트레이스의 각 열을 다항식 계수로 해석한다', color: 'indigo' },
    { step: '2. RS 인코딩', desc: '다항식을 blowup factor만큼 큰 도메인에서 평가 → RS 코드워드 생성', color: 'emerald' },
    { step: '3. Merkle 커밋', desc: '코드워드를 Merkle 트리에 커밋하여 나중에 특정 위치를 열 수 있게 한다', color: 'amber' },
    { step: '4. FRI 검증', desc: '커밋된 값이 낮은 차수 다항식의 평가값에 "가까운지" 확인한다', color: 'indigo' },
  ];

  return (
    <section id="zk-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZKP에서의 역할</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 ZKP에 Reed-Solomon이 필요한가?</h3>
        <p>
          ZKP(특히 STARK)의 핵심 질문은 "증명자가 커밋한 값이 정말 낮은 차수 다항식의 평가값인가?"이다.
          <br />
          이 질문은 곧 "커밋된 벡터가 유효한 RS 코드워드인가?"와 동일하다
        </p>
        <p>
          차수 <Math>{'d'}</Math> 다항식을 <Math>{'n \\gg d'}</Math>개 점에서 평가한 벡터가 RS 코드워드다.
          <br />
          유효한 코드워드는 전체 가능한 벡터 중 극소수이므로,
          부정직한 증명자가 우연히 유효한 코드워드를 만들 확률은 극히 낮다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RS 근접성과 차수 바운드</h3>
        <p>
          <a href="/crypto/fri" className="text-indigo-400 hover:underline">FRI (Fast Reed-Solomon IOP of Proximity)</a>는
          벡터가 RS 코드에 "가까운지" 테스트한다.
          <br />
          "가깝다" = 소수의 위치만 바꾸면 유효한 코드워드가 되는 상태
        </p>
        <p>
          RS 코드워드와의 거리 <Math>{'\\delta'}</Math>가 작으면 → 해당 벡터를 만든 다항식의 차수가 <Math>{'d'}</Math> 이하임이 보장된다.
          <br />
          이것이 STARK에서 "다항식 차수 바운드 검증"의 본질이다:
        </p>
        <Math display>{'\\text{deg}(f) \\leq d \\;\\Longleftrightarrow\\; \\text{eval}(f) \\in \\text{RS}[\\mathbb{F}, D, d+1]'}</Math>
        <p>
          <Math>{'D'}</Math>는 평가 도메인, <Math>{'d+1'}</Math>은 코드의 차원(메시지 길이)이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">STARK 파이프라인에서의 RS</h3>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-4">
        {pipeline.map(p => (
          <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Blowup Factor</h3>
        <p>
          차수 <Math>{'d'}</Math> 다항식을 <Math>{'\\rho \\cdot d'}</Math>개 점에서 평가할 때,
          <Math>{'\\rho'}</Math>를 blowup factor라 한다 (보통 2~8).
          <br />
          RS 코드의 rate <Math>{'k/n = 1/\\rho'}</Math>가 낮을수록 에러 감지 능력이 강해지지만,
          증명 크기와 검증자 비용이 커진다
        </p>
        <p>
          <a href="/crypto/fri" className="text-indigo-400 hover:underline">FRI 아티클</a>에서
          이 RS 코드워드에 대한 근접성 테스트가 어떻게 재귀적 접기(folding)로 동작하는지 다룬다
        </p>
      </div>
    </section>
  );
}
