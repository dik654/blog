import { Link } from 'react-router-dom';
import { CitationBlock } from '@/components/ui/citation';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import {
  TritonKernelFlowViz,
  TritonProgramMappingLab,
} from './triton-kernel-programming/viz/TritonKernelViz';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <M display className="my-0 text-[13px] sm:text-base">{latex}</M>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function Gate({
  index,
  title,
  pass,
  failure,
}: {
  index: string;
  title: string;
  pass: string;
  failure: string;
}) {
  return (
    <div className="not-prose grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]">
      <p className="font-mono text-lg font-black text-muted-foreground">{index}</p>
      <p className="text-sm font-bold">{title}</p>
      <div className="min-w-0 text-xs leading-relaxed">
        <p><strong>통과:</strong> {pass}</p>
        <p className="mt-1 text-muted-foreground"><strong>실패 신호:</strong> {failure}</p>
      </div>
    </div>
  );
}

export default function TritonKernelProgrammingArticle() {
  return (
    <div className="space-y-16">
      <section id="program-model" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Triton Program은 CUDA Thread 하나가 아니다</h2>
        <QuestionLead
          question="길이 17인 vector를 BLOCK_SIZE 8로 처리하면 kernel instance는 몇 개가 필요하고, 마지막 7개 빈 자리는 누가 막을까?"
          answer="Program은 3개가 필요하다. 각 program이 8개 offset 묶음을 만들고, 마지막 program의 offset 17~23은 mask가 load와 store에서 제외한다. 이 grid·offset·mask 계약을 먼저 잡아야 matmul과 attention kernel도 읽을 수 있다."
        />
        <ConceptPrimer
          items={[
            {
              term: 'Program instance',
              meaning: '같은 Triton kernel 함수를 서로 다른 program_id로 실행하는 SPMD 작업 단위다.',
              why: 'Triton code를 CUDA thread 단위로 번역하려 하면 tl.arange와 block tensor 연산을 잘못 이해한다.',
            },
            {
              term: 'Block tensor',
              meaning: '한 program이 register·on-chip memory 위에서 함께 다루는 값 묶음이다.',
              why: '원소별 loop보다 tile의 shape, layout, load와 reduction을 직접 표현하기 위해서다.',
            },
            {
              term: 'Meta-parameter',
              meaning: 'BLOCK_SIZE, num_warps처럼 compile 시 kernel 형태를 바꾸는 값이다.',
              why: '입력 값과 달리 주소 shape와 compiler specialization에 관여하므로 autotune 후보가 된다.',
            },
            {
              term: 'Reference implementation',
              meaning: '같은 연산 의미를 가진 PyTorch나 신뢰 가능한 baseline이다.',
              why: '빠른 kernel이 틀린 답을 내면 최적화가 아니라 다른 연산이기 때문이다.',
            },
          ]}
        />
        <TritonKernelFlowViz />
        <Formula
          latex={String.raw`
            \underbrace{P}_{\text{실행할 program 수}}
            =\left\lceil\frac{\underbrace{N}_{\text{유효 원소 수}}}
            {\underbrace{B}_{\text{program당 원소 수}}}\right\rceil,\qquad
            \underbrace{i}_{\text{논리 offset}}
            =\underbrace{\mathrm{pid}}_{\text{program 번호}}B+\underbrace{r}_{0,\ldots,B-1},
            \quad \underbrace{i<N}_{\text{memory 접근 mask}}
          `}
          meaning="왜 N을 B로 나누고 올림할까: 내림하면 마지막 일부 원소를 아무 program도 맡지 못한다. 올림하면 빈 lane이 생기므로 i<N 비교가 그 주소의 load·store를 차단한다. 둘을 함께 써야 모든 유효 원소를 정확히 한 번 덮는다."
          symbols={[
            [String.raw`N`, '실제로 처리해야 하는 원소 수다.'],
            [String.raw`B`, 'BLOCK_SIZE. 한 program이 만드는 offset 수다.'],
            [String.raw`P`, 'launch grid의 1차원 program 개수다.'],
            [String.raw`\mathrm{pid}`, 'tl.program_id(0)로 얻는 현재 program 번호다.'],
            [String.raw`r`, 'tl.arange(0, B)가 만든 program 내부 상대 위치다.'],
          ]}
        />
        <TritonProgramMappingLab />
        <CitationBlock
          source="Triton · Vector Addition tutorial"
          citeKey={1}
          href="https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html"
        >
          <p>공식 첫 tutorial은 program_id, block_start, tl.arange, tail mask와 cdiv grid를 같은 최소 예제로 묶고, reference 결과와 throughput을 함께 검증한다.</p>
        </CitationBlock>
        <Misconception>
          BLOCK_SIZE를 크게 만들면 program 수는 줄지만 무조건 빨라지지는 않는다. 처리할 값과 중간값이 늘어 register pressure가 커지고,
          동시에 resident할 program 수가 줄 수 있다. Grid 수만 보고 occupancy를 판단하면 안 된다.
        </Misconception>
      </section>

      <section id="pointer-mask" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Shape는 논리 좌표이고 Stride가 실제 주소를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tensor의 <strong>shape</strong>는 몇 행 몇 열인지 말한다. <strong>stride</strong>는 한 축으로 한 칸 이동할 때
            pointer가 몇 원소 이동하는지 말한다. Transpose나 slice는 같은 storage를 다른 stride로 볼 수 있다.
            따라서 contiguous 입력에서 우연히 맞은 주소식은 일반 tensor 계약이 아니다.
          </p>
        </div>
        <Formula
          latex={String.raw`
            \underbrace{\operatorname{addr}(i,j)}_{\text{실제 원소 주소}}
            =\underbrace{p_0}_{\text{storage 시작 주소}}
            +\underbrace{i\,s_i}_{\text{행 이동}}
            +\underbrace{j\,s_j}_{\text{열 이동}}
          `}
          meaning="왜 좌표에 stride를 곱할까: i와 j는 논리적인 칸 수이고, memory에서는 축마다 실제 간격이 다를 수 있다. 각 축의 이동량을 원소 간격으로 바꾼 뒤 더해야 transpose·slice·batched layout에서도 올바른 주소가 된다."
          symbols={[
            [String.raw`p_0`, 'Tensor storage의 기준 pointer다.'],
            [String.raw`i,j`, '읽으려는 논리 행과 열 좌표다.'],
            [String.raw`s_i,s_j`, '각 축으로 한 칸 이동할 때 건너뛸 원소 수다.'],
            [String.raw`\operatorname{addr}(i,j)`, 'tl.load나 tl.store가 사용할 원소 pointer다.'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['직접 pointer 산술', 'offset tensor와 stride를 직접 조합한다.', '작은 1D·2D kernel에서 주소가 투명하다.', 'mask와 broadcast shape를 직접 맞춰야 한다.'],
            ['Block pointer', 'base, shape, strides, offsets, block_shape와 order를 묶는다.', '규칙적인 tile 이동과 boundary check를 compiler에 더 명시적으로 전달한다.', 'layout 의미를 이해하지 않고 order만 바꾸면 coalescing이 무너질 수 있다.'],
            ['Mask / boundary_check', '유효 영역 밖의 memory operation을 막고 load의 other 값을 정한다.', '홀수 shape와 padding을 안전하게 처리한다.', '감춘 값이 reduction을 오염하지 않도록 softmax에는 -∞처럼 의미에 맞는 other가 필요하다.'],
          ].map(([term, contract, use, risk]) => (
            <div key={term} className="grid min-w-0 gap-3 py-4 md:grid-cols-[8rem_repeat(3,minmax(0,1fr))]">
              <p className="text-sm font-bold">{term}</p>
              <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">계약</strong><br />{contract}</p>
              <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">쓸 때</strong><br />{use}</p>
              <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">실패</strong><br />{risk}</p>
            </div>
          ))}
        </div>
        <StopRule>
          첫 kernel은 contiguous만 지원한다고 명시해도 된다. 대신 wrapper에서 stride 조건을 assert하거나,
          non-contiguous 입력을 별도 test해야 한다. 조용히 틀린 주소를 허용하지 않는다.
        </StopRule>
      </section>

      <section id="fusion-reduction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fusion은 Kernel 수가 아니라 HBM 왕복을 줄이는 선택이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Row-wise softmax를 framework 연산 다섯 개로 표현하면 각 단계의 중간 tensor가 DRAM에 materialize될 수 있다.
            Triton 공식 tutorial은 row가 GPU SRAM에 들어오는 특정 행렬군에서 한 program이 load, max, subtract, exp, sum,
            divide와 store를 이어 수행한다. 이 조건을 빼고 “Triton softmax는 항상 빠르다”고 말하면 틀린다.
          </p>
        </div>
        <Formula
          latex={String.raw`
            \underbrace{R_{\mathrm{naive}}+W_{\mathrm{naive}}}_{\text{중간 tensor 포함 원소 이동}}
            \approx\underbrace{(5MN+2M)}_{\text{read}}
            +\underbrace{(3MN+2M)}_{\text{write}},
            \qquad
            \underbrace{R_{\mathrm{fused}}+W_{\mathrm{fused}}}_{\text{이상적 단일 pass}}
            \approx\underbrace{MN}_{\text{input read}}+\underbrace{MN}_{\text{output write}}
          `}
          meaning="왜 read와 write를 더할까: bandwidth-bound kernel의 시간은 산술 횟수보다 DRAM을 오간 전체 원소 수에 강하게 묶인다. Fusion은 softmax 수식을 바꾸지 않고 중간 결과의 write와 재-read를 없앤다. 다만 실제 traffic은 cache, padding, dtype과 compiler schedule 때문에 이 이상식과 다를 수 있다."
          symbols={[
            [String.raw`M,N`, '입력 행렬의 행과 열 수다.'],
            [String.raw`R,W`, 'DRAM에서 읽고 쓰는 원소 수의 교육용 장부다.'],
            [String.raw`\mathrm{naive}`, '연산별 중간 tensor가 materialize되는 구현이다.'],
            [String.raw`\mathrm{fused}`, '입력을 한 번 읽고 출력을 한 번 쓰는 이상적 fused 경로다.'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Masked lane은 softmax max와 sum에 들어가면 안 된다. 그래서 공식 예제는 범위 밖 load에
            <M>{String.raw`-\infty`}</M>를 넣는다. 최댓값에서는 선택되지 않고, 안정화 뒤 exp는 0이 되어 denominator에도 기여하지 않는다.
            이처럼 <code>other</code>는 단순한 0 padding이 아니라 연산의 항등원·흡수원과 맞아야 한다.
          </p>
          <p>
            Triton의 빠른 exp는 근사 명령을 사용할 수 있다. Reference와 비교할 때 dtype별 허용 오차, NaN·Inf 정책과
            극단값 분포를 함께 정해야 한다. Bitwise equality가 목표인지, 모델 계약에 맞는 수치 오차가 목표인지 먼저 고른다.
          </p>
        </div>
        <CitationBlock
          source="Triton · Fused Softmax tutorial"
          citeKey={2}
          href="https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html"
        >
          <p>공식 tutorial은 naive softmax의 read/write 장부, power-of-two padding과 mask, reduction, register·shared-memory 기반 occupancy 계산을 한 흐름에서 보여 준다.</p>
        </CitationBlock>
      </section>

      <section id="autotune" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Autotune은 마법이 아니라 제한된 후보의 실측 검색이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Matmul tile은 재사용을 늘리면 register와 shared memory가 늘고, 작게 잡으면 load와 loop가 늘어난다.
            <code>@triton.autotune</code>은 작성자가 준 config 후보를 shape key별로 실행해 그 환경에서 빠른 후보를 고른다.
            후보에 없는 schedule은 발견하지 못하고, 처음 만난 key에서는 compile·측정 비용이 생긴다.
          </p>
        </div>
        <Formula
          latex={String.raw`
            \underbrace{c^\star(M,N,K,d,h)}_{\text{선택된 config}}
            =\underset{\underbrace{c\in\mathcal C}_{\text{작성자가 준 후보}}}{\arg\min}\;
            \underbrace{\operatorname{median}T(c;M,N,K,d,h)}_{\text{warmup 뒤 반복 시간}}
          `}
          meaning="왜 argmin을 쓸까: 목표는 후보 config 중 측정 시간이 가장 작은 하나를 고르는 것이기 때문이다. Median은 일시적 지연의 영향을 줄이지만, shape·dtype·hardware가 바뀌면 승자도 바뀐다. 따라서 key에 실제 성능을 가르는 축을 넣고 후보 집합과 측정 환경을 기록해야 재현할 수 있다."
          symbols={[
            [String.raw`\mathcal C`, 'BLOCK_M/N/K, num_warps, num_stages 등을 묶은 유한 후보 집합이다.'],
            [String.raw`M,N,K`, '문제의 matmul shape다.'],
            [String.raw`d,h`, 'dtype과 hardware/backend 조건을 줄여 쓴 기호다.'],
            [String.raw`T`, 'compile과 불필요한 host overhead를 분리해 측정한 kernel 시간이다.'],
            [String.raw`c^\star`, '해당 key와 측정 환경에서 고른 config다.'],
          ]}
        />
        <div className="not-prose border-y border-border">
          {[
            ['01 · correctness first', '모든 후보가 reference와 같은 의미를 계산하는지 먼저 검사한다. 빠른 오답은 후보에서 제거한다.'],
            ['02 · representative keys', '실제 traffic의 작은·중간·큰 shape와 odd shape를 key corpus로 만든다. 한 정사각형 matmul만 쓰지 않는다.'],
            ['03 · cold vs warm', '첫 compile/autotune 지연과 cache hit 뒤 steady-state 지연을 따로 기록한다. 제품 첫 요청에는 둘 다 중요하다.'],
            ['04 · topology boundary', 'GPU 세대, CUDA/ROCm backend와 compiler version이 바뀌면 cache와 승자를 다시 검증한다.'],
          ].map(([label, body]) => (
            <div key={label} className="grid gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <p className="font-mono text-xs font-black">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <CitationBlock
          source="Triton · Matrix Multiplication tutorial"
          citeKey={3}
          href="https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html"
        >
          <p>공식 matmul tutorial은 M·N·K를 key로 둔 config autotune, program_id의 2D tile 매핑과 L2 재사용을 위한 grouped ordering을 함께 설명한다.</p>
        </CitationBlock>
      </section>

      <section id="compiler-debug" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Compiler를 믿되, 경계에서 IR과 실행을 확인한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Triton frontend는 block tensor와 memory 계약을 받고, Triton IR과 target-aware GPU IR, LLVM IR을 거쳐
            backend code로 낮춘다. 이 층을 모두 외울 필요는 없다. 다만 성능이 설명과 다를 때 generated code가
            원하는 vectorized load, matrix instruction과 memory movement를 만들었는지 확인할 통로는 알아야 한다.
          </p>
          <p>
            Debug도 층별로 나눈다. Compile-time shape와 meta-parameter는 <code>static_assert</code>·<code>static_print</code>,
            GPU runtime 값은 <code>device_assert</code>·<code>device_print</code>, 작은 kernel의 논리 흐름은 interpreter,
            memory 오류는 sanitizer와 profiler로 좁힌다. Interpreter는 CPU에서 program instance를 순서대로 실행하므로
            일부 dtype과 간접 memory access를 그대로 재현하지 못한다.
          </p>
        </div>
        <div className="not-prose my-8">
          <Gate
            index="01"
            title="의미"
            pass="reference와 dtype별 tolerance, NaN·Inf 정책이 일치한다."
            failure="대표 random input만 맞고 극단값·zero-size·odd tail에서 다르다."
          />
          <Gate
            index="02"
            title="주소"
            pass="odd shape, non-contiguous stride와 boundary mask corpus를 통과한다."
            failure="block 배수 shape만 test했거나 masked load의 other가 reduction을 바꾼다."
          />
          <Gate
            index="03"
            title="자원"
            pass="register, shared memory와 occupancy를 후보 config별로 기록한다."
            failure="큰 tile이 microbenchmark 하나에서는 빠르지만 다른 shape에서 spill·occupancy 저하를 만든다."
          />
          <Gate
            index="04"
            title="시간"
            pass="warmup·동기화·반복·quantile과 compile 포함 여부가 명시된다."
            failure="비동기 launch 직후 host 시간이나 최초 JIT 시간을 steady-state와 섞는다."
          />
          <Gate
            index="05"
            title="효과"
            pass="GB/s·TFLOPS뿐 아니라 전체 model step에서 차지하는 비중을 측정한다."
            failure="kernel 2배 향상이 실제 end-to-end latency에서는 소음 수준이다."
          />
          <Gate
            index="06"
            title="이식"
            pass="GPU, driver, Triton/compiler version과 지원 backend를 고정하거나 재검증한다."
            failure="한 backend의 lowering과 tolerance를 다른 hardware의 보장으로 말한다."
          />
        </div>
        <CitationBlock
          source="Triton · Debugging guide"
          citeKey={4}
          href="https://triton-lang.org/main/programming-guide/chapter-3/debugging.html"
        >
          <p>공식 guide는 compile-time, device runtime, CPU interpreter와 외부 sanitizer를 서로 다른 디버깅 층으로 분리한다.</p>
        </CitationBlock>
        <Misconception>
          Triton이 CUDA를 “없애는” 것은 아니다. CUDA thread·warp를 직접 배치하는 대신 block tensor와 data layout을 기술하고
          compiler가 target code로 낮춘다. 그래서 생산성은 높아질 수 있지만 memory hierarchy, occupancy와 profiler 지식은 여전히 필요하다.
        </Misconception>
        <CapabilityCheck
          items={[
            'N과 BLOCK_SIZE가 주어졌을 때 grid, offset과 tail mask를 손으로 계산할 수 있다.',
            'Shape와 stride를 분리하고 transpose·slice 입력의 주소식을 설명할 수 있다.',
            'Fusion의 이득을 kernel 수가 아니라 제거한 HBM read/write로 계산할 수 있다.',
            'Autotune 결과를 shape·dtype·hardware에 한정하고 cold/warm 비용을 분리할 수 있다.',
            'Reference, odd shape, sanitizer, IR dump와 profiler를 순서대로 사용해 실패를 좁힐 수 있다.',
            'Triton을 FlashAttention 알고리즘 자체와 구분하고 상위 사례와 CUDA 바닥으로 이동할 수 있다.',
          ]}
        />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
          <Link
            to={articlePath('gpu', 'flashattention-io-triton')}
            className="min-w-0 border-t border-border pt-4 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            상위 사례 · FlashAttention IO schedule
          </Link>
          <Link
            to={articlePath('gpu', 'cuda-matrix-multiply')}
            className="min-w-0 border-t border-border pt-4 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            계산 바닥 · CUDA tiled matmul
          </Link>
          <Link
            to={articlePath('gpu', 'cuda-perf-analysis')}
            className="min-w-0 border-t border-border pt-4 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            검증 바닥 · CUDA performance analysis
          </Link>
        </div>
        <SourceNotes
          sources={[
            {
              label: 'Triton Vector Addition tutorial',
              href: 'https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html',
              note: 'program_id, offsets, mask, cdiv grid와 reference/benchmark의 최소 계약.',
            },
            {
              label: 'Triton Fused Softmax tutorial',
              href: 'https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html',
              note: 'fusion traffic, reduction, padding과 resource-aware persistent schedule.',
            },
            {
              label: 'Triton Matrix Multiplication tutorial',
              href: 'https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html',
              note: 'tile mapping, grouped ordering, autotune config와 cuBLAS 비교 경로.',
            },
            {
              label: 'Triton make_block_ptr API',
              href: 'https://triton-lang.org/main/python-api/generated/triton.language.make_block_ptr.html',
              note: 'base, shape, strides, offsets, block_shape와 order의 공식 계약.',
            },
            {
              label: 'Triton Debugging guide',
              href: 'https://triton-lang.org/main/programming-guide/chapter-3/debugging.html',
              note: 'static/device 검사, interpreter와 sanitizer의 역할 경계.',
            },
            {
              label: 'Triton official repository',
              href: 'https://github.com/triton-lang/triton',
              note: 'compiler, backend 지원 범위와 IR/debug 환경 변수의 현재 기준.',
            },
          ]}
        />
      </section>
    </div>
  );
}
