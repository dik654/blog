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
  AugmentationContractLab,
  SplitContractLab,
} from './practical-cv/viz/CvEvidenceLabs';

export default function ImageClassificationPipelineArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="prediction-contract"
        marker="00"
        tone="blue"
        question="사진 한 장의 label을 맞히면 실전 이미지 분류가 끝날까?"
        title="먼저 무엇을 예측하고 어디까지 일반화할지 한 문장으로 고정한다"
      >
        <BeginnerOpening
          title="이미지 분류는 사진 한 장을 정해진 이름 가운데 하나로 나누는 문제입니다."
          description={<>불량 종류나 동물 이름처럼 미리 정한 label별 점수를 만들고 가장 알맞은 답을 고른다. 그러나 실전 성공은 사진을 맞힌 비율만이 아니라, <strong className="text-foreground">처음 보는 대상과 촬영 환경에서도 같은 기준이 통하는가</strong>로 판단해야 한다.</>}
          familiarScene={<>같은 제품을 책상 위에서 스무 번 돌려 찍으면 사진은 스무 장이지만 새로운 제품은 하나도 늘지 않는다. 이 사진을 무작위로 나누면 학습 쪽과 시험 쪽에 같은 흠집과 배경이 들어가, 모델이 제품 종류가 아니라 그 제품의 흔적을 기억해도 높은 점수를 낼 수 있다.</>}
          steps={[
            { label: '무엇 하나를 맞힐지 정한다', detail: '한 image, crop, 제품 전체 중 어느 단위가 예측 하나를 받는지 고정한다.' },
            { label: '닮은 원인을 같은 편에 둔다', detail: '같은 제품·환자·장소에서 나온 사진이 train과 validation으로 갈라지지 않게 묶는다.' },
            { label: '새 환경을 흉내 내어 시험한다', detail: '배포에서 바뀔 제품, 카메라, 장소와 시간을 validation split에 반영한다.' },
          ]}
        />
        <QuestionLead
          question="같은 제품을 앞·옆에서 찍은 사진 20장이 있다. 파일을 무작위로 나눠 높은 점수를 얻었다면 새 제품도 잘 맞힐까?"
          answer="알 수 없다. 같은 제품의 표면·배경·촬영 흔적을 train과 validation이 함께 봤을 수 있다. 예측 단위가 이미지여도 독립 단위는 제품·환자·장소·시간일 수 있다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이미지 분류 파이프라인의 시작은 backbone이 아니다. <strong>입력 artifact</strong>,
            <strong>예측 단위</strong>, <strong>label 의미</strong>, <strong>독립 group</strong>,
            <strong>배포 시 바뀌는 축</strong>을 먼저 manifest로 만든다. 예를 들어 “공장 1·2의
            제품 사진으로 학습해 공장 3의 새 제품 불량 유형을 맞힌다”는 문장은 site와 product가
            split key여야 함을 알려 준다.
          </p>
          <p>
            이 글은 <InternalLink slug="training-pipeline">재현 가능한 학습 run</InternalLink> 위에서
            이미지 입력에만 필요한 판단을 쌓는다. 한 대상에 여러 view가 묶이면
            <InternalLink slug="multiview-fusion">멀티뷰 퓨전</InternalLink>으로, 시간 순서가
            label을 가르면 <InternalLink slug="video-understanding">비디오 이해</InternalLink>로
            이동한다. 세 문제를 하나의 거대한 모델로 섞기 전에 입력 계약부터 분리한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Prediction unit', meaning: '모델이 score 하나를 내는 단위. 이미지, crop 또는 entity가 될 수 있다.', why: 'Metric 분모와 aggregation 위치를 정한다.' },
          { term: 'Group key', meaning: '서로 닮은 원인을 공유해 같은 split에 있어야 하는 단위', why: '같은 환자·제품·원본 영상이 양쪽에 섞이는 누수를 막는다.' },
          { term: 'Target shift', meaning: '배포 때 바뀔 장소, 시간, 카메라, 사용자 또는 클래스 구성', why: 'Validation을 실제 미래와 같은 질문으로 만든다.' },
          { term: 'Shortcut', meaning: '정답 원인 대신 배경·워터마크·촬영 장치처럼 쉬운 상관관계를 쓰는 규칙', why: 'IID 점수는 높지만 현장에서 무너지는 이유를 설명한다.' },
        ]} />
        <SplitContractLab />
      </NlpSection>

      <NlpSection
        id="data-evidence"
        marker="01"
        tone="teal"
        question="EDA에서 무엇을 세어야 모델 선택보다 먼저 오류를 줄일까?"
        title="Label, group, 중복과 acquisition을 함께 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            클래스 개수만 세면 데이터의 구조를 놓친다. 클래스별로 <strong>고유 entity 수</strong>,
            entity당 이미지 수, 촬영 site·device·시간, 해상도, crop 비율과 label 출처를 함께
            교차 집계한다. 한 클래스가 특정 카메라에서만 촬영됐다면 모델은 물체 대신 카메라를
            배울 수 있다.
          </p>
          <p>
            Perceptual hash나 pretrained embedding으로 near-duplicate 후보를 찾되 자동 삭제하지
            않는다. 연속 촬영은 중복처럼 보여도 실제 변동을 담을 수 있다. 후보를 원본 lineage와
            함께 검토해 같은 group에 묶고, annotation conflict는 합의 규칙 또는 불확실 label로
            남긴다. “노이즈가 몇 퍼센트면 label smoothing” 같은 고정 처방은 진단을 대신하지 못한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\widehat R_{\mathrm{group}}
