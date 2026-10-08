import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

type ScenarioId = "scheduling" | "service" | "runtime";

interface Scenario {
  id: ScenarioId;
  domain: string;
  title: string;
  timeboxMinutes: number;
  task: string;
  acceptance: readonly string[];
  hints: readonly string[];
  requiredEvidence: readonly string[];
}

interface SimulatorState {
  fixed: boolean;
  onWorker: boolean;
  evidence: string[];
}

interface TerminalLine {
  id: number;
  kind: "command" | "output" | "system" | "error";
  text: string;
}

const scenarios: readonly Scenario[] = [
  {
    id: "scheduling",
    domain: "Workloads & Scheduling",
    title: "Pending Pod의 첫 실패 전환을 복구하세요",
    timeboxMinutes: 8,
    task: "shop namespace의 checkout Deployment는 replica 3개를 원하지만 2개만 Ready입니다. 원인을 증거로 확인하고, CPU request를 250m·memory request를 256Mi로 고쳐 3개가 모두 Ready가 되게 하세요.",
    acceptance: ["올바른 context를 확인했습니다.", "PodScheduled=False의 원인을 확인했습니다.", "Deployment request를 수정했습니다.", "rollout이 완료됐음을 검증했습니다."],
    hints: [
      "아직 nodeName이 없는 Pod라면 container log보다 scheduling condition과 event를 먼저 봅니다.",
      "get pods로 Pending Pod 이름을 찾고 describe로 Unschedulable message를 읽습니다.",
      "진단 예: kubectl -n shop describe pod checkout-7d8f-pending",
    ],
    requiredEvidence: ["context", "diagnosis", "fix", "verify"],
  },
  {
    id: "service",
    domain: "Services & Networking",
    title: "Ready Pod가 있는데 Service가 503인 원인을 찾으세요",
    timeboxMinutes: 8,
    task: "shop namespace의 checkout Pod 세 개는 Ready지만 Service 요청은 503입니다. Service selector와 Pod label을 대조해 endpoint를 복구하고 health request가 성공하게 하세요.",
    acceptance: ["현재 context를 확인했습니다.", "Service selector와 Pod label의 불일치를 증명했습니다.", "selector를 app=checkout으로 수정했습니다.", "EndpointSlice에 주소 세 개가 생겼음을 확인했습니다.", "실제 health request를 검증했습니다."],
    hints: [
      "Running·Ready는 Pod 상태입니다. Service가 그 Pod를 선택했다는 뜻은 아닙니다.",
      "Service YAML, Pod label, EndpointSlice를 같은 namespace에서 대조합니다.",
      "진단 예: kubectl -n shop get endpointslice -l kubernetes.io/service-name=checkout",
    ],
    requiredEvidence: ["context", "diagnosis", "fix", "endpoint", "verify"],
  },
  {
    id: "runtime",
    domain: "Troubleshooting",
    title: "NotReady node의 runtime 경계를 복구하세요",
    timeboxMinutes: 10,
    task: "worker-2가 NotReady이고 새 Pod의 sandbox 생성이 실패합니다. API object에서 host service까지 원인을 좁히고 containerd를 복구한 뒤 node가 Ready가 되는지 확인하세요.",
    acceptance: ["현재 context를 확인했습니다.", "Node condition과 kubelet message를 읽었습니다.", "worker-2에서 containerd 상태를 확인했습니다.", "containerd를 복구했습니다.", "API에서 Ready condition을 검증했습니다."],
    hints: [
      "kubelet process가 살아 있어도 container runtime socket이 응답하지 않을 수 있습니다.",
      "describe node의 condition을 본 뒤 worker-2 host로 내려가 service 상태를 확인합니다.",
      "진단 예: ssh worker-2 다음 sudo systemctl status containerd",
    ],
    requiredEvidence: ["context", "nodeCondition", "diagnosis", "fix", "verify"],
  },
];

const evidenceLabels: Readonly<Record<string, string>> = {
  context: "context 확인",
  diagnosis: "원인 증거",
  nodeCondition: "Node condition",
  fix: "최소 변경",
  endpoint: "EndpointSlice 검증",
  verify: "수정 후 검증",
};

