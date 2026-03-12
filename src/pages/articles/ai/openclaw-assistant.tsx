import Overview from './openclaw-assistant/Overview';
import PiIntegration from './openclaw-assistant/PiIntegration';
import ChannelSkills from './openclaw-assistant/ChannelSkills';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[OpenClaw GitHub]</strong> github.com/openclaw/openclaw
            — Gateway 아키텍처 (server.impl.ts ~1100줄), 채널 시스템, 샌드박스 모드
          </li>
          <li>
            <strong>[OpenClaw 공식 문서]</strong> docs.openclaw.ai
            — 채널 설정, 스킬 시스템, 서브에이전트 관리, 샌드박스 설정
          </li>
          <li>
            <strong>[OpenClaw DeepWiki]</strong> deepwiki.com/openclaw/openclaw
            — Pi SDK 통합, 에이전트 세션 라이프사이클, 컴팩션, 멀티에이전트 라우팅
          </li>
          <li>
            <strong>[Pi SDK npm]</strong> npmjs.com/package/@mariozechner/pi-coding-agent
            — createAgentSession, SessionManager, 도구 어댑터 레이어
          </li>
          <li>
            <strong>[Pi 아키텍처 분석]</strong> Armin Ronacher, &quot;Pi: The Minimal Agent Within OpenClaw&quot;, lucumr.pocoo.org 2026/1
            — Pi SDK 3계층 구조 (pi-ai → pi-agent-core → pi-coding-agent)
          </li>
          <li>
            <strong>[ClawHub]</strong> github.com/openclaw/clawhub — 커뮤니티 스킬 레지스트리 (13,729+ 스킬)
          </li>
          <li>
            <strong>[Docker 샌드박스]</strong> docker.com/blog/run-openclaw-securely-in-docker-sandboxes
            — fail-closed 설계, 컨테이너 수명 관리, network:none 기본값
          </li>
          <li>
            <strong>[서브에이전트 설계]</strong> github.com/openclaw/openclaw/issues/17511
            — maxSpawnDepth, 깊이별 도구 접근 정책, 캐스케이드 중단
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function OpenClawAssistantArticle() {
  return (
    <>
      <Overview />
      <PiIntegration />
      <ChannelSkills />
      <References />
    </>
  );
}
