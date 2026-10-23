import { Link } from "react-router-dom";

export type KubernetesSeriesRegion =
  | "resource"
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

type Region = {
  id: KubernetesSeriesRegion;
  label: string;
  role: string;
  href: string;
};

const mainPath: readonly Region[] = [
  {
    id: "request",
    label: "API 요청",
    role: "YAML을 검증해 API 리소스로 저장하고 변경 사건을 알립니다.",
    href: "/cs/cloud/kubernetes-request-path-and-cka#overview",
  },
  {
    id: "resource",
    label: "저장된 리소스",
    role: "Deployment·Service·PVC가 원하는 상태를 API에 남깁니다.",
    href: "/cs/cloud/kubernetes-concept-map#black-box",
  },
  {
    id: "controllers",
    label: "Controller",
    role: "원하는 상태와 현재 상태의 차이를 계속 줄입니다.",
    href: "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview",
  },
  {
    id: "placement",
    label: "Scheduler · kubelet",
    role: "Pod를 Node에 배치하고 컨테이너 실행을 맞춥니다.",
    href: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview",
  },
  {
    id: "health",
    label: "상태 · Event",
    role: "맞추지 못한 위치와 재시도 결과를 운영자에게 남깁니다.",
    href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview",
  },
];

const supportingPaths: readonly Region[] = [
  {
    id: "resources",
    label: "자원",
    role: "requests로 배치하고 limits로 실행 상한을 집행합니다.",
    href: "/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview",
  },
  {
    id: "network",
    label: "네트워크",
    role: "Service·EndpointSlice가 준비된 Pod까지 요청을 잇습니다.",
    href: "/cs/cloud/kubernetes-network-packet-path#overview",
  },
  {
    id: "storage",
    label: "스토리지",
    role: "PVC 요구를 PV와 실제 장치 연결로 바꿉니다.",
    href: "/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview",
  },
  {
    id: "lifecycle",
    label: "변경 · 확장",
    role: "Rollout·PDB·drain·HPA로 가용 용량을 지킵니다.",
    href: "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview",
  },
  {
    id: "operations",
    label: "운영",
    role: "SLO·알림·업그레이드·복구 판단을 연결합니다.",
    href: "/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview",
  },
];

function RegionNode({
  region,
  path,
  current,
}: {
  region: Region;
  path: readonly KubernetesSeriesRegion[];
  current: KubernetesSeriesCurrent;
}) {
  const selected = path.includes(region.id);
  const isCurrent = current === region.id;
  const body = (
    <>
      <strong className="block text-xs leading-5 text-foreground">
        {region.label}{isCurrent ? <span className="ml-1 text-[9px] text-primary">현재</span> : null}
      </strong>
      <span className="mt-1 block text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
        {region.role}
      </span>
    </>
  );

  return isCurrent ? (
    <div
      data-kubernetes-region={region.id}
      data-active="true"
      aria-current="location"
      className="min-w-0 border-l-4 border-primary bg-primary/[0.08] px-3 py-2.5"
    >
      {body}
    </div>
  ) : (
    <Link
      data-kubernetes-region={region.id}
      data-active="false"
      to={region.href}
      className={`min-w-0 border-l-2 px-3 py-2.5 transition-colors hover:border-primary hover:bg-primary/[0.025] ${selected ? "border-primary bg-primary/[0.045]" : "border-border bg-background"}`}
    >
      {body}
    </Link>
  );
}

export default function KubernetesSeriesLocator({
  path,
  current,
  question,
}: {
  path: readonly KubernetesSeriesRegion[];
  current: KubernetesSeriesCurrent;
  question: string;
}) {
  return (
    <aside
      className="not-prose mb-8 border border-border bg-muted/[0.09] p-3 sm:p-4"
      aria-label="Kubernetes 전체 구조에서 현재 글의 위치"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-primary">
            {current === "map" ? "Kubernetes 전체 지도" : "Kubernetes 전체 → 현재 운영 질문"}
          </p>
          <p className="mt-1 text-sm font-bold leading-6">{question}</p>
        </div>
        {current !== "map" ? (
          <Link
            to="/cs/cloud/kubernetes-concept-map#black-box"
            className="inline-flex min-h-11 items-center border-b border-border px-2 text-[11px] font-semibold hover:border-primary hover:text-primary"
          >
            전체 지도 보기 <span className="ml-1" aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] xl:items-stretch">
        {mainPath.map((region, index) => (
          <div key={region.id} className="contents">
            <RegionNode region={region} path={path} current={current} />
            {index < mainPath.length - 1 ? (
              <div className="hidden items-center justify-center text-muted-foreground xl:flex" aria-hidden="true">→</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <p className="mb-2 text-[10px] font-bold text-muted-foreground">
          같은 Pod를 지탱하는 다섯 가지 운영 경로
        </p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
          {supportingPaths.map((region) => (
            <RegionNode key={region.id} region={region} path={path} current={current} />
          ))}
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
        굵은 선은 지금 읽는 영역, 옅은 배경은 같은 문제를 푸는 경로입니다.
      </p>
    </aside>
  );
}
