import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import type { ReactNode } from 'react';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { Link } from 'react-router-dom';
import { articlePath } from '@/lib/paths';
import { ArchitectureFigureStrip } from './llm-architecture-figures';
import DenseBlockDecisionLab from './llm-architecture-viz/DenseBlockDecisionLab';
import Gpt2DecoderFlowViz from './llm-architecture-viz/Gpt2DecoderFlowViz';

type DenseChapterProps = {
  order: string;
  year: string;
  title: string;
  role: string;
  facts: Array<[string, string]>;
  previous: string;
  decision: string;
  execution: string;
  why: string;
  boundary: string;
  sourceLabel: string;
  sourceHref: string;
  children?: ReactNode;
};

const sourceFigures = [
  {
    title: 'GPT-2 XL',
    src: '/llm-architecture-gallery/images/architectures/gpt-2-xl.webp',
    note: 'Learned absolute position, pre-LayerNorm, MHA, GELU FFN을 가진 최소 기준점. 숫자는 OpenAI 보고서로 다시 검산한다.',
  },
  {
    title: 'Llama 3 8B',
    src: '/llm-architecture-gallery/images/architectures/llama-3-8b.webp',
    note: 'RMSNorm, RoPE, GQA, SwiGLU가 결합된 현대 dense 기준. 구조도보다 먼저 KV head 공유 위치를 찾는다.',
  },
  {
    title: 'Qwen3 8B',
    src: '/llm-architecture-gallery/images/architectures/qwen3-8b.webp',
    note: 'Llama형 경로에 QK-Norm과 별도 output embedding을 더한 사례. tokenizer vocab과 matrix 행 수를 구분한다.',
  },
  {
    title: 'Gemma 3 27B',
    src: '/llm-architecture-gallery/images/architectures/gemma-3-27b.webp',
    note: '5 local : 1 global schedule과 1,024 sliding window를 쓰는 long-context dense 사례.',
  },
  {
    title: 'OLMo 3 7B',
    src: '/llm-architecture-gallery/images/architectures/olmo-3-7b.webp',
    note: '3 sliding : 1 full schedule, MHA, output-normalized residual branch를 공개 config와 보고서로 검산할 수 있는 사례.',
  },
];

export default function LlmArchitectureDenseTransformersArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 모델을 읽기 위한 최소 Dense 기준</h2>
        <BeginnerBridge title="같은 조립 라인을 모든 token이 끝까지 통과한다고 생각한다">
          Dense Transformer에서는 들어온 token마다 같은 attention과 FFN weight를 사용한다. 먼저 이 단순한 공통 경로를 익혀야, 뒤에서 일부 expert만 고르는 MoE나 일부 layer만 전체 문맥을 보는 구조가 무엇을 바꿨는지 한 칸씩 비교할 수 있다.
        </BeginnerBridge>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <QuestionLead
            question="새 LLM의 config를 받았을 때 모델 이름 없이도 메모리와 실행 경로를 설명할 수 있을까?"
            answer="가능하다. residual stream을 중심에 두고 norm 위치, attention의 Q/K/V(query·key·value) 폭, FFN(Feed-Forward Network, token별 특징 변환층) projection 수, position 처리, layer schedule을 순서대로 읽으면 된다. 이 글은 GPT-2에서 그 기준을 만들고 네 번의 설계 전환을 따라간다."
          />
          <p>
            <strong>Dense</strong>라는 말은 모든 token이 매 layer의 같은 attention과 FFN 경로를 지난다는 뜻이다. MoE(Mixture of Experts, 여러 expert 중 일부를 고르는 구조)처럼 token마다 다른 expert를 고르지 않는다.
            하지만 모든 dense 모델이 같은 attention 범위를 쓰거나, 모든 layer가 전체 문맥을 본다는 뜻은 아니다. Gemma 3와 OLMo 3처럼 local과 global layer를 섞을 수도 있다.
          </p>
          <p>
            먼저 공통 실행 계약을 고정한 뒤 모델을 시대순으로 읽는다. GPT-2 XL은 최소 기준점, Llama 3는 현대 표준형, Qwen3는 attention score 안정화,
            Gemma 3는 layer 역할 분리, OLMo 3는 공개된 설계를 직접 검산하는 기준점이다. 이 다섯 개 이후의 모델은 대부분 이 축을 다시 조합하거나 다른 학습 recipe를 얹는다.
          </p>
          <ConceptPrimer
            items={[
              { term: 'Residual stream', meaning: '각 layer를 지나며 정보가 누적되는 hidden vector의 주 경로다.', why: 'Norm과 sublayer가 어디에 붙는지 판단하는 기준선이다.' },
              { term: 'Projection width', meaning: 'Hidden d가 Q·K·V나 FFN 중간 폭으로 변환될 때의 matrix 크기다.', why: '모델 이름보다 block weight와 연산량을 직접 설명한다.' },
              { term: 'KV head', meaning: '생성 중 과거 token의 key/value를 저장하는 head 수다.', why: 'GQA가 줄이는 정확한 대상과 cache 비용을 연결한다.' },
              { term: 'Architecture vs recipe', meaning: 'Block 구조와 데이터·optimizer·post-training을 분리해 본다.', why: '구조만 보고 실제 모델 품질을 단정하지 않게 한다.' },
            ]}
          />
          <ArchitectureFigureStrip figures={sourceFigures} />
          <p className="text-sm text-muted-foreground">
            위 구조도는 전체 위치를 찾는 보조 지도다. 아래 숫자와 주장은 각 개발사의 보고서·공식 구현·공식 config로 다시 확인한다.
            그림이 커 보여도 모든 label을 외울 필요는 없다. 선택한 모델에서 <strong>이전 모델과 달라진 한 칸</strong>만 찾는다.
          </p>
        </div>
      </section>

      <section id="decoder-block" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공통 Decoder block을 두 번의 덧셈으로 읽기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Pre-norm dense block은 한 줄로 압축하면 residual 하나를 빠뜨리기 쉽다. 실제 실행 순서처럼 두 단계로 나누면 attention 결과도, FFN 결과도 원래 정보에 더해진다는 사실이 보인다.
          </p>
          <M display>{'\\underbrace{u_\\ell}_{\\text{문맥이 더해진 중간값}}=\\underbrace{h_\\ell}_{\\text{기존 잔차값}}+\\underbrace{\\mathrm{Attn}(\\mathrm{Norm}(h_\\ell))}_{\\text{토큰 간 정보 혼합}}'}</M>
          <FormulaNote items={[["hℓ", '이전 layer까지 누적된 정보'], ['Norm', 'attention 입력의 크기를 안정화'], ['Attn', 'causal 조건 안에서 token 사이 정보를 혼합'], ['첫 덧셈', '기존 정보에 문맥 갱신을 누적']]} />
          <M display>{'\\underbrace{h_{\\ell+1}}_{\\text{다음 층 입력}}=\\underbrace{u_\\ell}_{\\text{문맥을 포함한 잔차값}}+\\underbrace{\\mathrm{MLP}(\\mathrm{Norm}(u_\\ell))}_{\\text{현재 토큰의 특징 변환}}'}</M>
          <FormulaNote items={[["uℓ", 'attention residual까지 포함한 중간 상태'], ['MLP', '각 token 위치에서 feature를 확장·선택·압축'], ['둘째 덧셈', 'feature 변환을 residual stream에 누적']]} />
          <p>
            Attention은 <strong>어느 token에서 정보를 가져올지</strong> 정하고, FFN은 가져온 정보를 포함한 현재 vector 안에서 <strong>어떤 feature를 키우거나 줄일지</strong> 정한다.
            둘은 역할이 다르므로 하나의 중첩식으로 뭉개지 않는 편이 구현을 읽기도 쉽다.
          </p>

          <h3>GELU FFN에서 SwiGLU로</h3>
          <p>GPT-2의 FFN은 up projection과 down projection 두 개다. Llama류의 SwiGLU는 같은 입력에서 gate와 candidate를 따로 만든 뒤 원소별로 곱하므로 projection이 세 개다.</p>
          <M display>{'\\underbrace{g}_{\\text{통과 비율}}=\\underbrace{\\mathrm{SiLU}(xW_g)}_{\\text{게이트 가지}},\\qquad \\underbrace{v}_{\\text{후보 특징}}=\\underbrace{xW_u}_{\\text{확장 가지}}'}</M>
          <FormulaNote items={[["g", 'SiLU를 거쳐 feature별 통과 비율을 만든 값'], ['Wg', '게이트를 만드는 projection'], ['v', '넓은 중간 공간에서 만든 후보 feature'], ['Wu', '후보 feature를 만드는 projection']]} />
          <M display>{'\\underbrace{\\mathrm{SwiGLU}(x)}_{\\text{선택된 특징 출력}}=\\underbrace{(g\\odot v)}_{\\text{게이트와 후보 결합}}\\underbrace{W_d}_{\\text{은닉 폭으로 축소}}'}</M>
          <FormulaNote items={[["g⊙v", 'gate와 후보를 원소별로 곱해 필요한 feature를 선택'], ['Wd', '중간 폭 m을 hidden 폭 d로 되돌리는 projection'], ['출력', '다음 residual 덧셈에 들어갈 feature 갱신']]} />

          <h3>모델 이름보다 먼저 계산할 두 숫자</h3>
          <M display>{'\\underbrace{q}_{\\text{전체 Q 폭}}=\\underbrace{H_q}_{\\text{Q 헤드 수}}\\underbrace{d_h}_{\\text{헤드 폭}},\\qquad \\underbrace{k}_{\\text{전체 KV 폭}}=\\underbrace{H_{kv}}_{\\text{KV 헤드 수}}\\underbrace{d_h}_{\\text{헤드 폭}}'}</M>
          <FormulaNote items={[["Hq", 'query head의 개수'], ['Hkv', 'key/value가 실제로 저장되는 head의 개수'], ['dh', 'head 하나의 vector 폭'], ['q와 k', 'projection matrix의 출력 폭을 계산하기 위한 값']]} />
          <M display>{'\\underbrace{P_{attn}}_{\\text{어텐션 투영 가중치}}=\\underbrace{dq}_{\\text{Q 투영}}+\\underbrace{2dk}_{\\text{K,V 투영}}+\\underbrace{qd}_{\\text{출력 투영}}'}</M>
          <FormulaNote items={[["d", 'residual stream의 hidden 폭'], ['dq', 'hidden에서 전체 query 폭으로 가는 matrix'], ['2dk', 'key와 value projection 두 개'], ['qd', 'attention 출력을 hidden 폭으로 되돌리는 projection']]} />
          <M display>{'\\underbrace{P_{ffn}}_{\\text{FFN 투영 가중치}}=\\begin{cases}\\underbrace{2dm}_{\\text{일반 FFN}} & \\text{두 투영}\\\\\\underbrace{3dm}_{\\text{게이트 FFN}} & \\text{세 투영}\\end{cases}'}</M>
          <FormulaNote items={[["m", 'FFN이 잠시 확장되는 중간 폭'], ['2dm', '일반 FFN의 up과 down matrix'], ['3dm', 'SwiGLU/GeGLU의 gate, candidate, down matrix'], ['제외 범위', 'bias·norm·embedding은 이 block 비교에서 제외']]} />
          <h3>QK-Norm은 score에서 크기 경로를 제한한다</h3>
          <M display>{'\\underbrace{\\widehat q_i}_{\\text{정규화된 Q}}=\\underbrace{\\frac{q_i}{\\sqrt{\\mathrm{mean}(q_i^2)+\\varepsilon}}}_{\\text{헤드별 Q RMS 정규화}}'}</M>
          <FormulaNote items={[["mean(q²)", 'query head 안의 성분 제곱 평균'], ['ε', '0으로 나누는 일을 막는 작은 상수'], ['q̂', 'query의 head별 RMS 크기를 맞춘 결과'], ['생략한 γq', '실제 Q RMSNorm에 남아 있는 학습 가능한 성분별 scale']]} />
          <M display>{'\\underbrace{\\widehat k_j}_{\\text{정규화된 K}}=\\underbrace{\\frac{k_j}{\\sqrt{\\mathrm{mean}(k_j^2)+\\varepsilon}}}_{\\text{헤드별 K RMS 정규화}}'}</M>
          <FormulaNote items={[["mean(k²)", 'key head 안의 성분 제곱 평균'], ['ε', 'Q와 마찬가지로 분모를 안정화'], ['k̂', 'key의 head별 RMS 크기를 맞춘 결과'], ['생략한 γk', '실제 K RMSNorm에 남아 있는 별도의 학습 scale']]} />
          <M display>{'\\underbrace{s_{ij}^{QK}}_{\\text{어텐션 logit}}=\\frac{\\underbrace{\\widehat q_i^\\top\\widehat k_j}_{\\text{RMS 정규화 뒤 방향 비교}}}{\\underbrace{\\sqrt{d_h}}_{\\text{헤드 폭 보정}}}'}</M>
          <FormulaNote items={[["q̂ᵀk̂", 'RMS 크기를 맞춘 뒤 query와 key의 정렬 정도를 계산'], ['√dh', 'head dimension이 커질 때 logit scale을 보정'], ['주의', 'L2 단위벡터의 cosine 식과 상수 scale이 같지는 않음']]} />
          <Misconception>
            GQA는 query head를 없애는 기법이 아니다. 여러 query head가 더 적은 K/V head를 공유한다. 따라서 attention의 Q와 O projection은 유지되고 K/V projection과 생성 중 KV cache가 줄어든다.
          </Misconception>
        </div>
        <DenseBlockDecisionLab />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>Norm 위치가 바뀌면 residual 식부터 다시 쓴다</h3>
          <p>
            OLMo 3처럼 sublayer 출력에 norm을 적용하는 모델은 위 pre-norm 식에 이름만 바꿔 끼우면 안 된다. Attention과 FFN이 만든 갱신을 먼저 normalize한 뒤 residual에 더한다.
          </p>
          <M display>{'\\underbrace{u_\\ell}_{\\text{attention 갱신 후}}=\\underbrace{h_\\ell}_{\\text{residual}}+\\underbrace{\\mathrm{Norm}_A(\\mathrm{Attn}(h_\\ell))}_{\\text{정규화한 sublayer 출력}}'}</M>
          <FormulaNote items={[["Attn(hℓ)", 'sublayer가 만든 문맥 갱신'], ['NormA', 'residual 전체가 아니라 attention 출력에 적용'], ['덧셈', '정규화된 갱신을 기존 stream에 누적'], ['구분', 'Norm(h+Attn(h)) 형태의 표준 post-norm과 다름']]} />
          <M display>{'\\underbrace{h_{\\ell+1}}_{\\text{다음 layer 입력}}=\\underbrace{u_\\ell}_{\\text{attention 포함 stream}}+\\underbrace{\\mathrm{Norm}_F(\\mathrm{FFN}(u_\\ell))}_{\\text{정규화한 feature 갱신}}'}</M>
          <FormulaNote items={[["FFN(uℓ)", '현재 token의 feature 변환'], ['NormF', 'FFN 출력 branch를 정규화'], ['둘째 덧셈', 'attention과 feature 갱신을 순차 누적']]} />
        </div>
      </section>

      <section id="gpt2-flow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GPT-2 XL로 한 token의 전체 경로 고정하기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            기준점은 무한정 과거로 내려가지 않는다. 이 경로에서는 2019년 GPT-2 XL에서 멈춘다. Decoder-only 생성, causal mask, pre-norm residual, attention과 FFN의 역할을 한 모델에서 모두 볼 수 있기 때문이다.
            더 오래된 RNN이나 원래 Transformer encoder-decoder는 독립 질문이 생길 때 별도 기반 글에서 읽는다.
          </p>
        </div>
        <Gpt2DecoderFlowViz />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>입력에서 다음 token 확률까지</h3>
          <p>각 위치는 token 의미와 학습된 absolute position vector의 합으로 시작한다.</p>
          <M display>{'\\underbrace{x_0[p]}_{\\text{p 위치의 초기 hidden}}=\\underbrace{E_{token}(i_p)}_{\\text{token 의미}}+\\underbrace{E_{pos}(p)}_{\\text{학습된 절대 위치}}'}</M>
          <FormulaNote items={[["ip", 'p 위치의 token id'], ['Etoken', 'token id를 hidden vector로 변환'], ['Epos', 'position p 자체를 학습한 vector'], ['합', '의미와 위치를 같은 residual stream에서 시작']]} />
          <p>
            이 hidden은 48개 block에서 앞의 두 residual 식을 반복한다. Causal mask는 학습 시 오른쪽 정답 token을 보지 못하게 해, 실제 생성 시점과 같은 정보 조건을 강제한다.
            마지막 위치의 hidden만 final LayerNorm과 vocabulary projection을 거쳐 다음 token 점수가 된다.
          </p>
          <M display>{'\\underbrace{z_t}_{\\text{vocabulary 전체 점수}}=\\underbrace{\\mathrm{LN}(h_L[t])}_{\\text{마지막 위치 표현}}\\underbrace{W_E^\\top}_{\\text{공유 output projection}}'}</M>
          <FormulaNote items={[["hL[t]", '마지막 layer, 현재 생성 위치의 hidden'], ['LN', '출력 projection 전에 크기 안정화'], ['WEᵀ', '입력 embedding weight를 전치해 vocabulary 점수로 재사용'], ['zt', '아직 확률이 아닌 logit']]} />
          <M display>{'\\underbrace{p(x_{t+1}\\mid x_{\\le t})}_{\\text{다음 token 확률}}=\\underbrace{\\mathrm{softmax}(z_t)}_{\\text{logit을 합 1인 분포로 변환}}'}</M>
          <FormulaNote items={[["x≤t", '현재까지 이미 존재하는 token들'], ['softmax', 'vocabulary 점수를 비교 가능한 확률분포로 변환'], ['다음 단계', 'greedy·temperature·top-p 같은 decoding rule이 token을 선택']]} />
          <Misconception>
            GPT-2를 기준점으로 삼는다는 말은 최신 모델이 단지 GPT-2를 크게 만든 것이라는 뜻이 아니다. 공통 residual 계약을 고정해 두고 이후 모델이 position, norm, head 공유, layer schedule을 어디서 바꿨는지 분리하려는 것이다.
          </Misconception>
        </div>
      </section>

      <section id="model-catalog" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">다섯 번의 설계 전환을 시대순으로 읽기</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
          아래 장은 사양표를 반복하지 않는다. 각 모델에서 이전 기준의 무엇을 유지했고, 한 가지 핵심 결정을 왜 바꿨으며, 실행과 메모리에 어떤 결과가 생겼는지만 이어서 읽는다.
        </p>

        <div className="divide-y divide-border border-y border-border" data-dense-core-chapters>
          <DenseChapter
            order="01"
            year="2019"
            title="GPT-2 XL · 비교를 시작할 최소 기준점"
            role="공통 실행 계약 고정"
            facts={[["48 layers", 'depth'], ['1,600', 'hidden d'], ['25 / 25', 'Q / KV heads'], ['1,024', 'trained context']]}
            previous="Decoder-only language modeling과 causal self-attention을 가져온다."
            decision="LayerNorm을 각 subblock 입력으로 옮긴 pre-norm 구조와 마지막 LayerNorm을 사용한다. Position은 학습된 절대 embedding이고 FFN은 GELU 두 projection이다."
            execution="Token마다 48개 MHA와 FFN을 모두 지난다. 한 block의 attention projection은 10.24M, FFN projection은 20.48M weight다. MHA이므로 25개 query head마다 K/V 경로가 있다."
            why="이 모델은 이후 비교에 필요한 요소가 가장 적다. RMSNorm, RoPE, GQA, gated FFN, QK-Norm, local attention이 아직 없으므로 새 기법이 해결하려는 병목을 한 번에 하나씩 볼 수 있다."
            boundary="GPT-2 보고서는 architecture와 WebText 학습 결과를 함께 다룬다. 뒤 모델의 품질 차이를 구조 변화만으로 설명하면 안 된다."
            sourceLabel="OpenAI · Language Models are Unsupervised Multitask Learners"
            sourceHref="https://cdn.openai.com/better-language-models/language-models.pdf"
          />

          <DenseChapter
            order="02"
            year="2024"
            title="Llama 3 8B · 현대 dense 표준형"
            role="학습 안정성과 서빙 효율 결합"
            facts={[["32 layers", 'depth'], ['4,096', 'hidden d'], ['32 / 8', 'Q / KV heads'], ['8,192', 'trained sequence']]}
            previous="모든 token이 attention과 FFN을 순차적으로 지나는 pre-norm dense 계약은 유지한다."
            decision="LayerNorm을 RMSNorm으로, absolute position을 RoPE로, MHA를 GQA로, GELU FFN을 SwiGLU로 바꾼다. 32개 query head가 8개 K/V head를 네 개씩 공유한다."
            execution="Q와 O 폭은 유지하면서 K/V projection과 KV cache가 같은 head dimension의 MHA 대비 1/4이 된다. SwiGLU는 projection이 하나 늘지만 gated feature selection을 얻는다."
            why="추론 효율을 위해 표현 경로 전체를 줄이지 않고 반복 저장되는 K/V만 공유한다. RMSNorm과 pre-norm은 깊은 stack의 안정성을 유지하는 단순한 기본형을 제공한다."
            boundary="Meta는 초기 Llama 3 8B를 8,192-token sequence로 학습했다고 밝혔다. RoPE는 위치를 Q/K의 회전으로 표현하지만 이 사실만으로 128K 같은 훈련 밖 길이의 품질을 보장하지 않는다."
            sourceLabel="Meta · Introducing Meta Llama 3"
            sourceHref="https://ai.meta.com/blog/meta-llama-3/"
          />

          <DenseChapter
            order="03"
            year="2025"
            title="Qwen3 8B · 방향과 크기를 분리해 score 안정화"
            role="QK-Norm과 큰 vocabulary 비용"
            facts={[["36 layers", 'depth'], ['4,096', 'hidden d'], ['32 / 8', 'Q / KV heads'], ['151,936', 'embedding rows']]}
            previous="Llama형 RoPE, RMSNorm, GQA, SwiGLU dense 경로를 거의 그대로 계승한다."
            decision="Q/K projection bias를 제거하고 Q와 K에 normalization을 추가한다. Input embedding과 output projection은 묶지 않는다."
            execution="Q vector 전체에 양의 배율이 붙어도 per-head RMSNorm 뒤에는 그 배율이 거의 남지 않는다. 반면 untied embedding은 입력과 출력 공간을 독립적으로 학습하는 대신 두 개의 큰 vocabulary matrix를 보관한다."
            why="학습 규모가 커질수록 attention logit의 크기 불안정이 softmax를 지나치게 뾰족하게 만들 수 있다. QK-Norm은 per-head RMS를 맞춰 크기 폭주 경로를 제한한다. 학습 가능한 scale γ는 여전히 남는다."
            boundary="Qwen3 보고서의 tokenizer vocabulary 151,669와 official config의 padded embedding rows 151,936은 서로 다른 수치다. 문자열 토큰 수와 GPU-friendly matrix shape를 섞지 않는다."
            sourceLabel="Qwen Team · Qwen3 Technical Report"
            sourceHref="https://arxiv.org/abs/2505.09388"
          />

          <DenseChapter
            order="04"
            year="2025"
            title="Gemma 3 27B · Layer마다 같은 거리를 볼 필요는 없다"
            role="Local/global attention 역할 분리"
            facts={[["62 layers", 'depth'], ['5 : 1', 'local / global'], ['1,024', 'local window'], ['128K', 'nominal context']]}
            previous="GQA, gated FFN, RoPE, QK-Norm을 쓰는 dense block 자체는 유지한다."
            decision="다섯 개 local sliding-window layer 뒤에 한 개 global layer를 두는 schedule을 반복한다. Local과 global RoPE base도 다르게 설정한다."
            execution="62층을 실제로 펼치면 52 local + 10 global이다. Local layer는 각 token이 가까운 1,024 token만 직접 읽고, 주기적인 global layer가 멀리 떨어진 정보를 전체 문맥에서 다시 섞는다."
            why="모든 layer가 128K 전체에 quadratic attention을 수행하는 비용을 피하면서도 전역 정보 통로를 완전히 없애지 않으려는 절충이다."
            boundary="공식 보고서는 4B 이상에서 마지막 pretraining 구간에 RoPE scaling factor 8을 적용해 128K로 확장했고, 128K를 넘으면 성능이 빠르게 저하된다고 보고한다. 명목 길이는 무한 외삽 약속이 아니다."
            sourceLabel="Google DeepMind · Gemma 3 Technical Report"
            sourceHref="https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf"
          />

          <DenseChapter
            order="05"
            year="2025"
            title="OLMo 3 7B · 공개된 구조를 식과 config로 검산"
            role="Norm 위치와 layer schedule의 경계 사례"
            facts={[["32 layers", 'depth'], ['3 : 1', 'sliding / full'], ['32 / 32', 'Q / KV heads'], ['65,536', 'config context']]}
            previous="Dense attention과 SwiGLU FFN, QK-Norm, RoPE를 유지한다."
            decision="세 개 sliding-window layer 뒤 한 개 full-attention layer를 배치하고 마지막 layer도 full로 둔다. Norm은 sublayer 입력이 아니라 출력에 적용해 residual에 더한다."
            execution="32층은 24 sliding + 8 full이 된다. 7B는 32 KV heads를 유지한 MHA라 GQA보다 cache가 크지만, norm과 schedule을 포함한 전체 training artifact가 공개되어 구현과 주장을 맞대기 좋다."
            why="긴 문맥 비용은 줄이되 정기적인 full-attention 갱신을 보장한다. Output-normalized branch는 pre-norm과 다른 안정화 선택을 비교할 수 있게 한다."
            boundary="보고서의 'Layer norm applied to Outputs'를 일반 post-norm 식 Norm(h+F(h))과 같은 말로 쓰지 않는다. Normalize한 sublayer output을 residual에 더하는 inside-residual 배치다."
            sourceLabel="AI2 · OLMo 3 Technical Report"
            sourceHref="https://arxiv.org/abs/2512.13961"
          />
        </div>

        <details className="group mt-8 border-y border-border bg-muted/[0.08]">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            기본 다섯 모델 뒤의 변형은 필요할 때 펼치기
            <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">기본 경로에서 숨김</span>
            <span className="ml-auto hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
          </summary>
          <div className="divide-y divide-border border-t border-border px-4 sm:px-6">
            <CompactBranch name="Llama 3.2 1B·3B" point="현대 dense block을 edge 규모로 줄일 때 depth, width, embedding tying이 어떻게 달라지는지 본다." />
            <CompactBranch name="OLMo 2 7B·13B" point="OLMo 3의 output-normalized residual 철학이 어디서 이어졌는지 추적할 때만 내려간다." />
            <CompactBranch name="Qwen3 0.6B·4B·32B" point="같은 QK-Norm/GQA template 안에서 depth와 width가 바뀌는 scaling 비교에 쓴다." />
            <CompactBranch name="Mistral Small 3.1 24B" point="20B대 dense 모델에서 layer 수, GQA, latency를 운영 관점으로 비교한다." />
            <CompactBranch name="Phi-4 14B" point="구조가 비슷해도 data와 post-training recipe가 모델 성능을 크게 바꿀 수 있다는 반례로 읽는다." />
          </div>
        </details>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">처음 보는 Dense 모델을 읽는 순서</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ol>
            <li><strong>Residual 식</strong>: Norm이 sublayer 입력, 출력, residual 합 뒤 중 어디에 있는지 먼저 쓴다.</li>
            <li><strong>Attention 폭</strong>: hidden d와 Q/KV head 수·head dimension으로 q와 k를 만든다.</li>
            <li><strong>FFN 폭</strong>: 중간 폭 m과 projection이 두 개인지 세 개인지 센다.</li>
            <li><strong>Position과 score</strong>: RoPE/absolute/NoPE, QK-Norm 유무를 별도 축으로 본다.</li>
            <li><strong>Layer schedule</strong>: 모든 layer가 full인지 local/global을 섞는지 실제 층수로 펼친다.</li>
            <li><strong>증거 경계</strong>: architecture, config, training context, evaluated context, post-training을 한 문장으로 합치지 않는다.</li>
          </ol>
          <CapabilityCheck
            items={[
              '두 residual 덧셈을 빠뜨리지 않고 pre-norm block을 다시 쓸 수 있다.',
              'MHA와 GQA에서 줄어드는 projection과 유지되는 projection을 구분한다.',
              'GELU FFN과 gated FFN의 projection weight를 config에서 계산한다.',
              'Q vector의 크기를 바꿨을 때 raw score와 QK RMS-normalized score의 차이를 예측한다.',
              '5:1 또는 3:1 layer schedule을 실제 local/global 층수로 펼친다.',
              '128K 지원 문구에서 nominal length와 실제 retrieval 품질을 분리한다.',
            ]}
          />
          <p>
            다음에는 <Link to={articlePath('ai', 'llm-architecture-kv-long-context')}>KV Cache와 Long Context</Link>에서 이 block 계약을 유지한 채,
            batch·context·dtype까지 넣어 실제 cache 크기를 계산하고 GQA, MLA, sliding window가 무엇을 줄이는지 더 깊게 본다.
          </p>
          <SourceNotes
            sources={[
              { label: 'OpenAI · GPT-2 report', href: 'https://cdn.openai.com/better-language-models/language-models.pdf', note: '48-layer GPT-2 XL, context 1,024, pre-LayerNorm과 final LayerNorm의 기준.' },
              { label: 'Meta · Llama 3 release', href: 'https://ai.meta.com/blog/meta-llama-3/', note: '128K tokenizer, 8,192 training sequence, 8B·70B의 GQA 채택 근거.' },
              { label: 'Meta · Llama 3 reference code', href: 'https://github.com/meta-llama/llama3/blob/main/llama/model.py', note: 'RMSNorm, RoPE, repeat_kv, SwiGLU의 실제 실행 순서.' },
              { label: 'Qwen Team · Qwen3 report', href: 'https://arxiv.org/abs/2505.09388', note: 'GQA, SwiGLU, RoPE, RMSNorm, QK-Norm과 8B architecture 수치.' },
              { label: 'Qwen · Qwen3-8B config', href: 'https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json', note: 'Padded vocabulary rows, hidden/intermediate width, Q/KV head 수 검산.' },
              { label: 'Hugging Face · Qwen3 model implementation', href: 'https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen3/modeling_qwen3.py', note: 'Q/K projection 뒤 head별 RMSNorm과 학습 scale을 적용한 실제 순서.' },
              { label: 'Google DeepMind · Gemma 3 report', href: 'https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf', note: '5:1 local/global, window 1,024, 128K 확장 방식과 범위 밖 성능 경계.' },
              { label: 'Google · Gemma PyTorch config', href: 'https://github.com/google/gemma_pytorch/blob/main/gemma/config.py', note: '27B hidden/intermediate/head/layer schedule의 공식 구현 값.' },
              { label: 'AI2 · OLMo 3 report', href: 'https://arxiv.org/abs/2512.13961', note: '7B·32B architecture, norm 위치, 3:1 sliding/full schedule.' },
              { label: 'AI2 · OLMo 3 7B config', href: 'https://huggingface.co/allenai/Olmo-3-1025-7B/blob/main/config.json', note: '32층, MHA, intermediate width, 65,536 context 검산.' },
              { label: 'Noam Shazeer · GLU Variants Improve Transformer', href: 'https://arxiv.org/abs/2002.05202', note: 'SwiGLU를 포함한 gated FFN 식의 원 논문.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function DenseChapter({
  order,
  year,
  title,
  role,
  facts,
  previous,
  decision,
  execution,
  why,
  boundary,
  sourceLabel,
  sourceHref,
  children,
}: DenseChapterProps) {
  return (
    <article className="py-10 sm:py-12" data-dense-core-chapter>
      <header className="grid gap-5 lg:grid-cols-[8rem_minmax(0,1fr)]">
        <div>
          <div className="font-mono text-4xl font-bold tabular-nums text-blue-700 dark:text-blue-300">{order}</div>
          <div className="mt-2 text-xs font-bold text-muted-foreground">{year} · {role}</div>
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold leading-8 sm:text-2xl">{title}</h3>
          <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([value, label]) => (
              <div key={`${label}-${value}`} className="min-w-0 bg-background px-4 py-3">
                <div className="break-words text-sm font-bold tabular-nums">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-px overflow-hidden border-y border-border bg-border lg:grid-cols-2">
        <ChapterBand label="이전 기준에서 가져온 것" text={previous} tone="bg-background" />
        <ChapterBand label="이번에 바꾼 결정" text={decision} tone="bg-amber-50/60 dark:bg-amber-950/15" />
        <ChapterBand label="실행·메모리에서 보이는 결과" text={execution} tone="bg-sky-50/60 dark:bg-sky-950/15" />
        <ChapterBand label="왜 이 선택이 필요한가" text={why} tone="bg-emerald-50/50 dark:bg-emerald-950/15" />
      </div>

      {children && <div className="prose prose-neutral dark:prose-invert mt-7 max-w-none">{children}</div>}

      <div className="mt-7 grid gap-3 border-l-2 border-rose-500 bg-rose-50/45 px-4 py-3 text-sm leading-6 dark:bg-rose-950/10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-muted-foreground"><strong className="text-foreground">증거 경계.</strong> {boundary}</p>
        <a className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground" href={sourceHref} target="_blank" rel="noreferrer">
          {sourceLabel}
        </a>
      </div>
    </article>
  );
}

function ChapterBand({ label, text, tone }: { label: string; text: string; tone: string }) {
  return (
    <section className={`${tone} min-w-0 p-5 sm:p-6`}>
      <h4 className="text-xs font-bold text-muted-foreground">{label}</h4>
      <p className="mt-2 text-sm leading-7">{text}</p>
    </section>
  );
}

function CompactBranch({ name, point }: { name: string; point: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-5">
      <strong className="text-sm">{name}</strong>
      <p className="text-sm leading-6 text-muted-foreground">{point}</p>
    </div>
  );
}
