import { Link } from 'react-router-dom';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import {
  LongVideoMemoryFlowViz,
  TemporalTokenBudgetLab,
} from './video-long-context-memory/viz/LongVideoMemoryViz';

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

function ResearchCase({
  date,
  name,
  question,
  mechanism,
  evidence,
  boundary,
  href,
}: {
  date: string;
  name: string;
  question: string;
  mechanism: string;
  evidence: string;
  boundary: string;
  href: string;
}) {
  return (
    <article className="not-prose border-t border-border py-6 first:border-t-0">
      <div className="grid gap-4 md:grid-cols-[7rem_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[11px] font-bold text-muted-foreground">{date}</p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            {name}
          </a>
        </div>
        <dl className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold text-muted-foreground">풀려는 질문</dt>
            <dd className="mt-1 text-sm leading-relaxed">{question}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold text-muted-foreground">핵심 장치</dt>
            <dd className="mt-1 text-sm leading-relaxed">{mechanism}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold text-muted-foreground">원문이 보인 증거</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{evidence}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold text-muted-foreground">그대로 일반화하면 안 되는 경계</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{boundary}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function ReleaseGate({
  order,
  title,
  question,
  failure,
}: {
  order: string;
  title: string;
  question: string;
  failure: string;
}) {
  return (
    <div className="min-w-0 border-t border-border py-4 first:border-t-0">
      <div className="grid gap-2 sm:grid-cols-[3rem_minmax(0,1fr)]">
        <p className="font-mono text-lg font-black text-muted-foreground">{order}</p>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{question}</p>
          <p className="mt-2 text-xs leading-relaxed"><strong>실패 신호:</strong> {failure}</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoLongContextMemoryArticle() {
  return (
    <div className="space-y-16">
      <section id="why-long-video" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">30분 영상은 image 5만 장의 목록이 아니다</h2>
        <QuestionLead
          question="앞부분에서 컵을 왼쪽 서랍에 넣고 25분 뒤 다시 꺼냈다면, 모델은 무엇을 기억해야 답할 수 있을까?"
          answer="모든 pixel을 보존할 필요는 없다. 컵의 identity, 왼쪽 서랍이라는 위치, 넣은 시점과 꺼낸 시점의 순서는 남겨야 한다. 장시간 video의 핵심은 더 긴 context 숫자가 아니라, 무엇을 버리고 무엇을 다시 읽을지 정하는 memory policy다."
        />
        <ConceptPrimer
          items={[
            {
              term: 'Temporal sampling',
              meaning: '원본 fps에서 실제로 encoder에 넣을 frame이나 tubelet을 고르는 과정이다.',
              why: '인접 frame은 비슷하다. 모두 읽으면 같은 장면이 context를 반복해서 차지한다.',
            },
            {
              term: 'Active context',
              meaning: '현재 attention이 직접 읽을 수 있는 token 집합이다.',
              why: '전체 영상 token과 현재 계산에 올라온 token을 구분해야 memory와 latency를 예측할 수 있다.',
            },
            {
              term: 'Streaming',
              meaning: '미래 frame을 볼 수 없는 상태에서 영상이 도착하는 순서대로 처리하는 방식이다.',
              why: '녹화가 끝난 뒤 전체 영상을 읽는 offline 평가와 정보 경계가 다르다.',
            },
            {
              term: 'Long-horizon drift',
              meaning: '시간이 길어질수록 사건, 인물, 물체 모양이나 camera 상태가 서서히 어긋나는 현상이다.',
              why: '짧은 clip 품질이 좋아도 장시간 이해와 생성이 자동으로 성공하지 않는 이유다.',
            },
          ]}
        />
        <LongVideoMemoryFlowViz />
        <Misconception>
          Context window가 1M token이라고 해서 1M token을 항상 넣어야 하는 것은 아니다. 최대 길이는 수용 가능성이고,
          실제 제품 설계는 정확도·memory·prefill latency·streaming 지연의 교환 관계다.
        </Misconception>
      </section>

      <section id="token-budget" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 시간을 Token과 Byte로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원본 영상 길이만 보고 비용을 말할 수 없다. 몇 frame을 뽑는지, frame 하나가 몇 visual token이 되는지,
            backbone의 KV shape가 무엇인지까지 내려가야 한다. 아래 계산은 특정 모델의 고정 사양이 아니라,
            model card와 profiler 수치를 넣기 위한 장부다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{N_v}_{\text{전체 visual token}}=
            \underbrace{T}_{\text{영상 초}}\,
            \underbrace{f_s}_{\text{초당 sampling frame}}\,
            \underbrace{n_f}_{\text{frame당 token}}`}
          meaning="영상이 길어질수록 시간 위치가 늘고, 각 시간 위치마다 공간 token이 생긴다. 그래서 세 수를 더하지 않고 곱한다. Sampling rate를 절반으로 줄이면 시간 세부도 함께 줄고, frame당 token을 줄이면 작은 글자와 물체 경계가 더 많이 압축된다."
          symbols={[
            [String.raw`T`, '입력 영상의 길이. 단위는 초다.'],
            [String.raw`f_s`, '원본 fps가 아니라 encoder에 실제로 넣는 초당 frame 수다.'],
            [String.raw`n_f`, 'Vision encoder와 merge·resampler 뒤 frame 하나가 만든 visual token 수다.'],
            [String.raw`N_v`, 'Text·audio와 같은 context budget에 들어가는 전체 visual token 수다.'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{M_{\mathrm{KV}}}_{\text{KV byte}}=
            \underbrace{2}_{K,V}\,
            \underbrace{L}_{\text{layer}}\,
            \underbrace{N_a}_{\text{활성 token}}\,
            \underbrace{H_{\mathrm{kv}}d_h}_{\text{token당 KV 폭}}\,
            \underbrace{b}_{\text{값당 byte}}`}
          meaning="각 layer는 token마다 Key와 Value 두 배열을 저장하므로 2를 곱한다. 활성 token 수뿐 아니라 KV head 수, head 차원과 정밀도도 함께 곱해야 실제 byte가 된다. GQA가 KV head를 줄이고 FP8·INT8 cache가 값당 byte를 줄이는 이유가 이 식에 드러난다."
          symbols={[
            [String.raw`L`, 'KV cache를 가진 transformer layer 수다.'],
            [String.raw`N_a`, '전체 영상이 아니라 현재 memory policy가 attention에 노출한 활성 token 수다.'],
            [String.raw`H_{\mathrm{kv}}`, 'Key·Value를 저장하는 head 수다. Query head 수와 다를 수 있다.'],
            [String.raw`d_h,b`, 'Head 하나의 차원과 scalar 하나를 저장하는 byte 수다.'],
          ]}
        />
        <TemporalTokenBudgetLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기본값 10분, 2 fps, frame당 256 token이면 visual token은 307,200개다. 여기서 dense attention의
            모든 pair를 직접 만든다는 상한은 token 수의 제곱으로 커진다. 실제 구현은 FlashAttention, sparse pattern,
            local window 또는 linear state를 써서 이 행렬을 그대로 저장하지 않을 수 있다. 하지만 KV와 activation이
            공짜가 되는 것은 아니다.
          </p>
        </div>
      </section>

      <section id="memory-regimes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전체·Window·계층형 Memory는 서로 다른 답을 만든다</h2>
        <Formula
          latex={String.raw`\underbrace{N_a}_{\text{현재 활성 token}}=
            \underbrace{N_{\mathrm{recent}}}_{\text{최근 고해상도}}+
            \underbrace{N_{\mathrm{compressed}}}_{\text{과거 요약}}+
            \underbrace{N_{\mathrm{retrieved}}}_{\text{관련 과거 회수}}`}
          meaning="계층형 memory는 오래된 token을 모두 같은 해상도로 유지하지 않는다. 현재 동작은 최근 token으로, 장기 사건은 압축 memory로, 질문에 필요한 세부는 retrieval로 나눠 더한다. 각 항은 중복될 수 있으므로 구현에서는 같은 frame이나 KV가 두 번 들어가지 않는지도 검산해야 한다."
          symbols={[
            [String.raw`N_{\mathrm{recent}}`, '현재 장면과 chunk 경계를 세밀하게 잇는 최근 token 수다.'],
            [String.raw`N_{\mathrm{compressed}}`, '오래된 frame을 event, state, pooled KV 등으로 줄인 token 수다.'],
            [String.raw`N_{\mathrm{retrieved}}`, '현재 질문이나 생성 상태와 관련되어 다시 읽은 과거 token 수다.'],
            ['덧셈', '서로 다른 역할의 활성 memory가 한 attention 입력에 함께 들어가기 때문에 사용한다.'],
          ]}
        />
        <div className="not-prose my-8 border-y border-border">
          <ResearchCase
            date="POLICY 01"
            name="전체 문맥"
            question="모든 시간 위치를 직접 비교해야 하는가?"
            mechanism="선택한 모든 visual·audio token을 active context에 둔다."
            evidence="Needle retrieval처럼 오래된 한 장면을 직접 찾는 데 유리한 기준선이다."
            boundary="길이에 따라 KV와 prefill 비용이 계속 증가한다. 최대 context 안에 들어간다는 사실만으로 실시간성이 보장되지 않는다."
            href="https://arxiv.org/abs/2408.10188"
          />
          <ResearchCase
            date="POLICY 02"
            name="Sliding window"
            question="현재 동작과 인접 경계만 중요할까?"
            mechanism="최근 w개 token 또는 최근 몇 chunk만 attention에 남긴다."
            evidence="활성 memory에 상한을 두고 stream 처리를 일정한 비용으로 만들 수 있다."
            boundary="Window 밖 사건은 보이지 않는다. Overlap은 인접 seam을 줄일 뿐 20분 전 identity를 복원하지 않는다."
            href="https://arxiv.org/abs/2310.01889"
          />
          <ResearchCase
            date="POLICY 03"
            name="계층형 memory"
            question="최근은 자세히, 과거는 작게, 필요한 과거만 다시 읽을 수 있을까?"
            mechanism="최근 token, 압축 state와 query-conditioned retrieval을 서로 다른 예산으로 운영한다."
            evidence="FlexMem과 OmniMem처럼 KV를 memory source로 삼거나 modality별 보존 예산을 둘 수 있다."
            boundary="압축기가 버린 정보는 retrieval로 되살릴 수 없다. Offline 질문을 미리 아는 설정과 true streaming을 섞어 평가하면 안 된다."
            href="https://arxiv.org/abs/2603.29252"
          />
        </div>
        <StopRule>
          세 정책을 모두 구현하지 않는다. 현재 제품 질문이 최근 몇 초 안에서 끝나면 window에서 멈춘다.
          오래된 사건 회수가 실제 release gate일 때만 압축과 retrieval을 추가한다.
        </StopRule>
      </section>

      <section id="understanding-memory" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이해 모델은 “무엇을 기억했는가”를 질문으로 검증한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            장시간 video QA에서 평균 정확도 하나만 보면 memory가 실제로 작동했는지 알기 어렵다. 질문이 바로 앞 장면만
            묻는다면 memory를 모두 지워도 맞힐 수 있다. 따라서 오래된 사건, 사건 순서, audio-only 근거, 화면 속 작은
            증거를 따로 묻고 정답과 시간 구간을 함께 기록해야 한다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border">
          <ResearchCase
            date="2026-03"
            name="FlexMem"
            question="전체 video를 한 번에 넣지 않고도 오래된 관련 장면을 다시 읽을 수 있을까?"
            mechanism="Visual KV cache를 memory source로 보고 dual-path compression으로 쓰며, task에 따라 reading policy를 바꾼다."
            evidence="논문은 두 video MLLM, 다섯 long-video task와 한 streaming task에서 평가했고, 단일 RTX 3090에서 1,000 frame 이상을 처리했다고 보고한다."
            boundary="“무한 길이”는 고정 memory mechanism의 개념적 확장성 주장이다. 모든 영상과 질문에서 정보 손실 없이 무한한 것은 아니다."
            href="https://arxiv.org/abs/2603.29252"
          />
          <ResearchCase
            date="2026-05"
            name="OmniMem"
            question="Audio token과 visual token의 양이 다른데 같은 비율로 버려도 될까?"
            mechanism="Audio와 vision 예산을 분리하고, perturbation에 민감하면서 중복이 적은 KV state를 남긴다."
            evidence="VideoMME Long, LVBench, LVOmniBench의 두 base model에서 같은 예산의 training-free baseline보다 2–4%p, budget-aware fine-tuning 뒤 추가 1–2%p를 보고한다."
            boundary="이 수치는 해당 benchmark·base model·memory budget의 결과다. 다른 codec, 언어와 live audio에서 같은 향상을 보장하지 않는다."
            href="https://arxiv.org/abs/2606.07577"
          />
        </div>
        <Misconception>
          “중요한 frame만 고른다”는 문장만으로는 충분하지 않다. 중요도는 질문을 보기 전인지 후인지, audio와 visual 중
          어느 근거를 보존하는지, 선택이 미래 정보를 사용했는지까지 포함한 실행 계약이어야 한다.
        </Misconception>
      </section>

      <section id="generation-memory" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">생성 모델은 과거를 기억하는 동시에 다음 Frame을 만들어야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이해는 과거 evidence를 찾아 답하면 된다. 생성은 그 과거를 조건으로 새로운 pixel·latent를 계속 만들어야 한다.
            Causal autoregressive 경로는 KV cache를 재사용해 빠르게 이어갈 수 있지만 cache가 계속 자란다. Diffusion
            chunk 경로는 각 구간을 정교하게 다루지만, 이전 chunk의 target-domain 상태를 전달하지 않으면 경계에서 색,
            조명과 identity가 다시 추정되어 튈 수 있다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border">
          <ResearchCase
            date="2025-10"
            name="LongLive"
            question="Frame-level causal generation을 실시간에 가깝게 오래 이어갈 수 있을까?"
            mechanism="Short-window attention, frame-level attention sink, prompt 전환 시 KV-recache와 train-long–test-long 정렬을 결합한다."
            evidence="공식 페이지는 1.3B model이 단일 H100에서 20.7 FPS, 최대 240초 생성을 지원한다고 보고한다."
            boundary="속도와 길이는 해당 model·H100·설정의 결과다. 일반 diffusion model이나 소비자 GPU의 공통 속도가 아니다."
            href="https://research.nvidia.com/labs/eai/publication/longlive/"
          />
          <ResearchCase
            date="2025-09"
            name="SANA-Video"
            question="과거 전체를 KV 목록으로 저장하지 않고 global context를 유지할 수 있을까?"
            mechanism="Block-wise autoregressive generation과 cumulative linear-attention state를 결합해 fixed-memory global context를 만든다."
            evidence="공식 페이지는 720×1280 minute-length 생성, RTX 5090 배포와 fixed-memory state를 보고한다."
            boundary="고정 크기 state는 과거 token 전체를 그대로 보존하지 않는다. 세부 identity 회상과 linear state의 정보 병목을 별도로 평가해야 한다."
            href="https://research.nvidia.com/labs/eai/publication/sana-video/"
          />
          <ResearchCase
            date="2026-07"
            name="ISPA"
            question="오래된 KV를 버리지 않고 현재 instance에 맞춘 parameter로 흡수할 수 있을까?"
            mechanism="Warmup에서 global·local attention 차이를 측정하고 closed-form least squares로 일부 layer weight를 instance-specific하게 조정한다."
            evidence="1.3B–14B architecture 실험에서 KV cache 최대 50% 제거와 near-lossless visual quality를 보고한다."
            boundary="짧은 warmup과 weight modulation 비용이 생긴다. ‘50%’는 모든 layer·prompt·길이에서 보장되는 상수가 아니다."
            href="https://arxiv.org/abs/2607.00712"
          />
          <ResearchCase
            date="2026-06"
            name="HorizonRelight"
            question="짧은 clip diffusion을 긴 영상에 적용할 때 chunk 경계의 조명 상태를 어떻게 잇는가?"
            mechanism="이전 chunk의 target-domain latent를 다음 chunk에 전달하고 masked self-conditioning으로 그 continuation을 학습한다."
            evidence="공식 페이지는 in-the-wild long-horizon video에서 chunk-boundary artifact와 원치 않는 appearance change가 크게 줄었다고 보고한다."
            boundary="Relighting이라는 조건부 변환 사례다. 무조건적인 장편 video 생성 전체의 해답으로 확대하면 안 된다."
            href="https://research.nvidia.com/labs/sil/projects/horizonrelight/"
          />
        </div>
      </section>

      <section id="training-runtime" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">긴 Sample 하나가 GPU 하나에 안 들어가면 시간축을 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data parallelism은 서로 다른 sample을 GPU에 나눈다. 그러나 영상 한 편 자체가 너무 길면 sample 수를 나눠도
            한 GPU의 activation과 attention 문제는 남는다. 이때 sequence 또는 context parallelism이 한 sample의
            시간·token 축을 여러 rank에 분배한다.
          </p>
          <p>
            Ulysses 계열은 attention head와 sequence를 all-to-all로 재배치한다. Ring Attention 계열은 query block이
            여러 rank의 KV block을 차례로 읽게 한다. 이름을 외우는 것보다 <strong>각 rank가 무엇을 소유하고 어떤 통신을
            하는가</strong>를 그리는 편이 중요하다.
          </p>
        </div>
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['01 · 생성 전', 'Frame · VAE · vision encoder', 'Transformer만 나누기 전에 raw video에서 token·latent를 만드는 작업이 한 rank에 몰리지 않는지 본다.'],
            ['02 · Attention', 'Ulysses · Ring · 2D', 'All-to-All과 P2P가 NVLink 내부와 node 사이 network에 어떻게 배치되는지 본다.'],
            ['03 · Objective', 'Clean history · noisy target', 'Generation에서는 각 rank가 target token과 loss를 균형 있게 갖는지 확인한다.'],
          ].map(([order, title, body]) => (
            <div key={order} className="min-w-0 bg-background p-5">
              <p className="font-mono text-[11px] font-bold text-muted-foreground">{order}</p>
              <p className="mt-2 text-sm font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p className="not-prose text-sm leading-relaxed text-muted-foreground">
          더 내려가야 한다면 <Link className="font-medium text-foreground underline decoration-border underline-offset-4" to={articlePath('gpu', 'gpu-hpc-from-scratch')}>GPU HPC 바닥부터</Link>에서
          NVLink·RDMA·NCCL의 물리 경로를 읽는다. Video tensor 자체의 실행은 <InternalLink slug="video-model-runtime">Video Model Runtime</InternalLink>에서
          VAE·temporal module·audio branch로 이어진다.
        </p>
      </section>

      <section id="evaluation-release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Release는 평균 점수가 아니라 일곱 Gate로 닫는다</h2>
        <div className="not-prose border-y border-border">
          <ReleaseGate order="01" title="오래된 사건 회수" question="처음 10% 구간의 사건을 마지막에 정확히 찾는가?" failure="최근 frame만으로 답할 수 있는 질문이 test를 오염한다." />
          <ReleaseGate order="02" title="시간 순서" question="A 다음 B와 B 다음 A를 구분하는가?" failure="두 사건의 존재만 맞고 순서를 뒤집는다." />
          <ReleaseGate order="03" title="근거 위치" question="답과 함께 frame·timestamp·audio span을 반환하는가?" failure="정답은 맞지만 실제 근거가 다른 shortcut이다." />
          <ReleaseGate order="04" title="Streaming 정보 경계" question="시점 t의 출력이 미래 frame을 전혀 사용하지 않았는가?" failure="Offline preprocessing이 미래 정보를 memory에 쓴다." />
          <ReleaseGate order="05" title="장기 생성 연속성" question="인물, 물체, camera, 조명과 배경 geometry가 유지되는가?" failure="평균 미학 점수는 높지만 특정 identity가 서서히 바뀐다." />
          <ReleaseGate order="06" title="Chunk 경계" question="경계 전후 optical flow·색·조명·motion jerk가 튀지 않는가?" failure="Overlap 안쪽만 평가해 실제 seam을 숨긴다." />
          <ReleaseGate order="07" title="시스템 증가율" question="길이가 2배일 때 peak memory, prefill, frame latency와 network byte가 어떻게 변하는가?" failure="짧은 demo의 한 점만 측정해 장시간 slope를 놓친다." />
        </div>
        <CapabilityCheck
          items={[
            '영상 길이·sampling·frame당 token에서 visual token 수를 계산한다.',
            'Layer·KV head·head dim·precision에서 cache byte를 추정한다.',
            '전체 문맥, sliding window와 계층형 memory의 정보 손실을 구분한다.',
            'FlexMem·OmniMem의 이해 memory와 LongLive·SANA·ISPA의 생성 memory를 같은 순위표로 섞지 않는다.',
            'Offline과 true streaming의 미래 정보 경계를 검사한다.',
            '긴 sample을 나눌 때 encoder·attention·loss·network가 균형을 이루는지 본다.',
            '품질 점수와 함께 memory·latency의 길이 증가율을 release gate로 둔다.',
          ]}
        />
        <StopRule>
          이 글의 목적은 모든 long-video 논문을 읽는 것이 아니다. 현재 목표가 이해라면 FlexMem·OmniMem 분기,
          생성이라면 LongLive·SANA·ISPA·HorizonRelight 분기 중 실패와 직접 맞는 하나만 원문으로 내려간다.
        </StopRule>
        <SourceNotes
          sources={[
            { label: 'FlexMem', href: 'https://arxiv.org/abs/2603.29252', note: 'Visual KV memory, dual-path compression, task별 reading과 long·streaming video 이해의 1차 근거.' },
            { label: 'OmniMem', href: 'https://arxiv.org/abs/2606.07577', note: 'Audio·visual 예산 분리, perturbation-aware KV 선택과 동일 memory budget 비교의 1차 근거.' },
            { label: 'LongLive', href: 'https://research.nvidia.com/labs/eai/publication/longlive/', note: 'Frame-level AR, KV-recache, attention sink, H100 속도·길이 조건의 공식 근거.' },
            { label: 'SANA-Video', href: 'https://research.nvidia.com/labs/eai/publication/sana-video/', note: 'Block linear attention과 fixed-memory global state의 공식 근거.' },
            { label: 'ISPA', href: 'https://arxiv.org/abs/2607.00712', note: 'KV history를 instance-specific parameter modulation으로 흡수하는 2026 생성 memory 연구.' },
            { label: 'HorizonRelight', href: 'https://research.nvidia.com/labs/sil/projects/horizonrelight/', note: 'Chunk 사이 target-domain latent 전달과 masked self-conditioning의 공식 근거.' },
            { label: 'Scaling Video Training with Parallelism', href: 'https://research.nvidia.com/labs/eai/blogs/scaling-video-training-with-parallelism/', note: 'Long-video 이해·생성의 sequence parallel work unit과 hardware topology를 비교한 NVIDIA 연구 글.' },
            { label: 'LongVILA', href: 'https://arxiv.org/abs/2408.10188', note: 'Frame·visual token을 함께 나누는 multimodal sequence parallelism의 기준 사례.' },
            { label: 'Ring Attention', href: 'https://arxiv.org/abs/2310.01889', note: 'Blockwise attention과 distributed KV circulation의 기반 연구.' },
          ]}
        />
      </section>
    </div>
  );
}
