import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-data/FormulaPair';
import { AugmentationContractLab } from './practical-data/viz/DataEvidenceLabs';

export default function DataAugmentationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증강은 효과가 아니라 의미 보존 주장이다</h2>
        <QuestionLead
          question="좌우 반전이 고양이 분류에는 도움이 되는데 OCR과 좌·우 결함 위치 판정에는 왜 정답을 망칠 수 있을까?"
          answer="Transform이 입력을 바꿀 때 task의 의미가 그대로인지, target도 함께 바뀌어야 하는지가 다르기 때문이다. 모든 augmentation은 '이 변화는 예측해야 할 의미를 보존한다'는 가설이며, 거짓이면 데이터가 늘어나는 대신 label noise가 늘어난다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="eda-workflow">데이터 감사</InternalLink>에서 production
            variation, group/time split과 clean validation이 고정됐다고 가정한다. 증강은 관측하지
            못한 현실 변화를 합리적으로 모사하거나 model이 중요하지 않은 변화에 과민한 문제를 줄이는
            개입이다. 실제 수집 data를 대신하는 만능 복제기가 아니다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Invariance', meaning: '입력이 변해도 원하는 출력은 같아야 하는 성질', why: '고양이 좌우 반전처럼 label을 그대로 둘 수 있는지 결정한다.' },
          { term: 'Equivariance', meaning: '입력 변환에 맞춰 출력도 정해진 방식으로 변해야 하는 성질', why: 'Detection box, mask와 keypoint를 image와 함께 움직여야 한다.' },
          { term: 'Label-preserving', meaning: 'Transform 뒤에도 같은 target을 사용할 수 있는 변환', why: 'Domain에서 참일 때만 학습 표본을 늘린다.' },
          { term: 'Label-mixing', meaning: '여러 입력을 섞으며 target도 같은 계수로 섞는 변환', why: 'Mixup과 CutMix를 단순 이미지 효과가 아닌 새 supervised objective로 만든다.' },
          { term: 'Clean validation', meaning: '운영 입력의 결정적 preprocessing만 적용한 주 평가 자료', why: 'Train regularization의 효과를 실제 분포에서 비교한다.' },
          { term: 'Replay', meaning: '실제로 적용된 transform과 parameter를 다시 재현하는 기록', why: '잘못된 crop·box·mask를 sample 단위로 디버깅한다.' },
        ]} />
        <AugmentationContractLab />
      </section>

      <section id="invariance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Transform마다 세 질문을 먼저 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>현실성</strong>: Production에서 정말 생기는 variation인가?</li>
            <li><strong>의미</strong>: 그 변화 뒤에도 같은 질문과 label이 유효한가?</li>
            <li><strong>강도</strong>: 어느 범위를 넘으면 object·문자·신호가 사라지는가?</li>
          </ol>
          <p>
            수평 반전은 자연물 분류에는 흔히 타당하지만 도로 방향, 해부학 좌우, 글자 순서에는
            부적절할 수 있다. 색 변화는 shape 기반 defect에는 도움이 될 수 있지만 숙성도나 피부
            병변처럼 color 자체가 signal이면 파괴적이다. Crop은 context regularization이 될 수
            있지만 object가 사라진 sample을 원래 label로 학습하면 모순이다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Densify', '수집하지 못한 plausible camera·lighting·scale 변화를 채운다.'],
            ['Stress', '일부 단서를 가려 model이 더 robust한 신호를 찾게 한다.'],
            ['Reject', 'Task 의미를 바꾸거나 production에 없는 artifact를 만들면 사용하지 않는다.'],
            ['Collect', '변환으로 모사할 수 없는 실패 slice는 실제 data를 더 수집한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <Misconception>“Horizontal flip은 기본”이나 “강한 augmentation이 항상 좋다”는 규칙은 없다. Transform family, 확률과 magnitude는 domain claim이며 clean OOF evidence로 각각 검증해야 한다.</Misconception>
      </section>

      <section id="target-sync" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Image만 바꾸지 말고 target 구조를 함께 변환한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Classification은 보통 image-level label 하나라 geometry가 단순하다. Detection은 box,
            segmentation은 mask, pose는 keypoint, OCR은 text sequence와 reading order가 있다.
            기하 transform은 모든 spatial target에 같은 parameter를 적용하고, crop 뒤 object
            visibility와 invalid box를 검사해야 한다.
          </p>
          <ul>
            <li>Box는 좌표를 변환하고 image boundary로 clip한 뒤 면적·visibility gate를 적용한다.</li>
            <li>Mask는 class ID를 흐리지 않는 interpolation을 사용하고 image와 같은 crop을 받는다.</li>
            <li>Keypoint는 화면 밖 점과 left/right semantic swap 정책을 명시한다.</li>
            <li>OCR은 text를 뒤집는다고 해결되지 않는다. 반전 문자가 production에 없다면 transform을 거부한다.</li>
          </ul>
          <p>
            Random transform 전후 sample을 매 run에서 고정 수만큼 저장하고 눈으로 확인한다. Dataset
            loader가 box·mask를 조용히 버리는 오류는 aggregate metric이 떨어진 뒤에야 드러날 수 있다.
          </p>
        </div>
        <StopRule>Transform된 image, target과 inverse/replay metadata를 한 화면에서 검사할 수 없으면 large training을 시작하지 않는다.</StopRule>
      </section>

      <section id="mixing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Mixup과 CutMix는 target까지 바꾸는 objective다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mixup은 두 입력과 one-hot target을 같은 계수로 선형 결합한다. Model은 두 endpoint
            사이에서 지나치게 복잡한 decision boundary보다 부드러운 행동을 학습하도록 압력을 받는다.
            연속값 regression은 target도 같은 계수로 섞을 수 있고, multi-label도 loss가 soft target을
            허용하면 같은 원리를 쓸 수 있다. 반면 box·mask·sequence처럼 단순 선형 결합이 의미를
            보존하지 않는 구조화 target은 task에 맞는 혼합 규칙을 별도로 유도해야 한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\lambda&\sim\operatorname{Beta}(\alpha,\alpha)\\[2pt]\widetilde x&=\underbrace{\lambda x_i}_{\text{첫 입력의 비율}}+\underbrace{(1-\lambda)x_j}_{\text{둘째 입력의 비율}}\\[2pt]\widetilde y&=\underbrace{\lambda y_i+(1-\lambda)y_j}_{\text{입력과 같은 비율로 정답도 혼합}}\end{aligned}`}
          meaning="Mixup은 image만 겹치는 효과가 아니다. 입력과 target을 같은 λ로 섞어 새로운 supervised sample을 만든다. α는 λ가 endpoint와 중앙 중 어디에 더 모일지 정한다."
          symbols={[
            [String.raw`\lambda`, '두 sample의 혼합 비율'],
            [String.raw`\alpha`, 'Beta distribution의 혼합 강도 parameter'],
            [String.raw`\widetilde x,\widetilde y`, '혼합 뒤 model 입력과 soft target'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            CutMix는 사각 patch를 다른 image에서 붙이고 보이는 면적 비율로 classification target을
            섞는다. Object detection에서는 단순 면적 비율 target이 아니라 붙인 object의 box와
            visibility를 갱신해야 한다. Mosaic도 여러 image와 target을 한 canvas에 배치하는
            detection-specific composition이다. 이름이 같아도 task별 구현 계약은 다르다.
          </p>
        </div>
      </section>

      <section id="tabular" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tabular 합성은 image transform과 다른 고위험 분기다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SMOTE는 소수 class sample과 가까운 이웃 사이를 보간한다. 이 선분이 valid data manifold
            안에 있다는 가정이 필요하다. Category, integer count, constraint, timestamp와 causal
            relation이 섞인 표에서 단순 Euclidean 보간은 존재할 수 없는 사람·설비·거래를 만들 수
            있다. Feature-wise shuffle은 joint distribution을 깨뜨린다.
          </p>
          <p>
            따라서 먼저 class weight와 strong baseline을 비교하고, sampler가 필요하면
            <InternalLink slug="imbalanced-data">희귀 사건 의사결정</InternalLink>에서 fold train
            내부에 둔다. Validation과 test는 자연 prevalence를 유지한다. Synthetic sample을 생성한
            seed, parent IDs, constraint pass rate와 nearest-real distance를 artifact로 남긴다.
          </p>
        </div>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Train은 확률적, 평가는 결정적으로 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Train pipeline은 size normalization, geometry, occlusion, photometric transform,
            tensor conversion과 normalization 순서를 명시한다. Validation의 주 경로는 resize/crop과
            normalization처럼 serving과 같은 deterministic preprocessing만 사용한다. 별도의
            corruption/stress set은 robustness 진단으로 이름을 분리해 clean score와 섞지 않는다.
          </p>
          <p>
            No-augmentation baseline을 먼저 만들고 transform family 하나씩 ablation한다. 전체 평균뿐
            아니라 class, camera, object size, 조명 slice와 calibration을 본다. Policy가 도움을
            주더라도 CPU bottleneck, replay 가능성, serving preprocessing drift를 release gate에
            포함한다.
          </p>
          <ol>
            <li>Known failure mode와 transform claim을 한 문장으로 연결한다.</li>
            <li>Transform된 image와 target sample을 visual audit한다.</li>
            <li>같은 split·model·seed budget에서 one-axis ablation을 수행한다.</li>
            <li>Clean OOF, targeted robustness set과 latency를 함께 기록한다.</li>
            <li>Policy config와 library version을 model artifact와 함께 freeze한다.</li>
          </ol>
          <p>
            증강 결과는 <InternalLink slug="experiment-tracking">실험 관리</InternalLink>와
            <InternalLink slug="cross-validation">고정 검증 경계</InternalLink>로 돌아가야
            채택할 수 있다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Transform을 invariance·equivariance·reject claim으로 분류할 수 있다.',
          'Detection box, mask, keypoint와 OCR target을 image transform과 함께 감사할 수 있다.',
          'Mixup의 input과 target이 같은 λ로 섞이는 이유를 설명할 수 있다.',
          'Train-only stochastic policy와 clean deterministic evaluation을 분리할 수 있다.',
          'Tabular synthesis를 fold 내부의 별도 고위험 intervention으로 다룰 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Transform 선택과 target synchronization API는 공식 Albumentations 문서, mixing 정의는
          원 논문에 근거한다. Audit·ablation·release 순서는 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'Albumentations · Choosing augmentations', href: 'https://albumentations.ai/docs/3-basic-usage/choosing-augmentations/', note: 'Transform을 invariance claim으로 선택하고 task별 target과 pipeline을 검증하는 공식 가이드.' },
          { label: 'Zhang et al. · mixup', href: 'https://arxiv.org/abs/1710.09412', note: '입력과 label의 convex combination으로 정의한 원 논문.' },
          { label: 'Yun et al. · CutMix', href: 'https://arxiv.org/abs/1905.04899', note: 'Patch 교체와 면적 비율 target 혼합을 제안한 원 논문.' },
          { label: 'imbalanced-learn · Common pitfalls', href: 'https://imbalanced-learn.org/stable/common_pitfalls.html', note: '전체 data resampling이 만드는 leakage와 Pipeline 경계.' },
        ]} />
      </section>
    </div>
  );
}
