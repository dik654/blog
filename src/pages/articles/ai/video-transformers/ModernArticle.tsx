import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { VideoTransformerViz } from "../video-understanding/viz/ModernVideoUnderstandingViz";

export default function VideoTransformersArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Video transformer는 pixel grid를 시공간 token sequence로 바꾸는 데서
          시작합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Image patch에 시간축을 하나 더 붙이면 token 수가 frame 수만큼
            늘어납니다. 그 뒤 모든 tokens를 직접 연결할지, 같은 시간의 공간
            관계와 같은 위치의 시간 관계로 나눌지에 따라 계산량과 정보 경로가
            달라집니다. 먼저 tubelet 하나의 모양과 전체 token count를
            고정합니다.
          </p>
        </div>
        <TermBreakdown
          title="Video tokenization의 용어"
          items={[
            {
              term: "Tubelet",
              description:
                "연속 τ frames에서 같은 P×P 공간 위치를 묶은 작은 3D input block입니다.",
            },
            {
              term: "Temporal positions",
              description:
                "T frames를 τ씩 묶고 남는 시간축 token 위치 수입니다.",
            },
            {
              term: "Spatial positions",
              description:
                "한 temporal position에서 H×W를 P×P patches로 나눈 위치 수입니다.",
            },
            {
              term: "Position state",
              description:
                "시간과 공간 token 순서를 model이 구분하도록 checkpoint와 함께 versioning하는 좌표 정보입니다.",
            },
          ]}
        />
        <VideoTransformerViz />
        <ContentBoundary article="video-transformers" />
      </section>

      <section id="tubelets" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          시간·높이·너비 방향 tubelet 수를 곱해 sequence length를 만듭니다
        </h2>
        <ExplainedFormula
          question="T×H×W clip을 τ×P×P tubelets로 자르면 token은 몇 개인가요?"
          idea={
            <p>
              각 축 길이를 block 크기로 나눠 축별 block 수를 구하고 세 값을
              곱합니다.
            </p>
          }
          formula={String.raw`N=(T/\tau)(H/P)(W/P)`}
          annotatedFormula={String.raw`\begin{aligned}N_t&=\underbrace{T/\tau}_{\substack{\text{frame 수를 tubelet depth로 나눠}\\\text{temporal positions 계산}}}\\[4pt]N_h&=\underbrace{H/P}_{\substack{\text{높이를 patch width로 나눠}\\\text{vertical positions 계산}}}\\[4pt]N_w&=\underbrace{W/P}_{\substack{\text{너비를 patch width로 나눠}\\\text{horizontal positions 계산}}}\\[4pt]N&=\underbrace{N_tN_hN_w}_{\substack{\text{세 축의 위치 수를 곱해}\\\text{전체 tubelet 수 계산}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`T/\tau`,
              annotation: [
                "frame 수를 tubelet depth로 나눠",
                "temporal positions를 구함",
              ],
            },
            {
              expression: String.raw`H/P`,
              annotation: [
                "height를 patch size로 나눠",
                "vertical positions를 구함",
              ],
            },
            {
              expression: String.raw`W/P`,
              annotation: [
                "width를 patch size로 나눠",
                "horizontal positions를 구함",
              ],
            },
            {
              expression: String.raw`N_tN_hN_w`,
              annotation: ["세 축 count를 곱해", "전체 tubelet 조합 수를 구함"],
            },
          ]}
          terms={[
            {
              symbol: "T,H,W",
              name: "Clip shape",
              description: "Frames·height·width입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Tubelet depth",
              description: "Token 하나가 묶는 연속 frame 수입니다.",
            },
            {
              symbol: "P",
              name: "Patch width",
              description: "Token 하나가 묶는 공간 한 변 pixels입니다.",
            },
            {
              symbol: "N",
              name: "Token count",
              description: "Transformer sequence에 들어가는 tubelets 수입니다.",
            },
          ]}
          assumptions={[
            "T는 τ로, H와 W는 P로 나누어떨어집니다.",
            "Non-overlapping tubelets이며 special token은 생략합니다.",
            "Resize·variable FPS와 positional interpolation은 별도 contract입니다.",
          ]}
          interpretation="16×224×224, τ=2, P=16이면 8×14×14=1,568 tokens입니다."
        />
      </section>

      <section id="attention-cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Joint attention과 factorized attention은 연결 그래프 자체가 다릅니다
        </h2>
        <TermBreakdown
          title="Space-time interaction을 나누는 방식"
          items={[
            {
              term: "Joint attention",
              description:
                "모든 TS tokens가 한 attention matrix에서 직접 서로를 비교합니다.",
            },
            {
              term: "Spatial attention",
              description:
                "각 temporal position 안에서 S spatial tokens를 연결하며 이 연산을 T번 수행합니다.",
            },
            {
              term: "Temporal attention",
              description:
                "각 spatial position에서 T temporal tokens를 연결하며 이 연산을 S번 수행합니다.",
            },
            {
              term: "Factorized encoder",
              description:
                "Frame별 spatial encoder output을 줄인 뒤 별도 temporal encoder가 clip 관계를 읽는 구조입니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="Joint pair 수와 divided space-time pair 수는 어떻게 비교하나요?"
          idea={
            <p>
              Joint는 TS개 tokens 전체를 제곱합니다. Divided는 frame마다 S²,
              spatial position마다 T² interactions를 더합니다.
            </p>
          }
          formula={String.raw`C_j=(TS)^2,\quad C_d=TS^2+ST^2`}
          annotatedFormula={String.raw`\begin{aligned}N&=\underbrace{TS}_{\text{time과 space positions를 한 sequence로 결합}}\\C_j&=\underbrace{N^2}_{\text{모든 token pairs를 직접 연결}}\\C_s&=\underbrace{T S^2}_{\text{각 time에서 spatial pairs를 계산}}\\C_t&=\underbrace{S T^2}_{\text{각 place에서 temporal pairs를 계산}}\\C_d&=\underbrace{C_s+C_t}_{\text{두 축 interaction 비용을 합산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`TS`,
              annotation: [
                "시간과 공간 위치를 곱해",
                "전체 sequence length를 만듦",
              ],
            },
            {
              expression: String.raw`N^2`,
              annotation: [
                "sequence length를 제곱해",
                "joint pair proxy를 구함",
              ],
            },
            {
              expression: String.raw`TS^2`,
              annotation: [
                "frame별 spatial pair를 T번 계산해",
                "space cost를 구함",
              ],
            },
            {
              expression: String.raw`ST^2`,
              annotation: [
                "위치별 temporal pair를 S번 계산해",
                "time cost를 구함",
              ],
            },
            {
              expression: String.raw`C_s+C_t`,
              annotation: ["두 단계 비용을 더해", "divided pair proxy를 구함"],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Temporal positions",
              description: "Tubelet 변환 뒤 시간축 위치 수입니다.",
            },
            {
              symbol: "S",
              name: "Spatial positions",
              description: "시간 위치 하나의 patch tokens 수입니다.",
            },
            {
              symbol: String.raw`C_j`,
              name: "Joint pair proxy",
              description: "모든 TS tokens를 직접 연결하는 score pairs입니다.",
            },
            {
              symbol: String.raw`C_d`,
              name: "Divided pair proxy",
              description:
                "Spatial과 temporal attention score pairs의 합입니다.",
            },
          ]}
          assumptions={[
            "Dense score pairs만 세고 heads·dimension·memory traffic은 생략합니다.",
            "Divided block의 두 attention을 모두 수행합니다.",
            "Pair 감소가 같은 latency·accuracy·connectivity를 보장하지 않습니다.",
          ]}
          interpretation="T=8,S=196이면 joint는 약 2.46M pairs, divided는 약 320k pairs입니다. 대신 한 layer에서 모든 space-time pair가 직접 연결되지는 않습니다."
        />
        <div id="paper-timesformer" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Bertasius et al. — TimeSformer"
            href="https://proceedings.mlr.press/v139/bertasius21a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Video patch tokens 사이의 space-time
                self-attention 구조를 비교합니다.
              </p>
              <p>
                <strong>기여.</strong> Joint와 여러 factorized schemes를
                제시하고 divided attention을 평가합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 pretraining·clip
                length·resolution·datasets를 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> TimeSformer architecture와 논문
                video classification 실험입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> Divided attention이 모든 sequence
                length와 kernel에서 같은 우위를 보장하지 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="masked-pretraining" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          VideoMAE는 masked tokens를 큰 encoder input에서 제외합니다
        </h2>
        <ExplainedFormula
          question="Mask ratio m일 때 encoder가 실제로 읽는 visible token 수는 얼마인가요?"
          idea={
            <p>
              전체 token 중 가린 비율 m을 제외한 1−m 몫만 encoder input으로
              남깁니다.
            </p>
          }
          formula={String.raw`N_{\rm vis}=(1-m)N`}
          annotatedFormula={String.raw`\begin{aligned}r_{\rm vis}&=\underbrace{1-m}_{\text{전체 비율에서 masked 몫을 제외}}\\N_{\rm raw}&=\underbrace{r_{\rm vis}N}_{\text{visible 비율을 전체 token 수에 적용}}\\N_{\rm vis}&=\underbrace{\operatorname{round}(N_{\rm raw})}_{\text{구현 규칙으로 정수 token 수 결정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-m`,
              annotation: [
                "전체 1에서 mask ratio를 빼",
                "visible fraction을 구함",
              ],
            },
            {
              expression: String.raw`r_{\rm vis}N`,
              annotation: [
                "visible fraction을 token 수에 곱해",
                "encoder 입력 크기를 구함",
              ],
            },
            {
              expression: String.raw`\operatorname{round}(N_{\rm raw})`,
              annotation: [
                "fractional count를 구현 규칙으로 반올림해",
                "실제 token index 수를 결정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "m",
              name: "Mask ratio",
              description: "Encoder에서 제외하는 tubelet 비율입니다.",
            },
            {
              symbol: "N",
              name: "Full token count",
              description: "Masking 전 tubelet sequence length입니다.",
            },
            {
              symbol: String.raw`N_{\rm vis}`,
              name: "Visible tokens",
              description: "큰 encoder가 실제로 처리하는 token 수입니다.",
            },
          ]}
          assumptions={[
            "Mask index 생성과 rounding rule을 receipt에 기록합니다.",
            "Decoder는 masked targets를 복원하기 위해 별도 비용을 냅니다.",
            "Encoder pair 감소가 end-to-end speedup과 같다는 뜻은 아닙니다.",
          ]}
          interpretation="N=1,568, m=.9이면 raw visible count는 156.8이고 구현 규칙에 따라 약 157 tokens가 encoder에 들어갑니다."
        />
        <div id="paper-videomae" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Tong et al. — VideoMAE"
            href="https://openreview.net/forum?id=AhccnBXSne"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Video의 높은 시간 중복을 활용해
                self-supervised pretraining 비용을 줄입니다.
              </p>
              <p>
                <strong>기여.</strong> 높은 tube masking ratio와 visible-token
                encoder·light decoder 구성을 제안합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 video datasets·tube
                masking·encoder/decoder·transfer setting을 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> VideoMAE pretraining과 downstream
                transfer 실험 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 90% masking이 motion redundancy가
                다른 모든 domain에서 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
