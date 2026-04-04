import Math from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FRI란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FRI(Fast Reed-Solomon Interactive Oracle Proof of Proximity)는
          <strong> 다항식 차수 바운드를 효율적으로 검증</strong>하는 프로토콜이다.
          <br />
          Ben-Sasson, Bentov, Horesh, Riabzev가 2018년에 제안했다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 FRI가 필요한가?</h3>
        <p>
          STARK 증명에서 증명자(Prover)는 실행 트레이스를 다항식으로 인코딩한다.
          <br />
          검증자(Verifier)는 이 다항식의 차수가 <Math>{'d'}</Math> 미만인지 확인해야 한다.
          <br />
          문제는 다항식 전체를 읽으면 <Math>{'O(d)'}</Math>개 값을 확인해야 한다는 것이다.
          <br />
          FRI는 <strong>전체를 읽지 않고</strong> <Math>{'O(\\log d)'}</Math>개 쿼리만으로 검증한다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 아이디어: 재귀적 차수 축소</h3>
        <p>
          차수 <Math>{'d'}</Math>인 다항식을 차수 <Math>{'d/2'}</Math> 문제로 바꾼다.
          <br />
          다시 <Math>{'d/2'}</Math>를 <Math>{'d/4'}</Math>로, <Math>{'d/4'}</Math>를 <Math>{'d/8'}</Math>로 줄인다.
          <br />
          <Math>{'\\log_2 d'}</Math>번 반복하면 상수 다항식이 되어 직접 확인할 수 있다
        </p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            {
              name: '나이브 방법',
              desc: 'd+1개 점을 읽고 보간 → O(d) 쿼리',
              color: 'amber',
            },
            {
              name: 'FRI',
              desc: '재귀적 접기 + 랜덤 챌린지 → O(log d) 쿼리',
              color: 'emerald',
            },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">FRI의 위치</h3>
        <p>
          FRI는{' '}
          <a href="/crypto/reed-solomon" className="text-indigo-400 hover:underline">Reed-Solomon 부호</a>
          의 근접성(proximity)을 검증하는 IOP다.
          <br />
          STARK, Plonky2, Plonky3 등 <strong>투명 셋업(transparent setup)</strong> 증명 시스템의 핵심 빌딩 블록이다.
          <br />
          KZG 커밋먼트가 페어링 기반이라면, FRI는 해시 기반 — trusted setup이 필요 없다
        </p>
      </div>
    </section>
  );
}
