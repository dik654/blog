import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import { DistillationSignalLab } from './practical-compression/viz/CompressionDecisionLabs';

export default function KnowledgeDistillationArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="큰 모델의 신호를 작은 모델 학습으로 옮기는 고급 경로"
        description="Teacher가 내놓는 정답, 확률 분포, hidden feature 또는 생성 data 중 무엇을 student가 볼 수 있는지에 따라 증류 방법을 고른다. Token과 확률 분포의 기본을 먼저 안다고 가정한다."
        prerequisites={[
          'Text가 tokenizer를 거쳐 token ID sequence로 바뀐다는 뜻을 안다.',
          'Logit과 softmax가 같은 vocabulary 위의 확률 분포를 만든다는 뜻을 안다.',
          'Training loss가 student parameter를 바꾸는 신호라는 점을 안다.',
        ]}
        links={[
          { slug: 'tokenizer', title: 'Tokenizer와 vocabulary', reason: '서로 다른 token ID가 왜 같은 사건을 뜻하지 않는지 먼저 배운다.' },
          { slug: 'probability-information-theory', title: '확률과 정보량', reason: 'Softmax, cross-entropy와 KL divergence를 읽을 기반을 잡는다.' },
        ]}
      />
      <NlpSection
        id="teacher-contract"
        marker="00"
        tone="blue"
        question="Teacher가 정답을 많이 생성하면 그 자체가 지식 증류일까?"
        title="Student에게 전달할 신호와 접근 권한부터 정의한다"
      >
        <QuestionLead
          question="Teacher와 Student의 tokenizer가 다른데 같은 token 위치의 logit을 KL divergence로 맞출 수 있을까?"
          answer="그대로는 안 된다. 서로 다른 token id는 같은 사건을 뜻하지 않는다. Vocabulary alignment를 만들거나, 완성된 sequence를 target으로 쓰는 다른 증류 신호를 선택해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Knowledge distillation은 큰 teacher의 관측 가능한 신호를 사용해 student를 학습하는
            family다. 정답 class뿐 아니라 class distribution, intermediate feature, 생성 sequence,
            ranking·verifier feedback과 teacher-generated data를 쓸 수 있다. 무엇을 볼 수 있는지가
            loss와 비용을 결정한다.
          </p>
          <p>
            White-box teacher는 logit·hidden state·attention을 제공할 수 있지만 memory와 동시 forward
            비용이 크다. Black-box API는 보통 sampled output만 주며 logit KD를 할 수 없다. 대신
            prompt, teacher version, system instruction, decoding·sampling, filter와 response
            provenance를 dataset lineage로 남긴 sequence/data distillation을 한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Teacher ceiling', meaning: 'Target domain에서 teacher가 실제로 달성하는 품질 상한과 오류 분포', why: 'Student는 teacher의 지식뿐 아니라 일관된 오류와 편향도 배울 수 있다.' },
          { term: 'Soft target', meaning: '한 정답 label이 아니라 teacher가 모든 class·token에 준 확률 분포', why: '비슷한 대안과 teacher uncertainty를 전달한다.' },
          { term: 'White-box access', meaning: 'Logit, hidden feature와 model internals에 접근 가능한 상태', why: 'Token·feature-level loss를 정의할 수 있지만 compute·memory 비용이 생긴다.' },
          { term: 'Black-box output', meaning: 'API가 반환한 text·image·label·score만 관측하는 상태', why: 'Sequence/data KD로 제한되며 provenance·license와 sampling bias가 중요해진다.' },
        ]} />
        <DistillationSignalLab />
      </NlpSection>

      <NlpSection
        id="soft-target"
        marker="01"
        tone="violet"
        question="Temperature는 왜 teacher의 작은 확률까지 보이게 할까?"
        title="Hard label과 부드러운 분포를 서로 다른 감독 신호로 섞는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            One-hot label은 정답 class만 남긴다. Teacher distribution은 정답 외 class 사이의 상대적
            유사성도 담을 수 있다. Temperature <em>T</em>를 높이면 logit 차이가 완화돼 작은 확률이
            드러난다. Student는 ground-truth cross entropy와 teacher-student distribution divergence를
            함께 줄인다.
          </p>
          <p>
            아래 식은 같은 class set 또는 같은 tokenizer vocabulary의 같은 event를 비교할 때만
            바로 정의된다. Padding·prompt token·teacher-only special token의 mask, causal shift,
            sequence reduction과 vocabulary normalization을 구현 계약에 포함한다. Alpha와
            temperature에 보편적인 정답값은 없다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
