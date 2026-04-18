import M from '@/components/ui/math';
import UnitRootViz from './viz/UnitRootViz';

export default function UnitRoot() {
  return (
    <section id="unit-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">유한체 단위근 (Root of Unity)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          NTT의 핵심 &mdash; 재귀적으로 반씩 나눌 수 있는 단위근이 butterfly 분할을 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><UnitRootViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">단위근의 수학적 성질</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">정의</h4>
        <p>
          <M>{'\\omega'}</M>가 <M>{'\\mathbb{F}_p'}</M>에서 n차 단위근(primitive n-th root of unity)이려면:
        </p>
        <M display>{'\\underbrace{\\omega^n = 1}_{\\text{n번 거듭제곱하면 1}} \\quad \\text{이고} \\quad \\underbrace{\\omega^k \\neq 1}_{\\text{그 전에는 1이 아님}} \\;\\;(0 < k < n)'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'\\omega'}</M>: 원시(primitive) n차 단위근, 첫 번째 조건은 주기성, 두 번째 조건은 원시성(n보다 작은 주기 없음)을 보장
        </p>
        <p>
          존재 조건: <M>{'n \\mid (p - 1)'}</M>. <M>{'\\mathbb{F}_p^*'}</M>는 위수 <M>{'p-1'}</M>인 순환군이므로,
          생성원 g에 대해 <M>{'\\omega = g^{(p-1)/n}'}</M>이 원시 n차 단위근이다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">핵심 성질</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: 'ω^n = 1', desc: 'n번째 거듭제곱에서 1로 순환', color: 'indigo' },
          { name: 'ω^(n/2) = -1', desc: '반-회전은 부호 반전. butterfly의 핵심', color: 'emerald' },
          { name: 'ω^i = ω^(i mod n)', desc: '모든 거듭제곱이 {ω⁰, ..., ω^(n-1)}에 존재', color: 'amber' },
          { name: 'ω_n = (ω_{2n})²', desc: 'n차 단위근은 2n차의 제곱 → FFT의 재귀적 반분 가능', color: 'indigo' },
          { name: '합 항등식', desc: 'Σ (ω^j)^k = 0 (k≢0 mod n), = n (k≡0 mod n). FFT 직교성의 기초', color: 'emerald' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">FFT에 중요한 이유</h4>
        <p>
          Cooley-Tukey는 크기 n 문제를 2개의 <M>{'n/2'}</M> 문제로 분할한다.
          <M>{'\\omega_n^2 = \\omega_{n/2}'}</M>가 필요하므로 2-smooth 도메인(<M>{'n = 2^k'}</M>)이 필요하다.
          <br />
          홀수/일반 n에는 혼합기수 FFT(Bluestein, Rader)를 쓰지만 암호학에서는 드물다.
          대부분의 ZK 시스템은 <M>{'n = 2^k'}</M>와 2-smooth 체를 사용한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          예시: <M>{'\\mathbb{F}_{17}'}</M>
        </h4>
        <p>
          <M>{'p = 17'}</M>, <M>{'p - 1 = 16 = 2^4'}</M>. 생성원 <M>{'g = 3'}</M>
          (<M>{'3^1=3, 3^2=9, 3^4 \\equiv 13, 3^8 \\equiv 16, 3^{16} \\equiv 1'}</M>)
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        {[
          { n: '2', root: 'ω = 3⁸ = 16 = -1', color: 'indigo' },
          { n: '4', root: 'ω = 3⁴ = 13', color: 'emerald' },
          { n: '8', root: 'ω = 3² = 9', color: 'amber' },
          { n: '16', root: 'ω = 3¹ = 3', color: 'indigo' },
        ].map(p => (
          <div key={p.n} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-3`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>n={p.n}</p>
            <p className="text-xs mt-1 text-foreground/75">{p.root}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          검증 (n=4): <M>{'13^4 = 28561 \\equiv 1 \\pmod{17}'}</M>,
          <M>{'13^2 = 169 \\equiv 16 = -1 \\pmod{17}'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">원시근 찾기</h4>
        <p>
          1) <M>{'\\mathbb{F}_p^*'}</M>의 생성원 g를 찾는다 — 랜덤 <M>{'x \\in \\{2, \\ldots, p-1\\}'}</M>를 시도하고,
          <M>{'(p-1)'}</M>의 모든 소인수 q에 대해 <M>{'x^{(p-1)/q} \\neq 1'}</M>을 확인한다.
          <br />
          2) <M>{'\\omega = g^{(p-1)/n}'}</M>이 원시 n차 단위근이다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">2-adic 분해</h4>
        <p>
          소수 <M>{'p > 2'}</M>에 대해 <M>{'p - 1 = 2^s \\cdot t'}</M> (t 홀수). 2-adic 값 s가 최대 FFT 크기 <M>{'2^s'}</M>를 결정한다
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        {[
          { name: 'BN254', val: 's = 28' },
          { name: 'BLS12-381', val: 's = 32' },
          { name: 'Goldilocks', val: 's = 32' },
          { name: 'Pallas', val: 's = 32' },
        ].map((p, i) => (
          <div key={p.name} className={`rounded-lg border border-${['indigo','emerald','amber','indigo'][i]}-500/20 bg-${['indigo','emerald','amber','indigo'][i]}-500/5 p-3`}>
            <p className={`font-semibold text-sm text-${['indigo','emerald','amber','indigo'][i]}-400`}>{p.name}</p>
            <p className="text-xs mt-1 text-foreground/75">{p.val}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">NTT 친화적 소수</h4>
        <p>
          <M>{'p = k \\cdot 2^s + 1'}</M> 형태 (큰 s). Proth 소수라 한다.
          <br />
          예: <M>{'2^{61} + 2^{25} + 1'}</M> (polymath), <M>{'2^{32} - 2^{20} + 1'}</M> (Risc0),
          <M>{'M_{31} = 2^{31} - 1'}</M> (Circle STARK)
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Bit-reversal 순서</h4>
        <p>
          표준 FFT는 bit-reverse된 출력을 생성한다:
          입력 <code>[a₀, a₁, a₂, a₃]</code>(자연순) → 출력 <code>[f(w⁰), f(w²), f(w¹), f(w³)]</code>(bit-rev).
          <br />
          Butterfly 패턴이 쌍으로 동작하므로, bit-rev이 인접하게 배치한다.
          후처리로 bit-reversal permutation을 적용하거나, bit-rev NTT로 패턴을 역전시킨다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Frobenius 자기준동형</h4>
        <p>
          Frobenius <M>{'\\phi(x) = x^p'}</M>는 단위근에 <M>{'\\phi(\\omega) = \\omega^{p \\bmod n}'}</M>으로 작용한다.
          <M>{'n \\mid (p-1)'}</M>이면 <M>{'\\omega^p = \\omega'}</M>
          → 단위근이 Frobenius에 의해 고정 → 모두 기저체 <M>{'\\mathbb{F}_p'}</M>에 존재한다 (확장체 불필요)
        </p>
      </div>
    </section>
  );
}
