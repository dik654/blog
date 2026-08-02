import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

type SceneKey =
  | 'GenerativeTimeline'
  | 'DDPMMath'
  | 'DiffusionProcess'
  | 'ForwardReverseDetail'
  | 'UNetArch'
  | 'UNetDetail'
  | 'StableDiffusionArch'
  | 'SDPipeline'
  | 'CFGDetail';

const META: Record<SceneKey, { id: string; title: string; caption: string; focus: string }> = {
  GenerativeTimeline: {
    id: 'generative-timeline',
    title: '생성 모델 흐름',
    caption: '생성 모델은 $z \\to x_0$ 를 한 번에 풀다가, diffusion 에서 $x_T \\to x_0$ 작은 step 들로 나눈다.',
    focus: '한 번에 noise 에서 image 를 만들면 분포 전체를 한 함수가 맞춰야 한다. 작은 step 으로 나누면 각 step 은 조금만 고치면 된다.',
  },
  DDPMMath: {
    id: 'ddpm-math',
    title: 'DDPM 핵심 수식',
    caption: '$q$ 는 noise 를 더하고, $\\epsilon_\\theta$ 는 그 noise 를 맞춘다.',
    focus: 'Forward 를 작은 Gaussian step 으로 고정해 두면 학습할 것은 reverse 의 noise 방향 하나로 줄어든다.',
  },
  DiffusionProcess: {
    id: 'diffusion-process',
    title: 'Forward / Reverse chain',
    caption: '$x_0 \\to x_t \\to x_T$ 를 만들고, 추론은 $x_T \\to x_0$ 로 거꾸로 간다.',
    focus: '중간 상태 $x_t$ 는 깨끗한 신호와 noise 가 섞인 값이다. step 이 커질수록 signal 은 줄고 noise 가 커진다.',
  },
  ForwardReverseDetail: {
    id: 'forward-reverse-detail',
    title: '임의 시점 x_t 만들기',
    caption: '$x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$ 로 임의 시점 학습 샘플을 만든다.',
    focus: '모든 중간 step 을 실제로 지나지 않아도 된다. 누적곱 $\\bar\\alpha_t$ 가 $x_0$ 에 남길 signal 비율을 바로 준다.',
  },
  UNetArch: {
    id: 'unet-arch',
    title: 'U-Net noise predictor',
    caption: '$x_t$, $t$, 조건 $c$ 를 받아 $\\epsilon_\\theta$ 를 출력한다.',
    focus: '작은 noise 를 빼려면 위치 디테일과 넓은 문맥이 둘 다 필요하다. U-Net 은 down path 로 문맥을 모으고 skip 으로 위치 정보를 되돌린다.',
  },
  UNetDetail: {
    id: 'unet-detail',
    title: '시간·텍스트 조건 결합',
    caption: '$t_{emb}$ 는 noise level, cross-attention 은 prompt 조건을 U-Net block 안으로 넣는다.',
    focus: '같은 noisy latent 라도 어느 timestep 인지에 따라 빼야 할 noise 크기가 다르다. 텍스트가 있으면 어떤 방향으로 복원할지도 달라진다.',
  },
  StableDiffusionArch: {
    id: 'stable-diffusion-arch',
    title: 'Latent diffusion 구조',
    caption: '$x_0 \\xrightarrow{VAE} z_0$, latent denoise, $z_0 \\xrightarrow{VAE^{-1}} x_0$',
    focus: '512px 이미지를 직접 다루면 공간이 너무 크다. 먼저 작은 latent 로 압축하면 같은 diffusion loop 를 훨씬 싼 공간에서 돌릴 수 있다.',
  },
  SDPipeline: {
    id: 'sd-pipeline',
    title: 'Stable Diffusion pipeline',
    caption: 'prompt 는 $c$, random latent 는 $z_T$, U-Net loop 는 $z_0$, VAE decoder 는 image 를 만든다.',
    focus: '텍스트와 random seed 는 서로 다른 입력이다. 텍스트는 방향을 주고, seed latent 는 시작점을 정한다.',
  },
  CFGDetail: {
    id: 'cfg-detail',
    title: 'Classifier-Free Guidance',
    caption: '$\\hat\\epsilon=\\epsilon_{\\emptyset}+w(\\epsilon_c-\\epsilon_{\\emptyset})$',
    focus: '조건부 예측과 무조건 예측이 다르면 그 차이가 prompt 방향이다. $w$ 는 그 방향을 얼마나 더 밀지 정한다.',
  },
};