const references = [
  { label: "bmuschko/cka-crash-course", href: "https://github.com/bmuschko/cka-crash-course", note: "self-contained exercise와 solution 분리" },
  { label: "chadmcrowell/CKA-Exercises", href: "https://github.com/chadmcrowell/CKA-Exercises", note: "domain별 outcome 중심 문제 구성" },
  { label: "xooooooooox/cka-exercises", href: "https://github.com/xooooooooox/cka-exercises", note: "검색·quiz·진도 UI와 정적 web app" },
  { label: "devopshubproject/cka-lab", href: "https://github.com/devopshubproject/cka-lab", note: "kubeadm 환경의 scenario형 연습" },
  { label: "edixos/cka-labs", href: "https://github.com/edixos/cka-labs", note: "bootstrap부터 observability까지 module 구성" },
  { label: "simonbbbb/CKA-Hand-on-lab", href: "https://github.com/simonbbbb/CKA-Hand-on-lab", note: "task·solution·setup 분리와 hands-on UI" },
  { label: "sailor-sh/CK-X", href: "https://github.com/sailor-sh/CK-X", note: "시간 제한·terminal·자동 검증 구조" },
  { label: "stephrobert/kubernetes-dsoxlab-training", href: "https://github.com/stephrobert/kubernetes-dsoxlab-training", note: "검증 가능한 lab·test·curriculum 구조" },
] as const;

function freshState(): SimulatorState {
  return { fixed: false, onWorker: false, evidence: [] };
}

function mark(state: SimulatorState, evidence: string): SimulatorState {
  if (state.evidence.includes(evidence)) return state;
  return { ...state, evidence: [...state.evidence, evidence] };
}

function normalizeCommand(raw: string): string {
  return raw
    .trim()
    .replace(/^k\s+/, "kubectl ")
    .replace(" get po ", " get pods ")
    .replace(" describe po ", " describe pod ")
    .replace(" get svc ", " get service ")
    .replace(" patch svc ", " patch service ")
    .replace(" set resources deploy ", " set resources deployment ")
    .replace(/\s+/g, " ");
}

function runScheduling(command: string, current: SimulatorState): { state: SimulatorState; output: string; error?: boolean } {
  let state = current;
  if (command === "kubectl config current-context") {
    state = mark(state, "context");
    return { state, output: "cka-lab" };
  }
  if (command.startsWith("kubectl -n shop get deploy checkout")) {
    return { state, output: state.fixed ? "NAME       READY   UP-TO-DATE   AVAILABLE\ncheckout   3/3     3            3" : "NAME       READY   UP-TO-DATE   AVAILABLE\ncheckout   2/3     3            2" };
  }
  if (command.startsWith("kubectl -n shop get pods")) {
    return { state, output: state.fixed ? "checkout-7d8f-a   1/1   Running\ncheckout-7d8f-b   1/1   Running\ncheckout-69bc-c   1/1   Running" : "checkout-7d8f-a         1/1   Running\ncheckout-7d8f-b         1/1   Running\ncheckout-7d8f-pending   0/1   Pending" };
  }
  if (command === "kubectl -n shop describe pod checkout-7d8f-pending") {
    state = mark(state, "diagnosis");
    return { state, output: "Conditions:\n  PodScheduled  False\nEvents:\n  Warning  FailedScheduling  0/3 nodes are available: 3 Insufficient cpu." };
  }
  if (command.startsWith("kubectl -n shop set resources deployment checkout") && command.includes("cpu=250m") && command.includes("memory=256Mi")) {
    state = mark({ ...state, fixed: true }, "fix");
    return { state, output: "deployment.apps/checkout resource requirements updated" };
  }
  if (command === "kubectl -n shop rollout status deployment checkout") {
    if (!state.fixed) return { state, output: "Waiting for deployment \"checkout\" rollout to finish: 2 of 3 updated replicas are available..." };
    state = mark(state, "verify");
    return { state, output: "deployment \"checkout\" successfully rolled out" };
  }
  return { state, output: "이 simulator가 인식하지 못한 명령입니다. help를 입력해 범위를 확인하세요.", error: true };
}

