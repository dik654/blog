import { CitationBlock } from '@/components/ui/citation';
import InfraStackViz from './viz/InfraStackViz';
import CodeSidebar from './CodeSidebar';
import { proxyHandlerRef, routerInitRef } from './codeRefs';

const topicLinks = [
  {
    href: '/lab/blog/ai/litellm-gateway',
    title: 'LiteLLM 게이트웨이',
    body: 'OpenAI-compatible proxy, 라우터 초기화, provider fallback, cooldown, 비용 제어를 코드와 함께 분리해서 읽는다.',
  },
  {
    href: '/lab/blog/ai/k8s-gpu-fleet',
    title: 'Kubernetes GPU Fleet',
    body: 'GPU Operator, device plugin, Karpenter 기반 GPU 노드 프로비저닝과 autoscaling 흐름을 따로 본다.',
  },
  {
    href: '/lab/blog/ai/serving-deployment',
    title: '서빙 배포 패턴',
    body: 'vLLM/TGI 배포, 모델 로딩, GPU 메트릭 기반 HPA, 무중단 배포 고려사항을 배포 단위로 정리한다.',
  },
  {
    href: '/lab/blog/ai/observability-aiops',
    title: '관측성 & AIOps',
    body: 'TTFT, TPS, GPU utilization, Prometheus pipeline, 자동 폴백과 스케일링 대응을 운영 루프로 묶는다.',
  },
];

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

        <h3 id="topic-map">주제별 상세 글</h3>
        <p>
          LLM 서빙 운영은 한 글에서 모두 설명하기에는 레이어가 다르다. 이 페이지는 전체 지도로 두고,
          실제 구현과 운영 개념은 아래 글로 나누어 읽는 구조로 정리했다.
        </p>
      </div>
      <div className="not-prose mt-6 grid gap-3 md:grid-cols-2">
        {topicLinks.map((topic) => (
          <a
            key={topic.href}
            href={topic.href}
            className="rounded-lg border bg-background p-4 transition-colors hover:border-foreground/25 hover:bg-accent/30"
          >
            <h3 className="mb-2 text-sm font-semibold">{topic.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{topic.body}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
