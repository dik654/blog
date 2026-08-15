import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeVideoDecisionViz } from "../deepfake-detection/viz/ModernDeepfakeViz";

export default function DeepfakeVideoDecisionsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Frame score가 여러 개 생겨도 아직 video-level decision은 정해지지
          않았습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 video에는 여러 frame·clip·face track score가 있습니다. 이 값을
            평균할지, 가장 큰 하나를 볼지, 높은 k개만 평균할지에 따라 같은
            detector가 다른 video score를 냅니다. Reducer를 model 밖의 사소한
            후처리로 숨기지 않고 calibration·coverage·threshold와 함께 decision
            contract로 고정합니다.
          </p>
        </div>
        <TermBreakdown
          title="Frame output을 video decision으로 바꾸는 용어"
          items={[
            {
              term: "Temporal unit",
              description:
                "Score 하나를 내는 frame, clip 또는 identity-track segment입니다.",
            },
            {
              term: "Reducer",
              description:
                "여러 temporal scores를 하나로 합치는 mean·max·top-k 규칙입니다.",
            },
            {
              term: "Calibration",
              description:
                "집계된 score와 실제 event frequency의 대응을 validation에서 맞추는 단계입니다.",
            },
            {
              term: "Abstention",
              description:
                "Coverage·quality가 부족할 때 real/fake 대신 insufficient evidence를 반환하는 상태입니다.",
            },
          ]}
        />
        <DeepfakeVideoDecisionViz />
        <ContentBoundary article="deepfake-video-decisions" />
      </section>

      <section id="aggregation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Mean·max·top-k는 조작 evidence가 시간에 퍼진 모양을 다르게 가정합니다
        </h2>
        <ExplainedFormula
          question="일부 frame만 높은 score일 때 top-k mean은 어떤 연산으로 희석과 단일 spike 사이를 조절하나요?"
          idea={
            <p>
              Valid scores를 큰 값부터 정렬하고 앞의 k개만 선택해 더한 뒤 k로
              나눕니다. k가 전체 수이면 mean, k가 1이면 max가 됩니다.
            </p>
          }
          formula={String.raw`s_{\rm video}^{(k)}=k^{-1}\sum_{j=1}^{k}s_{(j)}`}
          annotatedFormula={String.raw`\begin{aligned}s_{(1)}&\ge\underbrace{s_{(2)}\ge\cdots\ge s_{(T)}}_{\text{valid scores를 큰 순서로 정렬}}\\H_k&=\underbrace{\{s_{(1)},\ldots,s_{(k)}\}}_{\text{가장 큰 k개만 선택}}\\S_k&=\underbrace{\sum_{j=1}^{k}s_{(j)}}_{\text{선택한 scores를 합산}}\\s_{\rm video}^{(k)}&=\underbrace{S_k/k}_{\text{k개 평균으로 video score 생성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`s_{(1)}\ge\cdots`,
              annotation: [
                "temporal scores를 내림차순으로 정렬해",
                "high-evidence units의 위치를 앞에 모음",
              ],
            },
            {
              expression: String.raw`\{s_{(1)},\ldots,s_{(k)}\}`,
              annotation: [
                "앞에서 k개만 잘라",
                "낮은 scores의 희석 범위를 제한",
              ],
            },
            {
              expression: String.raw`S_k/k`,
              annotation: [
                "선택 scores를 더해 개수로 나눠",
                "단일 max보다 안정적인 평균 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`s_{(j)}`,
              name: "Ordered score",
              description:
                "한 video 안에서 j번째로 큰 valid temporal score입니다.",
            },
            {
              symbol: "k",
              name: "Top-k budget",
              description: "Video score에 반영할 high-score units 수입니다.",
            },
            {
              symbol: String.raw`s_{\rm video}^{(k)}`,
              name: "Video score",
              description: "Calibration과 threshold가 읽는 집계 결과입니다.",
            },
          ]}
          assumptions={[
            "모든 scores는 같은 face track과 class 방향을 사용합니다.",
            "Video 길이가 다를 때 fixed k인지 비율인지 선언합니다.",
            "Negative video의 single-spike tail과 coverage를 함께 검사합니다.",
          ]}
          interpretation="Scores [.9,.8,.3,.1]이면 mean .525, max .9, top-2 mean .85입니다. 셋의 차이는 model accuracy가 아니라 temporal evidence 가정의 차이입니다."
        />
      </section>

      <section id="parity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          CNN·ViT·temporal model은 같은 split·crop·frame budget·reducer에서
          비교합니다
        </h2>
        <TermBreakdown
          title="Benchmark parity receipt"
          items={[
            {
              term: "Input parity",
              description:
                "같은 source split, decoder, face detector, crop과 frame timestamps를 사용합니다.",
            },
            {
              term: "Training parity",
              description:
                "Pretraining disclosure, resolution, batch·step budget과 seeds를 기록합니다.",
            },
            {
              term: "Decision parity",
              description:
                "같은 reducer, calibration split, threshold와 abstention rule을 사용합니다.",
            },
            {
              term: "Runtime parity",
              description:
                "같은 target hardware에서 latency·memory·coverage를 함께 측정합니다.",
            },
          ]}
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Aggregation 뒤 score를 다시 calibration하고 evidence 부족을 별도
          상태로 냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Frame-level calibration을 한 뒤 reducer를 바꾸면 video score
            distribution이 달라집니다. 최종 reducer를 고정한 validation
            predictions에 calibration을 다시 맞춥니다. Track coverage가 기준보다
            낮거나 valid units가 k보다 적으면 임의로 score를 보간하지 않고
            insufficient evidence를 반환합니다.
          </p>
        </div>
        <div id="paper-deepfakebench" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="DeepfakeBench · standardized comparison"
            href="https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 서로 다른 data
                processing·implementation·metric이 detector 순위를 왜곡합니다.
              </p>
              <p>
                <strong>기여.</strong> 통일 data management·method
                implementation·evaluation protocol을 제공합니다.
              </p>
              <p>
                <strong>가정.</strong> 포함된 datasets·methods·code revision을
                전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문이 재현한 standardized
                benchmark입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 해당 순위가 모든 미래
                generator·hardware에서 영구적 우열이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
