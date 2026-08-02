import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Database,
  Eye,
  FileClock,
  GitBranch,
  KeyRound,
  Monitor,
  Network,
  Play,
  RefreshCcw,
  ScanSearch,
  ShieldCheck,
  Terminal,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { articlePath } from '@/lib/paths';
import { cn } from '@/lib/utils';

type RuntimeScenario = 'answer' | 'api' | 'gui' | 'long';
type ActionSurface = 'api' | 'shell' | 'gui' | 'agent';
type Protocol = 'mcp2026' | 'mcp2025' | 'a2a';
type Symptom = 'grounding' | 'continuity' | 'coordination' | 'safety' | 'evaluation';
type GuiScenario = 'stale' | 'overlay' | 'commit';
type RetryClass = 'read' | 'keyed' | 'gui';

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'min-h-11 rounded-md border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            value === option.value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const runtimeScenarios: Record<RuntimeScenario, {
  label: string;
  task: string;
  outcome: string;
  layers: Array<{ name: string; role: string; needed: boolean; failure: string; icon: typeof Bot }>;
}> = {
  answer: {
    label: '한 번 답하기',
    task: '정적 문서를 읽고 설명을 한 번 생성한다.',
    outcome: '답변과 citation',
    layers: [
      { name: 'Model', role: 'Context에서 답변을 생성', needed: true, failure: '답변을 만들 수 없다.', icon: Bot },
      { name: 'Harness', role: '한 요청의 schema와 log를 관리', needed: false, failure: '형식과 관찰성이 약해진다.', icon: GitBranch },
      { name: 'Workspace', role: '파일·프로세스가 있는 실행 환경', needed: false, failure: '외부 작업이 없으므로 생략 가능하다.', icon: Terminal },
      { name: 'Durable state', role: 'Checkpoint와 effect receipt', needed: false, failure: '한 turn에서 끝나므로 필수는 아니다.', icon: FileClock },
    ],
  },
  api: {
    label: 'API 작업',
    task: '고객을 조회하고 허용된 환불 API를 호출한다.',
    outcome: '검증된 API effect',
    layers: [
      { name: 'Model', role: 'Typed action을 제안', needed: true, failure: '다음 행동을 선택할 수 없다.', icon: Bot },
      { name: 'Harness', role: 'Policy·executor·reducer를 강제', needed: true, failure: '제안이 곧 권한이 된다.', icon: GitBranch },
      { name: 'Workspace', role: 'Credential을 분리한 tool runtime', needed: true, failure: '민감한 실행 경계가 모델과 섞인다.', icon: Terminal },
      { name: 'Durable state', role: 'Request ID와 effect receipt 보관', needed: true, failure: 'Timeout 뒤 중복 환불 위험이 생긴다.', icon: FileClock },
    ],
  },
  gui: {
    label: 'GUI 작업',
    task: 'API가 없는 웹 화면에서 상태를 변경한다.',
    outcome: '새 화면과 backend state가 일치',
    layers: [
      { name: 'Model', role: '화면을 읽고 target과 action을 제안', needed: true, failure: '의미 있는 UI 행동을 고르지 못한다.', icon: Eye },
      { name: 'Harness', role: 'Fresh frame·approval·commit gate', needed: true, failure: '오래된 좌표를 그대로 클릭한다.', icon: GitBranch },
      { name: 'Workspace', role: '격리된 browser와 입력 장치', needed: true, failure: '세션과 credential이 노출된다.', icon: Monitor },
      { name: 'Durable state', role: 'Frame revision·action hash·effect proof', needed: true, failure: '클릭과 실제 변경을 구분하지 못한다.', icon: FileClock },
    ],
  },
  long: {
    label: '장기 작업',
    task: '여러 sandbox와 context window에 걸쳐 코드를 수정한다.',
    outcome: '재현 가능한 artifact와 test',
    layers: [
      { name: 'Model', role: '현재 task unit의 다음 action을 제안', needed: true, failure: '작업 진행이 없다.', icon: Bot },
      { name: 'Harness', role: '작은 task·budget·verification을 관리', needed: true, failure: '한 번에 과도하게 시도하거나 조기 종료한다.', icon: GitBranch },
      { name: 'Workspace', role: '재현 가능한 manifest와 sandbox', needed: true, failure: '환경 차이로 결과를 재생할 수 없다.', icon: Terminal },
      { name: 'Durable state', role: 'Checkpoint·artifact·test result를 외부화', needed: true, failure: '새 session이 이전 진행을 추측한다.', icon: FileClock },
    ],
  },
};

