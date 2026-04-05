import SeamLevelsViz from './viz/SeamLevelsViz';

export default function SeamModule() {
  return (
    <section id="seam-module" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEAM 권한 &amp; TD Module</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">SEAM — 하이퍼바이저 위의 새 권한 레벨</h3>
        <p>
          <strong>SEAM(Secure Arbitration Mode)</strong>은 x86에 추가된 <strong>새 CPU 실행 모드</strong><br />
          위치: VMX Root(Ring -1) 보다 더 높은 권한 — "Ring -2" 개념<br />
          목적: 하이퍼바이저도 건드릴 수 없는 신뢰 코드 실행 영역
        </p>

        <SeamLevelsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">권한 레벨 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`SEAM (최상위) — TD Module, P-SEAMLDR
  │
  ├─ VMX Root (Ring 0-3, 하이퍼바이저)
  │   │  - KVM, Hyper-V, ESXi
  │   │  - TD 메모리 직접 접근 불가
  │   │
  │   └─ VMX Non-Root (Ring 0-3, 게스트 VM)
  │       - Trust Domain (TD) — TDX 보호
  │       - 일반 VM — 비보호
  │
  └─ (SEAM만의 독립 메모리 영역: SEAMRR)`}</pre>
        <p>
          <strong>SEAMRR(SEAM Range Register)</strong>: BIOS가 예약하는 메모리 영역<br />
          - 크기: 보통 256MB<br />
          - 오직 SEAM 모드에서만 접근 가능<br />
          - 하이퍼바이저조차 이 영역 읽기/쓰기 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">P-SEAMLDR — Persistent SEAM Loader</h3>
        <p>
          P-SEAMLDR은 TD Module을 <strong>검증 후 SEAMRR에 로드</strong>하는 프로그램<br />
          자체도 Intel 서명됨 — SEAM Loader의 "루트 오브 트러스트"
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`부팅 시퀀스:
1. BIOS가 SEAMRR 영역 예약 (pre-boot memory layout)
2. BIOS가 P-SEAMLDR 로드 (BIOS 서명 ACM)
3. P-SEAMLDR이 TD Module 바이너리 서명 검증
4. 서명 통과 시 SEAMRR에 TD Module 로드
5. TD Module 초기화 (TDH.SYS.LP.INIT)
6. TDX 사용 준비 완료

// 런타임 업그레이드
P-SEAMLDR이 TD Module을 runtime에 교체 가능
- TDH.SYS.UPDATE 명령
- 새 TD Module 서명 검증 후 교체
- 기존 TD는 유지 (상태 마이그레이션)`}</pre>
        <p>
          <strong>핵심</strong>: TD Module 버전이 올라가도 <strong>실행 중인 TD는 영향 없음</strong><br />
          Intel이 보안 패치 배포 시 TCB 업그레이드가 seamless
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TD Module 내부 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`TD Module (SEAMRR 내부, 약 5MB)
├── TDH.* (Host-side functions) — 하이퍼바이저가 호출
│   ├── TDH.MNG.*    — TD 생성/초기화/종료
│   ├── TDH.MEM.*    — 메모리 매핑 관리
│   ├── TDH.VP.*     — 가상 CPU 관리
│   ├── TDH.PHYMEM.* — 물리 메모리 페이지 관리
│   └── TDH.SYS.*    — 시스템 초기화, 업데이트
│
├── TDG.* (Guest-side functions) — TD 내부에서 호출
│   ├── TDG.VP.*     — VM 속성 조회
│   ├── TDG.MEM.*    — 메모리 속성 조회
│   ├── TDG.MR.*     — Measurement 관련 (REPORT 생성)
│   ├── TDG.VP.VMCALL — Host 서비스 요청 (I/O 등)
│   └── TDG.SERVTD.* — Service TD 연동
│
├── 내부 데이터 구조
│   ├── TDR (TD Root)       — TD 메타데이터
│   ├── TDCS (TD Control)   — TD 설정
│   ├── TDVPS (TD VP State) — 각 vCPU 상태
│   └── SEPT (Secure EPT)   — TD 전용 페이지 테이블
│
└── 메모리 암호화 키 관리`}</pre>
        <p>
          <strong>TDH vs TDG</strong>:<br />
          - <code>TDH.*</code>: Host가 <strong>SEAMCALL</strong>로 호출<br />
          - <code>TDG.*</code>: Guest(TD)가 <strong>TDCALL</strong>로 호출<br />
          둘 다 CPU가 <strong>SEAMCALL/TDCALL</strong> 명령으로 SEAM 진입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SEAMCALL / SEAMRET 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host → TD Module (SEAMCALL 예시)
// Linux arch/x86/virt/vmx/tdx/seamcall.S

SYM_FUNC_START(__seamcall)
    // RAX = TDH function ID
    // RCX, RDX, R8-R11 = 입력 인자
    seamcall

    // 반환 시
    // RAX = completion status
    // RCX, RDX, R8-R11 = 출력값
    ret
SYM_FUNC_END(__seamcall)

// SEAMCALL 동작
1. CPU가 현재 VMX Root 상태 저장
2. SEAM 모드 진입 (SEAMRR에서 TD Module 코드 fetch)
3. 입력 파라미터 검증
4. 요청된 TDH 함수 실행
5. SEAMRET으로 VMX Root 복귀
6. RAX에 결과 코드 반환

// 실패 예시
SEAMCALL 결과 = 0x8000_0001_0000_0001
  → ENTROPY_FAIL: TD 키 생성에 필요한 엔트로피 부족`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 TDH 함수 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Category</th>
                <th className="border border-border px-3 py-2 text-left">주요 함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">TDH.MNG</td>
                <td className="border border-border px-3 py-2"><code>CREATE, KEYCONFIG, INIT, FINAL, KEYRECLAIM</code></td>
                <td className="border border-border px-3 py-2">TD 수명 주기</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDH.MEM</td>
                <td className="border border-border px-3 py-2"><code>PAGE.ADD, PAGE.AUG, PAGE.RELOCATE, RANGE.BLOCK</code></td>
                <td className="border border-border px-3 py-2">TD 메모리 관리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDH.VP</td>
                <td className="border border-border px-3 py-2"><code>CREATE, INIT, ENTER, FLUSH, RD/WR</code></td>
                <td className="border border-border px-3 py-2">vCPU 제어</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDH.PHYMEM</td>
                <td className="border border-border px-3 py-2"><code>PAGE.RECLAIM, PAGE.WBINVD, CACHE.WB</code></td>
                <td className="border border-border px-3 py-2">캐시 동기화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDH.SYS</td>
                <td className="border border-border px-3 py-2"><code>INIT, LP.INIT, CONFIG, UPDATE, SHUTDOWN</code></td>
                <td className="border border-border px-3 py-2">TDX 시스템 관리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TD Module 초기화 (시작 시퀀스)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Linux 호스트 커널 초기화 (tdx_cpu_enable 등)

1. TDH.SYS.INIT        // TDX 전역 초기화 (1회)
2. TDH.SYS.LP.INIT     // 각 논리 CPU별 초기화
3. TDH.SYS.CONFIG      // 시스템 설정 (TDMR 영역 지정)
4. TDH.SYS.TDMR.INIT   // 각 TDMR에 대해 호출
5. (TD 생성 준비 완료)

// TDMR (TD Memory Range)
- TDX가 관리하는 물리 메모리 범위
- 각 TDMR마다 PAMT(Physical Address Meta Table) 필요
- PAMT: 페이지당 소유권, 타입, MAC 저장

// 메모리 요구량
TDMR 1GB당 PAMT = 약 16MB
총 시스템 메모리의 ~1.5% 예약됨`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 SEAM이 필요한가</p>
          <p>
            기존 VMX(Ring -1)는 <strong>하이퍼바이저가 최상위</strong><br />
            → TD 보호 로직을 하이퍼바이저에 두면 하이퍼바이저가 악성일 때 무력화
          </p>
          <p className="mt-2">
            SEAM은 <strong>하이퍼바이저 위의 새 레벨</strong>:<br />
            - TD Module 코드가 SEAMRR에서만 실행<br />
            - 하이퍼바이저가 Ring -1이지만 SEAMRR은 접근 불가<br />
            - CPU 마이크로아키텍처가 SEAM 경계 강제
          </p>
          <p className="mt-2">
            대안: <strong>Intel SMM</strong>(System Management Mode)을 재활용할 수도 있었음<br />
            하지만 SMM은 BIOS/ME와 공유 — 충돌·복잡도 큼<br />
            SEAM은 <strong>TDX 전용 새 공간</strong> — 깨끗한 설계
          </p>
        </div>

      </div>
    </section>
  );
}
