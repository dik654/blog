import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 운영자가 묻는 여덟 질문(왼쪽)과 그 질문을 끝까지 설명하는 글(오른쪽)을 선으로 잇는다.
 * 한 mechanism: 질문 하나 → 주 담당 글 하나(굵은 선) + 바닥이 되는 글(가는 선). 장면마다 질문 하나만 켜고 나머지는 흐리게 둔다.
 * 레이아웃은 모든 장면에서 같아 높이와 버튼 위치가 움직이지 않는다.
 */
interface Question {
  id: string;
  label: string;
  primary: readonly string[];
  support: readonly string[];
  note: string;
}

interface ArticleNode {
  id: string;
  label: string;
  tone: "k8s" | "existing" | "linux";
}

const ARTICLES: readonly ArticleNode[] = [
  { id: "K1", label: "K1 controller·reconcile", tone: "k8s" },
  { id: "K2", label: "K2 Pod→Node·NotReady", tone: "k8s" },
  { id: "K3", label: "K3 requests·limits·QoS", tone: "k8s" },
  { id: "K4", label: "K4 Pod 상태·probe·Event", tone: "k8s" },
  { id: "K5", label: "K5 PVC·PV·CSI", tone: "k8s" },
  { id: "K6", label: "K6 rollout·종료·PDB·HPA", tone: "k8s" },
  { id: "K7", label: "K7 SRE·SLO·업그레이드", tone: "k8s" },
  { id: "REQ", label: "요청 경로와 CKA", tone: "existing" },
  { id: "NET", label: "패킷 경로", tone: "existing" },
  { id: "LNX", label: "Linux 기초(L2·L3·L4)", tone: "linux" },
];

const QUESTIONS: readonly Question[] = [
  { id: "q1", label: "Node와 Pod의 관계", primary: ["K2"], support: ["K1"], note: "Pod는 scheduler가 고른 Node에 binding되어 spec.nodeName이 채워지고, 그 Node의 kubelet만 그 Pod를 실행합니다. Node가 사라져도 Pod 객체는 바로 옮겨지지 않고 약 6분의 시계가 돕니다." },
  { id: "q2", label: "Deployment·Job이 Pod를 만드는 방식", primary: ["K1"], support: [], note: "Deployment는 ReplicaSet을, ReplicaSet은 Pod를 만듭니다. Job은 Pod를 직접 만들고 backoffLimit까지 다시 시도합니다. 사용자가 만든 객체와 실제 Pod 사이에 controller가 한 층씩 있습니다." },
  { id: "q3", label: "요청한 자원과 실제 할당의 차이", primary: ["K3"], support: ["LNX"], note: "scheduler는 실제 사용량이 아니라 requests 합을 Allocatable과 비교합니다. limits는 CPU면 cgroup throttling, 메모리면 OOMKill로 집행됩니다. 두 숫자가 다른 이유는 Linux cgroup에 있습니다." },
  { id: "q4", label: "Pending·CrashLoopBackOff·NotReady", primary: ["K4", "K2"], support: ["REQ"], note: "Pending은 배치 전(FailedScheduling)과 배치 후(ContainerCreating)로 갈립니다. CrashLoopBackOff는 10초에서 300초까지 늘어나는 재시작 대기이고, NotReady는 Node의 하트비트가 50초 끊긴 상태입니다." },
  { id: "q5", label: "Service가 Pod로 요청을 전달하는 방식", primary: ["NET"], support: ["K6", "LNX"], note: "Service의 ClusterIP는 EndpointSlice의 Ready Pod 목록으로 바뀌고 kube-proxy 규칙이 노드에서 DNAT합니다. Pod 종료 때 endpoint 제거와 SIGTERM이 동시에 시작되는 경쟁은 K6에, netfilter는 Linux 기초에 있습니다." },
  { id: "q6", label: "PVC가 스토리지를 연결하는 방식", primary: ["K5"], support: ["LNX"], note: "PVC는 조건에 맞는 PV에 binding되거나 StorageClass가 동적으로 만듭니다. 그 뒤 CSI가 볼륨을 노드에 attach하고 mount합니다. RWO는 Pod가 아니라 노드 단위 제한입니다." },
  { id: "q7", label: "Event에서 실패 이유를 찾는 방법", primary: ["K4"], support: ["REQ"], note: "Event는 1시간만 보존되고 같은 종류는 count로 합쳐집니다. FailedCreate는 ReplicaSet에, FailedScheduling·BackOff는 Pod에, NodeNotReady는 Node에 붙으므로 owner 사슬마다 따로 읽습니다." },
  { id: "q8", label: "Controller가 목표 상태를 계속 복구한다는 개념", primary: ["K1"], support: ["K6", "K7"], note: "controller는 '원하는 상태'와 '현재 상태'의 차이를 보고 그 차이만큼 행동하는 루프입니다. rollout·HPA·PDB도 같은 루프이고, SRE의 error budget은 그 루프가 못 막은 실패를 세는 바깥 고리입니다." },
];

