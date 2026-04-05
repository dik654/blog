import SmmuViz from './viz/SmmuViz';

export default function SmmuDma() {
  return (
    <section id="smmu-dma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SMMU &amp; Confidential DMA</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">DMA 공격과 SMMU의 역할</h3>

        <SmmuViz />

        <p>
          <strong>위협</strong>: Host가 악성 디바이스(또는 DMA-capable device 드라이버) 통해 Realm 메모리 탈취<br />
          <strong>방어</strong>: <strong>SMMU(IOMMU)</strong>가 DMA 경로에서도 GPT 검사<br />
          <strong>결과</strong>: CPU 경로·DMA 경로 모두 동일한 격리 보장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SMMU v3.2 — RME 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SMMUv3 Stream Table Entry (STE)
struct ste {
    u64 valid      : 1;
    u64 config     : 3;     // S1/S2/bypass/...
    u64 s1fmt      : 2;
    u64 s1ctxptr   : 52;    // Stage 1 context
    u64 s2ttb      : 52;    // Stage 2 table base
    u64 s2vmid     : 16;
    u64 nse        : 1;     // ← RME 추가 (Realm/Secure Ext)
    u64 ns         : 1;
    /* ... */
};

// 4 worlds × DMA
// STE.NS=1, NSE=0 → Normal (Host IOMMU)
// STE.NS=0, NSE=0 → Secure  (TrustZone IOMMU)
// STE.NS=1, NSE=1 → Realm   (RMM이 S2 관리)
// STE.NS=0, NSE=1 → Root    (Monitor only)

// RME-SMMU 필수 기능 (FEAT_RME)
// - STE의 NSE 비트 해석
// - Realm stream 요청 시 Realm Stage 2 walk
// - 변환 결과 PA에 대해 GPC 자동 수행
// - 위반 시 DMA abort 발생`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm의 DMA 버퍼 할당</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm Guest가 DMA 버퍼 필요
// → Unprotected IPA로 할당

// arch/arm64/mm/mem_encrypt.c (CCA Guest)

int set_memory_decrypted(unsigned long addr, int numpages) {
    for (i = 0; i < numpages; i++) {
        gfn = __pa(addr + i * PAGE_SIZE) >> PAGE_SHIFT;

        /* 1) Guest 페이지 테이블 수정: top bit 설정 */
        protected_ipa   = gfn << PAGE_SHIFT;
        unprotected_ipa = protected_ipa |
                          (1UL << (realm_ipa_bits - 1));

        /* 2) 현재 매핑 해제 (protected) */
        rsi_ipa_state_set(protected_ipa, protected_ipa + PAGE_SIZE,
                           RIPAS_EMPTY);

        /* 3) Host에 매핑 요청 (HOST_CALL) */
        rsi_host_call(HOST_CALL_SHARE_MEMORY,
                       gfn, unprotected_ipa, PAGE_SIZE);

        /* 4) 4K 버퍼 zero (정보 유출 방지) */
        memset(virt_of(unprotected_ipa), 0, PAGE_SIZE);
    }
    return 0;
}

// swiotlb(bounce buffer)가 이를 자동화
// - DMA API가 swiotlb 통과
// - Guest 드라이버는 변경 불필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Secure NIC·GPU 트렌드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Confidential PCIe / CXL로 확장 중

// 1) PCIe TDISP (Trusted Device Interface Security Protocol)
// - TEE와 device 간 상호 인증
// - Device가 Realm의 일부로 편입
// - 2024 PCIe 6.0 spec

// 2) IDE (Integrity and Data Encryption)
// - PCIe 링크 암호화 (AES-GCM)
// - device ↔ CPU 간 기밀성

// 3) CXL 3.1 confidential compute
// - 메모리 풀링 + 기밀성
// - CXL.mem과 TEE 연동

// ARM CCA + TDISP 통합 시나리오
// - 특정 NIC을 Realm에 할당
// - Realm이 직접 DMA (bounce 없이)
// - NIC firmware도 측정 포함

// 현재 상태
// - 2024 아직 초기 단계
// - Nvidia H100: Hopper Confidential Computing
// - Arm+Nvidia 협업 진행`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Confidential Containers 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Kata Containers + CCA
// https://github.com/confidential-containers/kata-containers

// 전체 스택
┌────────────────────────────────────┐
│  Kubernetes Pod (user)             │
├────────────────────────────────────┤
│  Kata Agent (inside Realm)         │
├────────────────────────────────────┤
│  Realm Guest (Linux 6.x + CCA)     │
├────────────────────────────────────┤
│  RMM (TF-RMM)                      │
├────────────────────────────────────┤
│  Host Hypervisor (cloud-hypervisor)│
├────────────────────────────────────┤
│  Host Kernel + KVM-CCA             │
└────────────────────────────────────┘

// 증명 연동
// 1) Attestation agent가 CCA token 요청
// 2) KBS(Key Broker Service)가 검증
// 3) Container 이미지 복호화 키 전달
// 4) Pod 실행 시작

// 핵심 차이 (TDX 기반 CoCo와)
// - 같은 KBS 재사용 가능 (EAT 포맷 호환)
// - RMM이 Linux 커널보다 작음 → TCB 절감
// - 모바일·엣지로 확장 가능`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCA의 도입 현황 (2024~2025)</p>
          <p>
            <strong>실리콘 레벨</strong>:<br />
            - Arm Neoverse V3 (Grace, Axion 등) — RMEv1 지원<br />
            - Cortex-X925 클라이언트 칩 — 모바일 CCA 출발<br />
            - AWS Graviton 4 (2024) — CCA 포함
          </p>
          <p className="mt-2">
            <strong>소프트웨어 생태계</strong>:<br />
            - TF-RMM 1.0 릴리스 (2024)<br />
            - Linux 6.5+ KVM-CCA 패치 머지 진행 중<br />
            - Veraison 공식 Verifier
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            - 메모리 암호화 플랫폼 의존 (MEC 도입 초기)<br />
            - Live Migration 표준화 미흡<br />
            - TDISP/PCIe 보안 연동 미완
          </p>
          <p className="mt-2">
            <strong>비교</strong>:<br />
            - TDX/SEV-SNP는 이미 프로덕션 (Azure, GCP)<br />
            - CCA는 2025~2026 본격 프로덕션 예상<br />
            - 장기적으로 엣지·모바일 기밀 컴퓨팅 주도 가능
          </p>
        </div>

      </div>
    </section>
  );
}
