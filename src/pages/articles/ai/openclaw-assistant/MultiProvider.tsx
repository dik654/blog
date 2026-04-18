import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function MultiProvider({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">멀티 프로바이더 & 페일오버</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-model-auth', codeRefs['oc-model-auth'])} />
          <span className="text-[10px] text-muted-foreground self-center">model-auth.ts</span>
        </div>
      )}

      <div className="not-prose rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">Auth Profile 시스템</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">4개 프로바이더 동시 지원</span>
            <ul className="text-sm mt-2 space-y-1">
              <li><strong>Profile 1</strong> — OpenAI GPT-4o (API 키)</li>
              <li><strong>Profile 2</strong> — Anthropic Claude (OAuth)</li>
              <li><strong>Profile 3</strong> — Google Gemini (API 키)</li>
              <li><strong>Profile 4</strong> — Ollama (로컬, 무료)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">자동 페일오버</span>
            <p className="text-sm mt-1">primary: anthropic/claude-opus-4-6</p>
            <p className="text-sm">fallbacks: claude-sonnet-4-5 → gpt-5 → gemini-2-pro</p>
            <p className="text-xs text-muted-foreground mt-1">Rate limit, 장애, 타임아웃 시 자동으로 다음 모델 시도. channels.modelByChannel로 채널별 모델 지정 가능</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">쿨다운 관리</span>
            <p className="text-sm mt-1">실패한 프로파일은 일정 시간 쿨다운 → 자동 만료 후 재활성화</p>
            <p className="text-xs text-muted-foreground mt-1">무한 재시도 방지</p>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
            <span className="text-xs font-semibold">프로바이더별 인증</span>
            <ul className="text-xs mt-1 space-y-0.5 text-muted-foreground">
              <li>Anthropic — API 키 인증 (권장)</li>
              <li>OpenAI — OPENAI_API_KEY 환경 변수</li>
              <li>Gemini — 키 로테이션 + Google CLI 로그인</li>
              <li>Ollama — 자동 감지 (127.0.0.1:11434/v1)</li>
            </ul>
          </div>
        </div>
      </div>

      <CitationBlock source="OpenClaw — 프로바이더 설정 & 모델 카탈로그" citeKey={3} type="code"
        href="https://github.com/openclaw/openclaw">
        <div className="not-prose rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">프로바이더 설정 예시</span>
          <pre className="text-xs mt-2 overflow-x-auto">{`// openclaw.json (JSON5)
{
  "model": {
    "primary": "anthropic/claude-opus-4-6",
    "fallbacks": [
      "anthropic/claude-sonnet-4-5",
      "openai/gpt-5",
      "google/gemini-2-pro"
    ]
  }
}`}</pre>
          <p className="text-xs text-muted-foreground mt-2">Model Catalog: 각 프로바이더의 사용 가능 모델 자동 발견. 확장 카탈로그: GLM-5, MiniMax M2.5, Kimi K2.5, Grok 등</p>
        </div>
        <p className="mt-2 text-xs">
          Auth Profile 시스템으로 여러 AI 프로바이더 동시 지원.
          Rate limit/장애/타임아웃 시 자동 페일오버로 다음 모델 시도,
          channels.modelByChannel로 채널별 모델 지정 가능.
          실패 프로파일은 쿨다운 후 자동 재활성화
        </p>
      </CitationBlock>
    </>
  );
}
