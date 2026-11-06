import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pending-two-kinds — NODE 열 하나로 갈리는 두 Pending과, 노드 쪽 갈래 안의 이미지 실패 단어.
 * 칸은 항상 그대로 두고 지금 읽는 갈래만 진하게 표시해 높이가 변하지 않는다.
 */
const SCENES = [
  { label: "NODE가 비어 있습니다", summary: "scheduler 쪽", focus: "empty", note: "spec.nodeName이 비어 있어 kubectl get pod -o wide의 NODE 열도 비어 있습니다. scheduler가 노드를 못 골랐고 kubelet은 이 Pod를 아직 모르니 노드 쪽을 봐도 아무것도 없습니다." },
  { label: "NODE가 채워져 있습니다", summary: "그 노드의 kubelet 쪽", focus: "filled", note: "노드는 정해졌고 kubelet이 sandbox(네트워크 namespace와 pause 컨테이너)를 만들고 볼륨을 붙이고 이미지를 받는 중입니다. 막히면 어느 준비에서 막혔는지가 그 노드 kubelet이 남긴 event에 있습니다." },
  { label: "이미지 실패는 더 갈립니다", summary: "기다려서 낫는가", focus: "image", note: "방금 실패한 순간은 ErrImagePull, 재시도를 미루는 동안은 ImagePullBackOff이고 간격은 10초에서 300초까지 두 배씩 늘어납니다. 이미지 이름이 틀렸거나 imagePullPolicy가 Never인데 이미지가 없으면 기다려도 낫지 않습니다." },
] as const;

function Branch({ on, title, who, children, fix }: { on: boolean; title: string; who: string; children: ReactNode; fix: string }) {
  return (
    <div className={`min-w-0 rounded-md border p-2 text-xs leading-5 sm:p-3 ${on ? "border-primary bg-background" : "border-border/50 opacity-45"}`}>
      <p className="font-bold">{title}</p>
      <p className="text-muted-foreground">{who}</p>
      <div className="mt-2 space-y-1 font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs">{children}</div>
      <p className="mt-2 border-t border-border/60 pt-2 font-semibold">고칠 곳: {fix}</p>
    </div>
  );
}

export default function PendingBranchViz() {
  return (
    <SceneShell
      eyebrow="NODE 열 하나"
      title="같은 Pending이라도 NODE 열에서 고칠 곳이 갈립니다"
      description="event는 Kubernetes 구성 요소가 객체에 남기는 기록입니다. 왼쪽 갈래는 scheduler의 event를, 오른쪽 갈래는 노드 kubelet의 event를 읽습니다."
      ariaLabel="NODE 열이 비었는지에 따라 갈리는 Pending의 원인과 고칠 곳"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="min-w-0">
            <div className="mx-auto w-fit rounded-md border border-border bg-background px-3 py-1.5 text-center text-xs font-bold">
              phase Pending → NODE 열이 비었나?
            </div>
            <svg viewBox="0 0 320 24" className="mx-auto h-6 w-full" preserveAspectRatio="none" aria-hidden="true">
              <path d="M160 0V8H80V24" fill="none" stroke={focus === "empty" ? "#2563eb" : "#94a3b8"} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <path d="M160 0V8H240V24" fill="none" stroke={focus === "empty" ? "#94a3b8" : "#2563eb"} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="grid grid-cols-2 gap-2">
              <Branch on={focus === "empty"} title="비었음" who="scheduler가 노드를 못 고름" fix="scheduler 쪽 (requests · affinity · taint)">
                <p>FailedScheduling</p>
                <p>0/3 nodes are available: 3 Insufficient cpu.</p>
                <p className="font-sans text-muted-foreground">자원 부족 · nodeSelector·affinity 불일치 · toleration 부재 · PVC 미결합</p>
              </Branch>
              <Branch on={focus !== "empty"} title="채워짐" who="kubelet이 준비하다 막힘" fix="노드 쪽 (CNI · 스토리지 · 레지스트리 인증)">
                <p>FailedCreate<wbr />PodSandBox <span className="font-sans text-muted-foreground">CNI</span></p>
                <p>FailedMount <span className="font-sans text-muted-foreground">볼륨</span></p>
                <p className={focus === "image" ? "font-bold text-primary" : ""}>Failed/ErrImagePull <span className="font-sans font-normal text-muted-foreground">이미지</span></p>
              </Branch>
            </div>
            <div className={`mt-2 grid grid-cols-2 gap-2 rounded-md border p-2 text-xs leading-5 ${focus === "image" ? "border-primary bg-background" : "border-border/50 opacity-45"}`}>
              <div className="min-w-0">
                <p className="font-bold">재시도를 미룹니다</p>
                <p className="font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs">ErrImagePull → ImagePullBackOff</p>
                <p className="text-muted-foreground">10초 → … → 300초</p>
              </div>
              <div className="min-w-0">
                <p className="font-bold">기다려도 낫지 않습니다</p>
                <p className="font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs">InvalidImageName</p>
                <p className="font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs">ErrImageNeverPull</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
