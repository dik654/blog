import { CitationBlock } from '../../../../components/ui/citation';
import GatewayViz from './viz/GatewayViz';
import ComparisonTable from './ComparisonTable';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenClaw 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OpenClaw — <strong>개인용 AI 어시스턴트</strong> 오픈소스 프로젝트<br />
          WhatsApp, Telegram, Slack, Discord 등 다양한 메시징 채널에서 동일한 AI 어시스턴트 사용 가능<br />
          핵심 AI 엔진으로 <strong>Pi Coding Agent SDK</strong>를 임베드 — 에이전틱 기능(코드 실행, 파일 편집, 웹 검색 등) 제공<br />
          <strong>단일 Node.js 프로세스(Gateway)</strong>로 동작 — 서비스 메시나 메시지 브로커 불필요
        </p>
        <p>
          핵심 철학: <em>&quot;에이전트 루프 자체는 어렵지 않다.<br />
          채널 정규화, 세션 관리, 메모리 영속성, 스킬 확장성, 보안이 진짜 어려운 문제다.&quot;</em>
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('oc-channel-router', codeRefs['oc-channel-router'])} />
            <span className="text-[10px] text-muted-foreground self-center">channel-router.ts</span>
            <CodeViewButton onClick={() => onCodeRef('oc-embedded-runner', codeRefs['oc-embedded-runner'])} />
            <span className="text-[10px] text-muted-foreground self-center">pi-embedded-runner.ts</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">메시지 처리 흐름</h3>
        <GatewayViz />

        <CitationBlock source="OpenClaw GitHub — Gateway Architecture" citeKey={1} type="code"
          href="https://github.com/openclaw/openclaw">
          <div className="not-prose">
            <p className="text-sm font-semibold mb-3">Gateway WebSocket 바인딩</p>
            <p className="text-sm text-muted-foreground mb-4">바인딩: <code className="text-xs">ws://127.0.0.1:18789</code> (기본)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Operator</p>
                <p className="text-sm">CLI, TUI 클라이언트</p>
                <p className="text-xs text-muted-foreground mt-1">토큰/패스워드 인증</p>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Node</p>
                <p className="text-sm">macOS/iOS 앱</p>
                <p className="text-xs text-muted-foreground mt-1">디바이스 페어링 + JWT</p>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">WebChat</p>
                <p className="text-sm">웹 채팅 클라이언트</p>
                <p className="text-xs text-muted-foreground mt-1">제한된 메서드 접근</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              단일 Gateway 프로세스가 Config Pipeline → Auth &amp; Secrets → Registry &amp; Methods(RPC) 순차 초기화 후
              모든 클라이언트 연결을 하나의 WebSocket 서버에서 처리
            </p>
          </div>
          <p className="mt-2 text-xs">
            OpenClaw Gateway — server.impl.ts (~1,100줄)에 구현된 단일 Node.js 프로세스.
            서비스 메시/메시지 브로커 없이 Config Pipeline → Auth → RPC Registry 순서로 초기화,
            세 종류의 클라이언트(Operator, Node, WebChat)를 각각 다른 인증 방식으로 수용
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">전체 아키텍처</h3>
        <ComparisonTable />
      </div>
    </section>
  );
}
