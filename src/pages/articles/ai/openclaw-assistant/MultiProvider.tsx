import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import { authProfileCode, authProfileAnnotations } from './MultiProviderData';
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
      <CodePanel title="Auth Profile 시스템" code={authProfileCode} annotations={authProfileAnnotations} />

      <CitationBlock source="OpenClaw — 프로바이더 설정 & 모델 카탈로그" citeKey={3} type="code"
        href="https://github.com/openclaw/openclaw">
        <CodePanel title="프로바이더 설정 예시" code={`// openclaw.json (JSON5)
{
  "model": {
    "primary": "anthropic/claude-opus-4-6",
    "fallbacks": [
      "anthropic/claude-sonnet-4-5",
      "openai/gpt-5",
      "google/gemini-2-pro"
    ]
  }
}

// Model Catalog: 각 프로바이더의 사용 가능 모델 자동 발견
// 확장 카탈로그: GLM-5, MiniMax M2.5, Kimi K2.5, Grok 등`} annotations={[
          { lines: [3, 9], color: 'sky', note: 'primary + fallbacks 설정' },
        ]} />
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