const QUESTIONS: Record<SceneKey, string> = {
  GenerativeTimeline: '왜 생성 모델은 noise에서 이미지를 한 번에 만들려던 방식에서, 작은 denoise step을 반복하는 방식으로 이동했을까?',
  DDPMMath: 'Forward 과정은 고정하면서도 reverse 생성 과정을 학습할 수 있는 최소 목표는 무엇일까?',
  DiffusionProcess: '깨끗한 이미지와 순수 noise 사이의 중간 상태를 어떻게 만들고 다시 되돌릴까?',
  ForwardReverseDetail: '모든 forward step을 순서대로 실행하지 않고도 임의 시점 $x_t$를 바로 만들 수 있을까?',
  UNetArch: 'Noise를 예측할 때 넓은 문맥과 픽셀 위치 정보를 어떻게 동시에 보존할까?',
  UNetDetail: '같은 noisy latent에서도 timestep과 prompt에 따라 다른 noise를 빼게 하려면 무엇을 넣어야 할까?',
  StableDiffusionArch: '고해상도 픽셀 공간의 diffusion 비용을 줄이면서 이미지 의미를 유지하려면 어디서 계산해야 할까?',
  SDPipeline: 'Prompt, random seed, U-Net, VAE는 각각 생성 결과의 어느 부분을 결정할까?',
  CFGDetail: 'Prompt 조건이 만든 방향만 분리해 더 강하게 반영하려면 두 noise 예측을 어떻게 결합해야 할까?',
};

const DIFFUSION_LEGEND = [
  { label: '값 상자', description: '$x_t$, $\\epsilon_\\theta$ 처럼 계산에 쓰이는 텐서·스칼라' },
  { label: '화살표', description: '현재 step 에서 왼쪽 값이 오른쪽 값을 만드는 입력' },
  { label: 'param', description: '$\\beta_t$, $\\theta$, $w$ 처럼 학습되거나 설정되는 값' },
];

