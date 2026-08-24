import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import DomainRepresentationViz from "./viz/DomainRepresentationViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">FFT는 변환이 아니라 DFT를 계산하는 빠른 방법이다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          오디오 waveform, 이미지 row, sensor time series는 위치마다 값을 기록한다.
          같은 data를 “어떤 회전 패턴이 얼마나 섞였는가”라는 좌표로 옮기면 반복
          주기, 대역별 energy와 convolution 구조가 더 직접적으로 드러난다. 이 좌표
          변환이 <strong>DFT(Discrete Fourier Transform)</strong>이고, FFT(Fast
          Fourier Transform)는 그 DFT를 중복 계산 없이 구하는 algorithm family다.
        </p>
        <p>
          이 구분이 중요한 이유는 FFT가 정확도를 낮춘 근사가 아니기 때문이다. 같은
          normalization과 numerical precision을 사용하면 direct DFT와 FFT의
          mathematical output은 같다. 달라지는 것은 계산 graph이며, N개 output마다
          N개 항을 더하는 O(N²) 작업을 symmetry와 factorization으로 O(N log N)까지
          줄인다.
        </p>
        <p>
          아래 식의 <code>i</code>, <code>e^{'{iθ}'}</code>, <code>2π</code>가 아직 낯설다면 먼저 <Link to="/ai/math-complex-numbers-oscillations">복소수·회전·Euler 공식 글</Link>을 읽으면 됩니다. 그 글에서 radian과 단위원부터 roots of unity까지 만든 뒤 이 글로 돌아오도록 연결해 두었습니다.
        </p>
      </div>

      <DomainRepresentationViz />

      <ExplainedFormula
        question="길이 N의 discrete signal을 N개의 주파수 coefficient로 어떻게 바꿀까?"
        idea={<>입력 x[n]을 k번 회전하는 complex exponential basis와 내적합니다. 같은 회전 성분은 같은 방향으로 누적되고, 맞지 않는 성분은 원 둘레에서 상쇄됩니다.</>}
        formula={String.raw`\begin{aligned}X[k]&=\sum_{n=0}^{N-1}x[n]e^{-i2\pi kn/N}\\[3pt]x[n]&=\frac1N\sum_{k=0}^{N-1}X[k]e^{i2\pi kn/N}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}X[k]&=\underbrace{\sum_{n=0}^{N-1}x[n]e^{-i2\pi kn/N}}_{\text{기준량당 비율}}\\[3pt]x[n]&=\underbrace{\frac1N\sum_{k=0}^{N-1}X[k]e^{i2\pi kn/N}}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{n=0}^{N-1}x[n]e^{-i2\pi kn/N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","입력 x[n]을 k번 회전하는 complex","exponential basis와 내적합니다."] },
          { expression: String.raw`\frac1N\sum_{k=0}^{N-1}X[k]e^{i2\pi kn/N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","입력 x[n]을 k번 회전하는 complex","exponential basis와 내적합니다."] },
        ]}
        terms={[
          { symbol: "x[n]", name: "input sample", description: "시간 또는 공간 index n에서 관측한 값입니다." },
          { symbol: "X[k]", name: "frequency coefficient", description: "k번째 discrete frequency의 magnitude와 phase를 담는 complex number입니다." },
          { symbol: "e^{-i2\\pi kn/N}", name: "Fourier basis", description: "N sample 동안 k회 회전하는 분석 pattern입니다." },
          { symbol: "1/N", name: "normalization", description: "여기서는 inverse transform에 둔 convention이며 library마다 분배 위치가 다를 수 있습니다." },
        ]}
        assumptions={["N개 sample은 일정한 간격으로 관측되었고 분석 구간 밖에서 주기적으로 반복된다고 해석합니다.", "Complex-valued DFT의 기본식입니다. Real input은 conjugate symmetry를 이용해 절반가량만 저장할 수 있습니다."]}
        interpretation="DFT는 N차원 vector를 orthogonal complex basis의 coefficient로 바꾸는 invertible linear transform이다. Magnitude와 phase를 모두 유지하면 원래 sample을 복원할 수 있습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>주파수 bin은 실제 Hz와 같지 않다</h3>
        <p>
          DFT index k는 그 자체로 Hz가 아니다. Sample rate가 fₛ이면 k번째 bin의
          physical frequency는 kfₛ/N이고 bin 간격은 fₛ/N이다. N만 늘리는
          zero-padding은 spectrum을 더 촘촘하게 interpolation하지만 관측 시간이
          늘어난 것은 아니므로 가까운 두 sinusoid를 실제로 구분하는 resolution을
          새로 만들지는 않는다.
        </p>
        <h3>이 글의 top-down 경로</h3>
        <p>
          먼저 continuous Fourier representation에서 DFT가 생기는 sampling
          경계를 확인한다. 그다음 Cooley–Tukey가 roots of unity의 symmetry를 어떻게
          재사용하는지 유도하고, 마지막에는 STFT·large convolution·FNet·Hyena에서
          FFT가 각각 무엇을 대체하며 어떤 정보가 남는지 구분한다.
        </p>
      </div>
    </section>
  );
}
