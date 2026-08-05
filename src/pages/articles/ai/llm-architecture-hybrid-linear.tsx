import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { ArchitectureFigureStrip } from './llm-architecture-figures';
import StateMemoryLedgerLab from './llm-architecture-viz/StateMemoryLedgerLab';
import DeltaRuleMemoryLab from './llm-architecture-viz/DeltaRuleMemoryLab';
import LinearAttentionExplorer from './llm-architecture-viz/LinearAttentionExplorer';

type HybridChapterProps = {
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
    title: 'Qwen3.6 35B-A3B',
    src: '/llm-architecture-gallery/images/architectures/qwen3-6-35b-a3b.webp',
    note: '2026 current target. 40개 text layer를 펼치면 30개 Gated DeltaNet과 10개 full attention이 3:1로 반복된다.',
  },
  {
    title: 'Qwen3-Next 80B-A3B',
    src: '/llm-architecture-gallery/images/architectures/qwen3-next-80b-a3b.webp',
    note: 'Qwen 계열의 공개 hybrid 기준점. 36개 Gated DeltaNet과 12개 gated attention을 sparse MoE와 결합했다.',
  },
  {
    title: 'Kimi Linear 48B-A3B',
    src: '/llm-architecture-gallery/images/architectures/kimi-linear-48b-a3b.webp',
    note: 'KDA와 global MLA를 3:1로 섞은 공개 기준. 1M context 결과와 kernel을 함께 공개했지만 수치는 저자 환경에 묶인다.',
  },
];

export default function LlmArchitectureHybridLinearArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="KV 목록 일부를 고정 크기 state로 바꾸는 선택 심화"
        description="모든 LLM이 이 구조를 쓰는 것은 아니다. Qwen·Kimi처럼 attention layer와 state layer를 섞는 모델을 읽을 때만 열어, 과거 token별 K/V 목록을 누적 state로 압축하면 memory와 검색 능력이 어떻게 달라지는지 계산한다."
        prerequisites={[
          'Attention layer가 과거 token마다 K/V를 cache에 남긴다는 뜻을 안다.',
          'Sparse MoE의 total parameter와 token당 active parameter가 다른 비용임을 안다.',
          '이전 state와 현재 입력으로 다음 state를 만든다는 반복 관계를 문장으로 설명할 수 있다.',
        ]}
        links={[
          { slug: 'llm-architecture-kv-long-context', title: 'KV Cache와 Long Context', reason: 'State가 대체하려는 token별 기억 목록과 byte 장부를 먼저 잡는다.' },
          { slug: 'signals-systems-convolution', title: '신호와 시스템 · state와 memory', reason: '반복식에서 과거가 어떻게 하나의 상태로 남는지 막힐 때만 내려간다.' },
        ]}
      />
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 모델에서 시작해 state의 바닥까지 내려가기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <QuestionLead
            question="Qwen3.6의 3:1 hybrid는 attention과 Gated DeltaNet을 한 layer 안에서 동시에 더한다는 뜻일까?"
            answer="아니다. 공개 config의 각 layer는 linear_attention 또는 full_attention 중 하나다. 세 layer는 과거를 고정 크기 state로 압축하고, 네 번째 layer만 과거 token별 K/V를 보존해 직접 검색한다."
          />

          <div className="not-prose my-8 border-y border-border bg-muted/10 py-5">
            <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">CURRENT TARGET · QWEN3.6 + FLASHQLA · 2026-07</p>
            <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              <CurrentAxis label="Token mixer" value="30 GDN + 10 attention" note="3:1 layer cadence" />
              <CurrentAxis label="Persistent memory" value="state + KV cache" note="길이 의존성이 다름" />
              <CurrentAxis label="FFN capacity" value="35B-A3B sparse MoE" note="sequence memory와 별개" />
              <CurrentAxis label="Runtime" value="FlashQLA" note="chunked prefill·backward kernel" />
            </div>
          </div>

          <p>
            이 네 축을 한 단어로 “효율적 모델”이라고 묶으면 무엇이 빨라졌는지 알 수 없다. Gated DeltaNet은 <strong>과거 token을 저장하는 방법</strong>을 바꾸고,
            MoE는 <strong>FFN weight를 실행하는 방법</strong>을 바꾸며, FlashQLA는 <strong>같은 recurrence를 GPU에서 실행하는 방법</strong>을 바꾼다.
          </p>
          <p>
            앞 글의 <Link to={articlePath('ai', 'llm-architecture-kv-long-context')}>KV·Long Context</Link>에서는 token마다 K/V를 얼마나 남기는지 계산했다.
            <Link to={articlePath('ai', 'llm-architecture-sparse-moe')}> Sparse MoE</Link>에서는 total parameter와 token당 active expert를 나눴다. 여기서는 두 장부를 유지한 채,
            일부 token mixer가 KV 목록을 아예 고정 크기 state로 바꾸는 과정을 추적한다.
          </p>

          <ConceptPrimer
            items={[
              { term: 'KV list', meaning: 'Attention layer가 과거 token마다 key와 value를 보존한 목록이다.', why: '정확한 과거 위치를 다시 고를 수 있지만 context와 함께 커진다.' },
              { term: 'Fixed state', meaning: '과거 전체를 정해진 shape의 vector 또는 matrix에 누적한 기억이다.', why: 'Decode memory가 context 길이와 함께 늘지 않지만 정보 충돌과 손실이 생길 수 있다.' },
              { term: 'Recurrence', meaning: '이전 state와 현재 token으로 다음 state를 만드는 식이다.', why: 'Token 한 개씩 생성할 때 작은 persistent memory만 읽고 쓸 수 있다.' },
              { term: 'Outer product · 외적', meaning: '두 vector의 모든 성분 쌍을 곱해 하나의 matrix를 만드는 연산이다.', why: '이 글의 v_t k_t^T는 key 방향에 value를 쓰는 rank-1 memory update를 만든다.' },
              { term: 'Chunkwise form', meaning: '여러 recurrent update를 chunk 단위의 factor와 matrix multiplication으로 다시 표현한 실행식이다.', why: '학습과 긴 prompt prefill에서 GPU 병렬성을 회복한다.' },
            ]}
          />
          <p>
            이 글을 읽기 위해 제어공학 전체를 먼저 끝낼 필요는 없다. 다만 <M>{String.raw`h_t=A_th_{t-1}+B_tx_t`}</M>가
            “과거를 남기고 현재를 쓰는 시스템”이라는 뜻부터 막히면
            <Link to={articlePath('ai', 'signals-systems-convolution')}> 신호와 시스템의 state·memory 설명</Link>으로 내려간다.
            연속시간 dynamics를 token 간 update로 바꾸는 discretization이 막힐 때만
            <Link to={articlePath('ai', 'differential-equations-phase-plane-numerical-integration')}> 미분방정식과 수치 적분</Link>을 연다.
            두 글은 필수 역사 과목이 아니라 현재 수식을 해독하기 위한 선택형 바닥이다.
          </p>
          <ArchitectureFigureStrip figures={sourceFigures} />
          <p className="text-sm text-muted-foreground">
            구조도는 출발점이다. 아래에서는 3:1 cadence의 byte를 직접 더하고, 같은 key에 value를 두 번 썼을 때 무엇이 남는지 숫자로 확인한 뒤 원 논문의 설계 전환으로 돌아온다.
          </p>
        </div>
      </section>

      <section id="memory-ledger" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">KV 목록과 matrix state의 메모리 장부</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Attention layer는 과거 token 수 <M>{'N'}</M>만큼 K와 V를 보존한다. 반면 이 글의 교육용 state layer는 head마다
            <M>{'d_v\times d_k'}</M> matrix 하나만 보존한다. 두 값은 모두 persistent decode memory지만 증가축이 다르다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{D_{KV}}_{\text{token별 KV 폭}}
