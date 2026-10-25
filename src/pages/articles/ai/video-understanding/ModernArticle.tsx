import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import VideoPathLocator, { VideoMapReturn } from "./VideoPathLocator";
import {
  TimestampReceiptViz,
  VideoAliasingViz,
  VideoDurationViz,
  VideoObservationViz,
  VideoSampleRateViz,
} from "./viz/ModernVideoUnderstandingViz";

export default function VideoUnderstandingArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section id="overview" data-teach-level="1" className="scroll-mt-20">
        <VideoPathLocator current="time-observation" />
        <h2 className="mb-6 text-2xl font-bold">16장은 몇 초인가</h2>
        <VideoObservationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            30fps 원본에서 source frame을 세 칸마다 골라 16개 관측점을 만들었다고
            가정하겠습니다. 첫 관측점의 index는 0이고 마지막은 45이므로 두 점은
            1.5초 떨어져 있습니다. Model은 초당 10번 관측하며, 8Hz 반복 움직임은
            이 속도에서 원래 방향과 속도를 잃을 수 있습니다.
          </p>
          <p>
            따라서 <strong>frame 수</strong>, <strong>관측 시간</strong>,
            <strong> 초당 관측 횟수</strong>를 한 값처럼 다루면 안 됩니다. 먼저 실제
            timestamp를 읽고, 그다음 duration과 effective sample rate를 따로 계산해야
            model이 본 시간 증거를 설명할 수 있습니다.
          </p>
        </div>
        <ContentBoundary article="video-understanding" />
        <TermBreakdown
          title="시간 관측을 이루는 네 값"
          items={[
            {
              term: "Presentation timestamp (PTS)",
              description:
                "Decoded frame을 언제 보여야 하는지 time base 단위로 기록한 값입니다.",
            },
            {
              term: "Temporal stride",
              description:
                "서로 이웃한 model 관측점 사이에서 건너뛰는 source-frame index 간격입니다.",
            },
            {
              term: "Observed duration",
              description:
                "첫 관측점과 마지막 관측점의 실제 표시 시각 차이입니다.",
            },
            {
              term: "Effective sample rate",
              description:
                "Stride를 적용한 뒤 model이 1초에 실제로 받는 관측점 수입니다.",
            },
          ]}
        />
      </section>

      <section id="timestamps" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Frame 번호보다 표시 시각을 먼저 읽습니다</h2>
        <TimestampReceiptViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Frame 0과 frame 45라는 번호만으로는 실제 시간 차이를 확정할 수 없습니다.
            FFmpeg의 <code>AVFrame::pts</code>는 frame이 표시될 시각을
            <code> time_base</code> 단위로 저장합니다. 이 사례에서 time base가
            1/90000초이고 두 PTS가 0과 135000이면 표시 시각은 각각 0초와 1.5초입니다.
          </p>
          <p>
            고정 frame-rate에서는 index 차이를 FPS로 나눠 같은 결과를 얻을 수 있습니다.
            그러나 variable-frame-rate, frame drop, timestamp jitter가 있으면 index 간격과
            시간 간격이 달라질 수 있으므로 실제 PTS 차이를 기준으로 삼아야 합니다.
          </p>
          <div className="not-prose my-6 border-y border-border py-4">
            <p className="mb-3 text-xs font-bold text-muted-foreground">표시 시각 계산 · 설명용 의사코드</p>
            <pre className="overflow-x-auto bg-muted/25 p-4 text-[13px] leading-6"><code>{`// PTS를 time base와 곱해 각 frame의 표시 시각을 초로 바꿉니다.
start_seconds = start_frame.pts * time_base
end_seconds   = end_frame.pts   * time_base

// 두 표시 시각의 차이가 model이 관측한 실제 시간 폭입니다.
observed_seconds = end_seconds - start_seconds`}</code></pre>
          </div>
        </div>
        <div id="standard-ffmpeg-timestamps" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            citeKey={1}
            source="FFmpeg 9.0 — AVFrame Struct Reference"
            href="https://ffmpeg.org/doxygen/9.0/structAVFrame.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>정의.</strong> <code>pts</code>는 <code>time_base</code> 단위의 presentation timestamp입니다.</p>
              <p><strong>이 글의 사용.</strong> Frame 번호가 아니라 실제 표시 시각의 차이로 관측 시간을 계산합니다.</p>
              <p><strong>근거 범위.</strong> FFmpeg 9.0의 구조체 필드 의미를 확인한 것이며, 모든 container가 완전한 timestamp를 제공한다는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="duration" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">관측 시간</h2>
        <VideoDurationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            위 시간축은 16개 관측점 사이에 간격이 15개뿐이라는 사실을 보여 줍니다.
            각 간격이 source frame 세 칸이므로 전체 index 폭은 45 frames이고, 이를
            30 frames/s로 나누면 1.5초입니다. <strong>T가 아니라 T−1을 곱하는 이유</strong>가
            여기서 나옵니다.
          </p>
        </div>
        <ExplainedFormula
          question="T개 관측점과 stride s가 실제로 덮는 시간은 어떻게 계산하나요?"
          idea={<p>관측점 T개 사이의 T−1개 간격을 source-frame 폭으로 바꾼 뒤 source FPS로 나눕니다.</p>}
          formula={String.raw`D_{\rm obs}=(T-1)s/f_{\rm src}`}
          annotatedFormula={String.raw`\begin{aligned}n_{\rm gaps}&=\underbrace{T-1}_{\text{관측점 사이 간격 수}}\\\Delta i&=\underbrace{n_{\rm gaps}s}_{\text{source-frame index 폭}}\\D_{\rm obs}&=\underbrace{\Delta i/f_{\rm src}}_{\text{frame 폭을 seconds로 변환}}\end{aligned}`}
          operations={[
            { expression: String.raw`16-1=15`, annotation: ["16개 점 사이에서", "15개 간격을 셈"] },
            { expression: String.raw`15\times3=45\ {\rm frames}`, annotation: ["간격마다 source frame 세 칸", "전체 index 폭 계산"] },
            { expression: String.raw`45\ {\rm frames}/30\ {\rm frames/s}=1.5\ {\rm s}`, annotation: ["같은 frame 단위를 지우고", "실제 seconds를 남김"] },
          ]}
          terms={[
            { symbol: "T", name: "Sampled frames", description: "Model에 전달하는 관측점 수입니다." },
            { symbol: "s", name: "Temporal stride", description: "인접 관측점 사이 source-frame 간격입니다." },
            { symbol: String.raw`f_{\rm src}`, name: "Source FPS", description: "고정 frame-rate 원본의 초당 frame 수입니다." },
            { symbol: String.raw`D_{\rm obs}`, name: "Observed duration", description: "첫·마지막 관측점의 표시 시각 차이입니다." },
          ]}
          assumptions={[
            "Source frame rate가 일정하고 decode 누락이 없는 계산입니다.",
            "Variable-frame-rate 영상은 첫·마지막 실제 timestamp 차이를 사용합니다.",
            "1.5초를 보았다는 사실만으로 그 안의 빠른 움직임을 충분히 촘촘히 보았다고 말할 수 없습니다.",
          ]}
          interpretation="30 fps에서 T=16, s=3이면 15 gaps × 3 frames/gap = 45 frames이고, 45 frames ÷ 30 frames/s = 1.5초입니다."
        />
      </section>

      <section id="sampling-rate" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">초당 관측 횟수</h2>
        <VideoSampleRateViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Stride 3은 source frame 세 칸을 한 관측 묶음으로 사용한다는 뜻입니다.
            1초에 30 frames가 들어오고 관측 한 번마다 세 칸을 소비하므로 model은 초당
            10번 봅니다. 같은 16개 관측점이 1.5초를 덮는다는 duration 계산과는 다른
            질문입니다.
          </p>
          <p>
            Stride를 늘리면 같은 frame budget으로 더 긴 시간을 덮지만 초당 관측 횟수는
            줄어듭니다. 긴 사건을 보는 coverage와 빠른 변화를 구분하는 temporal resolution
            사이에 trade-off가 생깁니다.
          </p>
        </div>
        <ExplainedFormula
          question="Stride 뒤 model의 effective sample rate는 왜 source FPS를 stride로 나누나요?"
          idea={<p>관측 한 번에 source frame s칸을 사용하므로 초당 source frame 수를 한 관측의 frame 수로 나눕니다.</p>}
          formula={String.raw`f_{\rm sample}=f_{\rm src}/s`}
          annotatedFormula={String.raw`\begin{aligned}\Delta t&=\underbrace{s/f_{\rm src}}_{\text{인접 관측점 사이 seconds}}\\f_{\rm sample}&=\underbrace{1/\Delta t}_{\text{초당 관측 횟수}}=\underbrace{f_{\rm src}/s}_{\text{source FPS를 stride로 나눔}}\end{aligned}`}
          operations={[
            { expression: String.raw`3\ {\rm frames}/30\ {\rm frames/s}=0.1\ {\rm s}`, annotation: ["한 관측 간격을", "seconds로 변환"] },
            { expression: String.raw`1/0.1\ {\rm s}=10\ {\rm observations/s}`, annotation: ["시간 간격을 뒤집어", "초당 관측 횟수 계산"] },
          ]}
          terms={[
            { symbol: String.raw`\Delta t`, name: "Sample interval", description: "인접 model 관측점 사이의 실제 시간입니다." },
            { symbol: String.raw`f_{\rm sample}`, name: "Effective sample rate", description: "Model이 실제로 받는 관측점 수/초입니다." },
            { symbol: "s", name: "Stride", description: "관측 한 번마다 사용하는 source-frame 간격입니다." },
          ]}
          assumptions={[
            "고정 30fps와 일정한 stride를 가정합니다.",
            "Frame drop과 timestamp jitter가 있으면 실제 timestamp 간격을 각각 확인합니다.",
            "Sample rate는 입력의 시간 기하를 말하며 model 정확도를 보장하지 않습니다.",
          ]}
          interpretation="30 frames/s ÷ 3 frames/observation = 10 observations/s이며, 인접 관측점은 0.1초 떨어져 있습니다."
        />
      </section>

      <section id="aliasing" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Aliasing</h2>
        <VideoAliasingViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            8Hz 회전을 10 observations/s로 보면 관측 사이에 실제로 0.8회전 진행합니다.
            원 위의 위치만 비교하면 +0.8회전은 −0.2회전과 같으므로 sample은 매번 뒤로
            움직입니다. 이 다섯 점은 +8Hz뿐 아니라 −2Hz 회전에서도 그대로 나옵니다.
          </p>
          <p>
            이상적인 band-limited 신호를 고유하게 복원하려면 구분할 frequency가 sample
            rate의 절반보다 낮아야 합니다. 이 경계는 입력이 시간을 충분히 촘촘히 보았는지
            확인하는 필요조건이며, action recognition 정확도를 보장하는 충분조건은 아닙니다.
          </p>
        </div>
        <ExplainedFormula
          question="10 observations/s에서 8Hz 움직임이 왜 −2Hz와 겹치나요?"
          idea={<p>Sample time마다 두 frequency의 위상 차이가 정수 회전이면 같은 위치를 관측합니다.</p>}
          formula={String.raw`f_{\rm alias}=f_{\rm motion}-f_{\rm sample}=8-10=-2\ {\rm Hz}`}
          annotatedFormula={String.raw`\begin{aligned}f_{\rm boundary}&=\underbrace{f_{\rm sample}/2}_{\text{이상적 복원 경계}}=5\ {\rm Hz}\\f_{\rm alias}&=\underbrace{8-10}_{\text{sample마다 한 회전을 빼도 같은 위상}}=-2\ {\rm Hz}\end{aligned}`}
          operations={[
            { expression: String.raw`10/2=5\ {\rm Hz}`, annotation: ["초당 관측 수를 둘로 나눠", "이상적 경계를 계산"] },
            { expression: String.raw`8>5`, annotation: ["실제 반복 속도가 경계를 넘어", "고유 복원 조건을 만족하지 못함"] },
            { expression: String.raw`8-10=-2\ {\rm Hz}`, annotation: ["Sample rate 한 회전을 빼면", "같은 관측점의 역방향 속도가 남음"] },
          ]}
          terms={[
            { symbol: String.raw`f_{\rm motion}`, name: "Motion frequency", description: "구분하려는 반복 변화의 cycles/s입니다." },
            { symbol: String.raw`f_{\rm sample}`, name: "Sample rate", description: "초당 관측 횟수입니다." },
            { symbol: String.raw`f_{\rm alias}`, name: "Aliased frequency", description: "같은 discrete samples를 만드는 다른 frequency입니다." },
          ]}
          assumptions={[
            "회전을 band-limited periodic signal로 단순화한 설명용 사례입니다.",
            "Shutter blur·불규칙 timestamp·비주기 사건을 생략했습니다.",
            "Sampling 경계를 만족해도 model이 행동 의미를 정확히 분류한다는 보장은 없습니다.",
          ]}
          interpretation="Effective rate 10 observations/s의 경계는 5Hz입니다. +8Hz와 −2Hz는 0.1초 간격 sample에서 같은 위상을 만들므로 원래 움직임을 고유하게 정할 수 없습니다."
        />
        <div id="paper-shannon-sampling" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Shannon — Communication in the Presence of Noise"
            href="https://doi.org/10.1109/JRPROC.1949.232969"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>문제.</strong> 제한된 대역의 연속 신호를 discrete samples로 표현하고 복원하는 조건을 다룹니다.</p>
              <p><strong>기여.</strong> 최고 frequency가 W인 신호를 1/(2W)초 간격의 samples로 정할 수 있는 sampling theorem을 제시합니다.</p>
              <p><strong>가정.</strong> 논문의 연속시간·band-limited 신호 모델을 전제로 합니다.</p>
              <p><strong>이 글의 사용.</strong> 비디오의 반복 움직임을 단순한 시간 신호로 근사해 aliasing 필요조건을 설명합니다.</p>
              <p><strong>일반화 금지.</strong> 이 경계만 만족하면 video model이 행동 의미를 정확히 분류한다는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="6" className="scroll-mt-20">
        <VideoMapReturn current="time-observation" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>확인</h2>
          <ol>
            <li>16개 관측점 사이의 간격은 왜 15개입니까? <strong>(답: 관측 시간)</strong></li>
            <li>1.5초를 덮는다는 사실만으로 빠른 움직임을 충분히 본다고 말할 수 없는 이유는 무엇입니까? <strong>(답: 초당 관측 횟수)</strong></li>
            <li>+8Hz와 −2Hz가 10 observations/s에서 같은 sample을 만드는 이유는 무엇입니까? <strong>(답: Aliasing)</strong></li>
          </ol>
        </div>
      </section>
    </div>
  );
}
