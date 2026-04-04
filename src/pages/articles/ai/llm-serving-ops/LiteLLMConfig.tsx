import CodePanel from '@/components/ui/code-panel';
import CodeSidebar from './CodeSidebar';
import { routingStrategyRef, routerCompletionRef } from './codeRefs';

const CONFIG_YAML = `model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
  - model_name: gpt-4o
    litellm_params:
      model: anthropic/claude-sonnet-4-20250514
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: llama-70b
    litellm_params:
      model: openai/meta-llama/Llama-3-70B
      api_base: http://vllm-svc:8000/v1

router_settings:
  routing_strategy: usage-based-routing
  redis_host: redis-svc
  num_retries: 3
  timeout: 120`;

export default function LiteLLMConfig() {
  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3">
        <h3 className="text-xl font-semibold">모델 라우팅 설정</h3>
        <CodeSidebar refs={[routingStrategyRef, routerCompletionRef]}
          trigger={
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono
              border border-border/50 rounded hover:bg-accent cursor-pointer text-foreground/60">
              {'</>'} routing_strategy_init()
            </span>
          }
        />
      </div>
      <CodePanel title="litellm_config.yaml" code={CONFIG_YAML}
        annotations={[
          { lines: [1, 11], color: 'sky', note: 'model_list — 동일 model_name에 여러 프로바이더 매핑' },
          { lines: [12, 15], color: 'emerald', note: 'self-hosted vLLM을 OpenAI 포맷으로 프록시' },
          { lines: [17, 21], color: 'amber', note: 'usage-based-routing — 사용량 기반 자동 분배' },
        ]}
      />
      <p className="mt-2 text-xs text-foreground/70">
        같은 model_name에 여러 프로바이더를 등록하면 자동 로드밸런싱 —
        routing_strategy로 분배 정책 결정.{' '}
        <code>routing_strategy_init()</code>에서 전략별 CustomLogger를 콜백에 등록
      </p>
    </>
  );
}
