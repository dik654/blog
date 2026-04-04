import BroadcasterViz from './viz/BroadcasterViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BroadcasterTrait({ onCodeRef }: Props) {
  return (
    <section id="broadcaster-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Broadcaster Trait & Buffered Engine</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Broadcaster</code> trait — 메시지 전파의 최소 인터페이스
          <br />
          세 연관 타입: <code>Recipients</code>(수신 대상) · <code>Message: Codec</code>(직렬화) · <code>Response</code>(결과)
          <br />
          broadcast() → <code>oneshot::Receiver&lt;Response&gt;</code>로 비동기 결과 수신
        </p>
        <p className="leading-7">
          <strong>buffered::Engine</strong> — 실제 네트워크 처리 엔진
          <br />
          <code>select_loop!</code>으로 mailbox + network + peer 변경 동시 처리
          <br />
          피어별 <code>VecDeque</code>(LRU) + 전역 <code>BTreeMap</code>(items) + refcount로 메모리 관리
        </p>
        <p className="leading-7">
          <strong>Mailbox</strong>가 <code>Broadcaster</code> trait을 구현 — 외부 소비자는 trait만 의존
        </p>
      </div>
      <div className="not-prose mb-8">
        <BroadcasterViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
