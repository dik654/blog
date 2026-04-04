import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import VLLMProcessViz from './viz/VLLMProcessViz';
import RequestLifecycleViz from './viz/RequestLifecycleViz';
import V1Architecture from './V1Architecture';
import CodeSidebar from './CodeSidebar';
import { overviewRefs } from './codeRefs';
import { sharedCodeRefs } from './sharedCodeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">vLLM 개요</h2>
        <div className="flex gap-2">
          <CodeViewButton onClick={() => onCodeRef('engine-core', sharedCodeRefs['engine-core'])} />
          <CodeViewButton onClick={() => onCodeRef('engine-step', sharedCodeRefs['engine-step'])} />
          <CodeSidebar refs={overviewRefs} />
        </div>
      </div>
      <div className="not-prose mb-8"><VLLMProcessViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          vLLM(UC Berkeley Sky Lab) — LLM 추론 및 서빙을 위한 <strong>고성능 엔진</strong><br />
          핵심 혁신: <strong>PagedAttention</strong>으로 KV 캐시(Key-Value Cache, 이전 토큰의 어텐션 연산 결과를 저장한 메모리)를 OS의 가상 메모리처럼 관리<br />
          기존 서빙 대비 처리량 2~4배 향상
        </p>

        <CitationBlock source="Kwon et al., SOSP 2023 — Abstract" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2309.06180">
          <p className="italic">
            "We propose PagedAttention, an attention algorithm inspired by the classical virtual memory
            and paging techniques in operating systems. On top of this, we build vLLM, an LLM serving
            system that achieves (1) near-zero waste in KV cache memory and (2) flexible sharing of
            KV cache within and across requests to further reduce memory usage."
          </p>
          <p className="mt-2 text-xs">
            PagedAttention 논문의 핵심 기여 — OS 가상 메모리 기법을
            KV 캐시 관리에 적용한 최초의 연구 (SOSP 2023)
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">요청 처리 흐름</h3>
      </div>
      <div className="not-prose mb-6">
        <RequestLifecycleViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CitationBlock source="PagedAttention 논문 §2.2 — Memory Waste" citeKey={2} type="paper">
          <p className="italic">
            "Existing systems waste 60%-80% of the KV cache memory due to fragmentation and
            over-reservation. In contrast, PagedAttention reduces the waste to under 4%."
          </p>
          <p className="mt-2 text-xs">
            기존 시스템의 사전 할당 방식 — 최대 시퀀스 길이 기준 메모리 예약으로
            실제 사용량과 큰 차이 발생. vLLM은 블록 단위 동적 할당으로 해결
          </p>
        </CitationBlock>

        <V1Architecture />
      </div>
    </section>
  );
}
