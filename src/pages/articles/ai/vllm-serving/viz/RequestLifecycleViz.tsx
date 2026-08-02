import { ArrowDown, ArrowRight, Braces, Cpu, Database, Radio, Server } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: 'API Server가 서비스 입구를 소유한다',
    body: 'HTTP payload를 검증하고 tokenization·multimodal preprocessing을 수행한다. 이 단계의 queue time은 아직 GPU 계산 시간이 아니다.',
  },
  {
    label: 'EngineCore 경계로 request state를 넘긴다',
    body: 'V1 문서의 멀티프로세스 구성에서는 API process와 EngineCore가 ZMQ socket으로 통신한다. 이 경계가 HTTP 처리와 model execution을 분리한다.',
  },
  {
    label: 'Scheduler와 KV manager가 이번 step의 장부를 만든다',
    body: 'Scheduler는 unified token budget을 나누고, KV manager는 필요한 block을 확보한다. free pool이 부족하면 실행 전에 admission 또는 preemption 문제가 된다.',
  },
  {
    label: 'Worker가 GPU model execution을 수행한다',
    body: '전용 worker가 model runner를 실행하고, prompt token은 KV state를 만들며 decode token은 기존 KV를 읽고 한 토큰씩 진행한다.',
  },
  {
    label: '결과는 다시 API Server를 거쳐 stream된다',
    body: 'Engine output은 request state에 반영된 뒤 API process로 돌아간다. 사용자는 이 전체 경로의 queue·prefill·decode 영향을 TTFT와 TPOT로 관찰한다.',
  },
];

const NODES = [
  {
    owner: 'API process',
    title: 'API Server',
    detail: 'HTTP · validation · tokenize',
    artifact: 'token IDs + request metadata',
    icon: Server,
  },
  {
    owner: 'IPC boundary',
    title: 'ZMQ',
    detail: 'frontend ↔ EngineCore',
    artifact: 'serialized request state',
    icon: Radio,
  },
  {
    owner: 'EngineCore',
    title: 'Scheduler + KV',
    detail: 'token budget · free blocks',
    artifact: 'scheduler output',
    icon: Database,
  },
  {
    owner: 'GPU worker',
    title: 'Model runner',
    detail: 'prefill · decode',
    artifact: 'sampled token + KV update',
    icon: Cpu,
  },
  {
    owner: 'API process',
    title: 'Stream output',
    detail: 'detokenize · response',
    artifact: 'client-visible token',
    icon: Braces,
  },
];

export default function RequestLifecycleViz() {
  return (
    <div data-request-lifecycle>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full min-w-0">
            <div className="grid min-w-0 gap-0 lg:grid-cols-5 lg:gap-5 lg:items-stretch">
              {NODES.map((node, index) => {
                const Icon = node.icon;
                const active = index === step;
                const complete = index < step;
                return (
                  <div key={node.title} className="relative min-w-0">
                    <div
                      data-lifecycle-owner={node.owner}
                      data-active={active ? 'true' : 'false'}
                      className={`h-full min-w-0 rounded-md border p-4 transition-colors ${
                        active
                          ? 'border-blue-600/50 bg-blue-500/[0.07]'
                          : complete
                            ? 'border-teal-600/25 bg-teal-500/[0.03]'
                            : 'border-border bg-background'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`} aria-hidden="true" />
                        <span className="text-xs font-bold text-muted-foreground">{node.owner}</span>
                      </div>
                      <p className="mt-4 break-words text-sm font-black text-foreground">{node.title}</p>
                      <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{node.detail}</p>
                      <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-foreground">
                        <strong>산출물</strong><br />{node.artifact}
                      </p>
                    </div>
                    {index < NODES.length - 1 && (
                      <div className="flex min-h-8 items-center justify-center text-muted-foreground lg:absolute lg:-right-[18px] lg:top-1/2 lg:min-h-0 lg:-translate-y-1/2">
                        <ArrowDown className="h-4 w-4 lg:hidden" aria-hidden="true" />
                        <ArrowRight className="hidden h-4 w-4 lg:block" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
              <div className="bg-background p-4">
                <p className="text-xs font-bold text-muted-foreground">현재 소유자</p>
                <p data-lifecycle-current-owner className="mt-2 text-sm font-black text-foreground">{NODES[step].owner}</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-xs font-bold text-muted-foreground">경계 증거</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">{NODES[step].artifact}</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-xs font-bold text-muted-foreground">다음에 볼 지표</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                  {step < 2 ? 'queue time · TTFT' : step === 2 ? 'free blocks · preemption' : 'TPOT · stream gap'}
                </p>
              </div>
            </div>
          </div>
        )}
      </StepViz>
    </div>
  );
}
