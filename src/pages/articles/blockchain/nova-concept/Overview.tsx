import M from '@/components/ui/math';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'IVC & Folding Scheme'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IVC</strong> (Incrementally Verifiable Computation) — 길이 <M>{'N'}</M> 의 연쇄 계산
          <M>{' z_{i+1} = F(z_i, w_i)'}</M> 을 매 스텝마다 검증 가능하게 만드는 패러다임.
          핵심은 <strong>각 스텝의 증명이 이전 스텝까지의 누적 상태도 함께 인증</strong>하도록 만드는 것.
        </p>
        <p>
          순진한 재귀 SNARK 는 매 스텝마다 SNARK 1회 + 직전 SNARK 의 회로 내부 검증이 필요해
          <M>{' O(N \\cdot |F|)'}</M> 의 prover 비용 — 페어링/MSM 이 회로화되어 한 스텝이 수 분.
          반면 <strong>Folding</strong> 은 SNARK 를 만들지 않고 두 R1CS 인스턴스를 <em>직접 결합</em>해
          하나로 줄인다. 매 스텝 cost 는 MSM 1회와 도전값 1개로 일정.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Folding 의 직관</h3>
        <p>
          R1CS 인스턴스 <M>{'(U_1, W_1)'}</M> 와 <M>{'(U_2, W_2)'}</M> 가 모두 만족이라면, 검증자가 보낸
          랜덤 도전값 <M>r</M> 로 선형 결합해 <strong>하나의 인스턴스로 접는 것</strong>:
        </p>
        <M display>{'(\\underbrace{U_1 + r \\cdot U_2}_{\\text{instance 폴딩}}, \\; \\underbrace{W_1 + r \\cdot W_2}_{\\text{witness 폴딩}})'}</M>
        <p>
          만약 결합된 인스턴스가 <em>도</em> 만족이라는 게 검증된다면, Schwartz–Zippel 류 보조정리에 의해
          원래 두 인스턴스도 (압도적으로 높은 확률로) 모두 만족이었음이 보장된다.
          그런데 표준 R1CS 는 곱셈 제약 <M>{'(Az) \\circ (Bz) = Cz'}</M> 가 <strong>선형 결합에 닫혀 있지 않다</strong> —
          이게 다음 절의 동기.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 IVC + Folding 이 zkVM 에 결정적인가</h3>
        <p>
          ZkVM 한 번 실행 = 수백만 cycle. 매 cycle 마다 SNARK 를 만들면 비현실적이지만, folding 은 cycle 마다
          MSM 한 번이 전부. <strong>마지막에 단 한 번만</strong> 누적된 인스턴스를 SNARK (보통 Spartan) 으로 압축한다.
          최종 증명은 수 KB, 검증은 수 ms — 회로 길이 <M>N</M> 에 대수적으로만 의존.
        </p>
      </div>
    </section>
  );
}