p_T
&=\underbrace{\operatorname{softmax}(z_T/T)}_{\text{부드러운 teacher 분포}}\\
p_S
&=\underbrace{\operatorname{softmax}(z_S/T)}_{\text{student 분포}}\\
q_S
&=\underbrace{\operatorname{softmax}(z_S)}_{\text{정답용 student 분포}}\\
\mathcal L
&=\underbrace{\alpha\,\mathrm{CE}(y,q_S)}_{\text{실제 정답 학습}}
+\underbrace{(1-\alpha)T^2\mathrm{KL}(p_T\Vert p_S)}_{\text{teacher 분포 전달}}
\end{aligned}`}
          meaning="Hard-label loss는 temperature 없는 Student 분포 q_S로 실제 정답을 학습한다. KL 항만 부드러운 p_T·p_S를 비교하며, T²는 temperature가 gradient 크기에 주는 영향을 보정하는 고전적 표기다."
          symbols={[
            [String.raw`z_T,z_S`, 'Teacher와 Student의 logit'],
            [String.raw`T`, 'Logit 분포를 부드럽게 하는 temperature'],
            [String.raw`p_T,p_S`, '같은 output event 위의 temperature-softened teacher와 student 확률'],
            [String.raw`q_S`, 'Temperature를 적용하지 않은 hard-label용 Student 확률'],
            [String.raw`y`, 'Ground-truth label 또는 target token'],
            [String.raw`\alpha`, '실제 정답과 teacher signal 사이의 loss 비중'],
          ]}
        />
        <Misconception>
          Teacher confidence가 높다고 그 label이 진실이라는 뜻은 아니다. Ground truth가 없는 teacher
          output만으로 evaluator까지 만들면 teacher와 같은 오류를 정답으로 판정하는 닫힌 회로가 된다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="feature-contract"
        marker="02"
        tone="teal"
        question="Teacher와 Student의 layer 수와 hidden size가 다르면 feature를 어떻게 맞출까?"
        title="중간 표현의 위치·shape·의미를 projection으로 연결한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Feature distillation은 teacher의 hidden state, attention map 또는 relation matrix를
            student가 따라가게 한다. 하지만 “중간 feature”는 자동으로 같은 의미가 아니다. Teacher
            24개 layer와 student 6개 layer 중 무엇을 대응할지, pre/post normalization 중 어느 지점인지,
            token·patch alignment와 hidden dimension을 어떻게 맞출지 먼저 정한다.
          </p>
          <p>
            Trainable projection은 student feature를 teacher space로 보낼 수 있다. Projection이
            너무 강하면 adapter가 loss를 혼자 흡수하고 student representation은 좋아지지 않을 수 있다.
            따라서 projection을 제거한 downstream probe, representation similarity와 final task
            규칙이 필요하다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\mathcal L_{\mathrm{feat}}
&=\underbrace{
\left\lVert
\underbrace{A_\phi(h_S^{(\ell_S)})}_{\text{Student feature 정렬}}
-\underbrace{h_T^{(\ell_T)}}_{\text{Teacher 목표 feature}}
\right\rVert_2^2
}_{\text{대응 layer의 표현 차이}}
\end{aligned}`}
          meaning="Adapter A는 hidden dimension과 표현 공간을 맞춘다. 어떤 Student layer와 Teacher layer를 연결했는지가 loss 자체의 일부다."
          symbols={[
            [String.raw`h_S^{(\ell_S)}`, 'Student의 선택한 layer에서 나온 hidden feature'],
            [String.raw`h_T^{(\ell_T)}`, '대응시킨 Teacher layer의 target feature'],
            [String.raw`A_\phi`, 'Student feature를 Teacher dimension으로 보내는 projection'],
            [String.raw`\ell_S,\ell_T`, '서로 대응시킨 Student와 Teacher layer index'],
          ]}
        />
      </NlpSection>

      <NlpSection
        id="sequence-data"
        marker="03"
        tone="amber"
        question="Teacher 내부를 볼 수 없을 때도 증류할 수 있을까?"
        title="완성 sequence와 생성 데이터의 lineage를 감독 신호로 쓴다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sequence-level distillation은 teacher가 생성한 완성 output을 student의 supervised
            target으로 삼는다. Token vocabulary가 달라도 같은 text sequence를 student tokenizer로
            다시 encode할 수 있다. 대신 teacher distribution 전체는 잃고, decoding policy가 선택한
            몇 개의 mode만 학습한다. Greedy, sampling, best-of-N, verifier filtering은 서로 다른
            dataset을 만든다.
          </p>
          <p>
            Prompt source와 answer source를 분리해 manifest로 남긴다. Teacher model·revision,
            system prompt, tool·retrieval context, temperature·top-p, seed, safety filter, rejection
            reason, license·terms, 개인정보·저작권과 생성 비용을 기록한다. 같은 teacher output으로
            train과 test를 만들지 않고, 사람 작성·독립 검증 data와 hidden challenge set을 유지한다.
          </p>
          <p>
            Self-training은 student 또는 같은 architecture의 이전 checkpoint가 pseudo-target을
            만드는 경우다. Born-Again Networks, self-distillation과 deep mutual learning은 별도
            training protocol이며 “teacher가 자기 자신”이라는 말만으로 같은 loss가 되지 않는다.
            두 network를 동시에 학습하는 mutual learning은 각 network의 CE와 상대 distribution
            matching objective를 각각 가진다.
          </p>
        </div>
        <StopRule>
          Teacher-generated data에서만 좋아지고 사람 작성·target production data에서 개선되지 않으면
          지식 이전이 아니라 teacher style·evaluator imitation일 수 있다. 출시 판단을 멈춘다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="paper-spine"
        marker="04"
        tone="blue"
        question="대표 논문을 어떤 뼈대로 읽어야 현재 LLM 증류까지 연결될까?"
        title="신호의 종류가 확장되는 흐름으로 최소 논문을 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Hinton·Vinyals·Dean의 2015년 글은 ensemble·teacher의 softened class distribution을
            student에게 전달하는 고전적 출발점이다. Kim과 Rush의 2016년 sequence-level KD는
            structured generation에서 완성 sequence 자체를 target으로 삼는 길을 보여 준다. 두 논문을
            알면 token-level distribution과 sampled sequence가 서로 다른 정보라는 축이 생긴다.
          </p>
          <p>
            DistilBERT는 BERT pretraining 중 language-modeling, distillation과 cosine representation
            loss를 결합한 bounded 사례다. 논문의 “40% 작음·60% 빠름·97% 유지”는 그 model·tasks·hardware
            맥락의 결과이지 모든 student의 법칙이 아니다. MiniLLM은 generative LLM에서 forward KL의
            low-probability mass 문제를 지적하고 reverse KL objective와 on-policy optimization을
            연구한 ICLR 2024 사례다.
          </p>
          <p>
            <strong>TinyLlama는 이 계보의 증류 사례가 아니다.</strong> 작은 Llama architecture를
            대규모 token으로 pretrain한 프로젝트이며 teacher logit·feature·생성 target을 쓰는 KD
            pipeline이 아니다. “작은 모델”이라는 결과가 같아도 from-scratch pretraining, pruning과
            distillation은 training provenance가 다르다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['2015 · Soft distribution', 'Class probability의 관계를 teacher signal로 전달한다.'],
            ['2016 · Sequence KD', 'Structured output 전체를 teacher가 선택한 target으로 바꾼다.'],
            ['2019 · DistilBERT', 'Pretraining 단계의 logit·language-model·representation signal을 결합한다.'],
            ['2024 · MiniLLM', 'Generative LLM의 divergence 방향과 student-generated sequence에서의 optimization을 다룬다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="student-release"
        marker="05"
        tone="green"
        question="Student가 teacher를 닮았다는 것과 배포에 적합하다는 것은 같은 말일까?"
        title="Teacher imitation과 독립된 production quality를 함께 검증한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Student architecture는 target hardware·runtime에서 먼저 benchmark한다. Parameter 수가
            작아도 embedding·vocabulary head, autoregressive memory access, unsupported operator와
            batch shape 때문에 기대한 latency가 나오지 않을 수 있다. <InternalLink slug="compression-pipeline">
            공통 release loop</InternalLink>의 TTFT·TPOT·throughput·memory·cost를 dense baseline,
            teacher와 student에 같은 request replay로 적용한다.
          </p>
          <p>
            품질 평가는 ground truth task, open-ended human·independent judge, long generation,
            calibration, safety, language·domain과 teacher-student error correlation을 포함한다.
            Student가 teacher보다 작다는 이유만으로 정답이 더 단순해지는 것은 아니다. Capacity가
            부족한 slice, teacher가 틀린 slice와 student만 새로 틀린 slice를 나눈다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Hard label, logit, feature, sequence와 teacher-generated data 신호를 구분할 수 있다.',
          'Token-level KL에 같은 output space·token alignment가 필요한 이유를 설명할 수 있다.',
          'Teacher와 Student hidden space를 layer mapping과 projection으로 연결할 수 있다.',
          'Black-box teacher output의 prompt·decoding·filter·license lineage를 기록할 수 있다.',
          'DistilBERT·MiniLLM과 TinyLlama의 training provenance 차이를 설명할 수 있다.',
          'Teacher imitation metric과 독립된 production quality·latency를 함께 검증할 수 있다.',
        ]} />
        <LearningHandoff
          description="Distillation의 산출물은 작은 checkpoint가 아니라 teacher 신호, student 품질과 target runtime 성능을 함께 재현할 수 있는 release candidate다."
          items={[
            { label: '막히면', slug: 'compression-pipeline', title: '압축 공통 의사결정', reason: '실제 병목이 새 student 학습을 정당화하는지 baseline부터 다시 확인한다.' },
            { label: '이어 읽기', slug: 'quantization', title: 'Quantization', reason: '증류한 student에 low-bit를 결합할 때 품질·속도 기여를 별도 ablation으로 검증한다.' },
            { label: '적용하기', slug: 'efficient-inference-on-device', title: 'On-device 효율 추론', reason: 'Student artifact를 target backend에서 memory, TTFT, energy와 thermal gate로 검증한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'Hinton, Vinyals, Dean · Distilling the Knowledge', href: 'https://arxiv.org/abs/1503.02531', note: 'Soft target과 temperature를 사용하는 고전적 knowledge distillation 출발점.' },
          { label: 'Kim & Rush · Sequence-Level KD', href: 'https://aclanthology.org/D16-1139/', note: 'Token distribution을 넘어 structured sequence를 target으로 쓰는 EMNLP 2016 원 논문.' },
          { label: 'DistilBERT', href: 'https://arxiv.org/abs/1910.01108', note: 'Pretraining에서 language-model, distillation과 cosine loss를 결합한 BERT student 사례.' },
          { label: 'MiniLLM · ICLR 2024', href: 'https://proceedings.iclr.cc/paper_files/paper/2024/hash/8ac015d409635f196f9e3e9dcfb9a94e-Abstract-Conference.html', note: 'Generative LLM KD에서 reverse KL과 on-policy optimization을 연구한 원 논문.' },
          { label: 'TinyLlama', href: 'https://arxiv.org/abs/2401.02385', note: '작은 Llama를 대규모 token으로 pretrain한 사례. Teacher-student KD가 아님을 구분하는 원문.' },
          { label: 'Born-Again Neural Networks', href: 'https://proceedings.mlr.press/v80/furlanello18a.html', note: '같은 architecture 세대 간 self-distillation의 bounded 사례.' },
          { label: 'Deep Mutual Learning', href: 'https://openaccess.thecvf.com/content_cvpr_2018/html/Zhang_Deep_Mutual_Learning_CVPR_2018_paper.html', note: '여러 student가 각자의 CE와 peer matching objective로 동시에 학습하는 protocol.' },
        ]} />
      </NlpSection>
    </div>
  );
}
