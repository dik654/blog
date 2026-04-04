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
      </div>
    </section>
  );
}
