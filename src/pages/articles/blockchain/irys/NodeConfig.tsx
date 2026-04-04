import CodePanel from '@/components/ui/code-panel';
import NodeConfigViz from './viz/NodeConfigViz';
import {
  CONFIG_CODE, CONFIG_ANNOTATIONS,
  PERFORMANCE_CODE, PERFORMANCE_ANNOTATIONS,
  METRICS_CODE, METRICS_ANNOTATIONS,
} from './NodeConfigData';

export default function NodeConfig({ title }: { title?: string }) {
  return (
    <section id="node-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '노드 설정 & 모니터링'}</h2>
      <div className="not-prose mb-8"><NodeConfigViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys 노드는 TOML 형식 <code>config.toml</code>로 구성됩니다.<br />
          노드 모드, 네트워크, 스토리지, 합의 등 모든 옵션을 설정하며
          Prometheus 통합 모니터링을 지원합니다.
        </p>

        <h3>기본 설정</h3>
        <CodePanel title="config.toml 기본 구조" code={CONFIG_CODE}
          annotations={CONFIG_ANNOTATIONS} />

        <h3>성능 최적화</h3>
        <CodePanel title="패킹, 스토리지, 캐시 튜닝" code={PERFORMANCE_CODE}
          annotations={PERFORMANCE_ANNOTATIONS} />

        <h3>메트릭 & 모니터링</h3>
        <CodePanel title="VDF/Chain/Storage 메트릭 + Prometheus" code={METRICS_CODE}
          annotations={METRICS_ANNOTATIONS} />
      </div>
    </section>
  );
}