const LEFT_X = 8;
const LEFT_W = 206;
const RIGHT_X = 300;
const RIGHT_W = 172;
const TOP = 14;
const Q_STEP = 35;
const A_STEP = 28;
const BOX_H = 22;
const qY = (i: number) => TOP + i * Q_STEP;
const aY = (i: number) => TOP + 4 + i * A_STEP;
const aIndex = (id: string) => ARTICLES.findIndex((a) => a.id === id);

const TONE = {
  k8s: { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  existing: { fill: "#dcfce7", stroke: "#16a34a", text: "#14532d" },
  linux: { fill: "#fef3c7", stroke: "#d97706", text: "#78350f" },
} as const;

export default function ConceptOwnerMapViz() {
  const scenes = useAnimatedScenes(QUESTIONS.length + 1, 4200);
  const reduced = scenes.reducedMotion;
  const activeQ = scenes.active === 0 ? null : QUESTIONS[scenes.active - 1];
  const lit = new Set<string>(activeQ ? [...activeQ.primary, ...activeQ.support] : ARTICLES.map((a) => a.id));
  const label = activeQ ? activeQ.label : "여덟 질문과 담당 글 전체";
  const note = activeQ ? activeQ.note : "왼쪽이 운영자가 묻는 여덟 질문, 오른쪽이 그 질문을 끝까지 설명하는 글입니다. 굵은 선이 주 담당, 가는 선이 바닥이 되는 글입니다. 장면을 넘기면 질문 하나씩 켜집니다.";

  return (
    <VizFrame
      eyebrow="Concept → article map"
      title="질문 하나마다 주 담당 글 하나와 바닥이 되는 글이 정해져 있습니다"
      description="파란 상자는 이번 Kubernetes 시리즈, 초록은 기존 두 글, 주황은 Linux 기초입니다. 선은 '이 질문의 설명이 이 글에서 끝난다'는 뜻입니다."
      note="글 번호 K1~K7은 이 지도의 읽기 순서이고 각 글의 1절로 이어집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="여덟 질문과 담당 글의 연결"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{activeQ ? `${activeQ.primary.join("·")} 주 담당` : "9편 + Linux 기초"}</span>
          </div>

          <svg viewBox="0 0 480 300" className="mt-3 h-auto w-full" role="img" aria-label={label}>
            {/* 연결선 */}
            {QUESTIONS.map((q, qi) =>
              [...q.primary.map((a) => ({ a, strong: true })), ...q.support.map((a) => ({ a, strong: false }))].map(({ a, strong }) => {
                const on = activeQ ? activeQ.id === q.id : true;
                const ai = aIndex(a);
                const x1 = LEFT_X + LEFT_W;
                const y1 = qY(qi) + BOX_H / 2;
                const x2 = RIGHT_X;
                const y2 = aY(ai) + BOX_H / 2;
                const cx = (x1 + x2) / 2;
                return (
                  <motion.path
                    key={`${q.id}-${a}`}
                    d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
                    fill="none"
                    stroke={strong ? "#2563eb" : "#94a3b8"}
                    strokeWidth={strong ? 1.8 : 1}
                    strokeDasharray={strong ? undefined : "3 3"}
                    initial={false}
                    animate={{ opacity: on ? (activeQ ? 1 : 0.35) : 0.08 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  />
                );
              }),
            )}

            {/* 질문 */}
            {QUESTIONS.map((q, qi) => {
              const on = !activeQ || activeQ.id === q.id;
              const focus = activeQ?.id === q.id;
              return (
                <motion.g key={q.id} initial={false} animate={{ opacity: on ? 1 : 0.3 }} transition={{ duration: reduced ? 0 : 0.3 }}>
                  <rect x={LEFT_X} y={qY(qi)} width={LEFT_W} height={BOX_H} rx={4} fill={focus ? "#0f172a" : "#ffffff"} className={focus ? undefined : "fill-background"} stroke={focus ? "#0f172a" : "#94a3b8"} strokeWidth={1} />
                  <text x={LEFT_X + 7} y={qY(qi) + 14.5} fontSize={8.5} fontWeight={700} fill={focus ? "#ffffff" : undefined} className={focus ? undefined : "fill-foreground"}>
                    {qi + 1}. {q.label}
                  </text>
                </motion.g>
              );
            })}

            {/* 글 */}
            {ARTICLES.map((a, ai) => {
              const on = lit.has(a.id);
              const tone = TONE[a.tone];
              const strong = activeQ?.primary.includes(a.id);
              return (
                <motion.g key={a.id} initial={false} animate={{ opacity: on ? 1 : 0.25 }} transition={{ duration: reduced ? 0 : 0.3 }}>
                  <rect x={RIGHT_X} y={aY(ai)} width={RIGHT_W} height={BOX_H} rx={4} fill={tone.fill} stroke={tone.stroke} strokeWidth={strong ? 2 : 1} />
                  <text x={RIGHT_X + 7} y={aY(ai) + 14.5} fontSize={8.5} fontWeight={700} fill={tone.text}>
                    {a.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5rem]">{note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={["전체", ...QUESTIONS.map((q, i) => `${i + 1}. ${q.label}`)]} />
      </div>
    </VizFrame>
  );
}
