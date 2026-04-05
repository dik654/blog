import ContextViz from './viz/ContextViz';
import TrustZoneViz from './viz/TrustZoneViz';
import RepoStructViz from './viz/RepoStructViz';
import TrustZoneModelViz from './viz/TrustZoneModelViz';
import EntryAsmViz from './viz/EntryAsmViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & TrustZone 두 세계'}</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8">
        <TrustZoneViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">OP-TEE 개요</h3>
        <p>
          <strong>OP-TEE</strong>(Open Portable TEE): ARM TrustZone 위 오픈소스 TEE OS<br />
          <strong>Linaro 주도</strong>: 2014년 ST-Ericsson에서 오픈소스화, Linaro가 유지보수<br />
          <strong>GlobalPlatform TEE 스펙 구현</strong>: Trusted Application API 표준 준수<br />
          <strong>2-world 모델</strong>: Normal World(Linux) ↔ Secure World(OP-TEE OS)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustZone의 근본 원리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TrustZone = ARM CPU 하드웨어 격리
// 2003년 ARMv6에 도입, 모든 현대 ARM CPU 지원

// NS(Non-Secure) bit — AXI 버스 신호 1비트
// CPU가 실행 중 NS 상태를 bus transaction에 전파
// 메모리·주변장치가 NS 값 기반으로 접근 제어

// NS=0 → Secure World
//   - Secure memory 접근 가능
//   - Secure peripherals 접근 가능
//   - 모든 일반 메모리도 접근 가능 (superset)

// NS=1 → Normal World
//   - 일반 memory만 접근
//   - 일반 peripherals만
//   - Secure memory 접근 시 bus fault

// World 전환 메커니즘
//                  EL3 (Monitor Mode)
//                   │
//                   │ SMC (Secure Monitor Call)
//                   │
//     ┌─────────────┴─────────────┐
//     │                           │
//  Normal World              Secure World
//  (EL2/EL1/EL0)             (S-EL1/S-EL0)
//     │                           │
//  Linux Kernel            OP-TEE OS
//  Apps/Services           Trusted Apps`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">소프트웨어 스택 (optee_os 레포 구조)</h3>
      </div>
      <div className="not-prose mb-6"><RepoStructViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// optee_os 주요 디렉토리

optee_os/
├── core/           # OP-TEE OS 커널
│   ├── arch/arm/   # ARM-specific 코드
│   ├── kernel/     # Thread, interrupt, syscall
│   ├── mm/         # Memory management (MMU, secure DDR)
│   ├── tee/        # TEE core services
│   └── crypto/     # Crypto provider (mbedTLS/libtomcrypt)
│
├── lib/
│   ├── libutee/    # Trusted App용 libc subset
│   ├── libutils/   # 유틸리티
│   └── libmbedtls/ # Crypto backend
│
├── ta/              # 샘플 Trusted Apps
│   ├── aes/         # AES encrypt/decrypt
│   ├── hello_world/ # Tutorial TA
│   └── secure_storage/
│
└── scripts/         # Build scripts

// 연관 레포
// - optee_client: Normal world client library (libteec)
// - optee_test: 테스트 suite (xtest)
// - optee_examples: 샘플 앱
// - build: Yocto/Linaro 빌드 환경`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustZone 격리 모델</h3>
      </div>
      <div className="not-prose mb-6"><TrustZoneModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 요구사항</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// OP-TEE 실행 필수 하드웨어

// CPU
// - ARM Cortex-A (v7A or v8A)
//   ✓ Cortex-A7, A9, A15, A53, A72, A76, ...
// - TrustZone 지원 (거의 모든 Cortex-A)
// - ARM Cortex-M55 (TrustZone for Cortex-M)

// TZASC (TrustZone Address Space Controller)
// - 메모리 영역을 Secure/Non-secure로 지정
// - BIOS/Bootloader가 초기 설정

// TZPC (TrustZone Protection Controller)
// - 주변장치 접근 권한
// - UART, I2C, SPI 등

// OTP/eFuse
// - HUK (Hardware Unique Key)
// - 칩마다 고유 값 (Intel SGX Root Key와 유사)

// 지원 플랫폼 (일부)
// - NXP i.MX 6/7/8 시리즈
// - Rockchip RK3399, RK3566
// - Qualcomm Snapdragon (일부)
// - Raspberry Pi 3/4 (개발용)
// - HiKey 960/970
// - QEMU v8 virtual (테스트용)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">entry_a64.S — AArch64 보안 세계 진입 (실제 코드)</h3>
      </div>
      <div className="not-prose mb-6"><EntryAsmViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 사용 사례</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// OP-TEE 실전 사용 (모바일·IoT·Embedded)

// 1. Mobile DRM
// - Widevine L1 (Android), FairPlay
// - Secure video decoding pipeline
// - Key provisioning

// 2. Biometric
// - Fingerprint matching
// - Face ID template 저장
// - Liveness detection

// 3. Mobile payments
// - Samsung Pay TA
// - Google Pay (TEE 옵션)
// - PCI DSS compliance

// 4. Boot Verification
// - Verified Boot (Android)
// - U-Boot에서 OP-TEE 검증
// - Chain of trust

// 5. Automotive
// - Car key management
// - V2X security
// - ECU authentication

// 6. IoT Gateway
// - Secure firmware update
// - Device identity
// - Bluetooth pairing keys

// Android 통합
// - Keymaster TA (android keystore)
// - Gatekeeper TA (PIN/password)
// - Trusty TA (Google custom)
// - Optee_client로 HAL 연결`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: OP-TEE vs SGX 철학 차이</p>
          <p>
            <strong>OP-TEE (TrustZone)</strong>:<br />
            - 모놀리식 보안 OS (TEE OS kernel)<br />
            - Secure world 전체 신뢰<br />
            - 작은 TCB (200K LoC + TA 코드)<br />
            - 모바일·임베디드 강점
          </p>
          <p className="mt-2">
            <strong>Intel SGX</strong>:<br />
            - Per-enclave 격리 (앱 내부 작은 영역)<br />
            - No OS inside enclave<br />
            - 매우 작은 TCB (SGX SDK runtime만)<br />
            - 서버·데이터센터 강점
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - 모바일/IoT + TEE OS 필요: OP-TEE<br />
            - 서버 + 작은 enclave: SGX<br />
            - VM 단위 격리: TDX/SEV/CCA<br />
            - 각각 다른 use case에 최적화
          </p>
        </div>

      </div>
    </section>
  );
}
