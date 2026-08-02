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
import MoeParameterLedgerLab from './llm-architecture-viz/MoeParameterLedgerLab';
import MoeRoutingExplorer from './llm-architecture-viz/MoeRoutingExplorer';

type MoeChapterProps = {
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
    title: 'DeepSeek V3/R1',
    src: '/llm-architecture-gallery/images/architectures/deepseek-v3-r1-671-billion.webp',
    note: '671B total과 37B active를 expert bank, always-on path, 통신으로 다시 분해한다.',
  },
  {
    title: 'Qwen3 235B-A22B',
    src: '/llm-architecture-gallery/images/architectures/qwen3-235b-a22b.webp',
    note: 'Shared expert 없이 128개 중 8개를 고르는 다른 분기를 비교한다.',
  },
  {
    title: 'GPT-OSS 120B',
    src: '/llm-architecture-gallery/images/architectures/gpt-oss-120b.webp',
    note: 'MoE와 local/global attention을 한 모델 안에서 서로 다른 비용 축으로 읽는다.',
  },
];

export default function LlmArchitectureSparseMoeArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="Dense Transformer의 FFN을 sparse expert 경로로 바꾸는 글"
        description="Total parameter와 token마다 실제로 활성화되는 parameter를 분리하고, router가 고른 token을 여러 GPU의 expert로 보내는 비용까지 추적한다. Transformer 한 layer의 기본 흐름은 먼저 안다고 가정한다."
        prerequisites={[
          'Transformer layer가 attention과 FFN을 차례로 실행한다는 뜻을 안다.',
          'Token마다 같은 dense FFN weight를 읽는 기본 구조를 안다.',
          'FLOPs, memory byte와 GPU 간 통신 시간이 서로 다른 비용임을 구분한다.',
        ]}
        links={[
          { slug: 'llm-architecture-dense-transformers', title: 'Dense Transformer 계보', reason: 'MoE가 교체하는 FFN 한 칸과 model-wide 비용을 먼저 잡는다.' },
          { slug: 'llm-architecture-gallery', title: 'LLM 구조를 읽는 순서', reason: 'Dense, MoE, KV와 hybrid를 같은 비교 축에 놓는다.' },
        ]}
      />
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수백 B 모델에서 실제로 켜지는 길 찾기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <QuestionLead
            question="671B total / 37B active라면 token 하나가 37B weight만 읽고, FLOPs와 latency도 정확히 37/671로 줄어들까?"
            answer="아니다. 37B는 모델 전체의 활성 parameter 표기다. 그 안에는 선택된 expert뿐 아니라 attention과 dense prefix 같은 항상 켜진 경로가 들어간다. 실제 시간은 matrix 연산 외에 expert dispatch, GPU 간 통신, 가장 바쁜 expert를 기다리는 시간까지 포함한다."
          />

          <div className="not-prose my-8 border-y border-border bg-muted/10 py-5">
            <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">CURRENT TARGET · 최신 구조를 세 축으로 분해</p>
            <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-3">
              <div className="bg-background p-4">
                <p className="text-sm font-bold">Attention</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">과거 token을 어떤 형식으로 저장하고 어디까지 읽는가.</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-sm font-bold">Sparse FFN</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">이번 token이 어느 expert weight를 통과하는가.</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-sm font-bold">Runtime</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">선택된 token을 어느 GPU로 보내고 언제 다시 모으는가.</p>
              </div>
            </div>
          </div>

          <p>
            최신 모델은 MoE, compressed attention, 긴 context, speculative decoding을 한 구조에 함께 넣는다. 이름을 한꺼번에 외우면 무엇이 빨라졌는지 알 수 없다.
            직전 <Link to={articlePath('ai', 'llm-architecture-kv-long-context')}>KV·Long Context</Link> 글은 attention의 저장과 읽기를 맡았다.
            이 글은 <Link to={articlePath('ai', 'llm-architecture-dense-transformers')}>Dense Transformer</Link>의 gated FFN 한 칸만 router와 expert bank로 바꾸고 그 비용을 끝까지 추적한다.
          </p>
          <p>
            역사도 필요한 만큼만 내려간다. 1990년대 MoE 원형부터 모두 읽지 않는다. Transformer에서 capacity, Top-k decoder 실행, expert 세분화,
            modern load control, shared-expert 없는 분기를 만든 다섯 전환만 남긴다. 이 최소 기준선 위에 새 모델의 차이만 추가한다.
          </p>
          <ConceptPrimer
            items={[
              { term: 'Expert bank', meaning: '한 MoE layer 안에 저장된 모든 routed·shared FFN weight다.', why: '전체 지식 용량을 계산하는 장부다.' },
              { term: 'Active expert path', meaning: '현재 token이 실제로 통과하는 Top-k와 shared expert weight다.', why: 'Expert bank 안의 선택된 몫만 계산한다.' },
              { term: 'Always-on path', meaning: 'Attention, embedding, normalization, dense prefix처럼 routing과 무관하게 실행되는 부분이다.', why: 'Model-wide active와 expert active가 다른 이유다.' },
              { term: 'Assignment', meaning: 'Token 하나가 expert 하나를 선택한 사건이다. Top-2면 token 하나가 assignment 두 개를 만든다.', why: 'Capacity와 load를 token 수가 아니라 Tk로 계산하게 한다.' },
              { term: 'Expert parallel', meaning: 'Expert weight를 여러 GPU에 나누고 token hidden을 담당 GPU로 보내 계산하는 방식이다.', why: 'FLOPs가 줄어도 latency가 자동으로 줄지 않는 이유다.' },
            ]}
          />
          <ArchitectureFigureStrip figures={sourceFigures} />
          <p className="text-sm text-muted-foreground">
            구조도는 현재 목표의 위치만 찾는 지도다. 아래의 parameter 수와 통신 byte는 공개 config와 matrix shape로 다시 계산한다. 그림의 굵은 화살표나 total/active 표기만으로 속도를 추정하지 않는다.
          </p>
        </div>
      </section>

      <section id="expert-ledger" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Dense FFN 한 칸을 expert 장부로 바꾸기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Decoder block의 attention residual은 그대로 둔다. 두 번째 residual의 FFN만 MoE로 교체한다. 따라서 sparse라고 해도 모든 block 계산이 희소해지는 것은 아니다.
          </p>
          <M display>{String.raw`\underbrace{h^{(\ell+1)}}_{\text{다음 층 hidden}}=\underbrace{u^{(\ell)}}_{\text{attention 뒤 공통 경로}}+\underbrace{\operatorname{MoE}(\operatorname{Norm}(u^{(\ell)}))}_{\text{FFN 자리만 expert로 교체}}`}</M>
          <FormulaNote items={[[String.raw`u^{(\ell)}`, 'Self-attention residual까지 지난 hidden'], [String.raw`\operatorname{MoE}`, 'Dense gated FFN을 대신하는 sparse 변환'], ['공통 경로', 'Attention과 residual은 expert 선택과 관계없이 실행'], ['교체 범위', 'Block 전체가 아니라 두 번째 sublayer의 FFN 자리']]} />

          <p>
            Router는 token hidden과 expert별 router vector의 affinity를 계산한다. 높은 점수의 <M>{'k'}</M>개만 고르고, 선택된 routed expert 출력과 선택 여부가 없는 shared expert 출력을 합친다.
          </p>
          <M display>{String.raw`\underbrace{s_{t,i}}_{\text{token t와 expert i의 적합도}}=\underbrace{x_t^{\top}}_{\text{현재 token hidden}}\underbrace{e_i}_{\text{expert router vector}}`}</M>
          <FormulaNote items={[[String.raw`x_t`, 'Router가 읽는 현재 token 표현'], [String.raw`e_i`, 'Expert i가 맡을 token 방향을 학습하는 vector'], [String.raw`s_{t,i}`, 'Top-k 선택 전에 expert마다 계산한 affinity'], ['주의', '실제 논문은 softmax나 sigmoid 등 서로 다른 score 함수를 쓸 수 있음']]} />
          <M display>{String.raw`\underbrace{y_t}_{\text{MoE 출력}}=\underbrace{\sum_{i\in A_t}a_{t,i}E_i(x_t)}_{\text{선택된 routed expert}}+\underbrace{\sum_{j=1}^{S}E_j^{shared}(x_t)}_{\text{항상 실행되는 shared expert}}`}</M>
          <FormulaNote items={[[String.raw`A_t`, 'Router가 token t에 고른 Top-k expert 집합'], [String.raw`a_{t,i}`, '선택된 expert 출력을 섞는 gate weight'], [String.raw`E_i`, '각자 별도 gated FFN weight를 가진 routed expert'], [String.raw`S`, '항상 실행되는 shared expert 수. 0일 수도 있음'], ['합', 'Routed 전문 경로와 공통 경로를 한 hidden으로 복원']]} />

          <h3>Expert 하나의 weight부터 다시 센다</h3>
          <p>
            여기서는 SwiGLU류 gated expert를 기준으로 센다. Hidden <M>{'d'}</M>를 중간폭 <M>{'m'}</M>으로 보내는 gate·up matrix 두 장과 다시 <M>{'d'}</M>로 돌아오는 down matrix 한 장이 있다.
            Bias, router, normalization은 이 expert 장부에서 제외한다.
          </p>
          <M display>{String.raw`\underbrace{P_e}_{\text{expert 1개}}=\underbrace{dm}_{\text{게이트}}+\underbrace{dm}_{\text{확장}}+\underbrace{md}_{\text{축소}}=\underbrace{3dm}_{\text{세 행렬}}`}</M>
          <FormulaNote items={[[String.raw`d`, 'Block의 hidden width'], [String.raw`m`, 'Expert 내부 intermediate width'], [String.raw`dm+dm`, '두 입력 projection의 weight 수'], [String.raw`md`, 'Hidden으로 되돌리는 output projection'], [String.raw`P_e`, 'Router나 attention을 제외한 expert 하나의 parameter 수']]} />
          <M display>{String.raw`\underbrace{P_{bank}^{layer}}_{\text{층의 expert bank 전체}}=\underbrace{(E+S)}_{\text{routed와 shared 수}}\underbrace{P_e}_{\text{expert 하나}}`}</M>
          <FormulaNote items={[[String.raw`E`, '저장된 routed expert 수'], [String.raw`S`, '저장된 shared expert 수'], [String.raw`P_e`, '앞 식의 gated expert weight'], [String.raw`P_{bank}^{layer}`, '이번 token의 선택과 무관하게 모델에 저장된 expert 전체']]} />
          <M display>{String.raw`\underbrace{P_{path}^{layer}}_{\text{token당 활성 expert path}}=\underbrace{(k+S)}_{\text{Top-k와 shared 수}}\underbrace{P_e}_{\text{expert 하나}}`}</M>
          <FormulaNote items={[[String.raw`k`, 'Token마다 선택하는 routed expert 수'], [String.raw`S`, '선택 없이 항상 지나는 shared expert 수'], [String.raw`P_{path}^{layer}`, 'Layer 하나에서 token이 통과하는 expert weight'], ['경계', 'Attention·embedding·dense layer가 빠진 expert-only 값']]} />
        </div>

        <MoeParameterLedgerLab />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            DeepSeek-V3형 공개 config를 넣으면 expert 하나는 44.04M, 한 layer bank는 11.32B, token당 expert path는 396.36M이다.
            58개 MoE layer를 합치면 bank 656.46B 중 expert path는 22.99B다. 보고된 model-wide active 37B와 약 14.01B 차이가 남는다.
            이 잔차는 always-on 경로가 존재한다는 것을 보여 주지만, 공개 정보만으로 attention·embedding·dense prefix의 정확한 분해라고 부를 수는 없다.
          </p>
          <Misconception>
            Active parameter는 FLOPs, memory traffic, latency와 같은 단위가 아니다. 같은 active parameter라도 sequence length, matrix shape, batch, kernel fusion, expert placement와 network overlap이 다르면 실행 시간은 달라진다.
          </Misconception>
        </div>
      </section>

      <section id="routing-capacity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Routing 쏠림을 drop과 대기로 나눠 읽기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Top-k router가 선택한 assignment 수는 token 수 <M>{'T'}</M>가 아니라 <M>{'Tk'}</M>다. 모든 expert가 똑같이 바쁘다면 한 expert의 ideal load는 <M>{'Tk/E'}</M>다.
            Training에서 고정 shape를 만들기 위해 capacity를 두면 넘친 assignment를 residual로 우회하거나 구현 정책에 따라 처리한다. No-drop runtime은 모두 보존하지만 가장 바쁜 expert를 기다린다.
          </p>
          <M display>{String.raw`\underbrace{C}_{\text{expert당 허용 assignment}}=\left\lceil\underbrace{CF}_{\text{여유 계수}}\frac{\underbrace{Tk}_{\text{전체 Top-k 선택 수}}}{\underbrace{E}_{\text{expert 수}}}\right\rceil`}</M>
          <FormulaNote items={[[String.raw`T`, 'Routing하는 token 수'], [String.raw`k`, 'Token 하나가 선택하는 expert 수'], [String.raw`E`, 'Routed expert 수'], [String.raw`CF`, '균등 load보다 얼마나 더 받을지 정하는 capacity factor'], [String.raw`C`, '고정 capacity 정책에서 expert 하나가 처리할 assignment 상한']]} />
          <p>
            Switch Transformer의 원식은 Top-1이므로 <M>{'k=1'}</M>이다. 위 식은 Top-k assignment까지 같은 장부로 보기 위해 <M>{'Tk'}</M>로 일반화한 식이다.
            Capacity factor를 키우면 overflow는 줄지만 expert buffer와 계산 여유가 낭비될 수 있다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{f_i}_{\text{expert i의 assignment 몫}}
