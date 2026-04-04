import ASPViz from './viz/ASPViz';
import PSPCommPathViz from './viz/PSPCommPathViz';

export default function ASP() {
  return (
    <section id="asp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AMD Secure Processor (ASP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AMD SP (Platform Security Processor)</strong>는 EPYC CPU 내장
          ARM Cortex-A5 기반 독립 보안 프로세서입니다.<br />
          메인 CPU와 물리적으로 격리된 환경에서 자체 펌웨어를 실행합니다.<br />
          암호화 키 생성/관리, 게스트 런치 승인, 인증서 체인 관리를 담당합니다.
        </p>
      </div>

      <ASPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>PSP 펌웨어 & 통신 경로</h3>
      </div>
      <PSPCommPathViz />
    </section>
  );
}
