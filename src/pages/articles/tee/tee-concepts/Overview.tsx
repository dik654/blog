import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 TEE가 필요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">클라우드의 근본적 신뢰 문제</h3>
        <p>
          <strong>전통 클라우드 모델</strong>: 사용자가 클라우드 사업자를 <strong>전적으로 신뢰</strong>해야 함<br />
          Host OS, Hypervisor, 클라우드 관리자 모두가 VM 메모리 접근 가능<br />
          민감 데이터(금융, 의료, 개인정보) 처리 시 <strong>규제·계약 의존</strong><br />
          <strong>근본 질문</strong>: 사업자를 신뢰할 수 없다면?
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE란 무엇인가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TEE = Trusted Execution Environment
// 정의: CPU 하드웨어가 강제하는 격리된 실행 환경

// 3대 속성
// 1) Confidentiality (기밀성)
//    - TEE 내부 메모리가 암호화됨
//    - 외부(Host, HV)는 암호문만 관측
//
// 2) Integrity (무결성)
//    - TEE 코드·데이터 변조 탐지
//    - 공격 시도 시 실행 중단
//
// 3) Attestation (증명)
//    - TEE가 "나 이 코드 실행 중" 원격 증명
//    - 원격 당사자가 암호학적 검증 가능

// 4번째 필수 속성 (implicit)
// 4) Tamper resistance
//    - 물리 공격 방어 (제한적)
//    - Cold boot, DRAM probe 등

// TEE vs 일반 VM
//                  일반 VM      TEE
// 메모리 암호화      X            O
// Host 메모리 접근    O            X
// Hypervisor 신뢰    O            X
// 원격 증명          X            O
// CPU TCB 포함       X            O`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 기술 스펙트럼</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">벤더</th>
                <th className="border border-border px-3 py-2 text-left">격리 단위</th>
                <th className="border border-border px-3 py-2 text-left">도입</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel SGX</strong></td>
                <td className="border border-border px-3 py-2">Intel</td>
                <td className="border border-border px-3 py-2">Enclave (앱 내부)</td>
                <td className="border border-border px-3 py-2">2015 (Skylake)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM TrustZone</strong></td>
                <td className="border border-border px-3 py-2">ARM</td>
                <td className="border border-border px-3 py-2">Secure World</td>
                <td className="border border-border px-3 py-2">2003</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>AMD SEV</strong></td>
                <td className="border border-border px-3 py-2">AMD</td>
                <td className="border border-border px-3 py-2">VM</td>
                <td className="border border-border px-3 py-2">2016 (EPYC Naples)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel TDX</strong></td>
                <td className="border border-border px-3 py-2">Intel</td>
                <td className="border border-border px-3 py-2">VM (TD)</td>
                <td className="border border-border px-3 py-2">2022 (SPR)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM CCA</strong></td>
                <td className="border border-border px-3 py-2">ARM</td>
                <td className="border border-border px-3 py-2">Realm (VM)</td>
                <td className="border border-border px-3 py-2">2024 (Neoverse V3)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">IBM PEF</td>
                <td className="border border-border px-3 py-2">IBM</td>
                <td className="border border-border px-3 py-2">Secure VM</td>
                <td className="border border-border px-3 py-2">2020 (Power10)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">NVIDIA H100 CC</td>
                <td className="border border-border px-3 py-2">NVIDIA</td>
                <td className="border border-border px-3 py-2">GPU context</td>
                <td className="border border-border px-3 py-2">2022 (Hopper)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 사용 사례</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1. Confidential Computing (가장 널리 사용)
//    - 클라우드 VM 내부 기밀 유지
//    - 의료·금융 데이터 처리
//    - Multi-party computation
//    - Examples: Azure Confidential VMs, AWS Nitro

// 2. 블록체인·Web3
//    - 기밀 스마트 컨트랙트 (Oasis, Secret)
//    - Off-chain computation (Phala)
//    - Private voting, sealed-bid auctions
//    - MEV 보호

// 3. DRM (Digital Rights Management)
//    - Netflix Widevine L1 (TrustZone)
//    - Apple FairPlay (Secure Enclave)
//    - 모바일 미디어 재생

// 4. Key Management
//    - Hardware-backed keystore
//    - Digital signatures (code signing)
//    - Certificate authority
//    - Apple Secure Enclave, Google Titan

// 5. Biometric authentication
//    - Fingerprint, Face ID 처리
//    - TrustZone Trusted Apps
//    - Apple Secure Enclave Processor

// 6. Federated Learning
//    - 프라이버시 보존 ML 훈련
//    - 개별 데이터 공개 없이 모델 학습
//    - Intel SGX + homomorphic`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE vs 대안 기술</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TEE vs Homomorphic Encryption (FHE)
//   TEE: 빠름 (native 성능의 90%+), HW 신뢰 필요
//   FHE: 매우 느림 (10^4~10^6x), 수학적 보안만
//   → 대부분 사용 사례는 TEE 현실적

// TEE vs Multi-Party Computation (MPC)
//   TEE: 단일 CPU, 하드웨어 TCB
//   MPC: 여러 node 분산, 암호학 기반
//   → TEE가 레이턴시 낮음
//   → MPC는 collusion-resistant

// TEE vs Zero-Knowledge Proof (ZKP)
//   TEE: confidential execution
//   ZKP: correctness 증명, input 공개 안 함
//   → 보완적 관계 (TEE + ZKP 하이브리드 증가)

// TEE + 다른 기술 조합
// - TEE + HE: SGX 안에서 HE 연산 → 성능 10x
// - TEE + MPC: 각 MPC 노드가 TEE → threshold 완화
// - TEE + ZK: TEE 측정값 + ZK proof → 검증 단순화`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TEE 신뢰 패러독스</p>
          <p>
            <strong>TEE의 역설</strong>:<br />
            - "클라우드 사업자 불신" 때문에 TEE 사용<br />
            - 하지만 TEE = "CPU 벤더(Intel/AMD/ARM) 신뢰"<br />
            - 신뢰 대상만 바뀜, 신뢰 자체는 여전
          </p>
          <p className="mt-2">
            <strong>왜 트레이드오프 수용</strong>:<br />
            1. CPU 벤더 TCB가 더 작음 (특화 기능)<br />
            2. Attestation으로 검증 가능<br />
            3. 공격 표면 축소 (커널·하이퍼바이저 제거)<br />
            4. 전 세계적 규제·표준 준수
          </p>
          <p className="mt-2">
            <strong>근본 한계</strong>:<br />
            - CPU 벤더가 백도어 심으면 탐지 불가<br />
            - Firmware 업데이트가 TCB의 약점<br />
            - 사이드채널 공격 지속적 발견<br />
            - "완벽 보안" 달성 불가 → defense in depth
          </p>
        </div>

      </div>
    </section>
  );
}
