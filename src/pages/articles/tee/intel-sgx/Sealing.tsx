import SealingViz from './viz/SealingViz';
import EGETKEYFlowViz from './viz/EGETKEYFlowViz';
import SealFlowViz from './viz/SealFlowViz';
import PolicyCompareViz from './viz/PolicyCompareViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Sealing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 봉인 (EGETKEY + AES-GCM)</h2>
      <div className="not-prose mb-8">
        <SealingViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGX의 <strong>데이터 봉인(Sealing)</strong>은 EGETKEY 하드웨어 명령어로
          CPU 바운드 키를 파생합니다.<br />
          이 키로 AES-256-GCM 암호화를 수행합니다.<br />
          재부팅 후에도 동일한 키가 파생되므로 디스크에 안전하게 저장할 수 있습니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('key-request', codeRefs['key-request'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_key_request_t</span>
          <CodeViewButton onClick={() => onCodeRef('sealed-data', codeRefs['sealed-data'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_sealed_data_t</span>
          <CodeViewButton onClick={() => onCodeRef('report-body', codeRefs['report-body'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_report_body_t</span>
        </div>

        <h3>EGETKEY — CPU 바운드 키 파생</h3>
      </div>
      <div className="not-prose mb-6">
        <EGETKEYFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>sgx_seal_data — AES-GCM 봉인 흐름</h3>
      </div>
      <div className="not-prose mb-6">
        <SealFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>MRENCLAVE vs MRSIGNER 봉인 정책</h3>
      </div>
      <div className="not-prose mb-6">
        <PolicyCompareViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Sealing 작동 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SGX Sealing 전체 흐름
//
// Sealing (데이터 저장):
//
// 1. EGETKEY로 sealing key 파생:
//    key = HMAC-SHA256(
//        Root_Seal_Key,
//        KEY_POLICY ||
//        MRENCLAVE/MRSIGNER ||
//        ISVPRODID ||
//        ISVSVN ||
//        KEYID (random nonce)
//    )
//
//    Root_Seal_Key: CPU 고유, fuse-burned
//    KEY_POLICY: MRENCLAVE / MRSIGNER 선택
//
// 2. AES-GCM 암호화:
//    iv = random 12 bytes
//    ciphertext, tag = AES_GCM_Encrypt(key, iv, plaintext)
//
// 3. Seal blob 구성:
//    [KEYID | MRSIGNER policy | iv | ciphertext | tag]
//
// 4. 디스크에 저장

// Unsealing (데이터 복원):
//
// 1. Seal blob 읽기
// 2. KEYID 추출
// 3. EGETKEY로 같은 키 재파생
// 4. AES-GCM 복호화 + 검증

// Sealing Policy:
//
// MRENCLAVE 정책:
//   - 정확히 같은 enclave만 복원 가능
//   - 업데이트하면 키 달라짐 (데이터 유실)
//   - 최고 보안
//
// MRSIGNER 정책:
//   - 같은 서명자의 enclave면 복원 가능
//   - 버전 업데이트 가능 (ISVSVN 이상만)
//   - 실무에서 더 유연
//
// CPU-specific Sealing:
//   - Seal Key는 CPU fuse 기반
//   - 다른 CPU에서는 복원 불가
//   - 머신 이동 시 데이터 유실
//   → KMS/vault로 백업 필요

// 활용 사례:
//   - 데이터베이스 암호화 키
//   - 세션 토큰
//   - 사용자 자격 증명
//   - ML 모델 가중치
//   - 블록체인 지갑 키`}
        </pre>
      </div>
    </section>
  );
}
