import { Link } from "react-router-dom";

export type KubernetesSeriesRegion =
  | "request"
  | "controllers"
  | "placement"
  | "resources"
  | "health"
  | "network"
  | "storage"
  | "lifecycle"
  | "operations";

type KubernetesSeriesCurrent = KubernetesSeriesRegion | "map";
type JourneyStageId = "api" | "controllers" | "scheduler" | "kubelet" | "traffic";

type JourneyStage = {
  id: JourneyStageId;
  label: string;
  compact: string;
  component: string;
  change: string;
  href: string;
};

type DetailPath = {
  id: Extract<KubernetesSeriesRegion, "resources" | "health" | "storage" | "lifecycle" | "operations">;
  label: string;
  role: string;
  href: string;
  under: string;
};

const journey: readonly JourneyStage[] = [
  { id: "api", label: "요청 저장", compact: "API server", component: "API server · etcd", change: "원하는 상태 기록", href: "/cs/cloud/kubernetes-request-path-and-cka#overview" },
  { id: "controllers", label: "Pod 객체 생성", compact: "Controller", component: "Deployment · ReplicaSet controller", change: "Pod 객체 추가", href: "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview" },
  { id: "scheduler", label: "Node 선택", compact: "Scheduler", component: "Scheduler", change: "spec.nodeName 기록", href: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview" },
  { id: "kubelet", label: "실행 준비", compact: "kubelet", component: "kubelet · CRI · CNI · CSI", change: "컨테이너 · 주소 · 볼륨 준비", href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview" },
  { id: "traffic", label: "요청 전달", compact: "데이터 경로", component: "EndpointSlice controller · kube-proxy 또는 대체 구현", change: "ready=true 주소로 요청 전달", href: "/cs/cloud/kubernetes-network-packet-path#overview" },
];

const detailPaths: readonly DetailPath[] = [
  { id: "resources", label: "자원", role: "requests는 배치 판단에, limits는 Node의 실행 상한에 쓰입니다.", href: "/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview", under: "3·4단계 확대" },
  { id: "health", label: "상태", role: "Condition과 Event가 전체 경로의 마지막 성공과 첫 실패를 남깁니다.", href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview", under: "1~5단계의 증거" },
  { id: "storage", label: "스토리지", role: "PVC 요구를 PV와 실제 Node의 attach·mount로 바꿉니다.", href: "/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview", under: "3·4단계 확대" },
];

const timePaths: readonly DetailPath[] = [
  { id: "lifecycle", label: "교체 · 확장", role: "종료, rollout, PDB, drain, HPA가 시간에 따라 Ready 개수를 바꿉니다.", href: "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview", under: "실행 중 변화" },
  { id: "operations", label: "운영", role: "SLO와 관측값으로 알림, 변경, 업그레이드, 복구를 결정합니다.", href: "/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview", under: "사용자 영향 판단" },
];

const directStage: Partial<Record<KubernetesSeriesCurrent, JourneyStageId>> = {
  request: "api",
  controllers: "controllers",
  placement: "scheduler",
  network: "traffic",
};

const relatedStages: Partial<Record<KubernetesSeriesCurrent, readonly JourneyStageId[]>> = {
  resources: ["scheduler", "kubelet"],
  health: ["api", "controllers", "scheduler", "kubelet", "traffic"],
  storage: ["scheduler", "kubelet"],
  lifecycle: ["controllers", "kubelet", "traffic"],
  operations: ["api", "controllers", "scheduler", "kubelet", "traffic"],
};

function DetailCard({ item, current }: { item: DetailPath; current: KubernetesSeriesCurrent }) {
  const isCurrent = current === item.id;
  return (
    <Link
      to={item.href}
      data-kubernetes-region={item.id}
      data-active={isCurrent ? "true" : "false"}
      aria-current={isCurrent ? "location" : undefined}
      className={`min-w-0 border-l-2 px-3 py-2.5 transition-colors hover:border-primary hover:bg-primary/[0.025] ${
        isCurrent ? "border-primary bg-primary/[0.09]" : "border-border bg-background"
      }`}
    >
      <span className="block break-keep text-[10px] font-semibold leading-4 text-muted-foreground">{item.under}</span>
      <strong className="mt-0.5 block break-keep text-xs leading-5 text-foreground">{item.label}</strong>
      <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{item.role}</span>
    </Link>
  );
}

function JourneyRail({ current }: { current: KubernetesSeriesCurrent }) {
  const currentStage = directStage[current];
  const related = new Set(relatedStages[current] ?? []);
  return (
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] items-start gap-1" aria-label="Pod 준비 경로 다섯 단계">
      {journey.map((stage, index) => {
        const isCurrent = currentStage === stage.id;
        const isRelated = related.has(stage.id);
        return (
          <Link
            key={stage.id}
            to={stage.href}
            data-kubernetes-stage={stage.id}
            data-active={isCurrent ? "true" : "false"}
            aria-current={isCurrent ? "location" : undefined}
            className={`relative min-w-0 border-t-2 px-1 pt-2 text-center transition-colors hover:border-primary ${
              isCurrent ? "border-primary text-foreground" : isRelated ? "border-primary/50 text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            <span className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${isCurrent ? "bg-primary text-primary-foreground" : isRelated ? "bg-primary/10 text-primary" : "bg-muted"}`}>
              {index + 1}
            </span>
            <span className={`mt-1 block break-keep text-[9px] font-semibold leading-4 ${isCurrent ? "" : "hidden sm:block"}`}>{stage.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function DesktopJourney({ current }: { current: KubernetesSeriesCurrent }) {
  const currentStage = directStage[current];
  const related = new Set(relatedStages[current] ?? []);
  return (
    <div className="mt-4 hidden grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-stretch gap-1 md:grid">
      {journey.map((stage, index) => {
        const isCurrent = currentStage === stage.id;
        const isRelated = related.has(stage.id);
        return (
          <div key={stage.id} className="contents">
            <Link
              data-kubernetes-stage={stage.id}
              data-active={isCurrent ? "true" : "false"}
              aria-current={isCurrent ? "location" : undefined}
              to={stage.href}
              className={`min-w-0 border-l-2 px-3 py-2.5 transition-colors hover:border-primary hover:bg-primary/[0.025] ${
                isCurrent ? "border-primary bg-primary/[0.09]" : isRelated ? "border-primary/50 bg-primary/[0.035]" : "border-border bg-background"
              }`}
            >
              <span className="block break-keep text-[10px] font-semibold leading-4 text-muted-foreground">{index + 1} · {stage.label}</span>
              <strong className="mt-0.5 block break-keep text-[11px] leading-5 text-foreground sm:text-xs">{stage.compact}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{stage.change}</span>
            </Link>
            {index < journey.length - 1 ? <div className="hidden items-center justify-center text-muted-foreground md:flex" aria-hidden="true">→</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function KubernetesSeriesLocator({ current, question, bridge }: { current: KubernetesSeriesCurrent; question: string; bridge?: string }) {
  const currentStage = directStage[current] ? journey.find((stage) => stage.id === directStage[current]) : undefined;
  const currentDetail = [...detailPaths, ...timePaths].find((item) => item.id === current);

  return (
    <aside className="not-prose mb-8 border border-border bg-muted/[0.09] p-3 sm:p-4" aria-label="Kubernetes 전체 구조에서 현재 글의 위치">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-3xl">
          <p className="text-[10px] font-bold text-primary">Kubernetes 전체 지도</p>
          <p className="mt-1 text-sm font-bold leading-6">{question}</p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {bridge ?? "replicas를 2에서 3으로 늘린 checkout 사례로 전체 경로를 먼저 보고, 막힌 단계만 확대합니다."}
          </p>
        </div>
        {current !== "map" ? (
          <Link to="/cs/cloud/kubernetes-concept-map#overview" className="inline-flex min-h-11 shrink-0 items-center border-b border-border px-2 text-[11px] font-semibold hover:border-primary hover:text-primary">
            전체 지도 보기 <span className="ml-1" aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>

      {current !== "map" ? (
        <>
          <div className="mt-4 md:hidden">
            <JourneyRail current={current} />
            <p className="mt-3 border-l-2 border-primary pl-3 text-[11px] leading-5 text-muted-foreground">
              현재 위치 · <strong className="text-foreground">{currentStage?.label ?? currentDetail?.label}</strong>
              {currentStage ? ` · ${currentStage.component}` : currentDetail ? ` · ${currentDetail.under}` : ""}
            </p>
          </div>
          <DesktopJourney current={current} />
          {currentDetail ? (
            <p className="mt-3 hidden border-l-2 border-primary pl-3 text-[11px] leading-5 text-muted-foreground md:block">
              현재 위치 · <strong className="text-foreground">{currentDetail.label}</strong> · {currentDetail.under}
            </p>
          ) : null}
        </>
      ) : null}

      <details className={`${current === "map" ? "mt-4" : "mt-3 md:mt-4"} group`} open={current === "map"}>
        <summary className="min-h-11 cursor-pointer list-none border-t border-border py-3 text-[11px] font-bold text-muted-foreground group-open:text-foreground">
          {current === "map" ? "필요한 단계만 더 확대하기" : "자원·상태·스토리지·교체·운영 지도 펼치기"}
        </summary>
        <div className="grid gap-4 pt-1 lg:grid-cols-[3fr_2fr]">
          <div>
            <p className="mb-2 text-[10px] font-bold text-muted-foreground">주 경로 안을 더 확대할 때</p>
            <div className="grid gap-2 sm:grid-cols-3">{detailPaths.map((item) => <DetailCard key={item.id} item={item} current={current} />)}</div>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold text-muted-foreground">실행 중 상태가 바뀔 때</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{timePaths.map((item) => <DetailCard key={item.id} item={item} current={current} />)}</div>
          </div>
        </div>
      </details>
    </aside>
  );
}
