import {
  BeginnerOpening,
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
  TemporalEvidenceLab,
  TemporalSamplingLab,
} from './practical-cv/viz/CvEvidenceLabs';

export default function VideoUnderstandingArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="temporal-contract"
        marker="00"
        tone="blue"
        question="프레임을 여러 장 넣으면 모델이 시간을 이해한 것일까?"
        title="먼저 어떤 사건을 어느 시간 범위에서 판정할지 정의한다"
      >
        <BeginnerOpening
          title="비디오 이해는 사진 여러 장을 보는 일을 넘어, 무엇이 어떤 순서로 변했는지 판단하는 문제입니다."
          description={<>Video는 시간 순서가 붙은 frame의 묶음이다. 어떤 작업은 한 장의 물체와 배경만으로 풀리지만, 열기와 닫기·넘어짐과 일어나기처럼 변화 방향이 답을 가르는 작업은 앞뒤 순서가 필요하다.</>}
          familiarScene={<>문이 열린 사진과 닫힌 사진 두 장을 바닥에 놓아 보자. 어느 사진이 먼저인지 모르면 누군가 문을 열었는지 닫았는지 말할 수 없다. 순서가 붙는 순간 같은 두 장이 서로 다른 사건을 설명한다.</>}
          steps={[
            { label: '판정할 사건의 길이를 정한다', detail: '순간 action인지 긴 activity인지에 따라 필요한 관측 시간과 clip 길이가 달라진다.' },
            { label: '원본 video 단위로 나눈다', detail: '같은 장면의 앞뒤 clip이 train과 validation에 섞여 배경을 외우지 않게 한다.' },
            { label: '시간이 정말 쓰였는지 시험한다', detail: '한 frame 기준선과 frame 순서 섞기·뒤집기 probe로 temporal evidence를 검증한다.' },
          ]}
        />
        <QuestionLead
          question="문 열기와 문 닫기는 같은 장면·물체를 포함한다. 한 장만 보고 둘을 구분할 수 있을까?"
          answer="결정적 순간이 우연히 잡히면 가능하지만, 일반적으로 변화 방향은 순서가 있어야 보인다. 반대로 수영과 스키처럼 배경만으로 맞힐 수 있는 label도 있어 비디오 점수만으로 temporal understanding을 증명할 수 없다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            비디오는 이미지의 긴 배열이 아니라 <strong>시간을 가진 관측</strong>이다. 먼저 prediction
            unit이 clip인지 whole video인지, label이 순간 action인지 장기 activity인지, 사건의 시작과
            끝이 어디인지, online 판정인지 offline 판정인지 적는다. 이 target horizon이 sampling과
            latency를 결정한다.
          </p>
          <p>
            <InternalLink slug="image-classification-pipeline">단일 이미지 pipeline</InternalLink>의
            split·metric 계약은 그대로 필요하다. 다만 clip을 만들기 <strong>전에</strong> source
            video, subject, event와 capture session으로 split한다. 같은 원본의 앞부분이 train에,
            뒷부분이 validation에 들어가면 배경·압축·배우를 외운 모델이 시간을 이해한 것처럼 보인다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Target horizon', meaning: '정답을 결정하기 위해 관측해야 하는 최소·최대 시간 범위', why: 'Clip length와 sampling density를 모델보다 먼저 정한다.' },
          { term: 'Source video', meaning: '여러 clip이 잘려 나온 공통 원본과 capture lineage', why: 'Clip 간 near-duplicate 누수를 막는 group key다.' },
          { term: 'Temporal evidence', meaning: '프레임 순서·속도·변화량처럼 한 장에는 없는 증거', why: '비싼 temporal model이 실제로 필요한지 판정한다.' },
          { term: 'Clip aggregation', meaning: '여러 clip score를 whole-video decision으로 모으는 규칙', why: '학습 단위와 최종 평가 단위를 구분한다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="sampling"
        marker="01"
        tone="teal"
        question="몇 프레임을 뽑을지가 아니라 무엇을 놓치지 않아야 할까?"
        title="Sampling은 첫 번째 temporal model이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dense sampling은 짧고 빠른 변화를 보지만 긴 사건을 덮지 못한다. Sparse uniform sampling은
            긴 범위를 덮지만 순간 전환을 건너뛴다. Event timestamp가 있으면 event-centered clip을,
            없으면 dense·sparse 두 시간축을 함께 비교할 수 있다. “16 또는 32 frame”은 계약이 아니라
            구현 결과다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
t_k
&=\underbrace{t_0}_{\text{관측 시작 시각}}
+\underbrace{k\Delta t}_{\text{표본 간 시간 간격}},\qquad k=0,\ldots,T-1\\
H
&=\underbrace{(T-1)\Delta t}_{\text{clip이 실제로 덮는 시간 범위}}
\end{aligned}`}
          meaning="Frame 수 T가 같아도 Δt가 바뀌면 관측 범위 H와 놓치는 motion frequency가 달라진다. 모델 입력에는 frame index뿐 아니라 실제 timestamp, FPS 변화와 padding mask를 보존한다."
          symbols={[
            [String.raw`t_0`, 'clip의 실제 시작 timestamp'],
            [String.raw`\Delta t`, '선택한 frame 사이의 시간 간격'],
            [String.raw`T`, '모델에 넣은 frame 수'],
            [String.raw`H`, '첫 frame부터 마지막 frame까지의 temporal coverage'],
          ]}
        />
        <TemporalSamplingLab />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Decode contract', 'Variable FPS, dropped frame, rotation metadata와 timestamp를 decode 뒤 assertion으로 확인한다.'],
            ['Train sampling', '무작위 시작점은 augmentation이다. Label이 clip 전체에 유효한지 먼저 확인한다.'],
            ['Validation sampling', '고정 clip 위치와 개수를 manifest에 남겨 run 사이 비교를 결정적으로 만든다.'],
            ['Whole-video coverage', 'Clip count, overlap, missed interval과 aggregation latency를 함께 보고한다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="temporal-proof"
        marker="02"
        tone="violet"
        question="시간 모델을 학습하기 전에 어떤 반례를 만들어야 할까?"
        title="Single-frame과 frame-shuffle이 temporal claim을 시험한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 baseline은 한 frame 또는 frame별 image encoder의 평균이다. 이 모델이 강하면 label이
            scene·object appearance로 풀리는지 본다. 다음은 같은 frame을 쓰되 순서를 섞는 probe다.
            Ordered clip과 shuffled clip의 차이가 작다면 temporal block이 실제 순서를 쓰지 않거나
            데이터에 순서 정보가 부족할 수 있다.
          </p>
          <p>
            반대로 reverse-order label, motion direction, speed perturbation과 temporal crop 같은
            controlled probe에서 ordered model만 일관되게 앞선다면 temporal evidence를 얻은 것이다.
            한 seed의 작은 gain이 아니라 source-video group bootstrap과 class별 slice로 차이를 본다.
          </p>
        </div>
        <TemporalEvidenceLab />
        <Misconception>
          “이미지 모델로 불가능”과 “Video Transformer가 시간을 이해”는 둘 다 실험 없이 말할 수 없다.
          Image baseline이 scene shortcut으로 높은 점수를 낼 수 있고, temporal architecture도 순서를
          무시할 수 있다. Input perturbation으로 행동을 측정해야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="model-gates"
        marker="03"
        tone="amber"
        question="3D CNN, SlowFast, TimeSformer와 VideoMAE를 어떤 순서로 써야 할까?"
        title="모델 계보를 recipe가 아니라 서로 다른 가설로 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            3D convolution은 작은 시공간 kernel로 local motion을 쌓는다. R(2+1)D 같은 분해는 spatial과
            temporal 연산을 나눠 최적화와 비용을 바꾼다. SlowFast는 낮은 frame-rate 경로가 spatial
            semantics를, channel이 가벼운 높은 frame-rate 경로가 빠른 motion을 맡는 가설이다. 특정
            파라미터 비율을 모든 task에 복사하는 방법이 아니다.
          </p>
          <p>
            TimeSformer는 frame patch에 spatial·temporal attention을 적용하고, 원 논문 안의 비교에서는
            divided attention이 후보들 중 강했다. 이것이 모든 2026 비디오 문제의 기본값이라는 뜻은
            아니다. VideoMAE는 많은 video token을 가리고 복원하는 self-supervised pretraining
            방법이다. Target과 가까운 unlabeled video가 있고 label이 적을 때 검토할 근거를 제공하지만,
            mask ratio와 benchmark gain은 그 논문의 조건 안에 있다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['2D + temporal head', 'Image representation이 강하고 짧은 순서 관계만 더하면 되는 출발점.'],
            ['3D / factorized CNN', 'Local motion과 bounded clip에 강한 inductive bias가 필요한 후보.'],
            ['SlowFast hypothesis', '느린 semantics와 빠른 motion을 서로 다른 frame-rate·capacity로 볼 이유가 있을 때 비교.'],
            ['Space-time attention', '긴 범위 interaction이 필요하고 token 비용을 감당할 수 있을 때 후보.'],
            ['Masked video pretraining', 'Target과 가까운 unlabeled video로 representation을 먼저 배울 가치가 있을 때 후보.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <StopRule>
          Ordered model이 single-frame·shuffle baseline을 안정적으로 넘지 못하면 더 큰 video backbone을
          올리지 않는다. Sampling, target horizon, label alignment와 shortcut을 먼저 고친다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="Clip accuracy가 높으면 whole-video 시스템을 출시할 수 있을까?"
        title="시간 coverage와 aggregation까지 하나의 평가 단위로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Clip metric은 디버깅에 유용하지만 제품이 video 하나를 판정한다면 최종 metric도 video
            단위여야 한다. Mean, max, top-k 또는 learned aggregation을 validation에서 고르고, 같은
            source의 clip 수가 많아 metric을 지배하지 않게 한다. Event localization이면 frame/segment
            metric과 boundary tolerance를 별도로 정의한다.
          </p>
          <p>
            Release manifest에는 decode library, FPS 처리, sampling seed·timestamp, clip length·stride,
            crop, encoder, aggregation과 threshold를 넣는다. Target device에서 decode+model+aggregation
            latency, peak memory와 video당 처리량을 측정하고, source·subject·camera·duration·motion
            speed별 slice를 남긴다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Target horizon과 online/offline 요구에서 clip coverage를 설계할 수 있다.',
          'Clip을 만들기 전에 source video·subject·event 단위로 split할 수 있다.',
          'Single-frame, shuffled-frame과 ordered-clip baseline으로 temporal evidence를 검증할 수 있다.',
          '3D CNN, SlowFast, attention과 masked pretraining을 서로 다른 가설로 비교할 수 있다.',
          'Clip prediction을 whole-video metric으로 집계하면서 source별 가중치를 통제할 수 있다.',
          'Decode, timestamp, sampling과 aggregation을 포함한 release manifest를 만들 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Feichtenhofer et al. · SlowFast', href: 'https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html', note: '낮은 frame-rate Slow 경로와 가벼운 high-rate Fast 경로를 결합한 원 논문.' },
          { label: 'Bertasius et al. · TimeSformer', href: 'https://proceedings.mlr.press/v139/bertasius21a.html', note: 'Video patch의 spatial·temporal attention 설계와 원 논문 내부 divided-attention 비교.' },
          { label: 'Tong et al. · VideoMAE', href: 'https://proceedings.neurips.cc/paper_files/paper/2022/hash/416f9cb3276121c42eebb86352a4354a-Abstract-Conference.html', note: '높은 tube masking을 이용한 self-supervised video pretraining과 dataset별 실험 경계.' },
          { label: 'PyTorchVideo · Model Zoo', href: 'https://pytorchvideo.readthedocs.io/en/latest/model_zoo.html', note: 'SlowFast 등 video model의 공식 구현 입력 shape와 checkpoint 사용 지점.' },
        ]} />
      </NlpSection>
    </div>
  );
}