&=\underbrace{\frac{1}{|\mathcal G|}}_{\text{group 평균}}
\sum_{g\in\mathcal G}
\underbrace{\frac{1}{|I_g|}}_{\text{group 안 정규화}}
\sum_{i\in I_g}\ell(f_\theta(x_i),y_i)\\
\widehat R_{\mathrm{image}}
&=\underbrace{\frac{1}{N}}_{\text{사진 평균}}\sum_g\sum_{i\in I_g}\ell_i,
\qquad N=\sum_g|I_g|
\end{aligned}`}
          meaning="두 값이 다르면 반복 촬영이 많은 대상이 전체 점수를 지배하고 있다는 뜻이다. 배포 질문이 새 대상 성능이라면 group-level metric과 group bootstrap 신뢰구간을 함께 본다."
          symbols={[
            [String.raw`\mathcal G`, '평가 split의 독립 entity 또는 group 집합'],
            [String.raw`I_g`, 'group g에 속한 이미지 index 집합'],
            [String.raw`\ell`, '분류 loss 또는 sample-level error'],
            [String.raw`f_\theta`, '현재 이미지 분류 모델'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Label audit', 'Class별 예시를 무작위·고손실·저확신 slice로 나눠 보고, 정의가 겹치는 label은 taxonomy부터 고친다.'],
            ['Group audit', '동일 subject·product·session·source가 split을 넘는지 assertion으로 검사한다.'],
            ['Acquisition audit', 'Label과 site·camera·background의 상관을 보고, 배포에 없는 shortcut 후보를 기록한다.'],
            ['Metric audit', 'Macro 성능, per-class recall, calibration과 group-level error를 업무 비용에 맞춰 선택한다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="baseline"
        marker="02"
        tone="violet"
        question="어떤 backbone이 최고인지 고르기 전에 무엇을 반증해야 할까?"
        title="한 개의 작은 baseline으로 데이터 계약부터 시험한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 검증된 pretrained encoder 하나와 단순 head로 end-to-end 경로를 닫는다. Decode,
            deterministic validation resize, label mapping, loss, metric, checkpoint, calibration,
            inference와 export를 한 번 통과시킨다. 이 baseline은 최고 점수를 내기 위한 것이 아니라
            데이터와 평가가 연결됐는지 확인하는 기준점이다.
          </p>
          <p>
            그 다음에만 representation 후보를 같은 input resolution, update budget, augmentation,
            split과 seed 범위에서 비교한다. ConvNet과 ViT의 이름만 바꾸면서 resolution·pretraining
            corpus·optimizer까지 동시에 바꾸면 어떤 가설이 맞았는지 알 수 없다.
          </p>
        </div>
        <Misconception>
          데이터가 몇 장이면 EfficientNet, 몇 장이면 ConvNeXt, 그 이상이면 ViT라는 보편 경계는 없다.
          Pretraining과 target domain 거리, 작은 물체의 크기, latency·memory, label 수와
          augmentation이 함께 결과를 바꾼다. 모델 이름은 실험 후보이지 결론이 아니다.
        </Misconception>
        <StopRule>
          Train label을 섞어도 점수가 유지되거나, 검은 테두리·파일명·배경만 남겨도 높은 점수가 나오면
          backbone 탐색을 중단하고 shortcut과 누수를 먼저 제거한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="interventions"
        marker="03"
        tone="amber"
        question="증강, 큰 해상도, TTA와 앙상블을 언제 추가해야 할까?"
        title="실패 모드 하나에 intervention 하나만 연결한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            증강은 “많이 넣을수록 좋다”가 아니라 배포 변환을 학습에 넣는 가설이다. 회전해도 label이
            유지되는지, crop이 작은 결함을 지우는지, 색 변화가 진단 신호를 없애는지를 먼저 정한다.
            Clean validation과 shift slice를 분리해 정확도·강건성·calibration을 함께 비교한다.
          </p>
        </div>
        <AugmentationContractLab />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Resolution', '작은 증거가 resize 뒤 몇 pixel인지 확인한다. 더 큰 입력은 후보지만 decode·memory·latency 비용을 함께 측정한다.'],
            ['Class reweighting', 'Group별 label 빈도와 업무 비용을 먼저 본다. Weighted loss, sampler와 threshold를 동시에 바꾸지 않는다.'],
            ['TTA', '배포에서 가능한 label-preserving transform만 평균낸다. Validation gain이 latency·calibration 비용을 넘을 때만 유지한다.'],
            ['Pseudo-label', '별도 unlabeled pool과 teacher provenance를 기록한다. Fold validation이나 untouched test를 pseudo-label 생성에 쓰지 않는다.'],
            ['Ensemble', '모델 수가 아니라 오류 상관과 비용을 본다. 같은 오류를 내는 다섯 모델보다 상보적인 두 모델이 낫다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="Validation 최고 checkpoint를 얻은 뒤 무엇이 남아야 할까?"
        title="점수가 아니라 재현 가능한 release evidence를 낸다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 model selection을 닫은 뒤 untouched test를 한 번 평가한다. 전체 평균 옆에 class,
            site, device, image quality와 group size별 slice를 둔다. 확률을 사람이 보거나 threshold가
            업무를 움직인다면 reliability diagram, calibration error와 비용 곡선도 release artifact다.
          </p>
          <p>
            배포 bundle에는 model weight만이 아니라 class map, preprocessing graph, input schema,
            data·split·code identity, threshold, calibration, expected latency·memory와 known failure
            slice가 들어간다. Production sample의 schema·drift를 감시하고 label이 돌아오면 같은
            group contract로 재평가한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Prediction unit과 독립 group을 구분하고 실제 배포 shift에 맞는 split key를 선택할 수 있다.',
          'Class count뿐 아니라 entity, source, duplicate, acquisition과 label lineage를 audit할 수 있다.',
          'Backbone·resolution·pretraining을 한 번에 바꾸지 않고 같은 예산으로 비교할 수 있다.',
          '증강이 label-preserving인지 반례를 만들고 shift slice에서 검증할 수 있다.',
          'TTA·pseudo-label·ensemble을 보장된 gain이 아니라 비용이 있는 intervention으로 평가할 수 있다.',
          'Untouched test와 production release manifest를 model-selection loop에서 분리할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'scikit-learn · GroupKFold', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html', note: '같은 subject·group이 train과 validation에 함께 들어가지 않는 group-aware split의 공식 동작.' },
          { label: 'Geirhos et al. · Shortcut learning', href: 'https://www.nature.com/articles/s42256-020-00257-z', note: '표준 benchmark에서 통하지만 더 어려운 배포 조건으로 전이되지 않는 shortcut 규칙의 개념과 평가 권고.' },
          { label: 'Hendrycks et al. · AugMix', href: 'https://openreview.net/forum?id=S1gmrxHFvB', note: '분포 이동과 corruption robustness를 별도 benchmark로 측정한 증강 연구 사례. 모든 task에 같은 gain을 보장하지 않는다.' },
          { label: 'Guo et al. · Calibration of Modern Neural Networks', href: 'https://proceedings.mlr.press/v70/guo17a.html', note: '정확도와 별도로 confidence calibration을 측정하고 temperature scaling을 비교한 근거.' },
          { label: 'PyTorch · Transfer learning tutorial', href: 'https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html', note: 'Pretrained representation을 고정하거나 fine-tune하는 두 출발점을 구현하는 공식 예제.' },
        ]} />
      </NlpSection>
    </div>
  );
}