function runService(command: string, current: SimulatorState): { state: SimulatorState; output: string; error?: boolean } {
  let state = current;
  if (command === "kubectl config current-context") {
    state = mark(state, "context");
    return { state, output: "cka-lab" };
  }
  if (command.startsWith("kubectl -n shop get service checkout")) {
    state = mark(state, "selector");
    if (state.evidence.includes("podLabels")) state = mark(state, "diagnosis");
    return { state, output: `apiVersion: v1\nkind: Service\nmetadata:\n  name: checkout\nspec:\n  selector:\n    app: ${state.fixed ? "checkout" : "payments"}\n  ports:\n  - port: 80` };
  }
  if (command.startsWith("kubectl -n shop get pods") && command.includes("show-labels")) {
    state = mark(state, "podLabels");
    if (state.evidence.includes("selector")) state = mark(state, "diagnosis");
    return { state, output: "NAME              READY   STATUS    LABELS\ncheckout-a        1/1     Running   app=checkout\ncheckout-b        1/1     Running   app=checkout\ncheckout-c        1/1     Running   app=checkout" };
  }
  if (command.startsWith("kubectl -n shop get endpointslice")) {
    if (!state.fixed) {
      return { state, output: "NAME             ADDRESSTYPE   PORTS   ENDPOINTS\ncheckout-empty   IPv4          8080    <none>" };
    }
    state = mark(state, "endpoint");
    return { state, output: "NAME             ADDRESSTYPE   PORTS   ENDPOINTS\ncheckout-4k9t2   IPv4          8080    10.244.1.7,10.244.2.4,10.244.2.8" };
  }
  if (command.startsWith("kubectl -n shop patch service checkout") && command.replace(/\s/g, "").includes('"app":"checkout"')) {
    state = mark({ ...state, fixed: true }, "fix");
    return { state, output: "service/checkout patched" };
  }
  if (command.startsWith("curl ") && command.includes("checkout.shop.svc") && command.includes("health")) {
    if (!state.fixed) return { state, output: "HTTP/1.1 503 Service Unavailable" };
    state = mark(state, "verify");
    return { state, output: "HTTP/1.1 200 OK\n{\"status\":\"ok\"}" };
  }
  return { state, output: "이 simulator가 인식하지 못한 명령입니다. help를 입력해 범위를 확인하세요.", error: true };
}

function runRuntime(command: string, current: SimulatorState): { state: SimulatorState; output: string; error?: boolean } {
  let state = current;
  if (command === "kubectl config current-context") {
    state = mark(state, "context");
    return { state, output: "cka-lab" };
  }
  if (command.startsWith("kubectl get nodes")) {
    return { state, output: state.fixed ? "controlplane   Ready\nworker-1       Ready\nworker-2       Ready" : "controlplane   Ready\nworker-1       Ready\nworker-2       NotReady" };
  }
  if (command === "kubectl describe node worker-2") {
    state = mark(state, "nodeCondition");
    return { state, output: "Conditions:\n  Ready  False  KubeletNotReady\nMessage: container runtime network not ready: rpc error: connection refused" };
  }
  if (command === "ssh worker-2") {
    return { state: { ...state, onWorker: true }, output: "Connected to worker-2. Prompt changed to root@worker-2." };
  }
  if (command === "exit" && state.onWorker) {
    return { state: { ...state, onWorker: false }, output: "logout\nConnection to worker-2 closed." };
  }
  if (command === "sudo systemctl status containerd") {
    if (!state.onWorker) return { state, output: "이 명령은 worker-2에 SSH로 접속한 뒤 실행하세요.", error: true };
    state = mark(state, "diagnosis");
    return { state, output: state.fixed ? "● containerd.service - containerd\n   Active: active (running)" : "● containerd.service - containerd\n   Active: failed (Result: exit-code)\n   Main PID exited unexpectedly" };
  }
  if (command === "sudo systemctl restart containerd") {
    if (!state.onWorker) return { state, output: "이 명령은 worker-2에 SSH로 접속한 뒤 실행하세요.", error: true };
    state = mark({ ...state, fixed: true }, "fix");
    return { state, output: "containerd.service restarted" };
  }
  if (command === "sudo systemctl restart kubelet") {
    if (!state.onWorker) return { state, output: "이 명령은 worker-2에 SSH로 접속한 뒤 실행하세요.", error: true };
    return { state, output: "kubelet.service restarted" };
  }
  if (command.startsWith("kubectl wait") && command.includes("condition=Ready") && command.includes("worker-2")) {
    if (state.onWorker) return { state, output: "control-plane kubeconfig가 있는 prompt로 돌아간 뒤 실행하세요.", error: true };
    if (!state.fixed) return { state, output: "error: timed out waiting for the condition on nodes/worker-2" };
    state = mark(state, "verify");
    return { state, output: "node/worker-2 condition met" };
  }
  return { state, output: "이 simulator가 인식하지 못한 명령입니다. help를 입력해 범위를 확인하세요.", error: true };
}

