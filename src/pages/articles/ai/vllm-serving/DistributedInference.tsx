import { CitationBlock } from '../../../../components/ui/citation';
import DistributedViz from './viz/DistributedViz';

export default function DistributedInference() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">분산 추론</h3>
      <div className="not-prose mb-6"><DistributedViz /></div>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-sm">
        {[
          { metric: '24x', label: 'vs HuggingFace', color: '#10b981', desc: '최대 처리량 향상' },
          { metric: '~1.7x', label: 'V1 vs V0', color: '#0ea5e9', desc: '멀티프로세스 아키텍처' },
          { metric: '−30%', label: 'CUDA Graphs', color: '#8b5cf6', desc: 'Decode 지연 감소' },
          { metric: '2.5x', label: 'EAGLE 추측', color: '#f59e0b', desc: '추측 디코딩 가속' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-card px-3 py-3 text-center">
            <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.metric}</div>
            <div className="text-xs font-semibold text-foreground mt-0.5">{item.label}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      <CitationBlock source="vLLM 공식 벤치마크 — V1 성능" citeKey={9} type="paper"
        href="https://docs.vllm.ai">
        <p className="text-xs">
          V1 멀티프로세스 아키텍처 — API Server/EngineCore를 ZeroMQ IPC로 분리하여
          토크나이징/디토크나이징이 모델 실행을 블로킹하지 않음.
          V0 대비 ~1.7x, HuggingFace 대비 최대 24x 처리량 향상
        </p>
      </CitationBlock>
    </>
  );
}
