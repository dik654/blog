import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import PermissionModeViz from './viz/PermissionModeViz';
import IDEIntegration from './IDEIntegration';
import { toolCatalogCode, toolCatalogAnnotations, permissionModelCode, permissionAnnotations } from './ToolsPermissionsData';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ToolsPermissions({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tools-permissions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구 시스템 & 권한 모델</h2>
      <div className="not-prose mb-8"><PermissionModeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">내장 도구</h3>
        <CodePanel title="Claude Code 도구 카탈로그" code={toolCatalogCode} annotations={toolCatalogAnnotations} />
        <h3 className="text-xl font-semibold mt-6 mb-3">권한 모델</h3>
        <CodePanel title="3단계 권한 모드" code={permissionModelCode} annotations={permissionAnnotations} />
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
