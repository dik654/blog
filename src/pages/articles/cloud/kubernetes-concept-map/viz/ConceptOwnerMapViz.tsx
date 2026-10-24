import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type JourneyStage = {
  short: string;
  title: string;
  compact: string;
  component: string;
  change: string;
  evidence: string;
  failure: string;
  href: string;
  linkLabel: string;
};

const STAGES: readonly JourneyStage[] = [
  {
    short: "저장",
    title: "요청 저장",
    compact: "API server",
    component: "API server · etcd",
    change: "replicas: 3을 검증한 뒤 Deployment의 원하는 상태로 저장합니다.",
    evidence: "저장된 spec · generation · resourceVersion",
    failure: "Forbidden · Invalid · admission 거부",
    href: "/cs/cloud/kubernetes-request-path-and-cka#overview",
    linkLabel: "요청이 저장되는 경로",
  },
  {
    short: "생성",
    title: "Pod 객체 생성",
    compact: "Controller",
    component: "Deployment · ReplicaSet controller",
    change: "replicas를 2에서 3으로 늘린 뒤, 존재하는 Pod 두 개와 목표 세 개의 차이를 보고 새 Pod 객체를 만듭니다.",
    evidence: "ownerReferences · observedGeneration · replicas",
    failure: "FailedCreate · quota · 잘못된 Pod template",
    href: "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview",
    linkLabel: "Controller의 복구 루프",
  },
  {
    short: "배치",
    title: "Node 선택",
    compact: "Scheduler",
    component: "Scheduler",
    change: "requests, taint, affinity, volume 조건을 통과한 Node에 Pod를 binding합니다.",
    evidence: "PodScheduled=True · spec.nodeName",
    failure: "FailedScheduling · Insufficient cpu",
    href: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview",
    linkLabel: "Pod 배치와 Node 장애",
  },
  {
    short: "실행",
    title: "실행 준비",
    compact: "kubelet",
    component: "kubelet · CRI · CNI · CSI",
    change: "컨테이너를 시작하고 Pod IP와 볼륨을 붙인 뒤 readiness를 반복합니다.",
    evidence: "Pod IP · mount · containerStatuses · Ready",
    failure: "ImagePullBackOff · FailedMount · CrashLoopBackOff",
    href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview",
    linkLabel: "Pod 상태와 Event 읽기",
  },
  {
    short: "요청",
    title: "사용자 요청 전달",
    compact: "데이터 경로",
    component: "EndpointSlice controller · kube-proxy 또는 대체 데이터 경로",
    change: "Ready가 된 Pod 주소를 요청 대상에 넣고 checkout 요청을 전달합니다.",
    evidence: "ready endpoint · 실제 성공률 · p95 지연",
    failure: "endpoint 누락 · DNS · route · policy 오류",
    href: "/cs/cloud/kubernetes-network-packet-path#overview",
    linkLabel: "Service에서 Pod까지의 패킷 경로",
  },
];

const SCENE_TEXT = [
  {
    title: "checkout Pod 세 개가 사용자 요청을 받을 때까지",
    component: "API server부터 Node 데이터 경로까지",
    body: "원하는 상태를 저장하는 일, Pod 객체를 만드는 일, Node를 고르는 일, 실제로 실행하는 일, 사용자 요청을 전달하는 일이 서로 다른 프로그램에 나뉘어 있습니다. 모두 API 리소스를 읽고 자신의 결과를 다시 기록합니다.",
    evidence: "목표 3개 · Ready 2개 · Pod당 35 req/s",
    failure: "계획 105 req/s → 실제 70 req/s → 20 req/s 부족",
    href: "/cs/cloud/kubernetes-request-path-and-cka#overview",
    linkLabel: "한 Pod를 처음부터 끝까지 추적하기",
  },
  ...STAGES.map((stage) => ({
    title: stage.title,
    component: stage.component,
    body: stage.change,
    evidence: `성공 증거 · ${stage.evidence}`,
    failure: `멈췄을 때 · ${stage.failure}`,
    href: stage.href,
    linkLabel: stage.linkLabel,
  })),
] as const;

function Stack({ active, className, render }: { active: number; className?: string; render: (scene: (typeof SCENE_TEXT)[number]) => ReactNode }) {
  return (
    <div className={`grid ${className ?? ""}`}>
      {SCENE_TEXT.map((scene, index) => (
        <div key={scene.title} aria-hidden={index !== active} className={`col-start-1 row-start-1 min-w-0 ${index === active ? "" : "invisible"}`}>
          {render(scene)}
        </div>
      ))}
    </div>
  );
}

