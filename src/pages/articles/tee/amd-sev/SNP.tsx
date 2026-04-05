import RMPViz from './viz/RMPViz';
import RMPEntryViz from './viz/RMPEntryViz';
import VMPLPermsViz from './viz/VMPLPermsViz';
import MeasurementChainViz from './viz/MeasurementChainViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SNP({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="snp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SEV-SNP 핵심 메커니즘'}</h2>
      <div className="not-prose mb-8">
        <RMPViz />
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('rmp-entry', codeRefs['rmp-entry'])} />
          <span className="text-[10px] text-muted-foreground self-center">RMP 엔트리 구조</span>
          <CodeViewButton onClick={() => onCodeRef('vmpl-perms', codeRefs['vmpl-perms'])} />
          <span className="text-[10px] text-muted-foreground self-center">VMPL 권한 마스크</span>
          <CodeViewButton onClick={() => onCodeRef('pvalidate', codeRefs['pvalidate'])} />
          <span className="text-[10px] text-muted-foreground self-center">PVALIDATE 구현</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">RMP (Reverse Map Table)</h3>
        <p>
          <strong>RMP</strong>: 모든 물리 메모리 페이지의 메타데이터 테이블 (BIOS가 할당)<br />
          각 엔트리가 <strong>페이지 소유자</strong>(hypervisor/guest), <strong>유효 GPA</strong>, <strong>VMPL 권한</strong> 기록<br />
          메모리 접근마다 CPU가 RMP 조회 → 위반 시 <strong>RMP Fault</strong><br />
          <strong>크기</strong>: 4KB 페이지당 16B → 1TB 메모리 = 4GB RMP
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RMP 엔트리 구조 (각 4KB 페이지당)

struct rmp_entry {
    u64 assigned  : 1;    // 1 = guest에 할당됨, 0 = hypervisor 소유
    u64 pagesize  : 1;    // 0 = 4KB, 1 = 2MB
    u64 immutable : 1;    // 변경 불가 플래그
    u64 asid      : 10;   // 소유 guest의 ASID
    u64 vmsa      : 1;    // VMSA 페이지 여부
    u64 reserved  : 2;
    u64 gpa       : 39;   // 유효 Guest Physical Address

    u64 lock      : 1;
    u64 subpage_count : 9;  // 2MB 페이지 내 4KB 개수
    // ...
};

// RMP 검사 흐름 (페이지 접근 시)
void cpu_memory_access(u64 pa, u64 gpa, u64 asid) {
    struct rmp_entry *rmp = rmp_lookup(pa);

    // 1) 할당 여부 확인
    if (rmp->assigned && asid == 0)
        trigger_rmp_fault();  // Hypervisor가 guest 페이지 접근

    // 2) ASID 일치 확인
    if (rmp->assigned && rmp->asid != asid)
        trigger_rmp_fault();  // 다른 guest 페이지 접근

    // 3) GPA 매핑 확인
    if (rmp->assigned && rmp->gpa != gpa)
        trigger_rmp_fault();  // Hypervisor가 재매핑 시도

    // OK — 메모리 접근 허용
}`}</pre>

      </div>
      <RMPEntryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PVALIDATE — Guest가 페이지 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SNP 추가 명령: PVALIDATE
// Guest가 hypervisor가 할당한 페이지의 유효성 검증

// arch/x86/include/asm/sev.h
static inline int pvalidate(unsigned long vaddr, bool rmp_psize, bool validate) {
    int rc;
    asm volatile("pvalidate"
                 : "=a"(rc)
                 : "c"(vaddr), "d"(rmp_psize), "a"(validate)
                 : "memory");
    return rc;
}

// PVALIDATE 동작
// 1) CPU가 RMP 엔트리 확인
// 2) GPA == current guest's mapping 검증
// 3) validate=1이면 page "validated" 비트 설정
// 4) 성공 시 0, 실패 시 fault

// Guest 초기화 흐름
void snp_accept_memory(start, end) {
    for (pa = start; pa < end; pa += PAGE_SIZE) {
        // 1) Host가 RMP 설정 (guest 소유로)
        // 2) Guest가 PVALIDATE
        ret = pvalidate(pa, false, true);
        if (ret) panic("PVALIDATE failed");

        // 3) 이후 접근 시 RMP 검사 통과
    }
}

// 왜 필요한가
// - Host가 악의적으로 다른 guest의 페이지를 재할당 시도
// - PVALIDATE가 GPA 매핑 체크 → 재매핑 공격 차단
// - Guest가 명시적 "이 페이지 받겠다" 표시`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">VMPL (VM Permission Level)</h3>
        <p>
          게스트 VM 내부를 <strong>0~3 단계</strong>로 권한 계층화<br />
          VMPL 0 = 최고 권한 (guest 내 신뢰 서비스), VMPL 3 = 최저 (일반 앱)<br />
          <strong>페이지별 VMPL 권한 설정</strong> → 특정 레벨만 접근 가능
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// VMPL 구조
// ┌─────────────────────────────────┐
// │  Guest VM (단일 SEV-SNP VM)      │
// ├─────────────────────────────────┤
// │  VMPL 0: Secure paravisor        │ ← 최고 권한
// │          (SVSM, VTL0 equiv)      │
// ├─────────────────────────────────┤
// │  VMPL 1: Higher-priv hypervisor  │
// ├─────────────────────────────────┤
// │  VMPL 2: Reserved                │
// ├─────────────────────────────────┤
// │  VMPL 3: Guest OS kernel + apps  │ ← 최저 권한
// └─────────────────────────────────┘

