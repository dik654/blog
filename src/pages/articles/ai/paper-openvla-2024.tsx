import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  OpenVlaActionTokenLab,
  OpenVlaControlCadenceLab,
  OpenVlaEvidenceReceiptLab,
  VLaSourceSpineMilestone,
} from './robot-vla-source/viz/RobotVlaSourceLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const trainingReceipts = [
  ['학습 mixture', 'Open X-Embodiment · 최종 970k episodes', '70개가 넘는 원천 dataset을 single-arm end-effector manipulation 중심으로 거른다.'],
  ['학습 compute', '64 A100 × 14일 = 21,500 A100-hours', 'Batch 2,048, 27 epochs, action-token train accuracy 95%를 넘을 때까지 학습했다.'],
  ['Full OpenVLA runtime', '약 15 GB · RTX 4090 약 6 Hz', 'Fused SigLIP+DINOv2를 쓰는 본 모델의 memory와 single-image inference 처리량이다. 실제 controller cadence는 별도 system metric이다.'],
  ['통제 실험 · LoRA r=32', '97.6M trainable · 59.7 GB training VRAM', '전체 parameter의 1.4%다. 다만 이 표는 SigLIP-only vision과 더 작은 OpenX mixture를 쓴 variant라서 final fused OpenVLA의 비용으로 일반화하면 안 된다.'],
] as const;

