import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import AdditiveAttnViz from './viz/AdditiveAttnViz';
import AdditiveDetailViz from './viz/AdditiveDetailViz';

export default function Additive() {
  return (
    <section id="additive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bahdanau (Additive) Attention</h2>
      <div className="not-prose mb-8"><AdditiveAttnViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bahdanau Attention(2015) — 최초의 어텐션 메커니즘<br />
          디코더 상태 s + 인코더 히든 스테이트 h를 <strong>MLP(다층 퍼셉트론, 작은 신경망)</strong>에 통과 → 정렬 점수(alignment score) 계산<br />
          "Additive" = s와 h를 <strong>더한 뒤</strong> tanh 적용하기 때문
        </p>

        <CitationBlock source="Bahdanau et al., 2015" citeKey={2} type="paper"
          href="https://arxiv.org/abs/1409.0473">
          <p className="italic">"The decoder decides which parts of the source sentence to pay
          attention to. This frees the model from having to encode the whole source sentence
          into a fixed-length vector."</p>
        </CitationBlock>

        <h3 className="text-lg font-semibold mt-6 mb-3">1. 정렬 점수 (Alignment Score)</h3>
        <M display>{'e_{ij} = \\underbrace{v^\\top}_{\\text{가중치 벡터}} \\tanh\\!\\Big( \\underbrace{W_a \\, s_{i-1}}_{\\text{디코더 상태 투영}} + \\underbrace{U_a \\, h_j}_{\\text{인코더 상태 투영}} \\Big)'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">2. 어텐션 가중치</h3>
        <M display>{'\\alpha_{ij} = \\underbrace{\\text{softmax}_j(e_{ij})}_{\\text{j번째 인코더 위치에 대한 가중치}} = \\frac{\\exp(e_{ij})}{\\displaystyle\\sum_k \\exp(e_{ik})}'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">3. 컨텍스트 벡터</h3>
        <M display>{'c_i = \\underbrace{\\sum_j \\alpha_{ij} \\cdot h_j}_{\\text{인코더 출력의 가중합}}'}</M>
        <p className="text-sm text-muted-foreground mt-1 mb-4">디코더 입력에 concat: <M>{'[y_{i-1};\\; c_i]'}</M></p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 not-prose my-6">
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-3">
            <p className="font-mono font-semibold text-sky-700 dark:text-sky-300 mb-1">v</p>
            <p className="text-sm text-muted-foreground">학습 가능한 가중치 벡터 (d_attn → 1). tanh 출력을 스칼라 점수로 축소</p>
          </div>
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-3">
            <p className="font-mono font-semibold text-sky-700 dark:text-sky-300 mb-1">W_a</p>
            <p className="text-sm text-muted-foreground">디코더 상태 투영 행렬 (d_s → d_attn). s를 정렬 공간으로 매핑</p>
          </div>
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-3">
            <p className="font-mono font-semibold text-sky-700 dark:text-sky-300 mb-1">U_a</p>
            <p className="text-sm text-muted-foreground">인코더 상태 투영 행렬 (d_h → d_attn). h를 정렬 공간으로 매핑</p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-1">s_{'{i-1}'}</p>
            <p className="text-sm text-muted-foreground">이전 시점 디코더 hidden state. 현재 번역 맥락을 담고 있음</p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-1">h_j</p>
            <p className="text-sm text-muted-foreground">j번째 인코더 hidden state. 소스 문장의 j번째 위치 정보를 포함</p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-3">
            <p className="font-mono font-semibold text-amber-700 dark:text-amber-300 mb-1">c_i</p>
            <p className="text-sm text-muted-foreground">컨텍스트 벡터. 어텐션 가중합으로 현재 디코딩에 필요한 소스 정보를 집약</p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Additive Attention 상세 동작</h3>
        <p>
          디코더 상태 s와 인코더 hidden state h를 각각 별도 행렬로 투영한 뒤 더하고, tanh 비선형성 적용 후 v 벡터와 내적하여 스칼라 점수를 얻는다.
          "Additive" 이름은 W₁s와 W₂h를 <strong>더하기</strong> 때문이다.
          Q와 K의 차원이 달라도 각각 d_attn으로 매핑하므로 적용 가능하다.
        </p>
        <M display>{'\\underbrace{e_{ij}}_{\\text{정렬 점수}} = v^\\top \\tanh(\\underbrace{W_1 s_{i-1}}_{d_s \\to d_{\\text{attn}}} + \\underbrace{W_2 h_j}_{d_h \\to d_{\\text{attn}}})'}</M>
        <M display>{'\\alpha_{ij} = \\frac{\\exp(e_{ij})}{\\sum_k \\exp(e_{ik})}, \\quad c_i = \\sum_j \\alpha_{ij} \\cdot h_j'}</M>
        <p>
          번역에서 attention 행렬은 대각선 패턴을 보이며 명시적 감독 없이 단어 정렬을 자동 학습한다.
          언어 어순 차이(예: "I want it" → "Je le veux" 역순 대응)도 포착한다.
        </p>
      </div>

      <div className="not-prose my-8"><AdditiveDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Bahdanau는 <strong>v^T·tanh(Ws + Uh)</strong>로 alignment score 계산 — MLP 방식.<br />
          요약 2: 번역 시 <strong>명시적 감독 없이</strong> 단어 정렬 자동 학습 — 해석 가능성 높음.<br />
          요약 3: 계산 비용이 높아 Luong의 multiplicative로 진화 — 효율성 개선의 출발점.
        </p>
      </div>
    </section>
  );
}
