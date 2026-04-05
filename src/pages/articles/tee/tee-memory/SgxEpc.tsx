import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import EpcViz from './viz/EpcViz';
import { codeRefs } from './codeRefs';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SgxEpc({ onCodeRef }: Props) {
  return (
    <section id="sgx-epc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SGX EPC: Enclave Page Cache</h2>
      <div className="not-prose mb-8"><EpcViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('sgx-epc', codeRefs['sgx-epc'])} />
          <span className="text-[10px] text-muted-foreground self-center">EADD + ELDU</span>
        </div>
        <p>
          BIOS가 물리 메모리 일부를 <strong>PRM(Processor Reserved Memory)</strong>으로 예약합니다.
          <br />
          OS/하이퍼바이저도 PRM 영역에 직접 접근할 수 없습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">EPC 구조</h3>
        <p>
          EPC(Enclave Page Cache)는 PRM 내부의 <strong>4KB 페이지 풀</strong>입니다.
          <br />
          각 페이지마다 EPCM(Enclave Page Cache Map) 엔트리가 존재합니다.
          <br />
          EPCM은 소유 enclave SECS, 페이지 타입(REG/TCS), RWX 권한을 기록합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">EADD → EPCM 등록</h3>
        <p>
          EADD 명령어가 PAGEINFO 구조체를 받아 EPC에 페이지를 추가합니다.
          <br />
          CPU가 EPCM 엔트리를 생성하고, MEE(Memory Encryption Engine)가 암호화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">EPC 페이징: EWBLOCK → ELDU</h3>
        <p>
          EPC 용량(보통 128~256MB)이 부족하면 OS가 페이지를 퇴거합니다.
          <br />
          EWBLOCK: 페이지 암호화 + MAC 생성 → 일반 메모리로 이동.
          <br />
          ELDU: 일반 메모리에서 복호화 + MAC 검증 → EPC 복원.
          <br />
          MAC 불일치 시 #GP 예외 — 변조 감지 보장.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">EPC 페이지 유형</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EPC Page Types (EPCM의 PT 필드)
//
// PT_SECS (0): SGX Enclave Control Structure
//   - Enclave 메타데이터
//   - Measurement (MRENCLAVE, MRSIGNER)
//   - Attributes, ISVPRODID, ISVSVN
//   - Enclave당 1개
//
// PT_REG (1): Regular Page
//   - 일반 코드/데이터 페이지
//   - RWX 권한 설정 가능
//   - 대부분의 enclave 메모리
//
// PT_TCS (2): Thread Control Structure
//   - Enclave 진입점
//   - 스레드별 1개
//   - EENTER로 접근
//
// PT_VA (3): Version Array
//   - 페이징 시 nonce 저장
//   - Anti-replay 보호
//
// PT_TRIM (4, SGX2): 트림된 페이지
// PT_SS_FIRST (5, SGX2): State save area
// PT_SS_REST (6, SGX2): State save area (rest)

// EPCM 엔트리 구조 (8 bytes):
//   VALID       : 페이지가 유효한가
//   R/W/X       : 권한 비트
//   PT          : 페이지 타입
//   ENCLAVE_SECS: 소유 enclave (PA)
//   ADDRESS     : 가상 주소 매핑
//   BLOCKED     : 퇴거 준비 중인가
//   PENDING     : SGX2 동적 페이지

// SGX Instructions 요약:
//   ECREATE: SECS 생성 → enclave 초기화
//   EADD:    REG/TCS 페이지 추가
//   EEXTEND: measurement 업데이트
//   EINIT:   enclave 완성 + measurement 확정
//   EENTER:  enclave 진입 (TCS 경유)
//   EEXIT:   enclave 종료
//   EWBLOCK: 페이지 퇴거 준비
//   ELDU:    페이지 복원
//   ERDINFO: 페이지 정보 조회
//   EMODPR:  권한 수정 (SGX2)
//   EMODT:   타입 변경 (SGX2)`}
        </pre>
      </div>
    </section>
  );
}
