import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import VideoPathLocator, { VideoMapReturn } from "../video-understanding/VideoPathLocator";
import {
  ClipCoverageOverviewViz,
  IntervalUnionTraceViz,
  ReplayReceiptTraceViz,
  SegmentSamplingPolicyViz,
} from "./viz/VideoClipSamplingViz";

const INTERVAL_CODE = `type Interval = readonly [start: number, end: number];

function mergeIntervals(intervals: readonly Interval[]) {
  // 시작 시각이 빠른 순서로 정렬합니다.
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];

  // 첫 구간은 뒤 구간과 겹칠 수 있으므로 아직 확정하지 않습니다.
  let current: [number, number] = [...sorted[0]];

  for (const [nextStart, nextEnd] of sorted.slice(1)) {
    // 다음 시작이 현재 끝보다 이르면 두 구간을 하나로 늘립니다.
    if (nextStart <= current[1]) {
      current[1] = Math.max(current[1], nextEnd);
      continue;
    }

    // 간격을 만났을 때만 현재 구간을 확정합니다.
    merged.push(current);
    current = [nextStart, nextEnd];
  }

  // 반복문이 끝난 뒤 남은 마지막 구간을 더합니다.
  merged.push(current);
  return merged;
}`;

const REPLAY_RECORD = `// 설명용 평가 재현 기록입니다. 대문자 값은 실제 hash로 바꿉니다.
const receipt = {
  id: "eval-017",
  source: { sha256: "SOURCE_HASH", durationMs: 10_000 },

  // 실제로 읽은 시간 구간과 frame의 표시 시각을 함께 남깁니다.
  temporal: {
    intervalsMs: [[0, 2000], [1000, 3000], [8000, 10_000]],
    framePts: [/* decoded frame PTS */],
    samplerRevision: "segment-center@2.16.1",
  },

  // 같은 bytes가 같은 tensor가 되었는지 확인할 경계입니다.
  tensor: {
    decoder: "DECODER_REVISION",
    pixelFormat: "rgb24",
    crop: "center-224",
    sha256: "TENSOR_HASH",
  },

  // 입력 뒤의 계산과 최종 합산 규칙도 같은 기록에 묶습니다.
  inference: {
    modelSha256: "MODEL_HASH",
    clipScores: [0.2, 0.8, 0.5],
    reducer: "mean",
    videoScore: 0.5,
  },
};`;

