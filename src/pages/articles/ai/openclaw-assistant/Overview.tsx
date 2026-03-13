import { CitationBlock } from '../../../../components/ui/citation';
import GatewayViz from './viz/GatewayViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenClaw 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OpenClaw은 <strong>개인용 AI 어시스턴트</strong> 오픈소스 프로젝트입니다.
          WhatsApp, Telegram, Slack, Discord 등 다양한 메시징 채널에서
          동일한 AI 어시스턴트를 사용할 수 있으며, 자체 디바이스에서 실행됩니다.
          핵심 AI 엔진으로 <strong>Pi Coding Agent SDK</strong>를 임베드하여
          에이전틱 기능(코드 실행, 파일 편집, 웹 검색 등)을 제공합니다.
          전체 시스템은 <strong>단일 Node.js 프로세스(Gateway)</strong>로 동작하며,
          서비스 메시나 메시지 브로커 없이 모든 것을 관리합니다.
        </p>
        <p>
          아키텍처의 핵심 철학: <em>&quot;에이전트 루프 자체는 어렵지 않다.
          채널 정규화, 세션 관리, 메모리 영속성, 스킬 확장성, 보안이 진짜 어려운 문제다.&quot;</em>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">메시지 처리 흐름</h3>
        <GatewayViz />

        <CitationBlock source="OpenClaw GitHub — Gateway Architecture" citeKey={1} type="code"
          href="https://github.com/openclaw/openclaw">
          <pre className="text-xs overflow-x-auto"><code>{`WebSocket 바인딩: ws://127.0.0.1:18789 (기본)

클라이언트 유형:
  Operator (CLI, TUI) — 토큰/패스워드 인증
  Node (macOS/iOS 앱) — 디바이스 페어링 + JWT
  WebChat — 제한된 메서드 접근

단일 Gateway 프로세스가 Config Pipeline, Auth & Secrets,
Registry & Methods(RPC) 를 순차 초기화한 뒤
모든 클라이언트 연결을 하나의 WebSocket 서버에서 처리합니다.`}</code></pre>
          <p className="mt-2 text-xs">
            OpenClaw Gateway는 server.impl.ts (~1,100줄)에 구현된 단일 Node.js 프로세스입니다.
            서비스 메시나 메시지 브로커 없이 Config Pipeline → Auth → RPC Registry 순서로 초기화되며,
            세 종류의 클라이언트(Operator, Node, WebChat)를 각각 다른 인증 방식으로 수용합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">전체 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`OpenClaw 아키텍처:

┌────────────────────────────────────────────────────┐
│                  메시징 채널들                        │
│  WhatsApp │ Telegram │ Slack │ Discord │ iMessage   │
│  Matrix   │ Teams    │ IRC   │ Signal  │ WebChat    │
└──────────────────────┬─────────────────────────────┘
                       │ 메시지 수신/발신
┌──────────────────────┴─────────────────────────────┐
│              OpenClaw Gateway                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Channel Router                               │   │
│  │  → 채널별 메시지 정규화                        │   │
│  │  → 라우팅 (DM, 그룹, 멘션)                    │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Pi Embedded Agent                            │   │
│  │  → createAgentSession() (Pi SDK)             │   │
│  │  → 시스템 프롬프트 커스터마이징                  │   │
│  │  → 도구 실행 (코딩, 파일, 웹 등)               │   │
│  │  → 세션 관리 & 컴팩션                          │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Skills Engine                                │   │
│  │  → 플러그인 시스템 (npm 패키지)                │   │
│  │  → 내장 스킬 + 커뮤니티 스킬                   │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Sandbox (코드 실행)                           │   │
│  │  → Docker/Podman 컨테이너                     │   │
│  │  → 격리된 파일 시스템 & 네트워크               │   │
│  └─────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────┤
│              Model Provider Layer                    │
│  OpenAI │ Anthropic │ Google │ Ollama │ 기타         │
│  → 멀티 프로바이더 지원 & 자동 페일오버              │
└────────────────────────────────────────────────────┘`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Claude Code와의 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">특성</th>
                <th className="border border-border px-4 py-2 text-left">OpenClaw</th>
                <th className="border border-border px-4 py-2 text-left">Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">주 목적</td>
                <td className="border border-border px-4 py-2">개인 AI 어시스턴트 (범용)</td>
                <td className="border border-border px-4 py-2">코딩 에이전트 (전문)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">인터페이스</td>
                <td className="border border-border px-4 py-2">20+ 메시징 채널</td>
                <td className="border border-border px-4 py-2">터미널 CLI</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">AI 엔진</td>
                <td className="border border-border px-4 py-2">Pi SDK (멀티 프로바이더)</td>
                <td className="border border-border px-4 py-2">Claude API (Anthropic 전용)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">호스팅</td>
                <td className="border border-border px-4 py-2">셀프 호스팅 (로컬)</td>
                <td className="border border-border px-4 py-2">로컬 CLI</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">확장성</td>
                <td className="border border-border px-4 py-2">Skills (플러그인)</td>
                <td className="border border-border px-4 py-2">MCP 서버</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