// VMPL 전환
// VMGEXIT + MSR_AMD64_SEV_ES_GHCB = VMPL_SWITCH
// 현재 VMPL → 대상 VMPL (higher level로는 올라갈 수 없음)

// 페이지 권한 (RMP 엔트리에 per-VMPL 저장)
struct vmpl_perms {
    u8 read       : 1;
    u8 write      : 1;
    u8 user_exec  : 1;   // ring 3 exec
    u8 supervisor_exec : 1;  // ring 0 exec
};

// 실전 사용
// - Secure kernel을 VMPL 0에 배치
// - Main OS는 VMPL 3
// - Secure kernel만 민감 페이지 접근
// - Windows VBS, Linux SVSM이 이 모델 사용`}</pre>

      </div>
      <VMPLPermsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">측정 체인 (Measurement Chain)</h3>
        <p>
          <strong>SEV-SNP</strong>: 게스트 런치 각 단계를 측정(hash)하여 누적<br />
          펌웨어 → BIOS → 부트로더 → 커널 이미지 → 초기 데이터 전체 부트 체인 반영<br />
          <strong>Attestation Report</strong>에 포함되어 원격 검증 가능
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 측정 누적 방식 (Launch Digest)

// 초기값
launch_digest = 0

// 각 LAUNCH_UPDATE_DATA 호출 시
function update_digest(page_data, gpa, page_type):
    page_info = {
        LEN: 0x30,
        PAGE_TYPE: page_type,
        IMI_PAGE: 0,
        LPAGE_SIZE: 0,
        VMPL3/2/1_PERMS: perms,
        GPA: gpa,
        CONTENTS: SHA-384(page_data),
    }
    launch_digest = SHA-384(launch_digest || page_info)

// 측정 대상
// - PAGE_TYPE_NORMAL: 일반 데이터/코드 페이지
// - PAGE_TYPE_VMSA: vCPU 초기 상태
// - PAGE_TYPE_ZERO: 0으로 초기화된 페이지
// - PAGE_TYPE_UNMEASURED: 측정 제외 (heap 등)
// - PAGE_TYPE_SECRETS: Secrets page (VMPL 관리용)
// - PAGE_TYPE_CPUID: CPUID 테이블

// LAUNCH_FINISH 시점에 launch_digest 확정
// 이후 Attestation Report에서 MEASUREMENT 필드로 제공

// Guest owner가 검증
// 1) 동일 이미지로 launch_digest 재계산
// 2) Attestation Report.measurement와 비교
// 3) 일치하면 "이 VM은 내가 의도한 이미지"`}</pre>

      </div>
      <MeasurementChainViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RMP vs Intel S-EPT</p>
          <p>
            <strong>Intel TDX S-EPT</strong>:<br />
            - Extended Page Table 기반 (MMU walk)<br />
            - Stage 2 번역 + 권한<br />
            - TD Module이 관리
          </p>
          <p className="mt-2">
            <strong>AMD SEV-SNP RMP</strong>:<br />
            - 별도 flat table (PA indexed)<br />
            - MMU walk 후 추가 검사<br />
            - ASP firmware가 관리
          </p>
          <p className="mt-2">
            <strong>trade-off</strong>:<br />
            - RMP: 단순, 큰 메모리 → 큰 table (4GB/TB)<br />
            - S-EPT: 계층적, 희소 메모리 효율적<br />
            - 둘 다 hypervisor 재매핑 공격 방어<br />
            - SNP가 PVALIDATE로 guest-side validation 추가 (TDX의 ACCEPT와 유사)
          </p>
        </div>

      </div>
    </section>
  );
}
