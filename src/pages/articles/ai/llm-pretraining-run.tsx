import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerBridge,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

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
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const runStages = [
  {
    id: 'receipt',
    number: '01',
    label: '입력 영수증',
    action: '모델 구조, tokenizer, data manifest와 목표 token을 고정한다.',
    evidence: 'config hash · tokenizer hash · shard 목록 · mixture · code commit',
    failure: 'loss가 달라도 model과 data 중 무엇이 달라졌는지 되짚을 수 없다.',
  },
  {
    id: 'microbatch',
    number: '02',
    label: 'Micro-batch',
    action: '각 data-parallel rank가 서로 다른 sequence를 forward·backward한다.',
    evidence: 'sample id · token count · loss mask · overflow · step time',
    failure: 'padding과 document boundary를 실제 학습 token으로 잘못 센다.',
  },
  {
    id: 'sync',
    number: '03',
    label: 'Gradient 동기화',
    action: '누적이 끝난 뒤 rank별 gradient를 합치거나 shard별로 나눈다.',
    evidence: 'gradient norm · collective time · straggler rank · skipped step',
    failure: 'rank 하나의 NaN이나 느린 통신이 전체 update를 오염시킨다.',
  },
  {
    id: 'update',
    number: '04',
    label: 'Optimizer update',
    action: 'clip, learning-rate schedule과 Adam state로 같은 global step을 갱신한다.',
    evidence: 'global step · consumed token · learning rate · loss scale · norm',
    failure: 'GPU 수가 바뀌며 effective batch와 schedule이 조용히 달라진다.',
  },
  {
    id: 'checkpoint',
    number: '05',
    label: 'Checkpoint',
    action: '가중치뿐 아니라 optimizer, scheduler, sampler와 난수 상태를 저장한다.',
    evidence: 'manifest · shard checksum · save/load smoke test · retained fallback',
    failure: '재개는 되지만 같은 다음 batch와 learning rate에서 이어지지 않는다.',
  },
  {
    id: 'release',
    number: '06',
    label: '평가·중단',
    action: 'Clean held-out loss, capability slice와 처리량을 함께 비교한다.',
    evidence: 'domain loss · downstream score · memorization scan · tokens/s',
    failure: 'train loss가 내려간다는 이유만으로 나쁜 data recipe를 끝까지 태운다.',
  },
] as const;

function RunLedgerLab() {
  const [stage, setStage] = useState<(typeof runStages)[number]['id']>('receipt');
  const selected = runStages.find((item) => item.id === stage) ?? runStages[0];

  return (
    <div data-pretraining-run-ledger className="not-prose my-8 min-w-0 border-y border-border py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Run evidence ledger</p>
          <h3 className="mt-1 text-lg font-black">한 update가 재현 가능한 증거가 되는 순서</h3>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{selected.number} / 06</span>
      </div>
      <div role="tablist" aria-label="학습 run 단계" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {runStages.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === stage}
            onClick={() => setStage(item.id)}
            className={`min-h-16 rounded-md border px-3 py-2 text-left transition-colors ${
              item.id === stage
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background text-foreground hover:bg-muted/60'
            }`}
          >
            <span className="block font-mono text-[10px] font-black opacity-70">{item.number}</span>
            <span className="mt-1 block text-xs font-bold leading-4">{item.label}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4 grid min-h-56 gap-4 border-l-4 border-sky-500 bg-muted/25 p-4 sm:grid-cols-3 sm:p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase text-sky-700 dark:text-sky-300">실행</p>
          <p className="mt-2 text-sm font-semibold leading-6">{selected.action}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <p className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">남길 증거</p>
          <p className="mt-2 break-words font-mono text-xs leading-6 text-muted-foreground">{selected.evidence}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">없으면 생기는 일</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.failure}</p>
        </div>
      </div>
    </div>
  );
}

type ModelSize = 4 | 9;
type StateLayout = 'replicated' | 'optimizer-shard' | 'full-shard';

