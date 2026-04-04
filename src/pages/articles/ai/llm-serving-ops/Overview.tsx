import { CitationBlock } from '@/components/ui/citation';
import InfraStackViz from './viz/InfraStackViz';
import CodeSidebar from './CodeSidebar';
import { proxyHandlerRef, routerInitRef } from './codeRefs';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">LLM 서빙 인프라 개요</h2>
        <CodeSidebar refs={[proxyHandlerRef, routerInitRef]} />
      </div>
      <div className="not-prose mb-8"><InfraStackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 서빙의 핵심 과제 — <strong>GPU 비용 최적화</strong>, <strong>멀티모델 관리</strong>,
          <strong>가용성 보장</strong>, <strong>관측성 확보</strong><br />
          단일 모델 서빙은 vLLM이 해결하지만,
          프로덕션 환경에서는 여러 모델을 동시에 운영하면서 비용·성능·안정성을 모두 관리해야 함
        </p>

        <CitationBlock source="LiteLLM Docs — Overview" citeKey={1} type="paper"
          href="https://docs.litellm.ai/">
          <p className="italic">
            "Call 100+ LLMs using the same Input/Output Format.
            LiteLLM manages: translating inputs, logging, cost tracking, and retries/fallbacks."
          </p>
          <p className="mt-2 text-xs">
            LiteLLM — OpenAI-compatible 통합 게이트웨이로
            멀티 프로바이더 라우팅·폴백·비용추적 제공
          </p>
        </CitationBlock>

        <p>
          이 글에서 다루는 인프라 스택:<br />
          <strong>LiteLLM</strong> — 통합 API 게이트웨이 (라우팅·폴백·비용추적)<br />
          <strong>Kubernetes</strong> — GPU Fleet 오케스트레이션 (스케줄링·오토스케일링)<br />
          <strong>Prometheus + Grafana</strong> — 관측성 파이프라인 (메트릭·대시보드·알럿)<br />
          <strong>AIOps</strong> — 자동화 대응 (스케일링·폴백 트리거)
        </p>
      </div>
    </section>
  );
}
