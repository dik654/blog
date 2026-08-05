import OverviewViz from './viz/OverviewViz';
import { CitationBlock } from '@/components/ui/citation';
import { ConceptPrimer, InternalLink, QuestionLead } from '@/components/learning/ArticleLearning';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대조 학습의 핵심 아이디어</h2>
      <QuestionLead
        question="Defect Retrieval에서 연마 무늬가 실제 scratch보다 더 가깝게 검색된다. 모델 크기를 키우기 전에 무엇을 바꿔야 할까?"
        answer={<>Anchor와 같은 원인의 <strong>positive</strong>, 모양은 비슷하지만 원인이 다른 <strong>hard negative</strong>를 정의해 “어떤 가까움이 필요한가”를 loss에 가르쳐야 한다. 이 글은 검색 시스템의 false neighbor가 baseline에서 닫히지 않을 때 여는 기반이다.</>}
      />
      <ConceptPrimer items={[
        { term: 'Anchor', meaning: '비교의 기준이 되는 query sample.', why: '어떤 positive와 negative를 기준으로 당길지 고정한다.' },
        { term: 'Positive', meaning: '목표 task에서 같은 의미나 같은 원인으로 가까워야 하는 sample.', why: '학습할 불변성과 neighborhood의 의미를 정의한다.' },
        { term: 'Hard negative', meaning: '겉보기에는 비슷하지만 목표 label이나 조치가 다른 sample.', why: '실제 검색을 망치는 경계를 가장 직접적으로 가르친다.' },
        { term: 'Temperature', meaning: 'Similarity 차이를 loss가 얼마나 날카롭게 볼지 조절하는 값.', why: '작을수록 가까운 경쟁 후보에 집중하지만 불안정성도 커질 수 있다.' },
      ]} />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>대조 학습(Contrastive Learning)</strong> — "비슷한 것은 가깝게, 다른 것은 멀게" 임베딩 공간을 구성하는 학습 패러다임.<br />
          분류(Classification)가 "이것은 고양이"를 직접 맞추는 학습이라면,
          대조 학습은 "이 두 이미지는 비슷하다 / 다르다"라는 <strong>쌍(pair) 관계</strong>를 학습.
        </p>

        <h3>왜 대조 학습인가</h3>
        <p>
          라벨이 부족한 현실 — ILSVRC 학습 subset만 해도 약 128만 장에 class label이 필요했다.<br />
          대조 학습은 <strong>자기지도(Self-supervised)</strong> 방식으로 라벨 없이도 강력한 표현을 학습.
          같은 이미지를 두 번 다르게 변환(augmentation)하면 자동으로 positive pair가 생성되기 때문.
        </p>
        <p>
          이 원리는 image 이외의 sequence에도 적용할 수 있지만, pair 정의가 곧 task 정의다.
          예를 들어 wild-type과 변이 sequence의 거리를 쓰려면 어떤 기능 차이가 positive·negative인지 label과 leakage-safe split으로 검증해야 한다.
          단순 cosine distance가 생물학적 영향도를 자동으로 보장하지는 않는다.
        </p>

        <h3>핵심 구성 요소</h3>
        <p>
          <strong>Anchor</strong> — 기준 샘플. 모든 비교의 출발점.<br />
          <strong>Positive</strong> — Anchor와 "같다"고 판단되는 샘플. 같은 클래스이거나 같은 이미지의 다른 augmentation.<br />
          <strong>Negative</strong> — Anchor와 "다르다"고 판단되는 샘플. 다른 클래스 또는 다른 이미지.
        </p>
        <p>
          학습 목표: 인코더 f(x)가 만든 임베딩 공간에서 Anchor-Positive 거리는 줄이고, Anchor-Negative 거리는 늘리기.
        </p>

        <h3>Self-supervised vs Supervised Contrastive</h3>
        <p>
          <strong>Self-supervised</strong> — 라벨 없이 augmentation으로 pair 생성. SimCLR, MoCo, BYOL 등.<br />
          <strong>Supervised</strong> — 라벨 정보를 활용해 같은 클래스를 모두 positive로. SupCon Loss.<br />
          Self-supervised는 label 없이 범용 표현을 만들 수 있고, supervised contrastive는 현재 label이 목표와 잘 맞을 때 여러 positive를 활용한다.
          어느 쪽이 downstream에서 나은지는 같은 encoder와 split에서 검증한다.
        </p>
        <p>
          이 글의 목표는 모든 representation learning 역사를 훑는 것이 아니다.
          <InternalLink slug="image-rag-defect-retrieval">Defect Retrieval</InternalLink>에서 관찰한 false neighbor를 pair 설계와 loss로 고치는 데 필요한 만큼만 내려간다.
        </p>
        <CitationBlock source="SimCLR · Chen et al." citeKey={1} href="https://arxiv.org/abs/2002.05709">
          <p>원 논문은 같은 image의 두 augmentation을 positive pair로 만들고, normalized representation과 temperature-scaled contrastive loss를 사용한다. 여기서는 특정 benchmark 수치보다 augmentation·projection·loss의 실행 계약을 근거로 쓴다.</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>핵심 인사이트:</strong> 대조 학습의 임베딩은 분류뿐 아니라 검색, 클러스터링, 이상 탐지, 변이 민감도 등
            거리 기반 태스크 전반에 활용 가능. "좋은 표현"을 학습하면 downstream task가 단순해진다.
          </p>
        </div>
      </div>
    </section>
  );
}
