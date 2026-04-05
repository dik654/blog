import CodePanel from '@/components/ui/code-panel';
import EmbeddingViz from './viz/EmbeddingViz';
import OneHotDenseViz from './viz/OneHotDenseViz';
import Word2VecImpactViz from './viz/Word2VecImpactViz';
import { analogyExampleCode, analogyAnnotations } from './OverviewData';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 핵심 아이디어'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Word2Vec</strong> — 2013년 Google의 Tomas Mikolov가 제안한 단어 임베딩(Word Embedding, 단어를 연속 벡터로 변환하는 기법)<br />
          텍스트 코퍼스에서 단어를 고차원 벡터 공간에 매핑하여 의미적 관계를 수치로 표현<br />
          현대 LLM 임베딩 레이어의 직접적인 선조
        </p>

        <h3>분포 가설 (Distributional Hypothesis)</h3>
        <p>
          핵심 가정: <strong>"비슷한 맥락에서 나타나는 단어는 비슷한 의미를 가진다"</strong><br />
          "고양이는 털이 부드럽다" / "강아지는 털이 부드럽다"<br />
          → 유사한 맥락을 공유하는 고양이·강아지가 벡터 공간에서 가까운 위치에 배치
        </p>

        <h3>One-Hot 인코딩의 한계</h3>
        <p>
          "I" = [1,0,0,0], "love" = [0,1,0,0] — 각 단어가 고유 벡터<br />
          <strong>문제 1</strong>: 모든 벡터가 직교 → "love"와 "like"의 유사성을 수치로 표현 불가<br />
          <strong>문제 2</strong>: 단어 수 = 벡터 차원 → 10만 단어면 10만 차원, 공간·계산 비효율
        </p>

        <h3>One-Hot vs Dense Embedding</h3>
      </div>
      <div className="not-prose my-8">
        <OneHotDenseViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>임베딩 공간의 기하학적 의미</h3>
        <p>
          학습된 벡터 공간에는 놀라운 선형 구조가 존재<br />
          아날로지(Analogy, 벡터 산술로 단어 관계를 유추하는 것) 예시:
        </p>
        <CodePanel title="벡터 공간의 선형 구조" code={analogyExampleCode} annotations={analogyAnnotations} />

        <p>
          벡터 공간이 의미적·문법적 관계를 기하학적 방향으로 인코딩<br />
          "성별" 방향, "수도-국가" 방향, "형용사 활용" 방향이 일관되게 존재
        </p>
      </div>
      <div className="mt-8">
        <EmbeddingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Word2Vec의 혁신적 기여</h3>
        <p>
          2013년 Tomas Mikolov (Google) — One-hot encoding 시대를 dense vector 시대로 전환<br />
          4가지 혁신: 분포 가설 실현 · Dense 표현 · 효율적 학습 · 선형 의미 구조
        </p>
      </div>
      <Word2VecImpactViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Word2Vec은 <strong>300차원 dense vector</strong>로 단어 의미 포착 — NLP 혁명.<br />
          요약 2: <strong>분포 가설</strong>을 신경망으로 실현 — 컨텍스트가 의미 학습.<br />
          요약 3: <strong>선형 산술</strong>로 의미 관계 표현 — king-man+woman≈queen.
        </p>
      </div>
    </section>
  );
}
