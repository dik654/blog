import M from '@/components/ui/math';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '왜 Bulletproofs 인가'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bulletproofs</strong> (Bünz et al. 2018) 는 <em>trusted setup 없이</em> 짧은 영지식 증명을 만드는 시스템.
          핵심 도구는 <strong>Inner Product Argument</strong> (IPA) — 두 벡터의 내적 관계를 <M>{'O(\\log n)'}</M> 크기로 증명하고
          이를 Range Proof, 산술 회로 등에 응용한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기존 시스템과의 비교</h3>
        <ul>
          <li>
            <strong>Groth16</strong>: 가장 짧은 증명 (3 EC 점) 이지만 회로마다 trusted setup ceremony 필요 →
            toxic waste <M>{'\\tau, \\alpha, \\beta'}</M> 가 유출되면 가짜 증명 생성 가능.
          </li>
          <li>
            <strong>PLONK</strong>: universal trusted setup (한 번이면 모든 회로 재사용) 이지만 여전히 setup 필요.
          </li>
          <li>
            <strong>Bulletproofs</strong>: <em>setup 자체가 없음</em>. 검증자도 증명자도 동일한 공개 생성원만 알면 끝.
            대신 검증 시간이 회로 크기에 선형 — large 회로에는 부적합, range proof 같은 작은 statement 에 최적.
          </li>
          <li>
            <strong>STARK</strong>: 마찬가지로 transparent 지만 증명 크기가 KB 단위로 큼. Bulletproofs 가 훨씬 짧다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">두 가지 핵심 기여</h3>
        <ol>
          <li>
            <strong>Inner Product Argument</strong> — 두 벡터 <M>{'\\mathbf{a}, \\mathbf{b} \\in \\mathbb{F}^n'}</M> 의 내적
            <M>{' c = \\langle \\mathbf{a}, \\mathbf{b} \\rangle'}</M> 가 주어졌다고 주장. naive 하게는 <M>n</M> 개 스칼라를 보여야 하지만
            IPA 는 재귀적으로 절반씩 접어 <M>{'O(\\log n)'}</M> 크기로 압축.
          </li>
          <li>
            <strong>Range Proof</strong> — 비밀 값 <M>v</M> 가 <M>{'[0, 2^n)'}</M> 안에 있다는 사실을 비트 분해 + 다항식
            동치성 변환 + IPA 로 증명. Confidential Transactions, Mimblewimble, Monero 의 기반.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용처</h3>
        <p>
          - <strong>Confidential Transactions</strong>: 비트코인 sidechain (Liquid) 의 비밀 금액 거래.<br />
          - <strong>Monero RingCT</strong>: 거래 금액의 양수성 + 합 일치 증명 (<M>{'\\sum \\text{입력} = \\sum \\text{출력}'}</M>).<br />
          - <strong>Aggregable proofs</strong>: <M>m</M> 개 range proof 를 하나로 모아 <M>{'O(\\log n + \\log m)'}</M> 증명 크기.<br />
          - <strong>회로 SNARK 대안</strong>: trusted setup 회피가 우선이고 검증 시간이 그렇게 안 중요한 도메인.
        </p>
      </div>
    </section>
  );
}
