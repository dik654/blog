import type { CodeRef } from '@/components/code/types';
import BroadcasterViz from './viz/BroadcasterViz';

export default function Broadcaster({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="broadcaster" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Broadcaster — Waku P2P</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ZK 증명으로 금액과 수신자를 숨겨도, 직접 TX를 제출하면 msg.sender가 노출된다.
          <br />
          RAILGUN은 <strong>Broadcaster(릴레이어)</strong>로 이 문제를 해결한다.
        </p>
        <p className="leading-7">
          사용자는 TX를 AES-256-GCM으로 암호화한 뒤, <strong>Waku</strong> P2P 네트워크에 발행한다.
          <br />
          Broadcaster가 이를 수신하고, 자신의 EOA로 온체인에 제출한다.
        </p>
        <p className="leading-7">
          결과: <code>msg.sender = Broadcaster</code>. 실제 사용자 주소는 온체인에 나타나지 않는다.
          <br />
          Broadcaster는 수수료(fee)로 보상받는다. 누구나 Broadcaster가 될 수 있다.
        </p>
      </div>
      <div className="not-prose"><BroadcasterViz /></div>
    </section>
  );
}
