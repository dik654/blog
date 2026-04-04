import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import DistributedViz from './viz/DistributedViz';

export default function DistributedInference() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">분산 추론</h3>
      <div className="not-prose mb-6"><DistributedViz /></div>

      <CodePanel title="vLLM 성능 요약" code={`성능 요약:
  HuggingFace 대비: 최대 24x 처리량 향상
  V1 vs V0:         ~1.7x 처리량 향상
  CUDA Graphs:      Decode 지연 ~30% 감소
  EAGLE 추측 디코딩: 최대 2.5x 가속`} annotations={[
        { lines: [2, 2], color: 'emerald', note: 'HuggingFace 대비 24배 향상' },
        { lines: [3, 3], color: 'sky', note: 'V1 아키텍처 성능 향상' },
      ]} />

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
