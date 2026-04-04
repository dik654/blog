import CodePanel from '@/components/ui/code-panel';
import ModelViz from './viz/ModelViz';
import {
  cbowCode, cbowAnnotations,
  skipgramCode, skipgramAnnotations,
  objectiveCode, objectiveAnnotations,
} from './ModelsData';

export default function Models({ title }: { title?: string }) {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Skip-gram & CBOW'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Word2Vec — 두 가지 학습 아키텍처를 제공<br />
          둘 다 얕은 신경망(shallow neural network, 은닉층이 1개인 구조) 기반<br />
          역전파로 임베딩 행렬 <strong>W</strong>(입력)와 <strong>W'</strong>(출력)를 학습
        </p>

        <h3>CBOW (Continuous Bag of Words)</h3>
        <p>
          빈칸 추론 문제와 동일 — "I ___ pizza" → 정답 "love"<br />
          주변 맥락 단어(context)를 입력, <strong>중심 단어(target)를 예측</strong><br />
          윈도우 크기 c 안의 주변 단어 벡터를 평균 → 은닉층 → softmax로 중심 단어 예측
        </p>
        <CodePanel title="CBOW 구조" code={cbowCode} annotations={cbowAnnotations} />
        <p>
          CBOW — 작은 데이터셋에서 더 빠르고, 고빈도 단어를 더 잘 학습
        </p>

        <h3>Skip-gram</h3>
        <p>
          반대로 <strong>중심 단어로 주변 맥락 단어들을 예측</strong><br />
          하나의 입력으로 여러 개의 예측을 수행 — 학습 데이터가 더 많이 생성
        </p>
        <CodePanel title="Skip-gram 구조" code={skipgramCode} annotations={skipgramAnnotations} />
        <p>
          Skip-gram — 저빈도 단어와 대규모 데이터셋에 더 효과적<br />
          대부분의 실용적 상황에서 더 좋은 품질의 임베딩을 생성
        </p>

        <h3>은닉층에 활성화 함수가 없는 이유</h3>
        <p>
          Word2Vec의 은닉층은 sigmoid/ReLU 같은 비선형 활성화 함수를 <strong>사용하지 않음</strong><br />
          목적이 복잡한 분류가 아니라 단어 관계의 <strong>정확한 선형 표현</strong><br />
          비선형 함수가 단어 간 관계를 왜곡 → 모든 단어가 공평하게 표현되어야 함
        </p>

        <h3>목적 함수</h3>
        <p>
          두 모델 모두 로그 우도(Log-Likelihood, 데이터가 모델에 의해 관측될 확률)를 최대화<br />
          Skip-gram의 경우:
        </p>
        <CodePanel title="Skip-gram 목적 함수" code={objectiveCode} annotations={objectiveAnnotations} />
      </div>
      <div className="mt-8">
        <ModelViz />
      </div>
    </section>
  );
}
