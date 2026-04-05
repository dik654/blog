import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function TdxMktme({ onCodeRef }: Props) {
  return (
    <section id="tdx-mktme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDX MKTME: VM별 키 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('mktme-key', codeRefs['mktme-key'])} />
          <span className="text-[10px] text-muted-foreground self-center">MKTME Key Config</span>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">TME → MKTME 진화</h3>
        <p>
          <strong>TME(Total Memory Encryption)</strong>는 모든 메모리를 하나의 키로 암호화합니다.
          <br />
          부팅 시 CPU가 랜덤 키를 생성 — 소프트웨어에 노출되지 않습니다.
          <br />
          단점: 모든 VM이 같은 키를 공유하여 VM 간 격리가 불가합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MKTME: Multi-Key 확장</h3>
        <p>
          MKTME는 최대 N개의 <strong>KeyID</strong>를 할당할 수 있습니다.
          <br />
          TD별로 고유 KeyID를 배정하고, 각 KeyID에 AES-XTS-256 키를 매핑합니다.
          <br />
          메모리 컨트롤러가 물리 주소 상위 비트의 KeyID로 키를 선택합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">TD Module(SEAM)의 역할</h3>
        <p>
          SEAM(Secure Arbitration Mode)은 CPU 마이크로코드 수준의 모듈입니다.
          <br />
          KeyID 할당과 키 생성을 SEAMCALL로만 수행합니다.
          <br />
          <strong>하이퍼바이저(VMM)도 키에 접근할 수 없습니다.</strong>
          <br />
          TD 진입 시 SEAM이 KeyID를 전환 — 자동으로 해당 TD의 키로 암복호화됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">SEV와의 비교</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">AMD SEV</h4>
            <ul className="space-y-1 text-sm">
              <li>- 키 관리: PSP(외부 보안 프로세서)</li>
              <li>- 암호화: AES-128-XEX</li>
              <li>- 키 격리: ASID 기반</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Intel TDX</h4>
            <ul className="space-y-1 text-sm">
              <li>- 키 관리: SEAM(CPU 마이크로코드)</li>
              <li>- 암호화: AES-XTS-256</li>
              <li>- 키 격리: MKTME KeyID 기반</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">MKTME 상세 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MKTME Physical Address Layout
//
// Before MKTME (48-bit PA):
//   [PA 47:0]
//
// After MKTME (48-bit PA):
//   [KeyID bits | Original PA bits]
//     ↑             ↑
//   상위 N bits    나머지
//
// 예시 (4-bit KeyID):
//   PA = 0x7000_0000_1000
//        ↑
//      KeyID = 7
//      Real PA = 0x000_0000_1000
//
// KeyID 0 = TME (또는 평문)
// KeyID 1~15 = TDX 용도 또는 일반 암호화

// TDX TD 생성 흐름:
//   1. TDH_MNG_CREATE (VMM 호출)
//      → SEAM이 새 KeyID 할당
//      → Random AES-XTS-256 key 생성
//
//   2. TDH_MNG_ADDCX (per page)
//      → TD 페이지 추가
//      → SEAM이 MKTME에 키 config
//      → TD measurement (MRTD) 업데이트
//
//   3. TDH_MNG_INIT
//      → TD initialization 완료
//      → MRTD 확정
//
//   4. TDH_VP_ENTER (VM 진입)
//      → TD VCPU 실행
//      → CPU가 자동으로 KeyID 전환
//
// 보안 보장:
//   - KeyID는 SEAM만 할당
//   - Key 생성 RNG: 하드웨어
//   - VMM도 key 조회 불가
//   - TD ↔ Host 간 메모리 공유 명시적 (shared bit)

// Guest Physical Address Bit:
//   - GPAW (Guest PA Width): 48/52 bit
//   - Shared bit: 공유 페이지 표시
//   - Private pages: MKTME 암호화
//   - Shared pages: 평문 (I/O용)`}
        </pre>
      </div>
    </section>
  );
}
