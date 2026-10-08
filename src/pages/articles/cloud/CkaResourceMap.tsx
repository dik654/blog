const tracks = [
  { phase: "Core concepts", learn: "API server·etcd·controller·scheduler·kubelet과 workload object의 책임", lab: "Deployment 3개 중 1개를 Pending으로 만들고 첫 false condition을 찾습니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts" },
  { phase: "Scheduling", learn: "taint·toleration·affinity·resource request가 node 선택을 제한하는 방식", lab: "세 제약을 하나씩 주입하고 event와 binding 결과를 비교합니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/03-Scheduling" },
  { phase: "Cluster maintenance", learn: "drain·upgrade·etcd backup에서 가용성과 복구 state가 갈리는 지점", lab: "snapshot 생성 뒤 격리 cluster에서 restore와 read/write를 검증합니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/06-Cluster-Maintenance" },
  { phase: "Security", learn: "certificate·kubeconfig·RBAC·security context·NetworkPolicy의 서로 다른 경계", lab: "인증 실패, 권한 거부, network 차단을 같은 403이나 timeout으로 뭉치지 않습니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/07-Security" },
  { phase: "Storage", learn: "CSI·StorageClass·PV·PVC·mount가 Pod lifecycle에 붙는 순서", lab: "PVC Pending과 mount 실패를 각각 재현하고 controller·node evidence를 나눕니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/08-Storage" },
  { phase: "Networking", learn: "namespace·CNI·Service·CoreDNS·Ingress의 packet path", lab: "Pod IP, EndpointSlice, DNS, policy, route를 순서대로 끊어 첫 실패 hop을 찾습니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/09-Networking" },
  { phase: "Design and kubeadm", learn: "HA control plane·etcd topology·cluster bootstrap과 join의 전제", lab: "version·certificate·port·CNI 전제표를 만들고 join 실패를 복구합니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/10-Design-and-Install-Kubernetes-Cluster" },
  { phase: "Troubleshooting and mocks", learn: "application·control plane·worker·network 증상을 시간 제한 안에 좁히는 순서", lab: "context, before evidence, 최소 변경, acceptance, rollback을 한 파일에 남깁니다.", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/12-Troubleshooting" },
] as const;

export default function CkaResourceMap() {
  return (
    <figure data-viz="course-resource-map" className="not-prose min-w-0 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">외부 실습 지도</p>
        <p className="mt-1 font-semibold text-foreground">KodeKloud 노트를 요청 경로와 장애 실습 순서로 다시 읽기</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          저장소의 장별 노트를 그대로 요약하지 않습니다. 먼저 이 글의 한 Pod 요청 경로를 이해한 뒤,
          각 폴더의 그림·명령·연습문제를 실제 장애 기록으로 바꿉니다.
        </p>
      </figcaption>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {tracks.map((track, index) => (
          <li key={track.href} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <div className="min-w-0">
                <a className="break-words font-semibold text-primary underline underline-offset-4" href={track.href} target="_blank" rel="noreferrer">
                  {track.phase}
                </a>
                <p className="mt-2 text-sm leading-6 text-foreground">이해 · {track.learn}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">실습 · {track.lab}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <aside className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4">
        <a
          className="font-semibold text-primary underline underline-offset-4"
          href="https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/images"
          target="_blank"
          rel="noreferrer"
        >
          KodeKloud 원본 이미지 모음 보기
        </a>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          그림은 이해 순서를 찾는 참고 자료로 연결합니다. 저장소 루트에서 명시적 license 파일을 확인하지 못했기
          때문에 원본 PNG를 복사하지 않았고, 이 글의 흐름·용량·판단 그림은 React/CSS로 새로 만들었습니다.
        </p>
      </aside>
    </figure>
  );
}