function BatchAndMemoryLab() {
  const [modelSize, setModelSize] = useState<ModelSize>(4);
  const [ranks, setRanks] = useState(8);
  const [accumulation, setAccumulation] = useState(8);
  const [stateLayout, setStateLayout] = useState<StateLayout>('full-shard');
  const sequenceLength = 4096;
  const microBatch = 1;
  const tokensPerUpdate = microBatch * ranks * accumulation * sequenceLength;
  const targetTokens = modelSize === 4 ? 80_000_000_000 : 180_000_000_000;
  const updates = Math.ceil(targetTokens / tokensPerUpdate);
  const modelStateGb = useMemo(() => {
    const parameters = modelSize * 1_000_000_000;
    if (stateLayout === 'optimizer-shard') return parameters * (6 + 12 / ranks) / 1_000_000_000;
    const totalBytes = parameters * 18;
    return totalBytes / (stateLayout === 'full-shard' ? ranks : 1) / 1_000_000_000;
  }, [modelSize, ranks, stateLayout]);

  return (
    <div data-pretraining-budget-ledger className="not-prose my-8 min-w-0 border-y border-border py-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase text-muted-foreground">Model</p>
            <div role="group" aria-label="모델 크기" className="grid grid-cols-2 gap-2">
              {[4, 9].map((size) => (
                <button key={size} type="button" onClick={() => setModelSize(size as ModelSize)} className={`rounded-md border px-3 py-2 text-sm font-bold ${modelSize === size ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>
                  {size}B
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="run-ranks" className="flex justify-between text-xs font-bold"><span>Data-parallel ranks</span><span className="font-mono">{ranks}</span></label>
            <input id="run-ranks" type="range" min="8" max="32" step="8" value={ranks} onChange={(event) => setRanks(Number(event.target.value))} className="mt-2 w-full" />
          </div>
          <div>
            <label htmlFor="run-accumulation" className="flex justify-between text-xs font-bold"><span>Gradient accumulation</span><span className="font-mono">{accumulation}</span></label>
            <input id="run-accumulation" type="range" min="4" max="16" step="4" value={accumulation} onChange={(event) => setAccumulation(Number(event.target.value))} className="mt-2 w-full" />
          </div>
          <div role="group" aria-label="모델 상태 배치" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => setStateLayout('replicated')} className={`min-h-11 rounded-md border px-3 py-2 text-xs font-bold ${stateLayout === 'replicated' ? 'border-amber-500 bg-amber-500/10' : 'border-border'}`}>DDP 복제</button>
            <button type="button" onClick={() => setStateLayout('optimizer-shard')} className={`min-h-11 rounded-md border px-3 py-2 text-xs font-bold ${stateLayout === 'optimizer-shard' ? 'border-sky-500 bg-sky-500/10' : 'border-border'}`}>Optimizer 분할</button>
            <button type="button" onClick={() => setStateLayout('full-shard')} className={`min-h-11 rounded-md border px-3 py-2 text-xs font-bold ${stateLayout === 'full-shard' ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'}`}>FSDP full shard</button>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          {[
            ['Update당 token', tokensPerUpdate.toLocaleString()],
            ['목표 update', updates.toLocaleString()],
            ['Rank당 model state', `${modelStateGb.toFixed(1)} GB`],
            ['고정 sequence', `${sequenceLength.toLocaleString()} token`],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background p-4 sm:p-5">
              <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-2 break-words font-mono text-lg font-black sm:text-xl">{value}</p>
            </div>
          ))}
          <p className="col-span-2 bg-background p-4 text-xs leading-6 text-muted-foreground">
            이 값은 BF16 parameter, FP32 main parameter·gradient, Adam moment를 합친 <strong className="text-foreground">18 byte/parameter 교육용 정상 상태 장부</strong>다. Optimizer 분할은 Megatron distributed optimizer의 6+12/d 근사를, full shard는 세 state를 모두 d개 rank로 나눈 이상적 근사를 쓴다. Peak activation, all-gather buffer, fragmentation과 kernel workspace는 별도로 더해야 한다.
          </p>
        </div>
      </div>
    </div>
  );
}

function RouteBand() {
  return (
    <div className="not-prose my-8 border-y border-border">
      <Link to={articlePath('ai', 'llm-pretraining-scaling')} className="grid gap-1 border-b border-border py-4 hover:bg-muted/30 sm:grid-cols-[10rem_1fr] sm:px-2">
        <strong className="text-sm">앞 · 예산</strong>
        <span className="text-sm text-muted-foreground">4B·9B, 목표 token과 전체 compute를 먼저 결정한다.</span>
      </Link>
      <Link to={articlePath('ai', 'llm-data-engine')} className="grid gap-1 border-b border-border py-4 hover:bg-muted/30 sm:grid-cols-[10rem_1fr] sm:px-2">
        <strong className="text-sm">앞 · 데이터</strong>
        <span className="text-sm text-muted-foreground">수집 source가 versioned token stream이 되는 recipe를 고정한다.</span>
      </Link>
      <Link to={articlePath('ai', 'training-pipeline')} className="grid gap-1 py-4 hover:bg-muted/30 sm:grid-cols-[10rem_1fr] sm:px-2">
        <strong className="text-sm">더 아래 · PyTorch</strong>
        <span className="text-sm text-muted-foreground">일반 Dataset, AMP, validation과 checkpoint 구현 세부가 더 필요할 때 내려간다.</span>
      </Link>
    </div>
  );
}

export default function LlmPretrainingRunArticle() {
  return (
    <>
      <section id="run-receipt" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 model과 data가 있어도 왜 run은 실패할까?</h2>
        <BeginnerBridge title="설계도와 재료가 같아도 공장 기록이 끊기면 같은 제품을 다시 만들 수 없습니다.">
          <InternalLink slug="llm-pretraining-scaling">모델 크기와 token 예산</InternalLink>, 그리고 <InternalLink slug="llm-data-engine">실제로 읽힐 data</InternalLink>를 앞에서 정했다. 이제 <strong className="text-foreground">training run</strong>은 그 재료를 batch로 꺼내 예측하고,
          오차를 계산해 model 숫자를 갱신하는 일을 수십만 번 반복하는 전체 실행을 뜻한다. <strong className="text-foreground">train.py</strong>는 그 실행을 시작하는 프로그램일 뿐이며,
          어느 data에서 멈췄고 어떤 숫자를 저장했는지까지 남겨야 중단 뒤 같은 학습을 이어 갈 수 있다.
        </BeginnerBridge>
        <QuestionLead
          question="4B 모델, 80B token, 정제된 data recipe를 골랐다. 이제 train.py를 실행하면 결정이 끝난 것일까?"
          answer="아니다. Global batch의 실제 token 수, rank별 sample cursor, model state memory, collective 통신, optimizer·scheduler, checkpoint와 clean evaluation을 하나의 run contract로 묶어야 한다. 그래야 중단 뒤 같은 update에서 이어지고, 4B와 9B 결과의 차이를 model·data·systems 원인으로 분리할 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Run contract', meaning: '누가 같은 학습을 다시 실행해도 입력, 상태 전이와 평가가 일치하게 만드는 명세다.', why: '명령어 한 줄이 아니라 model·data·optimizer·parallelism·checkpoint의 결합을 version으로 고정한다.' },
          { term: 'Rank', meaning: '분산 학습에 참여하는 한 process의 번호와 역할이다.', why: '각 rank가 다른 sample과 model shard를 맡으므로 어느 rank에서 오류가 났는지 기록해야 한다.' },
          { term: 'Micro-batch', meaning: '한 rank가 한 번의 forward·backward에서 처리하는 작은 batch다.', why: 'GPU memory에 맞추고 여러 번 gradient를 누적해 더 큰 global batch를 만든다.' },
          { term: 'Checkpoint', meaning: '학습을 같은 상태에서 재개하기 위해 저장한 model과 실행 상태 묶음이다.', why: '가중치만 저장하면 optimizer momentum, data 위치와 난수열이 달라져 같은 run이 아니다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>앞 글의 결과는 “9B가 더 좋아 보인다” 같은 인상이 아니라 영수증이어야 한다. Model config와 tokenizer hash, 목표 token, data shard와 mixture version, clean evaluation set, 허용 비용과 중단 조건을 한 manifest에 적는다. 이 값 가운데 하나라도 바뀌면 같은 run의 재시작이 아니라 새 실험이다.</p>
          <p>먼저 100~1,000 update의 pilot을 닫는다. Data load, forward, backward, 분산 동기화, optimizer update, checkpoint save·load, held-out evaluation을 모두 통과한 뒤에만 full run을 연다. 더 많은 GPU는 이 계약을 자동으로 만들어 주지 않고, 틀린 계약을 더 비싸게 반복할 뿐이다.</p>
        </div>
        <RunLedgerLab />
      </section>

      <section id="token-batch" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Batch size보다 “update당 유효 token”을 센다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>LLM pre-training에서 sample 하나는 보통 고정 길이 token sequence다. 하지만 padding, 문서 경계 mask, 잘린 마지막 shard가 있으면 배열 길이와 loss에 기여한 token 수가 다르다. 그래서 batch를 sequence 개수로만 기록하지 말고 <strong>loss mask를 통과한 token</strong>도 함께 누적한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{T_{update}}_{\text{update당 token}}&=\underbrace{B_{micro}}_{\text{rank당 sequence}}\times\underbrace{D_{DP}}_{\text{DP rank}}\\&\quad\times\underbrace{A}_{\text{누적 횟수}}\times\underbrace{L}_{\text{sequence 길이}}\end{aligned}`}
          meaning="왜 네 항을 곱하나: 한 rank가 B_micro개의 길이 L sequence를 보고, D_DP개 rank가 서로 다른 sequence를 처리하며, 이 과정을 A번 누적한 뒤 한 번 update하기 때문이다. Padding과 loss mask가 있으면 이것은 상한이며 실제 유효 token은 mask 합으로 다시 센다."
          symbols={[[String.raw`T_{update}`, '한 번의 optimizer update에 들어가는 최대 token 수'], [String.raw`B_{micro}`, '한 rank의 한 forward에서 처리하는 sequence 수'], [String.raw`D_{DP}`, '서로 다른 data batch를 맡는 data-parallel rank 수'], [String.raw`A`, '동기화와 update 전에 gradient를 누적하는 횟수'], [String.raw`L`, '각 sequence의 token 길이']]}
        />
        <Formula
          latex={String.raw`\underbrace{S_{target}}_{\text{목표 update 수}}=\left\lceil\frac{\underbrace{D_{target}}_{\text{학습하려는 유효 token}}}{\underbrace{T_{effective/update}}_{\text{실제로 loss에 들어간 token/update}}}\right\rceil`}
          meaning="왜 목표 token을 update당 token으로 나누나: learning-rate schedule과 checkpoint 간격은 step으로 실행되지만 scaling 예산은 token으로 결정했기 때문이다. GPU 수나 accumulation을 바꾸면 update당 token이 바뀌므로 같은 step 수를 유지하면 다른 양의 data를 학습하게 된다."
          symbols={[[String.raw`S_{target}`, '목표 token을 소비하기 위해 필요한 optimizer update 수'], [String.raw`D_{target}`, '예산 단계에서 정한 전체 유효 학습 token'], [String.raw`T_{effective/update}`, 'padding과 mask를 제외하고 실제 loss에 기여한 update당 token']]}
        />
        <BatchAndMemoryLab />
        <Misconception>GPU를 8개에서 32개로 늘리고 step 수를 그대로 두면 같은 학습을 더 빨리 끝낸 것이 아닐 수 있다. Global batch가 네 배가 됐다면 소비 token, learning-rate schedule과 optimizer update 횟수의 관계도 함께 다시 고정해야 한다.</Misconception>
      </section>

      <section id="parallel-memory" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">병렬화는 빠르게 만드는 옵션이 아니라 state 소유권이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>DDP(Distributed Data Parallel)</strong>는 각 rank가 model 전체를 복제하고 다른 batch를 본 뒤 gradient를 합친다. 구현이 단순하지만 9B model의 optimizer state까지 rank마다 복제하면 memory가 먼저 찬다. <strong>FSDP(Fully Sharded Data Parallel)</strong> 또는 ZeRO 계열은 parameter, gradient와 optimizer state를 data-parallel rank에 나눠 두고 필요한 순간 모은다.</p>
          <p>그래도 layer 하나의 행렬이 한 GPU에 들어가지 않으면 <strong>TP(Tensor Parallelism)</strong>로 layer 내부를 나눈다. Model이 너무 깊으면 <strong>PP(Pipeline Parallelism)</strong>로 layer 묶음을 stage에 배치하고, 긴 sequence의 activation이 병목이면 <strong>CP(Context Parallelism)</strong>로 sequence 축을 나눈다. 병렬화 이름을 많이 켜는 것이 목표가 아니다. 어떤 state가 어느 rank에 상주하고 어느 collective 통신이 critical path에 들어오는지 설명할 수 있는 최소 조합을 고른다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{gathered}
\underbrace{M_{rank}^{DDP}}_{\normalsize\text{DDP 복제}}\\[-0.1em]
\approx\underbrace{18N}_{\normalsize\text{전체 state 복제}}\\[0.7em]
\underbrace{M_{rank}^{dist\text{-}optim}}_{\normalsize\text{optimizer 분할}}\\[-0.1em]
\approx\underbrace{6N}_{\normalsize\text{복제 state}}+\underbrace{\frac{12N}{D_{DP}}}_{\normalsize\text{분할 state}}\\[0.7em]
\underbrace{M_{rank}^{full\text{-}shard}}_{\normalsize\text{FSDP full shard}}\\[-0.1em]
\approx\underbrace{\frac{18N}{D_{DP}}}_{\normalsize\text{모든 state 분할}}
\end{gathered}`}
          meaning="왜 parameter당 18 byte인가: BF16 model parameter 2 byte, FP32 main parameter 4 byte, FP32 gradient 4 byte, 두 FP32 Adam moment 8 byte를 더한다. Megatron distributed optimizer는 이 가운데 6 byte를 rank마다 유지하고 12 byte를 나눠 6+12/d가 된다. PyTorch FSDP FULL_SHARD는 parameter·gradient·optimizer state를 모두 나누므로 정상 상태는 18/d에 가까워지지만, 계산 직전 layer parameter를 all-gather하므로 실제 peak는 더 높다."
          symbols={[[String.raw`M_{rank}`, '한 rank가 정상 상태에 보유하는 model·optimizer state의 근사 byte'], [String.raw`N`, 'model parameter 수'], [String.raw`6N`, '분산 optimizer에서도 복제해 두는 BF16 parameter와 FP32 main gradient'], [String.raw`12N/D_{DP}`, 'rank에 나눈 FP32 main parameter와 두 Adam moment'], [String.raw`18N/D_{DP}`, '세 state를 모두 균등 분할한 full-shard의 이상적 정상 상태'], [String.raw`D_{DP}`, 'state를 나누는 data-parallel rank 수']]}
        />
        <StopRule>DDP pilot이 memory와 처리량 목표를 만족하면 거기서 멈춘다. Memory가 넘칠 때 FSDP, layer가 안 들어갈 때 TP, 깊이와 bubble이 문제일 때 PP, 긴 sequence activation이 문제일 때 CP를 한 축씩 추가한다.</StopRule>
      </section>

      <section id="update-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 update에서 무엇이 반드시 같은 순서로 일어날까?</h2>
        <ConceptPrimer title="실행 로그를 읽기 위한 네 단어" items={[
          { term: 'Sampler', meaning: 'Data shard에서 다음에 학습할 sequence id를 rank별로 고르는 순서 생성기다.', why: 'Checkpoint가 sampler cursor를 복원하지 못하면 같은 문서를 건너뛰거나 다시 학습한다.' },
          { term: 'Collective communication', meaning: '여러 rank가 함께 참여하는 all-reduce, reduce-scatter, all-gather 같은 통신 연산이다.', why: '한 rank만 늦거나 실패해도 전체 update가 기다리므로 평균 GPU 사용률만으로 병목을 찾을 수 없다.' },
          { term: 'Adam optimizer', meaning: 'Gradient의 이동 평균과 제곱 이동 평균을 state로 유지해 parameter별 update 크기를 조절하는 optimizer다.', why: '두 moment와 FP32 main weight 때문에 model weight 외의 memory와 checkpoint 상태가 커진다.' },
          { term: 'Mixed precision', meaning: '대부분의 연산과 저장에는 BF16·FP16을 쓰고, 불안정한 누적·update에는 더 높은 정밀도를 함께 쓰는 실행 방식이다.', why: '속도와 memory를 줄이되 overflow, loss scale과 master state를 별도로 관찰해야 한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Sampler는 rank마다 겹치지 않는 sequence id를 낸다. Model은 causal target의 loss를 계산하고, accumulation 동안 gradient를 더한다. 마지막 micro-batch에서만 all-reduce 또는 reduce-scatter를 실행하고, 모든 rank가 유한한 gradient인지 합의한 뒤 global norm clipping과 optimizer update를 수행한다.</p>
          <p><strong>BF16(Bfloat16)</strong>이나 FP16 같은 mixed precision은 연산·저장 비용을 줄이지만, master weight와 일부 reduction을 더 높은 정밀도로 유지할 수 있다. Overflow 때문에 update를 건너뛴 rank가 있으면 모든 rank가 함께 건너뛰어야 global step과 optimizer state가 갈라지지 않는다. Loss, learning rate, gradient norm, tokens/s만 보지 말고 data wait, collective time, maximum allocated memory와 가장 느린 rank도 함께 기록한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{g}_{\text{동기화된 gradient}}=\frac{1}{D_{DP}A}\sum_{r=1}^{D_{DP}}\sum_{a=1}^{A}\underbrace{g_{r,a}}_{\text{rank r의 누적 a gradient}}`}
          meaning="왜 rank와 accumulation을 모두 더하나: 한 global update가 여러 rank의 서로 다른 data와 여러 micro-batch를 대표하기 때문이다. 왜 D_DP와 A로 나누나: loss를 평균으로 정의한 동일한 effective batch 기준을 유지하기 위해서다. Framework의 loss reduction 방식에 따라 실제 scale이 달라질 수 있으므로 gradient norm을 pilot에서 검산한다."
          symbols={[[String.raw`g_{r,a}`, 'rank r가 a번째 micro-batch에서 계산한 gradient'], [String.raw`D_{DP}`, 'data-parallel rank 수'], [String.raw`A`, 'gradient accumulation 횟수'], [String.raw`g`, 'optimizer가 사용할 동기화된 global gradient']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Run dashboard의 핵심은 평균 한 줄이 아니라 원인 분리다. Loss spike와 동시에 특정 shard id가 바뀌었는지, gradient norm이 먼저 올랐는지, loss scale이 내려갔는지, rank 하나의 data wait가 길어졌는지를 같은 global step에 맞춰 본다. 이 장부가 있어야 data bug, numerical instability와 network straggler를 구분한다.</p>
        </div>
      </section>

      <section id="checkpoint-resume" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Checkpoint는 weight 파일이 아니라 다음 update의 시작점이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>최소 checkpoint에는 model parameter, optimizer moment, scheduler state, global step, consumed effective token, gradient scaler, sampler cursor, data manifest version과 각 rank의 난수 상태가 들어간다. Tensor·pipeline parallel layout이 달라질 수 있다면 checkpoint format이 새 layout으로 reshard할 수 있는지도 별도 계약이다.</p>
          <p>저장 성공 로그만으로는 부족하다. Pilot에서 step <MathFormula>k</MathFormula>에 저장하고, process를 완전히 종료한 뒤 load해 <MathFormula>k+1</MathFormula>의 sample id, learning rate와 loss를 중단 없이 진행한 control run과 비교한다. Bitwise equality가 모든 kernel에서 보장되지는 않아도, 허용 오차와 divergence window는 사전에 정한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\Delta_{resume}}_{\text{재개 차이}}=\frac{\left|\underbrace{\mathcal L_{k+1}^{resume}}_{\text{load 뒤 다음 loss}}-\underbrace{\mathcal L_{k+1}^{control}}_{\text{중단 없는 다음 loss}}\right|}{\max\!\left(\left|\mathcal L_{k+1}^{control}\right|,\varepsilon\right)}`}
          meaning="왜 같은 k+1 update를 비교하나: checkpoint가 다음 sample, optimizer와 scheduler 상태를 정말 복원했는지 가장 이른 지점에서 확인하기 위해서다. 왜 control loss로 나누나: loss scale이 다른 실험에서도 상대 차이를 비교하기 위해서며, epsilon은 0에 가까운 분모를 막는다."
          symbols={[[String.raw`\Delta_{resume}`, '중단·재개가 만든 다음-step 상대 loss 차이'], [String.raw`\mathcal L_{k+1}^{resume}`, 'checkpoint를 load한 뒤 계산한 다음 loss'], [String.raw`\mathcal L_{k+1}^{control}`, '중단 없이 계속한 기준 run의 같은 update loss'], [String.raw`\varepsilon`, '분모가 0이 되는 것을 막는 작은 양수']]}
        />
        <div data-run-recovery-contract className="not-prose my-8 border-y border-border py-6">
          <p className="text-xs font-black uppercase text-muted-foreground">Failed run recovery contract</p>
          <h3 className="mt-2 text-lg font-bold">마지막 파일이 아니라 마지막으로 검증된 상태로 돌아간다</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">복구 시작점은 단순히 가장 최근에 생성된 파일이 아니다. Checksum과 load smoke test를 통과했고, 최초 이상 step보다 앞에 있으며, sample·optimizer·scheduler state가 함께 닫힌 마지막 검증 checkpoint다. 먼저 incident window의 shard id, rank, gradient norm, loss scale과 collective time을 동결한 뒤 아래 분기를 한 번만 바꿔 작은 replay에서 재현한다.</p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            {[
              { cause: 'Data-correlated', signal: '같은 shard 또는 sample 구간에서 spike가 반복된다.', recovery: '해당 shard를 격리하고 원본·parser·tokenizer를 재검사한다. 새 manifest version에서만 제외하거나 교체한 뒤 checkpoint부터 짧게 replay한다.' },
              { cause: 'Numerical / optimizer', signal: 'shard와 무관하게 norm·loss scale·NaN이 먼저 무너진다.', recovery: '같은 checkpoint와 data window에서 낮은 LR·clip·precision 변경을 각각 새 config branch로 시험한다. Optimizer state reset은 자동 복구가 아니라 새 학습 궤적이다.' },
              { cause: 'Infrastructure', signal: '특정 rank의 data wait·collective·device error만 치솟는다.', recovery: '문제 node를 교체하고 data recipe는 바꾸지 않은 채 full state를 복원한다. 같은 sample cursor가 이어지는지 먼저 확인한다.' },
              { cause: 'Unknown', signal: '작은 replay에서 원인이 재현되지 않거나 둘 이상이 함께 바뀐다.', recovery: '대규모 run을 재시작하지 않는다. 더 촘촘한 checkpoint와 trace로 incident window를 줄인 뒤 원인별 단일 변경 실험으로 돌아간다.' },
            ].map((item) => (
              <div key={item.cause} className="min-w-0 bg-background p-4">
                <strong className="font-mono text-xs">{item.cause}</strong>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.signal}</p>
                <p className="mt-3 border-t border-border pt-3 text-xs leading-6">{item.recovery}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">복구 receipt에는 incident id, 선택한 checkpoint hash, 격리한 shard, manifest·config diff, replay step 범위, 결과와 소모 GPU-hour를 남긴다. Optimizer state를 버리거나 learning-rate schedule을 되감았다면 같은 run의 resume로 부르지 않고 새 run branch로 등록하며 warmup과 clean evaluation을 다시 통과시킨다.</p>
        </div>
        <Misconception>“Checkpoint가 load된다”와 “학습이 재현된다”는 다르다. Weight shape가 맞아도 sampler가 처음부터 시작하거나 scheduler가 warmup으로 돌아가면 중복 data와 다른 update가 만들어진다.</Misconception>
      </section>

      <section id="evaluation-stop" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Train loss가 아니라 다음 비용을 살 근거로 평가한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Pre-training 중단 결정은 세 축을 함께 본다. 첫째, contamination을 검사한 domain별 held-out loss가 내려가는가. 둘째, code·math·한국어·long-context 같은 목표 capability slice가 baseline보다 좋아지는가. 셋째, 같은 token을 처리하는 wall time, GPU-hour와 failure rate가 예산 안에 있는가.</p>
          <p>전체 평균만 보면 큰 web domain이 작은 핵심 domain의 악화를 가린다. Data engine에서 정한 mixture와 같은 slice로 loss를 보고, memorization scan과 time-split evaluation을 별도로 둔다. Full 9B run으로 가는 gate는 “pilot loss가 내려갔다”가 아니라 <strong>data recipe 효과가 clean evaluation에서 반복되고, resume와 throughput 계약이 닫혔다</strong>는 증거다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\Delta_i}_{\text{slice 개선}}&=\underbrace{M_i(\theta_{candidate})}_{\text{후보 점수}}-\underbrace{M_i(\theta_{baseline})}_{\text{기준 점수}}\\\underbrace{G}_{\text{확장 gate}}&=\bigwedge_i[\Delta_i\ge\delta_i]\\&\quad\land[\Delta_{resume}\le\tau]\land[C\le C_{budget}]\end{aligned}`}
          meaning="왜 slice별 차이를 보나: 전체 평균이 작은 핵심 능력의 회귀를 숨기지 못하게 하기 위해서다. 왜 AND gate로 묶나: 품질, 재개 가능성, 비용 중 하나라도 실패한 run을 더 큰 scale로 확장하지 않기 위해서다. 모든 slice가 반드시 개선돼야 한다는 보편 법칙이 아니라, 제품 목표에 맞춰 사전에 정한 최소 조건을 표현한 release 계약이다."
          symbols={[[String.raw`\Delta_i`, '평가 slice i에서 후보와 baseline의 metric 차이'], [String.raw`\delta_i`, 'slice i에 사전 등록한 최소 허용 개선 또는 회귀 한계'], [String.raw`\Delta_{resume}`, 'checkpoint 재개가 만든 상대 차이'], [String.raw`\tau`, '허용할 재개 차이 상한'], [String.raw`C`, 'pilot 또는 full run의 실제 비용'], [String.raw`C_{budget}`, '실행 전에 승인한 비용 상한']]}
        />
        <CapabilityCheck items={[
          'Model config, tokenizer, data manifest, code와 evaluation version을 한 run receipt로 고정한다.',
          'Micro-batch, data-parallel rank, accumulation과 sequence 길이에서 update당 최대 token을 계산한다.',
          'DDP, FSDP, TP, PP와 CP가 각각 어떤 state 또는 축을 나누는지 설명한다.',
          'Activation과 communication buffer를 model-state 18 byte/parameter 장부와 분리한다.',
          'Checkpoint에 optimizer, scheduler, sampler, random state와 consumed token을 포함한다.',
          '중단 없는 control과 resume run의 같은 다음 update를 비교한다.',
          '마지막 검증 checkpoint에서 data·numerical·infrastructure 원인별 복구 branch와 작은 replay를 설계한다.',
          'Clean domain loss, capability slice, memorization, throughput과 비용으로 9B 확장 gate를 만든다.',
        ]} />
        <RouteBand />
        <SourceNotes sources={[
          { label: 'NVIDIA · Megatron Core Training Examples', href: 'https://docs.nvidia.com/megatron-core/developer-guide/latest/user-guide/training-examples.html', note: 'Model, micro/global batch, schedule, data path와 checkpoint를 한 LLM training run으로 묶는 공식 실행 기준.' },
          { label: 'NVIDIA · Megatron Core Parallelism Strategies', href: 'https://docs.nvidia.com/megatron-core/developer-guide/latest/user-guide/parallelism-guide.html', note: 'DP, FSDP, TP, PP, CP와 EP가 나누는 축과 최소 선택 순서의 공식 설명.' },
          { label: 'NVIDIA · Megatron Core Distributed Optimizer', href: 'https://docs.nvidia.com/megatron-core/developer-guide/latest/user-guide/features/dist_optimizer.html', note: 'BF16·FP32 state의 parameter당 memory 장부와 reduce-scatter, optimizer, all-gather data flow.' },
          { label: 'PyTorch · FSDP2 fully_shard', href: 'https://docs.pytorch.org/docs/main/distributed.fsdp.fully_shard.html', note: 'Parameter, gradient와 optimizer state를 모두 data-parallel worker에 나누는 full-shard 소유권과 all-gather·reshard 실행 계약.' },
          { label: 'PyTorch · Randomness and reproducibility', href: 'https://docs.pytorch.org/docs/stable/notes/randomness.html', note: 'Seed만으로 모든 platform과 release의 완전 재현이 보장되지 않는 범위와 deterministic 설정.' },
          { label: 'PyTorch · Distributed Checkpoint', href: 'https://docs.pytorch.org/docs/stable/distributed.checkpoint.html', note: '분산 state dict를 여러 rank에서 저장·load하는 checkpoint API와 planner 경계.' },
          { label: 'NVIDIA NeMo · Resiliency Features', href: 'https://docs.nvidia.com/nemo-framework/user-guide/latest/resiliency.html', note: '유효한 local·global checkpoint 탐색, incomplete checkpoint 정리와 multi-node recovery의 공식 실행 범위.' },
        ]} />
      </section>
    </>
  );
}
