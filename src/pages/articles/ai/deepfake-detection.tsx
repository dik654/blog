import {
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
import { ForensicGeneralizationLab } from './practical-cv/viz/CvEvidenceLabs';

export default function DeepfakeDetectionArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="threat-contract"
        marker="00"
        tone="blue"
        question="딥페이크 탐지기는 모든 가짜 미디어를 찾아내는 모델일까?"
        title="먼저 위협 모델과 판정 범위를 좁힌다"
      >
        <QuestionLead
          question="얼굴 교체 영상으로 학습한 detector가 새 이미지 생성 모델의 결과와 화면 녹화된 영상까지 잡을 수 있을까?"
          answer="보장할 수 없다. 조작 방식, 생성기, 원본 영상, codec, crop과 유통 과정이 바뀌면 학습한 흔적이 사라지거나 반대로 진짜 영상에 생길 수 있다. 'real/fake' 두 글자보다 어떤 이동을 시험했는지가 핵심이다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글의 중심은 <strong>얼굴이 포함된 조작 영상</strong>의 탐지다. Face swap,
            reenactment, lip-sync, fully synthetic face와 일반 AI 생성 이미지는 서로 다른 생성 과정과
            흔적을 가진다. 하나의 binary label로 합치더라도 method family를 metadata에서 지우지 않는다.
          </p>
          <p>
            Input이 video라면 <InternalLink slug="video-understanding">시간 표본화와 source-video
            split</InternalLink>이 먼저 필요하고, frame crop classifier는
            <InternalLink slug="image-classification-pipeline">이미지 evidence contract</InternalLink>를
            따른다. 탐지 score는 진실 판정 그 자체가 아니라, 정의한 threat model 안에서 추가 검토를
            요청하는 한 evidence channel이다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Pristine source', meaning: '조작이 만들어진 원본 real image 또는 video', why: '같은 원본의 real·fake가 split을 넘는 가장 위험한 lineage 누수를 막는다.' },
          { term: 'Manipulation family', meaning: 'Face swap, reenactment, lip-sync, full synthesis처럼 생성 과정이 다른 범주', why: '보지 못한 조작으로 일반화했는지 평가 축이 된다.' },
          { term: 'Distribution shift', meaning: 'Generator, codec, 해상도, capture device, 인물과 유통 과정의 변화', why: 'In-domain 점수와 현장 성능의 간극을 구조화한다.' },
          { term: 'Provenance', meaning: '미디어가 어디서 생기고 어떤 편집을 거쳤는지 서명된 기록', why: '픽셀 흔적을 추정하는 detector와 다른 종류의 증거다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="lineage-split"
        marker="01"
        tone="teal"
        question="Frame을 무작위로 나누면 왜 거의 반드시 누수가 생길까?"
        title="Identity보다 더 강한 pristine-source lineage로 split한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            하나의 원본 video에서 수백 frame과 여러 fake version이 나온다. Frame 단위 split은 같은
            배경·인물·camera noise·compression을 양쪽에 놓는다. Identity split도 같은 pristine source의
            다른 manipulation을 나눌 수 있으므로 충분하지 않을 수 있다. 가장 바깥 group은 원본
            lineage, capture session 또는 production unit이어야 한다.
          </p>
          <p>
            Dataset manifest에는 asset id, pristine-source id, identity, manipulation family,
            generator·version, codec·bitrate, resolution, crop·resize, post-processing, capture와
            license를 둔다. FaceForensics++는 원 논문 기준 네 조작법을 포함한다. 다른 확장 데이터를
            섞었다면 원본 benchmark의 구성처럼 쓰지 않고 별도 source로 기록한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
E_{\mathrm{in}}
&=\underbrace{\operatorname{Metric}\!\left(f_{\theta(\mathcal A)};\mathcal D_s\right)}_{s\in\mathcal A:\ \text{학습에서 본 domain}}\\
E_{\mathrm{open}}
&=\underbrace{\operatorname{Metric}\!\left(f_{\theta(\mathcal A)};\mathcal D_u\right)}_{u\notin\mathcal A:\ \text{학습에서 감춘 domain}}\\
\Delta_{\mathrm{open}}
&=\underbrace{E_{\mathrm{in}}-E_{\mathrm{open}}}_{\text{open-domain 일반화 간극}}
\end{aligned}`}
          meaning="한 숫자 대신 generator·codec·capture 축을 감춘 평가 행렬을 만든다. Open-domain gap이 크면 같은 dataset 안의 높은 점수는 artifact memorization일 수 있다."
          symbols={[
            [String.raw`\mathcal A`, '학습에 포함한 generator·codec·capture domain 집합'],
            [String.raw`\mathcal D_s,\mathcal D_u`, '학습에서 본 domain s와 완전히 감춘 domain u의 평가 데이터'],
            [String.raw`\theta(\mathcal A)`, 'domain 집합 A만 사용해 학습한 detector parameter'],
            [String.raw`\Delta_{\mathrm{open}}`, '본 조건과 보지 못한 조건 사이의 일반화 간극'],
          ]}
        />
        <ForensicGeneralizationLab />
      </NlpSection>

      <NlpSection
        id="input-evidence"
        marker="02"
        tone="violet"
        question="얼굴을 잘 crop하면 탐지 문제도 자동으로 쉬워질까?"
        title="Detection, alignment와 sampling도 검증해야 할 모델이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Face detector 선택은 leaderboard 순위가 아니라 target 조건의 recall·false crop·latency로
            결정한다. Profile, occlusion, 작은 얼굴, motion blur와 압축 slice에서 missed face를
            측정한다. 너무 타이트한 crop은 경계 artifact를 지우고, 너무 넓은 crop은 배경·자막·codec
            shortcut을 키운다. 고정 “1.3배 margin”은 출발 후보조차 데이터 정의 없이는 의미가 없다.
          </p>
          <p>
            Multi-face video에서는 어느 track이 조작 대상인지 모를 수 있다. Frame별 독립 crop보다
            face tracking과 track-level aggregation이 prediction unit을 명확히 한다. Frame 수 역시
            16·32라는 보편값이 없다. 짧은 artifact와 긴 identity inconsistency를 각각 덮는 sampling을
            <InternalLink slug="video-understanding">temporal probe</InternalLink>로 검증한다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Detector recall', 'Profile·occlusion·작은 얼굴·압축별 missed-face rate를 별도 보고한다.'],
            ['Crop policy', 'Tight·context crop을 비교해 얼굴 내부와 경계·배경 shortcut을 분리한다.'],
            ['Track identity', '같은 얼굴 track의 frame만 묶고, 여러 얼굴 score를 video로 모으는 규칙을 정한다.'],
            ['Failure handling', '얼굴 미검출을 real로 간주하지 않는다. Abstain 또는 별도 full-frame path를 둔다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="evidence-families"
        marker="03"
        tone="amber"
        question="RGB, 주파수와 시간 특징 중 무엇이 진짜 조작 원인을 보는가?"
        title="각 특징을 생성기 fingerprint가 될 수 있는 가설로 다룬다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            RGB spatial model은 blending boundary, 피부 texture와 local inconsistency를 잡을 수 있지만
            인물·배경·dataset pipeline도 외울 수 있다. FFT·DCT 같은 frequency representation은 일부
            생성·upsampling·compression 흔적을 드러내지만 재인코딩과 새 generator에서 약해질 수 있다.
            “RGB+FFT면 AUROC가 몇 점 오른다”는 특정 실험 결과이지 일반 법칙이 아니다.
          </p>
          <p>
            Temporal model은 flicker, landmark trajectory, lip-motion mismatch 같은 시간 증거를
            후보로 삼지만, frame shuffle 뒤에도 점수가 같다면 실제 시간을 쓰지 않은 것이다. Large
            pretrained vision-language feature의 linear probe나 nearest neighbor는 unseen generator
            일반화의 유용한 baseline이 될 수 있지만, 전용 detector와 언제나 같은 in-domain 성능을
            낸다는 뜻은 아니다.
          </p>
        </div>
        <Misconception>
          EfficientNet-B4, Xception, CLIP 또는 frequency branch 가운데 보편적인 우승 모델은 없다.
          Backbone보다 source lineage와 evaluation protocol이 결과를 더 크게 바꿀 수 있다. 모든
          후보는 같은 crop, split, update budget과 open-domain matrix에서 비교한다.
        </Misconception>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Spatial hypothesis', '얼굴 내부·경계·context crop을 나눠 shortcut 위치를 확인한다.'],
            ['Frequency hypothesis', 'JPEG quality·resize·screen recording을 바꿔 feature가 유지되는지 본다.'],
            ['Temporal hypothesis', 'Ordered, shuffled, reversed clip과 single-frame baseline을 비교한다.'],
            ['Pretrained feature', 'Frozen nearest-neighbor·linear probe를 강한 generalization baseline으로 둔다.'],
            ['Fusion', '각 branch의 leave-one-domain-out 오류가 상보적일 때만 결합한다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="benchmark-matrix"
        marker="04"
        tone="violet"
        question="여러 공개 dataset을 합치면 자동으로 일반화가 좋아질까?"
        title="Dataset 이름보다 생성·수집·압축 과정의 차이를 보존한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            FaceForensics++는 네 조작법과 compression 조건을 가진 표준화 benchmark이고, Celeb-DF는
            더 높은 품질의 celebrity face-swap video를 제안했다. DFDC Preview와 Full은 규모와 구성이
            다르므로 같은 dataset처럼 숫자를 섞지 않는다. DeepfakeBench가 강조하듯 preprocessing,
            metric과 protocol이 다르면 detector 이름만으로 공정 비교할 수 없다.
          </p>
          <p>
            Dataset을 합칠 때 real source의 차이도 본다. Fake는 여러 dataset인데 real은 한 camera
            pipeline이면 모델이 “어느 dataset에서 왔는가”를 분류할 수 있다. Source-balanced sampling,
            동일 post-processing, leave-one-dataset/generator-out과 cross-dataset evaluation을
            별도로 남긴다. 외부 데이터는 license와 consent 경계도 release evidence다.
          </p>
        </div>
        <StopRule>
          In-domain random split 하나만 높은 detector는 출시하지 않는다. 최소한 pristine-source
          holdout과 generator·codec·capture 중 실제 배포에서 바뀌는 축 하나를 완전히 감춘 평가를
          통과해야 한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="decision-system"
        marker="05"
        tone="green"
        question="Detector score를 어떻게 실제 신뢰 판단으로 바꿀까?"
        title="탐지, 출처 증명과 사람 검토를 서로 다른 증거로 결합한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pixel detector는 “이 training distribution에서 fake와 닮았는가”를 추정한다. Watermark는
            특정 생성 과정이 남긴 표지를 찾고, C2PA Content Credentials는 서명된 provenance를 검증한다.
            Credential이 없다고 fake인 것도 아니며, credential이 있다고 내용의 모든 주장이 진실인 것도
            아니다. 서로 답하는 질문이 다르다.
          </p>
          <p>
            Production에서는 detector version과 threshold, 입력 hash, crop·track evidence, provenance
            verification, uncertainty와 reason code를 audit log로 남긴다. 고위험 판정은 자동 삭제보다
            abstain과 사람 검토로 보낸다. False positive 비용, demographic·quality slice, adversarial
            adaptation과 시간에 따른 generator drift를 정기적으로 재평가한다.
          </p>
        </div>
        <CapabilityCheck items={[
          '얼굴 조작 영상과 일반 AI 생성 미디어의 threat model을 분리할 수 있다.',
          'Frame이 아니라 pristine source·identity·capture lineage로 split할 수 있다.',
          'Generator, codec, resolution, capture와 post-processing을 감춘 평가 행렬을 만들 수 있다.',
          'Face detector·crop·tracking·sampling 실패를 classifier 실패와 분리해 측정할 수 있다.',
          'Spatial·frequency·temporal·pretrained feature를 open-domain ablation으로 비교할 수 있다.',
          'Detector, watermark, signed provenance와 사람 검토가 답하는 질문의 차이를 설명할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Rössler et al. · FaceForensics++', href: 'https://openaccess.thecvf.com/content_ICCV_2019/html/Rossler_FaceForensics_Learning_to_Detect_Manipulated_Facial_Images_ICCV_2019_paper.html', note: 'DeepFakes, Face2Face, FaceSwap, NeuralTextures 네 조작법과 compression을 포함한 원 benchmark.' },
          { label: 'Li et al. · Celeb-DF', href: 'https://openaccess.thecvf.com/content_CVPR_2020/html/Li_Celeb-DF_A_Large-Scale_Challenging_Dataset_for_DeepFake_Forensics_CVPR_2020_paper.html', note: '높은 품질 face-swap video에서 기존 detector의 난도를 재평가한 dataset 논문.' },
          { label: 'Dolhansky et al. · DFDC', href: 'https://arxiv.org/abs/2006.07397', note: 'DFDC Full dataset의 수집·규모·다양성과 challenge 평가 배경. Preview dataset과 구분한다.' },
          { label: 'Yan et al. · DeepfakeBench', href: 'https://proceedings.neurips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html', note: '통일된 preprocessing·metric·protocol 없이 detector를 비교할 때 생기는 문제와 표준 benchmark.' },
          { label: 'Ojha et al. · UniversalFakeDetect', href: 'https://openaccess.thecvf.com/content/CVPR2023/html/Ojha_Towards_Universal_Fake_Image_Detectors_That_Generalize_Across_Generative_Models_CVPR_2023_paper.html', note: '보지 못한 generative model로의 일반화와 pretrained feature 기반 단순 baseline의 근거. 일반 이미지 탐지 범위다.' },
          { label: 'NIST AI 100-4 · Synthetic content transparency', href: 'https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content', note: 'Detection, watermarking, provenance와 testing을 함께 보는 기술적 위험 관리 경계.' },
          { label: 'C2PA · Technical specification 2.2', href: 'https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html', note: 'Content Credential manifest와 provenance chain의 공식 규격. Detector score와 같은 real/fake classifier가 아니다.' },
        ]} />
      </NlpSection>
    </div>
  );
}
