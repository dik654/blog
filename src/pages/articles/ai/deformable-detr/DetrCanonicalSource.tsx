import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import {
  ConceptPrimer,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import {
  DetrEvidenceLab,
  DetrQueryPipeline,
  HungarianAssignmentLab,
} from './viz/DetrSourceLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <M display className="my-0 text-[12px] sm:text-[15px]">{latex}</M>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function DetrCanonicalSource() {
  return (
    <>
      <section id="set-prediction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DETR은 가변 객체 문제를 N개의 책임 slot과 일대일 배정 문제로 바꾼다</h2>
        <QuestionLead
          question="100개 query가 두 개의 같은 고양이 box를 내면 둘 다 정답일까?"
          answer="아니다. DETR은 정답 객체와 예측 slot 사이에서 총 cost가 최소인 일대일 matching을 먼저 찾는다. 고양이 정답 하나는 query 하나만 책임지고, 중복 query는 남는 no-object target에 배정되어 class loss를 받는다. 이 unique assignment가 학습 단계에서 중복을 줄이는 핵심이다."
        />
        <ConceptPrimer items={[
          { term: 'Object query', meaning: '한 output slot을 구분하는 learned decoder embedding이다.', why: '가변 개수 객체를 고정 N개의 병렬 계산으로 만든다.' },
          { term: 'Padded target set', meaning: '실제 G개 정답 뒤에 N−G개의 ∅ target을 붙인 집합이다.', why: 'N개의 모든 query가 정확히 하나의 target과 짝을 갖게 한다.' },
          { term: 'Matching cost', meaning: 'Assignment를 고를 때 쓰는 class probability와 box similarity 비용이다.', why: '어느 query가 어느 정답을 책임질지 loss 전에 고정한다.' },
          { term: 'Hungarian loss', meaning: '선택된 pair에 적용하는 negative log class probability와 box loss다.', why: 'Matching 규칙과 gradient를 만드는 training objective를 구분한다.' },
          { term: 'No-object ∅', meaning: '해당 slot이 실제 객체를 담당하지 않는다는 특별 class다.', why: '고정 slot 수와 가변 객체 수의 차이를 흡수한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            정답 집합도 ∅로 pad해 N개로 만든 뒤, 모든 permutation 가운데 pairwise cost의 합이 최소인 배정 <code>σ̂</code>를 찾는다.
            Matching cost의 class 항은 probability를 쓰고, 실제 training loss는 negative log-probability를 쓴다. 원 논문은 box cost와
            class cost의 scale을 맞출 때 probability가 경험적으로 더 나았다고 보고했다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\hat\sigma}_{\text{최적 일대일 배정}}
=\arg\min_{\sigma\in\mathfrak S_N}
\sum_{i=1}^{N}
\underbrace{\mathcal L_{\mathrm{match}}
\!\left(y_i,\hat y_{\sigma(i)}\right)}_{\text{class probability + box similarity}}`}
          meaning="왜 permutation을 찾나: 출력 slot에는 고정 순서 의미가 없으므로 정답 객체와 query를 먼저 일대일로 대응해야 한다. 왜 전체 cost의 합을 최소화하나: 각 정답이 다른 query 하나를 선택하는 제약 안에서 image 전체 assignment를 함께 최적화해 같은 query나 같은 정답의 중복 사용을 막기 위해서다."
          symbols={[
            ['N', '고정된 prediction slot 수와 ∅를 포함해 pad한 target 수'],
            [String.raw`\mathfrak S_N`, 'N개 index의 가능한 모든 permutation 집합'],
            [String.raw`y_i`, 'i번째 target class와 normalized box'],
            [String.raw`\hat y_{\sigma(i)}`, 'Permutation이 target i에 배정한 query prediction'],
            [String.raw`\mathcal L_{\mathrm{match}}`, 'Assignment 선택에만 쓰는 pairwise class·box cost'],
          ]}
        />
        <Formula
          latex={String.raw`\mathcal L_{\mathrm{match}}(y_i,\hat y_j)=
\underbrace{-\mathbb 1_{\{c_i\ne\varnothing\}}\hat p_j(c_i)}_{\text{log가 아닌 class probability}}
+
\underbrace{\mathbb 1_{\{c_i\ne\varnothing\}}
\mathcal L_{\mathrm{box}}(b_i,\hat b_j)}_{\text{실제 객체일 때 box similarity}}`}
          meaning="왜 matching class 항에는 log를 쓰지 않나: 원 논문은 box cost와 수치 규모를 맞추기 쉽고 경험적으로 더 잘 동작한 raw probability를 사용했다. 왜 ∅에는 두 indicator가 모두 꺼지나: 빈 target끼리의 pair cost는 prediction과 무관한 상수로 두고, Hungarian search가 실제 객체를 어느 query가 맡을지에 집중하게 한다."
          symbols={[
            [String.raw`\hat p_j(c_i)`, 'Query j가 real target class cᵢ에 준 probability'],
            [String.raw`\mathbb 1_{\{c_i\ne\varnothing\}}`, 'Target이 실제 객체일 때만 1이 되는 indicator'],
            [String.raw`\mathcal L_{\mathrm{box}}`, 'L1과 generalized IoU를 결합한 pairwise box cost'],
            [String.raw`\varnothing`, '남는 query를 받아들이는 no-object target'],
          ]}
        />
        <HungarianAssignmentLab />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>배정을 고른 뒤에야 gradient를 만들 training loss를 계산한다</h3>
          <p>
            Real object pair에는 class와 box loss를 모두 적용한다. ∅ pair에는 box가 없으므로 class loss만 적용하고, 원 논문은 class imbalance를
            줄이기 위해 그 항을 10배 작게 만들었다. “No-object loss를 없앴다”가 아니라 weight를 <code>0.1</code>로 낮춘 것이다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\hat j_i}_{\text{target }i\text{ 담당 query}}
&=\hat\sigma(i)\\
\underbrace{\ell_i^{\mathrm{class}}}_{\substack{\text{선택 query}\\\text{분류 오차}}}
&=-w_i\log\hat p_{\hat j_i}(c_i)\\
\underbrace{\ell_i^{\mathrm{box}}}_{\substack{\text{실제 객체만}\\\text{위치 오차}}}
&=\mathbb 1_{\{c_i\ne\varnothing\}}
\mathcal L_{\mathrm{box}}(b_i,\hat b_{\hat j_i})\\
\mathcal L_{\mathrm{Hungarian}}
&=\sum_{i=1}^{N}\left[\ell_i^{\mathrm{class}}+\ell_i^{\mathrm{box}}\right]\\
\underbrace{w_i}_{\text{class weight}}
&=\begin{cases}1&c_i\ne\varnothing\\0.1&c_i=\varnothing\end{cases}\\
\mathcal L_{\mathrm{box}}
&=\underbrace{\lambda_{\mathrm{iou}}\mathcal L_{\mathrm{GIoU}}}_{\substack{\text{box scale에}\\\text{덜 민감}}}
+\underbrace{\lambda_{L1}\|b-\hat b\|_1}_{\text{좌표 오차}}
\end{aligned}`}
          meaning="왜 class 항에 log를 쓰나: 선택된 target class의 probability를 최대화하는 cross-entropy gradient를 만들기 위해서다. 왜 ∅ weight를 0.1로 낮추나: 실제 객체보다 훨씬 많은 빈 slot이 class gradient를 지배하지 않게 한다. 왜 L1과 GIoU를 함께 쓰나: normalized 좌표 차이를 직접 줄이면서 작은·큰 box에서 상대 overlap을 scale-invariant하게 보정하기 위해서다."
          symbols={[
            [String.raw`\hat j_i=\hat\sigma(i)`, 'Hungarian matching에서 target i를 맡도록 선택된 query index'],
            [String.raw`\hat p_j(c_i)`, 'Query j가 target class cᵢ에 준 probability'],
            [String.raw`w_i`, 'Real object면 1, no-object면 0.1인 class weight'],
            [String.raw`\mathbb 1_{\{c_i\ne\varnothing\}}`, '실제 object target일 때만 box loss를 켜는 indicator'],
            [String.raw`\mathcal L_{\mathrm{GIoU}}`, '겹치지 않는 box에도 gradient를 주는 generalized IoU loss'],
            [String.raw`\|b-\hat b\|_1`, 'Normalized center·width·height의 좌표별 absolute error'],
          ]}
        />
        <Misconception>
          Matching cost와 Hungarian training loss는 같은 식이 아니다. Matching은 pair 책임을 고르는 discrete assignment이고, training loss는 그
          선택된 pair에서 gradient를 만든다. 특히 원 DETR의 matching class 항은 probability, training class 항은 log-probability다.
        </Misconception>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>100개 query는 autoregressive sequence가 아니라 병렬 object slot이다</h3>
          <p>
            CNN feature를 1×1 convolution으로 d channel에 맞추고 HW position sequence로 펼쳐 encoder에 넣는다. Decoder에는 서로 다른
            N개의 learned object query를 넣고 모든 query를 각 layer에서 동시에 갱신한다. 각 output에 parameter를 공유하는 FFN을 적용해
            class와 normalized box 또는 ∅를 예측한다. 중간 decoder layer에도 같은 prediction head와 Hungarian loss를 붙이는 auxiliary
            supervision이 정확한 class별 객체 수를 출력하는 데 도움을 줬다.
          </p>
        </div>
        <DetrQueryPipeline />
        <CitationBlock source="Carion et al. · DETR" citeKey={1} href="https://arxiv.org/abs/2005.12872">
          <p>DETR은 bipartite matching loss와 parallel Transformer decoder로 detection을 direct set prediction 문제로 구성했다.</p>
        </CitationBlock>
      </section>

      <section id="detr-source-evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전체 AP가 같아도 원 DETR은 작은 객체와 수렴 비용에서 다른 실패를 남겼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            COCO validation의 ResNet-50 비교에서 DETR과 강화된 Faster R-CNN-FPN+는 모두 AP 42.0이었다. 그러나 DETR은
            AP<sub>small</sub> 20.5로 baseline 26.6보다 낮고, AP<sub>large</sub> 61.1로 baseline 53.4보다 높았다.
            평균 하나는 큰 객체의 +7.7 AP와 작은 객체의 −6.1 AP를 동시에 가린다. Encoder ablation은 global context가 특히
            큰 객체에 도움을 준다는 저자들의 해석을 지지하지만, 이 표 하나만으로 작은 객체 열세의 단일 원인을 확정할 수는 없다.
          </p>
          <p>
            최적화 비용도 영수증의 일부다. Ablation은 300 epoch, 16 V100에서 약 3일 걸렸고, Faster R-CNN 비교에는 500 epoch
            schedule을 사용했다. 500 epoch는 300 epoch보다 1.5 AP를 더했다. 이 병목이 다음 section의 Deformable DETR이
            reference point와 sparse multi-scale feature를 도입한 이유다.
          </p>
        </div>
        <DetrEvidenceLab />
        <Misconception>
          “DETR은 NMS가 필요 없다”를 decoder 첫 layer부터 완성된 성질로 오해하면 안 된다. 원 논문의 Figure 4에서 얕은 decoder output은
          NMS로 중복을 줄이면 개선됐고, layer가 깊어지며 query 간 communication과 matching 학습이 자리 잡자 NMS 이득이 사라지고 마지막에는
          true positive를 잘못 제거했다.
        </Misconception>
      </section>
    </>
  );
}
