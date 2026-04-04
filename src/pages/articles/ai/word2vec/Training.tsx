import CodePanel from '@/components/ui/code-panel';
import NegSamplingViz from './viz/NegSamplingViz';
import TrainingPipelineViz from './viz/TrainingPipelineViz';
import {
  negSamplingCode, negSamplingAnnotations,
  hierarchicalSoftmaxCode, hierarchicalAnnotations,
  subsamplingCode, subsamplingAnnotations,
  cOptimizationCode, cOptimizationAnnotations,
} from './TrainingData';

export default function Training({ title }: { title?: string }) {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '학습 알고리즘'}</h2>
      <TrainingPipelineViz />
      <div className="not-prose mb-8"><NegSamplingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Softmax 분모 — 어휘 V 전체를 순회해야 하므로 O(V)<br />
          V = 100만이면 매 역전파마다 100만 번 연산 — 실용적으로 불가능<br />
          Word2Vec은 두 가지 근사법으로 해결
        </p>

        <h3>① Negative Sampling (NEG)</h3>
        <p>
          "이 단어 쌍이 실제로 맥락에서 함께 등장하는가?" — 이진 분류 문제로 변환<br />
          실제 맥락 단어 1개(positive)에 대해 k개의 노이즈 단어(negative)를 랜덤 샘플링<br />
          진짜 쌍과 가짜 쌍을 구별하도록 학습
        </p>
        <CodePanel title="Negative Sampling 목적 함수" code={negSamplingCode} annotations={negSamplingAnnotations} />
        <p>
          k는 보통 5~20 — 작은 데이터에서는 크게, 대용량 코퍼스에서는 작게 설정
        </p>

        <h3>② Hierarchical Softmax (HS)</h3>
        <p>
          어휘를 <strong>Huffman 트리</strong>(빈도 기반 이진 트리)로 구성<br />
          고빈도 단어는 루트 가까이, 저빈도 단어는 깊은 레벨에 배치<br />
          예측 시 루트에서 해당 잎까지 이진 경로를 따라가며 시그모이드 계산
        </p>
        <CodePanel title="Hierarchical Softmax" code={hierarchicalSoftmaxCode} annotations={hierarchicalAnnotations} />

        <h3>서브샘플링 (Subsampling)</h3>
        <p>
          "은, 는, 이, 가" 같은 고빈도 단어 — 의미적 기여가 낮음<br />
          빈도에 반비례하는 확률로 훈련에서 건너뜀:
        </p>
        <CodePanel title="서브샘플링 확률" code={subsamplingCode} annotations={subsamplingAnnotations} />

        <h3>Dynamic Context Window</h3>
        <p>
          고정 윈도우 대신 1 ~ max_window 사이에서 무작위로 크기 선택<br />
          중심 단어에서 멀수록 샘플링 빈도가 낮아짐 — 가까운 단어가 더 강하게 학습
        </p>

        <h3>구현 최적화 (C 코어)</h3>
        <CodePanel title="C 구현 최적화 기법" code={cOptimizationCode} annotations={cOptimizationAnnotations} />
      </div>
    </section>
  );
}
