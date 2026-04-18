import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import PermissionModeViz from './viz/PermissionModeViz';
import IDEIntegration from './IDEIntegration';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ToolsPermissions({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tools-permissions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구 시스템 & 권한 모델</h2>
      <div className="not-prose mb-8"><PermissionModeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">내장 도구</h3>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
          <h4 className="text-sm font-bold mb-3">Claude Code 도구 카탈로그</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">파일 시스템 도구 5종</span>
              <ul className="text-sm mt-1 space-y-0.5">
                <li><strong>Read</strong> — 파일 읽기 (이미지, PDF, Jupyter 지원)</li>
                <li><strong>Write</strong> — 파일 생성/덮어쓰기</li>
                <li><strong>Edit</strong> — 정확한 문자열 치환으로 파일 수정</li>
                <li><strong>Glob</strong> — 파일 패턴 검색 (**/*.tsx 등)</li>
                <li><strong>Grep</strong> — ripgrep 기반 코드 내용 검색</li>
              </ul>
            </div>
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">실행 도구</span>
              <ul className="text-sm mt-1 space-y-0.5">
                <li><strong>Bash</strong> — 셸 명령 실행 (빌드, 테스트, git 등)</li>
                <li><strong>NotebookEdit</strong> — Jupyter 노트북 셀 편집</li>
              </ul>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block mt-3">연구 도구</span>
              <ul className="text-sm mt-1 space-y-0.5">
                <li><strong>WebSearch</strong> — 웹 검색</li>
                <li><strong>WebFetch</strong> — URL 내용 가져오기 & AI 처리</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">협업 도구</span>
              <ul className="text-sm mt-1 space-y-0.5">
                <li><strong>Agent</strong> — 서브에이전트 실행</li>
                <li><strong>TodoWrite</strong> — 작업 목록 관리</li>
                <li><strong>AskUserQuestion</strong> — 사용자에게 질문</li>
              </ul>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
              <span className="text-xs font-semibold">확장 도구</span>
              <ul className="text-sm mt-1 space-y-0.5">
                <li><strong>Skill</strong> — 슬래시 명령 실행 (/commit, /review-pr 등)</li>
                <li><strong>MCP 도구</strong> — MCP 서버에서 제공하는 도구</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">권한 모델</h3>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
          <h4 className="text-sm font-bold mb-3">3단계 권한 모드</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">1. Ask (기본)</span>
              <p className="text-sm mt-1">모든 도구 호출에 사용자 승인 필요</p>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
              <span className="text-xs font-semibold">2. Auto-Allow</span>
              <p className="text-sm mt-1">지정된 도구만 자동 허용, 나머지는 승인 필요</p>
            </div>
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">3. YOLO (자동)</span>
              <p className="text-sm mt-1">대부분 도구를 자동 허용</p>
              <p className="text-xs text-muted-foreground mt-1">파괴적 명령에 대한 최소 안전장치 유지</p>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">OS 수준 샌드박싱</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <p className="text-sm"><strong>macOS</strong> — Seatbelt (v1.0.20부터 기본 활성화)</p>
              <p className="text-sm"><strong>Linux</strong> — bubblewrap (bwrap) 기반 격리</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">샌드박싱으로 권한 프롬프트 84% 감소</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <CodeViewButton onClick={() => onCodeRef('permissions-0', codeRefs['permissions-0'])} />
          <span className="text-[10px] text-muted-foreground self-center">엔터프라이즈 strict 설정</span>
          <CodeViewButton onClick={() => onCodeRef('permissions-1', codeRefs['permissions-1'])} />
          <span className="text-[10px] text-muted-foreground self-center">규칙 매칭 엔진</span>
        </div>
        <CitationBlock source="Anthropic 보안 문서 - Sandboxing" citeKey={4} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/security">
          <p className="italic">"Claude Code uses OS-level sandboxing (Seatbelt on macOS, bubblewrap on Linux) to restrict file system access and network access."</p>
          <p className="mt-2 text-xs">v1.0.20부터 macOS Seatbelt 샌드박싱 기본 활성화, Linux에서는 bubblewrap(bwrap) 기반 격리 사용</p>
        </CitationBlock>
        <CitationBlock source="Anthropic 보안 문서 - 프롬프트 인젝션 방어" citeKey={5} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/security">
          <p className="italic">"With Plan mode + Deny rules + OS-level sandboxing, Claude Code achieves a 98% defense rate against prompt injection attacks."</p>
          <p className="mt-2 text-xs">Plan 모드 + Deny 규칙 + OS 샌드박싱의 3중 방어로 프롬프트 인젝션 98% 방어율 달성</p>
        </CitationBlock>
        <IDEIntegration />
      </div>
    </section>
  );
}
