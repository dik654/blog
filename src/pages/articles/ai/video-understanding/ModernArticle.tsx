import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { VideoObservationViz } from "./viz/ModernVideoUnderstandingViz";

export default function VideoUnderstandingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          비디오는 frame 묶음이 아니라 시간축을 일정 간격으로 관측한 기록입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            model에 16장을 넣었다는 사실만으로 무엇을 관측했는지 알 수 없습니다. 30 fps 원본에서 연속 16장을 읽으면 약 0.5초지만 8장마다 한 장을 읽으면 같은 16장이
            약 4초를 덮습니다. 먼저 source timestamp와 event duration을 seconds 단위로 고정한 뒤 frame count를 정합니다.
          </p>
        </div>
        <TermBreakdown
          title="시간 관측을 이루는 용어"
          items={[
            {
              term: "Source timestamp",
              description:
                "원본 container·decoder가 frame에 붙인 실제 시간 위치입니다. Variable-frame-rate에서는 frame number보다 이 값을 사용합니다.",
            },
            {
              term: "Event duration",
              description:
                "Label을 판단하려면 보아야 하는 변화가 지속되는 실제 시간입니다. 손가락 튕김과 장시간 행동은 다른 관측 창이 필요합니다.",
            },
            {
              term: "Temporal stride",
              description:
                "선택한 model frames 사이에 건너뛰는 source-frame index 간격입니다. 커질수록 관측 구간은 길어지고 시간 해상도는 낮아집니다.",
            },
            {
              term: "Effective sample rate",
              description:
                "Stride 뒤 model이 실제로 보는 초당 관측 횟수입니다. Source FPS와 같다고 가정하면 안 됩니다.",
            },
          ]}
        />
        <VideoObservationViz />
        <ContentBoundary article="video-understanding" />
      </section>

      <section id="duration" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Frame index 차이를 source FPS로 나누면 관측한 seconds가 됩니다
        </h2>
        <ExplainedFormula
          question="T개 frame과 stride s가 실제로 덮는 시간은 어떻게 계산하나요?"
          idea={
            <p>
              T개 점 사이에는 T−1개 간격이 있습니다. 간격 하나는 source frame s칸이고 source FPS로 나누면 seconds가 됩니다.
            </p>
          }
          formula={String.raw`D_{
m obs}=(T-1)s/f_{
m src}`}
          annotatedFormula={String.raw`\begin{aligned}n_{\rm gaps}&=\underbrace{T-1}_{\text{T개 관측점 사이 간격 수}}\\\Delta i&=\underbrace{n_{\rm gaps}s}_{\text{source-frame index 간격을 합산}}\\D_{\rm obs}&=\underbrace{\Delta i/f_{\rm src}}_{\text{frame 간격을 seconds로 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`T-1`,
              annotation: ["관측점 수에서 하나를 빼", "점 사이 간격 수를 구함"],
            },
            {
              expression: String.raw`n_{\rm gaps}s`,
              annotation: [
                "간격 수에 stride를 곱해",
                "원본 frame index 폭을 구함",
              ],
            },
            {
              expression: String.raw`\Delta i/f_{\rm src}`,
              annotation: [
                "frame 폭을 초당 frame 수로 나눠",
                "실제 seconds로 변환",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Sampled frames",
              description: "Clip에 전달하는 관측점 수입니다.",
            },
            {
              symbol: "s",
              name: "Temporal stride",
              description: "인접 관측점 사이 source-frame 간격입니다.",
            },
            {
              symbol: String.raw`f_{\rm src}`,
              name: "Source FPS",
              description: "원본의 초당 frame 수입니다.",
            },
            {
              symbol: String.raw`D_{\rm obs}`,
              name: "Observed duration",
              description: "첫·마지막 관측점 사이 seconds입니다.",
            },
          ]}
          assumptions={[
            "Source frame rate가 일정하고 decode 누락이 없습니다.",
            "Variable-frame-rate video는 첫·마지막 실제 timestamp 차이를 사용합니다.",
            "긴 duration이 짧은 motion을 충분히 촘촘하게 본다는 뜻은 아닙니다.",
          ]}
          interpretation="30 fps에서 T=16, s=2이면 index 폭은 30이고 duration은 1초입니다. s=8이면 4초를 덮지만 관측 간격도 네 배 성깁니다."
        />
      </section>

      <section id="sampling-rate" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Stride는 duration뿐 아니라 model이 보는 초당 frame 수를 바꿉니다
        </h2>
        <TermBreakdown
          title="같은 16 frames가 다른 evidence가 되는 이유"
          items={[
            {
              term: "Dense sample",
              description:
                "작은 stride로 짧은 구간을 촘촘하게 읽어 빠른 변화를 보존합니다.",
            },
            {
              term: "Sparse sample",
              description:
                "큰 stride로 긴 구간을 훑지만 인접 관측 사이의 빠른 변화를 놓칠 수 있습니다.",
            },
            {
              term: "Coverage",
              description:
                "얼마나 긴 구간을 보았는지에 관한 값이며 초당 관측 횟수와는 다릅니다.",
            },
            {
              term: "Resolution",
              description:
                "시간축에서 얼마나 촘촘히 구분하는지에 관한 값이며 긴 coverage와 trade-off가 있습니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="Stride 뒤 model의 effective sample rate는 왜 source FPS를 stride로 나누나요?"
          idea={
            <p>
              source frames s개마다 한 번 관측하므로 초당 source frames를 한 관측에 필요한 frame 수로 나눕니다.
            </p>
          }
          formula={String.raw`f_{\rm sample}=f_{\rm src}/s`}
          annotatedFormula={String.raw`\begin{aligned}\Delta t&=\underbrace{s/f_{\rm src}}_{\text{한 관측 간격을 seconds로 변환}}\\f_{\rm sample}&=\underbrace{1/\Delta t}_{\text{간격의 역수로 초당 관측 횟수 계산}}\\&=\underbrace{f_{\rm src}/s}_{\text{source FPS를 stride만큼 축소}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`s/f_{\rm src}`,
              annotation: ["stride를 FPS로 나눠", "관측 사이 seconds를 구함"],
            },
            {
              expression: String.raw`1/\Delta t`,
              annotation: ["시간 간격을 뒤집어", "초당 관측 횟수로 바꿈"],
            },
            {
              expression: String.raw`f_{\rm src}/s`,
              annotation: [
                "source rate를 stride로 나눠",
                "effective FPS를 바로 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\Delta t`,
              name: "Sample interval",
              description: "인접 model frames 사이 seconds입니다.",
            },
            {
              symbol: String.raw`f_{\rm sample}`,
              name: "Effective sample rate",
              description: "Model이 실제로 보는 frames/s입니다.",
            },
            {
              symbol: "s",
              name: "Stride",
              description: "관측 하나마다 소비하는 source-frame 간격입니다.",
            },
          ]}
          assumptions={[
            "Uniform source FPS를 가정합니다.",
            "Frame drop과 timestamp jitter는 별도 receipt로 검사합니다.",
            "Sample rate는 model accuracy가 아니라 관측 geometry입니다.",
          ]}
          interpretation="30 fps에서 stride 3이면 effective rate는 10 fps이고 인접 관측은 0.1초 떨어집니다."
        />
      </section>

      <section id="aliasing" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          빠른 반복 motion은 성긴 sampling에서 느리거나 반대 방향처럼 겹칠 수
          있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            바퀴살이 실제보다 천천히 돌거나 거꾸로 도는 것처럼 보일 때가 있습니다. 이것이 시간축 aliasing입니다. 이상적인 band-limited 신호에서는 구분하려는 가장 빠른
            frequency가 sample rate의 절반보다 낮아야 합니다. 이 조건은 최소 관측 경계이며 action classification 성공을 보장하는 규칙은 아닙니다.
          </p>
        </div>
        <ExplainedFormula
          question="왜 motion frequency를 sample rate의 절반과 비교하나요?"
          idea={
            <p>
              한 cycle을 서로 다른 두 위치에서 구분하려면 최소 두 번 이상
              관측해야 하므로 sample rate의 절반이 ideal boundary가 됩니다.
            </p>
          }
          formula={String.raw`f_{\rm motion}<f_{\rm sample}/2`}
          annotatedFormula={String.raw`\begin{aligned}f_{\rm Nyq}&=\underbrace{f_{\rm sample}/2}_{\text{cycle당 최소 두 관측으로 만든 경계}}\\\operatorname{safe}&=\underbrace{\mathbf 1[f_{\rm motion}<f_{\rm Nyq}]}_{\text{motion이 경계 아래일 때만 alias-free 후보}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`f_{\rm sample}/2`,
              annotation: [
                "초당 관측 수를 둘로 나눠",
                "ideal Nyquist boundary 계산",
              ],
            },
            {
              expression: String.raw`f_{\rm motion}<f_{\rm Nyq}`,
              annotation: [
                "motion 속도를 경계와 비교해",
                "alias-free 필요조건 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`f_{\rm motion}`,
              name: "Motion frequency",
              description: "구분할 반복 변화의 cycles/s입니다.",
            },
            {
              symbol: String.raw`f_{\rm Nyq}`,
              name: "Nyquist boundary",
              description:
                "Ideal signal에서 구분 가능한 최대 frequency 경계입니다.",
            },
          ]}
          assumptions={[
            "시간 신호를 band-limited periodic signal로 근사합니다.",
            "Shutter blur·irregular timestamp·non-periodic event를 생략합니다.",
            "부등식은 필요한 조건이며 semantic recognition의 충분조건이 아닙니다.",
          ]}
          interpretation="Effective rate 10 fps의 경계는 5 Hz입니다. 8 Hz motion은 원래 속도를 고유하게 복원할 수 없습니다."
        />
        <div id="paper-nyquist" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Nyquist — Certain Topics in Telegraph Transmission Theory"
            href="https://doi.org/10.1109/T-AIEE.1928.5055024"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 제한된 통신 대역에서 신호를 구분 가능한
                속도로 전송·관측하는 조건을 다룹니다.
              </p>
              <p>
                <strong>기여.</strong> Bandwidth와 signaling rate 사이의 고전적
                sampling 경계를 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 연속시간 신호와 논문의 통신 모델 및 대역
                제한을 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Video motion에 재사용하는
                sampling-theory 경계의 역사적 근거입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 이 경계만 만족하면 video model이
                행동 의미를 정확히 분류한다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
