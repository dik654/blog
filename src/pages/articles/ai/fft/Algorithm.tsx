import ExplainedFormula from "@/components/ui/explained-formula";
import FFTReuseViz from "./viz/FFTReuseViz";

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Cooley–Tukey는 같은 sub-DFT를 두 output에 재사용한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Direct DFT는 N개의 k마다 N개 sample과 basis를 다시 곱하므로 연산량이 O(N²)이 된다. 그러나 roots of unity에는 주기성과 대칭성이 있어서
          N-point transform을 factor N=N₁N₂에 맞춰 더 작은 transform으로 쪼갤 수 있다. 가장 이해하기 쉬운 radix-2 decimation-in-
          time은 입력 index를 even과 odd로 나눈다.
        </p>
      </div>

      <ExplainedFormula
        question="N-point DFT를 두 개의 N/2-point DFT로 나눠도 같은 X[k]를 얻을 수 있을까?"
        idea={<>Input index n을 2m과 2m+1로 나눕니다. N-point root를 제곱하면 N/2-point root가 되므로 두 합은 각각 even·odd sample의 N/2-point DFT가 되고, odd 결과에 twiddle factor만 곱해 다시 합칠 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\omega_N&=e^{-i2\pi/N}\\[2pt]E[k]&=\sum_{m=0}^{N/2-1}x[2m]\omega_{N/2}^{mk}\\[2pt]O[k]&=\sum_{m=0}^{N/2-1}x[2m+1]\omega_{N/2}^{mk}\\[3pt]X[k]&=E[k]+\omega_N^kO[k]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\omega_N&=\underbrace{e^{-i2\pi/N}}_{\text{기준량당 비율}}\\[2pt]E[k]&=\underbrace{\sum_{m=0}^{N/2-1}x[2m]\omega_{N/2}^{mk}}_{\text{기준량당 비율}}\\[2pt]O[k]&=\underbrace{\sum_{m=0}^{N/2-1}x[2m+1]\omega_{N/2}^{mk}}_{\text{기준량당 비율}}\\[3pt]X[k]&=E[k]+\omega_N^kO[k]\end{aligned}`}
        operations={[
          { expression: String.raw`e^{-i2\pi/N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Input index n을 2m과 2m+1로 나눕니다."] },
          { expression: String.raw`\sum_{m=0}^{N/2-1}x[2m]\omega_{N/2}^{mk}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Input index n을 2m과 2m+1로 나눕니다."] },
          { expression: String.raw`\sum_{m=0}^{N/2-1}x[2m+1]\omega_{N/2}^{mk}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Input index n을 2m과 2m+1로 나눕니다."] },
        ]}
        terms={[
          { symbol: "\\omega_N", name: "primitive root of unity", description: "N번 곱하면 1로 돌아오는 한 bin의 complex rotation입니다." },
          { symbol: "E[k]", name: "even sub-DFT", description: "x[0], x[2], …로 만든 길이 N/2 transform입니다." },
          { symbol: "O[k]", name: "odd sub-DFT", description: "x[1], x[3], …로 만든 길이 N/2 transform입니다." },
          { symbol: "\\omega_N^k", name: "twiddle factor", description: "Odd subproblem의 phase를 N-point output coordinate에 맞춥니다." },
        ]}
        assumptions={["N이 짝수입니다. 끝까지 radix-2로 재귀하려면 N은 2의 거듭제곱입니다.", "Decimation-in-time 형태이며 decimation-in-frequency는 다른 dataflow로 같은 factorization을 구현합니다."]}
        interpretation="절약은 frequency sample을 버려서가 아니라 동일한 E[k], O[k]를 상반부 output에서도 재사용해 생깁니다."
      />

      <ExplainedFormula
        question="같은 E[k]와 O[k]로 나머지 N/2개 output도 어떻게 얻을까?"
        idea={<>N-point root의 half-period symmetry를 쓰면 upper-half output은 twiddle 항의 부호만 바뀝니다. 두 output을 더하기와 빼기로 묶은 이 계산이 butterfly입니다.</>}
        formula={String.raw`\begin{aligned}X[k]&=E[k]+\omega_N^kO[k]\\[3pt]X[k+N/2]&=E[k]-\omega_N^kO[k]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}X[k]&=\underbrace{E[k]+\omega_N^kO[k]}_{\text{lower-half output 계산}}\\[3pt]X[k+N/2]&=\underbrace{E[k]-\omega_N^kO[k]}_{\text{upper-half output 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`E[k]+\omega_N^kO[k]`, annotation: ["lower-half output이(가) 식의 결과에 기여하는","방식을 계산합니다.","N-point root의 half-period","symmetry를 쓰면 upper-half output은"] },
          { expression: String.raw`E[k]-\omega_N^kO[k]`, annotation: ["upper-half output이(가) 식의 결과에 기여하는","방식을 계산합니다.","N-point root의 half-period","symmetry를 쓰면 upper-half output은"] },
        ]}
        terms={[
          { symbol: "X[k]", name: "lower-half output", description: "Even과 phase-aligned odd 결과를 더합니다." },
          { symbol: "X[k+N/2]", name: "upper-half output", description: "같은 두 intermediate를 재사용하되 odd term을 뺍니다." },
          { symbol: "E[k],O[k]", name: "shared intermediates", description: "두 output pair가 한 번 계산한 값을 공유합니다." },
        ]}
        assumptions={["k=0,…,N/2−1 범위입니다.", "Complex multiplication의 실제 FLOP 수와 memory access는 구현에 따라 달라집니다."]}
        interpretation="Butterfly diagram의 핵심은 선 모양이 아니라 두 input으로 두 output을 만드는 shared computation이다. In-place 구현은 이 pair를 같은 buffer에 덮어쓸 수 있습니다."
      />

      <FFTReuseViz />

      <ExplainedFormula
        question="왜 radix-2 FFT의 asymptotic work가 O(N log N)인가?"
        idea={<>각 level에서 두 subproblem의 전체 크기는 여전히 N이고 butterfly combine도 O(N)입니다. Problem size를 절반으로 줄이면 level이 log₂N개 생깁니다.</>}
        formula={String.raw`\begin{aligned}T(N)&=2T(N/2)+cN\\[3pt]T(N)&=\Theta(N\log_2N)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}T(N)&=\underbrace{2T(N/2)+cN}_{\text{기준량당 비율}}\\[3pt]T(N)&=\underbrace{\Theta(N\log_2N)}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`2T(N/2)+cN`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 level에서 두 subproblem의 전체 크기는 여전히","N이고 butterfly combine도 O(N)입니다."] },
          { expression: String.raw`\Theta(N\log_2N)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","각 level에서 두 subproblem의 전체 크기는 여전히","N이고 butterfly combine도 O(N)입니다."] },
        ]}
        terms={[
          { symbol: "2T(N/2)", name: "recursive transforms", description: "Even과 odd sequence의 두 sub-DFT입니다." },
          { symbol: "cN", name: "combine work", description: "한 level의 twiddle multiplication과 butterfly 작업입니다." },
          { symbol: "\\log_2N", name: "recursion depth", description: "N을 1까지 절반으로 나눈 level 수입니다." },
        ]}
        assumptions={["Arithmetic operation count에 대한 asymptotic bound입니다.", "실제 latency는 memory layout, vectorization, plan creation과 transform batch에 좌우됩니다."]}
        interpretation="N=2²⁰이면 direct DFT의 scale은 약 2⁴⁰인 반면 radix-2 work scale은 20·2²⁰이다. 다만 작은 N에서는 constant와 data movement가 더 중요합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Bit reversal과 implementation locality</h3>
        <p>
          even/odd 분할을 거듭하면 입력 index의 binary digit 순서가 뒤집힌 배치가 나온다. Iterative in-place FFT는 bit-reversal
          permutation을 먼저 하거나 stage ordering에 흡수한다. 같은 O(N log N) algorithm이라도 실제 성능은 크게 달라지는데, contiguous
          access·SIMD width·shared memory bank conflict·twiddle layout이 모두 여기에 관여한다.
        </p>
        <h3>Radix-2가 FFT의 전부는 아니다</h3>
        <p>
          Cooley–Tukey는 composite N을 factorization하는 일반 원리다. FFTW나 cuFFT 같은 library는 N의 prime factors와 장치에 따라
          mixed-radix plan을 고른다. Prime length에는 Rader나 Bluestein algorithm을 쓸 수 있다. Zero-padding으로 power-of-
          two를 만드는 선택은 편리하지만 memory와 grid가 함께 바뀌므로 실제 benchmark로 결정한다.
        </p>
      </div>
      <div id="paper-cooley-tukey" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · DFT 계산의 factorization</p>
        <p className="mt-2 text-sm font-semibold">An Algorithm for the Machine Calculation of Complex Fourier Series</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Composite sample count의 Fourier calculation을 작은 transform으로 나누고 intermediate를 재사용해 연산 수를 줄입니다. 다만
            이 논문 하나로 현대 FFT library 전체의 plan·radix·hardware 최적화가 다 설명되지는 않고, 모든 N에서 radix-2가 최선인 것도 아닙니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://research.ibm.com/publications/an-algorithm-for-the-machine-calculation-of-complex-fourier-series" target="_blank" rel="noreferrer">원 논문과 계산량 유도 보기</a>
      </div>
    </section>
  );
}