function runCommand(scenario: ScenarioId, raw: string, state: SimulatorState) {
  const command = normalizeCommand(raw);
  if (command === "help") {
    return { state, output: "지원 범위: kubectl config/get/describe/set resources/patch/rollout/wait, ssh, systemctl, curl, clear. 실제 shell이 아니라 이 문제에 필요한 상태 전이만 재현합니다." };
  }
  if (scenario === "scheduling") return runScheduling(command, state);
  if (scenario === "service") return runService(command, state);
  return runRuntime(command, state);
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function CkaInteractiveLab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [simulator, setSimulator] = useState<SimulatorState>(freshState);
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, kind: "system", text: "CKA browser lab simulator · help를 입력하면 지원 범위를 볼 수 있습니다." },
  ]);
  const [hintLevel, setHintLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [gradeMessage, setGradeMessage] = useState("");
  const nextLineId = useRef(1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const scenario = scenarios[scenarioIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [scenarioIndex]);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const completion = useMemo(
    () => scenario.requiredEvidence.filter((item) => simulator.evidence.includes(item)).length,
    [scenario, simulator.evidence],
  );

  function reset(index = scenarioIndex) {
    setScenarioIndex(index);
    setSimulator(freshState());
    setCommand("");
    setHintLevel(0);
    setElapsed(0);
    setGradeMessage("");
    nextLineId.current = 1;
    setLines([{ id: 0, kind: "system", text: "새 scenario가 준비되었습니다. context부터 확인하세요." }]);
  }

  function append(kind: TerminalLine["kind"], text: string) {
    const id = nextLineId.current++;
    setLines((current) => [...current, { id, kind, text }]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = command.trim();
    if (!raw) return;
    append("command", `${simulator.onWorker ? "root@worker-2" : "student@cka"}:~$ ${raw}`);
    setCommand("");
    setGradeMessage("");
    if (raw === "clear") {
      setLines([]);
      return;
    }
    const result = runCommand(scenario.id, raw, simulator);
    setSimulator(result.state);
    append(result.error ? "error" : "output", result.output);
  }

  function grade() {
    const missing = scenario.requiredEvidence.filter((item) => !simulator.evidence.includes(item));
    setGradeMessage(
      missing.length === 0
        ? `통과 · ${formatTime(elapsed)}에 원인 증거, 최소 변경, acceptance를 모두 남겼습니다.`
        : `아직 미완료 · ${missing.map((item) => evidenceLabels[item]).join(", ")} 단계가 필요합니다.`,
    );
  }

  return (
    <div id="interactive-lab" role="region" className="not-prose my-10 min-w-0 scroll-mt-24" aria-labelledby="cka-lab-title">
      <div className="rounded-2xl border border-border bg-muted/10 p-4 sm:p-6">
        <p className="text-xs font-bold text-primary">브라우저 실습 · 결과 상태 채점</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 id="cka-lab-title" className="text-xl font-bold text-foreground">문제를 읽고 CLI에서 직접 복구하세요</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              이 창은 실제 cluster나 임의 shell을 실행하지 않는 deterministic simulator입니다. 이 글의 상태·event·수정·검증 경로를 안전하게 반복하고, 아래 원본 lab은 kind 또는 kubeadm cluster에서 별도로 실행합니다.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
            <span className="rounded-full border border-border bg-background px-3 py-1.5">경과 {formatTime(elapsed)}</span>
            <span className="rounded-full border border-border bg-background px-3 py-1.5">증거 {completion}/{scenario.requiredEvidence.length}</span>
          </div>
        </div>

        <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1" role="tablist" aria-label="CKA 실습 문제">
          {scenarios.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === scenarioIndex}
              onClick={() => reset(index)}
              className={`min-h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold ${index === scenarioIndex ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"}`}
            >
              {index + 1}. {item.domain}
            </button>
          ))}
        </div>

        <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <article className="min-w-0 rounded-xl border border-border bg-background p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-primary">{scenario.domain}</p>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">권장 {scenario.timeboxMinutes}분</span>
            </div>
            <h4 className="mt-2 text-lg font-bold text-foreground">{scenario.title}</h4>
            <p className="mt-3 text-sm leading-7 text-foreground">{scenario.task}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">완료 조건</p>
            <ol className="mt-3 space-y-2">
              {scenario.acceptance.map((item, index) => {
                const done = simulator.evidence.includes(scenario.requiredEvidence[index]);
                return (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6">
                    <span aria-hidden="true" className={`mt-0.5 font-bold ${done ? "text-emerald-600" : "text-muted-foreground"}`}>{done ? "✓" : "○"}</span>
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>{item}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setHintLevel((value) => Math.min(value + 1, scenario.hints.length))} className="min-h-11 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground hover:border-primary/50">
                힌트 {hintLevel}/{scenario.hints.length}
              </button>
              <button type="button" onClick={grade} className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
                현재 상태 채점
              </button>
              <button type="button" onClick={() => reset()} className="min-h-11 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">
                문제 초기화
              </button>
            </div>
            {hintLevel > 0 ? (
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-6 text-foreground">
                {scenario.hints.slice(0, hintLevel).map((hint, index) => <p key={hint}>{index + 1}. {hint}</p>)}
              </div>
            ) : null}
            {gradeMessage ? (
              <p aria-live="polite" className={`mt-4 rounded-lg border p-3 text-sm font-semibold ${completion === scenario.requiredEvidence.length ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-foreground"}`}>
                {gradeMessage}
              </p>
            ) : null}
          </article>

          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-slate-100" data-viz="cka-terminal-simulator">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-slate-400">cka-lab · simulated CLI</span>
            </div>
            <div ref={terminalRef} className="h-[360px] max-w-full overflow-auto p-4 font-mono text-xs leading-6 sm:text-sm" aria-live="polite">
              {lines.map((line) => (
                <pre key={line.id} className={`whitespace-pre-wrap break-words ${line.kind === "command" ? "text-cyan-300" : line.kind === "error" ? "text-rose-300" : line.kind === "system" ? "text-amber-200" : "text-slate-200"}`}>
                  {line.text}
                </pre>
              ))}
            </div>
            <form onSubmit={submit} className="flex min-w-0 items-center gap-2 border-t border-slate-800 bg-slate-900 px-4 py-3">
              <label htmlFor="cka-command" className="shrink-0 font-mono text-xs font-bold text-emerald-400">{simulator.onWorker ? "root@worker-2" : "student@cka"}:~$</label>
              <input
                id="cka-command"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="min-h-11 min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                aria-label="CKA simulator 명령 입력"
                placeholder="kubectl config current-context"
              />
              <button type="submit" className="min-h-11 shrink-0 rounded-md bg-cyan-500 px-4 text-sm font-bold text-slate-950">실행</button>
            </form>
          </div>
        </div>

        <details className="mt-6 rounded-xl border border-border bg-background p-4">
          <summary className="cursor-pointer font-semibold text-foreground">참고한 공개 CKA lab 설계와 원본 링크</summary>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">문제 문장은 그대로 복사하지 않았습니다. 각 저장소에서 self-contained task, 시간 제한, terminal, 결과 상태 채점, verifier 구조를 비교한 뒤 이 글의 3개 사건으로 새로 구성했습니다.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {references.map((reference) => (
              <li key={reference.href} className="rounded-lg border border-border p-3">
                <a className="break-words text-sm font-semibold text-primary underline underline-offset-4" href={reference.href} target="_blank" rel="noreferrer">{reference.label}</a>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{reference.note}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
