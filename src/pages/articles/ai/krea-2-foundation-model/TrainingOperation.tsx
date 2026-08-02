import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  InternalLink,
  Misconception,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';

function FormulaPair({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-6 min-w-0">
      <div className="min-w-0 overflow-hidden border-y border-border px-1 py-4 text-xs sm:px-3 sm:text-sm">
        <M display className="my-0">{latex}</M>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function GateRow({
  index,
  title,
  test,
}: {
  index: string;
  title: string;
  test: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)] sm:gap-5">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <p className="text-sm font-black">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{test}</p>
    </div>
  );
}

export default function Krea2TrainingOperation() {
  return (
    <>
      <section id="curriculum" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">256→512→1024는 image size가 아니라 학습 예산의 순서다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pretraining은 256px에서 basic text–image alignment와 structure를 먼저 만든다. Dataset이 billions scale이므로
            이 단계의 filter는 가능한 한 싼 CPU heuristic과 1B 미만 classifier를 쓴다. 많은 FLOP를 저해상도에 배분한 뒤
            512px와 1024px에서 high-fidelity detail을 붙인다.
          </p>
          <p>
            256px 첫 epoch에는 iREPA라는 보조 목표도 쓴다. Image representation alignment의 약자로, noisy image token이
            pretrained visual encoder의 semantic feature를 빨리 따라가게 방향 표지판을 준다. 초기 정렬 뒤에는 이 보조 loss를
            제거해 본래 생성 목표가 학습을 소유하게 한다.
          </p>
        </div>
        <FormulaPair
          latex={String.raw`\underbrace{C_{\mathrm{total}}}_{\text{전체 학습 계산 예산}}
          =
          \overbrace{C_{256}}^{\text{alignment·structure}}
          +
          \overbrace{C_{512}}^{\text{중간 해상도 전이}}
          +
          \overbrace{C_{1024}}^{\text{고해상도 detail}}`}
          meaning="세 stage의 계산량을 더하면 전체 training budget이 된다. 낮은 해상도에 더 많은 FLOP를 쓰는 이유는 spatial token이 적은 싼 단계에서 기본 관계를 먼저 배우고, 비싼 고해상도 계산을 fine detail에 집중하기 위해서다."
          symbols={[
            [String.raw`C_{256}`, '256px pretraining에 쓴 계산량, iREPA는 첫 epoch에만 사용'],
            [String.raw`C_{512}`, '중간 해상도에서 구조를 더 세밀하게 만드는 계산량'],
            [String.raw`C_{1024}`, '고해상도 fidelity와 text rendering을 마무리하는 계산량'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            256px와 512px stage에는 8-bit training을 적용했고, 해당 setup의 bf16 baseline보다 15–20% 빠르면서 loss와 evaluation 저하는
            매우 작았다고 보고한다. 256px는 tensorwise, 512px는 rowwise scaling을 사용한다. 1024px부터 최종 RL까지는 bf16으로 돌아간다.
            이 수치는 Krea의 model·hardware·software 조합에서 나온 관찰이며 모든 DiT의 보편 speedup이 아니다.
            Tensorwise는 tensor 전체가 scale 하나를 공유하는 싼 방식이고, rowwise는 row마다 scale을 둬 값 범위가 다른 channel을 더 세밀하게
            보존하는 방식이다.
          </p>
          <p>
            Objective는 clean latent와 noise 사이 경로에서 어느 방향으로 움직일지 velocity를 맞히는 rectified-flow loss다.
            이 이동 방향을 직접 예측하는 표현이 v-parameterization이다. 모든 noise time을 똑같이 뽑지 않고, logit-normal 분포를
            옮겨 특정 구간을 더 자주 학습하는 것이 shifted logit-normal schedule이다. Resolution이 바뀌면 가장 유용한 noise 구간도
            달라질 수 있어 그 shift를 resolution별로 sweep한다. 이 수학의 전체 유도는
            <InternalLink slug="dit-flow-matching-evaluation">Flow Matching 기반 글</InternalLink>이 소유하고,
            여기서는 “같은 checkpoint에 아무 scheduler나 붙이지 않는다”는 runtime 경계만 남긴다.
          </p>
        </div>
      </section>

      <section id="post-training" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Post-training은 미감을 올리는 한 단계가 아니라 reward의 책임을 나누는 과정이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pretraining 뒤에는 midtraining, 작은 고품질 domain dataset의 SFT, preference optimization과 RL이 이어진다.
            Midtraining은 거대한 broad-data pretraining과 좁은 SFT 사이에서 해상도·caption·domain 분포를 최종 품질 쪽으로 옮기는 연결 단계다.
            SFT는 broad base distribution 전체를 다시 배우는 단계가 아니라 특정 visual domain의 좋은 방향을 보여 주는 단계다.
            Preference stage는 사람이 더 선호하는 결과로 분포를 움직이고, RL은 prompt별 요구를 더 세밀하게 최적화한다.
          </p>
          <p>
            Prompt following과 text rendering은 “예쁜가?”보다 확인 가능한 요구를 가진다. Krea는 prompt를 작은 rubric으로 분해해 각 요구를
            image가 충족하는지 평가한다. 그러나 이 reward만 올리면 손가락, 팔다리와 글자 모양이 무너져도 judge가 놓칠 수 있다.
            그래서 structural artifact를 잡는 별도 reward model을 둔다.
          </p>
          <p>
            Prompt pool도 계산 예산이다. 이미 너무 쉬운 prompt, 계속 실패해 signal이 없는 prompt, sample 간 reward variance가 거의 없는 prompt는
            RL compute를 낭비한다. 아직 개선 가능하고 reward가 구분되는 prompt에 rollout을 더 배분한다. 이것은
            <InternalLink slug="post-training-rlvr">RLVR 글</InternalLink>의 verifier·exploration 문제를 image generation에 적용한 사례다.
          </p>
        </div>
        <Misconception>
          Aesthetic reward 하나를 최대화하면 창작 모델이 좋아지는 것이 아니다. Judge가 잘 보는 “그럴듯함”만 올리고 구조 오류·rare style·diversity를 잃는 reward hacking이 생길 수 있다.
        </Misconception>
      </section>

      <section id="raw-turbo" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">RAW에서 학습하고 Turbo에서 실행한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Krea 2 RAW는 undistilled base다. Official repository는 RAW inference에 52 step, CFG 3.5, 최대 1K를 권장한다.
            Fine-tuning, post-training과 LoRA 학습은 이 artifact에서 수행한다. Krea 2 Turbo는 8-step distilled checkpoint이며
            CFG 0, timestep shift <code>mu=1.15</code>, 1K–2K inference가 권장 범위다.
          </p>
          <p>
            중요한 연결은 RAW에서 학습한 LoRA를 Turbo에 적용하도록 두 checkpoint를 설계했다는 점이다.
            학습 가능한 넓은 trajectory와 빠른 serving trajectory를 분리하면서 adapter를 공유한다.
            실제 배포 전에는 style·identity gain과 Turbo regression을 같은 seed suite에서 다시 확인해야 한다.
          </p>
        </div>
        <FormulaPair
          latex={String.raw`\begin{aligned}
          s=0 &: \quad v=\underbrace{v_c}_{\text{조건부만 실행}} \\[6pt]
          s>0 &: \quad v=\underbrace{v_c+s\!\left(v_c-v_u\right)}_{\text{조건 방향 증폭}}
          \end{aligned}`}
          meaning="여기서 s=0은 아래 CFG 식에 숫자 0을 대입하라는 뜻이 아니다. 공식 sampling code는 guidance가 0이면 unconditional text encoding과 model pass를 아예 건너뛰고 conditional prediction v_c를 그대로 쓴다. s>0일 때만 두 branch를 빼 prompt가 추가한 방향 v_c-v_u를 분리하고, s를 곱해 그 방향의 크기를 조절한 뒤 conditional prediction에 더한다. 따라서 Turbo의 CFG 0은 계산도 줄이는 실행 경로 선택이고, RAW의 CFG 3.5는 두 번의 model pass로 prompt adherence를 증폭하는 경로다."
          symbols={[
            [String.raw`v_c`, '실제 prompt condition을 본 branch의 velocity'],
            [String.raw`v_u`, 'Negative 또는 빈 prompt condition을 본 branch의 velocity, s>0일 때만 계산'],
            [String.raw`s`, 'Classifier-free guidance scale이자 실행 분기, Turbo 권장값 0·RAW 권장값 3.5'],
          ]}
        />
        <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2">
          <div className="border border-sky-700/25 bg-sky-500/[0.04] p-4" style={{ borderRadius: 6 }}>
            <p className="text-[10px] font-black uppercase text-sky-800 dark:text-sky-300">RAW · train lane</p>
            <p className="mt-2 text-lg font-black">52 steps · CFG 3.5 · ≤1K</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Diversity와 malleability를 유지한 base. LoRA·fine-tuning·post-training의 출발점.</p>
          </div>
          <div className="border border-emerald-700/25 bg-emerald-500/[0.04] p-4" style={{ borderRadius: 6 }}>
            <p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">TURBO · serve lane</p>
            <p className="mt-2 text-lg font-black">8 steps · CFG 0 · μ 1.15</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Few-step distilled checkpoint. Fast inference와 RAW-trained LoRA 적용의 목적지.</p>
          </div>
        </div>
        <StopRule>
          RAW의 52-step·CFG 3.5를 Turbo에 복사하거나, Turbo의 8-step·CFG 0을 RAW에 적용해 품질을 비교하지 않는다. Variant 이름, revision, recommended sampler와 LoRA source를 한 manifest로 고정한다.
        </StopRule>
      </section>

      <section id="release-evaluation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Diversity·constraint·artifact·transfer를 서로 다른 gate로 닫는다</h2>
        <div className="not-prose border-b border-border">
          <GateRow index="01" title="Style coverage" test="Prompt family별 seed 결과를 embedding 하나로 평균내지 않고 composition·medium·palette cluster coverage와 중복률을 본다." />
          <GateRow index="02" title="Constraint" test="객체 수, 공간 관계, quoted visible text와 long prompt 요구를 rubric별 pass/fail로 나눈다." />
          <GateRow index="03" title="Artifact" test="손·팔다리·반복 texture·border·distorted text를 dedicated slice와 사람 검토로 찾는다." />
          <GateRow index="04" title="RAW→Turbo" test="같은 LoRA·prompt·seed에서 identity/style gain, prompt following과 Turbo base regression을 함께 측정한다." />
          <GateRow index="05" title="Runtime" test="Variant, steps, CFG, mu, resolution, weight dtype, VAE, GPU, peak VRAM과 cold/warm latency를 기록한다." />
          <GateRow index="06" title="Rights" test="Apache inference code와 Krea 2 Community License model weight, revenue threshold, distribution·content filter 의무를 분리한다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Official repository 자체는 Apache-2.0 code로 표시되지만 RAW와 Turbo model은 Krea 2 Community License를 따른다.
            이 agreement는 최근 12개월 전체 company revenue가 100만 USD 미만일 때만 agreement 범위의 commercial use를 허용하고,
            그 이상이면 enterprise license를 요구한다. Derivative 배포의 attribution·naming과 content filtering 의무도 있다.
            따라서 “permissive”라는 요약만 보고 배포하지 않는다.
          </p>
          <p>
            Workflow와 adapter를 다른 작업자가 다시 실행하는 단계는
            <InternalLink slug="open-model-community-workflows">Workflow 감사</InternalLink>와
            <InternalLink slug="open-model-finetuning-theory">오픈 모델 적응</InternalLink>으로 이어진다.
          </p>
        </div>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Krea 2는 architecture 목록이 아니라 분포를 만들고 좁히고 전달하는 lifecycle이다</h2>
        <CapabilityCheck items={[
          'Aesthetic score와 style·composition coverage를 서로 다른 평가 축으로 둔다.',
          'Pretraining real-image curation과 RL synthetic rollout이 서로 다른 stage signal임을 설명한다.',
          'GQA, gated attention, single stream과 light timestep modulation을 Krea의 ablation 기준으로 읽는다.',
          'Diffusion prefill-only inference에서 GQA를 KV cache 이야기로만 설명하지 않는다.',
          '256→512→1024 curriculum과 8-bit→bf16 전환을 계산 예산·capability 순서로 해석한다.',
          'Prompt rubric reward와 artifact reward가 서로 다른 reward hacking을 막는 이유를 설명한다.',
          'RAW 52/CFG 3.5에서 학습하고 Turbo 8/CFG 0/mu 1.15에서 실행하는 handoff를 설계한다.',
          'Apache inference code와 Community License model weights의 commercial boundary를 구분한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Krea 2 Technical Report', href: 'https://www.krea.ai/blog/krea-2-technical-report', note: '2026-06-23 data curation, architecture ablation, curriculum, post-training과 distributed infrastructure의 1차 근거.' },
          { label: 'Krea 2 official repository', href: 'https://github.com/krea-ai/krea-2', note: 'RAW/Turbo artifact, exact recommended steps·CFG·mu·resolution, LoRA handoff와 public inference code.' },
          { label: 'Krea 2 prompting guide', href: 'https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md', note: 'Natural-language prompt, quoted visible text, long prompt와 Turbo 2K의 현재 공개 입력 범위.' },
          { label: 'Krea 2 Community License', href: 'https://www.krea.ai/krea-2-licensing', note: 'RAW/Turbo weight, annual revenue threshold, derivative distribution, content filtering과 enterprise boundary.' },
          { label: 'GPU HPC 바닥부터', href: '/lab/blog/gpu/gpu-hpc-from-scratch', note: 'Technical report의 FSDP2, tensor parallel, NVLink, InfiniBand와 Kubernetes 운영을 더 깊게 읽는 기반.' },
        ]} />
      </section>
    </>
  );
}
