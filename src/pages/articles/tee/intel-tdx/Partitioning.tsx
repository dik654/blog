import PartitioningViz from './viz/PartitioningViz';
import L1ManagerViz from './viz/L1ManagerViz';
import L1L2TransitionViz from './viz/L1L2TransitionViz';
import L2KeyIdViz from './viz/L2KeyIdViz';
import LiveMigrationViz from './viz/LiveMigrationViz';

export default function Partitioning() {
  return (
    <section id="partitioning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TD Partitioning — 중첩 TD (TDX 1.5)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Partitioning인가</h3>

        <PartitioningViz />

        <p>
          <strong>문제</strong>: 하나의 TD 안에 여러 워크로드 격리하고 싶음<br />
          <strong>예</strong>: Confidential Kubernetes — 노드는 TD, pod는 더 격리<br />
          <strong>해결</strong>: L1 TD가 L2 TD를 생성·관리 — nested virtualization의 TDX 버전
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">L1 TD의 역할 — Partitioning Manager</h3>
        <L1ManagerViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">L1 ↔ L2 전환 흐름</h3>
        <L1L2TransitionViz />
        <p>
          <strong>3-계층</strong>: SEAM → Host → L1 → L2<br />
          L2의 "hypervisor"는 L1 TD — Host VMM 아님<br />
          L2는 L1만 신뢰하면 됨 → L1 벤더가 TCB 범위 축소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 격리 — L2별 KeyID</h3>
        <L2KeyIdViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Live Migration (TDX 1.5)</h3>
        <LiveMigrationViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Service TDs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Service TD</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>MigTD</code></td>
                <td className="border border-border px-3 py-2">Live migration 정책·키 관리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>QuoteTD</code></td>
                <td className="border border-border px-3 py-2">Quote 생성 (DCAP QE 대체)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>PerfMonTD</code></td>
                <td className="border border-border px-3 py-2">PMU 성능 카운터 집계</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>DebugTD</code></td>
                <td className="border border-border px-3 py-2">개발용 디버거 (prod 금지)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Partitioning의 실제 용도</p>
          <p>
            <strong>시나리오 1 — Confidential K8s</strong>:<br />
            - L1 TD = 노드 (kubelet, containerd)<br />
            - L2 TD = 각 pod<br />
            - 멀티테넌트 격리 + 단일 노드 공유
          </p>
          <p className="mt-2">
            <strong>시나리오 2 — Function-as-a-Service</strong>:<br />
            - L1 TD = FaaS 런타임<br />
            - L2 TD = 각 함수 호출<br />
            - 짧은 수명 — 빠른 생성/파괴 필요
          </p>
          <p className="mt-2">
            <strong>시나리오 3 — Trusted I/O 중재</strong>:<br />
            - L1 TD가 storage·network 암호화 중재<br />
            - L2는 평문처럼 쓰되 I/O에서 L1이 암/복호화<br />
            - 앱 수정 없이 confidential 보장
          </p>
          <p className="mt-2">
            <strong>주의</strong>: TDX 1.5 필요 — Granite Rapids 이상<br />
            L1 신뢰성이 핵심 — L1 버그는 모든 L2 영향
          </p>
        </div>

      </div>
    </section>
  );
}
