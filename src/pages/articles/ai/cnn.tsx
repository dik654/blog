import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { ConvolutionGeometryLab, ConvolutionProbeLab } from './vision-foundations/viz/FoundationLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function CNNArticle() {
  return <>
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CNN은 이미지를 외우는 망이 아니라 같은 질문을 모든 위치에 묻는 망이다</h2>
      <QuestionLead
        question="세로 경계를 찾는 3×3 filter를 이미지 왼쪽 위와 오른쪽 아래에서 따로 학습해야 할까?"
        answer="아니다. 같은 weight를 모든 위치에서 재사용하면 어디에 있든 같은 local pattern에 반응한다. CNN의 핵심은 작은 연결과 weight sharing이며, 이 둘이 image geometry를 보존하면서 parameter 수를 줄인다."
      />
      <ConceptPrimer items={[
        { term: 'Pixel', meaning: '공간 위치마다 channel 값을 가진 입력.', why: 'RGB라면 한 위치가 세 숫자를 가지며 이웃 관계가 의미를 만든다.' },
        { term: 'Kernel', meaning: '작은 공간 범위에 적용하는 학습 가능한 weight 묶음.', why: '어떤 local pattern에 반응할지 정한다.' },
        { term: 'Feature map', meaning: 'Kernel을 모든 위치에 적용해 얻은 반응 지도.', why: 'pattern이 어디서 얼마나 강하게 나타났는지 보존한다.' },
        { term: 'Channel', meaning: '서로 다른 종류의 feature map 축.', why: '경계·색·texture처럼 여러 detector를 병렬로 학습한다.' },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>전결합층은 224×224 RGB image를 펼치면 150,528개 위치를 서로 다른 weight로 취급한다. 반면 convolution은 작은 kernel만 학습하고 그 kernel을 image 전체에 재사용한다. 그래서 위치를 버리지 않고도 parameter를 통제한다.</p>
        <CitationBlock source="PyTorch Conv2d reference" citeKey={1} href="https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html"><p>PyTorch의 <code>Conv2d</code>는 수학 교과서의 뒤집힌 convolution이 아니라 실제로는 valid 2D cross-correlation을 계산한다. 구현을 읽을 때 연산 이름보다 tensor shape과 index 방향을 확인해야 한다.</p></CitationBlock>
      </div>
      <Misconception>CNN이 image를 1차원으로 펼치지 않는다는 말은 raw pixel 좌표를 영원히 보존한다는 뜻이 아니다. Stride·pooling·padding을 거치며 좌표와 해상도가 변하므로 source 좌표로 되돌릴 transform도 함께 관리해야 한다.</Misconception>
    </section>

    <section id="convolution-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">한 출력값은 crop·곱·합의 결과다</h2>
      <ConvolutionProbeLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>출력 위치 <M>(h,w)</M>에서 kernel은 입력의 작은 window를 읽는다. 입력 channel마다 원소별 곱을 하고 모두 더한 뒤 bias를 더한다. 같은 <M>K</M>를 다른 <M>(h,w)</M>에도 적용하므로 하나의 feature detector가 image 전체를 훑는다.</p>
      </div>
      <Formula
        latex={String.raw`\underbrace{Y_{n,o,h,w}}_{\text{출력 feature 한 칸}}=\underbrace{b_o}_{\text{출력 channel bias}}+\underbrace{\sum_{i,u,v}K_{o,i,u,v}\,X_{n,i,h+u,w+v}}_{\text{local window와 공유 kernel의 가중합}}`}
        meaning="이 식은 stride=1, dilation=1, padding=0인 내부 위치를 단순화해 batch n의 output channel o 한 칸을 계산한다. Kernel K는 위치 h,w가 바뀌어도 그대로 재사용된다. 일반 Conv2d의 stride·dilation·padding index는 아래 output-shape 식에서 따로 추적한다."
        symbols={[["X", '입력 tensor'], ["K", '학습되는 kernel weight'], ["Y", '출력 feature map'], ["i,o", '입력·출력 channel index'], ["u,v", 'kernel 내부 위치']]}
      />
      <div className="not-prose divide-y divide-border border-y border-border">
        {[
          ['Local connectivity', '한 출력은 입력 전체가 아니라 작은 window만 읽는다.'],
          ['Weight sharing', '같은 kernel parameter를 모든 공간 위치에서 재사용한다.'],
          ['Channel mixing', 'Standard convolution은 입력 channel을 합쳐 새 output channel을 만든다.'],
        ].map(([title, body], index) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[3rem_10rem_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
    </section>

    <section id="inductive-bias" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">지역성은 장점이지만 “자동 불변성”은 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>입력을 한 칸 옮기면 stride 1 convolution의 feature map도 대체로 한 칸 옮겨진다. 이것은 <strong>translation equivariance</strong>다. 입력을 옮겨도 class output이 같아지는 <strong>invariance</strong>는 pooling, global aggregation, augmentation과 head 설계가 더해진 뒤 기대하는 성질이다.</p>
      </div>
      <Formula
        latex={String.raw`\underbrace{K\star(T_{\delta}X)}_{\text{옮긴 입력의 feature}}=\underbrace{T_{\delta}(K\star X)}_{\text{원래 feature도 같은 만큼 이동}}`}
        meaning="이 식은 이상적인 stride 1 convolution이 입력 이동을 출력 이동으로 보낸다는 equivariance를 나타낸다. Padding 경계, stride, resampling이 들어가면 정확한 등식이 깨질 수 있으며, 이것만으로 class prediction의 invariance가 보장되지는 않는다."
        symbols={[
          [String.raw`T_{\delta}`, '입력을 delta만큼 평행 이동하는 연산'],
          [String.raw`K\star X`, 'kernel K와 입력 X의 cross-correlation'],
          [String.raw`\delta`, '공간 이동량'],
        ]}
      />
      <ConvolutionGeometryLab />
      <Misconception>“Attention은 convolution의 완전한 상위집합이므로 CNN은 끝났다”라고 결론 내리면 안 된다. 표현 가능한 함수, 학습 data 효율, memory access, target device kernel과 dense prediction의 multi-scale 요구는 서로 다른 비교 축이다.</Misconception>
    </section>

    <section id="architectures" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">깊이를 읽을 때는 feature map의 크기와 수용야를 추적한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Kernel 이름을 외우는 대신 각 layer 뒤의 <M>H\times W\times C</M>를 적는다. Stride가 커지면 해상도는 줄고 원본 image에서 한 output cell이 건너뛰는 간격은 커진다. Kernel과 dilation은 한 cell이 볼 수 있는 범위를 넓힌다.</p>
      </div>
      <Formula
        latex={String.raw`\begin{aligned}
k_{\text{유효}}&=d(k-1)+1 \quad \text{dilation 반영}\\
H_{\mathrm{out}}&=\operatorname{floor}\!\left(\frac{H_{\mathrm{in}}+2p-k_{\text{유효}}}{s}+1\right)
\end{aligned}`}
        meaning="이 식은 Conv2d kernel이 세로축에 놓일 수 있는 위치 수를 계산한다. Dilation, padding, stride 중 하나만 바뀌어도 feature 좌표와 source image 좌표의 대응이 달라진다."
        symbols={[["H_{in},H_{out}", '입력·출력 높이'], ["k", 'kernel 크기'], ["p", '양쪽 padding'], ["d", 'kernel 점 간격인 dilation'], ["s", '이동 간격인 stride']]}
      />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{j_l}_{\text{원본에서 출력 한 칸의 간격}}&=j_{l-1}s_l\\\underbrace{r_l}_{\text{l층 수용야}}&=r_{l-1}+(k_l-1)d_lj_{l-1}\end{aligned}`}
        meaning="이 식은 layer를 쌓을 때 원본 좌표에서의 jump와 이론적 receptive field를 함께 갱신한다. 이론적 범위 안의 모든 pixel이 같은 영향력을 갖는 것은 아니므로 실제 activation과 작은 객체 recall도 별도로 봐야 한다."
        symbols={[["j_l", 'l층 feature 한 칸이 원본에서 이동하는 거리'], ["r_l", 'l층의 이론적 receptive field'], ["s_l", '현재 layer stride'], ["k_l", '현재 kernel 크기'], ["d_l", '현재 dilation']]}
      />
      <StopRule>CNN 역사를 LeNet 이전까지 계속 내려가지 않는다. 한 output cell을 index로 계산하고, output shape·parameter sharing·equivariance·receptive field를 설명할 수 있으면 ResNet과 modern backbone을 읽는 최소 바닥에 도달했다.</StopRule>
    </section>

    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4K image의 2px 결함은 224px 분류 문제와 다르다</h2>
      <QuestionLead
        question="3840×2160 검사 image를 224×224로 줄였더니 2px scratch가 사라졌다. 더 큰 CNN만 쓰면 해결될까?"
        answer="아니다. 원본의 2px 신호는 축소 후 0.12px 수준이라 model에 도달하기 전에 사라진다. 먼저 source resolution에서 tile·overlap·좌표 복원 계약을 정하고, 작은 신호를 보존하는 crop scale과 stride를 검증해야 한다. 그 뒤 backbone 크기를 비교한다."
      />
      <div className="not-prose divide-y divide-border border-y border-border">
        {[
          ['입력 계약', 'Decode color space, resize·crop·padding, source coordinate transform을 version한다.'],
          ['표현 계약', 'Critical signal보다 첫 stride가 너무 크지 않은지, 어느 stage feature를 head에 넘길지 정한다.'],
          ['평가 계약', '평균 accuracy 외에 결함 크기·조명·camera·lot slice의 recall을 분리한다.'],
          ['실행 계약', 'Preprocess부터 postprocess까지 target device p50/p95와 peak memory를 잰다.'],
        ].map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
    </section>

    <section id="cnn-vs-transformer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">현재의 선택은 CNN 대 Transformer 투표가 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><InternalLink slug="resnet">ResNet</InternalLink>은 identity path로 깊은 convolution backbone을 안정적으로 만든다. <InternalLink slug="vision-transformer">Vision Transformer</InternalLink>는 image를 token sequence로 바꾸고 관계 범위를 attention으로 설계한다. ConvNeXt는 Transformer 시대의 training·stage 설계를 ConvNet에 반영해 두 계열이 설계 원리를 교환한다는 점을 보여준다.</p>
        <CitationBlock source="A ConvNet for the 2020s · Liu et al." citeKey={2} href="https://arxiv.org/abs/2201.03545"><p>ConvNeXt 논문은 standard ConvNet module을 유지하면서 ResNet을 단계적으로 현대화해 accuracy와 scaling을 비교한다. 여기서는 특정 benchmark 우승이 아니라 “operator 이름만으로 backbone을 선택하지 않는다”는 근거로 사용한다.</p></CitationBlock>
      </div>
      <CapabilityCheck items={[
        '한 Conv2d output cell을 input·kernel index로 계산한다.',
        'Cross-correlation과 교과서 convolution의 구현 차이를 말한다.',
        'Local connectivity와 weight sharing이 parameter와 geometry에 미치는 영향을 설명한다.',
        'Translation equivariance와 classification invariance를 구분한다.',
        'Stride·padding·dilation으로 output shape과 source 좌표를 추적한다.',
        '작은 객체가 resize에서 사라지는 문제를 model 이전의 입력 계약으로 진단한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'PyTorch Conv2d documentation', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html', note: 'Tensor shape, cross-correlation, stride·padding·dilation·groups의 공식 구현 계약.' },
        { label: 'Deep Residual Learning', href: 'https://arxiv.org/abs/1512.03385', note: '현대 convolution backbone의 residual stage로 올라가는 다음 기준점.' },
        { label: 'A ConvNet for the 2020s', href: 'https://arxiv.org/abs/2201.03545', note: 'ConvNet과 Transformer 설계 원리가 수렴하는 비교 근거.' },
      ]} />
    </section>
  </>;
}