function objectsFor(key: SceneKey): SceneSpec['objects'] {
  const imageInput = key === 'StableDiffusionArch' || key === 'SDPipeline' ? 'z_t' : 'x_t';
  const imageLabel = key === 'StableDiffusionArch' || key === 'SDPipeline' ? 'z_t' : 'x_t';

  return [
    {
      id: 'x0',
      kind: 'matrix',
      shape: [4, 4],
      label: key === 'StableDiffusionArch' || key === 'SDPipeline' ? 'x_0' : 'x_0',
      role: 'input',
      description: '깨끗한 training image 또는 최종 image',
      why: '출발점은 실제 데이터.\nForward 는 이 값을 점점 noise 쪽으로 밀고, reverse 는 다시 이 모양에 가까워지도록 학습한다.',
    },
    {
      id: 'z0',
      kind: 'matrix',
      shape: [4, 4],
      label: 'z_0',
      role: key === 'StableDiffusionArch' || key === 'SDPipeline' ? 'intermediate' : 'input',
      description: 'VAE 가 만든 작은 latent image',
      why: '픽셀 전체보다 훨씬 작은 공간.\nStable Diffusion 은 diffusion 을 이 latent 공간에서 돌려 계산량을 줄인다.',
    },
    {
      id: 'beta',
      kind: 'scalar',
      label: '\\beta_t',
      role: 'param',
      description: 'step $t$ 에 더할 noise 크기',
      why: '한 번에 큰 noise 를 넣으면 중간 분포가 복잡하다.\n작은 $\\beta_t$ 로 나누면 각 forward step 이 단순 Gaussian 에 가깝다.',
    },
    {
      id: 'abar',
      kind: 'scalar',
      label: '\\bar\\alpha_t',
      role: 'intermediate',
      description: '$x_0$ 신호가 step $t$ 까지 남는 비율',
      why: '$\\alpha_t=1-\\beta_t$ 를 누적곱한 값.\n중간 step 을 모두 지나지 않고도 $x_t$ 를 직접 만들 수 있게 한다.',
    },
    {
      id: 'eps',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\epsilon',
      role: 'input',
      description: '표준 Gaussian noise',
      why: '평균 0, 분산 1 인 단순 분포.\n어느 시점의 noisy sample 도 깨끗한 신호와 이 noise 의 선형 결합으로 만들 수 있다.',
    },
    {
      id: 'xt',
      kind: 'matrix',
      shape: [4, 4],
      label: imageLabel,
      role: 'intermediate',
      description: 'step $t$ 의 noisy image 또는 latent',
      why: '깨끗한 신호와 noise 가 섞인 중간 상태.\n모델은 이 값에서 어떤 noise 를 빼야 하는지 맞춘다.',
    },
    {
      id: 't',
      kind: 'scalar',
      label: 't',
      role: 'input',
      description: '현재 denoise step',
      why: '초기 step 은 noise 가 크고 마지막 step 은 작다.\n같은 $x_t$ 모양이라도 $t$ 에 따라 빼야 할 양이 달라진다.',
    },
    {
      id: 'c',
      kind: 'group',
      label: 'c',
      role: 'input',
      children: ['prompt', 'tokens'],
      description: '텍스트 조건 embedding',
      why: 'prompt 를 숫자 시퀀스로 바꾼 조건.\n이미지 특징이 cross-attention 으로 이 조건을 참고한다.',
    },
    { id: 'prompt', kind: 'token', label: 'prompt', description: '사용자 문장' },
    { id: 'tokens', kind: 'matrix', shape: [4, 4], label: '77×768', description: 'CLIP text embedding' },
    {
      id: 'theta',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\theta',
      role: 'param',
      description: 'U-Net 또는 DiT 의 학습 파라미터',
      why: 'Reverse 방향은 데이터로부터 학습해야 한다.\n$\\theta$ 는 각 step 에서 noise 방향을 예측하도록 업데이트된다.',
    },
    {
      id: 'epsTheta',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\epsilon_\\theta',
      role: 'intermediate',
      description: '모델이 예측한 noise',
      why: '직접 image 를 맞추기보다 추가된 noise 를 맞춘다.\n목표가 단순 Gaussian noise 라 MSE 학습으로 안정적이다.',
    },
    {
      id: 'epsUncond',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\epsilon_\\emptyset',
      role: 'intermediate',
      description: '조건 없이 예측한 noise',
      why: 'prompt 를 비웠을 때의 기본 생성 방향.\nCFG 는 이 기준점에서 조건 방향만 따로 뽑는다.',
    },
    {
      id: 'epsCond',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\epsilon_c',
      role: 'intermediate',
      description: '조건 $c$ 를 넣고 예측한 noise',
      why: 'prompt 가 있을 때의 denoise 방향.\n무조건 예측과의 차이가 텍스트가 만든 방향이다.',
    },
    {
      id: 'w',
      kind: 'scalar',
      label: 'w',
      role: 'param',
      description: 'guidance scale',
      why: '조건 방향을 얼마나 크게 더할지 정한다.\n너무 크면 충실도는 오르지만 다양성과 자연스러움이 줄 수 있다.',
    },
    {
      id: 'epsHat',
      kind: 'matrix',
      shape: [4, 4],
      label: '\\hat\\epsilon',
      role: 'intermediate',
      description: 'CFG 가 적용된 최종 noise 예측',
      why: '샘플러가 실제로 사용할 noise 방향.\n조건 방향이 $w$ 배 더해진다.',
    },
    {
      id: 'xprev',
      kind: 'matrix',
      shape: [4, 4],
      label: key === 'StableDiffusionArch' || key === 'SDPipeline' ? 'z_{t-1}' : 'x_{t-1}',
      role: 'intermediate',
      description: '한 step 더 깨끗해진 상태',
      why: '예측 noise 를 빼서 만든 다음 상태.\n이 연산을 반복하면 $x_T$ 또는 $z_T$ 에서 $x_0$ 또는 $z_0$ 로 간다.',
    },
    {
      id: 'image',
      kind: 'matrix',
      shape: [4, 4],
      label: 'image',
      role: 'output',
      description: 'VAE decoder 뒤 최종 픽셀 이미지',
      why: '사용자가 보는 결과.\nStable Diffusion 에서는 latent loop 가 끝난 뒤 한 번 decode 한다.',
    },
    {
      id: 'L',
      kind: 'scalar',
      label: 'L',
      role: 'output',
      description: 'noise 예측 MSE',
      why: '예측 noise 와 실제 noise 의 차이.\n목표가 단순해서 adversarial discriminator 없이도 학습이 안정적이다.',
    },
    {
      id: 'modelLine',
      kind: 'group',
      label: 'GAN → VAE → Flow → DDPM → LDM',
      role: 'input',
      description: '생성 모델 계보',
      why: '초기 모델들은 한 번에 sample 을 만들거나 역변환을 학습했다.\nDiffusion 은 생성 과정을 많은 작은 denoise step 으로 바꾼다.',
    },
    {
      id: 'unet',
      kind: 'group',
      label: 'U-Net',
      role: 'intermediate',
      description: 'down path, middle, up path, skip 을 가진 noise predictor',
      why: '넓은 문맥은 downsampling 으로 보고, 위치 디테일은 skip connection 으로 보존한다.',
    },
  ];
}

