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
import MlaCacheExplorer from './llm-architecture-viz/MlaCacheExplorer';
import LongContextWindowLab from './llm-architecture-viz/LongContextWindowLab';

type KvChapterProps = {
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
    title: 'Gemma 4 31B · 비교 도식',
    src: '/llm-architecture-gallery/images/architectures/gemma-4-31b.webp',
    note: '31B 변형을 읽는 비교 도식이다. 아래 12B release 출처를 이 변형의 config 근거로 옮겨 쓰지 않고, 먼저 local/global cadence와 KV head를 별도 확인한다.',
  },
  {
    title: 'DeepSeek V4 Pro · 비교 도식',
    src: '/llm-architecture-gallery/images/architectures/deepseek-v4-pro.webp',
    note: 'Pro 변형을 읽는 비교 도식이다. 아래 V4-Flash 보고서와 같은 checkpoint라는 뜻이 아니며, compressed long-range path와 cache 축만 비교한다.',
  },
  {
    title: 'Gemma 3 27B',
    src: '/llm-architecture-gallery/images/architectures/gemma-3-27b.webp',
    note: '최소 공개 기준. 5 local : 1 global, window 1,024가 cache와 직접 가시 범위를 어떻게 바꾸는지 계산한다.',
  },
];

export default function LlmArchitectureKvLongContextArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="긴 context를 attention과 memory 구조로 비교하는 글"
        description="128K 같은 제품 숫자를 나열하는 대신, 과거 token마다 무엇을 저장하고 각 layer가 어느 위치를 직접 읽는지 구조별로 비교한다. Self-attention의 Q·K·V가 처음이라면 아래 기반 글부터 읽는다."
        prerequisites={[
          'Token sequence와 context window가 무엇인지 안다.',
          'Self-attention에서 query, key와 value가 어떤 역할을 하는지 안다.',
          '생성 시 이미 계산한 key·value를 cache에 남기는 이유를 안다.',
        ]}
        links={[
          { slug: 'transformer-architecture', title: 'Transformer architecture', reason: 'Q·K·V, attention matrix와 layer 흐름을 바닥부터 배운다.' },
          { slug: 'llm-architecture-gallery', title: 'LLM 구조를 읽는 순서', reason: 'Dense, MoE, KV와 hybrid 변화를 같은 비교 축에 놓는다.' },
        ]}
      />
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">긴 문맥을 숫자가 아니라 두 병목으로 읽기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <QuestionLead
            question="두 모델이 모두 128K context를 지원하면 같은 양을 저장하고 같은 token을 직접 볼까?"
            answer="아니다. KV layout은 과거 token마다 무엇을 저장할지 정하고, attention pattern은 각 layer가 어느 위치를 직접 읽을지 정한다. Context 상한은 두 질문의 답도, 오래된 사실을 정확히 찾는다는 보증도 아니다."
          />

          <div className="not-prose my-8 border-y border-border bg-muted/10 py-5">
            <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">CURRENT TARGET · 2026-06까지 공개된 구조</p>
            <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
              <div className="bg-background p-4">
                <p className="text-sm font-bold">Gemma 4 계열</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">긴 context를 모든 layer의 full attention으로 해결하지 않는다. Local/global cadence, 공유 K/V, position path가 같이 움직인다.</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-sm font-bold">DeepSeek V4 계열</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Compressed·sparse long-range path를 MoE·residual 변화와 함께 쓴다. 이 글에서는 먼저 cache와 token 접근 축만 분리한다.</p>
              </div>
            </div>
          </div>

          <p>
            현재 모델에서 보이는 기법을 이해하려고 attention 역사를 끝없이 내려갈 필요는 없다. 먼저 <Link to={articlePath('ai', 'llm-architecture-dense-transformers')}>Dense Transformer</Link>에서
            Q, K, V와 residual block을 가져온다. 여기서는 생성 중 과거 K/V가 왜 남는지, 그 cache를 어떤 축으로 줄이는지만 새로 배운다.
          </p>
          <p>
            긴 문맥 비용에는 서로 다른 두 축이 있다. <strong>저장 폭</strong>은 MHA·GQA·MLA가 바꾸고, <strong>저장 길이와 직접 가시 범위</strong>는 full·sliding·global attention이 바꾼다.
            둘을 “long context 최적화”라는 한 문장으로 합치면 config를 보고도 실제 메모리를 계산할 수 없다.
          </p>

          <ConceptPrimer
            items={[
              { term: 'Prefill', meaning: 'Prompt의 모든 위치를 한 번에 처리해 첫 KV cache를 만드는 단계다.', why: 'Causal triangle 전체의 attention pair가 생긴다.' },
              { term: 'Decode', meaning: '새 token 하나의 Q를 만들고 이미 저장한 과거 K/V를 읽는 반복 단계다.', why: '매 token latency와 memory bandwidth 병목을 설명한다.' },
              { term: 'Cache width', meaning: '과거 token 하나, layer 하나마다 저장할 K/V 또는 latent 원소 수다.', why: 'GQA와 MLA가 직접 바꾸는 축이다.' },
              { term: 'Direct vs reachable', meaning: '이번 layer가 직접 읽는 위치와 아래 layer를 거쳐 정보 경로가 닿는 위치는 다르다.', why: 'Sliding window를 문맥 삭제로 오해하지 않게 한다.' },
              { term: 'RoPE · Rotary Position Embedding', meaning: 'Token 위치마다 다른 회전 변환을 query와 key에 적용하는 위치 표현이다.', why: '두 위치의 상대적 차이가 attention score에 들어가지만, 위치마다 변환이 달라 고정 content projection 하나에 그대로 흡수할 수 없다.' },
              { term: 'NoPE · No Positional Encoding', meaning: '해당 attention path의 query와 key에 명시적 위치 embedding이나 회전을 넣지 않는 선택이다.', why: '별도 위치 성분의 저장·연산은 없지만 causal mask, 다른 layer와 구조가 순서 정보를 어떻게 전달하는지 따로 검증해야 한다.' },
            ]}
          />
          <ArchitectureFigureStrip figures={sourceFigures} />
          <p className="text-sm text-muted-foreground">
            구조도는 현재 목표의 위치를 찾는 지도다. 아래에서는 공개 수식과 config로 다시 계산한다. 최대 context 숫자나 그림의 긴 화살표를 retrieval 품질의 증거로 사용하지 않는다.
          </p>
        </div>
      </section>

      <section id="prefill-decode" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prefill과 decode가 다른 이유</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Causal decoder는 현재 위치보다 오른쪽의 미래 token을 볼 수 없다. Prompt를 넣는 prefill에서는 길이가 1, 2, 3, ...인 attention 행을 한꺼번에 계산한다.
            그 결과인 K/V를 남겨 두면 decode에서는 과거 token을 다시 block 전체에 통과시키지 않고 새 Q 한 행만 과거 cache와 비교할 수 있다.
          </p>

          <M display>{String.raw`\begin{aligned}
\underbrace{M_{KV}}_{\text{전체 KV 바이트}}
&=\underbrace{2BL}_{\text{K·V × 문장 × 층}}\\[4pt]
&\quad\times\underbrace{N}_{\text{과거 토큰}}
\underbrace{H_{kv}d_h}_{\text{층별 저장 폭}}
\underbrace{b}_{\text{원소 바이트}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`B`, '동시에 cache를 유지하는 sequence 수'], [String.raw`L`, 'KV를 따로 저장하는 decoder layer 수'], [String.raw`N`, 'sequence마다 남은 과거 token 수'], [String.raw`H_{kv}d_h`, 'KV head 전체 폭'], [String.raw`b`, 'bf16/fp16이면 보통 2 byte'], ['2', 'key와 value 두 tensor']]} />
          <p>
            기존 식에서 빠지기 쉬운 항이 <M>{'B'}</M>다. 모델 하나가 128K를 처리할 수 있어도 같은 GPU에서 여러 요청을 동시에 유지하면 cache는 batch만큼 다시 커진다.
          </p>

          <h3>Prefill은 삼각형, decode는 한 행</h3>
          <M display>{String.raw`\underbrace{P_{full}(N)}_{\text{full causal 쌍}}=\underbrace{\sum_{t=1}^{N}t}_{\text{위치별 과거 수}}=\underbrace{\frac{N(N+1)}{2}}_{\text{삼각형 전체}}`}</M>
          <FormulaNote items={[[String.raw`t`, '현재 query 위치에서 볼 수 있는 causal key 수'], [String.raw`N`, 'prompt token 수'], ['삼각형', '모든 query 행의 길이를 더한 attention pair 수'], ['범위', 'head와 batch를 곱하기 전 구조 비교 단위']]} />
          <M display>{String.raw`\underbrace{P_{local}(N,w)}_{\text{local causal 쌍}}=\underbrace{Nw}_{\text{고정 창 누적}}-\underbrace{\frac{w(w-1)}{2}}_{\text{초기 짧은 행 보정}}\quad(N\ge w)`}</M>
          <FormulaNote items={[[String.raw`w`, '한 query가 직접 읽는 최대 window token 수'], [String.raw`Nw`, '모든 행이 window만큼 길다고 본 임시 합'], ['보정항', '첫 w-1개 행은 아직 window가 다 차지 않아 빼는 부분'], ['결과', 'N이 길어지면 대략 Nw로 증가']]} />
          <p>
            Full prefill은 <M>{'N^2'}</M>에 가깝고 local prefill은 고정 <M>{'w'}</M>에서 <M>{'Nw'}</M>에 가깝다. 반면 다음 token 하나를 decode할 때는 global layer가 <M>{'N'}</M>개,
            local layer가 최대 <M>{'w'}</M>개 key 위치를 읽는다. 같은 “긴 문맥 비용”이라도 prefill throughput과 token당 decode latency를 따로 측정해야 한다.
          </p>
          <Misconception>
            KV cache는 attention 계산 자체를 없애지 않는다. 이전 token의 K/V projection을 재계산하지 않게 하지만, 새 Q가 과거 K와 score를 만들고 V를 모으는 일은 남는다.
          </Misconception>
        </div>
      </section>

      <section id="kv-layout" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MHA → GQA → MLA: 무엇을 저장하는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            MHA는 query head마다 K/V head를 둔다. MQA는 모든 query가 K/V 한 쌍을 공유한다. GQA는 그 사이에서 query를 여러 group으로 나누고 group마다 K/V 한 쌍을 둔다.
            따라서 GQA가 줄이는 직접 대상은 Q head가 아니라 K/V projection과 cache다.
          </p>
          <M display>{String.raw`\underbrace{g}_{\text{KV 하나를 공유할 Q 수}}=\frac{\underbrace{H_q}_{\text{query head 수}}}{\underbrace{H_{kv}}_{\text{KV head 수}}}`}</M>
          <FormulaNote items={[[String.raw`H_q`, '서로 다른 query 관점의 개수'], [String.raw`H_{kv}`, '실제로 만들고 저장하는 key/value head 수'], [String.raw`g`, 'KV head 하나를 함께 쓰는 query head 수'], ['경계', 'Q projection과 output projection은 이 비율만큼 자동 감소하지 않음']]} />

          <h3>MLA는 head 수 대신 저장 좌표계를 바꾼다</h3>
          <p>
            DeepSeek-V2의 MLA는 K와 V를 각각 작은 head 수로 만드는 대신, hidden을 공유 latent로 한 번 압축한다. Content K/V는 이 latent에서 복원하며,
            inference에서는 일부 up projection을 Q·output matrix에 흡수할 수 있다.
          </p>
          <M display>{String.raw`\underbrace{c_t^{KV}}_{\text{공유 KV 잠재값}}=\underbrace{W^{DKV}}_{\text{저차원 압축}}\underbrace{h_t}_{\text{현재 hidden}}`}</M>
          <FormulaNote items={[[String.raw`h_t`, '현재 token의 residual-stream vector'], [String.raw`W^{DKV}`, 'hidden을 KV compression dimension으로 내리는 matrix'], [String.raw`c_t^{KV}`, 'content key와 value가 함께 사용하는 저장 latent'], ['의도', 'head별 K/V 전체 대신 하나의 작은 좌표를 cache']]} />
          <M display>{String.raw`\begin{aligned}
\underbrace{k_{t,j}^{C}}_{\text{head j content key}}
&=\underbrace{W_j^{UK}c_t^{KV}}_{\text{계산 시 복원}}\\[5pt]
\underbrace{v_{t,j}^{C}}_{\text{head j value}}
&=\underbrace{W_j^{UV}c_t^{KV}}_{\text{계산 시 복원}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`j`, 'attention head index'], [String.raw`W_j^{UK}`, '공유 latent를 head별 content key 좌표로 해석'], [String.raw`W_j^{UV}`, '공유 latent를 head별 value 좌표로 해석'], ['흡수 가능성', 'inference에서는 이 projection을 Q·output matrix와 결합해 명시적 복원을 피할 수 있음']]} />
          <M display>{String.raw`\underbrace{D_{MLA}}_{\text{토큰·층별 저장 폭}}=\underbrace{d_c}_{\text{공유 content 잠재폭}}+\underbrace{d_r}_{\text{분리된 RoPE key 폭}}`}</M>
          <FormulaNote items={[[String.raw`d_c`, '공유 K/V latent의 차원'], [String.raw`d_r`, 'position-sensitive RoPE key로 별도 저장하는 차원'], [String.raw`D_{MLA}`, 'DeepSeek-V2 MLA가 token·layer마다 cache하는 실제 원소 수'], ['차이', 'GQA의 2Hkv dh 대신 두 latent 성분을 더함']]} />
          <M display>{String.raw`\underbrace{M_{MLA}}_{\text{MLA cache 바이트}}=\underbrace{BLN}_{\text{문장·층·토큰}}\underbrace{D_{MLA}}_{\text{저장 폭}}\underbrace{b}_{\text{원소 바이트}}`}</M>
          <FormulaNote items={[[String.raw`B`, '동시에 유지하는 sequence 수'], [String.raw`L`, 'MLA layer 수'], [String.raw`N`, 'cache에 남은 과거 token 수'], [String.raw`D_{MLA}`, '앞 식에서 계산한 token·layer별 latent 원소 수'], [String.raw`b`, '원소 하나의 저장 byte']]} />
          <p>
            RoPE를 content key 전체에 바로 적용하면 position-dependent matrix 때문에 up projection을 Q matrix에 단순 흡수할 수 없다. DeepSeek-V2는 position 성분을 작은 별도 query/key로 떼어
            content 압축과 position 처리를 양립시킨다. 그래서 “MLA는 latent만 저장한다”도 불완전하며, decoupled RoPE key 폭을 더해야 한다.
          </p>
          <p>
            Config에 <strong>NoPE</strong>가 적혀 있으면 먼저 “어느 attention layer 또는 head가 명시적
            위치 변환을 생략했는가”를 찾는다. Sequence 순서가 사라졌다는 뜻은 아니다. Causal mask는
            여전히 미래 token을 가리고, 다른 RoPE layer·local window·recurrent state가 위치 단서를
            전달할 수 있다. Cache 장부에서는 그 path에 별도 RoPE key 성분이 없는지 확인하되, 긴 거리의
            순서 판별과 retrieval 품질은 실제 실험으로 별도 검증한다.
          </p>
        </div>
        <MlaCacheExplorer />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Misconception>
            Cache byte가 93% 줄었다는 원 논문의 수치는 DeepSeek-V2와 비교 기준, precision, runtime 조건에 묶인 실험 결과다. 모든 MLA 구현이 같은 절감률이나 품질을 얻는다는 보편 법칙으로 옮기지 않는다.
          </Misconception>
        </div>
      </section>

      <section id="local-global" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SWA와 global layer: 누구를 직접 보는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            GQA와 MLA가 token 하나의 저장 폭을 바꾼다면 sliding-window attention은 local layer가 cache에 남길 token 수를 바꾼다.
            Local layer <M>{'S'}</M>개와 global layer <M>{'G'}</M>개를 섞으면 두 종류의 cache lifetime을 따로 더해야 한다.
          </p>
          <M display>{String.raw`\begin{aligned}
\underbrace{m_{\mathrm{token}}}_{\text{한 층·한 토큰의 KV}}
&=2BH_{kv}d_hb\\[5pt]
\underbrace{M_{global}}_{\text{global 층의 cache}}
&=\underbrace{m_{\mathrm{token}}GN}_{\text{context 전체 보존}}\\[5pt]
\underbrace{M_{local}}_{\text{local 층의 cache}}
&=\underbrace{m_{\mathrm{token}}S\min(N,w)}_{\text{window까지만 보존}}\\[5pt]
\underbrace{M_{mix}}_{\text{혼합 KV 바이트}}
&=M_{global}+M_{local}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`G`, 'context 전체를 직접 보는 global layer 수'], [String.raw`S`, 'window 안만 직접 보는 local layer 수'], [String.raw`M_{global}`, 'global layer cache는 context와 함께 선형 증가'], [String.raw`M_{local}`, 'local layer cache는 window에서 상한'], [String.raw`M_{mix}`, '두 cache 소유량을 마지막에 더한 값'], ['앞의 2', 'K와 V 두 tensor']]} />

          <h3>직접 가시 범위와 간접 전달을 분리한다</h3>
          <M display>{String.raw`\underbrace{\mathcal V_t^{(\ell)}}_{\text{local 층의 직접 가시 집합}}=\underbrace{\{\max(1,t-w+1),\ldots,t\}}_{\text{현재 위치까지 최근 w개}}`}</M>
          <FormulaNote items={[[String.raw`t`, '현재 query token 위치'], [String.raw`w`, '현재 local layer가 직접 읽을 최대 token 수'], [String.raw`\mathcal V_t^{(\ell)}`, '이번 layer의 attention score에 직접 들어가는 key 위치'], ['주의', '아래 layer가 이미 섞어 온 정보의 출처 범위와는 다름']]} />
          <M display>{String.raw`\begin{aligned}
\underbrace{R_\ell}_{\text{local 층만 거친 최대 도달폭}}
&\le\\[-2pt]
&\underbrace{\min\!\left(N,1+\ell(w-1)\right)}_{\text{층마다 최대 w-1만큼 확장}}
\end{aligned}`}</M>
          <FormulaNote items={[[String.raw`R_\ell`, '최상단 표현까지 계산 경로가 닿을 수 있는 최대 token 폭'], [String.raw`\ell`, '연속해서 지난 local layer 수'], [String.raw`w-1`, '한 layer가 과거 방향으로 추가할 수 있는 최대 거리'], ['상한', '도달 가능한 경로이며 정확한 기억·검색 성능의 하한이 아님']]} />
          <p>
            Global layer가 오면 현재 위치의 표현은 causal prefix 전체를 직접 섞을 수 있다. 그 위의 local layer는 직접 최근 window만 보더라도, 입력 vector 안에는 global layer가 섞어 둔 먼 정보가 들어올 수 있다.
            하지만 여러 residual과 압축을 통과한 정보가 정확히 보존된다고 보장되지는 않는다. 그래서 context support와 needle retrieval 평가는 별개다.
          </p>
        </div>
        <LongContextWindowLab />
      </section>

      <section id="lineage" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">네 번의 설계 전환으로 최소 계보 닫기</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
          제품 목록을 외우지 않는다. MHA 기준에서 저장 head, 직접 가시 범위, 저장 좌표, layer cadence가 차례로 바뀌는 네 번만 읽는다.
        </p>

        <div className="divide-y divide-border border-y border-border" data-kv-core-chapters>
          <KvChapter
            order="01"
            year="2023"
            title="GQA · MHA와 MQA 사이의 저장 head 선택"
            role="KV head 공유"
            facts={[["Hq heads", 'query 유지'], ['G groups', 'KV head'], ['G=Hq', 'MHA'], ['G=1', 'MQA']]}
            previous="MHA의 여러 query 관점과 causal attention 계산은 유지한다."
            decision="Query head를 G개 group으로 나누고 group마다 key head 하나와 value head 하나를 공유한다. G가 1이면 MQA, query head 수와 같으면 MHA다."
            execution="KV projection과 token당 cache width가 Hq에서 G로 줄어든다. Decode 때 읽어야 할 K/V memory traffic도 줄지만 query와 output path는 그대로 남는다."
            why="MQA의 강한 공유가 만드는 품질 손실과 MHA의 큰 decode cache 사이에서 중간점을 고른다. 원 논문은 기존 MHA checkpoint를 적은 추가 학습으로 GQA로 바꾸는 방법도 제안했다."
            boundary="원 논문의 quality·speed 결과는 사용한 T5 계열과 uptraining 조건에 묶인다. Hq/Hkv 비율만 보고 새 모델의 품질을 예측할 수 없다."
            sourceLabel="Ainslie et al. · GQA"
            sourceHref="https://arxiv.org/abs/2305.13245"
          />

          <KvChapter
            order="02"
            year="2023"
            title="Mistral 7B · 저장 head와 직접 window를 함께 줄이기"
            role="GQA + sliding window"
            facts={[["32 layers", 'depth'], ['32 / 8', 'Q / KV heads'], ['4,096', 'window'], ['8 layers', '32K 이론 도달폭']]}
            previous="GQA로 여러 query가 더 적은 K/V를 공유하는 저장 계약을 가져온다."
            decision="각 layer의 직접 attention을 최근 4,096 token으로 제한한다. 연속 local layer를 거치며 계산 그래프의 도달 범위는 layer마다 넓어진다."
            execution="Decode에서 각 layer가 읽는 cache 길이는 전체 context가 아니라 window에서 상한을 갖는다. 8개 layer를 거치면 이론상 32K 규모의 과거와 경로가 이어질 수 있다."
            why="긴 sequence에서 모든 layer가 모든 과거 token을 다시 읽는 memory traffic을 줄인다. GQA는 폭, SWA는 길이를 줄여 서로 다른 두 축을 동시에 건드린다."
            boundary="논문의 'arbitrary length' 표현은 고정 memory로 sequence를 진행할 수 있다는 구조 특성이다. 임의 거리의 사실을 정확히 검색한다는 보증이 아니다."
            sourceLabel="Jiang et al. · Mistral 7B"
            sourceHref="https://arxiv.org/abs/2310.06825"
          />

          <KvChapter
            order="03"
            year="2024"
            title="DeepSeek-V2 · K/V를 공유 latent 좌표로 저장하기"
            role="Multi-head Latent Attention"
            facts={[["60 layers", 'depth'], ['512', 'KV latent dc'], ['64', 'RoPE key dr'], ['69,120 B', 'fp16 cache/token']]}
            previous="여러 query head가 같은 과거 정보를 읽는 attention 목적은 유지한다."
            decision="Head별 K/V 전체 대신 low-rank joint KV latent를 저장한다. Position-sensitive RoPE key는 작은 별도 성분으로 떼어 content up projection의 inference 흡수를 가능하게 한다."
            execution="Token·layer당 저장 폭이 MHA의 2Hqdh나 GQA의 2Hkvdh가 아니라 dc+dr이 된다. 60 layers, dc=512, dr=64, fp16이면 sequence token 하나당 69,120 bytes다."
            why="GQA보다 더 작은 cache를 얻으면서 계산 시 head별 content 해석을 유지하려 한다. 저장 좌표와 attention 계산 좌표를 분리한 것이 핵심이다."
            boundary="DeepSeek-V2의 93.3% cache 감소와 throughput은 저자 배포 조건의 측정값이다. MLA 자체의 보편적 절감률로 사용하지 않는다."
            sourceLabel="DeepSeek-AI · DeepSeek-V2"
            sourceHref="https://arxiv.org/abs/2405.04434"
          />

          <KvChapter
            order="04"
            year="2025"
            title="Gemma 3 27B · local cache와 global cache를 층별로 분리하기"
            role="5 local : 1 global"
            facts={[["62 layers", 'depth'], ['52 / 10', 'local / global'], ['1,024', 'local window'], ['128K', 'extended context']]}
            previous="GQA와 decoder-only dense block을 유지한다."
            decision="5개 local layer마다 1개 global layer를 배치하고 local window를 1,024로 줄인다. Global과 local layer의 RoPE frequency도 다르게 둔다."
            execution="Local layer의 KV cache는 1,024 token에서 멈추고 global layer cache만 context 전체와 함께 증가한다. 62층은 6으로 나누어떨어지지 않아 공개 schedule을 펼치면 52 local, 10 global과 마지막 local tail이 남는다."
            why="128K 전체를 모든 layer가 full attention으로 처리할 때 생기는 KV memory 폭증을 줄인다. 원 보고서는 local/global ratio와 window ablation을 따로 제시한다."
            boundary="128K는 training extension과 평가 범위다. 보고서도 그보다 더 늘리면 성능이 빠르게 저하된다고 밝힌다. 지원 길이를 무한 외삽으로 해석하지 않는다."
            sourceLabel="Google DeepMind · Gemma 3 Technical Report"
            sourceHref="https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf"
          />
        </div>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다시 현재 모델을 읽는 일곱 단계</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            이제 2026 모델 카드로 돌아간다. Compressed attention, sliding/global, 1M context 같은 단어가 함께 있어도 한 기능으로 묶지 않는다.
            다음 순서로 config와 보고서를 읽으면 공개되지 않은 구현을 추측하지 않고도 비용이 이동한 위치를 찾을 수 있다.
          </p>
          <CapabilityCheck
            items={[
              'Prefill prompt 길이와 decode 중 유지할 sequence 수를 먼저 분리한다.',
              'B·L·N·Hkv·dh·dtype으로 GQA/MHA KV byte를 계산한다.',
              'MLA라면 KV head 수 대신 실제로 cache하는 latent와 position 성분을 찾는다.',
              'RoPE와 NoPE가 적용되는 layer·head를 구분하고 위치 성분이 cache와 projection 흡수에 주는 차이를 찾는다.',
              'Local/global layer 수와 window를 펼쳐 mixed cache와 decode read 길이를 계산한다.',
              '직접 가시 범위, 계산 그래프의 도달 가능성, retrieval accuracy를 세 문장으로 나눈다.',
              'Vendor context 상한과 throughput을 hardware·precision·batch 조건이 있는 측정값으로 읽는다.',
            ]}
          />
          <p>
            다음 글은 <Link to={articlePath('ai', 'llm-architecture-sparse-moe')}>Sparse MoE</Link>다. 여기까지는 attention이 과거를 저장하고 읽는 비용을 줄였다.
            다음에는 FFN을 router와 expert로 바꿔 전체 지식 용량과 token당 활성 계산을 분리한다.
          </p>
          <SourceNotes
            sources={[
              { label: 'Ainslie et al. · GQA', href: 'https://arxiv.org/abs/2305.13245', note: 'MHA·GQA·MQA의 KV head 공유 경계와 uptraining 의도를 확인한다.' },
              { label: 'Jiang et al. · Mistral 7B', href: 'https://arxiv.org/abs/2310.06825', note: 'GQA와 sliding-window attention을 결합한 원래 실행 동기를 확인한다.' },
              { label: 'DeepSeek-AI · DeepSeek-V2', href: 'https://arxiv.org/abs/2405.04434', note: 'MLA low-rank KV joint compression, decoupled RoPE와 cache width를 확인한다.' },
              { label: 'Kazemnejad et al. · NoPE length generalization', href: 'https://proceedings.neurips.cc/paper_files/paper/2023/hash/4e85362c02172c0c6567ce593122d31c-Abstract-Conference.html', note: '명시적 positional encoding이 없는 causal decoder인 NoPE의 정의와 길이 일반화 실험 범위를 확인한다.' },
              { label: 'Google DeepMind · Gemma 3 Technical Report', href: 'https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf', note: '5:1 local/global ratio, 1,024 window, 128K extension의 측정 범위를 확인한다.' },
              { label: 'DeepSeek · DeepSeek-V4-Flash Technical Report', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf', note: 'V4-Flash의 compressed long-range path 근거다. 위 V4 Pro 비교 도식의 세부 config를 증명하는 출처로 사용하지 않는다.' },
              { label: 'Google · Gemma 4 12B release', href: 'https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12B/', note: 'Gemma 4 12B의 공개 범위만 확인한다. 위 31B 비교 도식의 세부 config와 vendor 성능 주장은 별도 검증 대상으로 남긴다.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function KvChapter({
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
}: KvChapterProps) {
  return (
    <article data-kv-core-chapter className="py-9 first:pt-6 last:pb-6">
      <header className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-4xl font-black text-foreground/15">{order}</p>
          <p className="mt-1 font-mono text-xs font-bold text-muted-foreground">{year}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">{role}</p>
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
        <ChapterBand label="앞 모델에서 유지" text={previous} tone="bg-background" />
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
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
