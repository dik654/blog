import PartitioningViz from './viz/PartitioningViz';

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// L1 TD는 일반 TD인데 추가 권한 보유
//   TD_ATTRIBUTES.PERFMON = 0
//   TD_ATTRIBUTES.PARTITIONING = 1  ← 활성화

// L1 안에서 사용 가능한 신규 TDCALL
TDG.VP.ENTER       // L2 vCPU 진입 (L1→L2)
TDG.VP.INVEPT      // L2 S-EPT 무효화
TDG.VP.INVGLA      // L2 TLB 플러시
TDG.VP.RD/WR       // L2 상태 읽기/쓰기
TDG.MEM.PAGE.ATTR  // L2 페이지 속성 변경

// L2 생성 흐름 (L1 내부에서)
l2_tdcs = alloc_l2_control_structure();
tdg_vp_create(l2_tdcs, ...);         // L2 TD 생성
tdg_vp_init(l2_tdcs, l2_params);     // L2 초기화
for each page in L2 image {
    tdg_mem_page_add(l2_tdcs, gpa);  // L2 메모리 추가
}
tdg_mr_finalize(l2_tdcs);            // L2 MRTD 확정
tdg_vp_enter(l2_vcpu);               // L2 실행 시작`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">L1 ↔ L2 전환 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 3-계층 권한 구조
//
// ┌─────────────────────────────────┐
// │  SEAM (TD Module) — 최고 권한    │
// └─────────────────────────────────┘
//          ↕ SEAMCALL/SEAMRET
// ┌─────────────────────────────────┐
// │  Host VMM (KVM)                 │
// └─────────────────────────────────┘
//          ↕ TDENTER/TDEXIT
// ┌─────────────────────────────────┐
// │  L1 TD (Partitioning Manager)   │
// └─────────────────────────────────┘
//          ↕ TDG.VP.ENTER (L1→L2)
// ┌─────────────────────────────────┐
// │  L2 TD (workload)               │
// └─────────────────────────────────┘

// L1→L2 전환
l1: tdg_vp_enter(l2_vcpu_handle);
    → TDX Module이 L1 상태 저장
    → L2 상태 복원
    → L2 실행 재개

// L2→L1 복귀 (L2 exit)
// L2가 TDVMCALL 하거나 interrupt 받으면
//   → TDX Module이 exit reason 결정
//   → L2 상태 저장 후 L1으로 복귀
//   → L1이 exit 처리 (virtio, paging 등)
//   → 다시 tdg_vp_enter로 재진입`}</pre>
        <p>
          <strong>3-계층</strong>: SEAM → Host → L1 → L2<br />
          L2의 "hypervisor"는 L1 TD — Host VMM 아님<br />
          L2는 L1만 신뢰하면 됨 → L1 벤더가 TCB 범위 축소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 격리 — L2별 KeyID</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TDX 1.5: L2마다 별도 KeyID 가능 (옵션)
// - L1 KeyID와 L2 KeyID 분리
// - L1도 L2 메모리 직접 읽기 불가 (완전 격리 모드)

// 완전 격리 모드 (strong partitioning)
L1_KeyID   = 5
L2_1_KeyID = 6
L2_2_KeyID = 7
// → L1이 L2 메모리 접근 시 복호화 실패 (random bits)

// 공유 KeyID 모드 (lite partitioning)
L1_KeyID = L2_1_KeyID = L2_2_KeyID = 5
// → L1이 L2 디버그 가능 (개발용)
// → 프로덕션에선 금지

// S-EPT도 3계층
// Host S-EPT (Level 0) → L1 S-EPT (Level 1) → L2 S-EPT (Level 2)
// TDX Module이 전체 walk 수행`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Live Migration (TDX 1.5)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TDX 1.5는 TD를 다른 플랫폼으로 마이그레이션 가능

// 1) 소스 Host에서 Migration TD(MigTD) 실행
//    - 특별한 Service TD
//    - Migration key 관리

// 2) 대상 Host의 MigTD와 상호 attestation
MigTD_src ↔ MigTD_dst
  → Quote 교환 + 정책 검증
  → 세션 키 수립 (ECDH)

// 3) TD 메모리 암호화된 채로 전송
for each page in migrating TD {
    // 원본 키 해제 → 세션 키로 재암호화
    tdh_export_mem(page);
    send_over_network(encrypted_page);
    tdh_import_mem(page, dst_hkid);
}

// 4) 대상에서 실행 재개
tdh_vp_enter(migrated_td);

// 보안 속성
// - 원본 KeyID는 네트워크 노출 안 됨
// - 세션 키는 일회용
// - MigTD가 정책 강제 (이동 허용 플랫폼 제한)`}</pre>

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
