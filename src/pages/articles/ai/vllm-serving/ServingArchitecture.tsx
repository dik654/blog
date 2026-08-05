import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import {
  CapabilityCheck,
  InternalLink,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { sharedCodeRefs } from './sharedCodeRefs';
import { VLLM_CURRENT_RELEASE, VLLM_EXCERPT_SET, vllmExcerptUrl } from './sourceSnapshot';
import type { CodeRef } from '@/components/code/types';

const decisions = [
  {
    index: '01',
    title: 'Scheduler policy',
    changes: '한 engine step에서 어떤 request의 몇 token을 실행할지',
    measure: 'TTFT · TPOT · preemption · goodput',
    boundary: '긴 prefill을 chunk해도 전체 계산량이 사라지지는 않는다.',
  },
  {
    index: '02',
    title: 'Attention / execution backend',
    changes: '같은 model operation의 kernel launch와 memory traffic',
    measure: 'prefill/decode latency · fallback · memory · numerical quality',
    boundary: 'GPU, dtype, head 구조, shape에 따라 선택과 이득이 달라진다.',
  },
  {
    index: '03',
    title: 'Speculative decoding',
    changes: 'target model 한 번의 검증에서 commit할 수 있는 token 수',
    measure: 'acceptance · verifier당 commit · TPOT · quality',
    boundary: 'draft 비용과 낮은 acceptance가 이득을 상쇄할 수 있다.',
  },
  {
    index: '04',
    title: 'Tensor / pipeline / data parallel',
    changes: 'model과 request state를 여러 GPU·process에 배치하는 방식',
    measure: 'memory fit · communication · latency · aggregate goodput',
    boundary: 'GPU 수를 늘리면 collective와 pipeline bubble 비용도 생긴다.',
  },
  {
    index: '05',
    title: 'Multimodal admission',
    changes: 'text token 외 media preprocessing·encoder budget·cache identity',
    measure: 'media queue · encoder cache hit · TTFT · memory',
    boundary: 'decoder KV만 계산해서 VLM capacity를 판단할 수 없다.',
  },
] as const;

export default function ServingArchitecture({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const apiSource = VLLM_EXCERPT_SET['vllm/entrypoints/openai/api_server.py'];
  const workerSource = VLLM_EXCERPT_SET['vllm/v1/worker/gpu_worker.py'];

  return (
    <section id="serving-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">최적화 이름이 아니라 병목과 검증 지표를 연결한다</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Continuous batching은 request 전체가 아니라 generation iteration마다 batch를 다시 구성한다. 짧은 request가 끝나면 다음 request가 들어올 수 있어 static batch의 빈 slot을 줄인다. V1 scheduler는 prefill과 decode를 별도 queue의 이름으로만 다루지 않고, request가 아직 계산하지 않은 token 수를 하나의 budget에서 계획한다. 다만 두 작업의 물리 비용과 사용자 지표가 같다는 뜻은 아니다.
        </p>
        <p>
          현재 optimization 문서에서 chunked prefill이 가능한 경우 decode request를 먼저 schedule하고 남은 token budget을 prefill에 쓰는 이유가 여기에 있다. interactive workload에서는 TPOT를 지키면서 긴 prefill을 조금씩 전진시킬 수 있다. batch workload에서는 반대로 chunk가 kernel 효율을 낮출 수도 있으므로 같은 fixture에서 total throughput과 완료 시간을 다시 잰다.
        </p>

        <div className="not-prose my-6 divide-y divide-border border-y border-border">
          {decisions.map((item) => (
            <div key={item.index} className="grid min-w-0 gap-3 py-4 md:grid-cols-[3rem_10rem_minmax(0,1fr)]">
              <span className="font-mono text-sm font-black text-blue-700 dark:text-blue-300">{item.index}</span>
              <strong className="text-sm text-foreground">{item.title}</strong>
              <div className="min-w-0 text-sm leading-relaxed">
                <p><strong>바꾸는 것:</strong> {item.changes}</p>
                <p className="mt-1 text-muted-foreground"><strong className="text-foreground">함께 측정:</strong> {item.measure}</p>
                <p className="mt-1 text-muted-foreground"><strong className="text-foreground">경계:</strong> {item.boundary}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>역사적 speedup은 아이디어의 가능성이지 현재 배포의 약속이 아니다</h3>
        <p>
          FlashAttention 원 논문은 IO-aware exact attention을 제안하고, 논문 조건에서 BERT-large 15%, sequence length 1K의 <strong>GPT-2 3×</strong>, Long Range Arena 2.4×를 보고했다. 이는 2022년 논문의 model·hardware·sequence 조건에 묶인 결과다. 현재 vLLM에서 어떤 backend가 선택되는지와 실제 prefill/decode 개선은 runtime log와 같은 workload benchmark로 확인한다.
        </p>
        <p>
          EAGLE 논문은 target model의 feature를 draft하고 target이 병렬 검증하는 방법을 제안한다. 논문은 <strong>LLaMA2-Chat 70B에서 latency 2.7×–3.5×</strong>와 throughput 2배를 보고했다. 이 역시 해당 실험의 역사적 결과다. 서비스에서는 request별 acceptance, verifier 실행 비용, committed token 수와 TPOT를 함께 보며 품질 동등성도 확인한다.
        </p>

        <CitationBlock
          source="Dao et al., NeurIPS 2022 — FlashAttention"
          citeKey={6}
          type="paper"
          href="https://arxiv.org/abs/2205.14135"
        >
          <p>
            FlashAttention은 attention matrix 전체를 HBM에 materialize하지 않도록 tile 단위로 계산해 HBM↔SRAM IO를 줄인다. 논문의 조건별 speedup을 모든 vLLM model과 GPU로 일반화하지 않는다.
          </p>
        </CitationBlock>

        <CitationBlock
          source="Li et al., ICML 2024 — EAGLE"
          citeKey={7}
          type="paper"
          href="https://arxiv.org/abs/2401.15077"
        >
          <p>
            EAGLE은 token만 직접 예측하지 않고 target model의 상위 feature를 draft해 uncertainty를 줄인다. 현재 vLLM은 EAGLE 계열을 지원하지만 실제 이득은 draft 비용과 acceptance가 결정하므로 배포별 측정이 필요하다.
          </p>
        </CitationBlock>

        <h3>코드는 병목 가설을 세운 뒤 연다</h3>
        <p>
          API server 코드는 request 입구와 stream 경계를, GPU worker 코드는 scheduler output이 실제 model runner로 들어가는 경계를 확인하는 데 쓴다. 두 발췌는 서로 다른 commit에 고정되어 있으며, 2026년 3월의 이 파일들이 {VLLM_CURRENT_RELEASE.tag} 전체 source를 대표하지 않는다.
        </p>
        <div className="not-prose my-6 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef('api-server', sharedCodeRefs['api-server'])} label="FastAPI routes" />
          <CodeViewButton onClick={() => onCodeRef('gpu-worker-execute', sharedCodeRefs['gpu-worker-execute'])} label="GPU worker" />
        </div>
        <p className="text-sm text-muted-foreground">
          API excerpt: <a href={vllmExcerptUrl('vllm/entrypoints/openai/api_server.py')}>{apiSource.commit.slice(0, 12)}</a> ·
          GPU worker excerpt: <a href={vllmExcerptUrl('vllm/v1/worker/gpu_worker.py')}>{workerSource.commit.slice(0, 12)}</a>.
        </p>

        <StopRule>
          total throughput 하나가 좋아졌다는 이유로 출시하지 않는다. 같은 traffic fixture에서 p95 TTFT·TPOT, E2EL, preemption과 goodput을 함께 보고, 목표 workload의 SLO를 어기면 설정을 되돌린다.
        </StopRule>

        <div id="vllm-serving-field-guide" className="scroll-mt-20">
          <h3>여기서부터는 한 request의 장부를 차례로 깊게 읽는다</h3>
          <p>
            이 글은 각 최적화의 선택 기준과 다음 측정값을 소유한다. 반면 정확한 <code>Scheduler.schedule()</code> 분기와 token 수 계산은 release마다 움직이는 구현 세부라서 <InternalLink slug="vllm-scheduler">vLLM Scheduler</InternalLink> 글이 pinned source와 함께 소유한다. 여기서는 그 코드를 미리 복제하지 않고 <strong>KV headroom과 workload SLO를 넘겨주는 경계</strong>까지만 확정한다.
          </p>
          <div className="not-prose my-6 divide-y divide-border border-y border-border">
            {[
              {
                step: '01',
                title: 'vLLM PagedAttention',
                slug: 'vllm-paged-attention',
                handoff: 'model shape → KV bytes/token → physical block → free-pool headroom',
                question: '이 request를 받을 물리 KV block이 실제로 몇 개인가?',
              },
              {
                step: '02',
                title: 'vLLM Scheduler',
                slug: 'vllm-scheduler',
                handoff: 'free-pool headroom + token budget → 한 step의 실행 plan',
                question: 'decode와 long prefill에 이번 step budget을 어떻게 나누는가?',
              },
              {
                step: '03',
                title: 'vLLM Speculative Decoding',
                slug: 'vllm-spec-decode',
                handoff: 'draft proposal → target verification → committed token',
                question: '검증 한 번이 실제로 몇 token 전진시키고 비용은 얼마인가?',
              },
              {
                step: '04',
                title: 'vLLM VLM Serving',
                slug: 'vllm-vlm-serving',
                handoff: 'media identity + encoder budget + decoder state → admission evidence',
                question: 'image·video가 들어오면 decoder KV 밖에 어떤 state가 더 필요한가?',
              },
            ].map((item) => (
              <div key={item.step} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[3rem_minmax(0,1fr)]">
                <span className="font-mono text-sm font-black text-teal-700 dark:text-teal-300">{item.step}</span>
                <div className="min-w-0">
                  <p className="text-sm font-black">
                    <InternalLink slug={item.slug}>{item.title}</InternalLink>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{item.question}</p>
                  <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{item.handoff}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3>운영에서 남겨야 할 최소 실험 기록</h3>
        <ol>
          <li><strong>Workload:</strong> input/output length 분포, request rate, burstiness와 max concurrency.</li>
          <li><strong>Runtime:</strong> model, GPU, precision, vLLM version·commit과 모든 non-default flag.</li>
          <li><strong>Latency:</strong> p50·p95·p99 TTFT, TPOT/ITL, E2EL과 queue time.</li>
          <li><strong>Capacity:</strong> token throughput, request throughput, KV usage, prefix hit와 preemption.</li>
          <li><strong>Decision:</strong> SLO를 만족한 goodput, 비용, 품질 차이와 rollback threshold.</li>
        </ol>

        <CapabilityCheck
          items={[
            '대화형 workload와 batch workload에서 primary metric이 왜 다른지 설명할 수 있다.',
            'API Server, EngineCore, Scheduler/KV manager와 GPU Worker의 소유 경계를 추적할 수 있다.',
            'PagedAttention이 연속 token 의미와 비연속 physical memory를 어떻게 분리하는지 설명할 수 있다.',
            '현재 V1 preemption이 CPU swap이 아니라 recompute라는 점과 latency 비용을 말할 수 있다.',
            'Chunked prefill이 decode와 long prefill 사이의 step budget을 어떻게 바꾸는지 설명할 수 있다.',
            '논문 speedup, current docs, commit-pinned excerpt와 교육용 fixture를 서로 다른 근거로 구분할 수 있다.',
          ]}
        />

        <SourceNotes
          sources={[
            {
              label: `vLLM ${VLLM_CURRENT_RELEASE.tag} release`,
              href: 'https://github.com/vllm-project/vllm/releases/tag/v0.26.0',
              note: '이 글의 current behavior 기준 release와 날짜를 고정한다.',
            },
            {
              label: 'vLLM Architecture Overview',
              href: 'https://docs.vllm.ai/en/v0.26.0/design/arch_overview/',
              note: 'v0.26.0의 API Server, ZMQ, EngineCore, DP rank와 GPU worker process ownership 근거.',
            },
            {
              label: 'vLLM V1 User Guide',
              href: 'https://docs.vllm.ai/en/v0.26.0/usage/v1_guide/',
              note: 'v0.26.0의 unified scheduling, feature boundary, KV swap 제거와 recompute preemption 근거.',
            },
            {
              label: 'vLLM Optimization and Tuning',
              href: 'https://docs.vllm.ai/en/v0.26.0/configuration/optimization/',
              note: 'v0.26.0의 chunked prefill ordering, preemption 증상과 조정 변수 설명.',
            },
            {
              label: 'vLLM serve benchmark CLI',
              href: 'https://docs.vllm.ai/en/v0.26.0/cli/bench/serve/',
              note: 'v0.26.0에서 TTFT·TPOT·E2EL·goodput과 workload fixture 입력을 기록하는 근거.',
            },
            {
              label: 'PagedAttention · SOSP 2023',
              href: 'https://arxiv.org/abs/2309.06180',
              note: '고정 token block, block table과 당시 baseline 대비 역사적 결과의 원문.',
            },
          ]}
        />
      </div>
    </section>
  );
}
