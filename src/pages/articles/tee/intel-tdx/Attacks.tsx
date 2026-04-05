import AttacksViz from './viz/AttacksViz';

export default function Attacks() {
  return (
    <section id="attacks" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">공격 모델 &amp; 알려진 취약점</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">위협 모델 4분류</h3>

        <AttacksViz />

        <p>
          TDX 위협 모델: <strong>Host(VMM), BIOS, 관리자, 물리적 공격자</strong> 전부 untrusted<br />
          Trusted: <strong>CPU, TDX Module(SEAM), 메모리 컨트롤러 내부 로직</strong><br />
          범위 밖: DoS, 사이드채널 일부(power), TD 내부 악성 코드
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">공개된 주요 취약점</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">CVE / Name</th>
                <th className="border border-border px-3 py-2 text-left">설명</th>
                <th className="border border-border px-3 py-2 text-left">해결</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">INTEL-SA-01103</td>
                <td className="border border-border px-3 py-2">TDX Module 1.5.05 이하 로직 버그</td>
                <td className="border border-border px-3 py-2">1.5.06 업데이트</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">GhostRace (2024)</td>
                <td className="border border-border px-3 py-2">TDX speculative race — SEAMCALL 경합</td>
                <td className="border border-border px-3 py-2">ucode 패치</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDXDown (USENIX 2024)</td>
                <td className="border border-border px-3 py-2">타이머 기반 SEAMCALL 프로파일링</td>
                <td className="border border-border px-3 py-2">연구 수준 (low impact)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Downfall (GDS)</td>
                <td className="border border-border px-3 py-2">GATHER 명령 투기 누출</td>
                <td className="border border-border px-3 py-2">ucode + AVX2 gather disable</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">INTEL-SA-00960</td>
                <td className="border border-border px-3 py-2">Reptar — xsave prefix 버그</td>
                <td className="border border-border px-3 py-2">ucode 패치</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Side-Channel 완화 — L1D Flush</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TDX Module이 SEAMRET 시 자동 처리

void seamret_to_host(void) {
    /* 1) TD 상태 저장 (VMCS·레지스터) */
    save_td_state();

    /* 2) Microarchitectural 버퍼 플러시 */
    __asm__ volatile ("verw %[zero]" :: [zero]"m"(zero_word));  // MDS mitigation
    wrmsrl(MSR_IA32_FLUSH_CMD, L1D_FLUSH);                      // L1TF mitigation

    /* 3) IBPB (Indirect Branch Predictor Barrier) */
    wrmsrl(MSR_IA32_PRED_CMD, PRED_CMD_IBPB);

    /* 4) Host 상태 복원 */
    restore_host_state();

    /* 5) VMRESUME Host */
    __seamret();
}

// L1TF(L1 Terminal Fault) — 기밀 데이터 L1 캐시 누출 가능
// L1D_FLUSH가 L1 캐시 비워서 Host가 투기 실행해도 얻을 것 없음

// 성능 비용
// - SEAMRET마다 ~200 cycles
// - 핫패스(interrupt, TDVMCALL)에 누적 오버헤드`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Transient Execution — IBRS/STIBP</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Spectre v2 방어

// TD 진입 시
wrmsrl(MSR_IA32_SPEC_CTRL, SPEC_CTRL_IBRS | SPEC_CTRL_STIBP);
// - IBRS: Indirect Branch Restricted Speculation
// - STIBP: Single Thread Indirect Branch Predictors

// TDX Module 자체도 보호 필요
// - retpoline 컴파일
// - LFENCE 분기 sanitize
// - eIBRS 기본 활성화 (Sapphire Rapids+)

// Software Harden Required 표시
// - Quote TCB status에 SWHardeningNeeded 포함 시
// - Guest OS도 매칭되는 패치 필요
// - 미패치 시 Relying Party가 warning 처리`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Replay Attack — TDX 1.5 방어</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TDX 1.0: 동일 주소의 old ciphertext 삽입 가능
//   → TDX는 데이터 무결성 보장 안 함
//   → 공격자가 과거 스냅샷 주입

// TDX 1.5 Cryptographic Integrity
// - 28비트 MAC per 캐시라인 (ECC 영역 활용)
// - MAC 키 = AES-XTS 데이터 키 (주소 tweak 포함)
// - MAC 계산: HMAC(key, plaintext || address)

// 검증 실패 시
//   → Machine Check Exception
//   → TD poisoned 상태
//   → 다음 SEAMCALL이 exit 처리

// 한계
// - 같은 주소의 과거 ciphertext 주입은 여전히 가능?
//   → MAC이 timestamp 포함 안 하면 가능
//   → Intel 문서는 "주소 결속"만 언급
// - 실전에선 capability 제한 (DMA 격리 + MMU)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">연구 계층 공격 분석</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2023~2024 학술 공격 요약

// [1] TDXDown (USENIX Security 2024)
// - SEAMCALL latency 프로파일링
// - TD 내부 실행 패턴 유추
// - 완화: constant-time SEAMCALL, noise 추가

// [2] WeSee (CCS 2024)
// - SGX 타겟팅 side-channel
// - TDX엔 직접 적용 어려움 (VM 단위)
// - 시사점: VM도 LLC 공유 시 취약

// [3] Memory Bus Monitoring (S&P 2023)
// - 물리 버스에 logic analyzer
// - 트래픽 패턴 분석 (access frequency)
// - 완화: ORAM, dummy access

// 실전 위협도
// - 고도 공격자(국가급) 수준
// - 일반 클라우드 멀티테넌트 시나리오 < 10% 영향
// - 금융·의료 등 고민감도 워크로드엔 추가 방어 필요`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TDX와 SGX의 위협 모델 비교</p>
          <p>
            <strong>SGX (SGX1)</strong>:<br />
            - 앱 단위 격리 (Enclave)<br />
            - 메모리 128MB 제한 (EPC)<br />
            - 페이지 swap 시 암호화·무결성·replay 완전 방어 (MEE)<br />
            - 작은 TCB → 검증 용이
          </p>
          <p className="mt-2">
            <strong>TDX</strong>:<br />
            - VM 단위 격리 (TD)<br />
            - 전체 물리 메모리 사용 가능<br />
            - TDX 1.0 — replay 취약, 1.5 — 무결성 추가<br />
            - 큰 TCB (Guest OS 포함) → 공격 표면 넓음
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - 작은 기밀 코드 + 최고 보안 → SGX<br />
            - 기존 VM 마이그레이션 + 편의성 → TDX<br />
            - SGX는 EOL 진행 중 (클라이언트 CPU) → TDX가 서버 표준
          </p>
          <p className="mt-2">
            <strong>AMD SEV-SNP와 비교</strong>:<br />
            - SEV-SNP도 VM 단위, 무결성 기본 (RMP)<br />
            - TDX는 TDX Module이 추가 TCB → 공격 표면<br />
            - 성능·생태계는 비슷한 수준
          </p>
        </div>

      </div>
    </section>
  );
}