export default function PaperOpenVla2024Article() {
  return (
    <>
      <section id="input-output-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VLA를 model 이름보다 입력과 출력으로 먼저 정의한다</h2>
        <QuestionLead
          question="한 장의 image와 '수건을 접어라'라는 문장이 어떻게 실제 robot의 위치·회전·gripper 명령으로 바뀔까?"
          answer="OpenVLA는 SigLIP과 DINOv2가 만든 image feature를 projector로 Llama 2 7B의 token 공간에 넣고, 언어 token 뒤에 action token sequence를 autoregressive하게 예측한다. 각 action token을 다시 연속값으로 복원해 controller에 전달한다. 핵심은 자연어 답변이 아니라 physical action을 vocabulary 안의 token처럼 다루는 input-output contract다."
        />
        <ConceptPrimer items={[
          { term: 'Vision encoder', meaning: 'SigLIP의 semantic feature와 DINOv2의 spatial feature를 patch별로 이어 붙인다.', why: '물체가 무엇인지와 어디에 있는지를 함께 보존한다.' },
          { term: 'Projector', meaning: '두 vision encoder의 feature를 Llama가 읽을 수 있는 embedding 차원으로 옮기는 2-layer MLP다.', why: 'Image patch와 language token을 한 sequence에서 처리한다.' },
          { term: 'Action token', meaning: '연속 action 한 축을 256개 bin 중 하나로 바꾼 token이다.', why: '기존 next-token training으로 robot command를 예측한다.' },
          { term: 'Closed loop', meaning: 'Action을 실제로 실행하고 바뀐 camera state로 다음 action을 다시 계산하는 반복이다.', why: 'Model latency가 robot dynamics를 바꾸는 지점이다.' },
        ]} />
        <VLaSourceSpineMilestone />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Data flow는 <strong>한 RGB image → 두 vision encoder → feature concat → 2-layer projector → Llama 2 7B → action token → continuous command → controller</strong> 순서다. OpenVLA는 one-image policy이므로 camera history나 proprioception을 직접 입력하지 않는다. 이 단순함이 공개 재현의 바닥인 동시에 π0.7로 올라갈 때 보강되는 한계다.</p>
        </div>
        <OpenVlaActionTokenLab />
      </section>

      <section id="action-tokenization" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">연속 action을 256칸 vocabulary로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>각 action dimension마다 training data의 1st percentile을 아래 경계, 99th percentile을 위 경계로 정한다. Outlier는 경계에 clamp하고 256-way action vocabulary로 보낸다. Min·max 전체를 담는 대신 자주 쓰는 영역에 더 촘촘한 해상도를 주는 선택이다.</p>
          <p>Llama tokenizer는 reserved special token이 100개뿐이어서 action 256개를 모두 담지 못했다. OpenVLA는 vocabulary에서 가장 덜 쓰인 마지막 256 token을 action token으로 덮어쓴다. 이 방식은 편리하지만 checkpoint의 tokenizer mapping이 action decoder와 정확히 같아야 한다.</p>
          <p>여기에는 재현 시 놓치기 쉬운 구현 차이가 있다. 논문은 256 bins라고 설명하지만 공개 <strong>ActionTokenizer</strong>는 <strong>np.linspace</strong>로 256개 edge를 만들고 인접 edge의 center는 255개만 만든다. <strong>np.digitize</strong>는 1–256 index를 내고 decoder는 이를 0–254 center index로 clamp한다. 따라서 아래 식은 논문 문장을 단순 반올림으로 바꾼 것이 아니라 공개 code의 실제 off-by-one 처리까지 복원한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\Delta q}_{\text{경계 간격}}&=\frac{q_{.99}-q_{.01}}{255}\\
\underbrace{e_j}_{\text{j번째 경계}}&=q_{.01}+j\Delta q,\quad 0\le j\le255\\
\underbrace{b}_{\text{digitize 결과}}&=\operatorname{digitize}(a;e)-1\\
\underbrace{r}_{\text{유효 center 번호}}&=\operatorname{clip}(b,0,254)\\
\underbrace{\hat a}_{\text{복원 행동}}&=\frac{e_r+e_{r+1}}{2}
\end{aligned}`}
          meaning="공개 ActionTokenizer의 실제 순서를 식으로 복원했다. 256개 edge를 만들고 action이 들어갈 구간을 digitize한 뒤, 255개 center 중 하나를 고르도록 index를 0–254로 제한한다. Token id는 tokenizer vocabulary 크기 V에서 digitize index를 뺀 값이다. 이는 논문에 식 번호로 제시된 수식이 아니라 공개 code의 교육용 재구성이다."
          symbols={[
            [String.raw`a`, '한 action dimension의 연속값'],
            [String.raw`q_{.01},q_{.99}`, '해당 dimension training 분포의 1st·99th percentile'],
            [String.raw`e_j`, 'np.linspace가 만든 256개 균등 경계'],
            [String.raw`r`, 'Decoder가 실제로 참조하는 0–254 center index'],
            [String.raw`\hat a`, 'Controller에 보낼 때 복원한 근사 action'],
            [String.raw`\text{digitize와 clip}`, 'Action의 구간을 찾고 마지막 256 index가 center 배열 밖으로 나가지 않게 막는 연산'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\mathcal L_{\mathrm{act}}}_{\text{행동 위치만 학습}}=-\sum_{i\in\underbrace{\mathcal I_{\mathrm{act}}}_{\text{action token 위치}}}\log \underbrace{p_{\theta}(y_i\mid x_{\mathrm{image}},x_{\mathrm{text}},y_{<i})}_{\text{정답 행동 token 확률}}`}
          meaning="정답 sequence 전체가 아니라 action token이 놓인 위치만 골라 negative log probability를 더한다. Model은 앞선 image·instruction·action token을 보고 다음 action token의 확률을 높인다. Training token accuracy가 높아도 실제 controller 주기와 state drift는 이 loss에 들어 있지 않다."
          symbols={[
            [String.raw`\mathcal I_{\mathrm{act}}`, 'Loss를 계산할 action-token position 집합'],
            [String.raw`y_i`, '현재 dimension의 정답 action token'],
            [String.raw`y_{<i}`, '이미 주어진 이전 action token'],
            [String.raw`x_{\mathrm{image}},x_{\mathrm{text}}`, '한 장의 image patch embedding과 자연어 instruction'],
            [String.raw`\text{합}`, '각 action 위치의 오차를 하나의 training objective로 모으는 연산'],
          ]}
        />
        <Misconception>256개 bin은 robot 전체 action을 256가지로 줄인다는 뜻이 아니다. 위치·회전·gripper 등 각 dimension이 별도로 token 하나를 낸다. 또한 quantile 범위 밖 값은 모두 경계로 붙으므로 outlier 행동을 정밀하게 복원하지 못한다.</Misconception>
      </section>

      <section id="data-training-receipt" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Architecture만 같아도 data mixture가 다르면 다른 policy다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Open X-Embodiment는 70개가 넘는 dataset과 2M개가 넘는 raw trajectory를 모은다. OpenVLA는 여기서 third-person camera가 있고 single-arm end-effector action을 쓰는 manipulation data를 중심으로 거르고 Octo의 mixture weight를 재사용했다. DROID는 10% weight로 넣었지만 action-token accuracy가 계속 낮아 마지막 3분의 1 학습에서는 제거했다. 어떤 data를 얼마나 오래 보여 주었는지가 model definition의 일부다.</p>
          <p>BridgeData의 첫 transition에는 all-zero no-op action이 반복될 수 있어 OpenVLA preprocessing은 이를 제거했다. RT-2-X evaluation은 그 처리가 없어 robot이 멈출 때 두 번째로 확률이 높은 action을 질의하는 workaround를 썼다. 따라서 Bridge에서 OpenVLA가 높았다는 결과를 architecture 크기 하나로 설명하면 data cleaning과 controller 차이를 숨기게 된다.</p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {trainingReceipts.map(([label, value, detail]) => (
            <article key={label} className="grid gap-3 py-5 sm:grid-cols-[9rem_17rem_minmax(0,1fr)] sm:gap-6">
              <p className="text-sm font-bold">{label}</p>
              <p className="font-mono text-sm font-black leading-relaxed">{value}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="real-robot-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">29개 task라는 headline을 rollout 영수증으로 다시 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Bridge robot에서는 17 tasks를 10회씩, Google robot에서는 12 tasks를 5회씩 실행했다. 각 비교는 같은 초기 상태의 paired A/B evaluation으로 설계했다. OpenVLA는 Bridge aggregate에서 RT-2-X보다 높고 Google robot에서는 비슷했지만, RT-2-X는 semantic generalization에서 더 높았다. Training trajectory 수, internet pretraining, visual encoder와 preprocessing도 동시에 달랐다.</p>
          <p>새 robot에는 10–150 demonstrations로 fine-tuning했다. LoRA r=32는 97.6M parameter, 전체의 약 1.4%만 학습했고 r=64나 full fine-tuning과 success error bar가 겹쳤다. 이는 좁은 Franka task suite의 결과다. 한 지시를 반복하는 정밀 task에서는 Diffusion Policy가 더 매끄럽고 강한 경우가 있었고, 다양한 language-conditioned task 전체 평균에서는 OpenVLA가 강했다.</p>
        </div>
        <OpenVlaEvidenceReceiptLab />
      </section>

      <section id="closed-loop-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">int8 실패는 weight 정확도가 아니라 시간이 만든 반례다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>기본 non-blocking 실험에서 bfloat16은 16.8 GB와 71.3%, int8은 10.2 GB와 58.1%, int4는 7.0 GB와 71.9% Bridge success를 냈다. 이상한 점은 더 거친 int4가 int8보다 높다는 것이다. A5000에서 int8 quantization 연산 overhead 때문에 1.2 Hz에 그쳤고, int4는 memory traffic이 줄어 3 Hz였다. Training/controller의 5 Hz에 가까운 쪽이 실제 robot state를 더 자주 다시 보았다.</p>
          <p>Offline training data에서는 int8과 int4 모두 bfloat16과 비슷한 token accuracy였다. Appendix D.4가 controller timing을 blocking 방식으로 맞추자 세 precision의 success error bar도 겹쳤다. 그러므로 이 결과는 “int8 weight가 action을 잊었다”보다 “느린 inference가 closed-loop dynamics를 바꿨다”는 설명을 지지한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\Delta t}_{\text{action 갱신 간격}}&=\frac{1}{f}\\[2pt]\underbrace{1.2\ \mathrm{Hz}}_{\text{int8}}&\mapsto833\ \mathrm{ms}\\[-1pt]\underbrace{3\ \mathrm{Hz}}_{\text{int4}}&\mapsto333\ \mathrm{ms}\\[-1pt]\underbrace{5\ \mathrm{Hz}}_{\text{학습 제어 주기}}&\mapsto200\ \mathrm{ms}\end{aligned}`}
          meaning="초당 action update 횟수의 역수를 구하면 robot이 같은 명령을 유지하는 시간을 얻는다. int8은 학습 때 200 ms마다 바뀌던 상태를 약 833 ms 뒤에 다시 본다. Offline token accuracy에는 이 기다리는 동안 물체와 arm이 이동한 효과가 없으므로 rollout이 필요하다."
          symbols={[
            [String.raw`f`, 'Model과 controller가 실제 action을 갱신하는 frequency'],
            [String.raw`\Delta t`, '두 action update 사이의 물리 시간'],
            [String.raw`1/f`, '빈도를 시간 간격으로 바꾸는 역수 연산'],
            [String.raw`\text{Non-blocking}`, 'Robot이 움직이는 동안 다음 inference를 수행해 latency가 cadence를 직접 바꿈'],
            [String.raw`\text{Blocking control}`, '한 action 실행과 예측 순서를 맞춰 precision별 속도 confound를 줄이는 비교'],
          ]}
        />
        <OpenVlaControlCadenceLab />
        <Misconception>“4-bit가 bfloat16만큼 정확하다”는 보편 결론이 아니다. Quantization 표는 final full OpenVLA보다 작은 mixture와 SigLIP-only variant를 사용했고, non-blocking 성공률에는 cadence가 섞여 있다. Weight fidelity, inference throughput과 closed-loop success를 따로 보고해야 한다.</Misconception>
        <StopRule>Image→vision encoder→projector→action token→continuous command, 1–99 percentile quantization, data curation과 cadence confound를 설명할 수 있으면 OpenVLA 원문 바닥은 끝이다. History·metadata·action chunk를 갖춘 현재 상단은 <InternalLink slug="research-pi07-2026">π0.7</InternalLink>, 실제 feedback deadline은 <InternalLink slug="robot-dynamics-feedback-control">Robot Dynamics & Feedback</InternalLink>에서 이어 간다.</StopRule>
        <CapabilityCheck items={[
          'SigLIP·DINOv2·projector·Llama 2·action decoder의 실행 순서를 그린다.',
          '한 action value를 1–99 percentile 범위의 edge·digitize·center 순서로 바꾸고 다시 복원한다.',
          'Open X filtering, DROID schedule과 Bridge no-op cleaning이 model evidence에 미치는 영향을 구분한다.',
          'Bridge 170회와 Google 60회 평가가 지지하는 주장을 비교 조건과 함께 말한다.',
          'LoRA r=32 결과를 좁은 task suite 밖의 보편 법칙으로 과장하지 않는다.',
          'Offline token accuracy가 같아도 1.2 Hz rollout이 실패할 수 있는 이유를 시간 간격으로 계산한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenVLA · arXiv paper', href: 'https://arxiv.org/abs/2406.09246', note: 'Architecture, action tokenization, data mixture, robot evaluation, adaptation, quantization과 limitations의 1차 근거.' },
          { label: 'OpenVLA · official project', href: 'https://openvla.github.io', note: '공식 checkpoint, code, fine-tuning과 deployment artifact.' },
          { label: 'OpenVLA · GitHub', href: 'https://github.com/openvla/openvla', note: 'Tokenizer mapping, dataset transform와 reproduction code를 확인하는 구현 근거.' },
          { label: 'Open X-Embodiment', href: 'https://robotics-transformer-x.github.io', note: 'OpenVLA training mixture가 가져온 cross-embodiment dataset의 원천.' },
        ]} />
      </section>
    </>
  );
}
