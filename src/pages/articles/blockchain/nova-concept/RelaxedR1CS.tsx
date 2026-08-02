import M from '@/components/ui/math';

export default function RelaxedR1CS({ title }: { title?: string }) {
  return (
    <section id="relaxed-r1cs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Relaxed R1CS — 폴딩에 닫힌 형태'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          표준 R1CS 의 만족식은:
        </p>
        <M display>{'\\underbrace{(A z) \\circ (B z)}_{\\text{좌·우변 곱 (Hadamard)}} = \\underbrace{C z}_{\\text{출력}}'}</M>
        <p>
          여기서 <M>{'z = (1, x, w)'}</M> 는 1, 공개 입력, witness 를 이어 붙인 벡터.
          <strong>폴딩에 닫혀 있지 않다</strong>는 게 문제 — 두 만족 인스턴스 <M>{'z_1, z_2'}</M> 의 선형 결합
          <M>{' z = z_1 + r z_2'}</M> 를 양변에 대입하면 좌변에 추가로 <M>{' r \\cdot T'}</M> 항이 끼어들어 등식이 깨진다 (<M>{'T'}</M> = 교차항).
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">교차항이 생기는 이유</h3>
        <p>
          좌변을 전개하면:
        </p>
        <M display>{'(A z) \\circ (B z) = \\underbrace{(A z_1) \\circ (B z_1)}_{= C z_1} + r \\cdot \\underbrace{T}_{\\text{교차항}} + r^2 \\cdot \\underbrace{(A z_2) \\circ (B z_2)}_{= C z_2}'}</M>
        <p>
          <M>{'T = (A z_1) \\circ (B z_2) + (A z_2) \\circ (B z_1)'}</M>.
          우변은 <M>{'C z_1 + r^2 \\cdot C z_2'}</M> — 항 차수가 0차와 2차뿐이라 1차 교차항이 흡수될 자리가 없다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">두 가지 자유도 추가 — u 와 E</h3>
        <p>
          Relaxed R1CS 는 두 개의 슬롯을 추가해 폴딩에 닫힌 형태를 만든다:
        </p>
        <M display>{'(A z) \\circ (B z) = \\underbrace{u}_{\\text{스케일 스칼라}} \\cdot (C z) + \\underbrace{E}_{\\text{에러 벡터 (폴딩 누적용)}}'}</M>
        <p>
          - <M>{'u \\in \\mathbb{F}'}</M> 는 차수 보정용 스케일 — 폴딩 시 <M>{"u' = u_1 + r \\cdot u_2"}</M>.
          표준 R1CS 는 <M>{'u = 1, E = 0'}</M> 인 특수 경우.<br />
          - <M>{'E \\in \\mathbb{F}^m'}</M> 는 교차항 흡수용 에러 벡터 — 폴딩 시 <M>{"E' = E_1 + r \\cdot T + r^2 \\cdot E_2"}</M>.
        </p>
        <p>
          이 두 자유도 덕분에 <strong>두 Relaxed R1CS 인스턴스의 선형 결합도 Relaxed R1CS</strong> 가 된다 →
          폴딩에 닫혀 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pedersen 동형성이 만드는 효율</h3>
        <p>
          witness <M>W</M> 자체를 폴딩하면 <M>O(|W|)</M> 데이터를 매 스텝 옮겨야 하는데, Nova 는 대신
          <strong>witness 의 Pedersen 커밋</strong>만 다룬다. Pedersen 은 덧셈에 대해 동형:
        </p>
        <M display>{'\\underbrace{\\mathrm{Commit}(W_1) + r \\cdot \\mathrm{Commit}(W_2)}_{\\text{커밋 위에서 직접 결합}} = \\underbrace{\\mathrm{Commit}(W_1 + r W_2)}_{\\text{결합된 W 의 커밋과 동일}}'}</M>
        <p>
          검증자는 <M>W</M> 자체를 보지 않고 두 커밋의 선형 결합만으로 새 인스턴스의 커밋을 직접 계산한다 →
          폴딩 1회 = MSM 1회. KZG 도 동형이지만 trusted setup 이 필요해 Nova 는 IPA 기반 Pedersen 사용.
        </p>
      </div>
    </section>
  );
}
