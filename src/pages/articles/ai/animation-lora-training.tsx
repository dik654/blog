import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { AdaptationDecisionViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationLoraTrainingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">LoRA를 쓰기 전에 무엇이 부족한지 분리한다</h2>
        <QuestionLead
          question="Base model이 손 동작을 자주 놓치면 animation LoRA를 학습하는 것이 가장 빠른 해결책일까?"
          answer="항상 그렇지 않다. Prompt가 모호한지, pose condition이 없는지, style domain이 다른지, base motion prior가 부족한지에 따라 intervention이 달라진다. LoRA는 작은 weight update이지 구조 제어·좋은 데이터·시간 정렬을 대신하는 만능 patch가 아니다."
        />
        <ConceptPrimer items={[
          { term: 'Adaptation target', meaning: 'Line style, character identity, motion vocabulary처럼 weight에 새로 넣으려는 능력이다.', why: '무엇을 학습하고 무엇을 condition으로 줄지 나눈다.' },
          { term: 'Control signal', meaning: 'Pose, edge, depth, trajectory처럼 실행 때마다 바뀌는 구조 입력이다.', why: '고정 style update와 shot별 geometry 지시를 혼동하지 않는다.' },
          { term: 'Retention set', meaning: 'Base model이 원래 잘하던 능력이 남았는지 보는 고정 평가 묶음이다.', why: 'Target score만 오르고 일반 motion이 무너지는 회귀를 잡는다.' },
          { term: 'Rollback artifact', meaning: 'Base revision, adapter, config와 optimizer state를 되돌릴 수 있게 보존한 묶음이다.', why: '실패한 실험이 production model을 덮어쓰지 않게 한다.' },
        ]} />
        <AdaptationDecisionViz />
      </section>

      <section id="lora-math" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">LoRA는 frozen weight에 low-rank 변화량을 더한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력 차원 <M>{String.raw`d_{in}`}</M>, 출력 차원 <M>{String.raw`d_{out}`}</M>인 선형층 <M>{String.raw`W`}</M>를 생각하자.
            Full fine-tuning은 <M>{String.raw`W`}</M> 전체를 바꾸지만 LoRA는 rank <M>{String.raw`r`}</M>인 두 행렬의 곱으로 변화량을 만든다.
          </p>
          <M display>{String.raw`\begin{aligned}
            y&=\underbrace{Wx}_{\text{동결한 base 출력}}
              +\underbrace{\frac{\alpha}{r}BAx}_{\text{학습하는 low-rank 변화}}\\
            A&\in\underbrace{\mathbb R^{r\times d_{\text{in}}}}_{\text{입력을 rank 공간으로 압축}},\qquad
            B\in\underbrace{\mathbb R^{d_{\text{out}}\times r}}_{\text{출력 공간으로 복원}}\\
            P_{\text{LoRA}}&=\underbrace{r(d_{\text{in}}+d_{\text{out}})}_{\text{학습 parameter 수}}
              \ll\underbrace{d_{\text{in}}d_{\text{out}}}_{\text{원래 weight 수}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="LoRA는 base weight를 고정한 채 작은 두 행렬만 학습한다. Rank는 표현 가능한 update 차원을 정하지만 높을수록 품질이 자동으로 좋아지는 knob가 아니다. Alpha와 target module까지 함께 봐야 실제 update scale을 안다."
            symbols={[
              [String.raw`W`, '그대로 보존하는 base 선형층 weight'],
              [String.raw`A,B`, '학습하는 low-rank adapter 행렬'],
              [String.raw`r`, '변화량이 통과하는 중간 차원'],
              [String.raw`\alpha/r`, 'rank가 커질 때 변화량 크기가 rank에 비례해 무작정 커지지 않도록 r로 나누고, alpha로 최종 update scale을 조절한다.'],
            ]}
          />
          <p>
            예를 들어 공식 config에 rank 64가 있다고 해서 animation의 시작값이 64로 정해지는 것은 아니다. Model size, target module, data 수와 다양성,
            batch·learning rate, 목표 능력이 다르면 같은 rank의 capacity와 memory가 다르다. 비교할 때는 rank만이 아니라 실제 trainable parameter 수와 update norm을 기록한다.
          </p>
          <CitationBlock source="LoRA: Low-Rank Adaptation of Large Language Models" citeKey={1} href="https://arxiv.org/abs/2106.09685">
            <p>LoRA 원 논문은 frozen pretrained weight에 trainable low-rank decomposition을 주입하는 원리를 제안했다. 언어 모델에서 보고한 효율·품질 결과를 video adaptation의 보장으로 옮기지 않는다.</p>
          </CitationBlock>
          <p>선형대수와 일반 fine-tuning의 더 바닥은 <InternalLink slug="lora-finetuning">LoRA & QLoRA</InternalLink>에서 확인한다.</p>
        </div>
      </section>

      <section id="target-modules" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Rank보다 먼저 target module과 능력 경계를 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention의 query·key·value·output에만 adapter를 붙이는 것과 MLP, temporal block, audio block까지 붙이는 것은 다른 실험이다.
            여기서 <strong>temporal block</strong>은 여러 video frame 사이의 움직임과 순서를 처리하는 층이고, <strong>audio block</strong>은 음성·음악 feature와 영상 feature를 연결하거나 함께 처리하는 층이다.
            “LoRA strength” UI 값은 이미 학습된 adapter를 inference에 섞는 scale이고 training rank와 같은 값이 아니다.
          </p>
          <p>Run manifest에는 다음을 분리한다.</p>
          <ul>
            <li><strong>Base identity:</strong> model, VAE, text/audio encoder revision과 license</li>
            <li><strong>Target:</strong> module name pattern, matched module count와 trainable parameter count</li>
            <li><strong>Adapter:</strong> rank, alpha, dropout, initialization과 checkpoint step</li>
            <li><strong>Optimization:</strong> learning rate, effective batch(gradient 한 번을 갱신하기 전에 합친 sample 수), timestep sampling(diffusion noise 단계를 뽑는 분포), precision(계산 숫자의 정밀도)과 gradient clipping(발산을 막기 위해 gradient norm에 두는 상한)</li>
            <li><strong>Data:</strong> dataset manifest hash, resolution buckets, frame distribution와 caption renderer version</li>
          </ul>
          <p>
            Style은 빨리 맞는데 motion이 나빠지면 “rank를 낮춘다” 하나로 끝내지 않는다. Temporal module까지 update했는지, still image가 video보다 과대표집되었는지,
            caption이 style token만 반복했는지와 timestep distribution을 확인한다.
          </p>
          <CitationBlock source="LTX-Video Trainer configuration reference · LTX-Video 계열" citeKey={2} href="https://github.com/Lightricks/LTX-Video-Trainer/blob/main/docs/configuration-reference.md">
            <p>LTX-Video 세대의 공식 trainer config는 rank·alpha·dropout뿐 아니라 target modules, optimization, conditioning, validation, checkpoint와 flow-matching 설정을 분리한다. 이 저장소의 예시와 typical range를 LTX-2를 포함한 다른 base model의 universal optimum으로 옮기지 않는다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="ic-lora" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">IC-LoRA는 style 이름이 아니라 reference-to-target control 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일반 style LoRA는 같은 prompt에서 line·palette·character 경향을 바꾸는 update로 쓸 수 있다. IC-LoRA는 reference video나 image에서 pose, depth, edge,
            trajectory 같은 구조 condition을 읽어 target video를 유도하는 transformation에 가깝다. 따라서 dataset sample도 target 하나가 아니라 시간 정렬된 reference와 target pair가 필요하다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \text{standard LoRA sample}&:\quad
              \underbrace{(c_i,x_i)}_{\text{caption과 target video}}\\
            \text{IC-LoRA sample}&:\quad
              \underbrace{(r_i,c_i,x_i)}_{\text{reference condition·caption·target}}\\
            \operatorname{time}(r_i)&=\underbrace{\operatorname{time}(x_i)}_{\text{frame·timestamp 정렬}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="IC-LoRA는 reference와 target의 구조가 같은 시간 위치에서 대응해야 한다. Pose frame이 한 칸 밀리면 model은 잘못된 motion relation을 학습한다."
            symbols={[
              [String.raw`c_i`, '자연어 또는 구조화 condition'],
              [String.raw`x_i`, '생성해야 할 target animation clip'],
              [String.raw`r_i`, 'pose·depth·edge·trajectory 같은 reference input'],
              [String.raw`\operatorname{time}`, 'frame count, FPS와 timestamp를 포함한 시간축'],
            ]}
          />
          <p>
            Pose control로 hand path를 고정할 수는 있어도 face identity나 line style이 자동으로 해결되지는 않는다. 반대로 style LoRA가 강해도 shot별 pose를 정확히 따라간다는 보장은 없다.
            두 adapter를 stack한다면 각각 단독 run과 함께 비교해 상호작용을 측정한다.
          </p>
          <CitationBlock source="LTX-2 Dataset Preparation Guide · LTX-2 계열" citeKey={3} href="https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md">
            <p>LTX-2 저장소에 포함된 trainer의 IC-LoRA dataset은 target `media_path`와 별도의 `reference_path`를 요구하고 reference video를 함께 전처리한다. 이는 일반 caption-target LoRA와 다른 실행 계약이며, 앞 절의 LTX-Video config 예시와 같은 generation의 manifest로 섞지 않는다.</p>
          </CitationBlock>
          <Misconception>IC-LoRA의 “in-context”는 LLM의 in-context learning과 같은 실행을 뜻한다고 가정하지 않는다. 이 문맥에서는 reference condition을 video generation에 주입하는 adapter 명칭이다.</Misconception>
        </div>
      </section>

      <section id="validation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Target score와 base retention을 같은 step에서 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Train loss가 계속 내려가도 production 품질은 나빠질 수 있다. Validation은 target set과 retention set 두 갈래로 둔다. Target set은 animation line·motion·identity가 좋아졌는지,
            retention set은 base가 잘하던 일반 camera·object motion·prompt following이 남았는지 본다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \Delta q_{\text{target}}&=\underbrace{q_{\text{target}}(W')-q_{\text{target}}(W)}_{\text{목표 능력 향상}}\\
            \Delta q_{\text{retain}}&=\underbrace{q_{\text{retain}}(W')-q_{\text{retain}}(W)}_{\text{기존 능력 변화}}\\
            \text{accept}&=\underbrace{\mathbf 1[\Delta q_{\text{target}}>0]}_{\text{목표 개선}}
              \cdot\underbrace{\mathbf 1[\Delta q_{\text{retain}}\ge-\epsilon]}_{\text{허용 회귀 안쪽}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="좋은 adapter는 target만 올리는 것이 아니라 허용한 범위 안에서 base 능력을 보존한다. 두 indicator를 곱하는 것은 논리곱 AND와 같아서, 목표 개선과 기존 능력 보존 중 하나라도 실패하면 accept가 0이 된다. Epsilon은 metric noise와 business risk를 반영해 실험 전에 정한다."
            symbols={[
              [String.raw`W,W'`, 'Base weight와 adapter를 적용한 weight'],
              [String.raw`q_{target}`, 'animation-specific target fixture의 품질'],
              [String.raw`q_{retain}`, 'base capability fixture의 품질'],
              [String.raw`\epsilon`, '허용하는 최대 retention 하락'],
            ]}
          />
          <p>
            Checkpoint마다 같은 prompt·seed·reference를 생성하고 raw decode를 저장한다. Best checkpoint는 train loss minimum이 아니라 target gate를 통과하면서 retention과 runtime budget을 지킨 step이다.
            Adapter file, config, dataset hash, metrics와 known failures를 하나의 release package로 묶는다.
          </p>
        </div>
      </section>

      <section id="experiment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번에 한 가설만 바꾸는 실험 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>Base manifest와 target·retention fixture를 고정한다.</li>
            <li>Prompt·sampling만 고쳐 training 없이 해결되는지 확인한다.</li>
            <li>Geometry failure면 공개 control adapter 또는 작은 IC-LoRA pair 실험을 먼저 한다.</li>
            <li>Domain tendency가 부족하면 한 target-module set에서 rank·alpha보다 data·caption pair를 먼저 검증한다.</li>
            <li>한 run에서는 dataset, target modules, rank, learning rate 중 한 축만 바꾼다.</li>
            <li>Target·retention·memory·latency·rights gate가 모두 닫혀야 adapter를 배포한다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          'Rank, alpha, target module과 inference strength를 서로 다른 값으로 설명할 수 있다.',
          '일반 LoRA sample과 IC-LoRA reference-target pair의 실행 차이를 설명할 수 있다.',
          '손 동작 실패가 prompt, structural control, domain adaptation 중 누구의 책임인지 좁힐 수 있다.',
          'Target 향상과 base retention을 함께 보고 checkpoint를 선택할 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 <InternalLink slug="animation-fps-vfi">Temporal Finishing</InternalLink> 글에는 native frame과 timestamp, adapter가 보존해야 할 hold·smear·impact 위치를 넘긴다.
            이 위치가 <strong>protected cadence marker</strong>, 즉 후처리 뒤에도 의도대로 남아야 하는 timing 표식이다. Target·retention 결과와 adapter revision은 최종 평가 manifest까지 함께 전달한다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'LoRA paper', href: 'https://arxiv.org/abs/2106.09685', note: 'Frozen weight와 low-rank update의 canonical 수학 근거.' },
          { label: 'LTX-2 trainer · LTX-2 계열', href: 'https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer', note: 'LTX-2에서 LoRA, full fine-tuning과 IC-LoRA를 분리한 공개 implementation. LTX-Video Trainer의 config 세대와 구분해 읽는다.' },
          { label: 'LTX IC-LoRA adapters', href: 'https://docs.ltx.video/open-source-model/integration-tools/ic-lo-ra-adapters', note: 'Pose, depth, edge, trajectory와 reference sheet 등 control adapter의 현재 공개 범위.' },
        ]} />
      </section>
    </div>
  );
}
