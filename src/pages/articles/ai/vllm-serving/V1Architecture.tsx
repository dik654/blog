import { CitationBlock } from '../../../../components/ui/citation';
import {
  VLLM_CURRENT_RELEASE,
  VLLM_EXCERPT_SET,
  vllmExcerptUrl,
} from './sourceSnapshot';

const ownership = [
  {
    index: '01',
    owner: 'API Server',
    input: 'HTTP request · text · media',
    work: 'validation · preprocessing · tokenization · response streaming',
    evidence: 'request metadata · queue timing · streamed output',
  },
  {
    index: '02',
    owner: 'EngineCore',
    input: 'tokenized request state',
    work: 'scheduler · KV cache manager · model executor coordination',
    evidence: 'scheduler output · KV allocation result',
  },
  {
    index: '03',
    owner: 'GPU Worker',
    input: 'scheduled token positions · KV mapping',
    work: 'model runner execution on its assigned GPU',
    evidence: 'sampled token · updated model/KV state',
  },
] as const;

export default function V1Architecture() {
  const engineSource = VLLM_EXCERPT_SET['vllm/v1/engine/core.py'];

  return (
    <>
      <h3>V1 멀티프로세스 구조는 “속도 그림”이 아니라 소유권 경계다</h3>
      <p>
        vLLM {VLLM_CURRENT_RELEASE.tag}의 공식 architecture 문서는 API server가 HTTP·input processing·tokenization·streaming을 맡고, ZMQ socket을 통해 EngineCore와 통신한다고 설명한다. EngineCore는 scheduler와 KV 관리, GPU 실행 조정을 소유하며 GPU마다 전용 worker가 model을 실행한다. Data parallelism을 쓰면 rank별 EngineCore와 조건부 coordinator가 추가될 수 있으므로 “항상 프로세스 세 개”라고 외우지 않는다.
      </p>

      <div className="not-prose my-6 divide-y divide-border border-y border-border">
        {ownership.map((item) => (
          <div key={item.owner} className="grid min-w-0 gap-3 py-4 md:grid-cols-[3rem_8rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-black text-blue-700 dark:text-blue-300">{item.index}</span>
            <div>
              <p className="text-sm font-black text-foreground">{item.owner}</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{item.input}</p>
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground">{item.work}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong>확인할 증거:</strong> {item.evidence}</p>
            </div>
          </div>
        ))}
      </div>

      <CitationBlock
        source={`vLLM ${VLLM_CURRENT_RELEASE.tag} 공식 Architecture Overview`}
        citeKey={2}
        type="code"
          href="https://docs.vllm.ai/en/v0.26.0/design/arch_overview/"
      >
        <p>
          현재 동작의 기준은 2026-07-27에 공개된 {VLLM_CURRENT_RELEASE.tag} 문서다. API Server와 EngineCore의 ZMQ 경계, DP rank별 EngineCore, GPU별 worker라는 구성은 이 문서에 근거한다.
        </p>
      </CitationBlock>

      <CitationBlock
        source={`로컬 EngineCore 발췌 · ${engineSource.date} · ${engineSource.commit.slice(0, 12)}`}
        citeKey={3}
        type="code"
        href={vllmExcerptUrl('vllm/v1/engine/core.py')}
      >
        <p>
          로컬 sidebar의 <code>EngineCore.__init__</code>과 <code>EngineCore.step</code>은 이 commit의 함수 흐름을 확인한다. 다른 sidebar 파일은 서로 다른 commit에 고정되어 있으므로, 이 발췌 모음을 하나의 build 가능한 checkout이나 {VLLM_CURRENT_RELEASE.tag} 구현으로 해석하지 않는다.
        </p>
      </CitationBlock>
    </>
  );
}
