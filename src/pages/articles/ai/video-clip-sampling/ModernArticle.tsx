import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { VideoClipSamplingViz } from "../video-understanding/viz/ModernVideoUnderstandingViz";

export default function VideoClipSamplingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Frame budget은 숫자 하나가 아니라 video timeline 위의 intervals입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            10초 영상에서 12 frames를 어디서 뽑았는지에 따라 관측 evidence가
            달라집니다. 한 구간에 몰리면 빠른 local motion은 잘 보지만 나머지
            사건은 놓칩니다. 여러 구간에 분산하면 긴 범위를 훑지만 짧은 변화는
            성기게 봅니다. 각 clip을 start·end timestamp interval로 먼저
            표현합니다.
          </p>
        </div>
        <TermBreakdown
          title="Clip sampling의 기본 단위"
          items={[
            {
              term: "Clip interval",
              description:
                "한 sampled clip이 실제로 덮는 start·end timestamp 구간입니다.",
            },
            {
              term: "Overlap",
              description:
                "둘 이상의 clips가 같은 시간을 반복 관측한 부분입니다. Frame compute는 쓰지만 coverage에는 한 번만 셉니다.",
            },
            {
              term: "Interval union",
              description:
                "겹친 구간을 합쳐 video에서 한 번이라도 본 모든 시간을 나타낸 집합입니다.",
            },
            {
              term: "Replay receipt",
              description:
                "평가 clip starts·decode·spatial crop·aggregation과 model revision을 묶은 재현 artifact입니다.",
            },
          ]}
        />
        <VideoClipSamplingViz />
        <ContentBoundary article="video-clip-sampling" />
      </section>

      <section id="coverage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          겹친 clip 길이를 두 번 더하지 않고 interval union만 셉니다
        </h2>
        <ExplainedFormula
          question="여러 clips가 video 전체 중 실제로 덮은 비율은 어떻게 계산하나요?"
          idea={
            <p>
              모든 intervals를 합집합으로 접어 overlap을 한 번만 남긴 뒤 그
              길이를 전체 video duration으로 나눕니다.
            </p>
          }
          formula={String.raw`C_{\rm time}=|\bigcup_j[a_j,b_j]|/D_{\rm video}`}
          annotatedFormula={String.raw`\begin{aligned}I_j&=\underbrace{[a_j,b_j]}_{\text{j번째 clip의 실제 timestamp 구간}}\\U&=\underbrace{\bigcup_{j=1}^{K}I_j}_{\text{겹친 시간을 하나의 union으로 병합}}\\L_{\rm seen}&=\underbrace{|U|}_{\text{중복 없는 관측 seconds 합산}}\\C_{\rm time}&=\underbrace{L_{\rm seen}/D_{\rm video}}_{\text{전체 duration으로 정규화}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`[a_j,b_j]`,
              annotation: [
                "clip indexes를 timestamps로 바꿔",
                "실제 시간 구간을 만듦",
              ],
            },
            {
              expression: String.raw`\bigcup_j I_j`,
              annotation: [
                "모든 구간을 합집합으로 접어",
                "overlap 중복을 제거",
              ],
            },
            {
              expression: String.raw`|U|`,
              annotation: ["union 길이를 재서", "관측한 seconds를 구함"],
            },
            {
              expression: String.raw`L_{\rm seen}/D_{\rm video}`,
              annotation: [
                "관측 seconds를 전체로 나눠",
                "영상 간 coverage를 비교 가능하게 함",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`[a_j,b_j]`,
              name: "Clip interval",
              description: "j번째 clip의 timestamp 범위입니다.",
            },
            {
              symbol: "K",
              name: "Clip count",
              description: "한 video에서 읽은 clips 수입니다.",
            },
            {
              symbol: String.raw`D_{\rm video}`,
              name: "Video duration",
              description: "전체 평가 영상 길이입니다.",
            },
            {
              symbol: String.raw`C_{\rm time}`,
              name: "Temporal coverage",
              description: "중복 없이 관측한 시간 비율입니다.",
            },
          ]}
          assumptions={[
            "모든 timestamp 단위는 seconds입니다.",
            "Clip 밖은 관측하지 않은 것으로 셉니다.",
            "Coverage가 높아도 label event를 포함했다는 뜻은 아닙니다.",
          ]}
          interpretation="10초 video에서 [0,2], [1,3], [8,10]의 단순합은 6초지만 union은 5초이므로 coverage는 .5입니다."
        />
      </section>

      <section id="replay" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Deterministic replay는 같은 video를 매번 같은 관측과 판정으로 다시
          읽습니다
        </h2>
        <TermBreakdown
          title="재현 가능한 evaluation receipt"
          items={[
            {
              term: "Source identity",
              description:
                "Video bytes·container·duration·timestamp table을 식별하는 checksum과 revision입니다.",
            },
            {
              term: "Temporal selection",
              description:
                "Clip starts, duration, stride, pad·truncate와 decode failure 정책입니다.",
            },
            {
              term: "Spatial selection",
              description: "Resize·crop·flip과 좌표 transform revision입니다.",
            },
            {
              term: "Video reducer",
              description:
                "Clip logits를 mean·max·top-k로 합치고 threshold·abstention을 적용하는 규칙입니다.",
            },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Training의 random start는 같은 video에서 다양한 구간을 보여주는 data
            augmentation입니다. Evaluation까지 random이면 두 model의 차이와 뽑힌
            clip 차이가 섞입니다. 평가 timestamps를 고정하되, 한 manifest만으로
            충분하다고 가정하지 말고 coverage sweep을 별도 ablation으로 둡니다.
          </p>
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Video split·coverage·replay가 닫힌 뒤에만 architecture score를
          비교합니다
        </h2>
        <TermBreakdown
          title="Sampling release gate"
          items={[
            {
              term: "Group split",
              description:
                "같은 source video·session·person의 clips가 train과 evaluation을 건너지 않습니다.",
            },
            {
              term: "Coverage slice",
              description:
                "Video duration과 event duration별 coverage·miss rate를 나눠 봅니다.",
            },
            {
              term: "Replay equality",
              description:
                "같은 receipt를 두 번 실행해 timestamps·tensor checksum·video score가 같습니다.",
            },
            {
              term: "Budget parity",
              description:
                "후보 models가 같은 총 frames·pixels·clips와 target hardware를 사용합니다.",
            },
          ]}
        />
        <div id="paper-tsn" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Wang et al. — Temporal Segment Networks"
            href="https://arxiv.org/abs/1608.00859"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 긴 video에서 전체 temporal structure를
                제한된 snippets로 학습하는 문제를 다룹니다.
              </p>
              <p>
                <strong>기여.</strong> 영상을 segments로 나누고 sparse
                snippets의 consensus로 video prediction을 만드는 TSN을
                제안합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 action datasets·segment
                sampling·two-stream architecture와 training recipe를 전제로
                합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Sparse temporal segment sampling과
                video-level consensus의 실험 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> Uniform segment sampling이 모든
                event duration과 streaming task에 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
