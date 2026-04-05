import ContextViz from './viz/ContextViz';
import ThreatModelViz from './viz/ThreatModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDX 아키텍처 &amp; 위협 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TDX 등장 배경</h3>
        <p>
          Intel TDX(Trust Domain Extensions)는 2022년 Sapphire Rapids(Xeon 4세대)에 최초 도입<br />
          목표: 클라우드 사업자도 VM 내부를 들여다볼 수 없는 <strong>VM 단위 기밀 컴퓨팅</strong> 제공<br />
          기존 SGX가 <strong>enclave(앱 내부 영역)</strong> 단위였다면, TDX는 <strong>전체 VM(Trust Domain, TD)</strong>이 격리 단위
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">경쟁 기술과의 위치</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">격리 단위</th>
                <th className="border border-border px-3 py-2 text-left">하이퍼바이저 신뢰</th>
                <th className="border border-border px-3 py-2 text-left">상용화</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Intel SGX</td>
                <td className="border border-border px-3 py-2">Enclave (앱 내부)</td>
                <td className="border border-border px-3 py-2">불필요</td>
                <td className="border border-border px-3 py-2">2015 (Skylake)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel TDX</strong></td>
                <td className="border border-border px-3 py-2">VM (Trust Domain)</td>
                <td className="border border-border px-3 py-2">불필요</td>
                <td className="border border-border px-3 py-2">2022 (Sapphire Rapids)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SEV-SNP</td>
                <td className="border border-border px-3 py-2">VM</td>
                <td className="border border-border px-3 py-2">불필요</td>
                <td className="border border-border px-3 py-2">2021 (Milan 3rd Gen EPYC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ARM CCA</td>
                <td className="border border-border px-3 py-2">Realm (VM)</td>
                <td className="border border-border px-3 py-2">불필요</td>
                <td className="border border-border px-3 py-2">2024+ (ARMv9.2)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AWS Nitro Enclaves</td>
                <td className="border border-border px-3 py-2">Sibling VM</td>
                <td className="border border-border px-3 py-2">Nitro 필요</td>
                <td className="border border-border px-3 py-2">2020 (AWS only)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDX 위협 모델</h3>

        <ThreatModelViz />

        <p>
          TDX의 <strong>TCB(Trusted Computing Base)</strong>:
        </p>
        <p>
          ✓ CPU 하드웨어 (Intel fab)<br />
          ✓ TD Module (Intel 서명 SEAM 코드)<br />
          ✓ P-SEAMLDR (Persistent SEAM Loader, Intel 서명)<br />
          ✓ TD 내부 게스트 OS + 앱 (사용자 제어)
        </p>
        <p>
          <strong>TCB 밖 (신뢰 불필요)</strong>:<br />
          ✗ 하이퍼바이저 (KVM, Hyper-V, ESXi 등)<br />
          ✗ 호스트 OS<br />
          ✗ BMC/펌웨어 (런타임에만; 부팅 TCB는 별도)<br />
          ✗ 클라우드 관리자, 데이터센터 물리 접근자
        </p>
        <p>
          <strong>공격자 능력</strong>:<br />
          - 하이퍼바이저 전체 제어<br />
          - TD 메모리에 대한 물리적 DMA 시도<br />
          - MMIO, Port I/O 관찰·수정<br />
          - TD 진입/탈출 시점 제어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 보안 속성</h3>
        <p>
          <strong>1. 메모리 기밀성(Confidentiality)</strong><br />
          MKTME(Multi-Key TME)가 TD별 고유 AES-XTS 128/256 키로 메모리 암호화<br />
          하이퍼바이저가 물리 메모리를 덤프해도 암호문만 획득
        </p>
        <p>
          <strong>2. 메모리 무결성(Integrity)</strong><br />
          TDX 1.5부터 cryptographic integrity (MAC) 제공<br />
          공격자가 암호문 비트 조작 시 TD가 <code>#MC</code>(Machine Check) 예외 발생
        </p>
        <p>
          <strong>3. Replay 보호</strong><br />
          각 메모리 라인이 TD별 per-line counter 사용<br />
          오래된 암호문으로 덮어쓰기(리플레이) 공격 차단
        </p>
        <p>
          <strong>4. CPU 상태 격리</strong><br />
          TD의 레지스터(XMM, YMM, ZMM 포함)가 TD Exit 시 자동 save/clear<br />
          하이퍼바이저는 TD 스냅샷에서 필터링된 정보만 받음
        </p>
        <p>
          <strong>5. 원격 증명(Remote Attestation)</strong><br />
          DCAP(Data Center Attestation Primitives) 기반 ECDSA Quote 생성<br />
          검증자가 TD의 초기 측정값 + TDX 모듈 버전 확인 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX와의 아키텍처 차이</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">측면</th>
                <th className="border border-border px-3 py-2 text-left">SGX</th>
                <th className="border border-border px-3 py-2 text-left">TDX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">격리 경계</td>
                <td className="border border-border px-3 py-2">프로세스 내 enclave</td>
                <td className="border border-border px-3 py-2">VM 전체</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">OS 호환성</td>
                <td className="border border-border px-3 py-2">특수 SDK 필요</td>
                <td className="border border-border px-3 py-2">기존 OS 그대로 (lift-and-shift)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">EPC 크기 제한</td>
                <td className="border border-border px-3 py-2">~256MB (paged)</td>
                <td className="border border-border px-3 py-2">TB급 메모리 지원</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">OS syscall</td>
                <td className="border border-border px-3 py-2">ECALL/OCALL 필요</td>
                <td className="border border-border px-3 py-2">정상 syscall (TD 내부)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">측정(Measurement)</td>
                <td className="border border-border px-3 py-2">MRENCLAVE, MRSIGNER</td>
                <td className="border border-border px-3 py-2">MRTD, RTMR[0..3]</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TEE Report</td>
                <td className="border border-border px-3 py-2">EREPORT</td>
                <td className="border border-border px-3 py-2">TDG.MR.REPORT → TDREPORT</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 배포 현황 (2025)</h3>
        <p>
          <strong>Azure Confidential VMs (CVM)</strong>: DCesv5/ECesv5 시리즈 — TDX 기반<br />
          <strong>Google Cloud Confidential VMs</strong>: C3 머신 타입 TDX 옵션<br />
          <strong>Alibaba Cloud</strong>: g8i TDX 인스턴스 (중국 시장)<br />
          <strong>IBM Cloud</strong>: Confidential AI inference 서비스
        </p>
        <p>
          <strong>CPU 요구사항</strong>:<br />
          - 4th Gen Xeon Scalable (Sapphire Rapids, Emerald Rapids)<br />
          - 5th Gen (Emerald), 6th Gen (Granite Rapids, Sierra Forest) 계속 확장<br />
          - BIOS에서 TDX 활성화 + TME-MK 키 파티셔닝 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Linux 커널 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host 측 (KVM-TDX)
arch/x86/kvm/vmx/tdx.c          // TDX-specific KVM logic
arch/x86/virt/vmx/tdx/          // Low-level SEAMCALL wrappers
  tdx.c                         // TDH.* host functions
  seamcall.S                    // ASM SEAMCALL trampoline

// Guest 측 (TD 내부)
arch/x86/coco/tdx/              // TDX guest support
  tdx.c                         // TDCALL wrappers
  tdcall.S                      // ASM TDCALL trampoline

// 주요 함수 시그니처
u64 __seamcall(u64 fn, struct tdx_module_args *args);  // Host → TDX Module
u64 __tdcall(u64 fn, struct tdx_module_args *args);    // Guest → TDX Module`}</pre>
        <p>
          Linux 6.x 부터 KVM-TDX 패치 병합 — 메인라인 커널 지원<br />
          <code>CONFIG_INTEL_TDX_HOST</code> + <code>CONFIG_INTEL_TDX_GUEST</code> 구분
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Lift-and-Shift 전략</p>
          <p>
            SGX의 가장 큰 한계: <strong>기존 앱 재작성 필요</strong><br />
            - ECALL/OCALL 경계 설계<br />
            - SDK 학습<br />
            - 포인터 변환 코드 작성
          </p>
          <p className="mt-2">
            TDX의 가치 제안: <strong>기존 VM 이미지 그대로 사용</strong><br />
            - OS·앱·미들웨어 수정 0<br />
            - VM 이미지를 onprem → TDX CVM으로 이동만<br />
            - 기밀 컴퓨팅 진입장벽 대폭 낮춤
          </p>
          <p className="mt-2">
            트레이드오프: <strong>TCB 크기 증가</strong><br />
            - SGX: 작은 enclave만 신뢰 (~수KB 코드)<br />
            - TDX: 전체 VM 신뢰 (커널 + 라이브러리 = GB급)<br />
            - 버그 표면 ↑, 하지만 실용성 ↑
          </p>
        </div>

      </div>
    </section>
  );
}
