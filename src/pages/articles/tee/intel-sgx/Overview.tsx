import ContextViz from './viz/ContextViz';
import SGXArchViz from './viz/SGXArchViz';
import RepoStructViz from './viz/RepoStructViz';
import CoreConceptsViz from './viz/CoreConceptsViz';
import EPCMemoryViz from './viz/EPCMemoryViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8">
        <SGXArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Intel SGX(Software Guard Extensions)는 CPU 하드웨어 수준에서{' '}
          <strong>Enclave</strong>(격리된 실행 환경)를 제공합니다.<br />
          Enclave 메모리는 암호화된 EPC(Enclave Page Cache)에 저장됩니다.<br />
          OS, 하이퍼바이저, BIOS도 내용을 읽을 수 없습니다.
        </p>

        <h3>소프트웨어 스택</h3>
      </div>
      <div className="not-prose mb-6">
        <RepoStructViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>핵심 개념</h3>
      </div>
      <div className="not-prose mb-6">
        <CoreConceptsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>EPC 메모리 모델</h3>
      </div>
      <div className="not-prose mb-6">
        <EPCMemoryViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SGX 주요 명령어 정리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SGX 명령어 카테고리 (18개 신규 x86 명령어)
//
// Privileged (ring 0, OS/VMM 용):
//   ECREATE    - Enclave 생성 (SECS 초기화)
//   EADD       - EPC 페이지 추가
//   EEXTEND    - Measurement 업데이트
//   EINIT      - Enclave 초기화 완료
//   EREMOVE    - EPC 페이지 삭제
//   EWBLOCK    - 페이지 퇴거 준비
//   EPAGE      - 페이지 상태 수정
//   ELDU/ELDB  - EPC 페이지 복원
//   ETRACK     - TLB tracking
//   EDBGWR/RD  - Debug I/O (debug mode만)
//   EBLOCK     - Block EPC page
//   EPA        - Version Array 페이지 생성
//
// Unprivileged (ring 3, enclave 내부 용):
//   EENTER     - Enclave 진입
//   ERESUME    - AEX 후 재진입
//   EEXIT      - Enclave 종료
//   EGETKEY    - 하드웨어 키 파생
//   EREPORT    - Local attestation report 생성
//   EACCEPT    - 페이지 허용 (SGX2)
//   EACCEPTCOPY - 페이지 복사 (SGX2)
//   EMODPE     - 페이지 권한 확장 (SGX2)

// SGX1 vs SGX2:
//   SGX1: 정적 enclave (초기화 후 변경 불가)
//   SGX2: 동적 메모리 관리 가능
//     - Dynamic memory growth
//     - Runtime permission change
//     - Thread management

// 커널 지원:
//   Linux: in-tree since 5.11 (2021)
//   Windows: Win10 SDK 이후
//   Kubernetes: Confidential Containers`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SGX 생태계와 SDK</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SGX 개발 생태계
//
// SDK/Runtime:
//   1. Intel SGX SDK (공식, C/C++)
//      - Trusted Runtime Environment (tRTS)
//      - Untrusted Runtime (uRTS)
//      - Standard C++ library (sgxtlibc)
//      - Edger8r code generator
//
//   2. Open Enclave SDK (Microsoft)
//      - Cross-platform (SGX + OP-TEE)
//      - Simpler API
//      - C/C++
//
//   3. Teaclave SGX SDK (Rust)
//      - Rust bindings
//      - Memory safety
//
//   4. Fortanix EDP
//      - Rust-native
//      - Enclave Development Platform
//
//   5. MesaTEE / Gramine
//      - Library OS approach
//      - Unmodified binaries 실행
//
// Attestation Services:
//   - IAS (Intel Attestation Service): EPID-based
//   - DCAP (Data Center Attestation Primitives): ECDSA
//   - Azure Attestation Service
//
// 사용 사례:
//   - Confidential Computing Consortium
//   - Signal Contact Discovery
//   - Blockchain (Secret Network, Oasis)
//   - ML model protection
//   - DRM, key management
//   - Private databases (EdgelessDB)`}
        </pre>
      </div>
    </section>
  );
}
