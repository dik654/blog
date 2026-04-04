import LiteLLMRoutingViz from './viz/LiteLLMRoutingViz';
import LiteLLMConfig from './LiteLLMConfig';
import LiteLLMFallback from './LiteLLMFallback';
import CodeSidebar from './CodeSidebar';
import { proxyHandlerRef, routerInitRef, routerCompletionRef } from './codeRefs';

export default function LiteLLMGateway() {
  return (
    <section id="litellm-gateway" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">LiteLLM 게이트웨이</h2>
        <CodeSidebar refs={[proxyHandlerRef, routerInitRef, routerCompletionRef]} />
      </div>
      <div className="not-prose mb-8"><LiteLLMRoutingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LiteLLM Proxy — OpenAI-compatible API로 100+ LLM 프로바이더를 통합 관리하는 게이트웨이<br />
          모든 클라이언트가 <code>POST /v1/chat/completions</code> 하나로 어떤 모델이든 호출 가능
        </p>
        <LiteLLMConfig />
        <LiteLLMFallback />
      </div>
    </section>
  );
}