function transitionsFor(key: SceneKey): SceneSpec['transitions'] {
  if (key === 'GenerativeTimeline') {
    return [
      {
        t: 0,
        op: 'project',
        inputs: ['modelLine', 'eps'],
        produces: 'xt',
        caption: '$z \\to x_0$ 를 한 번에 만들기',
        why: 'GAN, VAE, Flow 는 각각 다른 방식으로 random source 에서 sample 을 만든다.\n한 번에 전체 image 분포를 맞추는 부담이 크거나, 품질과 안정성 trade-off 가 생긴다.',
      },
      {
        t: 1,
        op: 'add',
        inputs: ['x0', 'beta', 'eps'],
        produces: 'xt',
        caption: '$q(x_t\\mid x_{t-1})$ 로 작은 noise step 누적',
        why: '깨끗한 image 에 noise 를 아주 조금씩 더한다.\n각 step 이 단순 Gaussian 이면 역방향도 작은 denoise 문제로 나눌 수 있다.',
      },
      {
        t: 2,
        op: 'project',
        inputs: ['xt', 't', 'theta'],
        produces: 'epsTheta',
        caption: '$\\epsilon_\\theta(x_t,t)$',
        why: 'Diffusion 의 학습 대상은 image 전체가 아니라 step $t$ 에 섞인 noise.\n이 이름을 붙이면 DDPM 이 된다.',
      },
    ];
  }

  if (key === 'CFGDetail') {
    return [
      {
        t: 0,
        op: 'project',
        inputs: ['xt', 't', 'theta'],
        produces: 'epsUncond',
        caption: '$\\epsilon_\\emptyset=\\epsilon_\\theta(x_t,t,\\emptyset)$',
        why: '조건을 비우고 기본 denoise 방향을 얻는다.\n훈련 때 조건 dropout 을 해 두었기 때문에 같은 모델이 이 입력도 처리할 수 있다.',
      },
      {
        t: 1,
        op: 'project',
        inputs: ['xt', 't', 'c', 'theta'],
        produces: 'epsCond',
        caption: '$\\epsilon_c=\\epsilon_\\theta(x_t,t,c)$',
        why: '같은 noisy state 에 prompt 조건을 넣는다.\n조건이 만든 차이가 텍스트 방향으로 읽힌다.',
      },
      {
        t: 2,
        op: 'add',
        inputs: ['epsUncond', 'epsCond', 'w'],
        produces: 'epsHat',
        caption: '$\\hat\\epsilon=\\epsilon_\\emptyset+w(\\epsilon_c-\\epsilon_\\emptyset)$',
        why: META[key].focus,
        notes: [
          { target: 'epsUncond', tex: '$\\epsilon_\\emptyset$', note: '조건 없는 기준 방향. 여기서 출발해야 prompt 가 만든 변화만 분리된다.' },
          { target: 'epsCond', tex: '$\\epsilon_c-\\epsilon_\\emptyset$', note: '조건이 있을 때와 없을 때의 차이. 이 차이를 prompt 방향으로 본다.' },
          { target: 'w', tex: '$w$', note: '방향 증폭 계수. 실무의 CFG scale.' },
        ],
      },
      {
        t: 3,
        op: 'add',
        inputs: ['xt', 'epsHat', 'beta'],
        produces: 'xprev',
        caption: '$x_{t-1}=\\mathrm{step}(x_t,\\hat\\epsilon,\\beta_t)$',
        why: '샘플러는 최종 noise 예측을 사용해 한 step 더 깨끗한 상태를 만든다.\n이 loop 를 반복하면 prompt 쪽으로 당겨진 sample 이 나온다.',
      },
    ];
  }

  if (key === 'StableDiffusionArch' || key === 'SDPipeline') {
    return [
      {
        t: 0,
        op: 'project',
        inputs: ['x0'],
        produces: 'z0',
        caption: '$z_0=\\mathrm{VAE}_{enc}(x_0)$',
        why: '픽셀 공간은 크고 주변 픽셀 중복도 많다.\n먼저 latent 로 압축하면 diffusion loop 가 작아져 비용이 크게 줄어든다.',
        notes: [{ target: 'z0', tex: '$z_0$', note: '512×512×3 image 를 보통 64×64×4 latent 로 줄인 표현.' }],
      },
      {
        t: 1,
        op: 'project',
        inputs: ['prompt'],
        produces: 'c',
        caption: '$c=\\mathrm{CLIP}(\\mathrm{prompt})$',
        why: '문장을 바로 U-Net 에 넣을 수 없다.\nTokenizer 와 text encoder 가 prompt 를 attention 에 쓸 수 있는 embedding sequence 로 바꾼다.',
      },
      {
        t: 2,
        op: 'project',
        inputs: ['z0', 'beta', 'eps'],
        produces: 'xt',
        caption: '$z_t=\\sqrt{\\bar\\alpha_t}z_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$',
        why: '학습 때는 latent 에 noise 를 섞은 $z_t$ 를 만든다.\n추론 때는 $z_T\\sim\\mathcal N(0,I)$ 에서 시작해 같은 형태의 reverse step 을 반복한다.',
      },
      {
        t: 3,
        op: 'project',
        inputs: ['xt', 't', 'c', 'theta'],
        produces: 'epsTheta',
        caption: '$\\epsilon_\\theta(z_t,t,c)$',
        why: META[key].focus,
      },
      {
        t: 4,
        op: 'add',
        inputs: ['xt', 'epsTheta', 'beta'],
        produces: 'xprev',
        caption: '$z_{t-1}=\\mathrm{step}(z_t,\\epsilon_\\theta,\\beta_t)$',
        why: '예측한 noise 방향을 빼서 latent 를 한 step 정리한다.\n이 과정을 20-1000 step 반복하면 $z_0$ 에 가까워진다.',
      },
      {
        t: 5,
        op: 'project',
        inputs: ['xprev'],
        produces: 'image',
        caption: '$x_0=\\mathrm{VAE}_{dec}(z_0)$',
        why: 'Diffusion loop 는 latent 에서 끝난다.\n마지막 decoder 가 사용자가 볼 수 있는 pixel image 로 되돌린다.',
      },
    ];
  }

  if (key === 'UNetArch' || key === 'UNetDetail') {
    return [
      {
        t: 0,
        op: 'project',
        inputs: ['xt'],
        produces: 'unet',
        caption: '$x_t \\to$ down path $\\to$ middle $\\to$ up path',
        why: '해상도를 줄이면 넓은 문맥을 싸게 본다.\n대신 위치 디테일이 흐려지므로 encoder feature 를 skip 으로 decoder 에 직접 보낸다.',
      },
      {
        t: 1,
        op: 'project',
        inputs: ['t'],
        produces: 'abar',
        caption: '$t \\to t_{emb}$',
        why: '현재 noise level 을 network 에 알려준다.\n큰 $t$ 에서는 거친 구조를, 작은 $t$ 에서는 미세 noise 를 다르게 처리해야 한다.',
      },
      {
        t: 2,
        op: 'project',
        inputs: ['prompt'],
        produces: 'c',
        caption: '$c=\\mathrm{CLIP}(\\mathrm{prompt})$',
        why: '텍스트 조건은 token embedding sequence 로 들어간다.\nCross-attention 에서 image feature 가 query, text embedding 이 key/value 가 된다.',
      },
      {
        t: 3,
        op: 'project',
        inputs: ['unet', 'abar', 'c', 'theta'],
        produces: 'epsTheta',
        caption: '$\\epsilon_\\theta(x_t,t,c)$',
        why: META[key].focus,
        notes: [
          { target: 'unet', tex: 'skip', note: '고해상도 위치 정보를 decoder 로 직접 넘겨 경계와 디테일 손실을 줄인다.' },
          { target: 'c', tex: '$QK^T V$', note: '이미지 feature 가 prompt token 을 조회해 어떤 의미를 반영할지 정한다.' },
        ],
      },
    ];
  }

  return [
    {
      t: 0,
      op: 'scale',
      inputs: ['beta'],
      produces: 'abar',
      caption: '$\\bar\\alpha_t=\\prod_{s=1}^{t}(1-\\beta_s)$',
      why: '각 step 에서 남는 signal 비율을 계속 곱한다.\n이 누적값 하나가 $x_0$ 와 noise 를 얼마나 섞을지 정한다.',
      notes: [
        { target: 'beta', tex: '$\\beta_s$', note: 'step $s$ 의 noise 크기. 작게 잡을수록 한 step 전이가 Gaussian 에 가까워진다.' },
        { target: 'abar', tex: '$\\bar\\alpha_t$', note: 'step $t$ 까지 남은 원본 신호 비율.' },
      ],
    },
    {
      t: 1,
      op: 'add',
      inputs: ['x0', 'abar', 'eps'],
      produces: 'xt',
      caption: '$x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$',
      why: META[key].focus,
      notes: [
        { target: 'x0', tex: '$\\sqrt{\\bar\\alpha_t}x_0$', note: '원본 신호 항. $t$ 가 커질수록 계수가 작아진다.' },
        { target: 'eps', tex: '$\\sqrt{1-\\bar\\alpha_t}\\epsilon$', note: 'noise 항. 원본 신호가 줄어든 만큼 커진다.' },
      ],
    },
    {
      t: 2,
      op: 'project',
      inputs: ['xt', 't', 'theta'],
      produces: 'epsTheta',
      caption: '$\\epsilon_\\theta(x_t,t)$',
      why: '모델은 $x_t$ 에 섞인 실제 noise 를 예측한다.\n직접 $x_0$ 를 맞추는 대신 noise 를 맞추면 목표 분포가 단순해져 MSE 로 학습 가능하다.',
    },
    {
      t: 3,
      op: 'dot',
      inputs: ['eps', 'epsTheta'],
      produces: 'L',
      caption: '$L=\\mathbb E\\|\\epsilon-\\epsilon_\\theta(x_t,t)\\|^2$',
      why: '정답 noise 와 예측 noise 의 거리.\nForward 에서 실제로 넣은 $\\epsilon$ 을 알고 있으므로 supervised target 처럼 쓸 수 있다.',
    },
    {
      t: 4,
      op: 'add',
      inputs: ['xt', 'epsTheta', 'beta'],
      produces: 'xprev',
      caption: '$x_{t-1}=\\mathrm{step}(x_t,\\epsilon_\\theta,\\beta_t)$',
      why: '추론에서는 예측 noise 를 빼서 한 step 이전 상태를 만든다.\nDDPM, DDIM, DPM-Solver 는 이 step 식을 어떻게 잡느냐의 차이다.',
    },
  ];
}

