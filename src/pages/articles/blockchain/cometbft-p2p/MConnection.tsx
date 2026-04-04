import MConnectionViz from './viz/MConnectionViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function MConnection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="mconnection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MConnection 다중화 (채널 프로토콜)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        단일 TCP 위에 N개 채널을 다중화. sendRoutine/recvRoutine 고루틴이 I/O를 전담한다.<br />
        sendRate/recvRate 제한(500KB/s)으로 악의적 피어의 대역폭 독점 공격을 방지한다.
      </p>
      <div className="not-prose"><MConnectionViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
        <strong>💡</strong> selectChannelToGossipOn()의 recentlySent/priority 비율 기반 선택은
        합의 채널(pri=10)이 멤풀(pri=5)보다 항상 우선 전송되도록 보장한다.
      </p>
    </section>
  );
}
