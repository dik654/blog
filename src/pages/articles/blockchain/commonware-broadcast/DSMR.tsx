import DSMRViz from './viz/DSMRViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DSMR({ onCodeRef }: Props) {
  return (
    <section id="dsmr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DSMR: Replicate → Sequence → Execute</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 SMR — Replicate · Sequence · Execute가 결합. 가장 느린 단계(합의)가 전체 병목
          <br />
          <strong>Decoupled SMR</strong> — 세 단계를 독립 파이프라인으로 분리
        </p>
        <p className="leading-7">
          <strong>Replicate</strong>(<code>broadcast::buffered::Engine</code>) — ordered_broadcast로 데이터 전파. 합의 불필요
          <br />
          <strong>Sequence</strong>(<code>consensus::simplex</code>) — 시퀀서 tip의 순서만 결정. 소량 데이터(해시)
          <br />
          <strong>Execute</strong>(vm) — 확정된 순서로 트랜잭션 실행
        </p>
        <p className="leading-7">
          핵심: 합의는 tip 순서만 결정 — 실제 데이터 전파량과 디커플링. 처리량이 합의 대역폭에 제한되지 않음
        </p>
      </div>
      <div className="not-prose mb-8">
        <DSMRViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
