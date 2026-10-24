import { Link } from "react-router-dom";
import VizFrame from "@/components/viz/VizFrame";

const BRANCHES = [
  {
    number: "01",
    title: "원하는 상태와 배치",
    cue: "Pod가 없거나 nodeName이 비었을 때",
    links: [
      ["Controller", "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview"],
      ["Scheduler·Node", "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview"],
      ["requests·limits", "/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview"],
    ],
  },
  {
    number: "02",
    title: "Pod 실행 준비",
    cue: "Node는 정해졌지만 Ready가 아닐 때",
    links: [
      ["Pod 상태·Probe", "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview"],
      ["PVC·PV·CSI", "/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview"],
    ],
  },
  {
    number: "03",
    title: "사용자 요청 전달",
    cue: "Pod가 Ready인데 실제 요청이 실패할 때",
    links: [
      ["Service·EndpointSlice·패킷", "/cs/cloud/kubernetes-network-packet-path#overview"],
    ],
  },
  {
    number: "04",
    title: "변경과 운영",
    cue: "배포·종료·확장 중 용량이 줄어들 때",
    links: [
      ["롤아웃·drain·HPA", "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview"],
      ["SLO·업그레이드", "/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview"],
    ],
  },
] as const;

export default function KubernetesBranchMapViz() {
  return (
    <VizFrame
      eyebrow="학습 지도"
      title="전체 경로를 한 번 이은 뒤, 멈춘 곳의 갈래로 내려갑니다"
      description="아래 네 갈래는 읽을 글의 단순한 일렬번호가 아닙니다. 같은 Pod 요청에서 어느 경계까지 성공했는지에 따라 선택하는 하위 지도입니다."
      canvasClassName="p-3 sm:p-6"
    >
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="border border-primary/45 bg-primary/[0.045] p-3">
            <span className="text-[10px] font-bold text-primary">전체 지도</span>
            <strong className="mt-1 block text-sm text-foreground">API 저장 → Pod 준비 → 사용자 요청</strong>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">현재 글에서 주요 경계의 위치를 먼저 익힙니다.</span>
          </div>
          <Link
            to="/cs/cloud/kubernetes-request-path-and-cka#overview"
            className="border border-border bg-background p-3 transition-colors hover:border-primary/60 hover:bg-primary/[0.035]"
          >
            <span className="text-[10px] font-bold text-muted-foreground">한 요청 추적</span>
            <strong className="mt-1 block text-sm text-foreground">checkout Pod 하나를 끝까지 확인</strong>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">Condition·Event·실제 응답을 같은 식별자로 연결합니다.</span>
          </Link>
        </div>

        <div className="flex h-8 items-center justify-center text-muted-foreground" aria-hidden="true">↓</div>

        <div className="grid gap-2 sm:grid-cols-2">
          {BRANCHES.map((branch) => (
            <section key={branch.number} className="min-w-0 border border-border bg-background p-3">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border text-[10px] font-bold tabular-nums text-muted-foreground">
                  {branch.number}
                </span>
                <div className="min-w-0">
                  <h4 className="break-keep text-sm font-bold leading-5 text-foreground">{branch.title}</h4>
                  <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">{branch.cue}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {branch.links.map(([label, href]) => (
                  <Link
                    key={href}
                    to={href}
                    className="inline-flex min-h-9 items-center border border-border px-2.5 text-[10px] font-bold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {label} <span className="ml-1" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
