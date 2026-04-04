import DevToolsViz from './viz/DevToolsViz';

export default function DeveloperTools() {
  return (
    <section id="developer-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개발자 도구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis CLI는 Go 언어 기반 <strong>Cobra 프레임워크</strong>로 구현된
          계층적 명령줄 도구입니다.<br />
          네트워크 관리, 지갑 생성, 계정 관리, 스마트 컨트랙트 배포까지 지원합니다.
        </p>

        <h3>CLI 명령어 & 설정 시스템</h3>
      </div>
      <DevToolsViz />
    </section>
  );
}