export function AgentRuntimeStackLab() {
  const [scenario, setScenario] = useState<RuntimeScenario>('gui');
  const data = runtimeScenarios[scenario];

  return (
    <section data-agent-runtime-stack className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="border-b border-border p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Network aria-hidden className="h-4 w-4" />
          RUNTIME LAYER CHECK
        </div>
        <h3 className="mt-2 text-base font-bold">같은 model도 작업에 따라 필요한 시스템이 달라진다</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.task}</p>
        <div className="mt-4">
          <Segmented
            label="작업 종류"
            value={scenario}
            options={Object.entries(runtimeScenarios).map(([value, item]) => ({
              value: value as RuntimeScenario,
              label: item.label,
            }))}
            onChange={setScenario}
          />
        </div>
      </header>

      <div className="p-4 sm:p-5">
        <div className="space-y-0">
          {data.layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.name}
                className="grid min-w-0 gap-3 border-t border-border/70 py-4 first:border-t-0 lg:grid-cols-[2rem_9rem_minmax(0,1fr)_7rem]"
              >
                <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex min-w-0 items-center gap-2 text-sm font-bold">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {layer.name}
                </span>
                <span className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {layer.needed ? layer.role : layer.failure}
                </span>
                <span className={cn(
                  'inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-bold',
                  layer.needed ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground',
                )}>
                  {layer.needed ? <Check aria-hidden className="h-3.5 w-3.5" /> : <CircleStop aria-hidden className="h-3.5 w-3.5" />}
                  {layer.needed ? '필수' : '선택'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex min-w-0 items-start gap-3 border-l-2 border-emerald-500 pl-3">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-relaxed">
            <strong>완료 증거:</strong> {data.outcome}. Model의 “완료했습니다” 문장은 이 증거를 대신하지 않는다.
          </p>
        </div>
      </div>
    </section>
  );
}

const actionSurfaces: Record<ActionSurface, {
  label: string;
  icon: typeof Wrench;
  observation: string;
  proposal: string;
  proof: string;
  retry: string;
  risk: string;
}> = {
  api: {
    label: 'Typed API',
    icon: Wrench,
    observation: 'Versioned JSON response와 status',
    proposal: 'Tool name + schema-checked arguments',
    proof: 'Response ID와 backend read-after-write',
    retry: 'Idempotency key가 있으면 같은 key로 재호출',
    risk: 'Schema 밖 의미와 stale API data',
  },
  shell: {
    label: 'Shell',
    icon: Terminal,
    observation: 'stdout·stderr·exit code와 filesystem diff',
    proposal: '명령, cwd, env와 output cap',
    proof: 'File hash, test result와 process state',
    retry: 'Read는 재실행, write는 command별 분류',
    risk: '넓은 filesystem·network 권한',
  },
  gui: {
    label: 'GUI',
    icon: Monitor,
    observation: 'Screenshot revision + DOM/a11y + URL',
    proposal: 'Target identity + action + expected change',
    proof: 'Fresh frame와 backend/end-state 확인',
    retry: 'Effect가 없음을 확인하기 전 재클릭 금지',
    risk: '좌표 drift, overlay와 ambiguous timeout',
  },
  agent: {
    label: 'Remote agent',
    icon: Bot,
    observation: 'Agent card, task status와 artifact update',
    proposal: 'Bounded task envelope와 accepted modality',
    proof: 'Artifact + independent verifier',
    retry: 'Task ID로 조회·resubscribe·cancel',
    risk: '불투명한 내부 도구와 권한 재위임',
  },
};

