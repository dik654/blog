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
import { ViewSetLab } from './practical-cv/viz/CvEvidenceLabs';

export default function MultiviewFusionArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="view-contract"
        marker="00"
        tone="blue"
        question="여러 사진을 쌓으면 모델이 저절로 한 대상을 이해할까?"
        title="멀티뷰의 첫 문제는 fusion이 아니라 view-set 계약이다"
      >
        <QuestionLead
          question="제품 하나에 정면·측면·후면 사진이 있다. 정면 사진이 빠지거나 업로드 순서가 바뀌면 같은 예측이 나와야 할까?"
          answer="업무 계약에 따라 다르다. 순서 없는 관찰 집합이면 permutation-invariant해야 하고, 고정 카메라 배열이면 위치 identity를 보존해야 한다. 누락 뷰는 빈 이미지가 아니라 명시적 mask다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <InternalLink slug="image-classification-pipeline">단일 이미지 파이프라인</InternalLink>이
            한 image의 decode·split·metric을 닫았다면, 멀티뷰는 prediction unit을
            <strong>entity와 그 entity에 속한 관찰 집합</strong>으로 바꾼다. 같은 제품의 모든 뷰는
            반드시 같은 split에 있어야 한다. 이미지 단위 split은 정면을 train에, 후면을 validation에
            두면서 제품 고유 흔적을 누출한다.
          </p>
          <p>
            Manifest에는 entity id, view id 또는 camera id, capture session, timestamp,
            orientation·calibration, validity와 quality flag를 둔다. 모든 샘플의 뷰 수가 같다는
            가정도 데이터가 보장하는지 확인한다. Production에서 센서가 빠질 수 있다면 학습·평가에도
            같은 missingness를 명시해야 한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'View set', meaning: '같은 entity를 관찰한 여러 이미지와 각 이미지의 metadata', why: 'Prediction 단위를 파일에서 entity로 올린다.' },
          { term: 'Permutation invariance', meaning: '입력 view의 나열 순서가 바뀌어도 entity 예측은 같아야 하는 성질', why: '순서 없는 집합에 가짜 위치 의미가 생기는 것을 막는다.' },
          { term: 'Camera identity', meaning: '정면·후면 또는 sensor 1·2처럼 위치 자체가 가진 의미', why: '고정 배열에서는 순서를 버리는 대신 위치 embedding을 보존한다.' },
          { term: 'Validity mask', meaning: '실제로 관측된 view와 padding·센서 실패를 구분하는 표지', why: '빈 tensor가 정상 관찰처럼 pooling되거나 attention되는 것을 막는다.' },
        ]} />
        <ViewSetLab />
      </NlpSection>

      <NlpSection
        id="set-baseline"
        marker="01"
        tone="teal"
        question="가장 먼저 어떤 모델로 멀티뷰의 이득을 증명할까?"
        title="Single-view 다음에 shared encoder와 masked pooling을 둔다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 가장 좋은 한 뷰만 쓰는 baseline과 각 뷰를 독립적으로 예측해 평균하는 baseline을
            만든다. 그 다음 같은 encoder가 각 view feature를 만들고, 유효 view만 mean 또는 max로
            모은다. 이 단계가 strong baseline이다. 뷰 사이 복잡한 상호작용 없이도 가려진 정보를
            보완할 수 있기 때문이다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