&=\underbrace{H_{kv}}_{\text{KV head 수}}\underbrace{d_h}_{\text{head 차원}}\\[6pt]
\underbrace{M_{KV}^{(1)}}_{\text{attention 한 층}}
&=\underbrace{2}_{\text{K와 V}}\underbrace{N}_{\text{과거 토큰}}D_{KV}\underbrace{b}_{\text{원소 바이트}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`D_{KV}`, 'token 하나의 key 또는 value 전체 폭'], [String.raw`N`, '현재 sequence에 남은 과거 token 수'], [String.raw`H_{kv}`, 'GQA·MQA 뒤 실제로 저장하는 KV head 수'], [String.raw`d_h`, 'KV head 하나의 차원'], [String.raw`b`, 'bf16·fp16이면 보통 2 byte'], ['2', 'key와 value 두 tensor를 모두 저장']]} />

          <M display>{String.raw`\begin{aligned}
\underbrace{D_{state}}_{\text{행렬 크기}}
&=\underbrace{d_k}_{\text{키 축}}\underbrace{d_v}_{\text{값 축}}\\[6pt]
\underbrace{M_{state}^{(1)}}_{\text{state 층}}
&=\underbrace{H}_{\text{head 수}}D_{state}\underbrace{b}_{\text{byte}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`D_{state}`, 'state head 하나가 보존하는 matrix의 원소 수'], [String.raw`H`, '서로 독립된 associative state head 수'], [String.raw`d_k`, 'state에서 key가 차지하는 축'], [String.raw`d_v`, 'state에서 value가 차지하는 축'], [String.raw`b`, 'persistent state의 원소 저장 byte'], ['빠진 N', '과거 token을 개별 보존하지 않아 context 길이가 식에 없음']]} />

          <M display>{String.raw`\underbrace{M_{hybrid}}_{\text{혼합 stack}}=\underbrace{L_sM_{state}^{(1)}}_{\text{state 층 합}}+\underbrace{L_aM_{KV}^{(1)}}_{\text{attention 층 합}}`}</M>
          <FormulaNote items={[[String.raw`L_s`, '고정 크기 state를 보존하는 layer 수'], [String.raw`L_a`, 'token별 KV cache를 보존하는 full-attention layer 수'], [String.raw`L_sM_{state}^{(1)}`, 'context가 길어져도 고정인 부분'], [String.raw`L_aM_{KV}^{(1)}`, 'context와 함께 선형 증가하는 부분']]} />

          <p>
            아래 toy는 48층에 <M>{'S,S,S,A'}</M>를 반복하고, state는 8개 <M>{'128\times128'}</M> matrix, attention은 8개 KV head를 쓴다고 고정한다.
            32K에서 state 한 층은 256 KiB지만 attention 한 층은 128 MiB다. 그래서 36개 state와 12개 attention을 모두 더해도 1,545 MiB이며,
            48개 all-attention의 6,144 MiB보다 74.85% 작다.
          </p>
        </div>
        <StateMemoryLedgerLab />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Misconception>
            “State가 고정 크기”는 전체 학습 메모리가 고정이라는 뜻이 아니다. Backpropagation을 위해 남기는 activation, convolution buffer, normalization·gate state, optimizer state와 kernel workspace는 별도다. 위 장부는 autoregressive decode에서 이어 가는 persistent memory만 비교한다.
          </Misconception>
        </div>
      </section>

      <section id="recurrence-duality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">State는 무엇을 압축하고 어떻게 다시 읽는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            “State model”은 하나의 update rule 이름이 아니다. Mamba의 selective SSM state와 DeltaNet의 associative matrix state는 둘 다 과거를 고정 shape에 담지만,
            내부 대수와 잘하는 기억이 다르다. 먼저 가장 단순한 input-dependent SSM을 한 줄로 쓴다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{h_t}_{\text{새 상태}}
&=\underbrace{A_t h_{t-1}}_{\text{남길 과거}}+\underbrace{B_t x_t}_{\text{쓸 현재}}\\[6pt]
\underbrace{y_t}_{\text{현재 출력}}
&=\underbrace{C_t^{\top}h_t}_{\text{상태 읽기}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`h_{t-1}`, '이전 token까지 압축한 SSM state'], [String.raw`A_t`, '현재 입력에 따라 과거 state를 전달·감쇠하는 transition'], [String.raw`B_t`, '현재 input을 state 좌표로 쓰는 projection'], [String.raw`C_t`, '현재 입력이 state에서 읽을 방향'], ['선택성', 'Mamba에서는 주요 SSM parameter가 input에 의존해 token별 보존·쓰기·읽기가 달라짐']]} />

          <p>
            이 recurrence를 처음부터 풀면 현재 출력은 과거 input들의 가중합이 된다. 차이는 과거 위치 <M>{'i'}</M>의 영향에
            그 뒤의 transition <M>{String.raw`A_{i+1},\ldots,A_t`}</M>가 모두 곱해진다는 점이다. 행렬은 일반적으로 교환되지 않으므로
            나중 transition이 왼쪽에 오도록 <M>{String.raw`A_tA_{t-1}\cdots A_{i+1}`}</M> 순서를 고정해야 한다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{T_{t\leftarrow i}}_{\text{i 이후 전이 누적}}
&=A_tA_{t-1}\cdots A_{i+1}\\[6pt]
\underbrace{W_{t,i}}_{\text{i에서 t로 가는 가중치}}
&=C_t^{\top}T_{t\leftarrow i}B_i\\[6pt]
\underbrace{y_t}_{\text{t의 출력}}
&=\sum_{i=1}^{t}W_{t,i}\underbrace{x_i}_{\text{과거 입력}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`i`, '기억에 기여한 과거 token 위치'], [String.raw`T_{t\leftarrow i}`, 'i 뒤에서 t까지의 transition을 시간 역순으로 적어 오른쪽의 이른 transition부터 적용한 결과'], [String.raw`i=t`, '곱할 transition이 없는 빈 곱은 identity I'], [String.raw`W_{t,i}`, '과거 input i가 현재 output t에 주는 scalar 또는 matrix weight'], ['두 관점', 'token별 recurrence로 계산할 수도 있고 causal sequence matrix의 한 cell로 펼칠 수도 있음']]} />

          <p>
            Mamba-2의 SSD는 모든 SSM과 모든 attention이 같다고 주장하지 않는다. Transition이 scalar identity 구조를 갖는 특정 SSM과 1-semiseparable mask를 갖는 structured attention이
            같은 linear operator의 recurrent form과 matrix form을 가진다는 연결이다. 이 제한 덕분에 decode에서는 recurrence를, training에서는 block matrix multiplication을 선택할 수 있다.
          </p>

          <h3>Associative matrix는 key를 넣어 value를 읽는다</h3>
          <p>
            Delta 계열은 state 자체를 작은 key→value map처럼 해석한다. 가장 단순한 linear fast weight는 현재 value와 key의 outer product를 계속 더하고, query를 넣어 누적된 value를 읽는다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{U_t}_{\text{이번 연결}}
&=\underbrace{v_tk_t^{\top}}_{\text{key에 value를 쓰는 rank-1 항}}\\[6pt]
\underbrace{S_t}_{\text{누적 기억}}
&=\underbrace{S_{t-1}}_{\text{기존 기억}}+U_t
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`S_t\in\mathbb R^{d_v\times d_k}`, 'value 축을 row, key 축을 column으로 둔 matrix state'], [String.raw`U_t=v_tk_t^{\top}`, '현재 key 방향에 value를 더하는 rank-1 write'], ['덧셈', '같은 key가 다시 와도 기존 association을 먼저 지우지 않음']]} />
          <M display>{String.raw`\underbrace{y_t}_{\text{읽은 value}}=\underbrace{S_tq_t}_{\text{query 방향 조회}}`}</M>
          <FormulaNote items={[[String.raw`q_t`, 'state에서 찾고 싶은 key와 닮은 query'], [String.raw`S_tq_t`, 'query와 맞는 key 방향의 value들을 합친 출력'], ['collision', '같은 방향에 여러 value를 더했다면 읽을 때도 그 합이 나옴']]} />

          <p>
            이 단순 더하기는 같은 key에 새 value가 오면 예전 값을 지우지 못한다. <M>{'k=(1,0)'}</M>에 먼저 <M>{'v=(1,0)'}</M>, 다음에
            <M>{'v=(0,1)'}</M>을 쓰면 다시 읽은 값은 <M>{'(1,1)'}</M>이다. “최신 값”이 아니라 두 기록의 합이다.
          </p>
        </div>
      </section>

      <section id="delta-update" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Delta rule: 쓰기 전에 현재 기억의 오차를 계산한다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            DeltaNet은 새 value를 그대로 더하지 않는다. 먼저 현재 state에 key를 넣어 예측한 value와 목표 value의 차이를 구하고, 그 오차만 같은 key 방향에 쓴다.
            이는 sequence를 따라가며 작은 linear regression weight를 한 step씩 고치는 것으로도 읽을 수 있다.
          </p>

          <M display>{String.raw`\underbrace{e_t}_{\text{현재 예측 오차}}=\underbrace{v_t}_{\text{이번 목표}}-\underbrace{S_{t-1}k_t}_{\text{기존 state의 예측}}`}</M>
          <FormulaNote items={[[String.raw`S_{t-1}k_t`, '같은 key를 기존 state에서 읽은 predicted value'], [String.raw`v_t`, '이번 key에 연결하려는 target value'], [String.raw`e_t`, '목표에서 기존 prediction을 뺀 residual error']]} />
          <M display>{String.raw`\underbrace{S_t}_{\text{교정된 state}}=\underbrace{S_{t-1}}_{\text{기존 기억}}+\underbrace{\beta_t e_tk_t^{\top}}_{\text{key 방향 오차 교정}}`}</M>
          <FormulaNote items={[[String.raw`\beta_t`, '0과 1 사이에서 교정 강도를 정하는 adaptive step'], [String.raw`e_tk_t^{\top}`, '다른 key 방향보다 현재 key 방향을 집중 수정하는 rank-1 update'], ['차이', '새 value 전체가 아니라 앞 식에서 계산한 prediction error만 기록']]} />

          <p>
            Key가 unit vector라면 결과를 다시 같은 key로 곱해 덮어쓰기 정도를 바로 확인할 수 있다. <M>{String.raw`\beta_t=1`}</M>이면 기존 prediction 항이 사라져
            새 목표 value가 정확히 남는다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{p_{old}}_{\text{기존 예측}}
&=S_{t-1}k_t\\[6pt]
\underbrace{c_{old}}_{\text{남길 이전값}}
&=(1-\beta_t)p_{old}\\[6pt]
\underbrace{c_{new}}_{\text{반영할 새값}}
&=\beta_tv_t\\[6pt]
\underbrace{S_tk_t}_{\text{같은 키 재조회}}
&=c_{old}+c_{new}\\[6pt]
\underbrace{\lVert k_t\rVert_2=1}_{\text{단위 키 조건}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`p_{old}`, '같은 key를 update 직전에 읽은 기존 prediction'], [String.raw`c_{old}`, '기존 prediction 중 1-β만큼 남길 기여량'], [String.raw`c_{new}`, '새 목표에서 β만큼 반영할 기여량'], [String.raw`\lVert k_t\rVert_2=1`, 'kᵀk=1이 되어 update 식을 단순화하는 조건'], [String.raw`\beta_t=1`, '현재 key 방향에서는 기존 value를 지우고 새 value로 정확히 교체']]} />
        </div>
        <DeltaRuleMemoryLab />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Delta update도 무한 기억은 아니다. 서로 비직교인 key는 같은 state subspace를 공유하므로 한 key의 수정이 다른 key의 read를 흔들 수 있다.
            State dimension이 고정인 한, 오래된 모든 token을 손실 없이 보존한다는 보장은 없다.
          </p>

          <h3>Gated DeltaNet은 전체 정리와 선택적 수정을 합친다</h3>
          <p>
            DeltaNet은 특정 key 방향을 고치지만 state 전체를 빠르게 비우는 별도 손잡이가 없다. Gated DeltaNet은 data-dependent scalar <M>{String.raw`\alpha_t`}</M>로
            먼저 이전 state 전체를 감쇠한 뒤, 그 감쇠된 state의 prediction error를 current key 방향에 쓴다.
          </p>

          <M display>{String.raw`\underbrace{S_t}_{\text{새 state}}=\underbrace{\alpha_tS_{t-1}}_{\text{전체 기억 감쇠}}+\underbrace{\beta_t\!\left(v_t-\alpha_tS_{t-1}k_t\right)k_t^{\top}}_{\text{현재 key 방향 교정}}`}</M>
          <FormulaNote items={[[String.raw`\alpha_t\in(0,1)`, 'token마다 state 전체를 얼마나 남길지 정하는 scalar forget gate'], [String.raw`\alpha_tS_{t-1}`, '오래되거나 불필요한 association을 함께 약화'], [String.raw`v_t-\alpha_tS_{t-1}k_t`, '감쇠 뒤에도 남은 current-key prediction error'], [String.raw`\beta_t`, '해당 key 방향의 교정 강도']]} />

          <M display>{String.raw`\begin{aligned}
\underbrace{r_{t\rightarrow t+m}}_{\text{m step 뒤 남은 비율}}
&=\underbrace{\prod_{j=t+1}^{t+m}\alpha_j}_{\text{step별 보존율을 모두 곱함}}\\[6pt]
\underbrace{\alpha_j=\alpha}_{\text{gate가 매번 같다면}}
&\Longrightarrow
\underbrace{r_{t\rightarrow t+m}=\alpha^m}_{\text{기억이 지수적으로 감소}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`m`, '새 write 없이 시간이 지난 step 수'], [String.raw`\prod\alpha_j`, '각 step의 보존 결정을 연속 적용한 값'], [String.raw`\alpha^m`, 'gate가 일정할 때 남은 기억의 닫힌 형태'], ['trade-off', '작은 alpha는 빠른 정리이면서 장기 기억의 빠른 손실']]} />

          <h3>KDA는 forget을 channel마다 다르게 만든다</h3>
          <p>
            Gated DeltaNet의 <M>{String.raw`\alpha_t`}</M>는 한 head의 state를 같은 비율로 줄인다. Kimi Delta Attention은 이를 key channel별 vector로 바꿔
            어떤 state row는 오래 남기고 다른 row는 빨리 비울 수 있게 한다. Kimi 논문은 state를 <M>{String.raw`d_k\times d_v`}</M>로 두므로 아래 식은 앞의 convention을 전치한 형태다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{A_t}_{\text{KDA transition}}
