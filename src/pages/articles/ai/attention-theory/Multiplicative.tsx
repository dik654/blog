import { CitationBlock } from '@/components/ui/citation';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import DotProductScene from './viz/DotProductScene';
import MultiplicativeDetailScene from './viz/MultiplicativeDetailScene';

export default function Multiplicative() {
  return (
    <section id="multiplicative" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Luong & Scaled Dot-Product Attention</h2>
      <div className="not-prose mb-8"><DotProductScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 단순한 비교는 두 벡터의 같은 위치끼리 곱하고 더하는 것.
          디코더 상태 <M>{'s_t'}</M>와 인코더 상태 <M>{'h_s'}</M>가 같은 차원이면 추가 가중치 없이 점수 하나가 나온다.
          이 내적(dot-product)을 모든 위치에 행렬 곱으로 한 번에 적용한 형태가 Luong attention의 출발점.
        </p>

        <CitationBlock source="Luong et al., 2015 — Effective Approaches to Attention-based NMT"
          citeKey={3} type="paper" href="https://arxiv.org/abs/1508.04025">
          <p className="italic">"We propose and compare various attention-based models:
          global attention which always attends to all source positions,
          and local attention that only looks at a subset."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Score 함수 3가지</h3>

        <p className="font-semibold text-sm text-sky-500 mb-1">1. Dot-Product</p>
        <M display>{'\\text{score}(s_t, h_s) = \\underbrace{s_t^\\top}_{\\text{디코더 상태}} \\cdot \\underbrace{h_s}_{\\text{인코더 상태}}'}</M>
        <FormulaNote
          meaning="내적은 같은 차원의 같은 위치가 서로 대응한다는 가정이 있을 때 가장 싸게 쓸 수 있는 score다. 파라미터가 없어서 빠르지만, 비교 방식을 데이터에 맞게 바꾸지는 못한다."
          symbols={[
            ['s_t', '현재 디코더 상태. 입력 중 어디를 볼지 결정하는 쪽이다.'],
            ['h_s', '소스 위치 s의 인코더 상태. s_t와 직접 비교되는 후보다.'],
          ]}
        />

        <p className="font-semibold text-sm text-emerald-500 mb-1">2. General (Bilinear)</p>
        <M display>{'\\text{score}(s_t, h_s) = s_t^\\top \\cdot \\underbrace{W_a}_{\\text{학습 가중치 행렬}} \\cdot h_s'}</M>
        <FormulaNote
          meaning="dot product가 같은 위치끼리만 직접 묶는다면, W_a는 s_t의 한 차원과 h_s의 여러 차원이 어떻게 연결될지 학습한다. W_a=I이면 다시 dot product다."
          symbols={[
            ['W_a', '차원 간 연결표. 어떤 차원 조합이 유사도에 중요한지 학습한다.'],
            ['s_t^T W_a h_s', '스칼라 점수 하나. h_s를 W_a로 바꿔 놓고 s_t와 비교한다고 볼 수 있다.'],
          ]}
        />

        <p className="font-semibold text-sm text-amber-500 mb-1">3. Scaled Dot-Product (Transformer)</p>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{\\overbrace{QK^\\top}^{\\text{유사도 행렬}}}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치}} \\cdot V'}</M>
        <FormulaNote
          meaning="행렬 곱은 모든 query-key 쌍을 병렬로 비교한다. √d_k로 나누는 이유는 차원이 커질수록 내적 값이 커져 softmax가 한 위치에 굳는 현상을 줄이기 위해서다."
          symbols={[
            ['QK^T', '모든 query와 key 쌍의 점수표. 행은 query 위치, 열은 key 위치다.'],
            ['√d_k', 'key/query 차원의 표준편차 스케일. 이 값으로 나눠 softmax 입력 폭을 맞춘다.'],
            ['V', '분포가 정해진 뒤 실제로 섞이는 정보 행렬.'],
          ]}
        />

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-sm">
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-sky-500">Dot-Product</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              추가 파라미터 없음 — 가장 빠름.<br />
              인코더·디코더 차원이 같아야 사용 가능.<br />
              소규모 모델에서 빠른 프로토타이핑에 적합.
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-emerald-500">General (Bilinear)</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              W_a 행렬이 차원 간 관계를 학습.<br />
              인코더·디코더 차원이 달라도 동작.<br />
              파라미터 d×d개 추가 — 유연하지만 비용 증가.
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-amber-500">Scaled Dot-Product</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              √d_k 스케일링으로 softmax 포화 방지.<br />
              행렬 곱 한 번 → GPU 병렬화 최적.<br />
              Transformer 이후 사실상 표준.
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">√d_k 스케일링이 필요한 이유</h3>
        <p>
          내적은 항을 더하는 연산이다.
          <M>{'d_k'}</M>개 항을 더하면 값의 폭도 <M>{'d_k'}</M>에 따라 커진다.
          <M>{'d_k=64'}</M>이면 표준편차가 약 8이 되어 softmax 입력이 쉽게 벌어지고, 분포가 거의 one-hot으로 굳는다.
          <M>{'\\sqrt{d_k}'}</M>로 나누면 점수 폭이 다시 1 근처로 돌아온다.
        </p>
        <M display>{'\\underbrace{\\text{Var}[Q \\cdot K] = d_k}_{\\text{차원이 클수록 분산 폭증}} \\quad \\Rightarrow \\quad \\underbrace{\\text{Var}\\!\\left[\\frac{Q \\cdot K}{\\sqrt{d_k}}\\right] = 1}_{\\sqrt{d_k} \\text{ 로 나눠 분산 1 로 정규화}}'}</M>
        <FormulaNote
          meaning="softmax는 입력 차이가 크면 가장 큰 값에 거의 모든 확률을 준다. 스케일링은 점수의 순서를 바꾸지 않고 폭만 줄여 학습 가능한 분포를 유지한다."
          symbols={[
            ['Var[Q·K]', '독립 성분 d_k개를 더하므로 분산이 d_k만큼 커진다.'],
            ['Q·K / √d_k', '표준편차로 나눈 값. 차원 수가 달라도 비슷한 점수 폭을 유지한다.'],
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">세 가지 score 함수 비교</h3>
        <p>
          dot-product는 가장 빠른 특수 케이스.
          general은 <M>{'W_a'}</M>를 넣어 비교 축을 학습하는 일반화.
          scaled dot-product는 같은 내적에 분산 보정을 붙인 Transformer 표준.
          Luong의 global/local attention과 input-feeding은 이 효율적인 score 계산을 디코더 흐름에 연결한다.
        </p>
        <M display>{'\\underbrace{s^\\top h}_{\\text{Dot}} \\quad \\underbrace{\\frac{s^\\top h}{\\sqrt{d_k}}}_{\\text{Scaled}} \\quad \\underbrace{s^\\top W h}_{\\text{General}} \\quad \\underbrace{v^\\top \\tanh(W[s;h])}_{\\text{Concat}}'}</M>
      </div>

      <div className="not-prose my-8"><MultiplicativeDetailScene /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: <strong>√d_k 스케일링</strong>은 dot product의 분산을 1로 정규화 — softmax 포화 방지.<br />
          요약 2: Dot-product 방식은 <strong>행렬 연산 한 번</strong>으로 완결 — Transformer의 핵심 효율성.<br />
          요약 3: Luong의 <strong>general·concat 변형</strong>이 Transformer의 multi-head로 확장됨.
        </p>
      </div>
    </section>
  );
}
