import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { AttentionIOLab } from './flashattention-io-triton/viz/FlashAttentionExplorers';

export default function FlashAttentionIoTritonArticle() {
  return (
    <div className="space-y-16">
      <section id="io-bottleneck" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">왜 attention은 계산량만 세면 틀리는가</h2>
        <QuestionLead
          question="FlashAttention은 근사 attention인가, 아니면 같은 답을 다른 순서로 계산하는가?"
          answer="기본 FlashAttention은 exact attention이다. QKᵀ, softmax, V 곱의 수학을 바꾸지 않고, N×N 중간 배열을 HBM에 완성해 두지 않도록 tile 순서와 online softmax를 바꾼다. 그래서 핵심 단어는 sparse가 아니라 IO-aware다."
        />
        <ConceptPrimer items={[
          { term: 'HBM', meaning: 'GPU의 큰 global memory. 용량은 크지만 on-chip SRAM보다 멀다.', why: '같은 tensor를 여러 번 읽고 쓰면 Tensor Core가 빨라도 memory 대기에서 멈춘다.' },
          { term: 'SRAM tile', meaning: '한 thread block이 잠시 재사용할 Q·K·V 조각.', why: '작은 조각 안에서 score, softmax, value 누적을 끝내면 N×N 배열을 밖에 저장하지 않아도 된다.' },
          { term: 'Fusion', meaning: '여러 연산 사이의 materialized tensor를 없애 하나의 kernel 안에서 이어 계산하는 것.', why: 'launch 수보다 더 중요한 효과는 HBM 왕복 감소다.' },
          { term: 'Exactness', meaning: '반올림 오차 범위에서 표준 attention과 같은 수학적 출력을 계산한다.', why: 'linear/sparse attention처럼 모델의 mixing rule을 바꾸는 방법과 구분해야 한다.' },
        ]} />
        <AttentionIOLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <M display>{String.raw`\underbrace{O}_{\text{token별 출력}}=\operatorname{softmax}\!\left(\underbrace{QK^\top/\sqrt d}_{\text{모든 query-key score}}\right)\underbrace{V}_{\text{가져올 value}}`}</M>
          <FormulaNote meaning="표준 구현과 FlashAttention이 공유하는 계산 계약이다. 달라지는 것은 괄호 안의 N×N score와 probability를 언제 어디에 저장하느냐다." symbols={[["Q,K,V", 'query, key, value 행렬'], ["N", 'sequence의 token 수'], ["d", '한 attention head의 차원'], ["O", '같은 exact attention 출력']]} />
          <p>단순 구현은 score를 HBM에 쓰고 softmax가 다시 읽은 뒤 probability를 또 쓸 수 있다. sequence가 두 배면 이 중간 배열은 네 배가 된다. FlashAttention은 Q tile을 고정하고 K·V tile을 순회하면서 필요한 통계와 출력만 누적한다.</p>
          <CitationBlock source="Dao et al. · FlashAttention" citeKey={1} href="https://arxiv.org/abs/2205.14135"><p>원 논문은 attention을 IO-aware하게 재배열해 GPU HBM과 on-chip SRAM 사이의 read/write를 줄이는 exact algorithm으로 정의한다.</p></CitationBlock>
        </div>
      </section>

      <section id="online-softmax" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Online softmax: 뒤 tile이 더 큰 값이면 어떻게 고치는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>softmax는 행 전체의 최댓값과 지수합이 있어야 안정적으로 계산된다. tile 하나만 보고 정규화하면 다음 tile에서 더 큰 score가 나왔을 때 앞 결과가 틀린다. 해결은 앞의 최대값 <M>m</M>과 지수합 <M>{String.raw`\ell`}</M>을 새 최대값 기준으로 다시 축척하는 것이다.</p>
          <M display>{String.raw`\underbrace{m'}_{\text{새 기준 최대값}}=\max\!\left(\underbrace{m}_{\text{이전 tile 최대}},\underbrace{\max_j x_j}_{\text{새 tile 최대}}\right)`}</M>
          <M display>{String.raw`\underbrace{\ell'}_{\text{새 지수합}}=\underbrace{e^{m-m'}\ell}_{\text{이전 합을 새 기준으로 재축척}}+\underbrace{\sum_j e^{x_j-m'}}_{\text{새 tile 기여}}`}</M>
          <FormulaNote meaning="왜 이전 합에 지수를 곱하나: 이전에는 exp(x-m) 기준으로 더했으므로 기준을 m'으로 바꾸려면 모든 이전 항에 exp(m-m')를 한 번 곱해야 한다. 이 통계 덕분에 과거 score를 다시 보지 않아도 된다." symbols={[["x_j", '이번 K tile에서 얻은 score'], ["m,m'", '이전/갱신된 running maximum'], ["\\ell,\\ell'", '이전/갱신된 exp 합']]} />
          <p>출력 numerator도 같은 비율로 재축척하고 새 <M>{String.raw`e^{x_j-m'}V_j`}</M>를 더한다. 마지막에 <M>{String.raw`\ell'`}</M>로 나누면 행 전체를 한 번에 softmax한 값과 일치한다.</p>
        </div>
        <Misconception>“중간 배열을 저장하지 않는다”는 “기억을 전혀 쓰지 않는다”가 아니다. Q tile, K·V tile, running statistics와 output accumulator가 SRAM/register에 들어가야 하므로 head dimension과 tile shape가 여전히 중요하다.</Misconception>
      </section>

      <section id="tiling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tile 크기는 예쁜 정사각형이 아니라 자원 제약이 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>큰 tile은 K·V를 더 오래 재사용하지만 shared memory와 register를 많이 써 동시에 resident한 block 수를 줄인다. 작은 tile은 occupancy를 살릴 수 있지만 loop와 load가 늘어난다. 따라서 “FlashAttention on”만으로 속도를 예측할 수 없다.</p>
          <M display>{String.raw`\underbrace{M_{\mathrm{tile}}}_{\text{on-chip 필요량}}\approx M_Q+M_{KV}+M_{\mathrm{work}}`}</M>
          <M display>{String.raw`M_Q=B_rdb`}</M>
          <M display>{String.raw`M_{KV}=2B_cdb`}</M>
          <M display>{String.raw`M_{\mathrm{work}}=B_rB_cb_a`}</M>
          <FormulaNote meaning="왜 이 식을 보나: 가능한 Br·Bc를 hardware budget 안에서 고르고, register pressure 때문에 occupancy가 무너지지 않는지 확인하기 위해서다. 실제 kernel은 layout, double buffering과 accumulator dtype을 더 포함한다." symbols={[["B_r", '한 번에 처리할 query 행 수'], ["B_c", '한 번에 읽을 key/value 행 수'], ["b", '입력 원소당 byte'], ["b_a", 'accumulator 원소당 byte']]} />
          <p>긴 sequence에서 기본 구현이 IO-bound라면 효과가 커질 수 있다. 반대로 아주 짧은 sequence, 작은 head, 이미 fused된 backend, compute-bound shape에서는 launch·padding·occupancy 비용 때문에 개선이 작을 수 있다.</p>
        </div>
      </section>

      <section id="fa2-triton" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FlashAttention-2와 Triton은 같은 이름의 기술이 아니다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['FlashAttention', 'IO를 줄이는 attention algorithm과 schedule의 출발점.'],
            ['FlashAttention-2', 'query 축 parallelism, warp work partition과 non-matmul work를 개선한 두 번째 schedule.'],
            ['Triton', 'block 단위 load·dot·reduce·store를 기술하고 compiler가 GPU code를 만드는 language/compiler.'],
            ['Kernel fusion', 'softmax 같은 bandwidth-bound 연산 사이의 HBM materialization을 없애는 일반 설계 원리.'],
          ].map(([term, body]) => <div key={term} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)]"><p className="text-sm font-bold">{term}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Triton으로 fused attention을 쓸 수 있지만, Triton을 사용했다고 자동으로 FlashAttention의 IO schedule이 생기는 것은 아니다. 반대로 vendor kernel은 CUDA와 낮은 수준의 hardware feature를 직접 사용해 더 높은 peak를 노릴 수 있다. 중요한 것은 언어 이름이 아니라 load, tile, reduction, synchronization과 output write의 실제 trace다.</p>
          <CitationBlock source="FlashAttention official repository" citeKey={2} href="https://github.com/Dao-AILab/flash-attention"><p>공식 구현 저장소는 FlashAttention과 FlashAttention-2의 논문·지원 shape·build 경계를 함께 제공한다.</p></CitationBlock>
          <CitationBlock source="Triton · Fused Softmax tutorial" citeKey={3} href="https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html"><p>공식 tutorial은 행이 SRAM에 들어오는 조건에서 fusion이 bandwidth-bound softmax의 read/write를 줄이는 과정을 코드로 보인다.</p></CitationBlock>
        </div>
      </section>

      <section id="diagnose" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1.1배밖에 안 빨라졌을 때의 진단 순서</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['00 · share', 'attention이 전체 step time에서 차지하는 비율을 먼저 잰다. 20%라면 attention kernel이 무한히 빨라도 전체 상한은 1.25배다.'],
            ['01 · semantics', 'mask, dropout, causal, dtype와 output tolerance가 같은지 먼저 확인한다.'],
            ['02 · shape', 'sequence, batch×heads, head dimension이 충분한 parallel work와 재사용을 만드는지 본다.'],
            ['03 · traffic', 'N×N intermediate가 실제 baseline에 materialize됐는지 profiler bytes와 kernel trace로 본다.'],
            ['04 · compute', 'Tensor Core utilization이 이미 높다면 IO 절감보다 matmul compute가 상한일 수 있다.'],
            ['05 · occupancy', 'register/shared-memory 사용량 때문에 active warps가 줄었는지 tile 후보를 비교한다.'],
            ['06 · overhead·HW', '작은 batch에서 framework dispatch·kernel launch가 지배하는지, head dimension·dtype·GQA와 GPU SM 세대가 최적 kernel을 지원하는지 또는 fallback했는지 확인한다.'],
          ].map(([label, body]) => <div key={label} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="font-mono text-xs font-black">{label}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <CapabilityCheck items={[
          'FlashAttention과 sparse·linear attention의 의미 차이를 설명할 수 있다.',
          'Online softmax의 running max 재축척을 손으로 계산할 수 있다.',
          'N×N 중간 배열 크기와 tile on-chip budget을 대략 계산할 수 있다.',
          '속도 향상이 작을 때 Amdahl 상한, IO, compute, dispatch, shape와 occupancy를 분리해 진단할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'FlashAttention paper', href: 'https://arxiv.org/abs/2205.14135', note: 'IO-aware exact attention과 IO complexity의 기준점.' },
          { label: 'FlashAttention-2 paper', href: 'https://arxiv.org/abs/2307.08691', note: 'work partition과 parallelism 개선.' },
          { label: 'Triton tutorials', href: 'https://triton-lang.org/main/getting-started/tutorials/', note: 'fused softmax, matmul, fused attention의 공식 구현 경로.' },
        ]} />
      </section>
    </div>
  );
}
