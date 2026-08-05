import { useMemo, useState } from 'react';

type ModelId = 'opus' | 'grok-mini' | 'qwen-plus' | 'kimi' | 'openai/gpt-5' | 'custom-model';
type EnvProfile = 'openai-base-key' | 'anthropic-auth' | 'openai-key' | 'xai-key' | 'openai-base-only' | 'none';
type Route = {
  canonical: string;
  provider: string;
  variant: string;
  config: string;
  auth: string;
  limit: string;
  wireFix: string;
};

const models = [
  { id: 'opus', label: 'opus' },
  { id: 'grok-mini', label: 'grok-mini' },
  { id: 'qwen-plus', label: 'qwen-plus' },
  { id: 'kimi', label: 'kimi' },
  { id: 'openai/gpt-5', label: 'openai/gpt-5' },
  { id: 'custom-model', label: 'custom-model' },
] as const;

const routes: Record<Exclude<ModelId, 'custom-model'>, Route> = {
  opus: {
    canonical: 'claude-opus-4-6',
    provider: 'Anthropic',
    variant: 'ProviderClient::Anthropic',
    config: 'AnthropicClient',
    auth: 'ANTHROPIC_API_KEY and/or ANTHROPIC_AUTH_TOKEN',
    limit: 'Anthropic request path',
    wireFix: 'native Messages API · native SSE',
  },
  'grok-mini': {
    canonical: 'grok-3-mini',
    provider: 'Xai',
    variant: 'ProviderClient::Xai',
    config: 'OpenAiCompatConfig::xai()',
    auth: 'XAI_API_KEY',
    limit: '50 MiB',
    wireFix: 'reasoning model sampling options 제거',
  },
  'qwen-plus': {
    canonical: 'qwen-plus',
    provider: 'OpenAi',
    variant: 'ProviderClient::OpenAi',
    config: 'OpenAiCompatConfig::dashscope()',
    auth: 'DASHSCOPE_API_KEY',
    limit: '6 MiB',
    wireFix: 'DashScope compatible-mode endpoint',
  },
  kimi: {
    canonical: 'kimi-k2.5',
    provider: 'OpenAi',
    variant: 'ProviderClient::OpenAi',
    config: 'OpenAiCompatConfig::dashscope()',
    auth: 'DASHSCOPE_API_KEY',
    limit: '6 MiB',
    wireFix: 'tool result의 is_error 생략',
  },
  'openai/gpt-5': {
    canonical: 'openai/gpt-5',
    provider: 'OpenAi',
    variant: 'ProviderClient::OpenAi',
    config: 'OpenAiCompatConfig::openai()',
    auth: 'OPENAI_API_KEY',
    limit: '100 MiB',
    wireFix: 'prefix 제거 · max_completion_tokens',
  },
};

const customRoutes: Record<EnvProfile, Route> = {
  'openai-base-key': {
    canonical: 'custom-model',
    provider: 'OpenAi',
    variant: 'ProviderClient::OpenAi',
    config: 'OpenAiCompatConfig::openai()',
    auth: 'OPENAI_BASE_URL + OPENAI_API_KEY',
    limit: '100 MiB',
    wireFix: 'custom endpoint가 Anthropic auth보다 먼저 선택됨',
  },
  'anthropic-auth': {
    canonical: 'custom-model',
    provider: 'Anthropic',
    variant: 'ProviderClient::Anthropic',
    config: 'AnthropicClient',
    auth: 'ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN · env only',
    limit: 'Anthropic request path',
    wireFix: 'unknown name이 Anthropic wire로 전달됨',
  },
  'openai-key': {
    canonical: 'custom-model',
    provider: 'OpenAi',
    variant: 'ProviderClient::OpenAi',
    config: 'OpenAiCompatConfig::openai()',
    auth: 'OPENAI_API_KEY',
    limit: '100 MiB',
    wireFix: 'OpenAI key가 XAI key보다 먼저 선택됨',
  },
  'xai-key': {
    canonical: 'custom-model',
    provider: 'Xai',
    variant: 'ProviderClient::Xai',
    config: 'OpenAiCompatConfig::xai()',
    auth: 'XAI_API_KEY',
    limit: '50 MiB',
    wireFix: 'unknown name이 xAI wire로 전달됨',
  },
  'openai-base-only': {
    canonical: 'custom-model',
    provider: 'OpenAi kind',
    variant: 'client construction error',
    config: 'OpenAiCompatConfig::openai()',
    auth: 'OPENAI_BASE_URL only · key 없음',
    limit: 'request 전 실패',
    wireFix: 'kind는 OpenAi지만 from_env가 credential을 요구함',
  },
  none: {
    canonical: 'custom-model',
    provider: 'Anthropic default',
    variant: 'client construction error',
    config: 'AnthropicClient',
    auth: 'credential 없음',
    limit: 'request 전 실패',
    wireFix: 'last-resort kind와 사용 가능한 client는 다름',
  },
};

export default function ProviderContractViz() {
  const [model, setModel] = useState<ModelId>('qwen-plus');
  const [envProfile, setEnvProfile] = useState<EnvProfile>('openai-base-key');
  const route = useMemo(
    () => model === 'custom-model' ? customRoutes[envProfile] : routes[model],
    [envProfile, model],
  );
  const stages = [
    ['INPUT', model],
    ['ALIAS', route.canonical],
    ['KIND', route.provider],
    ['ENUM', route.variant],
    ['CONFIG', route.config],
  ] as const;

  return (
    <div data-provider-contract-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">MODEL ROUTING LAB</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="모델 라우팅 시나리오">
          {models.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={model === item.id}
              onClick={() => setModel(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                model === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {model === 'custom-model' ? (
          <label className="mt-3 grid max-w-sm gap-1.5 text-xs font-semibold">
            unknown model의 environment
            <select
              aria-label="unknown model environment"
              className="min-h-11 rounded-md border border-border bg-background px-3 text-sm"
              value={envProfile}
              onChange={(event) => setEnvProfile(event.target.value as EnvProfile)}
            >
              <option value="openai-base-key">OPENAI_BASE_URL + key</option>
              <option value="anthropic-auth">Anthropic auth</option>
              <option value="openai-key">OpenAI key</option>
              <option value="xai-key">XAI key</option>
              <option value="openai-base-only">OPENAI_BASE_URL only</option>
              <option value="none">credential 없음</option>
            </select>
          </label>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="border-b border-border px-4 py-4 lg:border-b-0 lg:border-r sm:px-5">
          <div className="grid gap-2 sm:grid-cols-5">
            {stages.map(([label, value], index) => (
              <div key={label} className="relative min-w-0 border-l-2 border-border pl-3 py-1 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-3">
                <p className="font-mono text-[9px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')} · {label}</p>
                <p className="mt-1 break-words text-[11px] font-bold leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            같은 <code>OpenAi</code> kind라도 metadata의 auth env가 DashScope를 가리키면
            OpenAI가 아닌 DashScope config를 선택한다.
          </p>
        </div>

        <div data-route-result={model} data-env-profile={envProfile} className="min-w-0 px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold text-muted-foreground">CONCRETE WIRE CONTRACT</p>
          <dl className="mt-3 divide-y divide-border border-y border-border">
            {[
              ['auth', route.auth],
              ['body limit', route.limit],
              ['wire fix', route.wireFix],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
                <dt className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</dt>
                <dd className="min-w-0 break-words text-xs font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
