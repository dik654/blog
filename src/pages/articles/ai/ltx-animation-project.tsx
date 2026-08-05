import type { ReactNode } from 'react';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { CitationBlock } from '@/components/ui/citation';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import {
  LtxPairedEvaluationLab,
  LtxTrainingRunLab,
} from './ltx-animation-project/viz/LtxAdaptationLabs';

const sourceRevision = '9377758131b1ffde4b7f766804590a6617bf2ab9';
const sourceRoot = `https://github.com/Lightricks/LTX-2/blob/${sourceRevision}`;

function Milestone({
  number,
  eyebrow,
  title,
  id,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="not-prose mb-5 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
        <span className="font-mono text-3xl font-black text-muted-foreground/35">{number}</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function LtxAnimationProjectArticle() {
  return (
    <>
      <QuestionLead
        question="2D animation에서 같은 실패가 반복될 때, 현재 LTX-2.3 weight를 바꿔야 한다는 사실을 어떻게 가장 작게 증명할까?"
        answer={<>먼저 한 shot의 실패와 base runtime을 고정한다. 그다음 current trainer의 T2V LoRA 예제로 <strong>버전 → manifest → precompute → train → paired validation → release</strong> 증거를 남긴다. 목표 축이 좋아져도 identity·motion·audio·runtime·rights가 회귀하면 adapter를 내보내지 않는다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'LoRA', meaning: 'Base weight는 보존하고 선택한 행렬에 작은 low-rank 변화량만 학습하는 적응 방식.', why: 'Full fine-tuning보다 작은 개입으로 실패 원인을 시험한다.' },
          { term: 'manifest', meaning: 'Clip 경로·caption·원본 묶음·권리·split을 한 행씩 기록한 실험 목록.', why: '어떤 data가 어느 tensor와 결과를 만들었는지 역추적한다.' },
          { term: 'precompute', meaning: 'Video·audio를 latent로, caption을 text condition으로 미리 변환해 저장하는 단계.', why: '학습 loop와 원본 media 해석을 분리하고 같은 입력을 재사용한다.' },
          { term: 'paired validation', meaning: 'Adapter 유무만 바꾸고 prompt·seed·크기·sampler를 같게 둔 비교.', why: '좋아진 원인을 LoRA에 귀속시킨다.' },
          { term: 'retention set', meaning: '목표 domain 밖에서도 base 능력이 남았는지 확인하는 보존용 validation 묶음.', why: '훈련 clip을 잘 외운 결과를 일반화로 오해하지 않는다.' },
        ]}
      />
      <Misconception>
        아래 576×576×49 profile은 공식 low-VRAM 예제의 출발점이다. 모든 32GB GPU에서 성공한다거나
        production 품질을 보장한다는 뜻이 아니다. 이 글도 실제 학습 성능을 주장하지 않고, 재현 가능한
        실험 계약을 구성한다.
      </Misconception>

      <Milestone
        id="experiment-contract"
        number="01"
        eyebrow="One failure, one experiment"
        title="모델 목록을 버리고 한 failure fixture에서 시작한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            앞 글에서 이미 2D action shot의 성공 조건을 정했다고 하자. 같은 prompt와 seed를 세 번 실행했을 때
            49 frame 안에서 얼굴 윤곽과 선 굵기가 반복해서 흔들린다. Camera와 motion beat는 읽힌다. 여기서 목표는
            “애니메이션을 잘하는 새 모델”이 아니라 <strong>선화 회귀를 weight update가 줄일 수 있는지</strong> 검증하는 것이다.
          </p>
          <p>
            Prompt, edge·pose control 또는 temporal finishing으로 해결되면 LoRA가 필요 없다. 이 작은 개입들을
            통과했는데도 같은 earliest failure가 남았을 때만 현재 LTX-2.3 trainer 사례로 들어온다. 이 경계는
            <InternalLink slug="animation-production-workflow">2D 애니메이션 제작 계약</InternalLink>이 소유한다.
            이 글은 그 판단을 반복하지 않고 이후 실행 증거만 소유한다.
          </p>
          <p>
            먼저 <code>ltx-2.3-22b-dev.safetensors</code>, Gemma text encoder, trainer source와 license를 pin한다. LTX-2와 LTX-2.3의
            version 경계는 <InternalLink slug="ltx-23" learningPathId="ai-open-model-ltx">LTX-2.3 구조·현재 pipeline</InternalLink>에서
            읽는다. 여기서는 검산한 repository revision <code>{sourceRevision.slice(0, 12)}</code>를 사용한다.
          </p>
          <CitationBlock
            source="LTX-2 trainer Quick Start"
            citeKey={1}
            href={`${sourceRoot}/packages/ltx-trainer/docs/quick-start.md`}
          >
            <p>
              공식 trainer는 첫 실행에 <code>t2v_lora.yaml</code>을 권하고, scene 분할·caption 생성 뒤
              <code>process_dataset.py</code>로 latent와 embedding을 미리 계산한 다음 config를 고쳐
              <code>train.py</code>를 실행하는 흐름을 제공한다.
            </p>
          </CitationBlock>
        </div>
        <LtxTrainingRunLab />
      </Milestone>

      <Milestone
        id="manifest-precompute"
        number="02"
        eyebrow="Media becomes auditable tensors"
        title="Manifest가 clip의 정체성을 지키고 precompute가 tensor를 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 T2V 최소 입력은 video와 caption이다. Video에 audio가 있으면 audio latent도 추출할 수 있다.
            IC-LoRA나 inpainting을 선택할 때만 <code>reference_video</code>, <code>reference_audio</code>,
            mask 같은 mode-specific column을 추가한다. 처음부터 모든 column을 넣으면 어떤 condition이 효과를
            냈는지 알기 어렵다.
          </p>
          <p>
            Trainer가 요구하는 최소 열만으로 evaluation leakage까지 막히는 것은 아니다. 그래서 이 사례는
            <code>source_group</code>, <code>shot_id</code>, <code>rights_record</code>, <code>split</code>을
            manifest에 더한다. 같은 episode를 연속으로 자른 두 clip이 train과 validation에 나뉘면 model은
            unseen shot을 이해한 것이 아니라 거의 같은 frame을 기억했을 수 있다. Split은 clip 단위가 아니라
            원본 묶음 단위로 먼저 닫는다.
          </p>
        </div>
        <div className="not-prose my-7 overflow-hidden rounded-md border border-border">
          <div className="border-b border-border bg-muted/20 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground">manifest.jsonl · 한 행이 한 sample의 provenance</p>
          </div>
          <pre className="m-0 overflow-x-auto bg-background p-4 text-xs leading-6"><code>{`{
  "video": "clips/episode07_shot014.mp4",
  "caption": "고정 camera, 2D character가 도약하고 착지한다",
  "source_group": "episode07",
  "shot_id": "shot014",
  "rights_record": "rights/episode07.json",
  "split": "train"
}`}</code></pre>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>process_dataset.py</code>는 이 목록을 읽어 video latent, audio latent와 text condition을
            <code>.precomputed</code> 아래에 저장한다. 해상도 bucket은 단순 출력 크기가 아니다. VAE가 줄인
            spatial·temporal latent 수가 transformer sequence 길이가 된다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.7}>{String.raw`N_{\mathrm{seq}}=
            \underbrace{\frac{H}{32}\cdot\frac{W}{32}}_{\text{한 시점의 공간 latent}}
            \cdot
            \underbrace{\left(\frac{F-1}{8}+1\right)}_{\text{시간 latent 수}}`}</M>
          <FormulaNote
            meaning="해상도와 frame 수는 곱으로 결합한다. 576×576×49는 18×18×7=2,268 token이고, 같은 공간에서 89 frame은 18×18×12=3,888 token이다. Token 비율만으로 실제 wall time이나 VRAM을 보장할 수는 없다."
            symbols={[
              [String.raw`H,W`, '입력 video의 높이와 너비. 각각 32의 배수여야 한다.'],
              [String.raw`F`, 'Frame 수. 문서의 VAE 제약에 따라 F mod 8 = 1 형태를 사용한다.'],
              [String.raw`32`, 'Video VAE의 공간 downsampling factor'],
              [String.raw`8`, 'Video VAE의 시간 downsampling factor'],
              [String.raw`N_{\mathrm{seq}}`, 'Transformer가 한 sample에서 처리하는 video latent token 수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여러 resolution bucket을 섞으면 shape가 다른 sample을 한 batch로 합칠 수 없으므로 공식 문서는
            <code>optimization.batch_size: 1</code>을 요구한다. 더 큰 유효 batch가 필요하면
            gradient accumulation으로 여러 step의 gradient를 모은다. Precompute 뒤에는 몇 sample을 다시
            decode해 crop, frame 잘림, caption pairing이 맞는지 눈으로 확인한다.
          </p>
          <CitationBlock
            source="LTX-2 Dataset Preparation"
            citeKey={2}
            href={`${sourceRoot}/packages/ltx-trainer/docs/dataset-preparation.md`}
          >
            <p>
              공식 문서는 convention-based column, <code>.precomputed</code> 산출물 구조, 32의 배수인 공간 크기,
              <code>frames % 8 == 1</code>, sequence-length 식과 multiple-bucket의 batch-size 제약을 명시한다.
            </p>
          </CitationBlock>
        </div>
      </Milestone>

      <Milestone
        id="lora-run"
        number="03"
        eyebrow="Small update, explicit target"
        title="LoRA rank보다 먼저 어느 projection을 바꾸는지 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            LoRA는 큰 base matrix <M>{String.raw`W_0`}</M> 전체를 다시 학습하지 않는다. 입력을 rank
            <M>{String.raw`r`}</M> 공간으로 압축하는 <M>{String.raw`A`}</M>와 다시 출력 방향으로 펼치는
            <M>{String.raw`B`}</M>를 학습해 작은 변화량을 더한다. Rank는 “품질 숫자”가 아니라 변화량이 표현할
            수 있는 방향의 폭이다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
            W_{\mathrm{run}}&=
              \underbrace{W_0}_{\text{보존하는 base weight}}+
              \underbrace{\frac{\alpha}{r}BA}_{\text{LoRA가 학습한 작은 변화}}\\
            \operatorname{rank}(BA)&\le
              \underbrace{r}_{\text{변화량의 표현 폭}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Rank를 키우면 표현 가능한 변화는 늘지만 데이터 누수나 과적합도 자동으로 해결되지 않는다. Base weight, target module, alpha, step과 dataset identity를 함께 기록해야 같은 adapter를 설명할 수 있다."
            symbols={[
              [String.raw`W_0`, '동결해 기준으로 보존하는 원본 projection weight'],
              [String.raw`A`, '입력을 rank r의 작은 공간으로 압축하는 trainable matrix'],
              [String.raw`B`, '작은 공간의 변화를 원래 출력 차원으로 펼치는 trainable matrix'],
              [String.raw`\alpha/r`, 'LoRA 변화량에 적용하는 설정 scale'],
              [String.raw`W_{\mathrm{run}}`, 'Base와 adapter를 합쳐 forward에 쓰는 weight'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            검산한 standard 예제는 rank 32·alpha 32·AdamW·BF16을, low-VRAM 예제는 rank 16·alpha 16,
            AdamW8bit, INT8 Quanto와 8-bit text encoder를 사용한다. Low-VRAM 문서는 이를 약 32GB GPU를
            위한 예제로 설명하지만 GPU 세대, attention backend, driver와 다른 process 사용량까지 보장하지 않는다.
          </p>
          <p>
            두 예제의 target pattern은 <code>to_q</code>, <code>to_k</code>, <code>to_v</code>,
            <code>to_out.0</code>이다. 짧은 이름은 video self-attention 하나만 뜻하지 않는다. 문서 주석대로
            video, audio와 cross-modal attention module에 일치할 수 있다. 선화만 고치려다 audio sync가
            무너지면 “LoRA라서 안전하다”가 아니라 실제로 어느 module이 trainable이었는지부터 확인한다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.76}>{String.raw`B_{\mathrm{eff}}=
            \underbrace{B_{\mathrm{gpu}}}_{\text{GPU 한 번의 sample}}
            \cdot
            \underbrace{G_{\mathrm{acc}}}_{\text{gradient 누적 횟수}}
            \cdot
            \underbrace{N_{\mathrm{gpu}}}_{\text{GPU 수}}`}</M>
          <FormulaNote
            meaning="서로 다른 shape의 sample을 한 batch에 넣지 못해 per-GPU batch를 1로 두더라도 gradient accumulation과 GPU 수로 유효 batch를 늘릴 수 있다. 다만 accumulation은 한 step의 peak activation memory를 없애지 않는다."
            symbols={[
              [String.raw`B_{\mathrm{gpu}}`, 'GPU 하나가 한 micro-step에서 처리하는 sample 수'],
              [String.raw`G_{\mathrm{acc}}`, 'Optimizer update 전 gradient를 더하는 micro-step 수'],
              [String.raw`N_{\mathrm{gpu}}`, '동시에 학습하는 GPU 수'],
              [String.raw`B_{\mathrm{eff}}`, '한 optimizer update에 기여한 총 sample 수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 run은 대규모 품질 결론이 아니라 wiring smoke test다. Latent와 condition이 읽히는지, loss가
            finite인지, checkpoint가 저장되는지, validation이 같은 seed로 반복되는지를 확인한다. 이 경로가
            닫힌 다음에만 evidence-bearing dataset으로 run을 확장한다.
          </p>
        </div>
      </Milestone>

      <Milestone
        id="paired-validation"
        number="04"
        eyebrow="Improvement cannot hide regression"
        title="Base와 LoRA의 차이를 같은 조건에서 축별로 닫는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 예제 validation은 seed 42, 25 FPS, 30 inference steps, guidance 4.0, STG scale 1.0과
            block 29를 제시한다. 이 숫자들은 이 글의 보편적 최적값이 아니라 <strong>같은 비교를 반복하기 위한
            출발점</strong>이다. Base와 LoRA에서 prompt, seed, dimensions, frame rate, steps, guidance와
            STG를 모두 같게 두고 adapter 유무만 바꾼다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.76}>{String.raw`\Delta_k=
            \underbrace{s_k(\mathrm{LoRA})}_{\text{적응 후 같은 조건의 점수}}-
            \underbrace{s_k(\mathrm{base})}_{\text{적응 전 기준 점수}}`}</M>
          <FormulaNote
            meaning="축 k마다 변화량을 따로 본다. 목표인 선화 점수가 크게 올라가도 identity, motion 또는 audio 보존 gate가 닫히면 평균으로 덮지 않고 release를 차단한다."
            symbols={[
              [String.raw`k`, '선화, identity, motion, audio처럼 분리한 평가 축'],
              [String.raw`s_k(\mathrm{base})`, '고정 조건에서 base가 받은 축별 기준 점수'],
              [String.raw`s_k(\mathrm{LoRA})`, '같은 조건에서 adapter를 붙인 축별 점수'],
              [String.raw`\Delta_k`, '해당 축에서 adapter 때문에 관찰된 변화'],
            ]}
          />
        </div>
        <LtxPairedEvaluationLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            위 숫자는 UI가 release logic을 설명하기 위한 fixture이지 LTX-2.3의 실제 benchmark가 아니다.
            실제 프로젝트에서는 rubric, evaluator, threshold, sample id와 원본 frame evidence를 함께 기록한다.
            Trainer 문서도 내장 validation pipeline이 단순화된 경로임을 경고한다. 최종 candidate는
            <code>ltx-pipelines</code>의 production inference에서 같은 manifest로 다시 실행한다.
          </p>
          <p>
            Target fixture와 retention set을 섞지 않는다. Target은 “고치려 한 실패가 줄었는가”를, retention은
            “원래 하던 일을 잃지 않았는가”를 답한다. 두 답이 모두 있어야 rank·step·data를 다음에 어떻게 바꿀지
            원인 수준에서 결정할 수 있다.
          </p>
        </div>
      </Milestone>

      <Milestone
        id="release-boundary"
        number="05"
        eyebrow="A result is a bundle, not a clip"
        title="Adapter와 함께 재현 근거·실패·권리 경계를 내보낸다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            릴리스 산출물은 잘 나온 mp4 하나가 아니다. Base checkpoint와 text encoder revision, trainer SHA,
            config, raw manifest와 precompute hash, adapter checkpoint, paired output, 축별 점수, runtime
            receipt와 failure ledger를 묶는다. 막힌 실험도 버리지 않는다. 어떤 gate가 왜 닫혔고 다음 최소 수정이
            무엇인지 남겨야 같은 실패를 비싸게 반복하지 않는다.
          </p>
          <p>
            LTX-2 Community License는 fine-tuned·adapted weight와 checkpoint를 derivative로 정의한다.
            연 매출 1,000만 달러 이상 entity의 commercial use에는 paid commercial license가 필요하다고
            명시한다. Adapter를 작다고 license 밖의 독립 산출물로 취급하지 않는다. License 부속 사용 정책은
            LTX-2로 경쟁 모델을 train·improve하는 행위에도 별도 제한을 둔다. 현재 작업이 허용된 derivative adaptation인지
            competing-model training인지까지 구분하고, 실제 사용·배포 결정은 최신 원문과 법률 검토로 닫는다.
          </p>
          <CitationBlock
            source="LTX-2 Community License"
            citeKey={3}
            href={`${sourceRoot}/LICENSE`}
          >
            <p>
              검산한 2026-01-05 license는 adapted/fine-tuned weights를 derivative에 포함하며, 연 매출
              1,000만 달러 이상 commercial entity의 사용 조건과 derivative 재배포 조건을 별도로 둔다.
            </p>
          </CitationBlock>
          <p>
            Full fine-tuning은 LoRA 실패 뒤 자동으로 가는 다음 단계가 아니다. 먼저 source-group leakage,
            caption과 target-module coverage, rank·step, joint audio branch와 paired evidence를 확인한다.
            Base의 더 넓은 motion prior 자체를 바꿔야 하고 충분한 data·retention·rollback 증거가 생겼을 때만
            별도 프로젝트로 승격한다.
          </p>
        </div>
        <StopRule>
          이 구현 사례를 이해하기 위해 모든 diffusion 역사로 내려가지 않는다. 현재 LTX-2.3 artifact, tensor
          shape, LoRA update와 paired release 판단을 설명할 수 있으면 멈춘다. Sequence 식이나 low-rank 식이
          막힐 때만 관련 수학 기반을 연다.
        </StopRule>
        <CapabilityCheck
          items={[
            '49 frame과 89 frame profile의 sequence token을 직접 계산하고, 그 비율만으로 runtime을 보장하지 않는다.',
            'Official minimum column과 leakage·rights를 막기 위해 추가한 manifest field를 구분한다.',
            'LoRA target pattern이 video·audio·cross-modal attention에 걸릴 수 있음을 설명한다.',
            '같은 prompt·seed·bucket·sampler에서 base와 LoRA의 축별 delta를 비교한다.',
            '목표 품질이 올라도 retention hard gate가 닫히면 release를 차단한다.',
            'Adapter를 derivative로 다루고 runtime·rights·failure evidence와 함께 bundle을 닫는다.',
          ]}
        />
        <SourceNotes
          sources={[
            { label: 'LTX-2 trainer Quick Start', href: `${sourceRoot}/packages/ltx-trainer/docs/quick-start.md`, note: `검산 revision ${sourceRevision.slice(0, 12)}. Mode 선택, preprocess, config와 train 실행 순서.` },
            { label: 'LTX-2 Dataset Preparation', href: `${sourceRoot}/packages/ltx-trainer/docs/dataset-preparation.md`, note: 'Metadata column, resolution bucket, sequence length와 precomputed artifact 구조.' },
            { label: 'LTX-2 T2V LoRA config', href: `${sourceRoot}/packages/ltx-trainer/configs/t2v_lora.yaml`, note: 'Standard rank·target module·optimizer·validation의 공식 예제.' },
            { label: 'LTX-2 low-VRAM T2V config', href: `${sourceRoot}/packages/ltx-trainer/configs/t2v_lora_low_vram.yaml`, note: '약 32GB를 겨냥한 INT8·8-bit encoder·49-frame 시작 설정.' },
            { label: 'LTX-2 Community License', href: `${sourceRoot}/LICENSE`, note: 'Derivative와 commercial-use·redistribution 조건의 원문. 법률 자문을 대신하지 않는다.' },
          ]}
        />
      </Milestone>
    </>
  );
}