&=\underbrace{(I-\beta_tk_tk_t^{\top})}_{\text{key 방향 교정}}\\[-1pt]
&\quad\times\underbrace{\operatorname{Diag}(\boldsymbol\alpha_t)}_{\text{channel별 감쇠}}\\[6pt]
\underbrace{S_t}_{\text{KDA state}}
&=\underbrace{A_tS_{t-1}}_{\text{교정·감쇠한 이전 state}}\\[-1pt]
&\quad+\underbrace{\beta_tk_tv_t^{\top}}_{\text{새 association}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`S_t\in\mathbb R^{d_k\times d_v}`, 'Kimi 논문이 사용하는 전치된 state orientation'], [String.raw`A_t`, 'key 방향 교정과 channel별 감쇠를 먼저 합친 state transition'], [String.raw`\operatorname{Diag}(\boldsymbol\alpha_t)`, 'key channel마다 다른 retention을 주는 diagonal gate'], [String.raw`I-\beta_tk_tk_t^{\top}`, 'current key subspace의 기존 association을 교정하는 low-rank transition'], [String.raw`\beta_tk_tv_t^{\top}`, 'Kimi orientation에서 새 key-value를 기록하는 rank-1 write']]} />
        </div>
      </section>

      <section id="parallel-runtime" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Decode recurrence와 학습 kernel은 왜 다른가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Token 하나를 생성할 때는 이전 state 하나만 있으면 되므로 recurrent form이 자연스럽다. 하지만 학습 prompt의 수천 token을 이 식 그대로 Python loop로 돌리면 GPU가 작은 연산을 기다리느라 느리다.
            DeltaNet은 rank-1 transition의 곱을 WY representation으로 압축하고, KDA와 FlashQLA는 이를 더 큰 fused matrix operation으로 구현한다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{S_{pass}}_{\text{이전 기억의 통과분}}