h_v&=\underbrace{\phi_\theta(x_v,c_v)}_{\text{view와 선택적 camera 정보를 encoding}}\\
\bar h&=\underbrace{\frac{\sum_{v=1}^{V}m_vh_v}{\sum_{v=1}^{V}m_v}}_{\text{관측된 view만 순서 없이 평균}}\\
\hat y&=\underbrace{\rho_\psi(\bar h)}_{\text{entity 하나의 예측}}
\end{aligned}`}
          meaning="Shared encoder와 masked mean은 view 수가 달라도 동작하며, 합의 index를 재배열해도 결과가 같다. 고정 camera 위치가 실제 의미를 가진다면 c_v로 그 identity를 명시하고, 배열 index 자체에 암묵적으로 camera 의미를 맡기지 않는다."
          symbols={[
            [String.raw`V`, '이 entity에 배정된 전체 view 슬롯 수다. 누락·padding 슬롯의 유효 여부는 mask가 결정한다.'],
            [String.raw`x_v`, 'v번째 view 이미지'],
            [String.raw`c_v`, '선택적인 camera·pose metadata'],
            [String.raw`m_v`, '유효 view면 1, 누락·padding이면 0인 mask'],
            [String.raw`\phi_\theta,\rho_\psi`, 'view encoder와 entity prediction head'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Single best view', '추가 camera가 정말 필요한지 판단하는 하한선이다.'],
            ['Independent vote', '각 뷰 prediction을 평균한다. Feature fusion 없이 얻는 다양성 이득을 분리한다.'],
            ['Masked mean/max', 'Shared feature를 집계한다. Variable view count와 permutation test가 가능하다.'],
            ['Per-view oracle', '각 view별 성능과 failure slice를 보고 특정 camera가 label shortcut인지 확인한다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="fusion-gates"
        marker="02"
        tone="violet"
        question="Early, late, attention 중 하나를 고르는 표가 왜 부족할까?"
        title="결합 위치는 데이터 정렬과 필요한 상호작용에서 결정한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pixel 또는 channel 수준 early fusion은 각 view가 같은 좌표계를 공유하거나 정합 transform이
            있을 때 의미가 있다. 정면과 측면처럼 좌표 대응이 없는 이미지를 channel로 붙이면 같은 pixel
            위치가 같은 공간을 뜻한다는 잘못된 inductive bias를 준다.
          </p>
          <p>
            Late fusion은 각 view가 독립 evidence를 제공하고 prediction 결합만으로 충분할 때 강하다.
            Feature pooling은 그 중간이다. 한 뷰의 단서가 다른 뷰에서 확인돼야 label이 정해지는
            <strong>conditional interaction</strong>이 residual error에 남을 때만 cross-view
            attention이나 relation module을 후보로 올린다.
          </p>
        </div>
        <Misconception>
          Concat이 언제나 정보를 가장 많이 보존하고 attention이 언제나 가장 강력한 것은 아니다.
          Concat은 view 수·순서가 고정되고 dimension이 커지며, attention은 데이터와 연산을 더 요구한다.
          Mean pooling이 목표를 충족하면 복잡한 fusion은 해결책이 아니라 불필요한 상태가 된다.
        </Misconception>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Aligned early fusion', '동일 좌표·시간·해상도를 보장하고 pixel 대응이 label에 필요한 경우에만 비교한다.'],
            ['Late score fusion', '각 view 모델이 독립적으로 강하고 view별 calibration을 관리할 수 있을 때 쓴다.'],
            ['Set pooling', '순서 없는 variable-size view set의 기본값이다. Sum·mean·max 차이는 validation으로 고른다.'],
            ['Cross-view attention', '어느 view를 볼지가 다른 view 내용에 따라 달라지는 상호작용을 residual 분석으로 확인한 뒤 쓴다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="missing-views"
        marker="03"
        tone="amber"
        question="모든 카메라가 정상일 때만 학습한 모델을 현장에 둘 수 있을까?"
        title="누락, 품질 저하와 순서 교란을 일부러 시험한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Train에서 random view dropout을 쓰면 누락 대응을 연습할 수 있지만, 실제 센서 실패 분포와
            전혀 다르면 새로운 shortcut을 만든다. “항상 후면만 빠지는 장비”라면 무작위 한 장 삭제보다
            camera별 failure scenario를 평가해야 한다. Quality score를 attention weight처럼 쓰려면
            그 score 자체가 label이나 site를 누출하지 않는지도 본다.
          </p>
          <p>
            순서 없는 계약은 inference에서 view를 여러 번 shuffle해 prediction 차이를 측정한다.
            고정 camera 계약은 위치 token을 바꾸는 negative test를 한다. 특정 view를 가렸을 때 성능이
            오르면 그 view가 noisy하거나 shortcut일 수 있고, 급락하면 single point of failure다.
          </p>
        </div>
        <StopRule>
          All-view 점수만 보고 fusion을 확정하지 않는다. Single-view, each-view-drop,
          missing-pattern, permutation 또는 camera-swap, entity/site holdout을 모두 통과할 때만
          복잡한 fusion을 유지한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="멀티뷰 모델의 release artifact는 무엇이 더 필요한가?"
        title="뷰 수가 변해도 설명 가능한 entity-level evidence를 남긴다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            보고 단위는 image가 아니라 entity다. Entity-level metric과 함께 유효 view 수, missing
            pattern, camera, site, alignment error와 quality별 slice를 낸다. Attention heatmap은
            설명처럼 보일 수 있지만 인과 증거가 아니다. View ablation으로 prediction이 실제로
            바뀌는지 함께 확인한다.
          </p>
          <p>
            Serving schema는 최대 view 수보다 <strong>view list, camera identity, validity mask,
            timestamp와 preprocessing version</strong>을 정의해야 한다. Batch에서 entity마다 view
            수가 다를 때 padding mask가 끝까지 전달되는지, view 추가 순서가 결과를 바꾸지 않는지
            contract test로 고정한다.
          </p>
        </div>
        <CapabilityCheck items={[
          '한 entity의 view들이 split을 넘지 않도록 group contract를 만들 수 있다.',
          '순서 없는 view set과 고정 camera 배열을 구분하고 mask·position 정보를 선택할 수 있다.',
          'Single-view, independent vote와 masked pooling을 attention보다 먼저 비교할 수 있다.',
          'Alignment가 없는 view를 pixel/channel 축으로 붙이는 위험을 설명할 수 있다.',
          'View dropout, permutation, camera swap과 each-view-drop ablation을 설계할 수 있다.',
          'Entity-level metric과 missing-pattern slice를 production manifest에 포함할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Zaheer et al. · Deep Sets', href: 'https://arxiv.org/abs/1703.06114', note: '순서 없는 set 입력에 대해 permutation-invariant 함수를 구성하는 기반.' },
          { label: 'Lee et al. · Set Transformer', href: 'https://proceedings.mlr.press/v97/lee19d.html', note: 'Set element 사이 상호작용을 attention으로 모델링하되 입력 순서에 의존하지 않는 구조.' },
          { label: 'Su et al. · Multi-view CNN', href: 'https://openaccess.thecvf.com/content_iccv_2015/html/Su_Multi-View_Convolutional_Neural_ICCV_2015_paper.html', note: '여러 렌더링 view의 feature를 view pooling으로 모은 고전적 multi-view recognition 사례.' },
          { label: 'scikit-learn · GroupKFold', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html', note: '같은 entity가 train과 validation에 함께 등장하지 않도록 분리하는 구현 근거.' },
        ]} />
      </NlpSection>
    </div>
  );
}
