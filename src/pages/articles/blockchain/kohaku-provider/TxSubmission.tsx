import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TxSubmissionViz from './viz/TxSubmissionViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TxSubmission({ onCodeRef }: Props) {
  return (
    <section id="tx-submission" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TX 제출: Dandelion++ 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          일반 가십 프로토콜 — TX를 모든 피어에 즉시 전파한다.
          <br />
          관찰자가 "가장 먼저 TX를 전파한 노드 = 발신자"로 추론할 수 있다.
        </p>
        <p className="leading-7">
          Dandelion++ — <strong>Stem</strong>(줄기)과 <strong>Fluff</strong>(꽃)의 2단계 전파.
          <br />
          Stem: 단일 피어로 3~5홉 전달. Fluff: 전체 가십으로 전환.
        </p>
        <p className="leading-7">
          에폭 동안 Stem 피어가 고정되어 경로 안정성을 확보한다.
          <br />
          Fluff 전환 시점이 랜덤이므로 발신 노드를 특정할 수 없다.
        </p>
      </div>
      <div className="not-prose">
        <TxSubmissionViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-dandelion', codeRefs['kh-dandelion'])} />
          <span className="text-[10px] text-muted-foreground">dandelion.rs</span>
        </div>
      </div>
    </section>
  );
}