export function ActionSurfaceLab() {
  const [surface, setSurface] = useState<ActionSurface>('api');
  const data = actionSurfaces[surface];

  return (
    <section data-action-surface-lab className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="border-b border-border p-4 sm:p-5">
        <p className="text-xs font-bold text-muted-foreground">행동 경계 · ACTION SURFACE</p>
        <h3 className="mt-2 text-base font-bold">가장 강한 도구보다 가장 검증하기 쉬운 경계를 고른다</h3>
        <div className="mt-4">
          <Segmented
            label="행동 표면"
            value={surface}
            options={Object.entries(actionSurfaces).map(([value, item]) => ({
              value: value as ActionSurface,
              label: item.label,
            }))}
            onChange={setSurface}
          />
        </div>
      </header>
      <div className="p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          {[
            { label: '관찰', text: data.observation, Icon: Eye },
            { label: '제안', text: data.proposal, Icon: Bot },
            { label: 'Effect 증거', text: data.proof, Icon: ShieldCheck },
          ].map(({ label, text, Icon }, index) => {
            return (
              <div key={label} className="contents">
                <div className="min-w-0 flex-1 border-y border-border py-3 sm:min-h-[7.75rem] sm:border-y-0 sm:border-l sm:pl-4">
                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Icon aria-hidden className="h-4 w-4" />
                    {label}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed">{text}</p>
                </div>
                {index < 2 && <ArrowRight aria-hidden className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />}
              </div>
            );
          })}
        </div>
        <dl className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-xs font-bold text-muted-foreground">Retry rule</dt>
            <dd className="mt-1 text-sm leading-relaxed">{data.retry}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-bold text-muted-foreground">주요 실패</dt>
            <dd className="mt-1 text-sm leading-relaxed text-rose-700 dark:text-rose-300">{data.risk}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

const protocolData: Record<Protocol, {
  label: string;
  owner: string;
  parties: string;
  steps: Array<{ label: string; detail: string }>;
  boundary: string;
}> = {
  mcp2026: {
    label: 'MCP · 2026-07-28',
    owner: 'Agent host와 stateless capability request 사이',
    parties: 'Host · Client · Server',
    steps: [
      { label: 'Describe request', detail: 'Mcp-Method·Mcp-Name과 요청 목적을 명시' },
      { label: 'Negotiate', detail: '각 요청의 _meta에서 version·capability를 협상' },
      { label: 'Discover', detail: 'server/discover로 필요한 capability를 조회' },
      { label: 'Invoke', detail: '독립적으로 이해 가능한 typed request와 result 교환' },
    ],
    boundary: '2026-07-28 core는 session 초기화를 요구하지 않는다. 장기 상태는 core session에 숨기지 않고 handle이나 Tasks extension 같은 명시적 계약으로 둔다.',
  },
  mcp2025: {
    label: 'MCP · 2025 legacy',
    owner: 'Agent host와 외부 capability 사이',
    parties: 'Host · Client · Server',
    steps: [
      { label: 'Initialize', detail: 'Session 시작 시 protocol version과 capability를 협상' },
      { label: 'Discover', detail: 'Tool·resource·prompt schema를 조회' },
      { label: 'Invoke', detail: 'Typed arguments로 한 capability를 호출' },
      { label: 'Result', detail: 'Content, structured result 또는 tool error 반환' },
    ],
    boundary: '이 sessionful initialize 흐름은 2025 규격을 읽을 때의 기준이다. 2026-07-28 core의 현재 request flow로 그대로 옮기지 않는다.',
  },
  a2a: {
    label: 'A2A · 1.0',
    owner: '서로 불투명한 agent application 사이',
    parties: 'Client agent · Remote agent · User',
    steps: [
      { label: 'Discover', detail: 'Signed Agent Card에서 capability와 identity 확인' },
      { label: 'Negotiate', detail: '지원 version과 HTTP·gRPC·JSON-RPC binding 선택' },
      { label: 'SendMessage', detail: 'Goal, context와 artifact가 붙은 message 전달' },
      { label: 'Artifact', detail: '결과를 받고 별도 verifier로 확인' },
    ],
    boundary: '상대 agent의 memory와 내부 tool은 보이지 않는다. Version·binding·message·task와 artifact만 계약하고 결과는 별도로 검증한다.',
  },
};

