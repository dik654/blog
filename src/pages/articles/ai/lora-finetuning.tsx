import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import {
  AdaptationGateLab,
  AdapterReleaseLab,
  LoraGeometryLab,
  QloraPrecisionLab,
  SftLossMaskLab,
} from './practical-llm/viz/AdaptationAgentDecisionLabs';

export default function LoraFinetuningArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="behavior-contract"
        marker="00"
        tone="blue"
        question="모델이 틀렸다는 이유만으로 weight를 바꿔야 할까?"
        title="먼저 실패의 책임 층과 원하는 행동을 고정한다"
      >
        <BeginnerBridge title="최신 주소를 찾는 일과 항상 같은 문서 형식으로 답하는 일은 고치는 곳이 다르다">
          LoRA는 원래 모델 대부분을 그대로 두고 작은 추가 가중치만 학습해 반복되는 출력 행동을 바꾸는 방법이다. 바뀌는 최신 사실은 문서를 찾아 붙이는 retrieval이 맡고, 말투·형식처럼 반복되는 습관만 학습 후보로 좁혀야 한다.
        </BeginnerBridge>
        <QuestionLead
          question="사내 규정 질문에는 최신 문서를 인용해야 하고, 출력은 고정 JSON 형식이어야 한다. 둘 다 LoRA로 학습하면 될까?"
          answer="같은 실패가 아니다. 최신 규정은 retrieval과 provenance가 책임질 문제이고, 반복되는 출력 행동은 supervised adapter 후보가 될 수 있다. 한 번의 fine-tuning에 섞으면 무엇이 고쳐졌는지 알 수 없다."
        />
        <ConceptPrimer items={[
          { term: 'Base model', meaning: 'Fine-tuning 전에 고정한 model revision과 tokenizer·template의 묶음', why: 'Adapter는 특정 base의 좌표계와 module 이름 위에 만들어진다.' },
          { term: 'Behavior contract', meaning: '입력 분포, 원하는 출력, 금지 행동과 성공 metric을 적은 계약', why: 'Loss 감소가 실제 배포 행동 개선인지 판정한다.' },
          { term: 'Adapter', meaning: 'Base를 그대로 두고 추가한 작은 trainable parameter 집합', why: 'Update 범위와 저장·배포 비용을 줄이고 여러 행동을 분리한다.' },
          { term: 'Frozen', meaning: 'Optimizer가 해당 parameter를 갱신하지 않는 상태', why: '메모리에 없다는 뜻도, backward가 그 경로를 통과하지 않는다는 뜻도 아니다.' },
          { term: 'Ablation', meaning: 'Data·rank·target module처럼 한 원인만 바꾸는 비교 실험', why: '좋아진 점수를 재현 가능한 mechanism claim으로 바꾼다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 산출물은 학습 script가 아니라 frozen baseline report다. 실제 production prompt와
            tokenizer·chat template를 고정하고 exact format, task quality, unsafe response,
            latency와 중요한 slice를 측정한다. Prompt example, retrieval, deterministic validator로
            고칠 수 있는 실패를 먼저 제거한다. 그래야 adapter가 담당할 행동 변화가 좁아진다.
          </p>
          <p>
            LoRA는 새 사실을 영구 저장하는 범용 데이터베이스가 아니다. 반복되는 말투·형식,
            classification boundary, tool-call schema처럼 label로 관찰할 수 있는 행동을 작은
            weight update로 학습하는 데 잘 맞는다. 전문 vocabulary가 부족하다면 continued
            pretraining과 supervised task tuning을 별도 run으로 비교해야 한다.
          </p>
        </div>
        <AdaptationGateLab />
        <StopRule>
          Frozen baseline과 독립 evaluation pair가 없으면 학습하지 않는다. Training loss만으로는
          task 개선, template 암기와 leakage를 구분할 수 없다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="low-rank-update"
        marker="01"
        tone="violet"
        question="작은 두 행렬이 어떻게 원래 weight와 같은 모양의 update를 만들까?"
        title="LoRA를 압축 파일이 아니라 제한된 업데이트 공간으로 이해한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Linear layer의 원래 weight를 <strong>W</strong>라고 하자. Full fine-tuning은
            W의 모든 원소를 움직인다. LoRA는 W를 얼리고 입력 차원을 작은 rank 공간으로 보내는
            A와 다시 출력 차원으로 올리는 B만 학습한다. B와 A의 곱은 W와 같은 모양이므로
            inference에서 원래 출력에 더할 수 있다.
          </p>
          <p>
            Rank <strong>r</strong>은 “성능 단계”가 아니라 update가 움직일 수 있는 방향의 수다.
            더 큰 r은 표현 가능한 update 공간과 trainable parameter를 늘리지만 자동으로
            일반화를 보장하지 않는다. Alpha는 그 곱이 실제 출력에 미치는 스케일을 조정한다.
            따라서 rank를 바꾸면서 alpha, learning rate와 target module까지 함께 바꾸면 무엇이
            원인인지 알 수 없다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{\Delta W}_{\text{학습할 변화}}=
          \underbrace{\frac{\alpha}{r}}_{\text{업데이트 스케일}}\,
          \underbrace{B}_{d_{\mathrm{out}}\times r}\,
          \underbrace{A}_{r\times d_{\mathrm{in}}}`}
          meaning="A가 큰 입력 공간을 rank r의 작은 좌표로 압축하고 B가 다시 출력 공간으로 펼친다. alpha/r를 곱한 결과만 frozen W에 더해 실제 layer update를 만든다."
          symbols={[
            [String.raw`\Delta W`, '원래 weight와 같은 모양의 저랭크 업데이트'],
            [String.raw`r`, '업데이트가 사용할 수 있는 중간 차원'],
            [String.raw`\alpha/r`, 'Rank와 분리해 기록해야 하는 LoRA 스케일'],
            [String.raw`A,\ B`, 'Gradient와 optimizer state를 갖는 trainable adapter 행렬'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\underbrace{N_{\mathrm{LoRA}}}_{\text{학습 파라미터 수}}
          =\underbrace{r\,d_{\mathrm{in}}}_{A\text{의 원소 수}}
          +\underbrace{d_{\mathrm{out}}\,r}_{B\text{의 원소 수}}
          =r(d_{\mathrm{in}}+d_{\mathrm{out}})`}
          meaning="Full matrix의 d_out × d_in 원소 대신 두 얇은 행렬의 원소만 학습한다. 절감률은 layer shape, rank와 적용한 module 수에 따라 달라지므로 보편적인 한 숫자로 쓰지 않는다."
          symbols={[
            [String.raw`d_{\mathrm{in}}`, 'Linear layer 입력 차원'],
            [String.raw`d_{\mathrm{out}}`, 'Linear layer 출력 차원'],
            [String.raw`N_{\mathrm{LoRA}}`, '선택한 한 layer에서 추가되는 trainable parameter 수'],
          ]}
        />
        <LoraGeometryLab />
        <Misconception>
          LoRA 논문의 특정 GPT-3 실험에서 관찰한 저랭크 성질을 “모든 모델은 rank 1~4면
          충분하다”로 일반화하지 않는다. Architecture, task, data와 target module이 달라지면
          필요한 update 공간도 달라진다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="qlora-precision"
        marker="02"
        tone="teal"
        question="QLoRA는 base model을 4-bit로 직접 학습하는 방법일까?"
        title="저장·연산·기울기·optimizer state를 별도 장부로 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            QLoRA는 frozen base를 4-bit로 저장하고, 필요한 weight block을 더 높은 compute dtype으로
            역양자화해 forward와 backward를 수행하며, gradient는 LoRA parameter에만 축적한다.
            즉 “4-bit model”이라는 한 문장 안에 서로 다른 세 역할이 있다. 현재 PEFT 예시는
            bitsandbytes에서 NF4 storage, double quantization, BF16 compute를 설정하고
            <code>prepare_model_for_kbit_training()</code>으로 준비한다.
          </p>
          <p>
            NF4는 정규분포 형태의 pretrained weight에 맞춘 4-bit 표현이고, double quantization은
            quantization constant도 다시 양자화해 평균 0.37 bit/parameter를 줄이는 QLoRA 논문의
            기법이다. Paged optimizer는 순간적인 memory spike를 완화하는 장치다. 이 세 요소는
            “모델 품질이 항상 몇 퍼센트 유지된다”는 보편 보증이 아니다.
          </p>
          <p>
            원 논문의 65B single-GPU 결과는 <strong>단일 48GB GPU</strong>라는 논문 범위의
            headline이다. 현재 model architecture, sequence length, batch, checkpointing,
            attention kernel과 library version이 다르면 memory ledger도 달라진다. GPU 이름이나
            시간표를 복사하지 말고 실제 allocation peak와 throughput을 측정한다.
          </p>
        </div>
        <QloraPrecisionLab />
        <Misconception>
          Frozen base도 forward activation과 adapter gradient를 만들기 위한 계산 경로에는 참여한다.
          “학습하지 않는다”를 “GPU memory를 전혀 쓰지 않는다”로 읽으면 activation, temporary
          dequantization buffer와 CUDA workspace를 놓친다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="sft-contract"
        marker="03"
        tone="amber"
        question="좋은 대화 JSON을 모으면 곧바로 좋은 SFT dataset이 될까?"
        title="Template·loss mask·독립 split이 실제 학습 문제를 정의한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Raw conversation을 저장하는 schema와 model이 실제로 읽는 token sequence는 다르다.
            Role 순서, system policy, special token, generation prompt, EOS, truncation과 maximum
            length를 base tokenizer의 chat template로 rendering한 뒤 샘플별로 눈으로 검사한다.
            Model family 이름으로 Alpaca·ChatML 같은 포맷을 추측하지 않는다.
          </p>
          <p>
            다음은 label tensor다. 일반 language modeling처럼 전체 sequence에 loss를 줄지,
            prompt-completion의 completion만 학습할지, conversational data의 assistant turn만
            학습할지 의도적으로 고른다. 현재 TRL의 <code>assistant_only_loss</code>는 chat
            template가 generation marker를 지원해야 한다. 설정 이름만 켜지 말고 실제
            <code>labels</code>에서 제외 token이 <code>-100</code>인지 확인한다.
          </p>
          <p>
            Split은 행 단위 random 분할이 아니라 정답 생성 계보를 따른다. 같은 source document,
            customer, conversation template와 synthetic parent가 train과 test 양쪽에 들어가면
            문장만 달라 보여도 leakage다. Human-authored, synthetic, corrected, rejected sample을
            provenance field로 구분하고 validation과 test 생성 과정은 고정한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{\mathcal{L}_{\mathrm{SFT}}}_{\text{응답 학습 손실}}
          =-\sum_t
          \underbrace{m_t}_{\substack{\text{학습 token이면 }1\\\text{prompt면 }0}}
          \underbrace{\log p_\theta(y_t\mid y_{<t})}_{\text{정답 token의 로그확률}}`}
          meaning="pθ는 앞 token이 주어졌을 때 정답 token에 부여한 확률이다. Sequence 전체의 정답 확률은 token별 확률의 곱이므로 log를 취해 합으로 바꾸고, 최대화할 우도에 음의 부호를 붙여 optimizer가 최소화할 loss로 만든다. Σ는 선택된 모든 token의 책임을 더하며, mask m_t는 그중 어느 token만 gradient를 만들지 결정한다. 같은 대화 text라도 mask가 다르면 모델이 풀고 있는 학습 문제가 달라진다."
          symbols={[
            [String.raw`m_t`, 'Assistant·completion token만 선택하는 loss mask'],
            [String.raw`y_t`, '시점 t의 정답 token'],
            [String.raw`p_\theta`, 'Base와 adapter가 함께 만든 다음-token 확률'],
            [String.raw`\mathcal{L}_{\mathrm{SFT}}`, '선택된 token에만 합산한 supervised loss'],
          ]}
        />
        <SftLossMaskLab />
        <StopRule>
          Tokenized sample, attention mask와 labels tensor를 직접 보지 않은 채 training을 시작하지
          않는다. Template 오류는 더 많은 epoch로 고칠 수 있는 문제가 아니다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="training-diagnosis"
        marker="04"
        tone="green"
        question="한 번 학습이 돌아갔다면 어떤 순서로 성능과 비용을 진단할까?"
        title="작은 run에서 memory·gradient·behavior evidence를 동시에 남긴다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 run은 작은 data slice와 짧은 step으로 연결 상태를 검증한다. Trainable parameter
            이름과 수, target module match, 한 batch의 rendered text와 labels, 첫 gradient norm,
            peak allocated/reserved memory, tokens per second와 checkpoint reload를 기록한다.
            Loss가 내려가도 adapter가 예상 module에 붙지 않았거나 평가 prompt가 달라지면
            production claim은 성립하지 않는다.
          </p>
          <p>
            Target module은 architecture-specific 이름이다. 원 LoRA 논문의 Wq·Wv 실험,
            현재 PEFT 예시의 q/k/v/o projection, QLoRA-style <code>all-linear</code>은 서로
            다른 실험 선택이다. “요즘은 전부 all-linear가 정답”으로 쓰지 않는다. 작은 target부터
            넓히며 동일 budget에서 task gain, regression, memory와 latency를 비교한다.
          </p>
          <p>
            Rank, alpha, learning rate, dropout, target modules, data mixture와 loss mask를
            한 run에서 함께 바꾸지 않는다. Training loss, held-out task metric, exact-format,
            safety, original-domain anchor와 여러 seed의 변동을 함께 본다. Validation을 반복해서
            선택에 썼다면 마지막 test는 한 번만 열고, 선택 과정은 <InternalLink slug="experiment-tracking">
            run lineage</InternalLink>에 남긴다.
          </p>
        </div>
        <div className="not-prose my-6 overflow-hidden rounded-md border border-border">
          <div className="border-b border-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground">
            현재 PEFT·TRL 문서 형태를 따른 최소 구성 뼈대
          </div>
          <pre className="max-w-full overflow-x-auto p-4 text-xs leading-relaxed"><code>{`bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
)
base = AutoModelForCausalLM.from_pretrained(base_id, quantization_config=bnb)
base = prepare_model_for_kbit_training(base)

adapter = LoraConfig(
    r=rank,
    lora_alpha=alpha,
    target_modules=verified_module_names,
    task_type="CAUSAL_LM",
)
trainer = SFTTrainer(
    model=base,
    peft_config=adapter,
    train_dataset=train_split,
    eval_dataset=validation_split,
    args=SFTConfig(assistant_only_loss=True),
)`}</code></pre>
        </div>
        <Misconception>
          이 코드는 실행 계약의 뼈대이지 복사 가능한 만능 recipe가 아니다. Model의 chat template가
          assistant mask를 지원하는지, module 이름이 실제 architecture와 맞는지, hardware가
          BF16을 지원하는지와 설치된 버전의 API를 먼저 확인한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="release"
        marker="05"
        tone="blue"
        question="Adapter checkpoint가 통과하면 어떤 artifact를 production에 올릴까?"
        title="Adapter serving과 merge를 운영 요구에서 선택한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여러 tenant·task가 하나의 base를 공유하고 요청마다 행동을 바꿔야 한다면 base와 adapter를
            분리해 serving하는 편이 자연스럽다. 대신 adapter cold load, routing, concurrent
            adapter 지원, base compatibility와 잘못된 adapter 선택을 시험한다. 단일 행동만
            배포하고 runtime이 adapter를 지원하지 않는다면 merged artifact가 단순할 수 있다.
          </p>
          <p>
            QLoRA 학습 때 사용한 quantized object에 무조건 <code>merge_and_unload()</code>를
            호출하는 식으로 배포를 단순화하지 않는다. Backend와 layer type마다 merge 지원과
            오차가 다르다. 호환되는 높은 정밀도 base revision에 adapter를 합치고, merge 전후
            evaluator와 logit sample을 비교한 다음, 필요하면 inference용 <InternalLink slug="quantization">
            양자화</InternalLink>를 별도 단계로 적용해 다시 검증한다.
          </p>
          <p>
            Release manifest에는 base revision, tokenizer·chat template digest, adapter config와
            checksum, target modules, training data/split lineage, dtype·quantization config,
            library·CUDA version, evaluator, threshold와 rollback artifact를 넣는다. “파일이
            load된다”가 아니라 production engine에서 동일 prompt bundle을 통과해야 release다.
          </p>
        </div>
        <AdapterReleaseLab />
        <CapabilityCheck items={[
          '최신 사실·전문 vocabulary·출력 행동·runtime 병목을 서로 다른 intervention으로 분리할 수 있다.',
          'Delta W=(alpha/r)BA의 shape, scale과 trainable parameter 수를 계산할 수 있다.',
          'Frozen base, NF4 storage, BF16 compute, adapter gradient와 optimizer state를 구분할 수 있다.',
          'Chat template와 labels tensor를 검사해 assistant/completion loss boundary를 설명할 수 있다.',
          'Rank·alpha·target module·data를 한 축씩 바꾸는 ablation을 설계할 수 있다.',
          'Adapter serving과 merge/re-quantization 경로를 실제 artifact evaluator로 선택할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'LoRA · Hu et al. 2021', href: 'https://arxiv.org/abs/2106.09685', note: 'Frozen base에 low-rank update를 주입하는 원 논문과 그 실험 범위.' },
          { label: 'QLoRA · Dettmers et al. 2023', href: 'https://arxiv.org/abs/2305.14314', note: 'NF4, double quantization, paged optimizer와 65B single-48GB-GPU 결과의 원문.' },
          { label: 'PEFT · LoRA API', href: 'https://huggingface.co/docs/peft/main/package_reference/lora', note: '현재 LoraConfig의 parameter와 architecture-specific target module 설정.' },
          { label: 'PEFT · Quantization guide', href: 'https://huggingface.co/docs/peft/developer_guides/quantization', note: '현재 k-bit preparation, NF4·compute dtype와 backend caveat.' },
          { label: 'PEFT · Model merging', href: 'https://huggingface.co/docs/peft/developer_guides/model_merging', note: 'Adapter 조합·merge와 compatibility를 확인할 현재 가이드.' },
          { label: 'TRL · SFTTrainer', href: 'https://huggingface.co/docs/trl/en/sft_trainer', note: '현재 dataset type, completion/assistant loss와 chat-template 조건.' },
        ]} />
      </NlpSection>
    </div>
  );
}
