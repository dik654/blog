import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">전이학습이 왜 강력한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥러닝 모델을 밑바닥부터 학습(Training from Scratch)하려면 대규모 데이터와 컴퓨팅이 필수<br />
          ImageNet 분류 모델 하나를 학습하는 데 GPU 수천 시간, 데이터 수백만 장이 필요하다<br />
          소규모 팀이나 도메인 특화 데이터(수천 장 수준)로는 현실적으로 불가능
        </p>
        <p>
          <strong>Transfer Learning</strong>(전이학습) — 대규모 데이터로 학습된 모델의 지식을 내 문제에 재활용<br />
          핵심 아이디어: 하위 레이어가 학습한 범용 피처(에지, 텍스처, 문법 구조)는 도메인이 달라도 유용하다<br />
          이 피처를 가져와 상위 레이어만 내 데이터에 맞게 조정하면 — 적은 데이터로도 높은 성능 달성
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CV와 NLP에서의 전이학습</h3>
        <p>
          <strong>Computer Vision</strong> — ImageNet 사전학습이 사실상 표준<br />
          ResNet, EfficientNet, ViT 등 backbone을 ImageNet으로 학습 → 내 데이터로 fine-tuning<br />
          하위 레이어(Conv1~2)의 에지·텍스처 검출기는 의료·위성·제조 등 어떤 도메인에서도 유효
        </p>
        <p>
          <strong>NLP</strong> — BERT/GPT 사전학습 모델이 혁명을 일으킴<br />
          수십억 토큰의 텍스트로 언어 구조를 학습한 모델 → 감성 분석, QA, 요약 등 downstream task에 fine-tuning<br />
          특히 few-shot 상황(레이블 100개 미만)에서 전이학습의 효과가 극적
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">도메인 특화 전이학습</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          일반 pretrained 모델로 부족한 경우 — 도메인 코퍼스로 <strong>Continued Pretraining</strong> 후 fine-tuning.
          BioBERT(의료), DNABERT(유전체), SatMAE(위성) 등이 대표적 사례.
          이 글에서는 동결 전략, 학습률 설계, 도메인 시프트 대응까지 실전 기법을 다룬다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          핵심 1: <strong>사전학습 모델의 하위 레이어</strong>는 범용 피처 — 도메인 무관하게 재활용 가능<br />
          핵심 2: <strong>적은 데이터로도 높은 성능</strong> — from scratch 대비 10배 이상 학습 시간 절약<br />
          핵심 3: CV(ImageNet), NLP(BERT/GPT), 도메인 특화(BioBERT) — 모든 분야에서 표준 접근법
        </p>
      </div>
    </section>
  );
}
