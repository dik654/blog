import M from '@/components/ui/math';

export default function NIFS({ title }: { title?: string }) {
  return (
    <section id="nifs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NIFS — Non-Interactive Folding Scheme'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>NIFS</strong> (Kothapalli, Setty, Tzialla 2021) 는 두 Relaxed R1CS 인스턴스를 단 한 번의 메시지로
          접는 비대화형 프로토콜. 핵심은 (1) Prover 가 교차항 커밋 <M>{'\\overline{T}'}</M> 를 보내고,
          (2) Fiat–Shamir 로 도전값 <M>r</M> 을 유도해, (3) instance/witness 를 선형 결합하는 것.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Prover 의 한 라운드</h3>
        <p>
          누적된 인스턴스 <M>{'(U_1, W_1)'}</M> 와 새 인스턴스 <M>{'(U_2, W_2)'}</M> 가 주어진다 (둘 다 Relaxed R1CS 만족).
        </p>
        <ol>
          <li>
            <strong>교차항 계산</strong> — <M>{'T = (A z_1) \\circ (B z_2) + (A z_2) \\circ (B z_1) - u_1 \\cdot C z_2 - u_2 \\cdot C z_1'}</M>.
            (관계식 <M>{'(Az) \\circ (Bz) = u \\cdot Cz + E'}</M> 의 1차 항)
          </li>
          <li>
            <strong>커밋 전송</strong> — <M>{'\\overline{T} = \\mathrm{Commit}(T, r_T)'}</M> 를 transcript 에 흡수.
          </li>
          <li>
            <strong>도전값 유도</strong> — <M>{'r = \\mathrm{Hash}(\\text{transcript})'}</M> (Fiat–Shamir).
          </li>
          <li>
            <strong>결합</strong>:
          </li>
        </ol>
        <M display>{'\\begin{aligned} U\' &= \\underbrace{U_1 + r \\cdot U_2}_{\\text{instance 결합}} \\\\ \\overline{E\'} &= \\overline{E_1} + r \\cdot \\overline{T} + r^2 \\cdot \\overline{E_2} \\quad \\text{(error 누적)} \\\\ u\' &= u_1 + r \\cdot u_2 \\quad \\text{(스케일)} \\\\ \\overline{W\'} &= \\overline{W_1} + r \\cdot \\overline{W_2} \\quad \\text{(witness 커밋)} \\end{aligned}'}</M>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 의 일</h3>
        <p>
          Verifier 는 witness 를 보지 않는다. <M>{'\\overline{T}'}</M> 만 받고, 같은 도전값 <M>r</M> 을 유도한 뒤,
          위의 instance 측 식을 <strong>커밋 위에서 그대로 계산</strong>한다 — Pedersen 동형성 덕분에 가능.
          Folding 1회 = MSM 한 번. 표준 SNARK verify (페어링/MSM 회로화) 와 비교 불가하게 싸다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">정확성 (Knowledge Soundness) 직관</h3>
        <p>
          어느 한쪽 인스턴스가 거짓이라면, 결합된 인스턴스가 만족이 되려면 특수한 <M>r</M> 값이 필요하다.
          그런 <M>r</M> 의 집합 크기는 <M>{'\\le 2'}</M> (2차 다항식의 근) — Schwartz–Zippel 에 의해 균일 랜덤
          <M>{'r \\in \\mathbb{F}'}</M> 에서 그 집합에 떨어질 확률 <M>{'\\le 2 / |\\mathbb{F}|'}</M>. 256-bit field 면 무시 가능.
          따라서 <strong>결합 인스턴스가 만족이면 양쪽 다 만족이었던 것</strong> 이 압도적 확률로 추출된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">반복 적용 — 누적 IVC</h3>
        <p>
          step <M>i</M> 의 누적 인스턴스 <M>{'(U^{(i)}, W^{(i)})'}</M> 와 새 step 인스턴스 <M>{'(u^{(i)}, w^{(i)})'}</M> 를
          NIFS 로 접어 <M>{'(U^{(i+1)}, W^{(i+1)})'}</M> 로 갱신. 누적 인스턴스 크기는 step 수에 무관 — IVC 의 핵심 성질.
          최종 step 에서 <M>{'(U^{(N)}, W^{(N)})'}</M> 을 SNARK (Spartan, Hyrax, …) 로 압축해 짧은 증명 출력.
        </p>
      </div>
    </section>
  );
}
