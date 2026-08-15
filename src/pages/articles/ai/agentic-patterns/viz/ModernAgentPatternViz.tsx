import { motion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";

type NodeShape = "circle" | "diamond" | "document" | "gate";

interface SceneNode {
  label: string;
  caption: string;
  shape: NodeShape;
}

interface PatternVizProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  nodes: readonly SceneNode[];
  edgeLabels: readonly string[];
  sceneNotes: readonly string[];
  note: string;
}

function shapeClass(shape: NodeShape) {
  if (shape === "circle") return "h-24 w-24 rounded-full";
  if (shape === "diamond") return "h-16 w-16 rotate-45 rounded-sm";
  if (shape === "document") return "min-h-24 w-24 rounded-sm [clip-path:polygon(0_0,82%_0,100%_18%,100%_100%,0_100%)]";
  return "min-h-24 w-24 rounded-sm [clip-path:polygon(12%_0,88%_0,100%_50%,88%_100%,12%_100%,0_50%)]";
}

function FlowArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="grid shrink-0 place-items-center gap-1 py-1 lg:w-16">
      <svg viewBox="0 0 60 22" aria-hidden className="h-7 w-12 rotate-90 lg:rotate-0">
        <motion.path
          d="M3 11h46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="5 4"
          className={active ? "text-primary" : "text-border"}
          animate={active ? { strokeDashoffset: [9, 0] } : undefined}
          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
        />
        <path d="m44 5 10 6-10 6" fill="none" stroke="currentColor" strokeWidth="1.25" className={active ? "text-primary" : "text-border"} />
      </svg>
      <span className="max-w-16 text-center font-mono text-[9px] font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