export function ProtocolBoundaryLab() {
  const [protocol, setProtocol] = useState<Protocol>('mcp2026');
  const data = protocolData[protocol];

  return (
    <section data-protocol-boundary-lab className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="grid gap-4 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5">
        <div>
          <p className="text-xs font-bold text-muted-foreground">프로토콜 경계 · PROTOCOL BOUNDARY</p>
          <h3 className="mt-2 text-base font-bold">Tool을 호출하는가, 독립 agent에게 task를 맡기는가?</h3>
        </div>
        <Segmented
          label="Protocol 선택"
          value={protocol}
          options={[
            { value: 'mcp2026', label: 'MCP · 2026' },
            { value: 'mcp2025', label: 'MCP · 2025 delta' },
            { value: 'a2a', label: 'A2A · 1.0' },
          ]}
          onChange={setProtocol}
        />
      </header>
      <div className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-2xl font-black">{data.label}</p>
            <p className="mt-2 text-xs font-bold text-muted-foreground">{data.parties}</p>
            <p className="mt-2 text-sm leading-relaxed">{data.owner}</p>
          </div>
          <ol className="grid min-w-0 gap-2 sm:grid-cols-2">
            {data.steps.map((step, index) => (
              <li key={step.label} className="min-w-0 border-t border-border pt-3">
                <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <strong className="ml-2 text-sm">{step.label}</strong>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-5 border-l-2 border-sky-500 pl-3 text-sm leading-relaxed">{data.boundary}</p>
      </div>
    </section>
  );
}

const routeData: Record<Symptom, {
  label: string;
  diagnosis: string;
  article: string;
  slug: string;
  stop: string;
  icon: typeof Monitor;
}> = {
  grounding: {
    label: '클릭이 틀린다',
    diagnosis: '관찰 revision, target grounding과 effect verification 문제',
    article: 'Computer Use Agent',
    slug: 'computer-use-agent-runtime',
    stop: 'Fresh observation과 end-state proof가 없으면 자동 commit을 멈춘다.',
    icon: Monitor,
  },
  continuity: {
    label: '작업이 끊긴다',
    diagnosis: 'Context가 아니라 durable state와 checkpoint 문제',
    article: 'LLM Harness',
    slug: 'llm-harness',
    stop: '새 sandbox가 transcript 없이도 artifact와 test에서 재개되는지 확인한다.',
    icon: FileClock,
  },
  coordination: {
    label: 'Worker가 충돌한다',
    diagnosis: 'Task 분리, shared state, merge owner와 verifier 문제',
    article: '멀티 에이전트 런타임',
    slug: 'multi-agent-implementation',
    stop: '독립 산출물과 verifier가 없으면 agent 수를 늘리지 않는다.',
    icon: GitBranch,
  },
  safety: {
    label: '권한이 위험하다',
    diagnosis: 'Untrusted source에서 privileged sink로 가는 data-flow 문제',
    article: 'Prompt Injection 방어',
    slug: 'prompt-injection-defense',
    stop: 'Model confidence를 authorization으로 사용하지 않는다.',
    icon: KeyRound,
  },
  evaluation: {
    label: '개선인지 모른다',
    diagnosis: '최종 답변이 아니라 trace, state와 반복 trial 문제',
    article: 'Agent Evaluation & Trace',
    slug: 'agent-evaluation-trace',
    stop: '같은 initial state의 paired rerun 없이 개선을 선언하지 않는다.',
    icon: ScanSearch,
  },
};

export function AgentRouteChooserLab() {
  const [symptom, setSymptom] = useState<Symptom>('grounding');
  const data = routeData[symptom];
  const Icon = data.icon;

  return (
    <section data-agent-route-chooser className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="border-b border-border p-4 sm:p-5">
        <p className="text-xs font-bold text-muted-foreground">실패에서 시작 · START FROM FAILURE</p>
        <h3 className="mt-2 text-base font-bold">지금 겪는 실패를 먼저 고른다</h3>
        <div className="mt-4">
          <Segmented
            label="실패 증상"
            value={symptom}
            options={Object.entries(routeData).map(([value, item]) => ({
              value: value as Symptom,
              label: item.label,
            }))}
            onChange={setSymptom}
          />
        </div>
      </header>
      <div className="grid min-w-0 gap-5 p-4 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-start sm:p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{data.diagnosis}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong>중단선:</strong> {data.stop}</p>
        </div>
        <Link
          to={articlePath('ai', data.slug)}
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md bg-foreground px-3 py-2 text-xs font-bold text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {data.article}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

const guiScenarios: Record<GuiScenario, {
  label: string;
  frame: string;
  target: string;
  hazard: string;
  outcome: string;
}> = {
  stale: {
    label: '오래된 화면',
    frame: 'rev 41 · 12초 전',
    target: '고객 A의 상태 변경 버튼',
    hazard: 'rev 42에서 목록 정렬이 바뀌어 같은 좌표가 고객 B를 가리킨다.',
    outcome: '새 frame을 받고 target identity를 다시 resolve',
  },
  overlay: {
    label: 'Overlay',
    frame: 'rev 58 · 현재',
    target: '제출 버튼',
    hazard: 'Cookie modal이 버튼을 덮어 실제 hit target이 다르다.',
    outcome: 'Occlusion을 제거하고 enabled·visible·hit-test를 재검증',
  },
  commit: {
    label: '결제 제출',
    frame: 'rev 73 · 현재',
    target: '48,000원 지급 확정',
    hazard: '클릭 뒤 network timeout이라 commit 여부가 모호하다.',
    outcome: '재클릭 전에 transaction history와 receipt를 조회',
  },
};

const computerSteps = [
  { label: 'Observe', icon: Eye },
  { label: 'Ground', icon: ScanSearch },
  { label: 'Propose', icon: Bot },
  { label: 'Gate', icon: UserCheck },
  { label: 'Act', icon: Play },
  { label: 'Verify', icon: ShieldCheck },
];

export function ComputerUseLoopLab() {
  const [scenario, setScenario] = useState<GuiScenario>('stale');
  const [step, setStep] = useState(0);
  const data = guiScenarios[scenario];
  const descriptions = [
    `Screenshot ${data.frame}와 URL·viewport·active window를 하나의 observation으로 묶는다.`,
    `${data.target}을 의미·DOM/a11y identity·geometry로 다시 찾는다.`,
    'Target identity, action, 예상 변화와 observation revision을 proposal에 고정한다.',
    scenario === 'commit' ? '금액·대상·action hash를 사람에게 보여 commit 승인을 받는다.' : 'Policy가 action scope와 위험을 판정한다.',
    scenario === 'stale' ? 'Freshness gate가 막으므로 아직 클릭하지 않는다.' : '격리된 browser가 한 번 실행하고 receipt를 기록한다.',
    `${data.outcome}. 클릭 성공이 아니라 환경의 새 상태로 완료를 증명한다.`,
  ];

  const selectScenario = (next: GuiScenario) => {
    setScenario(next);
    setStep(0);
  };

  return (
    <section data-computer-use-loop className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="border-b border-border p-4 sm:p-5">
        <p className="text-xs font-bold text-muted-foreground">컴퓨터 사용 순환 · COMPUTER USE LOOP</p>
        <h3 className="mt-2 text-base font-bold">좌표를 기억하지 말고 관찰에서 effect까지 다시 닫는다</h3>
        <div className="mt-4">
          <Segmented
            label="GUI 실패 시나리오"
            value={scenario}
            options={Object.entries(guiScenarios).map(([value, item]) => ({
              value: value as GuiScenario,
              label: item.label,
            }))}
            onChange={selectScenario}
          />
        </div>
      </header>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Computer use 실행 단계">
          {computerSteps.map((item, index) => {
            const Icon = item.icon;
            const active = step === index;
            return (
              <button
                key={item.label}
                type="button"
                aria-label={`${item.label} 단계`}
                aria-current={active ? 'step' : undefined}
                onClick={() => setStep(index)}
                className={cn(
                  'min-w-0 rounded-md border px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  active ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40',
                )}
              >
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                  {item.label}
                </span>
                <span className={cn('mt-1 block font-mono text-xs', active ? 'text-background/70' : 'text-muted-foreground')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid min-w-0 gap-4 border-y border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-xs font-bold text-muted-foreground">{data.frame}</p>
            <p className="mt-2 text-sm font-bold">{data.target}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed">{descriptions[step]}</p>
            <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-rose-700 dark:text-rose-300">
              <AlertTriangle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {data.hazard}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="이전 단계"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs font-bold text-muted-foreground">{step + 1} / {computerSteps.length}</span>
          <button
            type="button"
            aria-label="다음 단계"
            disabled={step === computerSteps.length - 1}
            onClick={() => setStep((current) => Math.min(computerSteps.length - 1, current + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

const retryData: Record<RetryClass, {
  label: string;
  example: string;
  timeoutDecision: string;
  provenNoEffect: string;
  receipt: string;
  tone: 'safe' | 'check' | 'stop';
}> = {
  read: {
    label: 'Pure read',
    example: '고객 상태 조회',
    timeoutDecision: '같은 query를 다시 읽어도 외부 상태가 바뀌지 않는다.',
    provenNoEffect: '즉시 retry 가능',
    receipt: 'Response revision',
    tone: 'safe',
  },
  keyed: {
    label: 'Keyed write',
    example: 'Idempotency key가 있는 환불 API',
    timeoutDecision: '같은 key로 조회하거나 재호출해 한 effect만 허용한다.',
    provenNoEffect: '같은 key로 retry',
    receipt: 'Request ID + transaction ID',
    tone: 'check',
  },
  gui: {
    label: 'GUI commit',
    example: '지급 확정 버튼 클릭',
    timeoutDecision: '클릭 receipt가 없으므로 새 화면·내역에서 effect를 먼저 확인한다.',
    provenNoEffect: 'Effect 없음이 증명된 뒤만 재시도',
    receipt: 'Fresh end state + audit record',
    tone: 'stop',
  },
};

export function RetrySafetyLab() {
  const [kind, setKind] = useState<RetryClass>('gui');
  const [effectChecked, setEffectChecked] = useState(false);
  const data = retryData[kind];
  const decision = kind === 'read'
    ? 'RETRY'
    : kind === 'keyed'
      ? 'REUSE KEY'
      : effectChecked ? 'RETRY ONCE' : 'VERIFY FIRST';

  const selectKind = (next: RetryClass) => {
    setKind(next);
    setEffectChecked(false);
  };

  return (
    <section data-retry-safety-lab className="not-prose my-8 min-w-0 scroll-mt-20 rounded-md border border-border bg-background">
      <header className="border-b border-border p-4 sm:p-5">
        <p className="text-xs font-bold text-muted-foreground">결과가 모호한 시간 초과 · AMBIGUOUS TIMEOUT</p>
        <h3 className="mt-2 text-base font-bold">응답이 없었다고 effect도 없었던 것은 아니다</h3>
        <div className="mt-4">
          <Segmented
            label="Action 분류"
            value={kind}
            options={Object.entries(retryData).map(([value, item]) => ({
              value: value as RetryClass,
              label: item.label,
            }))}
            onChange={selectKind}
          />
        </div>
      </header>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-bold">{data.example}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.timeoutDecision}</p>
            <dl className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold text-muted-foreground">필요한 증거</dt>
                <dd className="mt-1 text-sm">{data.receipt}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Retry 조건</dt>
                <dd className="mt-1 text-sm">{data.provenNoEffect}</dd>
              </div>
            </dl>
            {kind === 'gui' && (
              <label className="mt-4 flex min-h-11 w-fit cursor-pointer items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={effectChecked}
                  onChange={(event) => setEffectChecked(event.target.checked)}
                  className="h-4 w-4 accent-foreground"
                />
                내역 조회로 effect 없음 확인
              </label>
            )}
          </div>
          <div className={cn(
            'flex min-h-24 flex-col items-center justify-center rounded-md border px-3 py-4 text-center',
            decision === 'RETRY' && 'border-emerald-500/40 bg-emerald-500/5',
            decision === 'REUSE KEY' && 'border-sky-500/40 bg-sky-500/5',
            decision === 'VERIFY FIRST' && 'border-rose-500/40 bg-rose-500/5',
            decision === 'RETRY ONCE' && 'border-amber-500/40 bg-amber-500/5',
          )}>
            {decision === 'VERIFY FIRST'
              ? <CircleStop aria-hidden className="h-5 w-5 text-rose-600" />
              : <RefreshCcw aria-hidden className="h-5 w-5" />}
            <strong className="mt-2 font-mono text-xs">{decision}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EffectContractStrip() {
  return (
    <div data-effect-contract className="not-prose my-7 grid min-w-0 gap-0 border-y border-border sm:grid-cols-3">
      {[
        { label: 'Proposal', value: '무엇을 왜 할지', icon: Bot },
        { label: '실행 승인 경계', value: '누가 어떤 범위로 허용했는지', icon: UserCheck },
        { label: 'Effect proof', value: '환경에서 실제로 무엇이 바뀌었는지', icon: Database },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="min-w-0 border-t border-border py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:px-4 sm:first:border-l-0">
            <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Icon aria-hidden className="h-4 w-4" />
              {item.label}
            </span>
            <p className="mt-2 text-sm leading-relaxed">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function ComputerUseEvaluationStrip() {
  return (
    <div data-computer-eval-strip className="not-prose my-7 min-w-0 border-y border-border">
      {[
        ['환경 reset', '같은 initial state에서 시작해야 trial이 비교된다.'],
        ['End-state checker', '마지막 문장이 아니라 실제 DB·파일·화면 상태를 검사한다.'],
        ['반복 trial', '한 번 성공 대신 seed·layout·latency perturbation에서 분포를 본다.'],
        ['Safety invariant', 'Task 성공과 별도로 forbidden click·외부 전송·중복 commit을 0으로 요구한다.'],
      ].map(([label, detail], index) => (
        <div key={label} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-x-2 gap-y-1 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)]">
          <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          <strong className="text-sm">{label}</strong>
          <span className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-auto">{detail}</span>
        </div>
      ))}
    </div>
  );
}