function StageCard({ stage, index, active, reduced }: { stage: JourneyStage; index: number; active: number; reduced: boolean }) {
  const selected = active === index + 1;
  const passed = active === 0 || active > index + 1;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active === 0 || selected || passed ? 1 : 0.42 }}
      transition={{ duration: reduced ? 0 : 0.18 }}
      className={`relative min-w-0 border-l-4 px-2.5 py-3 sm:px-3 ${selected ? "border-primary bg-primary/[0.08]" : "border-border bg-background"}`}
    >
      <span className="block break-keep text-[10px] font-bold leading-4 text-muted-foreground">{index + 1} · {stage.title}</span>
      <strong className="mt-1 block break-keep text-[11px] leading-5 text-foreground sm:text-xs">{stage.compact}</strong>
      {selected ? <motion.span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" initial={false} animate={{ scale: reduced ? 1 : [0.7, 1, 0.7] }} transition={{ duration: reduced ? 0 : 1.8, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }} /> : null}
    </motion.div>
  );
}

function Connector({ active, index, reduced, vertical = false }: { active: number; index: number; reduced: boolean; vertical?: boolean }) {
  const moving = active === index + 2;
  return (
    <div className={`relative flex items-center justify-center text-muted-foreground ${vertical ? "h-7" : "min-h-28"}`} aria-hidden="true">
      <span>{vertical ? "↓" : "→"}</span>
      {moving && !reduced ? (
        <motion.span
          className="absolute h-2 w-2 rounded-full bg-primary"
          initial={vertical ? { top: 0, opacity: 0 } : { left: 0, opacity: 0 }}
          animate={vertical ? { top: [0, 20], opacity: [0, 1, 0] } : { left: [0, 12], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}

function MobileJourneyRail({ active, reduced }: { active: number; reduced: boolean }) {
  return (
    <div className="relative grid grid-cols-5 gap-1 pb-1" aria-label="Pod 준비 경로 다섯 단계">
      <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-3 h-px bg-border" />
      {STAGES.map((stage, index) => {
        const selected = active === index + 1;
        const passed = active === 0 || active > index + 1;
        return (
          <motion.div
            key={stage.title}
            initial={false}
            animate={{ opacity: active === 0 || selected || passed ? 1 : 0.42 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="relative min-w-0 text-center"
          >
            <span className={`relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${selected ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"}`}>
              {index + 1}
            </span>
            <span className="mt-1 block break-keep text-[9px] font-semibold leading-4 text-muted-foreground">{stage.short}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ConceptOwnerMapViz() {
  const scenes = useAnimatedScenes(STAGES.length + 1, 8000, { autoPlay: false, loop: false });
  const canvasRef = useRef<HTMLDivElement>(null);
  const setPlayingRef = useRef(scenes.setPlaying);

  useEffect(() => {
    setPlayingRef.current = scenes.setPlaying;
  }, [scenes.setPlaying]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || scenes.reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPlayingRef.current(false);
        }
      },
      { threshold: 0.55 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [scenes.reducedMotion]);

  return (
    <VizFrame
      eyebrow="Pod journey"
      title="세 번째 checkout Pod가 사용자 요청을 받을 때까지"
      description="장면마다 바뀌는 것은 담당 프로그램, API에 남는 성공 증거, 그 자리에서 보이는 대표 실패입니다. 박스 위치는 움직이지 않습니다."
      note="수치는 동작을 설명하기 위한 가정입니다. 각 단계의 기본값과 소스 근거는 연결된 글에서 확인합니다."
    >
      <div
        ref={canvasRef}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="checkout Pod가 API 저장부터 사용자 요청 전달까지 이동하는 경로"
        onKeyDown={(event) => {
          scenes.onKeyDown(event);
        }}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="hidden grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-stretch gap-1 md:grid">
          {STAGES.map((stage, index) => (
            <div key={stage.title} className="contents">
              <StageCard stage={stage} index={index} active={scenes.active} reduced={scenes.reducedMotion} />
              {index < STAGES.length - 1 ? <Connector active={scenes.active} index={index} reduced={scenes.reducedMotion} /> : null}
            </div>
          ))}
        </div>

        <div className="md:hidden"><MobileJourneyRail active={scenes.active} reduced={scenes.reducedMotion} /></div>

        <Stack
          active={scenes.active}
          className="mt-4 border-t border-border pt-4"
          render={(scene) => (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-base font-bold">{scene.title}</h4>
                <Link to={scene.href} className="inline-flex min-h-11 items-center text-xs font-bold text-primary hover:underline">
                  {scene.linkLabel} <span className="ml-1" aria-hidden="true">↗</span>
                </Link>
              </div>
              <p className="mt-1 text-xs font-bold text-primary">담당 · {scene.component}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{scene.body}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="border-l-2 border-emerald-500/70 pl-3 text-xs leading-5 text-muted-foreground">{scene.evidence}</p>
                <p className="border-l-2 border-rose-500/70 pl-3 text-xs leading-5 text-muted-foreground">{scene.failure}</p>
              </div>
            </div>
          )}
        />

        <AnimatedSceneControls {...scenes} labels={["전체", ...STAGES.map((stage) => stage.short)]} />
      </div>
    </VizFrame>
  );
}
