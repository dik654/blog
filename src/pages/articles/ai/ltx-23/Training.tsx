import LtxGuidanceViz from './viz/LtxGuidanceViz';
import LtxTrainingViz from './viz/LtxTrainingViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3단계: 학습·파인튜닝에서 공개된 것과 남은 빈칸</h2>
      <div className="not-prose mb-8"><LtxTrainingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LTX-2.3을 학습 관점에서 읽을 때는 먼저 “사전학습 전체를 복제하는 법”과 “공개 체크포인트를 조정하는 법”을
          분리해야 한다. 공개 자료로 확실히 설명할 수 있는 중심 흐름은 latent diffusion이다. 원본 video/audio를
          각각 VAE latent로 인코딩하고, 시간 단계 <M>{'t'}</M>를 샘플링해 노이즈를 섞은 뒤, DiT가 노이즈 또는 velocity 계열
          목표값을 예측하도록 학습한다.
        </p>
        <M display>{'z_v = E_v(x_{1:T}), \\quad z_a = E_a(a_{1:T}), \\quad z_t = \\alpha_t z_0 + \\sigma_t \\epsilon'}</M>
        <FormulaNote
          meaning="영상과 오디오는 각각의 encoder로 압축한 뒤 diffusion noise level에 맞춰 noisy latent를 만든다. 이 식은 joint audio-video 학습의 입력 경계를 요약할 뿐, 두 modality가 같은 VAE나 같은 token shape를 쓴다는 뜻은 아니다."
          symbols={[
            ['E_v,E_a', 'video와 audio를 각각 압축하는 서로 다른 encoder'],
            ['x_{1:T},a_{1:T}', '같은 구간에 정렬된 video frame과 audio signal'],
            ['z_v,z_a', '각 modality의 압축 latent'],
            ['z_0', '현재 학습 branch의 clean latent'],
            ['\\alpha_t,\\sigma_t,\\epsilon', 'clean 비율, noise 비율, 주입한 Gaussian noise'],
          ]}
        />
        <p>
          <M>{'E_v'}</M>는 video VAE encoder, <M>{'E_a'}</M>는 audio VAE encoder다.
          <M>{'z_v'}</M>와 <M>{'z_a'}</M>는 픽셀/파형보다 작은 latent 표현이고,
          <M>{'z_t'}</M>는 현재 noise level에서 모델이 denoise해야 하는 latent다. workflow에서 frame 수와 해상도를 올리면
          바로 이 latent token 수가 늘어나 activation memory와 attention 비용이 커진다.
        </p>
        <p>
          이 한 줄을 풀면 네 개의 학습 대상이 생긴다. 첫째, Video VAE는 픽셀 프레임을 작지만 복원 가능한 latent grid로
          압축해야 한다. 둘째, Audio VAE는 파형 또는 spectrogram 성격의 표현을 시간적으로 다룰 수 있는 latent로 압축해야 한다.
          셋째, patchifier는 두 latent를 attention이 읽을 수 있는 토큰 시퀀스로 바꿔야 한다. 넷째, dual-stream DiT는
          같은 diffusion 시간표 위에서 영상 token과 오디오 token의 노이즈 제거 방향을 동시에 예측해야 한다.
        </p>
        <p>
          조건 입력도 단순하지 않다. text, image, video, audio 조건은 별도 conditioning path를 통해 들어가며,
          classifier-free guidance를 위해 일부 조건을 비우는 학습이 필요하다. 예를 들어 text 조건을 비운 예측과
          text 조건이 있는 예측을 모두 만들 수 있어야 추론 때 CFG를 계산할 수 있다. LTX-2에서는 여기에 audio/video
          조건 강도를 따로 조절하는 modality guidance까지 붙으므로, “조건을 어떻게 가끔 비우고 어떤 조건을 기준으로
          unconditional branch를 만들었는가”가 추론 품질과 직접 연결된다.
        </p>
        <p>
          공개 trainer는 LoRA, full fine-tuning, IC-LoRA 같은 확장 작업에는 유용하다. 여기서 학습자는 “내 데이터로
          어떤 부분을 바꿀 것인가”를 먼저 정해야 한다. 화면 스타일만 바꾸려면 영상 쪽 attention/FFN에 작은 LoRA를 거는
          편이 자연스럽고, 소리와 입 모양의 동기화를 바꾸는 데이터라면 audio-video cross-attention이나 modality guidance
          영향을 별도로 검증해야 한다. 그냥 전체를 크게 학습하면 짧은 샘플에서는 좋아 보여도 긴 영상에서 시간 일관성이
          무너질 수 있다.
        </p>
        <M display>{'W_{runtime} = W_0 + \\lambda \\frac{\\alpha}{r}BA'}</M>
        <FormulaNote
          meaning="LoRA는 원본 weight를 교체하지 않고 low-rank 변화량 BA를 scale해 runtime weight에 더한다. LTX에서는 같은 식을 쓰더라도 video self-attention, audio self-attention, text cross-attention과 audio-video cross-attention 중 어느 module에 적용했는지가 의미를 결정한다."
          symbols={[
            ['W_0', '동결하거나 기준으로 보존하는 원본 weight'],
            ['BA', 'rank r로 제한해 학습한 weight 변화량'],
            ['\\alpha/r', '학습 때 정한 LoRA normalization scale'],
            ['\\lambda', '추론 시 adapter 영향을 조절하는 strength'],
            ['W_{runtime}', 'base와 adapter를 합쳐 실제 연산에 사용하는 weight'],
          ]}
        />
        <p>
          LTX LoRA도 원리는 같다. <M>{'BA'}</M>는 학습한 low-rank 변화량이고, <M>{'\\lambda'}</M>는 inference strength다.
          다만 이미지 LoRA와 달리 target module을 고를 때 video self-attention, audio self-attention, text cross-attention,
          audio-video cross-attention을 구분해야 한다. 캐릭터 외형만 바꾸는 LoRA와 입 모양-음성 동기화를 바꾸는 LoRA는
          같은 위치에 걸면 안 된다.
        </p>
        <h3>공개 trainer로 할 수 있는 것</h3>
        <ul>
          <li>기존 checkpoint 위에 LoRA를 붙여 특정 스타일, 피사체, 도메인에 맞춘다.</li>
          <li>full fine-tuning으로 더 큰 변화를 줄 수 있지만, 과적합과 기존 능력 손실 위험이 커진다.</li>
          <li>IC-LoRA처럼 conditioning을 활용하는 변형은 이미지/비디오 조건을 더 강하게 반영하는 데 쓸 수 있다.</li>
          <li>학습 결과는 짧은 샘플 한두 개가 아니라 동기화, 움직임 지속성, decoder artifact, prompt 충실도를 따로 봐야 한다.</li>
        </ul>
        <h3>아직 공개됐다고 말하기 어려운 것</h3>
        <ul>
          <li>대규모 audio-video 데이터 수집 경로와 저작권/품질 필터링 전체 구현.</li>
          <li>입 모양, 충돌음, 배경음처럼 동기화 품질을 평가하고 걸러내는 기준.</li>
          <li>사전학습 curriculum, batch 구성, optimizer schedule, 해상도/길이별 mixture 비율.</li>
          <li>VAE, DiT, upscaler, distilled LoRA를 어떤 순서와 비율로 학습했는지에 대한 완전한 절차.</li>
        </ul>
        <div className="not-prose my-8"><LtxGuidanceViz /></div>
        <p>
          위 guidance Viz는 학습과 추론이 어떻게 이어지는지 보여준다. 조건 dropout으로 conditional/unconditional 예측을
          모두 만들 수 있게 학습해 두면, 추론에서는 CFG가 prompt 방향으로 예측을 당긴다. STG는 특정 transformer block을
          교란한 예측에서 멀어지게 만들어 시간 구조를 안정화하고, modality CFG는 오디오와 영상이 서로 따로 맞는 듯한
          실패를 줄이는 쪽으로 작동한다. 그래서 LTX-2.3의 학습 설명은 손실 함수만이 아니라 “어떤 guidance를 가능하게
          만들도록 학습했는가”까지 포함해야 한다.
        </p>
      </div>
    </section>
  );
}