function makeSpec(key: SceneKey): SceneSpec {
  const meta = META[key];
  const transitions = transitionsFor(key);
  const objects = objectsFor(key);
  const used = new Set<string>();

  for (const transition of transitions) {
    transition.inputs.forEach((input) => used.add(typeof input === 'string' ? input : input.object));
    const produced = Array.isArray(transition.produces) ? transition.produces : [transition.produces];
    produced.forEach((id) => used.add(id));
    transition.notes?.forEach((note) => {
      if (note.target) used.add(note.target);
    });
  }

  for (const object of objects) {
    if (object.kind !== 'group' || !object.children?.length) continue;
    if (used.has(object.id) || object.children.some((child) => used.has(child))) {
      used.add(object.id);
      object.children.forEach((child) => used.add(child));
    }
  }

  return {
    id: `diffusion-${meta.id}`,
    title: meta.title,
    caption: meta.caption,
    question: QUESTIONS[key],
    takeaway: meta.focus,
    overview: meta.focus,
    legend: DIFFUSION_LEGEND,
    overviewArrows: false,
    objects: objects.filter((object) => used.has(object.id)),
    transitions,
  };
}

export function makeDiffusionScene(key: SceneKey) {
  return function DiffusionScene() {
    return <Scene spec={makeSpec(key)} />;
  };
}
