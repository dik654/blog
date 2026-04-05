import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function CodeMeasurement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="code-measurement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">코드: EINIT & LAUNCH_MEASURE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">SGX MRENCLAVE 계산 과정</h3>
        <p>
          Enclave 생성 시 CPU가 SHA-256 해시 체인을 단계별로 구성합니다<br />
          <strong>ECREATE</strong>(초기화) → <strong>EADD</strong>(페이지 추가) → <strong>EEXTEND</strong>(256B씩 해시 확장) → <strong>EINIT</strong>(최종 측정값 잠금)
        </p>
        <p>
          EEXTEND는 4KB 페이지를 256바이트씩 16회 나눠 해시에 포함합니다<br />
          코드 <strong>한 바이트</strong>만 변경되어도 MRENCLAVE 값이 완전히 달라집니다
        </p>
        <div className="flex gap-2 mt-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('mrenclave-measurement', codeRefs['mrenclave-measurement'])} />
          <span className="text-[10px] text-muted-foreground self-center">measurement.c — ECREATE · EADD · EEXTEND · EINIT 전체 흐름</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">AMD SEV LAUNCH_MEASURE</h3>
        <p>
          AMD SEV는 <strong>펌웨어(AMD SP)</strong>가 게스트 VM의 초기 메모리 해시를 계산합니다<br />
          호스트 OS는 측정 과정에 개입할 수 없어, 게스트 무결성을 보장합니다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">TPM PCR Extend</h3>
        <p>
          PCR 확장은 단방향 연산입니다 — 이전 값을 복원할 수 없습니다<br />
          부팅 체인의 각 단계가 PCR을 확장하면, 최종 PCR 값이 전체 부팅 경로를 요약합니다
        </p>
        <div className="flex gap-2 mt-2">
          <CodeViewButton onClick={() => onCodeRef('tpm-pcr-extend', codeRefs['tpm-pcr-extend'])} />
          <span className="text-[10px] text-muted-foreground self-center">measurement.c — TPM PCR extend 연산</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">SGX MRENCLAVE 상세 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MRENCLAVE 계산 pseudo-code
//
// init:
//   H = SHA256.init()
//
// ECREATE(SECS):
//   H.update("ECREATE\\0\\0\\0\\0\\0\\0\\0\\0"
//            + ssa_frame_size (4B)
//            + size (8B)
//            + reserved (44B))
//
// EADD(page_info, source_page):
//   H.update("EADD\\0\\0\\0\\0"
//            + offset (8B)
//            + secinfo.flags (8B)
//            + reserved (40B))
//   H.update(page_info.type_bits)  # REG=1, TCS=2, ...
//
// EEXTEND(source_page):
//   # 4KB 페이지를 256B씩 16번
//   for i in range(16):
//       H.update("EEXTEND\\0"
//                + offset + i*256 (8B)
//                + reserved (48B))
//       H.update(source_page[i*256:(i+1)*256])  # 256 bytes
//
// EINIT:
//   MRENCLAVE = H.finalize()
//   # 이후 measurement freeze
//
// 결과:
//   MRENCLAVE = 256-bit hash (SHA-256)
//   = Enclave 코드와 구조의 지문

// MRSIGNER:
//   SIGSTRUCT에 포함된 서명자 public key의 SHA-256
//   - Author identity
//   - Upgrade key로 사용 가능
//
// MRENCLAVE vs MRSIGNER:
//   MRENCLAVE: 정확한 코드 버전
//   MRSIGNER:  코드 서명자 (다양한 버전 가능)
//
// ISV Product ID & SVN:
//   ISVPRODID: 제품 식별자 (같은 서명자의 다른 제품)
//   ISVSVN:    Security version number
//   → 업데이트 정책에 사용

// Attestation 시 확인 항목:
//   1. MRENCLAVE (코드 정확성)
//   2. MRSIGNER (author)
//   3. ISVSVN (최소 버전)
//   4. Debug flag (production?)
//   5. Quoting Enclave signature
//   6. IAS/DCAP report signature`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SEV/TDX Measurement 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AMD SEV Launch Measurement
//
// Measurement Input:
//   MEASURE = HMAC(VEK,
//                   0x04  ||
//                   api_major || api_minor || build ||
//                   policy ||
//                   digest ||
//                   mnonce)
//
// digest = SHA-256 of all LAUNCH_UPDATE_DATA pages
// mnonce = measurement nonce (defense vs replay)
//
// → AMD Platform Security Processor (PSP) 계산
// → Guest 소유자가 검증

// Intel TDX MRTD (Measurement of TD)
//
// Extends 방식:
//   for each memory chunk added:
//       MRTD = SHA-384(MRTD || chunk_metadata || chunk_data)
//
// After TDH.MR.FINALIZE:
//   MRTD frozen, attestation 가능
//
// 추가 measurements:
//   RTMR[0-3]: Runtime measurements (like PCR)
//   - Events during TD execution
//   - Extended at runtime

// 공통점:
//   - SHA-256/384 해시 체인
//   - 하드웨어가 계산 (소프트웨어 개입 불가)
//   - Attestation report에 포함
//   - Replay attack 방어 (nonce)

// 차이점:
//   SGX: 4KB page × 256B chunks (fine-grained)
//   SEV: 전체 guest memory (coarser)
//   TDX: page + metadata (mid-grained)

// 활용:
//   - Remote attestation report
//   - Enclave/VM identity
//   - Policy enforcement
//   - Key sealing 기준`}
        </pre>
      </div>
    </section>
  );
}
