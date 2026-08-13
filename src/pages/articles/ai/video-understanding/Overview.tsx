import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">비디오 이해는 frame을 많이 넣는 문제가 아니라, label을 결정하는 시간 구간을 관측하는 문제입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          비디오는 이미지 묶음이 아니라 사건이 시간에 걸쳐 진행되는 데이터입니다. 같은 프레임이라도 순서와 간격이 달라지면 의미가 바뀌므로, 먼저 찾으려는 사건의 지속 시간과 필요한 motion bandwidth를 정해야 합니다. 그다음 clip 길이, sampling 간격과 영상당 clip 수를 계산 예산에 맞춥니다.
        </p>
        <p>
          가장 단순한 baseline은 2D image encoder로 각 frame을 읽고 temporal pooling하는 방식입니다. 이 기준에서 시간 정보가 실제로 부족한지 확인한 뒤 3D convolution, SlowFast 또는 video transformer로 확장해야 구조의 효과와 더 많은 frame을 본 효과를 구분할 수 있습니다.
        </p>
        <p>
          Image tensor와 spatial convolution은 <Link to="/ai/cnn">CNN 정본</Link>,
          sampling frequency와 aliasing은 <Link to="/ai/fft">sampling·FFT 정본</Link>,
          patch token attention은 <Link to="/ai/vision-transformer">Vision Transformer
          정본</Link>을 재사용합니다. 이 글은 같은 frame·token budget에서 temporal
          coverage와 model interaction 범위를 어떻게 맞추는지에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="video-understanding" />
      <ExplainedFormula
        question="T개 frame을 stride s로 뽑으면 원본 영상의 몇 초를 관측할까?"
        idea={<>첫 frame과 마지막 frame 사이에는 T−1개의 간격이 있습니다. 원본 frame index 간격 s를 source frame rate fsrc로 나누면 한 간격의 시간이 됩니다.</>}
        formula={String.raw`D_{\mathrm{obs}}=\frac{(T-1)s}{f_{\mathrm{src}}}`}
        terms={[
          { symbol: "T", name: "sampled frames", description: "한 clip에서 model에 전달하는 frame 수입니다." },
          { symbol: "s", name: "temporal stride", description: "연속 sample 사이에 건너뛰는 source-frame index 간격입니다." },
          { symbol: "fsrc", name: "source frame rate", description: "원본 영상의 초당 frame 수이며 단위는 frame/s입니다." },
          { symbol: "Dobs", name: "observed duration", description: "첫 sample과 마지막 sample이 덮는 실제 시간이며 단위는 second입니다." },
        ]}
        assumptions={["Source timestamp가 일정한 frame-rate grid를 따릅니다. Variable-frame-rate video는 실제 timestamp difference를 사용합니다.", "Decode 누락이나 sampling jitter가 없다면 각 간격은 s/fsrc second입니다.", "관측 구간이 길다는 사실만으로 짧은 motion을 충분히 촘촘하게 본 것은 아닙니다."]}
        interpretation="30 fps video에서 T=16, s=2이면 약 1초를 관측합니다. 같은 16 frame이라도 s=8이면 4초를 덮지만 빠른 변화는 더 거칠게 보게 됩니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 글은 temporal coverage를 정하는 sampling contract에서 시작해 3D convolution과 factorization, 서로 다른 frame rate를 결합하는 SlowFast, tubelet과 factorized attention을 쓰는 video transformer로 내려갑니다. 모든 비교에서는 영상 단위 split과 총 처리 frame·token 수를 함께 고정합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Frame 수가 같아도 빠른 주기 motion을 놓칠 수 있는 이유는 무엇일까?"
        idea={<>Stride sampling의 유효 sample rate는 source FPS를 stride로 나눈 값입니다. 주기 신호를 겹치지 않게 구분하려면 가장 빠른 motion frequency보다 적어도 두 배 빠르게 관측해야 합니다.</>}
        formula={String.raw`f_{\mathrm{sample}}=\frac{f_{\mathrm{src}}}{s},\qquad f_{\mathrm{motion}}<\frac{f_{\mathrm{sample}}}{2}`}
        terms={[
          { symbol: "fsample", name: "effective sampling rate", description: "Stride 뒤 model이 실제로 보는 초당 frame 수입니다." },
          { symbol: "fmotion", name: "motion frequency", description: "구분해야 하는 반복 motion의 초당 cycle 수입니다." },
          { symbol: "fsample/2", name: "Nyquist limit", description: "Ideal band-limited signal에서 alias 없이 구분할 수 있는 최대 frequency입니다." },
        ]}
        assumptions={["Motion을 시간에 따른 band-limited signal로 근사하는 sampling-theory 해석입니다.", "Camera shutter·motion blur·irregular timestamps·non-periodic event를 생략합니다.", "부등식은 필요한 최소 조건이지 classification 성공을 보장하는 충분조건이 아닙니다."]}
        interpretation="30 fps에서 s=3이면 model은 10 fps를 보므로 ideal limit는 5 Hz입니다. 더 빠른 motion은 느리거나 반대 방향처럼 보일 수 있어 SlowFast의 fast path나 dense clip이 필요해집니다."
      />
    </section>
  );
}
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
