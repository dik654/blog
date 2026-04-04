import ReactorViz from './viz/ReactorViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Reactor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="reactor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reactor 패턴 (메시지 디스패치)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Reactor — Receive(Envelope)로 메시지 수신, AddPeer()/RemovePeer()로 피어 이벤트 처리.<br />
        아래 step에서 Send/TrySend 전송 경로와 recvRoutine 콜백 실행 모델을 추적한다.
      </p>
      <div className="not-prose"><ReactorViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
        <strong>💡</strong> onReceive 콜백이 recvRoutine 고루틴 안에서 동기 실행.
        Receive()가 오래 걸리면 해당 피어 수신이 블로킹되므로,
        실제 ConsensusReactor는 내부 채널에 넣고 즉시 반환한다.
      </p>
    </section>
  );
}
