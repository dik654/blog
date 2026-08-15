import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ImageTrainingViz } from "../image-classification-pipeline/viz/ModernImageClassificationViz";

export default function ImageTrainingStagesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Training stage는 같은 objective와 resource clock을 공유하는 실행
          구간입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Resolution, crop distribution, batch size, optimizer clock 중
            하나라도 바뀌면 sample이 model에 보이는 방식과 한 update의 의미가
            달라집니다. 이전 checkpoint를 이어 쓰더라도 같은 stage의 단순 연장이
            아닙니다. 변경 시점과 handoff state를 별도 artifact로 기록합니다.
          </p>
          <p>
            먼저 supervised baseline을 고정합니다. Augmentation의 의미와 target
            transform은 <Link to="/ai/data-augmentation">데이터 증강 정본</Link>
            을 재사용합니다. 그다음 resolution stage와 pseudo-label stage를
            동시에 켜지 않고 한 축씩 추가합니다.
          </p>
        </div>
        <TermBreakdown
          title="Stage boundary에서 보존할 것"
          items={[
            {
              term: "Input state",
              description:
                "Resolution, decode, crop scale, normalization과 augmentation revision입니다.",
            },
            {
              term: "Optimization state",
              description:
                "Checkpoint, optimizer moments, effective batch와 stage-local learning-rate clock입니다.",
            },
            {
              term: "Position state",
              description:
                "ViT position interpolation처럼 resolution 변경과 함께 변환할 learned state입니다.",
            },
            {
              term: "Evaluation receipt",
              description:
                "같은 group split, slices, update budget, latency와 stage별 gain입니다.",
            },
          ]}
        />
        <ImageTrainingViz />
        <ContentBoundary article="image-training-stages" />
      </section>

      <section id="resolution-stage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Progressive resizing은 pixel 수뿐 아니라 batch와 optimizer step의
          의미도 바꿉니다
        </h2>
        <ExplainedFormula
          question="Resolution stage가 바뀔 때 한 update가 보는 images 수를 어떻게 비교하나요?"
          idea={
            <p>
              Device당 batch와 gradient accumulation, device 수를 곱해 effective
              batch를 계산하고 stage별 optimizer updates와 함께 기록합니다.
            </p>
          }
          formula={String.raw`B_{\rm eff}=B_{\rm device}A_gG`}
          annotatedFormula={String.raw`\begin{aligned}B_{\rm step}&=\underbrace{B_{\rm device}G}_{\substack{\text{device별 images를 합쳐}\\\text{한 micro-step의 전체 batch 계산}}}\\[4pt]B_{\rm eff}&=\underbrace{B_{\rm step}A_g}_{\substack{\text{accumulated micro-steps를 곱해}\\\text{optimizer update당 images 계산}}}\\[4pt]E_s&=\underbrace{B_{\rm eff}U_s}_{\substack{\text{stage updates를 곱해}\\\text{총 image exposures 계산}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`B_{\rm device}G`,
              annotation: [
                "device별 batch와 device 수를 곱해",
                "분산 micro-batch를 합침",
              ],
            },
            {
              expression: String.raw`B_{\rm step}A_g`,
              annotation: [
                "gradient accumulation 수를 곱해",
                "update당 effective batch를 구함",
              ],
            },
            {
              expression: String.raw`B_{\rm eff}U_s`,
              annotation: [
                "effective batch와 update 수를 곱해",
                "stage의 sample exposure를 비교",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B_{\rm device}`,
              name: "Per-device batch",
              description: "한 device가 micro-step에서 읽는 images 수입니다.",
            },
            {
              symbol: "G",
              name: "Device count",
              description: "동시에 gradient를 만드는 workers 수입니다.",
            },
            {
              symbol: String.raw`A_g`,
              name: "Accumulation",
              description:
                "Optimizer update 전에 누적하는 micro-steps 수입니다.",
            },
            {
              symbol: String.raw`U_s`,
              name: "Stage updates",
              description:
                "Resolution stage s에서 수행한 optimizer update 수입니다.",
            },
          ]}
          assumptions={[
            "마지막 불완전 batch·sample weighting·repeated augmentation은 별도로 기록합니다.",
            "Exposure 수가 같아도 resolution과 crop distribution이 같다는 뜻은 아닙니다.",
            "Learning rate 조정 규칙은 자동 진리가 아니라 paired ablation 대상입니다.",
          ]}
          interpretation="160px에서 batch 256, 320px에서 memory 때문에 batch 64라면 같은 update 수가 같은 image exposure를 만들지 않습니다. Handoff manifest에 batch와 local clock을 함께 기록합니다."
        />
      </section>

      <section id="pseudo-label" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Pseudo-label은 weak view의 임시 답을 strong view의 학습 target으로
          넘깁니다
        </h2>
        <TermBreakdown
          title="Weak→select→strong 네 단계"
          items={[
            {
              term: "Unlabeled pool",
              description:
                "Target population에서 왔지만 human label이 없는 images와 provenance입니다.",
            },
            {
              term: "Weak view",
              description:
                "Model의 현재 class belief를 크게 깨지 않고 pseudo-label을 읽는 변환입니다.",
            },
            {
              term: "Confidence gate",
              description:
                "Maximum predicted probability가 threshold 이상인 sample만 loss에 포함하는 선택입니다.",
            },
            {
              term: "Strong view",
              description:
                "선택된 pseudo-label을 유지하도록 더 강한 label-preserving transform에 consistency를 요구합니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="어떤 unlabeled image가 pseudo-label loss에 들어가고 무엇을 줄이나요?"
          idea={
            <p>
              Weak-view 분포에서 가장 큰 class와 confidence를 읽고 threshold를
              통과한 경우에만 strong-view cross-entropy를 남깁니다.
            </p>
          }
          formula={String.raw`\mathcal L_u=\mathbf1[q_{\max}\ge\tau]\operatorname{CE}(\widehat y,r)`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{p_\theta(y\mid a_w(u))}_{\text{weak view에서 class 분포 계산}}\\[4pt]\widehat y&=\underbrace{\arg\max_c q_c}_{\text{가장 큰 class를 임시 label로 선택}}\\[4pt]I_\tau&=\underbrace{\mathbf1[\max_cq_c\ge\tau]}_{\substack{\text{confidence가 기준 이상일 때만}\\\text{sample을 admission}}}\\[4pt]\mathcal L_u&=\underbrace{I_\tau\operatorname{CE}(\widehat y,p_\theta(y\mid a_s(u)))}_{\substack{\text{선택된 임시 label과 strong view의}\\\text{예측 차이를 줄임}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p_\theta(y\mid a_w(u))`,
              annotation: [
                "unlabeled image를 weak transform해",
                "현재 class distribution을 읽음",
              ],
            },
            {
              expression: String.raw`\arg\max_cq_c`,
              annotation: [
                "가장 큰 probability index를 골라",
                "hard pseudo-label을 만듦",
              ],
            },
            {
              expression: String.raw`\mathbf1[\max_cq_c\ge\tau]`,
              annotation: [
                "maximum confidence를 threshold와 비교해",
                "loss 포함 여부를 정함",
              ],
            },
            {
              expression: String.raw`I_\tau\operatorname{CE}(\widehat y,r)`,
              annotation: [
                "선택 gate와 CE를 곱해",
                "admitted strong view만 update",
              ],
            },
          ]}
          terms={[
            {
              symbol: "u",
              name: "Unlabeled image",
              description: "Target pool의 label 없는 image입니다.",
            },
            {
              symbol: String.raw`a_w,a_s`,
              name: "Weak·strong views",
              description:
                "Pseudo-label을 읽는 변환과 consistency를 학습하는 변환입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Confidence threshold",
              description:
                "Loss admission에 필요한 minimum maximum probability입니다.",
            },
            {
              symbol: String.raw`I_\tau`,
              name: "Admission indicator",
              description: "통과하면 1, 아니면 0인 selection gate입니다.",
            },
          ]}
          assumptions={[
            "Unlabeled pool이 target classes와 operational population을 대표합니다.",
            "Weak·strong transforms가 class semantics를 보존합니다.",
            "Validation identities는 unlabeled pool과 teacher update에서 격리합니다.",
          ]}
          interpretation="Threshold .95는 정답 보증이 아닙니다. Class A precision .98·coverage .60과 class B precision .82·coverage .08을 분리해 보고 오류 증폭을 감시합니다."
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          전체 selected count가 아니라 class별 precision·coverage와 rollback을
          봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Release receipt에는 teacher revision, unlabeled source, threshold,
            weak·strong policy, class별 selected count·precision·coverage와
            supervised baseline 대비 paired gain을 남깁니다. Minority class
            coverage가 무너지거나 high-confidence error가 연속되면 이전
            supervised generation으로 되돌립니다.
          </p>
        </div>
        <div id="paper-randaugment" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Cubuk et al. — RandAugment"
            href="https://proceedings.neurips.cc/paper/2020/hash/d85b63ef0ccb114d0a3bb7b7d808028f-Abstract.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Operation별 augmentation policy search가
                크고 proxy task에 의존합니다.
              </p>
              <p>
                <strong>기여.</strong> Operation 수와 공통 magnitude 중심으로
                search space를 단순화합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 operation
                set·benchmarks·models·training recipe입니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Reduced search space와 benchmark
                improvement 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 모든 domain에서 동일 operation이
                label을 보존한다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-fixmatch" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Sohn et al. — FixMatch"
            href="https://proceedings.neurips.cc/paper/2020/hash/06964dce9addb1c5cb5d6e3d9838f733-Abstract.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 적은 labeled images와 많은 unlabeled
                images를 단순한 consistency objective로 활용합니다.
              </p>
              <p>
                <strong>기여.</strong> Weak-view confidence pseudo-label과
                strong-view consistency를 결합합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 label regime·class-balanced
                benchmarks·augmentation·unlabeled distribution입니다.
              </p>
              <p>
                <strong>근거 범위.</strong> CIFAR·SVHN·STL benchmark와 ablation
                범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> Threshold 하나가 OOD·imbalanced
                pool의 label quality를 보장하지 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
