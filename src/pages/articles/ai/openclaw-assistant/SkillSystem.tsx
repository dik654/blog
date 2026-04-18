import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SkillSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">스킬 시스템</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-skill-engine', codeRefs['oc-skill-engine'])} />
          <span className="text-[10px] text-muted-foreground self-center">skill-engine.ts</span>
        </div>
      )}

      <div className="not-prose mb-4">
        <p className="text-sm font-semibold mb-3">스킬 = OpenClaw의 플러그인 시스템</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {[
            'coding-agent', 'github', 'notion', 'obsidian', 'spotify-player',
            'weather', 'slack', 'openai-whisper', 'openai-image-gen', 'canvas',
          ].map((skill) => (
            <div key={skill} className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-center">
              <p className="text-xs font-mono">{skill}</p>
            </div>
          ))}
        </div>
      </div>

      <CitationBlock source="ClawHub — 커뮤니티 스킬 레지스트리" citeKey={4} type="code"
        href="https://github.com/openclaw/clawhub">
        <div className="not-prose">
          <p className="text-sm font-semibold mb-3">SKILL.md 형식 &amp; ClawHub</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">SKILL.md (유일한 필수 파일)</p>
              <p className="text-sm">YAML frontmatter + 마크다운 지침</p>
              <div className="mt-2 rounded-md bg-white/60 dark:bg-black/20 p-2 text-xs font-mono leading-relaxed">
                <p>---</p>
                <p>name: github-review</p>
                <p>version: 1.0.0</p>
                <p>requirements: [gh CLI]</p>
                <p>---</p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">ClawHub 레지스트리</p>
              <p className="text-sm">13,729+ 커뮤니티 스킬</p>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p><code>openclaw skills install &lt;name&gt;</code></p>
                <p><code>openclaw skills search &lt;keyword&gt;</code></p>
                <p>동적 로드 — 설치 후 재시작 없이 다음 턴부터 사용</p>
                <p>VirusTotal 연동 스킬 스캐닝 (보안)</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">시스템 프롬프트 통합</p>
            <p className="text-sm">적격 스킬이 XML 목록으로 시스템 프롬프트에 주입 — 스킬당 ~24 토큰</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          SKILL.md — YAML frontmatter + 마크다운 지침으로 구성된 선언적 스킬 포맷.
          ClawHub 등록 13,729+ 스킬은 동적 로드 지원으로 설치 즉시 사용 가능하며,
          적격 스킬이 시스템 프롬프트에 XML 목록으로 주입 (스킬당 ~24 토큰)
        </p>
      </CitationBlock>
    </>
  );
}