&=\\[-2pt]
&\frac{\underbrace{\sum_{t=1}^{T}\mathbf 1[i\in A_t]}_{\text{expert i가 받은 선택 수}}}
{\underbrace{Tk}_{\text{전체 선택 수}}}\\[7pt]
\underbrace{\sum_{i=1}^{E}f_i}_{\text{정규화 확인}}&=1
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`A_t`, 'Token t가 선택한 Top-k expert 집합'], [String.raw`\mathbf 1[i\in A_t]`, 'Expert i가 선택되었으면 1'], [String.raw`Tk`, 'Top-k에서 만들어진 전체 assignment 수'], [String.raw`f_i`, 'Top-k에서도 합이 1이 되는 normalized load share'], ['정규화', 'Token 수 T로 나누면 Top-k에서 합이 k가 되므로 구분 필요']]} />

          <h3>Switch의 balance loss는 Top-1 기준이다</h3>
          <M display>{String.raw`\underbrace{\mathcal L_{aux}}_{\text{Switch 쏠림 비용}}=\underbrace{\alpha E}_{\text{계수}}\sum_{i=1}^{E}\underbrace{f_i}_{\text{실제 선택 비율}}\underbrace{P_i}_{\text{평균 router 확률}}`}</M>
          <FormulaNote items={[[String.raw`\alpha`, 'Main loss에 더할 auxiliary loss 계수'], [String.raw`E`, 'Switch layer의 expert 수'], [String.raw`f_i`, 'Top-1 argmax로 expert i에 실제 배정된 token 비율'], [String.raw`P_i`, 'Batch token에 대해 expert i router probability를 평균한 값'], ['의도', '실제 선택과 확률이 같은 expert에 함께 몰리는 현상을 완화']]} />
          <p>
            이 손실은 expert가 서로 다른 지식을 배우도록 직접 명령하지 않는다. 학습 초기에 몇 expert만 계속 선택되는 collapse를 완화한다.
            Top-k 논문의 loss를 읽을 때는 normalization과 집계 범위가 token, sequence, micro-batch, global batch 중 무엇인지 다시 확인해야 한다.
          </p>

          <h3>DeepSeek-V3의 bias는 선택만 바꾼다</h3>
          <M display>{String.raw`\underbrace{A_t}_{\text{실행할 expert 집합}}=\operatorname{TopK}_i\!\left(\underbrace{s_{t,i}+b_i}_{\text{load 조정은 선택에만 사용}},k\right)`}</M>
          <FormulaNote items={[[String.raw`s_{t,i}`, 'Token과 expert의 원래 sigmoid affinity'], [String.raw`b_i`, 'Expert load에 따라 갱신되는 routing bias'], [String.raw`A_t`, 'Bias가 반영된 score로 고른 Top-k 집합'], ['경계', 'Bias는 어떤 expert를 고를지 바꾸며 output mixture weight 자체가 아님']]} />
          <M display>{String.raw`\underbrace{a_{t,i}}_{\text{선택 뒤 출력 가중치}}=\frac{\underbrace{s_{t,i}}_{\text{원래 affinity}}}{\underbrace{\sum_{j\in A_t}s_{t,j}}_{\text{선택 집합 안 정규화}}}\quad(i\in A_t)`}</M>
          <FormulaNote items={[[String.raw`i\in A_t`, 'Routing bias로 이미 선택된 expert'], [String.raw`s_{t,i}`, 'Bias를 더하기 전 affinity'], [String.raw`a_{t,i}`, 'Expert output을 합칠 때 사용하는 normalized gate weight'], ['분리 이유', 'Load 제어용 bias가 expert 출력의 의미 비율까지 직접 왜곡하지 않게 함']]} />
          <p>
            “Auxiliary-loss-free”는 주된 expert-level balance를 auxiliary loss 없이 bias로 제어한다는 뜻이다. DeepSeek-V3는 작은 sequence-wise balance loss를 보완적으로 남긴다.
            또한 해당 시스템은 node-limited routing과 no token dropping을 함께 사용한다. 따라서 bias 한 줄만 떼어 모든 MoE runtime의 동작으로 일반화하면 안 된다.
          </p>

          <h3>Expert parallel은 hidden을 왕복시킨다</h3>
          <M display>{String.raw`\underbrace{V_{roundtrip}}_{\text{왕복 byte 하한}}=\underbrace{2}_{\text{두 방향}}\underbrace{T}_{\text{token}}\underbrace{k}_{\text{선택}}\underbrace{d}_{\text{hidden 폭}}\underbrace{b}_{\text{원소 byte}}`}</M>
          <FormulaNote items={[[String.raw`T`, 'Expert parallel group이 routing하는 token 수'], [String.raw`k`, 'Token당 원격으로 보낼 수 있는 selected expert 수'], [String.raw`d`, 'Expert GPU로 보내는 hidden vector 폭'], [String.raw`b`, 'bf16이면 원소당 2 byte'], ['2', 'Expert 입력 dispatch와 계산 결과 return 두 방향'], ['하한', 'Metadata·padding·collective protocol·topology·재전송은 제외']]} />
        </div>

        <MoeRoutingExplorer />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Lab의 collapsed load <M>{'[16,10,4,2]'}</M>는 32 assignments의 총합을 보존한다. Capacity factor 1.0이면 expert당 상한은 8이고 10개가 넘친다.
            같은 routing을 no-drop으로 바꾸면 32개 모두 계산하지만 최대 load가 ideal의 2배다. 이때 step은 평균 expert가 아니라 가장 늦게 끝나는 expert에 맞춰진다.
          </p>
          <p>
            DeepSeek-V3형 <M>{'T=4096'}</M>, <M>{'k=8'}</M>, <M>{'d=7168'}</M>, bf16만 넣어도 activation 왕복 하한은 MoE layer당 896 MiB다.
            실제 traffic은 placement, 동일 GPU expert, padding, network topology와 collective 구현에 따라 달라진다. 이 계산은 속도 예측값이 아니라 “통신을 무시할 수 있는가”를 판정하는 첫 하한이다.
          </p>
        </div>
      </section>

      <section id="lineage" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">다섯 번의 설계 전환으로 최소 계보 닫기</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
          연도별 모델 목록을 외우지 않는다. Capacity, Top-k decoder 실행, expert 세분화, load 제어, shared path의 선택이 바뀐 다섯 지점만 읽는다.
        </p>

        <div className="divide-y divide-border border-y border-border" data-moe-core-chapters>
          <MoeChapter
            order="01"
            year="2021"
            title="Switch Transformer · Top-1과 고정 capacity"
            role="Training shape를 먼저 고정"
            facts={[["Top-1", 'token당 expert'], ['T/E × CF', 'expert capacity'], ['overflow', 'residual 우회'], ['aux loss', 'load 완화']]}
            previous="Transformer의 attention과 FFN expert 계산은 유지한다."
            decision="Router가 token마다 expert 하나만 고르게 해 sparse routing을 단순화한다. Expert별 capacity를 정하고 넘친 token은 expert 계산을 건너뛰어 residual connection으로 보낸다."
            execution="Top-1은 token 복제와 통신량을 줄이고 고정 capacity는 accelerator에 예측 가능한 tensor shape를 준다. Capacity factor가 높으면 overflow는 줄지만 memory와 compute가 낭비된다."
            why="많은 expert를 저장하면서 token당 계산은 하나의 FFN 수준에 가깝게 유지하고, 대규모 sparse training을 단순한 규칙으로 안정화하려 했다."
            boundary="Switch의 f_i와 auxiliary loss는 Top-1 정의다. Top-2 이상에서 그대로 T로 나누면 assignment share의 합이 1이 아니므로 식을 구분해야 한다."
            sourceLabel="Fedus et al. · Switch Transformers"
            sourceHref="https://arxiv.org/abs/2101.03961"
          />

          <MoeChapter
            order="02"
            year="2024"
            title="Mixtral 8x7B · Decoder FFN을 Top-2 expert로 교체"
            role="Open decoder 실행 기준"
            facts={[["8", 'experts/layer'], ['Top-2', 'token당 선택'], ['47B', 'total'], ['13B', 'active']]}
            previous="Mistral 계열 decoder attention과 residual block을 유지한다."
            decision="각 layer의 feed-forward block을 expert 8개로 바꾸고 router가 token마다 2개를 선택한다. 선택된 두 출력은 router weight로 합친다."
            execution="한 token은 attention과 두 expert를 실행한다. Expert parallel에서는 token hidden을 expert가 있는 GPU로 보내고 결과를 다시 원래 위치로 돌려보낸다."
            why="Dense decoder의 사용법을 유지하면서 FFN capacity와 token당 활성 계산을 분리해, 실제 언어 모델에서 sparse MoE의 품질·처리량 기준점을 만들었다."
            boundary="8x7B라는 이름은 total 56B를 뜻하지 않는다. Embedding·attention 공유와 실제 expert 폭 때문에 논문 보고값은 약 47B total, 13B active다."
            sourceLabel="Jiang et al. · Mixtral of Experts"
            sourceHref="https://arxiv.org/abs/2401.04088"
          />

          <MoeChapter
            order="03"
            year="2024"
            title="DeepSeekMoE · Expert를 더 잘게 나누고 공통 지식을 격리"
            role="Fine-grained + shared isolation"
            facts={[["mN", '세분화 experts'], ['mK', '활성 experts'], ['K_s', 'shared experts'], ['same budget', '활성 expert params']]}
            previous="Top-k sparse routing과 gated expert의 합성은 유지한다."
            decision="기존 expert 하나를 m개의 더 작은 expert로 쪼개 전체 수를 mN, 활성 수를 mK로 늘린다. 여러 token에 공통인 지식은 항상 실행되는 shared expert로 분리한다."
            execution="같은 활성 expert parameter budget 안에서 더 다양한 expert 조합을 만들 수 있다. Shared path가 공통 지식을 맡으면 routed expert가 중복된 공통 기능을 반복해서 학습할 압력이 줄어든다."
            why="Expert specialization을 늘리되 계산 예산은 유지하고, routed expert 사이의 knowledge redundancy를 줄이려 했다."
            boundary="Shared expert가 모든 MoE의 필수 구성은 아니다. Qwen3처럼 shared expert 없이 routed expert와 balance loss를 택하는 설계도 있다."
            sourceLabel="Dai et al. · DeepSeekMoE"
            sourceHref="https://arxiv.org/abs/2401.06066"
          />

          <MoeChapter
            order="04"
            year="2024"
            title="DeepSeek-V3 · Routing bias와 node-limited no-drop"
            role="Modern load control"
            facts={[["256", 'routed experts'], ['Top-8', 'token당 선택'], ['1', 'shared expert'], ['≤4 nodes', 'routing 범위']]}
            previous="DeepSeekMoE의 fine-grained routed expert와 shared expert isolation을 유지한다."
            decision="Sigmoid affinity에 expert별 bias를 더해 Top-k 선택만 조정하고, 선택 뒤 출력 weight는 원 affinity에서 계산한다. Token은 제한된 node 안에서 expert를 고르며 저자 시스템은 token을 drop하지 않는다."
            execution="Overloaded expert의 bias를 낮추고 underloaded expert의 bias를 높여 장기 load를 조절한다. Node limit는 모든 cluster node로 token이 흩어지는 통신 범위를 제한한다."
            why="큰 auxiliary loss가 representation 학습에 간섭하지 않도록 routing 제어와 output mixture를 분리하면서 대규모 expert parallel의 통신을 관리하려 했다."
            boundary="Auxiliary-loss-free는 모든 balance loss가 0이라는 뜻이 아니다. 보고서는 작은 sequence-wise auxiliary loss를 보완적으로 사용한다."
            sourceLabel="DeepSeek-AI · DeepSeek-V3 Technical Report"
            sourceHref="https://arxiv.org/abs/2412.19437"
          />

          <MoeChapter
            order="05"
            year="2025"
            title="Qwen3 235B-A22B · Shared expert 없는 Top-8 분기"
            role="공통 경로도 설계 선택"
            facts={[["128", 'experts/layer'], ['Top-8', 'token당 선택'], ['0', 'shared experts'], ['235B / 22B', 'total / active']]}
            previous="각 decoder layer의 sparse routed expert와 Top-k weighted combine을 유지한다."
            decision="94개 layer에서 128개 routed expert 중 8개를 선택하고 shared expert를 두지 않는다. Load balancing은 더 큰 global batch 범위의 통계로 계산한다."
            execution="Expert-only 장부는 layer당 2.42B 중 150.99M, 94개 layer 합 227.10B 중 14.19B가 활성화된다. 보고 active 22B에는 attention 등 항상 켜진 경로가 더해진다."
            why="공통 지식을 반드시 shared expert에 격리하지 않고도 routed expert와 큰 집계 범위의 balance로 high-capacity MoE를 구성할 수 있음을 보여 준다."
            boundary="235B/22B는 model-wide 보고값이고 6.25%는 expert bank 안의 8/128 비율이다. 두 비율을 같은 active ratio로 쓰지 않는다."
            sourceLabel="Qwen Team · Qwen3 Technical Report"
            sourceHref="https://arxiv.org/abs/2505.09388"
          />
        </div>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">새 MoE 모델을 읽는 일곱 단계</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            이제 최신 model card로 돌아간다. “1T인데 40B만 활성”이라는 문장을 바로 속도 결론으로 바꾸지 않는다. 아래 장부를 채우면 새 expert 수나 router 이름이 추가되어도 같은 방식으로 검증할 수 있다.
          </p>
          <CapabilityCheck
            items={[
              'Dense block에서 attention과 FFN 중 어느 자리만 sparse해졌는지 먼저 표시한다.',
              'Expert matrix shape로 expert 하나의 parameter를 계산하고 routed·shared bank를 따로 센다.',
              'Expert-bank active, model-wide active, FLOPs, latency를 서로 다른 단위로 기록한다.',
              'Top-k assignment 총수 Tk와 capacity factor로 overflow를 계산한다.',
              'Drop 정책과 no-drop straggler 정책을 같은 성능 주장으로 섞지 않는다.',
              'Routing bias가 선택 score와 output gate 중 어디에 쓰이는지 수식에서 확인한다.',
              'Expert parallel dispatch-return byte의 하한을 계산한 뒤 topology와 overlap 조건을 찾는다.',
            ]}
          />
          <p>
            다음 글은 <Link to={articlePath('ai', 'llm-architecture-hybrid-linear')}>Hybrid·Linear Attention</Link>이다. MoE는 같은 token 위치에서 실행할 FFN weight를 고른다.
            Hybrid·SSM은 과거 sequence를 읽는 attention 경로 자체를 바꾼다. 두 sparsity를 분리해야 최신 혼합 구조를 정확히 읽을 수 있다.
          </p>
          <SourceNotes
            sources={[
              { label: 'Fedus et al. · Switch Transformers', href: 'https://arxiv.org/abs/2101.03961', note: 'Top-1 routing, expert capacity, overflow와 원래 auxiliary balance loss의 정의를 확인한다.' },
              { label: 'Jiang et al. · Mixtral of Experts', href: 'https://arxiv.org/abs/2401.04088', note: '8-expert Top-2 decoder 실행, weighted combine, total/active 보고값과 expert parallel 설명을 확인한다.' },
              { label: 'Dai et al. · DeepSeekMoE', href: 'https://arxiv.org/abs/2401.06066', note: 'Fine-grained expert segmentation과 shared expert isolation의 의도를 확인한다.' },
              { label: 'DeepSeek-AI · DeepSeek-V3 Technical Report', href: 'https://arxiv.org/abs/2412.19437', note: 'Sigmoid affinity, routing-only bias, node-limited routing, no-drop와 보완 auxiliary loss 경계를 확인한다.' },
              { label: 'DeepSeek-V3 Base · official config', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V3-Base/blob/main/inference/configs/config_671B.json', note: 'Hidden, expert intermediate, layer, routed/top-k/shared expert 수로 parameter ledger를 재현한다.' },
              { label: 'Qwen Team · Qwen3 Technical Report', href: 'https://arxiv.org/abs/2505.09388', note: 'Qwen3 MoE의 global-batch balancing과 235B/22B 공개 범위를 확인한다.' },
              { label: 'Qwen3-235B-A22B · official config', href: 'https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/main/config.json', note: '94 layers, hidden/intermediate, 128 experts, Top-8, shared expert 없음으로 장부를 재현한다.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function MoeChapter({
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
}: MoeChapterProps) {
  return (
    <article data-moe-core-chapter className="py-9 first:pt-6 last:pb-6">
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
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
        <ChapterBand label="앞 설계에서 유지" text={previous} tone="bg-background" />
        <ChapterBand label="이번에 바꾼 결정" text={decision} tone="bg-amber-50/60 dark:bg-amber-950/15" />
        <ChapterBand label="실행·통신 결과" text={execution} tone="bg-sky-50/60 dark:bg-sky-950/15" />
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
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