&=S_{[c]}P_{[c]}\\[6pt]
\underbrace{S_{write}}_{\text{chunk 안의 새 기록}}
&=H_{[c]}\\[6pt]
\underbrace{S_{[c+1]}}_{\text{다음 chunk 시작 state}}
&=S_{pass}+S_{write}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`c`, 'C개 token으로 묶은 chunk index'], [String.raw`P_{[c]}`, 'chunk 안의 decay·projection transition을 한 번에 합친 factor'], [String.raw`S_{pass}`, '이전 state가 chunk transition을 지난 결과'], [String.raw`S_{write}`, 'chunk 안에서 새로 기록된 association들의 합성 결과'], ['실행 경계', 'P와 H의 내부 계산은 병렬화할 수 있지만 chunk 시작 state는 앞 chunk 결과에 의존']]} />
        </div>
        <LinearAttentionExplorer />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Misconception>
            Linear-time recurrence라고 해서 GPU에서 자동으로 빠른 것도, prefill이 완전히 순차인 것도 아니다. 실제 속도는 chunk size, head dimension, dtype, fusion, backward recomputation, sequence/context parallel 방식과 hardware에 달려 있다. FlashQLA의 2–3× forward와 2× backward 수치는 Qwen Team이 공개한 Hopper·비교 kernel 조건의 측정값이다.
          </Misconception>
        </div>
      </section>

      <section id="lineage" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">다섯 번의 설계 전환으로 최소 계보 닫기</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
          모든 linear attention 변형을 외우지 않는다. 현재 Qwen3.6을 설명하는 데 실제로 필요한 다섯 변화만 유지하고, 각 논문이 직전 단계에서 무엇을 고쳤는지 읽는다.
        </p>

        <div className="divide-y divide-border border-y border-border" data-hybrid-core-chapters>
          <HybridChapter
            order="01"
            year="2023–24"
            title="Mamba → Mamba-2 · 입력 선택성과 두 실행 형태"
            role="Selective SSM + SSD"
            facts={[["Aₜ,Bₜ,Cₜ", 'input dependent'], ['fixed state', 'decode memory'], ['recurrent', 'token decode'], ['block', 'training path']]}
            previous="RNN·SSM이 이전 state와 현재 input으로 다음 state를 만드는 recurrence를 유지한다."
            decision="Mamba는 SSM parameter를 input에 의존시켜 내용에 따라 전달·쓰기·읽기를 바꾼다. Mamba-2는 scalar-identity SSM과 semiseparable attention의 duality를 정리하고 block-friendly SSD layer를 만든다."
            execution="Decode는 state scan을 이어 가고, training은 같은 linear operator를 block matrix multiplication으로 계산한다. 과거 token별 KV cache 대신 layer별 SSM state와 short-convolution buffer를 유지한다."
            why="고정 transition만으로는 현재 token의 내용에 따라 중요한 정보와 잡음을 구분하기 어렵다. 동시에 수학만 recurrent하게 만들고 GPU kernel을 해결하지 않으면 실제 학습 속도를 얻을 수 없다."
            boundary="SSD의 duality는 구조 조건이 있는 정확한 교집합이다. 모든 SSM이 softmax attention과 같거나, Mamba state가 DeltaNet의 associative matrix와 같은 update를 쓴다는 뜻이 아니다."
            sourceLabel="Gu & Dao · Mamba / Dao & Gu · Mamba-2"
            sourceHref="https://arxiv.org/abs/2405.21060"
          />

          <HybridChapter
            order="02"
            year="2024"
            title="DeltaNet · 같은 key의 기억을 오차로 덮어쓰기"
            role="Targeted erase + write"
            facts={[["e=v-Sk", 'prediction error'], ['I-βkkᵀ', 'rank-1 transition'], ['WY', 'compact product'], ['chunkwise', 'GPU training']]}
            previous="Linear attention의 matrix state, key-value outer-product write, query read를 가져온다."
            decision="Value를 그대로 더하는 대신 current key의 기존 read와 목표 value의 차이만 쓴다. Unit key와 beta=1에서는 current key 방향을 정확히 새 value로 교체한다."
            execution="Transition은 identity-minus-rank-one matrix가 된다. 논문은 Householder product의 WY representation을 이용해 여러 update를 compact U·W factor로 만들고 chunk 안의 연산을 matmul로 바꾼다."
            why="단순 additive memory는 같은 key의 여러 value가 겹친다. Delta rule은 state 전체를 버리지 않고 현재 key subspace만 집중적으로 수정한다."
            boundary="정확한 overwrite는 unit key와 beta=1인 toy 조건이다. 실제 learned key는 서로 비직교이고 finite state를 공유하므로 interference와 retrieval 실패가 남는다."
            sourceLabel="Yang et al. · Parallelizing Linear Transformers with the Delta Rule"
            sourceHref="https://arxiv.org/abs/2406.06484"
          />

          <HybridChapter
            order="03"
            year="2024"
            title="Gated DeltaNet · 전체 망각과 선택적 교정을 분리"
            role="Scalar decay + delta"
            facts={[["αₜ", 'head-wise decay'], ['βₜ', 'delta gain'], ['GDN', 'finite-state mixer'], ['hybrid', 'SWA/global options']]}
            previous="DeltaNet의 key 방향 error correction과 chunkwise implementation을 유지한다."
            decision="Current input에서 만든 scalar alpha로 이전 state 전체를 먼저 감쇠한다. 그 뒤 감쇠된 state가 current key에 대해 틀린 만큼만 delta update한다."
            execution="Alpha가 0에 가까우면 state를 빠르게 비우고, 1에 가까우면 pure DeltaNet처럼 특정 key 방향을 수정한다. 논문은 recurrent form과 chunkwise parallel algorithm을 모두 제시한다."
            why="Delta rule만으로는 state가 포화되었을 때 불필요한 association을 빠르게 정리하기 어렵고, scalar decay만으로는 한 key만 골라 고치기 어렵다. 두 손잡이는 상보적이다."
            boundary="저자 benchmark에서 GDN이 Mamba-2·DeltaNet보다 나은 결과를 보인 것은 해당 400M·1.3B 학습과 task 조건의 결과다. 모든 scale과 runtime의 보편 순위가 아니다."
            sourceLabel="Yang et al. · Gated Delta Networks"
            sourceHref="https://arxiv.org/abs/2412.06464"
          />

          <HybridChapter
            order="04"
            year="2025"
            title="Kimi Linear · channel gate와 3:1 global attention"
            role="KDA + MLA hybrid"
            facts={[["20 KDA", 'state layers'], ['7 MLA', 'global layers'], ['≈3:1', 'published ratio; tail block 2:1'], ['1M', 'reported context']]}
            previous="Gated DeltaNet의 decay·delta 결합과 full attention을 일부 남기는 hybrid 전략을 가져온다."
            decision="Scalar alpha를 channel-wise diagonal gate로 세분화한 KDA를 만들고, 세 KDA layer마다 global MLA layer를 배치한다. MLA에서는 NoPE를 써 positional 역할을 KDA 쪽에 맡긴다."
            execution="KDA transition을 constrained diagonal-plus-low-rank form으로 두어 bespoke chunkwise kernel을 구성한다. 공개 48B-A3B 모델은 20 KDA와 7 MLA layer를 쓴다."
            why="Finite state의 channel마다 보존 시간을 다르게 하면서도 정확한 global retrieval 경로를 주기적으로 남기려는 선택이다. Pure linear와 pure MLA 사이의 quality·throughput trade-off를 실험으로 고른다."
            boundary="최대 75% KV 감소와 최대 6× decode throughput은 저자 비교, 1M context, hardware와 implementation에 묶인다. 3:1이면 언제나 품질이 높거나 정확히 75% 절감된다는 법칙이 아니다."
            sourceLabel="Moonshot AI · Kimi Linear"
            sourceHref="https://arxiv.org/abs/2510.26692"
          />

          <HybridChapter
            order="05"
            year="2025–26"
            title="Qwen3-Next → Qwen3.6 · Hybrid를 주력 stack과 runtime으로"
            role="GDN + attention + sparse MoE"
            facts={[["3:1", 'GDN : attention'], ['40 layers', 'Qwen3.6 35B'], ['30 / 10', 'GDN / full'], ['FlashQLA', 'fused kernels']]}
            previous="Gated DeltaNet의 scalar decay와 delta update, 주기적 full attention이라는 공개 recipe를 가져온다."
            decision="Qwen3-Next는 48층에 36 GDN과 12 gated attention을 배치했다. Qwen3.6-35B-A3B 공개 config는 40층에 30 linear_attention과 10 full_attention을 같은 cadence로 명시한다."
            execution="각 decoder layer는 두 token mixer를 동시에 더하지 않고 config의 layer type 하나를 선택한다. Sparse MoE는 그 뒤 FFN path에서 별도로 실행된다. 2026 FlashQLA는 GDN chunked prefill과 backward의 fusion·context parallel 비용을 줄인다."
            why="연구 primitive를 실제 multimodal·agent 모델의 반복 stack으로 쓰려면 architecture뿐 아니라 cache object, prefix reuse, chunked prefill, backward kernel까지 운영 계약이 필요하다."
            boundary="Qwen Team의 throughput·kernel speedup은 공개한 hardware와 baseline에 묶인다. Qwen3.6의 제품 성능을 GDN 하나의 효과로 환원할 수 없으며 MoE, data, multimodal training과 post-training이 함께 작동한다."
            sourceLabel="Qwen Team · Qwen3-Next and FlashQLA"
            sourceHref="https://qwen.ai/blog?id=flashqla"
          />
        </div>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 보고서를 다시 읽는 일곱 질문</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            2026년 연구는 state update를 “숨은 기억 장치”라고만 부르지 않고, sequence를 읽는 동안 key에서 value로 가는 작은 regression map을 학습하는 문제로 다시 해석한다.
            Preconditioned DeltaNet은 <M>{String.raw`\lVert Sk-v\rVert_2^2`}</M>의 key-space curvature를 근사해 update 방향을 보정한다. 이는 340M·1B 연구 scale의 최신 설계 축이며,
            Qwen3.6에 배치되었다는 사실로 읽어서는 안 된다.
          </p>
          <CapabilityCheck
            items={[
              '각 layer가 full_attention인지 linear_attention인지 config schedule을 먼저 펼친다.',
              'Attention layer의 token별 KV byte와 state layer의 fixed-state byte를 같은 dtype 단위로 더한다.',
              'Mamba SSM state와 Delta associative matrix가 같은 update rule이라고 뭉개지 않는다.',
              'Additive write, delta error correction, scalar forget, channel-wise forget을 네 단계로 구분한다.',
              'Recurrent decode kernel과 chunked prefill·training kernel의 dependency를 따로 그린다.',
              'MoE total/active parameter와 sequence persistent memory를 독립 장부로 유지한다.',
              'Vendor throughput은 context, batch, dtype, GPU, baseline kernel이 있는 측정값으로 읽는다.',
            ]}
          />
          <p>
            다음에는 이 판독법을 <Link to={articlePath('ai', 'research-deepseek-v3-2-2025')}>실제 최신 model report</Link>에 적용한다.
            Attention cadence, state shape, MoE routing, kernel과 benchmark를 한 덩어리로 요약하지 않고,
            각 주장이 어느 비용을 바꿨는지와 어떤 실험이 그 주장을 지지하는지 연결한다.
          </p>
          <SourceNotes
            sources={[
              { label: 'Gu & Dao · Mamba', href: 'https://arxiv.org/abs/2312.00752', note: 'Input-dependent selectivity와 hardware-aware recurrent algorithm의 최초 동기를 확인한다.' },
              { label: 'Dao & Gu · Transformers are SSMs / Mamba-2', href: 'https://arxiv.org/abs/2405.21060', note: 'SSD의 정확한 구조 조건과 recurrent·quadratic·block dual form을 확인한다.' },
              { label: 'Yang et al. · DeltaNet', href: 'https://arxiv.org/abs/2406.06484', note: 'Delta error correction, identity-minus-rank-one transition과 WY chunk algorithm을 확인한다.' },
              { label: 'Yang et al. · Gated Delta Networks', href: 'https://arxiv.org/abs/2412.06464', note: 'Scalar decay와 delta rule의 상보성, hybrid 실험 범위를 확인한다.' },
              { label: 'Moonshot AI · Kimi Linear', href: 'https://arxiv.org/abs/2510.26692', note: 'KDA channel gate, 3:1 KDA/MLA, 공개 kernel과 측정 조건을 확인한다.' },
              { label: 'Qwen Team · Qwen3-Next', href: 'https://qwen.ai/blog?id=e34c4305036ce60d55a0791b170337c2b70ae51d', note: '3:1 GDN/attention과 sparse MoE가 결합된 공개 기준점을 확인한다.' },
              { label: 'Qwen Team · FlashQLA', href: 'https://qwen.ai/blog?id=flashqla', note: 'Qwen3.5·3.6의 GDN runtime, chunked prefill·backward kernel 측정 범위를 확인한다.' },
              { label: 'Preconditioned DeltaNet', href: 'https://arxiv.org/abs/2604.21100', note: 'Online least-squares 해석과 approximate preconditioning이라는 2026 연구 방향을 확인한다.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function CurrentAxis({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-black">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function HybridChapter({
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
}: HybridChapterProps) {
  return (
    <article data-hybrid-core-chapter className="py-9 first:pt-6 last:pb-6">
      <header className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-4xl font-black text-foreground/15">{order}</p>
          <p className="mt-1 font-mono text-xs font-bold text-muted-foreground">{year}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{role}</p>
          <h3 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{title}</h3>
          <dl className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-4">
            {facts.map(([value, label]) => (
              <div key={`${value}-${label}`} className="min-w-0 bg-background px-3 py-3">
                <dt className="break-words font-mono text-sm font-black">{value}</dt>
                <dd className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
        <ChapterBand label="앞 단계에서 유지" text={previous} tone="bg-background" />
        <ChapterBand label="이번에 바꾼 결정" text={decision} tone="bg-amber-50/60 dark:bg-amber-950/15" />
        <ChapterBand label="실행·메모리 결과" text={execution} tone="bg-sky-50/60 dark:bg-sky-950/15" />
        <ChapterBand label="왜 필요한가" text={why} tone="bg-emerald-50/50 dark:bg-emerald-950/15" />
      </div>

      <div className="mt-4 border-l-2 border-rose-600/35 bg-rose-500/[0.035] px-4 py-3 text-sm leading-relaxed">
        <strong>근거 경계.</strong> {boundary}
      </div>
      {children}
      <a href={sourceHref} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
        {sourceLabel}
      </a>
    </article>
  );
}

function ChapterBand({ label, text, tone }: { label: string; text: string; tone: string }) {
  return (
    <div className={`min-w-0 p-4 ${tone}`}>
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