function PatternViz({ id, eyebrow, title, description, nodes, edgeLabels, sceneNotes, note }: PatternVizProps) {
  const controls = useAnimatedScenes(nodes.length, 2100);
  const activeNode = nodes[controls.active];

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note}>
      <div
        data-viz={id}
        tabIndex={0}
        role="group"
        aria-label={`${title} animation`}
        onKeyDown={controls.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-canvas className="grid min-w-0 gap-2 lg:grid-cols-[repeat(7,minmax(0,1fr))] lg:items-center">
          {nodes.map((node, index) => {
            const reached = index <= controls.active;
            const selected = index === controls.active;
            return (
              <div key={node.label} className="contents">
                <div className="grid min-w-0 place-items-center gap-3 py-2">
                  <motion.div
                    className={`grid place-items-center border px-3 py-3 text-center ${shapeClass(node.shape)} ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : reached
                          ? "border-primary/45 bg-primary/[0.035]"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                    animate={selected && controls.playing ? { scale: [1, 1.045, 1] } : undefined}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <div className={node.shape === "diamond" ? "-rotate-45" : ""}>
                      <span className="font-mono text-[9px] font-black">0{index + 1}</span>
                      <strong className="mt-1 block text-xs leading-5">{node.label}</strong>
                    </div>
                  </motion.div>
                  <p className="max-w-40 text-center text-[11px] leading-5 text-muted-foreground">{node.caption}</p>
                </div>
                {index < nodes.length - 1 ? <FlowArrow active={controls.active > index} label={edgeLabels[index]} /> : null}
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-2 border-l border-primary/60 pl-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-primary">CUT 0{controls.active + 1}</p>
          <div>
            <p className="text-sm font-bold">{activeNode.label}</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{sceneNotes[controls.active]}</p>
          </div>
        </div>

        <AnimatedSceneControls
          labels={nodes.map((node) => node.label)}
          active={controls.active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
      </div>
    </VizFrame>
  );
}

export function AgentLoopViz() {
  return <PatternViz id="agent-loop-state-transition" eyebrow="State transition" title="Model은 action을 제안하고, runtime이 세계를 바꿉니다" description="상태에서 바로 effect로 점프하지 않고 proposal·authorization·execution·typed observation을 차례로 통과합니다." nodes={[
    { label: "Observable state", caption: "goal · artifact · recent evidence", shape: "document" },
    { label: "Action proposal", caption: "tool name · validated arguments", shape: "circle" },
    { label: "Runtime gate", caption: "identity · permission · approval", shape: "gate" },
    { label: "Typed observation", caption: "status · payload · receipt", shape: "document" },
  ]} edgeLabels={["model", "authorize", "execute"]} sceneNotes={[
    "Model에게 보이는 것은 전체 세계가 아니라 다음 판단에 허용된 state snapshot입니다.",
    "Action은 effect가 아니라 실행 요청입니다. 이 단계에서는 파일·DB·결제가 아직 바뀌지 않습니다.",
    "Runtime이 capability·resource·budget·fresh approval을 검사하고 허용된 action만 executor에 보냅니다.",
    "성공·거부·timeout·partial effect를 다른 status와 receipt로 남겨 다음 state를 갱신합니다.",
  ]} note="현재 state로 되돌아가는 observation feedback edge가 loop를 완성합니다. Terminal state는 매 iteration 뒤 별도로 판정합니다." />;
}

export function PlanReplanningViz() {
  return <PatternViz id="agent-plan-replanning" eyebrow="Executable plan" title="Plan은 문장 목록이 아니라 evidence가 흐르는 dependency graph입니다" description="Task artifact가 검증되고, 새 evidence가 assumption을 깨면 영향받은 downstream만 다시 엽니다." nodes={[
    { label: "Task A", caption: "input snapshot · owner", shape: "document" },
    { label: "Artifact v3", caption: "URI · checksum · validator", shape: "diamond" },
    { label: "Task B", caption: "depends on A:v3", shape: "document" },
    { label: "Replan", caption: "invalidate affected path only", shape: "gate" },
  ]} edgeLabels={["produce", "consume", "new evidence"]} sceneNotes={[
    "Task에는 동사뿐 아니라 dependency·owner·output schema·completion evidence가 있어야 실행과 완료를 판정할 수 있습니다.",
    "Artifact identity와 validator result가 plan state에 남아야 restart 뒤에도 model summary가 아닌 registry로 진행률을 복원합니다.",
    "Downstream task는 정확히 어느 version을 읽었는지 기록해 새 evidence가 미치는 범위를 계산합니다.",
    "깨진 assumption과 downstream만 pending으로 돌리고 checksum이 같은 unrelated artifact는 보존합니다.",
  ]} note="Reflection은 replan의 근거입니다. feedback source·원인·수정 대상·재검증 command가 없으면 단순 자기평가 문장에 그칩니다." />;
}

export function DelegationOwnershipViz() {
  return <PatternViz id="agent-delegation-ownership" eyebrow="Delegation contract" title="여러 agent의 핵심은 수가 아니라 writer와 state owner입니다" description="입력 snapshot과 산출물 schema를 고정하고, manager call과 handoff가 누가 사용자 상태를 소유하는지 구분합니다." nodes={[
    { label: "Pinned input", caption: "objective · source snapshot", shape: "document" },
    { label: "Delegate", caption: "bounded tools · deadline", shape: "circle" },
    { label: "Artifact receipt", caption: "schema · checksum · evidence", shape: "diamond" },
    { label: "State owner", caption: "manager or specialist", shape: "gate" },
  ]} edgeLabels={["assign", "submit", "verify + merge"]} sceneNotes={[
    "각 delegate가 같은 moving source를 읽지 않도록 input version과 읽기·쓰기 범위를 고정합니다.",
    "Delegate는 자유 대화 상대가 아니라 제한된 capability와 output contract를 가진 worker입니다.",
    "‘완료했다’는 문장 대신 artifact URI·checksum·validator evidence를 coordinator가 확인합니다.",
    "Manager call은 중앙이 대화 state를 유지하고, handoff는 specialist가 pending state와 다음 user turn을 인수합니다.",
  ]} note="Parallel fan-out은 task가 독립이고 merge가 commutative·idempotent하거나 conflict detector가 있을 때만 안전합니다." />;
}

export function ExtensionAuthorityViz() {
  return <PatternViz id="agent-extension-authority" eyebrow="Authority boundary" title="Hook·Skill·Guardrail·Verifier는 서로 다른 질문에 답합니다" description="언제 실행되는가, 무엇을 알려 주는가, 무엇을 막는가, 무엇을 합격시키는가를 네 모양으로 분리합니다." nodes={[
    { label: "Hook", caption: "event에 자동 실행", shape: "circle" },
    { label: "Skill", caption: "필요할 때 읽는 procedure", shape: "document" },
    { label: "Guardrail", caption: "policy deny · approval", shape: "gate" },
    { label: "Verifier", caption: "artifact acceptance", shape: "diamond" },
  ]} edgeLabels={["may load", "constrain", "evaluate"]} sceneNotes={[
    "Hook은 tool 전후·session 종료 같은 runtime event에 결정적으로 실행되지만 새 capability를 만들지는 않습니다.",
    "Skill은 지침·reference·script를 점진적으로 공개하는 지식 묶음이며 실행 권한 그 자체가 아닙니다.",
    "Guardrail은 input·output·action이 policy를 넘지 못하게 deny·redact·approval로 더 제한합니다.",
    "Verifier는 결과 artifact가 schema·test·invariant·rubric을 만족하는지 판정하며 policy pass와 별개입니다.",
  ]} note="하나의 callback에 네 책임을 섞으면 우회 경로와 false completion을 추적하기 어렵습니다. Decision owner를 분리해 기록합니다." />;
}
