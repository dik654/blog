import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import AgentLoopViz from './viz/AgentLoopViz';
import {agentLoopCode} from './OverviewData';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Claude Code 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Claude Code(Anthropic) — 터미널에서 동작하는 <strong>에이전틱 코딩 도구</strong><br />
          코드베이스를 이해하고 자연어 명령으로 코드 작성/수정, 테스트 실행, Git 워크플로우를 자율 수행<br />
          핵심은 <strong>LLM + Tool Use 루프</strong>로 동작하는 에이전트 아키텍처
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">에이전트 루프</h3>
        <p>
          Claude Code 에이전트 루프:<br />
          사용자 입력<br />
          → Claude API 호출 (메시지 + 도구 정의)<br />
          Claude 응답 분석<br />
          텍스트 응답? → 사용자에게 출력 → 대기<br />
          도구 호출? → 권한 확인 → 도구 실행 → 결과를 메시지에 추가<br />
          (다시 Claude API 호출)<br />
          핵심 특성:<br />
          1. 자율적 다단계 실행: 평균 21.2회 독립 도구 호출/요청<br />
          2. 컨텍스트 윈도우: ~200K 토큰 (시스템 오버헤드 후 ~160-170K 사용 가능)<br />
          3. 병렬 도구 호출: 독립적인 도구는 동시에 실행 가능<br />
          4. 서브에이전트: 최대 7개 동시 실행 (각각 독립 200K 컨텍스트)
        </p>
        <AgentLoopViz />
        <div className="flex gap-2 mt-2">
          <CodeViewButton onClick={() => onCodeRef('agent-0', codeRefs['agent-0'])} />
          <span className="text-[10px] text-muted-foreground self-center">sweep.ts — GitHub API 래퍼 (에이전트 워크플로우 예시)</span>
        </div>
        <CitationBlock source="Claude Code 시스템 프롬프트 (공개)" citeKey={1} type="paper">
          <p className="italic">"You are Claude Code, Anthropic's official CLI for Claude... You are an interactive agent that helps users with software engineering tasks. Use the instructions below and the tools available to you to assist the user."</p>
          <p className="mt-2 text-xs">공개 시스템 프롬프트에서 발췌. 평균 21.2회 도구 호출/요청, ~200K 토큰 컨텍스트 윈도우(오버헤드 후 ~160-170K 사용 가능), 서브에이전트 최대 7개 동시 실행 등 공식 문서 기반 수치</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">다른 코딩 AI와의 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">특성</th>
                <th className="border border-border px-4 py-2 text-left">Claude Code</th>
                <th className="border border-border px-4 py-2 text-left">GitHub Copilot</th>
                <th className="border border-border px-4 py-2 text-left">Cursor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">실행 환경</td>
                <td className="border border-border px-4 py-2">터미널 (CLI)</td>
                <td className="border border-border px-4 py-2">IDE 확장</td>
                <td className="border border-border px-4 py-2">전용 IDE</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">에이전트 모드</td>
                <td className="border border-border px-4 py-2">네이티브 (항상)</td>
                <td className="border border-border px-4 py-2">Copilot Agent</td>
                <td className="border border-border px-4 py-2">Composer Agent</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">셸 실행</td>
                <td className="border border-border px-4 py-2">네이티브 Bash</td>
                <td className="border border-border px-4 py-2">제한적</td>
                <td className="border border-border px-4 py-2">터미널 통합</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">서브에이전트</td>
                <td className="border border-border px-4 py-2">다중 병렬</td>
                <td className="border border-border px-4 py-2">없음</td>
                <td className="border border-border px-4 py-2">없음</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">MCP 지원</td>
                <td className="border border-border px-4 py-2">네이티브</td>
                <td className="border border-border px-4 py-2">제한적</td>
                <td className="border border-border px-4 py-2">제한적</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
