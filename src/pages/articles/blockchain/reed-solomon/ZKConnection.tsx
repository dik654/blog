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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">STARK에서 RS 코드의 상세 역할</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">핵심 철학</h4>
        <p>
          "다항식 차수 바운드" ↔ "RS 코드워드".
          <Math>{'f'}</Math>의 차수가 <Math>{'< d'}</Math>이면, 크기 n 도메인 D에서의 평가값은
          <Math>{'\\text{RS}(n, d)'}</Math> 코드워드다.
          <br />
          RS 코드의 거리 = <Math>{'n - d + 1'}</Math> (MDS). 코드워드에서 멀다 = 낮은 차수 다항식에서 멀다 → 근접성 테스트의 건전성
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">일반적 STARK 파라미터</h4>
        <p>
          트레이스 도메인 <Math>{'|H| = 2^k'}</Math> (보통 <Math>{'2^{16}'}</Math> ~ <Math>{'2^{20}'}</Math>).
          평가 도메인 <Math>{'|D| = |H| \\cdot \\rho'}</Math>.
          코드 레이트 <Math>{'1/\\rho'}</Math> (낮을수록 중복 많음).
          거리 <Math>{'\\approx (1 - 1/\\rho) \\cdot |D|'}</Math>
        </p>
      </div>

      <div className="not-prose rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 my-3">
        <p className="font-semibold text-sm text-indigo-400">예시 (소형 STARK)</p>
        <p className="text-sm mt-1.5 text-foreground/75">
          |H| = 2^14, rho = 8 → |D| = 2^17 = 131,072. rate = 0.125. distance ≈ 114,688
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">FRI: RS 근접성 테스트</h4>
        <p>
          입력: 함수 <Math>{'f: D \\to \\mathbb{F}'}</Math>에 대한 오라클.
          주장: f가 RS 코드워드(차수 <Math>{'< d'}</Math>)에 가깝다
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { step: '라운드 i', desc: '검증자가 랜덤 λ_i 전송 → 증명자가 fold(f, λ_i)를 반으로 줄인 도메인에서 전송', color: 'indigo' },
          { step: 'log(d) 라운드 후', desc: '최종 다항식은 상수(차수 0). 검증자가 일관성 확인', color: 'emerald' },
          { step: '건전성', desc: 'f가 코드워드에서 δ만큼 멀면, 검증자가 확률 ≥ 1-(1-δ)^queries로 거부', color: 'amber' },
        ].map(p => (
          <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">Blowup factor 트레이드오프</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">rho = 2 (높은 레이트)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            증명 크기 작음, 프로버 빠름.
            건전성 약함(더 많은 쿼리 필요), Johnson 이상 보안에 추측 필요
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">rho = 8 (일반적)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            균형. 40-80 쿼리로 80-100 bit 보안
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-semibold text-sm text-amber-400">rho = 16-32 (낮은 레이트)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            강한 건전성, 증명 가능한 보안.
            더 큰 증명, 느린 프로버(평가점 증가)
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">구현 예시</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">Plonky2 (Polygon Zero)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            Goldilocks 체. rho = 1/8. FRI 쿼리 28-84. 2-adic 부분군 최대 2^32
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">Winterfell (Meta)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            설정 가능한 blowup factor. 어셈블리 수준 RS/FRI 코드. STARK 프로버 최적화
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">DEEP-FRI 최적화</h4>
        <p>
          바닐라 FRI는 rho-commit을 두 번 수행하여 증명 크기가 ~2배.
          DEEP-FRI(Ben-Sasson et al.)는 quotient/DEEP-ALI를 단일 RS 체크로 지연시켜 ~30% 증명 크기 감소.
          StarkNet, StarkEx에서 사용
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">리스트 디코딩과의 연결</h4>
        <p>
          Johnson 한계: <Math>{'\\delta < 1 - \\sqrt{\\rho}'}</Math>. 리스트 디코딩으로 여러 RS 코드워드가 근처에 존재할 수 있다.
          <br />
          추측 한계: <Math>{'\\delta < 1 - \\rho - \\epsilon'}</Math>. 미증명이므로 "RS 근접성 갭" 추측이 필요하다.
          <br />
          참고: Ben-Sasson et al. "DEEP-FRI"(2019), "Proximity gaps for RS codes"(2020)
        </p>
      </div>
    </section>
  );
}
