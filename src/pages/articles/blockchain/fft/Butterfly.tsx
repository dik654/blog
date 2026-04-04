import Math from '@/components/ui/math';

export default function Butterfly() {
  return (
    <section id="butterfly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Butterfly 분할</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cooley-Tukey 알고리즘은 DFT를 <strong>재귀적으로 반씩 나누어</strong>{' '}
          <Math>{'O(n^2)'}</Math>를 <Math>{'O(n \\log n)'}</Math>으로 줄인다.
          <br />
          핵심 관찰: n점 DFT를 짝수/홀수 인덱스로 분리하면 n/2점 DFT 2개로 환원된다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">짝수/홀수 분할</h3>
        <p>
          <Math>{'f(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3'}</Math>을 다시 쓰면:
        </p>
        <Math display>{'f(x) = \\underbrace{(a_0 + a_2 x^2)}_{f_{\\text{even}}(x^2)} + x \\cdot \\underbrace{(a_1 + a_3 x^2)}_{f_{\\text{odd}}(x^2)}'}</Math>
        <p>
          <Math>{'f_{\\text{even}}(t) = a_0 + a_2 t'}</Math>, <Math>{'f_{\\text{odd}}(t) = a_1 + a_3 t'}</Math>로 놓으면
          <br />
          <Math>{'f(x) = f_{\\text{even}}(x^2) + x \\cdot f_{\\text{odd}}(x^2)'}</Math>
          <br />
          n차 문제가 n/2차 문제 2개로 줄었다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Twiddle Factor</h3>
        <p>
          평가점 <Math>{'\\omega^k'}</Math>를 대입하면:
        </p>
        <Math display>{'f(\\omega^k) = f_{\\text{even}}(\\omega^{2k}) + \\omega^k \\cdot f_{\\text{odd}}(\\omega^{2k})'}</Math>
        <p>
          여기서 <Math>{'\\omega^k'}</Math>가 <strong>twiddle factor</strong>다.
          <br />
          단위근의 성질 <Math>{'\\omega^{n/2} = -1'}</Math>을 이용하면
          하반부(<Math>{'k \\geq n/2'}</Math>)는 추가 계산 없이 얻는다:
        </p>
        <Math display>{'f(\\omega^{k+n/2}) = f_{\\text{even}}(\\omega^{2k}) - \\omega^k \\cdot f_{\\text{odd}}(\\omega^{2k})'}</Math>
        <p>
          덧셈 한 번, 뺄셈 한 번으로 2개의 결과를 동시에 얻는 구조 — 이것이 <strong>butterfly</strong>다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          수치 예시: <Math>{'\\mathbb{F}_{17}'}</Math>, n=4, <Math>{'\\omega=4'}</Math>
        </h3>
        <p>
          입력 계수 <Math>{'[a_0, a_1, a_2, a_3] = [1, 2, 3, 4]'}</Math>.
          <br />
          짝수 부분: <Math>{'f_e(t) = 1 + 3t'}</Math>, 홀수 부분: <Math>{'f_o(t) = 2 + 4t'}</Math>
        </p>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          {[
            {
              step: '1단계 — n/2점 DFT (ω²=16 기준)',
              desc: 'f_e(1)=4, f_e(16)=1+48≡15. f_o(1)=6, f_o(16)=2+64≡15',
              color: 'indigo',
            },
            {
              step: '2단계 — Butterfly 결합',
              desc: 'f(ω⁰) = 4+1·6=10, f(ω²) = 4-1·6=-2≡15. f(ω¹) = 15+4·15=75≡7, f(ω³) = 15-4·15=-45≡6',
              color: 'emerald',
            },
            {
              step: '결과',
              desc: '[f(1), f(4), f(16), f(13)] = [10, 7, 15, 6] — DFT 직접 계산과 동일',
              color: 'amber',
            },
          ].map(p => (
            <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
        <p>
          n/2점 DFT 2개 + butterfly 결합 = 총 <Math>{'O(n \\log n)'}</Math>.
          <br />
          재귀적으로 계속 반씩 나누면 <Math>{'\\log_2 n'}</Math> 단계, 각 단계 <Math>{'O(n)'}</Math> 연산이다
        </p>
      </div>
    </section>
  );
}
