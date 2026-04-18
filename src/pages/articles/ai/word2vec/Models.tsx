import M from '@/components/ui/math';
import ModelViz from './viz/ModelViz';
import ModelsDetailViz from './viz/ModelsDetailViz';

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
        <M display>{'P(\\underbrace{w_t}_{\\text{중심 단어}} \\mid \\underbrace{w_{t-c},\\, \\ldots,\\, w_{t-1},\\, w_{t+1},\\, \\ldots,\\, w_{t+c}}_{\\text{윈도우 크기 c 안의 주변 맥락 단어들}})'}</M>
        <div className="not-prose grid gap-2 mt-4 mb-4">
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#0ea5e930', background: '#0ea5e906' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#0ea5e9' }}>은닉층</span>
            <div className="flex-1 min-w-0">
              <M>{'h = \\frac{1}{2c} \\sum_{i} W[w_i]'}</M>
              <p className="text-[11px] text-foreground/50 mt-1">윈도우 안 주변 단어 벡터를 평균 — 순서 정보 무시(Bag of Words)</p>
            </div>
          </div>
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#8b5cf630', background: '#8b5cf606' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#8b5cf6' }}>출력</span>
            <div className="flex-1 min-w-0">
              <M>{'y_j = \\text{softmax}(W^{\\prime} \\cdot h)'}</M>
              <p className="text-[11px] text-foreground/50 mt-1">어휘 전체에 대한 확률 분포 — 가장 높은 확률의 단어가 예측 결과</p>
            </div>
          </div>
        </div>
        <p>
          CBOW — 작은 데이터셋에서 더 빠르고, 고빈도 단어를 더 잘 학습
        </p>

        <h3>Skip-gram</h3>
        <p>
          반대로 <strong>중심 단어로 주변 맥락 단어들을 예측</strong><br />
          하나의 입력으로 여러 개의 예측을 수행 — 학습 데이터가 더 많이 생성
        </p>
        <M display>{'P(\\underbrace{w_{t+j}}_{\\text{주변 단어}} \\mid \\underbrace{w_t}_{\\text{중심 단어}}) \\quad \\text{for } -c \\le j \\le c,\\; j \\ne 0'}</M>
        <div className="not-prose grid gap-2 mt-4 mb-4">
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#10b98130', background: '#10b98106' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#10b981' }}>은닉층</span>
            <div className="flex-1 min-w-0">
              <M>{'h = W[w_t]'}</M>
              <p className="text-[11px] text-foreground/50 mt-1">중심 단어의 임베딩 벡터를 그대로 사용 — 평균 없이 단일 벡터</p>
            </div>
          </div>
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#f59e0b30', background: '#f59e0b06' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#f59e0b' }}>출력</span>
            <div className="flex-1 min-w-0">
              <M>{'y_j = \\text{softmax}(W^{\\prime} \\cdot h)'}</M>
              <p className="text-[11px] text-foreground/50 mt-1">각 주변 단어에 대해 독립적으로 예측 — 하나의 입력에서 2c개의 학습 데이터 생성</p>
            </div>
          </div>
        </div>
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
        <M display>{'J(\\theta) = \\frac{1}{T} \\sum_{t=1}^{T} \\underbrace{\\sum_{\\substack{-c \\le j \\le c \\\\ j \\ne 0}} \\log P(w_{t+j} \\mid w_t;\\, \\theta)}_{\\text{각 중심 단어 주변의 로그 확률 합}}'}</M>
        <div className="not-prose grid gap-2 mt-4 mb-4">
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#8b5cf630', background: '#8b5cf606' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#8b5cf6' }}>softmax</span>
            <div className="flex-1 min-w-0">
              <M>{'P(w_O \\mid w_I) = \\dfrac{\\exp({v^{\\prime}_{w_O}}^\\top \\cdot v_{w_I})}{\\sum_{w=1}^{V} \\exp({v^{\\prime}_w}^\\top \\cdot v_{w_I})}'}</M>
              <p className="text-[11px] text-foreground/50 mt-1">출력 벡터와 입력 벡터의 내적을 소프트맥스로 정규화 — 어휘 전체에 대한 확률 분포</p>
            </div>
          </div>
          <div className="rounded-lg border px-4 py-3 flex items-start gap-3"
            style={{ borderColor: '#ef444430', background: '#ef444406' }}>
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-1" style={{ color: '#ef4444' }}>병목</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-foreground/50">어휘 V가 수십만 개 → 분모의 합산이 O(V)로 너무 느림 → Negative Sampling 또는 Hierarchical Softmax로 근사</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ModelViz />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3 px-1">CBOW vs Skip-gram 구조 상세 & Embedding 추출</h3>
        <ModelsDetailViz />
        <p className="prose prose-neutral dark:prose-invert max-w-none leading-7 mt-4">
          요약 1: <strong>CBOW</strong>는 context → center, <strong>Skip-gram</strong>은 center → context.<br />
          요약 2: Skip-gram이 <strong>syntactic 태스크</strong>에서 우수, CBOW는 속도 우위.<br />
          요약 3: 학습 후 <strong>W 행렬</strong>이 최종 단어 임베딩 — 행마다 하나의 단어.
        </p>
      </div>
    </section>
  );
}
