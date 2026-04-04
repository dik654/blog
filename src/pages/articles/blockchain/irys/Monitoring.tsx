import CodePanel from '@/components/ui/code-panel';
import MonitoringViz from './viz/MonitoringViz';
import {
  loggingCode, loggingAnnotations,
  metricsCode, metricsAnnotations,
} from './MonitoringData';

export default function Monitoring({ title }: { title?: string }) {
  return (
    <section id="monitoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '모니터링 & 메트릭'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys 노드는 Rust <code>tracing</code> 크레이트로 구조화 로깅을 제공하며,
          VDF 성능, 블록체인 상태, P2P 연결 등 핵심 메트릭을
          내장 수집합니다. Prometheus + Grafana로 대시보드를
          구성하고 Alertmanager로 이상 알림을 전송할 수 있습니다.
        </p>
      </div>

      <MonitoringViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>구조화 로깅 설정</h3>
        <CodePanel title="tracing + 환경 변수 제어" code={loggingCode}
          annotations={loggingAnnotations} />

        <h3>내장 메트릭 & 로그 파일</h3>
        <CodePanel title="VDF / Chain 메트릭 구조체" code={metricsCode}
          annotations={metricsAnnotations} />
      </div>
    </section>
  );
}
