import ASPViz from './viz/ASPViz';
import PSPCommPathViz from './viz/PSPCommPathViz';
import ASPHardwareViz from './viz/ASPHardwareViz';
import ASPBootChainViz from './viz/ASPBootChainViz';
import HostASPMailboxViz from './viz/HostASPMailboxViz';
import ASPTCBIssuesViz from './viz/ASPTCBIssuesViz';

export default function ASP() {
  return (
    <section id="asp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AMD Secure Processor (ASP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ASP(AMD Secure Processor)</strong> — 구 이름 PSP(Platform Security Processor)<br />
          EPYC CPU 다이에 내장된 <strong>ARM Cortex-A5</strong> 기반 독립 보안 프로세서<br />
          <strong>자체 펌웨어</strong>(AMD 서명) 실행 — x86 코어와 완전 분리<br />
          SEV의 <strong>모든 암호 연산</strong> 담당 — 키 생성, 서명, VM 인증
        </p>
      </div>

      <ASPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 하드웨어 구성</h3>
      </div>
      <div className="not-prose mb-4"><ASPHardwareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 책임</h3>
        <ul>
          <li><strong>시스템 보안 부팅</strong>: BIOS, kernel 서명 검증 chain</li>
          <li><strong>SEV 펌웨어 실행</strong>: 모든 SEV command 처리</li>
          <li><strong>키 생성·관리</strong>: VM별 AES 키, 인증서 키</li>
          <li><strong>Attestation</strong>: VCEK, SEV Report 서명</li>
          <li><strong>TRNG</strong>: 안전한 무작위성 제공</li>
          <li><strong>fTPM</strong>: firmware TPM 에뮬레이션 (옵션)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 펌웨어 구조</h3>
      </div>
      <div className="not-prose mb-4"><ASPBootChainViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Host ↔ ASP 통신 (Mailbox)</h3>
      </div>
      <div className="not-prose mb-4"><HostASPMailboxViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PSP 펌웨어 & 통신 경로</h3>
      </div>
      <PSPCommPathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP TCB 이슈</h3>
      </div>
      <div className="not-prose mb-4"><ASPTCBIssuesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ASP는 왜 ARM Cortex-A5인가?</p>
          <p>
            <strong>디자인 선택 근거</strong>:<br />
            - x86 코어는 speculative execution 취약 (Spectre 등)<br />
            - A5는 in-order 단순 코어 → side-channel 공격 표면 작음<br />
            - 독립 ISA → x86 exploit 재활용 불가
          </p>
          <p className="mt-2">
            <strong>TCB 크기 고려</strong>:<br />
            - ASP firmware ~512KB<br />
            - 형식 검증 가능 범위<br />
            - TPM/HSM과 비슷한 레벨
          </p>
          <p className="mt-2">
            <strong>Intel ME와 유사</strong>:<br />
            - Intel Management Engine = 별도 Quark/x86 core<br />
            - AMD ASP = Cortex-A5<br />
            - 둘 다 "always-on" 보안 코어<br />
            - 그러나 ASP는 SEV 전용, ME는 광범위한 플랫폼 관리
          </p>
        </div>

      </div>
    </section>
  );
}
