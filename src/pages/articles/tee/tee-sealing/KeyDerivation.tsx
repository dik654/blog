import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import KeyDerivViz from './viz/KeyDerivViz';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function KeyDerivation({ onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seal Key 파생 (EGETKEY)</h2>
      <div className="not-prose mb-8"><KeyDerivViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Root Seal Key</h3>
        <p>
          모든 SGX CPU에 제조 시 <strong>퓨즈(e-fuse)</strong>에 주입된 <strong>Root Seal Key</strong><br />
          소프트웨어로 직접 읽기 불가 — EGETKEY 명령어로만 <strong>파생</strong> 가능<br />
          <strong>Per-CPU 고유</strong> — 각 칩마다 다른 값<br />
          <strong>Tamper-resistant</strong> — 물리 공격 없이는 추출 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EGETKEY 명령어 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX EGETKEY 명령 (RING 3, enclave 내부에서만)

// 호출 규약
// RAX = 1 (EGETKEY leaf)
// RBX = KEYREQUEST 구조체 주소
// RCX = output key 주소 (16 bytes)

// KEYREQUEST 구조체
struct sgx_key_request {
    u16 keyname;       // 어떤 키 원하는지
    u16 keypolicy;     // MRENCLAVE / MRSIGNER 정책
    u16 isvsvn;        // 요청자 SVN 하한
    u16 reserved1;
    u8  cpusvn[16];    // CPU SVN 값
    u64 attributemask[2];  // 어떤 ATTRIBUTES 비트 사용
    u8  keyid[32];     // Fresh nonce (재파생 방지)
    u64 miscmask;
    u8  reserved2[436];
};

// Key names (sgx_arch.h)
#define SGX_KEYSELECT_EINITTOKEN  0x0000
#define SGX_KEYSELECT_PROVISION   0x0001
#define SGX_KEYSELECT_PROVISION_SEAL  0x0002
#define SGX_KEYSELECT_REPORT      0x0003
#define SGX_KEYSELECT_SEAL        0x0004  ← Sealing key
`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Seal Key 파생 공식</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX hardware가 내부에서 수행
//
// SealKey = AES-CMAC(RootKey, derivation_input)
//
// derivation_input =
//   keyname ||                    // "SEAL"
//   isvprodid ||                  // ISV product ID
//   isvsvn ||                     // SVN
//   ownerepoch ||                 // 16 bytes, 오너 고정
//   attributes & attributemask || // enclave 속성
//   miscselect & miscmask ||
//   conditional_measurement ||    // MRENCLAVE or MRSIGNER
//   configid ||
//   configsvn ||
//   cetattributes ||
//   keyid                         // 32 bytes, KEYREQUEST에서

// Conditional_measurement 결정
// if (keypolicy == MRENCLAVE)
//     conditional_measurement = current_enclave.MRENCLAVE
// else if (keypolicy == MRSIGNER)
//     conditional_measurement = current_enclave.MRSIGNER
// else (combined)
//     conditional_measurement = hash(both)

// 결과
// 같은 CPU + 같은 코드 + 같은 정책 → 결정적 (항상 같은 키)
// 다른 어느 것이라도 바뀌면 → 완전히 다른 키`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Key Derivation Tree</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX가 관리하는 키 계층

// Root Layer (하드웨어 고정)
// ┌─────────────────────────────────┐
// │  ROOT_PROVISION_KEY             │  ← e-fuse (Intel 서명)
// │  ROOT_SEAL_KEY                  │  ← e-fuse (per-chip random)
// │  ROOT_OWNER_EPOCH               │  ← BIOS 설정 가능
// └─────────────────────────────────┘
//                 │
//                 │ KDF chain
//                 ▼
// ┌─────────────────────────────────┐
// │  Derived Keys (per enclave)     │
// │                                 │
// │  PROVISION_KEY                  │  provision enclave만
// │  PROVISION_SEAL_KEY             │  provision enclave sealing
// │  EINITTOKEN_KEY                 │  Launch Enclave 전용
// │  REPORT_KEY                     │  Local attestation
// │  SEAL_KEY  ←← 여기              │  앱 sealing
// └─────────────────────────────────┘

// 각 enclave는 자기 SEAL_KEY만 얻을 수 있음
// Provision Enclave는 특권 Intel 서명 필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">CPUSVN — TCB 버전 바인딩</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CPUSVN: CPU의 Security Version Number
// - 16 bytes vector
// - microcode, TCB 업데이트 시 증가
// - 과거 CPUSVN 값으로 키 파생 가능 (하한 설정)

// 시나리오
// 1) 시점 T1에 sealing: CPUSVN_T1 = 5
// 2) 시점 T2에 microcode 업데이트: CPUSVN_T2 = 6
// 3) 시점 T2에 unseal 시도

// KEYREQUEST.cpusvn 설정
struct sgx_key_request req = {
    .keyname = SGX_KEYSELECT_SEAL,
    .keypolicy = KEYPOLICY_MRENCLAVE,
    .cpusvn = {5, 0, 0, ...}  // T1의 CPUSVN
};

// EGETKEY가 파생: key_for_T1
// → 과거 CPUSVN으로 파생 가능 (downgrade)
// → T1에서 sealed 데이터 복호화 가능

// 정책 선택
// A) 현재 CPUSVN 사용 (req.cpusvn = current)
//    - TCB 업데이트 시 모든 sealed 데이터 재암호화 필요
//    - 가장 엄격
// B) Sealed에 CPUSVN 저장 + 언실 시 해당 값 사용
//    - 유연 (old data 복구 가능)
//    - 일반적 선택

// 보안 고려
// - TCB 패치 전 CPUSVN으로 파생 금지할 수도 있음
// - provisioning에서 정책 결정`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX SDK 사용법</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel SGX SDK (linux-sgx/sdk/tlibcrypto/)

#include "sgx_tseal.h"

// 간편 API (실제 EGETKEY는 내부에서)
sgx_status_t sgx_seal_data(
    uint32_t additional_MACtext_length,
    const uint8_t *p_additional_MACtext,
    uint32_t text2encrypt_length,
    const uint8_t *p_text2encrypt,
    uint32_t sealed_data_size,
    sgx_sealed_data_t *p_sealed_data
);

sgx_status_t sgx_unseal_data(
    const sgx_sealed_data_t *p_sealed_data,
    uint8_t *p_additional_MACtext,
    uint32_t *p_additional_MACtext_length,
    uint8_t *p_decrypted_text,
    uint32_t *p_decrypted_text_length
);

// 저수준 API
sgx_status_t sgx_get_key(
    const sgx_key_request_t *p_key_request,
    sgx_key_128bit_t *p_key
);

// 사용 예
sgx_key_request_t req = {
    .key_name = SGX_KEYSELECT_SEAL,
    .key_policy = SGX_KEYPOLICY_MRSIGNER,  // 같은 서명자 enclave 간 호환
    .isv_svn = 1,
    .cpu_svn = { /* 현재 CPUSVN */ },
    .attribute_mask = { FLAGS_MASK, XFRM_MASK },
};

sgx_key_128bit_t seal_key;
sgx_get_key(&req, &seal_key);

// seal_key를 AES-GCM 키로 사용`}</pre>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('seal-key-derivation', codeRefs['seal-key-derivation'])} />
          <span className="text-[10px] text-muted-foreground self-center">EGETKEY + Key Derivation Tree</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Root Key의 위협 모델</p>
          <p>
            <strong>Intel이 Root Key를 모르는가?</strong><br />
            - 공식 주장: per-chip random, factory 때만 alive<br />
            - 현실: Intel이 "generating entity"이므로 이론적으로 알 수 있음<br />
            - 전문가 의견: backup이 존재할 가능성 (상용화 요구)
          </p>
          <p className="mt-2">
            <strong>신뢰 가정</strong>:<br />
            - Intel이 Root Key 누출 시 대형 보안 사고<br />
            - 따라서 Intel은 극도로 보호 (HSM, offline 보관)<br />
            - 하지만 "zero trust in Intel"은 불가능<br />
            - 이것이 DICE(Device Identifier Composition Engine) 등 대안 연구 동기
          </p>
          <p className="mt-2">
            <strong>대안 접근</strong>:<br />
            - Multi-party computation으로 root key 생성 (Intel + OEM)<br />
            - Formal Key Attestation (AMD VCEK와 유사)<br />
            - 현재는 Intel "trusted by design"
          </p>
        </div>

      </div>
    </section>
  );
}
