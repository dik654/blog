import CodeSidebar from './CodeSidebar';
import { routingStrategyRef, routerCompletionRef } from './codeRefs';

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

      {/* Model List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
          <div className="text-xs font-semibold text-sky-400 mb-2">gpt-4o (OpenAI)</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">모델</span>
              <span className="font-mono text-xs">openai/gpt-4o</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">인증</span>
              <span className="font-mono text-xs">OPENAI_API_KEY</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
          <div className="text-xs font-semibold text-sky-400 mb-2">gpt-4o (Anthropic)</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">모델</span>
              <span className="font-mono text-xs">claude-sonnet-4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">인증</span>
              <span className="font-mono text-xs">ANTHROPIC_API_KEY</span>
            </div>
          </div>
          <p className="text-xs text-foreground/60 mt-1.5">같은 model_name으로 로드밸런싱</p>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs font-semibold text-emerald-400 mb-2">llama-70b (Self-hosted)</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">모델</span>
              <span className="font-mono text-xs">Llama-3-70B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">엔드포인트</span>
              <span className="font-mono text-xs">vllm-svc:8000</span>
            </div>
          </div>
          <p className="text-xs text-foreground/60 mt-1.5">OpenAI 포맷으로 프록시</p>
        </div>
      </div>

      {/* Routing Strategy & Rate Limiting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs font-semibold text-amber-400 mb-2">라우팅 전략</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">전략</span>
              <span className="font-mono text-xs">usage-based-routing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">상태 저장</span>
              <span className="font-mono text-xs">redis-svc</span>
            </div>
          </div>
          <p className="text-xs text-foreground/60 mt-1.5">사용량 기반 자동 분배</p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs font-semibold text-amber-400 mb-2">재시도 & 타임아웃</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">재시도 횟수</span>
              <span className="font-mono text-xs">3회</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">타임아웃</span>
              <span className="font-mono text-xs">120초</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-foreground/70">
        같은 model_name에 여러 프로바이더를 등록하면 자동 로드밸런싱 —
        routing_strategy로 분배 정책 결정.{' '}
        <code>routing_strategy_init()</code>에서 전략별 CustomLogger를 콜백에 등록
      </p>
    </>
  );
}
