import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SevSme({ onCodeRef }: Props) {
  return (
    <section id="sev-sme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV SME: 페이지별 AES 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('sev-launch-update', codeRefs['sev-launch-update'])} />
          <span className="text-[10px] text-muted-foreground self-center">LAUNCH_UPDATE_DATA</span>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">SME: C-bit 메커니즘</h3>
        <p>
          <strong>C-bit(Encryption bit)</strong>는 물리 주소의 특정 비트입니다.
          <br />
          페이지 테이블에서 C-bit=1이면 해당 페이지를 암호화합니다.
          <br />
          OS가 페이지별로 암호화 여부를 선택할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">AES-128-XEX 엔진</h3>
        <p>
          메모리 컨트롤러에 <strong>AES-128-XEX</strong> 엔진이 내장되어 있습니다.
          <br />
          XEX 모드는 물리 주소를 tweak으로 사용합니다.
          <br />
          같은 데이터라도 다른 주소에 저장되면 다른 암호문이 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">SEV: VM별 키 격리</h3>
        <p>
          SEV(Secure Encrypted Virtualization)는 VM별로 다른 <strong>VEK(Volume Encryption Key)</strong>를 사용합니다.
          <br />
          PSP(Platform Security Processor)가 ASID(Address Space ID)로 VM을 구분합니다.
          <br />
          VM-A의 VEK로 암호화된 메모리를 VM-B가 읽으면 쓰레기 값만 보입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">SEV-SNP 무결성 보호</h3>
        <p>
          SEV-SNP는 <strong>RMP(Reverse Map Table)</strong>를 추가합니다.
          <br />
          하이퍼바이저가 게스트 메모리 매핑을 변조하면 #VC 예외가 발생합니다.
          <br />
          암호화(기밀성) + RMP(무결성) = 완전한 메모리 보호.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">SEV 진화 단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AMD SEV 세대별 비교
//
// ┌────────────┬──────┬────────┬────────┬──────────────┐
// │   기술     │ 연도 │ 기밀성 │ 무결성 │    특징      │
// ├────────────┼──────┼────────┼────────┼──────────────┤
// │ SME        │ 2016 │   ✓    │   ✗    │ 페이지별 C-bit│
// │ SEV        │ 2017 │   ✓    │   ✗    │ VM별 VEK     │
// │ SEV-ES     │ 2018 │   ✓    │   ✗    │ +레지스터 암호│
// │ SEV-SNP    │ 2020 │   ✓    │   ✓    │ +RMP          │
// └────────────┴──────┴────────┴────────┴──────────────┘
//
// SME (Secure Memory Encryption):
//   - 시스템 와이드 암호화
//   - C-bit로 페이지별 선택
//   - 싱글 키 (plataforma)
//
// SEV (Secure Encrypted Virtualization):
//   - VM마다 다른 키
//   - ASID로 키 분리
//   - 하이퍼바이저도 VM 메모리 못 봄
//
// SEV-ES (Encrypted State):
//   - CPU 레지스터 상태도 암호화
//   - VM exit 시 노출 방지
//   - VMSA (VM Save Area) 보호
//
// SEV-SNP (Secure Nested Paging):
//   - RMP로 메모리 매핑 검증
//   - Page remapping attack 방어
//   - Replay attack 방어
//   - Interrupt injection 방어
//   - 가장 강력한 보호

// RMP (Reverse Map Table):
//   각 시스템 물리 페이지마다 1개 엔트리
//   - Assigned: 할당된 ASID
//   - GPA: Guest Physical Address
//   - Hypervisor: H/G mode
//   - Validated: 유효성 비트
//
//   하이퍼바이저가 mapping 변경 시
//   → RMP 체크
//   → 불일치 → #VC 예외`}
        </pre>
      </div>
    </section>
  );
}