export default function VideoClipSamplingArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section id="overview" data-teach-level="1" data-assumed-case="10-second-three-clip" className="scroll-mt-20">
        <VideoPathLocator current="clip-sampling" />
        <h2 className="mb-6 text-2xl font-bold">같은 12장도 보는 시간이 다릅니다</h2>
        <ClipCoverageOverviewViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            10초 영상에서 4장짜리 clip을 세 번 읽는다고 가정하겠습니다. Frame
            budget은 12장으로 같아도 clip이 시작되는 시각에 따라 실제 관측 범위는
            달라집니다. 이 글의 세 구간은 <code>[0,2]</code>, <code>[1,3]</code>,
            <code> [8,10]</code>초입니다.
          </p>
          <p>
            세 길이를 그대로 더하면 6초지만 앞의 두 clip은 1초 겹칩니다. 겹친 시간을
            한 번만 남기면 <code>[0,3]</code>과 <code>[8,10]</code>, 모두 5초입니다.
            따라서 이 영상의 temporal coverage는 0.5입니다. 같은 평가를 다시 확인하려면
            이 구간뿐 아니라 decode·crop·model·reducer까지 같은 기록으로 이어야 합니다.
          </p>
        </div>
        <ContentBoundary article="video-clip-sampling" />
        <TermBreakdown
          title="이 글에서 이어 쓸 네 용어"
          items={[
            {
              term: "Timestamp interval",
              description: "한 clip이 실제로 읽은 시작 시각과 끝 시각의 구간입니다.",
            },
            {
              term: "Interval union",
              description: "겹치는 구간을 합쳐 한 번이라도 관측한 시간을 나타낸 집합입니다.",
            },
            {
              term: "Temporal coverage",
              description: "Interval union의 길이를 영상 전체 길이로 나눈 값입니다.",
            },
            {
              term: "평가 재현 기록",
              description: "Source부터 최종 video score까지 같은 평가인지 확인할 입력·revision·checksum 기록입니다.",
            },
          ]}
        />
      </section>

      <section id="coverage" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Interval union</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 그림의 세 clip 막대를 다시 보세요. 길이의 단순합이 아니라 union 막대가
            실제로 한 번 이상 본 시간입니다. 빈 구간 <code>[3,8]</code>은 frame budget
            12장만으로는 드러나지 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="겹치는 여러 clip이 영상 전체에서 차지하는 비율은 어떻게 계산합니까?"
          idea={<p>각 clip을 timestamp interval로 바꾸고, 합집합의 길이를 영상 전체 길이로 나눕니다.</p>}
          formula={String.raw`C_{\rm time}=\left|\bigcup_{j=1}^{K}[a_j,b_j]\right|/D_{\rm video}`}
          annotatedFormula={String.raw`\begin{aligned}U&=\underbrace{\bigcup_{j=1}^{K}[a_j,b_j]}_{\text{겹친 시간을 한 번만 남긴 구간}}\\L_{\rm seen}&=\underbrace{|U|}_{\text{합친 구간의 전체 길이}}\\C_{\rm time}&=\underbrace{L_{\rm seen}/D_{\rm video}}_{\text{영상 전체 중 관측한 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`[0,2]\cup[1,3]=[0,3]`,
              annotation: ["1초 겹치는 두 구간을", "하나의 3초 구간으로 병합"],
            },
            {
              expression: String.raw`|[0,3]|+|[8,10]|=3\ {\rm s}+2\ {\rm s}=5\ {\rm s}`,
              annotation: ["서로 떨어진 두 구간의", "길이를 각각 더함"],
            },
            {
              expression: String.raw`5\ {\rm s}/10\ {\rm s}=0.5`,
              annotation: ["관측한 5초를", "영상 전체 10초로 나눔"],
            },
          ]}
          terms={[
            { symbol: String.raw`[a_j,b_j]`, name: "Clip interval", description: "j번째 clip의 실제 시작·끝 시각입니다." },
            { symbol: "K", name: "Clip count", description: "한 영상에서 읽은 clip 수입니다." },
            { symbol: String.raw`D_{\rm video}`, name: "Video duration", description: "원본 영상의 전체 길이입니다." },
            { symbol: String.raw`C_{\rm time}`, name: "Temporal coverage", description: "중복 없이 관측한 시간 비율입니다." },
          ]}
          assumptions={[
            "모든 interval은 같은 영상의 같은 timestamp 기준을 사용합니다.",
            "구간 길이는 끝 시각에서 시작 시각을 뺀 값으로 셉니다.",
            "Coverage 0.5는 5초를 봤다는 뜻일 뿐, 중요한 사건을 포함했다거나 빠른 움직임을 충분히 촘촘히 봤다는 뜻은 아닙니다.",
          ]}
          interpretation="[0,2], [1,3], [8,10]초의 단순합은 6초지만 interval union은 5초입니다. 10초 영상의 temporal coverage는 5/10=0.5입니다."
        />
      </section>

      <section id="algorithm" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">정렬과 병합</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            구간이 많아지면 그림만 보고 겹침을 셀 수 없습니다. 시작 시각으로 정렬한 뒤
            현재 구간과 다음 구간만 비교하면 됩니다. 아래에서 활성 코드 줄과
            <code> current</code>·<code>merged</code> 상태가 함께 바뀝니다.
          </p>
        </div>
        <IntervalUnionTraceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            겹치는 동안에는 <code>current.end</code>만 늘리고, 처음으로 간격을 만났을 때
            현재 구간을 확정합니다. 그래서 앞 사례는 세 구간에서 두 구간으로 줄고,
            원래 겹침 1초가 두 번 계산되지 않습니다.
          </p>
          <div className="not-prose my-6 border-y border-border py-4">
            <p className="mb-3 text-xs font-bold text-muted-foreground">실행 가능한 TypeScript 예시</p>
            <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6"><code>{INTERVAL_CODE}</code></pre>
          </div>
        </div>
      </section>

      <section id="sampling" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">학습과 평가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Interval을 어디에 놓을지는 sampling policy가 정합니다. 한 가지 방법은 영상을
            같은 길이의 segment로 나누고 각 segment에서 한 지점을 고르는 것입니다. 아래
            90-frame 사례에서는 세 segment를 만들지만, 학습과 평가는 선택 규칙이 다릅니다.
          </p>
        </div>
        <SegmentSamplingPolicyViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습의 무작위 선택은 같은 영상 안에서 여러 시점을 보여 주는 data augmentation입니다.
            반대로 평가까지 매번 무작위로 고르면 model 차이와 입력 차이가 섞입니다. 평가에서는
            중앙값처럼 고정된 규칙을 쓰고, 최종적으로 선택된 frame index나 timestamp를 기록해야
            실제 입력을 다시 만들 수 있습니다.
          </p>
          <div className="not-prose my-6 border-y border-border px-1 py-4">
            <p className="text-[10px] font-bold text-muted-foreground">TensorFlow Models 2.16.1 API</p>
            <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-[12px] leading-6 text-primary">
              sample_segment_sequence(sequence, num_frames, is_training, seed=None)
            </code>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              공식 문서는 <code>is_training=true</code>일 때 segment마다 무작위 frame을,
              <code> false</code>일 때 중앙 frame을 고른다고 설명합니다.
            </p>
          </div>
        </div>

        <div id="paper-tsn" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Wang et al. — Temporal Segment Networks"
            href="https://arxiv.org/abs/1608.00859"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>문제.</strong> 짧은 연속 구간만 읽는 video model이 긴 시간 구조를 놓치는 문제를 다룹니다.</p>
              <p><strong>기여.</strong> 영상을 segment로 나누고 sparse snippet을 고른 뒤 video-level consensus로 합치는 TSN을 제안합니다.</p>
              <p><strong>이 글의 사용.</strong> 전체 영상을 빽빽하게 읽지 않고도 여러 시간 영역에서 관측점을 고르는 sampling policy의 근거로 사용합니다.</p>
              <p><strong>근거 범위.</strong> 논문의 action-recognition datasets, two-stream 구조, 학습 recipe와 실험 범위입니다.</p>
              <p><strong>일반화 금지.</strong> Segment sampling이 모든 event 길이와 streaming task에서 최적이라는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>

        <div id="api-segment-sampling" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            citeKey={2}
            source="TensorFlow Models 2.16.1 — sample_segment_sequence"
            href="https://www.tensorflow.org/api_docs/python/tfm/vision/preprocess_ops_3d/sample_segment_sequence"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>정의.</strong> 첫 차원이 시간인 sequence를 같은 길이의 segment로 나누고 frame을 선택하는 공식 API입니다.</p>
              <p><strong>학습.</strong> <code>is_training=true</code>이면 각 segment에서 무작위 frame을 고릅니다.</p>
              <p><strong>평가.</strong> <code>is_training=false</code>이면 각 segment의 중앙 frame을 고릅니다.</p>
              <p><strong>근거 범위.</strong> TensorFlow Models 2.16.1 문서의 함수 계약이며, 다른 sampler의 동작을 대신 설명하지 않습니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="replay" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">평가 재현 기록</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 timestamp를 골랐다는 사실만으로 같은 평가가 되지는 않습니다. Decode와
            crop이 달라지면 model이 받는 tensor가 달라지고, model revision이나 score
            reducer가 달라져도 최종 video score가 바뀝니다. 아래 그림은 평가 ID
            <code> eval-017</code>을 다섯 경계에 유지해 처음 달라진 지점을 찾습니다.
          </p>
        </div>
        <ReplayReceiptTraceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Source hash가 다르면 비교 대상부터 다릅니다. Source와 temporal selection은 같은데
            tensor hash가 다르면 decode·resize·crop 경계가 갈라졌습니다. Tensor hash까지 같은데
            clip score가 다르면 model·dtype·runtime을 확인하고, clip score는 같은데 video score가
            다르면 reducer와 threshold를 확인합니다.
          </p>
          <p>
            이 기록이 bitwise 재현을 자동으로 보장하는 것은 아닙니다. 같은 입력과 revision을
            다시 만들고 어느 경계에서 결과가 달라졌는지 검사할 수 있게 하는 비교 계약입니다.
          </p>
          <div className="not-prose my-6 border-y border-border py-4">
            <p className="mb-3 text-xs font-bold text-muted-foreground">설명용 평가 재현 기록 · 실제 hash는 환경에서 생성</p>
            <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6"><code>{REPLAY_RECORD}</code></pre>
          </div>
        </div>
        <ExplainedFormula
          question="세 clip의 score를 mean reducer로 합치면 video score는 얼마입니까?"
          idea={<p>같은 class의 clip score를 더한 뒤 clip 수로 나눕니다.</p>}
          formula={String.raw`s_{\rm video}=\frac{1}{K}\sum_{j=1}^{K}s_j`}
          annotatedFormula={String.raw`s_{\rm video}=\frac{\underbrace{s_1+s_2+s_3}_{\text{같은 class의 clip scores}}}{\underbrace{3}_{\text{평가한 clip 수}}}`}
          operations={[
            { expression: String.raw`0.2+0.8+0.5=1.5`, annotation: ["세 clip의 같은 class score를", "한 번씩 더함"] },
            { expression: String.raw`1.5/3=0.5`, annotation: ["합계를 clip 세 개로 나눠", "video score를 계산"] },
          ]}
          terms={[
            { symbol: String.raw`s_j`, name: "Clip score", description: "j번째 clip에서 같은 class에 나온 score입니다." },
            { symbol: "K", name: "Clip count", description: "Reducer에 들어간 clip 수입니다." },
            { symbol: String.raw`s_{\rm video}`, name: "Video score", description: "이 예시의 mean reducer가 만든 영상 단위 score입니다." },
          ]}
          assumptions={[
            "0.2, 0.8, 0.5는 계산을 설명하기 위한 가정값입니다.",
            "Mean은 여러 reducer 중 하나이며 max·top-k·learned aggregation은 다른 결과를 만들 수 있습니다.",
            "Score를 class probability나 최종 판정으로 해석하려면 calibration·threshold·abstention 경계를 따로 확인해야 합니다.",
          ]}
          interpretation="설명용 clip score 0.2, 0.8, 0.5를 mean으로 합치면 video score는 0.5입니다. Reducer가 바뀌면 같은 clip score에서도 결과가 달라질 수 있습니다."
        />
      </section>

      <section id="return-map" data-teach-level="6" className="scroll-mt-20">
        <VideoMapReturn current="clip-sampling" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>확인</h2>
          <ol>
            <li>세 clip 길이의 합은 6초인데 실제 관측 시간은 왜 5초입니까? <strong>(답: Interval union)</strong></li>
            <li>학습과 평가가 같은 segment를 쓰면서도 다른 frame을 고르는 이유는 무엇입니까? <strong>(답: 학습과 평가)</strong></li>
            <li>Tensor hash는 같은데 video score가 다르면 어느 경계부터 확인해야 합니까? <strong>(답: 평가 재현 기록)</strong></li>
          </ol>
        </div>
      </section>
    </div>
  );
}
