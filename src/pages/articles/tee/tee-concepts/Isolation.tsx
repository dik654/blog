export default function Isolation() {
  return (
    <section id="isolation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 격리 &amp; 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 격리의 핵심 메커니즘</h3>
        <p>
          <strong>메모리 컨트롤러</strong>가 CPU ↔ DRAM 사이에서 실시간 암호화/복호화<br />
          <strong>CPU 캐시</strong>: 평문 상태 (빠른 연산 위해)<br />
          <strong>DRAM</strong>: 암호문 저장 (cold boot, probe 방어)<br />
          <strong>접근 제어</strong>: 하드웨어가 어느 코드가 어느 메모리 접근하는지 강제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 격리 메커니즘</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel SGX — EPC (Enclave Page Cache)
// - BIOS가 예약된 물리 메모리 영역 (PRM)
// - CPU가 PRM 접근 시 HW 검사
// - Enclave 외부 접근 → abort page (random bytes)
// - 크기: 128MB ~ 512MB (초기) / 1TB (SGX2/DCAP)

// AMD SEV — per-VM AES 키
// - 메모리 컨트롤러에 AES 엔진 내장
// - C-bit로 암호화 여부 결정
// - ASID로 VM 식별 → 키 선택
// - 전체 DRAM 사용 가능

// Intel TDX — MKTME
// - PA 상위 비트에 KeyID 인코딩
// - VM마다 다른 KeyID → 다른 AES key
// - S-EPT로 VM 메모리 ownership 관리
// - TD Module이 전체 중재

// ARM CCA — GPT + RME
// - Granule Protection Table (PAS별 소유권)
// - MEC로 암호화 (옵션)
// - 4 PAS: NS, Secure, Realm, Root

// 공통 속성
// 1) 평문 노출 최소화 (CPU 캐시만)
// 2) 외부 물리 관측 방어
// 3) 실행 시간 오버헤드 최소화
// 4) HW 기반 강제 (software 우회 불가)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 암호화 알고리즘</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">Mode</th>
                <th className="border border-border px-3 py-2 text-left">무결성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">SGX (SGX1)</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">CTR</td>
                <td className="border border-border px-3 py-2">Yes (MEE)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">SEV (legacy)</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">ECB-like</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">SEV-SNP</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XEX</td>
                <td className="border border-border px-3 py-2">Yes (RMP)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDX 1.0</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XTS</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDX 1.5</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XTS + MAC</td>
                <td className="border border-border px-3 py-2">Yes (28-bit MAC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TrustZone (OP-TEE)</td>
                <td className="border border-border px-3 py-2">Platform 의존</td>
                <td className="border border-border px-3 py-2">Varies</td>
                <td className="border border-border px-3 py-2">Optional</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX MEE — Memory Encryption Engine</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX의 가장 강력한 메모리 보호
// - 기밀성 + 무결성 + replay 방어 전부

// Merkle tree 기반 무결성
//
// DRAM           MEE (on CPU die)
// ┌─────┐        ┌──────────────┐
// │page0│ <─────> │  Leaf hash   │
// │page1│ <─────> │  Leaf hash   │
// │page2│        │    ...       │
// │  .. │        │  Tree root   │ ← CPU 내부 저장
// └─────┘        └──────────────┘

// 메모리 읽기 시
// 1) 페이지 fetch (암호문)
// 2) CPU에서 AES 복호화 → 평문
// 3) Counter 확인 (replay 방어)
// 4) Integrity tree walk → root 비교
// 5) 매치하면 CPU 캐시에 load

// Replay attack 방어
// - 각 페이지마다 monotonic counter
// - Counter가 Integrity tree에 포함
// - Old ciphertext 주입 시 counter mismatch

// 성능 비용
// - 암호화: ~2-5% 오버헤드
// - 무결성 tree: ~10-30% (tree walk)
// - SGX의 강력한 보안 대가

// TDX/SEV는 이 수준 보호 없음 (무결성만 MAC으로)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">격리 검증 — 공격자 관점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 공격자가 시도할 수 있는 것

// 1. 단순 메모리 읽기
//    - Host kernel이 TEE 페이지 접근
//    - → SGX: abort page 반환
//    - → SEV/TDX: random bytes (다른 키로 복호화)
//    방어: 100% (하드웨어)

// 2. DMA 공격
//    - 악성 PCIe 디바이스로 메모리 직접 읽기
//    - → IOMMU로 차단 (SGX, TDX)
//    - → SMMU로 차단 (ARM CCA)
//    방어: 100% (IOMMU 설정 필수)

// 3. Memory remapping
//    - Hypervisor가 페이지 테이블 조작
//    - TEE 페이지를 공격자 VM으로 재매핑
//    - → TDX: S-EPT로 방어
//    - → SEV-SNP: RMP로 방어
//    - → SGX: EPCM으로 방어
//    방어: 100% (metadata tables)

// 4. Cold boot attack
//    - DRAM freezing으로 내용 보존
//    - 물리 추출 후 분석
//    - → 모든 TEE: AES 암호화로 방어
//    방어: 95%+ (키는 CPU 내부)

// 5. Memory bus probing
//    - 물리 프로브로 메모리 버스 모니터
//    - → 모든 TEE: 암호화된 트래픽만
//    방어: 90%+ (trace 패턴은 일부 leak)

// 6. Side channels (cache, timing)
//    - 메모리 직접 접근 없이 패턴 추론
//    - → 범위 밖 (대부분 TEE)
//    방어: 앱 레벨 대응 필수`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 메모리 격리의 한계</p>
          <p>
            <strong>방어 가능</strong>:<br />
            ✓ 직접 메모리 읽기 (host, DMA, probe)<br />
            ✓ 메모리 재매핑 / page table 조작<br />
            ✓ Cold boot attack<br />
            ✓ 물리 swap 시도
          </p>
          <p className="mt-2">
            <strong>방어 불가</strong>:<br />
            ✗ Cache side channel (접근 패턴으로 추론)<br />
            ✗ Transient execution (Spectre 등)<br />
            ✗ Power/EM analysis<br />
            ✗ CPU 자체의 물리적 공격 (decapping)
          </p>
          <p className="mt-2">
            <strong>실전 결론</strong>:<br />
            - 메모리 암호화는 <strong>필요 조건</strong>, 충분 조건 아님<br />
            - 앱 레벨 constant-time coding 필수<br />
            - Attestation으로 TCB 상태 검증<br />
            - Defense in depth 원칙 적용
          </p>
        </div>

      </div>
    </section>
  );
}
